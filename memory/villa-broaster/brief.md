# villa-broaster — brief (2026-09-08)

## Qué es

Cliente Villa Broaster (pollo broaster, dos sedes: Villa del Viento y Vía al Bosque). **TRES repos** (nombres exactos, DEC-013): `Equipo-villa-broaster` (README, PLAN-EQUIPO.md, PENDIENTES-GIT.md, tareas/ T-01..T-11, docs/), `broaster-app-repo` (broaster-app :3200, PWA, solo senior), `villa-app-repo` (villa-app :3201, stateless, diseñadores). Los nombres `villa-broaster-sistema` y `villa-broaster-vitrina` están OBSOLETOS. **Se trabaja desde DOS máquinas** (la Mac y el PC), así que la fuente de verdad
NO es ningún clon: es el **remoto de GitHub**. En la Mac los repos están en
`/Users/g/orion/prommter/<repo>` y la memoria ORION en
`/Users/g/orion/memory/villa-broaster/`; en el PC las rutas son las suyas. La
memoria vive aparte del repo que lee el equipo, en el repo `orion`. **Primer
comando de cualquier sesión, en cualquier máquina: `git fetch`** — el 2026-09-08
los clones locales estaban por detrás del remoto DOS veces en un solo día, y una
de ellas casi hizo reportar un estado de hace una semana.

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

Lo que queda para el dueño (completado en esencia por 2026-09-01, archivado): invitar a las 3 personas por rol en GitHub y borrar en
GitHub los dos repos obsoletos. **Proteger `main` no se puede** en repos privados del
plan gratuito (403 'Upgrade to GitHub Pro') — hay que decidir entre pagar Pro, hacerlos
públicos, o sostener la puerta de calidad por acuerdo.

Al comparar árboles traídos de Windows contra un checkout en la Mac, el diff
miente: CRLF vs LF marcó 166 archivos como distintos con cero diferencias
reales (KN-035). Usar `diff --strip-trailing-cr`.

## Sesión del 2026-09-08 — el rumbo quedó definido (leer esto antes que nada)

### Lo que el dueño decidió, y que manda sobre todo lo anterior

**El objetivo del producto (DEC-014):** el sistema corre en los DOS locales, la
landing pública mete pedidos al sistema, y el dueño ve el movimiento de ambas
sedes **desde cualquier celular, en tiempo real**. Textual suyo: *control total*.
Y añadió que ese es el fin **para todos sus proyectos de negocios**, no solo este.
Eso cierra el HUECO 3 de `persistencia.md`, que era la pregunta que bloqueaba la
arquitectura entera.

**La arquitectura (DEC-015):** preguntado si la caja puede dejar de vender cuando
se cae internet, respondió **NO**. Por lo tanto: **local primero, nube después**.
Cada sede escribe en su almacén y sube por outbox; la nube es espejo y punto de
encuentro, no requisito para cobrar. Descartado el todo-en-la-nube, que era la
mitad de trabajo. El patrón está curado en el tema **`la-caja-no-puede-parar`** con
los tiempos ya medidos en placita (sube al foco o cada 4 s, baja cada 10, y **con
cola pendiente no se baja nada**) y sus dos trampas de convergencia pagadas.

**Consecuencia de alcance:** entran el almacén centralizado (18 métodos de
`AlmacenDatos` + 4 de `AlmacenUsuarios`) y el outbox/sincronizador. Los
consecutivos siguen siendo por local (`L1-`/`L2-`), así que dos cajas
desconectadas no colisionan; el caso a resolver es el pedido nacido en la nube,
donde la nube manda y el local adopta el número.

### Infraestructura real (medida contra el servidor, no supuesta)

| Hecho | Estado |
|---|---|
| **VPS Hostinger KVM 1 comprado** | IP `2.25.89.240`, confirmada de Hostinger por whois |
| **El VPS NO está vacío** | Responde con **Traefik**: trae una plantilla de aplicación. Hay que dejarlo limpio antes de instalar nada (DESPLIEGUE.md §8.0) — el dueño ya dijo que quiere reinstalarlo limpio |
| **`prommter.org`** | Es el dominio de **la agencia**, y NO apunta al VPS: va al hosting compartido y responde **503**. Ese era el 503 que el dueño veía |
| **Dominios** | Decidido: **uno por negocio**, con `caja.<dominio>` para el sistema. Villa Broaster necesita el suyo, a nombre del CLIENTE |
| **Capacidad** | El sistema consume **108 MB de RAM** medidos. En 4 GB caben 3-4 negocios; el límite es 1 vCPU, no la memoria |
| **Costos** | VPS ~$12/mes al renovar. Supabase Pro $25/mes si algún día entra base gestionada — su plan Free pausa proyectos tras una semana sin uso y por eso no sirve para una caja. Cerrado el HUECO 7 en `costos.md` §3.1 |

