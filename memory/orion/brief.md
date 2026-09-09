# ORION: The Meta-Build System

**What it is:** ORION is the runtime, standard, and toolkit for building AI-driven projects. It's not a product—it's the method itself. Hosted at `/Users/g/orion` with memory in `memory/orion/`.

**Core principles:**
- Runtime under `runtime/` (agents, skills, tools) synced to `~/.claude/` via `tools/runtime.mjs`
- Plans live in `<project>/plan.json` (RFC-0008): machine-readable, never edited in markdown
- `memory/*/state.json` is the single source of truth; `brief.md` and `.md` files are derived
- All agent/skill commands use `$ORION_HOME` (per-machine in `~/.claude/settings.json`)
- Catalog of 725 archetipos in 11 categories (2 new: arquitectura, saas), instantiated per entity/route/role (zero invented work)
- Profile has 13 opt-in boolean switches: nube, multiTenant, suscripcion, autoservicio, equipoCliente, correoSaliente, apiPublica, traficoAnonimo, tiempoReal, plus dineroReal, datosPersonales, multiUsuario, publico

**Hard constraints:**
- Plan: never embed paths literal; use `$ORION_HOME`
- Memory: every ID in state.json must appear in objects[] or archives[]; never deleted (N-AMM-R8)
- Dependencies: can't archive objects that active items reference (N-AMM-R9)
- Build: parallelizable tasks must have disjoint `posee` (file ownership); criterios can't quantify over files they don't own
- Measurement: only 5 canonical phase subtypes (build:visual, build:page, build:api, build:lib, build:infra); always log subagent_tokens

**Open work (1 Pending item):**
- PEND-001: Test /orion-plan pipeline end-to-end (villa-broaster, placita, orama); calibrate COSTO table in plan.mjs (High priority, blocking model tier decisions)

**Decisions this week (Sept 2-9):**
- DEC-006: Runtime portable via `$ORION_HOME` (Mac migration, 21 hardcoded paths fixed)
- DEC-007: Profile has 13 opt-in boolean switches; aplicaSi filtering validates instead of ad-hoc regex
- KN-021: Machine facts must include machine + date or they rot in silence
- KN-022: Vocabulary mismatch bug (web-publica vs publico) ⇐ ¿checked all enum values before deploy?

**Memory health:** 25 active objects (at threshold); 13 archived total; 4 sessions + 1 curation run.
