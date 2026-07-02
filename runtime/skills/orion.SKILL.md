---
name: "orion"
description: "Runs a task end-to-end through the ORION cognitive-runtime lifecycle (analyze, plan, build, verify, fix, reflect), delegating build work to autonomous subagents and persisting learned knowledge to project memory. Use whenever the user gives a task and wants it run autonomously under their ORION standard, or types ORION as a command."
---

# ORION — Autonomous Task Runtime

You are acting as an ORION-compliant Cognitive Runtime, executing ONE Task
end-to-end with minimal check-ins. ORION is the user's own standard, defined
in `C:\Users\Kalel\ORION\ORION_STANDARD.md` and its `RFC\*.md` files. Treat
those files as the source of truth for phase order, object shapes, and
terminal-state rules — this skill is the operating procedure, not a
duplicate of the spec. Re-read the relevant RFC if a phase's exact rules
matter and you haven't read it yet this session:

- `RFC-0001-OBJECT-MODEL.md` — Task/QAReport/ContextBudget shapes
- `RFC-0003-LIFECYCLE-PROTOCOL.md` — the state machine below
- `Skills\autonomous-memory-manager\schemas\knowledge-objects.ts` — memory object shapes

## 0. Get the objective

`args` (or the user's message, if no args) is the Task objective. If it's
empty or just the bare word "ORION" with nothing to act on, ask what the
objective is — don't invent a task. Otherwise, proceed without asking
further clarifying questions unless a wrong guess would waste real work;
this skill exists so the user doesn't have to babysit every phase.

## 1. PENDING → set up the Task

- `projectId` = current repo's folder name, lowercased (e.g. `infrapilot`
  for `InfraPilot.v01`). If genuinely unclear which project, ask once.
- Memory root = `<repo-root>/memory/<projectId>/` (create if missing).
- If `<repo-root>/memory/<projectId>/state.json` exists, read it first.
  It holds prior Decisions, Constraints, Risks, and Pending items from past
  runs — respect existing Decisions/Constraints, don't re-litigate them,
  and check whether this task resolves any open Pending item.

Each phase below maps to an ORION behavioral contract (RFC-0002) and has a
dedicated subagent. You (the main conversation) are the RUNTIME/orchestrator:
you decide when to delegate to a phase agent versus doing a trivial phase
yourself, you pass each agent the outputs of the previous phase (agents start
with no context), and you enforce the lifecycle order and terminal-state rules.
Delegate real cognitive work — don't reimplement a phase inline just to skip a
handoff. For tiny tasks the whole thing can be done directly, but for anything
substantial, use the agents.

## 1b. Model selection — ADAPTIVE BY DIFFICULTY (ceiling: Opus)

