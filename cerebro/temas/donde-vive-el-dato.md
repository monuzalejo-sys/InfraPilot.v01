---
slug: donde-vive-el-dato
titulo: "Dónde vive el dato: fuente única, derivados y duplicación deliberada"
alias: [donde vive el dato, donde vive, donde se guarda, donde lo guardo, donde guardo, donde guardar, guardar, guardado, guardo, almacenar, almacenamiento, almacen, almacenes, store, stores, persistir, persistencia, persistido, persistidos, base de datos, bd, db, tabla, tablas, columna, campo, campos, fuente de verdad, fuente unica, fuente unica de verdad, unica fuente, una sola fuente, dos fuentes, dos fuentes de verdad, source of truth, single source of truth, verdad, la verdad, quien manda, dueno del dato, dueño del dato, hecho, hechos, derivado, derivados, derivar, se calcula, se guarda o se calcula, calculado, saldo, saldos, stock, el stock, stok, stoc, dnde, dnde guardo, inventario, existencias, cuantas quedan, cuanto queda, total, totales, total guardado, contador, contadores, kardex, movimiento, movimientos, lote, lotes, dato, datos, el mismo dato, dato repetido, repetido, repetir, repetida, duplicar, duplicado, duplicacion, duplicar datos, duplicar el dato, dos tablas, en dos tablas, dos sitios, en dos sitios, dos lados, en dos lados, guardarlo dos veces, dos veces, copia, copias, copiar, replica, replicar, cache, cachear, cacheado, denormalizar, desnormalizar, redundancia, redundante, offline, sin internet, sin senal, sin señal, offline first, outbox, cola, cola de subida, cola local, sincronizar, sincronizacion, sync, merge, conflicto, conflictos, pisar, se pisa, se pisan, me pisa, pisa el catalogo, la landing pisa, se sobreescriben, se borran solos, sobreescribir, sobrescribir, catalogo, catalogos, catalogo publicado, producto, productos, precio, precios, localstorage, local storage, navegador, supabase, backend, backends, monto backend, monto el backend, monto backend de una, backend de una, arranco con localstorage, arranco, arrancar, arranque, empiezo con localstorage, empiezo, empezar, necesito backend, hace falta backend, cuando monto el backend, vale la pena backend, api, nube, servidor, seed, semilla, sembrar, datos demo, demo, cuenta nueva, empresa nueva, onboarding, registro, alta, no aparece, no sale, no hay nada, listas vacias, lista vacia, aparece vacio, sale vacio, se borro, se perdio, se perdieron los datos, recargar, f5, version de datos, VERSION_DATOS, migracion, migraciones, migrar, esquema, contrato, tipos, types, helpers, capa de datos, repositorio, interfaz, almacen tras interfaz, multi sede, multisede, sucursal, sucursales, sucursalId, localId, empresaId, multi tenant, multitenant, aislamiento, tenant, escritor, escritores, un solo escritor, quien escribe, quien lee, lectora, solo lectura, read only, landing, panel, back office, backoffice, kiosko, kiosco, mostrador, concurrencia, carrera, condicion de carrera, lock, bloqueo, for update, trigger, idempotencia, idempotente, sobreventa, sobrevender]
preguntas: ["donde guardo el stock", "puedo tener el total guardado en la tabla", "cuantas fuentes de verdad debe haber", "cuando esta bien duplicar datos", "¿el stock se guarda o se calcula?", "cree la empresa y me dice que no hay locales, donde esta el bug", "¿por qué la app dice que no hay nada si acabo de crearlo?", "puedo tener una copia local para que funcione sin internet", "arranco con localStorage o monto backend de una"]
proyectos: [placita, estanco-contable, wrd, villa-broaster, pollo-landing, arroces, _permanent]
confianza: alta
actualizado: 2026-08-24
---

# Dónde vive el dato: fuente única, derivados y duplicación deliberada

## Respuesta corta

