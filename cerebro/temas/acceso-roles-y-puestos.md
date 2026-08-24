---
slug: acceso-roles-y-puestos
titulo: "Acceso: roles, puesto por equipo y qué ve cada persona"
alias: [login, logins, iniciar sesion, inicio de sesion, sesion, sesiones, entrar al sistema, pin, pines, clave, claves, contrasena, contrasenas, usuario, usuarios, perfil, perfiles, rol, roles, permiso, permisos, cajero, cajeros, caja, cajas, mostrador, arqueo, turno, turnos, dueno, duenos, admin, administrador, trabajador, empleado, empleados, puesto, puestos, equipo, equipos, pc, dispositivo, dispositivos, sede, sedes, local, locales, sucursal, sucursales, vincular, vinculacion, desvincular, bloqueo, bloqueado, intentos fallidos, fuerza bruta, timing-safe, cookie, cookie firmada, hmac, scrypt, bcrypt, verificar_pin, 401, 403, gate, gating, autenticacion, autorizacion, acceso, personas, quien ve que, que ve el cajero, modelo mercaplaza, manda el pc, doble login, re-pin, escalada de privilegios]
preguntas: ["¿cómo es el login de los sistemas de la casa?", "el cajero qué puede ver", "¿qué ve un cajero y qué no ve?", "¿cómo hago que cada PC facture en la sede que le toca?", "¿con PIN o con usuario y contraseña?", "¿cómo se arman los roles y permisos en estos sistemas?"]
proyectos: [placita, villa-broaster, estanco-contable, wrd, arroces]
confianza: alta
actualizado: 2026-08-24
---

# Acceso: roles, puesto por equipo y qué ve cada persona

## Respuesta corta

**Son DOS logins, no uno.** Primero entra el EQUIPO —"¿qué puesto es este?", una
sola vez por navegador, guardado en `localStorage`, y **solo el dueño lo
vincula**—; después entra la PERSONA con **su propio PIN de 4 dígitos** (nadie
comparte PIN: el PIN es la firma). **MANDA EL PC**: la sede/local de la sesión
sale del puesto, jamás de quien teclea. **Qué ve cada quien sale de UNA tabla
pura `rol → secciones`** que consultan igual la pantalla y la API — esconder la
pestaña es cortesía, **el 403 es la puerta**. **Bloquea por `usuario@sede:puesto`**
(5 fallos, 15 minutos), nunca el local entero. Y la lista de secciones **se
decide negocio por negocio**: "el cajero solo ventas" es la regla del asadero,
no una ley de la casa.

## Por qué (qué lo pagó)

**Lo pagó el origen contable de la mercancía.** El doble login no es un patrón
elegante: es la respuesta a que el local es la frontera contable. Petición
literal del dueño el 2026-07-29 en el estanco —"dos logins, uno general del
sistema y otro para que cada PC entre al local que le toca facturar"
(`estanco-contable/KN-007`)—. La razón está escrita en el código:
`lib/dispositivo.ts:20-28` prohíbe que un trabajador repuntee su propio equipo
*"podría hacer que sus movimientos salieran del local que más le convenga —
falsearía de dónde salió la mercancía"*. Y en villa-broaster el mismo argumento
se escribe desde el mostrador: *"un cajero apurado que tiene que elegir sucursal
en un desplegable termina, tarde o temprano, facturando en la sucursal
equivocada"* (`lib/acceso/puestos.ts:5-13`), y ese error **no se corrige
después, se arrastra al cuadre**.

**Lo pagó una escalada de privilegios real.** En Mercaplaza, sin la comprobación
de rol **del lado del servidor**, cualquier cajero con una caja abierta podía
resetear el PIN del dueño: la ruta creía lo que venía en el cuerpo de la
petición. El arreglo es el **doble candado** —header `x-clave-caja` MÁS el PIN
del dueño verificado con la RPC `verificar_pin`, leyendo `rol='dueno'` y
`activo=true` **de la fila que devuelve la propia RPC, nunca del body**
(`placita/KN-021`, commit `e485a78`)—.

