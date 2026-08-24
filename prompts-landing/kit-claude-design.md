# Kit de calidad para Claude Design

**Qué es esto:** la lista de elementos que puedes entregarle a un generador de
diseño para que produzca páginas de mucha más calidad que las que hace hoy.
No es teoría: cada elemento está atado a un fallo real que evita, medido en los
tres intentos de la vitrina de Villa Broaster (v1, v2 rechazado, v3).

**La idea que lo ordena todo:** un generador de diseño no falla por falta de
talento, falla por **falta de restricciones**. Donde tú no decides, él decide
por ti con su promedio — y su promedio es exactamente lo que vas a rechazar por
"genérico y apagado". Cada elemento de esta lista es una decisión que le quitas.

---

## Nivel 0 — Lo que ya tienes y deberías estar entregando siempre

### 1. Las fotos reales del producto, medidas
- **Qué es:** los PNG/JPG del producto, con sus dimensiones reales anotadas y —
  esto es lo que casi nadie hace— **la advertencia de qué tienen de raro**.
  Ejemplo real: las 9 fotos de Villa Broaster son 1254×1254 RGB **sin canal
  alfa**, con la sombra incrustada en el fondo blanco.
- **Por qué sube la calidad:** sin ese dato, el generador finge recortes que no
  existen y te devuelve manchas negras o halos. Con el dato, el v3 pudo
  convertir el problema en el concepto: la foto se funde en un charco ámbar con
  `mix-blend-mode: multiply` y el fondo blanco **desaparece** dentro del aceite.
- **Cómo se consigue:** ya están en `docs/identidad/fotos-productos/`. Medir
  ancho/alto y si tienen alfa toma dos minutos con Node.
- Esfuerzo bajo · **Impacto alto**

### 2. La paleta con contrastes **calculados**, no estimados
- **Qué es:** los hex exactos y, junto a cada par que vas a usar, su ratio WCAG
  ya calculado (crema `#f7ece1` sobre noche `#0a0a0a` = 17.01, etc.).
- **Por qué sube la calidad:** un generador "estima" el contraste y falla; con
  la tabla no tiene que estimar, y de paso te obliga a ti a descubrir que el
  naranja de marca no pasa sobre el fondo claro.
- **Cómo se consigue:** una función de 10 líneas; ya se hizo para Orama y para
  Villa Broaster.
- Esfuerzo bajo · **Impacto alto**

### 3. Los datos del negocio con su origen `archivo:línea`
- **Qué es:** cada hecho (marca, sedes, precios, formas de pago) citado a la
  línea del código de donde sale, y lo que **no** esté citado marcado como hueco.
- **Por qué sube la calidad:** es la única defensa contra la mentira verosímil.
  Un builder barato ya inventó una vez la ciudad "Rionegro" en las keywords SEO
  de este mismo negocio. Lo verosímil es la forma que tiene una mentira útil.
- Esfuerzo medio · **Impacto alto**

---

## Nivel 1 — Lo que cambia el resultado de un intento a otro

### 4. La armadura contra su design system
- **Qué es:** un bloque, **arriba del todo, antes de los datos**, que le prohíbe
  en imperativo anclar, adjuntar, generar o "derivar" cualquier design system;
  que le ordena sacar todos los tokens de tu apartado de paleta; y que veta
  explícitamente el fondo claro a pantalla completa y las fotos en blanco y negro.
- **Por qué sube la calidad:** es el fallo número uno, medido. El entregable del
  v2 traía una carpeta `_ds/modernist-<uuid>/` que el generador **se autoimpuso**:
  fondo `#f3f2f2`, radio 0, tipografía Archivo y la instrucción de imprimir las
  fotos en blanco y negro. Ese sistema le ganó a la dirección de arte del prompt.
- Esfuerzo bajo · **Impacto muy alto**

### 5. Autochequeos que el propio generador se aplica
- **Qué es:** una lista de preguntas verificables que él mismo debe responderse
  antes de entregar. *"Abre tu lámina: ¿el fondo de la portada es oscuro? Si es
  claro, está mal."*
- **Por qué sube la calidad:** convierte tu criterio en algo que el ejecutor
  puede comprobar solo. Un criterio comprobable vale más que diez adjetivos.
- Esfuerzo bajo · **Impacto alto**

### 6. El estado congelado de todo lo que se mueve
- **Qué es:** por cada cosa que describas con movimiento, la descripción de cómo
  se ve **detenida** (la pieza siguiente asomando cortada por el borde, la promo
  a medio armar, el foco ya puesto sobre el producto).
