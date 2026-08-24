---
slug: generadores-de-diseno
titulo: Cómo se le encarga trabajo a un generador de diseño (Claude Design y equivalentes)
alias: [claude design, generador, generador de diseno, generadores, disenador ia, diseñador ia, v0, lovable, figma make, figma, bolt, landing, vitrina, portada, artboard, artboards, lienzo, lienzo de artboards, maqueta, mockup, dc.html, dc html, support.js, encargo de diseno, prompt de diseno, prompt de landing, brief de diseno, design system, ds, _ds, ds ajeno, sistema de diseno, modernist, organic, tokens, token, styles.css, theme.json, manifest, adherence, oxlint, linter, linter de adherencia, armadura, armadura contra el medio, prohibicion, prohibiciones, capitulo prohibido, lista blanca, lista negra, contra-defaults, defaults del medio, sesgo del medio, relleno, ocupar el hueco, hueco de design system, paleta, paleta cambiada, me cambio la paleta, me cambio los colores, no respeto la paleta, no uso mis colores, fondo claro, fondo crema, portada clara, luminancia, contraste, wcag, ratio, radio, radios, radius, blanco y negro, grayscale, desaturada, tipografia, tipografias, fuente, fuentes, familia, familias, google fonts, link de fuentes, woff2, system-ui, letra por defecto, se ve generico, se ve apagado, se ve generico y apagado, generico, generica, apagado, apagada, diseno generico, diseno apagado, quedo generico, quedo apagado, me quedo generico, me quedo apagado, el diseno me quedo generico, generico y apagado, soso, aburrido, movimiento, animacion, animaciones, coreografia, getanimations, keyframes, transition, movimiento congelado, estado congelado, en reposo, gesto, hover, spotlight, carrusel, no se movio nada, no tiene animaciones, revisar entregable, revisar la entrega, como reviso, verificar entregable, grep miente, bindings, llaves dobles, precio literal, medir sobre el dom, dom pintado, pixeles, captura, cdp, edge-cdp, bitacora, bitacora de entregas, registro por herramienta, veredicto, veredicto por canal, rechazo, me lo rechazaron, regenerar, editar la salida, el prompt murio, export original, plantilla, boilerplate, heredar, referencias, fichas, mecanismo, imagenes generadas, chatgpt, galeria, assets, fotos, canal alfa, alfa, sin alfa, recorte, sello ejemplo, huecos numerados, registro, audiencia, quien mira, kit]
preguntas: ["¿qué le doy a Claude Design para que haga webs de más calidad?", "¿por qué el diseño que me devolvió se ve genérico y apagado?", "¿cómo evito que me cambie la paleta?", "¿por qué no se movió nada de lo que pedí?", "¿cómo hago un prompt de landing que no falle?", "¿cómo reviso lo que me devolvió el generador?", "le voy a pedir una landing a claude design, ¿qué le pongo en el prompt?", "¿por qué me devolvió todo crema si le dije que la portada era oscura?", "ya me entregaron el zip, ¿le pido los cambios al prompt o edito el archivo?", "¿por qué el cuerpo del texto salió con la letra del sistema?", "¿puedo reusar la plantilla de otro proyecto para esta página?"]
proyectos: [landings, villa-broaster, orama, placita]
confianza: alta
actualizado: 2026-08-24
---

# Cómo se le encarga trabajo a un generador de diseño

## Respuesta corta

Un generador de diseño no es un diseñador con criterio: es un ejecutor con
**huecos que se llenan solos si tú no los llenas**. Cuatro reglas, en este orden.
**(1) Prohibir no basta: hay que prohibir Y RELLENAR.** El medio ancla un design
system propio *siempre* —medido en 2 de 2 entregas de proyectos distintos— y
prohibírselo en prosa deja el hueco vacío, que se vuelve a llenar solo; la
contramedida es entregarle el tuyo en el formato que él ya consume (`_ds/`).
**(2) Escribe para un lienzo quieto**: devuelve láminas estáticas, así que todo
lo que describas como movimiento hay que describirlo además en su **estado
congelado**; la coreografía real va en un anexo aparte, dirigida al programador.
**(3) Dale materia prima medida, no adjetivos**: hex, píxeles, el `<link>`
literal de las fuentes y las fotos reales; lo que dejes en adjetivos ("moderno",
"llamativo") lo resuelve con su promedio, y su promedio es exactamente lo
genérico que vas a rechazar. **(4) La revisión se mide sobre el DOM pintado y
sobre los píxeles, nunca grepeando el archivo entregado** — el `.dc.html` es un
lienzo con bindings y **miente por un factor de 16**.

## Por qué (qué lo pagó)

