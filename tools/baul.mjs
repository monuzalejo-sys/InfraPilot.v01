#!/usr/bin/env node
/**
 * baul.mjs — la pasarela: TODO lo útil del ecosistema hacia la bóveda Obsidian.
 *
 * `export-vault.mjs` ya llevaba el sistema, las memorias y el cerebro. Faltaba
 * lo que se produce trabajando y se quedaba enterrado en JSON: los PLANES de
 * ejecución con sus tareas, el HISTORIAL de sesiones con lo que costó cada una,
 * y los ENCARGOS con los que arrancó cada trabajo. Esto los sube, enlazados
 * entre sí y con los temas, para que el grafo de Obsidian responda cosas que
 * ningún archivo suelto responde: «¿qué tareas de qué proyectos dependen de la
 * regla del turno de caja?», «¿en qué se fue el gasto de agosto?».
 *
 *   node tools/baul.mjs empujar [--destino <vault>] [--sin-export] [--proyecto <id>]
 *   node tools/baul.mjs estado  [--destino <vault>]
 *
 * UNIDIRECCIONAL: el repo manda, la bóveda es una vista regenerable. Lo que se
 * escriba a mano en la bóveda NO se sincroniza de vuelta — pero `cerebro.mjs
 * ruta` sí lo encuentra, así que no se pierde: es insumo de la próxima curación.
 *
 * Cero dependencias.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync, rmSync } from "node:fs"
import { join, resolve, basename, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const ORION = process.env.ORION_HOME ?? resolve(dirname(fileURLToPath(import.meta.url)), "..")
const ARGV = process.argv.slice(2)
const cmd = ARGV[0]
const flag = (n) => ARGV.includes(`--${n}`)
const val = (n, def) => { const i = ARGV.indexOf(`--${n}`); return i >= 0 && ARGV[i + 1] && !ARGV[i + 1].startsWith("--") ? ARGV[i + 1] : def }
const DESTINO = resolve(val("destino", join(ORION, "..", "ORION-Vault")))

/* Las mismas raíces que ya usan cerebro.mjs y export-vault.mjs. Si un proyecto
   vive fuera de ellas, es invisible para las tres herramientas a la vez — que
   es mejor que ser invisible solo para una y que nadie se entere. */
const RAICES = [join(ORION, "memory"), "C:\\Users\\Kalel\\prommter\\proyectos", "C:\\Users\\Kalel\\fable 5"]
const SUELTAS = ["C:\\Users\\Kalel\\prommter\\memory\\prommter"]

const NIVEL_NOMBRE = { N0: "Cimientos", N1: "Funciona", N2: "Aguanta", N3: "Escala", N4: "Excelencia" }
const esc = (s) => String(s ?? "").replace(/\r?\n/g, " ").trim()
const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)

function descubrirMemorias() {
  const out = new Set(SUELTAS)
  for (const raiz of RAICES) {
    if (!existsSync(raiz)) continue
    for (const entrada of readdirSync(raiz)) {
      const directa = join(raiz, entrada)
      try { if (statSync(directa).isDirectory() && existsSync(join(directa, "state.json"))) out.add(directa) } catch {}
      const mem = join(raiz, entrada, "memory")
      if (!existsSync(mem)) continue
      for (const sub of readdirSync(mem)) {
        const d = join(mem, sub)
        try { if (statSync(d).isDirectory() && existsSync(join(d, "state.json"))) out.add(d) } catch {}
      }
    }
  }
  return [...out].filter((p) => existsSync(join(p, "state.json")))
}

function limpiarMd(dir) {
  if (!existsSync(dir)) return
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    try { statSync(p).isDirectory() ? rmSync(p, { recursive: true, force: true }) : f.endsWith(".md") && rmSync(p) } catch {}
  }
}

