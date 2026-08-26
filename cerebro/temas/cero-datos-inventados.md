---
slug: cero-datos-inventados
titulo: "Qué se puede escribir como dato y qué es mentira verosímil"
alias: [datos, dato, poner datos, que datos, inventar, inventado, inventados, inventarme, no inventar, sin inventar nada, mentira, mentiras, verosimil, verosimiles, relleno, copy de relleno, rellenar, placeholder, placeholders, marcador, marcadores, hueco, huecos, hueco explicito, faltante, faltantes, falta el dato, dato falso, datos falsos, precio, precios, precio inventado, precios inventados, precios de ejemplo, precio de maniqui, maniqui, catalogo, catalogo de ejemplo, carta, menu, semilla, seed, demo, demos, datos demo, datos ficticios, ficticio, ficticios, maqueta, maquetas, mockup, prototipo, prototipos, ejemplo, ejemplos, muestra, pagina publica, pagina, publica, publico, publicar, publicacion, web publica, sitio publico, landing, landings, portada, vitrina, mostrador, cara al cliente, cliente final, testimonio, testimonios, resenas, opiniones, cifras, cifras sociales, anos de experiencia, numero de clientes, premios, horario, horarios, telefono, telefonos, whatsapp, direccion, direcciones, sede, sedes, ciudad, barrio, marca, marca real, nombre provisional, logo, stock, disponibilidad, agotado, promo, promos, cupon, cupones, codigo, descuento, descuentos, rebaja, rebajas, antes y ahora, foto, fotos, foto de stock, imagenes, seo, keywords, metadata, pronostico, prediccion, predicciones, auditar copy, revisar copy, se puede inventar, puedo inventar, que puedo publicar, autorizacion, autorizado, frontera, parquear, parquearlo, parqueado, aparcar, bloqueante, pendiente bloqueante, compuerta, compuerta de publicacion, declarado, placeholder declarado, sin declarar, cosmetico, cosmetica, identitario, identidad, afirmacion, afirmacion de hecho, cambia el comportamiento, umbral, umbrales, blocked, ready, sigo construyendo, puedo seguir, me falta el nombre, nombre pendiente, promesa comercial, compromiso comercial, incentivos, niveles, nivel]
preguntas: ["que datos puedo poner en una pagina publica", "puedo inventar precios para una demo", "¿qué pongo donde todavía no tengo el dato real?", "¿puedo poner un horario o un teléfono de ejemplo mientras el cliente me pasa el bueno?", "¿puedo poner testimonios o años de experiencia si no me los han dado?", "¿cómo marco lo que es de mentiras en una demo para que el cliente no crea que ya funciona?", "me falta el nombre de la marca, ¿paro o sigo construyendo?", "¿qué placeholder puedo dejar vivo mientras construyo y cuál no?", "¿un pendiente bloqueante alcanza para tapar un dato inventado?"]
proyectos: [landings, villa-broaster, infrapilot, orama, wrd, pollo-landing, placita]
confianza: alta
actualizado: 2026-08-24
---

# Qué se puede escribir como dato y qué es mentira verosímil

## Respuesta corta

En una página pública solo entra lo que puedas **citar con `archivo:línea`**. Lo que
falte se entrega como **hueco numerado y VISIBLE en el diseño**, nunca relleno con algo
que suene bien: *"verosímil es exactamente la forma que tiene una mentira útil"*
(`orion-landing.md:65`). **Sí puedes inventar precios para una demo**, con dos
condiciones: que el dueño lo **autorice a viva voz y con fecha**, y que lo ficticio quede
marcado **DOS veces** —en el encargo y **visible en la página entregada**, jamás en
`sr-only` ni `display:none`—. La autorización cubre **solo el catálogo**: teléfono,
dirección, ciudad, horario y nombres de personas siguen siendo hueco aunque todo lo demás
sea inventado. Y un placeholder tiene que ser **increíble, no creíble**: `573001234567`
sirve; "11:00 a.m. – 9:00 p.m." es una mentira que alguien va a creer.

