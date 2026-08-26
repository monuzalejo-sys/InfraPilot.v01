#!/usr/bin/env node
/**
 * plan.mjs — el registro de ejecución de un proyecto (RFC-0008).
 *
 * Un plan de mil tareas en prosa es un documento que hay que leer entero para
 * usarlo, que es exactamente el costo que RFC-0004 existe para evitar. Aquí el
 * plan es un REGISTRO: se le pregunta «¿qué sigue?» y contesta en 20 líneas,
 * sin que nadie cargue el plan completo en contexto.
 *
 *   node tools/plan.mjs nuevo <memory-dir> --objetivo "..." [--modo genesis|evolucion]
 *   node tools/plan.mjs perfil <plan.json> --set stack=nextjs,supabase --set publico=true
 *   node tools/plan.mjs generar <plan.json> [--nivel N0,N1] [--categoria seguridad] [--dry]
 *   node tools/plan.mjs siguiente <plan.json> [--n 3]
 *   node tools/plan.mjs ola <plan.json> [--max 4]
 *   node tools/plan.mjs brief <plan.json> T-042
 *   node tools/plan.mjs estado <plan.json> [--por nivel|categoria]
 *   node tools/plan.mjs hecho <plan.json> T-042 --evidencia "..." [--tokens 71000]
 *   node tools/plan.mjs bloquear <plan.json> T-042 --por "falta decidir hosting"
 *   node tools/plan.mjs agregar <plan.json> --json '<PlanTask>'   (o --archivo x.json)
 *   node tools/plan.mjs narrar <plan.json> --archivo narrativa.json   resumen, hitos, escalabilidad
 *   node tools/plan.mjs validar <plan.json>
 *   node tools/plan.mjs tanda <plan.json> [--n 10] [salida.md]   lo de AHORA, legible
 *   node tools/plan.mjs md <plan.json> [salida.md]                el plan entero
 *   node tools/plan.mjs catalogo [--validar] [--listar] [--categoria seguridad]
 *
 * Cero dependencias. Toda escritura sube `version` y sella `updatedAt`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs"
import { join, dirname, basename, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ORION_HOME = process.env.ORION_HOME
  ?? resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DIR_CATALOGO = join(ORION_HOME, "catalogo")

/* ── Costo por tarea ──────────────────────────────────────────────────────
   NO son estimaciones: salen de 280 spawns medidos en `modelOutcomes` de seis
   memorias (cerebro/temas/modelos-y-costos.md §5). `presupuesto` cuenta SOLO
   tokens de subagente: el consumo inline del orquestador no está metrado en
   este entorno y no se inventa. Por eso una tarea `inline` presupuesta 0 — no
   es que sea gratis, es que es el único número que se puede controlar. */
const COSTO = {
  haiku:  { build: 45_000,  verificacion: 19_000 },
  sonnet: { build: 150_000, verificacion: 71_000 },
  opus:   { build: 206_000, verificacion: 284_000 },
}
const ADVERSARIAL = 110_000            // par de jueces opus; solo donde el fallo es caro
const MODELO_POR_DIFICULTAD = { trivial: "haiku", normal: "sonnet", hard: "opus" }
const NIVELES = ["N0", "N1", "N2", "N3", "N4"]
const NIVEL_NOMBRE = {
  N0: "Cimientos", N1: "Funciona", N2: "Aguanta", N3: "Escala", N4: "Excelencia",
}
const ESTADOS = ["pendiente", "listo", "en-curso", "hecho", "bloqueado", "descartado"]
const CATEGORIAS_ADVERSARIALES = new Set(["seguridad"])

function presupuestar(t) {
  const modelo = t.modelo ?? MODELO_POR_DIFICULTAD[t.dificultad] ?? "sonnet"
  if (t.ceremonia === "inline") return 0
  const verificador = t.dificultad === "trivial" ? "haiku" : "sonnet"
  const constructores = t.ceremonia === "ola" ? 3 : 1
  let total = COSTO[modelo].build * constructores + COSTO[verificador].verificacion
  if (CATEGORIAS_ADVERSARIALES.has(t.categoria) && t.dificultad === "hard") total += ADVERSARIAL
  return total
}

/* ── utilidades ───────────────────────────────────────────────────────── */
const ARGV = process.argv.slice(2)
const cmd = ARGV[0]
/* Un posicional es lo que no empieza por `--` Y no es el VALOR de una bandera
   anterior. Sin la segunda condición, `tanda plan.json --n 8` tomaba el «8»
   como nombre del archivo de salida y escribía un archivo llamado «8». */
const posicional = ARGV.slice(1).filter((a, i, xs) =>
  !a.startsWith("--") && !(i > 0 && xs[i - 1].startsWith("--")))
const flag = (n) => ARGV.includes(`--${n}`)
const val = (n, def) => { const i = ARGV.indexOf(`--${n}`); return i >= 0 && ARGV[i + 1] && !ARGV[i + 1].startsWith("--") ? ARGV[i + 1] : def }
const vals = (n) => ARGV.reduce((acc, a, i) => (a === `--${n}` && ARGV[i + 1] ? [...acc, ARGV[i + 1]] : acc), [])
const lista = (n) => (val(n) ? val(n).split(",").map((s) => s.trim()).filter(Boolean) : null)
const ahora = () => new Date().toISOString()
const morir = (m) => { console.error(`plan: ${m}`); process.exit(1) }
const leerJSON = (p) => { try { return JSON.parse(readFileSync(p, "utf8")) } catch (e) { morir(`no pude leer ${p}: ${e.message}`) } }

function guardar(ruta, plan) {
  plan.version = (plan.version ?? 0) + 1
  plan.updatedAt = ahora()
  writeFileSync(ruta, JSON.stringify(plan, null, 2) + "\n")
  return plan.version
}

/* Colisión de propiedad: dos tareas chocan si sus conjuntos `posee` se solapan.
   Se compara por PREFIJO literal (lo que va antes del primer comodín), que es
   predecible y basta para el caso real: `app/api/login/**` choca con
   `app/api/login/route.ts`, y `lib/a.ts` no choca con `lib/ab.ts`. */
