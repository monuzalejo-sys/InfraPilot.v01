# AMM — System Architecture Overview

## 1. System Context

```
╔═══════════════════════════════════════════════════════════════════════╗
║                          ORION Runtime                                ║
║                                                                       ║
║  ┌──────────────┐  state events   ┌─────────────────────────────┐   ║
║  │   Task        │ ──────────────► │   Autonomous Memory Manager │   ║
║  │   Lifecycle   │                 │   (AMM)                     │   ║
║  │   RFC-0003    │                 └──────────────┬──────────────┘   ║
║  └──────────────┘                                │                   ║
║                                                  │                   ║
║  ┌──────────────┐  budget/usage   ┌─────────────▼──────────────┐   ║
║  │   Context     │ ──────────────► │       Event Detector        │   ║
║  │   Economy     │                 └─────────────┬──────────────┘   ║
║  │   RFC-0004    │                               │ MemoryEvent       ║
║  └──────────────┘                 ┌─────────────▼──────────────┐   ║
║                                   │       Memory Curator         │   ║
║  ┌──────────────┐                 │       (orchestrator)         │   ║
║  │   Memory      │ ◄── reads ─── │                              │   ║
║  │   Repository  │                 └───┬──────────┬─────────────┘   ║
║  │   (files)     │ ◄── writes ──────┐ │          │                  ║
║  └──────────────┘                   │ │          │                   ║
║                          ┌──────────┘ │          │                   ║
║                          │   ┌────────┘          │                   ║
║                          │   │                   │                   ║
║               ┌──────────▼───▼──────┐  ┌────────▼──────────────┐   ║
║               │  State Generator     │  │  Knowledge Distiller   │   ║
║               └─────────────────────┘  └───────────────────────┘   ║
║                                                                       ║
║               ┌─────────────────────────────────────────────────┐   ║
║               │               Metrics Engine                     │   ║
║               └─────────────────────────────────────────────────┘   ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 2. Component Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AMM — 6 Components                                │
│                                                                      │
│  ┌─────────────────┐                                                 │
│  │  EventDetector   │  ← receives DetectionContext from runtime      │
│  │                  │    emits MemoryEvent[]                         │
│  └────────┬─────────┘                                               │
│           │ MemoryEvent                                              │
│           ▼                                                          │
│  ┌─────────────────┐                                                 │
│  │  MemoryCurator   │  ← main orchestrator                          │
│  │  (orchestrator)  │    controls the full pipeline                 │
│  └──┬──────┬───┬───┘                                               │
│     │      │   │                                                     │
│     │      │   └─────────────────────────────────────────┐         │
│     │      │                                              │         │
│     │      │ distill(event, existing)                     │         │
│     │      ▼                                              │         │
│     │  ┌──────────────────┐                              │         │
│     │  │ KnowledgeDistiller│  ← extract, deduplicate,   │         │
│     │  │                   │    merge, classify           │         │
│     │  └──────────────────┘                              │         │
│     │      │ DistillationResult                          │         │
│     │      │                                              │         │
│     │      │ generate(before, distillation, event)        │         │
│     │      ▼                                              │         │
│     │  ┌──────────────────┐                              │         │
│     │  │  StateGenerator   │  ← builds new ProjectState  │         │
│     │  └──────────────────┘                              │         │
│     │      │ ProjectState                                 │         │
│     │      │                                              │         │
│     │  ┌───▼──────────────┐                              │         │
│     └─►│ MemoryRepository  │◄─────────────────────────────┘        │
│        │                   │  ← CRUD on state.json/metrics.json     │
│        └──────────────────┘                                         │
│             │                                                        │
│             │ compute(before, after)                                 │
│             ▼                                                        │
│        ┌──────────────────┐                                         │
│        │  MetricsEngine    │  ← SessionMetrics computation          │
│        └──────────────────┘                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow

```
Runtime observes trigger condition
           │
           ▼
   DetectionContext {
     projectId, sessionId,
     contextUsagePercent,
     recentDecisionCount,
     taskCompleted, phaseChanged,
     moduleChanged, sessionClosing,
     sprintGenerationRequested
   }
           │
           ▼
   [EventDetector.detect(ctx)]
       - evaluates all trigger conditions
       - deduplicates same-type events
       - assigns priority
           │
           ▼
   MemoryEvent {
     id, type, priority,
     timestamp, context
   }
           │
           ▼
   [MemoryCurator.onEvent(event)]
       - checks budget sufficiency
       - loads existing ProjectState
           │
           ├──► [MemoryRepository.getProjectState()]
           │         └─► ProjectState (existing objects)
           │
           ▼
   [KnowledgeDistiller.distill(event, existingObjects)]
       - extractCandidates()     → new KnowledgeObject[]
       - deduplicateWith()       → merge similar objects
       - classifyTier()          → assign Working/Project/Permanent
       - applyDemotionPolicy()   → flag objects for archival
           │
           ▼
   DistillationResult {
     extracted: KnowledgeObject[],   ← new objects
     merged: KnowledgeObject[],      ← merged objects
     archived: string[],             ← IDs to archive
     deduplicateCount: number
   }
           │
           ▼
   [StateGenerator.generate(before, distillation, event)]
       - removes archived objects
       - removes superseded originals
       - adds extracted + merged
       - creates ArchiveRecords
       - increments version
           │
           ▼
   ProjectState {
     projectId, snapshotDate,
     objects: KnowledgeObject[],
     archives: ArchiveRecord[],
     version: n+1
   }
           │
           ├──► [MemoryRepository.saveProjectState()]
           │
           ▼
   [MetricsEngine.compute(before, after)]
       - compressionRatio, contextSaved
       - knowledgeDensity, duplicateReduction
       - tier breakdowns, type breakdowns
           │
           ▼
   SessionMetrics
           │
           ├──► [MemoryRepository.appendSessionMetrics()]
           │
           └──► AMM_RUN_COMPLETED event emitted
```

---

## 4. Event Priority and Processing Order

When multiple events occur simultaneously, AMM processes them in priority order:

```
Priority 1 (Critical) ──► SESSION_CLOSE, CONTEXT_HIGH_WATERMARK
Priority 2 (High)     ──► TASK_COMPLETED, PHASE_CHANGED,
                           ARCHITECTURAL_DECISIONS_ACCUMULATED,
                           PRE_SPRINT_GENERATION
Priority 3 (Medium)   ──► DUPLICATE_DETECTED, MODULE_CHANGE
```

If two events of the same type occur before the previous run completes:
- They are deduplicated — only one run executes
- The run context merges both event contexts

---

## 5. Storage Layout

```
{repositoryPath}/
└── {projectId}/
    ├── state.json      ← current ProjectState (full object graph)
    └── metrics.json    ← CumulativeMetrics (all session runs)
```

`state.json` is the authoritative source. It is replaced atomically on each AMM run.

`metrics.json` is append-only. Individual session metrics are never deleted.
