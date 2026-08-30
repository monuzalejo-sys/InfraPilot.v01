---
slug: invertir-formulas-redondeadas
titulo: "Invertir una fórmula que redondea: no hay un número, hay una ventana"
alias: [inversa, funcion inversa, funciones inversas, invertir, invertir una formula, invertir una funcion, invertir el calculo, camino de vuelta, viaje redondo, ida y vuelta, round trip, roundtrip, preimagen, biyectiva, biyeccion, no es biyectiva, inyectiva, no es inyectiva, ventana, ventana de valores, ventana de soluciones, varias soluciones, multiples soluciones, redondeo, redondear, redondeado, truncar, truncamiento, division no basta, dividir no basta, no basta con dividir, despejar, despejar la formula, despejar el precio, precio de compra desde el precio de venta, precio de venta al reves, calcular hacia atras, calcular al reves, de atras para adelante, recalcular desde el total, precio con margen, margen, margen de ganancia, margen bruto, quitar el iva, iva incluido, precio sin iva, quitar el descuento, descuento inverso, conversion de unidades, redondeo de moneda, monedas fisicas, multiplo mas cercano, multiplo de 50, candidato, proponer y verificar, propone y comprueba, barrer vecinos, vecino mas cercano, buscar el vecino, empate, desempate, tie break, lanzar si no existe, throw si no existe, no existe solucion, ventana vacia, test exhaustivo, prueba exhaustiva, fuzz test]
preguntas: ["como calculo el precio de compra si solo tengo el precio de venta y el margen", "por que mi funcion inversa no me devuelve el mismo numero que entro", "dividir para sacar el precio de compra no me cuadra con lo que cobra la caja", "como invierto una formula que redondea", "el cartel dice un precio y la caja cobra otro, por que pasa eso", "hay varias compras que dan el mismo precio de venta, cual elijo", "como pruebo que una funcion inversa siempre cuadra", "necesito la formula al reves de algo que redondea, como la escribo"]
proyectos: [placita]
confianza: alta
actualizado: 2026-08-29
---

# Invertir una fórmula que redondea: no hay un número, hay una ventana

## Respuesta corta

Si `f` redondea o trunca, su inversa **no es una cuenta** (`x = y / k`): es una
**búsqueda con verificación**. Propón un candidato (el despeje algebraico,
redondeado a entero), **comprueba el viaje redondo** (`f(candidato) ===
objetivo`) y solo entonces devuélvelo. Si no cuadra, **barre los enteros
vecinos** del candidato hasta un tope calculado (el ancho del redondeo entre el
movimiento mínimo garantizado de un paso), y desempata siempre hacia el lado
que protege la intención de quien pidió la regla. Si ningún entero cumple la
garantía, **lanza** — nunca devuelvas un número que la propia función directa
va a contradecir delante del cliente. Pruébalo recorriendo **todos** los
valores de salida posibles, no una muestra de casos sueltos.

## Por qué (qué lo pagó)

**Lo pagó un dueño que dictó su catálogo al revés de como calcula el sistema.**
La placita calculaba el precio de venta desde la compra: `precioVentaDesde`
multiplica por el margen y redondea al múltiplo de $50 más cercano, "porque no
circulan monedas de $10 ni $20 con las que cuadrar un cartel"
(`lib/dominio/precios.ts:9-11`). Pero al dictar su catálogo real de 111
productos, el dueño no dio la compra: dio el **precio del cartel** (lo que
cobra) y dejó la compra como "Precio ?" (`placita/DEC-027`). Alguien tenía que
despejar la compra a partir de la venta, y la tentación obvia —dividir entre
`1 + margen/100`— se rompe exactamente donde el redondeo existe a propósito:
*"lo inverso de un redondeo no es un número sino una VENTANA: muchas compras
distintas dan la misma venta (con la ley del 80% hay 27 enteros por cada
precio de cartel). Dividir da un candidato excelente, no una certeza"*
(`lib/dominio/precios.ts:131-140`). La garantía que de verdad importaba la
escribió el propio código como su razón de ser: *"el dueño teclea el precio
del CARTEL... y `precioVentaDesde` tiene que devolver EXACTAMENTE el número
que él escribió. Si el cartel dice \$7.500, la caja cobra \$7.500, no
\$7.450"* (`:126-129`). Cobrar de más o de menos que el cartel, delante del
cliente, es el costo real de asumir que dividir alcanza.

