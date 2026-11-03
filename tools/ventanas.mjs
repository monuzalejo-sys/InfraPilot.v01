#!/usr/bin/env node
/**
 * ventanas.mjs — cosechar las VENTANAS (las sesiones de Claude en la app) para el cerebro.
 *
 * Las memorias guardan lo que alguien se acordó de escribir; las ventanas guardan
 * TODO lo que pasó, incluido lo que nadie escribió: el «no me gustó» del dueño, el
 * error que se repitió cinco veces, la cifra medida a media tarde. Pero un transcrito
 * pesa 20-170 MB, casi todo salidas de herramientas e imágenes, y nadie lo lee.
 *
 *   node tools/ventanas.mjs extraer  [--desde AAAA-MM-DD] [--salida <dir>] [--excluir <prefijo>]
 *   node tools/ventanas.mjs escribir <fichas.json> [--sesiones <list_sessions.json>]
 *   node tools/ventanas.mjs estado
 *
 * `extraer` deja por transcrito un resumen con SOLO la señal —palabras del dueño,
 * prosa del asistente, recaps de cierre, informes de agentes, errores— y quita la
 * historia que las bifurcaciones copian (dedupe por uuid). Medido el 2026-11-02:
 * 58 transcritos, 680 MB → 1,2 MB. Los resúmenes pueden llevar datos personales:
 * van a una carpeta temporal, NUNCA al repo ni a la bóveda.
 *
 * Con los resúmenes, agentes extractores (uno por grupo de ventanas) devuelven las
 * fichas y las lecciones candidatas; las lecciones pasan por la puerta del cerebro
 * (orion-harvester) y las fichas se escriben con `escribir` en cerebro/ventanas/,
 * que es la FUENTE. La bóveda (`baul.mjs`) solo las copia. Las fichas NO se publican: cuentan
 * decisiones de clientes, del equipo y finanzas del dueño, y el remoto de ORION es público
 * (.gitignore las deja fuera). Se quedan en la máquina donde se cosecharon.
 *
 * `estado` dice qué ventanas tienen transcrito en disco y todavía no tienen ficha:
 * así la próxima cosecha empieza donde terminó esta, en vez de releer todo.
 *
 * Cero dependencias.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { homedir, tmpdir } from "node:os"
import { fileURLToPath } from "node:url"

const ORION = process.env.ORION_HOME ?? resolve(dirname(fileURLToPath(import.meta.url)), "..")
const FICHAS = join(ORION, "cerebro", "ventanas")
const TRANSCRITOS = join(homedir(), ".claude", "projects")
const ARGV = process.argv.slice(2)
const cmd = ARGV[0]
const val = (n, def) => { const i = ARGV.indexOf(`--${n}`); return i >= 0 && ARGV[i + 1] && !ARGV[i + 1].startsWith("--") ? ARGV[i + 1] : def }
const slug = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)
const cap = (s, n) => (s.length > n ? s.slice(0, n) + ` […+${s.length - n}c]` : s)

/* ── transcritos en disco ─────────────────────────────────────────────── */
function transcritos() {
  const out = []
  if (!existsSync(TRANSCRITOS)) return out
  for (const d of readdirSync(TRANSCRITOS)) {
    let hijos = []
    try { hijos = readdirSync(join(TRANSCRITOS, d)) } catch { continue }
    for (const f of hijos) {
      if (!f.endsWith(".jsonl")) continue
      const ruta = join(TRANSCRITOS, d, f)
      out.push({ ruta, carpeta: d, id: f.replace(".jsonl", ""), primera: primeraMarca(ruta) })
    }
  }
  return out.sort((a, b) => (a.primera || "z").localeCompare(b.primera || "z"))
}
function primeraMarca(ruta) {
  for (const l of readFileSync(ruta, "utf8").slice(0, 300000).split("\n")) {
    try { const o = JSON.parse(l); if (o.timestamp) return o.timestamp } catch {}
  }
  return null
}

