---
slug: dominio-migraciones-y-copias
titulo: Cambiar la forma de datos que ya existen sin romperle el sistema a nadie
alias: [migracion, migraciones, migrar, migrarlo, migro, migracion de datos, migracion sql, script sql, correr el sql, pegar el sql, sql editor, sql, supabase, esquema, schema, esquema nuevo, tabla, tabla nueva, columna, columna nueva, add column, campo, campo nuevo, campo obligatorio, agregar un campo, anadir un campo, agregar una columna, quitar un campo, borrar un campo, renombrar, renombrar campo, cambiar la forma, cambiar el formato, formato de datos, contrato de tipos, types.ts, version de datos, VERSION_DATOS, subir la version, bump, bump de version, v6, v7, v4 v5, sobre, datos viejos, datos guardados, datos persistidos, datos del navegador, localstorage, local storage, cache, cache vieja, respaldo, respaldo-v3, claveRespaldo, backup, embedded-postgres, postgres embebido, postgres, postgresql, psql, docker, supabase cli, probar una migracion, probar el sql, como pruebo el sql, sql sin ejecutar, revisado no es ejecutado, idempotente, idempotencia, correr dos veces, reaplicar, 42P01, 42703, PGRST204, does not exist, schema cache, 503, MIGRATION_REQUIRED, MIGRATION_002_REQUIRED, banner, aviso de migracion, degradar, degradacion, rls, policy, politica, trigger, security definer, constraint, backfill, orden, orden de las migraciones, orden de aplicacion, en que orden, en que orden se aplican, se aplican, aplican, aplicar, aplicarla, aplicarlas, aplicar la migracion, aplicadas, aplique, secuencia, cual primero, cual va primero, primero cual, encadenar, se rompio la pagina, se cayo la pagina, pagina caida, pantalla en blanco, undefined toFixed, arranco en blanco, se borraron los datos, portar modulo, portar un modulo, copiar modulo, copiar un modulo, proyecto hermano, hermano, calcar, calcado, clonar, reusar, reusar codigo, supuestos temporales, unidades, unidad, kilos, gramos, peso, segundo eje, costo por unidad, costo de ventas en cero, ganancia inflada, outbox, cola, reintenta, seed, semilla, resembrar]
preguntas: ["como agrego un campo a algo que ya esta guardado", "como pruebo una migracion sql", "se me rompio la pagina con los datos viejos", "en que orden se aplican las migraciones", "en que orden aplico las migraciones y cual va primero", "se puede probar sql aca si no hay docker ni psql", "puedo desplegar si el cliente todavia no ha corrido la migracion", "el sql lo revise y se ve bien - ya cuenta como probado?", "voy a copiar el modulo de caja de otro proyecto: que le reviso antes?", "empezamos a vender por unidad ademas de por peso - que se me rompe?"]
proyectos: [placita, infrapilot, estanco-contable, arroces, villa-broaster]
confianza: alta
actualizado: 2026-08-24
---

# Cambiar la forma de datos que ya existen sin romperle el sistema a nadie

## Respuesta corta

**Todo cambio de forma en datos ya guardados —campo nuevo obligatorio, campo que
se quita, eje nuevo— sube la versión Y trae su migración en el MISMO commit**: el
typecheck no ve los datos viejos del navegador del dueño. **Y córrela de verdad
antes de darla por buena: `npm i embedded-postgres` levanta un PostgreSQL real
(18.4) en el scratchpad y ahí se aplica el `.sql` con asserts en node — no hace
falta psql, ni Docker, ni el Supabase del cliente.** Aplícala **dos veces** para
probar idempotencia. **SQL leído no es SQL ejecutado: hasta que corra, se dice
"sin ejecutar", nunca "lista".** Encadena las migraciones **en orden**, respalda
el crudo antes de descartar nada, y que la pantalla **nombre** la migración que
falta (503 + banner) en vez de fallar callada.

## Por qué (qué lo pagó)

