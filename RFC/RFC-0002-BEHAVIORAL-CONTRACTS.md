# RFC-0002 — Behavioral Contracts
## ORION Standard | Tier N-2 | Stable Core

**Status:** Draft  
**Version:** 1.0.0-draft  
**Depends on:** RFC-0001 (Object Model)  
**Required by:** RFC-0003 (Lifecycle Protocol)  

---

## Purpose

This RFC defines the behavioral contracts of ORION — the observable boundaries where a Cognitive Runtime MUST produce specific outputs given specific inputs.

Each contract defines:
- What the contract receives (inputs)
- What the contract MUST produce (outputs)
- Validation rules for the output
- Failure modes and required responses
- What the contract does NOT define (implementation freedom)

**Critical distinction:** A contract defines the interface, not the implementation. How a Runtime satisfies the contract is irrelevant to ORION compliance. Only what it produces matters.

---

## 1. Contract Taxonomy

ORION defines seven behavioral contracts, organized by lifecycle phase:

| Contract ID | Phase | Input | Output |
|---|---|---|---|
| `orion:analysis:v1` | ANALYZING | Task | AnalysisOutput |
| `orion:planning:v1` | PLANNING | Task + AnalysisOutput | ExecutionPlan |
| `orion:build:v1` | BUILDING | ExecutionStep + ContextPackage | BuildOutput |
| `orion:verification:v1` | VERIFYING | Task + List\<BuildOutput\> | QAReport |
| `orion:fix:v1` | FIXING | QAReport + affected artifacts | FixResult |
| `orion:reflection:v1` | REFLECTING | Complete TaskRecord | ReflectionReport |
| `orion:memory:v1` | POST-REFLECT | ReflectionReport + existing MemoryRecords | List\<MemoryRecord\> |

The lifecycle order of these contracts is defined in RFC-0003. This RFC only defines what each contract receives and produces.

---

## 2. CONTRACT: Analysis — `orion:analysis:v1`

### 2.1 Purpose

Transform a raw Task into structured, actionable understanding before planning begins.

### 2.2 Input

```
Required:
  task: Task                    // Full Task object (RFC-0001 §3.1)
  context_package: ContextPackage // Assembled by the Runtime; may include
                                  // relevant MemoryRecords and constraints
```

### 2.3 Output Requirements

The contract MUST produce an `AnalysisOutput` (RFC-0001 §4.1) satisfying all of:

**N2-R1:** `output.task_id` MUST equal `input.task.id`.

**N2-R2:** `output.objective_decomposition` MUST contain at least one `SubObjective`.

**N2-R3:** `output.required_capabilities` MUST contain at least one `CapabilityID`. Each CapabilityID MUST be an abstract capability name, not a model name (enforces N1-R1).

**N2-R4:** `output.confidence` MUST be in range [0.0, 1.0].

**N2-R5:** `output.context_requirements.min_tokens` MUST be a positive integer.

**N2-R6:** `output.context_consumed` MUST accurately reflect tokens used during this contract invocation.

### 2.4 Failure Handling

**If the contract cannot produce a valid AnalysisOutput** (e.g., task objective is incoherent, context budget insufficient for analysis):

- The Runtime MUST record the failure reason in `Task.state_history`.
- The Runtime MUST transition the Task to `ESCALATED` (not `ABORTED` — a human may clarify the objective).
- The Runtime MUST NOT attempt planning without a valid AnalysisOutput.

### 2.5 What This Contract Does NOT Define

- How the Runtime reasons about the task
- What AI model is invoked
- What internal steps produce the decomposition
- How long the analysis takes

---

## 3. CONTRACT: Planning — `orion:planning:v1`

### 3.1 Purpose

Transform an AnalysisOutput into a concrete, resource-budgeted execution plan.

### 3.2 Input

```
Required:
  task:             Task           // Full Task object
  analysis:         AnalysisOutput // Output from the Analysis contract
  context_package:  ContextPackage
```

