# RFC-0001 — Object Model
## ORION Standard | Tier N-1 | Stable Core

**Status:** Draft  
**Version:** 1.0.0-draft  
**Depends on:** None (this is the foundation)  
**Required by:** RFC-0002, RFC-0003, RFC-0004  

---

## Purpose

This RFC defines all data types and schemas used across ORION. All Behavioral Contracts (RFC-0002), the Lifecycle Protocol (RFC-0003), and the Context Economy Protocol (RFC-0004) reference types defined here.

No ORION normative document may introduce a type not defined in this RFC without a corresponding amendment to this RFC.

---

## 1. Primitive Types

```
TaskID      = String  // Globally unique identifier for a Task
ContractID  = String  // Identifier for a behavioral contract
StepID      = String  // Identifier for an execution step within a plan
MemoryID    = String  // Identifier for a memory record
CapabilityID = String // Abstract capability identifier (NOT a model name)
Timestamp   = String  // ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
Tokens      = Integer // Non-negative integer, represents token count
Confidence  = Float   // Range [0.0, 1.0], where 1.0 = maximum confidence
```

**Normative rule N1-R1:** A `CapabilityID` MUST identify a capability profile, NOT a specific AI model, provider name, or model version. Mapping from CapabilityID to a concrete model is an implementation concern, not an ORION concern.

---

## 2. Enumeration Types

### 2.1 TaskState

```
TaskState =
  | PENDING     // Accepted, not yet started
  | ANALYZING   // Analysis Contract active
  | PLANNING    // Planning Contract active
  | BUILDING    // Build Contract(s) active
  | VERIFYING   // Verification Contract active
  | FIXING      // Fix Contract active
  | REFLECTING  // Reflection Contract active
  | DONE        // All contracts completed, success verified
  | ESCALATED   // Requires human intervention
  | ABORTED     // Context exhausted or unrecoverable error
```

**Normative rule N1-R2:** Implementations MUST NOT define additional TaskState values unless documented as implementation-specific extensions. Extensions MUST use a namespace prefix (e.g., `IMPL_MYRUNTIME_PAUSED`).

### 2.2 Priority

```
Priority =
  | CRITICAL  // Blocks all other work; runs single-threaded
  | HIGH      // High urgency; should not share resources with other HIGH tasks
  | MEDIUM    // Standard priority; may run in parallel
  | LOW       // Background work; lowest scheduling preference
```

### 2.3 Verdict

```
Verdict =
  | PASS      // All success conditions met
  | FAIL      // One or more success conditions not met; fix possible
  | ESCALATE  // Issue requires human judgment; automated fix not viable
```

### 2.4 MemoryType

```
MemoryType =
  | PERMANENT  // Survives indefinitely across all tasks and sessions
  | PROJECT    // Survives for the lifetime of a project
  | SESSION    // Survives for the current working session
  | WORKING    // Lives only for the duration of the current task
  | CACHE      // Temporary, may be evicted under memory pressure
```

### 2.5 ComplexityLevel

```
ComplexityLevel =
  | TRIVIAL    // Single-step, well-defined, low risk
  | LOW        // Multi-step but well-understood
  | MEDIUM     // Multi-step with moderate uncertainty
  | HIGH       // Significant uncertainty or cross-domain dependencies
  | CRITICAL   // Extreme complexity; high risk of failure; requires staged approach
```

### 2.6 ContextAllocationStrategy

```
ContextAllocationStrategy =
  | PROPORTIONAL    // Allocate proportional to step complexity estimate
  | PRIORITY_FIRST  // Steps with higher priority get larger allocation
  | EQUAL           // Equal allocation regardless of complexity
  | ADAPTIVE        // Runtime adjusts allocation based on consumption history
```

### 2.7 ContextOverflowPolicy

```
ContextOverflowPolicy =
  | SUSPEND    // Pause the task; save state; request user intervention
  | COMPRESS   // Trigger context compression; continue if sufficient budget remains
  | ESCALATE   // Report to user with description of remaining work
  | ABORT      // Record failure; mark task ABORTED
```

---

## 3. Core Objects

### 3.1 Task

The atomic unit of work in ORION.