/* ── planes ───────────────────────────────────────────────────────────── */
function subirPlan(mdir, proj) {
  const rutaPlan = join(mdir, "plan.json")
  if (!existsSync(rutaPlan)) return null
  let plan
  try { plan = JSON.parse(readFileSync(rutaPlan, "utf8")) } catch (e) { console.error(`  aviso: ${proj} tiene plan.json ilegible (${e.message})`); return null }
  const dir = join(DESTINO, "Planes", proj)
  mkdirSync(dir, { recursive: true })
  limpiarMd(dir)

  const P = (id) => `${proj.slice(0, 3).toUpperCase()}-${id}`      // prefijo por proyecto: los ids T-001 chocan entre planes
  const T = plan.tareas ?? []
  const hechas = T.filter((t) => t.estado === "hecho")

  /* Una nota por tarea. No son stubs: cada una trae el porqué, los pasos, la
     aceptación y sus enlaces al tema que la respalda — que es lo que hace que
     abrir un tema en Obsidian muestre todas las tareas de todos los proyectos
     que dependen de él. */
  for (const t of T) {
    if (t.estado === "descartado") continue
    const L = ["---",
      `id: ${P(t.id)}`, `proyecto: ${proj}`, `tipo: tarea`, `nivel: ${t.nivel}`,
      `categoria: ${t.categoria}`, `estado: ${t.estado}`, `dificultad: ${t.dificultad}`,
      `ceremonia: ${t.ceremonia}`, `presupuesto: ${t.presupuesto ?? 0}`,
      t.gastoReal ? `gastoReal: ${t.gastoReal}` : null,
      t.arquetipo ? `arquetipo: ${t.arquetipo}` : null,
      "---", "",
      `# ${t.id} — ${esc(t.titulo)}`, "",
      `**Por qué.** ${esc(t.porQue)}`, ""].filter((x) => x !== null)
    if (t.queHacer?.length) { L.push("## Qué hacer", ""); t.queHacer.forEach((p, i) => L.push(`${i + 1}. ${esc(p)}`)); L.push("") }
    if (t.aceptacion?.length) {
      L.push("## Cómo se comprueba", "")
      for (const a of t.aceptacion) {
        L.push(`- **${esc(a.check)}** → ${esc(a.espera)}`)
        if (a.comando) L.push("  ```bash", `  ${a.comando}`, "  ```")
      }
      L.push("")
    }
    if (t.posee?.length) L.push(`**Posee:** \`${t.posee.join("` · `")}\``, "")
    if (t.intocable?.length) L.push(`**Intocable:** \`${t.intocable.join("` · `")}\``, "")
    if (t.dependeDe?.length) L.push(`**Depende de:** ${t.dependeDe.map((d) => `[[${P(d)}]]`).join(" · ")}`, "")
    const dependientes = T.filter((x) => (x.dependeDe ?? []).includes(t.id))
    if (dependientes.length) L.push(`**Desbloquea:** ${dependientes.map((d) => `[[${P(d.id)}]]`).join(" · ")}`, "")
    if (t.cerebro?.length) L.push(`**Conocimiento que aplica:** ` + t.cerebro.map((c) => c.startsWith("tema:") ? `[[TEMA-${c.slice(5)}]]` : `\`${c}\``).join(" · "), "")
    if (t.bloqueadoPor) L.push(`> **BLOQUEADA:** ${esc(t.bloqueadoPor)}`, "")
    if (t.evidencia) L.push(`> **Evidencia de que está hecha:** ${esc(t.evidencia)}`, "")
    L.push(`---`, `Plan: [[${P("_PLAN")}]] · Proyecto: \`${proj}\``)
    writeFileSync(join(dir, `${P(t.id)}.md`), L.join("\n") + "\n")
  }

  const cats = [...new Set(T.map((t) => t.categoria))].sort()
  const L = ["---", `proyecto: ${proj}`, `tipo: plan`, `modo: ${plan.modo}`,
    `version: ${plan.version}`, `tareas: ${T.length}`, `hechas: ${hechas.length}`, "---", "",
    `# Plan de ejecución — ${proj}`, "",
    `> Vista generada de \`plan.json\` v${plan.version}. La fuente de verdad es el registro:`,
    `> \`node tools/plan.mjs siguiente <plan.json>\`. Editar aquí no cambia nada.`, "",
    `**Objetivo.** ${esc(plan.objetivo) || "—"}`, "",
    `**Modo.** ${plan.modo === "genesis" ? "Génesis — se construye de cero." : "Evolución — hay sistema vivo: toda tarea lleva regresión."}`, ""]
  if (plan.resumen?.length) { L.push("## El plan en una lectura", ""); for (const r of plan.resumen) L.push(`- ${esc(r)}`); L.push("") }
  L.push(`## Avance`, "", `${hechas.length} de ${T.length} tareas · etapa ${plan.perfil?.etapa ?? "?"}`, "",
    `| Categoría | Hechas | Total |`, `|---|---|---|`)
  for (const c of cats) { const ts = T.filter((t) => t.categoria === c); L.push(`| ${c} | ${ts.filter((t) => t.estado === "hecho").length} | ${ts.length} |`) }
  L.push("")
  if (plan.hitos?.length) {
    L.push("## Hitos", "")
    for (const h of plan.hitos) L.push(`- **${esc(h.nombre)}** — ${esc(h.criterio)} · ${(h.requiere ?? []).map((r) => `[[${P(r)}]]`).join(" ") || "—"}`)
    L.push("")
  }
  for (const n of ["N0", "N1", "N2", "N3", "N4"]) {
    const ts = T.filter((t) => t.nivel === n && t.estado !== "descartado")
    if (!ts.length) continue
    L.push(`## ${n} · ${NIVEL_NOMBRE[n]} — ${ts.filter((t) => t.estado === "hecho").length}/${ts.length}`, "")
    for (const c of cats) {
      const tc = ts.filter((t) => t.categoria === c)
      if (!tc.length) continue
      L.push(`**${c}** — ` + tc.map((t) => `[[${P(t.id)}|${t.id}${t.estado === "hecho" ? " ✓" : t.estado === "bloqueado" ? " ⛔" : ""}]]`).join(" · "), "")
    }
  }
  if (plan.escalabilidad?.length) {
    L.push("## Después de terminar", "")
    for (const m of plan.escalabilidad) L.push(`- **${esc(m.titulo)}** — se dispara cuando: ${esc(m.disparador)}`)
    L.push("")
  }
  if (plan.negocio) {
    const n = plan.negocio
    L.push("## Cuánto cuesta y cuánto vale", "")
    L.push(`- Construcción: **${((n.costoTokens ?? 0) / 1e6).toFixed(2)} M tokens de subagente**${n.costoEstimadoCOP ? ` ≈ $${n.costoEstimadoCOP.toLocaleString("es-CO")} COP` : ""}`)
    if (n.precioSugerido) L.push(`- Precio propuesto: **$${(n.precioSugerido.montoCOP ?? 0).toLocaleString("es-CO")} COP** / ${n.precioSugerido.modelo}`)
    if (n.comparables?.length) { L.push("", "| Comparable | Precio | Dónde sale caro |", "|---|---|---|"); for (const c of n.comparables) L.push(`| ${esc(c.nombre)} | ${esc(c.precio)} | ${esc(c.dondeSaleCaro)} |`) }
    if (n.supuestos?.length) { L.push("", "**Supuestos de los que depende cada cifra:**"); for (const s of n.supuestos) L.push(`- ${esc(s)}`) }
    L.push("")
  }
  writeFileSync(join(dir, `${P("_PLAN")}.md`), L.join("\n") + "\n")
  return { proj, tareas: T.filter((t) => t.estado !== "descartado").length, hechas: hechas.length, version: plan.version }
}