const prefijo = (patron) => {
  const p = String(patron).replace(/\\/g, "/")
  const i = p.search(/[*?[{]/)
  const base = i === -1 ? p : p.slice(0, i)
  return base.endsWith("/") ? base.slice(0, -1) : base
}
const dentroDe = (a, b) => a === b || a.startsWith(b + "/") || b.startsWith(a + "/")
function chocan(t1, t2) {
  for (const p1 of t1.posee ?? []) for (const p2 of t2.posee ?? [])
    if (dentroDe(prefijo(p1), prefijo(p2))) return `${p1} ↔ ${p2}`
  return null
}

/* ── catálogo ─────────────────────────────────────────────────────────── */
function cargarCatalogo() {
  if (!existsSync(DIR_CATALOGO)) return []
  const out = []
  for (const f of readdirSync(DIR_CATALOGO)) {
    if (!f.endsWith(".json") || f.startsWith("_")) continue      // `_ejemplo.json` no se carga
    const c = leerJSON(join(DIR_CATALOGO, f))
    for (const a of c.arquetipos ?? []) out.push({ ...a, categoria: c.categoria, _archivo: f })
  }
  return out
}

/* `aplicaSi` contra el perfil: las listas se cumplen si ALGUNO coincide (con `*`
   como comodín «que tenga al menos uno»), los booleanos si son idénticos, las
   cadenas si son iguales. Ausente = aplica siempre. */
function aplica(arq, perfil) {
  const cond = arq.aplicaSi ?? {}
  for (const [clave, esperado] of Object.entries(cond)) {
    const real = perfil[clave]
    if (Array.isArray(esperado)) {
      if (esperado.includes("*")) { if (!Array.isArray(real) || real.length === 0) return false; continue }
      const reales = Array.isArray(real) ? real : real == null ? [] : [real]
      if (!esperado.some((e) => reales.includes(e))) return false
    } else if (typeof esperado === "boolean") {
      if (Boolean(real) !== esperado) return false
    } else if (String(real ?? "") !== String(esperado)) return false
  }
  return true
}

const sustituir = (valor, clave, v) => {
  const re = new RegExp(`\\{\\{${clave}\\}\\}`, "g")
  if (typeof valor === "string") return valor.replace(re, v)
  if (Array.isArray(valor)) return valor.map((x) => sustituir(x, clave, v))
  if (valor && typeof valor === "object")
    return Object.fromEntries(Object.entries(valor).map(([k, x]) => [k, sustituir(x, clave, v)]))
  return valor
}

const FUENTE_PORCADA = { entidad: "entidades", ruta: "rutas", superficie: "superficies", rol: "roles" }

/* N8-R9: instanciar SOLO con valores observados en el perfil. Si el perfil no
   trae la lista, el arquetipo no produce nada — no se inventa la entidad. */
function instanciar(arq, perfil) {
  if (!arq.porCada) return [arq]
  const valores = perfil[FUENTE_PORCADA[arq.porCada]] ?? []
  return valores.map((v) => ({ ...sustituir(arq, arq.porCada, v), _instancia: v }))
}

/* ── comandos ─────────────────────────────────────────────────────────── */

function cmdNuevo() {
  const dir = posicional[0] ?? morir("falta <memory-dir>")
  mkdirSync(dir, { recursive: true })
  const ruta = join(dir, "plan.json")
  if (existsSync(ruta) && !flag("forzar")) morir(`${ruta} ya existe (usa --forzar para reemplazarlo)`)
  const projectId = val("proyecto", basename(dir))
  const plan = {
    planId: `${projectId}-${ahora().slice(0, 10)}`,
    projectId,
    version: 0,
    createdAt: ahora(),
    updatedAt: ahora(),
    modo: val("modo", "genesis"),
    objetivo: val("objetivo", ""),
    resumen: [],
    perfil: {
      stack: [], superficies: [], entidades: [], rutas: [], roles: [],
      publico: false, dineroReal: false, datosPersonales: false, multiUsuario: false,
      equipo: "solo-orion", etapa: "N0",
    },
    niveles: NIVELES.map((id) => ({ id, nombre: NIVEL_NOMBRE[id], meta: "", salida: "" })),
    categorias: [],
    hitos: [],
    tareas: [],
    escalabilidad: [],
    negocio: null,
  }
  const v = guardar(ruta, plan)
  console.log(`plan nuevo: ${ruta} (v${v}, modo ${plan.modo})`)
  console.log(`siguiente paso: plan.mjs perfil ${ruta} --set stack=nextjs,supabase --set publico=true`)
}

function cmdPerfil() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const cambios = vals("set")
  if (!cambios.length) { console.log(JSON.stringify(plan.perfil, null, 2)); return }
  for (const c of cambios) {
    const [k, ...resto] = c.split("=")
    const bruto = resto.join("=")
    const actual = plan.perfil[k]
    if (typeof actual === "boolean" || bruto === "true" || bruto === "false") plan.perfil[k] = bruto === "true"
    else if (Array.isArray(actual)) plan.perfil[k] = bruto.split(",").map((s) => s.trim()).filter(Boolean)
    else plan.perfil[k] = bruto
  }
  const v = guardar(ruta, plan)
  console.log(`perfil actualizado (v${v}):`)
  console.log(JSON.stringify(plan.perfil, null, 2))
}

function cmdGenerar() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const soloNivel = lista("nivel")
  const soloCat = lista("categoria")
  const catalogo = cargarCatalogo()
  if (!catalogo.length) morir(`el catálogo está vacío (${DIR_CATALOGO})`)

  const yaInstanciados = new Set(plan.tareas.map((t) => t._clave).filter(Boolean))
  const nuevas = []
  let n = plan.tareas.length
  const siguienteId = () => `T-${String(++n).padStart(3, "0")}`

  for (const arq of catalogo) {
    if (soloNivel && !soloNivel.includes(arq.nivel)) continue
    if (soloCat && !soloCat.includes(arq.categoria)) continue
    if (!aplica(arq, plan.perfil)) continue
    for (const inst of instanciar(arq, plan.perfil)) {
      const clave = inst._instancia ? `${arq.id}#${inst._instancia}` : arq.id
      if (yaInstanciados.has(clave)) continue
      const t = {
        id: siguienteId(),
        titulo: inst.titulo,
        categoria: arq.categoria,
        nivel: inst.nivel,
        arquetipo: arq.id,
        _clave: clave,
        porQue: inst.porQue,
        queHacer: inst.queHacer ?? [],
        posee: inst.posee ?? [],
        intocable: inst.intocable ?? [],
        dependeDe: [],
        dificultad: inst.dificultad ?? "normal",
        ceremonia: inst.ceremonia ?? "1-builder",
        modelo: MODELO_POR_DIFICULTAD[inst.dificultad ?? "normal"],
        aceptacion: inst.aceptacion ?? [],
        presupuesto: 0,
        estado: "pendiente",
        bloqueadoPor: null,
        evidencia: null,
        gastoReal: null,
        cerebro: inst.cerebro ?? [],
      }
      /* N8-R2: en `evolucion` nada se toca sin decir qué debe seguir funcionando. */
      if (plan.modo === "evolucion" && !t.aceptacion.some((a) => /regres|sigue|no rompe|intacto/i.test(a.check)))
        t.aceptacion.push({
          check: "Regresión: lo que ya funcionaba sigue funcionando",
          comando: "npm run verificar",
          espera: "exit 0, y el mismo número de tests que antes del cambio o más",
        })
      t.presupuesto = presupuestar(t)
      nuevas.push(t)
    }
  }

  /* Orden estable y útil: por nivel, luego categoría, luego título. Los ids se
     reasignan una sola vez aquí para que el plan se lea en orden de ejecución. */
  nuevas.sort((a, b) =>
    NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel)
    || a.categoria.localeCompare(b.categoria)
    || a.titulo.localeCompare(b.titulo))
  let k = plan.tareas.length
  for (const t of nuevas) t.id = `T-${String(++k).padStart(3, "0")}`

  const porCat = {}
  for (const t of nuevas) (porCat[t.categoria] ??= []).push(t)
  const resumen = Object.entries(porCat).map(([c, ts]) => `${c} ${ts.length}`).join(" · ")

  if (flag("dry")) {
    console.log(`[dry] ${nuevas.length} tareas nuevas — ${resumen}`)
    console.log(`[dry] presupuesto: ${(nuevas.reduce((s, t) => s + t.presupuesto, 0) / 1e6).toFixed(2)} M tokens de subagente`)
    return
  }
  plan.tareas.push(...nuevas)
  const cats = new Set(plan.categorias.map((c) => c.id))
  for (const c of Object.keys(porCat)) if (!cats.has(c)) plan.categorias.push({ id: c, nombre: c, meta: "" })
  const v = guardar(ruta, plan)
  console.log(`+${nuevas.length} tareas (v${v}) — ${resumen}`)
  console.log(`total en el plan: ${plan.tareas.length} · presupuesto ${(plan.tareas.reduce((s, t) => s + t.presupuesto, 0) / 1e6).toFixed(2)} M tokens de subagente`)
}

