# RFC-0004 — Context Economy Protocol
## ORION Standard | Tier N-4 | Stable Core

**Status:** Draft  
**Version:** 1.0.0-draft  
**Depends on:** RFC-0001 (Object Model), RFC-0003 (Lifecycle Protocol)  
**Required by:** RFC-0006 (Compliance)  

---

## Purpose

Context — measured in tokens — is the finite cognitive resource of any AI-based Cognitive Runtime. The Context Economy Protocol defines how ORION-compliant Runtimes MUST track, allocate, consume, and report this resource.

This RFC is the primary mechanism for achieving **token efficiency and scalability** in ORION. It treats context with the same rigor that operating systems treat RAM: every byte is accounted for, every allocation is declared, and exhaustion is handled explicitly, not silently.

**This is a new protocol not present in previous ORION drafts.** It addresses the critical problem of context waste — where Runtimes pass excessive information to contract invocations, degrading quality and increasing cost without measurable benefit.

---

## 1. The Context Economy Mental Model

```
ORION Context Economy ≈ OS Memory Management

Total Budget    ↔  Physical RAM
ContextPackage  ↔  Virtual address space for a process
Allocation      ↔  malloc()
Overflow Policy ↔  Out-of-memory handler
Efficiency      ↔  Memory utilization ratio
Context Router  ↔  Memory Management Unit (MMU)
```

A Runtime that does not track context is equivalent to an OS with no memory management: every process gets everything, collisions are unpredictable, and the system degrades under load.

---

## 2. Context Budget Lifecycle

The ContextBudget for a Task follows this lifecycle:

```
Task created
    │
    ▼
Budget DECLARED
  total_tokens set
  overflow_policy set
  allocation_strategy set
  all allocated/consumed = 0
    │
    ▼ (before PLANNING contract)
Budget ALLOCATED
  budget distributed across contracts
  sum(allocated) ≤ total - reserved_output
    │
    ▼ (during each contract invocation)
Budget CONSUMED
  consumed[contract_id] updated in real time
  checked against allocated[contract_id]
    │
    ▼ (when sum(consumed) approaches total)
Budget MONITORED
  Runtime checks remaining budget before each contract
    │
    ├──► budget sufficient: continue
    │
    └──► budget insufficient: execute overflow_policy
```

---

## 3. Budget Declaration

### 3.1 When Budget MUST be Declared

**N4-R1:** Every Task MUST have a `ContextBudget` with all required fields populated before the task transitions from `PENDING` to `ANALYZING`.

**N4-R2:** A Runtime MUST NOT accept a Task with `context_budget.total_tokens = 0`.

### 3.2 Minimum Required Budget

**N4-R3:** The `total_tokens` MUST be sufficient for at minimum:
- One Analysis contract invocation
- One Planning contract invocation
- One Verification contract invocation
- One Reflection contract invocation
- The `reserved_output`

If the available budget is below this minimum, the Runtime MUST reject the task and report the required minimum.

### 3.3 Reserved Output

**N4-R4:** `reserved_output` MUST be excluded from all contract allocations. It is reserved exclusively for the final output produced at task completion.

**N4-R5:** `reserved_output` MUST NOT be used for any contract invocation, including the Memory contract.

---

## 4. Budget Allocation

### 4.1 Allocation Strategies

ORION defines four allocation strategies. A Runtime MUST implement at least `PROPORTIONAL` and `ADAPTIVE`.

#### PROPORTIONAL (REQUIRED)

```
allocation[contract] = 
  (complexity_weight[contract] / sum(complexity_weights)) 
  × available_budget

where available_budget = total_tokens - reserved_output
```

`complexity_weight` is derived from the `estimated_complexity` in the AnalysisOutput:
- TRIVIAL → 1.0
- LOW → 1.5
- MEDIUM → 2.5
- HIGH → 4.0
- CRITICAL → 6.0

For the Planning phase (before AnalysisOutput exists): Use EQUAL strategy.

#### EQUAL

```
allocation[contract] = available_budget / contract_count
```

Simple but inefficient. Permitted for Planning phase when complexity is unknown.

#### PRIORITY_FIRST

```
Sort contracts by estimated complexity (CRITICAL first).
Allocate to highest complexity first until budget is consumed.
```

SHOULD only be used when some contracts are genuinely optional.

#### ADAPTIVE (REQUIRED)

```
For each contract:
  historical_consumption = avg(consumed[contract] for last N similar tasks)
  if historical_consumption exists:
    allocation[contract] = historical_consumption × safety_factor  (default 1.2)
  else:
    allocation[contract] = PROPORTIONAL allocation
```

**N4-R6:** When using ADAPTIVE, the `safety_factor` MUST be ≥ 1.0. A safety_factor < 1.0 guarantees overflow and is a protocol violation.

### 4.2 Allocation Rules

**N4-R7:** The sum of all `ContextBudget.allocated` values MUST NOT exceed `total_tokens - reserved_output` at the time of allocation.

