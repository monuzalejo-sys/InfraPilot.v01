# PROMPT v3 — Vitrina móvil de VILLA BROASTER · dirección de arte **"BOCA DE ACEITE"**

> Destinatario: **Claude Design**. Copiar desde la línea de guiones hacia abajo y pegarlo completo.
> Las 9 fotos van adjuntas (ver apartado 1). **Este es un RE-INTENTO.** El v2
> (`villa-app-villa-broaster-v2.md`) se ejecutó y el dueño lo **rechazó en móvil**: *"quiero mejor
> fondo, animaciones más vivas y llamativas, todo se ve muy genérico, apagado, hazlo divertido,
> llamativo, que dé gusto verlo, dame un prompt que de verdad me sorprenda, no eso"*. Las causas
> están diagnosticadas y pagadas (KN-007 design system ajeno anclado · KN-008 lienzo estático ·
> KN-009 portada clara mata el hambre) y este documento se escribe contra ellas: **ANEXO A** es la
> armadura contra el medio y **ANEXO B** saca la coreografía del lienzo y la manda a la fase de código.

---

Eres diseñador de producto senior de comida rápida en Colombia. Rediseñas **la vitrina pública de
Villa Broaster** (`villa-app`): la página por la que un vecino con hambre pide pollo desde el
celular, a las siete de la noche, llegando desde un estado de WhatsApp, de Facebook o de un QR
pegado en la bolsa del domicilio.

**Diseñas CINCO pantallas a 390×844.** 390×844 **es el diseño**, no una versión reducida de nada.

Antes de cualquier idea, cuatro reglas de partida:

1. **Cada dato que escribas tiene que poder señalarse en el código.** Abajo, cada hecho va con su
   `archivo:línea`. Lo que no esté citado no existe: va al apartado 9 como **hueco numerado**.
2. **Lo que es de EJEMPLO se dibuja diciendo que es de EJEMPLO** (apartado 8). No es una nota al
   pie: es un sello de caucho que se ve.
3. **La vitrina VENDE.** Aquí el producto es el protagonista, hay calor, color y suciedad de
   cocina. La app por dentro es otra cosa y no se parece a esto.
4. **Lo que no se ve en una captura quieta, no existe.** Tu lienzo devuelve artboards estáticos:
   la versión anterior escribió 650 ms de coreografía y el dueño no vio ni un fotograma. Aquí
   **todo el movimiento va congelado en la geometría** (apartado 6). Lo que sí es animación se
   describe en el **ANEXO B** y **no se te pide a ti**.

---

## 1. EL NEGOCIO (todo con origen)

| Hecho | Valor | Origen |
|---|---|---|
| Marca (REAL, cliente real) | **Villa Broaster** | `villa-app/lib/marca.ts:16` |
| Eslogan (REAL) | **"Pollo broaster hecho por tandas"** | `villa-app/lib/marca.ts:17` |
| Sede 1 | **Villa del Viento** · sector "Barrio Villa del Viento" · "El local de toda la vida, en pleno barrio." | `lib/marca.ts:38, 39, 41` |
| Sede 2 | **Vía al Bosque** · sector "Sobre la vía al Bosque" · "A la orilla de la vía, con parqueadero." | `lib/marca.ts:46, 47, 49` |
| Jamás se dice "local 1 / local 2" de cara al cliente | regla escrita en el propio código | `lib/marca.ts:9-10` |
| Se paga al recibir, en efectivo o transferencia. **No hay pago en línea** | copy en producción | `components/orden/Confirmacion.tsx:217`, `components/tienda/HojaCheckout.tsx:109` |
| No hay que crear cuenta ni registrarse | "Pedir pollo no puede costar un registro" | `components/tienda/HojaCheckout.tsx:5-8` |
| Domicilio es el canal prioritario; "recoger" es el segundo | el canal arranca en `domicilio` | `HojaCheckout.tsx:10-13, :55` |
| El pedido tiene número que se canta en el mostrador: `L1-0042` | `Orden.numero` | `villa-app/types/dominio.ts:88-89` |
| Estados en vivo: "Pedido recibido" → "En el aceite" → "Listo" → "Entregado" / "Pedido cancelado" | textos ya redactados | `Confirmacion.tsx:30-53` |
| Precio SIEMPRE por sede (`precioPorLocal[sede]`) | contrato del dominio | `types/dominio.ts:31-33`, `TarjetaProducto.tsx:10` (el comentario) y `:42` (`precioEnSede`) |
| Deep link `?sede=1` / `?sede=2` ya funciona | lectura del parámetro | `villa-app/lib/carrito.ts:155-165` |
| Cinco categorías | Presas · Combos · Familiar · Acompañantes · Bebidas | `types/dominio.ts:36-49` |
| **La ciudad NO aparece en ningún archivo del proyecto** | — | **prohibido escribirla** (apartado 8) |

**MARCADO COMO EJEMPLO — no es la carta del negocio.** Los 23 productos y sus precios salen de
`broaster-app/data/seed/productos.json` y el propio código dice de sí mismo: *"NO son los precios
de este negocio"* (`broaster-app/lib/servidor/almacen-disco.ts:360-366`). Se usan como **maniquí**
y **cada precio lleva su sello**. **Aquí están los 23, con su nombre EXACTO, su precio y su
descripción real.** No hay ni un producto más y no se escribe ni una palabra que no esté en esta
tabla: **los nombres y las descripciones se copian carácter por carácter**, porque la vitrina lee
esta misma carta en vivo y un nombre abreviado en pantalla es un nombre que el sistema no sirve.

| # | Categoría | Producto (nombre EXACTO) | Precio | Descripción real del catálogo | `seed:` |
|---|---|---|---|---|---|
| 1 | Presas | Presa de pierna | $8.500 | "Pierna apanada en broaster, jugosa por dentro." (`seed:8`) | 3 |
| 2 | Presas | Presa de contramuslo | $9.000 | "La presa más pedida de la casa." (`seed:16`) | 11 |
| 3 | Presas | Presa de pechuga | $11.500 | "Pechuga entera apanada." (`seed:24`) | 19 |
| 4 | Presas | Presa de ala | $6.500 | **— sin descripción en el catálogo** | 27 |
| 5 | Combos | Combo personal · 1 presa | $17.900 | "1 presa, papa a la francesa, arepa y gaseosa personal." (`seed:39`) | 34 |
| 6 | Combos | Combo personal · 2 presas | $25.900 | "2 presas, papa a la francesa, arepa y gaseosa personal." (`seed:47`) | 42 |
| 7 | Combos | Combo pechuga | $23.900 | "Pechuga, papa criolla, ensalada y gaseosa personal." (`seed:55`) | 50 |
| 8 | Combos | Combo broaster con arroz | $21.900 | "1 presa, arroz con verduras, ensalada y limonada." (`seed:63`) | 58 |
| 9 | Familiar | Balde familiar · 8 presas | $74.900 | "8 presas surtidas para 4 personas." (`seed:71`) | 66 |
| 10 | Familiar | Balde familiar · 8 presas completo | $94.900 | "8 presas, papa a la francesa grande, 4 arepas y gaseosa de 1.5 L." (`seed:79`) | 74 |
| 11 | Familiar | Balde familiar · 12 presas | $106.900 | "12 presas surtidas para 6 personas." (`seed:87`) | 82 |
| 12 | Familiar | Balde familiar · 12 presas completo | $129.900 | "12 presas, papa criolla, papa a la francesa, 6 arepas y gaseosa de 1.5 L." (`seed:95`) | 90 |
| 13 | Acompañantes | Papa criolla | $8.500 | "Porción de papa criolla frita con ají." (`seed:103`) | 98 |
| 14 | Acompañantes | Papa a la francesa | $7.500 | **— sin descripción en el catálogo** | 106 |
| 15 | Acompañantes | Yuca frita | $7.000 | **— sin descripción en el catálogo** | 113 |
| 16 | Acompañantes | Arepa | $3.000 | **— sin descripción en el catálogo** | 120 |
| 17 | Acompañantes | Ensalada de la casa | $7.500 | "Repollo, zanahoria y salsa de la casa." (`seed:132`) | 127 |
| 18 | Acompañantes | Arroz con verduras | $6.500 | **— sin descripción en el catálogo** | 135 |
| 19 | Bebidas | Gaseosa personal 400 ml | $4.000 | **— sin descripción en el catálogo** | 142 |
| 20 | Bebidas | Gaseosa 1.5 L | $9.000 | **— sin descripción en el catálogo** | 149 |
| 21 | Bebidas | Limonada natural | $6.000 | **— sin descripción en el catálogo** | 156 |
| 22 | Bebidas | Jugo natural en agua | $6.500 | "Mora, maracuyá o lulo." (`seed:168`) | 163 |
| 23 | Bebidas | Agua 600 ml | $3.000 | **— sin descripción en el catálogo** | 171 |

> **Regla de la segunda línea:** **9 de los 23 productos NO tienen campo `descripcion` en el
> catálogo.** Esas filas se dibujan **SIN segunda línea** —el nombre queda solo y la fila respira—.
> **Está terminantemente prohibido rellenar una descripción**: inventar "crujiente por fuera,
> jugosa por dentro" es inventar carta igual que inventar un producto.

**MARCADO COMO PROTOTIPO — promos y cupones.** Las 4 promos y los 3 cupones están escritos a mano
y el archivo dice *"DATOS ESTÁTICOS DEL PROTOTIPO… cuando existan de verdad, este archivo se
borra"* (`villa-app/lib/promos.ts:2-7`). Los códigos `VB-VIENTO-01`, `VB-BOSQUE-01`, `VB-TANDA-05`
**son inventados del prototipo**: van con sello PROTOTIPO y jamás se publican así. **Este es TODO
el copy de promoción que existe; no se escribe ni un gancho, ni un título, ni una condición más:**

**Fila "Promos de la casa" (4, pedibles) — `promos.ts:56-100`:**

| Gancho (arriba) | Título (lo que trae) | Descripción | Líneas del catálogo | `promos.ts:` |
|---|---|---|---|---|
| **Martes de balde** | Balde de 8 + papas + gaseosa 1.5 L | "El plan de la casa para cuatro, con papa a la francesa grande y gaseosa para todos." | `familiar-8` ×1 · `acomp-papa-francesa` ×1 · `bebida-gaseosa-15` ×1 | 58-66 |
| **Plan de a dos** | Dos combos personales + gaseosa 1.5 L | "Dos combos de una presa con papa y arepa, más la gaseosa grande para compartir." | `combo-personal-1` ×2 · `bebida-gaseosa-15` ×1 | 69-76 |
| **Antojo de la tarde** | Presa de pierna + papas + gaseosa | "Para el hambre de las cuatro: una presa jugosa, papa a la francesa y gaseosa personal." | `presa-pierna` ×1 · `acomp-papa-francesa` ×1 · `bebida-gaseosa-personal` ×1 | 79-87 |
| **Mesa larga** | Balde de 12 + papa criolla + gaseosa 1.5 L | "Doce presas surtidas para seis, con papa criolla con ají y gaseosa de litro y medio." | `familiar-12` ×1 · `acomp-papa-criolla` ×1 · `bebida-gaseosa-15` ×1 | 90-98 |

**Fila "Solo en el local" (3, cupones troquelados) — `promos.ts:102-127`.** De cada cupón se
dibujan **título, código y condición**; la descripción larga **no va en pantalla** (no cabe y no
hace falta):

| Título | Código | Condición (la letra menuda) | Sede | `promos.ts:` |
|---|---|---|---|---|
| Arepa de cortesía | `VB-VIENTO-01` | "Una por mesa, hasta agotar la tanda." | Villa del Viento | 104-110 |
| La segunda limonada, gratis | `VB-BOSQUE-01` | "Solo para consumo en el local." | Vía al Bosque | 112-118 |
| 5% en la tanda de las 3 | `VB-TANDA-05` | "En las dos sedes, de lunes a viernes." | las dos | 120-126 |

> **Conflicto resuelto por escrito (no lo decidas tú):** el tercer cupón se llama, literalmente,
> **"5% en la tanda de las 3"** (`promos.ts:121`), y la prohibición 9 del apartado 8 prohíbe los
> porcentajes de descuento. **Manda la transcripción:** ese título se dibuja tal cual, con su sello
> PROTOTIPO, porque es copy que ya existe en el prototipo y no un tratamiento de precio calculado
> por ti. **Es el único `%` que puede aparecer en el texto visible de toda la vitrina** (una sola
> vez), y por eso la descripción larga del cupón —que lo repite— no se pinta. Lo que sigue
> prohibido: precios tachados, "antes/ahora" y cualquier porcentaje que salga de tu cabeza.

### LAS 9 FOTOS — el material, medido archivo por archivo

Están en `docs/identidad/fotos-productos/`. **Los 9 son PNG RGB de 1254×1254, SIN canal alfa, de
1,5–2,0 MB**, fondo blanco con la sombra del producto **incrustada**. Medido decodificando los PNG
(no estimado): la esquina de los 9 archivos es `rgb(253–255, 253–255, 253–255)` —blanco, no blanco
puro— y el contenido real ocupa esto dentro del cuadro de 1254:

| Foto | Caja del producto (x, y) | Ancho × alto del contenido | Radio máx. / semilado | ¿Está en la carta de ejemplo? |
|---|---|---|---|---|
| `pechuga-apanada.png` | x 24–1229 · y 139–1084 | **96,2 % × 75,4 %** | **105,5 %** | sí — Presa de pechuga (`seed:19`) |
| `contra-muslo-apanado.png` | x 33–1226 · y 189–1054 | 95,2 % × 69,1 % | 95,6 % | sí — Presa de contramuslo (`seed:11`) |
| `ala-apanada.png` | x 54–1216 · y 138–1128 | 92,7 % × 79,0 % | **103,0 %** | sí — Presa de ala (`seed:27`) |
| `papas-fritas.png` | x 29–1221 · y 190–1038 | 95,1 % × 67,7 % | 97,5 % | sí — Papa a la francesa (`seed:106`) |
| `arepa.png` | x 91–1168 · y 253–1004 | 86,0 % × 60,0 % | 87,6 % | sí — Arepa (`seed:120`) |
| `muslo-apanado.png` | x 35–1224 · y 133–1048 | 94,9 % × 73,0 % | **101,8 %** | **NO** → reservada (H-2) |
| `filete-de-pollo-apanado.png` | x 39–1225 · y 213–1017 | 94,7 % × 64,2 % | 97,3 % | **NO** → reservada (H-2) |
| `filete-de-cerdo-apanado.png` | x 38–1229 · y 175–1047 | 95,1 % × 69,6 % | 97,3 % | **NO** → reservada (H-2) |
| `papa-horneada.png` | x 73–1181 · y 218–1117 | 88,4 % × 71,8 % | **101,7 %** | **NO** → reservada (H-2) |

