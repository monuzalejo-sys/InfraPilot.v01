# AMM — Autonomous Memory Manager
## ORION Skill Specification v1.0

**Status:** Draft  
**Version:** 1.0.0-draft  
**Classification:** ORION Skill  
**Extends:** Memory Curator Skill  
**Date:** 2026-06-30  

---

## 1. Purpose

AMM defines the autonomous, event-driven memory management behavior for ORION-compliant runtimes.

Where Memory Curator defines *how to evaluate information for storage*, AMM defines:
- *When* to trigger that evaluation (Event System)
- *How* to execute it without human commands (Autonomous Pipeline)
- *How* to maintain consistency across sessions (Cross-Session Deduplication)
- *What* to measure (Metrics Contract)

---

## 2. Scope

AMM manages:
- **Project Memory** — lifetime: Sprint or Project
- **Permanent Memory** — lifetime: Project or Permanent

AMM does NOT manage:
- Working Memory (ephemeral, session-scoped — not persisted)
- External documentation or code files
- Git history or commit messages

---

## 3. Activation Events

AMM MUST activate when any of the following conditions are detected:

| Event ID | Type | Trigger Condition | Priority |
|---|---|---|---|
| EVT-001 | TASK_COMPLETED | An important task has reached terminal state | High |
| EVT-002 | PHASE_CHANGED | The project phase has changed | High |
| EVT-003 | SESSION_CLOSE | Session close command received | Critical |
| EVT-004 | CONTEXT_HIGH_WATERMARK | Context usage ≥ 70% of available budget | Critical |
| EVT-005 | ARCHITECTURAL_DECISIONS_ACCUMULATED | ≥ 3 arch decisions since last AMM run | High |
| EVT-006 | DUPLICATE_DETECTED | Similarity score > 0.85 between any two active objects | Medium |
| EVT-007 | PRE_SPRINT_GENERATION | New Sprint generation was requested | High |
| EVT-008 | MODULE_CHANGE | Active module boundary crossed | Medium |

**N-AMM-R1:** AMM MUST respond to every Critical priority event within the current context window.

**N-AMM-R2:** AMM MUST NOT require a human command to execute. A runtime that requires `"Cerrar sesión"` to trigger AMM is not compliant with this specification.

---

## 4. Output Contract

### 4.1 Format

AMM MUST produce structured knowledge objects. AMM MUST NOT produce narrative summaries.

Each output object MUST conform to one of the nine types defined in `schemas/knowledge-objects.ts`.

### 4.2 Required Fields (all types)

| Field | Type | Constraint |
|---|---|---|
| id | string | Format: `{PREFIX}-{zero-padded-number}` |
| type | KnowledgeObjectType | Exactly one of nine types |
| tier | MemoryTier | Exactly one tier — Working, Project, or Permanent |
| created | ISO 8601 | Immutable after creation |
| updated | ISO 8601 | Updated on every mutation |
| lifetime | Lifetime | Session, Sprint, Project, or Permanent |
| impact | Impact | High, Medium, or Low |
| priority | Priority | Critical, High, Medium, or Low |
| status | string | Type-specific; see Section 4.3 |
| dependencies | string[] | References to other object IDs |

### 4.3 Valid Status Values per Type

| Type | Valid Status Values |
|---|---|
| Decision | Accepted, Pending, Rejected, Superseded |
| Policy | Active, Deprecated |
| Knowledge | Current, Deprecated |
| Constraint | Active, Resolved |
| Risk | Open, Mitigated, Resolved |
| Pending | Blocked, Ready, In-Progress, Done, Cancelled |
| Architecture | Proposed, Accepted, Implemented, Deprecated |
| Roadmap | Planned, In-Progress, Done, Cancelled |
| Metric | Improving, Stable, Degrading |

### 4.4 ID Prefix Convention

| Type | Prefix | Format |
|---|---|---|
| Decision | DEC | DEC-001 |
| Policy | POL | POL-001 |
| Knowledge | KN | KN-001 |
| Constraint | CON | CON-001 |
| Risk | RSK | RSK-001 |
| Pending | PEND | PEND-001 |
| Architecture | ARCH | ARCH-001 |
| Roadmap | ROAD | ROAD-001 |
| Metric | MET | MET-001 |

**N-AMM-R3:** IDs MUST be unique within a project. The same prefix sequence MUST NOT be reused after an object is archived.

---

## 5. Memory Tier Classification

### 5.1 Tier Assignment Rules

| Lifetime | Assigned Tier |
|---|---|
| Session | Working Memory (not persisted by AMM) |
| Sprint | Project Memory |
| Project | Project Memory |
| Permanent | Permanent Memory |

**N-AMM-R4:** An object MUST belong to exactly one tier at any given time.

**N-AMM-R5:** AMM MUST NOT persist Working Memory tier objects. Working Memory is ephemeral and session-scoped.

### 5.2 Tier Promotion Policy

A Project Memory object MAY be promoted to Permanent Memory if ALL of the following hold:
- Referenced in ≥ 3 separate sessions
- `impact` is High
- Contains no project-specific identifiers (names, IDs, paths)