**Guarda HECHOS y deriva los saldos**: stock, totales y costos se calculan
recorriendo los movimientos; un campo `stock` o `total` persistido es una
segunda verdad esperando a desviarse. **Cada hecho tiene UN dueño que lo
escribe, y la pantalla que lo lee tiene que leer de ahí mismo** — si el síntoma
es *"no hay X"* justo después de crear X, el bug no está en el alta: tienes dos
fuentes. **Toda la persistencia pasa por funciones con nombre** (`leer`/`crear`/
`vaciar`, o una interfaz de almacén): cambiar de backend es editar eso y nada
más. **Duplicar es DISEÑO —no deuda— solo si la copia es de lectura, se deja
pisar por el dueño, y lo que escribes mientras tanto viaja aparte en una cola de
subida.** Si dos lados pueden editar la misma copia, es deuda: ponle un dueño.

## Por qué (qué lo pagó)

**Lo pagó un dueño encerrado fuera de su propia app.** En el estanco,
`registrarEmpresa` guardaba las sucursales del dueño en el almacén de auth
(`localStorage 'estanco:empresas'`, `lib/auth.ts:46`) mientras la pantalla de
vinculación y el store las leían del seed DEMO. Resultado: *"toda empresa recién
registrada veía 'Esta empresa todavía no tiene locales registrados' y su dueño
quedaba ENCERRADO FUERA de su propia app — no podía vincular el primer equipo, y
sin vínculo no se factura"* (`estanco-contable/KN-012`). El bug quedó escrito
como advertencia dentro del arreglo (`lib/auth.ts:305-317`) y se generalizó a
regla permanente: *"al construir cualquier alta, comprobar explícitamente que la
pantalla que consume esa entidad lee del MISMO sitio donde el alta escribe"*
(`_permanent/KN-006`). Y **un builder lo había predicho por escrito** —*"una
empresa recién registrada ve listas vacías"*— y quedó sin cerrar hasta que el
dueño lo reportó usando la app.

**Lo pagó el seed, dos veces, tapando el hueco del cliente nuevo.** En la placita
un e2e con empresa nueva encontró que `crearProveedor` existía en el store **sin
ninguna UI que lo llamara**: *"una empresa nueva en la nube (sin seed) no podía
registrar mercancía JAMÁS porque el recibo de bodega exige proveedor y no había
forma de darlo de alta. El seed de la demo escondía el hueco porque siempre traía
proveedores precargados"* (`placita/KN-026`, commit 956d15e). Mismo mecanismo que
el estanco: los datos sembrados hacen pasar todas las pantallas mientras el
cliente real queda afuera.

**Lo pagó una landing que le pisaba el catálogo al dueño.** En WRD la landing
pública sembraba su propio catálogo mientras el dueño cargaba productos desde el
sistema: dos fuentes de verdad sobre el mismo store. Se removió `sembrar()` y
*"la landing quedó como consumidora de solo lectura y ya NO siembra datos"*
(`wrd/DEC-009`); *"catálogo, precio y stock se editan ÚNICAMENTE desde
wrd/sistema/"*. La regla se hace cumplir con un **grep negativo** en el brief:
`sembrar|WRDProductos.crear|editar|borrar|subirFoto` sobre los archivos de la
landing debe dar cero líneas (`wrd/docs/LANDING-PROMPT.md:537`, cambio
obligatorio A en `:146-156`).

**Lo pagó una copia vieja que también era una fuente.** En la placita se añadió un
campo obligatorio nuevo a datos ya persistidos (`PrecioProducto.precioCompraCop`)
**sin subir `VERSION_DATOS` ni registrar migración**, y tumbó la página de
productos con `undefined.toFixed` usando los datos v2 del navegador del dueño:
*"dev funcionaba (datos nuevos), producción caía (datos viejos de las pruebas del
dueño)"* (`placita/KN-009`, cazado en producción 2026-08-07, **segunda vez** en
el proyecto). El typecheck no ve los datos viejos del navegador y el QA de los
builders solo probó con seed fresco.

**Y lo pagó una cola que voló sin saber a nombre de quién escribía.** Un e2e
contra Supabase con estado sucio *"cazó bug: outbox subía `empresa_id` ajeno →
RLS 500"*; el arreglo bloquea el flush hasta que `/api/arranque` confirme la
empresa (`placita/KN-018`, commit dc9d079). La misma duplicación deliberada que
salva la venta sin internet es la que sube datos al negocio equivocado si nadie
le pregunta primero de quién es este equipo.

