#!/usr/bin/env node
/**
 * cerebro.mjs — el CEREBRO de ORION: recuperación sobre todo el conocimiento
 * del ecosistema, sin dependencias y sin modelo.
 *
 * POR QUÉ EXISTE: había 265 objetos y ~190 KB de conocimiento repartidos en
 * 10 memorias de proyecto, y la única forma de consultarlos era abrir diez
 * state.json o hacer grep a mano. Un agente que tiene que leer diez archivos
 * para responder una pregunta, en la práctica no los lee: contesta de memoria
 * y se inventa la mitad. Esta herramienta convierte ese corpus en algo que se
 * consulta en milisegundos y devuelve SIEMPRE la cita de dónde salió cada
 * cosa, para que la respuesta sea verificable en vez de verosímil.
 *
 * Uso:
 *   node tools/cerebro.mjs indexar              reconstruye cerebro/indice.json
 *   node tools/cerebro.mjs buscar "<pregunta>"  [--n 8] [--json] [--proyecto x]
 *   node tools/cerebro.mjs tema <slug>          imprime un tema completo
 *   node tools/cerebro.mjs estado               salud del cerebro y huecos
 *   node tools/cerebro.mjs exportar             escribe la vista de la bóveda
 *
 * Cero dependencias a propósito: se ejecuta en cualquier sesión sin instalar
 * nada y su costo es ~0, así que un agente puede llamarla varias veces por
 * turno sin pensar en el gasto.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync, unlinkSync } from "node:fs"
import { join, resolve } from "node:path"

const ORION = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))
const CEREBRO = join(ORION, "cerebro")
const TEMAS_DIR = join(CEREBRO, "temas")
const INDICE = join(CEREBRO, "indice.json")

/* Dónde viven las memorias. Se listan las RAÍCES y se descubren los proyectos
   dentro: así un proyecto nuevo entra al cerebro sin tocar este archivo. */
const RAICES = [
  join(ORION, "memory"),
  "C:\\Users\\Kalel\\prommter\\proyectos",
  "C:\\Users\\Kalel\\fable 5",
]

/* ─────────────────────────────── normalización de texto ─────────────────── */

/* Sin tildes y en minúsculas: quien pregunta escribe "diseno" o "diseño",
   "cajero" o "Cajero", y las dos formas tienen que caer en el mismo token. */
const sinTildes = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

/* Palabras que aparecen en todo y no discriminan nada. Si no se quitan, una
   pregunta larga puntúa por "para que el de la" y el orden se vuelve ruido. */
const VACIAS = new Set(`a al algo alguna algunas alguno algunos ante antes aqui asi aun aunque cada como con contra cual cuales cuando de del desde donde dos e el ella ellas ello ellos en entre era eran es esa esas ese eso esos esta estan estas este esto estos fue fueron ha hace hacer hacia han hasta hay la las le les lo los mas me mi mientras muy nada ni no nos o otra otras otro otros para pero poco por porque que quien quienes se ser si sin sobre solo son su sus tambien tan tanto te tiene tienen todo todos tras un una uno unos ya yo`.split(/\s+/))

const tokenizar = (texto) =>
  sinTildes(String(texto ?? "").toLowerCase())
    .replace(/[^a-z0-9ñ]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 2 && !VACIAS.has(t))

/* Coincidencia tolerante a plural y género sin meter un stemmer entero:
   dos tokens largos que comparten los primeros 5 caracteres cuentan como el
   mismo ("cajero/cajeros", "diseno/disenos", "turno/turnos"). Por debajo de
   5 caracteres se exige igualdad, o "caja" empezaría a pegar con "cajon". */
function emparejan(a, b) {
  if (a === b) return 1
  if (a.length < 5 || b.length < 5) return 0
  const n = Math.min(a.length, b.length, 6)
  if (a.slice(0, n) !== b.slice(0, n)) return 0
  return 0.85 // penalización leve: coincidencia por raíz, no exacta
}

/* ─────────────────────────────── lectura del corpus ────────────────────── */

const META = new Set(["id", "type", "tier", "status", "created", "updated", "lifetime", "impact", "priority", "dependencies", "scope", "measurement_mode"])