### 3.3 Output Requirements

The contract MUST produce an `ExecutionPlan` (RFC-0001 §4.2) satisfying all of:

**N2-R7:** `output.task_id` MUST equal `input.task.id`.

**N2-R8:** `output.steps` MUST contain at least one `ExecutionStep`.

**N2-R9:** Every `StepID` referenced in `output.capability_assignments` MUST correspond to a step in `output.steps`.

**N2-R10:** Every `StepID` in `output.steps` MUST have exactly one entry in `output.capability_assignments`.

**N2-R11:** The sum of all values in `output.budget_allocation` MUST NOT exceed the remaining context budget at the time of planning:

```
sum(output.budget_allocation.values()) 
  ≤ task.context_budget.total_tokens 
    - task.context_budget.reserved_output 
    - tokens_consumed_in_analysis
```

**N2-R12:** `output.checkpoints` MUST contain at least one `Checkpoint` positioned after the final execution step.

### 3.4 Failure Handling

**If the task cannot fit within the context budget** (min_tokens > available budget):
- The Runtime MUST record this in `Task.state_history`.
- The Runtime MUST transition to `ESCALATED` with escalation reason "Context budget insufficient for planned execution."
- The Runtime MUST NOT proceed to BUILDING with a budget-violating plan.

**If planning fails for other reasons:**
- Record failure reason in state history.
- Transition to `ESCALATED`.

### 3.5 What This Contract Does NOT Define

- How steps are sequenced internally
- What planning algorithm is used
- How capabilities are profiled or matched

---

## 4. CONTRACT: Build — `orion:build:v1`

### 4.1 Purpose

Execute one step of the ExecutionPlan and produce its output artifact(s).

### 4.2 Input

```
Required:
  task:             Task           // Full Task object
  step:             ExecutionStep  // The specific step to execute
  plan:             ExecutionPlan  // Full plan for context
  context_package:  ContextPackage // Pre-assembled, respects step's budget allocation
```

**N2-R13:** The Build contract MUST be invoked exactly once per `ExecutionStep` in the `ExecutionPlan`, in dependency order. A step MUST NOT be invoked before all steps in its `depends_on` list have produced valid `BuildOutput`.

### 4.3 Output Requirements

The contract MUST produce a `BuildOutput` (RFC-0001 §4.3) satisfying all of:

**N2-R14:** `output.task_id` MUST equal `input.task.id`.

**N2-R15:** `output.step_id` MUST equal `input.step.id`.

**N2-R16:** `output.artifacts` MUST contain at least one `Artifact`.

**N2-R17:** Each `Artifact.location` MUST be within the step's declared `output_namespace` from the ExecutionPlan.

**N2-R18:** `output.context_consumed` MUST NOT exceed the budget allocated for this step in `ExecutionPlan.budget_allocation[step.id]`.

### 4.4 Failure Handling

**If the step cannot be completed** (runtime error, model failure, etc.):
- Record failure in `Task.state_history`.
- The Runtime MAY retry the step up to 1 additional time within the same attempt.
- If retry also fails: transition Task to `ESCALATED`.

**If context is exhausted mid-step:**
- Execute the `ContextOverflowPolicy` (N-4 / RFC-0004).

### 4.5 What This Contract Does NOT Define

- How the artifact is generated
- What AI model or technique produces it
- The internal format of artifacts (implementation-specific)
- How the Runtime handles the capability assigned to this step

---

## 5. CONTRACT: Verification — `orion:verification:v1`

### 5.1 Purpose

Determine whether the outputs of all Build steps satisfy the Task's success conditions.

### 5.2 Input

```
Required:
  task:           Task             // Full Task object (contains success_conditions)
  build_outputs:  List<BuildOutput>  // All outputs from the BUILDING phase
  context_package: ContextPackage
```

### 5.3 Output Requirements

The contract MUST produce a `QAReport` (RFC-0001 §4.4) satisfying all of:

