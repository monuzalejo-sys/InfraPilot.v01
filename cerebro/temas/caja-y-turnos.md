---
slug: caja-y-turnos
titulo: "Cobrar en un punto físico: la caja, el turno y a quién pertenece la plata"
alias: [caja, cajas, caja registradora, cajero, cajeros, cajera, cajeras, cajero del mostrador, atender el mostrador, mostrador, mostradores, la caja del mostrador, pos, punto de venta, arqueo, arqueos, arqueo de caja, cuadre, cuadrar, descuadre, descuadres, turno, turnos, turno de caja, abrir turno, cerrar turno, cierre, cierro, cierre de caja, cerrar la caja, corte de caja, cobro, cobros, cobrar, cobrado, cobradoen, cobrada, plata, cajon, efectivo, contado, esperado, faltante, sobrante, base inicial, fondo de caja, sencillo, datafono, nequi, daviplata, transferencia, billetera, pago, pagos, pago mixto, mixto, vueltas, billete, toques, teclas, atajos, rapido, velocidad, sin scroll, factura, facturas, recibo, comprobante, gasto de caja, gastos, jornada, marcaje, quien cobro, plata de quien]
preguntas: ["como cobro rapido en la caja", "la plata de que turno es si cobro despues", "que pasa si cierro el turno con plata de otro turno", "¿por qué el arqueo no cuadra y sale un sobrante que nadie explica?", "¿cómo hago el cierre de caja y el arqueo al final del día?", "¿le pongo turnos de caja a este negocio o no?", "¿la venta es del cajero que la tomó o del que la cobró?"]
proyectos: [arroces, placita, villa-broaster, estanco-contable, wrd]
confianza: alta
actualizado: 2026-08-24
---

# Cobrar en un punto físico: la caja, el turno y a quién pertenece la plata

## Respuesta corta

**La plata es del turno en que se COBRÓ, nunca del turno en que se tomó el
pedido.** Sella dos fechas distintas en el documento —la de la toma y
`cobradoEn`— y filtra el arqueo por la del cobro, comparando por instante en
milisegundos, jamás por el texto del ISO. **Para cobrar rápido: todo en un solo
bloque, sin navegar y sin scroll** —total gigante, una tecla por medio de pago,
grilla tocable— y que los pagos sumen EXACTO o la venta no se registra.
**Antes de montar turnos, pregunta si en ese negocio tomar y cobrar son el mismo
acto**: si lo son (tienda, placita), el turno de caja sobra y el corte es diario
por local; si no lo son (restaurante, asadero), el turno es obligatorio o los
descuadres no se explican nunca. Y no confundas **turno de caja** (plata) con
**jornada laboral** (marcaje de la persona): son dos módulos distintos.

## Por qué (qué lo pagó)

**Lo pagó un bug real en arroces, el 2026-08-05.** Se portó `cierre.ts` del
estanco —donde la factura se emite y se cobra en el mismo instante— a un
restaurante, donde tomar el pedido y cobrarlo son momentos distintos.
`pedidosDelTurno` siguió filtrando por la fecha de TOMA. Resultado: el pedido
tomado a las 3:03 p.m., antes de abrir la caja, y cobrado a las 3:20 con el
turno ya abierto, **quedaba fuera del arqueo**: las ventas del turno mostraban
$0 y su plata aparecía como un **sobrante que nadie sabía explicar** al cerrar
(`arroces/KN-001`, `arroces/DEC-003`).

Dos cosas de ese fallo importan tanto como la regla:

- **No fue falta de modelo.** El builder de sonnet compiló y pasó sus
  self-tests; la nota medida de la sesión lo dice con todas las letras: *"el bug
  de cierre NO fue de capacidad del modelo (lo reveló el E2E, no lo habría
  evitado opus en S2)"*. Fue el **único ciclo de fix** de esa génesis
  (`fixCycles: 1`, con 38/38 self-tests de dominio verdes, cierre 6/6).
