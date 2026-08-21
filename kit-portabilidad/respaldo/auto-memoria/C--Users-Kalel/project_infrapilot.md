---
name: project-infrapilot
description: "InfraPilot AI — plataforma SaaS de ingeniería civil, topografía y contratación pública"
metadata: 
  node_type: memory
  type: project
  originSessionId: 600bee7d-9d74-403b-b4fe-e57967a4112c
---

Plataforma SaaS para ingeniería civil. Flujo principal: Describe la obra → Genera presupuesto → Exporta Excel.

**Stack backend:** NestJS 11 + PostgreSQL 16 + Prisma 7 + JWT nativo + Redis (BullMQ) + Claude API

**Ubicación del proyecto:** `C:\Users\Kalel\infrapilot-backend\`

**Documentación de arquitectura:** `C:\Users\Kalel\backend-architecture.md`, `database-design.md`, `auth-system.md`, `prisma-schema.prisma`

**Separación frontend/backend:** Total. Backend = API REST independiente. Frontend lo desarrolla otro programador.

**Why:** Multi-tenant SaaS — companyId en todas las tablas de dominio. Auth JWT nativo con tabla pivote UserCompany para N empresas por usuario.

**How to apply:** Siempre que se cree un nuevo módulo, seguir el roadmap acordado en backend-architecture.md (Semana 1-2 → 3-4 → 5-6 → 7-8).