## Cómo se aplica

1. **Escribe la tabla hechos↔derivados en el contrato de tipos, antes de la
   primera pantalla.** La placita la tiene literal: `Movimiento` es hecho;
   `SaldoProducto`, `SaldoLote`, `MermaLote`, `AgotadoDia`, `ResumenDia`,
   `ProductoRanking` son derivados — *"Ningún saldo, lista o alerta se guarda
   suelto: si aparece un campo `stock` o `agotados` persistido, está mal"*
   (`placita/lib/types.ts:17-31`). El estanco dice lo mismo en una línea: *"stock
   SIEMPRE derivado de movimientos"* (`estanco-contable/DEC-001`). Ver
   [[TEMA-invariantes-contables]] para el detalle contable de esa frontera.
2. **Los derivados se calculan en cada llamada, no se cachean.** *"Todo se lee
   del store VIVO en cada llamada — nada de cachear un resumen viejo"*
   (`wrd/sistema/js/contable.js:27-28`).
3. **Un dueño por hecho, y el dueño expone el lector.** El módulo que escribe es
   el que publica la función de lectura, y todas las pantallas la consumen: así
   nació `listarLocalesEmpresa` (`estanco lib/auth.ts:318`), consumido por
   `app/(auth)/login/page.tsx` y `components/store.tsx`. Si una pantalla lee el
   almacén a mano, eso ya es deuda: súbela al módulo antes de construir encima
   (`estanco-contable/PEND-010`, fuga detectada al construir la página de equipo,
   resuelta 2026-07-30).
4. **Toda la persistencia detrás de funciones con nombre.** En chico son tres
   helpers por recurso: `apiLeerRegistros` / `apiCrearRegistro` /
   `apiVaciarRegistros`, con el comentario que declara la invariante — *"El
   formulario ESCRIBE y el panel admin LEE del mismo API local"*
   (`pollo-landing/index.html:574-594`). Gracias a eso la landing **migró de
   localStorage a un API HTTP en un solo run sin tocar la UI**
   (`pollo-landing/KN-001`, `DEC-003`). En grande es una interfaz: *"Todo lo que
   consuma datos debe pedirlos a `obtenerAlmacen()`, jamás importar una
   implementación por su nombre"* (`villa-broaster almacen.ts:15-16`).
5. **Declara la capa async desde el día 1 aunque hoy sea localStorage.** *"Al
   migrar a Supabase, el cuerpo pasa a un `select` de sucursales y la firma no
   cambia"* (`estanco lib/auth.ts:316-317`); el pendiente de persistencia lo pide
   explícito: *"diseñar la serialización para que migrar a Supabase sea cambiar
   el backend, no el contrato"* (`estanco-contable/PEND-012`).
6. **Mete la decisión hacia adentro del almacén, no la dejes en quien llama.**
   `anexarOrden` y `anexarProducto` no reciben el objeto armado: reciben una
   **función** que decide con lo ya guardado delante. *"Si el que llama hiciera
   esos tres pasos por su cuenta, dos clientes simultáneos sacarían el mismo
   `L1-0007` y el segundo pisaría al primero"* (`villa-broaster almacen.ts:18-26`
   y `:76-84`). Cada implementación la envuelve con lo que tenga: cola de un
   carril en disco, transacción en Supabase.
7. **El campo de partición viaja desde el día 1; la interfaz, no.** `empresaId`
   es la frontera de aislamiento y `localId` va *"en TODO objeto operativo,
   aunque hoy haya un solo local. Añadir el segundo local no debe migrar datos"*
   (`placita/lib/types.ts:40-43`). En arroces, con una sola sede: *"NINGUNA
   entidad asume 'la única sucursal'… A diferencia de estanco-contable esto NO es
   un SaaS multi-empresa: no hay `Empresa` ni aislamiento multi-tenant"*
   (`arroces/lib/types.ts:8-13`), y por eso el filtro del turno ya funciona
   (`lib/dominio/cierre.ts:157`: `if (p.sucursalId !== turno.sucursalId) return
   false`). El campo cuesta hoy; el selector de sede, los permisos por sede y los
   reportes comparativos esperan a que exista la segunda.
