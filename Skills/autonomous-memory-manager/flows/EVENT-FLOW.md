# AMM — Event Flow

## Overview

The event flow defines how external runtime state changes become AMM execution runs.

```
ORION Runtime
│
│  [State changes during task execution]
│
├─── task reaches DONE ────────────────────────────────────────────────┐
│                                                                       │
├─── context usage crosses 70% ────────────────────────────────────────┤
│                                                                       │
├─── user types "Cerrar sesión" ───────────────────────────────────────┤
│                                                                       │
├─── 3rd architectural decision recorded ──────────────────────────────┤
│                                                                       │
├─── new Sprint requested ─────────────────────────────────────────────┤
│                                                                       │
├─── module boundary crossed ──────────────────────────────────────────┤
│                                                                       ▼
│                                              DetectionContext {
│                                                projectId,
│                                                sessionId,
│                                                contextUsagePercent,
│                                                recentDecisionCount,
│                                                taskCompleted,
│                                                phaseChanged,
│                                                moduleChanged,
│                                                sessionClosing,
│                                                sprintGenerationRequested
│                                              }
│                                                        │
│                                                        ▼
│                                              EventDetector.detect()
│                                                        │
│                                         ┌──────────────┤
│                                         │    EVALUATE  │
│                                         │              │
│                                         ▼              ▼
│                                   sessionClosing?  contextUsage
│                                         │          >= 70%?
│                                         ▼              │
│                                   SESSION_CLOSE    CONTEXT_HIGH
│                                   (Critical)       _WATERMARK
│                                         │          (Critical)
│                                         └──────────────┤
│                                                        │
│                                         ┌──────────────┤
│                                         │  DEDUPLICATE │
│                                         │              │
│                                         │  One event   │
│                                         │  per type    │
│                                         │  max         │
│                                         └──────────────┤
│                                                        │
│                                                        ▼
│                                              MemoryEvent[] (ordered by priority)
│                                                        │
│                                         ┌──────────────┤
│                                         │   DISPATCH   │
│                                         │              │
│                                         │  for each    │
│                                         │  handler:    │
│                                         │    await     │
│                                         │    handler() │
│                                         └──────────────┤
│                                                        │
│                                                        ▼
│                                              MemoryCurator.onEvent()
│
└───────────────────────────────────────────────────────────────────────
```

---

## Concurrency Handling

AMM guarantees at-most-one concurrent run per project. If a second event arrives while a run is in progress:

```
Event A (TASK_COMPLETED) ─────────────────────────────────────────────►
    │
    ▼
[Run begins]
    │                    Event B (PHASE_CHANGED) arrives
    │                           │
    │                           ▼
    │                    [Queue: [B]]
    │                           │
    ▼                           │
[Run A completes] ──────────────┤
                                ▼
                         [Run B begins from queue]
                                │
                                ▼
                         [Run B completes]
```

The queue is a FIFO single-element buffer per priority. Critical events jump the queue.

---

## Event Priority Resolution

When multiple events accumulate before a run starts (e.g., during a burst):

```
Burst arrives: [TASK_COMPLETED, MODULE_CHANGE, SESSION_CLOSE]

Sort by priority:
  1. SESSION_CLOSE     (Critical)
  2. TASK_COMPLETED    (High)
  3. MODULE_CHANGE     (Medium)

Merge contexts:
  Single run with merged event context
  triggeredBy: "SESSION_CLOSE" (highest priority wins)

Result: one run, not three
```

---

## State Change → Event Mapping (Runtime Responsibility)

The runtime (dev-runtime / AIER) is responsible for calling `EventDetector.detect()` at the right moments. Suggested integration points:

| When to call detect() | Relevant fields to set true |
|---|---|
| After any task reaches DONE/ESCALATED/ABORTED | `taskCompleted: true, taskId` |
| After lifecycle `REFLECTING → DONE` | `taskCompleted: true` |
| When context counter crosses 70% | `contextUsagePercent: 72` |
| When user types `"Cerrar sesión"` | `sessionClosing: true` |
| When lifecycle phase name changes | `phaseChanged: true, newPhase` |
| When ≥ 3 new Decisions recorded since last AMM | `recentDecisionCount: 3` |
| When Sprint N+1 creation begins | `sprintGenerationRequested: true` |
| Before switching from module A to module B | `moduleChanged: true, newModule` |
