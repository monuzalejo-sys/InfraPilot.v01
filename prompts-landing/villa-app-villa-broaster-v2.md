# PROMPT v2 — Rediseño completo de la vitrina móvil de VILLA BROASTER (villa-app)

> Destinatario: **Claude Design**. Copiar desde la línea de guiones hacia abajo y pegarlo
> completo. Las 9 fotos van adjuntas en `assets/` (ver apartado 1 y `assets/LISTA.md`).
> Supera al prompt anterior (`docs/Prompt-Claude-Design-VillaApp.md`), que presentaba
> horarios y precios de EJEMPLO como "datos reales, úsalos tal cual" — eso está corregido aquí.

---

Eres diseñador de producto senior de apps de comida en Colombia. Vas a rediseñar **la
vitrina pública de Villa Broaster** (`villa-app`), la página por la que un vecino con hambre
pide pollo desde el celular. **Móvil es el canal principal**: se llega desde estado de
WhatsApp, Facebook y un QR en la bolsa del domicilio. Diseñas **cinco pantallas a 390×844**,
no una landing suelta.

Reglas de partida, antes de cualquier idea:

- **Cada dato que escribas tiene que poder señalarse en el código.** Abajo, cada hecho va con
  su `archivo:línea`. Lo que no esté citado no existe: va al apartado 9 como hueco.
- **Lo que es de EJEMPLO se llama de EJEMPLO.** La carta de 23 productos y sus precios son
  semilla de prototipo, no la carta del negocio. En la maqueta se usan como maniquí y con la
  marca visible que dice que lo son (apartado 8).
- **La vitrina VENDE. La app por dentro es otra cosa.** Aquí el producto es el protagonista,
  hay color y movimiento con gusto e interacción real. Nada de neones, azules, morados ni
  gradientes tecnológicos.

---

## 1. EL NEGOCIO (todo con origen)

| Hecho | Valor | Origen |
|---|---|---|
| Marca (REAL, cliente real) | **Villa Broaster** | `villa-app/lib/marca.ts:16` |
| Eslogan (REAL) | **"Pollo broaster hecho por tandas"** | `villa-app/lib/marca.ts:17` |
| Sede 1 | **Villa del Viento** · "Barrio Villa del Viento" · "El local de toda la vida, en pleno barrio." | `lib/marca.ts:38, 39, 41` |
| Sede 2 | **Vía al Bosque** · "Sobre la vía al Bosque" · "A la orilla de la vía, con parqueadero." | `lib/marca.ts:46, 47, 49` |
| Nunca se dice "local 1 / local 2" de cara al cliente | regla escrita en el propio código | `lib/marca.ts:9-10` |
| Se paga al recibir, en efectivo o transferencia. No hay pago en línea | copy que ya está en producción | `components/orden/Confirmacion.tsx:217`, `components/tienda/HojaCheckout.tsx:109` |
| No hay que crear cuenta ni registrarse | "Pedir pollo no puede costar un registro" | `components/tienda/HojaCheckout.tsx:5-8` |
| El domicilio es el canal prioritario; "recoger" es el segundo | el canal arranca en `domicilio` | `components/tienda/HojaCheckout.tsx:10-13, :55` |
| El pedido tiene número que se canta en el mostrador: `L1-0042` | `Orden.numero` | `villa-app/types/dominio.ts:88-89` |
| Estados en vivo: "Pedido recibido" → "En el aceite" → "Listo" → "Entregado" / "Pedido cancelado" | textos ya redactados | `components/orden/Confirmacion.tsx:30-53` |
| Precio SIEMPRE por sede (`precioPorLocal[sede]`), nunca "el precio" | contrato del dominio | `types/dominio.ts:31-33`, `components/tienda/TarjetaProducto.tsx:100-102` |
| Deep link de campaña `?sede=1` / `?sede=2` ya funciona | lectura del parámetro | `villa-app/lib/carrito.ts:155-165` |
| Cinco categorías | Presas · Combos · Familiar · Acompañantes · Bebidas | `types/dominio.ts:36-49` |

**MARCADO COMO EJEMPLO — no es la carta del negocio.** Los 23 productos y sus precios salen
de `broaster-app/data/seed/productos.json`, y el propio código dice: *"NO son los precios de
este negocio"* (`broaster-app/lib/servidor/almacen-disco.ts:360-366`). Se usan en la maqueta
como maniquí, con la marca de ejemplo visible. Los que vas a ver en pantalla:

- Presas: Presa de pierna $8.500 (`seed:3`) · Presa de contramuslo $9.000 (`seed:11`) · Presa de pechuga $11.500 (`seed:19`) · Presa de ala $6.500 (`seed:27`).
- Acompañantes: Papa a la francesa $7.500 (`seed:106`) · Arepa $3.000 (`seed:120`) · Papa criolla $8.500 (`seed:98`).
- Familiar: Balde 8 presas $74.900 (`seed:66`) · Balde 12 presas $106.900 (`seed:82`).
- Combos: Combo personal 1 presa $17.900 (`seed:34`).

**MARCADO COMO PROTOTIPO — promos y cupones.** Las 4 promos pedibles y los 3 cupones de local
están escritos a mano en la vitrina y el archivo dice de sí mismo *"DATOS ESTÁTICOS DEL
PROTOTIPO… cuando existan de verdad, este archivo se borra"* (`villa-app/lib/promos.ts:2-7`,
`:56`, `:102`). Los códigos `VB-VIENTO-01`, `VB-BOSQUE-01`, `VB-TANDA-05` **son inventados del
prototipo**: en la maqueta van con marca de ejemplo y **jamás se publican así**.

