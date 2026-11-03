#!/usr/bin/env node
/**
 * costos.mjs — dónde se va el gasto, con los números medidos de verdad.
 *
 * Cada notificación de fin de subagente trae `subagent_tokens` y el orquestador
 * los persiste en `modelOutcomes` de `metrics.json`. Eso convierte el gasto en
 * algo medido, no estimado — pero hasta ahora vivía repartido en once archivos
 * y nadie lo sumaba. Esto lo suma y contesta las preguntas que deciden si el
 * ecosistema está gastando bien:
 *
 *   node tools/costos.mjs                      resumen del ecosistema
 *   node tools/costos.mjs fases                cuánto cuesta cada fase por tier
 *   node tools/costos.mjs proyectos            gasto por proyecto y por sesión
 *   node tools/costos.mjs fugas                dónde se está tirando plata
 *   node tools/costos.mjs presupuesto --spawns 5 --modelo sonnet   cuánto costaría
 *
 *   node tools/costos.mjs real [--proyecto <texto>] [--sesion <uuid>] [--desde AAAA-MM-DD] [--top 12]
 *        GASTO REAL leído de las transcripciones de Claude Code (~/.claude/projects): el
 *        `usage` de cada mensaje (entrada, escritura y lectura de caché, salida) por sesión,
 *        flujo y agente, con US$ a precio de API y las marcas de agente inflado.
 *   node tools/costos.mjs vigilar <carpeta> [--agente 40] [--total 400] [--cada 30]
 *        DISPARADOR en vivo para una ola: relee la carpeta del flujo o de la sesión y sale con
 *        código 3 en cuanto un agente pasa de --agente M tokens reales o la carpeta de --total M.
 *        Se lanza en segundo plano junto con la ola; cuando salta, el orquestador decide parar.
 *
 * ⚠ CORRECCIÓN 2026-11-02: `subagent_tokens` (lo que guardan los metrics.json y suman los
 * comandos de arriba) NO es el gasto: es el tamaño del contexto FINAL de cada agente. Cada
 * paso relee todo el contexto, así que el gasto real es 70–110× mayor (Escuadra: 13,3 M
 * anotados contra 1.437 M reales en 36 agentes). Para presupuestar y vigilar: `real`.
 *
 * El consumo INLINE del orquestador no está metrado en este entorno y NUNCA se
 * inventa: todo lo de aquí es gasto de subagente, que es además el único que se
 * puede controlar eligiendo ceremonia y modelo.
 *
 * Cero dependencias.
 */
