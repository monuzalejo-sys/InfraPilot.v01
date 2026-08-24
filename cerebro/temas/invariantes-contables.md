---
slug: invariantes-contables
titulo: Las reglas del dinero que no se rompen (y por qué existen)
alias: [invariante, invariantes, invariantes contables, regla, reglas, regla de negocio, reglas de negocio, reglas del dinero, reglas de contabilidad, contabilidad, contable, sistema contable, dinero, plata, borrar, borrado, borrarlo, no se puede borrar, eliminar, eliminado, eliminacion, delete, soft delete, borrado blando, borrar un gasto, borrar una factura, eliminar una factura, borrar una venta, eliminar una venta, anular, anularlo, anulacion, anulado, anulada, cancelar, cancelado, cancelada, basurero, papelera, purga, congelado, congelada, congelar, precio congelado, linea congelada, lineas congeladas, historico, historial, auditoria, auditable, trazabilidad, quien lo hizo, responsable, hecho, hechos, derivado, derivados, saldo, saldos, stock, kardex, movimiento, movimientos, total, total de ventas, gran total, cifra total, neto, netocop, desglose, desglosado, desglosar, canal, mostrador, domicilio, sede, sedes, local, locales, gasto, gastos, venta, ventas, factura, facturas, recibo, orden, ordenes, pedido, consecutivo, numeracion, numero de factura, redondeo, centavos, cop, pesos, entero, enteros, gramos, merma, devolucion, devoluciones, nota de credito, descuadre, cuadre, conciliar, concurrencia, carrera, condicion de carrera, dos procesos, dos escritores, un solo escritor, escritor unico, mismo json, escribir el mismo archivo, json corrupto, se corrompio, corrompio, corrompido, json corrompido, archivo corrompido, corromper, se daño el json, escritura atomica, tmp rename, cola, cola de un carril, serializado, lock, caja, cajero, arqueo, dia negocio, jornada contable]
preguntas: ["por que no se puede borrar un gasto", "que reglas de contabilidad no se pueden romper", "por que no hay un total de ventas a secas", "que pasa si dos procesos escriben el mismo json", "¿por qué no puedo eliminar una factura o una venta?", "¿por qué el precio de la orden no cambia si cambio el catálogo?", "¿el stock se guarda o se calcula?", "¿qué invariantes debe respetar un sistema contable de la casa?"]
proyectos: [villa-broaster, estanco-contable, placita, arroces, wrd, infrapilot]
confianza: alta
actualizado: 2026-08-24
---

# Las reglas del dinero que no se rompen (y por qué existen)

## Respuesta corta

**Nada que toque plata se borra ni se reescribe: se ANULA o se CANCELA, sigue
listado y se cuenta APARTE** — un anulado no resta, se mira. **Congela en el
documento lo que se cobró** (nombre, precio unitario, comisión, total) y no
vuelvas a mirar el catálogo nunca más. **Guarda hechos y deriva los saldos**: si
ves un campo `stock` o `total` persistido, está mal. **No expongas un "total" a
secas** —obliga el desglose por canal y por concepto, y deja UNA sola cifra
resumen, el neto, calculada a partir de ese desglose. **Dinero y peso en enteros,
con UN redondeo al final.** Y **un solo escritor por archivo**: leer→decidir→
escribir serializado dentro de un proceso y escritura atómica (`.tmp` + `rename`);
dos procesos contra el mismo JSON no se arreglan con cuidado, se arreglan
poniéndole un dueño único.

## Por qué (qué lo pagó)

**Lo pagó el reverso de stock que falseaba la ganancia del día.** En el estanco se
probaron las dos formas de anular una factura y una se descartó midiendo:
*"probé la alternativa (dejar la venta + reverso de stock) y falseaba la ganancia
del día, que es el número que mira el dueño"* (`estanco-contable/KN-004`). El
código guarda la trampa por escrito: `anularFactura` devuelve además unos
`reversos` para quien prefiera compensar en vez de retirar, y advierte que *"hacer
las dos cosas a la vez devolvería el stock DOS veces: o se retiran los originales,
o se suman los reversos, nunca ambas"* (`facturacion.ts:39-40`). Dos criterios
razonables, aplicados juntos, valen un inventario inflado.