**LAS FOTOS (esto es lo nuevo y es el material de la landing).** 9 archivos en
`docs/identidad/fotos-productos/`, todos **1254×1254 px, PNG RGB sin canal alfa, 1.5–2.0 MB**
(verificado leyendo la cabecera IHDR de cada archivo): fondo blanco, un solo producto
centrado en tres cuartos, con una sombra suave gris **incrustada** en el fondo.

| Foto | ¿Tiene producto en la carta de ejemplo? | id | Uso |
|---|---|---|---|
| `pechuga-apanada.png` | sí — Presa de pechuga (`seed:19`) | `presa-pechuga` | héroe (1ª) + cierre |
| `contra-muslo-apanado.png` | sí — Presa de contramuslo (`seed:11`) | `presa-contramuslo` | héroe (2ª) + carta |
| `ala-apanada.png` | sí — Presa de ala (`seed:27`) | `presa-ala` | héroe (3ª) + carta |
| `papas-fritas.png` | sí — Papa a la francesa (`seed:106`) | `acomp-papa-francesa` | héroe (4ª) + promos |
| `arepa.png` | sí — Arepa (`seed:120`) | `acomp-arepa` | héroe (5ª) + promos |
| `muslo-apanado.png` | **NO** (la carta tiene "pierna", no "muslo") | — | **reservada** (hueco H-2) |
| `filete-de-pollo-apanado.png` | **NO existe en la carta** | — | **reservada** (H-2) |
| `filete-de-cerdo-apanado.png` | **NO existe en la carta** | — | **reservada** (H-2) |
| `papa-horneada.png` | **NO existe en la carta** | — | **reservada** (H-2) |

**Regla dura de las fotos reservadas:** una foto de comida en una carta se lee como "esto se
puede pedir". Las cuatro reservadas **no aparecen en ninguna pantalla** hasta que el dueño
confirme que existen y con qué precio. No las uses ni de adorno ni de fondo.

---

## 2. QUIÉN MIRA Y QUÉ DEBE HACER

**Quién.** Una persona del pueblo, 7 de la noche, con hambre y el celular en una mano. Puede
no haber pedido comida por internet nunca y sospecha que le van a pedir tarjeta. Llega desde
una campaña, casi siempre con `?sede=1` o `?sede=2` ya puesto en el enlace.

**Qué debe sentir, en este orden:** (1) **hambre** — el pollo está saliendo del aceite ahora;
(2) **cercanía** — es el local del barrio, no una app rara; (3) **confianza** — no hay que
registrarse ni pagar por internet.

**UNA sola acción principal: PEDIR.** El botón dice **"Pedir ahora"** en el héroe y **"Ver
carrito · $XX.XXX"** cuando ya hay algo. Todo lo demás se ve subordinado: otro tamaño, otro
peso, otro color. Dos CTAs peleando = ninguno.

**Acción secundaria, callada y al final:** dejar el correo/celular en la lista (`POST
/api/suscriptores` existe: `broaster-app/app/api/suscriptores/`). Nunca compite con "Pedir".

---

## 3. EVIDENCIA REAL (lo único que hoy se puede probar)

**No hay testimonios, ni reseñas, ni estrellas, ni años de trayectoria, ni "más de X familias".**
Las 8 órdenes que existen en `broaster-app/data/ordenes.json` son de QA (`"PRUEBA QA
Cliente1"`) y hay **1** suscriptor. Cualquier cifra social es mentira. Lo que sí se puede
mostrar:

1. **"Hecho por tandas"** — eslogan real (`lib/marca.ts:17`) y, además, el argumento de
   frescura de un asadero. Es el eje del rediseño.
2. **Dos sedes con carácter distinto** — una de barrio "de toda la vida", otra sobre la vía
   "con parqueadero" (`lib/marca.ts:41, :49`).
3. **No pagas nada por internet y no creas cuenta** (`HojaCheckout.tsx:109`, `:5-8`). Para
   este público es el argumento de confianza más fuerte que existe.
4. **El pedido tiene número real y estado en vivo** (`types/dominio.ts:88-89`,
   `Confirmacion.tsx:30-53`): prueba de que esto no es un formulario que cae en un correo.
5. **Las fotos**: es la primera vez que el proyecto tiene imagen de producto propia. La foto
   ES la evidencia; que sea lo más grande y lo más brillante de la pantalla.

---

## 4. LAS CINCO PANTALLAS, UNA POR UNA

Todo a **390×844**, columna de 480 px máximo en escritorio (`app/globals.css:151-158`).

### Pantalla 1 · PORTADA — "El pollo sale ahora" (reemplaza el encabezado actual)
*Propósito de venta: dar hambre en 2 segundos y dejar el botón de pedir al alcance del pulgar
sin scrollear.*

Hoy el encabezado es una fila de 11 px de logo + selector de sede (`Encabezado.tsx:37-87`).
Se convierte en un **héroe a `100dvh`** con carrusel de 5 fotos (mecanismo de la ficha 01,
apartado 11):

- **Fondo:** `radial-gradient(120% 90% at 50% 22%, var(--brasa) 0%, #1a0e0a 55%, #0a0a0a 100%)`.
  `--brasa` cambia con el producto activo; se declara con
  `@property --brasa { syntax: '<color>'; inherits: true; initial-value: #7a3218 }` para que
  **el color pueda transicionar** (un `background-image` no transiciona, una custom property
  registrada sí). Tonos por producto, tomados de los que ya existen en el código
  (`components/tienda/ArteProducto.tsx:21-25`): presas `#7a3218`, combos `#7d2028`, familiar
  `#804a10`, acompañantes `#635424`, bebidas `#4e4430`.