import { readFileSync, readdirSync, existsSync, statSync, openSync, readSync, closeSync } from "node:fs"
import { homedir } from "node:os"
import { join, resolve, basename, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ORION = process.env.ORION_HOME ?? resolve(dirname(fileURLToPath(import.meta.url)), "..")
/* Misma pareja de raíces que cerebro.mjs y baul.mjs: memory/ del propio ORION más
   prommter/ completo, escaneado (nada de repos listados a mano ni rutas de una
   plataforma). Si prommter/ no existe, el barrido de abajo simplemente lo salta. */
const RAICES = [join(ORION, "memory"), join(ORION, "prommter")]
const ARGV = process.argv.slice(2)
const cmd = ARGV[0] ?? "resumen"
const val = (n, d) => { const i = ARGV.indexOf(`--${n}`); return i >= 0 && ARGV[i + 1] ? ARGV[i + 1] : d }

const k = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(2)} M` : `${Math.round(n / 1000)}k`
const pct = (a, b) => b ? `${((a / b) * 100).toFixed(1)}%` : "—"

function memorias() {
  const out = new Set()
  for (const raiz of RAICES) {
    if (!existsSync(raiz)) continue
    for (const e of readdirSync(raiz)) {
      const d1 = join(raiz, e)
      try { if (statSync(d1).isDirectory() && existsSync(join(d1, "metrics.json"))) out.add(d1) } catch {}
      const mem = join(raiz, e, "memory")
      if (!existsSync(mem)) continue
      for (const s of readdirSync(mem)) {
        const d = join(mem, s)
        try { if (statSync(d).isDirectory() && existsSync(join(d, "metrics.json"))) out.add(d) } catch {}
      }
    }
  }
  return [...out]
}

/* Los nombres de fase se fueron inventando sobre la marcha (`build:api/organizaciones`,
   `build:visual:agencia`, `build:page/perfil-org`…) y eso DILUYE la señal: 40
   subtipos con un dato cada uno no calibran nada. Aquí se normalizan a los
   canónicos para poder leer la tabla; `senal` reporta cuánto se está diluyendo,
   porque el arreglo de fondo es escribirlos bien, no normalizarlos después. */
const BASES = { analyze: "analysis", plan: "planning", verify: "verification", reflect: "reflection" }
const SUBTIPOS = ["visual", "page", "api", "lib", "infra"]
const normalizarBase = (f) => { const b = f.split(/[:/]/)[0]; return BASES[b] ?? b }
function normalizar(fase) {
  const base = normalizarBase(fase)
  if (base !== "build") return base
  const resto = fase.slice(fase.indexOf(":") + 1)
  const encontrado = SUBTIPOS.find((s) => resto.split(/[:/]/)[0] === s)
  return encontrado ? `build:${encontrado}` : "build:(sin subtipo canónico)"
}

/* Una fila = un spawn medido. `infraDeath` marca las muertes por límite de
   sesión, que NO son fallos de capacidad del modelo y por eso se separan
   siempre: mezclarlas infla el tier y lleva a pagar opus donde sonnet bastaba. */
function filas() {
  const out = []
  for (const mdir of memorias()) {
    const proj = basename(mdir)
    let m; try { m = JSON.parse(readFileSync(join(mdir, "metrics.json"), "utf8")) } catch { continue }
    for (const s of m.sessions ?? []) {
      for (const o of s.modelOutcomes ?? []) {
        const tokens = Number(o.tokens ?? 0)
        /* Un `escalate` de 3.000 tokens no falló la tarea: nunca la empezó. Es
           una muerte de sesión aunque nadie la marcara — se reconoce por el
           gasto, y así lo registró el corpus antes de que existiera el campo. */
        const muerte = Boolean(o.infraDeath) || (o.verdict !== "ok" && tokens > 0 && tokens < 10_000)
        const fase = String(o.phase ?? "?")
        out.push({
          proj, sesion: s.sessionId ?? "?", fecha: (s.startedAt ?? s.date ?? "").slice(0, 10),
          fase, base: normalizarBase(fase), sub: normalizar(fase), crudo: fase,
          modelo: String(o.model ?? "?"), verdict: String(o.verdict ?? "?"), tokens, muerte,
        })
      }
    }
  }
  return out
}

/* ─── Gasto REAL (transcripciones) ─────────────────────────────────────────────
   Precios por millón de tokens a precio de API (skill claude-api, 2026-11). La lectura
   de caché cuesta 0,1× la entrada; la escritura 1,25× (caché de 5 min) a 2× (de 1 h): por
   eso el costo sale como rango. Un modelo desconocido se cobra como opus (lo prudente). */
const PRECIOS = { opus: { e: 4, s: 20 }, sonnet: { e: 2, s: 10 }, haiku: { e: 0.1, s: 0.5 } }
const familia = (m = "") => (m.includes("haiku") ? "haiku" : m.includes("sonnet") ? "sonnet" : "opus")
const PROYECTOS = join(homedir(), ".claude", "projects")
const M = (n) => `${(n / 1e6).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`
const usd = (n) => `US$ ${n.toLocaleString("es-CO", { maximumFractionDigits: n < 10 ? 2 : 0 })}`

/* Un archivo .jsonl de transcripción → su gasto. Las líneas de un mismo mensaje se repiten
   mientras se transmite: se cuenta UNA vez por message.id (la última trae el uso final). */
function nuevoAcumulado() { return { usos: new Map(), imgs: 0, modelos: new Map(), offset: 0, resto: "" } }
function leerIncremental(archivo, a) {
  const tam = statSync(archivo).size
  if (tam <= a.offset) return a
  const fd = openSync(archivo, "r")
  const buf = Buffer.alloc(tam - a.offset)
  readSync(fd, buf, 0, buf.length, a.offset); closeSync(fd)
  a.offset = tam
  const lineas = (a.resto + buf.toString("utf8")).split("\n")
  a.resto = lineas.pop()
  for (const l of lineas) {
    if (!l.includes('"usage"') && !l.includes('"image"')) continue
    let e; try { e = JSON.parse(l) } catch { continue }
    const m = e.message
    if (!m || typeof m !== "object") continue
    if (Array.isArray(m.content)) for (const b of m.content)
      if (b?.type === "tool_result" && Array.isArray(b.content)) a.imgs += b.content.filter((x) => x?.type === "image").length
    if (m.usage && m.model !== "<synthetic>") {
      a.usos.set(m.id ?? e.uuid, m.usage)
      a.modelos.set(m.model, (a.modelos.get(m.model) ?? 0) + 1)
    }
  }
  return a
}
function resumirAcumulado(a) {
  let ent = 0, esc = 0, lec = 0, sal = 0, ctx = 0
  for (const u of a.usos.values()) {
    ent += u.input_tokens ?? 0; esc += u.cache_creation_input_tokens ?? 0
    lec += u.cache_read_input_tokens ?? 0; sal += u.output_tokens ?? 0
    ctx = Math.max(ctx, (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0))
  }
  const modelo = [...a.modelos].sort((x, y) => y[1] - x[1])[0]?.[0] ?? "?"
  const p = PRECIOS[familia(modelo)]
  const base = (ent * p.e + lec * p.e * 0.1 + sal * p.s) / 1e6
  return { modelo, pasos: a.usos.size, ctx, imgs: a.imgs, ent, esc, lec, sal, total: ent + esc + lec + sal,
    usdMin: base + (esc * p.e * 1.25) / 1e6, usdMax: base + (esc * p.e * 2) / 1e6 }
}
const gastoDe = (archivo) => resumirAcumulado(leerIncremental(archivo, nuevoAcumulado()))
function etiqueta(archivo) {
  try { return JSON.parse(readFileSync(archivo.replace(/\.jsonl$/, ".meta.json"), "utf8")).description ?? basename(archivo) } catch { return basename(archivo, ".jsonl") }
}
const listar = (dir, f = () => true) => (existsSync(dir) ? readdirSync(dir).filter(f).map((x) => join(dir, x)) : [])
/* Una sesión = <uuid>.jsonl (el orquestador) + <uuid>/subagents/*.jsonl (agentes sueltos)
   + <uuid>/subagents/workflows/<wf>/*.jsonl (cada flujo, con su nombre del guion). */
function sesiones() {
  const out = []
  const desde = val("desde") ? new Date(val("desde")).getTime() : 0
  for (const pdir of listar(PROYECTOS)) {
    if (val("proyecto") && !basename(pdir).includes(val("proyecto"))) continue
    for (const f of listar(pdir, (x) => x.endsWith(".jsonl"))) {
      const id = basename(f, ".jsonl")
      if (val("sesion") && !id.startsWith(val("sesion"))) continue
      if (statSync(f).mtimeMs < desde) continue
      const sdir = join(pdir, id)
      const grupos = [{ nombre: "orquestador", archivos: [f] }]
      const sueltos = listar(join(sdir, "subagents"), (x) => x.endsWith(".jsonl"))
      if (sueltos.length) grupos.push({ nombre: "subagentes", archivos: sueltos })
      const guiones = listar(join(sdir, "workflows", "scripts"))
      for (const w of listar(join(sdir, "subagents", "workflows"))) {
        const g = guiones.find((x) => x.includes(basename(w)))
        grupos.push({ nombre: `flujo ${g ? basename(g).replace(/-wf_.*$/, "") : basename(w)}`, archivos: listar(w, (x) => x.endsWith(".jsonl")) })
      }
      out.push({ proyecto: basename(pdir), id, grupos })
    }
  }
  return out
}
function real() {
  const S = sesiones()
  if (!S.length) { console.log("no encontré transcripciones con ese filtro en " + PROYECTOS); return }
  const agentes = [], porGrupo = [], porModelo = new Map()
  const T = { total: 0, ent: 0, esc: 0, lec: 0, sal: 0, usdMin: 0, usdMax: 0 }
  for (const s of S) for (const g of s.grupos) {
    const fila = { nombre: `${s.id.slice(0, 8)} · ${g.nombre}`, agentes: 0, total: 0, usdMin: 0, usdMax: 0 }
    for (const f of g.archivos) {
      const r = gastoDe(f)
      if (!r.pasos) continue
      fila.agentes++; fila.total += r.total; fila.usdMin += r.usdMin; fila.usdMax += r.usdMax
      for (const k2 of Object.keys(T)) T[k2] += r[k2]
      const fm = familia(r.modelo); const pm = porModelo.get(fm) ?? { n: 0, total: 0, usdMax: 0 }
      pm.n++; pm.total += r.total; pm.usdMax += r.usdMax; porModelo.set(fm, pm)
      if (g.nombre !== "orquestador") agentes.push({ ...r, etiqueta: etiqueta(f), grupo: g.nombre })
    }
    if (fila.agentes) porGrupo.push(fila)
  }
  console.log(`GASTO REAL · ${S.length} sesiones · ${agentes.length} subagentes  (transcripciones de ${PROYECTOS})`)
  console.log(`  total ${M(T.total)} tokens = lectura de caché ${M(T.lec)} (${pct(T.lec, T.total)}) · escritura ${M(T.esc)} · salida ${M(T.sal)} · entrada ${M(T.ent)}`)
  console.log(`  a precio de API ≈ ${usd(T.usdMin)} – ${usd(T.usdMax)}  (escritura de caché a 1,25×–2×)`)
  console.log(`  por modelo: ${[...porModelo].map(([m, x]) => `${m} ${x.n} · ${M(x.total)} · media ${M(x.total / x.n)}`).join("  |  ")}`)
  console.log(`
  por grupo:`)
  for (const g of porGrupo.sort((a, b) => b.total - a.total).slice(0, 20))
    console.log(`    ${g.nombre.padEnd(46)} ${String(g.agentes).padStart(3)} ag  ${M(g.total).padStart(10)}  ${usd(g.usdMin)}–${usd(g.usdMax)}`)
  const top = Number(val("top", "12"))
  console.log(`
  los ${top} agentes más caros  (⚠ = más de 100 pasos, contexto > 300k o > 20 imágenes: partir el encargo)`)
  for (const a of agentes.sort((x, y) => y.total - x.total).slice(0, top)) {
    const marca = a.pasos > 100 || a.ctx > 3e5 || a.imgs > 20 ? "⚠" : " "
    console.log(`  ${marca} ${a.etiqueta.slice(0, 30).padEnd(30)} ${a.grupo.replace(/^flujo /, "").slice(0, 22).padEnd(22)} ${familia(a.modelo).padEnd(6)} ${M(a.total).padStart(9)}  ${usd(a.usdMax).padStart(10)}  ${String(a.pasos).padStart(4)} pasos  ctx ${Math.round(a.ctx / 1000)}k  ${a.imgs} img`)
  }
}
async function vigilar() {
  const dir = ARGV[1]
  if (!dir || !existsSync(dir)) { console.log("uso: costos.mjs vigilar <carpeta de flujo o de sesión> [--agente 40] [--total 400] [--cada 30]"); process.exit(1) }
  const limAg = Number(val("agente", "40")) * 1e6, limTot = Number(val("total", "400")) * 1e6, cada = Number(val("cada", "30")) * 1000
  const acum = new Map()
  const archivos = () => {
    const out = []
    const rec = (d) => { for (const x of listar(d)) { try { if (statSync(x).isDirectory()) rec(x); else if (x.endsWith(".jsonl")) out.push(x) } catch {} } }
    rec(dir); return out
  }
  console.log(`vigilando ${dir} · agente > ${M(limAg)} o total > ${M(limTot)} · cada ${cada / 1000} s`)
  for (;;) {
    let total = 0
    for (const f of archivos()) {
      const a = leerIncremental(f, acum.get(f) ?? nuevoAcumulado()); acum.set(f, a)
      const r = resumirAcumulado(a); total += r.total
      if (r.total > limAg) {
        console.log(`⚠ DISPARADOR: «${etiqueta(f)}» (${familia(r.modelo)}) va en ${M(r.total)} tokens reales (≈ ${usd(r.usdMax)}), ${r.pasos} pasos, contexto ${Math.round(r.ctx / 1000)}k, ${r.imgs} imágenes. Límite por agente ${M(limAg)}.`)
        process.exit(3)
      }
    }
    if (total > limTot) { console.log(`⚠ DISPARADOR: la carpeta va en ${M(total)} tokens reales. Límite total ${M(limTot)}.`); process.exit(3) }
    await new Promise((r) => setTimeout(r, cada))
  }
}
if (cmd === "real") { real(); process.exit(0) }
if (cmd === "vigilar") { await vigilar() }

const F = filas()
const TOTAL = F.reduce((a, x) => a + x.tokens, 0)

function agrupar(F, clave) {
  const g = {}
  for (const x of F) {
    const k2 = clave(x)
    ;(g[k2] ??= { n: 0, tokens: 0, fallos: 0, muertes: 0 })
    g[k2].n++; g[k2].tokens += x.tokens
    if (x.muerte) g[k2].muertes++
    else if (x.verdict !== "ok") g[k2].fallos++
  }
  return g
}

function resumen() {
  const muertes = F.filter((x) => x.muerte)
  const perdido = muertes.reduce((a, x) => a + x.tokens, 0)
  const fallos = F.filter((x) => !x.muerte && x.verdict !== "ok")
  console.log(`GASTO MEDIDO DEL ECOSISTEMA — ${F.length} spawns en ${new Set(F.map((x) => x.proj)).size} proyectos`)
  console.log(`  total                 ${k(TOTAL)} tokens de subagente`)
  console.log(`  media por spawn       ${k(TOTAL / Math.max(F.length, 1))}`)
  console.log(`  muertes de sesión     ${muertes.length} spawns · ${k(perdido)} (${pct(perdido, TOTAL)}) — NO son fallos del modelo`)
  console.log(`  fallos de capacidad   ${fallos.length} spawns (${pct(fallos.length, F.length)} de los spawns)`)
  console.log("")
  const porModelo = agrupar(F, (x) => x.modelo)
  console.log(`  ${"modelo".padEnd(10)}${"spawns".padStart(8)}${"tokens".padStart(10)}${"media".padStart(9)}${"% gasto".padStart(9)}${"fallos".padStart(8)}`)
  for (const [m, g] of Object.entries(porModelo).sort((a, b) => b[1].tokens - a[1].tokens))
    console.log(`  ${m.padEnd(10)}${String(g.n).padStart(8)}${k(g.tokens).padStart(10)}${k(g.tokens / g.n).padStart(9)}${pct(g.tokens, TOTAL).padStart(9)}${String(g.fallos).padStart(8)}`)
  console.log("")
  console.log(`  \`fases\` · \`proyectos\` · \`fugas\` · \`presupuesto\` para el detalle.`)
}

