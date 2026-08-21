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
   `node C:\Users\Kalel\ORION\tools\validate-memory.mjs <memory-dir>`.
   If INVALID, fix (trivial JSON repairs inline; otherwise re-brief the
   curator with the exact errors) and re-validate. Do not close a session
   leaving invalid memory. Known invariant: metrics `sessionCount` must
   equal `sessions.length`.
3b. **Regenerate the Obsidian vault view.** Run
   `node C:\Users\Kalel\ORION\tools\generate-vault.mjs <memory-dir>` — a
   deterministic script (never delegate this to an agent) that rewrites
   `<memory-dir>/vault/` (one .md per object with [[links]] + _INDEX.md).
   The vault is a one-way human-browsable VIEW of state.json; manual edits
   there are input for the next curation, never synced back automatically.
   Also delete `<memory-dir>/wave.json` if present and its wave is complete.
4. **Commit** the memory changes in the repo that holds them (for InfraPilot:
   the parent repo `C:\Users\Kalel\ORION`, InfraPilot.v01) with a message like
   `orion: session close — memory curation (vN)`. Do NOT push — remind the
   user of any commits pending push via GitHub Desktop.
5. **Report** (≤15 lines, user's language): objects merged/archived, active
   count before → after, new version, validation result, commits made, and
   the top open Pending items for next session.