/* ── historial de sesiones ────────────────────────────────────────────── */
function subirSesiones(mdir, proj) {
  const ruta = join(mdir, "metrics.json")
  if (!existsSync(ruta)) return null
  let m
  try { m = JSON.parse(readFileSync(ruta, "utf8")) } catch { return null }
  const sesiones = m.sessions ?? []
  if (!sesiones.length) return null
  const dir = join(DESTINO, "Sesiones", proj)
  mkdirSync(dir, { recursive: true })
  limpiarMd(dir)

  let tokensTotal = 0
  const filas = []
  for (const s of sesiones) {
    const mo = s.modelOutcomes ?? []
    const tokens = mo.reduce((a, x) => a + (x.tokens ?? 0), 0)
    tokensTotal += tokens
    const id = slug(s.sessionId ?? s.date ?? `sesion-${filas.length + 1}`)
    const fecha = (s.startedAt ?? s.date ?? s.completedAt ?? "").slice(0, 10)
    const fallos = mo.filter((x) => x.verdict && x.verdict !== "ok" && !x.infraDeath)
    const muertes = mo.filter((x) => x.infraDeath)
    const objetos = (s.objectsCreated ?? 0) + (s.objectsMerged ?? 0) + (s.objectsArchived ?? 0)
    const L = ["---", `proyecto: ${proj}`, `tipo: sesion`, `fecha: ${fecha}`,
      `disparo: ${s.triggeredBy ?? "?"}`, `resultado: ${s.outcome ?? "?"}`,
      `spawns: ${mo.length}`, `tokens: ${tokens}`, "---", "",
      `# ${s.sessionId ?? id}`, "",
      `**${fecha}** · \`${proj}\` · disparo ${s.triggeredBy ?? "?"} · resultado **${s.outcome ?? "?"}**`,
      `**Spawns:** ${mo.length} · **Tokens medidos:** ${tokens.toLocaleString("es-CO")} · **Objetos de memoria tocados:** ${objetos} (${s.objectsCreated ?? 0} nuevos, ${s.objectsMerged ?? 0} fusionados, ${s.objectsArchived ?? 0} archivados)`, ""]
    if (s.notes) L.push(esc(s.notes), "")
    if (mo.length) {
      L.push("## Qué corrió y qué costó", "", "| Fase | Modelo | Veredicto | Tokens |", "|---|---|---|---|")
      for (const x of mo) L.push(`| ${x.phase ?? "?"} | ${x.model ?? "?"} | ${x.verdict ?? "?"}${x.infraDeath ? " (muerte de sesión)" : ""} | ${(x.tokens ?? 0).toLocaleString("es-CO")} |`)
      L.push("")
    }
    if (fallos.length) L.push(`> **${fallos.length} fallo(s) reales de capacidad** (no muertes de infraestructura): ${fallos.map((f) => `${f.phase}/${f.model}`).join(", ")}`, "")
    if (muertes.length) L.push(`> ${muertes.length} muerte(s) de sesión — NO cuentan como fallo del modelo.`, "")
    L.push(`---`, `Historial: [[${proj.slice(0, 3).toUpperCase()}-_SESIONES]]`)
    writeFileSync(join(dir, `${slug(proj)}-${id}.md`), L.join("\n") + "\n")
    filas.push({ id, fecha, spawns: mo.length, tokens, fallos: fallos.length, muertes: muertes.length, outcome: s.outcome ?? "" })
  }

  filas.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
  const L = ["---", `proyecto: ${proj}`, `tipo: historial`, "---", "",
    `# Historial de sesiones — ${proj}`, "",
    `${sesiones.length} sesiones · **${(tokensTotal / 1e6).toFixed(2)} M tokens de subagente medidos**`, "",
    "| Sesión | Fecha | Resultado | Spawns | Tokens | Fallos | Muertes |", "|---|---|---|---|---|---|---|"]
  for (const f of filas) L.push(`| [[${slug(proj)}-${f.id}\\|${f.id}]] | ${f.fecha} | ${f.outcome} | ${f.spawns} | ${f.tokens.toLocaleString("es-CO")} | ${f.fallos} | ${f.muertes} |`)
  L.push("", "> Las **muertes de sesión** no son fallos del modelo: el agente se quedó sin cuota, no sin capacidad.")
  writeFileSync(join(dir, `${proj.slice(0, 3).toUpperCase()}-_SESIONES.md`), L.join("\n") + "\n")
  return { proj, sesiones: sesiones.length, tokens: tokensTotal }
}

