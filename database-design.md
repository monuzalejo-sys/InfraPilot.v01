# InfraPilot AI — Database Design v1.0
**Documento Interno · Confidencial · Junio 2026**

---

## 1. Principios de Diseño

- **UUID v4** como PK en todas las tablas — evita enumeración, soporta distribución.
- **`organization_id` presente en toda tabla de negocio** — es el eje del multi-tenant.
- **Soft delete** (`deleted_at`) en entidades críticas: proyectos, partidas, presupuestos.
- **Timestamps estándar**: `created_at`, `updated_at` en todas las tablas.
- **JSONB** para configuraciones flexibles que no requieren búsqueda por columna.
- **Decimales con precisión explícita** para montos monetarios (evitar float).
- **Enums nativos de PostgreSQL** para campos de estado — validan a nivel de BD.
- **RLS (Row-Level Security)** como segunda capa de aislamiento multi-tenant.

---

## 2. Estrategia Multi-Tenant

### 2.1 Modelo Elegido: Pool Model con RLS

InfraPilot AI usa **Shared Database, Shared Schema** (Pool Model):
- Todos los tenants comparten las mismas tablas.
- Cada fila lleva `organization_id` para identificar al propietario.
- PostgreSQL RLS actúa como guardia de seguridad a nivel de base de datos.

**Por qué este modelo para el MVP:**
- Compatible nativamente con Prisma sin extensiones de terceros.
- Un solo conjunto de migraciones para gestionar.
- Escala cómodamente hasta ~10,000 organizaciones activas.
- Costo operativo mínimo en etapas tempranas.

### 2.2 Evolución por Tier

| Plan | Estrategia | Activación |
|---|---|---|
| Free / Starter / Professional | Pool Model + RLS | Desde el inicio |
| Enterprise (Early) | Pool Model con schema dedicado | Fase 3+ |
| Enterprise (Large) | Silo Model — base de datos propia | Bajo demanda |

### 2.3 Mecanismo de Aislamiento

**Capa de aplicación:**
```
Cada request autenticado extrae organization_id del JWT.
El middleware ejecuta: SET LOCAL app.current_org_id = '<uuid>';
Prisma middleware inyecta .where({ organization_id }) en cada query.
```

**Capa de base de datos (RLS):**
```
-- Política aplicada a todas las tablas de negocio:
CREATE POLICY tenant_isolation ON projects
  USING (organization_id = current_setting('app.current_org_id')::uuid);
```

**Cuenta de servicio:**
- La aplicación conecta con un rol `app_user` que tiene RLS activado.
- Los jobs de administración usan `admin_user` con `BYPASSRLS`.
- Los reportes internos usan `reporting_user` con acceso de solo lectura.

### 2.4 Campos de Aislamiento por Dominio

Todas las tablas de negocio llevan:
- `organization_id UUID NOT NULL` — eje de aislamiento
- Índice compuesto `(organization_id, <campo de filtro frecuente>)`

Las tablas globales (sin `organization_id`) son de solo lectura para la app:
- `plans`, `regions`, `price_categories`, `price_items`, `price_records` globales.

---

## 3. Diagrama Entidad-Relación (Vista General)

```
┌─────────────────┐        ┌──────────────────────┐        ┌──────────┐
│  organizations  │──────<│ organization_members  │>──────│  users   │
└────────┬────────┘        └──────────────────────┘        └──────────┘
         │
         ├──────────────────────────────────────────────────────────────────┐
         │                                                                  │
    ┌────▼──────┐     ┌──────────────┐     ┌──────────────┐                │
    │ projects  │──<──│intake_session│──<──│intake_message│                │
    └────┬──────┘     └──────┬───────┘     └──────────────┘                │
         │                   └──<── intake_extractions                      │
         │                                                                  │
    ┌────▼──────┐     ┌───────────────┐     ┌────────────────┐             │
    │  budgets  │──<──│budget_sections│──<──│  budget_items  │             │
    └────┬──────┘     └───────────────┘     └───────┬────────┘             │
         │                                          │                       │
         │                                   ┌──────▼──────┐               │
         │                                   │apu_analyses │               │
         │                                   └──────┬──────┘               │
         │                                          └──<── apu_components   │
         │                                                      │           │
         │                                               ┌──────▼──────┐   │
         │                                               │ price_items │   │
         │                                               └──────┬──────┘   │
         │                                                      └──< price_records
         │
         ├──<── tenders ──<── tender_requirements
         │          └──<── tender_proposals
         │
         ├──<── financial_projections ──<── cash_flow_entries
         │               └──<── s_curve_entries
         │
         └──<── documents ──<── export_jobs

organizations ──<── subscriptions >── plans
organizations ──<── ai_credit_ledger
organizations ──<── document_templates
projects ──<── comments
projects ──<── activity_logs
users ──<── notifications
```

---

## 4. Dominios y Tablas

### DOMINIO 1 — Identidad y Acceso

---

#### `users`
Usuarios individuales del sistema. Gestionados principalmente por Clerk/Auth0, pero replicados localmente para relaciones.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | Identificador único |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email principal |
| name | VARCHAR(255) | NOT NULL | Nombre completo |
| avatar_url | TEXT | nullable | URL avatar |
| auth_provider | ENUM | NOT NULL | `CLERK`, `AUTH0`, `EMAIL` |
| auth_provider_id | VARCHAR(255) | UNIQUE | ID externo del proveedor de auth |
| preferred_language | CHAR(2) | DEFAULT 'es' | ISO 639-1: `es`, `en`, `pt` |
| timezone | VARCHAR(64) | DEFAULT 'America/Lima' | IANA timezone |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | nullable | Soft delete |

---

#### `organizations`
Tenant principal del sistema. Una empresa, consultora o profesional independiente.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| slug | VARCHAR(63) | UNIQUE, NOT NULL | Identificador URL-safe (ej: `constructora-abc`) |
| name | VARCHAR(255) | NOT NULL | Nombre comercial |
| legal_name | VARCHAR(255) | nullable | Razón social |
| tax_id | VARCHAR(30) | nullable | RUC / NIT / RFC / CIF |
| country_code | CHAR(2) | NOT NULL | ISO 3166-1 (`PE`, `CO`, `MX`, `CL`, `ES`) |
| region_id | UUID | FK → regions | Región principal de operación |
| logo_url | TEXT | nullable | URL logo empresa |
| default_currency | CHAR(3) | DEFAULT 'USD' | ISO 4217 |
| default_tax_rate | DECIMAL(5,4) | DEFAULT 0.18 | IGV/IVA/IVA (ej: 0.18 = 18%) |
| settings | JSONB | DEFAULT '{}' | Preferencias: colores, plantillas default |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | nullable | |

---

#### `organization_members`
Tabla de unión M:N entre usuarios y organizaciones, con rol asignado.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| user_id | UUID | FK → users, NOT NULL | |
| role | ENUM | NOT NULL | `OWNER`, `ADMIN`, `EDITOR`, `REVIEWER`, `VIEWER` |
| invited_by_user_id | UUID | FK → users, nullable | Quién invitó al miembro |
| joined_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

**Restricciones:** `UNIQUE(organization_id, user_id)`

---

#### `invitations`
Invitaciones pendientes de aceptación por email.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| email | VARCHAR(255) | NOT NULL | Email del invitado |
| role | ENUM | NOT NULL | Rol a asignar al aceptar |
| token | VARCHAR(64) | UNIQUE, NOT NULL | Token seguro para el link de invitación |
| invited_by_user_id | UUID | FK → users, NOT NULL | |
| expires_at | TIMESTAMPTZ | NOT NULL | Expiración (ej: 7 días) |
| accepted_at | TIMESTAMPTZ | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

### DOMINIO 2 — Suscripciones y Facturación

---

#### `plans`
Planes disponibles en la plataforma. Tabla global, no tiene `organization_id`.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(50) | UNIQUE, NOT NULL | `free`, `starter`, `professional`, `enterprise` |
| display_name | VARCHAR(100) | NOT NULL | Nombre visible al usuario |
| price_usd_monthly | DECIMAL(10,2) | NOT NULL | Precio mensual en USD |
| price_usd_yearly | DECIMAL(10,2) | NOT NULL | Precio anual en USD |
| max_projects | INTEGER | nullable | null = ilimitado |
| max_users | INTEGER | nullable | null = ilimitado |
| max_exports_monthly | INTEGER | nullable | null = ilimitado |
| ai_credits_monthly | INTEGER | nullable | Créditos de IA por mes, null = ilimitado |
| features | JSONB | NOT NULL DEFAULT '{}' | Feature flags: `{licitaciones: true, api_access: false, ...}` |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `subscriptions`
Suscripción activa de cada organización.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, UNIQUE | Una org = una suscripción activa |
| plan_id | UUID | FK → plans, NOT NULL | |
| status | ENUM | NOT NULL | `ACTIVE`, `TRIALING`, `PAST_DUE`, `CANCELED`, `EXPIRED` |
| billing_cycle | ENUM | NOT NULL | `MONTHLY`, `YEARLY` |
| current_period_start | TIMESTAMPTZ | NOT NULL | |
| current_period_end | TIMESTAMPTZ | NOT NULL | |
| trial_ends_at | TIMESTAMPTZ | nullable | |
| canceled_at | TIMESTAMPTZ | nullable | |
| payment_provider | ENUM | nullable | `STRIPE`, `PAYPAL`, `MANUAL` |
| payment_provider_sub_id | VARCHAR(255) | nullable | ID externo en Stripe/PayPal |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `ai_credit_ledger`
Libro contable de créditos de IA por organización. Append-only.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| amount | INTEGER | NOT NULL | Positivo = crédito, negativo = débito |
| balance_after | INTEGER | NOT NULL | Balance resultante |
| reason | ENUM | NOT NULL | `MONTHLY_REFILL`, `USED_INTAKE`, `USED_APU_GENERATION`, `USED_EXPORT`, `PURCHASED`, `ADMIN_ADJUSTMENT` |
| reference_id | UUID | nullable | ID del ai_job que consumió los créditos |
| created_by_user_id | UUID | FK → users, nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

### DOMINIO 3 — Proyectos

---

