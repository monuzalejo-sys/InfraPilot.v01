---
name: "orion-status"
description: "Cheap ORION session-start briefing: reads the project's ORION memory (state.json/metrics.json), validates it, and reports open Pending items, active Risks/Constraints, recent decisions and last-run outcomes — then proposes what to work on next. Use at the start of a work session, or when the user asks 'estado', 'status', 'qué hay pendiente', or 'continuar' without a specific task."
---

# ORION Status — session-start briefing

Give the user a compact, current picture of the project under ORION. This is a
READ-ONLY skill: no agents, no edits, minimal tokens.

1. Locate the memory: `<outermost-repo-root>/memory/<projectId>/` (for work
   under `C:\Users\Kalel\ORION`, that's `C:\Users\Kalel\ORION\memory\infrapilot`).
   If there is no memory dir, say so and offer to start a first `/orion` run.
2. Run `node C:\Users\Kalel\ORION\tools\validate-memory.mjs <memory-dir> --stats`
   — one cheap command; include its RESULT line. If INVALID, list the errors
   and offer to repair before anything else. The MODEL CALIBRATION table it
   prints is the learning signal: surface any "rate HARDER"/"CHEAPER tier"
   hints so the next /orion run applies them.
3. Read `state.json` (one read — it's the same data the validator just
   checked). Report, in this order, only what's actionable:
   - **Pendientes abiertos** (status Ready/Blocked/In-Progress), grouped by
     priority, one line each. Note blocked ones and what blocks them.
   - **Riesgos abiertos / Constraints activos** — one line each.
   - **Última actividad**: last session's outcome from `metrics.json`
     (objects created/merged, modelOutcomes verdicts if present), `lastAmmRun`,
     state version.
   - If the validator warned about archivable objects or size, mention that a
     `/orion-close` (curation) is due.
3b. **El cerebro, en una línea.** Corre
   `node C:\Users\Kalel\ORION\tools\cerebro.mjs estado` e incluye una sola
   línea: cuántos temas hay, cuántos objetos indexa y qué proyectos siguen sin
   ningún tema transversal. Si el proyecto que se va a trabajar aparece ahí, es
   señal de que su conocimiento está encerrado y no le sirve a nadie más.
   Y si el usuario pregunta algo concreto en vez de pedir estado, no recites la
   memoria: usa el skill `orion-cerebro`, que responde con cita.

3c. **¿Hay plan? Entonces él manda sobre los pendientes.** Si existe
   `<memory-dir>/plan.json`, córrelo — dos comandos baratos, y **nunca leas el
   plan entero** (RFC-0008 N8-R11):

   ```bash
   node C:\Users\Kalel\ORION\tools\plan.mjs estado <memory-dir>/plan.json
   node C:\Users\Kalel\ORION\tools\plan.mjs siguiente <memory-dir>/plan.json --n 3
   ```

   Reporta el avance por nivel, el presupuesto que queda, las bloqueadas (cada
   una es una decisión que alguien no ha tomado) y las tres tareas listas. La
   línea de calibración importa: si dice que el presupuesto está descalibrado
   sobre 5+ tareas medidas, menciónalo. Si NO hay plan y el proyecto tiene
   trabajo abierto, proponlo: `/orion-plan` es lo que más ahorra después
   (`tema:planes-de-ejecucion`).

4. End with a short recommendation: the 1-3 highest-value next tasks. If there
   is a plan, they come from `plan.mjs siguiente` and the user launches one
   with `/orion T-042`. If there is no plan, derive them from open Pending
   priorities as before, phrased so the user can reply `/orion <task>`.

Respond in the user's language (Spanish for this user). Total output ≤30 lines.
Do NOT start any task — this skill only orients.