/* ── encargos ─────────────────────────────────────────────────────────── */
function subirEncargos(mdir, proj) {
  const origen = join(mdir, "encargos")
  if (!existsSync(origen)) return null
  const dir = join(DESTINO, "Encargos", proj)
  mkdirSync(dir, { recursive: true })
  limpiarMd(dir)
  let n = 0
  for (const f of readdirSync(origen)) {
    if (!f.endsWith(".md")) continue
    const cuerpo = readFileSync(join(origen, f), "utf8")
    const cab = cuerpo.startsWith("---") ? "" : ["---", `proyecto: ${proj}`, `tipo: encargo`, "---", "", ""].join("\n")
    writeFileSync(join(dir, f), cab + cuerpo)
    n++
  }
  return n ? { proj, encargos: n } : null
}

/* ── comandos ─────────────────────────────────────────────────────────── */
function empujar() {
  const soloProyecto = val("proyecto")
  mkdirSync(DESTINO, { recursive: true })

  if (!flag("sin-export")) {
    const exportador = join(ORION, "tools", "export-vault.mjs")
    if (existsSync(exportador)) {
      console.log("· sistema, memorias y cerebro …")
      try { execFileSync("node", [exportador, DESTINO], { stdio: "inherit" }) }
      catch (e) { console.error(`  aviso: export-vault falló (${e.message}); sigo con planes e historial`) }
    }
  }

  const memorias = descubrirMemorias().filter((d) => !soloProyecto || basename(d) === soloProyecto)
  const planes = [], sesiones = [], encargos = []
  console.log(`· planes, historial y encargos de ${memorias.length} memorias …`)
  for (const mdir of memorias) {
    const proj = basename(mdir)
    const p = subirPlan(mdir, proj); if (p) planes.push(p)
    const s = subirSesiones(mdir, proj); if (s) sesiones.push(s)
    const e = subirEncargos(mdir, proj); if (e) encargos.push(e)
  }

  /* Portada: se ESCRIBE ENCIMA de la de export-vault a propósito. Dos portadas
     compitiendo es peor que una desactualizada — quien abre la bóveda tiene que
     ver una sola puerta. */
  const totalTareas = planes.reduce((a, p) => a + p.tareas, 0)
  const totalHechas = planes.reduce((a, p) => a + p.hechas, 0)
  const totalTokens = sesiones.reduce((a, s) => a + s.tokens, 0)
  const L = [
    "# ORION — la bóveda", "",
    `Regenerada ${new Date().toISOString().slice(0, 16).replace("T", " ")}. **Vista, no fuente**: el repo`,
    "manda. Lo que escribas a mano aquí no se sincroniza de vuelta — pero `cerebro.mjs ruta`",
    "sí lo encuentra, así que no se pierde.", "",
    "## Empieza aquí", "",
    "- [[_CEREBRO]] — los temas curados: una lección pagada en un negocio decide en los otros.",
    "- Para preguntar en vez de navegar:", "",
    "  ```bash",
    `  node "${join(ORION, "tools", "cerebro.mjs")}" buscar "tu pregunta"`,
    `  node "${join(ORION, "tools", "cerebro.mjs")}" ruta "dónde está escrito X"`,
    "  ```", "",
    "## Planes de ejecución", "",
    planes.length
      ? `${totalHechas} de ${totalTareas} tareas hechas en ${planes.length} proyectos.`
      : "_Todavía no hay ningún plan. Se crean con `/orion-plan`._", "",
    ...planes.map((p) => `- **${p.proj}** — ${p.hechas}/${p.tareas} tareas → \`Planes/${p.proj}/${p.proj.slice(0, 3).toUpperCase()}-_PLAN.md\``),
    "",
    "## Historial y gasto", "",
    sesiones.length
      ? `${sesiones.reduce((a, s) => a + s.sesiones, 0)} sesiones registradas · **${(totalTokens / 1e6).toFixed(2)} M tokens de subagente medidos** en todo el ecosistema.`
      : "_Sin historial de sesiones todavía._", "",
    ...sesiones.sort((a, b) => b.tokens - a.tokens).map((s) => `- **${s.proj}** — ${s.sesiones} sesiones, ${(s.tokens / 1e6).toFixed(2)} M tokens → \`Sesiones/${s.proj}/\``),
    "",
    /* `null` marca «esta línea no va»; el filtro de abajo quita SOLO los null.
       Filtrar las cadenas vacías se llevaba por delante las líneas en blanco
       intencionadas, y sin ellas Markdown deja de ver las listas como listas. */
    ...(encargos.length
      ? ["## Encargos", "", ...encargos.map((e) => `- **${e.proj}** — ${e.encargos} encargos → \`Encargos/${e.proj}/\``), ""]
      : []),
    "## Sistema y memorias", "",
    "- [[ORION_STANDARD]] — el estándar · `Sistema/RFC/` — los RFC normativos",
    "- `Sistema/Agents/` y `Sistema/Skills/` — el runtime tal como corre",
    "- `Proyectos/<id>/_INDEX.md` — la memoria de cada proyecto, objeto por objeto", "",
    "Abre la vista de grafo: desde un tema se ve qué tareas de qué proyectos dependen de él.", "",
  ].filter((x) => x !== null)
  writeFileSync(join(DESTINO, "_INICIO.md"), L.join("\n") + "\n")

  console.log(`\nbóveda → ${DESTINO}`)
  console.log(`  planes:    ${planes.length} (${totalTareas} tareas, ${totalHechas} hechas)`)
  console.log(`  sesiones:  ${sesiones.reduce((a, s) => a + s.sesiones, 0)} (${(totalTokens / 1e6).toFixed(2)} M tokens medidos)`)
  console.log(`  encargos:  ${encargos.reduce((a, e) => a + e.encargos, 0)}`)
}