**Lo pagó un bloqueo que paraba el local entero.** Antes había un solo contador
para todo el panel: cinco claves malas y no entraba nadie. Con cajeros eso deja
de ser correcto —*"un cajero que se equivoca cinco veces no puede dejar al dueño
por fuera, ni al otro cajero, ni a la otra sede"*
(`villa-broaster/lib/acceso/bloqueos.ts:6-16`)—. La llave pasó a ser
`usuario@sede:puesto`.

**Lo pagó un PIN de admin filtrado en un comentario.** En WRD los smokes dieron
verde; dos refutadores opus dedicados encontraron **16 hallazgos reales**, entre
ellos un PIN de administrador real escrito en un comentario tipo doctest dentro
del código (`wrd/KN-004`). Regla que salió de ahí: en auth/admin/RLS, verifier
normal **y además** una ronda adversarial.

**Y lo sigue pagando hoy:** el PIN de arranque `0000` del bootstrap de Mercaplaza
**sigue vigente** (confirmado 2026-08-19/20), y ningún agente puede cambiarlo
porque la ruta exige el PIN actual del dueño (`placita/RSK-001` + `KN-024`).
El candado que protege es el mismo que impide arreglarlo por él.

## Cómo se aplica

1. **Paso 1 — vincular el equipo.** Primer arranque del navegador: *"¿Qué puesto
   es este equipo?"* → sede + nombre ("Caja · Villa del Viento", "Caja 1",
   "Bodega"). Se guarda en `localStorage` bajo una llave con prefijo de marca
   (`villaBroaster.puesto`, `CLAVE_PUESTO`), envuelto en `try/catch` porque el
   almacenamiento puede no estar (`components/admin/puesto.ts:10-14`).
   **Exige el PIN del dueño** para vincular y para repuntar.
2. **Paso 2 — entrar la persona.** Botón "Soy cajero" / "Soy dueño" → lista de
   perfiles activos de ese rol → teclado numérico grande, 4 dígitos, **sin botón
   de Entrar**: con el cuarto dígito entra solo
   (`placita/manual/03-entrar-con-su-pin.md`). En sistemas con panel de escritorio
   el mismo paso admite clave larga: PIN de 4-8 dígitos **o** clave de ≥8 si no
   es solo numérica (`villa-broaster/lib/acceso/usuarios.ts:71-78`).
3. **La sede sale del puesto, siempre.** `construirSesion` toma
   `puesto.localId`, nunca `persona.localId` (`placita/lib/auth.ts:64-71`), y en
   villa-broaster el puesto viaja **firmado dentro de la cookie** para que ni una
   cookie retocada pueda mudarse de sede (`app/admin/_lib/auth.ts:18-22`,
   `sedeExigida` en `:305-307` devuelve `null` para el admin y la sede del puesto
   para el cajero).
4. **Una sola tabla `rol → secciones`, pura y compartida.** La consultan la UI
   (para pintar pestañas) y las rutas de API (para decidir el 403), de modo que
   navegador y servidor no puedan tener dos ideas distintas
   (`villa-broaster/lib/acceso/roles.ts:11-15` y `:37-43`;
   `placita/lib/auth.ts:261-281`; `estanco-contable/components/app-shell.tsx:100-104`).
   **Una sección sin entrada en la tabla queda cerrada para todos, no abierta por
   descuido.**
5. **Distingue 401 de 403.** 401 = no hay sesión (que entre); 403 = hay sesión
   pero ese rol no ve esa sección (que llame al dueño; recargar no le sirve).
   `exigirSeccion("gastos", "ver los gastos")` en cada ruta
   (`app/admin/_lib/auth.ts:276-289`, uso en `app/api/admin/gastos/route.ts:19`).
6. **Sesión firmada y fail-closed.** Cookie `httpOnly` con
   `{usuarioId, nombre, rol, puesto, exp}` firmada HMAC-SHA256; firma mala, JSON
   que no parsea, forma inesperada o vencida → `null`, nunca "medio válida"
   (`lib/acceso/sesion.ts:79-117`). El secreto se deriva de `ADMIN_CLAVE` si no
   hay `SESION_SECRETO`, para conservar la propiedad de que **cambiar la clave del
   dueño cierra sola todas las sesiones abiertas** (`:52-54`).