**Lo que esa tabla decide, y no se discute:**

- **Prohibido el círculo inscrito como recorte de producto.** En pechuga, ala, muslo y papa
  horneada el contenido llega **más allá del semilado** (105,5 % / 103,0 % / 101,8 % / 101,7 %):
  un círculo perfecto **les corta las puntas**. Eso es exactamente lo que se ve mutilado en la
  captura rechazada `cap-carta.png`, donde el ala aparece con las plumas cortadas por un disco.
- **Prohibido encoger el sujeto para que "quepa".** Encoger la costra es el movimiento
  anti-hambre. La forma se agranda; el producto no se achica **nunca**.
- La forma de producto es **la estampilla de aceite** (apartado 4): un cuadrado con el borde
  troquelado, donde la foto entra al **100 %** y no se corta nada.

**Uso exacto de las 9, sin ambigüedad:**

| Foto | Dónde va en esta vitrina |
|---|---|
| `pechuga-apanada.png` | **Héroe** (620 px, sangrando por derecha y abajo) · macro del cierre (recorte al 280 %) · fila grande de Presas en la carta |
| `contra-muslo-apanado.png` | Carta (Presa de contramuslo) · hoja de producto (pantalla 3) |
| `ala-apanada.png` | Carta (Presa de ala) |
| `papas-fritas.png` | Carta (Papa a la francesa) · fila de promos. **Es la mejor demostración del mecanismo firma:** el blanco que queda ENTRE papa y papa se convierte en aceite |
| `arepa.png` | Carta (Arepa) |
| `muslo-apanado.png` · `filete-de-pollo-apanado.png` · `filete-de-cerdo-apanado.png` · `papa-horneada.png` | **RESERVADAS. No aparecen en ninguna pantalla**, ni como producto, ni como adorno, ni como textura de fondo. Son cuatro de nueve y hoy no tienen producto en la carta: ponerles nombre sería inventar carta (H-2) |

> La textura macro del cierre sale de **`pechuga-apanada.png`**, que sí está en la carta, y no de
> las reservadas: así ni siquiera una textura irreconocible puede leerse como un producto que no
> existe.

**Los 18 productos restantes de la carta no tienen foto** (5 con foto + 18 sin foto = los 23 de la
tabla). La carta convive con fotos y sin fotos y no se puede ver rota — pero **el producto sin foto
NO se dibuja como un hueco**: su cuadrado ámbar se convierte en **plancha de precio** (apartado 4,
pantalla 2), así que las 18 piezas sin foto llevan **18 cifras distintas** y no 18 veces la misma
palabra.

---

## 2. QUIÉN MIRA Y QUÉ DEBE HACER

**Quién.** Una persona del pueblo, siete de la noche, hambre y el celular en una mano. Puede no
haber pedido comida por internet nunca y sospecha que le van a pedir tarjeta. Llega desde una
campaña, casi siempre con `?sede=1` o `?sede=2` ya en el enlace, y **mira la página en vertical,
con una sola mano, en la calle**.

**Qué debe sentir, en este orden:** (1) **hambre** —el pollo está saliendo del aceite—; (2)
**cercanía** —es el local del barrio, no una app rara—; (3) **confianza** —no hay que registrarse
ni pagar por internet—.

**UNA sola acción principal: PEDIR.** El botón dice **"Pedir ahora"** y, cuando ya hay algo en el
carrito, **"Ver carrito · $XX.XXX"**. Todo lo demás es subordinado: otro tamaño, otro peso, otro
color. Dos CTA peleando = ninguno. **En ninguna de las 5 pantallas hay un segundo botón grande.**

**Acción secundaria, callada y solo al final** (pantalla 5): dejar el correo o el celular
(`POST /api/suscriptores` existe: `broaster-app/app/api/suscriptores/route.ts:6`). Nunca compite
con "Pedir".

---

## 3. EVIDENCIA REAL (lo único que hoy se puede probar)

**No hay testimonios, ni reseñas, ni estrellas, ni años de trayectoria, ni "más de X familias".**
Las órdenes que existen son las 8 de QA (`"PRUEBA QA Cliente1"`, `broaster-app/data/ordenes.json:8`)
y hay **1** suscriptor, también de QA (`broaster-app/data/suscriptores.json`). Cualquier cifra
social sería mentira. Lo que sí se puede mostrar, y es lo que vas a dibujar:

1. **"Hecho por tandas"** — eslogan real (`marca.ts:17`) y argumento de frescura de un asadero. Es
   el eje de la dirección: la página es la boca de la freidora en el momento de la tanda.
2. **Dos sedes con carácter distinto** — barrio "de toda la vida" / orilla de la vía "con
   parqueadero" (`marca.ts:41, :49`). **Se nombran, nunca se numeran.**
3. **No pagas nada por internet y no creas cuenta** (`HojaCheckout.tsx:109`, `:5-8`). Para este
   público es el argumento de confianza más fuerte que existe.
4. **El pedido tiene número real y estado en vivo** (`dominio.ts:88-89`, `Confirmacion.tsx:30-53`):
   prueba de que esto no es un formulario que cae en un correo. **El estado `preparando` se llama
   "En el aceite"** y es, literalmente, el nombre de esta dirección de arte.
5. **Las fotos.** Es la primera vez que el proyecto tiene imagen de producto propia. **La foto ES
   la evidencia:** que sea lo más grande y lo más brillante de la pantalla, siempre.

---

## 4. LAS CINCO PANTALLAS, UNA POR UNA

Artboards de **390 px de ancho**. La pantalla 1 mide **exactamente 844** (es el pliegue). Las
demás pueden ser más altas, pero **sus primeros 844 px tienen que vender solos**.

Antes de entrar, **el mecanismo firma que gobierna las cinco**:

### ⚙️ MECANISMO FIRMA — **EL BAÑO DE ACEITE**

El fondo blanco de las 9 fotos **deja de ser un problema y se convierte en el aceite**.

- Cada producto se monta sobre una **forma ámbar opaca**:
  `radial-gradient(circle at 42% 34%, #ffc86b 0%, #f59e0b 45%, #b4520f 74%, #6b2a08 100%)`.
- El contenedor lleva `isolation: isolate` y la foto va con **`mix-blend-mode: multiply`**.
- **La aritmética, comprobada contra los píxeles reales de estos archivos:** multiply devuelve
  `base × capa / 255`. El fondo medido `rgb(254,253,255)` por el ámbar central `#ffc86b`
  (255,200,107) devuelve `(254,199,107)` — **una diferencia de 1 nivel: el fondo blanco
  desaparece dentro del aceite, sin halo, sin borde de máscara y sin recortar nada.** La costra
  dorada (≈230,140,60) baja a (230,110,25): el pollo sale **más caliente**, no más oscuro. La
  sombra incrustada (≈235,235,235) pasa a ámbar oscuro y se lee como sombra proyectada sobre el
  aceite. Y en `papas-fritas.png` el blanco de los huecos entre papa y papa **se vuelve aceite**.
- **Regla de encaje, EN RELATIVO (esto es lo que falló en el diseño original de la dirección y aquí
  está corregido):** la forma ámbar **siempre desborda al contenido real de la foto por ≥ 9 % del
  lado menor de la forma, en todo borde interior que quede dentro del encuadre** (los bordes que se
  salen del encuadre no cuentan, ahí manda el recorte de la pantalla). *Va en porcentaje y no en
  píxeles a propósito: un margen absoluto escrito para una elipse de 780 px es imposible de cumplir
  en una estampilla de 112, y esa contradicción es la que rompía la carta.* Si un píxel de producto
  queda fuera del ámbar, multiplica contra el fondo casi negro y **se vuelve una mancha negra**: eso
  es el único fallo grave posible de esta dirección. Usa la tabla del apartado 1 para calcular el
  desborde de cada foto.
- **Las cuatro medidas de la forma ámbar, ya resueltas** (la foto entra al 100 % en una **caja
  interior centrada**; nunca se encoge el sujeto, se agranda la forma — prohibición 8):

  | Pieza | Forma ámbar | Caja interior de la foto | Margen mínimo real | ¿Troquel? |
  |---|---|---|---|---|
  | Héroe de la portada | elipse 780 × 660 | caja de 620 × 620 | 78 px arriba / 110 px abajo (≥ 9 % de 660 = 59) ✔ | no |
  | Estampilla de la carta | cuadrado **112 × 112** | **92 × 92** | 11,7 px (10,5 % de 112) ✔ | sí, sobre el ámbar |
  | Hoja de producto | cuadrado **300 × 300** | **246 × 246** | 29 px (9,8 %) ✔ | sí, sobre el ámbar |
  | Estampilla del carrito | cuadrado **88 × 88** | **72 × 72** | 9,4 px (10,7 %) ✔ | **no** (a ese tamaño el troquel se ve sucio) |

  **El radio de 20 px y el troquelado se aplican al borde de la FORMA ÁMBAR, jamás al borde de la
  caja interior.** Es decir: el troquel y la esquina redondeada **muerden ámbar y solo ámbar**. Si
  muerden costra, aparece la mordida negra (o el blanco del PNG asomando) y la fila está rota.
- **Respaldo escrito, obligatorio:** si aplanas los blend modes, la forma ámbar se queda tal cual
  y la foto se monta encima con `mask-image: radial-gradient(circle at 50% 46%, #000 78%, transparent 100%)`
  a `mask-size: 132% 132%` (nunca menos: con el tamaño por defecto la máscara **amputa la comida**)
  más `filter: saturate(1.12) contrast(1.06)`. **Se pierde el efecto, no se pierde la página.**

### ⚙️ SEGUNDA REGLA TRANSVERSAL — **EL MAL REGISTRO**

Una línea de CSS que hace vibrar cuarenta elementos **sin una sola animación**: todo lo que tiene
marco **se imprime dos veces**. Plancha negra (contorno **3 px `#0d0906`**) y **plancha de color
desfasada 5 px hacia abajo-derecha con `blur 0`**, alternando `#e01e2b` y `#ff8a20` según el
índice del elemento. Se aplica **solo al aparato de interfaz**: tickets, sellos, chapas de
categoría, botón `+`, palanca del CTA, chips, marcos de las fichas. **Jamás encima de la foto** —
la costra fotográfica es lo único que produce hambre de verdad y no se toca.

### ⚙️ TERCERA REGLA TRANSVERSAL — **UNA SOLA LUZ**

**La lámpara de trabajo cuelga arriba-IZQUIERDA de la escena**, y por eso todo cae hacia
abajo-derecha. *(El resplandor ámbar de L1, descentrado a la derecha, **no es la lámpara**: es el
calor del propio aceite saliendo de la boca de la freidora. Una fuente de luz y un cuerpo caliente
no son lo mismo y no tienen que coincidir — pero **sombras, filetes y brillos obedecen a la
lámpara, siempre**.)* En consecuencia:
**todas las sombras duras caen al mismo ángulo, 135°** (abajo-derecha), sin blur; todos los cantos
que miran arriba-izquierda llevan un **filete de 1 px `rgba(255,196,107,.5)`**; y **ningún
viewport de 390×844 lleva más de un naranja saturado**, que casi siempre es el CTA. Si la página
se lee como capas sueltas en vez de como un objeto físico bajo una lámpara, está mal ejecutada.

---

### PANTALLA 1 · PORTADA — "la boca de la freidora"

> **Propósito de venta:** dar hambre en dos segundos y dejar el botón de pedir al alcance del
> pulgar **sin scrollear**. No explica: **calienta**.

**Fondo — cinco capas apiladas (ninguna plana, ninguna clara, ninguna gris):**

- **L1 · Campana de la freidora:**
  `radial-gradient(120% 78% at 62% 8%, #ffb703 0%, #ff8a20 12%, #c2410c 26%, #7a2408 44%, #2a1108 66%, #0d0906 84%)`.
  Es el **resplandor del aceite** subiendo por la campana del extractor, **descentrado a la
  derecha**. No es la lámpara (esa cuelga arriba-izquierda): es calor, no luz.
- **L2 · Brasa baja:**
  `radial-gradient(150% 42% at 50% 100%, rgba(224,30,43,.5) 0%, rgba(122,36,8,.28) 45%, transparent 72%)`.
  El carbón calienta desde abajo, **justo donde vive el botón**.
- **L3 · Humo real:** un `<svg><filter>` con `feTurbulence type="fractalNoise"
  baseFrequency="0.012 0.03" numOctaves="4" seed="7"` → `feColorMatrix` a gris cálido →
  `feGaussianBlur stdDeviation="18"`, enmascarado en la banda **y = 0 → 300 px**, `opacity: .22`,
  `mix-blend-mode: screen`. **Semilla fija = humo de verdad en una captura quieta.**
- **L4 · Grano de película:** `feTurbulence fractalNoise baseFrequency="0.9" numOctaves="2"`,
  `opacity: .05`, `mix-blend-mode: overlay`, horneado como data-URI y repetido en tile de 120×120
  **sobre toda la página**. Mata el bandeado y quita el aspecto "vector digital plano" que el
  dueño llamó **apagado**.
- **L5 · Viñeta:** `box-shadow: inset 0 0 130px 46px rgba(0,0,0,.72)` y esquinas a
  `rgba(0,0,0,.85)`. El ojo cae en el producto y en ningún otro sitio.

**Composición, medida de arriba abajo (390 × 844):**

- **y 0–56 · La barra que no es una píldora.**
  - Izquierda, a x=14: **el selector de sede es un TICKET de papel**, no un chip.
    Rectángulo `#f7ece1` de **168×44**, radio 3 px, girado **-1,5°**, con el **borde derecho
    troquelado** (`mask-image` de círculos de 4 px cada 8 px). Dentro, en dos líneas: "PIDES EN"
    en Familjen Grotesk 700 · 9 px · `tracking .16em` · `#7a2408`, y **"VILLA DEL VIENTO"** en
    Familjen Grotesk 800 · 14 px · `#16100c`, con un chevron de 8 px a la derecha. Lleva mal
    registro (plancha negra 3 px + plancha `#e01e2b` a 5 px). Con `?sede=2` el ticket dice **"VÍA
    AL BOSQUE"**. *Por qué un ticket y no un chip: el chip blanco es exactamente la pieza que el
    dueño ya vio y rechazó, y el vecino reconoce su esquina por el nombre, no por un desplegable.*
  - Derecha, a x=336: **el carrito es una ficha**: disco de **40 px** (una de las tres únicas
    piezas circulares permitidas en toda la vitrina), relleno `#16100c`, filete superior 1 px
    `rgba(255,196,107,.5)`, número en Alfa Slab One 16 px `#ffb703`, sombra dura `4px 4px 0 rgba(0,0,0,.55)`.