**Lo pagó el costo de ventas en $0.** En la placita el eje de unidades se había
puesto en el `Lote` en vez de en el `Movimiento`, y el resultado fue un **bug
financiero real en producción**: *"ninguna venta de unidad descontaba costo",
inflando la ganancia bruta mostrada al dueño en balances/dashboard*
(`placita/DEC-022`). Se corrigió moviendo el eje al hecho persistido y se verificó
en vivo: ganancia bruta $4.000 sobre un precio de $20.000. La regla que lo
previene ya estaba escrita en el contrato de tipos: *"Ningún saldo, lista o alerta
se guarda suelto: si aparece un campo `stock` o `agotados` persistido, está mal"*
(`placita lib/types.ts:30-31`).

**Lo pagó el total mezclado.** La comparativa entre sedes es el argumento comercial
central de Villa Broaster (`villa-broaster/DEC-006`, `KN-004`), así que el módulo
contable prohíbe por diseño el campo cómodo: *"Aquí NO hay un campo `totalCop`
general… Un campo 'total' a secas se acabaría imprimiendo solo en un informe y el
dueño perdería exactamente la comparación que pidió ver"*
(`broaster-app/lib/servidor/contabilidad.ts:682-688`). Quien quiera el gran total
suma los dos canales, y al hacerlo tiene los dos números delante.

**Lo pagó el consecutivo repetido.** El almacén en disco lleva la falla escrita en
la cabecera de su cola: *"Dos órdenes que entran en el mismo milisegundo hacen cada
una leer→numerar→escribir; sin serializar, la segunda lee el archivo ANTES de que
la primera lo escriba, saca el mismo `L1-0007` y la pisa — la venta del primer
cliente desaparece y nadie se entera hasta el cuadre"*
(`almacen-disco.ts:205-210`). La versión de este mismo fallo **medida** está en el
ecosistema, no en un cliente: ocho agentes `landing-prompter` en paralelo
compartiendo un `state.json` lo **corrompen**, y por eso se les prohibió escribir
(`infrapilot/RSK-003`, Permanent). La mitigación registrada es la misma que la del
mostrador: serializar, o que escriba uno solo.

**Y lo pagó un día que empezaba en UTC.** Una venta de las 11 p.m. en Bogotá caía
al día siguiente: *"la factura aparecía en la lista pero la cabecera del día
marcaba cero"*, justo en las horas de más venta (`estanco-contable/KN-005`,
Permanent). Desde entonces toda comparación de jornada pasa por `fechaNegocio` con
zona `America/Bogota`, una sola definición de "qué día es" para todo el sistema.

## Cómo se aplica

1. **Sin borrado físico en nada que toque plata.** Orden → `cancelada`; factura →
   `anulada` + `anuladaEn`; gasto → `anulado`; producto → `eliminadoEn`. El
   documento sigue listado y auditable (`contabilidad.ts:17-19` y `:458-467`,
   `estanco facturacion.ts:26-33`, `placita/DEC-008`). En SQL se sella igual:
   la tabla de gastos de wrd no tiene política de DELETE **a propósito**
   (`wrd/setup/schema.sql:509-512`).
2. **Lo anulado se cuenta aparte y NO resta.** Canceladas con su `perdidoCop`
   (*"NO se suma a nada: se mira"*) y gastos anulados con su `montoCop`
   (`contabilidad.ts:692-724`). *"Perder una venta no es lo mismo que gastar
   plata"* (`wrd sistema/js/contable.js:22-23`).
3. **No hay "desanular".** Un gasto ya anulado no se vuelve a anular y una orden
   cancelada no resucita: si el cliente vuelve, es una orden nueva
   (`contabilidad.ts:458-467`, `:320-332`). Anular sí es **idempotente**: anular
   dos veces no genera reversos dobles (`estanco facturacion.ts:41`).
