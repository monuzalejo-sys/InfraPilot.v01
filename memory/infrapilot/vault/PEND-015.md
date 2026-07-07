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

# PEND-015 — Usuario: aplicar migración 002_suppliers_quotes.sql en Supabase SQL Editor (desp

**reason:** Feature proveedores+comparativa (commit 131040f) degrada con banner MIGRATION_002_REQUIRED hasta que corra. Bloqueado en el usuario. ROAD-002 depende de esto.

**task:** Usuario: aplicar migración 002_suppliers_quotes.sql en Supabase SQL Editor (después de 000 y 001). Luego verificar en vivo: crear proveedor en /proveedores, cotización en comparativa de /precios, usar mejor precio, y flujo lector→cotizaciones (este requiere además GROQ_API_KEY, PEND-013).

