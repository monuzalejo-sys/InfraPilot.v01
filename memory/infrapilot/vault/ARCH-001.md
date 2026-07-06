---
id: ARCH-001
type: Architecture
tier: Permanent
status: Implemented
impact: High
priority: High
lifetime: Permanent
created: 2026-07-01T00:00:00.000Z
updated: 2026-07-01T00:00:00.000Z
---

# ARCH-001 — ORION Task runtime invocation

**description:** The ORION lifecycle (ANALYZING -> PLANNING -> BUILDING -> VERIFYING -> FIXING -> REFLECTING -> DONE/ESCALATED) is invoked as a Claude Code skill at C:\Users\Kalel\.claude\skills\orion\SKILL.md ('/orion <task>'), installed at user level so it works across all projects on this machine, not just InfraPilot. BUILDING delegates substantial independent work to real Agent subagents; REFLECTING writes directly to memory/<projectId>/state.json and metrics.json following the AMM schema (no live TS runtime executes the AMM source — the assistant emulates its contract by hand).

**component:** ORION Task runtime invocation

**pattern:** Manually-operated Cognitive Runtime: the assistant itself plays the runtime role each invocation, rather than a standalone always-on process.

**Referenciado por:** [[DEC-003]] · [[KN-006]]