- **Texto fantasma:** `BROASTER` en display condensada, `clamp(84px, 26vw, 150px)`, color
  `#f7ece1` al **10 %** de opacidad, `top: 17%`, una sola línea, `letter-spacing: -0.02em`.
  Es textura, no lectura: las fotos lo tapan.
- **El producto sobre un "plato":** cada foto va centrada en un disco crema
  (`radial-gradient(circle at 38% 32%, #f7ece1, #e3d3c0 70%, #cdbba6 100%)`) de **300 px** en
  el centro y **96 px** en los laterales. *Por qué el plato:* las fotos vienen con fondo
  blanco y **sin canal alfa**, así que sobre negro se verían como recortes cuadrados sucios;
  el disco convierte ese blanco en un objeto físico (un plato) en vez de un error. Cuando
  existan los recortes con alfa (tarea de identidad, T-08), el plato se queda igual y la foto
  simplemente se apoya encima: el diseño no cambia.
- **Anclaje:** disco central `bottom: 24%`, laterales `bottom: 34%` con `blur(2px)` y opacidad
  0.85; el de más atrás, 72 px con `blur(4px)`.
- **Bloque de venta, abajo a la izquierda** (máx. 300 px de ancho): nombre del producto activo
  en 22 px/800; debajo, el precio de la sede activa en **naranja `#ff8a20` sobre píldora
  `#141414`** (ver apartado 5: el naranja NO pasa contraste sobre la brasa clara).
- **CTA único, ancho completo:** "Pedir ahora" — relleno `#e01e2b`, texto blanco, alto 52 px,
  radio 18 px, a 24 px del borde inferior seguro. Agrega el producto activo al carrito y baja
  a la carta.
- **Píldora de sede arriba** (44 px de alto): "Pides en **Villa del Viento** · 25 – 35 min",
  toca y abre la hoja de sedes. Con `?sede=2` arranca en "Vía al Bosque".
- **Flechas circulares de 44 px abajo a la derecha** + **swipe horizontal**: las dos, no una.
- **Puntos de posición** (5 puntos de 6 px, el activo 18 px de ancho en naranja).

### Pantalla 2 · CARTA
*Propósito: que se pida en dos toques y que la foto haga el trabajo que hoy hacen unas
iniciales.*

- **Chips sticky** (`Categorias.tsx:113-138` ya son sticky con `backdrop-blur`): "Toda la
  carta · Presas · Combos · Familiar · Acompañantes · Bebidas". Activo = relleno naranja con
  texto `#0a0a0a` (8.40:1). Alto de toque **40 px** mínimo.
- **Promos arriba de la carta**, en dos filas horizontales que ya existen: "Promos de la casa"
  (pedibles) y "Solo en el local" (cupones troquelados, con las muescas reales recortadas por
  máscara — `globals.css:187-208`, no lo reinventes). **Sin descuentos tachados, sin
  "antes/ahora"**: el servidor congela precios y no sabe de descuentos
  (`lib/promos.ts:14-24`). La promo se vende por lo que TRAE, no por lo que ahorra — y ahí
  entra la innovación 1 (apartado 6).
- **Tarjeta de producto:** hoy es texto a la izquierda y un cuadro de 88 px con iniciales a la
  derecha (`TarjetaProducto.tsx:123-160`, `ArteProducto.tsx:1-8`). Rediséñala con **la foto
  real en un disco de 96 px**, nombre 15 px/700 `#f7ece1`, descripción 12.5 px `#b9aaa0` a dos
  líneas, precio 15.5 px/800 `#ff8a20`, y el botón **+** de 40 px relleno `#e01e2b` montado
  sobre la esquina inferior derecha del disco. Los productos sin foto (la mayoría) conservan
  el panel de iniciales con su tono de categoría: **la carta convive con fotos y sin fotos, y
  no se puede ver rota** — dibuja las dos variantes.
- Alto objetivo de tarjeta: 112–120 px. Fila completa visible sin scroll por producto.

### Pantalla 3 · PRODUCTO (hoja) — **pantalla NUEVA**
*Propósito: para el balde y los combos, donde la decisión es "¿alcanza para cuántos?".*

Ojo: **hoy no existe** (`Tienda.tsx:49` solo tiene hojas `sedes | carrito | pago`). Se diseña
como maqueta; implementarla agrega estado y por eso queda condicionada a aprobación del senior
(ver apartado 7). Contenido: foto grande sobre plato de 220 px, nombre, descripción real del
catálogo, precio por sede, selector de cantidad (− 1 +, botones de 44 px), y **"Agregar ·
$XX.XXX"** ancho completo. Nada de "también te puede gustar" con productos inventados.

### Pantalla 4 · CARRITO + PAGO (hojas que suben)
*Propósito: no perder a nadie en el último metro.*

- Hoja: sube desde abajo (`animate-subir 0.28s cubic-bezier(0.2,0.9,0.3,1)`,
  `globals.css:73-76, :94`), `max-h: 88dvh`, radio superior 28 px, agarradera de 40×4 px
  (`Hoja.tsx:63-67`). No la cambies: ya está bien resuelta.
- Carrito: línea por producto con miniatura de 44 px, cantidad editable, total abajo y
  **"Se paga al recibir."** (`HojaCarrito.tsx:66`).
