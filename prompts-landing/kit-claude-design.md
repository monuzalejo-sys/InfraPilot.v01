# Kit de calidad para Claude Design

**La pregunta:** ¿qué le puedo dar a un generador de diseño para que haga webs de
mucha más calidad que las que hace hoy?

**La respuesta corta:** archivos, no párrafos. Todo lo que sigue está atado a un
fallo real, medido en los tres intentos de la vitrina de Villa Broaster (v1, v2
rechazado, v3). Está ordenado **de lo más fácil a lo más difícil**: el Nivel 1 se
hace mañana con texto que ya está escrito; el Nivel 3 se construye una vez y
sirve para siempre. Dentro de cada nivel, lo de mayor impacto va primero.

---

## Las dos cosas que hay que entender antes de la lista

### 1. El generador tiene un HUECO de design system. Si tú no lo llenas, lo llena él.

No es un capricho del modelo: es su flujo. El manual que él mismo se autogeneró
en el v2 lo dice con todas las letras — *"Link the one stylesheet from every
page… take every color, font, spacing, radius and shadow from its variables"* y
*"`templates/` holds starting points a consuming project can copy whole"*.
Espera una hoja única de tokens. Si el encargo no se la entrega, la fabrica.

Y lo que fabricó fue esto: `_ds/modernist-aef7c589-…/` con `readme.md`,
`styles.css`, `theme.json`, un bundle y **un linter de adherencia** cuyas reglas
literales son *"Raw hex color — use a design-system color token via var()"*,
*"Raw px value…"* y *"Font not provided by the design system. Available:
Archivo."* Fondo `#f3f2f2`, los tres radios en `0px`, *"Print photographs in
black and white"*, *"Do not round a corner anywhere"*, *"Use Lucide icons"*.
Más una plantilla `Landing` descrita como *"a ruled hero, stat row, feature rows,
a grayscale photograph and a red poster close"* — el layout genérico exacto que
se rechazó.

Ese sistema **le ganó a la dirección de arte del prompt**. Medido sobre el
entregable: `--brasa` aparece **0 veces**, `#f7ece1` (el crema) **57**, `#0a0a0a`
(el negro del proyecto) **11**, y la portada salió
`radial-gradient(130% 100% at 50% 16%, #fffaf2, #f7ece1, #e6d3ba)`. El modelo
hasta dejó su justificación en un comentario CSS: `15.83 (portada clara)`.

**Prohibírselo deja el hueco vacío, y el hueco se vuelve a llenar solo.** La
secuencia que funciona es: **prohibición + relleno, en ese orden** (elementos 1 y
2). Le entregas tu design system en el formato que él ya sabe consumir, y toda
esa maquinaria de obediencia —el linter incluido— trabaja a tu favor.

### 2. La respuesta a un rechazo fue más prosa. Era el remedio equivocado.

Los tres intentos pesan **25.505 B → 37.283 B (rechazado) → 101.608 B**. Después
del rechazo la prosa se cuadruplicó. Pero el v2 no fracasó por falta de texto:
fracasó porque el medio ancló su propio design system y porque devolvió láminas
quietas (`document.getAnimations()` = **1** en toda la página, con un inventario
de 10 animaciones pedidas).

Ninguna cantidad de párrafos llena el hueco de un canal alfa ni el de la foto del
balde familiar. **Regla:** si el próximo intento falla y lo primero que se te
ocurre es escribir más, es señal de que falta un archivo, no una frase.

Este documento entero empuja en esa dirección: **menos prompt, más material
verificable.**

---

# NIVEL 1 — Mañana, en menos de una hora
*Texto que en su mayoría ya está escrito en esta máquina. Solo hay que ponerlo en
su sitio.*

## 1. La armadura contra su design system

- **Qué es:** media página, **primer bloque del encargo, antes de los datos**, en
  imperativo, con cuatro órdenes:
  (a) no anclar, adjuntar, generar ni "derivar" ningún design system;
  (b) todos los tokens salen de este documento y de `_ds/` (elemento 2);
  (c) la lista de contra-defaults uno por uno — fondo claro a pantalla completa,
  radio 0, fotos en blanco y negro, tipografía neutra, librería de iconos;
  (d) **un criterio medible de que se respetó**: "el entregable no trae carpeta
  `_ds/` propia ni `<link>` a un `styles.css` que tú hayas creado".
- **Por qué sube la calidad:** es el fallo número uno y está medido (ver arriba:
  `--brasa` 0 / `#f7ece1` 57). Sin ese bloque, la dirección de arte del prompt es
  una sugerencia que pierde contra un manual que el modelo se cree.
- **Cómo se consigue:** ya escrita y reutilizable —
  `ORION\prompts-landing\villa-app-villa-broaster-v3.md:1174-1203` (ANEXO A). Se
  copia cambiando solo los hex. Regla asociada: **POL-004** en
  `ORION\memory\landings\state.json`.
  **Ojo:** hoy vive en la línea 1174 de un documento de 1.270 líneas. Va **arriba**.
