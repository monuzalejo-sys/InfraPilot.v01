# InfraPilot — project brief (curated, ≤50 lines)

Maintained by orion-curator. The orchestrator reads THIS instead of hunting
CLAUDE.md/AGENTS.md/README per session, and excerpts from it into agent briefs.
Regenerate when Decisions/Constraints change. Last regenerated: 2026-07-06 (v20).

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
- **App config** (KN-010): 3 env vars (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY, GROQ_API_KEY).
  Auth 100% Supabase (RLS), AI features Groq only. Migrations: 000_initial + 001_prices_apus.
- Never instantiate API-key clients at module scope in route files (KN-005) —
  construct inside the handler after the key guard.
- **Editorial design system** (KN-016): warm paper #F6F3ED, ink #1B1A17, brass #A8895B.
  Tokens in :root (globals.css), shared primitives (editorial.tsx), all ui/* tokenized.

## Conventions
- App code: match existing style in infrapilot-app (TypeScript, Tailwind).
- React 19 StrictMode lazy-guard pattern: move guards into useEffect, suppress
  react-hooks/set-state-in-effect with scoped comment (KN-014).
- ORION docs: English, RFC-2119 keywords, architecture-level, link don't
  duplicate. Product docs: Spanish.
- Memory objects: AMM schema; validate with
  `node tools/validate-memory.mjs memory/infrapilot`.

## Top open work (see state.json for full list)
- PEND-002 (High, In-Progress): real Supabase credentials on Vercel (local done, prod pending).
- PEND-004 (Low, Ready): Push local commits via GitHub Desktop.
- PEND-013 (Medium, Blocked): Test /api/lector end-to-end (needs real GROQ_API_KEY).
- PEND-014 (Low, Blocked): Update xlsx to CDN tarball (security fix, user action).
- PEND-015 (High, Blocked): Apply migration 002_suppliers_quotes in Supabase, then verify /proveedores flow live.