- Pago: **una sola pantalla, cinco campos** — nombre, teléfono, dirección (protagonista
  porque el domicilio manda), notas; conmutador Domicilio / Recoger con Domicilio por defecto
  (`HojaCheckout.tsx:55`); subtítulo "Pedido de {sede} · se paga al recibir"
  (`HojaCheckout.tsx:96`); y el remate "No pagas nada ahora. Se paga al recibir."
  (`HojaCheckout.tsx:109`). Los errores son los que ya están escritos: "¿Cómo te llamas?",
  "Déjanos un teléfono para llamarte.", "Necesitamos la dirección para llevártelo."
  (`HojaCheckout.tsx:68-74`).

### Pantalla 5 · CONFIRMACIÓN (`/orden/[id]`)
*Propósito: que la espera se sienta acompañada y que la próxima vez vuelva.*

Número grande `L1-0042` (`types/dominio.ts:88-89`), estado en vivo con sus textos reales
(`Confirmacion.tsx:30-53`) — el estado `preparando` se llama **"En el aceite"** y merece la
pieza visual más cálida de toda la app —, a dónde se lleva o dónde se recoge, el detalle de
líneas con precios congelados, total, "Se paga al recibir, en efectivo o transferencia."
(`Confirmacion.tsx:217`), y dos botones: "Actualizar estado" (secundario) y "Pedir algo más"
(rojo). Aquí abajo, y **solo aquí**, la invitación a dejar el correo.

---

## 5. REGISTRO VISUAL Y PALETA (con contraste medido, no estimado)

Registro: **noche cálida de asadero**. Fondo oscuro para que la comida sea lo único que
brilla; el rojo como relleno de marca y el naranja como voz de los precios. Densidad media:
aire generoso arriba (héroe) y ritmo apretado en la carta, que es donde se compra.

**Tokens que YA existen y no se tocan** (`app/globals.css:30-51`): `--noche #0a0a0a`,
`--base #141414`, `--carta #212121`, `--carta-alta #2b2b2b`, `--linea #363130`,
`--crema #f7ece1`, `--crema-suave #b9aaa0`, `--tenue #998a81`, `--rojo #e01e2b`,
`--rojo-hondo #7d0f18`, `--rojo-vivo #ff3b30`, `--naranja #ff8a20`, `--naranja-suave #ffb066`,
`--verde #4ade80`, `--radio 18px`. Todo lo nuevo se agrega, no se reemplaza.

Contrastes calculados para este rediseño (WCAG 2.1, luminancia relativa; **no los redondees
hacia arriba**):

| Fondo | crema `#f7ece1` | crema-suave `#b9aaa0` | naranja `#ff8a20` | blanco | noche `#0a0a0a` |
|---|---|---|---|---|---|
| `#0a0a0a` noche | 17.01 | 8.79 | 8.40 | 19.80 | — |
| `#141414` base | 15.83 | 8.18 | **7.81** | 18.42 | — |
| `#212121` carta | 13.83 | 7.15 | 6.83 | 16.10 | — |
| `#2b2b2b` carta-alta | 12.16 | 6.28 | 6.01 | 14.16 | — |
| `#e01e2b` rojo | 4.11 | 2.12 | 2.03 | **4.78** | 4.14 |
| `#7a3218` brasa presas | 7.85 | 4.06 | **3.88 ✗** | 9.14 | — |
| `#7d2028` brasa combos | 8.55 | 4.42 | **4.22 ✗** | 9.96 | — |
| `#804a10` brasa familiar | 6.21 | 3.21 | **3.07 ✗** | 7.23 | — |
| `#635424` brasa acompañantes | 6.39 | 3.30 | **3.15 ✗** | 7.44 | — |
| `#ff8a20` naranja | 2.03 | 1.05 | — | 2.36 | **8.40** |

**Las tres trampas que salen de esa tabla, y su solución obligatoria:**

1. **El naranja NO se lee sobre ninguna brasa** (3.07–4.22). El precio del héroe va **sobre
   píldora `#141414`** (7.81) o sobre `#0a0a0a` (8.40). Nunca naranja directo sobre el
   degradado claro.
2. **crema-suave `#b9aaa0` falla sobre familiar y acompañantes** (3.21 / 3.30). En el héroe,
   el texto secundario es crema `#f7ece1` (6.21 mínimo) o va sobre píldora oscura.
3. **Sobre rojo `#e01e2b` solo va blanco** (4.78) y solo en texto ≥ 15 px en negrita. Nada de
   crema sobre rojo (4.11) para texto pequeño.

**Tipografía.** Cuerpo: la que ya usa la app (`system-ui, -apple-system, "Segoe UI", Roboto`,
`globals.css:112`), 16 px base, interlínea 1.45. Display (texto fantasma, número de orden,
cifras grandes): condensada pesada, stack
`"Anton", "Archivo Black", "Haettenschweiler", "Arial Narrow", system-ui`. **Anton está
pendiente de aprobación de identidad** (`docs/referencias/hero-carrusel-toonhub.md:16`): en la
maqueta puedes cargarla, pero el diseño tiene que verse bien con el respaldo — dibuja las dos.

**Grano.** Una capa de ruido SVG `fractalNoise baseFrequency=0.9 numOctaves=4`, opacidad total
**0.04** (no 0.4: sobre negro ensucia), `background-size: 200px`, `pointer-events: none`, solo
en el héroe. Da textura de papel de asadero y mata el bandeado del degradado.

---

