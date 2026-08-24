---
slug: cobro-a-clientes
titulo: Cómo se le cobra un sistema a un cliente
alias: [cobro, cobrar, cuanto cobro, cuanto le cobro, cuanto vale, cuanto cuesta, precio, precios, cotizar, cotizacion, presupuesto, tarifa, tarifas, honorarios, mensualidad, mensualidades, cuota, permanencia, pago unico, instalacion, arranque, suscripcion, plan, planes, niveles, presencia, operacion, automatizacion, propuesta, propuestas, plan de servicio, oferta, contrato, alcance, rebaja, descuento, margen, plata, ingreso, facturar, cliente, clientes, sistema, sistemas, web, pagina, comision, domicilios, prommter, agencia, venta, vender, cerrar cliente, piloto, prueba]
preguntas: ["cuanto le cobro a un cliente por un sistema", "¿cuánto cobro por una página o un sistema?", "¿cobro pago único o mensualidad?", "¿cómo estructuro el precio de una propuesta?", "¿qué le pongo de precio al cliente del asadero?", "¿cuánto me cuesta a mí sostener un cliente?"]
proyectos: [prommter, orama, villa-broaster, pollo-landing]
confianza: media
actualizado: 2026-08-24
---

# Cómo se le cobra un sistema a un cliente

## Respuesta corta

**Cobra por lo que el cliente gana o ahorra, nunca por lo que te cuestan las
herramientas**: el costo fijo de la casa es ~100.000–120.000 COP/mes y es el mismo
con 1 cliente que con 8, así que el primero paga la infraestructura de todos.
**Clasifícalo en tres niveles y apunta al del medio**: Presencia 400.000–900.000 de
instalación + 80.000–150.000/mes · **Operación 1.500.000–3.500.000 + 250.000–500.000/mes
(aquí está el negocio)** · Automatización 4.000.000+ y 700.000–2.000.000+/mes.
**Estructura por defecto: instalación + mensualidad**; si entras sin instalación —como
Orama— la **permanencia mínima por escrito no es opcional**, o le estás prestando plata
al cliente. **Antes de escribir la primera cifra, confirma el modelo de cobro con el
cliente**: esa es la que ya se pagó. Y siempre: dos o tres opciones, tope escrito al
consumo variable, y si piden rebaja **quitas alcance, no bajas el precio**.

## Por qué (qué lo pagó)

**Lo pagó una propuesta reescrita en vivo.** Orama salió con bloque de *pago único de
$1.000.000* (`orama/DEC-002`). El 2026-08-21, en reunión, el dueño corrigió que Prommter
cobra **por mensualidades con permanencia, no por pago único** (`prommter/KN-003`), y hubo
que reescribir el bloque de inversión del plan de servicio: `orama/DEC-004` reemplazó a
`orama/DEC-002`. La lección quedó escrita como `orama/KN-004`: *confirmar el modelo de
cobro con el cliente ANTES de escribir cualquier bloque de precio; la memoria del proyecto
puede estar desactualizada.*

**Y todavía está sangrando.** Los dos capítulos de esa misma propuesta se contradicen hoy:
`plan-servicio-orama.html:1115` dice *"Sin cobro de arranque… todo va dentro de la
mensualidad"* y `propuesta-orama.html:766` sigue diciendo *"pesos · pago único de
construcción"*. Los dos se le entregan al mismo cliente. Es exactamente lo que
`prommter/KN-003` prohíbe, y sobrevivió a la corrección porque solo se arregló el capítulo 2.

**La estructura de costo que manda todo.** Documento propio del dueño,
`documentos/agencia/precios-v2.html:75-87`: Claude Pro ~80.000 + Vercel 0 + Hostinger
~16.000–40.000 = **~100.000–120.000 COP/mes, iguales con 1 cliente que con 8**. Por eso
cotizar contra el costo de herramientas es el error caro: *"cotizarías en 50.000 COP algo
que vale millones para el cliente"* (`precios-v2.html:315-316`). Lo que se vende es criterio
y tiempo, no hosting (`precios-v2.html:295-296`).

**Las tres trampas ya identificadas, cada una con su factura.**
- *Nivel 1 sin nada que entregar*: si la página no cambia nunca, **el cliente cancela a los
  tres o cuatro meses — y con razón** (`precios-v2.html:145-150`).
- *Nivel 3 sin tope*: el consumo variable (WhatsApp por conversación, IA por uso) sí escala
  con el éxito del cliente; **sin cláusula de tope, el cliente que más crece es el que te
  deja pérdida** (`precios-v2.html:259-266`).
- *Sin instalación y sin permanencia*: **"le estás prestando plata al cliente"**
  (`precios.html:274-285`). Es justo la modalidad en que entró Orama.

## Cómo se aplica