**La solución fue proponer, comprobar, barrer y, si hace falta, rendirse con
honestidad.** `precioCompraPara` calcula el candidato por división, lo verifica
llamando a `precioVentaDesde` sobre él mismo, y si no coincide recorre los
enteros vecinos (±1, ±2… hasta `TOPE_AJUSTE_COMPRA_COP`, medio ancho del
redondeo) devolviendo el primero que sí cumple; entre dos igual de cerca
prefiere el **menor**, porque *"una compra más baja deja el margen efectivo del
lado que el dueño pidió (ganando un pelo de más, nunca de menos que la
ley)"* (`lib/dominio/precios.ts:142-146`). Cuando ningún entero cumple la
garantía —solo pasa con márgenes disparatados, por encima de ~4.900%, donde un
peso de compra mueve la venta más de \$50 y la ventana puede quedar vacía—
la función **lanza** en vez de devolver un número que la caja luego
contradiría (`:153-158`, `:180-182`). Y la garantía no quedó en la cabeza de
nadie: un test recorre los **2.000 múltiplos de $50 entre $50 y $100.000** y
comprueba `precioVentaDesde(precioCompraPara(v, m), m) === v` en todos,
además de los 108 precios reales que el dueño dictó, uno por uno
(`lib/dominio/precios.test.ts:131-161`). El propio proyecto lo generalizó por
escrito: *"Aplica a cualquier función inversa de una operación con redondeo o
truncamiento: nunca asumir que existe una única preimagen"* (`placita/KN-053`).

## Cómo se aplica

1. **Reconoce el síntoma antes de escribir código.** Tienes `f(x) =
   redondear(g(x))` y necesitas `x` a partir de `f(x)`. Un despeje algebraico
   directo de `g` da un candidato, nunca una garantía: `redondear` no es
   inyectiva, así que `f` tampoco lo es.
2. **Escribe la garantía como una ecuación, antes que el código.**
   `f(inversa(y)) === y` para todo `y` válido. Es la única frase que de verdad
   importa de la función, y tiene que poder decirse así de corta.
3. **Implementa propone-y-verifica, nunca propone-y-confía.** El candidato es
   el despeje algebraico redondeado a entero. Antes de devolverlo, llama a `f`
   con ese candidato y compáralo contra el objetivo.
4. **Si no cuadra, barre los enteros vecinos hasta un tope calculado, no
   arbitrario.** El tope tiene que cubrir el ANCHO del redondeo dividido entre
   el movimiento mínimo garantizado que un paso de `x` provoca en `f(x)`. En la
   placita el redondeo es de \$50 y cada peso de compra mueve la venta \$1 o
   más (el margen nunca es negativo): medio ancho (\$25 a cada lado) basta para
   cubrir toda la ventana de soluciones.
5. **Desempata siempre hacia el mismo lado, y que ese lado proteja la
   intención original.** Entre dos vecinos igual de cerca, la placita prefiere
   el menor: nunca deja que el margen efectivo caiga por debajo de lo
   prometido. El desempate también es lo que hace la función determinista.
6. **Si el barrido entero no encuentra nada, lanza.** No hay una respuesta
   honesta que devolver — devolver la del candidato sin verificar sería un
   número con apariencia de correcto que la función directa va a desmentir.
7. **Prueba exhaustivamente, no con una muestra.** Recorre TODOS los valores de
   salida posibles dentro de un rango realista y verifica el viaje redondo en
   cada uno. Un puñado de casos sueltos no habría encontrado dónde la ventana
   se hace más ancha que el tope de búsqueda.