function fases() {
  const bases = [...new Set(F.map((x) => x.base))].sort()
  const modelos = ["haiku", "sonnet", "opus"]
  console.log(`COSTO MEDIO POR SPAWN — media de tokens (spawns medidos entre paréntesis)`)
  console.log(`  ${"fase".padEnd(16)}${modelos.map((m) => m.padStart(16)).join("")}`)
  for (const b of bases) {
    const celdas = modelos.map((m) => {
      const g = F.filter((x) => x.base === b && x.modelo === m && !x.muerte)
      if (!g.length) return "—".padStart(16)
      const media = g.reduce((a, x) => a + x.tokens, 0) / g.length
      return `${k(media)} (${g.length})`.padStart(16)
    })
    console.log(`  ${b.padEnd(16)}${celdas.join("")}`)
  }
  console.log("")
  const sub = [...new Set(F.filter((x) => x.base === "build").map((x) => x.sub))].sort()
  console.log(`SUBTIPOS DE BUILD (normalizados) — por qué no se puede promediar «build» a secas`)
  console.log(`  ${"subtipo".padEnd(30)}${modelos.map((m) => m.padStart(16)).join("")}`)
  for (const s of sub) {
    const celdas = modelos.map((m) => {
      const g = F.filter((x) => x.sub === s && x.modelo === m && !x.muerte && x.tokens > 0)
      if (!g.length) return "—".padStart(16)
      return `${k(g.reduce((a, x) => a + x.tokens, 0) / g.length)} (${g.length})`.padStart(16)
    })
    console.log(`  ${s.padEnd(30)}${celdas.join("")}`)
  }
  console.log(`\n  \`senal\` dice cuánto se está diluyendo la calibración con subtipos inventados.`)
}

