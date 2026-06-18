# InfraPilot AI — Blueprint v1.0
**Documento Interno · Confidencial · Junio 2026**

---

## 1. Visión

InfraPilot AI es la plataforma de inteligencia artificial de referencia para el sector de ingeniería civil, topografía y construcción en América Latina y España. Nuestra misión es transformar el proceso de estimación de costos y planificación financiera de obras — un proceso que hoy tarda días o semanas — en una operación de minutos, con precisión profesional y completamente auditada.

**Propuesta de valor en una línea:**
> *Describe tu obra. Obtén tu presupuesto. Exporta y licita.*

---

## 2. El Problema

### 2.1 Contexto actual del sector

Las empresas de construcción, consultoras de ingeniería y estudios de topografía enfrentan un cuello de botella crítico en la etapa de presupuestación:

| Problema | Impacto |
|---|---|
| Elaborar un APU (Análisis de Precio Unitario) consume entre 4 y 40 horas según la complejidad | Propuestas lentas, pérdida de licitaciones |
| Los ingenieros replican plantillas Excel de forma manual, con alto riesgo de error | Errores de cálculo que pueden costar millones |
| Los precios de materiales y mano de obra varían regionalmente y se desactualizan | Presupuestos que no reflejan la realidad del mercado |
| Las licitaciones públicas requieren formatos específicos por entidad | Retrabajo constante y duplicación de esfuerzo |
| Las PyMEs no pueden costear un estimador dedicado | Propuestas subóptimas o desestimación del riesgo |

### 2.2 El mercado desatendido

- Más de 400,000 empresas de construcción activas en México, Colombia, Perú, Chile y España.
- El 78% de las PyMEs del sector elabora presupuestos en Excel sin validación cruzada.
- Menos del 5% de estas empresas usa software especializado de estimación.

---

## 3. La Solución

InfraPilot AI es un SaaS B2B con una interfaz conversacional que permite a cualquier profesional del sector — desde un maestro de obra hasta un gerente de proyecto — generar presupuestos profesionales, APUs detallados y documentos de licitación exportables, usando lenguaje natural como punto de entrada.

### Flujo principal (Core Loop)

```
[Usuario describe la obra en lenguaje natural]
        ↓
[IA interpreta alcance, partidas y especificaciones]
        ↓
[Motor de presupuesto genera APUs y metrados]
        ↓
[Validación contra base de datos de precios regional]
        ↓
[Generación de documento: Excel / PDF / formato licitación]
        ↓
[Exportación, firma y envío]
```

---

## 4. Módulos del Sistema

### Módulo 1 — Intake Inteligente (Describe tu Obra)
Motor conversacional que extrae de la descripción del usuario:
- Tipo de obra (vial, edificación, hidráulica, saneamiento, etc.)
- Alcances y partidas identificadas
- Localización geográfica (para ajuste de precios)
- Plazo estimado
- Condiciones especiales (zona sísmica, altura, accesibilidad)

**Entradas soportadas:** texto libre, voz, carga de planos PDF, memorias descriptivas.

---

### Módulo 2 — Motor de Presupuesto y APU
Núcleo técnico del producto. Genera automáticamente:
- **APU (Análisis de Precio Unitario):** descomposición de materiales, mano de obra, equipos y rendimientos por partida.
- **Metrado:** cómputo de cantidades según tipo de obra.
- **Presupuesto General:** suma de partidas con subtotales, gastos generales, utilidad e IGV/IVA.
- **Curva S:** proyección de avance físico-financiero en el tiempo.

Parámetros configurables: moneda, unidad de medida, región, factor de zona, porcentaje de imprevistos.

---

### Módulo 3 — Base de Datos de Precios (Price Intelligence)
Base de datos regional actualizable con:
- Precios unitarios de materiales por región y fecha.
- Rendimientos de mano de obra por especialidad y zona.
- Tarifas de equipos y maquinaria.
- Índices de escalación de costos (CAPECO, DANE, INE, etc.)

Fuentes: integración con cámaras de construcción, actualización manual por administrador, aportes validados de la comunidad de usuarios.

---

### Módulo 4 — Generador de Documentos (Export Engine)
Generación de documentos listos para usar:
- **Excel profesional:** hojas de APU, resumen, cronograma.
- **PDF para licitación:** formatos compatibles con normativas locales (OSCE Perú, SEACE, licitaciones SERCOP Ecuador, INVIAS Colombia, DGOP Chile).
- **Memoria de cálculo:** documento técnico que justifica cada precio unitario.
- **Plantillas personalizables** con logo y marca de la empresa.

---