- Esfuerzo bajo · **Impacto muy alto**

## 2. Tu design system en `_ds/`, en el formato que él ya sabe consumir

- **Qué es:** una carpeta `docs/claude-design/_ds/villa/` calcada de la que él se
  autogeneró, con tres archivos y **menos de 15 KB de texto**:
  - `styles.css` — un `:root` con los 14 tokens reales del proyecto **usando los
    nombres que él usa por dentro** (`--color-bg`, `--color-surface`,
    `--color-text`, `--color-accent`, `--font-heading`/`--font-body`,
    `--space-*`, `--radius-*`, `--shadow-*`) más las clases base
    `.btn` / `.tarjeta` / `.precio` / `.sello`.
  - `readme.md` — la dirección en una línea + listas **Do / Don't** escritas
    espejando frase por frase las suyas: donde él dice *"Do not round a corner
    anywhere"*, el tuyo dice "radio 18 px siempre"; donde dice *"Print
    photographs in black and white"*, el tuyo dice "las fotos van a color pleno,
    nunca desaturadas"; donde dice *"A light ground #f3f2f2"*, el tuyo dice
    "fondo `#0a0a0a`, nunca un fondo claro a pantalla completa".
  - `iconos.html` — los 8-10 iconos SVG del recorrido, inline (si no se los das,
    monta Lucide).
- **Por qué sube la calidad:** ocupa el hueco. El fondo oscuro, el radio 18 y las
  fotos a color dejan de ser una petición en prosa y pasan a ser **el archivo que
  él está obligado a leer**. Además desaparece la traducción entre tu paleta y la
  suya, que es exactamente donde se perdieron los valores.