**N4-R8:** Allocations MUST be declared before the corresponding contract is invoked. A Runtime MUST NOT invoke a contract without a declared allocation.

**N4-R9:** Allocations MAY be revised between contract invocations (not during). Revision MUST still satisfy N4-R7.

---

## 5. ContextPackage Assembly

The ContextPackage is what a Runtime assembles and sends to each contract. It MUST respect the Minimum Privilege principle.

### 5.1 The Minimum Privilege Principle

**N4-R10 (Minimum Privilege):** A Runtime MUST NOT include in a ContextPackage any content not required by the recipient contract's declared inputs. Every item in the ContextPackage MUST be traceable to a declared input field of the contract.

**Why this matters:** Excessive context causes:
1. **Quality degradation** — models attend to irrelevant information, producing lower-quality outputs
2. **Cost inflation** — tokens are billed regardless of usefulness
3. **Scalability failure** — context windows fill with noise, leaving less room for actual work

### 5.2 ContextPackage Assembly Algorithm

For each contract invocation, the Runtime MUST:

```
Step 1: Identify required inputs for this contract (from RFC-0002)
Step 2: For each required input:
    a. Retrieve from task state or memory
    b. Estimate token count
    c. Assign relevance_score (0.0 to 1.0)
Step 3: Sort items by relevance_score (descending)
Step 4: Include items until allocated_budget is reached
Step 5: If required items would exceed allocated_budget:
    a. Check if they fit within total remaining budget
    b. If yes: reallocate from lower-priority contracts
    c. If no: execute overflow_policy
Step 6: Produce ContextPackage with included items
```

**N4-R11:** If a required input must be truncated to fit the budget, the Runtime MUST include a truncation notice in the ContextPackage metadata indicating which inputs were truncated and by how much.

### 5.3 Content Priority Order

When budget requires prioritization, content MUST be included in this order:

1. **TASK_DEFINITION** — Always included first. The contract cannot operate without knowing what the task is.
2. **PRIOR_OUTPUT** — Outputs from immediately preceding contracts in the same task.
3. **CONSTRAINT** — Architectural rules, quality standards, restrictions.
4. **KNOWLEDGE** — Retrieved memory records, sorted by relevance_score.
5. **EXAMPLE** — Historical patterns, included only if budget permits.

**N4-R12:** TASK_DEFINITION items MUST NEVER be excluded from a ContextPackage due to budget constraints. If the Task definition alone exceeds the budget, the Runtime MUST execute the overflow_policy before proceeding.

---

## 6. Real-Time Consumption Tracking

### 6.1 Consumption Update Protocol

**N4-R13:** After each contract invocation completes, the Runtime MUST update `ContextBudget.consumed[contract_id]` with the actual tokens consumed.

**N4-R14:** The Runtime MUST check remaining budget before each contract invocation, not just at allocation time. Budget checks at allocation time are insufficient because allocations are estimates; consumption is reality.

```
before each contract invocation:
  remaining = total_tokens - reserved_output - sum(consumed.values())
  if remaining < minimum_for_contract:
    execute overflow_policy
  else:
    proceed with invocation
```

**N4-R15:** `minimum_for_contract` is the minimum token count required for a contract to produce any valid output. This value is implementation-specific but MUST be declared by the Runtime.

### 6.2 Budget Warning Threshold

**N4-R16:** When `sum(consumed.values()) ≥ 0.8 × (total_tokens - reserved_output)`, the Runtime MUST emit a `BUDGET_WARNING` event in the Task's state history.

This gives implementations the opportunity to:
- Switch to more efficient prompting strategies
- Skip optional context items
- Trigger early compression

---

## 7. Overflow Handling

When `sum(consumed) ≥ total_tokens - reserved_output`, or when the pre-invocation check determines insufficient budget, the Runtime MUST execute the `ContextBudget.overflow_policy`.

### 7.1 SUSPEND Policy

```
Action:
1. Record current state with full context (what was completed, what remains)
2. Emit TASK_SUSPENDED event
3. Preserve all produced outputs
4. Await user input:
   - Option A: Provide additional budget → resume
   - Option B: Accept partial results → transition to DONE (with incomplete flag)
   - Option C: Abort → transition to ABORTED
```

**N4-R17:** SUSPEND MUST preserve all outputs produced before suspension. A resumed task MUST NOT re-execute already-completed contracts.

### 7.2 COMPRESS Policy

```
Action:
1. Identify MemoryRecords and ContextItems with low relevance_score
2. Summarize or evict them
3. Estimate token savings
4. If savings ≥ minimum_for_next_contract: continue
5. If savings < minimum_for_next_contract: downgrade to ESCALATE policy
```

**N4-R18:** Compression MUST NOT remove PRIOR_OUTPUT items from the current task. Compression targets KNOWLEDGE and EXAMPLE items only.

**N4-R19:** After compression, the Runtime MUST re-run the ContextPackage assembly for the next contract with the compressed content.

### 7.3 ESCALATE Policy