8. **Verifica toda alta contra la pantalla que la lee, con una cuenta NUEVA.**
   Es una comprobación de 30 segundos (`_permanent/KN-006`, `placita/KN-026`).
   Y distingue qué vacío es bug: en una empresa nueva los **locales** existen (se
   crean en el registro) así que vacío = bug; **productos y movimientos**
   genuinamente no existen todavía, así que vacío = correcto
   (`estanco-contable/KN-013`).
9. **Cambio de forma en datos persistidos = bump de versión + migración en el
   MISMO cambio**, y el QA de ese cambio se prueba **con un sobre de la versión
   anterior**, no solo con seed limpio (`placita/KN-009`). Cuando no hay
   migración registrada, el crudo se respalda tal cual antes de degradar a la
   semilla: *"Un bump de versión no puede costarle al dueño la operación de su
   semana"* (`placita/lib/persistencia.ts:25-32`).
10. **Cuando duplicas a propósito, escríbelo en la cabecera del archivo y cumple
    las cuatro condiciones.** El modelo verificado es el de la placita
    (`lib/persistencia.ts:11-17`): *"Desde la fase A esto es CACHÉ, no la verdad.
    La operación vive en Supabase… Lo que hay aquí es la foto con la que la caja
    ARRANCA cuando no hay red… y que se pisa con lo que mande el servidor apenas
    conteste. Lo que la caja escribe mientras tanto no se pierde: viaja aparte,
    en el outbox"*. Las cuatro condiciones:
    - **La copia guarda solo hechos.** `empaquetar` pasa por `soloLosHechos`, que
      se queda con los quince arreglos de hechos y descarta los metadatos del
      sobre (`lib/persistencia.ts:158-181`, `:501`).
    - **La copia es una foto, no un diario.** *"Sobrescribe siempre la clave
      completa — la caché es una foto, no un diario al que se le agregan
      páginas"* (`:504-507`).
    - **Lo escrito viaja aparte, en cola append-only.** La escritura es optimista
      —*"una venta con el cliente enfrente no puede depender de que Hostinger
      conteste"*— y el delta se calcula por identidad de referencia, sin comparar
      campo por campo (`lib/outbox.ts:1-25`). Sin borrados en la cola a
      propósito: *"un DELETE disparado desde dos cajas con relojes distintos es
      exactamente el problema que el contrato quiere evitar"* (`:27-33`).
    - **Con cola pendiente de subir, NO se baja nada.** Sube al foco o cada 4 s
      (200 filas/viaje), baja al abrir o cada 10 s mínimo; el bloqueo *"protege
      la venta recién cobrada de conflictos de merge"* (`placita/KN-038`,
      verificado en vivo 2026-08-21). Y no dejes volar la cola sin confirmar
      antes contra qué empresa está escribiendo (`placita/KN-018`).
11. **Si la misma regla existe en los dos lados, congela el texto y hazlo
    idéntico.** En WRD el descuento de stock existe dos veces —en el store del
    navegador para la demo y en el trigger SQL para el modo real— con **las
    mismas dos frases**: `'Se nos acabó "N" — sacalo del pedido'` /
    `'De "N" solo nos quedan K'` (`wrd/js/pedido-store.js:187-189` frente a
    `wrd/setup/schema.sql:297-300`), y el core destapa el mensaje del trigger tal
    cual (`wrd/DEC-010`). Así el QA que hiciste en demo dice algo del
    comportamiento real.
12. **Antes del backend en la nube, monta un canal server-side de archivo.**
    `http.createServer` con GET/POST/DELETE `/api/<recurso>` sobre un JSON en
    `data/`, y `data/` en `.gitignore` el mismo commit —*"data de clientes reales
    nunca se commitea"* (`pollo-landing/.gitignore:1-2`). Cero dependencias,
    patrón copiado de `placita/DEC-009` y desbloqueó `pollo-landing/PEND-001` en
    un solo run. En ese salto **aparece un modo de fallo nuevo**: repite la
    validación en el servidor (400 si faltan obligatorios) y **estampa la fecha
    en el servidor**, no en el navegador (`pollo-landing/serve.mjs:33-34` y
    `:37`); en el cliente, botón deshabilitado y mensaje de error visible.

