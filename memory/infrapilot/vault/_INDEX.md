# Memoria ORION — infrapilot

Generado de state.json v21 (2026-07-06T06:00:00.000Z). NO editar a mano: se regenera en cada cierre de sesión.

## Architecture (1)

- [[ARCH-001]] `Implemented` — ORION Task runtime invocation

## Constraint (1)

- [[CON-001]] `Active` — infrapilot-app/AGENTS.md (imported by CLAUDE.md) explicitly warns: thi

## Decision (8)

- [[DEC-001]] `Accepted` — ORION standard lives inside the InfraPilot.v01 repo, not a separate re
- [[DEC-002]] `Accepted` — infrapilot-app registered as a proper git submodule pointing at monuza
- [[DEC-003]] `Accepted` — Six dedicated ORION subagents created, mapped to the RFC-0002 contract
- [[DEC-004]] `Accepted` — ORION model policy: adaptive by difficulty, ceiling Opus
- [[DEC-005]] `Accepted` — ORION autocommits on verification PASS; push stays manual
- [[DEC-006]] `Accepted` — AMM schema embedded in reflector agent, not runtime-parsed
- [[DEC-007]] `Accepted` — Proportional lifecycle: ceremony scales with task size
- [[DEC-008]] `Accepted` — Ecosistema ORION v3: resiliencia a muertes, calibración aplicada, vaul

## Knowledge (21)

- [[KN-001]] `Current` — GitHub pushes from this automated terminal environment cannot complete
- [[KN-002]] `Current` — A malformed path '.gitignoregit add .' existed in the original InfraPi
- [[KN-003]] `Current` — infrapilot-app is NOT a greenfield project. It's a working Next.js 16.
- [[KN-004]] `Current` — [DEPRECATED: see KN-010 for definitive config map] Initial app config 
- [[KN-005]] `Current` — infrapilot-app's next build was failing because the Groq client was in
- [[KN-006]] `Current` — ORION agent hardening for autonomy: all 6 agents (analyst, planner, bu
- [[KN-007]] `Current` — AMM Schema invariant: tier MUST match lifetime per RFC-0002 §5.2. Tier
- [[KN-008]] `Current` — infrapilot-app's tax-by-currency table is hardcoded in lib/utils.ts wi
- [[KN-009]] `Current` — A pre-commit hook validates ORION memory on every commit of this repo:
- [[KN-010]] `Current` — Definitive infrapilot-app config map (analyst-verified with file:line)
- [[KN-013]] `Current` — infrapilot Supabase is now configured LOCALLY. Project ref zrogravgwho
- [[KN-014]] `Current` — React 19 StrictMode failure pattern: the 'lazy guard' idiom in a compo
- [[KN-015]] `Current` — New features added 2026-07-05: (1) /lector + /api/lector — an AI data-
- [[KN-012]] `Current` — [DEPRECATED: see KN-016 for current system] Landing redesign design sy
- [[KN-016]] `Current` — The warm-paper editorial redesign was extended 2026-07-05 from just th
- [[KN-017]] `Current` — The xlsx npm package (dependency of excel-export.ts and the prices/imp
- [[KN-018]] `Current` — ORION agent-spawn reliability observed 2026-07-05: 3 of 10 spawns this
- [[KN-019]] `Current` — Claude Code built-in agent permission classifier enforces two hard blo
- [[KN-020]] `Current` — Landing v2 (commit a6314fe): hero full-viewport recreado 1:1 de la ref
- [[KN-021]] `Current` — lib/disciplines.ts is the canonical registry of InfraPilot's engineeri
- [[KN-022]] `Current` — Supabase migration pattern (error.code 42P01 / /does not exist|schema 

## Pending (6)

- [[PEND-002]] `In-Progress` — Verify/configure real Supabase credentials end-to-end (local .env + co
- [[PEND-004]] `Ready` — Push vía GitHub Desktop (app primero, luego parent). Pendientes ahora:
- [[PEND-009]] `Ready` — Stray lockfile: C:\Users\Kalel\package-lock.json exists outside infrap
- [[PEND-013]] `Blocked` — Test /api/lector end-to-end once the user sets a real GROQ_API_KEY in 
- [[PEND-014]] `Blocked` — Manually update the xlsx dependency to the official SheetJS CDN tarbal
- [[PEND-015]] `Blocked` — Usuario: ejecutar supabase/migrations/002_suppliers_quotes.sql en Supa

## Archivado (10)

- ~~PEND-001~~ (Expired) — Sprint item, Done status, no dependencies, resolution alread
- ~~PEND-003~~ (Expired) — Sprint item, Done status, no dependencies, findings captured
- ~~PEND-006~~ (Expired) — Sprint item, Done status, no dependencies, caveat extracted 
- ~~PEND-005~~ (Expired) — Sprint item, Done status, no dependencies, resolution captur
- ~~PEND-007~~ (Expired) — Sprint item, Done status, no dependencies, resolution captur
- ~~PEND-008~~ (Expired) — Sprint item, Done status, no dependencies, dead code cleanup
- ~~PEND-011~~ (Expired) — Project-lifetime item, Done status, no dependencies, depende
- ~~PEND-012~~ (Expired) — Sprint item, Done status, work completed and committed (comm
- ~~KN-011~~ (Superseded) — Uncommitted/unverified work from interrupted redesign (2026-
- ~~PEND-010~~ (Expired) — Sprint item, Done status (commit 21774b5, AMM implementation

