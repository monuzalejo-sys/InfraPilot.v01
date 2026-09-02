# villa-broaster — brief (2026-09-01, post-mudanza)

## Qué es

Cliente Villa Broaster (pollo broaster, dos sedes: Villa del Viento y Vía al Bosque). **TRES repos** (nombres exactos, DEC-013): `Equipo-villa-broaster` (README, PLAN-EQUIPO.md, PENDIENTES-GIT.md, tareas/ T-01..T-11, docs/), `broaster-app-repo` (broaster-app :3200, PWA, solo senior), `villa-app-repo` (villa-app :3201, stateless, diseñadores). Los nombres `villa-broaster-sistema` y `villa-broaster-vitrina` están OBSOLETOS. Ruta: `/Users/g/orion/prommter/<repo>` — la máquina ya no es Windows. La memoria ORION vive aparte, en `/Users/g/orion/memory/villa-broaster/`, fuera del repo que lee el equipo.

## Mudanza a la Mac (2026-09-01) — leer primero

El proyecto ya no vive en Windows ni suelto en `~/Downloads`. Los tres repos
están en `/Users/g/orion/prommter/` y **los tres tienen su contenido**:

| Repo | Estado |
|---|---|
| `broaster-app-repo` | Publicado en GitHub desde antes: 35 commits + rama `feature/roles-puestos`. Recuperado con fetch; el clon local era el desactualizado, no el remoto. |
| `villa-app-repo` | Poblado, commiteado y **publicado** hoy (`de20b97`, 38 archivos). |
| `Equipo-villa-broaster` | Poblado, commiteado y **publicado** hoy (`f3b5fe3`, 74 archivos). |

**El push ya no lo hace el dueño: es automático** (política DEC-001 de la memoria
permanente). Después de verificar en verde y commitear, el agente publica solo.
Siguen prohibidos el `--force`, reescribir historia publicada y borrar ramas remotas.

Lo que queda para el dueño (PEND-010): invitar a las 3 personas por rol y borrar en
GitHub los dos repos obsoletos. **Proteger `main` no se puede** en repos privados del
plan gratuito (403 'Upgrade to GitHub Pro') — hay que decidir entre pagar Pro, hacerlos
públicos, o sostener la puerta de calidad por acuerdo.

Al comparar árboles traídos de Windows contra un checkout en la Mac, el diff
miente: CRLF vs LF marcó 166 archivos como distintos con cero diferencias
reales (KN-035). Usar `diff --strip-trailing-cr`.

## Estado integral (2026-08-27)

**Sistema contable en PWA instalable:** broaster-app PWA (manifest, SW cacheando solo 3 estaticos, iniciar-villa-broaster.bat Edge --start-fullscreen, commit 45de7b7). Admin 5 pestañas exactas: Órdenes (polling 8s), Gastos (G-XXXX, concepto obligatorio), Comparativa (rango + CSV contador), Productos (alta/PATCH), Suscriptores. Login timing-safe (sha256+timingSafeEqual, 5/15 bloqueo). 68 tests dominio. **Acceso por roles Mercaplaza:** usuarios admin/cajero con scrypt, puesto en localStorage, cookie HMAC {usuarioId, rol, puesto, exp}. Cajero ve solo Órdenes (sede fija). 107 tests verdes, QA en vivo 8/8. Integrado 2026-08-24, commit 42d527a (KN-017 contrato del login).

**Módulo de Caja completado:** TurnoCaja (abierto/cerrado/arqueo), medioPago/cobradaEn, cobro en 2 toques, pedido 6 toques sin scroll a 390px (commit aa8d760). 176 tests, triple auditoría adversarial detectó agujero (cancelar orden cobrada) y doble carrera (cobro+cierre simultáneos). Ambos cerrados. PEND-006 Done, ROAD-001 Done. Regla crítica (KN-019): prohibiciones contables vienen en pares (cancelar orden cobrada vs cobrar orden cancelada).

