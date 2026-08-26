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
  "C:\\Users\\Kalel\\prommter\\memory", // la agencia guarda su memoria en la raíz, no bajo proyectos\
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
  /* LO ARCHIVADO SIGUE SIENDO CONOCIMIENTO. Curar saca el objeto de
     `objects[]` y lo deja en `archives[]` con su motivo y una nota — placita
     tiene 32 así. Si el cerebro solo mirara `objects[]`, cada curación le
     borraría memoria: dejaría de saber qué se descartó y por qué, que es
     justo lo que evita volver a proponerlo. Se indexan con peso bajo (están
     superados, no vigentes) pero se indexan. */
  for (const m of memorias) {
    for (const a of m.state.archives || []) {
      const nota = [a.note, a.reason].filter(Boolean).join(" · ")
      if (!nota) continue
      docs.push({
        clase: "archivado",
        clave: `${m.proyecto}/${a.archivedId}`,
        proyecto: m.proyecto,
        id: a.archivedId,
        tipo: a.archivedType || "Archivado",
        estado: "Archived",
        titulo: `[archivado ${a.reason || ""}] ${String(a.note || "").replace(/\s+/g, " ").slice(0, 90)}`,
        texto: `Objeto ${a.archivedId} archivado el ${a.archivedAt || "?"} por: ${a.reason || "sin motivo"}. ${nota}`,
        actualizado: a.archivedAt || "",
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
        /* UNA MUERTE DE SESION NO ES UN FALLO DEL MODELO. Si se cuentan juntas,
           la calibracion miente: en estanco, build:page con sonnet se leia como
           4 fallidas de 10 cuando en realidad son 0 de 6 — las otras 4 fueron
           el limite de sesion matando spawns vivos. El ecosistema las marca de
           dos formas incompatibles (campo `infraDeath` en estanco, sufijo
           `:infra-death` en la fase en wrd), asi que aqui se reconocen las dos
           y se apartan en su propia cuenta. */
        const faseCruda = String(mo.phase || "")
        const porSufijo = /:infra-death$/i.test(faseCruda)
        const esInfra = mo.infraDeath === true || porSufijo
        const fase = porSufijo ? faseCruda.replace(/:infra-death$/i, "") : faseCruda
        const k = `${fase}|${mo.model}`
        const a = porClave.get(k) || { fase, modelo: mo.model, n: 0, tokens: 0, ok: 0, mal: 0, infra: 0 }
        a.tokens += Number(mo.tokens) || 0
        if (esInfra) { a.infra++; porClave.set(k, a); continue }
        a.n++
        const v = String(mo.verdict || "").toLowerCase()
        if (v === "fail" || v === "escalate") a.mal++; else a.ok++
        porClave.set(k, a)
      }
    }
    const filas = [...porClave.values()].sort((a, b) => b.n - a.n)
    if (!filas.length) continue
    const detalle = filas
      .map((f) => `fase ${f.fase} con ${f.modelo}: ${f.n} corridas juzgables, ${f.ok} ok y ${f.mal} fallidas${f.infra ? ` (+${f.infra} muertes de sesion, que NO cuentan como fallo del modelo)` : ""}, ${Math.round(f.tokens / Math.max(f.n + f.infra, 1) / 1000)}k tokens promedio (${Math.round(f.tokens / 1000)}k acumulados)`)
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

  /* PUNTEROS A DOCUMENTOS. La memoria guarda lecciones; la doctrina larga vive
     en archivos (RFCs, prompts de diseño, bases de caja, tarjetas de trabajo) y
     el cerebro no podía responder "¿dónde está escrito esto?". Se indexan solo
     como PUNTEROS —título, encabezados y primer párrafo— y con peso bajo: si se
     metiera un prompt de 100 KB entero, cada búsqueda devolvería fragmentos de
     prompt en lugar de la respuesta curada. El puntero orienta; el tema responde. */
  const cfgDocs = join(CEREBRO, "documentos.json")
  if (existsSync(cfgDocs)) {
    let cfg
    try { cfg = JSON.parse(readFileSync(cfgDocs, "utf8")) } catch { cfg = null }
    for (const entrada of cfg?.documentos ?? []) {
      const archivos = []
      try {
        if (!existsSync(entrada.ruta)) continue
        if (statSync(entrada.ruta).isDirectory()) {
          for (const f of readdirSync(entrada.ruta)) {
            if ((entrada.extensiones ?? [".md"]).some((e) => f.endsWith(e))) archivos.push(join(entrada.ruta, f))
          }
        } else archivos.push(entrada.ruta)
      } catch { continue }
      for (const ruta of archivos) {
        let raw
        try { raw = readFileSync(ruta, "utf8") } catch { continue }
        const nombre = ruta.split(/[\\/]/).pop()
        const h1 = raw.match(/^#\s+(.+)$/m)?.[1] ?? nombre.replace(/\.md$/, "")
        const encabezados = (raw.match(/^#{2,3}\s+(.+)$/gm) ?? []).map((h) => h.replace(/^#+\s*/, "")).slice(0, 25)
        // primer párrafo real: se saltan frontmatter, citas y encabezados
        const cuerpo = raw.replace(/^---[\s\S]*?---/, "").split(/\r?\n/)
        let primero = ""
        for (const l of cuerpo) {
          const t = l.trim()
          if (!t || t.startsWith("#") || t.startsWith(">") || t.startsWith("|") || t.startsWith("```")) continue
          primero = t
          break
        }
        docs.push({
          clase: "documento",
          clave: `doc/${nombre}`,
          proyecto: "",
          id: nombre,
          tipo: "Documento",
          estado: "Current",
          titulo: h1,
          texto: [entrada.rol, h1, encabezados.join(" · "), primero].filter(Boolean).join(" \n "),
          actualizado: "",
          fuente: ruta,
        })
      }
    }
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
    /* También los documentos y su lista. Sin esto, agregar un documento nuevo
       no reconstruía nada y el documento quedaba invisible para siempre — que
       es exactamente el fallo silencioso que este cerebro existe para evitar. */
    try { if (statSync(join(CEREBRO, "documentos.json")).mtimeMs > tIdx) viejo = true } catch {}
    for (const d of idx.docs ?? []) {
      if (d.clase !== "documento") continue
      try { if (statSync(d.fuente).mtimeMs > tIdx) viejo = true } catch {}
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
    // un documento solo orienta ("está escrito en tal archivo"): nunca debe
    // desplazar a un tema ni a una lección con evidencia
    if (d.clase === "documento") score *= 0.55
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
      const cab = x.clase === "tema" ? `TEMA ${x.id}`
        : x.clase === "documento" ? `DOCUMENTO ${x.id}`
        : `${x.proyecto}/${x.id} · ${x.tipo}${x.estado && x.estado !== "Current" && x.estado !== "Active" && x.estado !== "Accepted" ? " (" + x.estado + ")" : ""}`
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
  /* Un Pending o un Roadmap corto es correcto ("Definir el costo de domicilio
     por zona" no necesita más). Solo se señalan como pobres los tipos que
     PROMETEN sustancia: si una Knowledge cabe en dos líneas, o no se entendió
     o no valía la pena guardarla. */
  const CON_SUSTANCIA = new Set(["Knowledge", "Decision", "Policy", "Constraint", "Architecture", "Risk"])
  const pobres = objetos.filter((o) => CON_SUSTANCIA.has(o.tipo) && (o.texto || "").trim().length < 120)
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
} else if (cmd === "citas") {
  /* La promesa entera del cerebro es que cada afirmación se puede comprobar
     abriendo algo. Esa promesa no se puede sostener a mano: un tema cita 15
     objetos y hay una docena de temas. Aquí se verifica mecánicamente que cada
     `proyecto/ID` citado EXISTE de verdad. Una cita rota no es un detalle: es
     una afirmación sin respaldo dentro de la fuente que se usa para decidir. */
  const idx = cargarIndice()
  const claves = new Set(idx.docs.filter((d) => d.clase === "objeto").map((d) => d.clave))
  // Un objeto archivado NO es una cita rota: existe, está registrado en
  // `archives[]` con su motivo, y sigue siendo comprobable. Solo se avisa,
  // para que quien lea el tema sepa que está citando algo superado.
  const archivadas = new Set(idx.docs.filter((d) => d.clase === "archivado").map((d) => d.clave))
  const proyectos = new Set(idx.proyectos.map((p) => p.proyecto))
  const slugs = new Set(idx.docs.filter((d) => d.clase === "tema").map((d) => d.id))
  if (!existsSync(TEMAS_DIR)) { console.log("no hay temas todavía"); process.exit(0) }
  let totales = 0, rotas = 0
  const avisosGlobales = []
  for (const f of readdirSync(TEMAS_DIR).filter((x) => x.endsWith(".md"))) {
    const raw = readFileSync(join(TEMAS_DIR, f), "utf8")
    const malas = []
    const avisos = []
    // citas a objetos de memoria: proyecto/ID-000
    for (const m of raw.matchAll(/\b([a-z_][a-z0-9-]{2,24})\/([A-Z]{2,6}-\d{2,3})\b/g)) {
      const [cita, proyecto, id] = [m[0], m[1], m[2]]
      totales++
      if (!proyectos.has(proyecto)) { malas.push(`${cita} — el proyecto "${proyecto}" no existe`); rotas++ }
      else if (archivadas.has(`${proyecto}/${id}`)) avisos.push(`${cita} — está ARCHIVADO (sigue verificable, pero es conocimiento superado: revisa si el tema debe decirlo)`)
      else if (!claves.has(`${proyecto}/${id}`)) { malas.push(`${cita} — el proyecto existe pero no tiene ese objeto`); rotas++ }
    }
    // enlaces a otros temas: [[TEMA-slug]]
    for (const m of raw.matchAll(/\[\[TEMA-([a-z0-9-]+)\]\]/g)) {
      totales++
      if (!slugs.has(m[1])) { malas.push(`[[TEMA-${m[1]}]] — ese tema no existe (¿aún no escrito?)`); rotas++ }
    }
    if (malas.length) {
      console.log(`\n✗ ${f}`)
      for (const x of malas) console.log(`    ${x}`)
    }
  }
  console.log(`\n${totales} citas verificadas · ${rotas} rotas · ${totales - rotas} comprobables`)
  if (!rotas) console.log("todas las citas apuntan a algo que existe.")
  process.exitCode = rotas ? 1 : 0
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
  /* Vista inversa: desde un proyecto, qué temas lo tocan. Es la que cierra el
     grafo — sin ella la bóveda vuelve a leerse por silos, que es justo lo que
     se estaba arreglando. */
  lineas.push("## Qué temas tocan cada proyecto", "")
  const porProyecto = new Map()
  for (const t of temas) for (const p of t.proyectos ?? []) {
    const k = String(p).trim()
    if (!k) continue
    if (!porProyecto.has(k)) porProyecto.set(k, [])
    porProyecto.get(k).push(t)
  }
  for (const p of idx.proyectos.sort((a, b) => b.objetos - a.objetos)) {
    const suyos = porProyecto.get(p.proyecto) ?? []
    lineas.push(`- **${p.proyecto}** — ${suyos.length ? suyos.map((t) => `[[TEMA-${t.slug}]]`).join(" · ") : "_sin ningún tema todavía: su conocimiento sigue encerrado_"}`)
  }
  lineas.push("")

  lineas.push("## Memorias que alimentan el cerebro", "")
  for (const p of idx.proyectos.sort((a, b) => b.objetos - a.objetos)) lineas.push(`- **${p.proyecto}** — ${p.objetos} objetos (v${p.version}) → \`Proyectos/${p.proyecto}/_INDEX.md\``)
  lineas.push("", "## Cómo se consulta", "", "```bash", 'node C:\\Users\\Kalel\\ORION\\tools\\cerebro.mjs buscar "tu pregunta"', "```", "")
  writeFileSync(join(destino, "_CEREBRO.md"), lineas.join("\n"))
  console.log(`exportados ${temas.length} temas + _CEREBRO.md a ${destino}`)
} else if (cmd === "ruta") {
  /* RUTA — devuelve COORDENADAS, no texto.
     `buscar` contesta la pregunta; `ruta` contesta *dónde está escrito*, en un
     paquete que cabe en 25 líneas y que trae, por cada acierto, el comando
     exacto para abrir SOLO ese trozo. Existe porque el orquestador no debería
     leer archivos enteros para enterarse de una regla: con esto lee 30 líneas
     acotadas en vez de 900 (RFC-0004 N4-R10, privilegio mínimo).
     Además barre la bóveda de Obsidian buscando notas ESCRITAS A MANO, que no
     están en ningún state.json y por tanto no las ve ninguna otra herramienta. */
  const pregunta = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--n" && args[i - 1] !== "--baul").join(" ")
  if (!pregunta) { console.error('uso: cerebro.mjs ruta "<pregunta>" [--n 6] [--baul <ruta>]'); process.exit(1) }
  const nMax = Number(flag("n", 6))
  const BAUL = flag("baul", join(ORION, "..", "ORION-Vault"))
  const terminos = [...new Set((pregunta.toLowerCase().match(/[a-záéíóúüñ0-9]{4,}/g) ?? []))]

  /* La línea del archivo donde más términos de la pregunta coinciden. Es lo que
     convierte una cita de archivo en una cita de archivo:línea. */
  const lineaDe = (archivo) => {
    try {
      const ls = readFileSync(archivo, "utf8").split("\n")
      let mejor = { i: -1, hits: 0 }
      for (let i = 0; i < ls.length; i++) {
        const bajo = ls[i].toLowerCase()
        const hits = terminos.filter((t) => bajo.includes(t)).length
        if (hits > mejor.hits) mejor = { i, hits }
      }
      return mejor.i >= 0 ? mejor.i + 1 : null
    } catch { return null }
  }
  const ventana = (archivo, linea, radio = 15) => {
    const a = Math.max(1, linea - radio), b = linea + radio
    return `sed -n '${a},${b}p' "${archivo}"`
  }

  const r = buscar(pregunta, { n: nMax })
  const L = []
  const contar = { tema: 0, objeto: 0, documento: 0 }
  for (const x of r.resultados) contar[x.clase] = (contar[x.clase] ?? 0) + 1

  for (const x of r.resultados) {
    if (x.clase === "tema") {
      L.push(`TEMA ${x.id}   ← respuesta YA CURADA: es restricción del run, no sugerencia`)
      L.push(`  dice: ${recorta(x.respuesta ?? x.texto, 150)}`)
      L.push(`  abrir: node "${join(ORION, "tools", "cerebro.mjs")}" tema ${x.id}`)
    } else if (x.clase === "documento") {
      const l = lineaDe(x.fuente)
      L.push(`DOC  ${recorta(x.titulo, 70)}`)
      L.push(`  dice: ${recorta(x.texto, 130)}`)
      L.push(`  abrir: ${l ? ventana(x.fuente, l) : `head -60 "${x.fuente}"`}`)
    } else {
      L.push(`OBJ  ${x.proyecto}/${x.id} · ${x.tipo}`)
      L.push(`  dice: ${recorta(x.texto, 150)}`)
      L.push(`  abrir: node -e "const s=require('${x.fuente.replace(/\\/g, "/")}');const o=s.objects.find(o=>o.id==='${x.id}');console.log(JSON.stringify(o,null,1))"`)
    }
  }

  /* Notas escritas a mano en la bóveda. Todo lo que genera ORION lleva marca
     (`id:` de frontmatter, `_INDEX`, `_CEREBRO`, `GENERADO`); lo que no la
     lleva lo escribió una persona, no existe en ninguna memoria, y es
     justamente lo que ninguna otra herramienta encuentra. */
  const propias = []
  const GENERADO = /^(id:|# ORION|> ?GENERADO|Generado de state\.json)/m
  /* `export-vault.mjs` escribe estas tres carpetas enteras: son copias de lo
     que el índice ya cubre. Barrerlas devolvería el mismo tema dos veces y
     ahogaría lo único que este barrido aporta — lo que escribió una persona. */
  const GENERADAS = new Set(["Cerebro", "Proyectos", "Sistema"])
  const barrer = (dir, prof = 0) => {
    if (prof > 4 || !existsSync(dir)) return
    let entradas = []
    try { entradas = readdirSync(dir) } catch { return }
    for (const e of entradas) {
      if (e.startsWith(".")) continue
      if (prof === 0 && GENERADAS.has(e)) continue
      const p = join(dir, e)
      let st; try { st = statSync(p) } catch { continue }
      if (st.isDirectory()) { barrer(p, prof + 1); continue }
      if (!e.endsWith(".md") || st.size > 400_000) continue
      if (/^_(INDEX|CEREBRO|INICIO|BRIEF)/.test(e)) continue
      let txt; try { txt = readFileSync(p, "utf8") } catch { continue }
      if (GENERADO.test(txt.slice(0, 400))) continue
      const bajo = txt.toLowerCase()
      const hits = terminos.filter((t) => bajo.includes(t)).length
      if (hits >= Math.max(2, Math.ceil(terminos.length / 3))) propias.push({ p, hits })
    }
  }
  if (!tiene("sin-baul")) barrer(BAUL)
  propias.sort((a, b) => b.hits - a.hits)
  for (const { p, hits } of propias.slice(0, 3)) {
    const l = lineaDe(p)
    L.push(`BAÚL ${p.replace(BAUL, "").replace(/^[\\/]/, "")}   ← nota escrita a mano: no está en ninguna memoria`)
    L.push(`  coincide en ${hits} términos`)
    L.push(`  abrir: ${l ? ventana(p, l) : `head -60 "${p}"`}`)
  }

  if (!L.length) {
    console.log(`RUTA · "${pregunta}"\n\nSIN RUTA. El ecosistema no tiene nada escrito sobre esto: es un HUECO.`)
    console.log(`Dilo así en vez de improvisar, y cosecha la lección al cerrar (orion-harvester).`)
    process.exit(0)
  }
  console.log(`RUTA · "${pregunta}"  —  ${contar.tema ?? 0} temas · ${contar.objeto ?? 0} objetos · ${contar.documento ?? 0} documentos${propias.length ? ` · ${Math.min(propias.length, 3)} notas del baúl` : ""}`)
  console.log(`Abre solo lo que vayas a usar. Nadie más vuelve a buscar: lo que necesiten los agentes, se EXCERPTA de aquí a sus briefs.\n`)
  console.log(L.join("\n"))
} else {
  console.log(`cerebro.mjs — recuperación sobre todo el conocimiento de ORION

  indexar                       reconstruye el índice
  buscar "<pregunta>" [--n 8] [--json] [--proyecto <id>] [--temas]
  ruta "<pregunta>" [--n 6]     COORDENADAS en vez de texto: archivo:línea y el
                                comando para abrir solo ese trozo (+ notas a mano
                                del baúl de Obsidian)
  tema <slug>                   imprime un tema completo
  estado                        salud del cerebro, objetos pobres y huecos
  exportar [--destino <dir>]    escribe la vista de la bóveda

El índice se reconstruye solo si alguna memoria cambió después de generarse.`)
}
