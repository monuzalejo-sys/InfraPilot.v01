# Memoria ORION — villa-broaster

Generado de state.json v14 (2026-08-23T00:00:00.000Z). NO editar a mano: se regenera en cada cierre de sesión.

## Decision (11)

- [[DEC-001]] `Accepted` — Sistema para punto de venta de POLLO ASADO (y otros productos de comid
- [[DEC-002]] `Accepted` — Foco actual: cliente BROASTER (dos locales). Etapas E1-E5 compartidas 
- [[DEC-003]] `Accepted` — broaster: WEB (no POS) — Next.js con almacen en disco tras interfaz, S
- [[DEC-004]] `Accepted` — Marca real 'Villa Broaster' y rediseno visual con paleta rojo/amarillo
- [[DEC-005]] `Accepted` — Seguridad del panel admin: autenticacion timing-safe y bloqueo de fuer
- [[DEC-006]] `Accepted` — Comparativa entre sedes + CSV para el contador
- [[DEC-007]] `Accepted` — Pivote arquitectonico: DOS CARAS (villa-app pública + broaster-app con
- [[DEC-008]] `Accepted` — Repo del CLIENTE y plan de equipo (2026-08-22)
- [[DEC-009]] `Accepted` — TRES REPOS por rol (2026-08-22)
- [[DEC-011]] `Accepted` — Ritual semanal de avance: ORION es el juez, PDF formato celular
- [[DEC-010]] `Accepted` — Planes de trabajo v2 — foco solo en el proyecto (2026-08-22)

## Knowledge (14)

- [[KN-001]] `Current` — LAS TRES PALANCAS DE UN ASADERO (el plan entero se estructura sobre es
- [[KN-002]] `Current` — MODELO DE INVENTARIO DEL ASADERO, distinto al de un estanco: (a) un po
- [[KN-003]] `Current` — DECISION DE ORDEN: el pronostico de tanda (cuanto asar por franja) va 
- [[KN-004]] `Current` — MODELO BROASTER vs ASADERO (las diferencias que cambian el diseno): (a
- [[KN-005]] `Current` — Mapa de arquitectura bifurcada con TRES REPOS (QA 8/8 PASS 2026-08-15 
- [[KN-006]] `Current` — Patron de ola paralela SIN colisiones validado: el orquestrador fijo l
- [[KN-007]] `Current` — Dominio de gastos: Gasto {numero: G{local}-XXXX consecutivo por local,
- [[KN-008]] `Current` — AUDITAR COPY PUBLICO DE BUILDERS BARATOS: un builder haiku invento la 
- [[KN-009]] `Current` — PROMOS SIN DESCUENTO FALSO: el servidor congela precios del catálogo a
- [[KN-010]] `Current` — SISTEMA EN VIVO (2026-08-20): (A) ÓRDENES POLLING INTELIGENTE: panel Ó
- [[KN-011]] `Current` — DOS LECCIONES OPERATIVAS del run 2026-08-20. (A) BUG CLASS UI NATIVA: 
- [[KN-012]] `Current` — LOGIN ESTÁNDAR DE CALIDAD 'estilo Orama' aplicado al sistema (2026-08-
- [[KN-013]] `Current` — PLAN DE EQUIPO EN DOS PIEZAS: la documentación táctica del proyecto bi
- [[KN-014]] `Current` — LECCIONES DEL RUN 2026-08-22 (tarde) — reenfoque + rediseño de planes 

## Pending (7)

- [[PEND-001]] `Blocked` — DECISION DE NEGOCIO DEL DUENO — facturacion electronica DIAN: definir 
- [[PEND-002]] `Blocked` — Recoger del cliente los datos que condicionan el diseno (cuadro de la 
- [[PEND-003]] `Blocked` — Recoger del cliente BROASTER los datos de la propuesta: (RESUELTO 2026
- [[PEND-004]] `Ready` — Activacion de TRES REPOS: (A) repo equipo (villa-broaster): raíz compa
- [[PEND-006]] `Ready` — Construir el modulo de CAJA (pedidos en punto fisico) segun BASES-CAJA
- [[PEND-007]] `Blocked` — Integrar feature/roles-puestos del repo villa-broaster-sistema (commit
- [[PEND-008]] `Ready` — Barrido de pruebas de TODO (sistema y vitrina, móvil y escritorio; sol

## Roadmap (5)

- [[ROAD-001]] `Planned` — E1 — El punto vende y cuadra
- [[ROAD-002]] `Planned` — E2 — El inventario dice la verdad
- [[ROAD-003]] `Planned` — E3 — La pagina y el canal propio
- [[ROAD-004]] `Planned` — E4 — Dejar de adivinar la tanda
- [[ROAD-005]] `Planned` — E5 — Crecer

## Archivado (1)

- ~~PEND-005~~ (LowValue) — 