## Cuándo NO aplica

- **El stock persistido: WRD lo guarda, la placita y el estanco lo derivan. La
  contradicción es real y no se fusiona.** En **placita/estanco** el saldo es
  siempre derivado y un campo `stock` persistido *"está mal"*
  (`placita/lib/types.ts:30-31`, `estanco-contable/DEC-001`). En **WRD**
  `productos.stock` **es una columna**, descontada y devuelta por triggers con
  `for update` sobre la fila del producto: *"así dos socios pidiendo la última
  unidad al mismo tiempo no se la llevan los dos: el segundo espera a que el
  primero termine y encuentra el stock ya descontado"*
  (`wrd/setup/schema.sql:260-264`, columna en `:192-197`, trigger en `:271-302`).
  **La condición de negocio decide, y es una pregunta sola: ¿el negocio necesita
  saber cuánto le COSTÓ lo que vendió?** Si sí (placita, estanco: kardex, lotes,
  FEFO, costo promedio ponderado), el movimiento hay que guardarlo de todos modos
  y el saldo sale gratis de recorrerlo — persistirlo solo agrega una cifra que se
  puede desviar. Si no, el número solo tiene un trabajo —frenar una sobreventa
  desde la calle, en el instante del pedido, con dos clientes a la vez— y ahí un
  contador con lock de fila es más simple y más correcto que derivar: el esquema
  de WRD tiene **cinco tablas** (`ajustes`, `usuarios`, `productos`, `pedidos`,
  `gastos`) y **ninguna de movimientos ni de lotes**, y su módulo contable no
  calcula costo de ventas en ninguna línea (`wrd/sistema/js/contable.js:18-28`).
  Derivar un stock que no tiene de qué derivarse es inventar un kardex para no
  escribir una columna.
- **No todo dato entra por el canal genérico de duplicación.** El outbox de la
  placita tiene lista blanca, y las tres tablas del canal de pedidos quedan
  fuera **a propósito**: *"esas no nacen en el outbox de la caja sino en la
  calle, tienen sus propias rutas con validación, y el número y el día de un
  pedido los pone un trigger — un upsert crudo se los saltaría"*
  (`app/api/sincronizar/route.ts:84-92`). La señal es **dónde nace el hecho** y
  **quién estampa su identidad**: si el servidor pone el número, la fecha o el
  consecutivo, ese dato no puede viajar como una fila más.
- **Un derivado no necesita identidad ni cola.** El catálogo publicado de la
  placita *"es una proyección derivada por `useMemo`, no una colección persistida
  con identidad"*, así que se publica por comparación de referencia contra lo
  último publicado con éxito, por su propia ruta `PUT /api/catalogo`, y **no** por
  el patrón differ+outbox que pedía el pendiente (`placita/DEC-014`). Meter un
  derivado en la cola de hechos es la forma elegante de fabricar una segunda
  verdad.
- **localStorage es la decisión correcta si de verdad es un kiosko de un solo
  equipo**, y meter Supabase antes de tiempo es gasto y latencia sin cliente. Lo
  que nunca debe vivir ahí es algo que tenga que sobrevivir a que limpien el
  navegador. Pero **dilo antes de la demo**: *"localStorage es POR NAVEGADOR:
  /pedir (cliente) y /panel (negocio) solo comparten datos si corren en la misma
  máquina. Fase 1 sirve como kiosko/mostrador + carta pública, NO como pedido
  remoto multi-dispositivo real"* (`arroces/CON-001`) — es una limitación
  estructural, no un bug, y convirtió el backend en el pendiente estructural del
  proyecto (`arroces/PEND-001`).
- **Si de verdad las dos superficies necesitan escribir** (dos cajeros, dos
  sedes), no fuerces "una escribe y la otra lee": define qué campo es de quién y
  resuelve por id, que es otro problema. Y **un catálogo sigue siendo uno solo**
  aunque haya dos sedes: *"el catálogo es uno solo, con precio por sede"*
  (`villa-broaster almacen.ts:76-79`), no dos catálogos.