#### `projects`
Entidad central del sistema. Cada proyecto de obra tiene un presupuesto asociado.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| created_by_user_id | UUID | FK → users, NOT NULL | |
| code | VARCHAR(20) | NOT NULL | Código interno (ej: `PROJ-2026-001`) |
| name | VARCHAR(255) | NOT NULL | Nombre del proyecto |
| description | TEXT | nullable | Descripción libre |
| project_type | ENUM | NOT NULL | `VIAL`, `EDIFICACION`, `HIDRAULICA`, `SANEAMIENTO`, `ELECTRICO`, `TOPOGRAFIA`, `MINERO`, `OTRO` |
| status | ENUM | NOT NULL DEFAULT 'DRAFT' | `DRAFT`, `IN_PROGRESS`, `COMPLETED`, `ARCHIVED` |
| region_id | UUID | FK → regions, nullable | Región donde se ejecuta la obra |
| address | TEXT | nullable | Dirección/ubicación textual |
| coordinates | JSONB | nullable | `{lat: -12.04, lng: -77.03}` |
| start_date | DATE | nullable | Fecha de inicio estimada |
| end_date | DATE | nullable | Fecha de fin estimada |
| special_conditions | JSONB | DEFAULT '{}' | `{seismic_zone: "Z3", altitude_m: 3500, remote: true}` |
| currency | CHAR(3) | NOT NULL DEFAULT 'USD' | Moneda del proyecto |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | nullable | |

**Restricción:** `UNIQUE(organization_id, code)`

---

#### `project_members`
Acceso a proyecto específico para usuarios con permisos granulares.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| project_id | UUID | FK → projects, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | Desnormalizado para RLS |
| user_id | UUID | FK → users, NOT NULL | |
| role | ENUM | NOT NULL | `OWNER`, `EDITOR`, `REVIEWER`, `VIEWER` |
| added_by_user_id | UUID | FK → users, NOT NULL | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Restricción:** `UNIQUE(project_id, user_id)`

---

### DOMINIO 4 — Intake Conversacional

---

#### `intake_sessions`
Sesión de conversación donde el usuario describe la obra.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| project_id | UUID | FK → projects, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| created_by_user_id | UUID | FK → users, NOT NULL | |
| status | ENUM | NOT NULL DEFAULT 'ACTIVE' | `ACTIVE`, `COMPLETED`, `ABANDONED` |
| input_type | ENUM | NOT NULL | `TEXT`, `VOICE`, `DOCUMENT`, `MIXED` |
| raw_input_text | TEXT | nullable | Descripción original del usuario |
| input_document_url | TEXT | nullable | URL del PDF cargado (planos, memoria) |
| ai_model_used | VARCHAR(100) | nullable | ej: `claude-sonnet-4-6` |
| ai_tokens_used | INTEGER | DEFAULT 0 | Total de tokens consumidos en la sesión |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| completed_at | TIMESTAMPTZ | nullable | |

---

#### `intake_messages`
Mensajes individuales del chat conversacional.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| intake_session_id | UUID | FK → intake_sessions, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| role | ENUM | NOT NULL | `USER`, `ASSISTANT`, `SYSTEM` |
| content | TEXT | NOT NULL | Contenido del mensaje |
| tokens_used | INTEGER | nullable | Solo para mensajes ASSISTANT |
| sequence_number | INTEGER | NOT NULL | Orden dentro de la sesión |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Restricción:** `UNIQUE(intake_session_id, sequence_number)`

---

#### `intake_extractions`
Datos estructurados extraídos por la IA de la sesión de intake.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| intake_session_id | UUID | FK → intake_sessions, UNIQUE | Una extracción por sesión |
| organization_id | UUID | FK → organizations, NOT NULL | |
| extracted_data | JSONB | NOT NULL | Datos estructurados extraídos (ver estructura abajo) |
| confidence_score | DECIMAL(4,3) | nullable | Score 0.000–1.000 de confianza global |
| reviewed_by_user_id | UUID | FK → users, nullable | Usuario que validó la extracción |
| reviewed_at | TIMESTAMPTZ | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Estructura de `extracted_data`:**
```json
{
  "project_type": "EDIFICACION",
  "scope_summary": "Edificio residencial 5 pisos, 20 dptos",
  "duration_days": 240,
  "identified_sections": [
    { "name": "Obras Preliminares", "description": "Limpieza y trazo" }
  ],
  "identified_partidas": [
    { "code": "01.01", "name": "Limpieza de terreno", "unit": "m2", "estimated_qty": 450.0 }
  ],
  "special_conditions": { "seismic_zone": "Z4", "soil_type": "S2" }
}
```

---

### DOMINIO 5 — Presupuesto y APU

---

#### `budgets`
Presupuesto general de un proyecto. Contiene los totales calculados.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| project_id | UUID | FK → projects, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| name | VARCHAR(255) | NOT NULL DEFAULT 'Presupuesto Base' | Nombre de la versión |
| status | ENUM | NOT NULL DEFAULT 'DRAFT' | `DRAFT`, `REVIEW`, `APPROVED`, `EXPORTED` |
| currency | CHAR(3) | NOT NULL | |
| tax_rate | DECIMAL(5,4) | NOT NULL DEFAULT 0.18 | IGV/IVA aplicado |
| overhead_pct | DECIMAL(5,4) | NOT NULL DEFAULT 0.10 | % Gastos generales |
| profit_pct | DECIMAL(5,4) | NOT NULL DEFAULT 0.08 | % Utilidad |
| contingency_pct | DECIMAL(5,4) | NOT NULL DEFAULT 0.05 | % Imprevistos |
| base_cost | DECIMAL(18,2) | NOT NULL DEFAULT 0 | Costo directo total |
| overhead_amount | DECIMAL(18,2) | NOT NULL DEFAULT 0 | Monto gastos generales |
| profit_amount | DECIMAL(18,2) | NOT NULL DEFAULT 0 | Monto utilidad |
| contingency_amount | DECIMAL(18,2) | NOT NULL DEFAULT 0 | Monto imprevistos |
| tax_amount | DECIMAL(18,2) | NOT NULL DEFAULT 0 | Monto IGV/IVA |
| total_amount | DECIMAL(18,2) | NOT NULL DEFAULT 0 | Total presupuesto |
| notes | TEXT | nullable | |
| approved_by_user_id | UUID | FK → users, nullable | |
| approved_at | TIMESTAMPTZ | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | nullable | |

---

#### `budget_sections`
Capítulos/secciones del presupuesto. Soporta anidamiento para subsecciones.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| budget_id | UUID | FK → budgets, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| parent_section_id | UUID | FK → budget_sections, nullable | Para subsecciones (máx 3 niveles) |
| code | VARCHAR(20) | NOT NULL | ej: `01`, `01.01`, `01.01.01` |
| name | VARCHAR(255) | NOT NULL | ej: `OBRAS CIVILES` |
| display_order | INTEGER | NOT NULL DEFAULT 0 | Orden de presentación |
| subtotal | DECIMAL(18,2) | NOT NULL DEFAULT 0 | Suma de ítems (calculado) |
| notes | TEXT | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

**Restricción:** `UNIQUE(budget_id, code)`

---

#### `budget_items`
Partidas individuales del presupuesto. Cada partida tiene un APU asociado.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| budget_section_id | UUID | FK → budget_sections, NOT NULL | |
| budget_id | UUID | FK → budgets, NOT NULL | Desnormalizado para queries |
| organization_id | UUID | FK → organizations, NOT NULL | |
| code | VARCHAR(20) | NOT NULL | ej: `01.01.001` |
| name | VARCHAR(255) | NOT NULL | ej: `Excavación de zanjas` |
| description | TEXT | nullable | Especificaciones técnicas |
| unit | VARCHAR(20) | NOT NULL | `m3`, `m2`, `ml`, `kg`, `und`, `glb` |
| quantity | DECIMAL(14,4) | NOT NULL DEFAULT 0 | Metrado |
| unit_price | DECIMAL(14,4) | NOT NULL DEFAULT 0 | Precio unitario |
| total_price | DECIMAL(18,2) | NOT NULL DEFAULT 0 | quantity × unit_price |
| price_source | ENUM | NOT NULL DEFAULT 'APU_GENERATED' | `APU_GENERATED`, `MANUAL`, `CATALOG` |
| display_order | INTEGER | NOT NULL DEFAULT 0 | |
| is_ai_generated | BOOLEAN | NOT NULL DEFAULT false | |
| ai_confidence | DECIMAL(4,3) | nullable | Confianza IA al generar esta partida |
| notes | TEXT | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | nullable | |

**Restricción:** `UNIQUE(budget_id, code)`

---

#### `apu_analyses`
Análisis de Precio Unitario de una partida. Descompone el costo en recursos.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| budget_item_id | UUID | FK → budget_items, UNIQUE | Un APU por partida |
| organization_id | UUID | FK → organizations, NOT NULL | |
| unit | VARCHAR(20) | NOT NULL | Unidad del rendimiento |
| output_quantity | DECIMAL(10,4) | NOT NULL DEFAULT 1 | Rendimiento (ej: 8 m3/día) |
| work_hours | DECIMAL(10,4) | nullable | Horas hombre por unidad |
| materials_cost | DECIMAL(14,4) | NOT NULL DEFAULT 0 | Costo materiales (calculado) |
| labor_cost | DECIMAL(14,4) | NOT NULL DEFAULT 0 | Costo mano de obra (calculado) |
| equipment_cost | DECIMAL(14,4) | NOT NULL DEFAULT 0 | Costo equipos (calculado) |
| tools_cost | DECIMAL(14,4) | NOT NULL DEFAULT 0 | Herramientas (calculado, % de MO) |
| subtotal_cost | DECIMAL(14,4) | NOT NULL DEFAULT 0 | Total APU por unidad |
| region_id | UUID | FK → regions, nullable | Región de los precios usados |
| price_date | DATE | nullable | Fecha de vigencia de los precios |
| is_ai_generated | BOOLEAN | NOT NULL DEFAULT false | |
| ai_model_used | VARCHAR(100) | nullable | |
| ai_tokens_used | INTEGER | DEFAULT 0 | |
| notes | TEXT | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `apu_components`
Recursos individuales dentro de un APU (materiales, mano de obra, equipos).

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| apu_analysis_id | UUID | FK → apu_analyses, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| component_type | ENUM | NOT NULL | `MATERIAL`, `LABOR`, `EQUIPMENT`, `TOOLS`, `SUBCONTRACT` |
| price_item_id | UUID | FK → price_items, nullable | Vínculo al catálogo de precios |
| code | VARCHAR(30) | nullable | Código interno del recurso |
| description | VARCHAR(255) | NOT NULL | ej: `Cemento Portland Tipo I` |
| unit | VARCHAR(20) | NOT NULL | ej: `bls`, `hh`, `hm` |
| quantity | DECIMAL(14,6) | NOT NULL | Cantidad por unidad de rendimiento |
| unit_price | DECIMAL(14,4) | NOT NULL | Precio unitario del recurso |
| total_price | DECIMAL(14,4) | NOT NULL | quantity × unit_price |
| display_order | INTEGER | NOT NULL DEFAULT 0 | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

### DOMINIO 6 — Inteligencia de Precios

---

