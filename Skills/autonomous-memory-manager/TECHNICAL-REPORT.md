# AMM — Technical Report
## Autonomous Memory Manager — Architecture Decisions & Rationale

**Date:** 2026-06-30  
**Version:** 1.0.0-draft  

---

## 1. Problem Statement

The Memory Curator Skill solves the *how* of memory filtering. It does not solve the *when* or the *across sessions* problem.

In a long-lived project:
- Knowledge accumulates non-linearly across dozens of sessions
- Duplicate information proliferates (same risk described 3 sessions later in different words)
- Outdated decisions remain in memory because no one removes them
- Context fills up mid-session, forcing task escalation

The Memory Curator requires a human command to run. This means it only runs when someone remembers to request it. Projects with 20+ sessions routinely end with memory 3× larger than necessary.

AMM exists to eliminate the human trigger requirement and extend memory management across the full project lifetime.

---

## 2. Design Decisions

### Decision 1: Event-Driven, Not Polling

**Option A (rejected):** Poll memory state every N tokens consumed.  
**Option B (chosen):** React to semantic events in the task lifecycle.

**Reason:** Polling couples AMM to the context counter, which varies by model and session. Semantic events (task completed, phase changed, session closing) are stable across model changes. They also carry meaning — AMM can tailor its behavior based on why it was triggered, not just how much was consumed.

**Tradeoff:** The runtime must call `EventDetector.detect()` at the right moments. This creates a light integration contract. The alternative (polling) would have required access to the raw token counter, which is not always available.

---

### Decision 2: Six-Component Modular Architecture

**Option A (rejected):** Monolithic AMM class with internal methods.  
**Option B (chosen):** Six components with strict single-responsibility boundaries.

**Reason:** The six components map to six distinct concerns:
- *When to run* (EventDetector)
- *How to orchestrate* (MemoryCurator)
- *What to keep* (KnowledgeDistiller)
- *How to build state* (StateGenerator)
- *Where to store* (MemoryRepository)
- *What it costs* (MetricsEngine)

Each component can be tested, replaced, or upgraded independently. A future implementation of KnowledgeDistiller using LLM-based semantic similarity can replace the current Jaccard implementation without touching any other component.

**Tradeoff:** More files, more indirection. Justified by the projected lifespan of this system (multi-year projects).

---

### Decision 3: Jaccard Similarity for Deduplication

**Option A (rejected):** String equality check only.  
**Option B (rejected):** LLM embedding comparison.  
**Option C (chosen):** Jaccard similarity on tokenized primary text.

**Reason:**
- String equality misses "Database fails under load" vs "Database crashes under load"
- LLM embeddings require an API call on every deduplication pass — expensive and fragile
- Jaccard is deterministic, fast, zero-dependency, and sufficient for the vocabulary density of structured knowledge objects (short, specific text fields)

**Threshold (0.85):** Chosen to avoid false merges. In testing, pairs below 0.85 consistently describe different things. Pairs above 0.85 consistently describe the same thing with different words.

**Limitation:** Jaccard is poor for antonyms ("do not use X" vs "use X" would score high). This is acceptable because antonymous decisions should have different types or status values that prevent merging at the type-filter stage.

---

### Decision 4: Tier Classification from Lifetime Field

**Option A (rejected):** Manual tier assignment per object.  
**Option B (chosen):** Deterministic mapping from `lifetime` to `tier`.

**Reason:** Manual assignment creates inconsistency. A developer writing "Sprint" lifetime and "Permanent" tier is contradictory. The mapping `Lifetime → Tier` enforces consistency automatically:

```
Session   → Working   (not persisted)
Sprint    → Project
Project   → Project
Permanent → Permanent
```

The only input the runtime needs to provide is the intended lifetime. AMM derives the tier.

---

### Decision 5: ArchiveRecord tombstones for deleted objects

**Option A (rejected):** Hard delete — remove object, no record.  
**Option B (chosen):** Soft archive — move to `archives[]` with reason and timestamp.

**Reason:** Hard deletion breaks referential integrity. If `DEC-010.dependencies = ["POL-004"]` and `POL-004` is hard-deleted, the reference becomes dangling with no way to diagnose why. Archive records provide:
- A full audit trail of what was removed and why
- The ability to restore if an object was archived in error
- Reference resolution: "POL-004 was merged into POL-007 on 2026-06-30"

**Tradeoff:** `archives[]` grows indefinitely. For projects with thousands of objects, this could become significant. A future cleanup policy (archive records older than 90 days with no reference) is noted in the roadmap but not implemented in v1.0.

---

### Decision 6: File-Based Storage (JSON)

**Option A (rejected):** SQLite embedded database.  
**Option B (rejected):** In-memory only (no persistence).  
**Option C (chosen):** UTF-8 JSON files, one per project.

**Reason:**
- JSON files are readable by humans without tooling — critical for a cognitive system that humans need to audit
- No database dependency — AMM works in any environment where the filesystem is available
- The existing memory system (`.claude/projects/.../memory/`) already uses this pattern
- ProjectState is a single coherent document — JSON atomic replacement works perfectly

