---
name: project-backend-state
description: Estado actual del backend InfraPilot AI — módulos completados y pendientes según roadmap
metadata: 
  node_type: memory
  type: project
  originSessionId: 600bee7d-9d74-403b-b4fe-e57967a4112c
---

**Fecha:** 2026-06-11

## Módulos completados (PROMPT 1)

- `src/database/prisma.service.ts` — PrismaService singleton
- `src/common/` — decoradores, guards, interceptors, filters, types
- `src/modules/auth/` — registro, login, multi-empresa, JWT, refresh, logout
- `src/modules/companies/` — CRUD empresa, miembros, roles
- `src/modules/users/` — perfil, invitaciones, cambio de contraseña
- `prisma/schema.prisma` — schema completo con todos los modelos
- `prisma/seeds/seed.ts` — datos demo (2 empresas, 5 usuarios, todos Admin123!)

**Build:** npm run build → EXIT 0 ✅
**TypeScript:** npx tsc --noEmit → 0 errores ✅
**Prisma validate:** schema válido ✅

## Próximos módulos (roadmap Semana 3-4)

1. `modules/apus` — Análisis de Precios Unitarios (CRUD completo)
2. `modules/projects` — Proyectos de obra
3. `modules/budgets` — Presupuestos con versiones y cálculo automático
4. `modules/price-history` — Historial de precios

## Notas técnicas

- Prisma 7.8.0 — datasource URL va en `prisma.config.ts`, no en schema.prisma
- `expiresIn` en JWT requiere cast `as unknown as number` por tipo StringValue
- `APP_GUARD/APP_FILTER/APP_INTERCEPTOR` se importan de `@nestjs/core`, no `@nestjs/common`
- Multi-tenant: tabla pivote `UserCompany` — usuario puede tener N empresas con roles distintos
- Seed password para demo: `Admin123!`

**Why:** Estado congelado al terminar PROMPT 1 para retomarlo en futura sesión.

**How to apply:** Al iniciar nueva sesión, verificar que el estado actual coincide con este registro antes de continuar con el siguiente módulo.
