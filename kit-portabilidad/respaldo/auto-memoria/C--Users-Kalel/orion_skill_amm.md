---
name: orion-skill-amm
description: Skill ORION — Autonomous Memory Manager. Sistema autónomo event-driven de gestión de memoria de proyecto para ORION. Extiende Memory Curator hacia ciclo de vida completo sin intervención manual.
metadata:
  type: project
  originSessionId: 95b813b2-3562-4113-89c8-c7f5666725f0
---

# ORION Skill: Autonomous Memory Manager (AMM)

## Ubicación
`C:\Users\Kalel\ORION\Skills\autonomous-memory-manager\`

## Estado
Draft v1.0.0 — implementado y documentado.

## Diferencia con Memory Curator

| Dimensión | Memory Curator | AMM |
|---|---|---|
| Trigger | Manual ("Cerrar sesión") | Autónomo (event-driven) |
| Scope | Sesión individual | Ciclo de vida completo |
| Deduplicación | Local a sesión | Cross-session |
| Consolidación | Ninguna | Merge activo de objetos relacionados |
| Métricas | Por sesión | Acumulativas + tendencia |

Memory Curator es componente interno de AMM, no reemplazado por él.

## Arquitectura — 6 componentes

| Componente | Responsabilidad única |
|---|---|
| EventDetector | Detectar condiciones de trigger → emitir MemoryEvent |
| MemoryCurator | Orquestar pipeline completo (no confundir con Skill MC) |
| KnowledgeDistiller | Extraer + deduplicar + clasificar objetos |
| StateGenerator | Construir ProjectState a partir de distillation |
| MemoryRepository | CRUD en state.json y metrics.json |
| MetricsEngine | Calcular SessionMetrics comparando before/after |

## Eventos de activación (8 triggers)

| EVT | Tipo | Prioridad |
|---|---|---|
| EVT-003 | SESSION_CLOSE | Critical |
| EVT-004 | CONTEXT_HIGH_WATERMARK (≥70%) | Critical |
| EVT-001 | TASK_COMPLETED | High |
| EVT-002 | PHASE_CHANGED | High |
| EVT-005 | ARCHITECTURAL_DECISIONS_ACCUMULATED (≥3) | High |
| EVT-007 | PRE_SPRINT_GENERATION | High |
| EVT-006 | DUPLICATE_DETECTED (similarity >0.85) | Medium |
| EVT-008 | MODULE_CHANGE | Medium |

## Tipos de objetos de conocimiento

`Decision` `Policy` `Knowledge` `Constraint` `Risk` `Pending` `Architecture` `Roadmap` `Metric`

Cada objeto: id, type, tier, created, updated, lifetime, impact, priority, status, dependencies, supersedes?

## Clasificación de tier (determinista)

Session → Working (no persiste) · Sprint → Project · Project → Project · Permanent → Permanent

## Deduplicación

Jaccard similarity sobre campo de texto primario. Threshold: 0.85. Merge: gana mayor priority, loser.id va a supersedes[].

## Métricas (SessionMetrics por ejecución)

contextSaved · compressionRatio · knowledgePreservedPercent · duplicateReduction · estimatedTokenSavings · knowledgeDensity · objectsCreated · objectsMerged · objectsArchived · objectsPromoted · objectsDemoted + byTier + byType

## Storage

`{repositoryPath}/{projectId}/state.json` → ProjectState atómica
`{repositoryPath}/{projectId}/metrics.json` → CumulativeMetrics append-only

## API pública (src/index.ts)

```typescript
const amm = createAmm({ projectId, repositoryPath })
amm.detector.detect(ctx)        // dispara pipeline
amm.curator.onComplete(handler) // N-AMM-R11: subscribe a AMM_RUN_COMPLETED
amm.repository.queryObjects(projectId, options)
```

`onComplete` añadido en sesión 2026-07-01 para cumplir N-AMM-R11. Los runtimes DEBEN suscribirse si necesitan reaccionar al fin de cada run.

## Política de democión (§5.3 SPECIFICATION)

Un objeto SE ARCHIVA si cumple TODOS:
- `status` es estado terminal: `Deprecated`, `Superseded`, `Done`, `Resolved`, `Cancelled`, `Rejected`
- `impact` es `Low`
- Ningún objeto activo lo tiene en `dependencies`

Cambio en sesión 2026-07-01: la versión original solo cubría Deprecated/Superseded. Se extendió a todos los estados terminales para alinear con los ejemplos de context-overflow.md.

## Reglas normativas clave

- N-AMM-R2: No requiere comando humano (viola spec si lo requiere)
- N-AMM-R5: Working Memory NO se persiste
- N-AMM-R9: No archivar objeto si otro tiene dependencia sobre él
- N-AMM-R11: Emitir AMM_RUN_COMPLETED tras cada run exitoso — implementado via `curator.onComplete()`
- N-AMM-R14: No ejecución paralela — FIFO queue por proyecto

## AIT

Resultado: PASS. Todas las reglas compatibles con ATLAS (inmutable, reactivo, sin agentes). Ver SPECIFICATION.md §11.

## Integración futura

v1.1: Git hooks, tokenizer configurable · v1.2: Cron, file watcher · v2.0: LLM similarity, cross-project memory, GitHub Actions
