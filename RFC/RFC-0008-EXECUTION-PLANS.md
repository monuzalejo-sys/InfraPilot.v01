# RFC-0008 — Execution Plans
## ORION Standard | Tier C-2 | Evolutionary Body

**Status:** Draft
**Version:** 1.0.0-draft
**Depends on:** RFC-0001 (Object Model), RFC-0003 (Lifecycle), RFC-0004 (Context Economy), RFC-0005 (Scalability)

---

## Purpose

RFC-0003 defines the lifecycle of **one Task**. Nothing in the standard defines
the artifact that decides *which tasks exist, in what order, and at what cost* —
so today that decision is re-made from scratch, in conversation, on every run.
That is the most expensive habit in the runtime: it burns context to re-derive
work that was already understood, and it produces plans that live only in a
transcript and die with it.

This RFC defines the **ExecutionPlan**: a durable, machine-queryable registry of
the work a project needs, from which individual RFC-0003 Tasks are drawn.

The distinction that motivates it:

| | Client plan | Execution plan (this RFC) |
|---|---|---|
| Reader | a person who pays | the runtime that builds |
| Answers | what you get, when, for how much | which artifact changes, who owns it, how it's proven |
| Lifetime | until delivery | the life of the project |
| Format | prose | prose **view** over a registry |

A plan whose only form is prose cannot be queried, so it must be re-read whole
to be used — which is exactly the cost RFC-0004 exists to prevent. **N8-R1: an
ExecutionPlan MUST have a machine-readable form (`plan.json`); any human-readable
form MUST be generated from it, never edited in parallel.**

---

## 1. Object

`ExecutionPlan` lives at `<memory-dir>/plan.json` — beside `state.json`, under
the same one-project-one-memory rule (RFC-0001 §2).

```
ExecutionPlan {
  planId        string          // "<projectId>-<YYYY-MM-DD>"
  projectId     string
  version       integer         // bumped on every write
  createdAt     ISO8601
  updatedAt     ISO8601
  modo          "genesis" | "evolucion"
  objetivo      string          // one sentence
  resumen       string[]        // 3-8 lines: the whole plan in one read
  perfil        ProjectProfile
  niveles       Nivel[]
  categorias    Categoria[]
  hitos         Hito[]
  tareas        PlanTask[]
  escalabilidad Mejora[]        // what happens AFTER "done"
  negocio       Negocio | null  // cost/price, only when the plan is commercial
}
```

### 1.1 `modo` — genesis vs evolucion

**N8-R2:** every plan MUST declare `modo`. Building something new and changing
something that exists are different disciplines and MUST NOT share a task
shape:

- **`genesis`** — nothing to break. Ownership is assignable freely, shared
  artifacts (types, seed, tokens, skeletons) are written first by the
  orchestrator, and parallelism is wide.
- **`evolucion`** — there is a live system and a user. Every task MUST carry a
  regression check in `aceptacion` (what must keep working), ownership is
  constrained by what already exists, and blast radius, not size, sets
  difficulty.

A task instantiated in `evolucion` mode without a regression check is
non-conformant.

### 1.2 `ProjectProfile`

The profile is what makes a generic catalog produce a specific plan. It is
observed from the repo, not guessed.

```
ProjectProfile {
  stack         string[]   // "nextjs", "supabase", "postgres", "tailwind", "node", "static"
  superficies   string[]   // "web-publica", "panel-interno", "caja", "api", "movil"
  entidades     string[]   // real tables/domain nouns — drives `porCada` instantiation
  rutas         string[]   // real routes, same purpose
  publico       boolean    // is there a page a stranger can open?
  dineroReal    boolean    // does it move money?
  datosPersonales boolean  // does it store personal data? (Ley 1581 in CO)
  multiUsuario  boolean
  equipo        "solo-orion" | "orion+humanos"
  etapa         "N0".."N4" // current maturity — see §2
}
```

### 1.3 `PlanTask`

```
PlanTask {
  id          string        // "T-001", stable forever, never reused
  titulo      string        // imperative, one line
  categoria   string        // -> Categoria.id
  nivel       "N0".."N4"
  arquetipo   string | null // catalog archetype id, or null if project-specific
  porQue      string        // 1-2 lines: what breaks if this is not done
  queHacer    string[]      // the numbered steps the executor follows
  posee       string[]      // files/globs this task OWNS (exclusive write)
  intocable   string[]      // files it must read but never modify
  dependeDe   string[]      // task ids
  dificultad  "trivial" | "normal" | "hard"
  ceremonia   "inline" | "1-builder" | "ola"
  modelo      "haiku" | "sonnet" | "opus"
  aceptacion  Check[]       // >= 1
  presupuesto integer       // estimated tokens, from measured averages
  estado      "pendiente" | "listo" | "en-curso" | "hecho" | "bloqueado" | "descartado"
  bloqueadoPor string | null
  evidencia   string | null // set when hecho: the observed fact that proves it
  gastoReal   integer | null// measured tokens actually spent
  cerebro     string[]      // prior knowledge that applies: "tema:<slug>" | "<proj>/<ID>"
}

Check { check: string, comando: string | null, espera: string }
```

**N8-R3:** every `PlanTask` MUST have at least one `aceptacion` entry whose
`espera` is an **observable fact** — a command's output, an HTTP status, a
count, a measured value. Adjectives ("looks right", "works well") are
non-conformant. This is RFC-0002 §5 evidence discipline moved earlier: to the
moment the work is *specified*, not the moment it is checked.