/* Una tarea está LISTA si (a) no está hecha ni bloqueada, (b) sus dependencias
   explícitas están hechas, y (c) su categoría no tiene trabajo pendiente en un
   nivel MÁS BAJO (N8-R8: los niveles se completan en orden dentro de cada
   categoría). Lo tercero es lo que evita el fallo clásico de pulir la
   excelencia de una pantalla mientras los cimientos de esa misma área siguen
   rotos. `--sin-niveles` lo desactiva cuando de verdad hace falta saltarse el
   orden — pero entonces es una decisión, no un descuido. */
function listas(plan, { respetarNiveles = !flag("sin-niveles") } = {}) {
  const pendientePorCategoria = {}
  for (const t of plan.tareas) {
    if (t.estado === "hecho" || t.estado === "descartado") continue
    const i = NIVELES.indexOf(t.nivel)
    const actual = pendientePorCategoria[t.categoria]
    if (actual === undefined || i < actual) pendientePorCategoria[t.categoria] = i
  }
  return plan.tareas.filter((t) => {
    if (t.estado !== "pendiente" && t.estado !== "listo") return false
    if (!(t.dependeDe ?? []).every((d) => plan.tareas.find((x) => x.id === d)?.estado === "hecho")) return false
    if (respetarNiveles && NIVELES.indexOf(t.nivel) > pendientePorCategoria[t.categoria]) return false
    return true
  })
}

function lineaTarea(t) {
  const pres = t.presupuesto ? `${Math.round(t.presupuesto / 1000)}k` : "inline"
  return `${t.id} [${t.nivel}·${t.categoria}·${t.dificultad}·${t.ceremonia}·${pres}] ${t.titulo}`
}

function cmdSiguiente() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const n = Number(val("n", 3))
  const cands = listas(plan)
    .filter((t) => !lista("categoria") || lista("categoria").includes(t.categoria))
    .sort((a, b) => NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel) || a.id.localeCompare(b.id))
  if (!cands.length) {
    const bloq = plan.tareas.filter((t) => t.estado === "bloqueado")
    console.log(bloq.length
      ? `nada listo. ${bloq.length} bloqueadas:\n` + bloq.slice(0, 5).map((t) => `  ${t.id} — ${t.bloqueadoPor}`).join("\n")
      : "nada listo: o está todo hecho, o todo depende de algo sin hacer.")
    return
  }
  console.log(`${plan.projectId} · siguientes ${Math.min(n, cands.length)} de ${cands.length} listas (${plan.tareas.filter((t) => t.estado === "hecho").length}/${plan.tareas.length} hechas)`)
  for (const t of cands.slice(0, n)) console.log("  " + lineaTarea(t))
  if (!flag("sin-niveles")) {
    const retenidas = plan.tareas.filter((t) => (t.estado === "pendiente" || t.estado === "listo") && !cands.includes(t)
      && (t.dependeDe ?? []).every((d) => plan.tareas.find((x) => x.id === d)?.estado === "hecho")).length
    if (retenidas) console.log(`\n${retenidas} tareas más esperan a que su categoría termine el nivel de abajo (N8-R8). \`--sin-niveles\` las suelta.`)
  }
  console.log(`\nbrief completo: plan.mjs brief ${ruta} ${cands[0].id}`)
}

/* Ola: el conjunto MÁS GRANDE de tareas listas con propiedad de archivos
   disjunta. Es la implementación ejecutable de la lección más cara del
   ecosistema (colisiones entre builders en paralelo): deja de ser criterio del
   orquestador y pasa a ser una propiedad computable del plan (N8-R4). */
function cmdOla() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const max = Number(val("max", 4))
  /* Nivel primero (N8-R8) y, dentro del nivel, la más CARA primero: con
     agentes en paralelo, empezar por la más larga es lo que minimiza el tiempo
     total de la ola — la barata siempre cabe después en el hueco que quede. */
  const cands = listas(plan)
    .filter((t) => t.ceremonia !== "inline")
    .sort((a, b) => NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel) || b.presupuesto - a.presupuesto)
  const ola = []
  const descartadas = []
  for (const t of cands) {
    if (ola.length >= max) break
    const choque = ola.map((o) => [o, chocan(o, t)]).find(([, c]) => c)
    if (choque) { descartadas.push(`${t.id} choca con ${choque[0].id} (${choque[1]})`); continue }
    ola.push(t)
  }
  if (!ola.length) { console.log("no hay ninguna tarea lista que se pueda lanzar en ola."); return }
  const total = ola.reduce((s, t) => s + t.presupuesto, 0)
  console.log(`OLA propuesta — ${ola.length} constructores en paralelo, sin colisión de archivos`)
  for (const t of ola) {
    console.log(`  ${t.id} · ${t.modelo} · ${Math.round(t.presupuesto / 1000)}k · posee ${(t.posee ?? []).join(" ")}`)
    console.log(`      ${t.titulo}`)
  }
  console.log(`presupuesto de la ola: ${Math.round(total / 1000)}k tokens de subagente`)
  if (descartadas.length) console.log(`fuera por colisión (van en la ola siguiente):\n  ` + descartadas.slice(0, 5).join("\n  "))
  console.log(`\nmanifiesto: plan.mjs ola ${ruta} --max ${max} --wave ${dirname(ruta)}/wave.json`)
  const destino = val("wave")
  if (destino) {
    writeFileSync(destino, JSON.stringify({
      startedAt: ahora(),
      objective: plan.objetivo,
      steps: ola.map((t) => ({ step: t.id, model: t.modelo, owns: t.posee, contract: t.aceptacion?.[0]?.check ?? t.titulo, status: "spawned" })),
    }, null, 2) + "\n")
    console.log(`wave.json escrito → ${destino}`)
  }
}

/* El brief es determinista y sale de un script, no de un modelo: es el mismo
   texto siempre, cuesta ~0 y no puede «resumir mal» la tarea. */