- **Por qué sube la calidad:** el lienzo devuelve láminas estáticas. Medido:
  `document.getAnimations()` = **1** en toda la página del v2. Las diez
  animaciones que se pidieron no existieron nunca, y los dos mecanismos que
  dependían de gesto quedaron invisibles.
- Esfuerzo medio · **Impacto muy alto**

### 7. La coreografía en un anexo aparte
- **Qué es:** el inventario de animaciones con milisegundos y curvas, rotulado
  "para la fase de código", dirigido a quien lo programe después.
- **Por qué sube la calidad:** no se pierde el trabajo de diseño de movimiento,
  pero deja de contaminar el encargo al lienzo. Cada destinatario recibe lo suyo.
- Esfuerzo bajo · **Impacto medio**

### 8. Entrega por pantallas, no "una landing"
- **Qué es:** pedir las 5 pantallas del recorrido (portada, catálogo, detalle,
  carrito/pago, confirmación), cada una con su **propósito de venta** declarado.
- **Por qué sube la calidad:** "una landing" produce un póster; "la pantalla que
  tiene que hacer que toque Pedir sin scrollear" produce una decisión de diseño.
- Esfuerzo bajo · **Impacto alto**

### 9. Criterios de aceptación medibles a 390×844
- **Qué es:** condiciones que se comprueban con un número, no con una opinión:
  sin desborde horizontal (`scrollWidth == clientWidth`), tap targets ≥ 40 px,
  contraste ≥ 4.5, número de sellos EJEMPLO = número de precios visibles.
- **Por qué sube la calidad:** hace la revisión objetiva y te permite rechazar
  con evidencia en vez de con "no me gusta", que es irrepetible.
- Esfuerzo medio · **Impacto alto**

---

## Nivel 2 — Lo que hay que construir una vez y sirve para siempre

### 10. Una biblioteca de referencias fichadas
- **Qué es:** por cada referencia visual que te guste, una ficha que separe **el
  mecanismo reutilizable** (composición, movimiento, uso del color) de **lo que
  jamás se copia** (marca, textos, imágenes ajenas), más su traducción al negocio
  y sus riesgos en móvil.
- **Por qué sube la calidad:** te deja combinar 2-3 referencias por página —una
  manda el hero, otra el catálogo, otra el cierre— en vez de imitar una sola. Y
  al anotar el veredicto por ficha, las combinaciones mejoran solas.
- **Dónde está:** `ORION/prompts-landing/referencias/` (índice + 3 fichas con su
  veredicto ya anotado).
- Esfuerzo alto la primera vez · **Impacto alto y creciente**

### 11. Componentes reales del repo como referencia de verdad
- **Qué es:** entregarle el código de los componentes que ya existen y funcionan
  (la tarjeta de producto, la hoja de checkout) y los tokens de `globals.css`.
- **Por qué sube la calidad:** el diseño se vuelve **implementable** en vez de
  bonito-pero-ajeno, y el desarrollador no tiene que traducir nada.
- Esfuerzo bajo · Impacto medio

### 12. Capturas del producto vivo
- **Qué es:** PNG del estado actual a 390×844, tomadas por CDP (no la vista
  previa embebida, que tiene piso de ancho y miente).
- **Por qué sube la calidad:** el generador ve el punto de partida real y el
  rediseño respeta el flujo que ya funciona en vez de reinventarlo.
- Esfuerzo bajo · Impacto medio

---

## Lo que NO debes darle (empeora el resultado)

- **Adjetivos sin números.** "Moderno", "llamativo", "premium" son instrucciones
  vacías: las resuelve con su promedio.
- **Su propio design system, o permitirle proponer uno.** Ver el elemento 4.
- **Referencias completas para "que se parezca a esto".** Copia lo accesorio
  (marca, textos, paleta ajena) y pierde el mecanismo, que es lo único valioso.
- **Datos de ejemplo sin marcar como ejemplo.** Terminan publicados y alguien
  los reclama en el mostrador al día siguiente.
- **Fotos de banco de imágenes.** En un negocio de barrio se notan a un
  kilómetro y matan la confianza que la página estaba construyendo.
- **Un encargo largo sin jerarquía.** Si todo es importante, nada lo es: pon la
  armadura arriba, los datos en el medio y los criterios de aceptación al final.

---

## Cómo se usa este kit

La carpeta que le entregas hoy al generador está en
`villa-broaster/docs/claude-design/` y ya tiene la forma correcta: `README.md`
(el orden en que se pega), `PROMPT.md` (el encargo con sus 12 apartados y los
dos anexos), `MARCA.md` (tokens y qué es real vs ejemplo) y `assets/` (las fotos
con su `LISTA.md` de qué foto va en qué pantalla y con qué tratamiento).

Ese es el patrón para cualquier proyecto: **una carpeta, cuatro piezas.**