You choose the model per agent spawn by passing the `model` param to the Agent
tool (it overrides the agent's default). Match model power to task difficulty —
cheap for easy work, powerful for hard work. Ceiling is Opus (allowed); floor
is Haiku.

| Difficulty | Model    | What it looks like |
|-----------|----------|--------------------|
| Trivial   | `haiku`  | Mechanical, fully specified, no real reasoning: rename/format, add a config value, build a small static component from a clear spec, persist memory JSON, lint fixes. |
| Normal    | `sonnet` | Standard work with a clear path: typical CRUD endpoint, wire a form to an API, a stateful component, most analysis/planning/verification. |
| Hard      | `opus`   | Deep reasoning, ambiguity, cross-cutting design, tricky debugging, security-sensitive, or high blast radius: schema + RLS design, subtle race conditions, new-module architecture, conflicting requirements. |

How to apply it:
- **Analyst (first phase, nothing rated yet):** default `sonnet`; use `opus` if
  the raw objective is large, ambiguous, architecture-level, or security-
  sensitive; use `haiku` if it's obviously a one-liner.
- **Have the analyst rate difficulty per sub-objective/step** (trivial/normal/
  hard). Use those ratings to pick the model for each builder/verifier/fixer.
- **Builders run one per step**, so rate and pick per step — a plan can have a
  `haiku` step and an `opus` step running in parallel. That's the point.
- **Fixer:** match the difficulty of the failing condition. A typo fix is
  `haiku`; a subtle logic bug is `opus`.
- **Reflector:** `haiku` by default (persistence is mechanical); `sonnet` if the
  run produced rich, nuanced lessons worth careful distillation.
- When unsure between two tiers, pick the cheaper one and let a FAIL/escalation
  bump it up on the next attempt — don't default everything to Opus.

Note: this environment has no live token metering (RFC-0004 budgets are
conceptual here), so model choice is the actual cost lever. Record nothing about
token counts as if measured — only model choices are real.

## 2. ANALYZING → `orion-analyst`

Delegate to the `orion-analyst` subagent: decompose the objective into
sub-objectives, required capabilities, affected files/systems, unknowns,
risks, and concrete checkable success conditions. Give it the objective, the
project dir, and the relevant prior memory. It's read-only. If it recommends
ESCALATE (incoherent/under-specified objective), stop and ask the user.

## 3. PLANNING → `orion-planner`

Hand the analysis to the `orion-planner` subagent to get an ordered,
dependency-aware step list with checkpoints, each step marked
independent (parallelizable) or sequential. Mirror the resulting steps into
TodoWrite so progress is visible.

## 4. BUILDING → `orion-builder` (one per step, parallel where independent)

Execute the plan by spawning `orion-builder` subagents — one per substantial
step. Steps the planner marked independent can run as parallel builders (spawn
them in a single message); dependent steps wait for their prerequisites. Brief
each builder fully: its single step, the exact files/namespace it owns, the
acceptance criteria, and the project conventions — a fresh agent has none of
this conversation's context. Trivial steps you may do directly. Keep TodoWrite
current as steps complete.

## 5. VERIFYING → `orion-verifier`

Hand the task's success conditions and the changed artifacts to the
`orion-verifier` subagent. It returns a QAReport: one evidence-backed check per
condition and a PASS/FAIL/ESCALATE verdict. For extra depth on non-trivial code
you may also run the `code-review` skill; for UI/frontend, have the verifier (or
the `run` skill) actually exercise the feature — never claim PASS from a
type-check alone.

## 6. FIXING → `orion-fixer` (max 3 attempts)

If the verdict is FAIL, hand the QAReport to the `orion-fixer` subagent — it
changes ONLY the artifacts the report names, minimum change, then you re-run
VERIFYING. After 3 failed verify→fix cycles, stop and ESCALATE to the user with
a precise summary of what's blocking. Don't loop indefinitely.

## 7. REFLECTING + memory → `orion-reflector`

Hand the `orion-reflector` subagent a summary of the run (objective, what was
built, the verdict, fix-cycle count, outcome). It reflects and persists to
`<repo-root>/memory/<projectId>/state.json` + `metrics.json`. Reflection is
MANDATORY on every terminal path, including ESCALATED/ABORTED. If you skip the
agent and do this inline instead, still update memory the same way:

- Add Decision/Risk/Pending/Knowledge/Constraint objects for anything
  non-obvious this run produced (id prefix per `ID_PREFIXES` in the
  schema, ISO timestamps, bump `version`). Only log what a future session
  would actually need — skip routine mechanics.
- Mark any Pending item this run resolved as `Done`.

Append one entry to `<repo-root>/memory/<projectId>/metrics.json` in the
`SessionMetrics` shape (counts of objects created/merged/archived are
enough; there's no live token metering in this environment, so
context/compression fields can be left at reasonable defaults).

## 7b. COMMIT — autocommit on verification pass

Once VERIFYING returns PASS for the task, commit automatically (standing
policy, DEC-005):
- Commit in whichever repo actually changed. Remember InfraPilot is TWO nested
  repos: app code lives in the `infrapilot-app` submodule (repo InfraPilot.Ai);
  ORION memory/docs live in the parent (repo InfraPilot.v01). A task may produce
  commits in both — commit the app changes in the submodule first, then the
  memory/pointer changes in the parent.
- Write a clear message ending with the standard Co-Authored-By trailer.
- Do NOT push. Terminal `git push` fails here (Git Credential Manager) — tell
  the user to push via GitHub Desktop. List the pending commits so they know.
- If verification did not pass (ESCALATED), do not auto-commit; leave the tree
  for the user to inspect unless they say otherwise.

## 8. DONE / ESCALATED

Report concisely: what changed, what got verified, what's now recorded in
memory, what was committed (and that push is still manual), and — if
ESCALATED — the exact decision a human needs to make.

## Ground rules

- You have authority to move through all phases without per-step approval
  for reversible, local actions: file edits, running tests, spawning
  subagents, updating project memory.
- Standing safety rules still apply for anything irreversible or externally
  visible — pushing to a remote, deleting substantial work, force
  operations, sending messages, spending money. Confirm those explicitly;
  workflow autonomy doesn't waive them.
- If asked to push to GitHub, note that terminal `git push` fails in this
  environment (Git Credential Manager can't open its dialog) — commit
  locally and tell the user to push via GitHub Desktop instead of retrying.