function cmdBrief() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const id = posicional[1] ?? morir("falta el id de la tarea (ej. T-042)")
  const plan = leerJSON(ruta)
  const t = plan.tareas.find((x) => x.id === id) ?? morir(`no existe ${id}`)
  const L = []
  L.push(`# ${t.id} — ${t.titulo}`)
  L.push(`Proyecto ${plan.projectId} · modo ${plan.modo} · nivel ${t.nivel} (${NIVEL_NOMBRE[t.nivel]}) · ${t.categoria} · dificultad ${t.dificultad}`)
  L.push(``, `## Por qué`, t.porQue)
  L.push(``, `## Qué hacer`)
  t.queHacer.forEach((p, i) => L.push(`${i + 1}. ${p}`))
  L.push(``, `## Archivos`)
  L.push(`POSEES (nadie más los toca): ${(t.posee ?? []).join(" · ") || "—"}`)
  if (t.intocable?.length) L.push(`INTOCABLES (los lees, no los modificas): ${t.intocable.join(" · ")}`)
  L.push(``, `## Aceptación — se comprueba, no se declara`)
  t.aceptacion.forEach((a, i) => {
    L.push(`${i + 1}. ${a.check}`)
    if (a.comando) L.push(`   comando: ${a.comando}`)
    L.push(`   espera: ${a.espera}`)
  })
  /* Un marcador `<algo>` en un comando es un dato que el arquetipo no podía
     saber. Sacarlo a una sección propia lo vuelve un HUECO VISIBLE: si se queda
     escondido dentro del comando, el ejecutor lo rellena con algo verosímil —
     que es el modo de fallo que este ecosistema ya pagó tres veces. */
  const marcadores = [...new Set(JSON.stringify(t.aceptacion).match(/<[a-záéíóúñ][a-záéíóúñ0-9-]{2,}>/gi) ?? [])]
  if (marcadores.length) {
    L.push(``, `## Datos que te faltan — PÍDELOS, no los inventes`)
    for (const m of marcadores) L.push(`- \`${m}\` — pregunta su valor real antes de correr el comando.`)
    L.push(`Si nadie te lo puede dar, la tarea queda BLOQUEADA con ese motivo. Un valor verosímil aquí es una mentira que después nadie encuentra.`)
  }
  if (t.cerebro?.length) {
    L.push(``, `## Conocimiento previo que aplica (ábrelo antes de decidir)`)
    for (const c of t.cerebro)
      L.push(c.startsWith("tema:")
        ? `- node ${join(ORION_HOME, "tools", "cerebro.mjs")} tema ${c.slice(5)}`
        : `- ${c} (objeto de memoria)`)
  }
  if (plan.modo === "evolucion")
    L.push(``, `## Modo evolución`, `Hay un sistema vivo y alguien usándolo. No rompas lo que ya funciona: la última aceptación es la regresión y es obligatoria.`)
  L.push(``, `## Cierre`, `Al terminar: node tools/plan.mjs hecho ${ruta} ${t.id} --evidencia "<el hecho observado>" --tokens <medidos>`)
  console.log(L.join("\n"))
}

function barra(hechas, total, ancho = 24) {
  const n = total ? Math.round((hechas / total) * ancho) : 0
  return "█".repeat(n) + "░".repeat(ancho - n)
}

function cmdEstado() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const por = val("por", "categoria")
  const T = plan.tareas
  const hechas = T.filter((t) => t.estado === "hecho")
  const gastado = hechas.reduce((s, t) => s + (t.gastoReal ?? 0), 0)
  const presupuestado = hechas.reduce((s, t) => s + t.presupuesto, 0)
  const restante = T.filter((t) => t.estado !== "hecho" && t.estado !== "descartado").reduce((s, t) => s + t.presupuesto, 0)

  console.log(`${plan.projectId} · plan v${plan.version} · modo ${plan.modo} · etapa ${plan.perfil.etapa}`)
  console.log(`${barra(hechas.length, T.length)}  ${hechas.length}/${T.length} hechas`)
  const grupos = {}
  for (const t of T) (grupos[por === "nivel" ? t.nivel : t.categoria] ??= []).push(t)
  const claves = por === "nivel" ? NIVELES.filter((n) => grupos[n]) : Object.keys(grupos).sort()
  for (const g of claves) {
    const ts = grupos[g]
    const h = ts.filter((t) => t.estado === "hecho").length
    const b = ts.filter((t) => t.estado === "bloqueado").length
    const etiqueta = por === "nivel" ? `${g} ${NIVEL_NOMBRE[g]}` : g
    console.log(`  ${etiqueta.padEnd(20)} ${barra(h, ts.length, 14)} ${String(h).padStart(3)}/${String(ts.length).padEnd(3)}${b ? `  ${b} bloqueadas` : ""}`)
  }
  console.log(`\npresupuesto restante: ${(restante / 1e6).toFixed(2)} M tokens de subagente`)
  if (hechas.length && gastado) {
    const desvio = ((gastado / presupuestado - 1) * 100).toFixed(0)
    console.log(`calibración: ${hechas.length} tareas medidas · presupuestado ${(presupuestado / 1e6).toFixed(2)} M · gastado ${(gastado / 1e6).toFixed(2)} M (${desvio > 0 ? "+" : ""}${desvio}%)`)
    /* Con menos de 5 mediciones el desvío es ruido, no señal: no se recalibra
       un presupuesto por una tarea que salió barata. */
    if (hechas.length >= 5 && Math.abs(Number(desvio)) > 25)
      console.log(`  → descalibrado más de un 25 % sobre ${hechas.length} tareas medidas: revisa COSTO en tools/plan.mjs.`)
  } else if (hechas.length) {
    console.log(`calibración: ${hechas.length} hechas pero sin --tokens medidos. Sin eso el presupuesto nunca converge (N8-R10).`)
  }
  const bloq = T.filter((t) => t.estado === "bloqueado")
  if (bloq.length) {
    console.log(`\nbloqueadas (${bloq.length}) — cada una es una decisión que alguien no ha tomado:`)
    for (const t of bloq.slice(0, 8)) console.log(`  ${t.id} — ${t.bloqueadoPor}`)
  }
}

function cmdHecho() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const id = posicional[1] ?? morir("falta el id")
  const plan = leerJSON(ruta)
  const t = plan.tareas.find((x) => x.id === id) ?? morir(`no existe ${id}`)
  const evidencia = val("evidencia")
  if (!evidencia) morir(`--evidencia es obligatoria: qué se OBSERVÓ que prueba que está hecha (N8-R10)`)
  t.estado = "hecho"
  t.evidencia = evidencia
  t.bloqueadoPor = null
  if (val("tokens")) t.gastoReal = Number(val("tokens"))
  const v = guardar(ruta, plan)
  const desbloqueadas = plan.tareas.filter((x) =>
    (x.estado === "pendiente" || x.estado === "bloqueado")
    && (x.dependeDe ?? []).includes(id)
    && (x.dependeDe ?? []).every((d) => plan.tareas.find((y) => y.id === d)?.estado === "hecho"))
  console.log(`${id} hecha (v${v})${t.gastoReal ? ` · ${Math.round(t.gastoReal / 1000)}k tokens medidos vs ${Math.round(t.presupuesto / 1000)}k presupuestados` : " · sin medición de tokens"}`)
  if (desbloqueadas.length) console.log(`desbloquea: ${desbloqueadas.map((x) => x.id).join(", ")}`)
}

function cmdBloquear() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const id = posicional[1] ?? morir("falta el id")
  const plan = leerJSON(ruta)
  const t = plan.tareas.find((x) => x.id === id) ?? morir(`no existe ${id}`)
  const por = val("por")
  if (flag("quitar")) { t.estado = "pendiente"; t.bloqueadoPor = null }
  else { if (!por) morir("--por es obligatorio: qué decisión falta"); t.estado = "bloqueado"; t.bloqueadoPor = por }
  const v = guardar(ruta, plan)
  console.log(`${id} → ${t.estado}${t.bloqueadoPor ? ` (${t.bloqueadoPor})` : ""} (v${v})`)
}