**Vitrina stateless:** villa-app :3201, componentes tienda/orden/confirmacion, localStorage carrito, proxy /api/* → :3200, paleta #0a0a0a/#141414/#2b2b2b, rojo #e01e2b. Promos sin descuento falso (KN-009).

**Tareas del plan cerradas (tanda N0/N0b, 2026-08-26):** T-007/009/019/020/021/022 y T-023/024/025/026/027/028/031/032/033/035/261 por agentes; T-008/016/029/030/034 inline por el orquestador. Tests 209 → 302, y `verificar` gana una puerta de contraste (29 pares, ninguno bajo AA). Hallazgos de calidad: tests importados corridos dos veces (T-019), propiedad real ≠ propiedad declarada (T-023/T-028 colisionaron en criterios), grep no ve clamp() (T-034). KN-020/021/022/023/024 registran estas lecciones.

**QA completado:** Barrido 2026-08-23 (60 flujos, 6 hallazgos, 5 corregidos). Prioridades en tareas/README.md. Cupones solo-en-local pendiente redencion (T-04). Almacén-disco una instancia (T-05). Vitrina escritorio columna 480 (E1). Banner promo por sede (T-07).

## Reglas duras

Líneas congeladas al crear orden. Desglose canal explícito (ventasLocal vs ventasDomicilio). Neto=cierre. Nunca borrar (anular/apagar). PWA una instancia escribiendo data/. JAMÁS sidebar. Cero datos inventados copy público. Clave nunca en repo. Docs equipo sin "dueño/empresa/oficina". Login {usuarioId, clave, puesto} (KN-017, no obvio). Cache del SW jamás /api/* (DEC-003/KN-016 PWA).

## Bloqueado (abierto del dueño)

**PEND-003** (datos broaster reales): 10 productos, teléfonos, precios/local, aceite/empanizado, comisión datafono.

**PEND-004** (Ready, no es bloqueador): Activación — T-10 GitHub 3 repos publicados (KN-016 hallazgo: clones estaban vacíos), equipo por rol, main protegida, hosting bifurcado. PEND-010 acción del dueño (GitHub Desktop + invitaciones).

**PEND-009** (Ready, bloqueado por PEND-003): Hero carrusel portada móvil, refs TOONHUB, fotos en docs/identidad. PROMPT v3 listo (docs/claude-design/PROMPT.md), hallazgos de direcciones de arte + armadura contra el medio + coreografía.

**PEND-001** (DIAN): Facturación electrónica sí/no. Mitigación: comprobante interno primero, interfaz para DIAN después.

**PEND-002** (Datos de negocio): cuántos puntos, domiciliarios, top 10 productos, tandas, usuarios, medios pago, logo/colores (parcialmente resuelto).

## Objetos clave

**DEC-001/DEC-002** Proyecto + foco broaster. **DEC-003** Stack + PWA (fusionó DEC-012 2026-08-27). **DEC-004** Marca rojo/amarillo. **DEC-005** Timing-safe. **DEC-006/DEC-007/DEC-008/DEC-009** Modulo gastos, pivote dos caras, repo cliente, tres repos. **DEC-010/DEC-011** Planes v2, ritual semanal (ORION juez, PDF celular).

**KN-001/KN-002/KN-004** Palancas del negocio, modelo inventario, Broaster vs asadero. **KN-005** Mapa bifurcado (68 tests). **KN-007** Gastos (G-XXXX). **KN-010** Sistema vivo (polling 8s). **KN-012** Login Orama. **KN-013** Plan dos piezas. **KN-015** QA formal (6 hallazgos). **KN-017** Contrato login {usuarioId, clave, puesto}. **KN-019** Prohibiciones en pares. **KN-020/KN-023** Olas de agentes, colisión de criterios. **KN-021** Presupuesto -52% (verificador gratis cuando criterios son comandos). **KN-024** Grep + navegador para verificar.

**ROAD-001/ROAD-002** Done (Caja, Gastos). **ROAD-003/ROAD-004/ROAD-005** Planned (página, tanda, crecer).