4. **Congela al crear, no al cobrar.** El catálogo se lee UNA vez, antes de entrar
   a la cola, *"y de esa foto salen los precios congelados: dos órdenes de la misma
   tanda cobran lo mismo aunque el dueño esté editando precios en ese momento"*
   (`contabilidad.ts:224-231`, `:880-884`). Lo mismo con nombres, comisiones de
   datáfono y el precio de venta derivado del margen
   (`estanco facturacion.ts:11-16`, `placita lib/types.ts:217-223`).
   Corolario de venta: si la UI promete un número, el servidor tiene que poder
   honrar exactamente ese número — por eso las promos no llevan "antes/ahora"
   (`villa-broaster/KN-009`).
5. **El total es la suma de sus líneas, verificado antes de guardar.** `cuadraTotal`
   corre siempre, aunque hoy no pueda fallar: *"el día que alguien meta un descuento
   en medio, esto se cae aquí y no en el cuadre del mes"* (`contabilidad.ts:268-313`).
   Sirve además para auditar un `ordenes.json` que alguien editó a mano.
6. **Hechos vs. derivados, por escrito.** Persiste `Movimiento`, `Venta`, `Gasto`,
   `CierreCaja`; **calcula** saldos, mermas, rankings, resúmenes y recibos
   (`placita lib/types.ts:17-31`). Y no cruces las fuentes: el dinero sale de
   `Venta.totalCop`, los kilos y el costo de los `MovimientoVenta`; *"volver a
   sumar las líneas para 'confirmar' el ingreso daría otra cifra, y la que manda es
   la del recibo"* (`placita lib/dominio/contabilidad.ts:9-31`).
7. **Enteros y un solo redondeo.** Peso en gramos enteros (`0.1 + 0.2 !== 0.3`);
   COP redondeados UNA vez al total, nunca línea por línea, *"o la suma no da lo que
   dice el recibo"* (`placita lib/types.ts:9-15`, `placita/DEC-004`). Monto de gasto
   entero **mayor que cero**: el signo lo pone el concepto, nunca el número
   (`placita lib/types.ts:994-997`, `villa-broaster/KN-007`).
8. **Consecutivo por local, sin reiniciar y sin reutilizar** —ni el de una orden
   cancelada, *"que sigue existiendo"* (`contabilidad.ts:200-219`). Y **no agrupes
   por el texto del número**: agrupa por la clave real (`Venta.puestoId`), porque el
   prefijo es presentación y los recibos viejos no lo tienen (`placita/KN-039`).
9. **Un solo escritor, con la decisión metida hacia adentro.** `anexarOrden` no
   recibe la orden armada: recibe una **función** que decide con lo ya guardado
   delante, para que cada almacén la envuelva en lo que tenga —cola de un carril en
   disco, transacción en Supabase— (`almacen.ts:19-27`, `:76-84`). Escritura
   **atómica** (`.tmp` + `rename` en el mismo directorio), **nada lanza** (booleano
   y valor vacío en vez de excepción) y **lo corrupto se respalda a `.bak`, no se
   sobrescribe** (`almacen-disco.ts:9-33`).
10. **El día es el del negocio, no el del reloj UTC.** `fechaNegocio` +
    `America/Bogota` en dominio y UI, con self-test del caso nocturno
    (`estanco-contable/KN-005`). Y el reloj lo pone el **servidor**, nunca el celular
    de quien pide (`contabilidad.ts:27-32`).
11. **Toda vía destructiva pide credencial y deja registro.** Re-teclear el PIN de
    **quien tiene la sesión** —no basta con que haya sesión abierta, *"la caja se
    queda abierta todo el día y quien pase la usa"*— y el hecho queda en el basurero
    con `personaId`, descripción congelada y `autorizadoConPin`
    (`placita lib/auditoria.ts:7-23`, `lib/dominio/basurero.ts:1-16`,
    `placita/DEC-005`).
12. **Cuando no cuadra, que grite.** Se deja constancia legible (`[Descuadre: pagos
    39000 ≠ total 65000]`) y una función lo delata: *"Preferimos una factura que
    grita su descuadre a una que miente cuadrada: el arqueo del turno la encuentra
    esa misma noche"* (`estanco facturacion.ts:65-66`). `conciliar` en la placita
    hace lo equivalente y **reporta el número del recibo** que no cuadra
    (`placita lib/dominio/contabilidad.ts:27-31`).