```
Task {
  // Identity
  id:                  TaskID        // REQUIRED. Unique across all tasks.
  
  // Objective definition
  objective:           String        // REQUIRED. What must be achieved.
  success_conditions:  List<String>  // REQUIRED. At least 1. Verifiable conditions.
  restrictions:        List<String>  // REQUIRED. MAY be empty. What is NOT permitted.
  
  // Scheduling
  priority:            Priority      // REQUIRED.
  
  // Resource management
  context_budget:      ContextBudget // REQUIRED. Finite resource for this task.
  
  // Lifecycle tracking
  state:               TaskState     // REQUIRED. Current state in the lifecycle.
  attempt_count:       Integer       // REQUIRED. Starts at 0. Increments after each VERIFYING→FIXING cycle.
  max_attempts:        Integer       // REQUIRED. Must be >= 1. When attempt_count reaches this, escalate.
  
  // Timing
  created_at:          Timestamp     // REQUIRED.
  started_at:          Timestamp?    // Set when leaving PENDING.
  completed_at:        Timestamp?    // Set when entering DONE, ESCALATED, or ABORTED.
  
  // Audit
  state_history:       List<StateTransition>  // REQUIRED. Append-only log.
}
```

**Normative rule N1-R3:** A Runtime MUST NOT begin executing a Task whose `context_budget.total_tokens` is 0.

**Normative rule N1-R4:** A Runtime MUST ensure `attempt_count` is incremented exactly once per `VERIFYING → FIXING` transition.

### 3.2 StateTransition

```
StateTransition {
  from_state:   TaskState    // REQUIRED.
  to_state:     TaskState    // REQUIRED.
  timestamp:    Timestamp    // REQUIRED.
  trigger:      String       // REQUIRED. Why the transition occurred.
  context_at_transition: Tokens  // REQUIRED. Tokens consumed at this moment.
}
```

### 3.3 ContextBudget

The finite token resource for a Task. MUST be tracked and honored.

```
ContextBudget {
  total_tokens:      Tokens           // REQUIRED. Total budget for this task.
  allocated:         Map<ContractID, Tokens>  // Contract-level allocations. Sum MUST NOT exceed total.
  consumed:          Map<ContractID, Tokens>  // Actual consumption per contract. Updated in real time.
  reserved_output:   Tokens           // REQUIRED. Tokens reserved for final output. Excluded from allocations.
  overflow_policy:   ContextOverflowPolicy  // REQUIRED. What to do when budget is exhausted.
  allocation_strategy: ContextAllocationStrategy  // REQUIRED. How to distribute budget.
}
```

**Normative rule N1-R5:** The sum of `allocated` values MUST NOT exceed `total_tokens - reserved_output`.

**Normative rule N1-R6:** A Runtime MUST update `consumed` after each contract invocation with the actual tokens used.

**Normative rule N1-R7:** When `sum(consumed.values()) >= total_tokens - reserved_output`, the Runtime MUST execute the `overflow_policy` immediately.

### 3.4 ContextPackage

What a Runtime assembles and sends to a contract invocation. Enforces minimum privilege.

```
ContextPackage {
  recipient_contract:  ContractID           // REQUIRED. Which contract receives this package.
  task_id:             TaskID               // REQUIRED.
  allocated_budget:    Tokens               // REQUIRED. The budget for this contract invocation.
  content:             List<ContextItem>    // REQUIRED. The actual context items.
  total_tokens:        Tokens               // REQUIRED. Sum of all item token estimates.
}
```

**Normative rule N1-R8:** A Runtime MUST NOT include in a ContextPackage any information not required by the recipient contract's declared inputs (as defined in RFC-0002). Excess context is a protocol violation.

### 3.5 ContextItem

```
ContextItem {
  type:             ContextItemType   // REQUIRED.
  content:          Any               // REQUIRED. The actual content.
  token_estimate:   Tokens            // REQUIRED. Estimated token count.
  relevance_score:  Float             // REQUIRED. Range [0.0, 1.0].
  source:           String            // REQUIRED. Where this item came from.
}

ContextItemType =
  | TASK_DEFINITION    // The task objective, conditions, restrictions
  | KNOWLEDGE          // Retrieved from knowledge base
  | PRIOR_OUTPUT       // Output from a previous contract in this task
  | CONSTRAINT         // Architectural or quality constraints
  | EXAMPLE            // Relevant historical pattern
```

---

## 4. Contract Output Objects

### 4.1 AnalysisOutput

Produced by the Analysis Contract. Represents structured understanding of the task.

