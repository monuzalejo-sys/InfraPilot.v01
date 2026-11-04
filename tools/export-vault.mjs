#!/usr/bin/env node
/**
 * export-vault.mjs — Exporta un vault Obsidian COMPLETO del ecosistema ORION
 * a una carpeta externa al repo: documentación del sistema (estándar, RFCs,
 * agents, skills) + la memoria de TODOS los proyectos con sus enlaces.
 *
 * Uso: node tools/export-vault.mjs <carpeta-destino>
 * Ej.:  node tools/export-vault.mjs "$ORION_HOME/../ORION-Vault"
 *
 * Regenerable: cada ejecución reescribe el destino. Cero dependencias.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync, statSync } from "node:fs"
import { join, basename, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const dest = process.argv[2]
if (!dest) { console.error("uso: node export-vault.mjs <carpeta-destino>"); process.exit(1) }

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const generator = join(root, "tools", "generate-vault.mjs")

const copyIf = (src, dst) => { if (existsSync(src)) { mkdirSync(dirname(dst), { recursive: true }); copyFileSync(src, dst); return 1 } return 0 }
const copyDirMd = (srcDir, dstDir) => {
  if (!existsSync(srcDir)) return 0
  mkdirSync(dstDir, { recursive: true })
  let n = 0
  for (const f of readdirSync(srcDir)) if (f.endsWith(".md")) n += copyIf(join(srcDir, f), join(dstDir, f))
  return n
}

// ── 1. Sistema: estándar, RFCs, agents, skills ─────────────────────
let sys = 0
sys += copyIf(join(root, "ORION_STANDARD.md"), join(dest, "Sistema", "ORION_STANDARD.md"))
sys += copyIf(join(root, "README.md"), join(dest, "Sistema", "README.md"))
if (existsSync(join(root, "RFC")))
  sys += copyDirMd(join(root, "RFC"), join(dest, "Sistema", "RFC"))
sys += copyDirMd(join(root, "runtime", "agents"), join(dest, "Sistema", "Agents"))
sys += copyDirMd(join(root, "runtime", "skills"), join(dest, "Sistema", "Skills"))
sys += copyIf(join(root, "Skills", "autonomous-memory-manager", "SPECIFICATION.md"),
  join(dest, "Sistema", "AMM-SPECIFICATION.md"))
sys += copyIf(join(root, "Skills", "autonomous-memory-manager", "README.md"),
  join(dest, "Sistema", "AMM-README.md"))

// ── 2. Proyectos: cada memoria con su vault enlazado ───────────────
// Además de las memorias bajo ORION/memory/, se pueden pasar memorias de
// proyectos que viven en OTRO repo como argumentos extra:
//   node tools/export-vault.mjs <destino> /ruta/otro-repo/memory/<projectId>
// Sin esto, un proyecto fuera de ORION queda invisible en el vault.
const memRoot = join(root, "memory")

/* DESCUBRIMIENTO AUTOMÁTICO de memorias que viven fuera de ORION.
   Antes había que pasarlas a mano como argumentos, y bastaba olvidar una para
   que ese proyecto quedara invisible en la bóveda: así fue como la vista de
   villa-broaster y placita se quedó semanas atrás de su memoria real. Ahora se
   barren las raíces conocidas y entra todo lo que tenga state.json; los
   argumentos extra siguen funcionando para casos sueltos. */
// prommter/ se escanea completo: cada repo con memory/<id>/state.json real entra,
// sin listar repos a mano y sin ninguna ruta absoluta de plataforma. Si prommter/
// no existe todavía, el barrido de abajo simplemente lo salta.
const RAICES_EXTERNAS = [join(root, "prommter")]
const descubiertas = []
for (const raiz of RAICES_EXTERNAS) {
  if (!existsSync(raiz)) continue
  for (const entrada of readdirSync(raiz)) {
    const mem = join(raiz, entrada, "memory")
    if (!existsSync(mem)) continue
    for (const sub of readdirSync(mem)) {
      const d = join(mem, sub)
      try { if (statSync(d).isDirectory() && existsSync(join(d, "state.json"))) descubiertas.push(d) } catch {}
    }
  }
}
const externas = [...new Set([...descubiertas, ...process.argv.slice(3)])].filter((p) => existsSync(join(p, "state.json")))
const internas = readdirSync(memRoot)
  .map((proj) => join(memRoot, proj))
  .filter((d) => statSync(d).isDirectory() && existsSync(join(d, "state.json")))

/* Dos memorias distintas pueden compartir projectId — hoy pasa con "placita"
   (prommter/placita y prommter/mercaplazarepo). Aguas abajo cada una escribe en
   `Proyectos/<basename>/`, así que sin resolverlo la segunda pisaría en el vault
   la carpeta de la primera en silencio. Mismo criterio que cerebro.mjs y
   baul.mjs: gana la memoria con MÁS ids (objetos + archivados), y el mtime solo
   deshace empates exactos — desempatar por fecha hizo ganar una vez una copia
   de 38 ids sobre la real de 115. El resto se avisa por
   consola en vez de pisarse sin decir nada. */
