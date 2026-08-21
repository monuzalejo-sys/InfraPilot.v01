---
name: orion-pending
description: Pendientes activos del proyecto ORION Standard y su ecosistema — items que requieren acción en futuras sesiones
metadata:
  type: project
  originSessionId: 95b813b2-3562-4113-89c8-c7f5666725f0
---

# ORION — Pendientes Activos

**Why:** Los pendientes cross-sesión se pierden si no se persisten. Estos items bloquean trabajo futuro o requieren decisión del usuario.
**How to apply:** Revisar al inicio de cada sesión ORION. Marcar Done cuando se completen. Nunca eliminar sin completar o cancelar explícitamente.

---

## PEND-001 — RFC-0007 Versioning Protocol

**Tarea:** Escribir `C:\Users\Kalel\ORION\RFC\RFC-0007-VERSIONING.md`  
**Razón:** Listado como "Planned — not yet written" en ORION_STANDARD.md. Bloquea Tier C-2 del estándar.  
**Estado:** Done — escrito 2026-07-02 (draft, N7-R1..R12 + AIT); índice del estándar actualizado a Draft.  
**Prioridad:** High | **Impacto:** Medium | **Lifetime:** Project  
**Dependencias:** ORION_STANDARD.md §8 (RFC Index)

---

## PEND-002 — Eliminar carpeta claude.md vacía

**Tarea:** Eliminar directorio `C:\Users\Kalel\claude.md` (carpeta vacía creada por error)  
**Razón:** 0 archivos. Sin función. Creada cuando se solicitó "carpeta llamada claude.md" en sesión previa.  
**Estado:** Blocked — awaiting user decision  
**Prioridad:** Low | **Impacto:** Low | **Lifetime:** Sprint

---

## PEND-003 — Alineación nomenclatura dev-runtime → ORION standard

**Tarea:** Sesión Build dedicada para alinear los state names de dev-runtime con ORION v1.0  
**Razón:** dev-runtime usa nomenclatura pre-ORION. Cualquier compliance claim ORION-Basic fallará TC-Basic-03 mientras exista esta divergencia.

Tabla de divergencia:

| dev-runtime (actual) | ORION Standard |
|---|---|
| `NEW_TASK` | `PENDING` |
| `ANALYZE` | `ANALYZING` |
| `PLAN` | `PLANNING` |
| `BUILD` | `BUILDING` |
| `VERIFY` | `VERIFYING` |
| `FIX` | `FIXING` |
| `DOCUMENT + MEMORY_UPDATE` | `REFLECTING` |
| `ESCALATE` | `ESCALATED / ABORTED` |

Afecta: CLAUDE.md principal + 9 agentes de dev-runtime.  
**Estado:** Ready (requiere diseño antes de implementar)  
**Prioridad:** High | **Impacto:** High | **Lifetime:** Project  
**Dependencias:** RFC-0003, RSK-001

---

## CON-001 — AMM.extractCandidates() depende del runtime

**Constraint:** `KnowledgeDistiller.extractCandidates()` es un stub en AMM v1.0. El runtime DEBE proveer los objetos pre-estructurados via `event.metadata.candidates: KnowledgeObject[]`.  
**Razón:** AMM no tiene capacidad de parsear texto libre. La responsabilidad de extraer conocimiento del contexto pertenece al runtime (AIER), no al skill.  
**Impacto:** Alto — AMM no genera conocimiento nuevo por sí solo. Solo procesa lo que el runtime le entrega.  
**Status:** Active | **Lifetime:** Project  
**Dependencias:** orion-skill-amm

---

## RSK-001 — dev-runtime nomenclatura incompatible con ORION

**Riesgo:** dev-runtime usa estados pre-ORION. Si se presenta como AIER (referencia de ORION), cualquier test de compliance ORION-Basic fallará en TC-Basic-03.  
**Probabilidad:** High (certeza — el problema ya existe)  
**Impacto:** Alto  
**Mitigación:** No hacer ningún compliance claim hasta completar PEND-003.  
**Status:** Open | **Lifetime:** Project  
**Dependencias:** PEND-003