**Lo pagó casi un mes de proyecto trabado por una imposibilidad que era falsa, y
que ya estaba desmentida en otra carpeta.** El 2026-07-28 infrapilot escribió que
`003_organizations.sql` no se podía ejecutar porque *"this machine has no psql, no
supabase CLI, and no Docker"*, y se conformó con una revisión por lectura
(`infrapilot/RSK-001`). **Al día siguiente**, el 2026-07-29, un builder de
estanco-contable levantó un PostgreSQL 18.4 con `embedded-postgres` en el
scratchpad y validó `001_rol_actual.sql` con **37/37 asserts**, idempotencia y
escalada de rol bloqueada incluidas (`estanco-contable/KN-008`, Permanent;
`metrics.json` `session-2026-07-29-estanco`, fase `build:infra` con opus, 100 828
tokens, nota *"001_rol_actual.sql, 37/37 en Postgres real embebido"*). Nadie cruzó
las dos memorias. El precio se mide en calendario: `/organizaciones` y `/perfil`
llevan devolviendo **503 desde el 2026-07-28**, la Etapa 5 entera sigue
`In-Progress` (`infrapilot/ROAD-005`) y `PEND-016` sigue esperando por lo mismo.
La corrección se escribió el **2026-08-24**, y no salió de trabajo nuevo sino de
cruzar dos memorias: *"no se aprendió nada nuevo, se dejó de perder lo ya
aprendido"* (`infrapilot/KN-035`). **Este tema existe por ese mes.** Si vas a
escribir "no se puede probar", busca primero: puede que otro proyecto ya lo haya
probado.

**Lo pagó una página caída en producción, por segunda vez.** Un campo nuevo
obligatorio (`PrecioProducto.precioCompraCop` / `margenBrutoPct`) sin subir
`VERSION_DATOS` ni registrar migración tumbó la pantalla de productos con
`undefined.toFixed` **contra los datos v2 que el dueño ya tenía en su navegador**.
En dev funcionaba —datos nuevos—; en producción caía. *"El typecheck no ve los
datos viejos del navegador y el QA de los builders solo probó con seed fresco"*
(`placita/KN-009`, clase de bug marcada como **2ª vez** en el proyecto). De ahí
salió la regla dura, y hoy está sellada en el contrato de tipos, no en un acta
(`placita lib/types.ts:1382-1387`).

**Lo pagó un costo de ventas en $0 que no rompía nada: solo mentía.** Al abrir el
eje de unidades, ninguna venta por unidad descontaba costo, e inflaba la ganancia
bruta que el dueño mira en balances y dashboard. Se corrigió poniendo el eje en el
**movimiento** y dándole al lote su `costoPorUnidadCop` propio —*"nunca se recicla
`costoPorKiloCop` del modo peso"*— y se verificó en vivo: **ganancia bruta $4.000
sobre un precio de $20.000** (`placita/DEC-022`). Y aun así quedaron **tres
lectores** del eje viejo sin cazar (`placita/PEND-020` a/b/c).

**Lo pagó un supuesto que viajó escondido dentro del código.** `cierre.ts` se
portó del estanco —donde facturar y cobrar son el mismo instante— a un restaurante
donde no lo son: `pedidosDelTurno` seguía filtrando por la fecha de **toma**, así
que la plata cobrada en el turno aparecía como sobrante y las ventas del turno en
$0. *"El bug NO fue de capacidad del modelo: el builder compiló y pasó sus
self-tests; solo lo reveló la verificación E2E en navegador"* (`arroces/KN-001`,
Permanent).

**Y lo pagó un seed barato.** Los lotes de productos por unidad se sembraron con
**0 gramos** y sin unidades, generados con haiku; *"el bug solo lo detectó el
ejercicio end-to-end del POS, no la revisión de código"* (`placita/KN-006`). Esa
mentira útil del seed es literalmente lo que la migración v6→v7 tuvo que
reconstruir un mes después (`placita lib/persistencia.ts:242-270`).

## Cómo se aplica

1. **Cambio de forma = versión + migración, en el MISMO commit.** Campo nuevo
   **obligatorio**, campo que se **quita**, o dato viejo que la versión nueva
   **deja de entender**: los tres exigen bump y entrada de migración a la vez. Y
   el QA de un cambio de contrato **se prueba con un sobre de datos de la versión
   ANTERIOR**, no con seed limpio (`placita/KN-009`; regla sellada en
   `placita lib/types.ts:1382-1387`, hoy `VERSION_DATOS = 7`).
   Ojo con el caso que engaña: la v7 agregó dos campos **opcionales**, así que una
   caché v6 pasaba la validación de forma — *"pero pasaría MINTIENDO"*, con los
   lotes de unidad en cero unidades, o sea agotados el lunes por la mañana
   (`placita lib/types.ts:1370-1381`). **Que valide no significa que diga la
   verdad.**