7. **Bloqueo por combinación, y el orden importa.** 5 fallos → 15 minutos sobre
   `usuario@sede:puesto` (`bloqueos.ts:29-31`), y el bloqueo **se resuelve ANTES
   de mirar la clave**: si se comparara igual, el tiempo de respuesta se volvería
   un oráculo para adivinarla (`app/admin/_lib/auth.ts:135-141`). Usuario
   inexistente, inactivo y clave mala devuelven **el mismo mensaje** (`:211-216`).
   Comparación siempre timing-safe: `sha256` + `timingSafeEqual` sobre los dos
   lados, nunca `===` (`villa-broaster/DEC-005`).
8. **Anti-encierro, en dos formas.** (a) El administrador semilla entra con
   `ADMIN_CLAVE` del entorno y **no tiene hash en disco**: si el archivo de
   usuarios se borra o alguien desactiva a todos, el dueño abre igual
   (`lib/acceso/usuarios.ts:16-23`). (b) En Mercaplaza no se puede desactivar al
   último dueño activo ni desactivarse uno mismo con la propia autorización —409
   en ambos casos (`placita/KN-022`).
9. **Se desactiva, no se borra.** Un cajero que se fue puede volver, y borrarlo
   dejaría sin explicación las sesiones que abrió (`lib/acceso/usuarios.ts:37-39`).
   Resetear el PIN además **desbloquea** a quien estaba bloqueado por intentos:
   es comportamiento de producto, no efecto colateral
   (`placita/KN-022`, `supabase/esquema.sql:902-907`).
10. **Re-PIN para lo irreversible.** Anular una venta, borrar una factura o
    levantar el bloqueo de salida piden el PIN **otra vez**, de la persona con
    autoridad (`placita/DEC-005`, `components/store.tsx:2245`). Es lo que convierte
    el PIN en firma.
11. **Aterrizaje por rol, no menú para todos.** Dueño → portada; cajero →
    directo a vender, sin pasar por ningún menú
    (`placita/lib/auth.ts:293-296`, documentado en el manual §3).
12. **Cerrar sesión NO toca el puesto.** El puesto es del equipo, no de la
    persona: el siguiente turno entra en la misma caja sin volver a vincular nada
    (`app/admin/_lib/auth.ts:238-244`; en Mercaplaza, sesión en `sessionStorage` y
    puesto en `localStorage`, `estanco-contable/KN-007`).

### Qué ve el cajero — las tres tablas reales, que NO coinciden

| Negocio | Roles | Lo que ve quien está en la caja |
|---|---|---|
| **villa-broaster** (asadero, 2 sedes) | `administrador`, `cajero` | **Solo Órdenes** (y Caja cuando exista T-04), y solo de SU sede. Gastos, Comparativa, Productos, Suscriptores y Usuarios responden 403. `lib/acceso/roles.ts:37-43` |
| **placita / Mercaplaza** (plaza de mercado, en producción) | `dueno`, `trabajador` (la UI lo llama "cajero") | **Seis secciones**: principal, ventas, inventario, jornada, canastillas, tareas. NO ve dashboard, facturas, pedidos, basurero, factura-electrónica, personas ni ventas-resumidas. `lib/auth.ts:261-276` |
| **estanco-contable** (3 estancos) | `dueno`, `admin`, `cajero` | **`/ventas` y `/facturas`** — "factura y consulta lo suyo". Existe un rol intermedio `admin` que ve inventario, compras y reportes **de su sucursal**. `components/app-shell.tsx:100-104`, `lib/types.ts:54-59` |

La regla que **sí** es transversal, y la que hay que copiar: *`ventas-resumidas`
es del dueño y de nadie más, y no por costumbre: es la foto de cuánta plata hay
en cada caja hoy —un cajero que la abriera vería el cajón del compañero*
(`placita/lib/auth.ts:188-195`). **El arqueo y la plata de los demás nunca son
del cajero**; lo que cambia entre negocios es cuánto trabajo físico se le
delega, no cuánta plata se le muestra.

