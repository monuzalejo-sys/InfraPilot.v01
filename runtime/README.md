# ORION Runtime — Claude Code operationalization

This directory version-controls how the ORION standard is actually *run* on
this machine via Claude Code. These files are **copies for the repo**; the
**operative** copies (the ones Claude Code loads) live outside the repo at:

- Skill:  `~/.claude/skills/orion/SKILL.md`  → invoked as `/orion <task>`
- Agents: `~/.claude/agents/orion-*.md`      → spawned by the skill per phase

If you edit a file here, mirror the change to the operative location (and
vice-versa), then restart Claude Code — skills and agents are loaded at
session start, so new/edited definitions only take effect after a restart.

## The runtime model

The main Claude Code conversation acts as the ORION **Runtime / orchestrator**.
Each lifecycle phase (RFC-0003) maps to one behavioral contract (RFC-0002) and
one dedicated subagent:

| Phase       | Contract                | Agent            | Tools |
|-------------|-------------------------|------------------|-------|
| ANALYZING   | orion:analysis:v1       | orion-analyst    | read-only |
| PLANNING    | orion:planning:v1       | orion-planner    | read-only |
| BUILDING    | orion:build:v1          | orion-builder    | full (1 per step, parallel where independent) |
| VERIFYING   | orion:verification:v1   | orion-verifier   | read + run tests (no edits) |
| FIXING      | orion:fix:v1            | orion-fixer      | edits only the artifacts a QAReport names |
| REFLECTING  | orion:reflection:v1 + orion:memory:v1 | orion-reflector | writes memory/*.json |

Reflection/memory is persisted under `../memory/<projectId>/state.json` and
`metrics.json` following the AMM knowledge-object schema
(`../Skills/autonomous-memory-manager/schemas/`).

Note: there is no always-on daemon. The system runs when `/orion` is invoked in
a conversation; the orchestrator plays the runtime role for that task.
