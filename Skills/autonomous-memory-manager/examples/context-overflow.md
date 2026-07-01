# Example: CONTEXT_HIGH_WATERMARK Trigger

## Scenario

During a complex Build session on the InfraPilot data pipeline module, the context usage counter crosses 72%. The runtime has not finished the task yet. AMM must run mid-session to compact memory before proceeding.

---

## Why This Happens

Long sessions accumulate:
- Multiple sub-task outputs
- Duplicate reasoning about the same components
- Outdated pending items from earlier in the session
- Similar risk descriptions written at different points

Without AMM, the context fills up and the task must be abandoned (ESCALATED state per RFC-0003). With AMM, the memory is compacted in-place and the session continues.

---

## Step 1: Runtime detects watermark

```typescript
// Runtime's context tracker fires at 72%
if (contextUsagePercent >= 70) {
  await detector.detect({
    projectId: 'infrapilot',
    sessionId: 'session-2026-06-30-002',
    contextUsagePercent: 72,        // <── crosses watermark
    recentDecisionCount: 1,
    taskCompleted: false,
    phaseChanged: false,
    moduleChanged: false,
    sessionClosing: false,
    sprintGenerationRequested: false,
  })
}
```

---

## Step 2: Events emitted

```
CONTEXT_HIGH_WATERMARK (Critical) — contextUsagePercent: 72
```

Only one event. No other conditions met.

---

## Step 3: Before state

```
state.json v12: { 31 objects, 9 archives }

Objects include:
  RSK-007: "Pipeline schema validation fails on null values"  status: Open   impact: High
  RSK-008: "Data pipeline breaks when null fields in schema"  status: Open   impact: Medium
  (near-duplicate — written at two different points in the session)

  PEND-018: "Add null check to pipeline schema validator"     status: Done   impact: Low   dependencies: []
  PEND-021: "Implement null field handling in schema engine"  status: Done   impact: Low   dependencies: []
  (two done items with no dependents)

  KN-004: "Pipeline uses streaming JSON parser"               status: Current impact: Low  dependencies: []
  (informational, low reuse value for this project)
```

---

## Step 4: Deduplication — RSK-007 vs RSK-008

```
primaryText(RSK-007): "Pipeline schema validation fails on null values"
primaryText(RSK-008): "Data pipeline breaks when null fields in schema"

Tokenize:
  A: {pipeline, schema, validation, fails, null, values}
  B: {data, pipeline, breaks, null, fields, schema}

Intersection: {pipeline, schema, null} = 3
Union: {pipeline, schema, validation, fails, null, values, data, breaks, fields} = 9

Jaccard: 3/9 = 0.333 < 0.85
→ Not merged automatically
```

Jaccard below threshold. Runtime provides a curated candidate that explicitly supersedes RSK-008:

```json
{
  "id": "RSK-007",
  "type": "Risk",
  "risk": "Pipeline schema validation fails on null values — breaks on any null field in schema",
  "probability": "High",
  "mitigation": "Add null check guard to schema validator before streaming parse begins",
  "status": "Open",
  "impact": "High",
  "priority": "High",
  "lifetime": "Sprint",
  "supersedes": ["RSK-008"],
  ...
}
```

`supersedes: ["RSK-008"]` → RSK-008 archived as Merged.

---

## Step 5: Demotion policy applied

```
PEND-018: status=Done, impact=Low, dependencies=[]  → ARCHIVE (LowValue)
PEND-021: status=Done, impact=Low, dependencies=[]  → ARCHIVE (LowValue)
KN-004:   status=Current, impact=Low, dependencies=[] → ARCHIVE (LowValue)
```

3 objects archived, 1 merged.

---

## Step 6: New ProjectState

```
Before: { version: 12, objects: 31, archives: 9 }
After:  { version: 13, objects: 27, archives: 13 }
        (-4 objects: 3 archived directly, 1 superseded by merge → net -4)
```

---

## Step 7: Token savings

```
beforeTokens ≈ 31 objects × 120 tokens avg = 3,720 tokens
afterTokens  ≈ 27 objects × 120 tokens avg = 3,240 tokens

contextSaved         = 480 tokens
compressionRatio     = 3720 / 3240 = 1.148
estimatedTokenSavings = 480 × 0.8 = 384 tokens
```

With 384 tokens freed, the session can continue without escalation.

---

## Step 8: SessionMetrics

```json
{
  "triggeredBy": "CONTEXT_HIGH_WATERMARK",
  "contextSaved": 480,
  "compressionRatio": 1.148,
  "knowledgePreservedPercent": 87.1,
  "duplicateReduction": 1,
  "estimatedTokenSavings": 384,
  "knowledgeDensity": 0.0083,
  "objectsCreated": 1,
  "objectsMerged": 1,
  "objectsArchived": 4,
  "objectsPromoted": 0,
  "objectsDemoted": 0
}
```

---

## Outcome

Session continues with reduced context footprint. The critical risk (RSK-007) is preserved with enhanced description. Three completed items and one low-value knowledge note were removed. No important knowledge was lost.

This is the core value of AMM: the session would have been escalated without it.