1. **Confirma el modelo de cobro antes de teclear una cifra** — con el cliente y con el
   dueño, no con la memoria del proyecto (`orama/KN-004`). Si una memoria dice "pago único",
   está desactualizada (`prommter/KN-003`).
2. **Pregunta qué gana o ahorra. Sin ese dato estás cotizando a ciegas**
   (`precios.html:324-325`). El número que abre la conversación está medido:
   las apps de domicilio **cobran 20–30 % y además el cliente no es tuyo** —no tienes su
   teléfono, compite por precio al lado de tus competidores— (`villa-broaster/KN-001`).
   Cuenta lista para la reunión: 60 domicilios/mes × 30.000 = 1.800.000 de venta, de los
   cuales **360.000–540.000 se los lleva la comisión** (`precios-v2.html:205-211`).
   La conversación deja de ser "cuánto cuesta la página" y pasa a ser "cuánto está regalando
   cada mes".
3. **Clasifica en Presencia / Operación / Automatización** y usa la tabla de
   `precios-v2.html:288-294`. **Concéntrate en Operación**: el valor es evidente, el cliente
   lo usa todos los días y la mensualidad se defiende sola (`precios-v2.html:212-216`).
4. **Elige estructura de cobro con los ojos abiertos** (`precios.html:266-302`):
   **A** instalación + mensualidad (recuperas de inmediato; el pago inicial asusta) —
   recomendada con los primeros clientes porque necesitas caja;
   **B** sin instalación, mensualidad más alta y **permanencia mínima calculada + penalidad,
   por escrito**; **C** por tramos de uso, solo para clientes grandes.
   Caso vivo en B: Orama, 1.000.000 COP/mes, sin cobro de arranque, marca y web dentro de la
   cuota, pauta Meta de 100.000/mes incluida (`orama/DEC-004`, `plan-servicio-orama.html:1104-1116`).
5. **Recoge los datos que cambian el precio antes de cotizar.** La lista existe y es del
   negocio, no del software: carta y precios por local, costo y frecuencia del cambio de
   aceite, **comisión del datáfono**, domicilios propios o tercerizados, cuántas personas
   usan el sistema (`villa-broaster/PEND-003`, `villa-broaster/PEND-002`). Y la decisión
   legal que mueve el número: **factura electrónica DIAN o comprobante interno — cambia el
   diseño del módulo y el costo** (`villa-broaster/PEND-001`).
6. **Deja por escrito qué NO incluye.** Se cobran aparte, siempre: rediseño o cambio de
   identidad, módulo nuevo fuera de alcance, integración con un tercero no prevista,
   migración de datos, capacitación más allá de la entrega (`precios.html:249-256`).
7. **Tope de consumo variable en el contrato**, con número: *"incluye hasta N conversaciones /
   N operaciones de IA al mes; lo que pase se factura aparte"* (`precios-v2.html:264-266`).
8. **Presenta dos o tres opciones, nunca una.** Con una sola la decisión es sí o no; con tres,
   la mayoría toma la del medio: ponla donde te convenga (`precios-v2.html:319-320`).
   **Si piden rebaja, quita alcance** — bajar el precio enseña que el primero era inflado
   (`precios-v2.html:322-323`).
9. **Dale a la mensualidad algo que comprar cada mes** o la cancelan: que siga al aire, que
   alguien responda cuando se rompe un viernes, una mejora pequeña, y **un reporte mensual
   —lo más barato de dar y lo que más retiene** (`precios.html:304-314`). Orama lo aterrizó:
   día de grabación semanal, campañas gestionadas, tablero y capacitación dentro de la cuota
   (`plan-servicio-orama.html:1104-1109`).
10. **Si el cliente pide probar antes de firmar, dale un piloto acotado en días y barato**,
    que termine en reporte y firma: la prueba de 10 días de Orama es D1-D2 montar, D3-D6
    campaña, D7 grabación, D8 fichas, D9 interesados, **D10 reporte y firma**
    (`orama/PEND-003`), gastando casi nada salvo pauta. Y **no delegues al equipo hasta
    cerrar al cliente** (`orama/KN-005`).

## Cuándo NO aplica

- **Sistemas de la propia casa** (placita, wrd): ahí no hay precio a un cliente. Su costo
  está medido en sesiones de agente y tokens (`placita/costos`, `villa-broaster/costos`),
  no en pesos.
- **Página que solo muestra, sin recibir nada**: es la más barata de sostener y **la que
  menos justifica un cobro mensual alto — ojo con eso** (`precios.html:74-75`).
- **Cliente que aún no ha dado los datos de alcance**: no cotices. `villa-broaster/PEND-003`
  y `villa-broaster/PEND-002` son la lista de lo que falta; sin eso se construye a ciegas.
- **Nivel 3 (Automatización): nunca de catálogo.** Cada proyecto es distinto y el precio
  depende de cuántas integraciones haya: se cotiza por alcance específico
  (`precios-v2.html:276-277`).
