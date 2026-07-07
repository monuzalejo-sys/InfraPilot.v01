#!/usr/bin/env node
/**
 * check-r8.mjs — Chequeo N-AMM-R8: ningún objeto de la memoria puede
 * DESAPARECER; todo id presente en la versión anterior debe seguir en
 * objects[] o tener un ArchiveRecord en archives[].
 *
 * Uso: node tools/check-r8.mjs <state.json-actual> <state.json-anterior>
 * (el hook pre-commit pasa la versión de HEAD como "anterior").
 * Exit 0 = OK; exit 1 = pérdida detectada (lista los ids).
 */
import { readFileSync } from "node:fs"

const [curPath, prevPath] = process.argv.slice(2)
if (!curPath || !prevPath) { console.error("uso: check-r8.mjs <actual> <anterior>"); process.exit(2) }

const cur = JSON.parse(readFileSync(curPath, "utf8"))
const prev = JSON.parse(readFileSync(prevPath, "utf8"))

const vivos = new Set(cur.objects.map((o) => o.id))
const archivados = new Set(cur.archives.map((a) => a.archivedId))
// también los archivados previos deben seguir registrados (los ArchiveRecords no se borran)
const archivadosPrev = new Set(prev.archives.map((a) => a.archivedId))

const perdidos = prev.objects.map((o) => o.id).filter((id) => !vivos.has(id) && !archivados.has(id))
const recordsPerdidos = [...archivadosPrev].filter((id) => !archivados.has(id))

if (perdidos.length || recordsPerdidos.length) {
  if (perdidos.length)
    console.error(`R8 VIOLADO — objetos desaparecidos sin ArchiveRecord: ${perdidos.join(", ")}`)
  if (recordsPerdidos.length)
    console.error(`R8 VIOLADO — ArchiveRecords eliminados: ${recordsPerdidos.join(", ")}`)
  console.error("Todo objeto debe permanecer en objects[] o quedar registrado en archives[].")
  process.exit(1)
}
console.log(`R8 OK — ${prev.objects.length} objetos previos contabilizados (${cur.objects.length} vivos, ${cur.archives.length} archivados)`)
