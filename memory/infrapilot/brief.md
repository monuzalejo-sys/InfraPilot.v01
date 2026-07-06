# infrapilot Memory Brief

**Project**: InfraPilot AI — Next.js 16 app (Supabase auth, Groq LLM, engineering tools).

## Hard Constraints
- Next.js 16.2.7 breaking changes: read node_modules/next/dist/docs/ before new code.
- Git pushes via CLI fail (no /dev/tty); use GitHub Desktop instead (KN-001).
- Supabase project zrogravgwhoijajzciem; anon key in .env.local (never commit).
- xlsx npm has vulns; requires tarball from cdn.sheetjs.com (security gate, no agent npm-CDN).

## Top Architecture
- **ORION v3 active**: wave.json (ephemeral manifest before parallel spawns), dependency-safe reflection + auto-validation, calibration applied (analyst haiku/default), brief.md as primary orchestrator context.
- **Disciplines registry** (lib/disciplines.ts): canonical array of engineering disciplines (construcción, topografía, licitaciones, analítica, informática). Add new discipline = append to array; sidebar + routing auto-react.
- **Editorial design** (KN-016): warm paper #F6F3ED, ink #1B1A17, brass #A8895B. Extends app-wide via :root in globals.css + components/editorial.tsx.
- **Landing v2** (KN-020): hero full-viewport, 2-line titular, mono subline, 3D latón knob, pill nav (diamond→/cotizador, cycle→/dashboard), SVG collage (terrain + code editor + dimension lines).
- **Supabase migrations** (2026-07-06): 000_initial_schema + 001_prices_apus applied; 002_suppliers_quotes pending user apply (PEND-015).

## Open Work (9 items)
1. **PEND-002** (In-Progress, High): Supabase creds verified local; Vercel vars + production write still pending.
2. **PEND-013** (Blocked, Medium): /api/lector end-to-end test blocked on GROQ_API_KEY from user.
3. **PEND-014** (Blocked, Low): Manual xlsx tarball upgrade (0.20.3, no agent CDN access).
4. **PEND-015** (Blocked, High): User: apply migration 002_suppliers_quotes.sql + test /proveedores flow.
5. **PEND-004** (Ready, Low): Push via GitHub Desktop (pending manual action).
6. **PEND-009** (Ready, Low): Stray C:\Users\Kalel\package-lock.json outside app (housekeeping, ask user first).
7–9. Blocker chains: KN-015→PEND-013 (Groq), KN-022→PEND-015 (migration), KN-017→PEND-014 (xlsx).

## Decisions (5 Permanent)
- DEC-001: ORION standard in InfraPilot.v01 repo (not separate).
- DEC-003/004: Six ORION agents + adaptive model policy (haiku/sonnet/opus by difficulty).
- DEC-005: Autocommit on VERIFYING PASS; push manual.
- DEC-008: Ecosystem ORION v3 (wave.json, atomic reflector, applied calibration, Obsidian vault).

## Key Facts
- **App status**: Working Next.js 16 demo with Supabase auth (user test account live), dashboard, cotizador, APUs, licitaciones, predictor, presupuestos, topografía, licitador IA, informatica.
- **React 19 pattern** (KN-014): lazy guard → useEffect + scoped eslint-disable for intentional set-state-in-effect.
- **Agent reliability** (KN-018): 5/10 spawns died mid-work this session; recovery: diff claimed vs actual, re-spawn narrow delta only.
- **Build exit 0**: topografía (8/8 tests), informatica (8/8 tests), all 27 routes verified.

## Memory State
- **Active**: 36 objects (5 Decisions, 15 Knowledge, 1 Constraint, 9 Pending, 1 Architecture).
- **Archived**: 12 items (PEND-001..008, KN-011, PEND-010, PEND-012; final curation: KN-004→KN-010, KN-012→KN-016).
- **Version**: 24. Last AMM: 2026-07-06 SESSION_CLOSE. Validation: VALID (1 warning: >25 objects).