/* La calibración solo funciona si el mismo tipo de trabajo se llama siempre
   igual. Esto mide cuánto se ha roto esa regla — y es lo que decide si los
   promedios de arriba se pueden creer. */
function senal() {
  const build = F.filter((x) => x.base === "build")
  const canonicos = build.filter((x) => x.sub !== "build:(sin subtipo canónico)")
  const sueltos = build.filter((x) => x.sub === "build:(sin subtipo canónico)")
  const nombres = {}
  for (const x of sueltos) (nombres[x.crudo] ??= []).push(x)
  console.log(`SEÑAL DE CALIBRACIÓN — ${build.length} spawns de build`)
  console.log(`  con subtipo canónico   ${canonicos.length} (${pct(canonicos.length, build.length)})`)
  console.log(`  con subtipo inventado  ${sueltos.length} (${pct(sueltos.length, build.length)}) repartidos en ${Object.keys(nombres).length} nombres distintos`)
  const unicos = Object.entries(nombres).filter(([, v]) => v.length === 1)
  console.log(`  de esos, ${unicos.length} nombres aparecen UNA sola vez: no calibran nada, solo parten la muestra.\n`)
  console.log(`  Los canónicos son: ${SUBTIPOS.map((s) => `build:${s}`).join(" · ")}`)
  console.log(`  Lo que distingue el proyecto o la pieza va en OTRO campo, nunca en \`phase\`.`)
  console.log(`  Ejemplos a corregir hacia adelante:`)
  for (const [n, v] of Object.entries(nombres).sort((a, b) => b[1].length - a[1].length).slice(0, 6))
    console.log(`    ${n.padEnd(34)} ${v.length}×  → ${normalizar(n.replace(/[:/][^:/]*$/, ":page"))}`)
  const sinTokens = F.filter((x) => x.tokens === 0)
  if (sinTokens.length) console.log(`\n  ${sinTokens.length} spawns registrados con 0 tokens: la medición se perdió ahí (${pct(sinTokens.length, F.length)} de las filas).`)
}