```
AnalysisOutput {
  task_id:                    TaskID               // REQUIRED. Must match input task.
  objective_decomposition:    List<SubObjective>   // REQUIRED. At least 1 item.
  risks:                      List<Risk>           // REQUIRED. MAY be empty.
  required_capabilities:      List<CapabilityID>   // REQUIRED. At least 1.
  estimated_complexity:       ComplexityLevel      // REQUIRED.
  context_requirements:       ContextRequirements  // REQUIRED.
  confidence:                 Confidence           // REQUIRED. Overall confidence in this analysis.
  context_consumed:           Tokens               // REQUIRED. Actual tokens used by this contract.
}

SubObjective {
  id:          StepID   // REQUIRED.
  description: String   // REQUIRED.
  depends_on:  List<StepID>  // MAY be empty.
}

Risk {
  description:  String           // REQUIRED.
  probability:  Confidence       // REQUIRED.
  impact:       ComplexityLevel  // REQUIRED. Proxy for severity.
  mitigation:   String?          // OPTIONAL.
}

ContextRequirements {
  knowledge_areas:  List<String>  // REQUIRED. What knowledge domains are needed.
  min_tokens:       Tokens        // REQUIRED. Minimum context to attempt this task.
  recommended_tokens: Tokens      // REQUIRED. Optimal context for high quality.
}
```

**Normative rule N1-R9:** `AnalysisOutput.confidence` below 0.3 MUST trigger a warning in the task's state history before proceeding to PLANNING.

### 4.2 ExecutionPlan

Produced by the Planning Contract.

```
ExecutionPlan {
  task_id:                  TaskID               // REQUIRED. Must match input task.
  steps:                    List<ExecutionStep>  // REQUIRED. At least 1.
  capability_assignments:   Map<StepID, CapabilityID>  // REQUIRED. One per step.
  budget_allocation:        Map<StepID, Tokens>  // REQUIRED. One per step. Sum MUST NOT exceed available budget.
  estimated_total_tokens:   Tokens               // REQUIRED.
  checkpoints:              List<Checkpoint>     // REQUIRED. At least 1 (the final verification).
  context_consumed:         Tokens               // REQUIRED.
}

ExecutionStep {
  id:                StepID    // REQUIRED.
  description:       String    // REQUIRED.
  capability_needed: CapabilityID  // REQUIRED.
  depends_on:        List<StepID>  // MAY be empty.
  output_namespace:  String    // REQUIRED. Where the output of this step lives.
}

Checkpoint {
  after_step:          StepID   // REQUIRED. Which step triggers this checkpoint.
  verification_type:   String   // REQUIRED. What kind of check to perform.
}
```

**Normative rule N1-R10:** The sum of `budget_allocation` values MUST NOT exceed `Task.context_budget.total_tokens - Task.context_budget.reserved_output - tokens_already_consumed`.

### 4.3 BuildOutput

Produced by the Build Contract for each execution step.

```
BuildOutput {
  task_id:          TaskID         // REQUIRED.
  step_id:          StepID         // REQUIRED. Identifies which step produced this.
  artifacts:        List<Artifact> // REQUIRED. At least 1.
  context_consumed: Tokens         // REQUIRED.
  execution_notes:  String?        // OPTIONAL. Implementation details relevant to QA.
}

Artifact {
  id:       String  // REQUIRED. Unique within the task.
  type:     String  // REQUIRED. E.g., "file", "function", "schema", "config".
  location: String  // REQUIRED. Where to find this artifact.
  content_hash: String  // REQUIRED. Integrity verification.
}
```

### 4.4 QAReport

Produced by the Verification Contract. The central quality document.

```
QAReport {
  task_id:             TaskID         // REQUIRED.
  verdict:             Verdict        // REQUIRED.
  checks:              List<QACheck>  // REQUIRED. One check per success condition.
  failing_conditions:  List<String>   // REQUIRED if verdict = FAIL or ESCALATE.
  fix_instructions:    List<FixInstruction>?  // REQUIRED if verdict = FAIL.
  escalation_reason:   String?        // REQUIRED if verdict = ESCALATE.
  context_consumed:    Tokens         // REQUIRED.
}

QACheck {
  success_condition:   String   // REQUIRED. The exact condition text from the Task.
  result:              Verdict  // REQUIRED. PASS or FAIL for this specific condition.
  evidence:            String   // REQUIRED. Observable evidence supporting the result.
}

FixInstruction {
  condition_id:        String   // REQUIRED. Which failing condition this fixes.
  affected_artifacts:  List<String>  // REQUIRED. Which artifacts need modification.
  description:         String   // REQUIRED. What change to make.
  scope:               String   // REQUIRED. MUST describe minimum necessary change only.
}
```

