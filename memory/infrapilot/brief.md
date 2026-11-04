# infrapilot Memory Brief

**Project**: InfraPilot AI — Next.js 16 app (Supabase auth, Groq LLM, engineering tools).

## Hard Constraints
- Next.js 16.2.7 breaking changes: read node_modules/next/dist/docs/ before new code.
- Git push: automatic on verification PASS per DEC-005 (2026-09-01 enabled, verified working). Path references use $ORION_HOME envvar (Mac: /Users/g/orion/); infrapilot-app at /Users/g/orion/prommter/infrapilot-app (diverged remotes, held for review).
- Supabase project zrogravgwhoijajzciem; anon key in .env.local (never commit).
- Pending migrations: 002_suppliers_quotes.sql (user action, PEND-015), 003_organizations.sql (written, reviewed, NOT APPLIED — blocks /organizaciones, /perfil with 503, see RSK-001).
- GROQ_API_KEY missing in .env.local (currently empty); blocks /api/lector end-to-end test (PEND-013).
- xlsx npm has vulns; requires tarball from cdn.sheetjs.com (security gate, no agent npm-CDN).
- Agent permission classifier blocks: (1) npm install from external URLs, (2) DB INSERT/UPDATE/DELETE without explicit user approval (KN-019).

## Top Architecture
- **ORION v3 active**: wave.json (ephemeral manifest), dependency-safe reflection + auto-validation, calibration applied, brief.md as primary orchestrator context, Obsidian vault export.
- **Roadmap 6 stages** (ROAD-001..006): Etapa 1,3,4,6 DONE. Etapa 2,5 Planned/In-Progress (user actions pending).
  - ✓ Etapa 1: Hub + Excel fórmulas + quips + poligonal (2026-07-06, commit 0464a7a).
  - ✓ Etapa 3: Cross-module integrations (info→presupuestos, topo→tierras, precios→APUs) + construcción deepening (2026-07-28, commit 91ab9d6).
  - ✓ Etapa 4: Tercera disciplina (eléctrica, circuitos+tableros) via template KN-025 (2026-07-28, commit 91ab9d6).
  - ✓ Etapa 6: PWA (manifest, icons, service worker) (2026-07-28, commit 91ab9d6).
  - ▶ Etapa 2: Prod activation (Vercel vars NEXT_PUBLIC_SUPABASE_URL + ANON_KEY + GROQ_API_KEY, migration 002 apply, E2E test) — PEND-002/013/015.
  - ▶ Etapa 5: Team accounts + org RLS + professional profiles — ROAD-005 In-Progress, blocked by RSK-001 (migration 003 unapplied).
