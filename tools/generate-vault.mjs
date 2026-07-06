#!/usr/bin/env node
/**
 * generate-vault.mjs — Vista Obsidian de la memoria ORION.
 *
 * Genera <memory-dir>/vault/ con un .md por objeto (frontmatter + [[links]]
 * entre dependencias) y un _INDEX.md agrupado por tipo. UNIDIRECCIONAL:
 * state.json es la fuente de verdad; el vault es una vista regenerable.
 * Ediciones manuales del vault NO se sincronizan de vuelta — son input
 * humano para la próxima curación.
 *
 * Uso: node tools/generate-vault.mjs <memory-dir> [out-dir] [file-prefix]
 *   out-dir     destino (default: <memory-dir>/vault)
 *   file-prefix prefijo de nombres de archivo, para evitar colisiones de
 *               [[links]] al fusionar varios proyectos en un mismo vault
 * Cero dependencias. Se regenera completo en cada ejecución.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from "node:fs"
import { join } from "node:path"

const dir = process.argv[2]
if (!dir) { console.error("uso: node generate-vault.mjs <memory-dir> [out-dir] [file-prefix]"); process.exit(1) }
const outArg = process.argv[3]
const prefix = process.argv[4] ?? ""

const state = JSON.parse(readFileSync(join(dir, "state.json"), "utf8"))
const vaultDir = outArg ?? join(dir, "vault")
mkdirSync(vaultDir, { recursive: true })

// limpieza: el vault es 100% generado
for (const f of readdirSync(vaultDir)) if (f.endsWith(".md")) unlinkSync(join(vaultDir, f))

// título humano por tipo de payload
const titleOf = (o) =>
  (o.title ?? o.fact ?? o.task ?? o.constraint ?? o.rule ?? o.risk ?? o.component ?? o.milestone ?? o.metric ?? "")
    .replace(/\s+/g, " ").slice(0, 80)

// backlinks: quién depende de cada objeto
const backlinks = {}
for (const o of state.objects) for (const d of o.dependencies ?? [])
  (backlinks[d] ??= []).push(o.id)

const PAYLOAD_KEYS = ["title", "description", "reason", "fact", "context", "source", "task",
  "constraint", "rule", "scope", "risk", "probability", "mitigation", "component", "pattern",
  "milestone", "metric", "value", "unit"]

for (const o of state.objects) {
  const lines = ["---",
    `id: ${o.id}`, `type: ${o.type}`, `tier: ${o.tier}`, `status: ${o.status}`,
    `impact: ${o.impact}`, `priority: ${o.priority}`, `lifetime: ${o.lifetime}`,
    `created: ${o.created}`, `updated: ${o.updated}`,
    "---", "",
    `# ${o.id} — ${titleOf(o)}`, ""]
  for (const k of PAYLOAD_KEYS) {
    if (o[k] === undefined) continue
    const v = Array.isArray(o[k]) ? o[k].join(", ") : String(o[k])
    lines.push(`**${k}:** ${v}`, "")
  }
  if (o.dependencies?.length)
    lines.push(`**Depende de:** ${o.dependencies.map((d) => `[[${prefix}${d}]]`).join(" · ")}`, "")
  if (backlinks[o.id]?.length)
    lines.push(`**Referenciado por:** ${backlinks[o.id].map((d) => `[[${prefix}${d}]]`).join(" · ")}`, "")
  writeFileSync(join(vaultDir, `${prefix}${o.id}.md`), lines.join("\n") + "\n")
}

// índice agrupado por tipo
const byType = {}
for (const o of state.objects) (byType[o.type] ??= []).push(o)
const idx = [`# Memoria ORION — ${state.projectId}`, "",
  `Generado de state.json v${state.version} (${state.snapshotDate}). NO editar a mano: se regenera en cada cierre de sesión.`, ""]
for (const [type, objs] of Object.entries(byType).sort()) {
  idx.push(`## ${type} (${objs.length})`, "")
  for (const o of objs) idx.push(`- [[${prefix}${o.id}]] \`${o.status}\` — ${titleOf(o).slice(0, 70)}`)
  idx.push("")
}
if (state.archives?.length) {
  idx.push(`## Archivado (${state.archives.length})`, "")
  for (const a of state.archives) idx.push(`- ~~${a.archivedId}~~ (${a.reason}) — ${(a.notes ?? "").slice(0, 60)}`)
  idx.push("")
}
writeFileSync(join(vaultDir, "_INDEX.md"), idx.join("\n") + "\n")

console.log(`vault: ${state.objects.length} objetos + _INDEX.md → ${vaultDir}`)
