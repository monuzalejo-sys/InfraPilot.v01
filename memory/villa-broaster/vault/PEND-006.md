---
id: PEND-006
type: Pending
tier: Project
status: Ready
impact: High
priority: High
lifetime: Project
created: 2026-08-20T00:00:00.000Z
updated: 2026-08-20T00:00:00.000Z
---

# PEND-006 — Construir el modulo de CAJA (pedidos en punto fisico) segun BASES-CAJA.md en la 

**reason:** Diseno de bases aprobado 2026-08-20 (commit a5686c1) tras analisis comparativo con placita; el dueno pidio facilidad para recibir pedidos en punto fisico.

**task:** Construir el modulo de CAJA (pedidos en punto fisico) segun BASES-CAJA.md en la raiz del repo: (1) medioPago/cobradaEn en Orden [lib, normal]; (2) TurnoCaja abrir/cerrar/arqueo con la regla KN-001 de arroces 'la plata pertenece al turno del COBRO' — turnoId se estampa al pasar a entregada, patron serializado [lib, HARD]; (3) APIs de turno y cobro [api, normal]; (4) pestana Caja: grilla tocable + total gigante + cobro en 2 toques, pedido de 3 productos en <=6 toques, sin scroll [page/visual, normal]; (5) cuadre por turno en resumen SIN romper el desglose por canal [lib, HARD, blast radius alto]. Hallazgo del analisis: placita NO tiene turnos de caja (venta=cobro en un acto) — TurnoCaja se disena desde cero aqui. NOTA: el repo vive en C:/Users/Kalel/prommter/proyectos/villa-broaster (renombrado al cliente 2026-08-22) y el documento en docs/BASES-CAJA.md; tarjetas T-02..T-04 en tareas/.