- **y 210–282 · LA PALABRA.** `BROASTER` en **Alfa Slab One**, `clamp(64px, 21vw, 96px)`
  (82 px a 390), `line-height: .88`, `letter-spacing: -.02em`, color `#f7ece1`,
  `text-shadow: 0 3px 0 #7a2408, 0 0 64px rgba(255,138,32,.5)`. **Sangrada -14 px por la izquierda
  y CORTADA por el borde derecho**: se lee `BROASTE` y medio trazo de la R. **No es fantasma**
  (el fantasma al 10 % sobre crema fue justamente lo ilegible del intento anterior): es crema
  maciza con relieve, 16,20:1 sobre la penumbra. **La foto le tapa los últimos 18 px por abajo.**
- **y 182–842 · LA BOCA DE ACEITE.** Elipse de **780 × 660** centrada en **(210, 512)**, girada
  **-8°**, con el degradado del mecanismo firma. Encima, **`pechuga-apanada.png` en una caja de
  620 × 620 con `left: -102px; top: 196px`**, en `multiply`.
  - **Comprobación de encaje (hazla):** con la tabla del apartado 1, el contenido real de esa foto
    cae en pantalla en `x −90 → 506`, `y 265 → 732`. La elipse cubre `x −180 → 600`, `y 182 → 842`.
    Margen interior mínimo: **78 px arriba, 110 px abajo**; el umbral es **9 % de 660 = 59 px**. ✔
    Izquierda y derecha se salen del encuadre y no cuentan.
  - La foto **se sale 116 px por el borde derecho y sigue hacia abajo**: a 620 px de ancho cada
    grumo del apanado mide ~2 mm en pantalla. **Se ve la costra.** El producto **se recorta por el
    marco**; no flota entero con aire alrededor (ese fue el error de catálogo del intento anterior).
  - **Brillos especulares:** 3 elipses de blanco caliente `#fff4e2` al 12 %, de 26×14, sobre las
    crestas de la costra, todas con la luz llegando de arriba-izquierda.
- **y 250–330 · EL MOMENTO MEMORABLE: `¡CRUJE!`** en **Bungee Shade**, `clamp(56px, 18vw, 84px)`
  (70 px a 390), girada **-7°**, color `#ffd8a8`, `-webkit-text-stroke: 4px #0d0906`,
  `text-shadow: 6px 6px 0 #e01e2b`, con el origen en `x = -8`. **Cruza la pechuga por el hombro
  izquierdo**, la palabra encima de la comida y no obedientemente arriba de ella. *Por qué:
  "broaster" se compra por el crujido; es el producto dicho en un golpe, y es la dosis exacta de
  "divertido" sin volver la página una caricatura.* **Es la ÚNICA onomatopeya de toda la vitrina.**
- **y 330–458 · EL PRECIO SE GRITA ENCIMA DE LA FOTO.** Estampa de **12 puntas, 128 px**, relleno
  `#e01e2b`, contorno crema de 3 px, girada **-9°**, a `x = 16`, **invadiendo la foto** (la pisa,
  no la esquiva). Dentro, en dos renglones: una barra de 96×15 en `#0d0906` con "PRECIO EJEMPLO"
  en Familjen Grotesk 700 · 9 px · `tracking .10em` · `#f7ece1`, y debajo **`$11.500`** en Alfa
  Slab One 30 px `#f7ece1`. *Por qué: lo primero que decide un cliente de pueblo es el precio, y
  así se venden las presas en la carretera — gritado en una estampa torcida, no en una línea de
  texto.*
- **y 496–592 · LA TANDA QUE PASA** *(esta banda es obligatoria: es el mecanismo de la ficha 01 y
  en el intento anterior no se ejecutó porque estaba escrito fuera de la pantalla).* Una fila
  horizontal de **3 estampillas de aceite de 96 × 96** —**contramuslo, ala y papa a la francesa**,
  en ese orden— **detenida a media pasada**:
  - la **primera** entra mordida por el **borde IZQUIERDO**, con su origen en `x = −34` (asoman
    62 px);
  - la **segunda** completa, a `x = 92`;
  - la **tercera** cortada por el **borde DERECHO**, con su origen en `x = 322` (asoman 68 px).
  - Las tres **pasan POR DELANTE del héroe** (oclusión, R7): la presa grande se está sirviendo y la
    tanda que viene detrás le cruza por encima. Giro alternado **-3° / +3° / -3°**, sombra dura
    `4px 4px 0 rgba(0,0,0,.55)` a 135°, y cada una con su foto al 100 % en `multiply` sobre caja
    interior de **80 × 80** (margen 8 px + inset del contenido ≥ 9 % de 96 ✔).
  - **y 600–606 · Puntos de posición:** 3 puntos de **6 px** separados **10 px**, a `x = 16`, con el
    **ACTIVO en el segundo lugar** (alargado a 18 px de ancho, `#ff8a20`); los otros dos `#7a2408`
    al 60 %. *Los puntos de 6 px no cuentan para la regla de "un solo naranja saturado por
    viewport": no son masa, son señalética.*
  - **Sin flechas en el artboard.** El swipe y las flechas de 44 px son fase de código y viven en el
    **ANEXO B**; la captura ya se lee como movimiento sin ellas.
- **Salpicadura congelada** (esto es lo que hace que una foto quieta se lea como movimiento):
  **14 migas** —polígonos irregulares de 3–7 px en `#d97706` y `#f59e0b`— en arco desde el punto
  de impacto `(118, 470)` hacia arriba-derecha, **cada una con una estela lineal de 0 → 14 px que
  se alarga y se difumina conforme avanza la trayectoria**; más **3 gotas de aceite** (elipse 9×7,
  base `#b45309`, punto especular blanco de 2 px al 30 % / 25 %). Es el truco de la fotografía
  deportiva: un fotograma de algo que salta lee como movimiento.
- **Vapor:** 2 cintas en S, `path` SVG con `stroke: #ffe6c2` al 16 %, grosor 26, `blur 14`,
  subiendo desde la costra hacia la izquierda a **18°** y **31°**. Vapor en una foto quieta =
  "acabado de salir".
- **Papelillos:** exactamente **8** rectángulos de 6×10 px en crema y ámbar al 18–22 % de opacidad,
  girados al azar, **pegados al borde superior y solo aquí**. Tope 8; ni uno más y en ninguna otra
  pantalla.
- **y 616–700 · LA PLANCHA DE LECTURA (obligatoria, y esto es geometría, no gusto).** La elipse del
  aceite baja hasta `y = 842` y el contenido de la foto llega hasta `y = 732`: **a esa altura no hay
  penumbra, hay charco y hay costra.** Un texto de lectura ahí daría ≈ 2,1:1 y violaría la trampa 1
  del apartado 5. Así que las dos líneas de abajo **no se apoyan en el fondo: se apoyan en una
  plancha opaca**, a sangre de borde a borde, `#0d0906` de `y 616 → 700`, con **filete superior de
  1 px `rgba(255,196,107,.5)`** (la lámpara de arriba-izquierda) y **sombra dura `0 6px 0
  rgba(0,0,0,.55)`** por abajo. Es la tabla de cortar sobre la que se lee.
  - **y 626–656 · El eslogan real**, en **Instrument Serif Italic 25 px `#f0c98a`** sobre la plancha
    (12,68:1): **"Pollo broaster hecho por tandas"**. Es la única serifa de la página y aparece dos
    veces en toda la vitrina.
  - **y 664–688 · Línea de servicio**, Familjen Grotesk 400 · 13 px · `#c9a883` sobre la plancha
    (8,86:1): **"Domicilio primero · recoger si te queda de paso · se paga al recibir"**.
- **y 714–772 · EL CTA, que es una palanca y no una píldora.** Ancho completo menos 32 px (**326 ×
  58**), **radio 14 px** (ni píldora ni esquina viva), relleno `#e01e2b`, filete superior 3 px
  `rgba(255,255,255,.28)`, zócalo inferior 4 px `#7a1018`, mal registro con plancha `#ff8a20` a
  5 px, sombra dura `6px 6px 0 rgba(0,0,0,.55)` a 135°. Etiqueta **"PEDIR AHORA"** en Familjen
  Grotesk 800 · 19 px · `tracking .06em` · blanco (4,78:1). Sobre la brasa de L2: **es la única
  masa roja de la pantalla y el único naranja saturado del viewport**.
- **y 780–844 · La promesa.** Asoma **ya iluminada** la primera ficha de la carta, cortada por el
  borde inferior: la página promete que abajo hay comida y el pulgar sigue.

**Prueba de esta pantalla:** captúrala a 390×844, tapa todos los textos y mírala. Si no da hambre,
está mal. Si la **mancha clara más grande** no es comida ni aceite, está mal. Y si solo se ve un
producto —si la banda de la tanda no está—, el mecanismo de la ficha 01 volvió a no ejecutarse.

---

### PANTALLA 2 · CARTA — "el mostrador de noche"

> **Propósito de venta:** que se pida en dos toques y que la foto haga el trabajo que en el intento
> anterior hacían unas iniciales dentro de un círculo beige.

**Transición de sección:** entre el héroe y la carta hay una **banda con el borde inferior
RASGADO** — `clip-path` de **14 puntos irregulares**, como papel arrancado — y el suelo cambia:
de `#0d0906` (portada) a **`#16100c`** (carta). *Por qué: para que la página no sea un único
bloque negro monótono de 844 px hacia abajo.*

**Fondo de la carta — "acero de cocina, pero cálido". Cuatro capas con valores que SE VEN**
*(la versión anterior puso rayas al 1,4 % y migas al 5 %: a 390 px y con la captura comprimida eso
es exactamente un fondo plano, que es lo que el dueño llamó apagado; aquí los valores suben hasta
que se noten)*:

1. **Base** `#16100c`.
2. **El aceite mancha el mostrador:** detrás de la pieza grande de cada categoría, un charco
   desbordado al fondo — `radial-gradient(closest-side, rgba(245,158,11,.22), transparent)` de
   **320×220**. Cinco manchas en toda la carta, una por categoría.
3. **Reflejo de acero de verdad:** `repeating-linear-gradient(96deg, rgba(255,196,107,.05) 0 2px,
   transparent 2px 7px)` —**al 5 %, no al 1,4 %**— recortado en **una banda diagonal del 40 % del
   ancho**, como la luz del extractor resbalando por la plancha. No cubre toda la pantalla: es un
   reflejo, y un reflejo tiene borde.
4. **Migas del turno:** **14 migas de 4–7 px al 22 %** (no 9 al 5 %), apoyadas en el **borde
   inferior de las ranuras**, cada una con su sombra dura de 2 px a 135°.
5. **Bombillo por estante:** sobre cada cabecera de categoría,
   `linear-gradient(180deg, rgba(255,138,32,.14) 0, transparent 96px)`.
6. **Grano R1 obligatorio también aquí** (el mismo data-URI de la portada, `opacity: .05`,
   `overlay`). **Estantes iluminados, no tarjetas flotando en gris.**

**Criterio medible del fondo (C20):** muestreando la columna `x = 8` cada 200 px, la luminancia
**varía ≥ 0,02 entre bandas consecutivas**. Ninguna franja de 844 px puede ser plana.

**Chips de categoría (sticky; el componente ya existe: `Categorias.tsx:26-55`, y el `sticky` con su
`backdrop-blur` está en `Categorias.tsx:34`):** "Toda la carta · Presas · Combos · Familiar ·
Acompañantes · Bebidas". Alto de toque **40 px**, radio 14 px, inactivo `#221309` con texto
`#c9a883` (8,08:1), **activo relleno `#ff8a20` con texto `#0d0906` (8,41:1)** y mal registro.
**Se quita el `backdrop-filter` que hoy tiene el componente** (apartado 7): en su lugar, fondo
`#16100c` opaco al 100 %.

**Cabecera de categoría = CHAPA ESMALTADA, no acordeón.** Banda a sangre de 30 px, `#1c1410`,
filete superior 1 px `rgba(255,196,107,.22)`, y **un hilo ámbar de 1 px que corre desde el final
del rótulo hasta el borde derecho de la pantalla**. Y **encima, montada a caballo sobre la banda y
sobresaliendo por arriba y por abajo, la CHAPA:** rectángulo ámbar de **176 × 46**, radio 3 px,
girado **-6°**, a `x = 14`, con **doble filete troquelado** (2 px `#3d1a06` + 1 px
`rgba(255,196,107,.5)` arriba-izquierda), sombra dura `5px 5px 0 rgba(0,0,0,.55)` a 135° y la
palabra de la categoría en **Alfa Slab One 30 px `#3d1a06`** (10,18:1 sobre el ámbar alto) —
*PRESAS · COMBOS · FAMILIAR · ACOMPAÑANTES · BEBIDAS*. Es el rótulo de un asadero, no un
encabezado de tabla. **Cero acordeones y cero avatares de letras** ("Co", "Fa", "Be" del intento
anterior: **prohibidos por nombre**).

#### La carta NO es una lista. Tres tipos de fila que se alternan

**PROHIBIDO POR ESCRITO el patrón "miniatura a la izquierda + texto al centro + precio y botón a la
derecha" repetido 23 veces.** Eso es la fila de app de domicilios que el dueño ya rechazó
(`cap-carta.png`): cambiarle el ornamento —cuadrado troquelado en vez de círculo, ranura en vez de
tarjeta— **no cambia el esqueleto, y el esqueleto es lo que se rechazó**. **Dos filas seguidas
nunca comparten silueta.** Las filas se separan por **ranura grabada** (1 px `#2f1e12` arriba +
1 px `#000` abajo), nunca por una tarjeta redondeada con sombra.

**TIPO (a) · BANDEJA A SANGRE — 200 px de alto.** La foto **sangra por los DOS bordes laterales**
(≥ 390 px de ancho renderizado) sobre el charco del mecanismo firma, y el nombre va
**sobreimpreso** en Alfa Slab One 26 px `#f7ece1` con la sombra dura de 135°, abajo-izquierda. El
precio va en una **plancha de precio** (ver tipo b) de 120×72 pisando la esquina inferior derecha,
con su sello EJEMPLO. **Solo hay DOS bandejas en toda la carta, porque solo hay dos categorías con
foto propia:** *Presa de pechuga* abre **Presas** (`pechuga-apanada.png`) y *Papa a la francesa*
abre **Acompañantes** (`papas-fritas.png`). **No se inventa una bandeja para Combos, Familiar ni
Bebidas: no hay foto de balde, de combo ni de gaseosa, y las 4 fotos reservadas siguen reservadas.**