- **Cómo se consigue:** se genera del repo en una pasada, no se inventa. Los
  tokens con sus ratios AA ya están en
  `prommter\proyectos\villa-broaster\villa-app\app\globals.css:30-51`
  (`--noche #0a0a0a`, `--rojo #e01e2b` con blanco encima = 4.78, `--naranja
  #ff8a20` sobre `#141414` = 7.81, `--radio 18px`). Las clases salen de los 11
  componentes de `villa-app\components\tienda\`. El molde de nombres está en
  `…\villa-review\_ds\modernist-…\_ds_manifest.json` (48 tokens) y el molde de
  redacción en su `readme.md` (secciones Direction / Color / Type / Do / Don't).
  **20 minutos.**
- Esfuerzo bajo · **Impacto muy alto**

## 3. El contrato tipográfico: el `<link>` literal, la pila de respaldo y —cuando exista— el woff2

- **Qué es:** tres o cuatro líneas listas para copiar — los `<link
  rel="preconnect">`, el `<link>` de Google Fonts con **todas** las familias en
  una sola URL, y por familia su declaración completa con respaldo
  (`'Familjen Grotesk', 'Segoe UI', system-ui, sans-serif`). Más una frase:
  *"si cargas una sola familia, el encargo está incumplido."*
  Cuando la pareja display + texto esté decidida, se sube a
  `docs/claude-design/tipografia/` con los `.woff2`, la licencia y un
  `MUESTRA.html` que las pinte a tamaño real con frases del negocio ("Presa de
  pechuga", "$11.500", "Se paga al recibir").
- **Por qué sube la calidad:** medido en el entregable del v2 — la URL de Google
  Fonts pedía **UNA** familia (`family=Anton`), y de las 32 declaraciones de
  `font-family` del archivo, **25 heredan** de un `system-ui, -apple-system,
  'Segoe UI', Roboto, sans-serif`. O sea: **la mitad de lo que el dueño llamó
  "genérico" es literalmente la letra por defecto del sistema operativo**, y el
  display se lo eligió él solo sin que nadie lo aprobara. Es la corrección más
  barata que existe: no requiere ni una foto ni un dato del cliente.
- **Cómo se consigue:** el `<link>` de las cuatro familias ya está resuelto en
  `villa-app-villa-broaster-v3.md:805-830` (la URL, en la línea 811). Falta
  cerrar el hueco T-08: `MARCA.md:27` todavía declara *"Fuente display: sin
  decidir"*. Anton ya está de facto en el entregable y es SIL OFL — se bendice o
  se reemplaza, pero **se decide**.
- Esfuerzo bajo · **Impacto alto**

## 4. Los autochequeos binarios que él se aplica antes de entregar

- **Qué es:** 8-12 preguntas numeradas con respuesta sí/no, cada una mirando la
  lámina terminada, con la consecuencia escrita: *"si la respuesta es no, vuelve
  atrás."* Los que funcionan son los que se contestan mirando una captura:
  *"¿el fondo de la portada es oscuro? si es claro o crema, está mal"*;
  *"¿cargaste las tres familias y se ven distintas entre sí? si el cuerpo se ve
  system-ui, está mal"*; *"tapa todos los textos con la mano: ¿todavía da
  hambre?"*
- **Por qué sube la calidad:** convierte tu criterio en algo que el ejecutor
  comprueba solo, antes de que tú lo veas. El v2 no llevaba ni un chequeo y falló
  exactamente en las tres cosas que un chequeo binario atrapa mirando el PNG:
  portada clara, una sola familia, composición de la carta. Un criterio
  comprobable vale más que diez adjetivos, porque un adjetivo se cumple sin
  cambiar una línea.
- **Cómo se consigue:** plantilla escrita en
  `villa-app-villa-broaster-v3.md:1205-1239` (10 chequeos + 2 sub-chequeos). Se
  derivan mecánicamente: **por cada prohibición, escribe la pregunta que la
  delata en una captura.**
- **Pendiente honesto:** el veredicto sobre los chequeos del v3 sigue abierto
  (PEND-004). Está pagado el fallo, todavía no la cura.
- Esfuerzo bajo · **Impacto alto**

## 5. Entrega por pantallas, cada una con su propósito de venta declarado

- **Qué es:** no "una landing" sino N pantallas nombradas (portada, carta, hoja
  de producto, carrito+pago, confirmación) y, bajo el título de cada una, **una
  línea que dice el trabajo que hace**: *"dar hambre en dos segundos y dejar el
  botón de pedir al alcance del pulgar sin scrollear. No explica: calienta."*
- **Por qué sube la calidad:** donde no declaras el trabajo de la pantalla, él la
  resuelve con el patrón más común de esa categoría. El v2 entregó las cinco
  pantallas pedidas y **la carta salió como lista de app de domicilios con
  círculos de inicial** (`Co`, `Fa`, `Be` — se ven en `cap-carta.png`): competente
  y aburrida. La pantalla estaba; el encargo de esa pantalla, no.
- **Cómo se consigue:** formato en `villa-app-villa-broaster-v3.md:295-296`,
  repetido al abrir cada pantalla. Se escribe respondiendo: *¿qué tiene que hacer
  el que mira, en esta pantalla, sin scrollear?*
- Esfuerzo bajo · **Impacto alto**

## 6. La ficha de assets: qué es cada foto, medida, con su rareza y su tratamiento

- **Qué es:** un archivo corto que por cada imagen diga dimensiones reales,
  formato, **si tiene canal alfa**, qué rareza trae (sombra incrustada, fondo
  blanco, producto que pasa del semilado), en qué pantalla va, con qué
  tratamiento y con qué peso máximo de salida; más la lista de las **RESERVADAS**
  que no se dibujan y por qué.
- **Por qué sube la calidad:** sin el dato de que las fotos **no** tienen alfa, el
  generador finge un recorte que no existe y devuelve parches — en el v2 montó la
  comida encogida sobre un disco crema, justo la pieza que se rechazó. Con el
  dato medido, el defecto se convierte en el concepto: el v3 funde el blanco del
  fondo como aceite bajo `multiply` sobre una forma ámbar. Y la lista de
  reservadas evita el fallo más caro: dibujar en la carta un producto que la
  cocina no tiene.
- **Cómo se consigue:** ya existe y es buena —
  `villa-broaster\docs\claude-design\assets\LISTA.md` (`:10-11` las 9 fotos son
  *"PNG 1254×1254, RGB sin canal alfa, 1.5–2.0 MB… con una sombra gris incrustada
  en el fondo"*; `:52-65` las 4 reservadas con su motivo). Medir alfa y
  dimensiones de un lote de PNG toma dos minutos con Node.
- **Mejora barata pendiente:** adjuntar **una** foto de muestra ya tratada
  (antes/después del mecanismo firma), para que el tratamiento no dependa de 40
  líneas de prosa.
- Esfuerzo bajo · **Impacto alto**

## 7. El sello EJEMPLO visible y los huecos numerados como tickets dibujados

- **Qué es:** dos marcas **dentro de la página**, no en el brief:
  (a) un sello de caucho visible "EJEMPLO" junto a cada precio o dato inventado
  —nunca en `sr-only` ni `display:none`—;
  (b) por cada dato que falta, un ticket numerado `H-1…H-N` **dibujado en su
  sitio** bajo el rótulo "LO QUE FALTA PARA PUBLICAR", en vez de rellenar con
  algo verosímil.
- **Por qué sube la calidad:** lo verosímil es la forma que tiene una mentira
  útil — una foto de comida con precio se lee como "esto se puede pedir". El
  sello traslada el riesgo del dueño al papel; el ticket convierte un vacío en
  una tarea con número, que es lo único que el cliente final puede responder. Y
  es **el único elemento del v2 que sobrevivió al rechazo sin una sola crítica**
  (la cinta EJEMPLO, 6 apariciones en el HTML).
- **Cómo se consigue:** regla en **POL-002** (marca doble: en el prompt y VISIBLE
  en la página). Redacción y forma en `villa-app-villa-broaster-v3.md:992-1019`
  (huecos como ticket de papel crema clavado) y `:512` (sello girado -12°).
- Esfuerzo bajo · Impacto medio

---

# NIVEL 2 — Esta semana
*Ya no basta con escribir: hay que producir un archivo, correr un script o
llamar al cliente.*

## 8. El estado congelado de todo lo que se mueve (escrito, y después dibujado)

- **Qué es:** tres piezas, en orden de esfuerzo:
  1. **En el cuerpo del encargo**, por cada mecanismo, cómo se ve **DETENIDO**:
     el producto inclinado saliéndose del encuadre con su sombra, la pieza
     siguiente asomando cortada por el borde, la promo a medio armar con las
     piezas en vuelo, el foco **ya puesto** sobre el producto.
  2. **La coreografía a un ANEXO** rotulado *"para la fase de código, NO para el
     lienzo"*: inventario numerado con elemento, disparador, ms, curva,
     presupuesto y propiedades prohibidas.
  3. **`congelado/`: cinco PNG, uno por pantalla**, mostrando el instante exacto
     que hay que congelar. Vale un boceto a mano fotografiado o un collage burdo:
     no tiene que ser bonito, tiene que ser **inequívoco**. Al pie: *"esta es la
     POSE, no el diseño: los colores y la tipografía salen de `_ds/villa/`."*
- **Por qué sube la calidad:** el lienzo devuelve láminas quietas y el dueño
  revisa PNG, así que un mecanismo cuyo valor entero es un gesto es invisible
  para ambos. Medido: `document.getAnimations()` = **1** en toda la página, pese a
  que el HTML **sí** trae **11 bloques `@keyframes`** y **26 `transition`**, y el
  CSS del foco escrito (`mask-image: radial-gradient(circle 150px at var(--fx)
  var(--fy))` con `brightness(1.15)`) y un estado `promoArmada`. **El trabajo de
  movimiento se hizo y no se vio.** Describirlo en prosa ya se intentó en el v3;
  la imagen quita la última ambigüedad, porque "a medio armar" significa cosas
  distintas para cada quien.
- **Cómo se consigue:** regla en **POL-004** y **KN-008**; ejemplo completo en
  `villa-app-villa-broaster-v3.md:846` (apartado 6, "INTERACCIÓN EN REPOSO — qué
  se VE, no qué se mueve") y `:1240` (ANEXO B). Los cinco frames los hace el
  dueño en 20 minutos con papel y celular.
- Esfuerzo medio · **Impacto muy alto**

## 9. Las 9 fotos recortadas con canal alfa, y la sombra en una capa aparte

- **Qué es:** los mismos 9 productos exportados dos veces — `alfa/<id>.png` a
  1254×1254 con canal alfa real (sujeto completo, **sin recorte a forma**) y
  `sombra/<id>.png`, una mancha gris suave con alfa en su propia capa para poder
  moverla, teñirla o quitarla. **Los originales sin alfa se conservan:** el
  mecanismo del v3 los usa.
- **Por qué sube la calidad:** este es el motivo **mecánico** de que la portada
  saliera crema. Las 9 fotos son PNG RGB sin alfa, con fondo blanco y sombra
  incrustada; sobre negro eso se ve como un recorte sucio, así que el generador
  eligió el único fondo donde el defecto desaparece —un radial de `#fffaf2` a
  `#f7ece1`, casi el mismo blanco de las fotos— y ahí murió la dirección de arte
  oscura, que en comida no es un gusto sino **KN-009: la portada clara mata el
  hambre**. La prueba de cuánto pesa el defecto: el v3 tuvo que inventarse una
  dirección de arte entera (charco ámbar + `mix-blend-mode: multiply` +
  `isolation: isolate` + cuadrado troquelado) **cuyo único propósito es esconder
  un canal alfa que no existe**. Con alfa, esa acrobacia se borra del prompt.