function cmdAgregar() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const bruto = val("archivo") ? readFileSync(val("archivo"), "utf8") : val("json")
  if (!bruto) morir("pasa --json '<PlanTask>' o --archivo tareas.json")
  let entrada
  try { entrada = JSON.parse(bruto) } catch (e) { morir(`JSON inválido: ${e.message}`) }
  const entradas = Array.isArray(entrada) ? entrada : [entrada]
  let n = plan.tareas.length
  const añadidas = []
  for (const e of entradas) {
    const t = {
      id: `T-${String(++n).padStart(3, "0")}`,
      arquetipo: null, dependeDe: [], intocable: [], posee: [], cerebro: [],
      dificultad: "normal", ceremonia: "1-builder", nivel: "N1", categoria: "producto",
      estado: "pendiente", bloqueadoPor: null, evidencia: null, gastoReal: null,
      ...e,
    }
    t.modelo = t.modelo ?? MODELO_POR_DIFICULTAD[t.dificultad]
    t.presupuesto = presupuestar(t)
    plan.tareas.push(t); añadidas.push(t)
  }

  /* Quien escribe las tareas no sabe qué ids le van a tocar, así que declara
     las dependencias por TÍTULO. Resolverlas es trabajo de la herramienta: si
     se dejan pasar, el plan queda inválido y la culpa parece del agente. */
  const porTitulo = new Map(plan.tareas.map((t) => [t.titulo.toLowerCase().replace(/[.,]/g, "").trim(), t.id]))
  const ids = new Set(plan.tareas.map((t) => t.id))
  let resueltas = 0
  const huerfanas = []
  for (const t of añadidas) {
    t.dependeDe = (t.dependeDe ?? []).map((d) => {
      if (ids.has(d)) return d
      const encontrado = porTitulo.get(String(d).toLowerCase().replace(/[.,]/g, "").trim())
      if (encontrado) { resueltas++; return encontrado }
      huerfanas.push(`${t.id} → "${String(d).slice(0, 50)}"`)
      return null
    }).filter(Boolean)
  }
  const v = guardar(ruta, plan)
  console.log(`+${añadidas.length} tareas propias del proyecto (v${v}): ${añadidas.map((t) => t.id).join(", ")}`)
  if (resueltas) console.log(`${resueltas} dependencia(s) declaradas por título, resueltas a su id.`)
  if (huerfanas.length) console.log(`${huerfanas.length} dependencia(s) que no apuntan a nada y se descartaron:\n  ${huerfanas.join("\n  ")}`)
}

/* Las cuatro cosas que ningún agente sabe y que hacen que el plan se LEA:
   el resumen, la meta y la condición de salida de cada nivel, los hitos que le
   importan al dueño, y qué se hace después de terminar. Entran por aquí y no a
   mano sobre el JSON: editar un plan de 400 tareas con un editor de texto es
   como se corrompe un registro. */
function cmdNarrar() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const bruto = val("archivo") ? readFileSync(val("archivo"), "utf8") : val("json")
  if (!bruto) morir(`pasa --archivo narrativa.json (o --json '<…>') con alguna de estas claves:
  resumen        string[]   el plan entero en una lectura, 3-8 líneas
  niveles        [{id, meta, salida}]   qué persigue cada nivel y con qué se sale de él
  hitos          [{id, nombre, criterio, requiere:[ids]}]
  escalabilidad  [{id, titulo, disparador, cuando, tareas:[ids]}]
  objetivo       string
  negocio        {…}        la forma Negocio de RFC-0008 §1.5`)
  let n
  try { n = JSON.parse(bruto) } catch (e) { morir(`JSON inválido: ${e.message}`) }

  const tocado = []
  if (n.objetivo) { plan.objetivo = n.objetivo; tocado.push("objetivo") }
  if (n.resumen) { plan.resumen = n.resumen; tocado.push(`resumen (${n.resumen.length} líneas)`) }
  if (n.negocio) { plan.negocio = n.negocio; tocado.push("negocio") }
  if (n.niveles) {
    for (const x of n.niveles) {
      const nivel = plan.niveles.find((y) => y.id === x.id)
      if (!nivel) { console.log(`  aviso: nivel ${x.id} no existe, ignorado`); continue }
      if (x.meta) nivel.meta = x.meta
      if (x.salida) nivel.salida = x.salida
    }
    tocado.push(`${n.niveles.length} niveles`)
  }
  const ids = new Set(plan.tareas.map((t) => t.id))
  const porTitulo = new Map(plan.tareas.map((t) => [t.titulo.toLowerCase().replace(/[.,]/g, "").trim(), t.id]))
  /* Los ids se pueden dar por título, igual que en `agregar`: quien escribe la
     narrativa piensa en tareas, no en numeración. */
  const resolver = (lista, donde) => (lista ?? []).map((d) => {
    if (ids.has(d)) return d
    const enc = porTitulo.get(String(d).toLowerCase().replace(/[.,]/g, "").trim())
    if (!enc) console.log(`  aviso: ${donde} apunta a "${String(d).slice(0, 40)}", que no existe`)
    return enc ?? null
  }).filter(Boolean)
  if (n.hitos) {
    plan.hitos = n.hitos.map((h) => ({ ...h, requiere: resolver(h.requiere, `hito ${h.id ?? h.nombre}`) }))
    tocado.push(`${plan.hitos.length} hitos`)
  }
  if (n.escalabilidad) {
    for (const m of n.escalabilidad) if (!m.disparador)
      morir(`la mejora "${m.titulo ?? m.id}" no tiene disparador observable: sin él es un deseo y no se agenda (N8-R6)`)
    plan.escalabilidad = n.escalabilidad.map((m) => ({ ...m, tareas: resolver(m.tareas, `mejora ${m.id ?? m.titulo}`) }))
    tocado.push(`${plan.escalabilidad.length} mejoras`)
  }
  if (!tocado.length) morir("no había ninguna clave reconocible en lo que pasaste")
  const v = guardar(ruta, plan)
  console.log(`narrativa aplicada (v${v}): ${tocado.join(" · ")}`)
  const sinCriterio = (plan.hitos ?? []).filter((h) => !h.criterio)
  if (sinCriterio.length) console.log(`aviso: ${sinCriterio.length} hito(s) sin criterio comprobable — un hito que no se puede comprobar no se puede celebrar.`)
}