const tituloDe = (o) => {
  const bruto = String(o.title ?? o.fact ?? o.task ?? o.rule ?? o.constraint ?? o.risk ?? o.component ?? o.milestone ?? o.metric ?? o.description ?? "").replace(/\s+/g, " ").trim()
  if (bruto.length <= 95) return bruto
  const corte = bruto.slice(0, 95)
  const esp = corte.lastIndexOf(" ")
  return (esp > 55 ? corte.slice(0, esp) : corte) + "…"
}

const textoDe = (o) =>
  Object.entries(o)
    .filter(([k, v]) => !META.has(k) && typeof v === "string")
    .map(([, v]) => v)
    .join(" \n ")

/* Peso por tipo: una Policy o un Constraint son reglas que gobiernan; un
   Pending es trabajo por hacer, no conocimiento. Al preguntar "qué sé de X"
   lo primero que debe salir es lo que manda. */
const PESO_TIPO = { Policy: 1.35, Constraint: 1.3, Knowledge: 1.2, Decision: 1.1, Architecture: 1.1, Risk: 1.05, Roadmap: 0.8, Pending: 0.75 }
/* Lo superado o hecho pesa menos, pero NO se borra: saber que algo se
   descartó y por qué evita volver a proponerlo. */
const PESO_ESTADO = { Superseded: 0.5, Done: 0.6, Archived: 0.45, Deprecated: 0.5 }

function descubrirMemorias() {
  const out = []
  const mirar = (dirMem, proyectoHint) => {
    if (!existsSync(join(dirMem, "state.json"))) return
    try {
      const s = JSON.parse(readFileSync(join(dirMem, "state.json"), "utf8"))
      out.push({ proyecto: s.projectId || proyectoHint, dir: dirMem, state: s })
    } catch (e) {
      console.error(`  aviso: ${dirMem}\\state.json no se pudo leer (${e.message})`)
    }
  }
  for (const raiz of RAICES) {
    if (!existsSync(raiz)) continue
    for (const entrada of readdirSync(raiz)) {
      const p = join(raiz, entrada)
      let esDir = false
      try { esDir = statSync(p).isDirectory() } catch { continue }
      if (!esDir) continue
      // caso A: <raiz>/<proyecto>/state.json  (ORION/memory/<id>)
      mirar(p, entrada)
      // caso B: <raiz>/<proyecto>/memory/<id>/state.json
      const mem = join(p, "memory")
      if (existsSync(mem)) {
        for (const sub of readdirSync(mem)) mirar(join(mem, sub), sub)
      }
    }
  }
  // dedupe por proyecto+dir
  const vistos = new Set()
  return out.filter((m) => { const k = m.proyecto + "|" + m.dir; if (vistos.has(k)) return false; vistos.add(k); return true })
}

/* Frontmatter mínimo: los temas los escriben agentes y personas, así que el
   parser tiene que aguantar comillas, listas en línea y campos ausentes. */