## 6. INTERACCIÓN — inventario cerrado (cada una se justifica o se cae)

Numeradas, con elemento, disparador, duración y curva. Si no está en esta lista, no se anima.

| # | Elemento | Disparador | Qué hace | ms / curva | Por qué VENDE |
|---|---|---|---|---|---|
| A1 | 5 discos del héroe | swipe / flecha / tap lateral | rotan roles (centro↔lados↔fondo): `transform`, `opacity`, `filter` | 650 · `cubic-bezier(.4,0,.2,1)` | pasa 5 productos en 3 segundos sin scrollear |
| A2 | `--brasa` del fondo | el mismo | el fondo entero cambia de ánimo con el producto | 650 · misma curva | cada producto tiene "su" color: el cambio se siente, no se lee |
| A3 | texto fantasma `BROASTER` | el mismo | se desplaza 24 px en sentido contrario | 650 · misma curva | da profundidad y refuerza la marca sin ocupar espacio de venta |
| A4 | nombre + precio | fin de A1 | fade + subida de 8 px | 260 ease-out, retraso 120 | el precio "aterriza" después de la foto: primero antojo, después número |
| A5 | **la promo se arma sola** (innovación 1) | tap en la tarjeta de promo | las fotos de lo que incluye entran volando desde los bordes y se acomodan sobre el plato; luego el botón pasa a "va en tu pedido" | 420 · `cubic-bezier(.2,.9,.3,1)`, escalonado 70 ms | es la ÚNICA forma honesta de que una promo se sienta oferta cuando está prohibido el descuento tachado: se ve **cuánta comida es** |
| A6 | **el foco que calienta** (innovación 2) | arrastre del dedo sobre la pieza de cierre | una máscara radial de 150 px sigue al dedo; dentro, la foto va a color pleno y `brightness(1.15)`; fuera, `brightness(.35) saturate(.5)` | sin transición: sigue al dedo con suavizado 0.18 | "acabado de salir del aceite" hecho gesto; el dedo destapa el antojo y termina en el CTA |
| A7 | producto → barra del carrito | tap en **+** | la foto se encoge a 0.28 y viaja a la barra; la barra "late" | 380 · `cubic-bezier(.2,.9,.3,1)` + `latir 0.4s` (`globals.css:83-86`) | confirma el toque sin tapar la carta (hoy es un aviso de texto: `Tienda.tsx:189-198`) |
| A8 | hojas (sedes/carrito/pago) | tap | suben desde abajo | `subir 0.28s` (`globals.css:73-76`) | ya existe y funciona: no lo cambies |
| A9 | estado de la orden | llega dato del polling | `revelar 0.3s` (`globals.css:88-91`) | el pedido se siente vivo | |
| A10 | todo lo tocable | `:active` | `scale(.97)` 120 ms (`.presionable`, `globals.css:176-179`) | única confirmación táctil que hay sin teclado | |

**Presupuesto:** máximo **8 elementos animando a la vez**; `will-change` solo en los 5 discos
y **solo mientras dura A1**; se anima **únicamente** `transform`, `opacity`, `filter` (blur
máx. 4 px) y `--brasa`. **Prohibido animar** `width`, `height`, `top`, `left`, `margin`,
`box-shadow` y `backdrop-filter`. Bloqueo `isAnimating` de 650 ms para que 5 toques seguidos
no encadenen transiciones.

**Las dos ideas que sorprenden, explicadas en una línea cada una:**

- **Innovación 1 — "La promo se arma en pantalla":** al tocar "Martes de balde", las fotos de
  papas + presa + arepa vuelan al centro y componen el plan; vende la curaduría en vez de un
  descuento que no existe (`lib/promos.ts:14-24`).
- **Innovación 2 — "El foco que calienta":** en el cierre, la foto está en penumbra y el dedo
  la va destapando en color caliente; termina justo encima del botón de pedir. Usa **una sola
  imagen** (no hay pares de fotos y no se inventan).

---

## 7. RESTRICCIONES TÉCNICAS REALES (verificadas)

- **Lo que existe:** Next **16.3.0**, React **19.2.4**, Tailwind **4**, TypeScript — y **cero
  dependencias más** (`villa-app/package.json:14-24`). No propongas `lucide-react`,
  `framer-motion`, GSAP ni ninguna librería: los iconos van en SVG inline como ya se hace
  (`Encabezado.tsx:43-51`).
- **Tu entregable:** **un único `.html` autocontenido** (CSS y JS dentro, sin build, sin CDN
  salvo la fuente display marcada como pendiente) que muestre las 5 pantallas a 390 px con un
  conmutador arriba, más las capturas. No entregas React: entregas la maqueta que después se
  porta.
- **Dónde aterriza después:** `villa-app/components/tienda/*.tsx`, `components/orden/
  Confirmacion.tsx` y `app/globals.css` **de forma aditiva**. Está **prohibido** tocar
  `villa-app/lib/**` (carrito, api, promos) — es la regla del proyecto para este rol
  (`tareas/T-06-vitrina-primer-pr.md`, "Archivos que NO"; `tareas/T-07-promos-y-hero.md`).
- **Estructura del layout:** la app no se estira en escritorio; se queda en columna centrada
  de 480 px sobre negro (`globals.css:147-158`). **Jamás una barra lateral** (regla dura del
  proyecto, `memory/villa-broaster/brief.md`).