### 5.3 Tier Demotion and Archival Policy

An object MUST be archived if ALL of the following hold:
- `status` is a terminal state: `Deprecated`, `Superseded`, `Done`, `Resolved`, `Cancelled`, or `Rejected`
- No other active object references it in `dependencies`
- `impact` is Low

An object SHOULD be archived if `status` is `Deprecated` or `Superseded` and has not been referenced in ≥ 2 consecutive AMM runs.

An object SHOULD also be archived (reason: `Expired`) if `status` is terminal, `lifetime` is `Sprint`, and no active object references it — Sprint-lifetime objects expire with the work that created them, regardless of impact. Any reusable lesson buried in a High-impact expiring object MUST first be extracted into a `Knowledge` object (deduplication rules apply).

---

## 6. Deduplication Rules

**N-AMM-R6:** Two knowledge objects of the same type with semantic similarity > 0.85 on their primary text field MUST be evaluated for merging.

**N-AMM-R7:** When merging two objects, the result MUST:
- Preserve the ID of the higher-priority object (or more recent if equal priority)
- Populate `supersedes` with the ID of the eliminated object
- Set `updated` to the merge timestamp

**N-AMM-R8:** An archived object's ID MUST be preserved in an ArchiveRecord. The ID MUST NOT be reused.

**N-AMM-R9:** Before deleting or archiving any object, AMM MUST verify that no active object lists it in `dependencies`. If a dependency exists, the object MUST NOT be archived — it MUST be demoted to `impact: Low` and `status: Deprecated` instead.

---

## 7. Normative Rules — Execution

**N-AMM-R10:** AMM MUST compute and persist SessionMetrics after every run, regardless of whether any objects were modified.

**N-AMM-R11:** AMM MUST emit an `AMM_RUN_COMPLETED` event upon successful completion, including the SessionMetrics in the event payload.

**N-AMM-R12:** AMM MUST NOT modify objects that were not part of the current run's scope. A run triggered by EVT-001 (task completed) MUST NOT modify Roadmap objects unless they directly reference the completed task.

**N-AMM-R13:** If AMM detects that executing a full run would exhaust the available context budget, it MUST execute a minimal run in this priority order:
  1. Persist Critical priority objects
  2. Persist High impact objects
  3. Execute deduplication
  4. Archive low-value objects
  5. Compute metrics

**N-AMM-R14:** AMM MUST NOT execute in parallel with itself for the same project. If a run is already in progress, incoming events MUST be queued.

---

## 8. Metrics Contract

AMM MUST produce a `SessionMetrics` object after every run containing:

| Field | Description |
|---|---|
| contextSaved | Tokens saved compared to pre-run storage size |
| compressionRatio | before_tokens / after_tokens |
| knowledgePreservedPercent | % of semantic content retained (0–100) |
| duplicateReduction | count of duplicate objects removed |
| estimatedTokenSavings | projected savings for next session |
| knowledgeDensity | KnowledgeObjects / total_tokens_stored |
| objectsCreated | new objects written this run |
| objectsMerged | objects consolidated this run |
| objectsArchived | objects removed from active memory this run |
| objectsPromoted | objects moved to higher tier |
| objectsDemoted | objects moved to lower tier |

Additionally, `byTier` and `byType` breakdowns MUST be computed.

---

## 9. Integration Readiness (Future)

AMM is designed for future integration with external systems. Current version operates via runtime event observation only.

| Integration | Planned Mechanism | Version |
|---|---|---|
| Git Hooks | `post-commit`, `pre-push` | v1.1 |
| GitHub Actions | Workflow completion events | v1.1 |
| Cron Jobs | Scheduled maintenance | v1.2 |
| File Watchers | On memory file modification | v1.2 |
| Background Workers | Async post-task processing | v2.0 |
| Event Bus | Runtime internal publish/subscribe | v2.0 |

---

## 10. Alternative Implementation Test (AIT)

Required by ORION N6-R4 before any specification is finalized.

**Test subject:** ATLAS Runtime — immutable state, reactive/event-driven, no named agents, pure functions.

| Normative Rule | ATLAS Compatible? | Notes |
|---|---|---|
| N-AMM-R1 (respond to Critical events) | YES | Reactive streams handle this naturally |
| N-AMM-R2 (no human command required) | YES | Event subscriptions replace polling |
| N-AMM-R4 (one tier per object) | YES | Immutable objects can carry tier field |
| N-AMM-R6 (deduplication threshold) | YES | Pure function comparator |
| N-AMM-R7 (merge policy) | YES | Immutable merge produces new object |
| N-AMM-R9 (dependency check before archive) | YES | Pure function over state snapshot |
| N-AMM-R10 (compute metrics) | YES | Pure function over before/after state |
| N-AMM-R14 (no parallel runs) | YES | Serialized stream in reactive system |

**AIT Result:** PASS — all normative rules can be satisfied by ATLAS without mimicking AIER's internal structure.

---

*For architecture diagrams: [architecture/OVERVIEW.md](architecture/OVERVIEW.md)*  
*For component specifications: [architecture/COMPONENTS.md](architecture/COMPONENTS.md)*