## Cuándo NO aplica

- **La merma NO es una venta a precio 0… salvo en el estanco, donde SÍ lo es.**
  Es la contradicción más útil del corpus y no se fusiona. En **placita** (frutas y
  verduras) la merma es un tipo de movimiento propio con motivo tipado: *"jamás una
  'venta a precio 0', que ensucia los ingresos y esconde el problema real"*, y se
  compara contra `mermaEsperadaPct` por lote (`lib/types.ts:33-38`, `placita/KN-001`).
  En **estanco-contable** (cigarrillos y licor) la regla es literalmente
  `mermas = venta a precio 0` (`estanco-contable/DEC-001`). **La condición de
  negocio decide**: donde la mercancía se daña todos los días y esa pérdida es un
  costo del mes tan real como el arriendo, la merma necesita su propio eje y su
  propia cifra en la ganancia neta (`placita lib/dominio/contabilidad.ts:32-40`);
  donde perder mercancía es excepcional, un tipo más de salida basta.
- **"Todo gasto se anula" tampoco es universal.** En placita el gasto **no se edita,
  no se borra y tampoco se anula**: *"el dueño no lo pidió y una anulación a medias
  es peor que ninguna"* (`lib/dominio/gastos.ts:14-17`). En villa-broaster y wrd sí
  hay `anulado` (`villa-broaster/KN-007`, `wrd/DEC-006`). Antes de copiar el flag,
  pregunta si hay quien lo audite.
- **Anular no siempre retira los efectos.** En el estanco anular **retira del
  kardex** los movimientos con esa `facturaId` y `resumenPagos` ignora la factura
  (`facturacion.ts:26-33`). En villa-broaster cancelar es **solo** un cambio de
  estado, porque ahí no hay kardex acoplado a la orden (`contabilidad.ts:899-905`).
  Copiar el verbo sin copiar el efecto es cómo se duplica el stock.
- **Devolver NO es anular.** Si el cliente trae de vuelta parte de la compra días
  después, la factura original **no se toca**: nace un documento NUEVO (nota de
  crédito) que la referencia y reingresa solo lo devuelto, valorado **al costo de
  salida, jamás al precio de venta** —*"reingresar al precio de venta infla el
  inventario con el margen"*— y perteneciente a la jornada de HOY, no a la de la
  factura (`estanco lib/dominio/devolucion.ts:4-10`, `:19-32`, `:34-39`).
- **Sí existe una vía destructiva, y está acotada.** En el estanco ELIMINAR es
  destructiva y **reutiliza el consecutivo**; por eso los ids llevan sello base36 de
  la fecha, para que no colisionen (`estanco-contable/KN-004`,
  `facturacion.ts:70-73`). En la placita el borrado va al basurero, que se purga
  automáticamente **2 horas después del cierre de caja** —y mientras el día no
  tenga `CierreCaja`, sus registros se conservan siempre, *"no hay cierre del que
  contar las horas"* (`lib/dominio/basurero.ts:17-23`).
- **La cola de un carril NO protege entre procesos.** Sirve dentro de UN proceso
  Node: *"Dos procesos contra la misma carpeta sí necesitarían un lock de archivo —
  y cuando eso haga falta será porque ya toca el almacén centralizado"*
  (`almacen-disco.ts:212-217`). El barrido de QA lo dejó como pendiente explícito de
  despliegue: *"almacén-disco serializa escrituras SOLO dentro de un proceso Node →
  despliegue con UNA instancia escribiendo `data/`"* (`villa-broaster/KN-015`, punto
  b; tarea `T-05-despliegue.md:25`, *"llevar un local-first a producción sin romper
  el 'un solo escritor'"*). Tampoco anides tareas en la cola: una tarea encolada que
  encola otra **se espera a sí misma**, por eso solo las escrituras pasan por ella
  (`almacen-disco.ts:218-220`).
