#!/usr/bin/env node
/**
 * generar-instalador.mjs — reconstruye el PAYLOAD de tools/instalar-orion.mjs
 * a partir de lo que hay HOY en runtime/.
 *
 * POR QUÉ EXISTE: el instalador es autocontenido (lleva cada skill y cada
 * agente embebidos en base64) para poder migrar a otro PC con un solo archivo.
 * Esa virtud es también su trampa: al agregar un agente o editar una skill,
 * el instalador NO se entera y sigue instalando la versión vieja. Se descubrió
 * con 15 archivos en runtime/ y 12 congelados dentro del instalador — es decir,
 * un PC nuevo habría quedado sin el cerebro ni el cosechador, y con la skill
 * ORION anterior. Este generador cierra ese hueco: se corre después de tocar
 * runtime/ y el instalador vuelve a decir la verdad.
 *
 * Uso:
 *   node tools/generar-instalador.mjs           reescribe tools/instalar-orion.mjs
 *   node tools/generar-instalador.mjs --check   solo informa qué cambiaría
 *
 * Cero dependencias. Solo toca el bloque PAYLOAD: el código del instalador
 * (sus banderas, sus respaldos .bak, su verificación final) queda intacto.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."))
const INSTALADOR = join(ROOT, "tools", "instalar-orion.mjs")
const CHECK = process.argv.includes("--check")

const piezas = []

const dirSkills = join(ROOT, "runtime", "skills")
for (const f of existsSync(dirSkills) ? readdirSync(dirSkills).sort() : []) {
  if (!f.endsWith(".SKILL.md")) continue
  const name = f.replace(/\.SKILL\.md$/, "")
  piezas.push({
    kind: "skill",
    name,
    claudePath: `skills/${name}/SKILL.md`,
    repoPath: `runtime/skills/${f}`,
    b64: readFileSync(join(dirSkills, f)).toString("base64"),
  })
}

const dirAgentes = join(ROOT, "runtime", "agents")
for (const f of existsSync(dirAgentes) ? readdirSync(dirAgentes).sort() : []) {
  if (!f.endsWith(".md")) continue
  const name = f.replace(/\.md$/, "")
  piezas.push({
    kind: "agent",
    name,
    claudePath: `agents/${f}`,
    repoPath: `runtime/agents/${f}`,
    b64: readFileSync(join(dirAgentes, f)).toString("base64"),
  })
}

const original = readFileSync(INSTALADOR, "utf8")
const inicio = original.indexOf("const PAYLOAD = [")
if (inicio < 0) { console.error("no encuentro 'const PAYLOAD = [' en el instalador: no lo toco"); process.exit(1) }
// el cierre es el primer "]" a principio de línea después del inicio: el
// payload es una lista de objetos de una línea cada uno, sin anidamiento
const cierre = original.indexOf("\n]", inicio)
if (cierre < 0) { console.error("no encuentro el cierre del PAYLOAD: no lo toco"); process.exit(1) }

const cuerpo = piezas.map((p) => JSON.stringify(p)).join(",\n")
const nuevo = original.slice(0, inicio) + "const PAYLOAD = [\n" + cuerpo + original.slice(cierre)

// cuántos había antes, para que el reporte sea útil y no solo "listo"
const antes = (original.slice(inicio, cierre).match(/"kind":/g) ?? []).length
console.log(`runtime/: ${piezas.filter((p) => p.kind === "skill").length} skills + ${piezas.filter((p) => p.kind === "agent").length} agentes = ${piezas.length} archivos`)
console.log(`instalador: tenía ${antes} embebidos → ${piezas.length}`)
for (const p of piezas) console.log(`  ${p.kind.padEnd(6)} ${p.name}`)

if (CHECK) { console.log("\n--check: no escribí nada."); process.exit(0) }
writeFileSync(INSTALADOR, nuevo)
console.log(`\ninstalador reescrito: ${INSTALADOR}`)
console.log("compruébalo con:  node tools/instalar-orion.mjs --check")