### Módulo 5 — Licitaciones y Propuestas
Asistente de elaboración de propuestas técnico-económicas:
- Generación de carta de presentación y resumen ejecutivo.
- Revisión de requisitos de bases administrativas (checklist automático).
- Control de fechas y hitos de la licitación.
- Historial de propuestas presentadas y estados.

---

### Módulo 6 — Proyecciones Financieras
Análisis de viabilidad y control financiero de proyecto:
- **Flujo de caja proyectado** por período.
- **Punto de equilibrio** del proyecto.
- **Análisis de sensibilidad:** variación de precios de materiales críticos.
- **Dashboard de rentabilidad:** margen bruto, margen neto, ROI estimado.

---

### Módulo 7 — Workspace y Colaboración
Entorno multiusuario para equipos:
- Proyectos compartidos con control de roles (Propietario, Editor, Revisor, Solo lectura).
- Historial de versiones con comparación de cambios.
- Comentarios y anotaciones en partidas.
- Notificaciones de cambios y aprobaciones.

---

### Módulo 8 — Administración y Configuración
Panel de control empresarial:
- Gestión de usuarios y suscripciones.
- Configuración de plantillas propias de APU.
- Catálogo de precios personalizados por empresa.
- Integraciones con ERP (SAP, Oracle Primavera, S10).
- Auditoría y logs de actividad.

---

## 5. Arquitectura del Sistema

### 5.1 Principios Arquitectónicos
- **API-first:** todos los módulos exponen APIs REST/GraphQL consumibles por terceros.
- **Multi-tenant:** aislamiento de datos por organización desde la capa de base de datos.
- **Stateless processing:** los workers de IA son sin estado, escalables horizontalmente.
- **Event-driven:** comunicación entre módulos vía colas de mensajes (Kafka/SQS).
- **Data residency:** opción de despliegue regional para clientes enterprise.

---

### 5.2 Stack Tecnológico Recomendado

**Frontend:**
- Framework: Next.js 14+ (App Router)
- UI: Tailwind CSS + Shadcn/UI
- Estado: Zustand + React Query
- Gráficas: Recharts / Nivo

**Backend (API Layer):**
- Runtime: Node.js con Fastify o Python con FastAPI (según módulo)
- API Gateway: Kong o AWS API Gateway
- Auth: Clerk o Auth0 (OAuth2 / SAML para enterprise)

**IA / LLM Layer:**
- Modelo principal: Claude Sonnet (Anthropic) para comprensión de descripciones y generación de APUs
- Embeddings: para búsqueda semántica en base de precios
- Orquestación: LangChain / LlamaIndex
- Fine-tuning: pipeline en AWS SageMaker para modelos de dominio

**Base de Datos:**
- Principal: PostgreSQL (Supabase o RDS) — datos relacionales, proyectos, APUs
- Vectorial: pgvector o Pinecone — búsqueda semántica de precios y partidas
- Caché: Redis — sesiones, resultados frecuentes
- Documentos: S3 / Cloudflare R2 — archivos Excel, PDF generados

**Infraestructura:**
- Cloud: AWS (primario) con opción multi-cloud
- Contenedores: Docker + Kubernetes (EKS)
- CI/CD: GitHub Actions + ArgoCD
- Observabilidad: Datadog / OpenTelemetry + Grafana
- CDN: Cloudflare

**Exportación de Documentos:**
- Excel: ExcelJS (Node) o openpyxl (Python)
- PDF: Puppeteer / WeasyPrint
- Plantillas: sistema de templates JINJA2 / Handlebars

---

### 5.3 Diagrama de Componentes (Descripción)

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE WEB / MÓVIL               │
│              (Next.js · PWA · API Pública)           │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS / REST / WebSocket
┌────────────────────▼────────────────────────────────┐
│                   API GATEWAY                        │
│         (Autenticación · Rate Limiting · Routing)    │
└──┬────────────────┬──────────────┬──────────────────┘
   │                │              │
┌──▼──┐         ┌──▼──┐       ┌──▼──────────────────┐
│ Auth│         │Proj │       │   AI Orchestrator    │
│Svc  │         │Svc  │       │  (Claude + RAG)      │
└─────┘         └──┬──┘       └──────────┬───────────┘
                   │                     │
         ┌─────────▼─────────────────────▼──────────┐
         │           MESSAGE BUS (SQS / Kafka)       │
         └──────┬──────────────────────┬─────────────┘
                │                      │
          ┌─────▼──────┐        ┌──────▼──────┐
          │ APU Engine │        │ Export Svc  │
          │  Worker    │        │ (Excel/PDF) │
          └─────┬──────┘        └──────┬──────┘
                │                      │
         ┌──────▼──────────────────────▼──────┐
         │          DATA LAYER                 │
         │  PostgreSQL · pgvector · Redis · S3 │
         └─────────────────────────────────────┘