### Software: dos defectos de despliegue arreglados hoy

1. **No compilaba.** La guardia de entorno mataba `next build` pidiendo
   `ADMIN_CLAVE` para compilar. Compilar no es arrancar (KN-036, tema
   `construir-no-es-arrancar`). Y la puerta `verificar` **no construía**, por eso
   446 tests en verde convivían con una app indesplegable: el build entró a la
   puerta y `verificar:completo` desapareció.
2. **El puerto estaba clavado** en 3200/3201 en los DOS repos, así que en un
   hosting la app escuchaba donde el proxy no la busca — un 503 sin un error en el
   registro (KN-037). Ahora `scripts/arrancar.mjs` obedece `PORT` y resuelve el
   binario **por ruta y no por PATH**, porque systemd no trae PATH y el servicio
   habría muerto al arrancar.

**Verde al cierre:** broaster-app **478/478** + build, villa-app **30/30** +
build, arranque comprobado con `node` directo sin npm. Despliegue preparado y
publicado: `despliegue/*.service` en cada repo, `docs/despliegue/Caddyfile.ejemplo`
y el procedimiento entero en **`docs/DESPLIEGUE.md` §8** (repo del equipo).

**AVISO que va primero en cualquier despliegue:** publicar en el VPS **no conecta
los PCs de los locales**. El servidor queda con su carpeta vacía. Si alguien cobra
en el local y alguien cobra en el servidor, son dos contabilidades que nadie podrá
cuadrar.

### Para quien trabaje en la LANDING DE VENTAS (villa-app)

- **La carta real ya llegó** (T-259, commit `2601186`): 14 productos con foto —
  presas, chuletas de pollo y cerdo, nuggets, arroz con pollo **solo sábados**,
  consomé, papas, yuca, papa horneada, arepa, jugo— y la pechuga a **precio
  distinto por sede**. **Los precios siguen siendo de ejemplo**: PEND-003 bajó de
  "no hay carta" a "faltan precios reales y teléfonos".
- **PEND-009** (hero carrusel móvil) sigue Ready; el PROMPT v3 está en
  `docs/claude-design/PROMPT.md`. Con la carta real ya se puede avanzar en todo
  salvo los precios, que **no se inventan** (tema `cero-datos-inventados`: lo que
  falte va como hueco numerado y VISIBLE, nunca relleno verosímil).
- La vitrina **no guarda nada** y localiza el sistema por `SISTEMA_URL`; ya
  resolvió por su cuenta el problema de construir-vs-arrancar usando la fase que
  Next entrega a la config. No meterle estado.
- **Los clones locales han ido por detrás del remoto DOS veces en un solo día**
  (broaster-app y villa-app). **`git fetch` antes de dar cualquier estado o tocar
  cualquier archivo.**

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

**DEC-001/DEC-002** Proyecto + foco broaster. **DEC-003** Stack + PWA (fusionó DEC-012 2026-08-27). **DEC-004** Marca rojo/amarillo. **DEC-005** Timing-safe. **DEC-006/DEC-007** Módulo gastos, pivote dos caras. **DEC-009** Tres repos por rol (absorbió DEC-008 2026-09-03). **DEC-010/DEC-011** Planes v2, ritual semanal (ORION juez, PDF celular). **DEC-013** Repos canónicos post-mudanza Mac.

**KN-001/KN-002/KN-004** Palancas del negocio, modelo inventario, Broaster vs asadero. **KN-005** Mapa bifurcado (68 tests). **KN-007** Gastos (G-XXXX). **KN-010** Sistema vivo (polling 8s). **KN-012** Login Orama. **KN-013** Plan dos piezas. **KN-015** QA formal (6 hallazgos). **KN-017** Contrato login {usuarioId, clave, puesto}. **KN-019** Prohibiciones en pares. **KN-020/KN-023** Olas de agentes, colisión de criterios. **KN-021** Presupuesto -52% (verificador gratis cuando criterios son comandos). **KN-024** Grep + navegador para verificar.

**ROAD-001/ROAD-002** Done/Archived (Caja E1, Gastos E2 — completadas 2026-08-25). **ROAD-003/ROAD-004/ROAD-005** Planned (página E3, tanda E4, crecer E5).
