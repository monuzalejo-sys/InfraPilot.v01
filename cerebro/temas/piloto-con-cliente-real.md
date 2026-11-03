---
slug: piloto-con-cliente-real
titulo: Cómo se corre un piloto con un cliente real (entrevista, números entregados, costo real y costo del bot)
alias: [piloto, cliente piloto, primer cliente, piloto gratis, entrevista, entrevista al cliente, filtro de preguntas, descubrimiento, dolor del cliente, verdadero dolor, preguntas por secciones, reunion con el cliente, adaptar el sistema al cliente, dropshipping, drop shipping, contraentrega, contra entrega, dropi, ads manager, meta ads, roas, ganancia neta, ganancia real, pedidos entregados, pedido entregado, meta cuenta como venta, compras de meta, exporte de dropi, cruzar anuncios con entregas, costo real, costos de dropi, productos propios, ganancia inflada, ganancia por producto, campana asignada al producto, nombres de campana, costo congelado, el signo cambio, copiloto drop, bot de telegram, costo del bot, cuanto gasta el bot, costo por mensaje, cache de prompt, tope de gasto, haiku, opus, api key, credito de la consola, reporte de novedades, novedades de las 8 pm]
preguntas: ["Meta me dice que estoy vendiendo bien pero la plata no cuadra: ¿cómo calculo lo que de verdad me deja cada anuncio?", "el total me cuadra pero la ganancia por producto me sale rara: ¿qué estoy dejando de preguntarle al cliente?", "mañana me reúno con el cliente piloto: ¿cómo averiguo lo que de verdad le duele antes de seguir construyendo?", "¿cuánto me va a costar al mes tener el bot respondiendo con Claude y cómo lo bajo?", "¿le pido al cliente que anote los pedidos a mano o uso sus reportes?"]
proyectos: [copiloto-drop, prommter]
confianza: alta
actualizado: 2026-11-02
---

# Cómo se corre un piloto con un cliente real

## Respuesta corta

1. **Empieza por los números reales del cliente**: exportes de 60–90 días (sin datos personales); juzga por la ganancia neta del pedido ENTREGADO, no por las «compras» de los anuncios.
2. **No enseñes ganancia por producto** hasta preguntarle el costo real y qué campaña vende qué; mientras, solo el total.
3. Antes de construir, entrevístalo y construye primero lo que ÉL pidió; antes de proponer reemplazar su herramienta, pregunta cuánto paga y si le gusta.
4. Tras la primera prueba del bot, **mide el costo por mensaje** y pon tope de gasto a la llave.

## Por qué (qué lo pagó)

Salió de un piloto: Copiloto drop, un bot de Telegram que lee los reportes de Dropi y de
Ads Manager de un vendedor de dropshipping con contraentrega y le calcula su ganancia neta
real (el vendedor es un conocido del dueño; su nombre no se guarda aquí). La ventana de
octubre dejó cuatro mediciones que cambiaron decisiones:

- **La plataforma de anuncios miente por construcción.** Con 601 pedidos reales del 1 al 20 de
  octubre, Meta decía 555 compras con ROAS 3,97, y lo ya resuelto en Dropi daba −$248.000
  (instantánea con 122 pedidos aún en camino). Se cancelaba 1 de cada 5 pedidos antes de
  despachar (117 de 601), y lo que el vendedor confirmaba a mano se entregaba 97 % frente a
  85 % de lo que confirmaba su bot. El reporte real reemplazó el registro a mano por chat. El
  segundo reporte traía el costo de devolución en cero ($517.000 en el otro), así que el
  importador tuvo que juntar ambos por el ID del pedido; se probó cargando los archivos reales
  y cuadró contra el análisis previo.
- **El costo que trae la plataforma puede ser simbólico.** Con el costo que traía Dropi
  (una fracción simbólica del costo real de cada producto) el mes parecía en ganancia; con los
  costos reales dio una pérdida más de tres veces mayor que esa ganancia aparente, y seguía en
  pérdida aun suponiendo entregados todos los pedidos en camino. Además los nombres de campaña no
  coincidían con los de producto: la campaña con más pauta estaba asignada a un producto con muy
  pocos pedidos, mientras el que más vendía no tenía ninguna. (Las cifras exactas del cliente
  están en la ficha local de la ventana; este repo es público.)
- **La entrevista (estimada en ~15 minutos; la duración real no se midió) corrigió supuestos.** El dueño pidió «solucionar un verdadero
  dolor» y pedir solo los datos necesarios. La entrevista (US$1,74, 119 llamadas) mostró que
  el bot de WhatsApp que se quería superar ya le sirve y le gusta; que las
  etiquetas de cliente A–C4 las pone su ayudante, no Dropi; que la mayoría de sus productos son
  propios; y que ya usa UTM y pauta también en TikTok. Lo que pidió fue el reporte de
  novedades de las 8 p. m., y eso se construyó primero.
- **El bot tiene su propio costo.** Con el modelo más capaz cada mensaje costó ~US$0,028
  porque el bot reescribía sus instrucciones en caché; corregido bajó a ~US$0,018 (≈US$27/mes
  a 50 mensajes al día). La primera pregunta real salió con números idénticos a la base y
  costó US$0,03. La entrevista se estimó «menos de un dólar» y costó US$1,74.

## Cómo se aplica

