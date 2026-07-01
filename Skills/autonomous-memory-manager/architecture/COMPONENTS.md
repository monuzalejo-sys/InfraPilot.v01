# AMM — Component Specifications

---

## Component 1: EventDetector

**Responsibility:** Observe runtime state and emit MemoryEvents when trigger conditions are met.

**Single Responsibility:** Detection only. No mutation. No storage.

### Input

```typescript
DetectionContext {
  projectId: string
  sessionId: string
  contextUsagePercent: number        // 0–100
  recentDecisionCount: number        // decisions since last AMM run
  taskCompleted: boolean
  taskId?: string
  phaseChanged: boolean
  newPhase?: string
  moduleChanged: boolean
  newModule?: string
  sessionClosing: boolean
  sprintGenerationRequested: boolean
}
```

### Output

```typescript
MemoryEvent[] // one per detected trigger, deduplicated by type
```

### Behavioral Contract

1. Evaluates all trigger conditions in a single pass
2. Emits at most one event per trigger type per detect() call (deduplication)
3. Assigns priority from the static EVENT_PRIORITY_MAP
4. Dispatches all emitted events to registered handlers before returning
5. Does not persist any state — stateless between calls (except `lastRunAt`)

### Thresholds (configurable)

| Threshold | Default | Rule |
|---|---|---|
| CONTEXT_HIGH_WATERMARK_PERCENT | 70 | EVT-004 |
| ARCHITECTURAL_DECISIONS_THRESHOLD | 3 | EVT-005 |

### Integration Points

- Called by the runtime after any significant state change
- Handlers registered via `onEvent(handler)` — typically MemoryCurator

---

## Component 2: MemoryCurator

**Responsibility:** Orchestrate the full AMM pipeline in response to events.

**Single Responsibility:** Pipeline coordination only. No knowledge extraction. No storage.

### Input

```typescript
MemoryEvent // from EventDetector
```

### Output

```typescript
RunResult {
  success: boolean
  mode: 'full' | 'minimal'
  metrics: SessionMetrics
  objectsWritten: number
  error?: string
}
```

### Behavioral Contract

1. Receives event via `onEvent(event)`
2. Checks available budget — selects run mode (full or minimal)
3. Loads existing ProjectState from MemoryRepository
4. Invokes KnowledgeDistiller with event + existing objects
5. Invokes StateGenerator with before state + distillation result
6. Persists new ProjectState via MemoryRepository
7. Invokes MetricsEngine to compute session metrics
8. Persists metrics via MemoryRepository
9. Returns RunResult — never throws (errors returned in RunResult.error)

### Run Mode Selection

| Mode | When Used | Behavior |
|---|---|---|
| full | All events under normal conditions | Complete pipeline |
| minimal | Budget < minBudgetRequired | Critical + High objects only, skip Low |

### Constructor Dependencies

```
KnowledgeDistiller, StateGenerator, MemoryRepository, MetricsEngine
```

---

## Component 3: KnowledgeDistiller

**Responsibility:** Extract new knowledge from event context, deduplicate against existing objects, classify into memory tiers.

**Single Responsibility:** Knowledge processing only. No storage. No state generation.

### Input

```typescript
event: MemoryEvent
existingObjects: AnyKnowledgeObject[]
```

### Output

```typescript
DistillationResult {
  extracted: AnyKnowledgeObject[]  // new objects to add
  merged: AnyKnowledgeObject[]     // merged objects (supersede originals)
  archived: string[]               // IDs of objects to archive
  deduplicateCount: number
}
```

### Pipeline (internal)

```
extractCandidates(event)
       │
       ▼ candidate KnowledgeObject[]
deduplicateWith(candidates, existing)
       │
       ├─── similarity > 0.85 ──► mergeObjects() → merged[]
       └─── no match         ──► unique[]
       │
       ▼
classifyTier(unique[])
       │ assigns Working/Project/Permanent based on lifetime
       ▼
applyDemotionPolicy(existing)
       │ flags deprecated + low-value + unreferenced objects
       ▼
DistillationResult
```

### Similarity Algorithm

Jaccard similarity on tokenized primary text field:

```
similarity(a, b) = |words(a) ∩ words(b)| / |words(a) ∪ words(b)|
```

