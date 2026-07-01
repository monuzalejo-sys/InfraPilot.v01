# RFC-0006 — Compliance Protocol
## ORION Standard | Tier C-1 | Evolutionary Body

**Status:** Draft  
**Version:** 1.0.0-draft  
**Depends on:** RFC-0001 through RFC-0005  

---

## Purpose

This RFC defines what it means for a Cognitive Runtime to be "ORION-compliant," the levels of compliance, and the methodology for verifying compliance externally.

A key principle: **ORION compliance is testable, not assertable.** A Runtime cannot simply claim compliance. Compliance must be demonstrated through observable behavior against a defined test suite.

---

## 1. Compliance Levels

ORION defines three compliance levels. Each level adds requirements to the previous.

```
┌──────────────────────────────────────────────────────────┐
│  ORION-Advanced  (requires all of Standard + RFC-0005)   │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ORION-Standard  (requires all of Basic + RFC-004) │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  ORION-Basic  (RFC-0001, RFC-0002, RFC-0003) │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 1.1 ORION-Basic

Minimum compliance. Suitable for single-task, resource-unconstrained environments.

**Required RFCs:** RFC-0001, RFC-0002, RFC-0003

**What it guarantees:**
- Tasks use the standard Object Model (all schemas from RFC-0001)
- All seven behavioral contracts are invoked in the correct lifecycle order
- Reflection is mandatory before terminal states
- The state machine invariants hold

**What it does NOT require:**
- Context budget tracking (N-4)
- Context efficiency metrics
- Overflow handling
- Parallel execution support

### 1.2 ORION-Standard

Full single-task compliance with explicit context management.

**Required RFCs:** RFC-0001, RFC-0002, RFC-0003, RFC-0004

**What it guarantees:**
- Everything in ORION-Basic
- Context budgets are declared before task execution
- Budget allocation is declared before each contract
- Actual consumption is tracked and reported
- Overflow policies are defined and executed
- Context efficiency metric is computed and included in ReflectionReport
- Observable context events are emitted

**Target audience:** Most production Cognitive Runtimes.

### 1.3 ORION-Advanced

Full compliance including multi-task scalability.

**Required RFCs:** RFC-0001 through RFC-0005

**What it guarantees:**
- Everything in ORION-Standard
- Parallel task execution with at minimum STRONG isolation
- Global Context Budget Pool management
- Priority-based scheduling
- Namespace conflict detection and resolution
- Scalability events emitted

**Target audience:** Runtimes serving multiple users or projects concurrently.

---

## 2. Compliance Claims

A Runtime MUST make compliance claims in this format:

```
ORION/<level>/<version>

Examples:
  ORION/Basic/1.0       — Complies with ORION-Basic requirements at version 1.0
  ORION/Standard/1.0    — Complies with ORION-Standard requirements at version 1.0
  ORION/Advanced/1.0    — Complies with ORION-Advanced requirements at version 1.0
```

**N6-R1:** A Runtime MUST NOT claim a compliance level if any normative requirement of that level is not satisfied.

**N6-R2:** A Runtime MUST NOT claim ORION-Standard compliance if it does not emit the context events defined in N4-R23.

**N6-R3:** A compliance claim MUST include the ORION version. A claim without a version is invalid.

---

## 3. The ORION Compliance Test Suite

The test suite is a set of observable scenarios that an external verifier can run against a Runtime to determine its compliance level. The Runtime's internal architecture is irrelevant — only observable outputs matter.

### 3.1 Test Methodology

```
For each test case:
1. Submit a defined Task to the Runtime
2. Observe the Task's state_history
3. Observe the outputs produced at each state
4. Compare against expected outputs (schemas, required fields, values)
5. Record PASS or FAIL
```

### 3.2 ORION-Basic Test Cases

**TC-Basic-01: Task Schema Validation**
```
Submit: Task with all required fields populated.
Expect: Runtime accepts the task without error.
Fail condition: Runtime rejects a valid task.
```

**TC-Basic-02: Task Schema Rejection**
```
Submit: Task with missing required field (e.g., no success_conditions).
Expect: Runtime rejects with a validation error.
Fail condition: Runtime accepts an incomplete task.
```

**TC-Basic-03: Contract Invocation Order**
```
Submit: Valid Task.
Expect: state_history shows transitions in order:
  PENDING → ANALYZING → PLANNING → BUILDING → VERIFYING → REFLECTING → DONE