- **Imágenes.** Las 9 llegan en PNG RGB de 1254×1254 y 1.5–2 MB: **así no se publican nunca**.
  Entrega y especifica tres tamaños por foto, en **WebP con alfa**:
  - héroe / plato grande: **900 px**, ≤ **150 KB**;
  - promo / hoja de producto: **420 px**, ≤ **60 KB**;
  - miniatura de carta: **160 px**, ≤ **25 KB**.
  Recorte con alfa y **la sombra gris incrustada se elimina** (sobre negro se ve como un halo
  sucio); la sombra se vuelve a dibujar en CSS: `box-shadow: 0 18px 40px rgba(0,0,0,.55)` bajo
  el plato. Peso total de la pantalla 1: **≤ 900 KB**. `loading="eager"` solo para la foto
  central; las otras cuatro, `lazy` + `decoding="async"`.
- **Alturas en `100dvh`**, nunca `100vh` (la barra del navegador móvil se come 60–80 px), y
  `env(safe-area-inset-top/bottom)` como ya se usa (`Encabezado.tsx:37`, `BarraCarrito.tsx:259`).
- **`prefers-reduced-motion`** ya está respetado globalmente (`globals.css:138-144`): tu diseño
  tiene que seguir vendiendo con todo quieto (apartado 12).

---

## 8. PROHIBIDO EN ESTE PROYECTO

1. **Azules eléctricos, morados, neones y gradientes tecnológicos.** Es un asadero, no una
   startup.
2. **Fotos de banco genéricas.** Se usan las 9 entregadas y nada más. Si falta una imagen, se
   resuelve con arte propio (paneles cálidos con iniciales, como `ArteProducto.tsx:20-25`).
3. **Precios tachados, "antes/ahora", porcentajes de descuento.** El servidor congela precios y
   no conoce descuentos: pintar uno sería cobrarle de más al cliente
   (`lib/promos.ts:14-24`; regla explícita de `tareas/T-07-promos-y-hero.md`).