**Lo pagó una landing rechazada.** El 2026-08-23 se ejecutó en Claude Design el
prompt v2 de la vitrina de Villa Broaster —bien investigado, con datos reales y
orígenes `archivo:línea`— y el dueño lo rechazó en móvil: *"todo se ve muy
genérico, apagado; quiero mejor fondo, animaciones más vivas"*
(`landings/KN-009`). Al abrir el entregable aparecieron las causas, todas
medibles y todas **reproducidas de nuevo el 2026-08-24** sobre el mismo archivo:

- El zip traía una carpeta `_ds/modernist-<uuid>/` que **el generador se
  autoimpuso**: `--color-bg #f3f2f2`, `--color-accent #ec3013`, los tres radios
  en `0px`, tipografía Archivo, y órdenes explícitas *"Do not round a corner
  anywhere"* y *"Print photographs in black and white with the `.grayscale`
  wrapper"*. Nuestra dirección era oscura y cálida. Medido sobre el HTML
  entregado: `--brasa` aparece **0 veces**, `#f7ece1` (el crema) **57**,
  `#0a0a0a` (el negro del proyecto) **11**.
- **El design system ajeno no era una sugerencia: traía su propia policía.**
  Junto al `readme.md` viene un `_adherence.oxlintrc.json` cuyas reglas
  literales son *"Raw hex color — use a design-system color token via var()"*,
  *"Raw px value — use a design-system spacing token via var()"* y *"Font not
  provided by the design system. Available: Archivo."* Es decir: **los hex que tu
  prompt le entrega quedan tipificados como infracción** por el propio manual que
  él se escribió. Por eso una dirección de arte en prosa pierde: no compite
  contra un gusto, compite contra un linter.
- `document.getAnimations()` devolvió **1** en toda la página, pese a que el HTML
  **sí** trae **11 bloques `@keyframes`** y **26 `transition`**. El inventario de
  diez animaciones del prompt no se vio nunca: el medio no anima, compone. **El
  trabajo de movimiento se hizo y no se vio.**
- **La tipografía se la eligió él solo.** El prompt v2 no incluía ni una línea
  `fonts.googleapis` (0 apariciones); el entregable pidió **una sola familia**
  (`css2?family=Anton`) y de sus **32** declaraciones `font-family`, **25 son
  `inherit`** colgando de un único `system-ui, -apple-system, 'Segoe UI', Roboto`.
  O sea: **la mitad de lo que el dueño llamó "genérico" es literalmente la letra
  por defecto del sistema operativo.**

De los tres mecanismos que se le pidieron, uno **no se ejecutó**, otro quedó
**invisible** (dependía de un gesto) y solo sobrevivió el que **se ve quieto en
una captura**: el "dato grande + línea".

**Y lo pagó, del otro lado, un éxito que casi nos enseña la lección equivocada.**
La demo de Orama salió del **mismo medio, la misma semana** —el `support.js` de
las dos entregas es **byte a byte el mismo archivo** (69.150 B, md5
`951ae391b8ae72ef12e671c2fad23353`)— y también trajo su `_ds/` impuesta
(`organic-<uuid>`, 48 tokens, `--color-bg #f5ead8`, `--color-accent #c67139`,
Caprasimo + Figtree, `--radius-md 16px`). Y sin embargo **la marca sobrevivió
intacta**: en el entregable el Teja de marca `#E2734B` aparece **19** veces, la
Cal `#F4EDDF` **66**, la Tinta `#0F2E36` **32**, mientras los tokens del design
system ajeno (`#c67139`, `#f5ead8`, Caprasimo, Figtree) aparecen **0 veces cada
uno**, y las **tres** familias de marca cargan de una sola URL. El prompt de
Orama tampoco decía "design system" ni "armadura" (0 apariciones, igual que el
v2 de Villa). **La diferencia no fue prohibir: fue rellenar.** `orama-demo.md`
lleva el `<link>` de Google Fonts **literal, listo para copiar** (`:81-82`), la
paleta como lista blanca cerrada contra un archivo existente —*"Si un color no
está en §5.A, no existe"* (`:444`), y §5.A *"heredados de
`propuesta-orama.html:8-24`"* (`:194`)— y **79 hex** escritos. No le quedó hueco
que llenar.

## La secuencia que funciona: prohibición + relleno, en ese orden

Prohibirle su design system y no darle nada a cambio es dejar el hueco vacío, y
**el hueco se vuelve a llenar solo**. El manual que él mismo se autogeneró lo
dice: espera *"the one stylesheet"* de la que salgan *"every color, font,
spacing, radius and shadow"*, y advierte *"Never hard-code a hex, a font name or
a px value the tokens already carry"*. Si no se la entregas, la fabrica.

1. **Armadura arriba del todo**, antes de los datos: prohibido anclar, adjuntar,
   generar o "derivar" cualquier design system; los tokens salen de tu apartado
   de paleta y de ningún otro lado; prohibido el fondo claro a pantalla completa
   si tu dirección es oscura; prohibido convertir las fotos a blanco y negro o
   desaturarlas; radios los tuyos, no `0`. En imperativo y con criterio medible,
   no como preferencia (`landings/POL-004`, `landings/KN-007`).