- **Cómo se consigue:** partiendo de los 9 originales intactos en
  `villa-broaster\docs\identidad\fotos-productos\`. Quitar fondo (el fondo ya es
  blanco liso, cualquier recorte automático sirve), **revisar a mano los bordes
  de las presas apanadas** —la costra es lo que más se come un recorte
  automático— y exportar sujeto y sombra por separado. Aviso del propio
  `LISTA.md:27-31`: en pechuga, ala, muslo y papa horneada el contenido pasa del
  semilado, así que se recorta el sujeto completo, **jamás a un círculo**.
- Esfuerzo medio · **Impacto alto**

## 10. Las capturas reales: el "antes" y el "esto NO"

- **Qué es:** dos carpetas de PNG a **390×844 exactos**, entregadas junto al
  prompt:
  - `antes/` — las 5 pantallas del **estado actual** (`antes-01-portada.png`…).
  - `no/` — las capturas del **intento rechazado**, con tres o cuatro anotaciones
    encima: *"este fondo crema es el fallo"*, *"este texto fantasma quedó rosa
    sobre crema, casi invisible"*, *"estos círculos de iniciales Co/Fa/Be son
    formato de app de domicilios"*. Rótulo: **"esto es lo que NO"**.
- **Por qué sube la calidad:** él revisa lo que ve, igual que el dueño. Hoy el
  estado actual se le cuenta **en prosa** y lo reproduce literalmente: el
  `PROMPT.md` del v2 le contaba en la línea 180 que *"hoy es texto a la izquierda
  y un cuadro de 88 px con iniciales a la derecha"* — y el entregable salió con
  esas mismas iniciales (10 entradas `ini:` en el HTML: `Pi`, `Co`, `Pe`, `Al`,
  `C1`, `B8`, `B12`, `PF`, `PC`, `Ar`). El mecanismo placeholder de
  `ArteProducto.tsx:20-33` **sobrevivió al rediseño**. Con el PNG delante, el
  rediseño se vuelve un antes/después con vara visible ("ninguna pantalla puede
  parecerse a su antes") y de paso le das las densidades reales que hoy adivina.
  Y describir el fracaso en prosa obliga al modelo a imaginarlo; **una imagen
  anotada no se puede malinterpretar**. Esas dos capturas ya existen, fundaron
  tres lecciones pagadas, y nunca se le entregaron.
- **Cómo se consigue:** las del rechazo ya están en disco (`…\villa-review\
  cap-top.png` y `cap-carta.png`); anotarlas toma cinco minutos. Las del "antes"
  salen de levantar `villa-app` en local y disparar `ORION\tools\edge-cdp.mjs`.
  **NO usar `msedge --headless --window-size=390,844`**: está medido que miente
  (KN-003 — viewport real 492×752 y el PNG sale recortado). Hay que pasar por
  `Emulation.setDeviceMetricsOverride {width:390, height:844,
  deviceScaleFactor:1, mobile:true}`.
- Esfuerzo bajo · **Impacto alto**

## 11. La hoja de carta REAL, en un CSV

- **Qué es:** un `carta.csv` de ~23 filas: `id · nombre · categoría · precio Villa
  del Viento · precio Vía al Bosque · descripción (máx. 90 caracteres, una por
  producto, distinta) · archivo de foto o vacío`. Más una hoja igual para promos y
  combos con lo que incluye cada uno.
- **Por qué sube la calidad:** cierra de una vez tres agujeros que **se ven en la
  pantalla**:
  1. *El texto de relleno se publica.* "Pendiente del cliente." aparece
     renderizado **3 veces** en el entregable, con estilo y todo (dos como
     subtítulo visible de "Promo de EJEMPLO" en `#998a81`), porque no había promo
     real que poner.
  2. *Sin descripción propia, repite.* La cadena "De la tanda que está saliendo
     del aceite" sale **4 veces**, y en `cap-carta.png` se lee cortada con puntos
     suspensivos en fila tras fila: **esa es exactamente la textura de "app de
     domicilios genérica"**.
  3. *Desbloquea 4 fotos ya pagadas* (muslo, filete de pollo, filete de cerdo,
     papa horneada) que hoy no se pueden dibujar porque nadie sabe si esos
     productos existen. Y retira la cinta EJEMPLO, hoy obligatoria porque los 23
     precios son semilla.