**N2-R19:** `output.task_id` MUST equal `input.task.id`.

**N2-R20:** `output.checks` MUST contain exactly one `QACheck` per item in `Task.success_conditions`. No condition may be omitted. (Enforces N1-R12.)

**N2-R21:** If `output.verdict = FAIL`, then `output.failing_conditions` MUST be non-empty and MUST be a subset of `Task.success_conditions`.

**N2-R22:** If `output.verdict = FAIL`, then `output.fix_instructions` MUST be non-empty, with one `FixInstruction` per failing condition.

**N2-R23:** Each `FixInstruction.affected_artifacts` MUST reference artifact IDs that exist in the `build_outputs`.

**N2-R24:** If `output.verdict = ESCALATE`, then `output.escalation_reason` MUST be present and non-empty.

**N2-R25:** `QACheck.evidence` MUST be an observable, factual statement — not an assertion. Example of valid evidence: "Function `login()` returns 401 when password is null." Example of invalid evidence: "The function looks correct."

### 5.4 Failure Handling

**If verification cannot run** (no build outputs, corrupted artifacts):
- Record failure in state history.
- Transition to `ESCALATED`.
- Do NOT produce a PASS or FAIL verdict without actually checking.

### 5.5 What This Contract Does NOT Define

- How checking is performed (automated tests, static analysis, model reasoning)
- What tools are used for verification
- Internal representation of quality metrics

---

## 6. CONTRACT: Fix — `orion:fix:v1`

### 6.1 Purpose

Make the minimum necessary changes to address failing conditions identified in a QAReport.

### 6.2 Input

```
Required:
  task:             Task           // Full Task object
  qa_report:        QAReport       // Must have verdict = FAIL
  failing_artifacts: List<Artifact> // Only the artifacts referenced in fix_instructions
  context_package:  ContextPackage
```

**N2-R26:** The Fix contract MUST NOT be invoked with a QAReport whose verdict is PASS or ESCALATE.

### 6.3 Output Requirements

The contract MUST produce a `FixResult` (RFC-0001 §4.5) satisfying all of:

**N2-R27:** `output.task_id` MUST equal `input.task.id`.

**N2-R28:** `output.qa_report_id` MUST reference the ID of the input QAReport.

**N2-R29:** `output.modified_artifacts` MUST be a subset of artifacts listed in `qa_report.fix_instructions[*].affected_artifacts`. The Fix contract MUST NOT modify any artifact not listed there. (Enforces N1-R13.)

**N2-R30:** `output.addressed_conditions` MUST be a non-empty subset of `qa_report.failing_conditions`.

### 6.4 Failure Handling

**If a fix cannot address any failing condition:**
- Record reason in state history.
- Transition to `ESCALATED` (not ABORTED — the human may provide guidance).

**If the fix makes things worse** (detected in the subsequent Verification pass):
- This is handled by the Lifecycle Protocol (RFC-0003), not by this contract.

### 6.5 What This Contract Does NOT Define

- How fixes are generated
- Whether the Runtime uses AI or deterministic methods
- The depth of change permitted beyond what the fix_instructions specify

---

## 7. CONTRACT: Reflection — `orion:reflection:v1`

### 7.1 Purpose

Extract generalizable insights from a completed (or escalated/aborted) task.

### 7.2 Input

```
Required:
  task:          Task               // Full Task object with complete state_history
  all_outputs:   TaskRecord         // All outputs from all contracts in this task
  context_package: ContextPackage
```

**Note:** A `TaskRecord` is the complete collection of all contract outputs for a single task (AnalysisOutput, ExecutionPlan, all BuildOutputs, all QAReports, all FixResults). It is not a separate schema — it is the aggregation of objects already defined in RFC-0001.

### 7.3 Output Requirements

The contract MUST produce a `ReflectionReport` (RFC-0001 §4.6) satisfying all of:

**N2-R31:** `output.task_id` MUST equal `input.task.id`.