2. **Y acto seguido, el relleno: tu `_ds/` en su formato**, calcada de la que él
   se autogenera —`styles.css` con el `:root`, `readme.md` con listas Do/Don't
   escritas **espejando frase por frase las suyas**, e `iconos.html` con los SVG
   inline. Menos de 15 KB. Donde él dice *"Do not round a corner anywhere"*, el
   tuyo dice "radio 18 px siempre"; donde dice *"Print photographs in black and
   white"*, el tuyo dice "las fotos van a color pleno". Así **toda su maquinaria
   de obediencia —el linter incluido— trabaja a tu favor** en vez de contra ti.
3. **Los tokens no se inventan: se generan del repo en una pasada.** Los de Villa
   Broaster ya existen con sus ratios AA en
   `villa-app/app/globals.css:30-51`. El molde de nombres está en el
   `_ds_manifest.json` que él dejó (**48 tokens**: `--color-bg`, `--color-surface`,
   `--color-text`, `--color-accent`, `--font-heading`/`--font-body`, `--space-*`,
   `--radius-*`, `--shadow-*`) y el molde de redacción, en su `readme.md`.
4. **Lo mismo vale para todo hueco que el medio sepa llenar solo.** El caso
   gemelo, medido, es la tipografía: el `<link>` literal con **todas** las
   familias en una URL, más su pila de respaldo. Con el `<link>` (Orama): tres
   familias cargadas. Sin él (Villa v2): una, y `system-ui` para el cuerpo.
5. **Si el hueco no se puede llenar con texto, no lo llenes con texto.** La
   portada salió crema por una razón **mecánica**: las 9 fotos son PNG RGB **sin
   canal alfa**, con fondo blanco y sombra incrustada; sobre negro se ven como
   recortes sucios, así que el generador eligió el único fondo donde el defecto
   desaparece. La regla general: **si el próximo intento falla y lo primero que
   se te ocurre es escribir más, es señal de que falta un archivo, no una frase.**
   Los tres intentos pesan 25.505 B → 37.283 B (rechazado) → 101.608 B; la causa
   medida del fracaso no fue falta de texto.

> **El catálogo de QUÉ entregarle** —15 elementos en tres niveles de esfuerzo, 14
> antipatrones, todo con números medidos— vive en
> `ORION/prompts-landing/kit-claude-design.md`. Este tema **no lo duplica**: el
> kit dice qué darle; esto dice **cómo se encarga y por qué**.

## Cómo se aplica

