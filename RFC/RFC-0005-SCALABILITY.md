# RFC-0005 — Scalability Protocol
## ORION Standard | Tier C-3 | Evolutionary Body

**Status:** Draft  
**Version:** 1.0.0-draft  
**Depends on:** RFC-0001, RFC-0002, RFC-0003, RFC-0004  
**Required for:** ORION-Advanced compliance level  

---

## Purpose

This RFC defines how ORION-compliant Runtimes handle multiple concurrent Tasks, resource competition, and distributed execution. It extends the single-task model of RFC-0003 to multi-task environments without breaking the invariants of the Lifecycle and Context Economy protocols.

This RFC is **Tier C-3** (Evolutionary Body), not Stable Core. Its requirements may evolve with minor versions as distributed AI architectures mature.

---

## 1. Concurrency Model

ORION uses a **conservative concurrency model**: parallel execution is permitted but must be explicitly safe. A Runtime that executes tasks in parallel without meeting the safety conditions is not ORION-compliant at the Advanced level.

### 1.1 Task Isolation Principle

**N5-R1:** When a Runtime executes multiple Tasks concurrently, each Task MUST have an independent `ContextBudget`. Cross-task budget sharing is not permitted.

**Rationale:** Shared budgets create unpredictable resource contention. One task's context explosion must not abort an unrelated task.

### 1.2 Artifact Namespace Isolation

**N5-R2:** Concurrent Tasks MUST have non-overlapping `output_namespace` values across all their `ExecutionStep` definitions. If two concurrent Tasks declare the same output namespace, the Runtime MUST either:
- Reject one task with a namespace conflict error, OR
- Assign different namespaces automatically and record the reassignment in state_history.

---

## 2. Parallelism Conditions

A Runtime MAY execute two or more Tasks in parallel if and only if ALL of the following conditions are met:

**N5-R3 — No explicit dependency:** Neither task declares a dependency on the other's outputs.

**N5-R4 — Namespace isolation:** The tasks have no overlapping `output_namespace` values (N5-R2 satisfied).

**N5-R5 — Aggregate budget sufficient:** The combined `total_tokens` of all parallel tasks does not exceed the total available token budget for the Runtime at that moment.

**N5-R6 — Priority constraint:** No task in the parallel group has `priority = CRITICAL`. Critical tasks MUST execute in isolation.

**N5-R7 — Isolation level achievable:** The Runtime can provide at minimum `STRONG` isolation (defined in §3) for all tasks in the parallel group.

If any condition is not met, the Runtime MUST execute tasks sequentially in priority order.

---

## 3. Isolation Levels

ORION defines three isolation levels. Runtimes declaring ORION-Advanced compliance MUST support `STRONG` isolation.

### 3.1 STRICT

Complete isolation. No shared resources whatsoever.

```
Properties:
- Separate ContextBudget (enforced by N5-R1)
- Separate ContextPackage assembly (no cross-task context items)
- Read-only access to PERMANENT memory only (no shared PROJECT memory)
- No observable interference between tasks
- Separate event streams

When to use: Tasks involving sensitive data, conflicting architectural decisions,
             or when one task's output could mislead another task's reasoning.
```

### 3.2 STRONG (Minimum for ORION-Advanced)

Strong isolation with shared read-only access to persistent memory.

```
Properties:
- Separate ContextBudget (enforced by N5-R1)
- Separate ContextPackage assembly
- Read-only access to PERMANENT and PROJECT memory
- Writes to memory are queued; conflicts resolved after both tasks complete
- Separate event streams

When to use: Standard parallel execution. Most concurrent task pairs should use this.
```

**N5-R8:** When using STRONG isolation, if two parallel tasks attempt to write conflicting MemoryRecords (same `MemoryID` with different content), the Runtime MUST:
1. Invoke the Memory contract for the higher-priority task first.
2. Present the conflict to the lower-priority task's Memory contract as an existing record.
3. The lower-priority task's Memory contract resolves the conflict per N2-R37 (confidence update).

### 3.3 WEAK

Shared context budget pool. Not recommended.

```
Properties:
- Shared ContextBudget pool with per-task allocations
- Risk of one task's overflow triggering another task's overflow policy
- NOT recommended for production use
- Only permitted when explicitly configured by the user

Note: A Runtime using WEAK isolation MUST log a warning in each task's state_history:
"WEAK isolation active. This task shares a context budget pool with concurrent tasks."
```

**N5-R9:** A Runtime MUST NOT use WEAK isolation by default. WEAK isolation requires explicit user configuration.

---

## 4. Priority Protocol

When tasks compete for execution resources, the Runtime MUST resolve contention using this protocol.

### 4.1 Priority Queue Rules

**N5-R10:** A Runtime MUST maintain tasks in a priority-ordered queue. When a resource becomes available, the highest-priority pending task MUST be selected first.

**N5-R11:** Within the same priority level, FIFO ordering MUST be used. Two tasks with the same priority MUST be processed in the order they were submitted.

### 4.2 Priority Scheduling Rules