Fail condition: Any state is skipped or occurs out of order.
```

**TC-Basic-04: Reflection on ESCALATED path**
```
Submit: Task where Analysis contract will fail.
Expect: state_history shows ESCALATED state. Reflection contract was invoked before terminal state.
Fail condition: Task reaches ESCALATED without a ReflectionReport.
```

**TC-Basic-05: QAReport completeness**
```
Submit: Task with 3 success_conditions.
Expect: QAReport.checks contains exactly 3 QACheck items, one per condition.
Fail condition: Any success_condition omitted from QAReport.
```

**TC-Basic-06: Max attempts enforcement**
```
Submit: Task with max_attempts = 2, where Verification will always FAIL.
Expect: After 2 VERIFYING→FIXING cycles, task transitions to ESCALATED.
Fail condition: Task exceeds max_attempts or transitions to ABORTED instead.
```

**TC-Basic-07: Fix scope enforcement**
```
Submit: Task where QAReport has fix_instructions targeting artifact "A" only.
Expect: FixResult.modified_artifacts contains only "A". Artifact "B" is unchanged.
Fail condition: Fix modifies artifacts not referenced in fix_instructions.
```

**TC-Basic-08: CapabilityID abstraction**
```
Submit: Task where required_capabilities would force a specific model name.
Expect: ExecutionPlan.capability_assignments uses abstract CapabilityIDs (not model names).
Fail condition: Any field in ExecutionPlan contains a specific model name or provider name.
```

### 3.3 ORION-Standard Test Cases (in addition to Basic)

**TC-Std-01: Budget declaration**
```
Submit: Task.
Expect: BUDGET_DECLARED event emitted before ANALYZING state.
Fail condition: No BUDGET_DECLARED event, or event emitted after ANALYZING begins.
```

**TC-Std-02: Budget allocation before contract**
```
Submit: Task.
Expect: ALLOCATION_SET event emitted before each contract invocation.
Fail condition: Contract invoked without preceding ALLOCATION_SET event.
```

**TC-Std-03: Consumption tracking**
```
Submit: Task.
Expect: CONSUMPTION_RECORDED event after each contract. Consumed tokens match BuildOutput.context_consumed (within 5% tolerance).
Fail condition: CONSUMPTION_RECORDED not emitted, or values are 0 when contracts clearly consumed tokens.
```

**TC-Std-04: Overflow handling**
```
Submit: Task with total_tokens = minimum viable, overflow_policy = ESCALATE.
Observe: Deliberately make context consumption exceed budget.
Expect: OVERFLOW_TRIGGERED event emitted. Task transitions to ESCALATED with remaining work described.
Fail condition: Task continues after budget exhaustion. Task transitions to ABORTED instead of ESCALATED.
```

**TC-Std-05: Budget sum invariant**
```
Submit: Task.
Expect: At no point does sum(ContextBudget.allocated) > total_tokens - reserved_output.
Fail condition: Allocation sum exceeds available budget.
```

**TC-Std-06: Minimum privilege**
```
Submit: Task at BUILDING state.
Instrument: Observe the ContextPackage sent to the Build contract.
Expect: ContextPackage contains only TASK_DEFINITION, PRIOR_OUTPUT, and CONSTRAINT items relevant to this step. No items from other steps are present.
Fail condition: ContextPackage contains items from unrelated steps or tasks.
```

**TC-Std-07: Efficiency metric**
```
Submit: Task that completes successfully.
Expect: ReflectionReport.context_efficiency is in range [0.0, 1.0].
Fail condition: Field absent, null, or outside valid range.
```

**TC-Std-08: Budget warning**
```
Submit: Task where cumulative consumption will exceed 80% of budget.
Expect: BUDGET_WARNING event emitted before 80% threshold is crossed.
Fail condition: No BUDGET_WARNING event.
```

### 3.4 ORION-Advanced Test Cases (in addition to Standard)

**TC-Adv-01: Parallel task isolation**
```
Submit: Two Tasks simultaneously with non-overlapping namespaces.
Expect: PARALLEL_EXECUTION_STARTED event with isolation_level = STRONG.
         Both tasks complete without cross-contamination of ContextPackages.