**N8-R4:** `posee` MUST be non-empty for any task whose `ceremonia` is
`1-builder` or `ola`. Two tasks eligible to run in the same wave MUST have
disjoint `posee` sets. This makes the #1 measured failure mode (parallel
builders colliding) a **computable** property of the plan rather than a
judgement call at spawn time.

**N8-R5:** `presupuesto` MUST be derived from measured per-phase averages
(`metrics.json` → `modelOutcomes`), never invented. A plan whose budget is
guessed cannot be used to decide ceremony, which is the point of having one.

### 1.4 `Mejora` (escalabilidad)

```
Mejora { id, titulo, cuando: string, disparador: string, tareas: string[] }
```

`disparador` is the *observable* condition that makes the improvement worth
doing ("more than 500 orders/day", "second location opens", "the owner asks for
invoices"). **N8-R6:** an improvement without a trigger is a wish, not a plan
item, and MUST NOT be scheduled.

### 1.5 `Negocio`

```
Negocio {
  costoTokens     integer      // sum of presupuesto
  costoEstimadoCOP integer     // tokens -> money, at the rate recorded in the plan
  horasEquivalentes number
  precioSugerido  { modelo: "mensualidad" | "unico", montoCOP, permanenciaMeses, incluye: string[], noIncluye: string[] }
  comparables     { nombre, url, precio, queOfrece, dondeSaleCaro }[]
  supuestos       string[]     // every assumption the number rests on
}
```

**N8-R7:** any price figure MUST be accompanied by its assumptions in
`supuestos`. A number without its assumptions is the same failure mode as
invented copy: technically well-formed, unverifiable, and confidently wrong.

---

## 2. Levels — difficulty follows maturity, not size

**N8-R8:** tasks MUST be assigned a level, and levels MUST be completed in
order per category. A project cannot be at N3 in frontend and N0 in security;
the plan's `etapa` is the **minimum** level completed across categories.

| Level | Name | What it means | Exit condition |
|---|---|---|---|
| **N0** | Cimientos | It runs, it's versioned, it can be verified. | One command builds it; one command verifies it; both green. |
| **N1** | Funciona | The core use case works end to end for a real user. | The primary flow completes against real data, observed in a browser or a request. |
| **N2** | Aguanta | It survives hostile input, wrong order, and the user's mistakes. | Every invariant has a test that can break it; auth/permissions verified adversarially. |
| **N3** | Escala | It stays correct and fast as data and users grow. | Measured under load; queries indexed; no N+1; backup and restore rehearsed. |
| **N4** | Excelencia | It's pleasant, accessible, observable, and cheap to operate. | Accessibility measured; errors observable in production; a person can operate it from a written manual. |

The exit conditions are deliberately checkable. A level "completed" without its
exit condition observed is non-conformant (RFC-0006).

---

## 3. Task catalog (`ORION_HOME/catalogo/`)

A plan is generated from two sources, and both are required:

1. **Archetypes** — the reusable catalog: what any project of this shape needs
   at each level. Answers "what am I forgetting?", which is the question a
   conversation never answers well.
2. **Project-specific tasks** — what only this project needs, written by the
   architect from the real repo.

```
Arquetipo {
  id          string   // "sec.auth.rate-limit" — namespaced, stable
  titulo, porQue, queHacer, aceptacion   // same shape as PlanTask
  nivel, dificultad, ceremonia
  aplicaSi    { stack?, superficies?, publico?, dineroReal?, datosPersonales?, multiUsuario?, modo? }
  porCada     null | "entidad" | "ruta" | "superficie" | "rol"
  posee       string[]  // may contain {{entidad}} / {{ruta}} placeholders
  cerebro     string[]
}
```

`porCada` is what lets a bounded catalog produce an unbounded plan: an
archetype marked `porCada: "entidad"` instantiates once per real entity in the
profile. **N8-R9:** instantiation MUST use only values observed in the profile.
An archetype MUST NOT invent the entity, route, or role it instantiates over —
the same rule as copy (`cero-datos-inventados`), applied to plans.

---

## 4. Relationship to RFC-0003

An ExecutionPlan does not replace the Task lifecycle; it **feeds** it.

```
plan.json ──(select next unblocked task)──> Task(PENDING) ──> RFC-0003 lifecycle ──> DONE
     ^                                                                                │
     └──────────────(estado: hecho, evidencia, gastoReal)─────────────────────────────┘
```

**N8-R10:** when a Task drawn from a plan reaches a terminal state, the plan
MUST be updated with the terminal state, the evidence, and the **measured**
token spend. A plan that is not written back is a document; a plan that is
written back is a control loop — and it is the loop that lets `presupuesto`
converge on reality.

**N8-R11:** the orchestrator MUST NOT read the whole plan to select work. It
queries for the next tasks or the next wave. Reading a 1000-task plan into
context to pick one task is the exact anti-pattern RFC-0004 forbids
(N4-R10, minimum privilege).

---

## 5. Conformance

An implementation conforms to RFC-0008 if:

1. Plans are stored as `plan.json` and any prose form is generated (N8-R1).
2. Every plan declares `modo`, and `evolucion` tasks carry regression checks (N8-R2).
3. Every task has at least one observable acceptance check (N8-R3).
4. Wave-eligible tasks have disjoint ownership, verifiable by a tool (N8-R4).
5. Budgets come from measured data (N8-R5) and are written back after runs (N8-R10).
6. Selection is by query, not by whole-file read (N8-R11).

Reference implementation: `ORION_HOME/tools/plan.mjs`. Conformance for a given
plan is checked by `node tools/plan.mjs validar <plan.json>`, which is the
executable form of this section.