4. **Datos inventados de cualquier tipo:** teléfonos, direcciones, NIT, ciudad, cobertura de
   domicilio, "20 años friendo", "más de 1.000 familias", estrellas, reseñas, testimonios,
   "el más vendido", banderas de "agotándose". Cero. (`brief.md`: "Cero datos inventados copy
   público".)
5. **Las 4 fotos reservadas** (muslo, filete de pollo, filete de cerdo, papa horneada) hasta
   que haya respuesta a H-2.
6. **Los códigos de cupón `VB-*` sin marca de ejemplo.**
7. **"Local 1 / Local 2"** de cara al cliente (`lib/marca.ts:9-10`).
8. **Barra lateral** en cualquier pantalla; **inglés** en la interfaz; **modales de bienvenida**
   o cualquier cosa que se interponga entre el dedo y la comida.
9. **Marca de agua obligatoria mientras la maqueta use datos de ejemplo:** una cinta discreta
   y **visible** al pie de la carta que diga "Carta y promos de EJEMPLO — pendientes los datos
   reales del cliente". Nada de esconderla en `sr-only`.

---

## 9. HUECOS DEL DUEÑO (esto es lo primero que hay que leer)

Ninguno se rellena con algo verosímil. Mientras falte, esa parte no se publica.

1. **H-1 · Carta y precios reales por sede.** Los 23 productos son semilla de ejemplo
   (`almacen-disco.ts:360-366`; PEND-003 del proyecto). *Por qué:* la vitrina lee precios en
   vivo, así que el día de publicar mostraría precios de ejemplo con el nombre del cliente
   encima.
2. **H-2 · Los 4 productos fotografiados que no están en la carta** — muslo apanado, filete de
   pollo, filete de cerdo, papa horneada. ¿Existen? ¿Cómo se llaman y cuánto valen? *Por qué:*
   son 4 de las 9 fotos, casi la mitad del material, y hoy no se pueden mostrar.
3. **H-3 · Origen y derechos de las 9 fotos.** ¿Son del negocio o son imágenes compradas o
   generadas? *Por qué:* la regla de la casa prohíbe stock genérico en una landing; y si el
   pollo real no se parece a esas fotos, la primera queja llega con la primera entrega.
4. **H-4 · Horarios reales de cada sede.** Los de 11:00–9:00 p.m. y 11:00–10:00 p.m. vienen del
   prototipo (`lib/marca.ts:40, :48`). *Por qué:* un horario falso manda gente a un local
   cerrado.
5. **H-5 · ¿Se confirman "25 – 35 min" y "30 – 40 min"?** El código dice: *"hoy nadie la
   calcula, la dice el dueño"* (`lib/marca.ts:31`). *Por qué:* en una portada eso se lee como
   compromiso.
6. **H-6 · Teléfono / WhatsApp de cada sede.** *Por qué:* media clientela va a querer escribir
   antes que llenar un formulario; sin ese dato la vitrina pierde su segundo canal.
7. **H-7 · Promos y cupones reales** (título, qué incluye, código, condición, vigencia). Los
   actuales son prototipo (`lib/promos.ts:2-7`). *Por qué:* un cupón publicado es una promesa
   que alguien reclama en el mostrador mañana.
8. **H-8 · Logo definitivo.** Hoy hay una "llama" SVG provisional (`Encabezado.tsx:43-51`) y un
   `icon.svg`. Es T-08. *Por qué:* el héroe necesita una marca que aguante 44 px y 16 px.
9. **H-9 · Fotos de las dos sedes y de la gente que fríe.** No existe ninguna. *Por qué:* sin
   ellas no hay sección "el local" y la cercanía queda solo en el texto.
10. **H-10 · Cobertura del domicilio, costo y pedido mínimo.** No están modelados en ningún
    lado. *Por qué:* "domicilio" sin decir hasta dónde genera pedidos que hay que cancelar.
11. **H-11 · Una frase de oficio verificable** (desde cuándo, quién fríe, qué lleva el
    apanado). *Por qué:* con ella el cierre pasa de correcto a memorable; sin ella, no se
    escribe nada.
12. **H-12 · Fuente display** (Anton u otra) — decisión de identidad, T-08.
13. **H-13 · ¿La portada-héroe va en la misma ruta `/` encima de la carta, o en ruta aparte?**
    *Por qué:* de eso depende a dónde apuntan las campañas y los QR, y si `?sede=` sigue
    aterrizando directo en la carta.

---

## 10. CRITERIOS DE ACEPTACIÓN (verificables, no opinables)

La verdad de terreno es **Edge headless por CDP**, no el navegador embebido: a 390 px,
`--screenshot` a secas devuelve un viewport de 492 px y recorta, y además reporta
`prefers-reduced-motion: reduce` por defecto. Herramienta:
`node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url <archivo.html> --width 390 --height 844 --mobile --shot salida.png --eval "<js>"`.

- **C1 · Sin desborde horizontal, en las 5 pantallas:**
  `--eval "document.documentElement.scrollWidth"` → **390** exacto (y `clientWidth` 390).
- **C2 · El héroe mide una pantalla:** el contenedor del héroe da **844 ± 4 px** de alto y usa
  `100dvh`. Verificable con `--eval "document.querySelector('[data-hero]').getBoundingClientRect().height"`.
- **C3 · El CTA está sobre el pliegue:** el borde inferior de "Pedir ahora" queda en **y ≤ 800**
  sin scrollear, con alto ≥ 52 px y ancho ≥ 320 px.
- **C4 · El producto manda:** el disco central mide **≥ 300 px** de alto en la captura, y es el
  elemento más claro de la pantalla 1 (revisar el PNG: la comida, no el texto).
- **C5 · La carta empieza pronto:** la primera tarjeta de producto arranca a **y ≤ 1500 px**
  del inicio del documento (menos de dos pantallas después del héroe).
- **C6 · Toques:** ningún control interactivo mide menos de **40×40 px**; los principales
  (flechas, +, CTA), **≥ 44×44**. Verificable recorriendo `document.querySelectorAll('button,a')`.
- **C7 · Peso:** ninguna imagen supera **150 KB**; la pantalla 1 completa pesa **≤ 900 KB**
  sumando todo lo que descarga.
- **C8 · Movimiento vivo:** con la emulación en `no-preference` se cuentan **entre 1 y 8**
  animaciones/transiciones activas durante el cambio de producto (`document.getAnimations().length`),
  ninguna infinita.
- **C9 · Movimiento apagado:** con `--reduce`, `document.getAnimations().length === 0`, las 5
  pantallas se entienden igual, el producto activo se ve completo y el CTA sigue en su sitio.
- **C10 · Contraste:** cada par texto/fondo nuevo va anotado con su ratio en un comentario CSS,
  como ya se hace en `globals.css:37-46`; ninguno baja de **4.5:1** (3:1 si el texto es ≥ 24 px
  en negrita). Especial atención a los cuatro casos marcados ✗ en el apartado 5.
- **C11 · Cero datos inventados:** buscar en el HTML entregado y que dé **0 resultados**:
  teléfonos, direcciones, "años", "familias", "clientes", "★", "reseña", "testimonio",
  "antes $", "%", "descuento", "muslo", "filete", "papa horneada". Y **1 resultado** para la
  cinta "Carta y promos de EJEMPLO".
- **C12 · Sin colores prohibidos:** ningún hex del entregable cae en azul/morado/violeta ni en
  neón; todos los colores o son tokens de `globals.css:30-51` o están en la tabla del apartado 5.
- **C13 · Trazabilidad:** cada texto visible se puede señalar en `lib/marca.ts`, en el catálogo
  de ejemplo, en `lib/promos.ts` o en este documento. Lo que no se pueda señalar, se borra.

---

## 11. REFERENCIAS COMBINADAS (una por zona, mecanismo y no contenido)

Biblioteca: `C:\Users\Kalel\ORION\prompts-landing\referencias\`. Se copia el **mecanismo**;
jamás la marca, los textos, las imágenes ni la paleta ajena.

**Zona HÉROE — ficha 01 (carrusel de figuras, "TOONHUB").** Se toma: los **cuatro roles
derivados de un índice** (centro nítido / laterales con blur 2 px / fondo con blur 4 px), la
**transición única de 650 ms `cubic-bezier(.4,0,.2,1)` que mueve todo a la vez**, el **fondo
que toma el color de la pieza activa**, el **texto fantasma gigante detrás** y el **bloqueo
`isAnimating`**. *Por qué vende:* el cliente pasa 5 productos en 3 segundos y cada uno cambia
el ánimo de la pantalla; el antojo se decide antes de leer nada. **No se toma:** "TOONHUB",
"3D SHAPE", el testimonio, las figuras ni sus pasteles `#F4845F/#6BBF7A/#E882B4/#6EB5FF` (el
azul y el rosa están prohibidos).