function proyectos() {
  const g = agrupar(F, (x) => x.proj)
  console.log(`GASTO POR PROYECTO`)
  console.log(`  ${"proyecto".padEnd(20)}${"spawns".padStart(8)}${"tokens".padStart(10)}${"media".padStart(9)}${"% total".padStart(9)}${"muertes".padStart(9)}`)
  for (const [p, v] of Object.entries(g).sort((a, b) => b[1].tokens - a[1].tokens))
    console.log(`  ${p.padEnd(20)}${String(v.n).padStart(8)}${k(v.tokens).padStart(10)}${k(v.tokens / v.n).padStart(9)}${pct(v.tokens, TOTAL).padStart(9)}${String(v.muertes).padStart(9)}`)
  console.log("")
  const porSesion = agrupar(F, (x) => `${x.proj}/${x.sesion}`)
  const caras = Object.entries(porSesion).sort((a, b) => b[1].tokens - a[1].tokens).slice(0, 8)
  console.log(`LAS 8 SESIONES MÁS CARAS`)
  for (const [s, v] of caras)
    console.log(`  ${k(v.tokens).padStart(8)}  ${String(v.n).padStart(3)} spawns${v.muertes ? ` · ${v.muertes} muertes` : ""}  ${s}`)
}

/* Las fugas son las tres formas medidas de tirar tokens. Cada una lleva su
   número, porque una recomendación sin cifra no cambia una costumbre. */
