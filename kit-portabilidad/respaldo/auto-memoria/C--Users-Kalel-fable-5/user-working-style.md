---
name: user-working-style
description: "How this user works and what they expect from sessions (language, autonomy, token economy)"
metadata: 
  node_type: memory
  type: user
  originSessionId: f3699fee-0513-4610-99a0-57a1ad6dfb83
---

- Speaks Spanish; write responses in Spanish (code/docs in English is fine — the ORION spec itself is in English).
- Owner/architect of the ORION standard; treats Claude as the Cognitive Runtime executing it ("Chief AI Systems Architect" role in older memories).
- Expects **autonomous end-to-end execution**: broad directives ("quiero que todo funcione de forma autónoma"), no per-step approval for reversible local work; asking permission mid-task reads as failure.
- Priorities, in order: works well and learns > minimal token spend per task (model-tier per difficulty is the accepted cost lever, Opus ceiling) > speed.
- Wants everything verified, not asserted — run the validator/tests and show results ([[orion-ecosystem-map]] has the commands).

**Why:** stated repeatedly across sessions, incl. 2026-07-02 ("que se consuma la menor cantidad de tokens posibles por tarea, y que igualmente trabaje muy bien y aprenda").
**How to apply:** default to acting, batch work, delegate to the ORION phase agents with compact briefs, close every substantial session by persisting to ORION project memory.