## Cuándo NO aplica

- **"El cajero solo ventas" no se copia sin traducir.** En el asadero cobrar es
  todo lo que hace; en la placita el mismo puesto **recibe mercancía, surte,
  registra merma de perecederos y marca jornada**, así que recortarlo a una
  pantalla dejaría el negocio parado. Decide la lista por **lo que la persona
  tiene que hacer con las manos**, no por el título del rol. Dos roles bastan
  cuando el dueño está en el local; el estanco necesitó un tercero (`admin`)
  porque son tres puntos y el dueño no está en ninguno.
- **Fase 1 interna: puede no haber login.** En arroces `/panel` y `/caja` se
  abren por URL directa, sin auth ni roles — kiosko de mostrador de un solo
  local (`arroces/DEC-004`). Es aceptable **solo mientras el negocio no esté
  expuesto al público**; queda anotado como deuda (`arroces/PEND-005`).
- **No copies el PIN en claro de Mercaplaza.** `lib/auth.ts:24-34` guarda y
  compara `Persona.pin` sin hash, y lo dice en su propia cabecera: sin backend,
  hashear sobre datos que igual terminan en claro en `localStorage` *"sería
  seguridad de mentira"*. **Eso ya está superado**: desde la Fase A de Supabase el
  PIN se verifica en Postgres con la RPC `verificar_pin` (bcrypt, esquema
  `privado.credenciales`) y los PIN de seed viejos no funcionan más
  (`placita/KN-024`). En proyecto nuevo con servidor: hash desde el día uno
  (scrypt `N=16384,r=8,p=1` en `villa-broaster/lib/acceso/usuarios-disco.ts:53-54`).
- **La autorización por PIN del dueño no escala a varios dueños.** Con más de un
  dueño activo el sistema **se niega y pide que lo haga él desde su sesión**, en
  vez de probar uno por uno: cada intento fallido cuenta contra el bloqueo del
  dueño equivocado (`placita/components/store.tsx:2973-2987`).
- **En la cara pública, el gate se invierte.** La landing no acepta login de
  administración: responde un **error neutro que no revela que la cuenta es de
  admin** y expulsa la sesión si quedó colada (`wrd/DEC-009`). No pongas ni un
  enlace del sitio público hacia el sistema (`wrd/DEC-008`).
- **Gating por dispositivo es UX, no seguridad.** WRD permite crear cuenta solo
  en celular y lo repite en el servidor como defensa en profundidad, pero lo dice
  explícito: *la barrera real de datos sigue siendo RLS, el servidor no puede
  saber el dispositivo* (`wrd/DEC-007`). Igual aquí: **esconder la pestaña es
  cortesía, el 403 es la puerta**.

## Evidencia

- `estanco-contable/KN-007` — el DOBLE LOGIN, decisión literal del dueño
  2026-07-29; persona en `sessionStorage`, puesto en `localStorage`, MANDA EL PC.
- `placita/KN-021` — doble candado para mutaciones administrativas; sin él, un
  cajero resetea el PIN del dueño (escalada de privilegios). Commit `e485a78`.
- `placita/KN-022` — anti-encierro (409), compensación sin transacción, reset de
  PIN que desbloquea, personas/puestos write-through (nunca optimistas).
- `placita/KN-024` + `RSK-001` — el PIN se verifica contra `verificar_pin`
  (bcrypt); el PIN de arranque `0000` sigue vigente y ningún agente puede
  cambiarlo.
- `placita/DEC-005` y `DEC-021` — re-PIN del cajero para borrar (no reversible);
  vincular un puesto nuevo entrega la clave de caja sola, protegido por
  `verificar_pin` + `rol='dueno'` server-side.
- `villa-broaster/PEND-007` — la feature completa en `feature/roles-puestos`,
  commit `f064c81`, **107 tests en verde**, e2e de admin OK; PAUSADA por orden del
  proyecto ("nada de código aún").