**TIPO (b) · PLANCHA DE PRECIO — mosaico de 2 columnas, celdas de 190 × 120.** Aquí está el giro
que salva el 78 % de la carta: **el producto sin foto NO lleva una estampilla vacía con el nombre
de su categoría sellado encima.** Eso sería cambiar el avatar de iniciales por un avatar de
palabra: 18 cuadrados idénticos que dicen PRESAS/COMBOS/BEBIDAS y no informan nada — se lee "aquí
faltan fotos". **La forma ámbar deja de ser un hueco y se convierte en la CIFRA:** dentro del ámbar
va el **precio en Alfa Slab One 34 px `#3d1a06`** (10,18:1, la única tinta permitida encima del
aceite) y encima el nombre del producto en Familjen Grotesk 700 · 13 px `#3d1a06`. La cifra grande
vende sola, y **18 planchas con 18 cifras DISTINTAS** no se leen como plantilla. **Prohibido
cualquier texto de categoría, inicial, icono o silueta dibujada dentro de una plancha.** El sello
EJEMPLO va aquí en `#3d1a06` (sobre ámbar el `#ffb703` no contrasta), girado -12°, y el botón `+`
pisa la esquina inferior derecha de la celda.

**TIPO (c) · FICHA LARGA — 104 px**, y **solo donde la descripción real del catálogo aporte** o
donde haya foto. Estructura: a la izquierda la **estampilla de aceite de 112 × 112** (caja interior
92, radio 20 px, borde troquelado sobre el ámbar, giro alternado -3° / +3°, sombra dura
`4px 4px 0 rgba(0,0,0,.5)` a 135°) con la foto al 100 % en `multiply`; **si el producto no tiene
foto, esa estampilla ES su plancha de precio** (la cifra en Alfa Slab One 34 px `#3d1a06`) y
entonces la columna derecha **pierde el precio** y se queda solo con el `+` y el sello. Al centro:
nombre en Familjen Grotesk 700 · 17 px `#f7ece1`, y debajo la **descripción real del catálogo**
(apartado 1, tabla de los 23) en 400 · 13 px `#9c8471` (5,11:1) a **dos líneas máximo**. **Los
productos sin `descripcion` en el catálogo se dibujan SIN segunda línea: está prohibido
rellenarla.** A la derecha, cuando la estampilla lleva foto: precio en **Alfa Slab One 22 px
`#ffb703`** (10,80:1) alineado a la derecha, con el **SELLO EJEMPLO** pisándole la esquina superior
derecha (sello de caucho girado -12°, doble borde de 2 px + 3 px `#ff8a20`, "EJEMPLO" en Familjen
Grotesk 700 · 9 px · `tracking .18em` · `#ffb703` al 85 %).

**Botón `+`:** disco de **34 px** (segunda pieza circular permitida), relleno `#e01e2b`, luz
interior superior `inset 0 1px 0 rgba(255,255,255,.28)`, "+" crema de 3 px, mal registro con
plancha `#ff8a20`. A distancia de pulgar del precio, en los tres tipos de fila.

**Reparto exacto de los 23 (no lo decidas tú):**

| Categoría | Bandeja a sangre (a) | Ficha larga (c) | Mosaico de planchas (b) |
|---|---|---|---|
| **Presas** | Presa de pechuga | Presa de pierna · Presa de contramuslo · Presa de ala | — |
| **Combos** | — | los 4 (todos tienen descripción) | — |
| **Familiar** | — | los 4 (todos tienen descripción) | — |
| **Acompañantes** | Papa a la francesa | Papa criolla · Arepa · Ensalada de la casa | Yuca frita · Arroz con verduras |
| **Bebidas** | — | Jugo natural en agua | Gaseosa personal 400 ml · Gaseosa 1.5 L · Limonada natural · Agua 600 ml |

Total: **2 bandejas + 15 fichas largas + 6 planchas en mosaico = 23**, y **23 precios visibles con
23 sellos EJEMPLO**. En las tres categorías sin foto, **la primera plancha de la categoría va a
doble tamaño** (326 × 160, cifra en Alfa Slab One 54 px) para que Combos, Familiar y Bebidas
también abran con un golpe y no con una lista.

**Un sello EJEMPLO por cada precio visible.** No es una nota al pie, es el estilo de la casa.

**🔥 MOMENTO MEMORABLE DE LA CARTA.** No es un elemento 40 px más grande: es un **cambio de clase**.
(1) Las dos **bandejas a sangre** —comida de borde a borde en una pantalla donde todo lo demás mide
112 px— y (2) las cinco **chapas esmaltadas giradas -6°**, que son el rótulo del asadero colgado
sobre cada estante. De la esquina inferior derecha de cada bandeja caen **6 migas con estela**
cruzando la ranura hacia la fila de abajo; *congelado:* dibujadas a mitad de caída, con la estela
más larga en la que va más lejos.

**Promos, encima de la carta**, en las dos filas horizontales que ya existen: **"Promos de la
casa"** (4 pedibles) y **"Solo en el local"** (3 cupones troquelados con las muescas reales
recortadas por máscara — `globals.css:187-208`, no lo reinventes). **Todo el copy —gancho, título,
descripción, código y condición— está transcrito en el apartado 1 y se copia de ahí: no se escribe
ni una palabra de promoción propia.** Un cupón publicado es una promesa que alguien reclama en el
mostrador mañana (H-7). **Sin descuentos tachados y sin "antes/ahora"**: el servidor congela precios
y no sabe de descuentos (`lib/promos.ts:14-24`). Los tres cupones llevan **sello PROTOTIPO** sobre
el código `VB-*`, y sobre la fila entera va clavado el ticket del hueco **H-7**.

**Cómo se compone una promo (tarjeta de 272 px de ancho, `Promos.tsx:98`) — y esto está medido
contra el disco, no imaginado.** Las 4 promos incluyen `familiar-8`, `familiar-12`,
`combo-personal-1`, `presa-pierna`, `acomp-papa-francesa`, `acomp-papa-criolla`,
`bebida-gaseosa-15` y `bebida-gaseosa-personal`: **de todo eso la ÚNICA que tiene foto en disco es
`acomp-papa-francesa`**. No hay foto de balde, ni de gaseosa, ni de presa de pierna, ni de papa
criolla. Así que la promo **no se compone con tres fotos** (eso obligaría a repetir la misma imagen,
a dibujar una gaseosa vectorial o a tirar de una reservada: las tres cosas están prohibidas). Se
compone con **una capa fotográfica como máximo y dos de PAPEL**, sobre el charco:

- **Capa 1 (al frente):** estampilla de aceite de **108 × 108** (caja interior 88) con
  `papas-fritas.png` al 100 % en `multiply`, girada **-3°**. *Solo en las dos promos que incluyen
  papa a la francesa: **"Martes de balde"** y **"Antojo de la tarde"**.*
- **Capa 2:** ficha de papel `#f7ece1` de **96 × 64**, escala 0,86, girada **+4°**, desplazada
  26 px arriba-izquierda, con el nombre de esa línea de la promo en Alfa Slab One 18 px `#7a2408`
  (8,66:1).
- **Capa 3:** igual, a escala 0,72, girada **-6°**, desplazada 44 px arriba-izquierda.
- **Solape mínimo 24 px entre capas. Máximo 3 capas y máximo 1 fotográfica.** Las promos que no
  incluyen papa a la francesa —**"Plan de a dos"** y **"Mesa larga"**— se componen con **2 fichas de
  papel y nada más**: cero fotos, y no pasa nada. Nunca una lista de viñetas.

**Después de la carta, el "dato grande + línea".** *(Se conserva el mecanismo porque no depende de
gesto ni de tiempo y se ve en una captura quieta — no porque estuviera aprobado: el dueño rechazó
el conjunto y aquí no hay nada aprobado.)* Dos bloques apilados, cada uno **montado sobre su chapa
esmaltada** —la misma pieza de las cabeceras, girada -6°, para que no se lean como el bloque de
texto plano del intento anterior— y con una **mancha de aceite** detrás
(`radial-gradient(closest-side, rgba(255,183,3,.18), transparent)` de 260×150) en vez de una
tarjeta gris:

- **`2 SEDES`** en Alfa Slab One 54 px `#f7ece1` + línea en Familjen Grotesk 14 px `#c9a883`:
  "Villa del Viento y Vía al Bosque".
- **`$0`** en Alfa Slab One 54 px `#f7ece1` + "lo que pagas por internet — se paga al recibir".

**Bloque de sedes.** Dos bloques apilados sobre el suelo más oscuro (`#0a0705`), cada uno con el
nombre en **Alfa Slab One 30 px `#f7ece1`**, su descriptor real en Instrument Serif Italic 17 px
`#c9a883` —"El local de toda la vida, en pleno barrio." / "A la orilla de la vía, con
parqueadero."— y **un rescoldo ámbar de 260×160 al 10 % detrás de cada nombre**. **Sector y nada
más: sin calles, sin nomenclatura, sin ciudad, sin mapa.** Aquí van clavados los tickets de los
huecos **H-4** (horarios), **H-5** (demora / tanda) y **H-6** (WhatsApp).

**EL CIERRE — "la franja del aceite" (190 px, a sangre).** Suelo `#070403`. Macro de
`pechuga-apanada.png` recortada al **280 %** (irreconocible como pieza: es costra pura), al **8 %**
de opacidad en `screen`, degradada a negro por arriba. **Encima, el foco ya puesto** (mecanismo de
la ficha 03, apartado 11): un círculo de **150 px al 58 % / 46 %** donde la misma macro sube a
**55 % de opacidad y color pleno**, con **el rastro del dedo dibujado**: 5 discos decrecientes de
`rgba(255,196,107,.10)` en arco desde abajo-derecha hasta el foco. **No depende de ningún gesto:
en la captura quieta ya se ve la mancha de luz y por dónde llegó.** Encima, el CTA repetido y el
ticket del hueco **H-11**.

**LA FRANJA DE PENDIENTES** *(entre el bloque de sedes y el cierre; existe porque cuatro huecos se
declaran "pintados" en el apartado 9 y hasta ahora no tenían sitio)*: banda a sangre de **150 px**
sobre `#0a0705`, con el rótulo "LO QUE FALTA PARA PUBLICAR" en Familjen Grotesk 700 · 11 px ·
`tracking .18em` · `#c9a883`, y **cuatro tickets de papel crema clavados en abanico** (150×34,
girados -2°, solapándose 10 px, en dos filas de dos): **H-2** (los 4 productos fotografiados que no
están en la carta), **H-3** (origen y derechos de las fotos), **H-8** (logo definitivo) y **H-9**
(fotos de las sedes y de quien fríe).

**Al pie de la carta, obligatoria y visible** (nunca `sr-only`): una cinta de papel crema girada
-1° con **"Carta y promos de EJEMPLO — pendientes los datos reales del cliente"** en Familjen
Grotesk 700 · 11 px · `#7a2408` (8,66:1).

---

### PANTALLA 3 · HOJA DE PRODUCTO — pantalla NUEVA

> **Propósito de venta:** para el balde y los combos, donde la decisión no es "¿me antoja?" sino
> **"¿alcanza para cuántos?"**.

**Ojo: hoy no existe** (`Tienda.tsx:49` solo tiene hojas `sedes | carrito | pago`). Se diseña como
maqueta; implementarla agrega estado y queda condicionada a aprobación del senior (apartado 7).

- La hoja sube desde abajo, `max-h: 88dvh`, **radio superior 28 px**, agarradera de 40×4 px
  (`Hoja.tsx:63-67`). Suelo `#16100c`.
- **🔥 MOMENTO MEMORABLE — "la pieza no cabe en la hoja".** La estampilla de aceite mide **300×300**
  (**caja interior de la foto: 246×246 centrada**; el radio de 20 px y el troquelado muerden solo
  ámbar), va girada **-5°** y **rompe el borde superior de la hoja saliéndose 28 px por arriba**: la
  pieza está *encima* de la hoja, no dentro. Su sombra dura de `10px 12px 0 rgba(0,0,0,.55)` cae
  **dentro** de la hoja a 135°, así que el volumen es innegable. Al pie de la pieza, **3 gotas y
  9 migas con estela** hacia abajo-derecha, como si la acabaran de dejar caer en la bandeja.
- Nombre en **Alfa Slab One 30 px `#f7ece1`**; **descripción real del catálogo, copiada de la tabla
  de los 23 del apartado 1**, en Familjen Grotesk 400 · 14 px · `#c9a883` — y si ese producto **no
  tiene `descripcion` en el catálogo, no hay línea: el hueco se deja vacío y no se rellena**;
  precio de la sede activa en **Alfa Slab One 34 px `#ffb703`** con su sello EJEMPLO girado -12°.
- Selector de cantidad: `−  1  +` con botones de **44×44**, radio 14 px, `#221309`, filete ámbar
  arriba-izquierda, mal registro.
- CTA ancho completo (326×58): **"Agregar · $XX.XXX"**, misma palanca roja de la portada.
- **Nada de "también te puede gustar"** con productos inventados. Nada de "el más vendido".

---

### PANTALLA 4 · CARRITO + PAGO — "la comanda"

> **Propósito de venta:** no perder a nadie en el último metro. **Aquí la tranquilidad se dibuja
> como un objeto físico: papel, ranura y sello.** No se apaga la pantalla: se cambia de material.

- **Fondo del checkout — se escribe con el mismo detalle que la portada, porque una superficie sin
  especificar es exactamente por donde se filtró el design system ajeno la vez pasada.** Suelo
  `--noche` `#0d0906`; encima, **la campana de la freidora bajada al 40 % y recolocada ABAJO**, de
  modo que entre **por debajo de la hoja** y el aceite se vea caliente justo detrás del total:
  `radial-gradient(140% 60% at 50% 118%, #c2410c 0%, #2a1108 52%, #0d0906 80%)`. Encima, **grano R1
  al .05** sobre toda la pantalla y **viñeta interior** `inset 0 0 120px 40px rgba(0,0,0,.7)`.
  **Prohibido dejar esta pantalla en un plano oscuro liso.**
- **La hoja sube desde abajo** con la animación que ya existe y que **no se toca**
  (`animate-subir 0.28s cubic-bezier(0.2,0.9,0.3,1)`, `globals.css:73-76, :94` — el dato es para el
  ANEXO B, no para el artboard), `max-h: 88dvh`, radio superior 28 px, agarradera 40×4.