- **La clase de bug es portable.** Al mover un módulo de dominio entre negocios
  hay que auditar sus **supuestos temporales implícitos**: cuándo nace el
  documento vs. cuándo entra la plata (`arroces/KN-001`, tier Permanent).

**Lo segundo lo pagó la placita, en producción.** El cierre antes solo
estampaba la hora: *"el conteo de la plata se hacía en un cuaderno, al lado del
teclado, y a la mañana siguiente nadie sabía de dónde salía la diferencia"*. El
dueño pidió que el cierre fuera "lo más veloz y claro posible" y se rehizo como
**una mirada y un número** (`placita app/(app)/ventas/cierre-caja.tsx:5-24`).
En la misma línea nacieron los gastos de caja: *"el hielo y el almuerzo salen
del cajón, y si no se anotan, a la noche faltan $40.000 que nadie sabe
explicar"* (`placita app/(app)/ventas/page.tsx:60-65`).

**Lo tercero lo paga el pico del almuerzo.** La regla literal del dueño para el
cobro es que TODO esté en pantalla, sin abrir nada y sin ningún paso escondido
(`placita .../cobro.tsx:4-12`), y en el diseño de Villa Broaster se escribió por
qué: *"en el pico de almuerzo deslizar es perder venta"*
(`villa-broaster docs/BASES-CAJA.md:13-15`).

## Cómo se aplica

1. **Dos fechas en el documento.** El pedido nace sin pagos; al cobrar se
   congelan los pagos y se sella `cobradoEn` con la hora real del cobro,
   distinta de la de la toma (`arroces/DEC-002`).
2. **La ventana del turno se mide sobre el cobro**, filtrando además por
   sucursal, y **por instante (ms desde epoch)**, nunca comparando texto ISO
   (`arroces cierre.ts:148-162` y su nota de cabecera, líneas 45-47). Un
   documento sin cobrar **no es de ningún turno todavía**.
3. **Efectivo esperado = base inicial + ventas en EFECTIVO del turno.** La
   transferencia y el datáfono no dejan billetes en el cajón: si se sumaran,
   *"todo turno con datáfono aparecería con un faltante enorme y quien cobra
   cargaría con una culpa inventada"* (`arroces cierre.ts:18-27` y `:179`).
4. **Pide lo contado ANTES de mostrar el esperado** — *"si la persona ve primero
   el número, el conteo deja de ser un conteo"* (`arroces cierre.ts:164-169`).
5. **El turno pertenece a la jornada en que ABRIÓ**, calculada con
   `fechaNegocio` en `America/Bogota`. Un turno nocturno cruza la medianoche
   UTC a mitad de camino y aun así es entero del día anterior; hay un self-test
   dedicado ("turno nocturno") y en el estanco esto ya había costado un bug real
   a las 11:28 p.m. (`estanco-contable/KN-005`, tier Permanent).