- `villa-broaster/DEC-005` — timing-safe `sha256`+`timingSafeEqual`, 5 intentos /
  15 min, fail-closed en producción sin `ADMIN_CLAVE`.
- `villa-broaster/KN-012` y `landings/KN-005` — el **estándar visual de login de
  la casa** ("estilo Orama"): hero media 57% / panel 43%, tarjeta de vidrio blur
  24 px, entrada en cascada .82s, Ken Burns 28s, contraste medido (H1 14.86:1
  AAA, botón 11.97:1 AAA), `prefers-reduced-motion` = 0 animaciones. Plantilla:
  `ORION/prompts-landing/plantillas/login-video-pixel-locked.md` — **se hereda la
  arquitectura, no los números**.
- `estanco-contable/KN-008` — el trigger anti-escalada de `001_rol_actual.sql` se
  validó **37/37** contra un Postgres real levantado con `embedded-postgres`.
- `wrd/KN-004` — 16 hallazgos que los smokes no vieron, incluido un PIN de admin
  en un comentario; ronda adversarial obligatoria en auth/admin/RLS.
- Código, con archivo y línea: `villa-broaster/broaster-app/lib/acceso/{roles.ts,
  sesion.ts,puestos.ts,bloqueos.ts,usuarios.ts,usuarios-disco.ts}`,
  `app/admin/_lib/auth.ts:135-141,238-244,276-289,305-307`;
  `placita/lib/{auth.ts,dispositivo.ts}`, `placita/components/store.tsx:2245,2973-2987`,
  `placita/app/(auth)/login/page.tsx:321-326`;
  `estanco-contable/components/app-shell.tsx:100-104`.
- Encargo con criterios de aceptación verificables:
  `villa-broaster/tareas/T-11-usuarios-y-roles.md`.
- Cómo se le explica a la gente del local:
  `placita/manual/02-primer-arranque.md` y `03-entrar-con-su-pin.md`
  (ambos "Verificado: 2026-08-21").

### Huecos — lo que el corpus NO respalda todavía

- **Auditoría "quién cobró qué" está pedida, no hecha.** Guardar `usuarioId` y
  `puesto` en la orden al cobrar es el punto 1 de `T-11-usuarios-y-roles.md:24-25`
  y sigue pendiente. En Mercaplaza existe el equivalente parcial: las ventas se
  agrupan por `Venta.puestoId`, nunca por el prefijo del número de factura
  (`placita/KN-039`), y la anulación guarda `anuladaPor`.
- **Sin expiración configurable, sin cambio de PIN obligatorio al primer ingreso
  y sin rotación documentada de la clave del administrador** — los tres son el
  punto 3 de `T-11:29-31`, todavía abiertos. Hoy la sesión dura 12 h fijas
  (`lib/acceso/sesion.ts:46`).
- **Deriva entre memoria y código:** `placita/PEND-012` sigue marcado "Ready"
  ("¿el cajero entra directo a /ventas?") pero el código ya lo decidió
  (`lib/auth.ts:293-296`) y el manual lo documenta como verificado. Al leer un
  pendiente de este tema, comprobar el código antes de reabrir la discusión.
- **El único modelo de roles server-side por RLS nunca se ejecutó:**
  `infrapilot/RSK-001` — `003_organizations.sql` (233 líneas, helpers
  security-definer, trigger de owner-bootstrap) fue revisado leyéndolo, nunca
  corrido. Y `estanco-contable/KN-008` demuestra que **sí se puede probar** en
  esta máquina con `embedded-postgres`.
- **No hay en el corpus** nada sobre segundo factor, recuperación de PIN por el
  propio usuario, expiración por inactividad, ni auditoría de inicios de sesión.
  Si alguien lo pide, es diseño nuevo, no memoria.

## Enlaces

- [[TEMA-caja-y-turnos]] — a quién pertenece la plata que entra por este mismo
  mostrador; el arqueo es la pantalla que el cajero justamente no ve.
- [[TEMA-generadores-de-diseno]] — cómo se le encarga la **pantalla** de login a
  un generador de diseño (el estándar "estilo Orama" citado arriba).
