# Example: SESSION_CLOSE Trigger

## Scenario

Developer finishes a build session for InfraPilot. Three architectural decisions were made, one pending item was resolved, and one new risk was identified.

---

## Step 1: Runtime calls EventDetector

```typescript
const { detector } = createAmm({
  projectId: 'infrapilot',
  repositoryPath: './memory',
})

await detector.detect({
  projectId: 'infrapilot',
  sessionId: 'session-2026-06-30-001',
  contextUsagePercent: 62,
  recentDecisionCount: 3,
  taskCompleted: true,
  taskId: 'task-auth-module-v2',
  phaseChanged: false,
  moduleChanged: false,
  sessionClosing: true,            // <── triggers SESSION_CLOSE
  sprintGenerationRequested: false,
})
```

---

## Step 2: Events emitted

EventDetector evaluates all conditions:

```
sessionClosing = true           → SESSION_CLOSE (Critical)
taskCompleted = true            → TASK_COMPLETED (High)
recentDecisionCount = 3 >= 3   → ARCHITECTURAL_DECISIONS_ACCUMULATED (High)
contextUsagePercent = 62 < 70  → no CONTEXT_HIGH_WATERMARK
```

After deduplication (one per type):

```
MemoryEvent[0] { type: SESSION_CLOSE, priority: Critical }
MemoryEvent[1] { type: TASK_COMPLETED, priority: High }
MemoryEvent[2] { type: ARCHITECTURAL_DECISIONS_ACCUMULATED, priority: High }
```

---

## Step 3: KnowledgeDistiller receives candidates

The runtime provides structured objects via `event.metadata.candidates`. For SESSION_CLOSE, these represent everything notable from the session:

```json
[
  {
    "id": "DEC-007",
    "type": "Decision",
    "tier": "Project",
    "title": "JWT tokens stored in HttpOnly cookies only",
    "description": "No localStorage. No sessionStorage. HttpOnly + Secure flags required.",
    "reason": "Compliance requirement from legal team — session tokens cannot be accessible to JS",
    "impact": "High",
    "priority": "Critical",
    "status": "Accepted",
    "lifetime": "Project",
    "dependencies": ["CON-003"],
    "created": "2026-06-30T14:22:00Z",
    "updated": "2026-06-30T14:22:00Z"
  },
  {
    "id": "PEND-012",
    "type": "Pending",
    "tier": "Project",
    "task": "Write integration tests for JWT refresh flow",
    "reason": "Auth module v2 delivered but refresh path not tested",
    "impact": "High",
    "priority": "High",
    "status": "Ready",
    "lifetime": "Sprint",
    "dependencies": ["DEC-007"],
    "created": "2026-06-30T14:22:00Z",
    "updated": "2026-06-30T14:22:00Z"
  },
  {
    "id": "RSK-004",
    "type": "Risk",
    "tier": "Project",
    "risk": "JWT refresh token reuse not detected — no revocation list implemented",
    "probability": "Medium",
    "mitigation": "Implement token family tracking in Sprint 4",
    "impact": "High",
    "priority": "High",
    "status": "Open",
    "lifetime": "Sprint",
    "dependencies": ["DEC-007"],
    "created": "2026-06-30T14:22:00Z",
    "updated": "2026-06-30T14:22:00Z"
  }
]
```

---

## Step 4: Deduplication check

Existing objects in state.json before this run:

```
PEND-011: "Write unit tests for JWT generation"   status: Done
DEC-007:  (not existing — new)
RSK-004:  (not existing — new)
```

Similarity check: `PEND-012` vs `PEND-011`:
- text A: "Write integration tests for JWT refresh flow"
- text B: "Write unit tests for JWT generation"
- Common words: write, tests, jwt
- Jaccard: 3 / (9 unique - 0 overlap ≈) → 3/9 = 0.33 < 0.85

No merge needed. All 3 candidates are unique.

---

## Step 5: Demotion policy applied to existing objects

```
PEND-011: status=Done, impact=Medium, dependencies=[]
  → isDeprecated? No (Done is not Deprecated/Superseded)
  → survives (runtime should set status=Done explicitly)

POL-002: status=Deprecated, impact=Low, dependencies=[]
  → isDeprecated? Yes
  → isLowValue? Yes (impact=Low, no dependents)
  → ARCHIVED → ArchiveRecord { reason: LowValue }
```

---

## Step 6: New ProjectState

```
Before: { version: 8, objects: 19, archives: 5 }
After:  { version: 9, objects: 21, archives: 6 }
        (+3 new objects, -1 archived POL-002, net +2)
```

---

## Step 7: SessionMetrics output

```json
{
  "runId": "amm-run-1751288400000",
  "triggeredBy": "SESSION_CLOSE",
  "contextSaved": 180,
  "compressionRatio": 1.08,
  "knowledgePreservedPercent": 100,
  "duplicateReduction": 0,
  "estimatedTokenSavings": 144,
  "knowledgeDensity": 0.0031,
  "objectsCreated": 3,
  "objectsMerged": 0,
  "objectsArchived": 1,
  "objectsPromoted": 0,
  "objectsDemoted": 0,
  "byTier": {
    "working":   { "objectCount": 0, "totalTokens": 0 },
    "project":   { "objectCount": 21, "totalTokens": 6720 },
    "permanent": { "objectCount": 0, "totalTokens": 0 }
  }
}
```

---

## Final state.json (abbreviated)

```json
{
  "projectId": "infrapilot",
  "version": 9,
  "snapshotDate": "2026-06-30T14:25:00Z",
  "lastAmmRun": "2026-06-30T14:25:00Z",
  "objects": [
    { "id": "DEC-007", "type": "Decision", "status": "Accepted", ... },
    { "id": "PEND-012", "type": "Pending", "status": "Ready", ... },
    { "id": "RSK-004", "type": "Risk", "status": "Open", ... },
    ...18 other surviving objects...
  ],
  "archives": [
    ...5 previous archives...,
    { "id": "archive-...", "archivedId": "POL-002", "reason": "LowValue" }
  ]
}
```