1. **Estado congelado obligatorio**: cada vez que describas movimiento, describe
   también cómo se ve detenido (la pieza siguiente asomando cortada por el borde,
   la promo a medio armar, el foco ya puesto sobre el producto). Formato aplicado
   en `villa-app-villa-broaster-v3.md:846` ("INTERACCIÓN EN REPOSO — qué se VE, no
   qué se mueve").
2. **Anexo de coreografía aparte**, con milisegundos y curvas, rotulado para
   quien programe después (`:1240`, "ANEXO B — no es para ti, lienzo"). No se le
   pide al lienzo.
3. **Antes de elegir un mecanismo, pregúntate cómo se ve congelado.** Si su valor
   entero es un gesto —hover, foco que sigue al dedo, carrusel de 650 ms—, el
   revisor no lo va a ver. Es la regla 6 del índice de referencias
   (`referencias/_INDEX.md:38`), pagada el 2026-08-23.
4. **Entrega por pantallas** (portada, catálogo, detalle, carrito, confirmación)
   con **propósito de venta declarado bajo cada título**: *"dar hambre en dos
   segundos y dejar el botón de pedir al alcance del pulgar sin scrollear. No
   explica: calienta"* (`:295-296`). Donde no declaras el trabajo de la pantalla,
   él la resuelve con el patrón más común de esa categoría — y por eso la carta
   del v2 salió como lista de app de domicilios, con **10 discos de dos letras**
   (`Pi`, `Co`, `Pe`, `Al`, `C1`, `B8`, `B12`, `PF`, `PC`, `Ar`).
5. **Un capítulo `Prohibido en este proyecto`, numerado, citando el rechazo
   textual.** Citar la frase del dueño pesa más que la regla abstracta: la
   prohibición 6 de Orama dice *"Minimalismo austero. Ya fue rechazado por el
   dueño en otro proyecto ('muy minimalista… quiero que sea más interactiva, más
   llamativa')"* (`orama-demo.md:449`). Diez prohibiciones en `:442-453`, con
   lista blanca de color, cifras sociales, stock y placeholders, backend simulado
   con mentira, scroll horizontal y texto quemado en la imagen.
6. **Mide el contraste de cada par ANTES de escribir el prompt** y entrega la
   variante de servicio. El color de acento de una marca casi nunca es legible
   como texto: Teja `#E2734B` sobre papel `#F6EFE1` da **2,70 y FALLA**; la
   solución no es negociar la marca sino definir `#B5522E` para texto y dejar el
   Teja para fondos de insignia, corrigiendo la insignia a texto oscuro
   (`landings/KN-006`, `orama-demo.md:218` y `:233-236`). Si no se mide antes, la
   corrección llega cuando ya hay 24 tarjetas hechas.
7. **Autochequeos que el propio generador se aplica antes de entregar**,
   redactados como preguntas de sí/no que se contestan **mirando una captura**:
   *"abre tu lámina: ¿el fondo de la portada es oscuro? Si es claro, está mal"*;
   *"¿cargaste las tres familias y se ven distintas entre sí?"*. Se derivan
   mecánicamente: **por cada prohibición, escribe la pregunta que la delata en un
   PNG** (`:1205-1239`). Un criterio que el ejecutor puede comprobar solo vale más
   que diez adjetivos, porque un adjetivo se cumple sin cambiar una línea.
8. **Todo dato de negocio con origen `archivo:línea`**, lo de ejemplo marcado como
   ejemplo **dentro del propio diseño** —sello visible, nunca `sr-only` ni
   `display:none`— y lo que falta como **hueco numerado** dibujado en su sitio,
   nunca relleno verosímil (`landings/POL-002`, ver
   [[TEMA-cero-datos-inventados]]). Es el único elemento del v2 que sobrevivió al
   rechazo sin una crítica: la cinta EJEMPLO, **6 apariciones** en el HTML.
9. **De una plantilla ajena se hereda la arquitectura, nunca sus números.**
   Copia sus mecanismos y recalibra todos sus valores: archivo único
   autocontenido, poster base64 para que el primer pintado no sea un hueco,
   tokens en `:root`, motor responsive con `clearInline()` al cambiar de modo,
   entrada WAAPI con guard. No heredables: sus tamaños tipográficos, sus delays y
   su media (`landings/KN-005`). Copiar un `--hl1-fs:69.14px` de otra composición
   produce un resultado que **se ve prestado**.
10. **La armadura va ARRIBA, no al final.** En el v3 el ANEXO A vive en la línea
    **1174 de 1.271**: la cabecera lo anuncia, pero el bloque en imperativo llega
    después de todos los datos. Si todo es importante, nada lo es.
11. **Ordena la entrega, no solo el texto**: sube primero `_ds/` y `assets/`,
    pega la armadura **sola** como primer mensaje y espera, y solo después el
    encargo. El orden en que se pega importa tanto como el contenido.

## Cómo se REVISA lo que devuelve

Esta es la mitad que faltaba, y la que más barato se paga por saltarse.

**Regla cero: grepear el archivo entregado NO sirve.** El `.dc.html` es un lienzo
con bindings, no una página: trae **250 apariciones de `{{`** y un `support.js`
que monta React. Medido sobre la entrega de Villa Broaster: en **78.338 B** hay
**UN solo precio literal** (`$85.400`), mientras la página pintada muestra
**16**. Cualquier criterio contado sobre el texto da un número falso — y falso
por un factor de 16, no por un margen.

**Regla uno: mide sobre el DOM ya pintado.** El motor está escrito y no tiene
dependencias:

```
node C:/Users/Kalel/ORION/tools/edge-cdp.mjs --url "<archivo.dc.html>" \
     --width 390 --height 844 --mobile --wait 5000 --shot salida.png \
     --eval "JSON.stringify({anim:document.getAnimations().length, fuentes:[...document.fonts].length})"
```

Devuelve viewport real, `scrollWidth`/`clientWidth`, `scrollHeight`,
`animations`, las fuentes efectivamente cargadas, la consola y las excepciones.
**Nunca** uses `msedge --headless --window-size=390,844 --screenshot`: está
medido que miente el ancho (viewport real 492×752, PNG recortado) y que reporta
`prefers-reduced-motion: reduce` por defecto (`landings/KN-003`). Detalle del
instrumento en [[TEMA-verificar-con-evidencia]].

**Regla dos, la trampa cara: el criterio del fondo oscuro se engaña a sí mismo.**
La contramedida escrita en `landings/KN-007` pide comprobar que *"el fondo de la
primera pantalla tiene luminancia < 0.06"*. Si eso se implementa leyendo CSS,
**el propio entregable que motivó la regla la pasa**:

| Cómo se mide la portada del v2 | Resultado | Veredicto |
|---|---|---|
| `getComputedStyle(document.body).backgroundColor` | `rgb(10,10,10)` → L = **0.0030** | **PASA** (falso) |
| Píxeles reales de la primera pantalla (390×844) | L media **0.6585**, 74,3 % de píxeles claros | **FALLA** ×110 |

La causa, medida: el crema no es un `background-color`, es un
`background-image: radial-gradient(130% 100% at 50% 16%, rgb(255,250,242), rgb(247,236,225), rgb(230,211,186))`
sobre un `<section>` cuyo `background-color` es **transparente**. Cualquier
comprobación que suba por los ancestros leyendo `backgroundColor` se salta el
degradado y encuentra el negro del `body`. **Un criterio que no se ejerció contra
el fallo que lo motivó no está verificado: es una intención.**

**Regla tres: la vara final son los píxeles.** Se mide la luminancia media del
PNG, que no admite discusión. La misma medición sobre las dos capturas del v2
separa exactamente lo que el dueño rechazó de lo que no:

| Pantalla | Luminancia media | Píxeles claros | Veredicto del dueño |
|---|---|---|---|
| Portada (`cap-top.png`) | 0.6585 | 74,3 % | rechazada ("apagado, genérico") |
| Carta (`cap-carta.png`) | 0.0490 | 3,6 % | no la criticó por fondo |

**Regla cuatro: comprueba que la medición es reproducible antes de fiarte de
ella.** Volver a renderizar el mismo `.dc.html` el 2026-08-24 dio luminancia
`0.6585` y 74,3 % de claros — **idéntico** a la captura del 2026-08-23. El
entregable es determinista, así que un número que cambie entre corridas es un
problema de tu instrumento, no del diseño.

**Regla cinco: la lista de asserts es corta y siempre la misma.** Sin desborde
horizontal (`scrollWidth == clientWidth`; en el v2 dio 390 == 390, **pasó**), tap
targets ≥ 40 px, contraste ≥ 4.5, sellos EJEMPLO = precios visibles, luminancia
de la portada bajo el umbral **medida en píxeles**, `getAnimations()`, y número
de familias realmente cargadas (`document.fonts`: en el v2, **una**, `Anton`).

**Regla seis: anota la fila en una bitácora, porque los defaults son de la
herramienta, no del proyecto.** Una fila por entrega: herramienta y versión,
¿trajo `_ds/` propia y cuál?, ¿la primera pantalla es oscura?, ¿fotos a color?,
¿qué radios?, ¿cuántas familias cargó?, `getAnimations()`, y el **veredicto del
dueño POR CANAL con la palabra exacta que usó** (`landings/POL-003`,
`landings/POL-004`). Registrar la palabra es lo que distingue el problema real:
si repite "genérico", el fallo sigue siendo composición; si dice otra cosa, hay
lección nueva. Lo que te impuso en una landing te lo va a imponer en la
siguiente, y **solo se acumula si se anota**: hoy hay **una sola fila
registrada**, y del v2 consta que se revisó **solo en móvil**
(`landings/PEND-003`).

**Regla siete: rechazar con un número es lo que hace el rechazo accionable.** Con
el guion, "no me gusta" —irrepetible— pasa a ser "falla el criterio 4", que él
puede corregir sin adivinar.

## El registro: quién mira decide el tono

La señal para elegir registro **no es "público vs privado"** sino quién mira:
**trabajador adentro = calma; cliente afuera = venta** (`landings/POL-001`,
pagada con un rechazo textual del 2026-08-05). Al generador esto se le declara
**por escrito y por pantalla**, porque es justo la decisión que él rellena con el
promedio de la categoría si se la dejas abierta. El detalle de qué tiene que
lograr una pantalla de cara al cliente vive en [[TEMA-pantalla-publica]]; aquí
solo lo que toca al encargo:

- **Escribe el registro antes de la primera pantalla**, y repite el propósito de
  venta bajo cada título. Un encargo sin registro declarado produce el patrón más
  común del rubro, que es el que vas a rechazar.
- **`landings/KN-009` es la versión "comida", no una ley universal.** Dice que en
  comida la portada clara mata el hambre y la dirección brasa/oscura es
  obligatoria — y avisa en su propio texto de **no extrapolarlo a otros rubros
  sin veredicto**. La prueba está en el corpus: Orama es una inmobiliaria, su
  fondo es Cal `#F4EDDF` (claro) y pasó verificación con contrastes ≥ 5,72
  (`orama/KN-003`). Claro no es el error; **claro en comida** lo es.
- **No sobrecorrijas al corregir.** El mismo `landings/KN-009` degrada el crema de
  rol en vez de prohibirlo: deja de ser fondo de pantalla y queda como tinta y
  como "plato" bajo la foto. Y lo que el dueño **no** criticó se conserva.
- **Antes de subirle el color a una portada, grepea quién más usa ese token.** En
  placita los tokens de fruta viven en `:root` y los consume también el
  **interior** de la app: saturarlos "para que la portada venda" repintaría
  pantallas de trabajo regidas por el manifiesto. La solución correcta son tokens
  **nuevos** con alcance de portada (`landings/KN-004`).

## Tensiones abiertas entre proyectos (no se fusionan)

- **¿Se regenera desde el prompt o se edita la salida?** En Orama la regla es
  taxativa: *"los cambios se hacen SOBRE esta salida (el prompt de Claude Design
  ya terminó), no se regenera"* (`orama/KN-006`); el export original queda intacto
  en `docs/claude-design-export/` y se trabaja sobre `docs/index.html`. En Villa
  Broaster se hizo justo lo contrario: tras el rechazo del v2 se **regeneró** con
  un v3. **Las dos son correctas y el disparador es distinto.** Lo que cambió en
  Orama fue contenido: relocalización a Popayán, teléfono real, apagado de
  huecos, un bug de `componentDidUpdate` (`orama/PEND-004`) — regenerar los habría
  borrado todos. Lo que cambió en Villa fue la **dirección de arte entera**.
  Regla: **datos, copy y bugs → se edita la salida; dirección de arte o
  arquitectura de pantallas → se regenera.** Editar a mano una reestructuración
  sale más caro que volver a tirar los dados.
- **¿El design system ajeno gana siempre?** No, y creerlo lleva a la contramedida
  equivocada. Medido: **el medio ancló `_ds/` en las dos entregas** (2 de 2), pero
  el resultado fue opuesto — Villa perdió el 100 % de su paleta (`--brasa` 0) y
  Orama conservó el 100 % de la suya (`#E2734B` ×19, tokens ajenos ×0). Ninguno de
  los dos prompts llevaba armadura. Lo que separa los casos es que **la casa que
  el medio eligió coincidía o no con tu dirección**: a Orama le tocó "Organic"
  (cálido, redondeado, crema y terracota ≈ su propia marca) y a Villa le tocó
  "Modernist" (plano, claro, radio 0) contra una dirección oscura. Consecuencia
  incómoda: **cuando el DS ajeno coincide contigo, el robo es invisible y te
  enteras años después**; solo lo descubres el día que discrepa. Por eso la
  armadura no se escribe cuando falla, se escribe siempre.
- **¿Prompt largo o prompt corto?** El kit sostiene que la respuesta a un rechazo
  fue más prosa y era el remedio equivocado (25.505 → 37.283 → 101.608 B). Pero el
  corpus tiene un contraejemplo: `orama-demo.md` pesa **53.411 B en 502 líneas** y
  produjo a la primera un entregable que pasó verificación 12/12 con 0 ciclos de
  corrección (`orama/KN-002`). **No es el tamaño, es qué hay dentro**: los 79 hex,
  el `<link>` literal y la lista blanca de Orama son material; las 1.271 líneas
  del v3 son en buena parte prosa. La métrica honesta que propone el kit: que el
  próximo `PROMPT.md` pese **menos** y la carpeta que lo acompaña pese **más**.
- **Datos inventados: prohibidos aquí, obligatorios allá.** `landings/KN-001`
  exige que todo dato lleve origen y que lo que falte vaya como hueco; pero cuando
  el dueño autoriza contenido de demostración para una maqueta comercial, se
  especifica **completo** —una demo con huecos no vende— y se marca como ficticio
  en **dos** sitios (`landings/POL-002`). La frontera se mantiene: lo autorizado es
  el catálogo; teléfono, dirección, horario y nombres siguen siendo hueco visible.
  El desarrollo está en [[TEMA-cero-datos-inventados]].
- **Las prohibiciones que el medio incumple sin que nadie lo note.** La
  prohibición 7 de Orama veta *"dependencias externas de JS/CSS"*
  (`orama-demo.md:450`) y el entregable llegó con un `support.js` que carga React
  y React-DOM **desde `unpkg.com`**. Se aceptó igual. Es una prohibición dirigida
  al diseño que el **runtime** del medio incumple por su cuenta: si el entregable
  tiene que correr sin red, eso hay que exigirlo como criterio de aceptación
  medible (consola y `Network` limpios), no como una línea en la lista negra.

## Cuándo NO aplica

- **En el interior de una app de trabajo** la dirección se invierte: ahí manda la
  calma del manifiesto del estudio, no la venta (`landings/POL-001`).
- **Si el generador SÍ produce código vivo** (no láminas), la regla del estado
  congelado se relaja y la coreografía vuelve al encargo principal. La pregunta
  es siempre *"¿este medio corre JS y le muestra transiciones al revisor?"*.
  Verifícalo midiendo, no suponiendo, y **vuelve a verificarlo si cambias de
  herramienta** (v0, Lovable, Figma Make): `landings/KN-008` acota su propio
  alcance a los lienzos de artboards.
- **En fase de código sobre un repo propio** (Claude Code y equivalentes) la
  armadura es absurda: ahí el design system del proyecto **sí** debe heredarse.
  Prohibir un DS solo tiene sentido cuando el medio ancla uno ajeno.
- **Si el DS que el medio ancla es justamente el que quieres**, no pelees: es el
  caso de Orama. Pero mídelo y anótalo, porque la próxima vez puede tocarte otro.
- **Si lo que pides es exploración de estilo a propósito**, una lista negra larga
  te devuelve una sola idea: prohíbe solo lo que es identidad de marca y deja
  libre el resto.
- **Para una sola imagen** no hace falta la tabla de control ni repetir el estilo
  en cada bloque; y **si el cliente tiene fotos reales, siempre le ganan a las
  generadas**: no generes por generar. Un disco de iniciales feo es menos dañino
  que un producto que no es el suyo — el primero es un hueco, el segundo es una
  mentira.
- **No arrastres el modo escalado de una plantilla de login a páginas con scroll
  largo** (catálogos, cartas, listados): escalar el viewport vuelve el texto
  ilegible; ahí va maquetación de flujo, grid + `clamp()` (`landings/KN-005`).

## Evidencia

- `landings/KN-007` — el design system ajeno, con el contenido de
  `_ds/modernist-*/readme.md` y la contramedida en cuatro puntos. **Corrección
  registrada aquí:** su criterio medible ("luminancia < 0.06") pasa en falso si se
  lee del CSS; hay que medirlo en píxeles.
- `landings/KN-008` — el lienzo estático, medido con `document.getAnimations()` = 1;
  acota su alcance a medios que devuelven artboards.
- `landings/KN-009` — la portada clara mata el hambre **en comida**; incluye el
  aviso de no extrapolar y la regla de no sobrecorregir.
- `landings/KN-003` — las dos trampas de Edge headless (ancho 492 y
  reduced-motion) y la receta por CDP.
- `landings/KN-004` — grepear quién más consume un token antes de subirle el color.
- `landings/KN-005` — de una plantilla se hereda arquitectura, no números.
- `landings/KN-006` — contrastes medidos de la paleta Orama; Teja sobre papel 2,70
  FALLA y su variante de servicio.
- `landings/KN-002` — "específico" quiere decir números: ms, hex, ratio y píxeles;
  si el prompt se puede cumplir sin cambiar una línea, no era un prompt.
- `landings/POL-004` — las dos piezas fijas obligatorias en todo prompt a un
  generador. `landings/POL-003` — fichas de referencia, combinación y veredicto por
  canal. `landings/POL-001` — registro: calma adentro, venta afuera.
  `landings/POL-002` — datos de demo autorizados se marcan dos veces.
- `landings/PEND-004` (Ready) — **el veredicto del v3 sigue sin recoger**: está
  pagado el fallo, todavía no la cura. `landings/PEND-003` (Done) — deja constancia
  de que el v2 se revisó solo en móvil.
- `orama/KN-002` — el prompt de la demo (11 apartados, contrastes medidos, 7
  huecos, 23 criterios) con veredicto PASS 12/12 y 0 ciclos de corrección.
  `orama/KN-006` — el prompt murió: se edita la salida, con el export original
  intacto. `orama/PEND-004` — la lista de cambios aplicados sobre la salida.
  `orama/KN-003` — entregable con contrastes ≥ 5,72 sobre fondo claro.
  `orama/DEC-001` / `orama/CON-001` — identidad y nombre cerrados, citados dentro
  de la prohibición 3 del propio prompt.
- `villa-broaster/PEND-009` — destino de la ficha 01 (hero carrusel, portada móvil).
- Mediciones propias sobre el entregable rechazado (2026-08-23, **reproducidas el
  2026-08-24**), `…/scratchpad/villa-review/Vitrina Villa Broaster.dc.html`,
  78.338 B: `{{` 250 · precios literales en el archivo **1** frente a **16** en el
  DOM pintado · `--brasa` 0 · `#f7ece1` 57 · `#0a0a0a` 11 · `@keyframes` 11 ·
  `transition` 26 · `getAnimations()` 1 · `document.fonts` = `["Anton"]` ·
  `font-family` 32 (1 raíz `system-ui` + 6 Anton + **25 `inherit`**) ·
  `scrollWidth` 390 == `clientWidth` 390 · `scrollHeight` 3276 · EJEMPLO 6 ·
  `logo` **0** · "Villa Broaster" 3 · discos de iniciales 10 · `foto:true` 5 /
  `foto:false` 5 · "Pendiente del cliente." 3 · una misma descripción repetida 4
  veces · luminancia de portada **0.6585** (74,3 % claros) frente a `body`
  `rgb(10,10,10)` = 0.0030, y carta 0.0490 (3,6 %).
- Mediciones sobre la entrega de Orama, `prommter/proyectos/orama/docs/`: el
  export trae `_ds/organic-<uuid>/` (48 tokens, `--color-bg #f5ead8`,
  `--color-accent #c67139`, Caprasimo/Figtree, `--radius-md 16px`) y aun así el
  HTML usa `#E2734B` ×19, `#F4EDDF` ×66, `#0F2E36` ×32, Fraunces ×15, Caveat ×6,
  y **0** de los tokens ajenos. `support.js` idéntico al de Villa (69.150 B,
  md5 `951ae391b8ae72ef12e671c2fad23353`).
- El aparato de obediencia del DS ajeno:
  `_ds/modernist-*/_adherence.oxlintrc.json` (*"Raw hex color…"*, *"Raw px
  value…"*, *"Font not provided by the design system. Available: Archivo."*),
  `_ds_manifest.json` (48 tokens, `namespace: "Modernist_modern"`) y `readme.md`
  (*"Do not round a corner anywhere"*, *"Print photographs in black and white"*,
  *"Use Lucide icons"*).
- Prompts comparables en `ORION/prompts-landing/`:
  `villa-app-villa-broaster.md` (v1, 25.505 B) · `-v2.md` (rechazado, 37.283 B, **0**
  apariciones de "design system", "armadura" y `fonts.googleapis`) · `-v3.md`
  (101.608 B en 1.271 líneas; armadura en `:1174`, autochequeos `:1205-1239`,
  anexo de coreografía `:1240`, propósito de venta `:295-296`, `<link>` de
  fuentes `:811`, huecos `:992`, criterios `:1020`) · `orama-demo.md` (53.411 B en
  502 líneas; `<link>` literal `:81-82`, §5.A heredada de un archivo real `:194`,
  10 prohibiciones `:442-453`, contraste medido `:218` y `:233-236`).
- Catálogo de material a entregar: `ORION/prompts-landing/kit-claude-design.md`
  (15 elementos en 3 niveles, 14 antipatrones).
- Biblioteca de mecanismos con su veredicto por ficha:
  `ORION/prompts-landing/referencias/_INDEX.md` (regla 2 en `:30` — se copia el
  mecanismo, nunca el contenido; regla 6 en `:38` — tiene que verse en reposo;
  regla 7 en `:44` — la paleta se defiende por escrito).
- Instrumento: `ORION/tools/edge-cdp.mjs` (Edge por CDP, sin dependencias).

## Huecos de este tema (lo que el corpus NO respalda todavía)

- **La cura no está verificada, solo el fallo.** El v3 se entregó el 2026-08-23 con
  armadura, autochequeos y movimiento congelado, y **su veredicto sigue sin
  recoger** (`landings/PEND-004`). Todo lo que este tema dice sobre qué FUNCIONA
  contra el sesgo del medio se apoya en un solo caso favorable —Orama— que no fue
  diseñado como contramedida sino que salió bien por otras razones.
- **La `_ds/` propia nunca se ha entregado.** Es la contramedida central y **no
  existe en disco**: no hay una sola entrega en la que el generador haya recibido
  una carpeta de tokens nuestra. Su eficacia es una hipótesis razonada desde su
  `readme.md`, no un resultado medido.
- **No sabemos cómo elige la casa de estilo.** Los dos manifiestos declaran
  `namespace: "Modernist_modern"` y `"Organic_organi"` con catálogos de plantillas
  idénticos y `source: "spa"`: son estilos preexistentes, no derivados del prompt.
  Si el prompt influye en la elección, y cuánto, no se puede deducir del
  entregable. Mientras no se sepa, **la elección se trata como aleatoria**.
- **La bitácora por herramienta no existe como archivo.** La obligación está
  escrita (`landings/POL-003`, `landings/POL-004`) y hay **una sola fila**
  registrada, enterrada dentro de la resolución de un pendiente. Sin tabla, la
  promesa de "aprender de una entrega a la siguiente" es memoria, no registro.
- **Las referencias no tienen píxel.** `referencias/` tiene índice, plantilla y
  tres fichas — y **cero archivos de imagen**. El caso medido: de la ficha 01 se
  pidió "texto fantasma gigante detrás" y él lo pintó `rgba(224,30,43,.08)` sobre
  crema: técnicamente presente, visualmente muerto. Una captura de la referencia
  lo habría evitado.
- **Solo se ha medido un generador.** Todo lo de aquí sale de Claude Design en dos
  proyectos de una misma semana. Para v0, Lovable o Figma Make **no hay una sola
  medición**: trátalo como hipótesis y vuelve a correr la regla uno.

## Enlaces

- [[TEMA-cero-datos-inventados]] — la regla que gobierna el contenido de cualquier
  página pública, y la frontera de los datos de demo autorizados.
- [[TEMA-pantalla-publica]] — qué tiene que lograr la pantalla que ya te
  devolvieron: registro, acción única, 390 px y medida del pliegue. Este tema
  responde *cómo se encarga*; ese responde *qué tiene que lograr*.
- [[TEMA-verificar-con-evidencia]] — el instrumento con el que se mide en esta
  máquina (captura por CDP, por qué `--screenshot` miente, por qué todo veredicto
  lleva un número).
- [[TEMA-encargos-verificables]] — la forma general del encargo del que este es un
  caso particular: criterios que otro puede comprobar sin preguntarte.
