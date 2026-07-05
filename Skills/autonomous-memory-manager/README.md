# AMM — Autonomous Memory Manager
## ORION Official Skill v1.0

**Status:** Draft  
**Version:** 1.0.0-draft  
**Layer:** ORION Skill (extends Memory Curator Skill)  
**Date:** 2026-06-30  

---

> "A memory system that requires human intervention is not a memory system — it is a documentation request."

---

## What AMM Is

AMM is the autonomous memory management skill for ORION-compliant runtimes. It runs continuously without human commands, triggered by observable events in the task lifecycle.

> **Implementation status:** the TypeScript in `src/` is a real, building,
> tested implementation of this specification — `npx tsc --noEmit` passes
> strict-mode with zero errors, and `npx vitest run` exercises it against the
> compliance suite in `tests/`. `SPECIFICATION.md` remains the normative
> document; where the original pseudocode diverged from it, the spec won and
> the deviation is documented inline (see `src/KnowledgeDistiller.ts`). The
> operative implementation of this spec on this machine is still the
> `orion-reflector` + `orion-curator` agents (see `../../runtime/`), with
> `../../tools/validate-memory.mjs` enforcing the schema — this package is
> the standalone, testable reference those agents are modeled on.

AMM is not a summarizer. It is a continuous optimization process that treats cognitive memory as a finite resource requiring active management across the entire project lifetime.

---

## Relationship to Memory Curator Skill

| Dimension | Memory Curator | AMM |
|---|---|---|
| Trigger | Manual (`"Cerrar sesión"`) | Autonomous (event-driven) |
| Scope | Single session | Entire project lifecycle |
| Deduplication | Session-local | Cross-session |
| Consolidation | None | Active merging of related objects |
| Metrics | Per-session only | Cumulative + trending |

Memory Curator is a component of AMM, not a replacement.

---

## Directory Structure

```
autonomous-memory-manager/
├── README.md                 ← this file
├── SPECIFICATION.md          ← behavioral specification (normative)
├── TECHNICAL-REPORT.md       ← architecture decisions + rationale
├── architecture/
│   ├── OVERVIEW.md           ← system diagrams
│   └── COMPONENTS.md         ← per-component specification
├── schemas/
│   ├── knowledge-objects.ts  ← all knowledge object types
│   ├── events.ts             ← event system types
│   ├── metrics.ts            ← metrics types
│   └── repository.ts         ← repository interfaces
├── src/
│   ├── index.ts              ← public API + factory
│   ├── EventDetector.ts      ← trigger detection
│   ├── MemoryCurator.ts      ← main orchestrator
│   ├── KnowledgeDistiller.ts ← extraction + deduplication
│   ├── StateGenerator.ts     ← state snapshot builder
│   ├── MemoryRepository.ts   ← storage operations
│   └── MetricsEngine.ts      ← optimization metrics
├── flows/
│   ├── EVENT-FLOW.md         ← event processing flow
│   └── EXECUTION-FLOW.md     ← end-to-end execution flow
├── examples/
│   ├── session-close.md      ← SESSION_CLOSE trigger example
│   └── context-overflow.md   ← CONTEXT_HIGH_WATERMARK example
├── tests/
│   ├── TEST-CASES.md         ← compliance test suite (prose form, normative)
│   ├── fixtures.ts           ← shared KnowledgeObject/MemoryEvent builders
│   └── *.test.ts             ← executable vitest translation of TEST-CASES.md
├── package.json              ← private package, scoped to this skill only
└── tsconfig.json             ← strict TypeScript config
```

---

## Development

This package is self-contained — its `package.json` and `tsconfig.json` live
here, not at any repo root, and `node_modules` is scoped to this directory.

```bash
cd Skills/autonomous-memory-manager
npm install        # installs typescript, vitest, @types/node (devDependencies only)

npm run typecheck  # npx tsc --noEmit — strict mode, must exit 0
npm test           # npx vitest run  — must be all green
```

Requires Node 24+ (uses `"type": "module"` + ESM throughout).

`tests/*.test.ts` is the executable form of `tests/TEST-CASES.md` — each
`TC-AMM-NN` case maps to one or more `it()` blocks referencing its ID in a
comment. Where the reference pseudocode's behavior diverged from
`SPECIFICATION.md` (the merge-similarity threshold, and the N-AMM-R9 demotion
branch), the code comments in `src/KnowledgeDistiller.ts` document the
decision and why the spec won.

---

## Quick Start

```typescript
import { createAmm } from './src'

const amm = createAmm({
  projectId: 'infrapilot',
  repositoryPath: './memory',
})

// Wire to your runtime's event system
runtime.on('task:completed', (taskId) =>
  amm.detector.detect({
    projectId: 'infrapilot',
    sessionId: currentSessionId,
    contextUsagePercent: runtime.getContextPercent(),
    recentDecisionCount: runtime.getDecisionCount(),
    taskCompleted: true,
    taskId,
    phaseChanged: false,
    moduleChanged: false,
    sessionClosing: false,
    sprintGenerationRequested: false,
  })
)

// N-AMM-R11: subscribe to run completion events
amm.curator.onComplete((event) => {
  console.log('AMM run completed', event.metadata?.metrics)
})
```

---

## Trigger Events

| Event | Condition | Priority |
|---|---|---|
| SESSION_CLOSE | Session closing | Critical |
| CONTEXT_HIGH_WATERMARK | Context ≥ 70% | Critical |
| TASK_COMPLETED | Important task done | High |
| PHASE_CHANGED | Project phase changed | High |
| ARCHITECTURAL_DECISIONS_ACCUMULATED | ≥ 3 decisions since last run | High |
| PRE_SPRINT_GENERATION | New sprint requested | High |
| DUPLICATE_DETECTED | Similarity > 0.85 detected | Medium |
| MODULE_CHANGE | Module boundary crossed | Medium |

---

*Full behavioral specification: [SPECIFICATION.md](SPECIFICATION.md)*  
*Architecture decisions: [TECHNICAL-REPORT.md](TECHNICAL-REPORT.md)*
