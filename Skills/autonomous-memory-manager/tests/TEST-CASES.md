# AMM — Test Cases

## Test Methodology

For each test case:
1. Set up initial state (or empty state)
2. Submit a `DetectionContext` to `EventDetector.detect()`
3. Observe `MemoryEvent[]` emitted
4. Observe final `ProjectState` and `SessionMetrics`
5. Compare against expected values
6. Record PASS or FAIL

---

## TC-AMM-01: Session close triggers run

```
Setup:    Empty state. sessionClosing = true.
Input:    DetectionContext { sessionClosing: true, all others false/0 }
Expect:   Events = [SESSION_CLOSE (Critical)]
          RunResult.success = true
          metrics.triggeredBy = "SESSION_CLOSE"
          state.version = 1 (was 0)
Fail:     No event emitted. No run executed. Error in RunResult.
```

---

## TC-AMM-02: Context watermark triggers run

```
Setup:    Existing state with 10 objects.
Input:    DetectionContext { contextUsagePercent: 70, all others false/0 }
Expect:   Events = [CONTEXT_HIGH_WATERMARK (Critical)]
          RunResult.success = true
Fail:     contextUsagePercent = 70 does not trigger event (boundary is inclusive).
```

---

## TC-AMM-03: Watermark below threshold does not trigger

```
Setup:    Any state.
Input:    DetectionContext { contextUsagePercent: 69, all others false/0 }
Expect:   Events = [] (empty)
          No AMM run executed.
Fail:     CONTEXT_HIGH_WATERMARK emitted at 69%.
```

---

## TC-AMM-04: Decision accumulation threshold

```
Setup:    Any state. ARCHITECTURAL_DECISIONS_THRESHOLD = 3.
Input:    DetectionContext { recentDecisionCount: 3, all others false/0 }
Expect:   Events = [ARCHITECTURAL_DECISIONS_ACCUMULATED (High)]
Fail:     Event not emitted at exactly 3 decisions.
```

---

## TC-AMM-05: Multiple simultaneous events — deduplication

```
Setup:    Any state.
Input:    DetectionContext {
            sessionClosing: true,
            contextUsagePercent: 75,
            taskCompleted: true, taskId: "T1",
            recentDecisionCount: 4
          }
Expect:   Events contain exactly one of each:
            SESSION_CLOSE, CONTEXT_HIGH_WATERMARK,
            TASK_COMPLETED, ARCHITECTURAL_DECISIONS_ACCUMULATED
          No duplicate event types.
Fail:     Same type appears twice. Any type appears zero times when condition is met.
```

---

## TC-AMM-06: Deduplication merges similar objects

```
Setup:    state.json contains:
            RSK-001: { type: Risk, risk: "Database fails under high load" }
Input:    candidates includes:
            RSK-099: { type: Risk, risk: "Database crashes under high load" }
          Jaccard("Database fails under high load", "Database crashes under high load"):
            tokens A: {database, fails, under, high, load}
            tokens B: {database, crashes, under, high, load}
            intersection: {database, under, high, load} = 4
            union: {database, fails, crashes, under, high, load} = 6
            jaccard: 4/6 = 0.667 < 0.85
Expect:   RSK-099 is NOT merged with RSK-001 (below threshold)
          RSK-099 added as unique new object
Fail:     Objects merged when jaccard < 0.85.
```

---

## TC-AMM-07: Deduplication at threshold merges objects

```
Setup:    state.json contains:
            DEC-001: { type: Decision, title: "Use PostgreSQL for primary storage" }
Input:    candidates includes:
            DEC-099: { type: Decision, title: "PostgreSQL chosen as primary storage" }
          Approximate jaccard("Use PostgreSQL for primary storage",
                              "PostgreSQL chosen as primary storage"):
            A: {use, postgresql, for, primary, storage} = 5
            B: {postgresql, chosen, as, primary, storage} = 5
            intersection: {postgresql, primary, storage} = 3
            union: 7
            jaccard: 3/7 ≈ 0.43  — below threshold
          (This test intentionally shows threshold boundary — use a higher-similarity pair for >0.85)
Expect:   Use a pair with jaccard >= 0.85 and verify merged[] contains result.
          merged[0].supersedes includes the ID of the lower-priority object.
Fail:     Objects not merged when jaccard >= 0.85. supersedes missing.
```

---

## TC-AMM-08: Demotion policy archives terminal-state low-value objects