#### `regions`
Jerarquía geográfica: País → Departamento/Estado → Ciudad.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| country_code | CHAR(2) | NOT NULL | ISO 3166-1 |
| country_name | VARCHAR(100) | NOT NULL | |
| division_code | VARCHAR(20) | nullable | ej: `LIM`, `ANT`, `CDMX` |
| division_name | VARCHAR(100) | nullable | ej: `Lima`, `Antioquia` |
| division_level | ENUM | NOT NULL | `COUNTRY`, `STATE`, `CITY` |
| parent_id | UUID | FK → regions, nullable | Jerarquía padre |
| is_active | BOOLEAN | DEFAULT true | |

---

#### `price_categories`
Árbol de categorías para organizar los ítems del catálogo.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(100) | NOT NULL | ej: `Cemento y Concreto`, `Mano de Obra Civil` |
| parent_category_id | UUID | FK → price_categories, nullable | Subcategorías |
| component_type | ENUM | NOT NULL | `MATERIAL`, `LABOR`, `EQUIPMENT` |
| display_order | INTEGER | DEFAULT 0 | |
| is_active | BOOLEAN | DEFAULT true | |

---

#### `price_items`
Catálogo global de recursos constructivos. Tabla de solo lectura para usuarios.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| category_id | UUID | FK → price_categories, NOT NULL | |
| code | VARCHAR(30) | UNIQUE, NOT NULL | ej: `MAT-CEM-001` |
| name | VARCHAR(255) | NOT NULL | ej: `Cemento Portland Tipo I x 42.5kg` |
| description | TEXT | nullable | Especificaciones detalladas |
| unit | VARCHAR(20) | NOT NULL | Unidad base del precio |
| component_type | ENUM | NOT NULL | `MATERIAL`, `LABOR`, `EQUIPMENT` |
| specifications | JSONB | DEFAULT '{}' | Normas técnicas, marcas de referencia |
| embedding | vector(1536) | nullable | pgvector — búsqueda semántica por IA |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `price_records`
Precio de un ítem en una región y período específico. Permite historial.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| price_item_id | UUID | FK → price_items, NOT NULL | |
| region_id | UUID | FK → regions, NOT NULL | |
| price | DECIMAL(14,4) | NOT NULL | Precio unitario |
| currency | CHAR(3) | NOT NULL | |
| valid_from | DATE | NOT NULL | Inicio de vigencia |
| valid_until | DATE | nullable | Fin de vigencia, null = vigente |
| source | ENUM | NOT NULL | `OFFICIAL`, `CAPECO`, `CAMACOL`, `INVIAS`, `INE`, `MANUAL`, `USER_SUBMITTED` |
| source_reference | TEXT | nullable | ej: `CAPECO Boletín Nro.45 Ene-2026` |
| is_verified | BOOLEAN | DEFAULT false | Verificado por admin |
| verified_by_user_id | UUID | FK → users, nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Índice:** `(price_item_id, region_id, valid_from DESC)` para búsqueda del precio vigente.

---

#### `price_indices`
Índices de escalación de costos por período (CAPECO, DANE, INE, etc.).

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(150) | NOT NULL | ej: `Índice Costo Construcción - Lima` |
| country_code | CHAR(2) | NOT NULL | |
| category | ENUM | NOT NULL | `GENERAL`, `MATERIALS`, `LABOR`, `EQUIPMENT` |
| source_organization | VARCHAR(100) | NOT NULL | ej: `CAPECO`, `DANE`, `INE` |
| index_value | DECIMAL(10,4) | NOT NULL | |
| base_period | VARCHAR(50) | NOT NULL | ej: `Enero 2020 = 100` |
| period_date | DATE | NOT NULL | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

#### `org_price_overrides`
Precios personalizados por organización. Sobrescriben el catálogo global.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| price_item_id | UUID | FK → price_items, nullable | Si está vinculado al catálogo |
| code | VARCHAR(30) | nullable | Código propio de la empresa |
| description | VARCHAR(255) | NOT NULL | |
| unit | VARCHAR(20) | NOT NULL | |
| price | DECIMAL(14,4) | NOT NULL | |
| currency | CHAR(3) | NOT NULL | |
| valid_from | DATE | NOT NULL | |
| valid_until | DATE | nullable | |
| notes | TEXT | nullable | |
| created_by_user_id | UUID | FK → users, NOT NULL | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

### DOMINIO 7 — Documentos y Exportación

---

#### `document_templates`
Plantillas para generación de Excel/PDF. Globales o personalizadas por org.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, nullable | null = plantilla global del sistema |
| name | VARCHAR(255) | NOT NULL | |
| description | TEXT | nullable | |
| document_type | ENUM | NOT NULL | `BUDGET_EXCEL`, `BUDGET_PDF`, `APU_SHEET`, `TENDER_PROPOSAL`, `MEMORY_CALC` |
| format | ENUM | NOT NULL | `EXCEL`, `PDF`, `DOCX` |
| country_code | CHAR(2) | nullable | Para plantillas de licitación específicas |
| template_file_url | TEXT | NOT NULL | URL S3/R2 del archivo plantilla |
| template_schema | JSONB | DEFAULT '{}' | Variables que acepta la plantilla |
| is_default | BOOLEAN | DEFAULT false | Plantilla por defecto de su tipo |
| is_active | BOOLEAN | DEFAULT true | |
| created_by_user_id | UUID | FK → users, nullable | null = creada por sistema |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `documents`
Documentos generados y almacenados en S3/R2.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| project_id | UUID | FK → projects, NOT NULL | |
| budget_id | UUID | FK → budgets, nullable | |
| tender_id | UUID | FK → tenders, nullable | |
| created_by_user_id | UUID | FK → users, NOT NULL | |
| template_id | UUID | FK → document_templates, nullable | |
| name | VARCHAR(255) | NOT NULL | Nombre del archivo |
| document_type | ENUM | NOT NULL | |
| format | ENUM | NOT NULL | `EXCEL`, `PDF`, `DOCX` |
| file_url | TEXT | NOT NULL | URL firmada S3/R2 |
| file_size_bytes | INTEGER | NOT NULL | |
| is_watermarked | BOOLEAN | DEFAULT false | Para plan Free |
| expires_at | TIMESTAMPTZ | nullable | Auto-limpieza de archivos temporales |
| download_count | INTEGER | DEFAULT 0 | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

#### `export_jobs`
Jobs asíncronos de generación de documentos.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| budget_id | UUID | FK → budgets, NOT NULL | |
| requested_by_user_id | UUID | FK → users, NOT NULL | |
| template_id | UUID | FK → document_templates, nullable | |
| status | ENUM | NOT NULL DEFAULT 'QUEUED' | `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED` |
| format | ENUM | NOT NULL | `EXCEL`, `PDF` |
| options | JSONB | DEFAULT '{}' | `{watermark: false, sheets: ["apu", "summary"], logo: true}` |
| result_document_id | UUID | FK → documents, nullable | Documento resultante |
| error_message | TEXT | nullable | |
| started_at | TIMESTAMPTZ | nullable | |
| completed_at | TIMESTAMPTZ | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

### DOMINIO 8 — Licitaciones

---

#### `tenders`
Proceso de licitación o concurso al que la organización se presenta.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| project_id | UUID | FK → projects, NOT NULL | |
| budget_id | UUID | FK → budgets, nullable | Presupuesto base de la propuesta |
| created_by_user_id | UUID | FK → users, NOT NULL | |
| reference_code | VARCHAR(100) | nullable | Número de expediente oficial |
| name | VARCHAR(255) | NOT NULL | Nombre del proceso |
| entity_name | VARCHAR(255) | NOT NULL | Entidad convocante |
| entity_type | ENUM | NOT NULL | `GOBIERNO_CENTRAL`, `GOBIERNO_REGIONAL`, `MUNICIPALIDAD`, `EMPRESA_PRIVADA` |
| tender_type | ENUM | NOT NULL | `LICITACION_PUBLICA`, `CONCURSO_PUBLICO`, `ADJUDICACION_DIRECTA`, `COMPRA_DIRECTA` |
| country_code | CHAR(2) | NOT NULL | |
| publication_date | DATE | nullable | |
| submission_deadline | TIMESTAMPTZ | nullable | Fecha/hora límite de presentación |
| status | ENUM | NOT NULL DEFAULT 'DRAFT' | `DRAFT`, `IN_PROGRESS`, `SUBMITTED`, `WON`, `LOST`, `CANCELED` |
| estimated_value | DECIMAL(18,2) | nullable | Valor referencial |
| currency | CHAR(3) | nullable | |
| notes | TEXT | nullable | |
| source_documents_urls | JSONB | DEFAULT '[]' | URLs de las bases del concurso |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `tender_requirements`
Checklist de requisitos de la licitación.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| tender_id | UUID | FK → tenders, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| description | TEXT | NOT NULL | Descripción del requisito |
| requirement_type | ENUM | NOT NULL | `ADMINISTRATIVE`, `TECHNICAL`, `FINANCIAL`, `LEGAL` |
| is_met | BOOLEAN | nullable | null = sin revisar, true/false = estado |
| notes | TEXT | nullable | |
| display_order | INTEGER | DEFAULT 0 | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `tender_proposals`
Propuesta enviada a una licitación.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| tender_id | UUID | FK → tenders, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| budget_id | UUID | FK → budgets, nullable | |
| submitted_by_user_id | UUID | FK → users, nullable | |
| status | ENUM | NOT NULL DEFAULT 'DRAFT' | `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED` |
| proposal_amount | DECIMAL(18,2) | nullable | Monto ofertado |
| currency | CHAR(3) | nullable | |
| submission_date | TIMESTAMPTZ | nullable | |
| result_date | DATE | nullable | |
| rejection_reason | TEXT | nullable | |
| document_id | UUID | FK → documents, nullable | PDF de la propuesta |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

### DOMINIO 9 — Proyecciones Financieras

---

#### `financial_projections`
Proyección financiera de un proyecto.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| project_id | UUID | FK → projects, NOT NULL | |
| budget_id | UUID | FK → budgets, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| created_by_user_id | UUID | FK → users, NOT NULL | |
| name | VARCHAR(255) | NOT NULL DEFAULT 'Proyección Base' | |
| total_income | DECIMAL(18,2) | NOT NULL DEFAULT 0 | |
| total_cost | DECIMAL(18,2) | NOT NULL DEFAULT 0 | |
| gross_margin | DECIMAL(18,2) | NOT NULL DEFAULT 0 | total_income - total_cost |
| gross_margin_pct | DECIMAL(5,4) | nullable | |
| net_margin_pct | DECIMAL(5,4) | nullable | |
| roi | DECIMAL(8,4) | nullable | Return on Investment |
| break_even_period | INTEGER | nullable | Período de recuperación (meses) |
| notes | TEXT | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