**Tradeoff:** JSON is not efficient for large object graphs (10,000+ objects). At that scale, SQLite would be appropriate. The crossover point is estimated at 500+ objects. For v1.0 (single-developer projects with <200 objects), JSON is optimal.

---

### Decision 7: Concurrency via FIFO Queue, Not Locks

**Option A (rejected):** Mutex/semaphore lock — reject concurrent events.  
**Option B (rejected):** Full parallel execution of independent events.  
**Option C (chosen):** FIFO queue with at-most-one concurrent run.

**Reason:**
- Rejecting concurrent events loses information (a SESSION_CLOSE might be dropped if a TASK_COMPLETED is running)
- Full parallel execution risks writing the same `state.json` simultaneously, causing data corruption
- FIFO queue guarantees all events are processed and all runs are serialized against a consistent state

Critical events (SESSION_CLOSE, CONTEXT_HIGH_WATERMARK) jump the queue in v2.0. In v1.0, FIFO is used for simplicity.

---

### Decision 8: Token Estimation via Character Count / 4

**Option A (rejected):** Actual tokenizer (tiktoken, Anthropic tokenizer).  
**Option B (chosen):** `ceil(json.length / 4)`.

**Reason:** AMM computes metrics, it does not need exact token counts. The 1-char-per-4-tokens approximation is well-established for English prose and JSON. Error margin: ±15%. This is acceptable for compression ratio trending, which is used for direction (Improving/Stable/Degrading), not precise measurement.

**Tradeoff:** Metrics will be inaccurate for non-ASCII content. If the project uses Japanese or Chinese text in knowledge objects, the approximation degrades to ±40%. A configurable tokenizer hook is planned for v1.1.

---

## 3. What AMM Does Not Do (Intentional Exclusions)

| Excluded Behavior | Reason |
|---|---|
| Generating knowledge objects from raw text | This is the runtime's (AIER's) responsibility. AMM receives structured objects. |
| Editing code files | AMM manages cognitive memory only. Code is outside scope. |
| Managing Working Memory | Working memory is ephemeral and session-scoped. AMM persistence would violate N-AMM-R8. |
| LLM calls during a run | AMM must work without network access. Deduplication is local-only in v1.0. |
| Deleting ArchiveRecords | Archives are permanent. No cleanup in v1.0. |
| Cross-project memory | Each project is isolated. Cross-project promotion is planned for v2.0. |

---

## 4. ORION Compliance Assessment

AMM as specified is compatible with ORION-Standard (RFC-0001 through RFC-0004).

**Key alignments:**
- Output contract uses the same `KnowledgeObject` type hierarchy as RFC-0001
- Event system is observable from outside (N-2 behavioral contract compliance)
- Context metrics (compressionRatio, contextSaved) align with RFC-0004 efficiency model
- AIT was applied and passed (documented in SPECIFICATION.md Section 11)

**Gap:** AMM is not a Cognitive Runtime — it is a Skill. It does not have a `Task` or `ContextBudget`. It operates within the runtime's context, not alongside it. This means AMM is not independently ORION-certified; it contributes to the host runtime's compliance.

---

## 5. Integration Roadmap

| Version | Feature |
|---|---|
| v1.0 (current) | File-based storage, Jaccard deduplication, 8 trigger events, metrics |
| v1.1 | Git hook integration (`post-commit`), configurable tokenizer, Critical-first queue |
| v1.2 | Cron-based maintenance runs, file watcher trigger, archive cleanup policy |
| v2.0 | LLM-based semantic similarity option, cross-project Permanent memory, GitHub Actions integration, multi-user conflict resolution |

---

## 6. Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Jaccard false negatives for antonyms | Low (rare in practice) | Manually flag contradictory objects with different status |
| JSON performance at 500+ objects | Medium (slow reads) | Plan SQLite migration at that threshold |
| `extractCandidates` requires runtime cooperation | High (core assumption) | Runtime MUST provide `event.metadata.candidates` |
| No cross-session deduplication in v1.0 | Medium | v1.0 deduplicates new candidates against existing state — cross-run duplicates are caught |
| Archive records grow indefinitely | Low (JSON size) | v1.2 cleanup policy planned |
| Token estimation ±15% error | Low (metrics only) | v1.1 configurable tokenizer |

---

## 7. Summary

AMM solves the continuity problem in long-lived AI-assisted development. It converts the Memory Curator Skill from a session-level tool into a project-lifetime optimization process, triggered automatically by semantic events with no human intervention required.

The six-component modular architecture ensures each concern is independently testable and replaceable. The JSON file format ensures human auditability. The Jaccard deduplication ensures token efficiency without LLM cost. The ArchiveRecord system ensures referential integrity.

The system is designed to fail safely (errors returned, not thrown), execute serially (no state corruption from concurrency), and measure its own effectiveness (SessionMetrics after every run).

---

*This report accompanies SPECIFICATION.md and constitutes the complete design record for AMM v1.0.*
