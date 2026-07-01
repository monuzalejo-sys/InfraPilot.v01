# RFC-0003 — Lifecycle Protocol
## ORION Standard | Tier N-3 | Stable Core

**Status:** Draft  
**Version:** 1.0.0-draft  
**Depends on:** RFC-0001 (Object Model), RFC-0002 (Behavioral Contracts)  
**Required by:** RFC-0004 (Context Economy), RFC-0006 (Compliance)  

---

## Purpose

This RFC defines the Task lifecycle: the set of states a Task can be in, the rules governing transitions between them, and the invariants that MUST hold in each state.

The Lifecycle Protocol is what makes ORION a protocol rather than a collection of schemas. It defines the observable sequence of contract invocations and state transitions that must occur for a Task to be handled in an ORION-compliant manner.

---

## 1. Lifecycle State Machine

### 1.1 State Diagram

```
                     ┌─────────┐
         input       │         │
        ─────────►   │ PENDING │
                     │         │
                     └────┬────┘
                          │ budget validated
                          │ objective present
                          ▼
                     ┌──────────┐
                     │ANALYZING │◄──────────────────────────┐
                     └────┬─────┘                           │
                          │ AnalysisOutput valid             │
                          ▼                                  │
                     ┌──────────┐                            │
                     │ PLANNING │                            │
                     └────┬─────┘                            │
                          │ ExecutionPlan valid               │
                          │ budget check passed              │
                          ▼                                  │
                     ┌──────────┐                            │
             ┌──────►│ BUILDING │                            │
             │       └────┬─────┘                            │
             │            │ all steps complete               │
             │            ▼                                  │
             │      ┌───────────┐     attempt_count          │
             │      │ VERIFYING │────────< max_attempts ─────┘
             │      └─────┬─────┘     (loop back)
             │    PASS    │    FAIL
             │            │
             │  ┌─────────┴──────────┐
             │  │                    │
             │  ▼ verdict=ESCALATE   ▼ verdict=FAIL AND
             │ ┌───────────┐        attempt_count < max
             │ │ ESCALATED │        │
             │ └───────────┘        ▼
             │                 ┌─────────┐
             │                 │ FIXING  │
             │                 └────┬────┘
             │                      │ FixResult produced
             └──────────────────────┘ (go back to BUILDING)
                    │
                    │ PASS verdict
                    ▼
              ┌───────────┐
              │ REFLECTING│
              └─────┬─────┘
                    │ ReflectionReport + MemoryRecords produced
                    ▼
               ┌────────┐
               │  DONE  │
               └────────┘


From any state:
  context_budget exhausted + overflow_policy=ABORT  →  ABORTED
```

### 1.2 State Definitions

| State | Definition |
|---|---|
| `PENDING` | Task accepted; not yet executing. All fields validated. |
| `ANALYZING` | Analysis contract active. Runtime decomposes the objective. |
| `PLANNING` | Planning contract active. Runtime allocates resources per step. |
| `BUILDING` | Build contract active for one or more steps. Artifacts being produced. |
| `VERIFYING` | Verification contract active. QAReport being produced. |
| `FIXING` | Fix contract active. Specific artifacts being corrected. |
| `REFLECTING` | Reflection contract active, then Memory contract active. |
| `DONE` | All success conditions verified PASS. Memory persisted. Terminal. |
| `ESCALATED` | Human intervention required. Terminal. |
| `ABORTED` | Context exhausted or unrecoverable error. Terminal. |

**Terminal states:** DONE, ESCALATED, ABORTED. A Task in a terminal state MUST NOT transition to any other state.

---

## 2. Transition Rules

Each transition has a trigger (what causes it), a guard (what must be true), and an action (what MUST happen during the transition).

### 2.1 PENDING → ANALYZING

**Trigger:** Runtime scheduler selects this task for execution.

**Guard (N3-R1):** ALL of the following MUST be true:
- `Task.objective` is non-empty
- `Task.success_conditions` is non-empty
- `Task.context_budget.total_tokens > 0`
- `Task.state == PENDING`

**Action:**
1. Set `Task.started_at` to current timestamp.
2. Append `StateTransition` to `Task.state_history`.
3. Assemble `ContextPackage` for the Analysis contract.
4. Invoke Analysis contract (`orion:analysis:v1`).

### 2.2 ANALYZING → PLANNING

**Trigger:** Analysis contract produces a valid AnalysisOutput.