- **Carrito — una BANDEJA CARGADA, no una lista con miniaturas.** Las estampillas de los productos
  pedidos se **apilan solapadas al 60 %** en una fila a media altura de la hoja: **88 × 88** cada
  una (caja interior 72, sin troquelado a ese tamaño), giros alternos **±3°**, sombra dura
  `4px 4px 0 rgba(0,0,0,.55)` a 135°, la de más adelante encima. El **número de unidades** va en la
  **chapa** de cada estampilla: disco de 22 px `#0d0906` con la cifra en Alfa Slab One 13 px
  `#ffb703`, pegado a su esquina superior izquierda. Debajo, una línea por producto en Familjen
  Grotesk 13 px con números tabulares, la cantidad editable con botones de 44 px, y el **total en
  Alfa Slab One 26 px `#ffb703`** con **su sello EJEMPLO girado -12° pisando el bloque de líneas**
  (los precios del carrito son de maniquí igual que los de la carta: apartado 8.12). Bajo el total,
  **"Se paga al recibir."** (`HojaCarrito.tsx:66`).
- **Pago: una sola pantalla, cinco campos** — nombre, teléfono, **dirección (protagonista, porque
  el domicilio manda)**, notas; conmutador **Domicilio / Recoger con Domicilio por defecto**
  (`HojaCheckout.tsx:55`); subtítulo "Pedido de {sede} · se paga al recibir"
  (`HojaCheckout.tsx:96`). Campos: alto 52 px, radio 14 px, fondo `#221309`, borde 1 px `#3a2416`,
  filete ámbar arriba, texto crema, etiqueta flotante en `#c9a883` 12 px. Los mensajes de error son
  **los que ya están escritos**: "¿Cómo te llamas?", "Déjanos un teléfono para llamarte.",
  "Necesitamos la dirección para llevártelo." (`HojaCheckout.tsx:68-74`).
- **🔥 MOMENTO MEMORABLE — "la comanda que sale de la máquina". Es un OBJETO, no un panel girado un
  grado** *(a 326 px de ancho, 1° son 5,7 px: eso no se lee como torcido, se lee como una caja mal
  alineada. En un documento que se atreve a -12° en los sellos y -7° en `¡CRUJE!`, un grado es
  timidez)*:
  - **La ranura de la impresora, dibujada:** banda de **326 × 10** en `#070403` con filete ámbar de
    1 px arriba y **sombra dura de 6 px a 135° cayendo sobre el papel**. El ticket **nace de ahí**.
  - **El ticket:** papel crema `#f7ece1` de **326 × 150**, girado **-3°**, con su esquina superior
    izquierda anclada bajo la ranura. El borde inferior **no lleva círculos regulares**: lleva el
    **`clip-path` de 14 puntos irregulares del papel arrancado** que ya está definido en la
    transición de sección de la pantalla 2.
  - **La segunda hoja:** otro papel asomando **8 px por detrás**, girado **+2°**, al **55 %** de
    opacidad. Dos papeles = una máquina que ya imprimió otro. Ahí está el volumen.
  - **Dentro:** las líneas del pedido en Familjen Grotesk 12 px `#7a2408` con números tabulares, y
    el **TOTAL en Alfa Slab One 30 px `#16100c`** (16,20:1), **con su sello EJEMPLO girado -12°
    encima del TOTAL** (los precios siguen siendo de maniquí también aquí).
  - **El sello grande:** **"SE PAGA AL RECIBIR"**, girado **-12°**, pisando la esquina, y **con
    doble plancha de mal registro** (negra 3 px + `#e01e2b` a 5 px) — **es el argumento de venta
    nº 3 del apartado 3 y merece ser la pieza más rara de la pantalla**.
  - *Por qué vende: el miedo de este cliente es pagar por internet a un negocio de pueblo; el sello
    convierte la garantía en un objeto físico en vez de una línea de texto legal.*
- Debajo, en Familjen Grotesk 13 px `#c9a883`: **"No pagas nada ahora. Se paga al recibir."**
  (`HojaCheckout.tsx:109`).
- Aquí va clavado el ticket del hueco **H-10** (cobertura, costo y mínimo del domicilio), porque
  es exactamente donde su ausencia hace daño.

---

### PANTALLA 5 · CONFIRMACIÓN (`/orden/[id]`) — "está en el aceite"

> **Propósito de venta:** que la espera se sienta acompañada y que la próxima vez vuelva.

- Suelo `#0d0906` con la campana de la freidora atenuada al 60 % arriba-derecha.
- **Número del pedido** `L1-0042` en **Alfa Slab One `clamp(48px, 14vw, 64px)` `#f7ece1`**
  (`dominio.ts:88-89`), con la palabra "TU PEDIDO" en Familjen Grotesk 700 · 11 px ·
  `tracking .18em` · `#c9a883` encima.
- **🔥 MOMENTO MEMORABLE — "LA BARRA DE BRASA".** Traducción literal del eslogan real, y **sin
  inventar un solo dato**: una barra de **326 × 10 px**, radio 5, canal vacío `#2b1c14`, con
  **4 marcas grabadas de 1 px** que son **los cuatro estados reales** del pedido
  (`Confirmacion.tsx:30-53`): *Pedido recibido → En el aceite → Listo → Entregado*. Lo recorrido va
  en `linear-gradient(90deg, #e01e2b, #ff8a20, #ffd08a)` y **la punta está al rojo blanco**
  (`#fff2d6` con `box-shadow: 0 0 14px 4px rgba(255,190,90,.55)`). El artboard se dibuja en el
  estado **"En el aceite"** (barra al 50 %): entonces **el charco de aceite se enciende detrás del
  número** (radial ámbar de 300×180 al 22 %), salen **2 cintas de vapor** desde la punta de la
  barra y **3 gotas + 9 migas con estela** alrededor. *Congelado:* una barra a media carga con la
  punta ardiendo es el signo universal de "esto está pasando ahora mismo" — y aquí **es verdad**,
  porque el estado viene del servidor. **Está prohibido pintar un contador de tanda o unos minutos
  inventados: ese campo no existe en el sistema** (ver H-5).
- Estado en vivo con **sus textos reales**; el estado `preparando` se llama **"En el aceite"** y se
  lleva la pieza visual más caliente de toda la app: **cuando el pedido está en ese estado, las
  palabras `EN EL ACEITE` se escriben en Bungee Shade, giradas -4°, `#ffd8a8` con
  `-webkit-text-stroke: 3px #0d0906` y sombra dura `5px 5px 0 #e01e2b`**, cruzando por encima de la
  barra de brasa, **a 56 px** (el mínimo de esa familia, apartado 5) **y en dos renglones —`EN EL` /
  `ACEITE`—**, sangrando -10 px por la izquierda. **Es la SEGUNDA y última aparición de Bungee Shade
  en toda la vitrina** (la
  primera es `¡CRUJE!` en la portada) y cierra el círculo: la broma tipográfica termina sobre el
  nombre de la dirección de arte, que además es un dato real del servidor
  (`Confirmacion.tsx:30-53`). No es una onomatopeya: `¡CRUJE!` sigue siendo la única.
- A dónde se lleva o dónde se recoge (nombre de la sede + su línea de sector), el detalle de líneas
  con precios congelados y su sello EJEMPLO, el total, y
  **"Se paga al recibir, en efectivo o transferencia."** (`Confirmacion.tsx:217`).
- Dos botones: **"Actualizar estado"** (secundario: 326×48, sin relleno, borde 1 px `#3a2416`,
  texto `#c9a883`) y **"Pedir algo más"** (la palanca roja). El secundario **nunca** compite.
- **Solo aquí abajo**, la invitación callada a dejar el correo o el celular, sobre la franja del
  aceite con el foco ya puesto.

---

## 5. REGISTRO VISUAL Y PALETA (contrastes CALCULADOS, no estimados)

**Registro:** la freidora a las ocho de la noche. Penumbra caliente, la lámpara del extractor
cayendo sobre el aceite, el dorado saliendo de la oscuridad con el vapor todavía subiendo — y una
sola cosa que hacer.

**Ningún negro ni gris neutro en toda la página.** Todos los negros están desplazados a rojo y
amarillo. **Si una superficie se lee gris, la dirección está mal ejecutada.**

| Token | Hex | Papel |
|---|---|---|
| `--noche` | `#0d0906` | suelo de la portada, **del checkout** y de la confirmación; también la plancha de lectura de la portada (es el `#0a0a0a` del proyecto desplazado a rojo) |
| `--mostrador` | `#16100c` | suelo de la carta |
| `--ficha` | `#221309` | fondo de fila, campos, chips inactivos |
| `--chapa` | `#1c1410` | cabecera de categoría |
| `--sedes` | `#0a0705` | bloque de sedes |
| `--cierre` | `#070403` | franja del aceite |
| `--canal` | `#2b1c14` | canal vacío de la barra de brasa |
| `--ladrillo` | `#7a2408` | relieve de la palabra, tinta sobre papel crema |
| `--rojo` | `#e01e2b` | **relleno de marca. NUNCA tinta** |
| `--naranja` | `#ff8a20` | mal registro, chip activo, hilos |
| `--ambar` | `#ffb703` | precios y cifras |
| `--aceite-alto / medio / hondo / borde` | `#ffc86b` / `#f59e0b` / `#b4520f` / `#6b2a08` | el charco |
| `--crema` | `#f7ece1` | **tinta y papel pequeño. JAMÁS lienzo** |
| `--arena` | `#c9a883` | texto secundario |
| `--arena-honda` | `#9c8471` | descripciones de producto |
| `--miel` | `#f0c98a` | el eslogan |
| `--tinta-aceite` | `#3d1a06` | **la única tinta permitida encima del aceite** |

**Contrastes (WCAG 2.1, calculados sobre estos hex — no los redondees hacia arriba):**

| Texto | Sobre | Ratio | Veredicto |
|---|---|---|---|
| `#f7ece1` | `#16100c` | **16,20** | ✔ cualquier tamaño |
| `#f7ece1` | `#0d0906` | **17,04** | ✔ |
| `#c9a883` | `#221309` | **8,08** | ✔ |
| `#9c8471` | `#221309` | **5,11** | ✔ (mínimo 13 px; no bajar de ahí) |
| `#9c8471` | `#2b1c14` | **4,65** | ⚠ justo: no usarlo sobre superficies más claras que ésta |
| `#f0c98a` | `#0d0906` | **12,68** | ✔ eslogan (sobre la plancha de lectura, **nunca sobre el charco**: ahí daría ≈ 2,1) |
| `#c9a883` | `#0d0906` | **8,86** | ✔ línea de servicio, sobre la plancha de lectura |
| `#ffb703` | `#16100c` | **10,80** | ✔ precios |
| `#ff8a20` | `#0d0906` | **8,41** | ✔ |
| `#0d0906` | `#ff8a20` | **8,41** | ✔ chip activo |
| `#3d1a06` | `#ffc86b` | **10,18** | ✔ tinta sobre el aceite alto |
| `#3d1a06` | `#f59e0b` | **7,25** | ✔ tinta sobre el aceite medio |
| `#ffffff` | `#e01e2b` | **4,78** | ✔ etiqueta del CTA |
| `#f7ece1` | `#e01e2b` | **4,11** | ⚠ **solo ≥ 24 px en negrita** (regla 3:1) |
| `#7a2408` | `#f7ece1` | **8,66** | ✔ tinta sobre papel |
| `#16100c` | `#f7ece1` | **16,20** | ✔ total de la comanda |
| `#f7ece1` | `#b4520f` | **4,34** | ✘ **prohibido**: nada de crema sobre el aceite hondo |
| `#e01e2b` | `#0d0906` | **4,15** | ✘ **el rojo nunca es texto** |

**Las tres trampas que salen de esa tabla, y su solución obligatoria:**

1. **Sobre el aceite solo va `#3d1a06`, y solo en cifras y rótulos de 13 px para arriba.** Ni crema
   ni arena ni blanco: `#f7ece1` sobre `#b4520f` da 4,34 y falla. **Todo texto de lectura vive sobre
   `#0d0906` / `#16100c` / `#221309`.** Y esto **se verifica por COORDENADAS, no por el color que
   declaraste**: si la elipse del aceite o la caja de la foto pasan por debajo de una línea de
   texto, esa línea necesita **una plancha opaca propia** (así nació la plancha de lectura de la
   portada, `y 616–700`).
2. **El rojo `#e01e2b` es relleno, jamás tinta** (4,15 sobre la noche). Encima del rojo va blanco
   (4,78) o crema en 24 px negrita (4,11 ≥ 3:1).
3. **`#9c8471` no baja de 13 px** y no se apoya en nada más claro que `#2b1c14`.

**TIPOGRAFÍA — presupuesto de 3 familias obligatorias + 1 restringida.** *(En el intento anterior
cargaste UNA sola familia y mandaste todo el cuerpo a `system-ui`: por eso aquí van con su `<link>`
explícito, su prioridad y su pila de respaldo escrita. Si solo puedes cargar una, que sea la 1.)*

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Bungee+Shade&family=Familjen+Grotesk:wght@400;600;700;800&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
```

1. **ALFA SLAB ONE (400)** — *la voz que grita.* Slab gordísimo con olor a rótulo de asadero de
   pueblo, no a agencia. `BROASTER`, precios, número del carrito, número de la orden, nombres de
   sede, datos grandes. **Nunca en texto corrido.** Respaldo: `"Alfa Slab One", "Rockwell", "Bookman Old Style", Georgia, serif`.
2. **FAMILJEN GROTESK (400/600/700/800)** — *la voz de trabajo.* Grotesca con rarezas propias, no
   es Inter disfrazada y aguanta 13 px a 390. Nombres de producto, descripciones, rótulos,
   etiquetas, botones, sellos. Números tabulares para cantidades y totales. Respaldo:
   `"Familjen Grotesk", "Segoe UI", system-ui, sans-serif`.
3. **BUNGEE SHADE (400)** — *la broma, exactamente dos veces.* **`¡CRUJE!` en la portada** y
   **`EN EL ACEITE` en la confirmación**, y nada más, a **56 px como mínimo** (por debajo se
   ensucia). *La segunda aparición no es un capricho: cierra el círculo sobre el nombre de la
   dirección de arte, que además es un estado real del servidor, y evita que la única pieza
   divertida de la vitrina muera en el primer pliegue.* Respaldo si no carga: Alfa Slab One con
   `-webkit-text-stroke: 4px #0d0906` y la misma sombra dura.