- **Cómo se consigue:** **no sale del repo** — es el hueco H-2/H-1 y hay que
  pedírsela al cliente. El código lo dice con todas las letras:
  `broaster-app\lib\servidor\almacen-disco.ts:360-366` declara que esos *"NO son
  los precios de este negocio"*. Una llamada y una foto de la carta impresa
  resuelven las columnas duras; las descripciones las escribe el dueño en una
  tarde (90 caracteres × 23).
- Esfuerzo medio · **Impacto alto**

## 12. Los criterios medidos sobre el DOM, el guion que los corre y la fila que dejas anotada

- **Qué es:** tres cosas que son una sola:
  - **Los criterios**, comprobables con un número: sin desborde horizontal
    (`scrollWidth == clientWidth`), tap targets ≥ 40 px, contraste ≥ 4.5, sellos
    EJEMPLO = precios visibles, luminancia del fondo de la portada bajo un
    umbral, `getAnimations()`.
  - **El guion** que los corre **sobre la página ya pintada** y escupe PASA/FALLA
    línea por línea.
  - **La bitácora**: una fila por entrega en una tabla — herramienta y versión,
    ¿trajo `_ds/` propia?, ¿la primera pantalla es oscura?, ¿las fotos a color?,
    ¿qué radios?, ¿cuántas familias cargó?, `getAnimations()`, y **el veredicto
    del dueño POR CANAL** (móvil / escritorio) **con la palabra exacta que usó**.