/* La forma ejecutable de RFC-0008 §5. */
function cmdValidar() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const errores = []
  const avisos = []
  const ids = new Set()

  if (!["genesis", "evolucion"].includes(plan.modo)) errores.push(`modo inválido: ${plan.modo} (N8-R2)`)
  if (!plan.objetivo) avisos.push("el plan no tiene objetivo escrito")
  if (!plan.resumen?.length) avisos.push("el plan no tiene resumen: sin él hay que leerlo entero, que es lo que N8-R11 evita")

  for (const t of plan.tareas ?? []) {
    const donde = `${t.id ?? "?"}`
    if (!t.id) errores.push("hay una tarea sin id")
    if (ids.has(t.id)) errores.push(`${donde}: id duplicado`)
    ids.add(t.id)
    if (!NIVELES.includes(t.nivel)) errores.push(`${donde}: nivel inválido (${t.nivel})`)
    if (!ESTADOS.includes(t.estado)) errores.push(`${donde}: estado inválido (${t.estado})`)
    if (!["trivial", "normal", "hard"].includes(t.dificultad)) errores.push(`${donde}: dificultad inválida`)
    if (!["inline", "1-builder", "ola"].includes(t.ceremonia)) errores.push(`${donde}: ceremonia inválida`)
    if (!t.aceptacion?.length) errores.push(`${donde}: sin criterios de aceptación (N8-R3)`)
    else {
      const observable = t.aceptacion.some((a) => a.comando || /\b(0 |exit|200|4\d\d|5\d\d|\d+\s*(px|ms|s|filas|líneas|tests|caracteres))/i.test(a.espera ?? ""))
      if (!observable) errores.push(`${donde}: ninguna aceptación es un hecho observable (N8-R3)`)
      const adjetivos = t.aceptacion.filter((a) => /\b(bien|correcto|adecuado|bonito|limpio|seguro|óptimo|apropiado)\b/i.test(a.espera ?? ""))
      if (adjetivos.length) avisos.push(`${donde}: aceptación con adjetivo en vez de medición ("${adjetivos[0].espera}")`)
    }
    if (t.ceremonia !== "inline" && !(t.posee ?? []).length) errores.push(`${donde}: ceremonia ${t.ceremonia} sin \`posee\` (N8-R4)`)
    if (!t.presupuesto && t.ceremonia !== "inline") avisos.push(`${donde}: presupuesto en 0 con ceremonia ${t.ceremonia}`)
    if (t.estado === "hecho" && !t.evidencia) errores.push(`${donde}: marcada hecha sin evidencia (N8-R10)`)
    if (t.estado === "bloqueado" && !t.bloqueadoPor) errores.push(`${donde}: bloqueada sin decir por qué`)
    if (plan.modo === "evolucion" && !t.aceptacion?.some((a) => /regres|sigue|no rompe|intacto/i.test(a.check ?? "")))
      errores.push(`${donde}: modo evolución sin chequeo de regresión (N8-R2)`)
    if (JSON.stringify(t).includes("{{")) errores.push(`${donde}: quedó un placeholder {{…}} sin sustituir (N8-R9)`)
  }
  for (const t of plan.tareas ?? []) for (const d of t.dependeDe ?? [])
    if (!ids.has(d)) errores.push(`${t.id}: depende de ${d}, que no existe`)

  /* ciclos */
  const grafo = new Map((plan.tareas ?? []).map((t) => [t.id, t.dependeDe ?? []]))
  const estado = new Map()
  const ciclo = (n, camino) => {
    if (estado.get(n) === "ok") return null
    if (estado.get(n) === "visitando") return [...camino, n]
    estado.set(n, "visitando")
    for (const d of grafo.get(n) ?? []) { const c = ciclo(d, [...camino, n]); if (c) return c }
    estado.set(n, "ok"); return null
  }
  for (const id of grafo.keys()) { const c = ciclo(id, []); if (c) { errores.push(`ciclo de dependencias: ${c.join(" → ")}`); break } }

  /* colisiones dentro del mismo lote de tareas listas */
  const l = listas(plan).filter((t) => t.ceremonia !== "inline")
  const colisiones = []
  for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) {
    const c = chocan(l[i], l[j]); if (c) colisiones.push(`${l[i].id} ↔ ${l[j].id} (${c})`)
  }
  if (colisiones.length) avisos.push(`${colisiones.length} pares de tareas listas comparten archivos — \`plan.mjs ola\` ya las separa, pero no se pueden lanzar juntas a mano: ${colisiones.slice(0, 3).join("; ")}`)

  if (plan.negocio && !plan.negocio.supuestos?.length) errores.push(`negocio: hay cifras de precio sin \`supuestos\` (N8-R7)`)
  for (const m of plan.escalabilidad ?? []) if (!m.disparador) errores.push(`escalabilidad ${m.id}: mejora sin disparador observable (N8-R6)`)

  console.log(errores.length ? `INVÁLIDO — ${errores.length} errores, ${avisos.length} avisos` : `VÁLIDO — ${plan.tareas.length} tareas, ${avisos.length} avisos`)
  for (const e of errores) console.log(`  ✗ ${e}`)
  for (const a of avisos) console.log(`  ! ${a}`)
  process.exit(errores.length ? 1 : 0)
}