6. **Un solo turno abierto por sede, con apertura serializada**, y **sin turno
   abierto no se cobra**: se rechaza con mensaje claro ("Abra el turno de
   caja") (`villa-broaster tareas/T-03-turno-caja.md:11-12`).
7. **El turno es una dimensión NUEVA encima**, no un reemplazo: la numeración
   consecutiva, las líneas congeladas y el desglose por canal quedan intactos, y
   eso se protege con un test de regresión (`BASES-CAJA.md:54-56`, `T-03:22`).
8. **Cobro en un bloque para que sea rápido**: total gigante, una tecla por
   método, grilla tocable filtrada en vivo por el mismo cuadro donde se teclea
   el código o escanea el lector, y pantalla **sin scroll**
   (`placita .../page.tsx:174`, medido 1366×768 = 768/768 y 1280×800 = 800/800,
   `placita/KN-031`). Meta de velocidad escrita: **3 productos cobrados en ≤6
   toques** (`BASES-CAJA.md:61`).
9. **Los pagos suman exacto o no hay venta.** En mixto se teclea una mitad y la
   otra se autocompleta: *"la cajera no hace la resta con un cliente enfrente y
   la suma no puede quedar mal"* (`placita .../cobro.tsx:32-42`).
10. **Protege la regla con el test que la rompe**: orden tomada en el turno A y
    cobrada tras abrir el turno B **cuenta en B**; dos aperturas simultáneas en
    la misma sede, solo una gana; cerrar es idempotente y no se reabre
    (`T-03:19-22`, `arroces cierre.ts:370-378`).

## Cuándo NO aplica

- **Si venta y cobro son el mismo acto, no montes turnos.** La placita es el
  caso: su venta se crea y se cobra en un solo momento, con una sola fecha, y su
  corte es **uno por día y por local** (`placita lib/dominio/caja.ts:15-24`;
  `registrarCierre` lanza si ese día ya cerró, `:139-149`). El análisis previo
  a Villa Broaster lo dejó por escrito: *"la placita NO resuelve el turno de
  caja… no hay precedente"*, y por eso allá el `TurnoCaja` **se diseña desde
  cero** (`BASES-CAJA.md:33-39`, `villa-broaster/PEND-006`).
- **La fórmula del esperado NO es universal: depende de qué registra el
  negocio.** Arroces y el estanco arrancan con **base inicial** y su arqueo no
  toca gastos. La placita **no registra con cuánto abrió el cajón** y por eso su
  esperado es `ventas en efectivo − gastos en efectivo`, y lo dice en la propia
  pantalla: *"inventarse una base sería hacer cuadrar el número contra un dato
  que nadie registró"* (`placita lib/dominio/contabilidad.ts:42-55` y `:638`;
  pantalla en `cierre-caja.tsx:26-33`). **No copies la fórmula: copia la
  pregunta** — ¿se registra la base?, ¿salen gastos del cajón?
- **Turno de caja ≠ jornada laboral.** El marcaje de entrada/almuerzo/salida de
  la persona es control de personal y vive aparte
  (`placita lib/dominio/jornada-laboral.ts:1-27`; descartado explícitamente como
  base de caja en `BASES-CAJA.md:30-31`). Confundirlos es la trampa: la placita
  sí construyó "turnos" del requisito original… pero de personal, no de plata.
- **En el estanco manda el vínculo, no la ventana.** Si la factura declara
  `turnoId`, ese vínculo gana; la ventana (empresa+local+usuario) es solo el
  respaldo para ventas emitidas sin turno abierto o por API
  (`estanco cierre.ts:113-129`). En arroces se hizo al revés a propósito: el
  `Pedido` no lleva `turnoId` porque **es de la sucursal, no de quien lo cobró**
  (`arroces cierre.ts:29-36`). Decide cuál de los dos modelos quieres antes de
  copiar código.
- **En fase 1 de un kiosko interno puede no haber login.** Arroces expone
  `/panel` y `/caja` por URL directa a propósito, con la auth diferida
  (`arroces/DEC-004`). No lo repitas al exponer el negocio al público.

## Evidencia

- `arroces/KN-001` (Permanent) — la clase de bug de supuestos temporales; el
  E2E lo reveló, no el `tsc` ni los self-tests.
- `arroces/DEC-003` — arqueo y ventas del turno = pedidos COBRADOS en la
  ventana; `arroces/DEC-002` — pagos congelados y `cobradoEn` al cobrar.
- `arroces/costos` (metrics.json, sesión `orion-genesis-arroces`) —
  `fixCycles: 1`, 38/38 self-tests de dominio, cierre 6/6, y la nota de
  calibración citada arriba.
- `C:\Users\Kalel\prommter\proyectos\arroces\lib\dominio\cierre.ts` — cabecera
  18-66 (reglas selladas), `pedidosDelTurno` 148-162, `calcularArqueo` 164-190,
  self-test de la falla F1 370-378 y el "turno nocturno" 380-391.
