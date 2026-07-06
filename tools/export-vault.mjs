#!/usr/bin/env node
/**
 * export-vault.mjs — Exporta un vault Obsidian COMPLETO del ecosistema ORION
 * a una carpeta externa al repo: documentación del sistema (estándar, RFCs,
 * agents, skills) + la memoria de TODOS los proyectos con sus enlaces.
 *
 * Uso: node tools/export-vault.mjs <carpeta-destino>
 * Ej.:  node tools/export-vault.mjs "C:/Users/Kalel/ORION-Vault"
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
const memRoot = join(root, "memory")
const proyectos = []
for (const proj of readdirSync(memRoot)) {
  const mdir = join(memRoot, proj)
  if (!statSync(mdir).isDirectory() || !existsSync(join(mdir, "state.json"))) continue
  const out = join(dest, "Proyectos", proj)
  // prefijo por proyecto evita colisiones de [[links]] entre memorias
  // (p.ej. KN-001 existe en infrapilot Y en permanent)
  const prefix = proj === "permanent" ? "PERM-" : ""
  execFileSync("node", [generator, mdir, out, prefix], { stdio: "inherit" })
  copyIf(join(mdir, "brief.md"), join(out, "_BRIEF.md"))
  const st = JSON.parse(readFileSync(join(mdir, "state.json"), "utf8"))
  proyectos.push({ proj, objetos: st.objects.length, version: st.version })
}

// ── 3. Portada ─────────────────────────────────────────────────────
const inicio = [
  "# ORION — Vault del ecosistema", "",
  `Exportado: ${new Date().toISOString()}. REGENERABLE — no editar aquí lo que`,
  "quieras conservar: la fuente de verdad es el repo ORION (state.json +", "docs).", "",
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
