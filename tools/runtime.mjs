#!/usr/bin/env node
/**
 * runtime.mjs — una sola verdad para los agentes y las skills.
 *
 * El runtime vivía en TRES sitios a la vez: `runtime/` en el repo, las copias
 * operativas en `~/.claude`, y el contenido embebido en `instalar-orion.mjs`.
 * Nadie los mantenía sincronizados y la deriva era silenciosa en las dos
 * direcciones: el 2026-08-26 había 5 de 15 archivos distintos, con mejoras
 * vivas que el repo no tenía y mejoras del repo que nunca llegaron a
 * ejecutarse. Peor: correr el instalador habría revertido las primeras sin
 * avisar.
 *
 * Aquí `runtime/` MANDA. Las otras dos son destinos.
 *
 *   node tools/runtime.mjs estado                 deriva a tres bandas
 *   node tools/runtime.mjs instalar [--seco]      runtime/ → ~/.claude
 *   node tools/runtime.mjs recoger  [--solo <n>]  ~/.claude → runtime/  (rescate)
 *   node tools/runtime.mjs empaquetar             runtime/ → payload del instalador
 *   node tools/runtime.mjs sincronizar            instalar + empaquetar + estado
 *
 * Cero dependencias.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, statSync } from "node:fs"
import { join, resolve, dirname, basename } from "node:path"
import { fileURLToPath } from "node:url"
import { homedir } from "node:os"
import { createHash } from "node:crypto"

const ORION = process.env.ORION_HOME ?? resolve(dirname(fileURLToPath(import.meta.url)), "..")
const ARGV = process.argv.slice(2)
const cmd = ARGV[0]
const flag = (n) => ARGV.includes(`--${n}`)
const val = (n) => { const i = ARGV.indexOf(`--${n}`); return i >= 0 ? ARGV[i + 1] : undefined }
const CLAUDE = resolve(val("home") ?? join(homedir(), ".claude"))
const INSTALADOR = join(ORION, "tools", "instalar-orion.mjs")

const hash = (p) => { try { return createHash("sha1").update(readFileSync(p)).digest("hex").slice(0, 10) } catch { return null } }
const mtime = (p) => { try { return statSync(p).mtime.toISOString().slice(0, 16).replace("T", " ") } catch { return "—" } }

/* El inventario sale de `runtime/`, no de una lista escrita a mano: un agente
   nuevo entra al sistema por existir, no por acordarse de registrarlo. */
function inventario() {
  const out = []
  const dirA = join(ORION, "runtime", "agents")
  if (existsSync(dirA)) for (const f of readdirSync(dirA)) {
    if (!f.endsWith(".md")) continue
    const name = f.slice(0, -3)
    out.push({ kind: "agent", name, repo: join(dirA, f), repoPath: `runtime/agents/${f}`, claude: join(CLAUDE, "agents", f), claudePath: `agents/${f}` })
  }
  const dirS = join(ORION, "runtime", "skills")
  if (existsSync(dirS)) for (const f of readdirSync(dirS)) {
    if (!f.endsWith(".SKILL.md")) continue
    const name = f.slice(0, -".SKILL.md".length)
    out.push({ kind: "skill", name, repo: join(dirS, f), repoPath: `runtime/skills/${f}`, claude: join(CLAUDE, "skills", name, "SKILL.md"), claudePath: `skills/${name}/SKILL.md` })
  }
  return out.sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name))
}

function payloadActual() {
  if (!existsSync(INSTALADOR)) return null
  const ls = readFileSync(INSTALADOR, "utf8").split("\n")
  const ini = ls.findIndex((l) => l.startsWith("const PAYLOAD"))
  if (ini === -1) return null
  const fin = ls.indexOf("]", ini + 1)
  if (fin === -1) return null
  const entradas = []
  for (let i = ini + 1; i < fin; i++) {
    const linea = ls[i].replace(/,\s*$/, "")
    try { entradas.push(JSON.parse(linea)) } catch {}
  }
  return { ini, fin, entradas, ls }
}