| Priority | Scheduling rule |
|---|---|
| CRITICAL | MUST run immediately. Preempts MEDIUM and LOW tasks that have not yet invoked a contract. Cannot be preempted by other tasks. |
| HIGH | SHOULD start within one task cycle. MUST NOT be delayed more than 3 task cycles waiting for resources. |
| MEDIUM | Normal scheduling. MAY run in parallel with other MEDIUM tasks (if N5-R3 through N5-R7 are met). |
| LOW | Background scheduling. MAY be delayed indefinitely to accommodate higher-priority tasks. |

**N5-R12:** A LOW priority task that has been waiting for more than N task cycles (implementation-defined N) MUST have its priority temporarily elevated to MEDIUM to prevent starvation.

### 4.3 Priority Inversion Prevention

**N5-R13:** If a HIGH or CRITICAL task depends on a resource held by a MEDIUM or LOW task, the Runtime MUST temporarily elevate the lower-priority task's effective scheduling priority to match the waiting task. The task's declared priority is not changed; only its scheduling priority for resource contention resolution.

---

## 5. Context Budget in Multi-Task Environments

The Context Economy Protocol (RFC-0004) applies per-task. This section defines how budgets interact at the Runtime level.

### 5.1 Global Budget Pool

**N5-R14:** A Runtime executing multiple tasks MUST maintain a Global Context Budget Pool — the total tokens available to the Runtime at any point.

```
Global Context Budget Pool:
  global_total:      Tokens   // Total tokens available to this Runtime instance
  allocated_to_tasks: Map<TaskID, Tokens>  // Per-task total_tokens
  remaining:         Tokens   // global_total - sum(allocated_to_tasks.values())
```

**N5-R15:** `sum(allocated_to_tasks.values())` MUST NOT exceed `global_total`.

### 5.2 Dynamic Budget Allocation

**N5-R16:** When a new task is submitted, the Runtime MUST check whether sufficient budget is available in the Global Pool before accepting the task.

**N5-R17:** If the Global Pool has insufficient budget to accommodate a new task's requested `total_tokens`, the Runtime MUST:
- Queue the task in PENDING state, OR
- Reject the task with a `BUDGET_UNAVAILABLE` error

The Runtime MUST NOT reduce another task's budget to accommodate a new task.

### 5.3 Budget Reclamation

**N5-R18:** When a task reaches a terminal state (DONE, ESCALATED, ABORTED), the Runtime MUST return the task's `total_tokens` to the Global Pool, minus the actual consumed tokens.

```
returned_to_pool = allocated_to_tasks[task_id] - sum(task.context_budget.consumed.values())
```

This ensures unused budget from completed tasks is available for future tasks.

---

## 6. Scalability Events

In multi-task environments, the Runtime MUST emit these additional observable events:

| Event | When emitted | Required fields |
|---|---|---|
| `PARALLEL_EXECUTION_STARTED` | When ≥2 tasks begin executing concurrently | task_ids, isolation_level |
| `PRIORITY_ESCALATION` | When starvation prevention elevates a task | task_id, old_priority, new_effective_priority |
| `NAMESPACE_CONFLICT` | When two tasks declare same namespace | task_ids, conflicting_namespace, resolution |
| `GLOBAL_BUDGET_WARNING` | When global pool < 20% remaining | remaining_tokens, active_task_count |
| `TASK_QUEUED_NO_BUDGET` | When task queued due to insufficient pool | task_id, required, available |
| `MEMORY_CONFLICT_RESOLVED` | When parallel tasks write conflicting records | task_ids, record_id, resolution_strategy |

---

## 7. Scalability Limits

ORION does not define hard limits on:
- Maximum concurrent tasks
- Maximum task queue depth
- Maximum Global Pool size

These are implementation decisions. However, the Runtime MUST:

**N5-R19:** Expose current capacity metrics as observable data:
```
CapacityReport {
  active_tasks:      Integer
  queued_tasks:      Integer  
  global_budget_total: Tokens
  global_budget_remaining: Tokens
  global_utilization: Float  // remaining / total, range [0.0, 1.0]
}
```

**N5-R20:** When `global_utilization < 0.1` (less than 10% budget remaining), the Runtime SHOULD emit `GLOBAL_BUDGET_WARNING` and SHOULD NOT accept new non-CRITICAL tasks until utilization improves.

---

## 8. Alternative Implementation Test

**Test: Single-threaded Runtime with no parallelism**
- Can it claim ORION-Advanced compliance? ❌ No. ORION-Advanced requires parallel execution support.
- Can it claim ORION-Standard compliance? ✅ Yes. RFC-0005 is only required for ORION-Advanced.

**Test: Microservices Runtime (each contract runs as a separate service)**
- Can it comply with RFC-0005? ✅ Yes. The isolation, budget, and event requirements apply regardless of deployment topology.
- The `STRONG` isolation requirement is naturally met if each task runs in its own service instance.

**Test: GPU-accelerated Runtime running hundreds of tasks in parallel**
- Can it comply? ✅ Yes, if it tracks the Global Budget Pool and emits required events.
- The parallelism conditions (N5-R3 through N5-R7) apply regardless of execution hardware.

**Result:** The Scalability Protocol is architecture-neutral. It defines conditions and guarantees, not implementation topology.

---

*End of RFC-0005. See RFC-0006 for the Compliance Protocol, which defines how to certify that a Runtime satisfies ORION requirements.*