```
Setup:    state.json contains:
            POL-003: { type: Policy,  status: Deprecated, impact: Low, dependencies: [] }
            PEND-010: { type: Pending, status: Done,       impact: Low, dependencies: [] }
Input:    Any event. No candidates provided.
Expect:   POL-003 and PEND-010 absent from after.objects
          ArchiveRecord exists for each with reason: "LowValue" or "Deprecated"
          after.archives.length = before.archives.length + 2
Fail:     Either object survives. Terminal status (Done, Deprecated, Cancelled, etc.)
          with Low impact and no dependents MUST be archived.
```

---

## TC-AMM-09: Dependency protection prevents archival

```
Setup:    state.json contains:
            POL-004: { status: Deprecated, impact: Low, dependencies: [] }
            DEC-010: { dependencies: ["POL-004"] }
Input:    Any event. No candidates.
Expect:   POL-004 is NOT archived (DEC-010 depends on it)
          POL-004 present in after.objects
Fail:     POL-004 archived despite being a dependency of DEC-010.
          (Violates N-AMM-R9)
```

---

## TC-AMM-10: Version increments on every run

```
Setup:    state.json { version: 5 }
Input:    Any event.
Expect:   after.version = 6
Fail:     version unchanged or skips values.
```

---

## TC-AMM-11: Concurrent run is queued, not dropped

```
Setup:    Any state.
Action:   Call onEvent(eventA) and onEvent(eventB) without awaiting A.
Expect:   Event A runs first. Event B runs after A completes.
          Both RunResults have success = true.
          state.version increments twice.
Fail:     Event B is dropped. Both run simultaneously. Version only increments once.
          (Violates N-AMM-R14)
```

---

## TC-AMM-12: Metrics computed after every run

```
Setup:    state.json v3 with 15 objects.
Input:    SESSION_CLOSE event, 2 new candidates, 1 archived.
Expect:   SessionMetrics present in RunResult.metrics
          metrics.objectsCreated = 2
          metrics.objectsArchived = 1
          metrics.compressionRatio > 0
          metrics.knowledgeDensity > 0
          metrics.triggeredBy = "SESSION_CLOSE"
          metrics.json sessionCount incremented by 1
Fail:     metrics null or empty. sessionCount unchanged. compressionRatio = 0.
```

---

## TC-AMM-13: Tier classification from lifetime

```
Input:    candidates = [
            { lifetime: "Session", ... },
            { lifetime: "Sprint", ... },
            { lifetime: "Project", ... },
            { lifetime: "Permanent", ... }
          ]
Expect:
  Session   → tier: Working   (not persisted — filtered out per N-AMM-R5)
  Sprint    → tier: Project
  Project   → tier: Project
  Permanent → tier: Permanent
Fail:     Wrong tier assigned. Session objects persisted to state.json.
```

---

## TC-AMM-14: Empty state initializes correctly

```
Setup:    No state.json exists.
Input:    Any event with no candidates.
Expect:   state.json created at {basePath}/{projectId}/state.json
          state.version = 1
          state.objects = []
          state.archives = []
          RunResult.success = true
Fail:     Error thrown. state.json not created.
```

---

## Compliance Matrix

| Test | N-AMM Rule | Pass | Fail |
|---|---|---|---|
| TC-AMM-01 | N-AMM-R1 | SESSION_CLOSE handled | No response |
| TC-AMM-02 | N-AMM-R1 | CONTEXT_HIGH_WATERMARK handled | Boundary missed |
| TC-AMM-03 | N-AMM-R2 | No false positive | False trigger |
| TC-AMM-05 | N-AMM-R4, N-AMM-R2 | Deduplication + all events | Duplicates or missing |
| TC-AMM-06/07 | N-AMM-R6, N-AMM-R7 | Merge threshold respected | Wrong threshold |
| TC-AMM-08 | N-AMM-R9 | Deprecated+Low archived | Survives |
| TC-AMM-09 | N-AMM-R9 | Dependency protected | Wrongly archived |
| TC-AMM-10 | — | Version increments | Stale version |
| TC-AMM-11 | N-AMM-R14 | Queue, no parallel | Dropped or parallel |
| TC-AMM-12 | N-AMM-R10 | Metrics present always | Null metrics |
| TC-AMM-13 | N-AMM-R5 | Correct tier + no Working in store | Wrong tier |
| TC-AMM-14 | — | Init from empty | Crash |
