---
id: PEND-017
type: Pending
tier: Project
status: Ready
impact: Low
priority: Low
lifetime: Sprint
created: 2026-07-28T00:00:00.000Z
updated: 2026-07-28T00:00:00.000Z
---

# PEND-017 — app/api/budgets/route.ts no valida el body antes del insert; si falta descriptio

**reason:** Hallazgo del verificador durante ROAD-003, fuera de alcance de este run.

**task:** app/api/budgets/route.ts no valida el body antes del insert; si falta description (NOT NULL) da 500 crudo en vez de 400.

