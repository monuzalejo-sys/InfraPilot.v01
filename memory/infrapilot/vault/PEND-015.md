---
id: PEND-015
type: Pending
tier: Project
status: Blocked
impact: High
priority: High
lifetime: Sprint
created: 2026-07-06T04:30:00.000Z
updated: 2026-07-06T04:30:00.000Z
---

# PEND-015 — Usuario: ejecutar supabase/migrations/002_suppliers_quotes.sql en Supabase SQL E

**reason:** La feature proveedores+comparativa (commit 131040f) degrada con banner MIGRATION_002_REQUIRED hasta que la migración corra. Bloqueado en el usuario.

**task:** Usuario: ejecutar supabase/migrations/002_suppliers_quotes.sql en Supabase SQL Editor (después de 000 y 001). Luego verificar en vivo: crear proveedor en /proveedores, añadir cotización en el panel expandible de /precios, botón usar mejor precio, y flujo lector→cotizaciones (este último requiere además GROQ_API_KEY, PEND-013).

**Depende de:** [[KN-022]]

**Referenciado por:** [[KN-022]]