- **Los rangos no son mercado.** El documento lo dice de frente: *"no tengo datos de lo que
  se cobra en tu ciudad. Úsalos como ancla y ajústalos con las primeras tres cotizaciones
  reales"* (`precios-v2.html:58-60`; conversión usada 1 USD ≈ 4.000 COP, revisar si el dólar
  se mueve).
- **Compromisos comerciales que dependen del margen no los fija el asistente.** Cuando el
  sistema promete beneficios por volumen, esos umbrales los aprueba el dueño antes de
  publicar, porque solo él conoce márgenes y capacidad (`pollo-landing/PEND-003`).

## Evidencia

- `prommter/KN-003` — el modelo comercial: mensualidades con permanencia, no pago único;
  regla explícita de que ninguna propuesta presente el servicio como pago único.
- `orama/DEC-002` (Superseded) → `orama/DEC-004` — el precio que cambió de forma:
  1.000.000 pago único → 1.000.000/mes con permanencia, sin cobro de arranque.
- `orama/KN-004` — la lección: confirmar el modelo de cobro antes de escribir precio.
- `orama/KN-005`, `orama/PEND-003` — prueba de 10 días antes de firmar; no delegar hasta cerrar.
- `villa-broaster/KN-001` — comisión de apps 20–30 % + el cliente no es tuyo: el argumento
  de venta que sostiene el precio.
- `villa-broaster/PEND-001`, `villa-broaster/PEND-002`, `villa-broaster/PEND-003` — lo que
  hay que preguntar antes de poner número (DIAN, datáfono, precios por local, aceite).
- `pollo-landing/PEND-003` — los incentivos por volumen son compromiso comercial: los aprueba
  el dueño.
- Doctrina de precios escrita por el dueño (documento interno, **no compartir con clientes**):
  `C:/Users/Kalel/prommter/documentos/agencia/precios-v2.html` (345 líneas: costo fijo 75-87,
  niveles 140-141 / 202-203 / 272-274, trampa del consumo variable 259-266, resumen 288-296,
  6 reglas para cotizar 313-325) y `C:/Users/Kalel/prommter/documentos/agencia/precios.html`
  (364 líneas: costo vs valor 164-188, modalidades A/B/C 266-302, qué justifica la mensualidad
  304-314, errores que cuestan caro 334-343). PDF equivalentes en la misma carpeta.
- Propuestas reales: `C:/Users/Kalel/prommter/proyectos/orama/plan-servicio-orama.html:1091-1116`
  y `C:/Users/Kalel/prommter/proyectos/orama/propuesta-orama.html:566,766`.

### Huecos (lo que el corpus NO tiene y hay que saber que falta)

1. **No existe tarifa por hora ni horas medidas por tipo de proyecto.** El propio documento
   lo marca como *"el único dato que convierte estos rangos en precios definitivos"*
   (`precios-v2.html:329`, `precios.html:346-348`) y sigue sin llenarse. **Sin él no se puede
   calcular el piso**, y todos los rangos de arriba son ancla, no precio.
2. **Ninguna propuesta de villa-broaster lleva precio.** Medido: `propuesta-broaster.html`
   (262 líneas) y `propuesta-asadero.html` (254 líneas) tienen **0 líneas con cifra de
   dinero**. Se vendió el valor —comisión, merma, velocidad— y nunca se puso el número.
3. **La doctrina de precios no está en ninguna memoria ORION.** Ningún objeto de los 11
   proyectos cita `documentos/agencia/precios*.html`; por eso el cerebro no la encontraba.
   Merece un objeto en `prommter` que apunte al archivo.
4. **La permanencia mínima de Orama sigue "a definir"** (`orama/DEC-004`,
   `plan-servicio-orama.html:1116`) mientras el contrato ya opera en modalidad B. Es el hueco
   más caro que hay abierto: `precios.html:281-285` dice que sin ese número la modalidad B es
   un regalo.
5. **El forecast trimestral está vacío.** La plantilla y la disciplina existen
   (`prommter/reportes/forecast-trimestral/README.md`), pero la carpeta `2026-Q3` tiene **0
   archivos**: no hay meta de ingreso ni pipeline escrito contra el cual medir estos precios.
6. **Falta el dato de mercado local y la definición de si se factura formalmente**
   (`precios.html:350-352`).

## Enlaces

- [[TEMA-modelos-y-costos]] — el otro lado del margen: lo que cuesta *producir* el sistema,
  medido en tokens y modelos.
- [[TEMA-invariantes-contables]] — cómo se congela lo cobrado dentro del sistema que vendes.
- [[TEMA-generadores-de-diseno]] — la propuesta también se vende con la vista: cómo se
  encarga la pieza visual que la acompaña.