- **Multi-dispositivo cambia la pregunta de "quién escribe" a "quién gana el
  merge".** En la placita cada equipo sube al foco o cada 4 s, y la regla crítica es
  que **con cola pendiente de subir NO se baja nada**, para proteger la venta recién
  cobrada de un conflicto de merge (`placita/KN-038`). Sin clave configurada, el
  outbox devuelve 401 y nada sube: es el sandbox seguro para hacer E2E de facturación
  sin ensuciar la Supabase real (`placita/KN-028`).
- **Un gasto no tiene canal**, así que `gastosCop` **sí** es un número solo: la
  prohibición del total a secas aplica a lo que tiene desglose natural, no a todo
  (`contabilidad.ts:707-710`).

## Evidencia

- `estanco-contable/KN-004` — factura con consecutivo por local y precios/nombres
  congelados; anular conserva el documento y retira sus movimientos; la alternativa
  medida que falseaba la ganancia; eliminar es la vía destructiva.
- `estanco-contable/KN-005` (Permanent) — jornada contable ≠ fecha UTC, bug real a
  las 11:28 p.m.; `estanco-contable/DEC-001` — stock SIEMPRE derivado de
  movimientos, mermas = venta a precio 0, costo promedio ponderado móvil.
- `placita/DEC-022` — el eje de unidades vive en Movimiento, no en Lote: costo de
  ventas en $0 corregido y verificado en vivo. `placita/DEC-004` — un movimiento por
  operación, gramos enteros, COP una sola vez. `placita/DEC-008` — `eliminadoEn`,
  kardex y ventas intactos, basurero registra. `placita/DEC-005` + `DEC-013` —
  ninguna acción de UI destructiva inmediata; `impresaEn` solo tras confirmar el
  papel. `placita/KN-039` — agrupar por `puestoId`, no por el prefijo del número.
  `placita/KN-028` — E2E de 4 facturas reales que cuadra al peso. `placita/KN-038` —
  con cola pendiente no se baja nada. `placita/KN-001` — por qué la placita no es el
  estanco.
- `villa-broaster/KN-007` — dominio de gastos (`anulado`, sin borrado físico),
  `netoCop`, desglose por canal obligatorio, 60 tests. `villa-broaster/KN-009` — si
  la UI promete un número, el servidor debe honrar ese número.
  `villa-broaster/KN-015` — la cola serializa solo dentro de un proceso (pendiente
  T-05). `villa-broaster/DEC-003` — almacén tras interfaz, atómica `.tmp`+`rename`,
  `.bak`, cola de un carril. `villa-broaster/DEC-006` y `KN-004` — la comparativa
  entre sedes es el argumento comercial: por eso no puede haber total mezclado.
- `arroces/DEC-002` — el pedido nace sin pagos; al cobrar se congelan y se sella
  `cobradoEn`. `arroces/KN-001` (Permanent) — auditar los supuestos temporales al
  portar un módulo de dominio entre negocios.
- `wrd/DEC-006` — patrón contable de la casa: desglose siempre, neto como única
  cifra total, cancelados aparte, gastos que se anulan. `wrd/DEC-010` — mensajes de
  error de stock **congelados e idénticos** entre demo y SQL.
- `infrapilot/RSK-003` (Permanent, Open) — 8 agentes en paralelo sobre el mismo
  `state.json` lo corrompen; mitigación: serializar o un solo escritor.
  `prommter/PEND-002` — una curación se dejó sin hacer **a propósito** para evitar
  doble escritor. `_permanent/KN-006` — clase de bug "dos fuentes de verdad": quien
  escribe y quien lee tienen que ser el mismo sitio.