4. **INSTRUMENT SERIF ITALIC (400)** — *restringida.* **Exactamente 2 apariciones en toda la
   vitrina**: el eslogan real en la portada y los descriptores de sede. **Jamás como voz de
   sección.** Si tuvieras que sacrificar una familia por peso, sacrifica ésta y el eslogan pasa a
   Familjen Grotesk 600 en cursiva.

**Escala completa a 390 px:** 96 / 64 / 54 / 34 / 30 / 25 / 22 / 19 / 17 / 14 / 13 / 12 / 11 / 9.
Interlineado **0,88** en display, **1,15** en la serifa, **1,45** en cuerpo. **Mínimo absoluto para
algo que el cliente deba leer: 13 px.** Display siempre en mayúscula; cuerpo siempre en frase;
**nada en Title Case**.

**Escala de radios (el radio 0 uniforme está prohibido y la píldora también):** 28 px borde
superior de las hojas · 20 px estampilla de aceite · 14 px CTA, campos, chips y botones · 5 px
barra de brasa · 3 px papel (tickets, sellos, cintas). **`border-radius: 999px` y `50%` solo
existen en tres piezas nombradas: la ficha del carrito (40 px), el botón `+` (34 px) y las gotas de
aceite.** *(En el intento anterior usaste `border-radius: 999px` 16 veces y `50%` 12 veces: ésa es
la gravedad del medio y aquí se corta por escrito.)*

---

## 6. INTERACCIÓN EN REPOSO — **qué se VE, no qué se mueve**

Tu lienzo devuelve artboards estáticos. En el intento anterior, `document.getAnimations()` dio **1**
en toda la página: los 650 ms de coreografía **no se entregaron** y el dueño juzgó una captura
muerta. Aquí **la página tiene que gritar en un PNG quieto**. Catorce recursos, todos pintados,
**cero `@keyframes`**:

| # | Recurso | Estado congelado que se ve en la captura |
|---|---|---|
| R1 | **Grano de película** | `feTurbulence .9`, opacidad .05, `overlay`, sobre toda la página. Solo esto ya elimina el "plano" del intento anterior |
| R2 | **Humo** | turbulencia de semilla fija difuminada en banda de 0–300 px, `screen` al 22 %. Se ve humo, no un degradado |
| R3 | **Salpicadura congelada** | 14 migas + 3 gotas en arco, **con estela direccional que crece a lo largo de la trayectoria**. Un fotograma de algo que salta lee como movimiento |
| R4 | **Vapor** | 2 cintas en S saliendo de la costra a 18° y 31°. Vapor quieto = "acabado de salir" |
| R5 | **Mal registro** | 40 piezas impresas dos veces con 5 px de desfase y blur 0: el ojo lee **temblor**. Una línea de CSS, ninguna animación |
| R6 | **Luz de borde** | filete de 1 px `rgba(255,196,107,.5)` en todo canto que mira arriba-izquierda: los objetos parecen **iluminados**, no coloreados |
| R7 | **Oclusión en cuatro planos** | la foto tapa la palabra · `¡CRUJE!` tapa la foto · la estampa del precio invade la foto · el humo tapa el fondo. El intento anterior tenía un solo plano |
| R8 | **Nada está a escuadra** | héroe -8° · estampillas ±3° · sellos -12° · tickets -1,5° · `¡CRUJE!` -7°. Tensión cinética detenida |
| R9 | **Brillos especulares** | 3 elipses de blanco caliente al 12 % sobre las crestas de la costra |
| R10 | **Migas en el mostrador** | **14 migas de 4–7 px al 22 %** apoyadas en el borde inferior de las ranuras, con su sombra dura: mostrador usado, no renderizado. **Al 5 % no se ven y el fondo se lee plano** |
| R11 | **La bandeja a sangre** | dos filas de la carta con la foto sangrando por los DOS bordes (≥ 390 px), el nombre sobreimpreso y 6 migas cruzando la ranura hacia la fila de abajo |
| R12 | **Barra de brasa a media carga** | punta al rojo blanco con halo: "esto está pasando ahora", y es un dato real del servidor |
| R13 | **La tanda que pasa** | fila de 3 estampillas detenida a media pasada en la portada (`y 496–592`), la primera mordida por el borde izquierdo y la tercera por el derecho |
| R14 | **La ranura de la impresora** | el ticket del checkout naciendo de una banda negra con filete ámbar, girado -3°, con una segunda hoja asomando por detrás |

**Prueba de aceptación de este apartado:** captura las 5 pantallas a 390×844 y míralas sin tocar
nada. Si alguna se ve tan quieta como `cap-top.png`, **el apartado está incumplido**.

---

## 7. RESTRICCIONES TÉCNICAS REALES (verificadas)

- **Lo que existe:** Next **16.3.0**, React **19.2.4**, Tailwind **4**, TypeScript y **cero
  dependencias más** (`villa-app/package.json:14-24`). No propongas `lucide-react`,
  `framer-motion`, GSAP ni ninguna librería: los iconos van en **SVG inline**, como ya se hace
  (`Encabezado.tsx:43-51`).
- **Tu entregable:** **artboards HTML autocontenidos** con las 5 pantallas a 390 px (CSS y SVG
  dentro; sin build, sin CDN salvo el `<link>` de Google Fonts del apartado 5). **No entregas
  React:** entregas la maqueta que después se porta a
  `villa-app/components/tienda/*.tsx`, `components/orden/Confirmacion.tsx` y `app/globals.css` de
  forma **aditiva**. Está **prohibido** tocar `villa-app/lib/**`.
- **La vitrina no guarda nada:** es proxy a las APIs del sistema. No dibujes estados que el
  servidor no publica.
- **Estructura del layout:** la app **no se estira** en escritorio; se queda en columna centrada de
  480 px sobre negro (`globals.css:147-158`). **Jamás una barra lateral.**
- **Imágenes.** Las 9 llegan en PNG RGB de 1254×1254 y 1,5–2 MB: **así no se publican nunca**, el
  celular que abre esto viene de un estado de WhatsApp. Sirve **WebP**, sin alfa (no hace falta:
  el blanco es el aceite) y **sin borrar la sombra incrustada** (bajo `multiply` se convierte en
  sombra sobre el aceite):
  - héroe: **620 px**, ≤ **110 KB** · `loading="eager"`, `fetchpriority="high"`;
  - bandeja a sangre de la carta: **420 px**, ≤ **55 KB**;
  - hoja de producto: **300 px**, ≤ **45 KB**;
  - estampilla de carta y de la tanda: **192 px**, ≤ **28 KB**;
  - macro del cierre: **760 px**, ≤ **120 KB**.
  - Peso total de la pantalla 1: **≤ 700 KB**. Las demás fotos, `lazy` + `decoding="async"`.
- **Rendimiento (regla dura):** **máximo 3 elementos con `filter: blur()` por pantalla** —el humo,
  el vapor y nada más—; el grano y el humo se hornean como **un solo data-URI SVG**;
  **PROHIBIDO `backdrop-filter`** (destroza el scroll en gama baja y suele romperse en captura
  estática); **cero `box-shadow` con blur grande en elementos que hacen scroll** (las sombras de
  esta dirección son **duras, blur 0**, y por eso son baratas); rotaciones solo con `transform`.
- **`isolation: isolate`** en cada contenedor de estampilla: sin él, `multiply` multiplica contra el
  fondo casi negro y **el producto se vuelve una mancha**. Verifícalo producto por producto;
  `papas-fritas` y `arepa` son las más claras y las que más dependen de esto.
- **Alturas en `100dvh`**, nunca `100vh`, y `env(safe-area-inset-top/bottom)` como ya se usa
  (`Encabezado.tsx:37`, `BarraCarrito.tsx:29`).
- **Desborde:** `overflow-x: hidden` en el contenedor de la portada. `BROASTER` se sale a propósito
  por la derecha y las rotaciones desbordan 1–2 px: el documento debe medir **390 exactos**.
- **`prefers-reduced-motion`** ya está respetado globalmente (`globals.css:138-144`). Como toda esta
  dirección está congelada, **con el movimiento apagado la página se ve idéntica**. Ése es el punto.

---

## 8. PROHIBIDO EN ESTE PROYECTO

1. **Anclar, adjuntar o generar un design system.** Ver **ANEXO A**. En el intento anterior se
   ancló "Modernist" (fondo `#f3f2f2`, radio 0, Archivo, fotos en blanco y negro) y ese DS le
   ganó a la dirección de arte. **No vuelve a pasar.**
2. **Fondo claro o crema a pantalla completa.** El crema `#f7ece1` es **tinta y papel pequeño**
   (tickets, sellos, cintas): **nunca el lienzo**. En comida, una portada clara mata el hambre.
3. **Azules eléctricos, morados, neones, gradientes tecnológicos, rosa caramelo, verde lima.** Es
   un asadero, no una startup.
4. **Cualquier negro o gris neutro** (`#0a0a0a`, `#141414`, `#808080`, `#f3f2f2`…). Todos los
   negros van desplazados a rojo/amarillo.
5. **Archivo, Inter, Roboto, Helvetica** y cualquier grotesca de sistema como voz de la página.
6. **Fotos en blanco y negro, desaturadas o tramadas.** Prohibido el semitono, la trama de puntos o
   cualquier artefacto de imprenta **encima de la comida**: la costra fotográfica es lo único que
   produce hambre de verdad.
7. **El círculo perfecto como recorte de producto** (les corta las puntas a 4 de las 9 fotos), **el
   disco crema con anillo** del intento anterior, y **`border-radius: 999px`** fuera de las tres
   piezas nombradas en el apartado 5.
8. **Encoger el producto para que quepa** en una forma. Se agranda la forma.
9. **Precios tachados, "antes/ahora", y cualquier porcentaje de descuento que salga de tu cabeza.**
   El servidor congela precios y no conoce descuentos (`lib/promos.ts:14-24`). **Excepción única,
   escrita y ya resuelta** (no la decidas tú): el cupón `VB-TANDA-05` **se llama** "5% en la tanda
   de las 3" (`promos.ts:121`). Es copy transcrito del prototipo, no un tratamiento de precio: se
   dibuja tal cual con su sello PROTOTIPO, y es **el único `%` del texto visible de la vitrina**.
10. **Datos inventados de cualquier tipo:** teléfonos, direcciones, **la ciudad** (no aparece en
    ningún archivo), NIT, cobertura de domicilio, horarios, minutos de demora, número de tanda,
    "20 años friendo", "más de 1.000 familias", estrellas, reseñas, testimonios, "el más vendido",
    "quedan pocas". **Cero.**
11. **Las 4 fotos reservadas** (muslo, filete de pollo, filete de cerdo, papa horneada) en
    cualquier papel, incluido el de textura de fondo, hasta que se responda **H-2**.
12. **Los códigos `VB-*` sin sello PROTOTIPO** y cualquier precio de ejemplo sin sello EJEMPLO.
13. **"Local 1 / Local 2"** de cara al cliente (`marca.ts:9-10`); calles, nomenclatura o mapas en
    las sedes: **solo el sector**.
14. **Acordeones grises con avatares de iniciales** ("Co", "Fa", "Be"), **tarjetas redondeadas
    idénticas apiladas** y **tarjetas de métrica tipo dashboard**. Eso es un panel de control, no
    un negocio de pollo. **Y con el mismo motivo: el avatar de PALABRA.** Prohibido meter dentro de
    la forma ámbar el nombre de la categoría, una inicial, un icono o una silueta dibujada. El
    problema nunca fue el círculo: era repetir 18 veces una pieza que no informa nada. Dentro del
    ámbar va **el precio**, y cada precio es distinto.
15. **Ilustraciones vectoriales inventadas** (remolinos, carreteras con árboles, billetes, monedas,
    iconos de comida dibujados): no hay esos assets en disco y el dibujo genérico delata la
    plantilla. Solo existen las 9 fotos, el tipo, las formas y la luz. **En particular: no se dibuja
    una gaseosa, un balde, una presa ni una papa criolla que no tenga foto en disco**, ni siquiera
    "de relleno" dentro de una promo. Si no hay foto, hay papel con la palabra escrita.
16. **Barra lateral**, **inglés en la interfaz**, **modales de bienvenida** y cualquier cosa que se
    interponga entre el dedo y la comida.
17. **Feria vieja / kitsch sucio:** nada de textura de papel envejecido, manchas de café, amarillos
    verdosos ni tipografía western. **Cuotas medibles, POR PANTALLA y por tipo** *(la versión
    anterior de esta regla se contradecía con lo que las propias pantallas pedían, y ante una
    contradicción el medio siempre resuelve borrando lo raro)*:

    | Pantalla | Migas | Gotas | Cintas de vapor | Papelillos |
    |---|---|---|---|---|
    | 1 · Portada | 14 | 3 | 2 | **8** |
    | 2 · Carta | 14 (fondo) + 6 por bandeja | 0 | 0 | 0 |
    | 3 · Hoja de producto | 9 | 3 | 0 | 0 |
    | 4 · Checkout | **0** — su textura es papel, no partículas | 0 | 0 | 0 |
    | 5 · Confirmación | 9 | 3 | 2 | 0 |

    **Ninguna pantalla que no sea la portada lleva papelillos.** Y el tope de giro va en dos:
    **ningún giro pasa de 12°**; máximo **2 elementos girados más de 8° por pantalla ENTRE PIEZAS DE
    MÁS DE 100 px**; **los sellos de caucho y los tickets de hueco quedan exentos** y van todos a
    **-12°** / **-2°**, porque su repetición **es** el estilo de la casa (y porque el criterio C7
    exige uno por precio: la cuota y el criterio no pueden pelearse).

18. **"Abajo la página se calma" — esa frase queda derogada.** Lo que baja pantalla a pantalla es
    **la cantidad de partículas, no la temperatura**. La regla positiva que la sustituye:
    **cada pantalla tiene UN objeto raro a escala grande**, y cada uno es de **clase distinta** —
    portada: `¡CRUJE!` cruzando la costra · carta: la bandeja a sangre + las chapas esmaltadas ·
    hoja de producto: la pieza de 300 px rompiendo el borde de la hoja · checkout: la ranura de la
    impresora con el ticket a -3° y su sello · confirmación: la barra de brasa y `EN EL ACEITE` en
    Bungee Shade. **Si una pantalla no tiene el suyo, está incumplida.**

---

## 9. HUECOS DEL DUEÑO (numerados; ninguno se rellena con algo verosímil)

