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
| [RFC-0007](RFC/RFC-0007-VERSIONING.md) | Versioning |
| [RFC-0008](RFC/RFC-0008-EXECUTION-PLANS.md) | Execution plans |

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
on this machine via Claude Code: **13 agents and 8 skills**, all prefixed
`orion-` — 7 phase agents (one per RFC-0003 lifecycle stage), 2 intake agents
(`orion-traductor`, `orion-bibliotecario`), 2 work-design agents
(`orion-arquitecto`, `orion-estratega`) and 2 knowledge agents
(`orion-landing`, `orion-harvester`).

`runtime/` is the **canonical source**; `~/.claude/` holds the operative copies
Claude actually loads, and `tools/instalar-orion.mjs` embeds a third copy for
installing on another machine. Keeping three copies in sync by hand failed —
on 2026-08-26 five of fifteen files differed, drifting in *both* directions.
[`tools/runtime.mjs`](tools/runtime.mjs) is now the single door:

```
node tools/runtime.mjs estado        # three-way drift, with dates
node tools/runtime.mjs sincronizar   # runtime/ -> ~/.claude -> installer payload
```

See [`runtime/README.md`](runtime/README.md) for the full mapping between
lifecycle phases, contracts, and agents.

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

## 5. Los planes de ejecución (`catalogo/`, `tools/plan.mjs`)

La memoria resuelve *recordar*; el cerebro resuelve *responder*; el **plan**
resuelve *qué se hace ahora y quién toca qué archivo*. Norma: [RFC-0008](RFC/RFC-0008-EXECUTION-PLANS.md).

No es el plan que se le enseña al cliente —ese dice qué recibe y cuándo—, sino
el que usa el runtime: por cada tarea, el porqué, los pasos, los archivos que
posee en exclusiva, los criterios comprobables, la dificultad, la ceremonia y
el presupuesto en tokens.

- [`catalogo/`](catalogo/) — **arquetipos**: la tarea que cualquier proyecto de
  cierta forma necesita en cierto nivel de madurez (N0 cimientos → N4
  excelencia). Contestan «¿qué se me está olvidando?», que es la pregunta que
  una conversación nunca contesta bien. Un arquetipo con `porCada: "entidad"`
  se instancia una vez por cada entidad **real** del proyecto: por eso un
  catálogo acotado produce un plan de cientos de tareas concretas sin inventar
  ninguna. Formato en [`catalogo/_ESQUEMA.md`](catalogo/_ESQUEMA.md).
- [`tools/plan.mjs`](tools/plan.mjs) — el registro. Un plan de mil tareas en
  prosa hay que leerlo entero para usarlo; a éste se le pregunta:

  ```
  node tools/plan.mjs siguiente <plan.json>      # qué sigue, en 5 líneas
  node tools/plan.mjs ola <plan.json> --max 4    # tareas paralelas SIN colisión de archivos
  node tools/plan.mjs brief <plan.json> T-042    # el encargo completo, determinista, coste 0
  node tools/plan.mjs estado <plan.json>         # avance y calibración del presupuesto
  ```

  `ola` es lo que convierte el fallo #1 medido —builders en paralelo pisándose—
  en una propiedad **computable** del plan en vez de un juicio del orquestador.

Se crean con el skill `/orion-plan`, que orquesta `orion-traductor` (entender la
idea dictada), `orion-bibliotecario` (ubicar lo que ya se sabe),
`orion-arquitecto` (estructura y tareas propias) y `orion-estratega` (costo,
precio y nicho).

## 6. Gasto (`tools/costos.mjs`)

39,37 M de tokens de subagente medidos en 298 spawns vivían repartidos en once
`metrics.json` y nadie los sumaba. Ahora sí:

```
node tools/costos.mjs fases    # costo por fase y tier, con el tamaño de muestra
node tools/costos.mjs fugas    # las tres formas medidas de tirar gasto
node tools/costos.mjs senal    # si los datos se pueden creer
```

El análisis completo y qué hacer con él: [`ECONOMIA-DE-TOKENS.md`](ECONOMIA-DE-TOKENS.md).

## 7. La bóveda (`tools/baul.mjs`)

`node tools/baul.mjs empujar` manda a `ORION-Vault` (Obsidian) el estándar y el
runtime, la memoria de cada proyecto, los temas del cerebro, **los planes con
una nota por tarea**, el historial de sesiones con lo que costó cada una, y los
encargos — todo enlazado. Es unidireccional: el repo manda. Lo que se escriba a
mano en Obsidian no vuelve, pero `cerebro.mjs ruta` sí lo encuentra y lo marca.

## How the pieces relate

```
ORION_STANDARD.md + RFC/           <- defines the standard (what "compliant" means)
cerebro/ + tools/cerebro.mjs       <- la capa que RESPONDE cruzando todas las memorias
catalogo/ + tools/plan.mjs         <- la capa que decide QUÉ SE HACE y quién toca qué
Skills/autonomous-memory-manager/  <- defines AMM, the memory sub-skill of the standard
runtime/ + tools/runtime.mjs        <- implements the standard for Claude Code (canonical)
memory/<proj>/                      <- state.json + metrics.json + plan.json per project
tools/costos.mjs                    <- where the tokens actually went
tools/baul.mjs                      <- the gateway: everything useful -> Obsidian
InfraPilot-Blueprint-v1.md, ...      <- what the runtime is being used to build
infrapilot-app/                     <- the product's actual code (external submodule)
```

In short: the standard defines the behavior, the runtime implements it locally
for this machine, `memory/` is the runtime's local working state, and
`infrapilot-app` is external code the standard/runtime is applied to — not
part of this repo's own history.