**Hay una frontera para lo que sí puedes parquear mientras construyes**: lo que solo
**NOMBRA** (marca provisional, logo, dominio) se parquea con placeholder declarado más un
pendiente **bloqueante de publicación**; lo que **AFIRMA** un hecho, una cifra, o
cualquier dato que el código lea para calcular, **nunca** —ni declarado—.

## Por qué (qué lo pagó)

**Un modelo no miente: completa.** Por eso la prohibición declarada no funciona y hubo
que volverla procedimiento (`infrapilot/DEC-011`: *"una prohibición declarada no basta
para que un LLM no rellene huecos con verosimilitud"*). Tres facturas distintas lo
pagaron:

- **2026-08-10 · la ciudad que nunca existió.** Un builder haiku de Villa Broaster
  inventó la ciudad **"Rionegro"** en las keywords SEO del sitio. El trabajo técnico
  estaba bien; los datos de negocio, inventados. Detectarlo costó **leer 8 líneas de
  grep**; corregirlo, 2 edits. *"Barato de auditar, caro de no verlo."*
  (`villa-broaster/KN-008`).
- **2026-08-16 · el relleno sobrevive hasta producción.** Al investigar 8 proyectos de
  golpe apareció el mismo patrón tres veces: un horario inventado **confesado en un
  comentario del propio código**, un producto/precio que no existía en el catálogo real,
  y un testimonio completo inventado en el login de InfraPilot. Se guardó como
  conocimiento **Permanent**: *"copy de relleno que un asistente escribe para que la
  pantalla no se vea coja se convierte en una afirmación falsa del negocio"*
  (`infrapilot/KN-033`).
- **Hoy, 8 días después de marcarlo: sigue vivo.** `infrapilot/PEND-018` se abrió el
  2026-08-16 para quitar ese testimonio. A 2026-08-24 sigue en el archivo:
  `ORION/infrapilot-app/app/(auth)/login/page.tsx:104-105` dice **"Carlos Quispe · Jefe
  de Presupuestos · Lima, Perú"**, y la línea `:14` promete *"APUs con precios CAPECO
  actualizados"*. **Ese es el argumento entero**: escribirlo cuesta un segundo, sacarlo
  lleva más de una semana y mientras tanto está publicado (`infrapilot/KN-003`: la app
  *"is already deployed on Vercel and reachable outside this machine"*). La frontera de
  abajo explica por qué ese dato **nunca tuvo derecho a parquearse**.

Y hay una razón que no es reputacional sino **operativa**: en una vitrina viva, un dato
falso es una promesa que alguien reclama. Un horario falso **manda gente a un local
cerrado**; un cupón publicado *"es una promesa que alguien reclama en el mostrador
mañana"*; un "antes/ahora" inventado hace que el carrito prometa menos de lo que la orden
confirma, porque el servidor congela el precio del catálogo y no sabe de descuentos
(`villa-broaster/KN-009`, `villa-app/lib/promos.ts:14-24`).

## La frontera: qué se puede parquear mientras construyes, y qué no

Dos reglas de la casa parecían decir lo contrario, y mientras la frontera estuvo
implícita **cada ejecutor elegía la que le convenía**: *"todo dato de relleno nace
marcado y bloqueante, o no nace"* (`infrapilot/KN-033`) contra *"lo que solo el dueño
puede decidir no bloquea el build: placeholder DECLARADO más pendiente bloqueante"*
(`pollo-landing/DEC-001`). **No son rivales: son los dos lados de una misma frontera.**

**La pregunta que decide: ¿el dato NOMBRA algo, o AFIRMA algo?**

**Lado A — se puede parquear (cosmético o identitario).** Un dato que solo pone etiqueta
y que ningún código lee para calcular ni decidir: nombre provisional de marca, logo,
dominio, la URL de contacto. Tres condiciones, las tres o ninguna: **(1)** declarado como
placeholder en la memoria del proyecto; **(2)** increíble a la vista (`573001234567`, no
un teléfono plausible); **(3)** con un pendiente que **bloquea la publicación**, no el
build.
· *Caso real:* pollo-landing lleva **16 días** construyendo con **"Avícola Buenavista"**
en `pollo-landing/index.html:6` (el `<title>`), `:238` (el nav) y `:567` (el pie), y no ha
lastimado a nadie: `pollo-landing/DEC-001` lo declaró PLACEHOLDER y
`pollo-landing/PEND-001` está en **Blocked** exactamente sobre *"publicar la landing en
internet… nombre real (hoy placeholder 'Avicola Buenavista'), WhatsApp real, dominio"*.
El placeholder **no frenó tres sesiones de trabajo**; frenó lo único que tenía que frenar.

**Lado B — nunca se parquea (afirmación de hecho, cifra, o dato que cambia el
comportamiento).** Aquí no existe la versión "declarada" que lo salve: si el dato entra,
o ya está mintiendo, o ya está calculando. Tres formas, verificadas en disco hoy:

- **Afirmación de hecho** — el testimonio de InfraPilot.
  `ORION/infrapilot-app/app/(auth)/login/page.tsx:97` pone en boca de alguien *"Lo que
  antes me tomaba 3 días, ahora lo tengo en 4 minutos. Y con precios reales del mercado."*,
  firmado **Carlos Quispe · Jefe de Presupuestos · Lima, Perú** (`:104-105`); y `:14`
  promete *"APUs con precios CAPECO actualizados"*, el mismo texto **duplicado** en
  `register/page.tsx:15`. Un tercero puede desmentirlo con una llamada.
- **Cifra que cambia el número** — la tabla de impuestos quemada en
  `ORION/infrapilot-app/lib/utils.ts:21-26`: `COP → 0.19`, `PEN → 0.18`, `MXN → 0.16` y un
  `default: 0.18` para **cualquier moneda que no esté en la lista**. `infrapilot/KN-008`
  la declara intencional y correcta para las 3 monedas de hoy, y por eso mismo sirve de
  molde: un valor así **no se ve nunca** —el presupuesto suma bien y cobra mal—, así que
  ningún número que el código lea puede entrar "provisionalmente".
- **Promesa comercial** — los cuatro niveles de incentivos de pollo-landing
  (`pollo-landing/index.html:607-612`) los **redactó el asistente**, no el dueño. Ese
  mismo proyecto que parqueó su marca **no parqueó esto**: los aisló en un objeto único
  con nombre (`PROMOS`) y abrió `pollo-landing/PEND-003` porque *"los incentivos mostrados
  en pantalla son un compromiso comercial; solo el dueno conoce margenes y capacidad
  real"* (`pollo-landing/DEC-002`). Con razón: `index.html:682` guarda el texto prometido
  **dentro del registro de cada cliente**, así que un nivel inventado queda archivado con
  nombre y teléfono de a quién se le prometió.

**El mismo archivo aplica las dos reglas.** En `pollo-landing/index.html` conviven la
marca parqueada (lado A, línea 6) y la promesa bloqueada (lado B, línea 607) a 600 líneas
de distancia. Esa es la prueba de que no había contradicción: había frontera sin escribir.

**Test de 5 segundos, en este orden:**

1. ¿Un tercero podría **desmentirlo**? (alguien dijo esto, cuesta X, abrimos a tal hora,
   llevamos N años, N clientes confían) → **lado B**.
2. ¿Algún código lo **lee para calcular o decidir**? (tasa, umbral, precio, stock, regla
   de negocio) → **lado B**.
3. ¿Solo **nombra** algo que el dueño todavía no bautizó, y ninguna cuenta cambia si el
   nombre cambia? → **lado A**, con las tres condiciones.
4. ¿Dudas? → **lado B**. El costo es asimétrico: parquear de más cuesta una línea de
   trabajo; parquear de menos cuesta **ocho días de testimonio falso desplegado**.

**Y el detalle del que depende que la frontera sirva: el ESTADO del pendiente.**
`pollo-landing/PEND-001` está en **Blocked** y protegió: es una **compuerta**.
`infrapilot/PEND-018` está en **Ready** desde el 2026-08-16 y no protegió nada, porque un
Ready es *trabajo que espera turno* y el dato **ya estaba desplegado** cuando se abrió.
De ahí la regla que cierra la frontera: **un dato del lado B que ya está publicado no se
parquea con un pendiente, se borra hoy**; el pendiente bloqueante solo sirve **antes** de
la primera publicación.

## Cómo se aplica

1. **Clasifica cada dato en tres cubos antes de escribir una línea.**
   **(a) REAL** — existe y lo citas `archivo:línea`. **(b) EJEMPLO/PROTOTIPO** — existe en
   el código y el código mismo declara que no es real; se puede pintar, pero **con sello**.
   **(c) HUECO** — no existe en ninguna fuente; **esa parte no se publica**.
2. **Grep antes de afirmar.** Prohibido escribir el encargo antes de leer las fuentes
   reales (brief, README, catálogo, código). *"Un prompt sin orígenes es un prompt que
   inventa"* (`orion-landing.md:50-55`).
3. **Lo de ejemplo se pinta declarándose.** Los 23 productos de Villa Broaster se usan
   como **maniquí** porque el propio código dice de sí mismo *"NO son los precios de este
   negocio"* (`broaster-app/lib/servidor/almacen-disco.ts:360-366`); en el diseño van con
   **un sello EJEMPLO por precio más una cinta al pie de la carta**. Igual las promos:
   *"DATOS ESTÁTICOS DEL PROTOTIPO… cuando existan de verdad, este archivo se borra"*
   (`villa-app/lib/promos.ts:2-7`) → sello PROTOTIPO sobre los códigos `VB-*`.
4. **Los huecos se numeran y se DIBUJAN.** Apartado fijo **"9. HUECOS DEL DUEÑO"** en seis
   prompts de la casa. En Villa Broaster v3 son **H-1 … H-12**, cada uno con **sitio
   asignado en la pantalla** (ticket de papel crema clavado, el dato como `__`, la
   coletilla "lo confirma el dueño"), porque *en el intento anterior la palabra "hueco"
   apareció **cero veces** en todo el HTML entregado*.
5. **Cero cifras sociales.** Años de experiencia, número de clientes, kilos vendidos,
   testimonios, premios, "más de X familias confían": si no está en las fuentes, **no
   existe**. Si el negocio lo necesita para vender, se pide como hueco
   (`orion-landing.md:61-65`).
6. **Prohibido rellenar una descripción.** Si un producto no trae texto en el catálogo,
   la fila va **sin segunda línea**. Inventar *"crujiente por fuera, jugosa por dentro"*
   **es inventar carta** igual que inventar un producto (v3 §1).
7. **Marca real ≠ nombre provisional, y se dice en voz alta.** "Villa Broaster" es cliente
   real; **"Avícola Buenavista" es PLACEHOLDER** hasta que el dueño defina el nombre
   (`pollo-landing/DEC-001`, `landings/KN-001`). Presentar el provisional como definitivo
   ya es inventar.
8. **El placeholder tiene que ser increíble, y llevar su aviso al lado.** El modelo bueno
   es `wrd/data.js:22-23`: `whatsapp: "573001234567"` y `sitioUrl: "https://wrd.example.com"`,
   cada uno con su comentario `← CAMBIÁ ESTO`. El modelo malo es un horario plausible
   (`marca.ts:40, :48`) o una demora plausible (`marca.ts:31`), que nadie detecta leyendo.
9. **Si la UI promete un número, el servidor tiene que poder honrar exactamente ese
   número** (`villa-broaster/KN-009`). Es el mismo criterio dicho en ingeniería.
10. **Audita el copy público de los builders baratos.** Cuando un modelo trivial-tier toca
    metadata, keywords o descripciones, revisa su salida **contra el archivo de datos del
    dominio** — solo hechos que existan ahí (`villa-broaster/KN-008`).

## Cuándo NO aplica

- **Demo comercial con autorización explícita del dueño: ahí SÍ se inventa, y completo.**
  El 2026-08-21, para la demo de Orama, el dueño autorizó inventar casas, precios,
  ubicaciones y fotos. Ese contenido **no se entrega como hueco: se especifica concreto,
  porque una demo con huecos no vende** (`landings/POL-002`). La autorización no borra el
  riesgo, lo **desplaza**: deja de ser "el dueño se entera tarde" y pasa a ser "el CLIENTE
  FINAL cree que ya subimos su inventario". De ahí las **dos marcas**: `⚠️ [DATOS DEMO — …
  FICTICIOS, inventados con autorización explícita del dueño el 2026-08-21]` encabezando
  la sección del encargo, y en la página `Demo · sin funcionalidad real` al pie de **cada
  pantalla** más la cinta *"Precios y direcciones ficticios"* al pie del listado
  (`orama-demo.md:17, 45, 48`).
- **La contradicción, documentada y no fusionada.** Villa Broaster y Orama tratan lo
  opuesto el mismo objeto (un catálogo que no es real):
  · **Orama** — el catálogo ficticio **se inventa entero y se ve normal** (con marca de
  demo). Detrás **no hay nada**: sin backend, "Entrar" entra con cualquier cosa, WhatsApp
  abre un aviso (`orama-demo.md:16`).
  · **Villa Broaster** — la semilla de 23 productos **se pinta con sello por precio y la
  carta real no se publica hasta que llegue**, porque *"la vitrina lee precios en vivo: el
  día de publicar mostraría precios de maniquí con el nombre del cliente encima"* (v3, H-1).
  **La condición de negocio que decide** no es el rubro ni la estética: es si **detrás de
  la pantalla hay un sistema que va a cumplir el dato**. Página muerta que vende una idea →
  invéntalo y márcalo. Página viva conectada a un sistema → séllalo o no lo publiques.
- **Los datos semilla dentro de la app no son mentira.** Que `data/seed/productos.json`
  traiga una carta coherente para que la app arranque es una decisión de diseño explícita y
  reversible (`almacen-disco.ts:360-366`). La regla muerde cuando ese dato **cruza a una
  superficie que mira un tercero**.
- **También cuenta como dato inventado una PREDICCIÓN sin historia.** El pronóstico de
  tanda de Villa Broaster se corrió a la Etapa 4 aunque es la función de mayor retorno:
  necesita 2–3 meses de ventas y sobrantes reales, y *"una predicción inventada en el punto
  que más le importa al dueño destruye la confianza en todo el sistema"*
  (`villa-broaster/KN-003`).
- **Cuando no hay página pública, no hay problema que resolver.** Placita eliminó su
  catálogo público completo el 2026-08-20 (`placita/DEC-017`, commit `8705f06`): el dominio
  aloja solo el sistema.

## Huecos de este tema (lo que el corpus NO respalda)

- **No hay nada legal.** Cero objetos sobre publicidad engañosa, SIC, habeas data o
  requisitos de precio al consumidor en Colombia. Todo lo de arriba está sostenido por
  criterio comercial y por fallos propios, **no por norma**. Si alguien necesita el ángulo
  legal, esto no se lo da.
- **La demo de Orama no tiene veredicto.** `landings/PEND-002` sigue abierto: falta saber
  **si el catálogo ficticio se leyó como ficticio o hubo que aclararlo** en la reunión con
  el cliente. O sea: la política de las dos marcas es **razonada, no comprobada en campo**.
- **Una cita de `infrapilot/KN-033` ya no se puede abrir**: el horario inventado que se
  confesaba en `mercaplaza pie.tsx:8-14` desapareció con el borrado del catálogo público de
  Placita (`placita/DEC-017` eliminó `components/landing/`, 16 archivos). Las otras dos
  patas de ese hallazgo sí siguen verificables.

## Evidencia

- `landings/KN-001` — marca real vs `[PLACEHOLDER]`; *"lo que no se puede citar se entrega
  como HUECO EXPLICITO… nunca se rellena con algo verosimil"*.
- `landings/POL-002` — datos demo autorizados ≠ huecos; se marcan **dos veces**; la
  frontera (catálogo autorizado / contacto sigue hueco).
- `infrapilot/KN-033` (tier **Permanent**) — el copy de relleno llega a producción.
- `infrapilot/PEND-018` (**Ready** desde 2026-08-16) +
  `ORION/infrapilot-app/app/(auth)/login/page.tsx:14, 97, 104-105` y
  `register/page.tsx:15` — el testimonio inventado y la afirmación duplicada, verificados
  en disco a 2026-08-24.
- `infrapilot/KN-003` — *"is already deployed on Vercel and reachable outside this
  machine"*: ese testimonio no está en un borrador local.
- `infrapilot/KN-008` + `ORION/infrapilot-app/lib/utils.ts:21-26` — la tabla de impuestos
  quemada (`default: 0.18`): el molde del dato que **cambia el número y nadie ve**.
- `pollo-landing/PEND-001` (**Blocked**) + `pollo-landing/index.html:6, :238, :567` — la
  compuerta de publicación que **sí** funcionó: 16 días de marca provisional viva sin daño.
- `pollo-landing/DEC-002` + `pollo-landing/PEND-003` +
  `pollo-landing/index.html:607-612, :682` — los 4 niveles `PROMOS` los escribió el
  asistente; la promesa queda guardada dentro del registro de cada cliente.
- `infrapilot/DEC-011` — "sin inventar nada" convertido en procedimiento verificable.
- `villa-broaster/KN-008` — la ciudad "Rionegro" inventada en keywords SEO por un builder
  haiku (2026-08-10).
- `villa-broaster/KN-009` + `villa-app/lib/promos.ts:2-7, :14-24` — promos venden
  curaduría, no rebajas inventadas.
- `villa-broaster/KN-003` — una predicción sin historia es un dato inventado.
- `villa-broaster/PEND-003` (Blocked) — la lista real de lo que falta del cliente:
  10 productos más vendidos, teléfonos/horarios, carta y precios por local, logo, fotos.
- `ORION/prompts-landing/villa-app-villa-broaster-v3.md:992-1020` — la tabla **H-1 … H-12**
  con su sitio dibujado en pantalla.
- `broaster-app/lib/servidor/almacen-disco.ts:360-366` — *"NO son los precios de este
  negocio"*, verificado en disco 2026-08-24.
- `villa-app/lib/marca.ts:31` — *"hoy nadie la calcula, la dice el dueño"* (la demora es
  del prototipo).
- `ORION/prompts-landing/orama-demo.md:16-17, 43-53` — §1.B "lo que es DEMO" y §1.C "lo que
  NO se inventa".
- `~/.claude/agents/orion-landing.md:46-71` — los 6 puntos de "sin inventar nada",
  incluida la frase de la línea 65.
- `fable 5/wrd/data.js:22-23` + `wrd/PEND-001` — el placeholder bien hecho: increíble y
  comentado.
- `pollo-landing/DEC-001` — *"Marca 'Avicola Buenavista' es PLACEHOLDER hasta que el dueño
  defina nombre real"*.
- Apartado **"9. HUECOS DEL DUEÑO"** presente en `arroces-super-arroz-del-norte.md:354`,
  `estanco-contable.md:343`, `wrd.md:382`, `placita-mercaplaza-v2.md:655`,
  `infrapilot.md:373` y `villa-app-villa-broaster-v3.md:992`.

## Enlaces

- [[TEMA-generadores-de-diseno]] — el encargo donde esta regla se ejecuta: todo dato con
  origen, lo de ejemplo marcado dentro del diseño, lo que falta como hueco numerado.
- [[TEMA-verificar-con-evidencia]] — cómo se comprueba en pantalla que el sello y la cinta
  de "EJEMPLO" de verdad se ven (capturas 390×844 por CDP, no de memoria).
- [[TEMA-invariantes-contables]] — el mismo principio del lado del dinero: se congela en el
  documento lo que se cobró, y la UI no promete un número que el servidor no honre.
- [[TEMA-documentos-para-personas]] — cuando el entregable es un documento y no una página,
  el hueco también va visible y con nombre de quien lo llena.
