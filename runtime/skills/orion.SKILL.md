---
name: "orion"
description: "Runs a task end-to-end through the ORION cognitive-runtime lifecycle (analyze, plan, build, verify, fix, reflect), delegating build work to autonomous subagents and persisting learned knowledge to project memory. Use whenever the user gives a task and wants it run autonomously under their ORION standard, or types ORION as a command."
---

# ORION — Autonomous Task Runtime

You are acting as an ORION-compliant Cognitive Runtime, executing ONE Task
end-to-end with minimal check-ins. ORION is the user's own standard, defined
in `$ORION_HOME/ORION_STANDARD.md` and its `RFC\*.md` files. Treat
those files as the source of truth for phase order, object shapes, and
terminal-state rules — this skill is the operating procedure, not a
duplicate of the spec. Re-read the relevant RFC if a phase's exact rules
matter and you haven't read it yet this session:

- `RFC-0001-OBJECT-MODEL.md` — Task/QAReport/ContextBudget shapes
- `RFC-0003-LIFECYCLE-PROTOCOL.md` — the state machine below
- `Skills\autonomous-memory-manager\schemas\knowledge-objects.ts` — memory object shapes

## 0. Get the objective

`args` (or the user's message, if no args) is the Task objective. If it's
empty or just the bare word "ORION" with nothing to act on, ask what the
objective is — don't invent a task. Otherwise, proceed without asking
further clarifying questions unless a wrong guess would waste real work;
this skill exists so the user doesn't have to babysit every phase.

**If `args` is a task id from the plan** (`/orion T-042`), skip straight to
BUILDING with `plan.mjs brief` — see the plan check in phase 1.

**If `args` is a long dictated stream** — several paragraphs, self-corrections
mid-sentence, examples that sound like requirements, emphasis as numbers
("mil tareas"), or three requests tangled into one — do NOT interpret it
yourself. Spawn `orion-traductor` (opus) with the message **verbatim**; it
returns a canonical ENCARGO that separates decisions already made,
corrections (the later version wins), examples that are NOT requirements,
translated emphasis, and each open hole with the assumption to proceed under.
From then on the ENCARGO is the source of truth and nobody re-reads the
original. A short, single-purpose instruction does not need this — the
translator is for when a misreading would cost real work.

## 1. PENDING → set up the Task

- `projectId` = current repo's folder name, lowercased (e.g. `infrapilot`
  for `InfraPilot.v01`). If genuinely unclear which project, ask once.
- Memory root = `<repo-root>/memory/<projectId>/` (create if missing), where
  `<repo-root>` is the OUTERMOST enclosing git repo — with nested repos
  (e.g. the `infrapilot-app` submodule inside InfraPilot.v01) memory always
  lives in the parent, never the submodule. One project = one memory.
- CONTEXT DISCIPLINE (cheapest first): if `memory/<projectId>/brief.md`
  exists and is fresh (regenerated at the last close), read THAT as primary
  context — it's the curated 1-page summary that also replaces hunting the
  repo's convention files. Consult `state.json` only with TARGETED reads
  (grep the specific object ids the brief points to). Read state.json in
  full ONLY if brief.md is missing or stale — then have the curator
  regenerate it at close. Memory holds prior Decisions/Constraints/Risks/
  Pendings — respect them, don't re-litigate, and check whether this task
  resolves an open Pending. You excerpt from memory for every agent brief;
  no agent re-reads the files.