**Guard (N3-R2):** ALL of the following MUST be true:
- Analysis contract produced an AnalysisOutput satisfying all N2-R1 through N2-R6 rules.
- `AnalysisOutput.context_requirements.min_tokens ≤` remaining budget.

**Action:**
1. Store AnalysisOutput.
2. Update `ContextBudget.consumed` with `AnalysisOutput.context_consumed`.
3. Append StateTransition.
4. Assemble ContextPackage for Planning contract.
5. Invoke Planning contract (`orion:planning:v1`).

### 2.3 ANALYZING → ESCALATED (from analysis failure)

**Trigger:** Analysis contract fails to produce valid AnalysisOutput, OR `AnalysisOutput.context_requirements.min_tokens > remaining budget`.

**Guard:** Analysis contract invocation completed without valid output.

**Action:**
1. Record failure reason in `Task.state_history`.
2. Set `Task.completed_at`.
3. Transition to `ESCALATED`.
4. **Still invoke Reflection contract** with available data (N3-R3: Reflection is mandatory even in failure paths).

### 2.4 PLANNING → BUILDING

**Trigger:** Planning contract produces a valid ExecutionPlan.

**Guard (N3-R4):** ALL of the following MUST be true:
- ExecutionPlan satisfies all N2-R7 through N2-R12 rules.
- Budget allocation sum does not exceed remaining budget.

**Action:**
1. Store ExecutionPlan.
2. Update ContextBudget.consumed.
3. Append StateTransition.
4. Begin executing steps in dependency order. For each step:
   a. Assemble ContextPackage respecting the step's allocated budget.
   b. Invoke Build contract (`orion:build:v1`).
   c. Store BuildOutput.
   d. Update ContextBudget.consumed.

### 2.5 BUILDING → VERIFYING

**Trigger:** All steps in the ExecutionPlan have produced valid BuildOutputs.

**Guard (N3-R5):** ALL ExecutionPlan steps have a corresponding BuildOutput satisfying N2-R14 through N2-R18.

**Action:**
1. Collect all BuildOutputs.
2. Append StateTransition.
3. Assemble ContextPackage for Verification contract.
4. Invoke Verification contract (`orion:verification:v1`).

### 2.6 VERIFYING → DONE (via REFLECTING)

**Trigger:** Verification contract produces QAReport with `verdict = PASS`.

**Guard (N3-R6):** QAReport satisfies all N2-R19 through N2-R25 rules AND `verdict = PASS`.

**Action:**
1. Append StateTransition `VERIFYING → REFLECTING`.
2. Invoke Reflection contract (`orion:reflection:v1`).
3. Store ReflectionReport.
4. Invoke Memory contract (`orion:memory:v1`).
5. Persist produced MemoryRecords.
6. Append StateTransition `REFLECTING → DONE`.
7. Set `Task.completed_at`.

### 2.7 VERIFYING → FIXING

**Trigger:** QAReport with `verdict = FAIL` AND `Task.attempt_count < Task.max_attempts`.

**Guard (N3-R7):** ALL of the following MUST be true:
- QAReport.verdict = FAIL
- QAReport satisfies N2-R21 and N2-R22 (failing_conditions and fix_instructions present)
- `Task.attempt_count < Task.max_attempts`

**Action:**
1. Increment `Task.attempt_count`.
2. Append StateTransition `VERIFYING → FIXING`.
3. Assemble ContextPackage for Fix contract (ONLY the failing artifacts + QAReport).
4. Invoke Fix contract (`orion:fix:v1`).
5. Store FixResult.
6. Append StateTransition `FIXING → BUILDING`.
7. Re-enter BUILDING for the steps whose artifacts were modified.

**N3-R8:** The Fix contract MUST trigger a re-invocation of the Build contract for modified artifacts, not a full rebuild from scratch. Only affected steps re-execute.

### 2.8 VERIFYING → ESCALATED (attempt limit)

**Trigger:** QAReport with `verdict = FAIL` AND `Task.attempt_count >= Task.max_attempts`.

**Guard (N3-R9):** `Task.attempt_count >= Task.max_attempts`.

**Action:**
1. Append StateTransition.
2. Set `Task.completed_at`.
3. **Still invoke Reflection contract** with available data (N3-R3 applies).
4. Persist MemoryRecords.
5. Transition to `ESCALATED`.

### 2.9 VERIFYING → ESCALATED (verdict = ESCALATE)

**Trigger:** QAReport with `verdict = ESCALATE`.

**Guard:** QAReport.verdict = ESCALATE AND escalation_reason present.