1. **Pide los exportes reales de 60–90 días**, sin datos personales. Si el reporte real existe,
   no le pidas al cliente registrar a mano. Únelos por el ID del pedido y revisa qué
   columnas vienen en cero (el costo de devolución vino en cero en un reporte).
2. **Mide el pedido entregado**: ganancia neta = precio − costo − flete − devoluciones −
   pauta. Compárala con las «compras» de la plataforma; la diferencia es lo que el cliente
   no veía. Prueba la carga con los archivos reales contra el análisis previo antes de dar
   el sistema por bueno.
3. **Antes de mostrar ganancia por producto**, pregunta el costo real de cada producto
   (sobre todo los propios) y qué campaña vende qué producto. Muestra solo el total mientras
   tanto.
4. **Congela el costo en cada pedido.** Si el costo de origen era FALSO, corrígelo hacia atrás
   con respaldo previo («dejé respaldo antes») y avisa que el signo cambió.
5. **Entrevista por secciones**, dentro del propio bot: lo que más le duele, cómo decide, su
   operación, sus anuncios, cómo quiere usar el sistema. Lo que ya sabes por sus reportes se
   le confirma, no se le pregunta; al final solo pides los datos que faltan.
6. **Construye primero lo que ÉL pidió** (aquí, el reporte de novedades de las 8 p. m.).
7. **Mide el bot tras la primera prueba real**: costo por mensaje y por sesión de cliente;
   revisa que el caché del prompt no se reescriba en cada mensaje; elige el modelo según
   quién hace las cuentas (si las hace el código, un modelo barato alcanza); comprueba que los
   números del bot sean idénticos a los de la base; al entregar, compara el costo real con tu
   estimado y pon tope de gasto mensual a la llave.
8. **Pon fecha de cierre al piloto gratis**: paga con acceso a sus números, permiso de
   mostrar el caso y feedback sincero (ver [[TEMA-cobro-a-clientes]]).

## Cuándo NO aplica

- **Cobro por adelantado y casi sin devoluciones:** el evento de la plataforma ya es el
  resultado; no hace falta cruzar con entregas.
- **Cuando el proveedor sube el precio de verdad:** el costo congelado de los pedidos pasados
  NO se reescribe; solo se corrige hacia atrás un costo que era falso, y con respaldo.
- **Las cifras son de un solo vendedor y un mes:** sirven como ejemplo del método, no como
  referencia del sector. Los hallazgos de la entrevista tampoco se generalizan a otros.
- **Entrevista:** no con un cliente que no puede dar 15 minutos, ni cuando el dolor ya está
  escrito en un contrato o un ticket. No es una herramienta para vender.
- **Costo del bot:** no aplica a bots cuyos comandos no llaman al modelo (los reportes se arman
  sin IA y no gastan) ni a un volumen tan bajo que el tope mensual basta.
- El mapa campaña→producto es otro caso de [[TEMA-vocabulario-compartido-entre-piezas]]: si
  los nombres difieren, nada avisa; lo ideal es que el cliente use nombres iguales.

## Evidencia

- «555 compras, ROAS 3,97», «Se le cancela 1 de cada 5 pedidos antes de despachar» y «Esto
  cambia el plan para bien: tu amigo no tendría que anotar pedidos a mano en el bot.» —
  ventana [[2026-10-19-dropshipping-con-flujo-n8n|Dropshipping con flujo n8n]] (transcrito
  `00af789e`, 2026-10-21).
- «Este reporte trae el costo de devolución en cero» y «lo probé con sus archivos reales y
  cuadró» (misma ventana, 2026-10-21; en el resumen aparece como «Las 32 pruebas pasan. Ahora
  la prueba de verdad: cargo los tres archivos reales»).
- La corrección de costos y «dejé respaldo antes» (misma ventana, 2026-10-23; las citas con
  cifras del cliente se quedan en la ficha local de la ventana, no en este repo público); «Los nombres de las campañas no coinciden con los de los productos.»
  (2026-10-21); «El costo queda guardado en cada pedido.» (2026-10-20).
- «el punto de todo esto es solucionar un verdadero dolor [...] al final solo pides los datos
  que necesitas» (pedido del dueño), «[el bot de WhatsApp que ya usa] le gusta, así que no es un dolor» (resumida: sin la cifra
  del cliente), «Arranquemos por el reporte de novedades a las 8 pm» y «Su
  sesión completa costó US$1,74 en IA (119 llamadas).» (misma ventana, 2026-10-23).
- «cada mensaje costó unos US$0,028, porque el bot reescribía sus instrucciones en caché»,
  «salió con números idénticos a la base» (2026-10-20) y «Son unos 15 minutos y menos de un
  dólar.» (2026-10-23), misma ventana.

## Enlaces

- [[TEMA-cobro-a-clientes]] — el piloto gratis como forma de ingreso propio y cómo cobrar después.
- [[TEMA-modelos-y-costos]] — el criterio de modelo barato vs capaz que aquí se midió en un bot.
- [[TEMA-invariantes-contables]] — congelar el costo en cada pedido es el mismo principio.
- [[TEMA-vocabulario-compartido-entre-piezas]] — campañas y productos con nombres distintos.
- [[TEMA-caza-de-huecos-de-mercado]] — antes del piloto: cómo se evalúa que valga la pena.