Mientras falte el dato, **esa parte no se publica**. En el diseño, un hueco **se ve**: es un
**ticket de papel crema clavado**, de 150×34, girado -2°, con el número del hueco en Familjen
Grotesk 800 · 10 px · `#7a2408`, el dato faltante como `__` en Alfa Slab One y la coletilla "lo
confirma el dueño". *(En el intento anterior la palabra "hueco" apareció CERO veces en todo el
HTML: por eso aquí llevan sitio dibujado y cuenta verificable.)* **Todo hueco marcado "Sí" tiene
sitio asignado en el apartado 4 y ninguno se improvisa:** H-1 y H-7 en la carta, H-2/H-3/H-8/H-9 en
**la franja de pendientes** (pantalla 2), H-4/H-5/H-6 en el bloque de sedes, H-10 en el pago y
H-11 en la franja del cierre.

| # | Hueco | Por qué importa | ¿Se pinta? |
|---|---|---|---|
| **H-1** | **Carta y precios reales por sede** (los 23 son semilla de ejemplo, `almacen-disco.ts:360-366`) | La vitrina lee precios en vivo: el día de publicar mostraría precios de maniquí con el nombre del cliente encima | **Sí**: 1 sello EJEMPLO por precio + la cinta al pie de la carta |
| **H-2** | **Los 4 productos fotografiados que no están en la carta** — muslo apanado, filete de pollo, filete de cerdo, papa horneada. ¿Existen, cómo se llaman, cuánto valen? | Son 4 de las 9 fotos: casi la mitad del material está parado | **Sí**, ticket en **la franja de pendientes** (pantalla 2, entre sedes y cierre) |
| **H-3** | **Origen y derechos de las 9 fotos** | La regla de la casa prohíbe stock genérico; y si el pollo real no se parece a esas fotos, la primera queja llega con la primera entrega | **Sí**, ticket en la franja de pendientes |
| **H-4** | **Horarios reales de cada sede** (11:00–9:00 p.m. / 11:00–10:00 p.m. son del prototipo, `marca.ts:40, :48`) | Un horario falso manda gente a un local cerrado | **Sí**, clavado en el bloque de sedes: "ABRE `__:__` · CIERRA `__:__`" |
| **H-5** | **Demora real por sede** ("25 – 35 min" / "30 – 40 min" son del prototipo; el código dice *"hoy nadie la calcula, la dice el dueño"*, `marca.ts:31`). **Y si algún día hay número de tanda, es este hueco** | En una portada, un tiempo se lee como compromiso; y sin este campo **está prohibido pintar un contador de tandas** | **Sí**, clavado en sedes: "TANDA `__` · SALE EN `__` MIN" |
| **H-6** | **WhatsApp / teléfono de cada sede** | Media clientela prefiere escribir antes que llenar un formulario; sin el dato la vitrina pierde su segundo canal | **Sí**, clavado en sedes |
| **H-7** | **Promos y cupones reales** (título, qué incluye, código, condición, vigencia). Los actuales son prototipo (`promos.ts:2-7`) | Un cupón publicado es una promesa que alguien reclama en el mostrador mañana | **Sí**: sello PROTOTIPO sobre los 3 códigos `VB-*` + ticket sobre la fila |
| **H-8** | **Logo definitivo** (hoy hay una "llama" SVG provisional, `Encabezado.tsx:43-51`) | El héroe necesita una marca que aguante 44 px y 16 px | **Sí**, ticket en la franja de pendientes |
| **H-9** | **Fotos de las dos sedes y de quien fríe** | Sin ellas no hay sección "el local" y la cercanía se queda en el texto | **Sí**, ticket en la franja de pendientes |
| **H-10** | **Cobertura del domicilio, costo y pedido mínimo** | "Domicilio" sin decir hasta dónde genera pedidos que hay que cancelar | **Sí**, clavado en la pantalla de pago |
| **H-11** | **Una frase de oficio verificable** (desde cuándo, quién fríe, qué lleva el apanado) | Con ella el cierre pasa de correcto a memorable; sin ella no se escribe nada | **Sí**, clavado en la franja del cierre |
| **H-12** | **¿La portada va en `/` encima de la carta, o en ruta aparte?** | De eso depende a dónde apuntan las campañas y los QR, y si `?sede=` sigue aterrizando directo en la carta | No se pinta: va en la nota de entrega |

---

## 10. CRITERIOS DE ACEPTACIÓN (medibles a 390×844, no opinables)

La verdad de terreno es **Edge headless por CDP**, no el navegador embebido:
`node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url <archivo.html> --width 390 --height 844 --mobile --shot salida.png --eval "<js>"`.

- **C1 · Sin desborde horizontal en las 5 pantallas:** `document.documentElement.scrollWidth` → **390** exacto.
- **C2 · El héroe mide una pantalla:** el contenedor del héroe da **844 ± 4 px** y usa `100dvh`.
- **C3 · El CTA está sobre el pliegue:** el borde inferior de "Pedir ahora" queda en **y ≤ 800** sin
  scrollear, con alto ≥ 56 px y ancho ≥ 320 px.
- **C4 · LA PORTADA ES OSCURA — medida GLOBAL, no por píxeles sueltos.** *(La versión anterior de
  este criterio muestreaba `(195,40)` y `(20,700)`, que caen dentro de la campana y dentro del
  charco: castigaba justo la dirección de arte y una ejecución correcta quedaba "rechazada de
  entrada". Corregido.)* Sobre la captura de la pantalla 1:
  (a) **mediana de luminancia relativa < 0,20**; (b) **ninguna banda horizontal de 40 px promedia
  > 0,50**; (c) en la mitad superior (`y 0–422`), **excluyendo tipografía, sellos, tickets y la caja
  de la foto**, ningún píxel de **fondo** es más claro que `#2a1108`; (d) los píxeles `(12, 120)` y
  `(378, 150)` por debajo de **0,10**. **La campana (centro 62 % / 8 %) y el charco de aceite son
  ámbar POR DISEÑO y no se muestrean.** *Referencia: un fondo claro tipo `#f3f2f2` —el fallo del
  intento anterior— da mediana ≈ 0,88 y bandas > 0,80. El criterio caza ese fallo sin castigar el
  aceite.*
- **C5 · El producto manda — criterio de MASA, no de píxel.** *(Bajo `multiply` la costra no puede
  ser más brillante que una etiqueta blanca: pedir que el píxel más brillante sea comida es pedir un
  imposible, y un chequeo imposible enseña a no hacerse los chequeos.)* Excluyendo la tipografía y
  el relleno del CTA: **el mayor área contigua con luminancia > 0,35 pertenece a la caja de la foto
  o a su charco ámbar**, y esa área es **≥ 3× la del CTA**. Además la foto del héroe mide **≥ 600 px**
  de ancho renderizado.
- **C6 · Nada de gris neutro.** Recorre los `background-color` y `color` computados de las
  superficies de relleno. Si el canal máximo es **≥ 32**: tiene que cumplirse `|R−G| ≥ 6` **o**
  `|G−B| ≥ 6`. Si es **< 32** (los suelos: a 13 niveles de brillo cualquier tinte cae por debajo de
  un umbral absoluto): tiene que cumplirse **`R > G ≥ B`** — `#0d0906` (13>9>6) ✔, `#0a0705` ✔,
  `#070403` ✔, y `#0a0a0a` (10=10=10) **✘ queda cazado**, que es exactamente lo que el criterio
  existe para cazar. **Quedan fuera del test** las sombras, viñetas y filetes (`rgba(0,0,0,*)` y
  `rgba(255,255,255,*)`), el blanco de la etiqueta del CTA y los brillos especulares.
- **C7 · Sellos contados:** número de sellos "EJEMPLO" **=** número de precios visibles **en TODA la
  entrega — pantallas 2, 3, 4 y 5**, no solo en la carta. Eso incluye el total del carrito, el TOTAL
  de la comanda y el detalle de la confirmación.
  `document.body.innerText.match(/EJEMPLO/g).length` **≥ 23** en el artboard de la carta (los 23
  productos) y **≥ 1** en cada una de las pantallas 3, 4 y 5.
- **C8 · Huecos contados:** la palabra "H-" numerada aparece **≥ 9 veces** entre las 5 pantallas
  (H-2/H-3/H-8/H-9 en la franja de pendientes, H-4/H-5/H-6 en sedes, H-10 en pago, H-11 en el
  cierre), y al menos **una** en la pantalla de pago (H-10).
- **C9 · Píldoras y círculos:** `border-radius: 999px` / `50%` aparece **como máximo 3 veces** y solo
  en la ficha del carrito, el botón `+` y las gotas.
- **C10 · Superficie crema:** la suma de superficies `#f7ece1` **no pasa del 18 %** del área visible
  de ninguna pantalla de 390×844.
- **C11 · Toques:** ningún control mide menos de **40×40**; los principales (CTA, `+`, cantidad,
  chips) **≥ 44×44**; separación mínima 8 px.
- **C12 · Peso:** ninguna imagen supera **120 KB**; la pantalla 1 completa pesa **≤ 700 KB**.
- **C13 · Contraste:** cada par texto/fondo nuevo va anotado con su ratio en un comentario CSS; **ninguno
  baja de 4,5:1** (3:1 si el texto es ≥ 24 px en negrita). Atención especial a los dos ✘ del apartado 5.
  **Y se verifica POR COORDENADAS, no por el color declarado:** ningún texto de lectura se dibuja
  encima de la elipse del aceite ni encima de la foto. Si la geometría dice que sí, ese texto lleva
  plancha opaca propia o se mueve.
- **C14 · Blend a salvo:** todo elemento con `mix-blend-mode: multiply` tiene un ancestro con
  `isolation: isolate` **y** fondo ámbar opaco. `0` excepciones.
- **C15 · Cero datos inventados — y ahora es EJECUTABLE.** *(La versión anterior buscaba "%" y
  "direcciones" en el HTML: el entregable es HTML con CSS inline lleno de porcentajes y el flujo de
  pago dice "dirección" porque está en el código. Un criterio que nunca puede dar 0 se descarta
  entero, y con él se iba la única defensa contra el dato inventado.)* Se busca en el **texto
  visible** (`document.body.innerText`), **nunca en el CSS**, y tiene que dar **0 resultados**:
  `/\d{7,}/` (teléfonos), `/(calle|carrera|cra\.?|avenida|av\.|#\s?\d)/i` (nomenclatura), el nombre
  de cualquier ciudad, `/\b(años|familias|clientes|reseñ|testimonio|estrellas?)\b/i`, `★`,
  `/antes \$/`, `/descuento|dcto/i`, `"muslo apanado"`, `"filete de"`, `"papa horneada"`.
  **Ojo:** se busca `"muslo apanado"` y **no** `"muslo"`, porque *Presa de contramuslo* es un
  producto REAL del catálogo (`seed:11`) y contiene esa subcadena; el guardián existe para las 4
  fotos reservadas, no para reventar con un producto legítimo. **`%`:** el único permitido en texto
  visible es el título transcrito del cupón `VB-TANDA-05` (`promos.ts:121`), **exactamente 1
  aparición**. **"dirección":** aparece en el formulario de pago porque está en el código
  (`HojaCheckout.tsx:73, :95`) y no cuenta. Y **1 resultado** para la cinta "Carta y promos de
  EJEMPLO".
- **C16 · Vive quieto:** `document.getAnimations().length` puede ser **0** y las 5 pantallas se
  entienden, dan hambre y conservan el CTA en su sitio. **Esto no es una degradación: es el diseño.**
- **C17 · TRAZABILIDAD (el criterio positivo; C15 es una lista negra y una lista negra solo caza lo
  que ya se le ocurrió a alguien).** Se recorre **todo el texto visible de las 5 pantallas** y cada
  cadena se señala en **el apartado 1 de este prompt** (hecho con su `archivo:línea`, producto con
  su `seed:línea`, copy de promo con su `promos.ts:línea`) **o en el apartado 9** (ticket de hueco).
  **Lo que no se pueda señalar, se borra.** Se entrega **la lista de cadenas con su origen**, una
  por línea. Un nombre de producto, una descripción o un título de promo inventados pasan C15 sin
  despeinarse; por C17 no pasan.
- **C18 · La carta tampoco es una lista.** En el artboard de la pantalla 2: (a) en cada viewport de
  844 px, **la mancha clara más grande es comida o aceite** (foto, charco o plancha ámbar), nunca un
  bloque de texto; (b) **hay exactamente 2 bandejas a sangre** y cada una mide **≥ 340 px de ancho
  renderizado**; (c) **no hay 3 filas consecutivas con la misma silueta**; (d) **dentro de ninguna
  forma ámbar hay texto de categoría, inicial ni icono** — solo precio, nombre o foto.
- **C19 · La tanda que pasa (pantalla 1).** Se ven **al menos 3 productos distintos** y **al menos
  uno está cortado por un borde lateral**. Si solo hay una foto, el mecanismo de la ficha 01 volvió
  a no ejecutarse y la entrega repite el fallo del intento anterior.
- **C20 · Ningún fondo plano.** Muestreando la columna `x = 8` cada 200 px en la pantalla 2, la
  luminancia **varía ≥ 0,02 entre bandas consecutivas**. Y la pantalla 4 **tiene fondo escrito**: si
  su suelo es un plano liso sin la campana baja, el grano y la viñeta, está incumplida.

---

## 11. REFERENCIAS COMBINADAS (mecanismo, jamás contenido)

Biblioteca: `C:\Users\Kalel\ORION\prompts-landing\referencias\`. Se copia el **mecanismo**; nunca
la marca, los textos, las imágenes ni la paleta ajena. Las tres se usan **en su estado congelado**,
que es la lección que costó el rechazo anterior.

**Zona PORTADA — ficha 01 (carrusel de figuras, "TOONHUB").** Se toma: **los roles derivados de un
índice** y **el fondo que toma el color de la pieza activa**, pero blindados. Aquí el "fondo por
producto" no es una custom property que transiciona (eso no se ejecutó): es **la campana de la
freidora, pintada**, y el carrusel se entrega **cortado a media pasada**. **Su geometría está en el
apartado 4, banda `y 496–592`, y no en este apartado:** primera estampilla mordida por el borde
**IZQUIERDO** (`x = −34`), tercera cortada por el **DERECHO** (`x = 322`), 3 puntos de posición con
el **activo en el segundo lugar**, **sin flechas en el artboard**. *(Esto es exactamente lo que
falló la vez pasada: el mecanismo vivía en este apartado y en la fase de animación, el lienzo dibuja
lo que está en el apartado 4, y por eso no se ejecutó.)* *Por qué vende:* el pulgar entiende que hay más sin
que nadie se lo pida, y el antojo se decide antes de leer nada. **No se toma:** "TOONHUB", "3D
SHAPE", el testimonio, las figuras, sus pasteles `#F4845F/#6BBF7A/#E882B4/#6EB5FF` (el azul y el
rosa están prohibidos), **ni el texto fantasma al 10 %** (sobre fondo claro se murió; aquí la
palabra es crema maciza sobre penumbra).

