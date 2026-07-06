---
id: PEND-013
type: Pending
tier: Project
status: Blocked
impact: Medium
priority: Medium
lifetime: Sprint
created: 2026-07-05T00:00:00.000Z
updated: 2026-07-05T00:00:00.000Z
---

# PEND-013 — Test /api/lector end-to-end once the user sets a real GROQ_API_KEY in .env.local

**reason:** Blocked on the user providing a real Groq API key; code path exists and degrades gracefully but is unverified live.

**task:** Test /api/lector end-to-end once the user sets a real GROQ_API_KEY in .env.local (currently empty, so the AI parsing path has never been exercised live, only its degraded no-key fallback).

**Depende de:** [[KN-015]]