Fail condition: One task's context items appear in the other task's ContextPackage.
```

**TC-Adv-02: Namespace conflict detection**
```
Submit: Two Tasks with overlapping output_namespace.
Expect: NAMESPACE_CONFLICT event. One task receives a reassigned namespace.
Fail condition: Both tasks proceed with the same namespace (data corruption risk).
```

**TC-Adv-03: CRITICAL priority isolation**
```
Submit: CRITICAL priority task while two MEDIUM tasks are executing.
Expect: CRITICAL task executes without sharing resources with MEDIUM tasks.
Fail condition: CRITICAL task runs in parallel with MEDIUM tasks.
```

**TC-Adv-04: Priority starvation prevention**
```
Submit: HIGH priority task, then flood with MEDIUM tasks.
Expect: HIGH task completes within 3 task cycles. PRIORITY_ESCALATION event emitted if delayed.
Fail condition: HIGH task is indefinitely delayed by MEDIUM tasks.
```

**TC-Adv-05: Global budget pool tracking**
```
Submit: Multiple tasks. Observe CapacityReport.
Expect: global_budget_remaining + sum(allocated_to_tasks) ≈ global_total (within rounding).
Fail condition: Numbers don't add up. Budget is being created or destroyed.
```

**TC-Adv-06: Memory conflict resolution**
```
Submit: Two parallel tasks that both attempt to write to the same MemoryID.
Expect: MEMORY_CONFLICT_RESOLVED event. Higher-priority task's version persists. Lower-priority updates confidence via N2-R37.
Fail condition: Conflict results in data loss, or lower-priority task silently overwrites higher-priority task's memory.
```

---

## 4. The Alternative Implementation Test (AIT)

This test MUST be applied to every ORION RFC before it is finalized. It is the primary defense against Reference Implementation Bias.

### 4.1 Test Procedure

```
Step 1: Identify the normative requirement being evaluated.

Step 2: Design a hypothetical alternative implementation ("ATLAS") that uses a 
        completely different internal architecture than AIER:
        - ATLAS uses immutable state (no mutable objects)
        - ATLAS uses reactive/event-driven architecture (no explicit state machine)
        - ATLAS uses no named agents (tasks and contracts are pure functions)

Step 3: For each normative rule in the RFC, ask:
        "Can ATLAS satisfy this rule without mimicking AIER's internal structure?"

Step 4: If YES for all rules: the RFC is architecture-neutral. Proceed.

Step 5: If NO for any rule:
        a. Identify which aspect of ATLAS's architecture is incompatible
        b. Determine if the incompatibility is in the rule or in ATLAS's design
        c. If the rule forces a specific architecture: revise the rule to focus on 
           observable output rather than internal mechanism
        d. Re-run the AIT after revision
```

### 4.2 AIT Documentation Requirement

**N6-R4:** Every RFC that introduces new normative requirements MUST include an "Alternative Implementation Test" section documenting the result of applying this test to all new requirements.

**N6-R5:** An RFC with normative requirements that fail the AIT and are not revised MUST include a documented justification for why the implementation-specific requirement is necessary. Undocumented AIT failures are grounds for rejection of the RFC.

---

## 5. Self-Declaration vs Third-Party Certification

ORION v1.0 supports **self-declaration** of compliance only. Third-party certification processes are planned for ORION v2.0.

**Self-declaration process:**

```
1. Run all test cases for the claimed compliance level.
2. Document results: test ID, PASS/FAIL, evidence for each.
3. Publish compliance claim: "ORION/<level>/<version>"
4. Publish test results alongside the claim.
```

**N6-R6:** A compliance claim MUST be accompanied by a publicly accessible test report documenting the result of each test case. An undocumented compliance claim is not valid under ORION.

---

## 6. Compliance Versioning

**N6-R7:** A Runtime certified against ORION 1.0 MUST re-run the full test suite against ORION 1.1 (minor version). Minor versions may add new SHOULD requirements that become MUST in the next minor version.

**N6-R8:** A Runtime certified against ORION 1.x is NOT automatically compliant with ORION 2.0. Major versions may change Stable Core definitions, requiring re-certification.

---

*End of RFC-0006. This document, together with RFC-0001 through RFC-0005, constitutes the ORION Standard v1.0-draft.*