- **La cola de un carril NO protege entre procesos.** *"Sirve dentro de UN
  proceso… Dos procesos contra la misma carpeta sí necesitarían un lock de
  archivo"* (`villa-broaster almacen-disco.ts:203-220`). El barrido de QA lo dejó
  como pendiente explícito de **despliegue**, no de código
  (`villa-broaster/KN-015`, punto b), y el diseño ya lo anticipa: *"para Vercel
  (serverless, disco efímero) HABRÁ que añadir implementación Supabase antes del
  deploy — en Hostinger con Node persistente el disco sirve"*
  (`villa-broaster/DEC-003`). Dónde se despliega es parte de dónde vive el dato.
- **El canal de archivo no se expone a internet.** Sin auth ni TLS es un buzón
  abierto: *"adecuado mientras la landing corra en la máquina/LAN del proveedor;
  NO exponer a internet sin auth"* (`pollo-landing/DEC-003`, heredado de
  `placita/DEC-009`, *"sin auth por ser red local"*). Tampoco con varios
  escritores concurrentes reales: reescribir el JSON completo en cada POST no es
  atómico.
- **El async gratis es ruido si nunca va a haber servidor** (herramienta local,
  prototipo desechable, script), y **el estado puramente de UI no es capa de
  datos**: el tema, los paneles colapsados o el puesto de este equipo se guardan
  donde corresponde y no piden dueño único. La placita guarda su arranque en una
  clave **sin empresa** a propósito: *"es lo que se lee cuando todavía NO se sabe
  de qué empresa es este equipo — ponerle el `empresaId` en la clave sería
  necesitar la respuesta para poder hacer la pregunta"*
  (`lib/persistencia.ts:533-536`).