- **Por qué sube la calidad:** sin el guion, la revisión se hace grepeando el
  archivo entregado **y el archivo miente**: el `.dc.html` trae **250 bindings
  `{{ }}`** y un `support.js`, así que en 78 KB hay **un solo precio literal**
  mientras la captura muestra tres. Cualquier criterio contado sobre el texto da
  un número falso. Con el guion, rechazar deja de ser "no me gusta"
  —irrepetible— y pasa a ser "falla el criterio 4", que él puede corregir sin
  adivinar. Y la bitácora importa porque **los defaults son de la herramienta, no
  del proyecto**: lo que te impuso en una landing te lo va a imponer en la
  siguiente, y solo se acumula si se anota. Registrar la **palabra** del dueño es
  lo que distingue el problema real: si repite "genérico", el fallo sigue siendo
  composición; si dice otra cosa, hay lección nueva.
- **Cómo se consigue:** el motor ya existe — `ORION\tools\edge-cdp.mjs` (Edge por
  CDP, sin dependencias). Falta encima una lista de asserts de ~40 líneas,
  escrita una vez y reutilizable; los criterios en prosa ya están en
  `villa-app-villa-broaster-v3.md:1020-1112`. La bitácora es una tabla markdown
  junto a `ORION\prompts-landing\referencias\_INDEX.md`, que se llena con la
  salida del guion. La obligación ya está escrita (**POL-003**, **POL-004**);
  falta el archivo: hoy hay **una sola fila registrada** (v2, no respetó) y vive
  enterrada dentro de la resolución de PEND-003, que además deja constancia de
  que el v2 se revisó **solo en móvil**.
- Esfuerzo medio · **Impacto alto**

---

# NIVEL 3 — Se construye una vez (o hay que encargarlo)
*Caro la primera vez. Después sirve para todos los proyectos, o es la casilla que
ninguna instrucción de diseño puede llenar.*

## 13. La biblioteca de referencias fichadas, cada ficha con su imagen recortada

- **Qué es:** por cada referencia que te guste, **una ficha + un PNG**:
  - La ficha separa el **MECANISMO reutilizable** (composición, movimiento, uso
    del color, jerarquía) de **lo que jamás se copia** (marca, textos, imágenes,
    datos), más su traducción a términos de venta, su riesgo en móvil y su
    historial de uso.
  - El PNG está **recortado al mecanismo**, sin marca ni textos ajenos legibles,
    guardado al lado (`01-hero-carrusel-figuras-toonhub.png`). Una imagen por
    ficha; 2-3 si el mecanismo necesita dos estados. Se sube con la línea: *"de
    esta imagen se copia SOLO la composición/el movimiento; marca, textos,
    colores y fotos ajenas están prohibidos."*
  - Por página se combinan **2-3 fichas, una por zona** (portada / producto /
    cierre), y después del veredicto se anota qué sobrevivió.
