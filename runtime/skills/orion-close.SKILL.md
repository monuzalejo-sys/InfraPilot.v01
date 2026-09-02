---
name: "orion-close"
description: "ORION session close (AMM SESSION_CLOSE event): persists any un-reflected work to project memory, runs the orion-curator agent to deduplicate/archive/compact state.json, validates the result, and commits memory changes locally. Use when the user says 'cerrar sesión', 'cierra la sesión', 'close session', or is wrapping up a work session."
---

# ORION Close — session close with memory curation

Implements the AMM `SESSION_CLOSE` trigger (Critical priority, N-AMM-R2:
autonomous — no per-step approval needed). Order matters:

1. **Un-persisted work?** If this session did substantive work whose lessons
   are NOT yet in memory (no reflector ran for it), spawn `orion-reflector`
   (haiku; sonnet only if the lessons are nuanced) with a compact run summary
   and the absolute memory dir path. If everything was already reflected,
   skip — don't write noise objects just to have something to persist.
2. **Curate.** Spawn `orion-curator` (haiku) on the memory dir with
   `triggeredBy: SESSION_CLOSE`. It dedupes, archives terminal/expired
   objects, and appends its own metrics entry.
3. **Validate.** Run
   `node $ORION_HOME/tools/validate-memory.mjs <memory-dir>`.
   If INVALID, fix (trivial JSON repairs inline; otherwise re-brief the
   curator with the exact errors) and re-validate. Do not close a session
   leaving invalid memory. Known invariant: metrics `sessionCount` must
   equal `sessions.length`.
3b. **Push everything to the vault — the gateway.** Run

   ```bash
   node $ORION_HOME/tools/baul.mjs empujar
   ```

   One deterministic command (**never delegate this to an agent** — a subagent
   that "summarizes on the way" is exactly how a view gets corrupted). It sends
   the standard and runtime, every project's memory object by object, the
   cerebro's curated temas, the execution plans **with one note per task**, the
   session history **with what each one measured**, and the encargos — all
   cross-linked, so opening a tema in Obsidian shows every task in every
   project that depends on it.

   The vault is a one-way human-browsable VIEW; manual edits there are never
   synced back — but `cerebro.mjs ruta` does find hand-written notes and flags
   them, so they become input for the next curation instead of being lost.
   If a project's memory changed but nothing else, `--sin-export` is faster.
   Also delete `<memory-dir>/wave.json` if present and its wave is complete.

3b-bis. **Write back the plan.** If this session executed tasks from
   `plan.json`, make sure each one was closed with
   `plan.mjs hecho … --evidencia … --tokens …` (RFC-0008 N8-R10) and run
   `node $ORION_HOME/tools/plan.mjs validar <plan.json>`. A plan that
   is not written back stops being a control loop and goes back to being a
   document — and the budget never converges. Then regenerate its prose view
   with `plan.mjs md <plan.json>`.
3c. **Alimenta el cerebro.** El cierre es el único momento en que se sabe qué
   dejó la sesión. Si hubo una lección que serviría en OTRO proyecto (algo
   falló, algo se midió, el dueño rechazó algo), lanza `orion-harvester` con
   esa lección: busca primero en el cerebro, refuerza si ya existe y escribe un
   tema nuevo solo si pasa su puerta de calidad. Lo que solo vale dentro del
   proyecto se queda como objeto de su memoria — no todo merece un tema.
   Después, siempre:

   ```
   node $ORION_HOME/tools/cerebro.mjs citas
   node $ORION_HOME/tools/cerebro.mjs probar
   node $ORION_HOME/tools/cerebro.mjs exportar
   ```

   La prueba dice si el cerebro sigue respondiendo a las preguntas reales; si
   bajó respecto al cierre anterior, algo se rompió y se arregla antes de
   cerrar. Reporta el puntaje: es la métrica de si el ecosistema está
   aprendiendo o solo acumulando.

4. **Commit** the memory changes in the repo that holds them (for InfraPilot:
   the parent repo `$ORION_HOME`, InfraPilot.v01) with a message like
   `orion: session close — memory curation (vN)`, and push it: publishing is
   part of closing (owner's decision, 2026-09-01).
4b. **Mira dónde se fue el gasto.** Un solo comando, ~0 tokens:

   ```bash
   node $ORION_HOME/tools/costos.mjs fugas
   ```

   Da las tres fugas medidas —muertes de agente, tier de más, ceremonia de más—
   con su número actual. Incluye UNA línea suya en el reporte. Una
   recomendación sin cifra no cambia una costumbre; la cifra sí, y por eso se
   mira al cerrar y no cuando ya duele.

5. **Report** (≤15 lines, user's language): objects merged/archived, active
   count before → after, new version, validation result, commits made, and
   the top open Pending items for next session.