- `C:\Users\Kalel\prommter\proyectos\estanco-contable\lib\dominio\cierre.ts:113-129`
  — `facturasDelTurno`: el `turnoId` declarado manda sobre la ventana.
- `estanco-contable/KN-005` (Permanent) — jornada contable ≠ fecha UTC (bug
  real detectado a las 11:28 p.m.); `estanco-contable/KN-007` — doble login:
  manda el PC, no el usuario, porque la mercancía sale de donde está la caja.
- `placita/KN-031` — /ventas sin scroll, medido; `placita/KN-039` — el resumen
  por caja agrupa por `Venta.puestoId`, no por el prefijo del número, y el
  datáfono se contabiliza como "transferencia".
- `placita/DEC-013` + `DEC-005` — tope de 3 facturas sin imprimir e impresión
  honesta confirmada por papel; `placita/KN-028` — E2E de 4 facturas reales:
  pago mixto reparte exacto (efectivo 18.700 + Nequi 4.200 = 22.900).
- `C:\Users\Kalel\prommter\proyectos\placita\lib\dominio\caja.ts:15-24, 139-149`
  — un solo cierre por día y por local; `.../contabilidad.ts:42-55, 589-641` —
  el cuadre del cajón no es la ganancia y no hay base inicial.
- `C:\Users\Kalel\prommter\proyectos\placita\app\(app)\ventas\cobro.tsx:4-42`,
  `cierre-caja.tsx:5-33`, `page.tsx:30-73` y `:174`.
- `C:\Users\Kalel\prommter\proyectos\villa-broaster\docs\BASES-CAJA.md` — qué se
  adopta de la placita (9-19), qué no (21-31), el hallazgo clave (33-39), el
  diseño de `TurnoCaja` (46-56) y las condiciones de éxito (79-81);
  `tareas/T-03-turno-caja.md` — diseño y criterios de aceptación.
- `villa-broaster/PEND-006` (Ready) y `villa-broaster/ROAD-001` — *"E1 — El
  punto vende y cuadra… Resultado: se acaban los descuadres"*.

### Huecos (lo que el corpus NO respalda todavía)

- **El `TurnoCaja` de Villa Broaster está diseñado pero NO construido.**
  `PEND-006` sigue en `Ready` y `grep` de `TurnoCaja|turnoId|cobradaEn` sobre
  `villa-broaster/broaster-app/{lib,types}` no devuelve nada. La regla del turno
  del cobro está **probada en arroces**, no en broaster.
- **wrd repite hoy el error que arroces pagó, y lo sabe.** Su contable fecha las
  ventas por `creado`: *"El pedido solo guarda 'creado' — no existe una columna
  'entregadoEn'… un pedido puede tardar días entre 'nuevo' y 'entregado'"*
  (`C:\Users\Kalel\fable 5\wrd\sistema\js\contable.js:30-36`, `wrd/DEC-006`). Es
  exactamente el supuesto temporal de `arroces/KN-001` en otro negocio: si allá
  se abren turnos o cortes finos, hay que sellar la fecha del cobro primero.
- **Nadie ha medido dos cajas físicas reales cobrando a la vez.** El E2E de
  placita fue una caja real + un PC simulado; sigue abierto en
  `placita/PEND-018` punto (3).
- **El corpus no tiene nada sobre retiros/consignaciones parciales del cajón
  a mitad de turno** (sacar plata al banco sin cerrar). Ni arroces, ni el
  estanco, ni placita lo modelan. Si un negocio lo pide, es diseño nuevo.

## Enlaces

- [[TEMA-generadores-de-diseno]] — cuando la pantalla de caja se le encarga a
  un generador: los datos de negocio van con origen `archivo:línea` y lo que
  falta se marca como hueco, nunca se rellena.
- `arroces/KN-001` es el objeto raíz de este tema: la clase de bug "dos
  criterios distintos para escribir y para leer" reaparece en cualquier módulo
  portado entre negocios hermanos.
