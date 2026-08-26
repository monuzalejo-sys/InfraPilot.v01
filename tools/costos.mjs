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
 * El consumo INLINE del orquestador no está metrado en este entorno y NUNCA se
 * inventa: todo lo de aquí es gasto de subagente, que es además el único que se
 * puede controlar eligiendo ceremonia y modelo.
 *
 * Cero dependencias.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs"
import { join, resolve, basename, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ORION = process.env.ORION_HOME ?? resolve(dirname(fileURLToPath(import.meta.url)), "..")
const RAICES = [join(ORION, "memory"), "C:\\Users\\Kalel\\prommter\\proyectos", "C:\\Users\\Kalel\\fable 5"]
const SUELTAS = ["C:\\Users\\Kalel\\prommter\\memory\\prommter"]
const ARGV = process.argv.slice(2)
const cmd = ARGV[0] ?? "resumen"
const val = (n, d) => { const i = ARGV.indexOf(`--${n}`); return i >= 0 && ARGV[i + 1] ? ARGV[i + 1] : d }

const k = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(2)} M` : `${Math.round(n / 1000)}k`
const pct = (a, b) => b ? `${((a / b) * 100).toFixed(1)}%` : "—"

function memorias() {
  const out = new Set(SUELTAS)
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
CMD[cmd]()