- **Disciplines registry** (lib/disciplines.ts): 4 profession disciplines — construcción, topografía, informática, eléctrica — plus an `inicio` nav-only entry (`esNavegacion: true`, excluded from the hub). Licitaciones, predictor, precios, APUs, proveedores, lector are MODULES INSIDE construcción, not disciplines. Add a discipline = append to the array; sidebar + hub + routing auto-react.
- **New Discipline Template** (KN-025): lib/disciplina/{file}.ts (pure functions + __selfTest), /disciplina page (tabs), ProfesionQuips at footer. Validated 4× (topografía, informatica, eléctrica, implicit in ROAD-001).
- **Design System Canonical** (DEC-010): skill estudio-diseno "El estudio del ingeniero moderno" defines exact palette (#F8F6F2 bg, #FCFBF8 cards, #171717 sidebar, #111111 ink), typography (huge + light + air), components as physical objects, buttons as tool-capsules, editorial composition, 2px/180ms microinteractions, AI as silent companion. Actual token values in app/globals.css are source of truth (drift noted in KN-029).
- **Editorial design** (KN-016): warm paper system app-wide via :root + editorial.tsx (typography, spacing, shadows, component tokenization).
- **Excel Export Pattern** (KN-024): xlsx round-trip silently discards formulas without precalculated `v` value; lib/excel-export.ts bundles f(formula, value, fmt); all new modules use crearLibroConFormulas().
- **Supabase migrations**: 000_initial_schema + 001_prices_apus applied (6 tables, RLS active). 002_suppliers_quotes pending user apply (PEND-015). 003_organizations.sql written, reviewed, but NOT APPLIED (blocks orgs/perfil with 503, RSK-001).
- **Presupuestos "origen" field**: new `origen` field added to budgets, tracking source of estimation (informática, topografía, etc.). Integrations live and verified.

## Open Work (6 Pending)
1. **PEND-002** (In-Progress, High): Supabase local creds verified; Vercel deployment vars + production write test pending.
2. **PEND-013** (Blocked, Medium): /api/lector end-to-end test blocked on GROQ_API_KEY from user.
3. **PEND-015** (Blocked, High): User: apply migration 002_suppliers_quotes.sql + test /proveedores flow.
4. **PEND-016** (Ready, Medium): Personalizar hub por profesión — bloqueado por RSK-001 (migración 003 sin aplicar, /perfil devuelve 503).
5. **PEND-018** (Ready, High): Replace/remove fabricated testimonial and unverified claims in infrapilot-app login page (Carlos Quispe, CAPECO prices, PDF export).
6. **PEND-019** (Blocked, Medium): Await owner's verdict on 8 landing prompts delivered 2026-08-16; landing-prompter learning mechanism pending.

## Decisions (10 active: 2 Project, 8 Permanent)
DEC-001 (ORION in repo), DEC-002 (submodule), DEC-003/004 (agents+models), DEC-005 (autocommit), DEC-006 (AMM schema), DEC-007 (proportional lifecycle), DEC-008 (ORION v3), DEC-009 (module nav by discipline), DEC-010 (design system).

## Key Facts & Caveats
- **App status** (measured 2026-07-28): `npm run build` exit 0 with **38 routes** (was 27), tsc clean, eslint 0 errors, **43/43 lib self-tests PASS**, ProfesionQuips renders on 13/13 module pages. Pages: dashboard(presentación), cotizador, presupuestos, precios, APUs, proveedores, lector IA, licitaciones, predictor, topografía, informática, eléctrica, perfil. PWA manifest + service worker live and served publicly.
- **NOT exercised**: authenticated flows were never clicked through (no test credentials — entering passwords is out of policy). The POST→Supabase round-trips (informática/topografía → presupuesto, APU reprice persist) and the 503 degradation paths are verified by code review only.
- **React 19** (KN-014): lazy guard → useEffect + scoped eslint-disable for intentional set-state-in-effect.
- **Agent reliability** (KN-018, KN-018 expanded): recovery protocol on death; INFRA_DEATH (session limits) doesn't count as model signal; new death mode: builder finishes work but returns empty report.
- **Middleware caveat** (KN-028): proxy.ts redirects unlisted paths to /login; browser requests (SW, manifest, .well-known/*) don't carry session, so they need explicit PUBLIC_PATHS entries.
- **Electrical discipline caveat** (RSK-002): ampacity tables (IEC/NEC) are medium-confidence reference data; override per local jurisdiction.
- **Migration 003 caveat** (RSK-001): 003_organizations.sql (233 lines, security-definer RLS helpers, owner-bootstrap trigger) has NEVER BEEN EXECUTED — no psql, no Supabase CLI, no Docker on this machine. Code review only. Must apply to throwaway project first, verify idempotency (run twice), then apply to production.

## Memory State
- **Active**: 52 objects (11 Decisions, 28 Knowledge, 1 Constraint, 6 Pending, 1 Architecture, 2 Roadmap [ROAD-002, ROAD-005], 3 Risk [RSK-001/002/003]).
- **Archived**: 23 items (PEND-001..012/017/009/014/004, KN-002/004/011/012/020/023, ROAD-001/003/004/006).
- **Version**: 39. Last AMM: 2026-09-03 SESSION_CLOSE. Validation: PASSED (tools/validate-memory.mjs, 52 active objects, 1 warning: >25 threshold reached but no duplicates or terminal items remain).