8. **Documenta la garantía Y por qué no bastaba con dividir, junto a la
   función.** Es lo que impide que el siguiente que la toque la "simplifique"
   de vuelta a una división que se ve más corta y está rota.

## Cuándo NO aplica

- **Si `g` no es monótona**, barrer solo los vecinos del candidato de la
  división no basta: una unidad más de entrada no siempre mueve la salida en
  la misma dirección, así que la ventana de soluciones válidas puede no estar
  concentrada alrededor de la división. Hace falta razonar sobre el dominio
  completo o acotarlo con otra estructura, no un barrido lineal.
- **Si el movimiento mínimo garantizado de un paso de entrada puede ser MENOR
  que el ancho del redondeo** (por ejemplo, si el margen pudiera ser negativo
  en este caso concreto), el tope calculado en el paso 4 se queda corto:
  hay que ampliarlo o replantear qué garantía es alcanzable.
- **Si el negocio tolera una pequeña discrepancia** entre lo que promete la
  pantalla y lo que cobra la caja, la búsqueda exhaustiva es trabajo de más —
  un redondeo simple del candidato basta, pero esa tolerancia se documenta
  explícitamente en vez de asumirla en silencio. Aquí no aplicaba: el cartel es
  una promesa exacta al peso.
- **El problema no se arregla quitándole el redondeo a la función directa.**
  El redondeo existe por una razón de negocio real (no circulan monedas de
  \$10 ni \$20); la solución vive en la inversa, nunca en relajar la ida.

## Evidencia

- `placita/KN-053` (Knowledge, Project, High) — la lección general tal como la
  dejó escrita el propio proyecto, incluida la generalización explícita a
  "cualquier función inversa de una operación con redondeo o truncamiento".
- `placita/DEC-027` — el contexto de negocio que forzó construir la inversa:
  el dueño dictó el precio de venta y dejó la compra en blanco.
- `placita/DEC-026` — `MARGEN_LEY_PCT = 80`, la ley sobre la que corren los
  ejemplos y los tests.
- Código (commit `003e84b`, rama `master`,
  `C:\Users\Kalel\prommter\proyectos\placita`):
  - `lib/dominio/precios.ts:9-11` — por qué `precioVentaDesde` redondea a $50.
  - `lib/dominio/precios.ts:91-108` — `precioVentaDesde`, la dirección directa.
  - `lib/dominio/precios.ts:110-183` — `precioCompraPara` completa:
    `TOPE_AJUSTE_COMPRA_COP` (`:118`), la garantía documentada con la cifra de
    "27 enteros por cada precio de cartel" (`:131-140`), el desempate hacia el
    menor (`:142-146`), y el `throw` cuando no existe solución (`:153-158`,
    `:180-182`).
  - `lib/dominio/precios.test.ts:131-140` — test exhaustivo: los 2.000
    múltiplos de $50 entre $50 y $100.000.
  - `lib/dominio/precios.test.ts:142-161` — los precios reales dictados por el
    dueño, verificados uno a uno.
  - `lib/dominio/precios.test.ts:163-178` — el viaje redondo también cuadra
    con otros márgenes (0, 30, 100), no solo con la ley del 80%.
  - `lib/dominio/precios.test.ts:193-197` — lanza cuando no existe compra
    posible, en vez de mentir.
- Commit `003e84b` ("El catalogo de verdad: 111 productos con su codigo, su
  precio, y el 80% como ley") — mensaje completo: *"676 tests (16 nuevos del
  catálogo, 8 de la fórmula)... Viaje redondo exacto en los 108 con precio."*

## Enlaces

- [[TEMA-donde-vive-el-dato]] — por qué el catálogo guarda el precio de VENTA
  (el hecho que el dueño conoce) y no la compra ya calculada; esta función es
  la que reconstruye ese derivado bajo demanda, sin persistirlo.
- [[TEMA-invariantes-contables]] — el redondeo de dinero del lado directo (un
  solo redondeo, al final, nunca línea por línea); este tema es el caso en que
  además hay que deshacerlo.