function estado() {
  if (!existsSync(DESTINO)) { console.log(`no existe la bóveda en ${DESTINO}`); return }
  const contar = (d) => { let n = 0; const w = (x) => { if (!existsSync(x)) return; for (const f of readdirSync(x)) { const p = join(x, f); try { statSync(p).isDirectory() ? w(p) : f.endsWith(".md") && n++ } catch {} } }; w(d); return n }
  console.log(`bóveda: ${DESTINO}`)
  for (const s of ["Cerebro", "Proyectos", "Planes", "Sesiones", "Encargos", "Sistema"])
    console.log(`  ${s.padEnd(12)} ${String(contar(join(DESTINO, s))).padStart(5)} notas`)
  console.log(`  ${"TOTAL".padEnd(12)} ${String(contar(DESTINO)).padStart(5)} notas`)
}

if (cmd === "empujar") empujar()
else if (cmd === "estado") estado()
else {
  console.log(`baul.mjs — la pasarela hacia la bóveda de Obsidian

  empujar [--destino <vault>] [--sin-export] [--proyecto <id>]
      Sube todo: sistema, memorias y cerebro (vía export-vault) + planes de
      ejecución con una nota por tarea, historial de sesiones con su gasto
      medido, y encargos. Reescribe la portada.

  estado [--destino <vault>]
      Cuántas notas hay en cada sección.

Destino por defecto: ${DESTINO}`)
  process.exit(cmd ? 1 : 0)
}