function fugas() {
  console.log(`DÓNDE SE ESTÁ TIRANDO GASTO — las tres fugas, medidas\n`)

  const muertes = F.filter((x) => x.muerte)
  const perdido = muertes.reduce((a, x) => a + x.tokens, 0)
  const porSesionMuertes = {}
  for (const x of muertes) (porSesionMuertes[`${x.proj}/${x.sesion}`] ??= []).push(x)
  const olasCaidas = Object.entries(porSesionMuertes).filter(([, xs]) => xs.length >= 2)
  console.log(`1. MUERTES DE SESIÓN — ${muertes.length} spawns, ${k(perdido)} (${pct(perdido, TOTAL)} del gasto total)`)
  console.log(`   ${olasCaidas.length} olas perdieron 2+ agentes a la vez: comparten la misma cuota y se acaban juntos.`)
  for (const [s, xs] of olasCaidas.sort((a, b) => b[1].length - a[1].length).slice(0, 4))
    console.log(`     ${String(xs.length).padStart(2)} agentes · ${k(xs.reduce((a, x) => a + x.tokens, 0)).padStart(7)}  ${s}`)
  console.log(`   → Antes de relanzar, AUDITA EL DISCO: el agente muerto casi siempre ya escribió.`)
  console.log(`   → Menos agentes por ola alarga la sesión más de lo que la acorta el paralelismo.\n`)

  const opus = F.filter((x) => x.modelo === "opus" && !x.muerte)
  const opusOk = opus.filter((x) => x.verdict === "ok")
  const gastoOpus = opus.reduce((a, x) => a + x.tokens, 0)
  const sonnetMedia = (() => { const g = F.filter((x) => x.modelo === "sonnet" && !x.muerte); return g.length ? g.reduce((a, x) => a + x.tokens, 0) / g.length : 0 })()
  const ahorroSiSonnet = opusOk.length * (opus.reduce((a, x) => a + x.tokens, 0) / Math.max(opus.length, 1) - sonnetMedia)
  console.log(`2. TIER DE MÁS — opus: ${opus.length} spawns, ${k(gastoOpus)} (${pct(gastoOpus, TOTAL)} del gasto)`)
  console.log(`   ${opusOk.length} de ${opus.length} salieron ok a la primera.`)
  console.log(`   Bajar a sonnet SOLO las que nunca fallaron habría ahorrado ~${k(Math.max(ahorroSiSonnet, 0))}.`)
  console.log(`   → Ojo: que opus no falle puede significar que la rúbrica funciona, no que sobre.`)
  console.log(`     Baja de tier POR TIPO DE TRABAJO con historial limpio, nunca todo a la vez.\n`)

  const porSesion = agrupar(F, (x) => `${x.proj}/${x.sesion}`)
  const sesiones = Object.values(porSesion)
  const grandes = sesiones.filter((s) => s.n >= 10)
  console.log(`3. CEREMONIA DE MÁS — ${grandes.length} sesiones con 10+ spawns suman ${k(grandes.reduce((a, s) => a + s.tokens, 0))} (${pct(grandes.reduce((a, s) => a + s.tokens, 0), TOTAL)})`)
  const triviales = F.filter((x) => x.modelo === "haiku" && !x.muerte)
  console.log(`   ${triviales.length} spawns haiku a ${k(triviales.reduce((a, x) => a + x.tokens, 0) / Math.max(triviales.length, 1))} de media.`)
  console.log(`   El costo de un spawn es casi todo FIJO: el agente arranca en blanco y relee todo.`)
  console.log(`   → Agrupar 10 pasos triviales del mismo namespace en UN builder ahorra ~80% de esos 10 spawns.`)
  console.log(`   → Si el orquestador ya tiene el archivo cargado, editarlo inline cuesta menos que delegarlo.`)
}