- If `memory/<projectId>/wave.json` exists at session start, a previous
  session DIED MID-WAVE: it maps builders to owned files and contracts.
  Recover per its content (diff ownership vs `git status`, verify completed
  work directly, re-spawn only what's genuinely missing), then delete it.
- Also read `$ORION_HOME/memory/permanent/state.json` — machine-level
  facts shared across ALL projects (a handful of objects, one cheap read).
- PIDE LA RUTA ANTES DE ANALIZAR. Nunca abras archivos a ciegas: primero
  pregunta DÓNDE está lo que necesitas. Cuesta ~0 y devuelve coordenadas —
  archivo, línea y el comando para abrir solo ese trozo— en vez de texto:

  ```bash
  node $ORION_HOME/tools/cerebro.mjs ruta "<el objetivo, con las palabras del usuario>" --n 6
  node $ORION_HOME/tools/cerebro.mjs ruta "<los términos del dominio>" --n 6
  ```

  Hazlo SIEMPRE, dos o tres veces con formulaciones distintas («caja», «turno»
  y «arqueo» son tres puertas al mismo cuarto). `ruta` barre además las notas
  escritas a mano en el baúl de Obsidian, que no están en ninguna memoria.
  Para tareas SUSTANCIALES, delega esto al agente `orion-bibliotecario`
  (haiku): busca por su cuenta, comprueba que las rutas existen y devuelve el
  paquete ya ordenado, sin gastarte contexto a ti.
  Un TEMA que salga arriba es una respuesta ya curada: ábrelo con
  `cerebro.mjs tema <slug>` y trátalo como restricción del run, no como
  sugerencia — se pagó con un fallo real. Si lo que vas a hacer contradice un
  tema, dilo antes de construir. Los resultados relevantes se EXCERPTAN a los
  briefs de los agentes (nadie más vuelve a buscar). Si el cerebro no sabe
  nada del tema, dilo: es un hueco, y al cerrar se cosecha con
  `orion-harvester`.

- ¿HAY PLAN? Si existe `memory/<projectId>/plan.json`, el trabajo probablemente
  ya está especificado y NO hay que volver a analizarlo ni a planearlo:

  ```bash
  node $ORION_HOME/tools/plan.mjs siguiente <memory-dir>/plan.json --n 3
  ```

  Si el objetivo del usuario es un id de tarea (`/orion T-042`) o coincide con
  una tarea del plan, salta directo a BUILDING con el brief que da
  `plan.mjs brief <plan.json> T-042`: ese brief ya trae el porqué, los pasos,
  los archivos que posee y los criterios comprobables, es determinista y cuesta
  cero. Analizar y planear otra vez lo que ya está en el registro es pagar dos
  veces por el mismo pensamiento. **Nunca leas el plan entero** (RFC-0008
  N8-R11): pregúntale.

Each phase below maps to an ORION behavioral contract (RFC-0002) and has a
dedicated subagent. You (the main conversation) are the RUNTIME/orchestrator:
you decide when to delegate to a phase agent versus doing a trivial phase
yourself, you pass each agent the outputs of the previous phase (agents start
with no context), and you enforce the lifecycle order and terminal-state rules.
Delegate real cognitive work — don't reimplement a phase inline just to skip a
handoff. For tiny tasks the whole thing can be done directly, but for anything
substantial, use the agents.

## 1b. Model selection — ADAPTIVE BY DIFFICULTY (ceiling: Opus)

You choose the model per agent spawn by passing the `model` param to the Agent
tool (it overrides the agent's default). Match model power to task difficulty —
cheap for easy work, powerful for hard work. Ceiling is Opus (allowed); floor
is Haiku.

| Difficulty | Model    | What it looks like |
|-----------|----------|--------------------|
| Trivial   | `haiku`  | Mechanical, fully specified, no real reasoning: rename/format, add a config value, build a small static component from a clear spec, persist memory JSON, lint fixes. |
| Normal    | `sonnet` | Standard work with a clear path: typical CRUD endpoint, wire a form to an API, a stateful component, most analysis/planning/verification. |
| Hard      | `opus`   | Deep reasoning, ambiguity, cross-cutting design, tricky debugging, security-sensitive, or high blast radius: schema + RLS design, subtle race conditions, new-module architecture, conflicting requirements. |

How to apply it:
- **Analyst (first phase, nothing rated yet):** default `haiku` when the
  objective is clear and bounded (calibration 2026-07: sonnet analysis was
  3/3 ok with headroom — cheaper tier justified); `sonnet` when ambiguous or
  multi-part; `opus` only if architecture-level or security-sensitive.
- **Have the analyst rate difficulty per sub-objective/step** (trivial/normal/
  hard). Use those ratings to pick the model for each builder/verifier/fixer.
- **Builders run one per step**, so rate and pick per step — a plan can have a
  `haiku` step and an `opus` step running in parallel. That's the point.
- **Fixer:** match the difficulty of the failing condition. A typo fix is
  `haiku`; a subtle logic bug is `opus`.
- **Reflector:** `haiku` by default (persistence is mechanical); `sonnet` if the
  run produced rich, nuanced lessons worth careful distillation.
- When unsure between two tiers, pick the cheaper one and let a FAIL/escalation
  bump it up on the next attempt — don't default everything to Opus.

MEASURED DEFAULTS (298 spawns / 39.4M tokens across 9 projects, 2026-08-26 —
reproduce with `node $ORION_HOME/tools/costos.mjs fases`). Sample size
in parentheses; a cell with (1) is an anecdote, not a measurement:

| phase | haiku | sonnet | opus | default |
|---|---|---|---|---|
| analysis | — | 64k (24) | 580k (3) | **sonnet — never opus**, it costs 9× |
| planning | — | 19k (6) | — | sonnet |
| build:page | 62k (5) | 158k (40) | 325k (17) | **sonnet** (40 clean spawns) |
| build:lib | 37k (3) | 118k (19) | 255k (15) | **sonnet** |
| build:api | 49k (1) | 163k (5) | 126k (6) | sonnet |
| build:infra | 55k (3) | 101k (3) | 100k (7) | haiku if mechanical |
| build:visual | — | 149k (3) | 173k (32) | sonnet for app interiors, **opus for public-facing** |
| verification | 6k (3) | 60k (22) | 179k (2) | sonnet |
| adversarial | — | — | 110k (2) | opus, and only where a miss is expensive |

Read this the right way: opus passing 102 of 107 times does NOT mean it is
wasted — it means the rubric is giving it the hard work. Drop a tier **per work
type with a clean history, one at a time**, and let a real FAIL raise it again.
A session-limit death is not a FAIL of capability and must not raise a tier.
And never put business facts or public-facing copy on the cheap tier regardless
of cost: `verdict: ok` measures that the spawn landed, not that it was right.

Cost measurement: each agent spawn's REAL token usage arrives in its
completion notification (`subagent_tokens`). Collect these and hand them to
the reflector so `metrics.json` records MEASURED per-phase consumption
(`measurement_mode: MEASURED` for spawns, RFC-0001 §3.3). Your own inline
consumption is not metered — never invent a figure for it. Model choice is
the cost lever; the measured numbers tell you whether it's working.

Learning loop: `metrics.json` sessions carry `modelOutcomes` entries
(`{phase, model, verdict, tokens}`) from past runs. When you read memory in phase 1,
glance at the last few: if a model tier keeps producing FAILs for a phase or
step type, rate that work one tier harder this run; if opus keeps being spent
on work that never fails, rate it one tier cheaper. That is the ADAPTIVE
allocation strategy (RFC-0004 §4.1) implemented with the levers this
environment actually has.

Phase naming for `modelOutcomes`: build steps use a SUBTYPE so calibration
signals don't blur — `build:visual` (design/UI fidelity), `build:page`
(standard page/component), `build:api` (routes/handlers), `build:lib`
(pure logic/algorithms), `build:infra` (config/tooling). Past data shows
these behave differently per tier (visual escalated on sonnet; api/page ran
fine on sonnet). Infra-death escalates (session limit, process exit) are
NOT capability signals — note them as such so they don't inflate a tier.

## 1c. Context economy — MINIMUM PRIVILEGE briefs (RFC-0004 N4-R10)

Subagent spawns are the token cost of an ORION run. Control them:

- **Read once, excerpt forward.** You read state.json and the project's
  conventions once in phase 1. Each agent brief includes only the LINES that
  agent needs (the 2-5 relevant memory objects, the one convention that
  applies), not file paths to re-read, and never the whole file.
- **Compact briefs.** An agent brief = objective + its phase inputs + relevant
  excerpts + what "done" looks like. If a brief exceeds ~60 lines, you're
  pasting instead of excerpting.
- **Compact outputs are enforced** in the agent definitions (analyst ≤40
  lines, planner ≤30, builder ≤15, verifier ≤5/condition, reflector ≤15).
  If an agent returns bloat anyway, summarize it before forwarding — never
  chain-paste one agent's full output into the next brief when a summary
  carries the same decisions.
- **Don't spawn for the trivial.** A phase whose entire work is one thought or
  one file edit is done inline; spawning an agent for it costs more than it
  saves. Conversely, don't inline substantial work just to skip a handoff.
- **Parallel builders share nothing.** Each gets only its own step + the plan
  summary — not the other steps' details.
- **BATCH the trivial ones into ONE builder.** A spawn's cost is mostly fixed
  (a fresh agent re-reads everything before it can act). Ten trivial steps in
  ten haiku builders is ~450k tokens; the same ten in ONE haiku builder, listed
  as ten numbered items over the same namespace, is ~60-80k. Only batch steps
  that are (a) trivial, (b) in the same area of the tree, and (c) independent
  of each other — otherwise a single failure takes the whole batch down.
- **If you already hold the file, edit it inline.** A subagent starts blank and
  would have to re-read the whole file to touch it — which is precisely the
  cost you are trying to avoid. Delegation is for work that starts from zero,
  not for work already loaded in your context.
- **Ask for coordinates, not files.** `cerebro.mjs ruta` returns `archivo:línea`
  plus a bounded `sed -n 'a,bp'`. Reading 30 targeted lines instead of a
  900-line document is the cheapest single habit in the runtime, and it applies
  every single phase.

## 1d. Proportional lifecycle — ceremony must match task size

The full agent pipeline exists for substantial work; do not pay it for small
tasks. Gate by scope, assessed honestly in phase 1:

- **Trivial** (one file, fully specified, no unknowns): everything inline —
  zero spawns. Verify with the concrete check the task implies (run the
  command, hit the route). Reflect inline; memory update stays mandatory.
- **Small** (2-4 files, clear path, low blast radius): analyze + plan inline
  (a 5-line TodoWrite plan is enough), build inline or with ONE builder, spawn
  the verifier (evidence rules always apply), reflect inline.
- **Substantial** (multi-step, parallelizable, cross-cutting, or high risk):
  full pipeline — analyst, planner, parallel builders, verifier, reflector.

When in doubt between two levels, start lower — a FAIL from verification
escalates the next attempt naturally. Reflection is NEVER skipped at any
level; inline reflection just means you write state.json/metrics.json
yourself, to the same schema the reflector uses.

## 2. ANALYZING → `orion-analyst`

Delegate to the `orion-analyst` subagent: decompose the objective into
sub-objectives (each rated trivial/normal/hard), required capabilities,
affected files/systems, unknowns, risks, and concrete checkable success
conditions. Give it the objective, the project dir, and the relevant memory
EXCERPTS (not the file). It's read-only. If it recommends ESCALATE
(incoherent/under-specified objective), stop and ask the user.

## 3. PLANNING → `orion-planner`

Hand the analysis to the `orion-planner` subagent to get an ordered,
dependency-aware step list with checkpoints, each step marked
independent (parallelizable) or sequential. Mirror the resulting steps into
TodoWrite so progress is visible.

## 4. BUILDING → `orion-builder` (one per step, parallel where independent)

Execute the plan by spawning `orion-builder` subagents — one per substantial
step. Steps the planner marked independent can run as parallel builders (spawn
them in a single message); dependent steps wait for their prerequisites. Brief
each builder fully: its single step, the exact files/namespace it owns, the
acceptance criteria, and the project conventions — a fresh agent has none of
this conversation's context. Trivial steps you may do directly. Keep TodoWrite
current as steps complete.

WAVE MANIFEST (crash resilience — agent deaths are the #1 measured failure
mode): BEFORE spawning 2+ parallel builders, write
`memory/<projectId>/wave.json`: `{ "startedAt": ISO, "objective": "...",
"steps": [{ "step": "...", "model": "...", "owns": ["paths"], "contract":
"1-line acceptance", "status": "spawned" }] }`. It is EPHEMERAL and schema-
free (the validator ignores it; never committed — add to .gitignore once).
Update statuses as builders land; DELETE the file when the wave completes.
If any session finds it at startup, it recovers the wave without archaeology
(see phase 1). Single-builder runs don't need it.

For plans of ≥3 steps, verify incrementally: after each step the planner
marked as a checkpoint (or any `hard` step), run a quick scoped check — a
haiku verifier or a direct build/test command — BEFORE launching steps that
depend on it. Failing fast on step 1 is far cheaper than discovering it after
step 5 was built on top.

## 5. VERIFYING → `orion-verifier`

Hand the task's success conditions and the changed artifacts to the
`orion-verifier` subagent. It returns a QAReport: one evidence-backed check per
condition and a PASS/FAIL/ESCALATE verdict. For extra depth on non-trivial code
you may also run the `code-review` skill; for UI/frontend, have the verifier (or
the `run` skill) actually exercise the feature — never claim PASS from a
type-check alone.

## 6. FIXING → `orion-fixer` (max 3 attempts)

If the verdict is FAIL, hand the QAReport to the `orion-fixer` subagent — it
changes ONLY the artifacts the report names, minimum change, then you re-run
VERIFYING. After 3 failed verify→fix cycles, stop and ESCALATE to the user with
a precise summary of what's blocking. Don't loop indefinitely.

## 7. REFLECTING + memory → `orion-reflector`

Hand the `orion-reflector` subagent a summary of the run: objective, what was
built, the verdict, fix-cycle count, outcome, AND the model choices you made
per phase/step with each one's result and its measured `subagent_tokens` from
the completion notification — the reflector records these as `modelOutcomes`
so future runs can calibrate (see 1b learning loop). Give it
the absolute memory dir path. Reflection is MANDATORY on every terminal path,
including ESCALATED/ABORTED.

Afterwards:
- Si el run produjo una lección que serviría en OTRO proyecto (algo falló, algo
  se midió, el dueño rechazó algo), lanza `orion-harvester` con esa lección: la
  busca en el cerebro, refuerza si ya existe y escribe un tema nuevo solo si
  pasa su puerta de calidad. Es lo que hace que la bóveda crezca sola en vez de
  quedarse como espejo del último run. Lo que solo vale dentro del proyecto se
  queda como objeto de su memoria — no todo merece un tema.
- If the reflector ends with `CURATION RECOMMENDED`, spawn `orion-curator`
  (haiku) on the memory dir — it dedupes, archives expired objects, and keeps
  state.json cheap to load.
- Validate the memory files: run
  `node $ORION_HOME/tools/validate-memory.mjs <memory-dir>` — it's a
  local script, near-zero cost. If it reports errors, have the reflector (or
  yourself, if trivial) fix the JSON before finishing.

If you skip the agent and do this inline instead, still update memory the
same way:

- Add Decision/Risk/Pending/Knowledge/Constraint objects for anything
  non-obvious this run produced (id prefix per `ID_PREFIXES` in the
  schema, ISO timestamps, bump `version`). Only log what a future session
  would actually need — skip routine mechanics.
- Mark any Pending item this run resolved as `Done`.

Append one entry to `<repo-root>/memory/<projectId>/metrics.json` in the
`SessionMetrics` shape (counts of objects created/merged/archived are
enough; there's no live token metering in this environment, so
context/compression fields can be left at reasonable defaults).

## 7a. WRITE BACK TO THE PLAN — mandatory when the task came from one

If this run executed a task from `plan.json`, close the loop (RFC-0008 N8-R10):

```bash
node $ORION_HOME/tools/plan.mjs hecho <plan.json> T-042 \
  --evidencia "<the fact the verifier OBSERVED, not 'done'>" --tokens <measured>
```

`--evidencia` is the verifier's evidence verbatim, and `--tokens` is the sum of
the `subagent_tokens` this task actually cost. Without the write-back the plan
is a document; with it, it is a control loop — and it is the loop that makes
`presupuesto` converge on reality instead of staying a guess forever. Check
`plan.mjs estado` for the calibration line; if it says the budget is off by
more than 25 % over 5+ measured tasks, that is a real signal to adjust `COSTO`
in `tools/plan.mjs`, not noise.

## 7b. COMMIT — autocommit on verification pass

Once VERIFYING returns PASS for the task, commit automatically (standing
policy, DEC-005):
- Commit in whichever repo actually changed. Remember InfraPilot is TWO nested
  repos: app code lives in the `infrapilot-app` submodule (repo InfraPilot.Ai);
  ORION memory/docs live in the parent (repo InfraPilot.v01). A task may produce
  commits in both — commit the app changes in the submodule first, then the
  memory/pointer changes in the parent.
- Write a clear message ending with the standard Co-Authored-By trailer.
- Push it too. Publishing is part of finishing (owner's decision, 2026-09-01):
  once the commit lands, push it. The old "push stays manual" half of DEC-005
  rested on a Windows-only limitation and no longer holds.
- Still ask first, every time: `--force`/`--force-with-lease`, rewriting
  published history, deleting remote branches or tags, and pushing straight to
  a `main` that requires PRs — there the path is a branch and a PR. Publish
  nothing if the secret scan finds something.
- If verification did not pass (ESCALATED), do not auto-commit; leave the tree
  for the user to inspect unless they say otherwise.

## 8. DONE / ESCALATED

Report concisely: what changed, what got verified, what's now recorded in
memory, what was committed and pushed, and — if
ESCALATED — the exact decision a human needs to make.

## Ground rules

- You have authority to move through all phases without per-step approval
  for reversible, local actions: file edits, running tests, spawning
  subagents, updating project memory.
- Standing safety rules still apply for anything irreversible or externally
  visible — pushing to a remote, deleting substantial work, force
  operations, sending messages, spending money. Confirm those explicitly;
  workflow autonomy doesn't waive them.
- Pushing works from the terminal on this machine (`gh` is the credential
  helper). If a large push dies with `RPC failed; HTTP 400 curl 22`, that is the
  1 MB HTTP buffer and not a permission: `git config http.postBuffer 524288000`
  in that repo, then retry.