2. **Córrela de verdad, aquí, gratis: Postgres real en el scratchpad.**
   `npm i embedded-postgres` levanta un **PostgreSQL 18.4** local, se le aplica el
   `.sql` y se comprueban los efectos con asserts en node. **Aplícala DOS VECES**:
   la segunda pasada es la prueba de idempotencia. Se verifica lo que de verdad
   duele descubrir en producción: que corre sin error, que es idempotente, que las
   **policies RLS con `security definer`** hacen lo que dicen y que el **trigger**
   dispara (`estanco-contable/KN-008`; receta ya escrita paso a paso en la
   mitigación de `infrapilot/RSK-001`). Precedente medido: **37/37**. Si un agente
   te entrega SQL "revisado a ojo", devuélveselo a ejecutar.

3. **Hasta que se ejecute, se dice "sin ejecutar".** Una migración que solo se
   leyó no está probada por muy limpia que se vea — `003_organizations.sql` son
   **233 líneas** de RLS con helpers `security definer` y trigger de bootstrap de
   dueño, pasó verificación por lectura y sigue sin correr (`infrapilot/RSK-001`,
   Open). El orden que ya está escrito: **desechable primero → proyecto Supabase
   desechable → base real**, y re-verificar después que las rutas dejaron de
   responder 503. Esto aplica a todo lo que solo se "leyó y se ve bien": scripts de
   borrado, cron jobs, reglas de facturación.

4. **Encadena, ordena, y respalda antes de descartar.** Una entrada por versión de
   ORIGEN, y cada una lleva **solo a la siguiente**: un sobre v4 pasa por la 4 y
   después por la 5, porque *"aplicar solo la primera dejaría un sobre v5 que la
   validación de HOY rechaza"* (`placita lib/persistencia.ts:349-378`). Reglas
   hermanas de ese mismo archivo:
   - **Nada se pierde en silencio.** Versión desconocida, JSON corrupto o forma
     inválida: se copia el crudo tal cual a una clave de respaldo con **marca del
     motivo** (`…:respaldo-v3`, `…:respaldo-ilegible`, `…:respaldo-otra-empresa`)
     y recién ahí se siembra. *"Un bump de `VERSION_DATOS` no puede costarle al
     dueño la operación de su semana"* (`persistencia.ts:25-38` y `:69-74`;
     `persistencia.test.ts:9`).
   - **Se revalida DESPUÉS de migrar**: *"una migración que produce basura no
     pasa: vale más sembrar"* (`persistencia.ts:342-347`).
   - **No se inventa lo que no hay.** En la v6→v7, un movimiento que daría 0
     unidades se deja **sin el eje** antes que anotar un cero: *"eso no es un
     hecho, es la ausencia del dato"* (`persistencia.ts:327-330`). Y el costo por
     unidad se deriva del costo con el que **ese lote** entró, nunca del precio de
     compra de hoy (`:260-264`).
   - En SQL, el orden es **operativo y se comunica**: primero
     `2026-08-21-gastos-y-cierre.sql`, después `2026-08-22-unidades.sql`
     (`placita/KN-040`).

5. **Que el código pueda ir por delante del esquema — pero que lo diga con su
   propio código de error.** Detecta en la ruta el error de "eso no existe"
   (Postgres `42P01`, o el mensaje con `does not exist` / `schema cache`) y
   responde **503 con un código explícito** tipo `MIGRATION_002_REQUIRED`; el
   cliente lo caza y pinta un banner **no descartable** que nombra el archivo
   (`infrapilot/KN-022`, commit `131040f`;
   `infrapilot-app/app/api/organizations/route.ts:5`, `app/api/profile/route.ts:8`,
   `components/migration-notice.tsx`). Así se publicó `/proveedores` con la
   migración todavía pendiente del usuario, y el mismo mecanismo se reutilizó tal
   cual en la 003 — **es la prueba de que aguanta la segunda vez**.
   La placita lo hace **más fino, por tabla**: `faltaEsquema()` mira `42P01`,
   `42703`, `PGRST204` y los mensajes; `MIGRACION_PENDIENTE` traduce el error de
   Postgres a *"cuál archivo hay que pegar en el SQL Editor"*; y `/api/sincronizar`
   rechaza **solo** `lotes`/`gastos`/`cierres` y deja pasar todo lo demás, ventas
   incluidas (`app/api/sincronizar/route.ts:132-142` y `:148-152`; banner en
   `app/(app)/ventas/page.tsx:1473`). Verificado en vivo: *"FALTA APLICAR LA
   MIGRACIÓN 2026-08-21"*, y **nada se pierde porque el outbox reintenta solo**
   hasta que la migración exista (`placita/KN-040`).
   Corolario del propio SQL: se pega **entero, en una sola transacción** —
   *"pegar la mitad deja la tabla creada sin su RLS, que es una tabla abierta"*
   (`2026-08-21-gastos-y-cierre.sql:4-11`).