function presupuesto() {
  const n = Number(val("spawns", 5))
  const m = val("modelo", "sonnet")
  const g = F.filter((x) => x.modelo === m && !x.muerte)
  if (!g.length) { console.log(`no hay spawns medidos de ${m}`); return }
  const media = g.reduce((a, x) => a + x.tokens, 0) / g.length
  const orden = g.map((x) => x.tokens).sort((a, b) => a - b)
  const p90 = orden[Math.floor(orden.length * 0.9)]
  console.log(`PRESUPUESTO — ${n} spawns de ${m}, sobre ${g.length} spawns medidos`)
  console.log(`  esperado (media)      ${k(media * n)}`)
  console.log(`  caso malo (p90)       ${k(p90 * n)}`)
  console.log(`  + verificación        ${k(media * n * 0.4)}  (la verificación suele ir un tier abajo)`)
  console.log(`  ────────────────────────────────`)
  console.log(`  planea con            ${k(media * n * 1.4)} y ten margen hasta ${k(p90 * n * 1.4)}`)
}

const CMD = { resumen, fases, proyectos, fugas, presupuesto, senal }
if (!CMD[cmd]) {
  const ls = readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n")
  console.log(ls.slice(2, ls.indexOf(" */")).map((l) => l.replace(/^ \* ?/, "")).join("\n"))
  process.exit(1)
}
if (!F.length) { console.log("no hay ni un solo spawn medido en los metrics.json encontrados."); process.exit(0) }
console.log("⚠ unidad: subagent_tokens = contexto FINAL de cada agente, no su gasto (el real es ~70–110× mayor). Gasto real: costos.mjs real\n")
CMD[cmd]()
