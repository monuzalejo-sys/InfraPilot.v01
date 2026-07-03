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
2. Run `node C:\Users\Kalel\ORION\tools\validate-memory.mjs <memory-dir>` —
   one cheap command; include its RESULT line. If INVALID, list the errors and
   offer to repair before anything else.
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
4. End with a short recommendation: the 1-3 highest-value next tasks, derived
   from open Pending priorities and the user's known goals — each phrased so
   the user can reply `/orion <task>` to launch it.

Respond in the user's language (Spanish for this user). Total output ≤30 lines.
Do NOT start any task — this skill only orients.