```

---

### 5.4 Seguridad
- Cifrado en tránsito: TLS 1.3
- Cifrado en reposo: AES-256 para datos sensibles
- Aislamiento multi-tenant: Row-Level Security en PostgreSQL
- Secrets management: AWS Secrets Manager / HashiCorp Vault
- Cumplimiento: GDPR, Ley 25326 (Argentina), LGPD (Brasil)
- Auditoría completa de accesos y exportaciones

---

## 6. Modelo de Negocio

### 6.1 Segmentos de Cliente

| Segmento | Descripción | Tamaño |
|---|---|---|
| **Starter** | Freelancers, maestros de obra independientes | PyME 1-5 personas |
| **Professional** | Empresas constructoras medianas | 5-50 empleados |
| **Enterprise** | Constructoras grandes, consultoras, entidades públicas | 50+ empleados |

### 6.2 Pricing (Referencial)

| Plan | Precio/mes | Límites |
|---|---|---|
| Free | $0 | 2 proyectos, watermark en exportación |
| Starter | $49 USD | 10 proyectos, exportación PDF/Excel, 1 usuario |
| Professional | $149 USD | Proyectos ilimitados, 5 usuarios, licitaciones |
| Enterprise | Custom | Usuarios ilimitados, SSO, API, soporte dedicado |

### 6.3 Monetización Adicional
- Marketplace de plantillas de APU por sector (carreteras, edificación, agua y saneamiento).
- Créditos de IA para proyectos de alta complejidad.
- Integración premium con bases de precios oficiales por país.

---

## 7. Roadmap

### Fase 1 — MVP (Meses 1–4)
Objetivo: validar el core loop con usuarios reales.

- [ ] Autenticación y onboarding
- [ ] Intake conversacional (texto libre → partidas identificadas)
- [ ] Generación básica de APU con precios hardcoded (Perú/Colombia como mercados piloto)
- [ ] Exportación a Excel (formato estándar)
- [ ] Dashboard de proyectos
- [ ] Plan Free y Starter funcionales
- [ ] Landing page con lista de espera

**KPI de éxito:** 50 usuarios activos, NPS > 40, tiempo de generación de presupuesto < 5 min.

---

### Fase 2 — Consolidación (Meses 5–8)
Objetivo: retención y expansión de mercado.

- [ ] Base de datos de precios regional editable por admin
- [ ] Exportación PDF con branding del cliente
- [ ] Módulo de licitaciones (formatos OSCE, SERCOP)
- [ ] Colaboración multiusuario (3 roles básicos)
- [ ] Integración de precios con CAPECO y CAMACOL
- [ ] Soporte de entrada por voz
- [ ] Plan Professional funcional

**KPI de éxito:** 500 usuarios, MRR $15,000 USD, churn < 8%.

---

### Fase 3 — Crecimiento (Meses 9–14)
Objetivo: escalar y diferenciar.

- [ ] Proyecciones financieras y curva S automatizada
- [ ] Módulo de análisis de sensibilidad de costos
- [ ] Lectura de planos PDF con extracción de metrados por IA
- [ ] Marketplace de plantillas
- [ ] API pública para integradores
- [ ] Expansión a México y Chile
- [ ] App móvil (React Native)
- [ ] Plan Enterprise con SSO y facturación anual

**KPI de éxito:** 2,000 usuarios, MRR $60,000 USD, 3 clientes Enterprise.

---

### Fase 4 — Escala (Meses 15–24)
Objetivo: liderazgo regional.

- [ ] Integración con ERP (SAP, Primavera P6, S10)
- [ ] Módulo de control de obra y gestión de cambios
- [ ] IA predictiva de sobrecostos y riesgos
- [ ] Data room para inversores y financiadores de proyectos
- [ ] Expansión España y resto LATAM
- [ ] Certificaciones de seguridad (ISO 27001)
- [ ] Modelo de lenguaje propio fine-tuneado en normativas de construcción

**KPI de éxito:** 10,000 usuarios, MRR $250,000 USD, presencia en 8 países.

---

## 8. MVP — Definición Detallada

### 8.1 Alcance del MVP

El MVP de InfraPilot AI debe demostrar una sola cosa con excelencia:
**Un ingeniero puede describir su obra en lenguaje natural y obtener un presupuesto exportable en menos de 5 minutos.**

### 8.2 Pantallas del MVP (8 vistas)

1. **Landing / Home** — propuesta de valor, demo en video, CTA lista de espera.
2. **Onboarding** — registro, configuración de región y moneda, perfil de empresa.
3. **Dashboard** — listado de proyectos con estado y fechas.
4. **Nuevo Proyecto** — formulario de descripción + chat de intake conversacional.
5. **Revisión de Partidas** — tabla editable de ítems identificados antes de generar.
6. **Vista de Presupuesto** — APUs generadas, resumen financiero, totales.
7. **Editor de APU** — edición manual de materiales, rendimientos y precios.
8. **Exportación** — descarga en Excel, previsualización PDF.

### 8.3 Qué NO incluye el MVP

- App móvil nativa
- Módulo de licitaciones
- Colaboración multiusuario
- Integración con ERP
- Base de precios editable por usuario
- Proyecciones financieras avanzadas

### 8.4 Métricas de Validación del MVP

| Métrica | Umbral de Éxito |
|---|---|
| Tiempo promedio de generación de presupuesto | < 5 minutos |
| Precisión de partidas identificadas vs. revisión manual | > 80% |
| Tasa de exportación (usuarios que llegan a exportar) | > 60% |
| Net Promoter Score | > 35 |
| Retención a 30 días | > 40% |

---

## 9. Futuras Funcionalidades (Backlog Estratégico)

### Inteligencia Aumentada
- **Lector de planos por IA:** carga de planos AutoCAD/PDF → extracción automática de metrados (áreas, longitudes, volúmenes).
- **Predicción de sobrecostos:** modelo entrenado en histórico de proyectos que alerta desviaciones probables.
- **Análisis de competitividad:** compara tu propuesta contra rangos de precios del mercado regional.

### Gestión de Obra
- **Control de avance físico:** seguimiento de partidas ejecutadas vs. presupuestadas.
- **Gestión de cambios:** control de adicionales y deductivos con aprobación digital.
- **Diario de obra digital:** registro fotográfico georeferenciado con notas de campo.

### Ecosistema y Marketplace
- **Marketplace de especialistas:** conectar empresas con ingenieros, topógrafos y maestros de obra freelance.
- **Financiamiento integrado:** puente con financieras para proyectos pre-aprobados.
- **Biblioteca de especificaciones técnicas:** catálogo de especificaciones por tipo de obra y normativa nacional.

### Integraciones Nativas
- BIM/Revit: importación de modelos BIM para generación de metrados.
- Sistemas de gestión pública: integración directa con portales de licitación nacionales.
- Contabilidad: exportación directa a SAP, QuickBooks, Defontana, Siigo.

### IA Propietaria
- Modelo de lenguaje especializado entrenado en normativas ASTM, ACI, AASHTO, NSR, RNE y normativas locales por país.
- Asistente de claims: redacción de reclamaciones y ampliaciones de plazo fundamentadas.

---

## 10. Equipo Fundador Requerido

Para ejecutar este plan se requiere el siguiente perfil de equipo inicial:

| Rol | Perfil | Responsabilidad |
|---|---|---|
| CEO / Founder | Ingeniero civil o similar con visión de negocio | Producto, ventas, relaciones con clientes |
| CTO | Ingeniero de software senior fullstack | Arquitectura, decisiones técnicas, equipo dev |
| AI/ML Engineer | Especialista en LLMs y RAG | Motor de IA, integración LLM, fine-tuning |
| Frontend Engineer | Next.js / React senior | UX/UI, performance, accesibilidad |
| Backend Engineer | Node.js o Python senior | APIs, base de datos, exportación |
| Domain Expert | Ingeniero civil activo | Validación técnica de APUs y normativas |

---

## 11. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Baja adopción por resistencia al cambio del sector | Alta | Alto | Onboarding guiado, casos de éxito, capacitación |
| Presupuestos de IA incorrectos afectan credibilidad | Media | Muy alto | Revisión humana obligatoria antes de exportar, disclaimer claro |
| Competidor grande (Autodesk, Trimble) entra al segmento | Baja | Alto | Velocidad de ejecución, especialización LATAM, precio |
| Variación brusca de precios no reflejada en la BD | Alta | Medio | Fechas de vigencia en cada precio, alertas de desactualización |
| Costo de tokens de LLM incontrolable a escala | Media | Medio | Caché de resultados, prompts optimizados, modelo propio a futuro |

---

## 12. Principios de Diseño de Producto

1. **Primero el resultado, no el proceso.** El usuario quiere el Excel, no aprender a usar la herramienta.
2. **Confianza verificable.** Toda salida de IA debe poder ser auditada y editada por el usuario.
3. **Cero fricción en el inicio.** El primer presupuesto debe completarse sin leer un manual.
4. **Datos del usuario, del usuario.** Exportación total de datos en cualquier momento, sin lock-in.
5. **Construido para el campo.** La interfaz debe funcionar en móvil con conectividad limitada.

---

*Documento preparado por: Arquitectura de Producto — InfraPilot AI*
*Versión: 1.0 · Fecha: Junio 2026*
*Clasificación: Confidencial — Uso interno*
