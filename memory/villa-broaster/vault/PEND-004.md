---
id: PEND-004
type: Pending
tier: Project
status: Ready
impact: High
priority: High
lifetime: Project
created: 2026-08-08T00:00:00.000Z
updated: 2026-08-22T00:00:00.000Z
---

# PEND-004 — Activacion de TRES REPOS: (A) repo equipo (villa-broaster): raíz compartida READ

**reason:** Separación de responsabilidades por rol pedida por el dueño. Sistema y vitrina listos en local; falta activación GitHub y hosting real.

**task:** Activacion de TRES REPOS: (A) repo equipo (villa-broaster): raíz compartida README + PLAN-EQUIPO.md + docs/ + tareas/ + memory/, gitignore broaster-app/villa-app/, main protegida. (B) repo sistema (villa-broaster-sistema): broaster-app (Next.js contable :3200, admin 5 pestañas, tests 68), dueño+senior escriben, landing designer entra por PR. (C) repo vitrina (villa-broaster-vitrina): villa-app (Next.js pública :3201, stateless, /api/*→broaster :3200), landing+diseñadora escriben, PRs revisadas por senior. Git history preservada con subtree split (sistema 9 commits, vitrina 4). Rutas locales intactas. Activación: (1) dueño crea 3 remotos privados en GitHub; (2) invita por rol con acceso; (3) push manual vía GitHub Desktop desde rutas locales; (4) protege main con branch rules; (5) configura hosting bifurcado (2 procesos Next.js paralelos con proxy). ASIGNADO: T-10 (dueño: repos + equipo + GitHub + protecciones + hosting/dominio). Verificación: npm run verificar (broaster: typecheck+lint+tests; villa: typecheck) como puerta PR. RUTA: C:/Users/Kalel/prommter/proyectos/villa-broaster.

**Depende de:** [[DEC-003]] · [[PEND-003]]