/* ── extraer: de 170 MB a la señal ────────────────────────────────────── */
function limpiar(t) {
  return t
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/<pasted_content[^>]*>([\s\S]*?)<\/pasted_content[^>]*>/g, (_, x) => "«PEGADO: " + cap(x.trim(), 1800) + "»")
    .replace(/<command-message>[\s\S]*?<\/command-message>/g, "")
    .replace(/<command-name>([\s\S]*?)<\/command-name>/g, "[cmd $1]")
    .replace(/<\/?command-args>/g, "")
    .replace(/\n{3,}/g, "\n\n").trim()
}
function extraer() {
  const desde = val("desde", "")
  const excluir = val("excluir", "")
  const salida = resolve(val("salida", join(tmpdir(), "orion-cosecha-ventanas")))
  mkdirSync(join(salida, "digests"), { recursive: true })
  const vistos = new Set() // uuid: las bifurcaciones copian la historia de su madre
  const indice = []
  for (const t of transcritos()) {
    if (excluir && t.id.startsWith(excluir)) continue
    let titulo = null, cwd = null, primera = null, ultima = null, nDueno = 0, nHeredadas = 0
    const agentes = new Map(), errores = new Set(), out = []
    for (const l of readFileSync(t.ruta, "utf8").split("\n")) {
      if (!l) continue
      let o; try { o = JSON.parse(l) } catch { continue }
      if (o.type === "custom-title" && o.customTitle) titulo = o.customTitle
      if (!cwd && o.cwd) cwd = o.cwd
      if (o.timestamp) { primera ??= o.timestamp; ultima = o.timestamp }
      if (o.type !== "user" && o.type !== "assistant") continue
      if (o.uuid) { if (vistos.has(o.uuid)) { nHeredadas++; continue } vistos.add(o.uuid) }
      const ts = (o.timestamp || "").slice(5, 16).replace("T", " ")
      const c = o.message?.content
      if (o.type === "user") {
        if (o.isMeta) continue
        for (const b of typeof c === "string" ? [{ type: "text", text: c }] : (Array.isArray(c) ? c : [])) {
          if (b.type === "text") {
            let x = b.text || ""
            if (/^This session is being continued/.test(x)) { out.push(`\n### [${ts}] RESUMEN DE COMPACTACIÓN\n${cap(x, 5000)}`); continue }
            if (x.includes("<task-notification>")) {
              const r = x.match(/<result>([\s\S]*?)<\/result>/)?.[1] || x.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || ""
              if (r.trim()) out.push(`\n[${ts}] AVISO-AGENTE: ${cap(r.trim(), 1500)}`)
              continue
            }
            if (x.includes("<side-sessions-event>") || x.includes("<ci-monitor-event>")) { out.push(`\n[${ts}] EVENTO: ${cap(limpiar(x), 600)}`); continue }
            x = limpiar(x)
            if (!x || /^\[Request interrupted/.test(x) || /^Caveat: The messages below/.test(x) || /^<local-command/.test(x)) continue
            nDueno++
            out.push(`\n## [${ts}] DUEÑO\n${cap(x, 4000)}`)
          } else if (b.type === "tool_result") {
            const txt = (Array.isArray(b.content) ? b.content.filter((y) => y.type === "text").map((y) => y.text).join("\n") : String(b.content || "")).trim()
            if (agentes.has(b.tool_use_id)) {
              if (!/^Async agent launched|^agentId:/.test(txt)) out.push(`\n[${ts}] INFORME-AGENTE (${agentes.get(b.tool_use_id)}): ${cap(txt, 2500)}`)
            } else if (b.is_error) {
              const e = txt.slice(0, 170).replace(/\s+/g, " ")
              if (/user doesn't want|rejected|denied/i.test(e)) out.push(`[${ts}] RECHAZO-DE-HERRAMIENTA: ${e.slice(0, 160)}`)
              else if (!errores.has(e)) { errores.add(e); out.push(`[${ts}] ERROR: ${e}`) }
            }
          }
        }
      } else if (Array.isArray(c)) {
        for (const b of c) {
          if (b.type === "text" && b.text?.trim()) out.push(`\n[${ts}] CLAUDE: ${cap(b.text.trim(), 2200)}`)
          else if (b.type !== "tool_use") continue
          else if (b.name === "mcp__ccd_turn__wrap_up") out.push(`\n[${ts}] RECAP: ${b.input?.recap || ""}${b.input?.ask ? " | PREGUNTA: " + b.input.ask : ""}`)
          else if (b.name === "Agent" || b.name === "Task") {
            const d = `${b.input?.description || ""} · ${b.input?.subagent_type || "?"} · ${b.input?.model || "hereda"}`
            agentes.set(b.id, d); out.push(`[${ts}] LANZA-AGENTE: ${d}`)
          } else if (b.name === "AskUserQuestion") out.push(`[${ts}] PREGUNTA-AL-DUEÑO: ${cap(JSON.stringify(b.input?.questions?.map((q) => q.question)), 500)}`)
        }
      }
    }
    if (desde && (ultima || "") < desde) continue
    if (!titulo) { const p = join(TRANSCRITOS, t.carpeta, t.id, "custom-title.json"); if (existsSync(p)) try { titulo = JSON.parse(readFileSync(p, "utf8")).customTitle } catch {} }
    const nombre = `${(primera || "").slice(0, 10)}-${t.id.slice(0, 8)}-${slug(titulo || "sin-titulo").slice(0, 40)}.md`
    const cuerpo = `# ${titulo || "(sin título)"}\n- transcrito: ${t.id} · carpeta: ${t.carpeta}\n- cwd: ${cwd}\n- desde ${primera} hasta ${ultima}\n- mensajes del dueño: ${nDueno} · líneas heredadas de otra ventana (omitidas): ${nHeredadas}\n` + out.join("\n")
    writeFileSync(join(salida, "digests", nombre), cuerpo)
    indice.push({ nombre, titulo, transcrito: t.id, kb: Math.round(cuerpo.length / 1024), nDueno, desde: (primera || "").slice(0, 10), hasta: (ultima || "").slice(0, 10) })
  }
  writeFileSync(join(salida, "indice.json"), JSON.stringify(indice, null, 1))
  const kb = indice.reduce((s, i) => s + i.kb, 0)
  console.log(`${indice.length} transcritos → ${salida}/digests (${(kb / 1024).toFixed(1)} MB de señal)`)
  console.log("Los resúmenes pueden llevar datos personales: no los copies al repo ni a la bóveda.")
}

/* ── escribir: fichas → cerebro/ventanas/ (la FUENTE) ─────────────────── */
function escribir() {
  const archivo = ARGV[1]
  if (!archivo || !existsSync(archivo)) { console.log("uso: ventanas.mjs escribir <fichas.json> [--sesiones <list_sessions.json>]"); process.exit(1) }
  const { ventanas = [] } = JSON.parse(readFileSync(archivo, "utf8"))
  mkdirSync(FICHAS, { recursive: true })
  // Una ficha ya escrita se reconoce por cualquiera de sus transcritos: así una
  // ventana que creció (continuación tras compactar) actualiza su nota, no la duplica.
  const existentes = new Map()
  for (const f of readdirSync(FICHAS)) {
    if (!f.endsWith(".md")) continue
    const m = readFileSync(join(FICHAS, f), "utf8").match(/^transcritos:\s*\[([^\]]*)\]/m)
    for (const id of (m?.[1] ?? "").split(",").map((x) => x.trim()).filter(Boolean)) existentes.set(id, f)
  }
  let nuevas = 0, actualizadas = 0
  for (const v of ventanas) {
    const ids = (v.transcritos ?? []).map((x) => String(x).slice(0, 8))
    const previo = ids.map((i) => existentes.get(i)).find(Boolean)
    const nombre = previo ?? `${(v.desde || "").slice(0, 10)}-${slug(v.titulo)}.md`
    const lista = (xs) => (xs?.length ? xs.map((x) => `- ${x}`) : ["- _(nada registrado)_"])
    const L = ["---", "tipo: ventana", `titulo: ${JSON.stringify(v.titulo ?? "")}`, `seccion: ${JSON.stringify(v.seccion ?? "Sin sección")}`,
      `proyecto: ${v.proyecto ?? "otro"}`, `desde: ${v.desde ?? ""}`, `hasta: ${v.hasta ?? ""}`,
      `transcritos: [${ids.join(", ")}]`, `temas: [${(v.temas ?? []).join(", ")}]`,
      v.enlace ? `enlace: ${v.enlace}` : null, `cosechada: ${v.cosechada ?? new Date().toISOString().slice(0, 10)}`, "---", "",
      `# ${v.titulo}`, "",
      `**Para qué fue:** ${v.para ?? "?"}`, "",
      `**Cómo quedó:** ${v.desenlace ?? "?"}`, "",
      "## Lo que el dueño rechazó", "", ...lista(v.rechazos), "",
      "## Lo que el dueño decidió", "", ...lista(v.decisiones), "",
      "## Lo que dejó al cerebro", "",
      ...(v.lecciones?.length ? v.lecciones.map((l) => `- ${l.tema ? `[[TEMA-${l.tema}]] — ` : ""}${l.titulo}${l.donde ? ` → \`${l.donde}\`` : ""}`) : ["- _(ninguna lección pasó la puerta)_"]), "",
      "## Abrir", "",
      v.enlace ? `- La ventana en la app: [abrir en Claude](${v.enlace})` : "- La ventana ya no está en la barra de la app.",
      `- Transcritos en \`~/.claude/projects/\`: ${ids.map((i) => `\`${i}…\``).join(", ")}`, ""].filter((x) => x !== null)
    writeFileSync(join(FICHAS, nombre), L.join("\n"))
    if (previo) actualizadas++; else nuevas++
  }
  console.log(`fichas de ventana: ${nuevas} nuevas, ${actualizadas} actualizadas → ${FICHAS}`)
}

/* ── estado: qué falta cosechar ───────────────────────────────────────── */
function estado() {
  const conFicha = new Set()
  if (existsSync(FICHAS)) for (const f of readdirSync(FICHAS)) {
    if (!f.endsWith(".md")) continue
    const m = readFileSync(join(FICHAS, f), "utf8").match(/^transcritos:\s*\[([^\]]*)\]/m)
    for (const id of (m?.[1] ?? "").split(",").map((x) => x.trim()).filter(Boolean)) conFicha.add(id)
  }
  const todos = transcritos()
  const faltan = todos.filter((t) => !conFicha.has(t.id.slice(0, 8)))
  console.log(`VENTANAS — ${todos.length} transcritos en disco · ${conFicha.size} con ficha · ${faltan.length} sin cosechar`)
  for (const t of faltan.slice(-15)) {
    let titulo = null
    const p = join(TRANSCRITOS, t.carpeta, t.id, "custom-title.json")
    if (existsSync(p)) try { titulo = JSON.parse(readFileSync(p, "utf8")).customTitle } catch {}
    console.log(`  ${(t.primera || "").slice(0, 10)}  ${t.id.slice(0, 8)}  ${titulo ?? "(sin título)"}  ${(statSync(t.ruta).size / 1048576).toFixed(1)} MB`)
  }
  if (faltan.length) console.log(`\nPara cosecharlas: node tools/ventanas.mjs extraer --desde <fecha de la más vieja sin ficha>`)
}

if (cmd === "extraer") extraer()
else if (cmd === "escribir") escribir()
else if (cmd === "estado") estado()
else console.log("uso: ventanas.mjs extraer|escribir|estado — ver la cabecera del archivo")
