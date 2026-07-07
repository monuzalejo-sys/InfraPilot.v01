# infrapilot Memory Brief

**Project**: InfraPilot AI — Next.js 16 app (Supabase auth, Groq LLM, engineering tools).

## Hard Constraints
- Next.js 16.2.7 breaking changes: read node_modules/next/dist/docs/ before new code.
- Git pushes via CLI fail (no /dev/tty); use GitHub Desktop instead (KN-001).
- Supabase project zrogravgwhoijajzciem; anon key in .env.local (never commit).
- xlsx npm has vulns; requires tarball from cdn.sheetjs.com (security gate, no agent npm-CDN).
- Agent permission classifier blocks: (1) npm install from external URLs, (2) DB INSERT/UPDATE/DELETE without explicit user approval (KN-019).

## Top Architecture
- **ORION v3 active**: wave.json (ephemeral manifest), dependency-safe reflection + auto-validation, calibration applied, brief.md as primary orchestrator context.
- **Roadmap 6 stages** (ROAD-001..006): Etapa 1 DONE (hub + Excel fórmulas + quips + poligonal). Etapas 2–6 planned (production activation, cross-module integrations, third discipline, team accounts, PWA).
- **Disciplines registry** (lib/disciplines.ts): canonical array (construcción, topografía, licitaciones, analítica, informática). Add = append; sidebar + routing auto-react.
- **New Discipline Template** (KN-025): lib/disciplina/ (pure functions + __selfTest), /disciplina page (tabs), ProfesionQuips at footer. Validated 3× (topografía, informática, implicit in ROAD-001). Ready for estructura, eléctrica, mecánica.
- **Editorial design** (KN-016): warm paper #F6F3ED, ink #1B1A17, brass #A8895B. App-wide via :root + editorial.tsx.
- **Landing v2** (KN-020): hero full-viewport, 2-line titular, mono subline, 3D brass knob, pill nav, SVG collage (terrain + code + dimensions).
- **Excel Export Pattern** (KN-024): xlsx round-trip silently discards formulas without precalculated `v` value; lib/excel-export.ts bundles f(formula, value, fmt); all new modules use crearLibroConFormulas().
- **Supabase migrations** (2026-07-06): 000_initial_schema + 001_prices_apus applied (6 tables, RLS active). 002_suppliers_quotes pending user apply (PEND-015).

## Roadmap Progress
| Etapa | Status | Description | Evidence |
|-------|--------|-------------|----------|
| **Etapa 1** | ✓ DONE | Hub, Excel fórmulas, quips, poligonal | commits 0464a7a, 33273bb; KN-024..026 |
| **Etapa 2** | ▶ Planned | Prod activation (Vercel vars, GROQ_API_KEY, migration 002, E2E test) | PEND-002/013/015 |
| **Etapa 3** | ▶ Planned | Cross-module integrations (info→presupuestos, topo→tierras, precios→APUs) | depends ROAD-002 |
| **Etapa 4** | ▶ Planned | Third discipline (estructura/eléctrica/mecánica) via template KN-025 | template ready |
| **Etapa 5** | ▶ Planned | Team accounts, org-scoped RLS, professional profiles | infrastructure prep |
| **Etapa 6** | ▶ Planned | PWA (manifest, service worker, offline calculators) | shortest path to "app" |

## Open Work (6 Pending)
1. **PEND-002** (In-Progress, High): Supabase local creds verified; Vercel vars + production write test pending.
2. **PEND-015** (Blocked, High): User: apply migration 002_suppliers_quotes.sql + test /proveedores flow.
3. **PEND-013** (Blocked, Medium): /api/lector end-to-end test blocked on GROQ_API_KEY from user.
4. **PEND-014** (Blocked, Low): Manual xlsx tarball upgrade (0.20.3, security vuln, no agent CDN access).
5. **PEND-004** (Ready, Low): Push via GitHub Desktop (pending manual action).
6. **PEND-009** (Ready, Low): Stray C:\Users\Kalel\package-lock.json (housekeeping, ask user first).

## Decisions (7 active: 2 Project, 5 Permanent)
- DEC-001: ORION standard in InfraPilot.v01 repo (not separate) [Project].
- DEC-002: infrapilot-app registered as proper git submodule [Project].
- DEC-003/004: Six ORION agents + adaptive model policy (haiku/sonnet/opus by difficulty) [Permanent].
- DEC-005: Autocommit on VERIFYING PASS; push manual [Permanent].
- DEC-006: AMM schema embedded in reflector agent [Permanent].
- DEC-007: Proportional lifecycle: ceremony scales with task size [Permanent].

## Key Facts
- **App status**: Working Next.js 16 with Supabase auth (live), 11 modules (dashboard hub, cotizador, APUs, licitaciones, predictor, presupuestos, topografía, lector IA, informatica, proveedores, comparativa). Build exit 0, 27 routes, all modules 8/8 self-tests PASS.
- **React 19 pattern** (KN-014): lazy guard → useEffect + scoped eslint-disable for intentional set-state-in-effect.
- **Agent reliability** (KN-018): Recovery protocol documented (diff claimed vs actual, re-spawn narrow delta only).
- **Parallel builders** (KN-026): Cross-contract dependencies safe via commented TODOs; orchestrator uncomments post-ola. Practiced in ROAD-001 (1 trivial fix, import).

## Memory State
- **Active**: 41 objects (7 Decisions, 21 Knowledge, 1 Constraint, 6 Pending, 1 Architecture, 5 Roadmap).
- **Archived**: 14 items (PEND-001..012, KN-004/011/012/023, ROAD-001 post-completion).
- **Version**: 27. Last AMM: 2026-07-07 SESSION_CLOSE. Validation: VALID.