---

#### `cash_flow_entries`
Entradas del flujo de caja por período.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| financial_projection_id | UUID | FK → financial_projections, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| period_number | INTEGER | NOT NULL | 1-based |
| period_label | VARCHAR(50) | NOT NULL | ej: `Mes 1`, `Semana 3` |
| period_start | DATE | NOT NULL | |
| period_end | DATE | NOT NULL | |
| planned_income | DECIMAL(14,2) | NOT NULL DEFAULT 0 | |
| planned_expense | DECIMAL(14,2) | NOT NULL DEFAULT 0 | |
| planned_balance | DECIMAL(14,2) | NOT NULL DEFAULT 0 | Acumulado planificado |
| actual_income | DECIMAL(14,2) | nullable | Control durante ejecución |
| actual_expense | DECIMAL(14,2) | nullable | |
| actual_balance | DECIMAL(14,2) | nullable | |
| notes | TEXT | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |

**Restricción:** `UNIQUE(financial_projection_id, period_number)`

---

#### `s_curve_entries`
Datos de la Curva S (avance físico y financiero acumulado).

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| financial_projection_id | UUID | FK → financial_projections, NOT NULL | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| period_number | INTEGER | NOT NULL | |
| period_label | VARCHAR(50) | NOT NULL | |
| planned_physical_pct | DECIMAL(6,4) | NOT NULL | % avance físico acumulado (0-1) |
| planned_financial_pct | DECIMAL(6,4) | NOT NULL | % avance financiero acumulado (0-1) |
| actual_physical_pct | DECIMAL(6,4) | nullable | |
| actual_financial_pct | DECIMAL(6,4) | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**Restricción:** `UNIQUE(financial_projection_id, period_number)`

---

### DOMINIO 10 — Colaboración y Auditoría

---

#### `comments`
Comentarios en cualquier entidad del sistema (polimórfico).

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| project_id | UUID | FK → projects, NOT NULL | Desnormalizado para RLS |
| author_user_id | UUID | FK → users, NOT NULL | |
| entity_type | ENUM | NOT NULL | `PROJECT`, `BUDGET`, `BUDGET_SECTION`, `BUDGET_ITEM`, `APU`, `TENDER` |
| entity_id | UUID | NOT NULL | ID polimórfico de la entidad |
| parent_comment_id | UUID | FK → comments, nullable | Hilos de comentarios |
| content | TEXT | NOT NULL | |
| is_resolved | BOOLEAN | DEFAULT false | |
| resolved_by_user_id | UUID | FK → users, nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL | |
| deleted_at | TIMESTAMPTZ | nullable | |

---

#### `notifications`
Notificaciones en app para usuarios individuales.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK → users, NOT NULL | Destinatario |
| organization_id | UUID | FK → organizations, NOT NULL | |
| type | ENUM | NOT NULL | `COMMENT_MENTION`, `PROJECT_SHARED`, `BUDGET_APPROVED`, `EXPORT_READY`, `SUBSCRIPTION_EXPIRING`, `PRICE_UPDATE_ALERT` |
| title | VARCHAR(255) | NOT NULL | |
| message | TEXT | NOT NULL | |
| link_url | TEXT | nullable | URL de destino |
| entity_type | VARCHAR(50) | nullable | |
| entity_id | UUID | nullable | |
| is_read | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| read_at | TIMESTAMPTZ | nullable | |

---

#### `activity_logs`
Log de actividad de usuario por proyecto (no es auditoría de seguridad).

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| user_id | UUID | FK → users, NOT NULL | |
| project_id | UUID | FK → projects, nullable | |
| action | VARCHAR(100) | NOT NULL | ej: `budget.item.created`, `document.exported` |
| entity_type | VARCHAR(50) | NOT NULL | |
| entity_id | UUID | NOT NULL | |
| metadata | JSONB | DEFAULT '{}' | Contexto adicional |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

#### `audit_logs`
Registro inmutable de acciones sensibles (compliance GDPR/LGPD).

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, nullable | null = acción de sistema |
| user_id | UUID | FK → users, nullable | |
| action | VARCHAR(150) | NOT NULL | ej: `user.delete`, `data.export_all`, `subscription.cancel` |
| resource_type | VARCHAR(50) | NOT NULL | |
| resource_id | TEXT | NOT NULL | |
| before_state | JSONB | nullable | Estado previo |
| after_state | JSONB | nullable | Estado posterior |
| ip_address | INET | nullable | |
| user_agent | TEXT | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

> `audit_logs` es append-only. Ningún UPDATE ni DELETE está permitido sobre esta tabla.

---

### DOMINIO 11 — Jobs de IA

---

#### `ai_jobs`
Trabajos de procesamiento de IA ejecutados de forma asíncrona.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| organization_id | UUID | FK → organizations, NOT NULL | |
| created_by_user_id | UUID | FK → users, NOT NULL | |
| job_type | ENUM | NOT NULL | `INTAKE_EXTRACTION`, `APU_GENERATION`, `DOCUMENT_ANALYSIS`, `PRICE_SUGGESTION`, `S_CURVE_GENERATION` |
| status | ENUM | NOT NULL DEFAULT 'QUEUED' | `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`, `CANCELED` |
| input_data | JSONB | NOT NULL | Datos de entrada al modelo |
| output_data | JSONB | nullable | Resultado del modelo |
| model_used | VARCHAR(100) | nullable | ej: `claude-sonnet-4-6` |
| input_tokens | INTEGER | DEFAULT 0 | |
| output_tokens | INTEGER | DEFAULT 0 | |
| error_message | TEXT | nullable | |
| reference_type | VARCHAR(50) | nullable | Entidad relacionada |
| reference_id | UUID | nullable | ID de la entidad relacionada |
| started_at | TIMESTAMPTZ | nullable | |
| completed_at | TIMESTAMPTZ | nullable | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

## 5. Relaciones Clave

| Relación | Cardinalidad | Notas |
|---|---|---|
| organizations → organization_members | 1:N | Una org tiene muchos miembros |
| users → organization_members | 1:N | Un user puede estar en varias orgs |
| organizations → projects | 1:N | Una org tiene muchos proyectos |
| projects → budgets | 1:N | Un proyecto puede tener versiones de presupuesto |
| budgets → budget_sections | 1:N | Un presupuesto tiene capítulos |
| budget_sections → budget_sections | 1:N | Autorreferencia para subsecciones |
| budget_sections → budget_items | 1:N | Cada sección tiene partidas |
| budget_items → apu_analyses | 1:1 | Una partida = un APU |
| apu_analyses → apu_components | 1:N | Un APU tiene múltiples recursos |
| apu_components → price_items | N:1 | Muchos componentes referencian un ítem |
| price_items → price_records | 1:N | Un ítem tiene muchos registros de precio por región/fecha |
| regions → price_records | 1:N | Una región tiene muchos precios |
| projects → intake_sessions | 1:N | Un proyecto puede tener varias sesiones |
| intake_sessions → intake_messages | 1:N | Una sesión tiene muchos mensajes |
| intake_sessions → intake_extractions | 1:1 | Una sesión produce una extracción |
| projects → tenders | 1:N | Un proyecto puede participar en varias licitaciones |
| tenders → tender_requirements | 1:N | Una licitación tiene N requisitos |
| tenders → tender_proposals | 1:N | Una licitación puede tener versiones de propuesta |
| budgets → financial_projections | 1:N | Un presupuesto puede tener varias proyecciones |
| financial_projections → cash_flow_entries | 1:N | Una proyección tiene N períodos de flujo |
| financial_projections → s_curve_entries | 1:N | Una proyección tiene N puntos de curva S |
| organizations → subscriptions | 1:1 | Una org tiene una suscripción activa |
| organizations → ai_credit_ledger | 1:N | Historial de créditos append-only |

---

## 6. Índices

### Índices por consulta frecuente

```
-- Auth y membresía
idx_org_members_org_id         ON organization_members(organization_id)
idx_org_members_user_id        ON organization_members(user_id)
idx_invitations_token          ON invitations(token)
idx_invitations_email_org      ON invitations(email, organization_id)

-- Proyectos
idx_projects_org_status        ON projects(organization_id, status)
idx_projects_org_created       ON projects(organization_id, created_at DESC)

-- Presupuesto
idx_budgets_project_id         ON budgets(project_id)
idx_budget_sections_budget     ON budget_sections(budget_id, display_order)
idx_budget_items_section       ON budget_items(budget_section_id, display_order)
idx_budget_items_budget        ON budget_items(budget_id)
idx_apu_budget_item            ON apu_analyses(budget_item_id)
idx_apu_components_apu         ON apu_components(apu_analysis_id, display_order)

-- Precios
idx_price_records_lookup       ON price_records(price_item_id, region_id, valid_from DESC)
idx_price_records_valid        ON price_records(valid_until) WHERE valid_until IS NULL
idx_org_price_overrides_org    ON org_price_overrides(organization_id, valid_from DESC)

-- Intake
idx_intake_sessions_project    ON intake_sessions(project_id)
idx_intake_messages_session    ON intake_messages(intake_session_id, sequence_number)

-- Suscripciones y créditos
idx_subscriptions_org          ON subscriptions(organization_id)
idx_subscriptions_status       ON subscriptions(status, current_period_end)
idx_ai_credit_ledger_org       ON ai_credit_ledger(organization_id, created_at DESC)

-- Jobs de IA
idx_ai_jobs_org_status         ON ai_jobs(organization_id, status)
idx_ai_jobs_reference          ON ai_jobs(reference_type, reference_id)

-- Documentos y exports
idx_documents_project          ON documents(project_id, created_at DESC)
idx_export_jobs_budget_status  ON export_jobs(budget_id, status)

-- Colaboración
idx_comments_entity            ON comments(entity_type, entity_id)
idx_notifications_user_unread  ON notifications(user_id, is_read) WHERE is_read = false
idx_activity_logs_project      ON activity_logs(project_id, created_at DESC)
idx_audit_logs_org_created     ON audit_logs(organization_id, created_at DESC)

-- Búsqueda vectorial (pgvector)
idx_price_items_embedding      ON price_items USING hnsw (embedding vector_cosine_ops)
```

### Índices de texto completo

```
-- Búsqueda de proyectos por nombre
idx_projects_name_fts          ON projects USING gin(to_tsvector('spanish', name))

-- Búsqueda de partidas por nombre
idx_budget_items_name_fts      ON budget_items USING gin(to_tsvector('spanish', name))

-- Búsqueda de ítems del catálogo
idx_price_items_name_fts       ON price_items USING gin(to_tsvector('spanish', name || ' ' || COALESCE(description, '')))
```

---

## 7. Prisma Schema