**Action:** Same as 2.8.

### 2.10 ANY → ABORTED (context exhaustion)

**Trigger:** `ContextBudget.consumed ≥ ContextBudget.total_tokens - reserved_output` AND `overflow_policy = ABORT`.

**Guard:** Current state is not a terminal state.

**Action:**
1. Immediately halt current contract invocation.
2. Append StateTransition `[current_state] → ABORTED` with trigger "Context budget exhausted."
3. Set `Task.completed_at`.
4. **Attempt** Reflection contract with minimal context (if any budget remains in reserved_output).
5. Transition to `ABORTED`.

---

## 3. State Invariants

These conditions MUST hold at all times while a Task is in the given state.

### 3.1 Invariants by State

| State | Invariants |
|---|---|
| PENDING | `attempt_count = 0`. No contracts have been invoked. `started_at = null`. |
| ANALYZING | `started_at` is set. Analysis contract is active. No AnalysisOutput stored yet. |
| PLANNING | Valid AnalysisOutput exists. Planning contract is active. No ExecutionPlan stored. |
| BUILDING | Valid ExecutionPlan exists. At least one Build contract active or pending. |
| VERIFYING | All ExecutionPlan steps have BuildOutputs. Verification contract active. |
| FIXING | QAReport with verdict=FAIL exists. Fix contract active. `attempt_count ≥ 1`. |
| REFLECTING | Task is in a terminal-path state (PASS verdict received OR attempt limit reached). |
| DONE | All success conditions verified PASS. ReflectionReport exists. MemoryRecords persisted. `completed_at` set. |
| ESCALATED | `completed_at` set. ReflectionReport exists (possibly minimal). |
| ABORTED | `completed_at` set. ContextBudget exhausted. No more contract invocations. |

**N3-R10:** A Runtime MUST NOT invoke any contract while the Task is in a terminal state (DONE, ESCALATED, ABORTED).

### 3.2 Global Invariants

**N3-R11:** At any point in time, a Task MUST be in exactly one state.

**N3-R12:** `Task.state_history` MUST be append-only. No transition record may be modified or deleted.

**N3-R13:** `Task.attempt_count` MUST be monotonically non-decreasing throughout the Task's lifetime.

**N3-R14:** The sum of all `context_consumed` values across all contract invocations for a Task MUST equal `Task.context_budget.consumed[contract_id]` for each contract.

---

## 4. Reflection is Mandatory

**N3-R3 (restated):** The Reflection contract (`orion:reflection:v1`) MUST be invoked before any Task reaches a terminal state. This applies to ALL terminal paths:
- ✅ `VERIFYING → REFLECTING → DONE`
- ✅ `VERIFYING → ESCALATED` (must invoke reflection first)
- ✅ `ANALYZING → ESCALATED` (must invoke reflection first)
- ✅ `ANY → ABORTED` (must attempt reflection with available budget)

**Rationale:** A Task that reaches a terminal state without Reflection loses all learning. Even failed tasks contain valuable signal — what failed, how much budget was used, what the risks were. This learning is the Runtime's primary mechanism for improvement.

**Exception:** If `Task.context_budget.reserved_output` is 0 and budget is exhausted, the Reflection contract MAY produce a minimal empty ReflectionReport. But the contract invocation MUST occur.

---

## 5. Alternative Implementation Test

**Question:** Does this lifecycle protocol force a specific internal architecture?

**Test: ATLAS Runtime (purely functional, immutable state)**
- ATLAS doesn't have a mutable state machine. State is computed from the immutable log.
- Transitions are new log entries, not mutations.
- Can ATLAS comply? ✅ Yes. The protocol requires that certain transitions happen and that invariants hold. It does not require a mutable state machine.

**Test: NOVA Runtime (reactive/event-driven, no explicit state tracking)**
- NOVA emits events when contracts complete.
- State is derived from event history.
- Can NOVA comply? ✅ Yes. The invariants can be verified from the event log. The transition rules become event emission rules.

**Test: TITAN Runtime (distributed, multi-node)**
- TITAN runs different contracts on different nodes.
- State transitions require distributed consensus.
- Can TITAN comply? ✅ Yes, with the constraint that it must still guarantee the invariants hold globally. The protocol doesn't require single-node execution.

**Result:** The Lifecycle Protocol defines observable sequence and invariants only. It does not require a specific implementation of the state machine.

---

*End of RFC-0003. See RFC-0004 for the Context Economy Protocol governing token management within this lifecycle.*