**Normative rule N1-R11:** If `QAReport.verdict = FAIL`, then `fix_instructions` MUST be present and non-empty.

**Normative rule N1-R12:** `QAReport.checks` MUST contain exactly one `QACheck` per `Task.success_conditions` item. No success condition may be omitted from verification.

### 4.5 FixResult

Produced by the Fix Contract.

```
FixResult {
  task_id:               TaskID          // REQUIRED.
  qa_report_id:          String          // REQUIRED. Which QAReport triggered this fix.
  addressed_conditions:  List<String>    // REQUIRED. Which conditions were addressed.
  modified_artifacts:    List<String>    // REQUIRED. Which artifacts were changed.
  context_consumed:      Tokens          // REQUIRED.
  unchanged_conditions:  List<String>    // REQUIRED. Conditions not addressed (if any).
}
```

**Normative rule N1-R13:** A Fix Contract MUST NOT modify artifacts not listed in the corresponding `QAReport.fix_instructions[*].affected_artifacts`. Unrequested modifications are a protocol violation.

### 4.6 ReflectionReport

Produced by the Reflection Contract after task completion.

```
ReflectionReport {
  task_id:              TaskID         // REQUIRED.
  outcome:              TaskState      // REQUIRED. Must be DONE, ESCALATED, or ABORTED.
  what_worked:          List<Observation>  // REQUIRED. MAY be empty.
  what_failed:          List<Observation>  // REQUIRED. MAY be empty.
  context_efficiency:   Float          // REQUIRED. Range [0.0, 1.0]. See N-4 for definition.
  total_cycles:         Integer        // REQUIRED. Total VERIFYING→FIXING cycles.
  proposed_patterns:    List<Pattern>  // REQUIRED. MAY be empty.
  proposed_improvements: List<Improvement>  // REQUIRED. MAY be empty.
  context_consumed:     Tokens         // REQUIRED.
}

Observation {
  category:    String   // REQUIRED. E.g., "context allocation", "capability selection".
  description: String   // REQUIRED.
  confidence:  Confidence  // REQUIRED.
}

Pattern {
  name:        String   // REQUIRED.
  description: String   // REQUIRED.
  conditions:  String   // REQUIRED. When this pattern applies.
  confidence:  Confidence  // REQUIRED.
}

Improvement {
  target:      String   // REQUIRED. Which component or process to improve.
  description: String   // REQUIRED.
  expected_benefit: String  // REQUIRED.
  risk:        String   // REQUIRED.
}
```

### 4.7 MemoryRecord

The persistent unit of accumulated knowledge.

```
MemoryRecord {
  id:            MemoryID    // REQUIRED. Unique.
  type:          MemoryType  // REQUIRED.
  content:       Any         // REQUIRED.
  confidence:    Confidence  // REQUIRED. Decays with time; reinforced with use.
  source_task:   TaskID?     // OPTIONAL. Which task produced this record.
  created_at:    Timestamp   // REQUIRED.
  last_accessed: Timestamp   // REQUIRED. Updated on every read.
  access_count:  Integer     // REQUIRED. Starts at 0.
  expires_at:    Timestamp?  // OPTIONAL. If set, Runtime MUST NOT use after this timestamp.
  tags:          List<String>  // REQUIRED. MAY be empty. For retrieval filtering.
}
```

**Normative rule N1-R14:** A Runtime MUST NOT use a MemoryRecord whose `expires_at` is in the past.

**Normative rule N1-R15:** A Runtime MUST update `last_accessed` and increment `access_count` every time a MemoryRecord is included in a ContextPackage.

---

## 5. Alternative Implementation Test

*This section is informative but REQUIRED for RFC adoption.*

**Question:** Can a Runtime with a completely different internal architecture implement the objects defined here?

**Test case:** "ATLAS Runtime" uses a purely functional, immutable-state architecture. No mutable shared state. All state is passed explicitly.

- `Task`: Can be an immutable record. State changes create new Task versions. ✅ Compatible.
- `ContextBudget`: Can be tracked as a pure function accumulating consumed tokens. ✅ Compatible.
- `QAReport`: Produced as an immutable output. ✅ Compatible.
- `MemoryRecord`: Persistent storage is external to the runtime's functional core. ✅ Compatible.

**Result:** All object definitions in this RFC are implementation-architecture-neutral. An immutable functional implementation, a reactive event-driven implementation, or a state-machine-based implementation can all comply with these schemas.

---

*End of RFC-0001. See RFC-0002 for how these objects are used in Behavioral Contracts.*