Primary text field per type:
- Decision → title
- Policy → rule
- Knowledge → fact
- Constraint → constraint
- Risk → risk
- Pending → task
- Architecture → component
- Roadmap → milestone
- Metric → metric

### Merge Resolution

When two objects qualify for merge (similarity ≥ 0.85):
- Winner: object with higher priority (Critical > High > Medium > Low)
- Tiebreak: object with more recent `updated` timestamp
- Winner inherits `supersedes: [loser.id, ...loser.supersedes]`

---

## Component 4: StateGenerator

**Responsibility:** Build the new ProjectState from the existing state and distillation result.

**Single Responsibility:** State composition only. No knowledge extraction. No storage.

### Input

```typescript
before: ProjectState
distillation: DistillationResult
event: MemoryEvent
```

### Output

```typescript
ProjectState // new state, version = before.version + 1
```

### Behavioral Contract

1. Removes all objects whose IDs appear in `distillation.archived`
2. Removes all objects whose IDs appear in any `merged.supersedes[]` array
3. Adds all `distillation.extracted` objects
4. Adds all `distillation.merged` objects
5. Builds ArchiveRecord entries for all archived and superseded objects
6. Increments `version`
7. Sets `snapshotDate` and `lastAmmRun` to current timestamp
8. Does NOT filter or transform objects — filtering is KnowledgeDistiller's responsibility

---

## Component 5: MemoryRepository

**Responsibility:** All read/write operations on persistent storage.

**Single Responsibility:** Storage only. No knowledge processing. No metrics computation.

### Storage Format

All data persisted as UTF-8 JSON files. No database dependency.

| File | Content |
|---|---|
| `{basePath}/{projectId}/state.json` | ProjectState — full object graph |
| `{basePath}/{projectId}/metrics.json` | CumulativeMetrics — all session runs |

### Interface

```typescript
getProjectState(projectId): Promise<ProjectState | null>
saveProjectState(state: ProjectState): Promise<WriteResult>

queryObjects(projectId, options?): Promise<AnyKnowledgeObject[]>
getObjectById(projectId, id): Promise<AnyKnowledgeObject | null>
writeObjects(projectId, objects): Promise<WriteResult>
archiveObject(projectId, archive): Promise<WriteResult>

getMetrics(projectId): Promise<CumulativeMetrics | null>
appendSessionMetrics(projectId, metrics): Promise<WriteResult>
```

### Query Capabilities

Supports filtering by: type, tier, status, lifetime, priority, impact, tags, IDs.
Supports sorting by: priority, impact, updated, created.
Supports limit.

### Behavioral Contract

1. `getProjectState` returns null (not throws) when project has no state
2. `saveProjectState` atomically replaces existing state
3. `appendSessionMetrics` is additive — never replaces historical sessions
4. All errors are returned in `WriteResult.errors`, not thrown

---

## Component 6: MetricsEngine

**Responsibility:** Compute optimization metrics by comparing before and after ProjectState.

**Single Responsibility:** Metrics computation only. No storage. No knowledge processing.

### Input

```typescript
MetricsInput {
  runId: string
  sessionId: string
  triggeredBy: string
  startedAt: string
  completedAt: string
  before: ProjectState
  after: ProjectState
}
```

### Output

```typescript
SessionMetrics // all fields populated (never null/undefined)
```

### Computation Methods

| Metric | Formula |
|---|---|
| contextSaved | max(0, estimateTokens(before) - estimateTokens(after)) |
| compressionRatio | estimateTokens(before) / estimateTokens(after) |
| knowledgePreservedPercent | min(100, (after.objects.length / before.objects.length) × 100) |
| duplicateReduction | before.objects.length - (after.objects.length - objectsCreated) |
| estimatedTokenSavings | contextSaved × 0.8 |
| knowledgeDensity | after.objects.length / estimateTokens(after) |

Token estimation: `ceil(JSON.stringify(state).length / 4)`

### Behavioral Contract

1. `compute()` never throws — returns a fully populated SessionMetrics
2. `emptyMetrics()` provides a zero-value SessionMetrics for error cases
3. All ratios are computed as floats (not integers)
4. `knowledgePreservedPercent` is clamped to [0, 100]
5. `compressionRatio` is set to 1.0 when before state is empty