function leerTema(ruta) {
  const raw = readFileSync(ruta, "utf8")
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const fm = {}
  let cuerpo = raw
  if (m) {
    cuerpo = m[2]
    for (const linea of m[1].split(/\r?\n/)) {
      const kv = linea.match(/^([a-zA-Z_]+):\s*(.*)$/)
      if (!kv) continue
      let v = kv[2].trim()
      if (v.startsWith("[") && v.endsWith("]")) {
        v = v.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      } else v = v.replace(/^["']|["']$/g, "")
      fm[kv[1]] = v
    }
  }
  const seccion = (nombre) => {
    const re = new RegExp(`^##\\s*${nombre}\\s*$([\\s\\S]*?)(?=^##\\s|\\Z)`, "im")
    const s = cuerpo.match(re)
    return s ? s[1].trim() : ""
  }
  return {
    slug: fm.slug || ruta.split(/[\\/]/).pop().replace(/\.md$/, ""),
    titulo: fm.titulo || (cuerpo.match(/^#\s*(.+)$/m)?.[1] ?? ""),
    alias: [].concat(fm.alias || []),
    preguntas: [].concat(fm.preguntas || []),
    proyectos: [].concat(fm.proyectos || []),
    confianza: fm.confianza || "media",
    actualizado: fm.actualizado || "",
    respuesta: seccion("Respuesta corta") || seccion("Respuesta"),
    cuerpo,
    ruta,
  }
}

function construirIndice() {
  const memorias = descubrirMemorias()
  const docs = []
  for (const m of memorias) {
    for (const o of m.state.objects || []) {
      const texto = textoDe(o)
      docs.push({
        clase: "objeto",
        clave: `${m.proyecto}/${o.id}`,
        proyecto: m.proyecto,
        id: o.id,
        tipo: o.type,
        estado: o.status,
        titulo: tituloDe(o),
        texto,
        actualizado: o.updated || o.created || "",
        fuente: join(m.dir, "state.json"),
      })
    }
  }
  /* Las métricas son conocimiento, no contabilidad: ahí está medido qué
     modelo falló en qué fase y cuánto costó. Sin esto, "¿me conviene opus
     para un builder visual?" no tiene respuesta en el cerebro aunque el dato
     lleve meses guardado. Se sintetiza UN documento por proyecto: 60 sesiones
     sueltas serían ruido, el agregado es la respuesta. */
  for (const m of memorias) {
    const fm = join(m.dir, "metrics.json")
    if (!existsSync(fm)) continue
    let met
    try { met = JSON.parse(readFileSync(fm, "utf8")) } catch { continue }
    const sesiones = met.sessions || (Array.isArray(met) ? met : [])
    if (!sesiones.length) continue
    const porClave = new Map()
    let fallos = 0, corridas = 0
    for (const s of sesiones) {
      corridas++
      if (s.outcome && s.outcome !== "DONE") fallos++
      for (const mo of s.modelOutcomes || []) {
        const k = `${mo.phase}|${mo.model}`
        const a = porClave.get(k) || { fase: mo.phase, modelo: mo.model, n: 0, tokens: 0, ok: 0, mal: 0 }
        a.n++
        a.tokens += Number(mo.tokens) || 0
        const v = String(mo.verdict || "").toLowerCase()
        if (v === "fail" || v === "escalate") a.mal++; else a.ok++
        porClave.set(k, a)
      }
    }
    const filas = [...porClave.values()].sort((a, b) => b.n - a.n)
    if (!filas.length) continue
    const detalle = filas
      .map((f) => `fase ${f.fase} con ${f.modelo}: ${f.n} corridas, ${f.ok} ok y ${f.mal} fallidas, ${Math.round(f.tokens / Math.max(f.n, 1) / 1000)}k tokens promedio (${Math.round(f.tokens / 1000)}k acumulados)`)
      .join("; ")
    const notas = sesiones.slice(-4).map((s) => s.notes).filter(Boolean).join(" \n ")
    docs.push({
      clase: "metrica",
      clave: `${m.proyecto}/costos`,
      proyecto: m.proyecto,
      id: "costos",
      tipo: "Metrica",
      estado: "Current",
      titulo: `Costo y calibración de modelos medidos en ${m.proyecto} (${corridas} sesiones)`,
      texto: `Costo medido por fase y modelo en el proyecto ${m.proyecto}. Cuánto cuesta y cuánto falla cada modelo (haiku, sonnet, opus) por tipo de trabajo: ${detalle}. Sesiones registradas: ${corridas}, de ellas ${fallos} no terminaron en DONE. Notas de las últimas sesiones: ${notas}`,
      actualizado: met.lastUpdated || "",
      fuente: fm,
    })
  }

  const temas = []
  if (existsSync(TEMAS_DIR)) {
    for (const f of readdirSync(TEMAS_DIR).filter((x) => x.endsWith(".md"))) {
      const t = leerTema(join(TEMAS_DIR, f))
      temas.push(t)
      docs.push({
        clase: "tema",
        clave: `tema/${t.slug}`,
        proyecto: (t.proyectos || []).join(","),
        id: t.slug,
        tipo: "Tema",
        estado: "Current",
        titulo: t.titulo,
        // el título, las preguntas y los alias se repiten para que pesen más:
        // son la superficie por la que alguien de verdad busca.
        texto: [t.titulo, t.titulo, (t.alias || []).join(" "), (t.alias || []).join(" "), (t.preguntas || []).join(" "), (t.preguntas || []).join(" "), t.cuerpo].join(" \n "),
        respuesta: t.respuesta,
        actualizado: t.actualizado,
        fuente: t.ruta,
      })
    }
  }
  // estadísticas de términos para BM25
  const df = new Map()
  let largoTotal = 0
  for (const d of docs) {
    d.tokens = tokenizar(d.titulo + " \n " + d.texto)
    d.largo = d.tokens.length
    largoTotal += d.largo
    d.tf = new Map()
    for (const t of d.tokens) d.tf.set(t, (d.tf.get(t) || 0) + 1)
    for (const t of new Set(d.tokens)) df.set(t, (df.get(t) || 0) + 1)
  }
  return {
    generado: new Date().toISOString(),
    proyectos: memorias.map((m) => ({ proyecto: m.proyecto, dir: m.dir, objetos: (m.state.objects || []).length, version: m.state.version })),
    temas: temas.map((t) => ({ slug: t.slug, titulo: t.titulo, alias: t.alias, preguntas: t.preguntas, proyectos: t.proyectos, confianza: t.confianza })),
    docs: docs.map((d) => ({ ...d, tf: Object.fromEntries(d.tf), tokens: undefined })),
    df: Object.fromEntries(df),
    N: docs.length,
    largoPromedio: largoTotal / Math.max(docs.length, 1),
  }
}

function cargarIndice({ reconstruirSiViejo = true } = {}) {
  if (!existsSync(INDICE)) return construirIndiceYGuardar()
  const idx = JSON.parse(readFileSync(INDICE, "utf8"))
  if (reconstruirSiViejo) {
    // Si alguna memoria o algún tema cambió después del índice, se reconstruye:
    // un cerebro que responde con datos viejos es peor que uno que no responde.
    const tIdx = Date.parse(idx.generado)
    let viejo = false
    for (const p of idx.proyectos || []) {
      const f = join(p.dir, "state.json")
      try { if (statSync(f).mtimeMs > tIdx) viejo = true } catch {}
    }
    if (existsSync(TEMAS_DIR)) for (const f of readdirSync(TEMAS_DIR)) {
      try { if (statSync(join(TEMAS_DIR, f)).mtimeMs > tIdx) viejo = true } catch {}
    }
    if (viejo) return construirIndiceYGuardar()
  }
  return idx
}

function construirIndiceYGuardar() {
  const idx = construirIndice()
  mkdirSync(CEREBRO, { recursive: true })
  writeFileSync(INDICE, JSON.stringify(idx, null, 1))
  return idx
}

/* ─────────────────────────────── búsqueda ──────────────────────────────── */

function buscar(pregunta, { n = 8, proyecto = null, soloTemas = false } = {}) {
  const idx = cargarIndice()
  const q = tokenizar(pregunta)
  if (!q.length) return { pregunta, resultados: [], idx }
  const k1 = 1.5, b = 0.75
  const N = idx.N || 1
  const res = []
  for (const d of idx.docs) {
    if (proyecto && d.proyecto !== proyecto && d.clase !== "tema") continue
    if (soloTemas && d.clase !== "tema") continue
    let score = 0
    const tf = d.tf || {}
    const claves = Object.keys(tf)
    for (const qt of q) {
      let mejor = 0
      for (const dt of claves) {
        const sim = emparejan(qt, dt)
        if (!sim) continue
        const f = tf[dt] * sim
        const dfT = idx.df[dt] || 1
        const idf = Math.log(1 + (N - dfT + 0.5) / (dfT + 0.5))
        const norm = (f * (k1 + 1)) / (f + k1 * (1 - b + b * (d.largo / (idx.largoPromedio || 1))))
        mejor = Math.max(mejor, idf * norm)
      }
      score += mejor
    }
    if (score <= 0) continue
    // un tema es una respuesta ya curada: vale más que el objeto crudo del que salió
    if (d.clase === "tema") score *= 2.1
    score *= PESO_TIPO[d.tipo] ?? 1
    score *= PESO_ESTADO[d.estado] ?? 1
    res.push({ ...d, score })
  }
  res.sort((a, b2) => b2.score - a.score)
  return { pregunta, resultados: res.slice(0, n), total: res.length, idx }
}

/* ─────────────────────────────── comandos ──────────────────────────────── */

const recorta = (s, n) => { const t = String(s ?? "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n) + "…" : t }

const cmd = process.argv[2]
const args = process.argv.slice(3)
const flag = (nombre, def = null) => { const i = args.indexOf("--" + nombre); return i >= 0 ? args[i + 1] : def }
const tiene = (nombre) => args.includes("--" + nombre)

if (cmd === "indexar") {
  const idx = construirIndiceYGuardar()
  console.log(`cerebro indexado: ${idx.N} documentos (${idx.docs.filter((d) => d.clase === "tema").length} temas, ${idx.docs.filter((d) => d.clase === "objeto").length} objetos) de ${idx.proyectos.length} memorias`)
  for (const p of idx.proyectos) console.log(`  ${p.proyecto.padEnd(20)} ${String(p.objetos).padStart(3)} objetos  v${p.version}`)
} else if (cmd === "buscar") {
  const pregunta = args.filter((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--n" && args[args.indexOf(a) - 1] !== "--proyecto").join(" ")
  const r = buscar(pregunta, { n: Number(flag("n", 8)), proyecto: flag("proyecto"), soloTemas: tiene("temas") })
  if (tiene("json")) { console.log(JSON.stringify({ pregunta: r.pregunta, total: r.total, resultados: r.resultados.map(({ tf, ...x }) => x) }, null, 1)); }
  else {
    if (!r.resultados.length) { console.log(`sin resultados para "${pregunta}". El cerebro NO sabe de esto: dilo así en vez de improvisar.`); }
    for (const x of r.resultados) {
      const cab = x.clase === "tema" ? `TEMA ${x.id}` : `${x.proyecto}/${x.id} · ${x.tipo}${x.estado && x.estado !== "Current" && x.estado !== "Active" && x.estado !== "Accepted" ? " (" + x.estado + ")" : ""}`
      console.log(`\n[${x.score.toFixed(2)}] ${cab}\n  ${x.titulo}`)
      if (x.respuesta) console.log(`  → ${recorta(x.respuesta, 400)}`)
      else console.log(`  ${recorta(x.texto, 320)}`)
      console.log(`  cita: ${x.fuente}`)
    }
  }
} else if (cmd === "tema") {
  const slug = args[0]
  const f = join(TEMAS_DIR, slug + ".md")
  if (!existsSync(f)) { console.error(`no existe el tema "${slug}". Temas: ` + (existsSync(TEMAS_DIR) ? readdirSync(TEMAS_DIR).map((x) => x.replace(/\.md$/, "")).join(", ") : "(ninguno)")); process.exit(1) }
  console.log(readFileSync(f, "utf8"))
} else if (cmd === "estado") {
  const idx = construirIndiceYGuardar()
  const temas = idx.docs.filter((d) => d.clase === "tema")
  const objetos = idx.docs.filter((d) => d.clase === "objeto")
  console.log(`CEREBRO ORION — ${idx.N} documentos`)
  console.log(`  temas curados: ${temas.length}`)
  console.log(`  objetos de memoria: ${objetos.length} en ${idx.proyectos.length} proyectos`)
  const pobres = objetos.filter((o) => (o.texto || "").trim().length < 120)
  console.log(`  objetos pobres (<120 caracteres, candidatos a curar o archivar): ${pobres.length}`)
  if (pobres.length) for (const p of pobres.slice(0, 12)) console.log(`     ${p.clave} — ${recorta(p.titulo, 60) || "(sin título)"}`)
  // cobertura: ¿qué proyectos no están citados por ningún tema?
  const citados = new Set(temas.flatMap((t) => String(t.proyecto || "").split(",").map((s) => s.trim()).filter(Boolean)))
  const sinTema = idx.proyectos.map((p) => p.proyecto).filter((p) => !citados.has(p))
  console.log(`  proyectos sin ningún tema transversal: ${sinTema.length ? sinTema.join(", ") : "ninguno ✔"}`)
  const alias = temas.flatMap((t) => (t.texto.match(/\S+/g) || []).length)
  console.log(`  índice generado: ${idx.generado}`)
} else if (cmd === "probar") {
  /* Prueba de regresión del cerebro. No mide si "sabe mucho": mide si
     RESPONDE a cómo se pregunta de verdad. Un tema perfecto con alias malos
     falla aquí, y debe fallar: nadie lo va a encontrar nunca. */
  const archivo = flag("archivo", join(CEREBRO, "preguntas-de-prueba.md"))
  if (!existsSync(archivo)) { console.error(`no existe ${archivo}`); process.exit(1) }
  const crudo = readFileSync(archivo, "utf8")
  // solo la sección "## Preguntas": la prosa de arriba también usa "=>" al
  // explicar el formato, y sin este corte la explicación se probaba a sí misma
  const casos = (crudo.split(/^##\s*Preguntas\s*$/m)[1] ?? crudo)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.includes("=>") && !l.startsWith("#") && !l.startsWith("<!--"))
    .map((l) => { const [q, esperado] = l.split("=>"); return { q: q.trim(), esperado: esperado.trim() } })
  let ok = 0
  const fallos = []
  for (const c of casos) {
    const r = buscar(c.q, { n: 3 })
    const top = r.resultados[0]
    const acierta = top && (top.id === c.esperado || top.clave === c.esperado || String(top.clave).endsWith("/" + c.esperado))
    const enTop3 = r.resultados.some((x) => x.id === c.esperado || x.clave === c.esperado)
    if (acierta) ok++
    else fallos.push({ ...c, top: top ? `${top.clave} (${top.score.toFixed(1)})` : "sin resultado", enTop3 })
  }
  const pct = Math.round((ok / Math.max(casos.length, 1)) * 100)
  console.log(`PRUEBA DEL CEREBRO: ${ok}/${casos.length} preguntas responden con lo esperado (${pct}%)\n`)
  for (const f of fallos) {
    console.log(`  ✗ "${f.q}"`)
    console.log(`     esperaba: ${f.esperado}${f.enTop3 ? " (está en el top 3, pero no primero: sube sus alias)" : "  ← NO EXISTE o es invisible: hay que cosecharlo"}`)
    console.log(`     devolvió: ${f.top}`)
  }
  if (!fallos.length) console.log("  todo verde.")
  process.exitCode = fallos.length ? 1 : 0
} else if (cmd === "exportar") {
  const idx = construirIndiceYGuardar()
  const destino = flag("destino", "C:\\Users\\Kalel\\ORION-Vault\\Cerebro")
  mkdirSync(destino, { recursive: true })
  for (const f of readdirSync(destino).filter((x) => x.endsWith(".md"))) unlinkSync(join(destino, f))
  const temas = existsSync(TEMAS_DIR) ? readdirSync(TEMAS_DIR).filter((x) => x.endsWith(".md")).map((f) => leerTema(join(TEMAS_DIR, f))) : []
  for (const t of temas) {
    writeFileSync(join(destino, `TEMA-${t.slug}.md`), readFileSync(t.ruta, "utf8"))
  }
  const lineas = [
    "# Cerebro ORION — capa transversal",
    "",
    `Generado ${idx.generado} por \`tools/cerebro.mjs exportar\`. FUENTE DE VERDAD: \`ORION/cerebro/temas/\`.`,
    "Esta carpeta es una vista: lo que se edite aquí se pierde en la próxima exportación.",
    "",
    `Corpus indexado: **${idx.N} documentos** — ${temas.length} temas curados sobre ${idx.docs.filter((d) => d.clase === "objeto").length} objetos de ${idx.proyectos.length} memorias.`,
    "",
    "## Temas",
    "",
  ]
  for (const t of temas.sort((a, b) => a.slug.localeCompare(b.slug))) {
    lineas.push(`### [[TEMA-${t.slug}]] — ${t.titulo}`)
    if (t.respuesta) lineas.push("", recorta(t.respuesta, 300))
    if (t.preguntas?.length) lineas.push("", "Responde: " + t.preguntas.map((p) => `*${p}*`).join(" · "))
    if (t.proyectos?.length) lineas.push("", "Pagado en: " + t.proyectos.join(", "))
    lineas.push("")
  }
  lineas.push("## Memorias que alimentan el cerebro", "")
  for (const p of idx.proyectos.sort((a, b) => b.objetos - a.objetos)) lineas.push(`- **${p.proyecto}** — ${p.objetos} objetos (v${p.version}) → \`Proyectos/${p.proyecto}/_INDEX.md\``)
  lineas.push("", "## Cómo se consulta", "", "```bash", 'node C:\\Users\\Kalel\\ORION\\tools\\cerebro.mjs buscar "tu pregunta"', "```", "")
  writeFileSync(join(destino, "_CEREBRO.md"), lineas.join("\n"))
  console.log(`exportados ${temas.length} temas + _CEREBRO.md a ${destino}`)
} else {
  console.log(`cerebro.mjs — recuperación sobre todo el conocimiento de ORION

  indexar                       reconstruye el índice
  buscar "<pregunta>" [--n 8] [--json] [--proyecto <id>] [--temas]
  tema <slug>                   imprime un tema completo
  estado                        salud del cerebro, objetos pobres y huecos
  exportar [--destino <dir>]    escribe la vista de la bóveda

El índice se reconstruye solo si alguna memoria cambió después de generarse.`)
}