```prisma
// schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions", "multiSchema"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [uuidOssp(map: "uuid-ossp"), pgvector(map: "vector")]
}

// ─── ENUMS ────────────────────────────────────────────────────────────────────

enum AuthProvider {
  CLERK
  AUTH0
  EMAIL
}

enum MemberRole {
  OWNER
  ADMIN
  EDITOR
  REVIEWER
  VIEWER
}

enum PlanName {
  free
  starter
  professional
  enterprise
}

enum SubscriptionStatus {
  ACTIVE
  TRIALING
  PAST_DUE
  CANCELED
  EXPIRED
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

enum PaymentProvider {
  STRIPE
  PAYPAL
  MANUAL
}

enum CreditReason {
  MONTHLY_REFILL
  USED_INTAKE
  USED_APU_GENERATION
  USED_EXPORT
  PURCHASED
  ADMIN_ADJUSTMENT
}

enum ProjectType {
  VIAL
  EDIFICACION
  HIDRAULICA
  SANEAMIENTO
  ELECTRICO
  TOPOGRAFIA
  MINERO
  OTRO
}

enum ProjectStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
  ARCHIVED
}

enum IntakeStatus {
  ACTIVE
  COMPLETED
  ABANDONED
}

enum IntakeInputType {
  TEXT
  VOICE
  DOCUMENT
  MIXED
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

enum BudgetStatus {
  DRAFT
  REVIEW
  APPROVED
  EXPORTED
}

enum PriceSource {
  APU_GENERATED
  MANUAL
  CATALOG
}

enum ComponentType {
  MATERIAL
  LABOR
  EQUIPMENT
  TOOLS
  SUBCONTRACT
}

enum PriceRecordSource {
  OFFICIAL
  CAPECO
  CAMACOL
  INVIAS
  INE
  MANUAL
  USER_SUBMITTED
}

enum RegionLevel {
  COUNTRY
  STATE
  CITY
}

enum PriceIndexCategory {
  GENERAL
  MATERIALS
  LABOR
  EQUIPMENT
}

enum DocumentType {
  BUDGET_EXCEL
  BUDGET_PDF
  APU_SHEET
  TENDER_PROPOSAL
  MEMORY_CALC
}

enum DocumentFormat {
  EXCEL
  PDF
  DOCX
}

enum ExportJobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
}

enum TenderEntityType {
  GOBIERNO_CENTRAL
  GOBIERNO_REGIONAL
  MUNICIPALIDAD
  EMPRESA_PRIVADA
}

enum TenderType {
  LICITACION_PUBLICA
  CONCURSO_PUBLICO
  ADJUDICACION_DIRECTA
  COMPRA_DIRECTA
}

enum TenderStatus {
  DRAFT
  IN_PROGRESS
  SUBMITTED
  WON
  LOST
  CANCELED
}

enum RequirementType {
  ADMINISTRATIVE
  TECHNICAL
  FINANCIAL
  LEGAL
}

enum ProposalStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  ACCEPTED
  REJECTED
}

enum NotificationType {
  COMMENT_MENTION
  PROJECT_SHARED
  BUDGET_APPROVED
  EXPORT_READY
  SUBSCRIPTION_EXPIRING
  PRICE_UPDATE_ALERT
}

enum CommentEntityType {
  PROJECT
  BUDGET
  BUDGET_SECTION
  BUDGET_ITEM
  APU
  TENDER
}

enum AiJobType {
  INTAKE_EXTRACTION
  APU_GENERATION
  DOCUMENT_ANALYSIS
  PRICE_SUGGESTION
  S_CURVE_GENERATION
}

enum AiJobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  CANCELED
}

// ─── MODELOS ──────────────────────────────────────────────────────────────────

model User {
  id               String      @id @default(uuid()) @db.Uuid
  email            String      @unique @db.VarChar(255)
  name             String      @db.VarChar(255)
  avatarUrl        String?     @map("avatar_url")
  authProvider     AuthProvider @map("auth_provider")
  authProviderId   String?     @unique @map("auth_provider_id") @db.VarChar(255)
  preferredLanguage String     @default("es") @map("preferred_language") @db.Char(2)
  timezone         String      @default("America/Lima") @db.VarChar(64)
  createdAt        DateTime    @default(now()) @map("created_at") @db.Timestamptz
  updatedAt        DateTime    @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt        DateTime?   @map("deleted_at") @db.Timestamptz

  memberships      OrganizationMember[]
  invitationsSent  Invitation[]          @relation("InvitedBy")
  projectMembers   ProjectMember[]
  intakeSessions   IntakeSession[]
  budgetApprovals  Budget[]              @relation("ApprovedBy")
  exportJobs       ExportJob[]
  tenderProposals  TenderProposal[]
  aiJobs           AiJob[]
  comments         Comment[]
  notifications    Notification[]
  activityLogs     ActivityLog[]
  creditEntries    AiCreditLedger[]
  priceVerifications PriceRecord[]      @relation("VerifiedBy")
  orgPriceOverrides  OrgPriceOverride[]

  @@map("users")
}

model Organization {
  id              String    @id @default(uuid()) @db.Uuid
  slug            String    @unique @db.VarChar(63)
  name            String    @db.VarChar(255)
  legalName       String?   @map("legal_name") @db.VarChar(255)
  taxId           String?   @map("tax_id") @db.VarChar(30)
  countryCode     String    @map("country_code") @db.Char(2)
  regionId        String?   @map("region_id") @db.Uuid
  logoUrl         String?   @map("logo_url")
  defaultCurrency String    @default("USD") @map("default_currency") @db.Char(3)
  defaultTaxRate  Decimal   @default(0.18) @map("default_tax_rate") @db.Decimal(5, 4)
  settings        Json      @default("{}") @db.JsonB
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt       DateTime? @map("deleted_at") @db.Timestamptz

  region          Region?             @relation(fields: [regionId], references: [id])
  members         OrganizationMember[]
  invitations     Invitation[]
  subscription    Subscription?
  creditLedger    AiCreditLedger[]
  projects        Project[]
  documentTemplates DocumentTemplate[]
  documents       Document[]
  exportJobs      ExportJob[]
  orgPriceOverrides OrgPriceOverride[]
  aiJobs          AiJob[]
  activityLogs    ActivityLog[]
  auditLogs       AuditLog[]
  notifications   Notification[]

  @@map("organizations")
}

model OrganizationMember {
  id             String     @id @default(uuid()) @db.Uuid
  organizationId String     @map("organization_id") @db.Uuid
  userId         String     @map("user_id") @db.Uuid
  role           MemberRole
  invitedByUserId String?   @map("invited_by_user_id") @db.Uuid
  joinedAt       DateTime   @default(now()) @map("joined_at") @db.Timestamptz
  createdAt      DateTime   @default(now()) @map("created_at") @db.Timestamptz
  updatedAt      DateTime   @updatedAt @map("updated_at") @db.Timestamptz

  organization   Organization @relation(fields: [organizationId], references: [id])
  user           User         @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
  @@map("organization_members")
}

model Invitation {
  id             String     @id @default(uuid()) @db.Uuid
  organizationId String     @map("organization_id") @db.Uuid
  email          String     @db.VarChar(255)
  role           MemberRole
  token          String     @unique @db.VarChar(64)
  invitedByUserId String    @map("invited_by_user_id") @db.Uuid
  expiresAt      DateTime   @map("expires_at") @db.Timestamptz
  acceptedAt     DateTime?  @map("accepted_at") @db.Timestamptz
  createdAt      DateTime   @default(now()) @map("created_at") @db.Timestamptz

  organization   Organization @relation(fields: [organizationId], references: [id])
  invitedBy      User         @relation("InvitedBy", fields: [invitedByUserId], references: [id])

  @@map("invitations")
}

model Plan {
  id                 String   @id @default(uuid()) @db.Uuid
  name               PlanName @unique
  displayName        String   @map("display_name") @db.VarChar(100)
  priceUsdMonthly    Decimal  @map("price_usd_monthly") @db.Decimal(10, 2)
  priceUsdYearly     Decimal  @map("price_usd_yearly") @db.Decimal(10, 2)
  maxProjects        Int?     @map("max_projects")
  maxUsers           Int?     @map("max_users")
  maxExportsMonthly  Int?     @map("max_exports_monthly")
  aiCreditsMonthly   Int?     @map("ai_credits_monthly")
  features           Json     @default("{}") @db.JsonB
  isActive           Boolean  @default(true) @map("is_active")
  createdAt          DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt          DateTime @updatedAt @map("updated_at") @db.Timestamptz

  subscriptions      Subscription[]

  @@map("plans")
}

model Subscription {
  id                    String             @id @default(uuid()) @db.Uuid
  organizationId        String             @unique @map("organization_id") @db.Uuid
  planId                String             @map("plan_id") @db.Uuid
  status                SubscriptionStatus
  billingCycle          BillingCycle       @map("billing_cycle")
  currentPeriodStart    DateTime           @map("current_period_start") @db.Timestamptz
  currentPeriodEnd      DateTime           @map("current_period_end") @db.Timestamptz
  trialEndsAt           DateTime?          @map("trial_ends_at") @db.Timestamptz
  canceledAt            DateTime?          @map("canceled_at") @db.Timestamptz
  paymentProvider       PaymentProvider?   @map("payment_provider")
  paymentProviderSubId  String?            @map("payment_provider_sub_id") @db.VarChar(255)
  createdAt             DateTime           @default(now()) @map("created_at") @db.Timestamptz
  updatedAt             DateTime           @updatedAt @map("updated_at") @db.Timestamptz

  organization          Organization @relation(fields: [organizationId], references: [id])
  plan                  Plan         @relation(fields: [planId], references: [id])

  @@map("subscriptions")
}

model AiCreditLedger {
  id            String       @id @default(uuid()) @db.Uuid
  organizationId String      @map("organization_id") @db.Uuid
  amount        Int
  balanceAfter  Int          @map("balance_after")
  reason        CreditReason
  referenceId   String?      @map("reference_id") @db.Uuid
  createdByUserId String?    @map("created_by_user_id") @db.Uuid
  createdAt     DateTime     @default(now()) @map("created_at") @db.Timestamptz

  organization  Organization @relation(fields: [organizationId], references: [id])
  createdBy     User?        @relation(fields: [createdByUserId], references: [id])

  @@map("ai_credit_ledger")
}

model Region {
  id           String      @id @default(uuid()) @db.Uuid
  countryCode  String      @map("country_code") @db.Char(2)
  countryName  String      @map("country_name") @db.VarChar(100)
  divisionCode String?     @map("division_code") @db.VarChar(20)
  divisionName String?     @map("division_name") @db.VarChar(100)
  divisionLevel RegionLevel @map("division_level")
  parentId     String?     @map("parent_id") @db.Uuid
  isActive     Boolean     @default(true) @map("is_active")

  parent       Region?     @relation("RegionHierarchy", fields: [parentId], references: [id])
  children     Region[]    @relation("RegionHierarchy")
  organizations Organization[]
  projects     Project[]
  apuAnalyses  ApuAnalysis[]
  priceRecords PriceRecord[]

  @@map("regions")
}

model Project {
  id                String        @id @default(uuid()) @db.Uuid
  organizationId    String        @map("organization_id") @db.Uuid
  createdByUserId   String        @map("created_by_user_id") @db.Uuid
  code              String        @db.VarChar(20)
  name              String        @db.VarChar(255)
  description       String?
  projectType       ProjectType   @map("project_type")
  status            ProjectStatus @default(DRAFT)
  regionId          String?       @map("region_id") @db.Uuid
  address           String?
  coordinates       Json?         @db.JsonB
  startDate         DateTime?     @map("start_date") @db.Date
  endDate           DateTime?     @map("end_date") @db.Date
  specialConditions Json          @default("{}") @map("special_conditions") @db.JsonB
  currency          String        @default("USD") @db.Char(3)
  createdAt         DateTime      @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime      @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt         DateTime?     @map("deleted_at") @db.Timestamptz

  organization      Organization    @relation(fields: [organizationId], references: [id])
  region            Region?         @relation(fields: [regionId], references: [id])
  members           ProjectMember[]
  intakeSessions    IntakeSession[]
  budgets           Budget[]
  tenders           Tender[]
  documents         Document[]
  comments          Comment[]
  activityLogs      ActivityLog[]

  @@unique([organizationId, code])
  @@map("projects")
}

model ProjectMember {
  id              String     @id @default(uuid()) @db.Uuid
  projectId       String     @map("project_id") @db.Uuid
  organizationId  String     @map("organization_id") @db.Uuid
  userId          String     @map("user_id") @db.Uuid
  role            MemberRole
  addedByUserId   String     @map("added_by_user_id") @db.Uuid
  createdAt       DateTime   @default(now()) @map("created_at") @db.Timestamptz

  project         Project      @relation(fields: [projectId], references: [id])
  user            User         @relation(fields: [userId], references: [id])

  @@unique([projectId, userId])
  @@map("project_members")
}

model IntakeSession {
  id                String          @id @default(uuid()) @db.Uuid
  projectId         String          @map("project_id") @db.Uuid
  organizationId    String          @map("organization_id") @db.Uuid
  createdByUserId   String          @map("created_by_user_id") @db.Uuid
  status            IntakeStatus    @default(ACTIVE)
  inputType         IntakeInputType @map("input_type")
  rawInputText      String?         @map("raw_input_text")
  inputDocumentUrl  String?         @map("input_document_url")
  aiModelUsed       String?         @map("ai_model_used") @db.VarChar(100)
  aiTokensUsed      Int             @default(0) @map("ai_tokens_used")
  createdAt         DateTime        @default(now()) @map("created_at") @db.Timestamptz
  completedAt       DateTime?       @map("completed_at") @db.Timestamptz

  project           Project          @relation(fields: [projectId], references: [id])
  createdBy         User             @relation(fields: [createdByUserId], references: [id])
  messages          IntakeMessage[]
  extraction        IntakeExtraction?

  @@map("intake_sessions")
}

model IntakeMessage {
  id               String      @id @default(uuid()) @db.Uuid
  intakeSessionId  String      @map("intake_session_id") @db.Uuid
  organizationId   String      @map("organization_id") @db.Uuid
  role             MessageRole
  content          String
  tokensUsed       Int?        @map("tokens_used")
  sequenceNumber   Int         @map("sequence_number")
  createdAt        DateTime    @default(now()) @map("created_at") @db.Timestamptz

  session          IntakeSession @relation(fields: [intakeSessionId], references: [id])

  @@unique([intakeSessionId, sequenceNumber])
  @@map("intake_messages")
}

model IntakeExtraction {
  id               String    @id @default(uuid()) @db.Uuid
  intakeSessionId  String    @unique @map("intake_session_id") @db.Uuid
  organizationId   String    @map("organization_id") @db.Uuid
  extractedData    Json      @map("extracted_data") @db.JsonB
  confidenceScore  Decimal?  @map("confidence_score") @db.Decimal(4, 3)
  reviewedByUserId String?   @map("reviewed_by_user_id") @db.Uuid
  reviewedAt       DateTime? @map("reviewed_at") @db.Timestamptz
  createdAt        DateTime  @default(now()) @map("created_at") @db.Timestamptz

  session          IntakeSession @relation(fields: [intakeSessionId], references: [id])

  @@map("intake_extractions")
}

model Budget {
  id                String       @id @default(uuid()) @db.Uuid
  projectId         String       @map("project_id") @db.Uuid
  organizationId    String       @map("organization_id") @db.Uuid
  name              String       @default("Presupuesto Base") @db.VarChar(255)
  status            BudgetStatus @default(DRAFT)
  currency          String       @db.Char(3)
  taxRate           Decimal      @default(0.18) @map("tax_rate") @db.Decimal(5, 4)
  overheadPct       Decimal      @default(0.10) @map("overhead_pct") @db.Decimal(5, 4)
  profitPct         Decimal      @default(0.08) @map("profit_pct") @db.Decimal(5, 4)
  contingencyPct    Decimal      @default(0.05) @map("contingency_pct") @db.Decimal(5, 4)
  baseCost          Decimal      @default(0) @map("base_cost") @db.Decimal(18, 2)
  overheadAmount    Decimal      @default(0) @map("overhead_amount") @db.Decimal(18, 2)
  profitAmount      Decimal      @default(0) @map("profit_amount") @db.Decimal(18, 2)
  contingencyAmount Decimal      @default(0) @map("contingency_amount") @db.Decimal(18, 2)
  taxAmount         Decimal      @default(0) @map("tax_amount") @db.Decimal(18, 2)
  totalAmount       Decimal      @default(0) @map("total_amount") @db.Decimal(18, 2)
  notes             String?
  approvedByUserId  String?      @map("approved_by_user_id") @db.Uuid
  approvedAt        DateTime?    @map("approved_at") @db.Timestamptz
  createdAt         DateTime     @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime     @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt         DateTime?    @map("deleted_at") @db.Timestamptz

  project              Project               @relation(fields: [projectId], references: [id])
  approvedBy           User?                 @relation("ApprovedBy", fields: [approvedByUserId], references: [id])
  sections             BudgetSection[]
  items                BudgetItem[]
  documents            Document[]
  exportJobs           ExportJob[]
  tenders              Tender[]
  tenderProposals      TenderProposal[]
  financialProjections FinancialProjection[]

  @@map("budgets")
}

model BudgetSection {
  id              String    @id @default(uuid()) @db.Uuid
  budgetId        String    @map("budget_id") @db.Uuid
  organizationId  String    @map("organization_id") @db.Uuid
  parentSectionId String?   @map("parent_section_id") @db.Uuid
  code            String    @db.VarChar(20)
  name            String    @db.VarChar(255)
  displayOrder    Int       @default(0) @map("display_order")
  subtotal        Decimal   @default(0) @db.Decimal(18, 2)
  notes           String?
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  budget          Budget          @relation(fields: [budgetId], references: [id])
  parent          BudgetSection?  @relation("SectionHierarchy", fields: [parentSectionId], references: [id])
  children        BudgetSection[] @relation("SectionHierarchy")
  items           BudgetItem[]

  @@unique([budgetId, code])
  @@map("budget_sections")
}

model BudgetItem {
  id              String      @id @default(uuid()) @db.Uuid
  budgetSectionId String      @map("budget_section_id") @db.Uuid
  budgetId        String      @map("budget_id") @db.Uuid
  organizationId  String      @map("organization_id") @db.Uuid
  code            String      @db.VarChar(20)
  name            String      @db.VarChar(255)
  description     String?
  unit            String      @db.VarChar(20)
  quantity        Decimal     @default(0) @db.Decimal(14, 4)
  unitPrice       Decimal     @default(0) @map("unit_price") @db.Decimal(14, 4)
  totalPrice      Decimal     @default(0) @map("total_price") @db.Decimal(18, 2)
  priceSource     PriceSource @default(APU_GENERATED) @map("price_source")
  displayOrder    Int         @default(0) @map("display_order")
  isAiGenerated   Boolean     @default(false) @map("is_ai_generated")
  aiConfidence    Decimal?    @map("ai_confidence") @db.Decimal(4, 3)
  notes           String?
  createdAt       DateTime    @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime    @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt       DateTime?   @map("deleted_at") @db.Timestamptz

  section         BudgetSection @relation(fields: [budgetSectionId], references: [id])
  budget          Budget        @relation(fields: [budgetId], references: [id])
  apuAnalysis     ApuAnalysis?

  @@unique([budgetId, code])
  @@map("budget_items")
}

model ApuAnalysis {
  id             String    @id @default(uuid()) @db.Uuid
  budgetItemId   String    @unique @map("budget_item_id") @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  unit           String    @db.VarChar(20)
  outputQuantity Decimal   @default(1) @map("output_quantity") @db.Decimal(10, 4)
  workHours      Decimal?  @map("work_hours") @db.Decimal(10, 4)
  materialsCost  Decimal   @default(0) @map("materials_cost") @db.Decimal(14, 4)
  laborCost      Decimal   @default(0) @map("labor_cost") @db.Decimal(14, 4)
  equipmentCost  Decimal   @default(0) @map("equipment_cost") @db.Decimal(14, 4)
  toolsCost      Decimal   @default(0) @map("tools_cost") @db.Decimal(14, 4)
  subtotalCost   Decimal   @default(0) @map("subtotal_cost") @db.Decimal(14, 4)
  regionId       String?   @map("region_id") @db.Uuid
  priceDate      DateTime? @map("price_date") @db.Date
  isAiGenerated  Boolean   @default(false) @map("is_ai_generated")
  aiModelUsed    String?   @map("ai_model_used") @db.VarChar(100)
  aiTokensUsed   Int       @default(0) @map("ai_tokens_used")
  notes          String?
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  budgetItem     BudgetItem     @relation(fields: [budgetItemId], references: [id])
  region         Region?        @relation(fields: [regionId], references: [id])
  components     ApuComponent[]

  @@map("apu_analyses")
}

model ApuComponent {
  id            String        @id @default(uuid()) @db.Uuid
  apuAnalysisId String        @map("apu_analysis_id") @db.Uuid
  organizationId String       @map("organization_id") @db.Uuid
  componentType ComponentType @map("component_type")
  priceItemId   String?       @map("price_item_id") @db.Uuid
  code          String?       @db.VarChar(30)
  description   String        @db.VarChar(255)
  unit          String        @db.VarChar(20)
  quantity      Decimal       @db.Decimal(14, 6)
  unitPrice     Decimal       @map("unit_price") @db.Decimal(14, 4)
  totalPrice    Decimal       @map("total_price") @db.Decimal(14, 4)
  displayOrder  Int           @default(0) @map("display_order")
  createdAt     DateTime      @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime      @updatedAt @map("updated_at") @db.Timestamptz

  apuAnalysis   ApuAnalysis @relation(fields: [apuAnalysisId], references: [id])
  priceItem     PriceItem?  @relation(fields: [priceItemId], references: [id])

  @@map("apu_components")
}

model PriceCategory {
  id               String         @id @default(uuid()) @db.Uuid
  name             String         @db.VarChar(100)
  parentCategoryId String?        @map("parent_category_id") @db.Uuid
  componentType    ComponentType  @map("component_type")
  displayOrder     Int            @default(0) @map("display_order")
  isActive         Boolean        @default(true) @map("is_active")

  parent           PriceCategory?  @relation("CategoryHierarchy", fields: [parentCategoryId], references: [id])
  children         PriceCategory[] @relation("CategoryHierarchy")
  items            PriceItem[]

  @@map("price_categories")
}

model PriceItem {
  id             String        @id @default(uuid()) @db.Uuid
  categoryId     String        @map("category_id") @db.Uuid
  code           String        @unique @db.VarChar(30)
  name           String        @db.VarChar(255)
  description    String?
  unit           String        @db.VarChar(20)
  componentType  ComponentType @map("component_type")
  specifications Json          @default("{}") @db.JsonB
  isActive       Boolean       @default(true) @map("is_active")
  createdAt      DateTime      @default(now()) @map("created_at") @db.Timestamptz
  updatedAt      DateTime      @updatedAt @map("updated_at") @db.Timestamptz

  category       PriceCategory    @relation(fields: [categoryId], references: [id])
  priceRecords   PriceRecord[]
  apuComponents  ApuComponent[]
  orgOverrides   OrgPriceOverride[]

  @@map("price_items")
}

model PriceRecord {
  id               String            @id @default(uuid()) @db.Uuid
  priceItemId      String            @map("price_item_id") @db.Uuid
  regionId         String            @map("region_id") @db.Uuid
  price            Decimal           @db.Decimal(14, 4)
  currency         String            @db.Char(3)
  validFrom        DateTime          @map("valid_from") @db.Date
  validUntil       DateTime?         @map("valid_until") @db.Date
  source           PriceRecordSource
  sourceReference  String?           @map("source_reference")
  isVerified       Boolean           @default(false) @map("is_verified")
  verifiedByUserId String?           @map("verified_by_user_id") @db.Uuid
  createdAt        DateTime          @default(now()) @map("created_at") @db.Timestamptz

  priceItem        PriceItem @relation(fields: [priceItemId], references: [id])
  region           Region    @relation(fields: [regionId], references: [id])
  verifiedBy       User?     @relation("VerifiedBy", fields: [verifiedByUserId], references: [id])

  @@map("price_records")
}

model PriceIndex {
  id                 String              @id @default(uuid()) @db.Uuid
  name               String              @db.VarChar(150)
  countryCode        String              @map("country_code") @db.Char(2)
  category           PriceIndexCategory
  sourceOrganization String              @map("source_organization") @db.VarChar(100)
  indexValue         Decimal             @map("index_value") @db.Decimal(10, 4)
  basePeriod         String              @map("base_period") @db.VarChar(50)
  periodDate         DateTime            @map("period_date") @db.Date
  createdAt          DateTime            @default(now()) @map("created_at") @db.Timestamptz

  @@map("price_indices")
}

model OrgPriceOverride {
  id              String    @id @default(uuid()) @db.Uuid
  organizationId  String    @map("organization_id") @db.Uuid
  priceItemId     String?   @map("price_item_id") @db.Uuid
  code            String?   @db.VarChar(30)
  description     String    @db.VarChar(255)
  unit            String    @db.VarChar(20)
  price           Decimal   @db.Decimal(14, 4)
  currency        String    @db.Char(3)
  validFrom       DateTime  @map("valid_from") @db.Date
  validUntil      DateTime? @map("valid_until") @db.Date
  notes           String?
  createdByUserId String    @map("created_by_user_id") @db.Uuid
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  organization    Organization @relation(fields: [organizationId], references: [id])
  priceItem       PriceItem?   @relation(fields: [priceItemId], references: [id])
  createdBy       User         @relation(fields: [createdByUserId], references: [id])

  @@map("org_price_overrides")
}

model DocumentTemplate {
  id              String         @id @default(uuid()) @db.Uuid
  organizationId  String?        @map("organization_id") @db.Uuid
  name            String         @db.VarChar(255)
  description     String?
  documentType    DocumentType   @map("document_type")
  format          DocumentFormat
  countryCode     String?        @map("country_code") @db.Char(2)
  templateFileUrl String         @map("template_file_url")
  templateSchema  Json           @default("{}") @map("template_schema") @db.JsonB
  isDefault       Boolean        @default(false) @map("is_default")
  isActive        Boolean        @default(true) @map("is_active")
  createdByUserId String?        @map("created_by_user_id") @db.Uuid
  createdAt       DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime       @updatedAt @map("updated_at") @db.Timestamptz

  organization    Organization? @relation(fields: [organizationId], references: [id])
  documents       Document[]
  exportJobs      ExportJob[]

  @@map("document_templates")
}

model Document {
  id              String         @id @default(uuid()) @db.Uuid
  organizationId  String         @map("organization_id") @db.Uuid
  projectId       String         @map("project_id") @db.Uuid
  budgetId        String?        @map("budget_id") @db.Uuid
  tenderId        String?        @map("tender_id") @db.Uuid
  createdByUserId String         @map("created_by_user_id") @db.Uuid
  templateId      String?        @map("template_id") @db.Uuid
  name            String         @db.VarChar(255)
  documentType    DocumentType   @map("document_type")
  format          DocumentFormat
  fileUrl         String         @map("file_url")
  fileSizeBytes   Int            @map("file_size_bytes")
  isWatermarked   Boolean        @default(false) @map("is_watermarked")
  expiresAt       DateTime?      @map("expires_at") @db.Timestamptz
  downloadCount   Int            @default(0) @map("download_count")
  createdAt       DateTime       @default(now()) @map("created_at") @db.Timestamptz

  organization    Organization      @relation(fields: [organizationId], references: [id])
  project         Project           @relation(fields: [projectId], references: [id])
  budget          Budget?           @relation(fields: [budgetId], references: [id])
  tender          Tender?           @relation(fields: [tenderId], references: [id])
  createdBy       User              @relation(fields: [createdByUserId], references: [id])
  template        DocumentTemplate? @relation(fields: [templateId], references: [id])
  exportJob       ExportJob?

  tenderProposals TenderProposal[]

  @@map("documents")
}

model ExportJob {
  id                String          @id @default(uuid()) @db.Uuid
  organizationId    String          @map("organization_id") @db.Uuid
  budgetId          String          @map("budget_id") @db.Uuid
  requestedByUserId String          @map("requested_by_user_id") @db.Uuid
  templateId        String?         @map("template_id") @db.Uuid
  status            ExportJobStatus @default(QUEUED)
  format            DocumentFormat
  options           Json            @default("{}") @db.JsonB
  resultDocumentId  String?         @unique @map("result_document_id") @db.Uuid
  errorMessage      String?         @map("error_message")
  startedAt         DateTime?       @map("started_at") @db.Timestamptz
  completedAt       DateTime?       @map("completed_at") @db.Timestamptz
  createdAt         DateTime        @default(now()) @map("created_at") @db.Timestamptz

  organization      Organization      @relation(fields: [organizationId], references: [id])
  budget            Budget            @relation(fields: [budgetId], references: [id])
  requestedBy       User              @relation(fields: [requestedByUserId], references: [id])
  template          DocumentTemplate? @relation(fields: [templateId], references: [id])
  resultDocument    Document?         @relation(fields: [resultDocumentId], references: [id])

  @@map("export_jobs")
}

model Tender {
  id                  String           @id @default(uuid()) @db.Uuid
  organizationId      String           @map("organization_id") @db.Uuid
  projectId           String           @map("project_id") @db.Uuid
  budgetId            String?          @map("budget_id") @db.Uuid
  createdByUserId     String           @map("created_by_user_id") @db.Uuid
  referenceCode       String?          @map("reference_code") @db.VarChar(100)
  name                String           @db.VarChar(255)
  entityName          String           @map("entity_name") @db.VarChar(255)
  entityType          TenderEntityType @map("entity_type")
  tenderType          TenderType       @map("tender_type")
  countryCode         String           @map("country_code") @db.Char(2)
  publicationDate     DateTime?        @map("publication_date") @db.Date
  submissionDeadline  DateTime?        @map("submission_deadline") @db.Timestamptz
  status              TenderStatus     @default(DRAFT)
  estimatedValue      Decimal?         @map("estimated_value") @db.Decimal(18, 2)
  currency            String?          @db.Char(3)
  notes               String?
  sourceDocumentsUrls Json             @default("[]") @map("source_documents_urls") @db.JsonB
  createdAt           DateTime         @default(now()) @map("created_at") @db.Timestamptz
  updatedAt           DateTime         @updatedAt @map("updated_at") @db.Timestamptz

  project             Project              @relation(fields: [projectId], references: [id])
  budget              Budget?              @relation(fields: [budgetId], references: [id])
  requirements        TenderRequirement[]
  proposals           TenderProposal[]
  documents           Document[]

  @@map("tenders")
}

model TenderRequirement {
  id              String          @id @default(uuid()) @db.Uuid
  tenderId        String          @map("tender_id") @db.Uuid
  organizationId  String          @map("organization_id") @db.Uuid
  description     String
  requirementType RequirementType @map("requirement_type")
  isMet           Boolean?        @map("is_met")
  notes           String?
  displayOrder    Int             @default(0) @map("display_order")
  createdAt       DateTime        @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime        @updatedAt @map("updated_at") @db.Timestamptz

  tender          Tender @relation(fields: [tenderId], references: [id])

  @@map("tender_requirements")
}

model TenderProposal {
  id                  String         @id @default(uuid()) @db.Uuid
  tenderId            String         @map("tender_id") @db.Uuid
  organizationId      String         @map("organization_id") @db.Uuid
  budgetId            String?        @map("budget_id") @db.Uuid
  submittedByUserId   String?        @map("submitted_by_user_id") @db.Uuid
  status              ProposalStatus @default(DRAFT)
  proposalAmount      Decimal?       @map("proposal_amount") @db.Decimal(18, 2)
  currency            String?        @db.Char(3)
  submissionDate      DateTime?      @map("submission_date") @db.Timestamptz
  resultDate          DateTime?      @map("result_date") @db.Date
  rejectionReason     String?        @map("rejection_reason")
  documentId          String?        @map("document_id") @db.Uuid
  createdAt           DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt           DateTime       @updatedAt @map("updated_at") @db.Timestamptz

  tender              Tender    @relation(fields: [tenderId], references: [id])
  budget              Budget?   @relation(fields: [budgetId], references: [id])
  submittedBy         User?     @relation(fields: [submittedByUserId], references: [id])
  document            Document? @relation(fields: [documentId], references: [id])

  @@map("tender_proposals")
}

model FinancialProjection {
  id                String    @id @default(uuid()) @db.Uuid
  projectId         String    @map("project_id") @db.Uuid
  budgetId          String    @map("budget_id") @db.Uuid
  organizationId    String    @map("organization_id") @db.Uuid
  createdByUserId   String    @map("created_by_user_id") @db.Uuid
  name              String    @default("Proyección Base") @db.VarChar(255)
  totalIncome       Decimal   @default(0) @map("total_income") @db.Decimal(18, 2)
  totalCost         Decimal   @default(0) @map("total_cost") @db.Decimal(18, 2)
  grossMargin       Decimal   @default(0) @map("gross_margin") @db.Decimal(18, 2)
  grossMarginPct    Decimal?  @map("gross_margin_pct") @db.Decimal(5, 4)
  netMarginPct      Decimal?  @map("net_margin_pct") @db.Decimal(5, 4)
  roi               Decimal?  @db.Decimal(8, 4)
  breakEvenPeriod   Int?      @map("break_even_period")
  notes             String?
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  budget            Budget            @relation(fields: [budgetId], references: [id])
  cashFlowEntries   CashFlowEntry[]
  sCurveEntries     SCurveEntry[]

  @@map("financial_projections")
}

model CashFlowEntry {
  id                    String    @id @default(uuid()) @db.Uuid
  financialProjectionId String    @map("financial_projection_id") @db.Uuid
  organizationId        String    @map("organization_id") @db.Uuid
  periodNumber          Int       @map("period_number")
  periodLabel           String    @map("period_label") @db.VarChar(50)
  periodStart           DateTime  @map("period_start") @db.Date
  periodEnd             DateTime  @map("period_end") @db.Date
  plannedIncome         Decimal   @default(0) @map("planned_income") @db.Decimal(14, 2)
  plannedExpense        Decimal   @default(0) @map("planned_expense") @db.Decimal(14, 2)
  plannedBalance        Decimal   @default(0) @map("planned_balance") @db.Decimal(14, 2)
  actualIncome          Decimal?  @map("actual_income") @db.Decimal(14, 2)
  actualExpense         Decimal?  @map("actual_expense") @db.Decimal(14, 2)
  actualBalance         Decimal?  @map("actual_balance") @db.Decimal(14, 2)
  notes                 String?
  createdAt             DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt             DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  projection            FinancialProjection @relation(fields: [financialProjectionId], references: [id])

  @@unique([financialProjectionId, periodNumber])
  @@map("cash_flow_entries")
}

model SCurveEntry {
  id                    String    @id @default(uuid()) @db.Uuid
  financialProjectionId String    @map("financial_projection_id") @db.Uuid
  organizationId        String    @map("organization_id") @db.Uuid
  periodNumber          Int       @map("period_number")
  periodLabel           String    @map("period_label") @db.VarChar(50)
  plannedPhysicalPct    Decimal   @map("planned_physical_pct") @db.Decimal(6, 4)
  plannedFinancialPct   Decimal   @map("planned_financial_pct") @db.Decimal(6, 4)
  actualPhysicalPct     Decimal?  @map("actual_physical_pct") @db.Decimal(6, 4)
  actualFinancialPct    Decimal?  @map("actual_financial_pct") @db.Decimal(6, 4)
  createdAt             DateTime  @default(now()) @map("created_at") @db.Timestamptz

  projection            FinancialProjection @relation(fields: [financialProjectionId], references: [id])

  @@unique([financialProjectionId, periodNumber])
  @@map("s_curve_entries")
}

model Comment {
  id                String            @id @default(uuid()) @db.Uuid
  organizationId    String            @map("organization_id") @db.Uuid
  projectId         String            @map("project_id") @db.Uuid
  authorUserId      String            @map("author_user_id") @db.Uuid
  entityType        CommentEntityType @map("entity_type")
  entityId          String            @map("entity_id") @db.Uuid
  parentCommentId   String?           @map("parent_comment_id") @db.Uuid
  content           String
  isResolved        Boolean           @default(false) @map("is_resolved")
  resolvedByUserId  String?           @map("resolved_by_user_id") @db.Uuid
  createdAt         DateTime          @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime          @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt         DateTime?         @map("deleted_at") @db.Timestamptz

  project           Project   @relation(fields: [projectId], references: [id])
  author            User      @relation(fields: [authorUserId], references: [id])
  parent            Comment?  @relation("CommentThread", fields: [parentCommentId], references: [id])
  replies           Comment[] @relation("CommentThread")

  @@map("comments")
}

model Notification {
  id             String           @id @default(uuid()) @db.Uuid
  userId         String           @map("user_id") @db.Uuid
  organizationId String           @map("organization_id") @db.Uuid
  type           NotificationType
  title          String           @db.VarChar(255)
  message        String
  linkUrl        String?          @map("link_url")
  entityType     String?          @map("entity_type") @db.VarChar(50)
  entityId       String?          @map("entity_id") @db.Uuid
  isRead         Boolean          @default(false) @map("is_read")
  createdAt      DateTime         @default(now()) @map("created_at") @db.Timestamptz
  readAt         DateTime?        @map("read_at") @db.Timestamptz

  user           User         @relation(fields: [userId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@map("notifications")
}

model ActivityLog {
  id             String    @id @default(uuid()) @db.Uuid
  organizationId String    @map("organization_id") @db.Uuid
  userId         String    @map("user_id") @db.Uuid
  projectId      String?   @map("project_id") @db.Uuid
  action         String    @db.VarChar(100)
  entityType     String    @map("entity_type") @db.VarChar(50)
  entityId       String    @map("entity_id") @db.Uuid
  metadata       Json      @default("{}") @db.JsonB
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz

  organization   Organization @relation(fields: [organizationId], references: [id])
  user           User         @relation(fields: [userId], references: [id])
  project        Project?     @relation(fields: [projectId], references: [id])

  @@map("activity_logs")
}

model AuditLog {
  id             String    @id @default(uuid()) @db.Uuid
  organizationId String?   @map("organization_id") @db.Uuid
  userId         String?   @map("user_id") @db.Uuid
  action         String    @db.VarChar(150)
  resourceType   String    @map("resource_type") @db.VarChar(50)
  resourceId     String    @map("resource_id")
  beforeState    Json?     @map("before_state") @db.JsonB
  afterState     Json?     @map("after_state") @db.JsonB
  ipAddress      String?   @map("ip_address")
  userAgent      String?   @map("user_agent")
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz

  organization   Organization? @relation(fields: [organizationId], references: [id])

  @@map("audit_logs")
}

model AiJob {
  id              String      @id @default(uuid()) @db.Uuid
  organizationId  String      @map("organization_id") @db.Uuid
  createdByUserId String      @map("created_by_user_id") @db.Uuid
  jobType         AiJobType   @map("job_type")
  status          AiJobStatus @default(QUEUED)
  inputData       Json        @map("input_data") @db.JsonB
  outputData      Json?       @map("output_data") @db.JsonB
  modelUsed       String?     @map("model_used") @db.VarChar(100)
  inputTokens     Int         @default(0) @map("input_tokens")
  outputTokens    Int         @default(0) @map("output_tokens")
  errorMessage    String?     @map("error_message")
  referenceType   String?     @map("reference_type") @db.VarChar(50)
  referenceId     String?     @map("reference_id") @db.Uuid
  startedAt       DateTime?   @map("started_at") @db.Timestamptz
  completedAt     DateTime?   @map("completed_at") @db.Timestamptz
  createdAt       DateTime    @default(now()) @map("created_at") @db.Timestamptz

  organization    Organization @relation(fields: [organizationId], references: [id])
  createdBy       User         @relation(fields: [createdByUserId], references: [id])

  @@map("ai_jobs")
}
```