**Zona CARTA / PROMO — ficha 02 (scroll cinematográfico por capas, "Mostar").** Se toman **dos
mecanismos**, no el rail de 3.700 px: (a) el patrón **"dato grande + una línea"** —se conserva
porque **no depende de gesto ni de tiempo**: se ve en una captura quieta, no porque estuviera
aprobado— aplicado a lo único que es verdad y vende: **"2 SEDES"** y **"$0"**, y **montado sobre la
chapa esmaltada** para que no se lea como el bloque plano del intento anterior;
y (b) las **capas contra-escaladas que componen una escena**, que aquí entregan **la promo ya
armada** sobre el charco: **máximo 3 capas y máximo 1 fotográfica**, porque de los 8 productos que
aparecen en las 4 promos **solo `acomp-papa-francesa` tiene foto en disco** (apartado 4, pantalla 2).
Las otras capas son **papel con la palabra escrita**. *Por qué vende:* convierte una promo
sin descuento —el descuento tachado está prohibido— en algo que **se VE**: cuánta comida es. **No se
toma:** Mostar, el azul `#79b7dd`, la fuente Ogg, el parallax de puntero ni el rail largo.

**Zona CIERRE — ficha 03 (spotlight que revela, "Lithos").** Se toma la **máscara radial suave** y
la idea de calentar la imagen, pero **el foco se entrega YA PUESTO** sobre la costra (58 % / 46 %),
con el macro al 55 % y a color pleno dentro y al 8 % fuera, **más el rastro del dedo dibujado** en
5 discos decrecientes. *Por qué vende:* el gesto de destapar es literalmente el gesto del antojo y
termina con el dedo a un centímetro del botón — pero **en la versión anterior este mecanismo no
existió**, porque solo vivía mientras el dedo se movía y el dueño revisa capturas. **No se toma:**
"Lithos", su copy, sus imágenes, la segunda imagen (no hay pares de fotos y no se inventan assets)
ni el `canvas.toDataURL()` por frame. El arrastre real baja al **ANEXO B**.

---

## 12. ADAPTACIÓN MÓVIL (390 px es el diseño)

| Mecanismo | A 390×844 |
|---|---|
| **Carrusel (01)** | El hover no existe. En reposo, y con las coordenadas del apartado 4 (`y 496–592`): fila cortada a media pasada, **primera pieza mordida por el borde IZQUIERDO, tercera cortada por el DERECHO**, punto activo en el **segundo** lugar, **sin flechas en el artboard**. Los controles reales van en el ANEXO B y **no se le piden al lienzo**; **la captura ya se lee como movimiento sin ellos**. |
| **Fondo por producto (01)** | Pintado, no transicionado: campana de la freidora en la portada, bombillo por estante en la carta, rescoldos en sedes. **El suelo cambia por sección** para que ninguna pantalla se repita. |
| **La palabra (01)** | `clamp(64px, 21vw, 96px)`, **una sola palabra** (`BROASTER`), cortada por el borde derecho a propósito, con `overflow-x: hidden` en el contenedor. **Nunca fantasma:** crema maciza con relieve. |
| **Capas / promo (02)** | El rail cinematográfico **no se usa**: la composición ocurre **dentro de la tarjeta de promo** (272 px de ancho, `Promos.tsx:98`) y se entrega **ya armada**, con las medidas del apartado 4. Máximo **3 capas y máximo 1 fotográfica** — solo `acomp-papa-francesa` tiene foto. |
| **Dato grande + línea (02)** | Dos bloques **apilados**, no en fila; cifra en Alfa Slab One 54 px sobre chapa esmaltada girada -6°, línea en 14 px `#c9a883`, mancha de aceite detrás en vez de tarjeta. |
| **Spotlight (03)** | **Ya colocado** sobre la costra, radio 150 px (no 260: en 390 px de ancho, 260 destapa todo) y con el rastro dibujado. El seguimiento del dedo es fase de código: va en el ANEXO B y **no se le pide al lienzo**. |
| **Blur** | Máximo **3 elementos** con blur por pantalla (humo, vapor). **`backdrop-filter` prohibido**, incluida la barra de chips. |
| **Toques** | CTA, `+`, cantidad, chips y flechas ≥ 44 px; nada interactivo por debajo de 40 px; 8 px de separación mínima. |
| **Alturas** | `100dvh` en la portada; hojas a `max-h: 88dvh` (`Hoja.tsx:63`); `env(safe-area-inset-*)` arriba y abajo. |
| **Peso** | 620 / 420 / 300 / 192 / 760 px en WebP, ≤ 110 / 55 / 45 / 28 / 120 KB. Solo la foto del héroe es `eager`. |
| **Escritorio** | La columna se queda en **480 px centrada sobre negro**; el fondo de la portada se extiende a los lados con la misma campana atenuada. **Jamás una barra lateral.** |

---

# ANEXO A — **ARMADURA CONTRA EL MEDIO** (léelo antes de dibujar nada)

Esto no es estilo: es la lista de fallos que ya ocurrieron una vez, en imperativo.

1. **NO ancles, adjuntes, generes ni "derives" ningún design system.** Ni "Modernist" ni ninguno de
   tu biblioteca. En la entrega anterior apareció un DS llamado *Modernist* —fondo `#f3f2f2`, radio
   0, Archivo, fotos en blanco y negro— y **su fondo claro se filtró a la portada y mató la
   dirección de arte**. Aquí **todos los tokens salen de este prompt**, apartado 5, con estos hex y
   no otros.
2. **NO normalices lo que no entiendas.** El riesgo real medido no es que copies un DS entero: es
   que **aproximes** lo raro a lo genérico —una estampilla troquelada a un rectángulo redondeado,
   una estampa de 12 puntas a un chip, una ranura grabada a una sombra suave—. Si una forma de este
   documento te resulta rara, **es a propósito**: dibújala como está escrita o pregunta, pero no la
   suavices.
3. **PROHIBIDO el fondo blanco, crema o claro a pantalla completa.** El crema `#f7ece1` es tinta y
   papel pequeño. **Ninguna superficie clara pasa del 18 % del área de una pantalla.** Si abres tu
   artboard y la portada es clara, **está mal y hay que rehacerla**.
4. **PROHIBIDO convertir las fotos a blanco y negro, desaturarlas, tramarlas o pasarles un filtro
   de grises.** El apanado dorado es el único activo de venta que hay.
5. **PROHIBIDO el radio 0 uniforme** y **prohibida la píldora**. Usa la escala de radios del
   apartado 5.
6. **PROHIBIDO Archivo e Inter.** Carga las familias del apartado 5 con su `<link>` y deja escrita
   su pila de respaldo. En la entrega anterior cargaste **una sola familia** y mandaste todo el
   cuerpo a `system-ui`: eso es la mitad del "genérico" que el dueño nombró.
7. **NO uses `mix-blend-mode` sin `isolation: isolate` y sin fondo ámbar opaco.** Y si no puedes
   ejecutar blend modes, **usa el respaldo escrito** (máscara radial a `mask-size: 132% 132%` +
   saturación) — no improvises un disco crema ni recortes la foto: el disco crema con la comida
   encogida es exactamente la pieza que ya se rechazó.
8. **NO dibujes lo que no está citado.** Sin ciudad, sin teléfono, sin horario, sin minutos, sin
   número de tanda, sin reseñas. Lo que falte es un **ticket de hueco numerado** (apartado 9).

### CHEQUEOS QUE TE HACES A TI MISMO ANTES DE ENTREGAR

Abre tu artboard, mira la captura y responde. **Si alguna respuesta es "no", vuelve atrás.**

1. ¿El fondo de la portada es **oscuro**? Si es claro o crema, está mal.
2. ¿La **mancha clara más GRANDE** de la portada es **comida o aceite**? Si la masa clara dominante
   es el botón o una palabra, está mal. *(Se mide por área, no por píxel: bajo `multiply` la costra
   nunca puede ser más brillante que una etiqueta blanca, y pedirlo sería pedir un imposible.)*
3. ¿La foto del héroe **se sale del encuadre** y se le ven los grumos del apanado? Si el producto
   está entero, centrado y con aire alrededor, es un catálogo: está mal.
4. ¿Hay **algún gris neutro** en pantalla? Si un fondo o un borde se lee gris, está mal.
5. ¿Está **cada píxel de producto dentro de la forma ámbar** (o fuera del encuadre), con el margen
   del **9 % del lado menor**? Si hay una mancha negra donde debería haber costra, el `multiply` se
   escapó: está mal.
5-bis. ¿**El troquel y el radio muerden solo ámbar, nunca costra?** Acércate a una estampilla de la
   carta al 400 %: si un diente del troquelado o la esquina redondeada se comen un trozo de pollo
   —mordida negra, o peor, el blanco del PNG asomando—, la forma es demasiado pequeña. **Se agranda
   la forma; no se encoge el producto.**
6. ¿Cargaste **las tres familias** y se ven distintas entre sí? Si el cuerpo se ve `system-ui`,
   está mal.
7. ¿Hay **un sello EJEMPLO por cada precio visible de las 5 pantallas** (carta, hoja de producto,
   carrito, comanda y confirmación — no solo la carta) y **al menos 9 tickets de hueco numerados**?
   Si no, la página miente.
7-bis. ¿Puedes **señalar el origen de cada cadena de texto** en el apartado 1 o en el apartado 9
   (C17)? Un nombre de producto, una descripción o un título de promo que no puedas señalar **está
   inventado**, aunque suene bien. Bórralo.
8. ¿Hay **una sola masa roja** y **un solo naranja saturado** en el viewport? Si hay dos, ninguno
   manda.
9. Tapa todos los textos de la portada con la mano. ¿**Todavía da hambre**? Si se ve elegante pero
   fría, está mal: el encargo dice *divertido, llamativo, que dé gusto verlo*.
10. Congela la página (`document.getAnimations()` = 0). ¿**Sigue pareciendo que algo acaba de
    pasar**? Si se ve quieta, no cumpliste el apartado 6.

---

# ANEXO B — **COREOGRAFÍA PARA LA FASE DE CÓDIGO** (no es para ti, lienzo)

Esto **no se le pide al artboard**: se le pide al programador que después porte la maqueta a
`villa-app` (Next 16 + React 19 + Tailwind 4, sin librerías). Cada pieza de aquí ya tiene su
**estado congelado** dibujado en el apartado 4, así que la animación **suma, nunca sostiene**.

| # | Elemento | Disparador | Qué hace | ms / curva | Estado congelado que ya existe |
|---|---|---|---|---|---|
| **B1** | Estampillas del carrusel de portada | swipe (umbral 40 px, `touch-action: pan-y`), flecha o tap lateral | rotan roles: `transform`, `opacity` | **650 · `cubic-bezier(.4,0,.2,1)`** con lock `isAnimating` | la banda `y 496–592` del apartado 4: 3 estampillas **a media pasada**, la primera mordida por el borde izquierdo y la tercera por el derecho, con sus 3 puntos de posición |
| **B2** | Campana de la freidora | el mismo | el tono del fondo se calienta o se enfría con el producto activo, vía `@property --brasa { syntax:'<color>'; inherits:true }` | 650 · misma curva | la campana **pintada** en el tono del producto activo |
| **B3** | `¡CRUJE!` | entrada del héroe | micro-tembleque de 2 px con `steps(2)` | 140 · `steps(2)` | la palabra ya cruzada sobre la costra, girada -7° |
| **B4** | Nombre + precio | fin de B1 | fade + subida de 8 px | 260 `ease-out`, retraso 120 | la estampa del precio ya invadiendo la foto |
| **B5** | Migas y gotas | entrada del héroe | recorren su arco y caen | 520 · `cubic-bezier(.2,.9,.3,1)`, escalonado 40 ms | las 14 migas **con estela**, dibujadas a mitad de trayectoria |
| **B6** | Promo que se arma | tap en la tarjeta de promo | las piezas entran desde los bordes y se acomodan sobre el charco; el botón pasa a "va en tu pedido" | 420 · `cubic-bezier(.2,.9,.3,1)`, escalonado 70 ms | la promo entregada **ya armada** |
| **B7** | Foco del cierre | arrastre del dedo sobre la franja del aceite | la máscara radial de 150 px sigue al dedo con suavizado 0,18; si no hay toque en 3 s, **orbita sola** en 6 s | sin transición (sigue al dedo) | el foco **ya puesto** al 58 % / 46 % + el rastro dibujado |
| **B8** | Producto → barra del carrito | tap en `+` | la estampilla se encoge a 0,28 y viaja a la ficha del carrito, que late | 380 · `cubic-bezier(.2,.9,.3,1)` + `latir .4s` (`globals.css:83-86`) | la ficha del carrito con su número y su sombra dura |
| **B9** | Hojas (sedes / carrito / pago) | tap | suben desde abajo | `subir .28s` (`globals.css:73-76`) — **ya existe, no lo toques** | la hoja dibujada arriba con su agarradera |
| **B10** | Barra de brasa de la confirmación | llega dato del polling | la punta avanza al siguiente estado con `revelar .3s` (`globals.css:88-91`) y el halo respira 4 s | 300 · `ease-out` | la barra a media carga con la punta al rojo blanco |
| **B11** | Todo lo tocable | `:active` | `scale(.97)` | 120 ms (`.presionable`, `globals.css:176-179`) | — |

**Presupuesto de la fase de código:** máximo **8 elementos animando a la vez**; `will-change` solo
en las estampillas del carrusel y **solo mientras dura B1**; se anima **únicamente** `transform`,
`opacity`, `filter` (blur ≤ 4 px) y `--brasa`. **Prohibido animar** `width`, `height`, `top`,
`left`, `margin`, `box-shadow` y `backdrop-filter`. Con `prefers-reduced-motion: reduce` **todo se
apaga y la página queda exactamente como el artboard**: ése fue el diseño desde el principio.

---

**Entregable final:** los artboards de las **5 pantallas a 390×844** (la 1 exacta), las capturas de
cada una por Edge/CDP, la lista de assets exportados con su peso real, y **una línea por cada hueco
H-1 … H-12** que hayas tenido que rodear. Si algo no lo puedes citar, no lo dibujes: pregúntalo.