```
Action:
1. Produce a structured report:
   - What was completed (list of completed contracts)
   - What remains (list of pending contracts)
   - Why budget was exhausted (budget consumption breakdown)
   - Recommendation (increase budget by X tokens to complete)
2. Transition task to ESCALATED
3. Invoke Reflection contract with available budget
```

### 7.4 ABORT Policy

```
Action:
1. Immediately halt current contract
2. Record abort reason in state_history
3. Attempt Reflection contract with reserved_output budget only
4. Transition to ABORTED
```

---

## 8. Context Efficiency Metric

### 8.1 Definition

**N4-R20:** Every ORION-compliant Runtime MUST compute and expose a `context_efficiency` metric for each completed task. This metric MUST be included in the ReflectionReport (N2-R33).

```
context_efficiency = tokens_in_useful_outputs / total_tokens_consumed

where:
  tokens_in_useful_outputs:
    The sum of tokens consumed by contract invocations that contributed to 
    at least one PASS verdict in any QAReport for this task.
    
  total_tokens_consumed:
    The sum of all context_consumed values across all contract invocations.
```

### 8.2 Interpretation

| Efficiency Range | Interpretation |
|---|---|
| 0.85 – 1.00 | Excellent. Minimal waste. Most context contributed to success. |
| 0.65 – 0.84 | Good. Some rework occurred but overall efficient. |
| 0.45 – 0.64 | Acceptable. Significant rework or inefficient allocation. |
| 0.25 – 0.44 | Poor. Most context was spent on failed attempts or excessive context. |
| 0.00 – 0.24 | Critical. Task should be reviewed for systemic allocation problems. |

### 8.3 Efficiency Trend Requirement

**N4-R21:** A Runtime MUST track `context_efficiency` across tasks and MUST expose an aggregate trend (rolling average over last N tasks) accessible to the Reflection contract and, if implemented, an Evolution mechanism.

**N4-R22:** If the rolling average `context_efficiency` falls below 0.45 for 5 consecutive tasks of the same type, the Runtime SHOULD emit a `LOW_EFFICIENCY_ALERT` and SHOULD propose allocation strategy adjustments.

---

## 9. Observable Context Events

For compliance verification, a Runtime MUST emit the following observable events:

| Event | When emitted | Required fields |
|---|---|---|
| `BUDGET_DECLARED` | Task enters PENDING | task_id, total_tokens, overflow_policy, strategy |
| `ALLOCATION_SET` | Before each contract | task_id, contract_id, allocated_tokens |
| `CONSUMPTION_RECORDED` | After each contract | task_id, contract_id, consumed_tokens, remaining_budget |
| `BUDGET_WARNING` | At 80% consumption | task_id, consumed, remaining |
| `OVERFLOW_TRIGGERED` | Budget exhausted | task_id, policy_executed, state_at_overflow |
| `EFFICIENCY_COMPUTED` | At REFLECTING state | task_id, context_efficiency |

**N4-R23:** These events MUST be accessible from outside the Runtime for compliance verification. The format and transport mechanism are implementation-specific, but the events MUST be observable.

**N4-R24 (Measurement honesty):** A Runtime operating with `measurement_mode = ESTIMATED` or `UNAVAILABLE` (RFC-0001 §3.3) MUST declare that mode in its `BUDGET_DECLARED` event and MUST NOT present estimated or absent values as measured. In `UNAVAILABLE` mode, the token-denominated requirements of this RFC are satisfied by declaring the mode and using the Runtime's real cost levers (e.g. model-tier selection per task difficulty) in place of token allocation; fabricating token figures to appear compliant is a protocol violation.

---

## 10. Alternative Implementation Test

**Question:** Does the Context Economy Protocol force a specific internal architecture?

**Test: Runtime with no internal token counter (treats context as unlimited)**
- Can it comply? ❌ No. N4-R1 through N4-R6 require explicit budget tracking.
- This is intentional. A Runtime that does not track context is not ORION-compliant at the Standard level.
- It may be ORION-Basic compliant if Basic level does not require N-4 (see RFC-0006).

**Test: Runtime using a different unit of measurement (e.g., characters instead of tokens)**
- Can it comply? ✅ Conditionally. The Runtime MUST translate to tokens for ORION reporting purposes. The internal unit is implementation-specific.

**Test: ATLAS Runtime (functional, immutable state)**
- ContextBudget as immutable record, new versions created with each update.
- Events emitted as immutable log entries.
- Can it comply? ✅ Yes. The protocol requires tracking and events; it does not require mutable state.

**Test: TITAN Runtime (distributed)**
- Budget tracked centrally; events aggregated from distributed nodes.
- Can it comply? ✅ Yes, with the constraint that the global budget is coherently maintained.

**Result:** The Context Economy Protocol is architecture-neutral. It requires behavior (tracking, allocation, overflow handling, efficiency reporting), not internal structure.

---

*End of RFC-0004. See RFC-0005 for the Scalability Protocol, which extends the Context Economy to parallel task execution.*