- Código (todas las rutas absolutas bajo `C:\Users\Kalel\`):
  - `prommter\proyectos\villa-broaster\broaster-app\lib\servidor\contabilidad.ts` —
    cabecera con las cuatro reglas `1-33`, consecutivo `200-219`, congelar líneas
    `224-231`, `cuadraTotal` y "cinturón y tirantes" `268-313`, máquina de estados
    `320-332`, `anularGasto` `458-467`, **el no-total** `682-691`, `netoCop`
    `718-724`, catálogo leído una vez `880-884`, `cancelarOrden` `899-905`.
  - `...\broaster-app\lib\servidor\almacen-disco.ts` — cabecera `9-33` (nada lanza,
    `.bak`, escritura atómica), cola de un carril `205-232`.
  - `...\broaster-app\lib\servidor\almacen.ts:19-27` y `:76-84` — la decisión viaja
    hacia adentro. `...\villa-broaster\tareas\T-05-despliegue.md:25`.
  - `prommter\proyectos\placita\lib\types.ts:9-43` — las cuatro reglas del contrato
    (gramos enteros y un redondeo, hechos vs derivados, la merma no es venta,
    multi-local); `:217-223` precio derivado que se persiste; `:884-908`
    `RegistroBasurero`. `lib\dominio\contabilidad.ts:9-40`;
    `lib\dominio\gastos.ts:6-32`; `lib\dominio\basurero.ts:1-28`;
    `lib\auditoria.ts:1-26`.
  - `prommter\proyectos\estanco-contable\lib\dominio\facturacion.ts:1-77` (congelado,
    cuadre que lanza, anulación sellada, descuadre que grita, ids con sello) y
    `:215-237` `anularFactura`; `lib\dominio\devolucion.ts:1-39`.
  - `fable 5\wrd\sistema\js\contable.js:18-36`; `fable 5\wrd\setup\schema.sql:509-512`.

### Huecos (lo que el corpus NO respalda todavía)

- **Un gasto mal tecleado en la placita no tiene salida.** El dominio dice que no se
  edita, no se borra y no se anula (`lib/dominio/gastos.ts:14-17`), y el basurero
  solo conoce tres tipos —`factura_borrada`, `producto_borrado`,
  `cambio_inventario`— (`lib/types.ts:884`). Un `grep` de
  `anularGasto|eliminarGasto|borrarGasto` sobre `lib/`, `components/` y `app/` no
  devuelve nada. Es el único invariante del tema que hoy **bloquea al usuario** en
  vez de protegerlo.
- **wrd fecha las ventas por `creado`, no por entrega ni por cobro**, y lo declara:
  *"no existe una columna 'entregadoEn'… un pedido puede tardar días entre 'nuevo'
  y 'entregado'"* (`sistema/js/contable.js:30-36`). Es una aproximación documentada,
  no una regla: si allá se piden cortes finos, hay que sellar la fecha del cobro
  primero (ver [[TEMA-caja-y-turnos]]).
- **La escritura entre dos procesos nunca se ha probado.** Existe la cola dentro de
  un proceso y existe el diagnóstico (`villa-broaster/KN-015`), pero no hay lock de
  archivo, ni almacén Supabase implementado, ni una medición de dos instancias
  escribiendo la misma carpeta `data/`. Hoy la garantía es **operativa** (desplegar
  una sola instancia), no técnica.
- **No hay nada sobre períodos contables cerrados** (bloquear ediciones de meses ya
  reportados), **ni sobre IVA/impuestos**, **ni sobre asientos de doble partida**.
  Ningún proyecto lo modela. Si un cliente lo pide, es diseño nuevo, no copia.
- **La conciliación entre dos fuentes solo existe en la placita** (`conciliar`,
  `lib/dominio/contabilidad.ts:27-31`). En villa-broaster el equivalente es
  `cuadraTotal`, que compara el documento consigo mismo, no contra el kardex.

## Enlaces

- [[TEMA-caja-y-turnos]] — a quién pertenece la plata y cómo se cuadra el cajón; ahí
  vive la regla del `cobradoEn` que aquí se da por sentada al hablar de congelar.
- [[TEMA-generadores-de-diseno]] — cuando una de estas pantallas se le encarga a un
  generador: los datos de negocio van con origen `archivo:línea` y lo que falta se
  marca como hueco, nunca se rellena.
- `arroces/KN-001` y `_permanent/KN-006` son las dos clases de bug raíz de este
  tema: "dos criterios distintos para escribir y para leer" y "dos fuentes de
  verdad". Casi todo invariante de aquí existe para hacer una de las dos imposible.