function cmdMd() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const salida = posicional[1] ?? join(dirname(ruta), "PLAN.md")
  const T = plan.tareas
  const hechas = T.filter((t) => t.estado === "hecho").length
  const L = []
  L.push(`# Plan de ejecución — ${plan.projectId}`, "")
  L.push(`> GENERADO desde \`plan.json\` (v${plan.version}, ${plan.updatedAt.slice(0, 10)}). No editar a mano:`,
    `> se reescribe entero en cada \`plan.mjs md\`. La fuente de verdad es el registro.`, "")
  L.push(`**Objetivo.** ${plan.objetivo || "—"}`, "")
  L.push(`**Modo.** ${plan.modo === "genesis" ? "Génesis — se construye de cero, no hay nada que romper." : "Evolución — hay un sistema vivo y alguien usándolo: toda tarea lleva chequeo de regresión."}`, "")
  if (plan.resumen?.length) { L.push(`## El plan en una lectura`, ""); for (const r of plan.resumen) L.push(`- ${r}`); L.push("") }
  L.push(`## Dónde estamos`, "")
  L.push(`${hechas} de ${T.length} tareas hechas · etapa ${plan.perfil.etapa} (${NIVEL_NOMBRE[plan.perfil.etapa] ?? "?"}) · presupuesto restante ${(T.filter((t) => t.estado !== "hecho").reduce((s, t) => s + t.presupuesto, 0) / 1e6).toFixed(2)} M tokens de subagente`, "")
  L.push(`| Categoría | Hechas | Total |`, `|---|---|---|`)
  const cats = [...new Set(T.map((t) => t.categoria))].sort()
  for (const c of cats) { const ts = T.filter((t) => t.categoria === c); L.push(`| ${c} | ${ts.filter((t) => t.estado === "hecho").length} | ${ts.length} |`) }
  L.push("")
  if (plan.hitos?.length) {
    L.push(`## Hitos`, "")
    for (const h of plan.hitos) L.push(`- **${h.id} ${h.nombre}** — ${h.criterio} _(requiere ${(h.requiere ?? []).join(", ") || "—"})_`)
    L.push("")
  }
  for (const n of NIVELES) {
    const ts = T.filter((t) => t.nivel === n)
    if (!ts.length) continue
    const nivel = plan.niveles?.find((x) => x.id === n)
    L.push(`## ${n} · ${NIVEL_NOMBRE[n]} — ${ts.filter((t) => t.estado === "hecho").length}/${ts.length}`, "")
    if (nivel?.meta) L.push(`${nivel.meta}`, "")
    if (nivel?.salida) L.push(`**Se sale de este nivel cuando:** ${nivel.salida}`, "")
    for (const c of cats) {
      const tc = ts.filter((t) => t.categoria === c)
      if (!tc.length) continue
      L.push(`### ${c}`, "")
      for (const t of tc) {
        const marca = t.estado === "hecho" ? "x" : " "
        L.push(`- [${marca}] **${t.id}** ${t.titulo} _(${t.dificultad}, ${t.ceremonia}${t.presupuesto ? `, ${Math.round(t.presupuesto / 1000)}k` : ""})_`)
        L.push(`  - **Por qué:** ${t.porQue}`)
        if (t.queHacer?.length) L.push(`  - **Qué hacer:** ` + t.queHacer.map((p, i) => `(${i + 1}) ${p}`).join(" "))
        L.push(`  - **Cómo se comprueba:** ` + t.aceptacion.map((a) => `${a.check} → ${a.espera}`).join(" · "))
        if (t.estado === "bloqueado") L.push(`  - **BLOQUEADA:** ${t.bloqueadoPor}`)
        if (t.evidencia) L.push(`  - **Evidencia:** ${t.evidencia}`)
      }
      L.push("")
    }
  }
  if (plan.escalabilidad?.length) {
    L.push(`## Después de terminar — cómo sigue creciendo`, "")
    for (const m of plan.escalabilidad) L.push(`- **${m.titulo}** — se hace cuando: ${m.disparador}. ${m.cuando ?? ""}`)
    L.push("")
  }
  if (plan.negocio) {
    const n = plan.negocio
    L.push(`## Cuánto cuesta y cuánto vale`, "")
    L.push(`- Costo de construcción medido en tokens de subagente: **${(n.costoTokens / 1e6).toFixed(2)} M**${n.costoEstimadoCOP ? ` ≈ **$${n.costoEstimadoCOP.toLocaleString("es-CO")} COP**` : ""}${n.horasEquivalentes ? ` (${n.horasEquivalentes} h de trabajo equivalente)` : ""}`)
    if (n.precioSugerido) L.push(`- Precio sugerido: **$${n.precioSugerido.montoCOP?.toLocaleString("es-CO")} COP** por ${n.precioSugerido.modelo === "mensualidad" ? `mes, con permanencia de ${n.precioSugerido.permanenciaMeses} meses` : "pago único"}`)
    if (n.precioSugerido?.incluye?.length) L.push(`  - Incluye: ${n.precioSugerido.incluye.join(", ")}`)
    if (n.precioSugerido?.noIncluye?.length) L.push(`  - No incluye: ${n.precioSugerido.noIncluye.join(", ")}`)
    if (n.comparables?.length) { L.push(``, `| Comparable | Precio | Qué ofrece | Dónde sale caro |`, `|---|---|---|---|`); for (const c of n.comparables) L.push(`| ${c.nombre} | ${c.precio} | ${c.queOfrece} | ${c.dondeSaleCaro} |`) }
    if (n.supuestos?.length) { L.push(``, `**Supuestos sobre los que descansa cada cifra de arriba:**`); for (const s of n.supuestos) L.push(`- ${s}`) }
    L.push("")
  }
  L.push(`---`, `Consultar sin leer esto entero: \`plan.mjs siguiente\`, \`plan.mjs ola\`, \`plan.mjs brief <id>\`, \`plan.mjs estado\`.`)
  writeFileSync(salida, L.join("\n") + "\n")
  console.log(`PLAN.md escrito → ${salida} (${L.length} líneas, ${T.length} tareas)`)
}

/* El documento que de verdad se lee: LA TANDA. `md` escribe el plan entero
   —1.800 líneas para 432 tareas— y eso sirve de archivo, no de lectura. Una
   tanda es «lo que vamos a hacer ahora»: el resumen arriba y las N tareas
   siguientes detalladas abajo, cada una con qué hacer y cómo se comprueba.
   Es el formato que el dueño pidió, y cabe en una sentada. */
function cmdTanda() {
  const ruta = posicional[0] ?? morir("falta <plan.json>")
  const plan = leerJSON(ruta)
  const n = Number(val("n", 10))
  const salida = posicional[1] ?? join(dirname(ruta), "TANDA.md")
  const cands = listas(plan)
    .filter((t) => !lista("categoria") || lista("categoria").includes(t.categoria))
    .sort((a, b) => NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel) || a.id.localeCompare(b.id))
    .slice(0, n)
  if (!cands.length) morir("no hay tareas listas: mira `estado` para ver qué las bloquea")

  const hechas = plan.tareas.filter((t) => t.estado === "hecho").length
  const total = cands.reduce((s, t) => s + t.presupuesto, 0)
  const porCat = {}
  for (const t of cands) (porCat[t.categoria] ??= []).push(t)

  const L = [`# ${plan.projectId} — la tanda de ahora`, ""]
  L.push(`> ${cands.length} tareas, de ${plan.tareas.length} que tiene el plan (${hechas} hechas).`,
    `> Generado de \`plan.json\` v${plan.version}. Se regenera con \`plan.mjs tanda\`.`, "")
  L.push(`## Lo que vamos a hacer`, "")
  if (plan.objetivo) L.push(`**Objetivo del proyecto.** ${plan.objetivo}`, "")
  L.push(`**Esta tanda, en una línea por área:**`, "")
  for (const [c, ts] of Object.entries(porCat).sort())
    L.push(`- **${c}** (${ts.length}) — ${ts.map((t) => t.titulo.replace(/\.$/, "")).join("; ")}.`)
  L.push("",
    `**Cuesta** ${Math.round(total / 1000)}k tokens de subagente${plan.modo === "evolucion" ? " y va en modo evolución: cada tarea lleva su chequeo de regresión, porque hay un sistema vivo." : "."}`, "")
  const conHueco = cands.filter((t) => /<[a-záéíóúñ][a-záéíóúñ0-9-]{2,}>/i.test(JSON.stringify(t.aceptacion)))
  if (conHueco.length) L.push(`**Antes de empezar hacen falta datos** que solo tú tienes, en ${conHueco.length} de estas tareas (van marcados abajo). Pregúntalos: un valor verosímil ahí es una mentira que después nadie encuentra.`, "")
  L.push(`---`, "")

  cands.forEach((t, i) => {
    L.push(`## ${i + 1}. ${t.titulo}`, "")
    L.push(`\`${t.id}\` · ${t.categoria} · nivel ${t.nivel} (${NIVEL_NOMBRE[t.nivel]}) · dificultad ${t.dificultad} · ${t.ceremonia === "inline" ? "se hace inline" : t.ceremonia === "ola" ? "necesita varios agentes" : "un constructor"}${t.presupuesto ? ` · ~${Math.round(t.presupuesto / 1000)}k tokens` : ""}`, "")
    L.push(`**Por qué.** ${t.porQue}`, "")
    if (t.queHacer?.length) {
      L.push(`**Qué hay que hacer.**`, "")
      t.queHacer.forEach((p, j) => L.push(`${j + 1}. ${p}`))
      L.push("")
    }
    if (t.posee?.length) L.push(`**Archivos que toca (y nadie más):** \`${t.posee.join("` · `")}\``, "")
    if (t.intocable?.length) L.push(`**No se tocan:** \`${t.intocable.join("` · `")}\``, "")
    L.push(`**Cómo sabremos que quedó bien.**`, "")
    for (const a of t.aceptacion) {
      L.push(`- ${a.check} → **${a.espera}**`)
      if (a.comando) L.push(`  \`\`\`bash\n  ${a.comando}\n  \`\`\``)
    }
    const marcadores = [...new Set(JSON.stringify(t.aceptacion).match(/<[a-záéíóúñ][a-záéíóúñ0-9-]{2,}>/gi) ?? [])]
    if (marcadores.length) L.push("", `> **Falta un dato tuyo:** ${marcadores.map((m) => `\`${m}\``).join(", ")}. Sin él la tarea queda bloqueada — no se rellena a ojo.`)
    if (t.cerebro?.length) L.push("", `_Ya sabemos algo de esto:_ ${t.cerebro.map((c) => c.startsWith("tema:") ? `\`${c.slice(5)}\`` : `\`${c}\``).join(" · ")}`)
    L.push("", `**Lanzar:** \`/orion ${t.id}\``, "")
  })

  L.push(`---`, "", `Cuando termine una: \`plan.mjs hecho ${basename(ruta)} <id> --evidencia "<lo que se vio>" --tokens <medidos>\`.`,
    `Para la siguiente tanda: \`plan.mjs tanda ${basename(ruta)} --n ${n}\`.`)
  writeFileSync(salida, L.join("\n") + "\n")
  console.log(`TANDA escrita → ${salida} (${cands.length} tareas, ${L.length} líneas, ${Math.round(total / 1000)}k tokens)`)
  for (const t of cands) console.log(`  ${t.id} · ${t.categoria} · ${t.titulo}`)
}