- **Por qué sube la calidad:** te deja **combinar en vez de imitar**, y aprender
  de un intento al siguiente en una tabla y no en la memoria. Ya produjo la
  lección más útil que hay sobre este medio: de los tres mecanismos combinados en
  el v2, **el que dependía de un cambio de fondo no se ejecutó**, **el que
  dependía de un gesto no apareció**, y **el único que sobrevivió sin una crítica
  fue el que se ve QUIETO** ("dato grande + línea"). De ahí sale la regla 6 de
  `_INDEX.md`: *antes de usar una ficha, pregúntate cómo se ve congelada en una
  captura.*
  Y falta el píxel: `ORION\prompts-landing\referencias\` tiene `_INDEX.md`,
  `_PLANTILLA.md` y tres `.md` — **cero archivos de imagen**. Caso exacto: de la
  ficha 01 se pidió "texto fantasma gigante detrás" y él lo pintó como
  `rgba(224,30,43,.08)` sobre crema — técnicamente presente, **visualmente
  muerto**; en `cap-top.png` se lee como una mancha rosa pálido. Una captura de la
  referencia le habría enseñado en medio segundo que ese recurso **solo existe
  sobre fondo oscuro**.
- **Cómo se consigue:** la mitad ya está montada —
  `ORION\prompts-landing\referencias\` con `_INDEX.md` (columna Resultados) y 3
  fichas con veredicto anotado. Las imágenes las tiene el dueño, porque él mismo
  entregó las referencias: es una captura + un recorte a la zona del mecanismo.
- Esfuerzo alto la primera vez · **Impacto alto y creciente**

## 14. Las fotos que faltan, con el balde familiar de primero

- **Qué es:** una sesión corta con la misma receta de las 9 que ya existen
  (1254×1254, fondo blanco liso, producto centrado en tres cuartos) pero
  **exportando ya con alfa** (elemento 9, para no repetir el trabajo). Orden de
  disparos: **balde familiar** abierto en cenital y en tres cuartos (los tres
  tamaños si se distinguen) · un combo servido completo · una gaseosa · presa de
  pierna · papa criolla.
- **Por qué sube la calidad:** **es la única casilla de esta lista que no se puede
  llenar con texto.** Cinco de los diez productos de la maqueta no tienen foto, y
  él los resolvió con discos de dos letras —`Co`, `Fa`, `Be`—, que es literalmente
  la estética de app de domicilios que el dueño llamó "genérico" (5 productos con
  `foto: true` y 5 con `foto: false` en el entregable). Peor: **el balde familiar
  es el producto de mayor ticket** de la carta ($74.900 / $106.900 / $129.900) y
  no tiene ni una sola imagen, por lo cual Familiar, Combos y Bebidas no llevan
  bandeja a sangre y abren con una plancha de precio — **las tres pantallas donde
  más plata hay son las tres más pobres visualmente** (`LISTA.md:70-72`). Y de los
  8 productos de las 4 promos, **solo uno tiene foto** (`LISTA.md:47-50`), lo que
  limita cada promo a una sola capa fotográfica.
- **Cómo se consigue:** la produce el dueño en el local, con el mismo montaje para
  que la luz y la escala peguen. Si la sesión no cabe esta semana: **el balde
  solo ya sube tres pantallas.**
- Esfuerzo alto · **Impacto alto**

## 15. El logo definitivo en SVG, con sus versiones y su zona de resguardo

- **Qué es:** una carpeta `marca/` con `logo-oscuro.svg`, `logo-claro.svg`,
  `logo-mono.svg` e `isotipo.svg` (el que cabe en 32 px), más una línea de
  reglas: zona de resguardo, tamaño mínimo en píxeles y sobre qué fondos puede ir.
- **Por qué sube la calidad:** en las cinco pantallas entregadas **la marca no se
  dibujó ni una vez**: la cadena `logo` aparece **0 veces** en el HTML y "Villa
  Broaster" solo existe **3 veces**, todas como texto de 13 px (pie de página y
  encabezado del pedido). La portada —lo primero que ve un cliente— no tiene
  marca: solo una píldora de sede y el contador del carrito. Que no invente un
  logo está bien; el problema es que **si no se lo das, tampoco le reserva el
  sitio**, y la página queda sin firma. Es el elemento que convierte "una vitrina
  de pollo" en "la vitrina de ESTE asadero".
- **Cómo se consigue:** no está en disco. Hoy el logo es provisional (una llama
  SVG en `Encabezado.tsx:43-51` y `app/icon.svg`) y es la tarea **T-08 / hueco
  H-8** sin cerrar (`MARCA.md:26`). Requiere decidirlo con el cliente o encargar
  el diseño; una vez existe, exportar SVG es inmediato.
- Esfuerzo alto · Impacto medio

---

# Lo que NO debes darle

## Sobre el encargo

- **Un prompt cada vez más largo en lugar de más activos.** 25.505 B → 37.283 B
  (rechazado) → 101.608 B. La causa medida del fracaso no fue falta de texto.
  Ninguna cantidad de párrafos llena el hueco de un canal alfa ni el de la foto
  del balde.
- **Adjetivos sin número.** "Moderno", "llamativo", "premium", "que tenga
  movimiento", "que sorprenda". Se cumplen **sin cambiar una línea**, así que los
  resuelve con su promedio. Está pagado dos veces: el v1 de la placita trataba
  los tres ejes como adjetivos y tres días después el dueño pidió exactamente lo
  mismo otra vez (KN-002); y después del segundo rechazo hubo que traducir a mano
  "apagado", "genérico" y "que dé gusto verlo" a operaciones concretas (KN-009).
  **Si la instrucción no lleva un hex, unos milisegundos, un píxel o un archivo
  adjunto, no es una instrucción.**
- **Un encargo largo sin jerarquía, con la armadura al final.** En el v3 el ANEXO
  A vive en la línea **1174 de 1.270**: la cabecera lo anuncia, pero el bloque en
  imperativo llega después de todos los datos. Si todo es importante, nada lo es.

## Sobre el design system

- **Dejarle el hueco del design system — se lo llenes mal o no se lo llenes.**
  Pedirle "un estilo bonito y coherente", dejarlo "proponer", o prohibírselo en
  prosa y no darle nada a cambio. Las tres terminan igual, y la tercera ya se
  intentó en el v2: portada crema y `--brasa` en 0. La **única** contramedida con
  evidencia a favor es ocupar el hueco con tu propia carpeta.

## Sobre el movimiento

- **El inventario de animaciones con milisegundos y curvas en el cuerpo del
  encargo al lienzo.** Le pides algo que no muestra y le robas la atención que
  debía ir a la composición. El v2 llevaba el inventario A1-A10; el entregable
  tiene 11 `@keyframes` escritos y `getAnimations()` = 1. **Va a un anexo
  rotulado "para la fase de código".**
- **Mecanismos cuyo valor entero es un gesto**, sin describir su estado en
  reposo: foco que sigue al dedo, promo que se arma al tocarla, carrusel de
  650 ms. El foco del cierre *"ni apareció"*: el CSS estaba escrito y el dueño no
  lo mencionó porque revisa PNG.

## Sobre las referencias

- **La referencia entera, con un "que se parezca a esto".** Copia lo accesorio
  —marca, textos, paleta ajena— y pierde el mecanismo, que es lo único valioso y
  lo único reutilizable en el siguiente proyecto (regla 2 de `_INDEX.md`). La
  forma correcta es la pareja: **imagen recortada al mecanismo + ficha que dice
  qué se toma y qué está prohibido copiar.**

## Sobre las fotos

- **Fotos crudas sin medir, o sin decirle que NO tienen canal alfa.** Finge un
  recorte que no existe y devuelve parches: en el v2, la comida encogida sobre un
  disco crema.
- **Fotos ya recortadas a una forma** (círculo, óvalo, tarjeta). En pechuga, ala,
  muslo y papa horneada el contenido pasa del semilado y un círculo les corta las
  puntas. Un recorte a forma es **una decisión de composición tomada en el
  archivo**, donde ya no se puede deshacer: se recorta con alfa sobre el sujeto
  completo y la forma la pone el diseño.
- **Rellenar un hueco con foto de banco.** Se nota a un kilómetro en un negocio
  de barrio y mata justo la confianza que la página estaba construyendo (regla 7
  de `MARCA.md`). **Un disco de iniciales feo es menos dañino que un pollo que no
  es el tuyo: el primero es un hueco, el segundo es una mentira.**
- **Las 4 fotos reservadas "para que no se desperdicien"** (muslo, filete de
  pollo, filete de cerdo, papa horneada). Una foto de comida en una carta se lee
  como "esto se puede pedir"; publicarlas sin producto ni precio promete algo que
  la cocina no tiene, y el hueco H-2 sigue abierto. **Tampoco valen como adorno
  ni como textura de fondo**: quien las vea va a preguntar por ellas en el
  mostrador.

## Sobre los datos y la revisión

- **Datos de ejemplo sin sello visible** (o con la marca en `sr-only` /
  `display:none`). La autorización de inventar no borra el riesgo, lo desplaza:
  deja de ser "el dueño se entera tarde" y pasa a ser "el cliente final cree que
  ya subimos su inventario" y lo reclama en el mostrador al día siguiente
  (POL-002).
- **Verificar los criterios grepeando el archivo entregado.** 250 bindings
  `{{ }}` y un `support.js`: en 78 KB hay **un** precio literal mientras la
  captura muestra tres. Se mide sobre el DOM ya pintado.
- **Sacar las capturas con `msedge --headless --window-size=390,844`.** No da un
  viewport de 390: medido, queda en **492×752** y el PNG sale **recortado** — o
  sea, muestra un layout ancho cortado, no lo que ve un celular. Además Edge
  headless reporta `prefers-reduced-motion: reduce` por defecto, así que la
  captura sale sin movimiento (KN-003). Se usa CDP.

---

# La carpeta que le entregas

Hoy existe en `villa-broaster\docs\claude-design\` con cuatro piezas: `README.md`,
`PROMPT.md`, `MARCA.md` y `assets/` (9 fotos + `LISTA.md`). La forma es correcta.
Lo que le falta son **los cuatro archivos que hoy no existen**, marcados abajo:

```
docs/claude-design/
├── README.md          el orden en que se pega. 30 líneas, no más
├── _ds/villa/         ← NUEVO. styles.css + readme.md + iconos.html (<15 KB)
├── PROMPT.md          el encargo — con la ARMADURA en la línea 1
├── MARCA.md           tokens, sedes, qué es real vs. ejemplo
├── assets/            las 9 fotos + LISTA.md (+ alfa/ y sombra/ cuando existan)
├── antes/             ← NUEVO. 5 PNG del estado actual, 390×844, por CDP
├── no/                ← NUEVO. cap-top.png y cap-carta.png anotadas
├── congelado/         ← NUEVO. 5 frames de POSE (papel y celular sirven)
└── verificar.mjs      ← NUEVO. los ~40 asserts sobre el DOM pintado
```

**El orden en que se pega** (importa tanto como el contenido):

1. **Subir** `_ds/villa/` y `assets/`. Que los tenga antes de leer nada.
2. **Pegar la ARMADURA sola**, como primer mensaje, y esperar. No enterrada en la
   línea 1174 de otra cosa: sola.
3. **Pegar el `PROMPT.md`** — pantallas con su propósito, estado congelado,
   criterios, autochequeos al final.
4. **Pegar `assets/LISTA.md`** como segundo mensaje.
5. **Subir `antes/` y `no/`** con sus dos rótulos: *"así se ve hoy"* y *"esto es
   lo que NO"*.
6. **Pedir** las 5 pantallas a 390×844 en un solo `.html` autocontenido.
7. **Correr `verificar.mjs`** sobre el resultado y anotar la fila en la bitácora,
   con la palabra exacta del dueño y el canal en que la dijo.

**Y la única métrica de progreso que importa:** en la próxima entrega, el
`PROMPT.md` tiene que pesar **menos** que los 101.608 B de hoy, y la carpeta
tiene que pesar **más**.