function estado() {
  const inv = inventario()
  const pay = payloadActual()
  const enPayload = new Map((pay?.entradas ?? []).map((e) => [`${e.kind}:${e.name}`, Buffer.from(e.b64, "base64").toString("utf8")]))
  const filas = []
  let derivados = 0, faltantes = 0
  for (const it of inv) {
    const hRepo = hash(it.repo)
    const hClaude = hash(it.claude)
    const contPay = enPayload.get(`${it.kind}:${it.name}`)
    const hPay = contPay == null ? null : createHash("sha1").update(Buffer.from(contPay, "utf8")).digest("hex").slice(0, 10)
    const okClaude = hRepo === hClaude
    const okPay = hRepo === hPay
    if (!okClaude || !okPay) derivados++
    if (hClaude === null) faltantes++
    filas.push({
      it, okClaude, okPay,
      claudeEstado: hClaude === null ? "NO INSTALADO" : okClaude ? "=" : "DISTINTO",
      payEstado: hPay === null ? "NO EMBEBIDO" : okPay ? "=" : "DISTINTO",
      mRepo: mtime(it.repo), mClaude: mtime(it.claude),
    })
  }
  console.log(`runtime ORION — ${inv.length} piezas · manda \`runtime/\``)
  console.log(`${"".padEnd(2)}${"pieza".padEnd(24)}${"~/.claude".padEnd(14)}${"instalador".padEnd(14)}  repo            live`)
  for (const f of filas) {
    const marca = f.okClaude && f.okPay ? "  " : "⚠ "
    console.log(`${marca}${(f.it.kind[0] + " " + f.it.name).padEnd(24)}${f.claudeEstado.padEnd(14)}${f.payEstado.padEnd(14)}  ${f.mRepo}  ${f.mClaude}`)
  }
  const huerfanos = []
  for (const [clave] of enPayload) if (!inv.find((i) => `${i.kind}:${i.name}` === clave)) huerfanos.push(clave)
  console.log("")
  if (!derivados) console.log("todo sincronizado.")
  else {
    console.log(`${derivados} pieza(s) con deriva.`)
    console.log(`  Si lo bueno está en el repo:      node tools/runtime.mjs sincronizar`)
    console.log(`  Si lo bueno está en ~/.claude:    node tools/runtime.mjs recoger --solo <nombre>   (y luego sincronizar)`)
    console.log(`  MIRA LAS FECHAS antes de elegir: instalar sin mirar borra lo que solo vive en ~/.claude.`)
  }
  if (huerfanos.length) console.log(`\nel instalador embebe ${huerfanos.length} pieza(s) que ya no existen en runtime/: ${huerfanos.join(", ")}\n  → \`empaquetar\` las quita.`)
  return derivados
}

function instalar() {
  const seco = flag("seco") || flag("check")
  let escritos = 0, iguales = 0
  for (const it of inventario()) {
    if (hash(it.repo) === hash(it.claude)) { iguales++; continue }
    if (seco) { console.log(`[seco] escribiría ${it.claudePath}`); escritos++; continue }
    mkdirSync(dirname(it.claude), { recursive: true })
    if (existsSync(it.claude)) copyFileSync(it.claude, `${it.claude}.bak`)   // nunca se pierde lo que había
    copyFileSync(it.repo, it.claude)
    console.log(`  → ${it.claudePath}`)
    escritos++
  }
  console.log(`${seco ? "[seco] " : ""}${escritos} escritas, ${iguales} ya iguales.`)
  if (escritos && !seco) console.log(`Reinicia Claude Code: skills y agentes se cargan al arrancar la sesión.`)
}

/* `recoger` es el rescate: cuando lo bueno está en la copia viva y el repo se
   quedó atrás. Es el paso que faltaba y por eso se perdía trabajo. */
function recoger() {
  const solo = val("solo")
  let recogidos = 0
  for (const it of inventario()) {
    if (solo && it.name !== solo) continue
    if (!existsSync(it.claude) || hash(it.repo) === hash(it.claude)) continue
    if (!solo && !flag("todo")) { console.log(`  ~ ${it.name} difiere (repo ${mtime(it.repo)} · live ${mtime(it.claude)})`); continue }
    copyFileSync(it.repo, `${it.repo}.bak`)
    copyFileSync(it.claude, it.repo)
    console.log(`  ← ${it.repoPath}`)
    recogidos++
  }
  if (!solo && !flag("todo")) console.log(`\nnada copiado: esto solo LISTA. Usa --solo <nombre> para una, o --todo para todas.`)
  else console.log(`${recogidos} recogida(s) al repo. Revisa el diff y después: node tools/runtime.mjs empaquetar`)
}

function empaquetar() {
  const pay = payloadActual()
  if (!pay) { console.error(`no encontré el bloque PAYLOAD en ${INSTALADOR}`); process.exit(1) }
  const inv = inventario()
  const lineas = inv.map((it) => JSON.stringify({
    kind: it.kind, name: it.name, claudePath: it.claudePath, repoPath: it.repoPath,
    b64: readFileSync(it.repo).toString("base64"),
  }) + ",")
  const nuevo = [...pay.ls.slice(0, pay.ini + 1), ...lineas, ...pay.ls.slice(pay.fin)]
  writeFileSync(INSTALADOR, nuevo.join("\n"))
  const antes = pay.entradas.length
  console.log(`instalador reempaquetado desde runtime/: ${antes} → ${inv.length} piezas`)
  const nombres = inv.map((i) => `${i.kind[0]}:${i.name}`).join(" ")
  console.log(`  ${nombres}`)
}

if (cmd === "estado") process.exit(estado() ? 1 : 0)
else if (cmd === "instalar") instalar()
else if (cmd === "recoger") recoger()
else if (cmd === "empaquetar") empaquetar()
else if (cmd === "sincronizar") { instalar(); console.log(""); empaquetar(); console.log(""); estado() }
else {
  const ls = readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n")
  console.log(ls.slice(2, ls.indexOf(" */")).map((l) => l.replace(/^ \* ?/, "")).join("\n"))
  process.exit(cmd ? 1 : 0)
}