const porNombre = new Map()
for (const d of [...internas, ...externas]) {
  const nombre = basename(d)
  let mtime = 0, ids = 0
  try { mtime = statSync(join(d, "state.json")).mtimeMs } catch {}
  try { const j = JSON.parse(readFileSync(join(d, "state.json"), "utf8"))
        ids = (j.objects || []).length + (j.archives || []).length } catch {}
  const previo = porNombre.get(nombre)
  if (!previo || ids > previo.ids || (ids === previo.ids && mtime >= previo.mtime)) {
    if (previo) console.error(`  aviso: "${nombre}" duplicado — gana ${d} (${ids} ids), se ignora ${previo.dir} (${previo.ids})`)
    porNombre.set(nombre, { dir: d, mtime, ids })
  } else {
    console.error(`  aviso: "${nombre}" duplicado — gana ${previo.dir} (${previo.ids} ids), se ignora ${d} (${ids})`)
  }
}
const memoriasUnicas = [...porNombre.values()].map((x) => x.dir)

const proyectos = []
for (const mdir of memoriasUnicas) {
  const proj = basename(mdir)
  const out = join(dest, "Proyectos", proj)
  // Prefijo por proyecto: evita que los [[links]] choquen entre memorias
  // (KN-001 existe en infrapilot, en permanent Y en estanco-contable).
  // infrapilot va sin prefijo por ser el proyecto original del vault.
  const prefix =
    proj === "infrapilot" ? "" :
    proj === "permanent" ? "PERM-" :
    proj.slice(0, 3).toUpperCase() + "-"
  execFileSync("node", [generator, mdir, out, prefix], { stdio: "inherit" })
  copyIf(join(mdir, "brief.md"), join(out, "_BRIEF.md"))
  const st = JSON.parse(readFileSync(join(mdir, "state.json"), "utf8"))
  proyectos.push({ proj, objetos: st.objects.length, version: st.version })
}

// ── 2b. Cerebro: la capa transversal, que es la que se consulta ────
// Los proyectos de arriba son el archivo; el cerebro es la respuesta. Se
// exporta después de las memorias porque su índice se reconstruye leyéndolas.
let temasExportados = 0
try {
  const cerebroTool = join(root, "tools", "cerebro.mjs")
  if (existsSync(cerebroTool)) {
    execFileSync("node", [cerebroTool, "exportar", "--destino", join(dest, "Cerebro")], { stdio: "inherit" })
    const dirTemas = join(root, "cerebro", "temas")
    if (existsSync(dirTemas)) temasExportados = readdirSync(dirTemas).filter((f) => f.endsWith(".md")).length
  }
} catch (e) {
  console.error(`  aviso: el cerebro no se pudo exportar (${e.message})`)
}

// ── 3. Portada ─────────────────────────────────────────────────────
const inicio = [
  "# ORION — Vault del ecosistema", "",
  `Exportado: ${new Date().toISOString()}. REGENERABLE — no editar aquí lo que`,
  "quieras conservar: la fuente de verdad es el repo ORION (state.json +", "docs).", "",
  "## Empieza aquí — el cerebro", "",
  `- [[_CEREBRO]] — la capa transversal: ${temasExportados} temas curados que responden preguntas`,
  "  cruzando los proyectos. Una lección pagada en un negocio sirve en los otros.",
  "- Para preguntarle en vez de navegar:", "",
  "  ```bash",
  `  node "${join(root, "tools", "cerebro.mjs")}" buscar "tu pregunta"`,
  "  ```", "",
  "  Devuelve el tema o los objetos que responden, con la cita de dónde salió cada uno.",
  "  El skill `orion-cerebro` hace eso mismo dentro de una conversación.", "",
  "## Sistema", "",
  "- [[ORION_STANDARD]] — el estándar",
  "- Carpeta `Sistema/RFC/` — los RFCs normativos",
  "- Carpeta `Sistema/Agents/` — los 7 agentes del runtime",
  "- Carpeta `Sistema/Skills/` — los skills del ciclo de vida",
  "- [[AMM-SPECIFICATION]] — la spec del gestor de memoria", "",
  "## Proyectos", "",
  ...proyectos.map((p) => `- **${p.proj}** — ${p.objetos} objetos (memoria v${p.version}) → \`Proyectos/${p.proj}/_INDEX.md\``),
  "",
  "Abre la vista de grafo para navegar las dependencias entre decisiones,",
  "conocimiento y pendientes.", "",
].join("\n")
writeFileSync(join(dest, "_INICIO.md"), inicio + "\n")

console.log(`export completo → ${dest}`)
console.log(`  sistema: ${sys} documentos | proyectos: ${proyectos.map((p) => `${p.proj}(${p.objetos})`).join(", ")}`)
