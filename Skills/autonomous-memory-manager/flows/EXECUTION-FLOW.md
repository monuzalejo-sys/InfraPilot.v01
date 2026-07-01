# AMM — Execution Flow

## Full Run Pipeline

```
MemoryEvent received by MemoryCurator.onEvent(event)
│
├─── [GUARD] this.running === true?
│         YES → queue event, return pendingResult()
│         NO  → set running = true, proceed
│
├─── selectMode(event)
│         SESSION_CLOSE | CONTEXT_HIGH_WATERMARK → 'full'
│         all others → 'full' (v1.0: minimal mode reserved for future)
│
├─── repository.getProjectState(projectId)
│         found  → ProjectState (existing objects, archives, version N)
│         null   → emptyState() { objects: [], archives: [], version: 0 }
│
├─── distiller.distill(event, before.objects)
│    │
│    ├─── extractCandidates(event)
│    │         reads event.metadata.candidates
│    │         returns AnyKnowledgeObject[] (provided by runtime)
│    │
│    ├─── deduplicateWith(candidates, existingObjects)
│    │    │
│    │    │ for each candidate:
│    │    │   findBestMatch(candidate, existing)
│    │    │   │
│    │    │   ├─ same type objects only
│    │    │   ├─ jaccard(primaryText(a), primaryText(b))
│    │    │   └─ similarity >= 0.85?
│    │    │         YES → merge(existing, candidate) → merged[]
│    │    │         NO  → unique[]
│    │    │
│    │    └─ returns { unique, merged, deduplicateCount }
│    │
│    ├─── classifyTier(unique[])
│    │         Session  → Working
│    │         Sprint   → Project
│    │         Project  → Project
│    │         Permanent → Permanent
│    │
│    ├─── applyDemotionPolicy(existingObjects)
│    │         for each existing object:
│    │           isDeprecated = status IN ['Deprecated', 'Superseded']
│    │           isLowValue   = impact == 'Low' AND not in any dependencies[]
│    │           isDeprecated AND isLowValue → toArchive[]
│    │
│    └─── DistillationResult {
│              extracted: classified unique objects
│              merged: merged objects with supersedes[]
│              archived: IDs to remove from active
│              deduplicateCount: N
│         }
│
├─── stateGenerator.generate(before, distillation, event)
│    │
│    ├─── archivedIds = Set(distillation.archived)
│    │
│    ├─── supersededIds = Set(merged.flatMap(m => m.supersedes))
│    │
│    ├─── survivingObjects = before.objects
│    │         .filter(obj => NOT in archivedIds)
│    │         .filter(obj => NOT in supersededIds)
│    │
│    ├─── newObjects = [
│    │         ...survivingObjects,
│    │         ...distillation.extracted,
│    │         ...distillation.merged
│    │    ]
│    │
│    ├─── newArchives = buildArchiveRecords(before, distillation)
│    │         for each archivedId → ArchiveRecord { reason: Deprecated | LowValue }
│    │         for each merged.supersedes[] → ArchiveRecord { reason: Merged }
│    │
│    └─── ProjectState {
│              objects: newObjects,
│              archives: [...before.archives, ...newArchives],
│              version: before.version + 1,
│              lastAmmRun: now
│         }
│
├─── repository.saveProjectState(after)
│         writes {basePath}/{projectId}/state.json
│         atomic replace
│
├─── metricsEngine.compute({ before, after, ... })
│    │
│    ├─── beforeTokens = ceil(JSON.stringify(before).length / 4)
│    ├─── afterTokens  = ceil(JSON.stringify(after).length / 4)
│    ├─── contextSaved = max(0, beforeTokens - afterTokens)
│    ├─── compressionRatio = beforeTokens / afterTokens
│    ├─── objectsCreated = after.objects NOT in before.objects
│    ├─── objectsMerged  = after.objects WITH supersedes.length > 0
│    ├─── objectsArchived = after.archives.length - before.archives.length
│    ├─── knowledgePreservedPercent = min(100, after.count / before.count × 100)
│    ├─── knowledgeDensity = after.count / afterTokens
│    ├─── byTier and byType breakdowns
│    └─── SessionMetrics { all fields populated }
│
├─── repository.appendSessionMetrics(projectId, metrics)
│         appends to {basePath}/{projectId}/metrics.json
│         updates rolling averages
│         computes trendCompressionRatio (last 3 sessions)
│
├─── set this.running = false
│
├─── if queue.length > 0: setImmediate(() => onEvent(queue.shift()))
│
└─── return RunResult {
         success: true,
         mode: 'full',
         metrics: SessionMetrics,
         objectsWritten: 1
     }
```

---

## Error Path

```
Any step throws
│
└─── catch(error)
     │
     ├─── metricsEngine.emptyMetrics(...)  ← zero-value metrics
     │
     └─── return RunResult {
              success: false,
              mode,
              metrics: empty,
              objectsWritten: 0,
              error: error.message
          }
     
     NOTE: this.running is still reset in finally block
     NOTE: queue continues processing despite error
```

---

## Memory File State After Run

```
Before run:
{repositoryPath}/
└── {projectId}/
    ├── state.json    v5  { 23 objects, 8 archives }
    └── metrics.json      { sessionCount: 4, sessions: [...] }

After run (TASK_COMPLETED):
{repositoryPath}/
└── {projectId}/
    ├── state.json    v6  { 21 objects (2 merged→1, 1 archived), 9 archives }
    └── metrics.json      { sessionCount: 5, sessions: [..., sessionMetrics5] }
```