6. **Si agregas un segundo eje de medida, persíguelo hasta el costo y después caza
   a TODOS los lectores del viejo.** El eje nuevo vive en el **hecho**
   (`Movimiento`), no en el `Lote`; el lote lleva su **costo propio** por unidad y
   jamás recicla el del eje anterior (`placita/DEC-022`). Un $0 no tumba la app: le
   infla la ganancia al dueño, que es peor porque nadie lo nota. Y después haz la
   lista de lectores: en la placita quedaron tres —ficha del POS diciendo *"sin
   piso"* con stock real, resumen de bodega contando **0 kg**, y el consejero
   calculando en gramos— (`placita/PEND-020` a/b/c, `placita/PEND-016`).

7. **Antes de copiar un módulo del proyecto hermano, escribe dos listas y audita
   los supuestos temporales.**
   - **Lista A y lista B, con nombre y commit propio, antes de tocar código:** qué
     se adopta (cobro en bloque, grilla sin scroll, módulo puro) y qué **NO**
     (báscula, multi-factura, PIN, jornada laboral), cada una con su porqué
     (`villa-broaster docs/BASES-CAJA.md:7-19` y `:21-31`, commit `a5686c1`;
     `metrics` `session-2026-08-20-bases-caja`, fase analysis con sonnet, **98 166
     tokens medidos**, run de diseño sin build). **Lo más valioso suele ser
     descubrir que el hermano NO resolvió una pieza**: *"la placita NO resuelve el
     turno de caja"*, así que `TurnoCaja` se diseñó desde cero
     (`BASES-CAJA.md:33-40`, `villa-broaster/PEND-006`).
   - **Reproduce el contrato campo por campo y anota los renombres deliberados.**
     En arroces son tres y están escritos: `Factura`→`Pedido`, `localId`→
     `sucursalId`, y sin `empresaId` porque no hay multi-tenant que aislar
     (`arroces lib/types.ts:15-24`). Esa parte **no dio ni un problema**.
   - **Lista los supuestos IMPLÍCITOS —sobre todo los temporales— y verifícalos uno
     por uno contra el negocio nuevo:** cuándo nace el documento vs. cuándo entra la
     plata, quién es dueño del registro, qué cuenta como "un día". Es lo único que
     falló al portar (`arroces/KN-001`; el razonamiento quedó escrito en
     `arroces lib/dominio/cierre.ts:29-43`, y el supuesto que quedó pendiente, en
     `:55-61`). **El código compila y pasa sus tests igual con el supuesto
     equivocado adentro.**

8. **Relajar una validación del dominio obliga a barrer TODOS sus llamadores,
   no solo el punto donde se relajó.** Es el mismo principio del punto 6
   (perseguir hasta el costo, cazar a todos los lectores), aplicado a un
   invariante en vez de a un eje de medida nuevo. En la placita, permitir
   precio de compra en **cero** ("todavía sin precio", ver
   [[TEMA-donde-vive-el-dato]]) se hizo cambiando `validarCompraPositiva` por
   `validarCompraNoNegativa` en el punto de alta
   (`lib/dominio/precios.ts:39-45`) — pero `margenEfectivoPct`, que **divide
   por la compra**, siguió llamando a la validación estricta
   (`lib/dominio/precios.ts:84-85`) porque nadie la tocó. El resultado: una
   celda de margen sin precio guardado tumbaba la fila **entera** del
   inventario, y no lo encontró quien relajó la validación — lo encontró un
   builder distinto, construyendo la columna encima en el mismo commit
   (`app/(app)/inventario/componentes/lista-productos.tsx:517-534`, comentario
   *"`margenEfectivoPct` exige compra > 0 (dividir por cero no es…)"*). La
   corrección no cambió el invariante de `margenEfectivoPct` —sigue exigiendo
   compra positiva, porque no hay margen honesto que devolver sobre un precio
   que no existe— sino que hizo que la pantalla dijera **"—"** en vez de
   reventar cuando `sinPrecio` es cierto. **El grep que hay que correr antes
   de dar por buena una validación relajada es de los LLAMADORES de la función
   estricta, no de la función misma**: si alguno sigue asumiendo el invariante
   viejo, hay que decidir por cada uno si absorbe el caso nuevo o lo declara
   explícitamente fuera de su dominio (commit `1b0475c`, 2026-08-24).

