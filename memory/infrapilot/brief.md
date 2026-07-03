# InfraPilot — project brief (curated, ≤50 lines)

Maintained by orion-curator. The orchestrator reads THIS instead of hunting
CLAUDE.md/AGENTS.md/README per session, and excerpts from it into agent briefs.
Regenerate when Decisions/Constraints change. Last regenerated: 2026-07-02 (v11).

## What this repo is
InfraPilot.v01 (github.com/monuzalejo-sys/InfraPilot.v01) holds THREE things:
1. **ORION standard** — ORION_STANDARD.md + RFC/0001..0007 + Skills/ (AMM).
2. **InfraPilot product docs** (Spanish) — Blueprint, database-design,
   ui-ux-design, demo-flow.
3. **Runtime + memory** — runtime/ (mirrors of ~/.claude agents/skills),
   memory/infrapilot/ (this dir), tools/validate-memory.mjs.

`infrapilot-app/` is a git SUBMODULE → repo InfraPilot.Ai: Next.js 16.2.7 /
React 19.2.4 / Tailwind 4, deployed on Vercel. App commits go to the submodule
repo; memory/docs commits go to the parent. Memory ALWAYS lives in the parent.

## Hard constraints (respect without re-litigating)
- **CON-001 / Next.js**: v16.2.7 has breaking changes vs LLM training data.
  READ `node_modules/next/dist/docs/` guides before writing Next.js code.
- **No terminal push** (KN-001): commit locally; user pushes via GitHub
  Desktop. Autocommit on verification PASS is standing policy (DEC-005).
- **No .env locally** (KN-004): UI runs on lib/mock-*.ts data; API routes are
  real Supabase and fail without credentials. Biggest open gap = PEND-002.
- Never instantiate API-key clients at module scope in route files (KN-005) —
  construct inside the handler after the key guard.

## Conventions
- App code: match existing style in infrapilot-app (TypeScript, Tailwind).
- ORION docs: English, RFC-2119 keywords, architecture-level, link don't
  duplicate. Product docs: Spanish.
- Memory objects: AMM schema; validate with
  `node tools/validate-memory.mjs memory/infrapilot`.

## Top open work (see state.json for full list)
- PEND-002 (High): real Supabase credentials end-to-end (login/persistence).
- PEND-005 (High): Excel export ignores real AI budget (hardcoded mock).
- PEND-007 (Med): 6 react-hooks lint warnings need reviewed batch fix.