function cmdCatalogo() {
  const cat = cargarCatalogo()
  const soloCat = val("categoria")
  const filtrado = soloCat ? cat.filter((a) => a.categoria === soloCat) : cat
  if (flag("validar")) {
    const errores = []
    const vistos = new Set()
    const TEMAS = existsSync(join(ORION_HOME, "cerebro", "temas"))
      ? new Set(readdirSync(join(ORION_HOME, "cerebro", "temas")).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)))
      : null
    for (const a of cat) {
      const d = `${a._archivo}:${a.id ?? "?"}`
      /* Dígitos permitidos después de la primera letra: `a11y` es una
         abreviatura estándar y prohibirla era una regla arbitraria mía. */
      if (!a.id || !/^[a-z][a-z0-9]*(\.[a-z0-9-]+)+$/.test(a.id)) errores.push(`${d}: id mal formado`)
      if (vistos.has(a.id)) errores.push(`${d}: id duplicado`)
      vistos.add(a.id)
      if (!NIVELES.includes(a.nivel)) errores.push(`${d}: nivel inválido`)
      if (!["trivial", "normal", "hard"].includes(a.dificultad)) errores.push(`${d}: dificultad inválida`)
      if (!["inline", "1-builder", "ola"].includes(a.ceremonia)) errores.push(`${d}: ceremonia inválida`)
      if (!a.porQue || a.porQue.length < 30) errores.push(`${d}: porQue vacío o demasiado corto para nombrar un daño`)
      if (!a.queHacer?.length) errores.push(`${d}: sin pasos en queHacer`)
      if (!a.aceptacion?.length) errores.push(`${d}: sin aceptación`)
      else if (!a.aceptacion.some((k) => k.comando)) errores.push(`${d}: ninguna aceptación tiene comando`)
      if (a.ceremonia !== "inline" && !a.posee?.length) errores.push(`${d}: sin posee`)
      const texto = JSON.stringify(a)
      const placeholders = [...texto.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1])
      for (const p of placeholders) if (p !== a.porCada) errores.push(`${d}: placeholder {{${p}}} sin porCada que lo instancie`)
      if (a.porCada && !placeholders.length) errores.push(`${d}: porCada "${a.porCada}" pero ningún {{${a.porCada}}} en el texto`)
      if (a.porCada && !FUENTE_PORCADA[a.porCada]) errores.push(`${d}: porCada desconocido "${a.porCada}"`)
      if (TEMAS) for (const c of a.cerebro ?? [])
        if (c.startsWith("tema:") && !TEMAS.has(c.slice(5))) errores.push(`${d}: cita el tema inexistente "${c.slice(5)}"`)
    }
    const porCat = {}
    for (const a of cat) (porCat[a.categoria] ??= []).push(a)
    console.log(errores.length ? `CATÁLOGO INVÁLIDO — ${errores.length} errores` : `CATÁLOGO VÁLIDO`)
    for (const e of errores.slice(0, 40)) console.log(`  ✗ ${e}`)
    if (errores.length > 40) console.log(`  … y ${errores.length - 40} más`)
    console.log(`\n${cat.length} arquetipos en ${Object.keys(porCat).length} categorías:`)
    for (const [c, as] of Object.entries(porCat).sort()) {
      const n = {}
      for (const a of as) n[a.nivel] = (n[a.nivel] ?? 0) + 1
      console.log(`  ${c.padEnd(16)} ${String(as.length).padStart(3)}   ${NIVELES.map((x) => `${x}:${n[x] ?? 0}`).join(" ")}   ${as.filter((a) => a.porCada).length} con porCada`)
    }
    const multiplicador = cat.filter((a) => a.porCada).length
    console.log(`\n${cat.length - multiplicador} arquetipos de una instancia + ${multiplicador} que se instancian por entidad/ruta/rol.`)
    console.log(`Un proyecto con 12 entidades y 15 rutas saca del orden de ${cat.length - multiplicador + multiplicador * 13} tareas concretas.`)
    process.exit(errores.length ? 1 : 0)
  }
  if (flag("listar")) {
    for (const a of filtrado.sort((x, y) => NIVELES.indexOf(x.nivel) - NIVELES.indexOf(y.nivel) || x.id.localeCompare(y.id)))
      console.log(`${a.nivel} ${a.dificultad.padEnd(7)} ${a.id.padEnd(34)} ${a.titulo}`)
    console.log(`\n${filtrado.length} arquetipos`)
    return
  }
  const porCat = {}
  for (const a of cat) (porCat[a.categoria] ??= []).push(a)
  console.log(`catálogo ORION — ${cat.length} arquetipos en ${DIR_CATALOGO}`)
  for (const [c, as] of Object.entries(porCat).sort()) console.log(`  ${c.padEnd(16)} ${as.length}`)
  console.log(`\n--validar para comprobarlo · --listar [--categoria X] para verlo`)
}

const COMANDOS = {
  nuevo: cmdNuevo, perfil: cmdPerfil, generar: cmdGenerar, siguiente: cmdSiguiente,
  ola: cmdOla, brief: cmdBrief, estado: cmdEstado, hecho: cmdHecho,
  bloquear: cmdBloquear, agregar: cmdAgregar, validar: cmdValidar, md: cmdMd, tanda: cmdTanda, narrar: cmdNarrar,
  catalogo: cmdCatalogo,
}

if (!cmd || !COMANDOS[cmd]) {
  const cabecera = readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n")
  console.log(cabecera.slice(2, cabecera.indexOf(" */")).map((l) => l.replace(/^ \* ?/, "")).join("\n"))
  process.exit(cmd ? 1 : 0)
}
COMANDOS[cmd]()