**N2-R32:** `output.outcome` MUST equal the final `Task.state` (DONE, ESCALATED, or ABORTED).

**N2-R33:** `output.context_efficiency` MUST be computed as:

```
context_efficiency = tokens_in_useful_outputs / total_tokens_consumed

where:
  tokens_in_useful_outputs = tokens consumed by contracts that contributed to
                              at least one PASS verdict in a QAReport
  total_tokens_consumed    = sum of all context_consumed fields across all contracts
```

**N2-R34:** `output.total_cycles` MUST equal the number of VERIFYING→FIXING transitions recorded in `Task.state_history`.

### 7.4 Failure Handling

**If reflection fails** (context budget exhausted):
- Record a minimal ReflectionReport with only the required fields.
- Set `what_worked`, `what_failed`, `proposed_patterns`, `proposed_improvements` to empty lists.
- The Runtime MUST still invoke the Memory contract with this minimal report.
- Reflection is MANDATORY and MUST NOT be skipped. Tasks that reach DONE without a ReflectionReport are considered incomplete.

### 7.5 What This Contract Does NOT Define

- How insights are extracted
- The depth or format of patterns
- Whether the Runtime invokes an AI model or uses rule-based analysis

---

## 8. CONTRACT: Memory — `orion:memory:v1`

### 8.1 Purpose

Persist valuable insights from a task into long-term memory.

### 8.2 Input

```
Required:
  reflection:       ReflectionReport  // From the Reflection contract
  existing_memory:  List<MemoryRecord>  // Relevant existing records (for deduplication)
  context_package:  ContextPackage
```

### 8.3 Output Requirements

The contract MUST produce a `List<MemoryRecord>` (RFC-0001 §4.7) where each record satisfies:

**N2-R35:** Each produced `MemoryRecord.confidence` MUST be in range [0.0, 1.0].

**N2-R36:** The Memory contract MUST apply a **value filter** before persisting: MemoryRecords with `confidence < 0.4` MUST NOT be persisted to PERMANENT or PROJECT memory types. They MAY be persisted to SESSION memory.

**N2-R37:** If a produced MemoryRecord is semantically equivalent to an existing record in `existing_memory`, the Runtime MUST update the existing record's confidence rather than creating a duplicate.

**N2-R38:** MemoryRecords produced from `ReflectionReport.proposed_improvements` MUST have `type = PROJECT` or lower — they MUST NOT be elevated to PERMANENT without explicit user confirmation.

### 8.4 Failure Handling

**If the Memory contract fails:** Record the failure. The Task is still considered DONE — memory persistence failure is not a task failure, but it MUST be logged.

### 8.5 What This Contract Does NOT Define

- Storage backend
- Retrieval algorithms
- How semantic equivalence is determined
- Confidence scoring algorithm

---

## 9. Alternative Implementation Test

*Required for RFC adoption.*

**Test question for each contract:** Can a Runtime built on a different internal architecture satisfy this contract?

| Contract | Functional arch? | Reactive arch? | Agent-based arch? | Result |
|---|---|---|---|---|
| Analysis | ✅ pure function | ✅ event handler | ✅ agent behavior | Pass |
| Planning | ✅ pure function | ✅ event handler | ✅ agent behavior | Pass |
| Build | ✅ pure function | ✅ event handler | ✅ agent behavior | Pass |
| Verification | ✅ pure function | ✅ event handler | ✅ agent behavior | Pass |
| Fix | ✅ pure function | ✅ event handler | ✅ agent behavior | Pass |
| Reflection | ✅ pure function | ✅ event handler | ✅ agent behavior | Pass |
| Memory | ✅ with external store | ✅ with external store | ✅ with external store | Pass |

**Result:** All contracts in this RFC are architecture-neutral. The contracts define input/output boundaries only, not internal structure.

---

*End of RFC-0002. See RFC-0003 for the Lifecycle Protocol governing when these contracts are invoked.*