## Cuándo NO aplica

- **Antes del primer usuario real, la migración es ceremonia.** Si borrar y
  resembrar es gratis, borra y resiembra. Lo que no se negocia es el momento en que
  el dueño ya tiene datos suyos en su navegador o en su base.
- **No todo archivo tiene que ser idempotente — pero sí tiene que decir cuál es.**
  `000_schema.sql` del estanco **no lo es a propósito**: *"las tablas usan `create
  table if not exists`, pero `create policy` y `create trigger` fallan si ya
  existen"*, y por eso el README trae el bloque de `drop … cascade` para reaplicar
  desde cero (`estanco-contable/supabase/README.md`). `001_rol_actual.sql` **sí**
  lo es, y explica por qué: *"es un parche de seguridad, y un parche de seguridad
  tiene que poder reaplicarse sin ceremonia"* (`001_rol_actual.sql:36-40`, con
  `create or replace` en `:134`, `revoke execute` en `:241` y `drop trigger if
  exists` antes del `create` en `:258-260`). La regla es **declararlo en la
  cabecera**, no dejarlo al azar.
- **`embedded-postgres` no prueba lo que solo existe en Supabase.** `auth.uid()`,
  políticas que dependen del JWT, el *schema cache* de PostgREST, extensiones
  propietarias: eso se stubbea con una función falsa o se declara **no
  verificado**. Y tampoco sustituye probar el **orden** de dos migraciones sobre un
  dump con datos reales (ver el hueco de abajo).
- **Si la migración la aplica el propio despliegue, el banner es complejidad
  muerta.** El 503 + aviso existe porque **aquí la aplica una persona a mano** en
  el SQL Editor, en un momento distinto al del deploy. Con un CI que migra y
  revierte, lo correcto es que falle el deploy y ya.
- **Hay datos que se descartan a propósito — y aun así se respaldan.** En la
  placita la v1/v2/v3 **no se migran**: son anteriores al corte a Supabase, y
  migrar ese blob *"sería fabricar una segunda verdad, con ids que la base no
  conoce"*; es orden del dueño (arranque limpio), no descuido
  (`persistencia.ts:190-211`, `persistencia.test.ts:238`). Se respaldan igual.
  Lo mismo al eliminar un subsistema: la tabla `public.pulpas` de Supabase quedó
  **intacta** porque *"dropearla es decisión destructiva del dueño, aún no
  tomada"*, mientras la caché local sí migró v4→v5 sin perder la jornada
  (`placita/DEC-015`).
- **No agregues un segundo eje "por si acaso".** Dos ejes duplican para siempre los
  lectores que hay que mantener sincronizados — y la lista de `PEND-020` es lo que
  cuesta olvidarse de uno.
- **La auditoría de supuestos no es excusa para reescribir desde cero.** Calcar
  sigue siendo lo correcto: arroces salió del estanco con **38/38 self-tests y un
  solo ciclo de fix** portando dos módulos completos (`arroces/DEC-001`,
  `arroces/KN-001`). La auditoría es un checklist de quince minutos. Y no aplica a
  utilidades sin semántica de negocio (formateo, helpers de UI): ahí no hay
  supuestos que auditar.
- **No copies del hermano por parecido superficial.** Si el rubro tiene reglas de
  negocio incompatibles, empezar limpio es más barato — y el propio análisis debe
  caber en una página, no convertirse en un run entero.

## Evidencia

- `infrapilot/KN-035` (2026-08-24) — **el hallazgo caro**: sí se pueden probar las
  migraciones aquí; el supuesto contrario tuvo el proyecto trabado casi un mes.
  `infrapilot/RSK-001` (Open, creado 2026-07-28, corregido 2026-08-24) — 233 líneas
  nunca ejecutadas y la mitigación paso a paso. `infrapilot/ROAD-005` (In-Progress
  desde 2026-07-28), `infrapilot/PEND-016` (bloqueado por lo mismo).
- `estanco-contable/KN-008` (**Permanent**, 2026-07-29) — `embedded-postgres`,
  PostgreSQL **18.4** en el scratchpad, `001_rol_actual.sql` **37/37** con
  idempotencia y escalada bloqueada; dice explícitamente que aplica a cualquier
  proyecto de esta máquina, *incluida la 003 de infrapilot*.
  `metrics.json` `session-2026-07-29-estanco`, `build:infra` (opus, **100 828**
  tokens): *"001_rol_actual.sql, 37/37 en Postgres real embebido"*.
- `infrapilot/KN-022` (commit `131040f`) y `infrapilot/PEND-015` — patrón
  42P01 → 503 `MIGRATION_NNN_REQUIRED` + banner, establecido en la 002 y
  reutilizado en la 003.
- `placita/KN-009` — clase de bug (2ª vez): campo obligatorio nuevo sin bump tumba
  producción; el QA debe probar con datos de la versión anterior; la trampa
  `Object.defineProperty` para cazar el `undefined.X` en vivo; la clave real es
  `placita:datos:<empresaId>`.
- `placita/KN-040` — orden obligatorio de las dos migraciones, aviso verificado en
  vivo y outbox que reintenta solo. `placita/DEC-022` — eje de unidades en el
  Movimiento, costo por unidad propio, **$4.000 de ganancia bruta sobre $20.000**
  verificado en vivo, migración v6→v7 + SQL. `placita/PEND-020` (a/b/c) y
  `placita/PEND-016` — los lectores del eje viejo que quedaron. `placita/DEC-015` —
  v4→v5 y la tabla que NO se dropea. `placita/KN-006` — seed con invariantes
  cruzadas generado con haiku; solo lo cazó el e2e. Commit `1b0475c`
  (2026-08-24) — relajar `validarCompraPositiva` a `validarCompraNoNegativa`
  sin barrer `margenEfectivoPct` tumbaba la fila del inventario:
  `lib/dominio/precios.ts:39-45` y `:84-85`,
  `app/(app)/inventario/componentes/lista-productos.tsx:517-534`.
- `arroces/KN-001` (**Permanent**) — auditar los supuestos temporales al portar un
  módulo de dominio. `arroces/DEC-001` — calcado del estanco, 38/38 self-tests.
  `arroces/DEC-002` — el pedido nace sin pagos; `cobradoEn` se sella al cobrar.
- `villa-broaster/PEND-006` — plan de 5 pasos con blast radius por paso y el
  hallazgo *"placita NO tiene turnos de caja"*; `metrics`
  `session-2026-08-20-bases-caja` (analysis, sonnet, **98 166** tokens, MEASURED).
- `estanco-contable/PEND-008` — clave de idempotencia **por dispositivo** para que
  la cola offline no duplique facturas al volver la señal. `placita/KN-038` — con
  cola pendiente de subir no se baja nada.
- Código y SQL (rutas absolutas bajo `C:\Users\Kalel\`):
  - `prommter\proyectos\placita\lib\types.ts:1370-1387` — la nota de la v7 (campos
    opcionales que igual necesitan migración) y la **REGLA DURA** con
    `VERSION_DATOS = 7`.
  - `prommter\proyectos\placita\lib\persistencia.ts` — cabecera `:11-46` (caché, no
    verdad; nada se pierde en silencio; nada lanza), `claveRespaldo` con marca
    `:69-74`, tabla `MIGRACIONES` y su historia `:190-240`, `migrarUnidades`
    `:242-335` (incluido *"eso no es un hecho, es la ausencia del dato"* en
    `:327-330`), encadenado y revalidación `:342-378`. Pruebas:
    `lib\persistencia.test.ts:9`, `:234-242`, `:609-617`.
  - `prommter\proyectos\placita\supabase\migraciones\2026-08-21-gastos-y-cierre.sql:1-30`
    (128 líneas) y `2026-08-22-unidades.sql:1-36` (77 líneas) — una sola
    transacción, idempotentes, y qué pasa **mientras** no se apliquen.
  - `prommter\proyectos\placita\app\api\sincronizar\route.ts:132-142` (`faltaEsquema`)
    y `:148-152` (`MIGRACION_PENDIENTE`); banner en
    `app\(app)\ventas\page.tsx:1473`.
  - `prommter\proyectos\estanco-contable\supabase\migrations\001_rol_actual.sql`
    (340 líneas): bloque **Idempotencia** `:36-40`, `create or replace` `:134`,
    `revoke execute` `:241`, `drop trigger if exists` + `create trigger` `:258-260`.
    `supabase\README.md` — *"El archivo no es idempotente"* + bloque de limpieza
    para reaplicar 000.
  - `ORION\infrapilot-app\supabase\migrations\003_organizations.sql` — **233
    líneas**, sin ejecutar. `app\api\organizations\route.ts:5`,
    `app\api\profile\route.ts:8` (y las otras seis rutas con el mismo guard),
    `components\migration-notice.tsx`.
  - `prommter\proyectos\arroces\lib\types.ts:15-24` (contrato heredado + 3
    adaptaciones) y `lib\dominio\cierre.ts:29-43` y `:55-61`.
  - `prommter\proyectos\villa-broaster\docs\BASES-CAJA.md:7-19`, `:21-31`, `:33-40`.

### Huecos (lo que el corpus NO respalda todavía)

- **Nadie ha ejecutado la 003 todavía.** La lección está escrita desde el
  2026-08-24 y `infrapilot/RSK-001` sigue **Open**. Saber que se puede no es
  haberlo hecho: es el pendiente más barato y más rentable del ecosistema.
- **No hay `down`. No hay rollback.** Ninguna migración del corpus trae su
  reverso: ni las dos de la placita, ni las dos del estanco, ni las cuatro de
  infrapilot. Lo más cercano es el bloque manual de `drop … cascade` del README del
  estanco y, en el cliente, la clave de respaldo del crudo. Si una migración sale
  mal contra datos reales, **no hay procedimiento escrito** para volver atrás.
- **Ninguna base lleva registro de qué migraciones ya corrió.** No existe
  `schema_migrations` ni equivalente en ninguno de los archivos SQL de los tres
  proyectos: el estado se sabe **preguntándole al dueño** o viendo aparecer un
  `42P01`. Funciona con dos migraciones y una persona; no escala a diez.
- **El ORDEN nunca se probó ejecutándolo.** `placita/KN-040` fija la secuencia y el
  aviso en pantalla se verificó en vivo, pero no consta una corrida de las dos
  migraciones **en cadena sobre una copia con datos reales** — que es justo lo que
  `embedded-postgres` permitiría hacer y aún nadie hizo.
- **`embedded-postgres` no es dependencia de ningún proyecto** (`0` menciones en
  los `package.json` de placita, estanco-contable e infrapilot-app): se instala
  ad-hoc en el scratchpad. Eso es deliberado —no ensucia el proyecto— pero
  significa que **la receta vive solo en la memoria**, no en un script que alguien
  pueda correr sin leer este tema.
- **No hay ejemplo de migración con backfill pesado** (recalcular millones de
  filas, ventanas, escritura por lotes). Todo lo migrado hasta hoy cabe en una
  transacción. Si un cliente crece, eso es diseño nuevo, no copia.

## Enlaces

- [[TEMA-entorno-de-la-maquina]] — qué hay y qué no hay instalado aquí; es donde
  vive la advertencia general de la que este tema es el caso más caro: *"una
  imposibilidad puede caducar; si dudas, vuelve a medir"*.
- [[TEMA-verificar-con-evidencia]] — la versión general de la lección 3: todo
  veredicto lleva un número medido, y "lo leí y se ve bien" no es una verificación.
- [[TEMA-invariantes-contables]] — por qué el eje nuevo va en el hecho y no en el
  saldo, y por qué un `$0` en el costo es un bug financiero y no una imprecisión.
- [[TEMA-acceso-roles-y-puestos]] — qué se validó exactamente con los 37/37: el
  trigger anti-escalada de rol y sus policies `security definer`.
- [[TEMA-caja-y-turnos]] — el otro lado de la lección 7: la regla de negocio
  (*"la plata pertenece al turno del cobro"*) que el hermano no tenía y hubo que
  diseñar desde cero.
- [[TEMA-memoria-y-cierre]] — por qué esto se guarda: `infrapilot/KN-035` no nació
  de trabajo nuevo, nació de cruzar dos memorias que llevaban un mes sin hablarse.