---

## 8. Conteo de Entidades

| Dominio | Tablas | Notas |
|---|---|---|
| Identidad y Acceso | 4 | users, organizations, organization_members, invitations |
| Suscripciones y Billing | 3 | plans, subscriptions, ai_credit_ledger |
| Proyectos | 2 | projects, project_members |
| Intake Conversacional | 3 | intake_sessions, intake_messages, intake_extractions |
| Presupuesto y APU | 5 | budgets, budget_sections, budget_items, apu_analyses, apu_components |
| Inteligencia de Precios | 5 | regions, price_categories, price_items, price_records, price_indices + org_price_overrides |
| Documentos y Exportación | 3 | document_templates, documents, export_jobs |
| Licitaciones | 3 | tenders, tender_requirements, tender_proposals |
| Proyecciones Financieras | 3 | financial_projections, cash_flow_entries, s_curve_entries |
| Colaboración y Auditoría | 4 | comments, notifications, activity_logs, audit_logs |
| Jobs de IA | 1 | ai_jobs |
| **TOTAL** | **36** | |

---

## 9. Consideraciones de Escalabilidad

### Particionado de tablas (Fase 3+)
Cuando `activity_logs` y `audit_logs` superen 100M de filas:
- Particionar por `created_at` (mensual) usando `PARTITION BY RANGE`.
- Retención configurable: activity_logs 90 días, audit_logs 7 años (compliance).

### Read replicas
- Todas las consultas de dashboard y reportes deben apuntar a la réplica de lectura.
- Las escrituras van al primary.
- Separar connection strings: `DATABASE_URL` (escritura) / `DATABASE_URL_READONLY` (lectura).

### Caché de precios
- Los precios vigentes se cachean en Redis con TTL de 24h.
- Key: `price:{price_item_id}:{region_id}:{YYYY-MM}`
- Invalida el caché al insertar nuevos `price_records`.

### Vector search (pgvector)
- Usar índice `hnsw` (mejor para búsqueda en tiempo real) sobre `price_items.embedding`.
- El campo `embedding` no está en el schema Prisma estándar — se gestiona mediante migraciones SQL raw y se consulta con `$queryRaw`.

---

*Documento preparado por: Arquitectura — InfraPilot AI*
*Versión: 1.0 · Fecha: Junio 2026*
*Clasificación: Confidencial — Uso interno*