**Zona PROMO/CARTA — ficha 02 (scroll cinematográfico por capas, "Mostar").** Se toman **solo
dos mecanismos**, no el rail de 3700 px: (a) el patrón **"dato grande + una línea"** de los
paneles de historia, que aquí se usa para lo único que es verdad y vende — **"2 sedes ·
Villa del Viento y Vía al Bosque"** y **"$0 · lo que pagas por internet"** —; y (b) las
**capas que entran contra-escaladas** para componer una escena, que es exactamente el motor de
la innovación 1: las fotos de lo que trae la promo entran por capas y arman el plan.
*Por qué vende:* convierte una promo sin descuento en algo que se VE. **No se toma:** Mostar,
el azul `#79b7dd`, la fuente Ogg, el parallax de puntero (no existe en táctil) ni el rail
largo.

**Zona CIERRE — ficha 03 (spotlight que revela, "Lithos").** Se toma la **máscara radial suave
que sigue al puntero** y la **entrada escalonada blur-rise**. Adaptación honesta: como **no hay
pares de fotos** (una sola imagen por producto y no se inventan assets), el foco no revela una
segunda imagen sino que **calienta la misma**: fuera del foco `brightness(.35) saturate(.5)`,
dentro `brightness(1.15)` a color pleno. El acento cálido único del CTA es el `#e01e2b` de la
casa, no el naranja de la referencia. *Por qué vende:* el gesto de destapar es literalmente el
gesto del antojo, y termina con el dedo a un centímetro del botón de pedir. **No se toma:**
"Lithos", su copy, sus imágenes, ni el `canvas.toDataURL()` por frame (caro): se hace con
`mask-image: radial-gradient(circle 150px at var(--x) var(--y), ...)` moviendo variables.

**Mejora sobre la combinación candidata del índice:** el índice proponía la ficha 03 como
"pieza de antojo" genérica; aquí queda atada a una función concreta (el cierre que empuja al
CTA) y resuelta **sin segunda imagen**, que es lo que realmente hay en disco. Y la ficha 02
pasa de "dato grande" decorativo a ser el motor de la promo que se arma.

---

## 12. ADAPTACIÓN MÓVIL (390 px es el diseño, no la versión reducida)

| Mecanismo | A 390×844 |
|---|---|
| **Carrusel (01)** | El hover no existe: **swipe horizontal** (umbral 40 px, `touch-action: pan-y` para no secuestrar el scroll vertical) **+** flechas de 44 px **+** tap en los discos laterales. Escala del disco central 300 px (no la 1.68 de la referencia); laterales 96 px; el cuarto disco de fondo, 72 px. El párrafo largo de la referencia **se esconde** (en móvil nadie lee tres líneas con hambre): quedan nombre + precio. Los 5 puntos de posición reemplazan cualquier indicador de escritorio. |
| **Fondo que cambia (01)** | Igual en móvil, es barato: transiciona una custom property registrada, no una imagen. |
| **Texto fantasma (01)** | `clamp(84px, 26vw, 150px)`, **una sola palabra** (`BROASTER`); en escritorio cabrían dos, en 390 px se corta. Opacidad 10 % para que nunca compita con la foto. |
| **Capas / promo que se arma (02)** | El rail cinematográfico **no se usa**: la composición ocurre **dentro de la tarjeta de promo** (272 px de ancho, `Promos.tsx:98`) al tocarla, no al scrollear. Máximo **3 capas** volando; en móviles de gama baja (`navigator.hardwareConcurrency <= 4`) las piezas aparecen sin volar. |
| **Dato grande + línea (02)** | Dos bloques apilados, no en fila; cifra en display 44 px, línea en 13 px crema-suave sobre `#141414`. |
| **Spotlight (03)** | Sigue al **dedo** con `pointermove`, `touch-action: none` **solo dentro de esa pieza** (si se pone en la página, el usuario no puede scrollear). **Al cargar arranca visible sobre el producto** (50 % / 42 %), no escondido en (-999,-999): en móvil un foco invisible es un cierre sin gracia. Si no hay `pointer: fine` ni toque en 3 s, el foco **orbita solo** con una animación de 6 s. Radio 150 px (no 260: en 390 px de ancho, 260 destapa todo). |
| **Blur** | Máximo **4 px** y solo en dos elementos a la vez; `backdrop-filter` únicamente en la barra de chips, que ya lo tiene (`Categorias.tsx:116`). |
| **Toques** | Flechas, **+**, chips y CTA ≥ 44 px; nada interactivo por debajo de 40 px; separación mínima 8 px entre objetivos. |
| **Alturas** | `100dvh` en el héroe; hojas a `max-h: 88dvh` (`Hoja.tsx:63`); respeto de `env(safe-area-inset-*)` arriba y abajo. |
| **Peso** | Ver apartado 7: 900/420/160 px y ≤ 150/60/25 KB en WebP con alfa. La foto central es la única `eager`. |
| **`prefers-reduced-motion`** | A1–A3 se vuelven **cambio instantáneo** (sin transform, sin blur); A5 muestra la promo **ya armada**; A6 fija el foco al centro y muestra la foto en color pleno; A7 vuelve al aviso de texto que ya existe (`Tienda.tsx:189-198`). Nada de "sin animación, sin producto". |
| **Qué se mide** | C1–C13 del apartado 10, todos a 390×844 con `edge-cdp.mjs`, y las mismas capturas a 1280 px para confirmar que la columna de 480 px no se estira. |

---

**Entregable final:** un `.html` autocontenido con las 5 pantallas, las capturas a 390×844 de
cada una (Edge por CDP), la lista de assets exportados con su peso real, y una nota de una
línea por cada hueco H-1…H-13 que hayas tenido que rodear. Si algo no lo puedes citar,
no lo dibujes: pregúntalo.