- **Un helper genérico que recibe el nombre del recurso como string vuelve a
  esconder el bug.** El trío por recurso es lo que hace visible que el que
  escribe y el que lee son el mismo sitio; un `guardar(recurso, x)` universal no
  lo demuestra. Y los helpers garantizan MISMA fuente, **no** que el dato llegue:
  hay que probar el ciclo alta → disco → lectura en navegador real
  (verificado así en `pollo-landing/metrics.json`, sesión 2026-08-09T21:25:
  *"GET inicial vacío, alta vía formulario persiste EN DISCO, POST inválido →
  400, admin lee del API, DELETE vacía y admin lo refleja"*).
- **Duplicación que es riesgo, no diseño**: el navegador de desarrollo de esta
  máquina tiene en su `localStorage` de `localhost:3300` el outbox con facturas
  de prueba completas; *"si se configurara la clave de caja en ese navegador, la
  siguiente sincronización subiría TODOS esos datos de prueba a la nube real
  compartida del negocio"* (`placita/RSK-004`, Open). Una cola de subida sin
  dueño confirmado es una bomba con retardo.

## Evidencia

- `_permanent/KN-006` (Permanent, High) — clase de bug "dos fuentes de verdad":
  el alta persiste en un sitio y otra pantalla lee de otro; síntoma *"no hay X"*
  justo después de crear X. Generalizada del bug de locales del estanco.
- `estanco-contable/KN-012` — el caso: `registrarEmpresa` escribe en
  `estanco:empresas`, login y store leían el seed DEMO; el dueño quedaba
  encerrado fuera. `KN-013` — qué vacío es bug y qué vacío es correcto en una
  empresa nueva. `DEC-001` — *"stock SIEMPRE derivado de movimientos"*, contrato
  central de tipos que nadie redefine, `cargarDatos()` sobre seed determinista.
  `PEND-010` (Done 2026-07-30) — fuga de la capa de datos: `equipo/page.tsx` leía
  `localStorage` directo. `PEND-012` (Ready) — migrar debe ser cambiar el
  backend, no el contrato. `PEND-008` (Ready) — cola local + clave de
  idempotencia por dispositivo, **diseñada, no implementada**.
- `placita/KN-026` — el seed escondía que una empresa nueva no podía registrar
  mercancía JAMÁS (commit 956d15e). `KN-009` — campo nuevo sin bump de
  `VERSION_DATOS` tumbó producción con los datos del dueño (2ª vez).
  `KN-038` — sincronización multi-dispositivo verificada en vivo 2026-08-21: con
  cola pendiente no se baja nada. `KN-018` — outbox subiendo `empresa_id` ajeno →
  RLS 500; fix `resolverTransicionEmpresa` (commit dc9d079). `DEC-014` — el
  catálogo es una proyección derivada y no viaja por el outbox. `DEC-009` — canal
  de pedidos server-side aislado del kardex, *"Pedido ≠ hecho contable"*.
  `DEC-022` — el eje de unidades vive en `Movimiento`, no en `Lote` (bug
  financiero real; detalle en [[TEMA-invariantes-contables]]). `RSK-004` (Open) —
  outbox de pruebas en el navegador de desarrollo.
- `wrd/DEC-009` — la landing dejó de sembrar y quedó de solo lectura; catálogo,
  precio y stock se editan únicamente desde `wrd/sistema/`. `DEC-008` —
  separación landing/sistema, sin ningún link entre ellas; *"Restaurar backup =
  MERGE upsert por id (jamás reemplazo ni borrado masivo)"*. `DEC-010` — stock
  reservado por trigger y mensajes de error congelados e idénticos entre demo y
  SQL. `DEC-006` — el patrón contable de la casa, sin costo de ventas.
- `pollo-landing/KN-001` — `_permanent/KN-006` aplicada y **verificada en
  navegador real en dos versiones** (localStorage 2026-08-08, API local
  2026-08-09). `DEC-003` — persistencia server-side local, patrón transferido de
  `placita/DEC-009`; validación y fecha en el servidor. `DEC-001` — el punto de
  partida (`buenavista_registros_v1` en localStorage).
- `arroces/CON-001` (Constraint, Active) — localStorage es por navegador: kiosko,
  no pedido remoto. `PEND-001` — backend real, *"el pendiente estructural del
  proyecto"*. `DEC-001` — store multi-sucursal desde el día 1 con una sola sede
  abierta.
- `villa-broaster/DEC-003` — almacén tras interfaz, Supabase enchufable, disco
  efímero en serverless. `KN-015` punto (b) — la cola serializa solo dentro de un
  proceso; queda como prioridad de despliegue (T-05).
- `infrapilot/RSK-003` (Open) — la misma clase, medida en el ecosistema: 8
  agentes en paralelo sobre el mismo `state.json` lo corrompen; mitigación,
  serializar o un solo escritor (ver [[TEMA-olas-de-agentes]]).
- Código (rutas absolutas bajo `C:\Users\Kalel\`):
  - `prommter\proyectos\placita\lib\types.ts:17-31` (tabla hechos↔derivados) y
    `:40-43` (`empresaId` frontera, `localId` en todo objeto operativo).
  - `prommter\proyectos\placita\lib\persistencia.ts:1-45` (la cabecera que
    declara la caché), `:158-181` (`soloLosHechos`), `:190-210` (por qué NO se
    migra el blob local tras el corte a Supabase: *"sería fabricar una segunda
    verdad"*), `:494-507` (`empaquetar`/`guardar`, *"una foto, no un diario"*),
    `:525-539` (la caché de arranque, sin `empresaId` en la clave).
  - `prommter\proyectos\placita\lib\outbox.ts:1-53` (escritura optimista, differ
    por identidad de referencia, sin borrados, append-only y FIFO) y `:174-220`
    (`delta`/`calcularDelta`, 12 colecciones).
  - `prommter\proyectos\placita\app\api\sincronizar\route.ts:84-92` (lista blanca
    y las tres tablas que quedan fuera a propósito).
  - `ORION\estancorepo\lib\auth.ts:46` (`CLAVE_ALMACEN`), `:305-321`
    (`listarLocalesEmpresa`, el bug documentado dentro del arreglo y *"al migrar
    a Supabase… la firma no cambia"*), `:323-332` (mismo patrón en
    `actualizarActivoUsuario`).
  - `prommter\proyectos\pollo-landing\index.html:573-594` (los tres helpers) y
    `serve.mjs:10-17`, `:26-52` (API + persistencia en `data/registros.json`);
    `.gitignore:1-2`.
  - `prommter\proyectos\arroces\lib\types.ts:1-24` (multi-sucursal sí,
    multi-tenant no) y `lib\dominio\cierre.ts:157`.
  - `prommter\proyectos\villa-broaster\broaster-app\lib\servidor\almacen.ts:1-27`
    (por qué una interfaz; la decisión viaja hacia adentro), `:76-84`
    (`anexarProducto`, *"el catálogo es uno solo, con precio por sede"*);
    `almacen-disco.ts:203-231` (la cola de un carril y su límite).
  - `fable 5\wrd\setup\schema.sql` — las **cinco** y únicas `create table` del
    esquema: `:49` ajustes, `:96` usuarios, `:173` productos, `:207` pedidos,
    `:376` gastos (ninguna de movimientos ni de lotes); `:192-197` la columna
    `stock` con su comentario (*"descontarla y devolverla por una venta es cosa
    de los triggers… no de un UPDATE a mano"*); `:260-302` la reserva con
    `for update` y los dos mensajes. `fable 5\wrd\js\pedido-store.js:180-191`
    (los mismos dos mensajes en el lado demo);
    `fable 5\wrd\sistema\js\contable.js:18-36` (el patrón contable completo, sin
    una sola mención de costo, lote, kardex ni margen).
  - `fable 5\wrd\docs\LANDING-PROMPT.md:146-160` y `:537` (el grep negativo que
    hace cumplir "la lectora no siembra").

### Huecos (lo que el corpus NO respalda todavía)

- **La idempotencia de la cola nunca se ha implementado ni medido.** Está
  diseñada por escrito —*"clave de idempotencia por dispositivo para que al
  volver la señal no se dupliquen facturas"* (`estanco-contable/PEND-008`,
  Ready)— y el outbox de la placita se apoya en `upsert` por `id` en vez de en
  claves de idempotencia (`lib/outbox.ts:35-40`). No hay ninguna medición de un
  reintento duplicando un documento.
- **Nunca se ha resuelto un merge de verdad.** El corpus tiene un solo mecanismo:
  bloquear la bajada mientras haya cola (`placita/KN-038`). No hay resolución por
  campo, ni CRDT, ni prueba de dos cajas editando la MISMA venta a la vez.
- **El almacén Supabase de villa-broaster no existe.** La interfaz está escrita y
  la implementación de disco funciona; la segunda implementación —la que probaría
  que la costura sirve— sigue pendiente (`villa-broaster/DEC-003`, `KN-015`).
  Igual en el estanco: Supabase está **diseñado pero sin activar**
  (`estanco-contable/DEC-001`).
- **No hay experiencia de borrado distribuido.** El outbox lo evita a propósito
  (`lib/outbox.ts:27-33`) y el modelo de negocio no borra. Si algún día hay que
  propagar un DELETE entre dos cajas, es diseño nuevo, no copia.
- **La migración de datos solo se ha ejercitado en localStorage.** `VERSION_DATOS`
  + tabla de migraciones es un patrón probado del lado del navegador
  (`placita/lib/persistencia.ts:190-215`); del lado SQL lo que hay es pegar
  migraciones a mano en el editor de Supabase, en orden, avisado en pantalla
  (`placita/KN-040`). No es lo mismo y no hay una regla escrita para ese lado.

## Enlaces

- [[TEMA-invariantes-contables]] — la otra mitad de "hechos vs derivados", del
  lado del dinero: por qué no se borra, por qué se congela lo cobrado y por qué
  no hay un total a secas. Este tema responde *dónde vive*; ese responde *qué se
  le puede hacer*.
- [[TEMA-caja-y-turnos]] — dónde vive la FECHA de una venta (`cobradoEn` vs la
  toma del pedido) y por qué el arqueo filtra por la del cobro.
- [[TEMA-acceso-roles-y-puestos]] — el puesto vive en el equipo y la sede sale
  del puesto, jamás de quien teclea: es el mismo principio de "un dueño por
  dato", aplicado a la identidad.
- [[TEMA-verificar-con-evidencia]] — cómo se comprueba de verdad que el alta y la
  lectura son el mismo sitio (navegar por enlaces y no con F5, `estanco-contable/KN-010`;
  e2e con cuenta nueva y sin seed).
- [[TEMA-olas-de-agentes]] — el mismo bug, con agentes en vez de cajeros:
  escribe tú los archivos compartidos antes de repartir, y que solo uno escriba.
