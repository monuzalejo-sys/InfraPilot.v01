# InfraPilot.v01

This repository holds three related but distinct things: a standard, a product,
and the runtime that operationalizes the standard for this machine. They share
one repo because the product is the proving ground for the standard, and the
runtime is what makes the standard executable day-to-day.

## 1. The ORION Standard

[`ORION_STANDARD.md`](ORION_STANDARD.md) is the master document for **ORION**,
the owner's standard for AI cognitive runtimes — an HTTP/POSIX-style
behavioral standard for how an AI agent should analyze, plan, build, verify,
fix, and reflect on a task.

The normative content lives in the RFCs under [`RFC/`](RFC/):

| RFC | Subject |
|-----|---------|
| [RFC-0001](RFC/RFC-0001-OBJECT-MODEL.md) | Object model |
| [RFC-0002](RFC/RFC-0002-BEHAVIORAL-CONTRACTS.md) | Behavioral contracts |
| [RFC-0003](RFC/RFC-0003-LIFECYCLE-PROTOCOL.md) | Lifecycle protocol |
| [RFC-0004](RFC/RFC-0004-CONTEXT-ECONOMY.md) | Context economy |
| [RFC-0005](RFC/RFC-0005-SCALABILITY.md) | Scalability |
| [RFC-0006](RFC/RFC-0006-COMPLIANCE.md) | Compliance |

RFC-0007 (versioning) is planned but not yet written.

`ORION_STANDARD.md` itself is descriptive/overview material — read the RFCs for
the normative definitions; this README does not duplicate either.

ORION also defines its own memory-management skill, **AMM (Autonomous Memory
Manager)**, under [`Skills/autonomous-memory-manager/`](Skills/autonomous-memory-manager/):
a spec, a TypeScript reference implementation, and JSON schemas for the
knowledge objects a compliant runtime persists between sessions.

## 2. The InfraPilot product

InfraPilot is the product this standard is being built and exercised against.
Product documentation (in Spanish) lives at the repo root:

- [`InfraPilot-Blueprint-v1.md`](InfraPilot-Blueprint-v1.md) — product blueprint
- [`database-design.md`](database-design.md) — data model
- [`ui-ux-design.md`](ui-ux-design.md) — UI/UX design
- [`demo-flow.md`](demo-flow.md) — demo walkthrough

The actual application code is **not** in this repository. It lives in
[`infrapilot-app/`](infrapilot-app/), which is a **git submodule** pointing at
the external repo
[`monuzalejo-sys/InfraPilot.Ai`](https://github.com/monuzalejo-sys/InfraPilot.Ai)
(a Next.js app deployed on Vercel). Cloning this repo does not pull that code
by default — use `git submodule update --init` if you need it checked out.
Changes to the app are made and versioned in that external repo, not here.

## 3. The runtime (operationalization)

[`runtime/`](runtime/README.md) version-controls how ORION is actually *run*
on this machine via Claude Code: 7 phase agents (one per RFC-0003 lifecycle
stage), 2 knowledge agents (`landing-prompter`, `orion-harvester`) and 6 skills. These are **repo mirrors** — the *operative* copies that
Claude Code actually loads live outside this repo, under `~/.claude/`. See
[`runtime/README.md`](runtime/README.md) for the full mapping between
lifecycle phases, contracts, and agents, and for the mirror/sync convention.

Two more local (non-submodule) artifacts support the runtime:

- [`memory/infrapilot/`](memory/infrapilot/) — the live ORION project memory
  for InfraPilot: `state.json` and `metrics.json`, structured per the AMM
  knowledge-object schema. This is where the runtime persists what it has
  learned/decided across sessions.
- [`tools/validate-memory.mjs`](tools/validate-memory.mjs) — a zero-dependency
  Node script that validates the memory files against the AMM schema:

  ```
  node tools/validate-memory.mjs memory/infrapilot
  ```

## 4. El cerebro (`cerebro/`)

La memoria por proyecto resuelve *recordar*; el cerebro resuelve **responder**.
Con 11 memorias y ~275 objetos, el conocimiento existía pero era incontestable:
para saber si algo ya se había aprendido había que abrir once `state.json`, y
un agente que tiene que abrir once archivos, en la práctica no los abre —
contesta de memoria y se inventa la mitad.

- [`cerebro/temas/`](cerebro/temas/) — **la fuente de verdad de la capa
  transversal**. Un archivo por tema, y un tema es una *respuesta curada*: qué
  hacer (imperativo, 3-6 líneas), qué fallo lo pagó, cómo se aplica, cuándo NO
  aplica, y la evidencia citable (`proyecto/ID`, `archivo:línea`, mediciones).
  Su valor es que cruza proyectos: una regla pagada en la arrocera decide en el
  asadero. Formato en [`_PLANTILLA-TEMA.md`](cerebro/_PLANTILLA-TEMA.md);
  ejemplar a imitar: `temas/generadores-de-diseno.md`.
- [`tools/cerebro.mjs`](tools/cerebro.mjs) — recuperación BM25 sin dependencias
  sobre **todas** las memorias (descubiertas solas) más las métricas de
  `metrics.json` sintetizadas por proyecto, más los temas. Cuesta ~0, así que un
  agente puede preguntar varias veces por turno:

  ```
  node tools/cerebro.mjs buscar "la plata de que turno es si cobro despues"
  node tools/cerebro.mjs probar     # prueba de regresión con preguntas reales
  node tools/cerebro.mjs estado     # temas, objetos pobres y huecos
  ```

- [`cerebro/preguntas-de-prueba.md`](cerebro/preguntas-de-prueba.md) — la
  prueba de regresión. No mide si el cerebro *sabe mucho*, mide si **responde a
  cómo se pregunta de verdad**: un tema impecable con alias malos falla aquí, y
  debe fallar, porque nadie lo encontraría nunca.

Lo consumen el skill `orion-cerebro` (responder una pregunta con cita), el
agente `orion-harvester` (alimentarlo sin duplicar ni escribir basura) y la
fase 1 del skill `orion` (consultar antes de analizar).

## How the pieces relate

```
ORION_STANDARD.md + RFC/           <- defines the standard (what "compliant" means)
cerebro/ + tools/cerebro.mjs       <- la capa que RESPONDE cruzando todas las memorias
Skills/autonomous-memory-manager/  <- defines AMM, the memory sub-skill of the standard
runtime/                            <- implements the standard for Claude Code (local mirror)
memory/infrapilot/                  <- runtime's persisted state for this project (local)
tools/validate-memory.mjs           <- checks memory/ against the AMM schema
InfraPilot-Blueprint-v1.md, ...      <- what the runtime is being used to build
infrapilot-app/                     <- the product's actual code (external submodule)
```

In short: the standard defines the behavior, the runtime implements it locally
for this machine, `memory/` is the runtime's local working state, and
`infrapilot-app` is external code the standard/runtime is applied to — not
part of this repo's own history.
