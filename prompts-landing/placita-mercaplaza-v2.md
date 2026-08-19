═══════════════════════════════════════════════════════════════════════════
PROMPT v2 — LA PORTADA DE "MERCAPLAZA NARIÑENSE FAMILIAR" TIENE QUE VENDER
Encargo textual del dueño (2026-08-19): "un prompt para un diseño de landing
con animaciones, mejores colores, más llamativa".
Repo AUTORITATIVO: C:\Users\Kalel\placita   ·   Ruta pública: /catalogo
Reemplaza a: ORION/prompts-landing/placita-mercaplaza.md (v1, 2026-08-16)
═══════════════════════════════════════════════════════════════════════════

CÓMO USAR ESTE PROMPT
v1 investigó bien el negocio y acertó en el registro, pero el dueño volvió a
pedir lo mismo que pidió el 2026-08-05: MÁS. La razón es que v1 decía "que tenga
movimiento" y "usa la paleta que ya está" — encargos que cada quien interpreta a
su manera y que en la práctica dejaron la página igual. Este v2 no opina: trae el
inventario cerrado de animaciones, la tabla de color con contraste MEDIDO y las
medidas del pliegue tomadas hoy sobre el build real. Lo numerado no se negocia;
lo que falta es HUECO del dueño (§9).

ANTES DE ESCRIBIR UNA LÍNEA
No partes de cero y está PROHIBIDO partir de cero. La portada existe, funciona y
está conectada: app/catalogo/page.tsx (52 líneas) + components/landing/ (16
archivos) + dos secciones de app/globals.css. Un HTML suelto o un rediseño en
otra ruta pierde el flujo vivo (el celular arma el carrito → POST /api/pedidos →
la caja lo recibe → el celular pregunta el estado) y eso es entregar nada. Se
mejora archivo por archivo.

Archivos vivos, verificados hoy en el repo (todos existen):
  app/catalogo/page.tsx
  components/landing/: hero.tsx · frescura.tsx · catalogo.tsx ·
    tarjeta-producto.tsx · tienda.tsx · pulpas.tsx · pie.tsx · fruta-del-dia.tsx ·
    seguimiento.tsx · barra-pedido.tsx · revisar.tsx · ilustracion.tsx ·
    enlace-ancla.tsx  + los datos: catalogo-datos.ts · tienda-datos.ts · tienda-api.ts
  app/globals.css → sección "Landing" (líneas 246-452) y sección "Tienda"
    (líneas 1291-1614). Esas dos son de esta portada. Las otras tres secciones del
    archivo (interior 3-243, Hub 454-712, plano real 713-1290) NO se tocan.

Lección pagada que manda sobre este trabajo (POL-001, ORION/memory/landings):
el 2026-08-05 el dueño rechazó una versión anterior de ESTA portada — "la landing
que haces es una basura... muy minimalista... quiero que esta landing sea más
interactiva, más llamativa, es para vender frutas". El minimalismo del manifiesto
"El estudio del ingeniero moderno" es para el INTERIOR de la app, donde el cajero
trabaja seis horas. La portada tiene un solo trabajo: dar antojo y recibir el
pedido. Esa decisión ya está escrita en el propio código (globals.css:246-259):
respétala y llévala más lejos.

───────────────────────────────────────────────────────────────────────────
0. MEDICIÓN DE TERRENO — el estado de hoy, medido, no opinado
───────────────────────────────────────────────────────────────────────────
Tomado el 2026-08-19 sobre el build de producción del repo real (next start),
con Edge headless y viewport REAL de 390×844 por CDP (la receta y su trampa
están en §10). Estos son los números que hay que mover:

  · Documento completo: 3.616 px de alto a 390 px de ancho.
  · Héroe:     y 0     → 963    (963 px: el héroe NO cabe en una pantalla)
  · Frescura:  y 963   → 1.450  (487 px)
  · Mostrador: y 1.450 → 2.286  (#catalogo empieza a 1,7 pantallas)
  · Pulpas:    y 2.286 → 3.070
  · Pie:       y 3.070 → 3.616
  · PRIMERA TARJETA DE PRODUCTO: y = 1.994. El cliente hace 2,4 pantallas de
    scroll antes de ver la primera fruta que puede pedir. Tarjeta: 165×228 px.
  · Ficha "Fruta del día": empieza en y=606 y mide 265 px → termina en 871 y
    queda CORTADA por el pliegue (844).
  · Lo que hay en el pliegue: 2 renglones de titular, 5 renglones de párrafo
    gris, 1 botón, 3 renglones de promesas en versalitas y media ficha de fruta.
    La fruta más grande visible mide 104 px de lado.
  · Titular: 38,4 px con peso 300 (font-light). Es lo más delgado que se puede
    poner en una pantalla que se mira al sol.
  · Elementos animados a la vez (con movimiento permitido): 14 — 5× `asomar`,
    7× `flotar`, 1× `cambio-fruta`, 1× `correr` — y 7 elementos con
    `will-change: transform` permanente (globals.css:311).

Diagnóstico en una línea: la portada de un puesto de frutas dedica su primera
pantalla a párrafos y su primera fruta pedible aparece en la tercera. Eso es lo
que hay que invertir.

───────────────────────────────────────────────────────────────────────────
1. EL NEGOCIO (cada dato con su origen; nada de esto es adorno)
───────────────────────────────────────────────────────────────────────────
· Marca REAL, no placeholder: "Mercaplaza Nariñense Familiar", sembrada como la
  empresa de producción en supabase/bootstrap.sql:30-33 y usada como título del
  sitio en app/layout.tsx:27 y app/catalogo/page.tsx:35.
  En pantalla convive con "La Placita" (hero.tsx:49, pie.tsx:32,67): son dos
  marcas frente al mismo cliente → HUECO 6.
· Qué vende: 39 productos dictados por el dueño, en su orden, en 6 canastas —
  Frutas, Verduras, Tubérculos y plátanos, Granos, Pulpas, Y más
  (catalogo-datos.ts:78-85 las canastas; :88-401 los 39 productos; conteo
  verificado hoy: 39).
· Cómo se vende: se pesa al gramo con báscula real y el precio final lo pone la
  pesa en la caja; el total que muestra la portada es SIEMPRE "estimado"
  (revisar.tsx:173-179).
· El trato completo, tal como ya está escrito: "usted pasa, lo recoge y lo paga
  en la caja" (hero.tsx:76-79, catalogo.tsx:99-101). NO hay domicilio, NO hay
  pago en línea, NO hay pasarela.
· Surtido nuevo martes y viernes (catalogo-datos.ts:426, días 2 y 5; el texto
  vivo se calcula en frescura.tsx:25-51).
· Pulpas: la misma fruta del mostrador, despulpada y congelada (pulpas.tsx:47-61).
· Flujo vivo que NO se puede romper: carrito en el celular → POST /api/pedidos →
  la caja lo recibe → el celular pregunta el estado cada 15 s y solo con la
  pestaña a la vista (tienda.tsx:58 `CADA_MS`, :141-154, :165-186). DEC-012:
  /catalogo + GET /api/catalogo + POST /api/pedidos pasan por proxy.ts con
  deny-by-default.
· Precios: NUNCA se inventa un número. Sin catálogo publicado `precioCop = null`
  y la tarjeta dice literalmente "Precio en tienda" (tienda-datos.ts:123-133
  arma la vitrina de respaldo con precioCop null; tarjeta-producto.tsx:49-53
  escribe el letrero). Está en el código: no lo rompas.
· Dónde opera: NO SE SABE. Dirección y teléfono del local son `null` y están
  marcados como PLACEHOLDER en supabase/bootstrap.sql:47-56; lo único parecido a
  una dirección es un ejemplo COMENTADO ("Calle 00 #00-00, Pasto", :181).
  "Nariñense" es marca, no ubicación verificada. → HUECOS 1, 2, 4.
· Estado del backend HOY (verificado en vivo el 2026-08-19 contra la Supabase de
  la máquina del dueño): el mostrador SÍ está publicado, pero con UN solo
  producto —"Mango Tommy, $5.200 el kilo"— y marcado agotado ("HOY NO HAY"). El
  camino de compra funciona de punta a punta; la vitrina está casi vacía. Ese es
  un problema del dueño, no de diseño → HUECO 9.

───────────────────────────────────────────────────────────────────────────
2. QUIÉN MIRA Y QUÉ DEBE HACER
───────────────────────────────────────────────────────────────────────────
Quien mira: un vecino con Android de gama media, datos limitados, de pie, con una
mano, muchas veces con sol en la pantalla, que llegó por un enlace pegado en un
chat de WhatsApp. 390 px primero; el escritorio es el caso secundario y se
resuelve solo si el celular quedó bien.

Qué debe SENTIR, en este orden:
  1) ANTOJO en dos segundos — "esa papaya está buena". La fruta manda: grande,
     en color y ARRIBA.
  2) FRESCURA COMPROBABLE — "llegó ayer", dicho con el calendario en la mano
     (frescura.tsx:99-108 ya lo calcula bien; hoy vive debajo del pliegue).
  3) CONFIANZA EN EL PESO — "se pesa al gramo delante suyo, sin ahí le dejo"
     (hero.tsx:76-79, frescura.tsx:113-119). Es el diferencial contra el que le
     echa el ojo al kilo.

UNA SOLA ACCIÓN PRINCIPAL: ARMAR EL PEDIDO Y ENVIARLO.
"Entrar al sistema" es para quien atiende: se queda como línea al margen
(hero.tsx:89-93 con `.enlace-discreto`, globals.css:1596-1604) y ya desaparece
solo en modo vitrina. En la captura de hoy ese enlace queda al lado del botón
negro y compite más de lo que debería: en v2 pierde peso o se va al pie. Dos CTAs
compitiendo = ninguno.

───────────────────────────────────────────────────────────────────────────
3. EVIDENCIA REAL — lo ÚNICO que se puede probar hoy
───────────────────────────────────────────────────────────────────────────
Se puede afirmar, con respaldo:
  · "39 productos, los que el dueño canta en su puesto" — catalogo-datos.ts:88-401.
  · "Surtido nuevo martes y viernes" + la cuenta viva de días —
    catalogo-datos.ts:426 y frescura.tsx:25-51, 99-108.
  · "Pesado al gramo" — el dominio trabaja en gramos enteros y el escalón de
    pedido es de 500 g (tienda-datos.ts:146 `PASO_GRAMOS = 500`, :169-171).
  · "Se paga en la caja, cuando recoge" — revisar.tsx:173-179.
  · "El pedido le da un número y usted lo sigue" — seguimiento.tsx:98-114, con
    tres escalones Nuevo → Preparando → Listo.
  · 20 siluetas SVG dibujadas a mano, una por producto (ilustracion.tsx:429-443,
    viewBox 64×64, `tam` libre). Son VECTOR: agrandar una fruta a 3× cuesta
    0 KB de descarga. Es el activo visual del negocio y ninguna competencia
    local lo tiene.

NO EXISTE, y por lo tanto NO SE ESCRIBE: años de experiencia, número de clientes
o familias, kilos vendidos, testimonios, reseñas, estrellas, premios, "los
mejores de", "más de X pedidos". Cero coincidencias en el repo. Si el dueño los
quiere, los dicta él (§9).

───────────────────────────────────────────────────────────────────────────
4. ESTRUCTURA SECCIÓN POR SECCIÓN — y el eje IMPACTO ("más llamativa")
───────────────────────────────────────────────────────────────────────────
El orden actual (app/catalogo/page.tsx:44-51: Hero → Frescura → Tienda → Pulpas
→ Pie) ya es el orden de una venta y se conserva, con UNA sección nueva
intercalada. Lo que cambia es cuánto vende cada una y a qué altura aparece.

METAS DE IMPACTO — verificables con la medición de §0, todas a 390×844:
  M1. La fruta más grande del pliegue pasa de 104 px a ≥ 170 px de lado.
  M2. La ficha "Fruta del día" cabe ENTERA arriba del pliegue (borde inferior
      ≤ 820 px). Hoy termina en 871.
  M3. El párrafo del héroe baja de 5 renglones a ≤ 2 renglones a 390 px
      (≈ 95 caracteres). Lo que sobra se dice en la sección que corresponde.
  M4. La línea viva de frescura ("Fresco desde el martes · ayer") entra en el
      pliegue. Hoy está a y≈1.100.
  M5. La PRIMERA tarjeta de producto pedible pasa de y=1.994 a y ≤ 1.250 —
      menos de dos pantallas. Se logra con la sección nueva B.
  M6. El héroe completo baja de 963 px a ≤ 900 px de alto.
  M7. En la captura del pliegue se ven, sí o sí: nombre del negocio, titular,
      CTA principal, la línea viva de frescura y al menos DOS frutas dibujadas
      a ≥ 120 px.

A) HÉROE — components/landing/hero.tsx
   Hoy: rótulo (:49), titular con subrayado naranja dibujado a mano (:51-73),
   párrafo de 5 renglones (:75-79), CTA (:82-84), enlace del sistema (:89-93),
   tres promesas (:96-108), seis frutas en órbita de 40-64 px (:28-35) y la ficha
   "Fruta del día" que rota sola cada 3,4 s (fruta-del-dia.tsx:19).
   PROPÓSITO DE VENTA: antojo en dos segundos y una sola puerta al mostrador.
   EXIGENCIAS:
   a1. INVERTIR EL PESO. El bloque de fruta (ficha + órbita) sube y el texto se
       comprime: titular, una línea de frescura viva, CTA. El párrafo largo
       (:76-79) se recorta a dos renglones — su contenido ya está repetido casi
       palabra por palabra en catalogo.tsx:99-101, así que no se pierde nada.
   a2. LA LÍNEA VIVA DE FRESCURA SUBE AL HÉROE. El argumento más fuerte de una
       placita no puede estar en la segunda pantalla. Reutiliza EXACTAMENTE el
       mismo cálculo, no lo dupliques: sácalo de frescura.tsx:25-51 a
       lib/dominio/frescura.ts con sus pruebas (hoy es martes / miércoles /
       domingo / lunes) — `npm test` solo corre lib/**/*.test.ts
       (package.json:15), o sea que hoy el argumento comercial central del
       negocio no tiene ni una prueba. Mantén el patrón de calcular DESPUÉS de
       montar y el texto fijo mientras tanto: la razón está escrita en
       frescura.tsx:11-14 (hidratación) y es correcta.
   a3. LA FRUTA DEL DÍA DEBE VENDER, NO SOLO GIRAR. Hoy es decorativa: 56 líneas
       sin un solo handler (fruta-del-dia.tsx completo). Tocarla lleva al
       mostrador con esa fruta ya buscada/filtrada — el buscador y los chips ya
       existen (catalogo.tsx:50-84, :128-154), así que es izar estado, no
       inventar mecanismo. Un toque de antojo que aterriza en el producto es
       interacción que vende; una ficha que gira sola y no hace nada es adorno.
   a4. Las seis frutas en órbita (hero.tsx:28-35) se quedan —son el toldo del
       puesto— pero crecen y dejan de recortarse contra el borde: hoy el banano
       de la derecha sale medio cortado a 390 px. Si las haces tocables, llevan
       al mismo sitio que a3.
   a5. El titular sube de peso en celular: 38,4 px con peso 300 se lava al sol.
       Nunito es variable 200-1000 (app/layout.tsx:20-24): usa peso 500-600 hasta
       640 px de ancho y deja el peso ligero para escritorio. El subrayado
       naranja dibujado a mano (:56-71) se queda — es el trazo de marcador del
       cartel del puesto — pero pasa al tono pleno de §5.

B) NUEVA SECCIÓN — "HOY EN EL MOSTRADOR" (tira de 6 productos, entre Héroe y
   Frescura)
   POR QUÉ EXISTE: es la única forma honesta de cumplir M5. Hoy hay que bajar
   2,4 pantallas para ver algo que se pueda pedir.
   QUÉ MUESTRA: seis productos REALES tomados del mismo estado que ya carga
   `Tienda` (tienda.tsx:141-154, GET /api/catalogo). Sin catálogo publicado,
   toma los seis de `DESTACADOS` (catalogo-datos.ts:414-423: papaya, lulo,
   aguacate hass, mango, tomate, maracuyá) y cada tarjeta dice "Precio en tienda"
   igual que hoy (tarjeta-producto.tsx:49-53).
   CÓMO: fila con scroll horizontal (`overflow-x: auto` + scroll-snap), tarjetas
   de 150-170 px, la MISMA `TarjetaProducto` o una variante compacta que comparta
   el componente — no un segundo diseño de tarjeta.
   NO INVENTA DATOS: si un producto no está en la vitrina publicada, no aparece.
   NO ES UN CARRUSEL AUTOMÁTICO (prohibido en §8): lo mueve el dedo.
   PROHIBIDO crear un endpoint nuevo para esto: nacería muerto en modo vitrina
   (§7). Se alimenta del estado que ya está en `Tienda`.

C) FRESCURA — components/landing/frescura.tsx
   Hoy: franja `--tierra` con tres columnas (surtido / en el mostrador / la pesa)
   y el "Pregón", una marquesina que canta los 39 nombres en bucle y se pausa al
   pasar el mouse (:55-73, globals.css:317-319).
   PROPÓSITO: convertir "fresco" (adjetivo vacío) en un hecho con fecha.
   EXIGENCIAS:
   c1. La franja pierde la línea viva (se fue al héroe, a2) y gana lo que hoy no
       tiene: UNA sola cifra grande. "Dos viajes a la galería por semana" es un
       hecho, dicho con número.
   c2. EL PREGÓN DEBE CANTAR LO DE HOY. Hoy canta los 39 fijos (frescura.tsx:56).
       Con catálogo publicado, que cante lo que HAY (sin agotados) desde los
       datos que ya llegan de /api/catalogo. Sin catálogo, se queda como está.
   c3. En celular no hay hover: la pausa al pasar el mouse (globals.css:319) no
       es interacción para este cliente. Ver §6-N9 para lo que la reemplaza.
   c4. La franja es la ÚNICA superficie oscura de la portada y ahí el contraste
       está bien: blanco al 55-60 % sobre `--tierra` da 5,5-6,3:1 (medido). No
       la aclares "para que combine": es la sombra bajo el toldo y funciona.

D) MOSTRADOR — catalogo.tsx + tarjeta-producto.tsx + tienda.tsx + barra-pedido.tsx
   + revisar.tsx + seguimiento.tsx. Es la sección protagonista y la única con
   estado.
   PROPÓSITO: que escoger se sienta como señalar en el puesto, y que el pedido
   salga.
   EXIGENCIAS:
   d1. LA CABECERA SE COME UNA PANTALLA. Entre el título de la sección
       (catalogo.tsx:94-101), el buscador (:107-126), los chips (:128-154) y el
       contador (:156-160) pasan 544 px antes de la primera tarjeta (medido:
       sección en 1.450, primera tarjeta en 1.994). Recorta el párrafo :98-101
       (repite el del héroe) y sube las tarjetas.
   d2. BUSCADOR Y CHIPS PEGAJOSOS EN CELULAR. Hoy se van con el scroll y con 39
       productos en 2 columnas el cliente queda a ciegas a media lista. Fila de
       canastas `position: sticky` al llegar a la sección, sin chocar con el
       muelle de abajo (globals.css:1433-1443, z-index 30: los chips van por
       debajo de ese z-index).
   d3. FEEDBACK TÁCTIL EN LA TARJETA. Casi todo el encanto actual es `:hover`
       (globals.css:342-359: la tarjeta sube, la fruta crece, la hoja se
       inclina) y en un celular eso NO OCURRE NUNCA. El equivalente al toque está
       especificado en §6-N4/N5.
   d4. EL ESTADO "EN EL CARRITO" ES INVISIBLE AL SOL. Hoy es un tinte de 9 % del
       color de la fruta sobre `--card` (globals.css:1337-1341): contraste 1,10:1
       contra el fondo de la tarjeta — medido. Ni al sol ni a la sombra eso se
       ve. Solución en §5-C4: franja sólida arriba + insignia rellena + borde a
       color pleno. El tinte NUNCA puede ser la única señal.
   d5. BUG DE PLURAL, visible en la captura de hoy: "1 PRODUCTOS EN EL
       MOSTRADOR" (catalogo.tsx:156-160 concatena `productos` sin singular).
       Arréglalo: con 1, "1 producto".
   d6. NO TOQUES tres reglas del contrato: el total siempre se llama ESTIMADO
       (revisar.tsx:173-179), la cantidad viaja como TEXTO ("1,5 kg",
       tienda-datos.ts:265-296) y la validación de nombre/teléfono repite palabra
       por palabra la del servidor (tienda-datos.ts:300-312: teléfono de 7 a 10
       dígitos).

E) PULPAS — components/landing/pulpas.tsx
   Se autodenomina "Producto estrella" (:43) y en sus 67 líneas NO tiene ni un
   enlace ni un botón: es un afiche sin puerta.
   EXIGENCIA: un CTA que lleve al mostrador con la canasta "Pulpas" ya
   seleccionada (la canasta existe, catalogo-datos.ts:83; el chip la filtra,
   catalogo.tsx:138-153). Sin prometer sabores fijos: cambian con el surtido, y
   así está dicho en :53-55.

F) PIE — components/landing/pie.tsx
   PROBLEMA GRAVE Y CONFESADO EN EL CÓDIGO — pie.tsx:8-14: "TODO(dueño):
   confirmar el horario real... Estos son los de una plaza de barrio típica y
   están puestos para que la portada no salga coja — no son un dato verificado".
   Un negocio real está publicando horas de atención inventadas.
   EXIGENCIA: BÓRRALO (pie.tsx:11-14 y su bloque :40-50). Mientras el dueño no
   entregue el horario real (HUECO 3), el pie no muestra horas. Un pie sin
   horario es incómodo; un horario falso hace que alguien llegue a las 6:30 p. m.
   a un puesto cerrado y no vuelva. Deja el anclaje preparado para recibir
   dirección, horario y teléfono cuando lleguen. Ninguno de los tres se rellena
   "provisional".

G) NUEVO — LA TARJETA DEL ENLACE COMPARTIDO
   Verificado hoy: no existe carpeta public/, ni icon, ni opengraph-image, ni
   favicon, ni manifest. Este sitio se comparte por WhatsApp —así compra esta
   gente— y hoy el enlace viaja como texto pelado.
   EXIGENCIA: imagen de compartir generada EN CÓDIGO con las mismas siluetas SVG
   y la paleta de §5 (nada de fotos), más un ícono de sitio.
   TRAMPA VERIFICADA: en modo vitrina la ruta pública de un `opengraph-image.tsx`
   no lleva extensión y `esAssetPublico()` la bloquea con 404
   (lib/servidor/modo-vitrina.ts:101-109: solo pasa lo que tiene punto en el
   último tramo). O la agregas a `permitidoEnVitrina` CON su prueba en
   lib/servidor/modo-vitrina.test.ts, o usas un archivo estático con extensión.
   Verifícalo corriendo, no de memoria.

───────────────────────────────────────────────────────────────────────────
5. REGISTRO VISUAL Y PALETA — eje COLOR ("mejores colores")
───────────────────────────────────────────────────────────────────────────
Registro: VENTA, no manifiesto. Quien mira es un cliente en el andén, no un
cajero en su turno. El interior de la app (/ventas, /inventario, /dashboard,
/principal) NO se toca y sigue en registro de calma.

REGLA QUE SE MANTIENE (globals.css:252-255): EL COLOR SIGNIFICA. Cada acento ES
el color real de una fruta del mostrador, plantado por React en la variable
`--fruta` (catalogo-datos.ts:445-447). Ningún color de marca inventado. Lo que
cambia en v2 no es la regla: es la SATURACIÓN y el CONTRASTE.

A. AUDITORÍA DE LO QUE HAY (contraste calculado sobre --bg #f8f6f2; umbral WCAG
   AA para texto normal = 4,5:1; para superficie/borde = 3:1)

   token (globals.css)          hex       vs --bg   veredicto
   --verde-aguacate  :262      #4f6d38     5,44     OK como texto
   --verde-hoja      :263      #5f8a3a     3,75     FALLA como texto
   --naranja-papaya  :264      #d9722e     3,04     FALLA — y es el color estrella
   --rojo-tomate     :265      #c8402f     4,60     OK, al filo
   --amarillo-banano :266      #dda52c     2,05     FALLA de lejos
   --morado-cebolla  :267      #8b4a72     5,86     OK
   --crema-honda     :268      #f1ece1     1,09     es fondo, correcto
   --tierra          :269      #2e261c    12,99     franja oscura, correcto
   canasta frutas     (catalogo-datos.ts:79)  #d9722e  3,04  FALLA
   canasta verduras   :80                     #5f8a3a  3,75  FALLA
   canasta tubérculos :81                     #a8763f  3,65  FALLA
   canasta granos     :82                     #6f7f39  4,08  FALLA
   canasta pulpas     :83                     #b8443f  4,94  OK
   canasta "y más"    :84                     #5d8a6a  3,66  FALLA

   Dónde duele, con archivo y línea:
   · catalogo.tsx:186-189 pinta el título de cada canasta CON ese acento, a
     1,15 rem y peso ligero. Cinco de seis canastas quedan por debajo de 4,5:1.
     Al sol, "Frutas" en #d9722e sobre crema es un renglón que se borra.
   · globals.css:402-406: el chip encendido usa el acento como FONDO y --bg
     como texto → mismos números invertidos: el chip "Frutas" da 3,04:1.
   · globals.css:1337-1341: la tarjeta ya pedida se tiñe al 9 % → 1,10:1 contra
     el fondo de la tarjeta. Es el estado más importante de la portada y es
     invisible (medido, ver §4-d4).
   · globals.css:342-347 (hover al 5 % → 1,05:1) sencillamente no se ve, ni con
     mouse.
   · app/layout.tsx:33 `themeColor: "#171717"`: en Android la barra del navegador
     queda casi negra encima de una portada de frutas. Es el marco de todo lo
     que se ve y es del interior de la app, no de la portada.
   Lo que SÍ está bien y no se toca: la franja `--tierra` (blanco 55-60 % da
   5,5-6,3:1) y el botón de enviar en `--verde-aguacate` (globals.css:1549-1555).

B. RESTRICCIÓN DURA ANTES DE TOCAR UN HEX (verificada hoy, y es la razón por la
   que esto no se resuelve "subiéndole saturación a los tokens"):
   los tokens de fruta de globals.css:261-270 los USA TAMBIÉN el interior de la
   app — components/hub/zonas.ts:205,260,296,306,346 y
   app/(app)/pulpas/page.tsx:61-65. Y las paletas por producto de
   catalogo-datos.ts las importan app/(app)/principal/page.tsx:45-46 y
   components/hub/frutas.tsx:20-21.
   → NO se cambian los valores de `:root` de globals.css:261-270.
   → NO se tocan las paletas de catalogo-datos.ts (son el color con que se dibuja
     la fruta, y se dibujan también adentro).
   → SÍ se agregan tokens NUEVOS con alcance de portada. Las clases `.chip`,
     `.tarjeta-fruta`, `.toldo`, `.franja`, `.marquesina`, `.flota` sí son
     exclusivas de la landing (verificado: solo aparecen en components/landing/*),
     así que ahí se puede trabajar libre.

C. PALETA v2 — dos rampas por fruta, con contraste medido
   El problema de fondo: un color lo bastante encendido para dar apetito NUNCA va
   a servir como texto sobre crema. Por eso cada fruta tiene DOS valores y una
   regla de uso; así se sube la saturación sin perder legibilidad.

   Se agregan en la sección Landing de app/globals.css, con alcance `.portada`
   (pon `className="portada"` en el `<main>` de app/catalogo/page.tsx:44 — así
   ningún token nuevo se filtra al interior):

     .portada {
       /* PLENO = relleno (chips encendidos, placas, franjas, insignias) */
       --papaya-pleno:    #e8761f;   /* texto encima: --ink   6,33:1 */
       --tomate-pleno:    #cf3521;   /* texto encima: crema   4,65:1 */
       --banano-pleno:    #f0b429;   /* texto encima: --ink  10,13:1 */
       --hoja-pleno:      #66a12b;   /* texto encima: --ink   6,02:1 */
       --aguacate-pleno:  #4f7a2e;   /* texto encima: crema   4,68:1 */
       --cebolla-pleno:   #9b3d78;   /* texto encima: crema   5,84:1 */
       --tuberculo-pleno: #c08a3e;   /* texto encima: --ink   6,25:1 */
       --granos-pleno:    #7d9130;   /* texto encima: --ink   5,36:1 */
       --pulpa-pleno:     #c53a34;   /* texto encima: crema   4,83:1 */
       --otros-pleno:     #4f9670;   /* texto encima: --ink   5,33:1 */
       /* TINTA = texto y bordes finos sobre crema (--bg #f8f6f2) */
       --papaya-tinta:    #a24d09;   /* 5,40:1 */
       --tomate-tinta:    #a32516;   /* 6,87:1 */
       --banano-tinta:    #8a5a00;   /* 5,49:1 */
       --hoja-tinta:      #41651c;   /* 6,27:1 */
       --aguacate-tinta:  #38561f;   /* 7,72:1 */
       --cebolla-tinta:   #6e2a55;   /* 9,15:1 */
       --tuberculo-tinta: #7d5320;   /* 6,22:1 */
       --granos-tinta:    #525f1f;   /* 6,45:1 */
       --pulpa-tinta:     #8f2723;   /* 7,84:1 */
       --otros-tinta:     #2f6349;   /* 6,48:1 */
     }

   Todos los números de arriba están calculados, no estimados; se vuelven a
   comprobar en §10-C.

   REGLA DE USO, sin excepciones:
   C1. Texto de color sobre crema → SIEMPRE la tinta. Cambia catalogo.tsx:186-189
       para que el título de canasta use la tinta de su canasta.
   C2. Relleno (chip encendido, placa, insignia, franja) → SIEMPRE el pleno, y el
       color de texto encima es el que dice la tabla (--ink o crema #f8f6f2), no
       "el que quede bonito". Cambia globals.css:402-406 para que el chip
       encendido lleve su pleno y su texto correspondiente.
   C3. El BORDE de la tarjeta pedida pasa de `color-mix(... 70%)` a color pleno
       al 100 % y 2 px (globals.css:1337-1341).
   C4. El estado "en el carrito" deja de depender del tinte: franja sólida de
       4 px en el pleno de la fruta pegada al borde superior de la tarjeta +
       insignia rellena (`.tarjeta-marca`, globals.css:368-383, hoy ya usa
       `background: var(--fruta)`: mantenla, pero súbela a 1,6 rem) + el tinte de
       fondo sube de 9 % a 18-22 %. El tinte solo acompaña; la señal la dan la
       franja y la insignia.
   C5. Cada canasta gana su placa: el encabezado de grupo (catalogo.tsx:185-194)
       pasa de un borde inferior gris a una placa del pleno de la canasta con el
       texto encima según la tabla. Es lo que hace que el mostrador se vea como
       un mercado y no como una lista.
   C6. El toldo (globals.css:293-307) sube a los plenos: verde hoja, papaya,
       tomate sobre `--crema-honda`. Sigue siendo rayas planas, sin degradado, y
       crece de 9 px a 12-14 px para que se lea como lona.
   C7. `themeColor` de la portada: app/catalogo/page.tsx exporta su propio
       `viewport` con `themeColor: "#f8f6f2"` (o el papaya pleno si el dueño lo
       quiere encendido). No toques app/layout.tsx:32-34 — ese es el marco del
       interior.

D. TIPOGRAFÍA Y DENSIDAD
   · Nunito variable servida desde el propio dominio con next/font
     (app/layout.tsx:20-24). CERO fuentes nuevas, cero CDN: la placita opera con
     internet malo.
   · Titulares con clamp() (hero.tsx:51, catalogo.tsx:95) pero con más peso en
     celular (§4-a5). Cuerpo mínimo 0,9375 rem; los campos de texto se quedan en
     1 rem clavado —por debajo de 16 px el celular hace zoom al enfocar y
     descuadra el mostrador— y eso ya está resuelto y comentado en
     globals.css:1370-1372: no lo deshagas.
   · Densidad: celular primero. Dos columnas de tarjeta a 390 px
     (catalogo.tsx:196), zonas de toque grandes (el −/+ mide 2,25 rem,
     globals.css:1389-1401) y el muelle siempre al alcance del pulgar. El aire
     del manifiesto se sacrifica donde estorbe al antojo: aquí una pantalla llena
     de fruta es correcta.

───────────────────────────────────────────────────────────────────────────
6. INTERACCIÓN Y ANIMACIÓN — eje ANIMACIÓN. Inventario CERRADO
───────────────────────────────────────────────────────────────────────────
Regla de oro del proyecto: se anima SOLO `transform` y `opacity`. Son las dos
únicas propiedades que el compositor mueve sin repintar; todo lo demás le cuesta
CPU al Android de gama media que es el dispositivo objetivo.

PRESUPUESTO DE RENDIMIENTO (se verifica en §10-D):
  P1. Como máximo 8 elementos animándose a la vez dentro del viewport. Hoy son
      14 (§0) y eso es antes de agregar nada.
  P2. Ninguna animación infinita corriendo fuera del viewport: `IntersectionObserver`
      pone `animation-play-state: paused` cuando la sección sale de pantalla.
  P3. `will-change` en 2 elementos como máximo y nunca permanente. Hoy hay 7
      permanentes (globals.css:311): quítalo de `.flota` — una animación infinita
      de `transform` ya promueve la capa sola.
  P4. Cero librerías de animación, cero `requestAnimationFrame` propio, cero
      animación por JS de propiedades. Todo es CSS; el JS solo enciende y apaga
      clases o atributos.
  P5. Ninguna animación de entrada por producto: 39 tarjetas apareciendo una a
      una es exactamente el jank que este teléfono no puede pagar. Se anima el
      encabezado de la sección, no las 39 tarjetas.
  P6. Toda animación no ambiental dura ≤ 600 ms. Las ambientales (flotar, pregón)
      se quedan lentas y suaves.
  P7. PROHIBIDO ANIMAR: `box-shadow`, `filter`, `backdrop-filter`, `blur`,
      `width`, `height`, `top`, `left`, `margin`, `background-position`, y
      cualquier animación ligada al scroll (parallax).

INVENTARIO — qué se mueve, con qué disparador, cuánto dura y con qué curva

 SE QUEDAN (ya existen, ya venden; se afinan)
 E1. Fruta flotando en el héroe · gesto: sube y baja 14 px con giro propio ·
     disparador: carga, infinito · 6,4-8,2 s cada una, `ease-in-out`, compás
     distinto por pieza para que nada respire al unísono (globals.css:272-275,
     309-312; hero.tsx:24-35). AFINAR: quitar `will-change` (P3) y pausar fuera
     de viewport (P2).
 E2. Entrada escalonada del héroe (`asomar`) · opacidad + 18 px + escala 0,96 →
     1 · disparador: carga, con retrasos 0/60/120/180/240 ms · 520 ms
     `cubic-bezier(0.22, 1, 0.36, 1)` (globals.css:276-279, 313; hero.tsx:49-96).
     AFINAR: bajar a 3 pasos (rótulo+titular, frescura+CTA, fruta) y a 420 ms —
     con 5 pasos lo último llega casi a un segundo.
 E3. Fruta del día que cambia sola · cruce con 10 px y escala 0,94 → 1 ·
     disparador: temporizador de 3.400 ms · 420 ms `cubic-bezier(0.22, 1, 0.36,
     1)` (globals.css:283-286, 442; fruta-del-dia.tsx:19-28).
 E4. Pregón corriendo · translateX -50 % · disparador: carga, infinito · 64 s
     lineal (globals.css:280-282, 318). Es el vendedor cantando lo que trajo.
 E5. Escalonador de 500 g · no es animación, es el gesto de la plaza ("más,
     más") · tienda-datos.ts:146,169-171. No se cambia por un campo numérico.
 E6. Seguimiento que se refresca cada 15 s solo con la pestaña visible
     (tienda.tsx:58, 165-206). Un pedido cambia tres veces en media hora; un
     socket abierto sería lujo y una pantalla que miente sería peor.

 SE AGREGAN (cada una con su justificación comercial; si no vende, no entra)
 N1. LA FRUTA DEL DÍA SE PUEDE TOCAR · gesto: al tocar, la ficha baja a
     `scale(0.97)` y vuelve · disparador: `tap`/`click` · 120 ms `ease-out`,
     seguido del salto suave al mostrador con esa fruta filtrada (enlace-ancla.tsx
     ya hace el scroll suave respetando movimiento reducido, :17-24).
     VENDE PORQUE: convierte el antojo en un producto concreto en el carrito.
 N2. LAS SEIS FRUTAS DE LA ÓRBITA SE PUEDEN TOCAR · mismo gesto y mismo destino
     que N1 (hero.tsx:113-126). VENDE PORQUE: seis puertas de entrada al
     mostrador en la primera pantalla, en lugar de seis adornos.
 N3. TIRA "HOY EN EL MOSTRADOR" (§4-B) · gesto: scroll horizontal con
     `scroll-snap-type: x mandatory` y `scroll-snap-align: start` · disparador:
     dedo. Sin animación automática. VENDE PORQUE: pone producto pedible a menos
     de dos pantallas (M5).
 N4. LA FRUTA SALTA AL AGREGAR · gesto: la ilustración de la tarjeta hace
     `translateY(-8px) scale(1.12)` y vuelve · disparador: toque en
     `.tarjeta-toque` (tarjeta-producto.tsx:77-99), vía atributo
     `data-acaba-de-entrar` que React pone y quita a los 400 ms · 260 ms
     `cubic-bezier(0.34, 1.4, 0.64, 1)` (la misma curva con rebote que ya usa la
     hoja en globals.css:354-358). VENDE PORQUE: en celular no hay hover; sin
     esto el toque no se siente y el cliente duda si quedó.
 N5. LA PALOMITA ENTRA · gesto: `scale(0)` → `scale(1)` con rebote corto ·
     disparador: el mismo toque · 180 ms `cubic-bezier(0.34, 1.4, 0.64, 1)`
     (`.tarjeta-marca`, globals.css:368-383). VENDE PORQUE: confirmación sin
     leer, que es como se compra de pie en la calle.
 N6. EL MUELLE ACUSA RECIBO · gesto: la cifra del total hace `scale(1) →
     scale(1.06) → scale(1)` · disparador: cambia el total del carrito
     (barra-pedido.tsx:76-79) · 200 ms `ease-out`. VENDE PORQUE: cada toque
     tiene una consecuencia visible en la parte de abajo, que es donde está el
     botón de mandar el pedido.
 N7. CHIPS PEGAJOSOS (§4-d2) · gesto: al quedar pegados, la fila gana fondo
     sólido y una sombra · disparador: `IntersectionObserver` sobre un centinela
     · transición de 160 ms sobre `opacity` de una capa de fondo (NO animar
     `box-shadow`, P7). VENDE PORQUE: con 39 productos en dos columnas, el filtro
     tiene que estar siempre a mano.
 N8. LATIDO DE FRESCURA · gesto: un punto junto a "Fresco desde el martes" que
     late con `opacity` 1 → 0,45 y `scale(1) → scale(1.35)` sobre un
     pseudo-elemento · disparador: carga, infinito, solo si la línea está en
     pantalla · 2 s `ease-out`. VENDE PORQUE: hace que la fecha se lea como algo
     vivo, no como un dato impreso.
 N9. EL PREGÓN SE PAUSA CON EL DEDO Y FUERA DE PANTALLA · gesto: pausa ·
     disparador: `pointerdown` (funciona con dedo, a diferencia del `:hover` de
     globals.css:319) y salida del viewport (P2). VENDE PORQUE: el que quiere
     leer un nombre puede pararlo, y el que no lo está mirando no paga batería.
 N10. UNA sola aparición por sección al hacer scroll · gesto: opacidad 0 → 1 con
     12 px de subida · disparador: `IntersectionObserver`, una vez, solo sobre el
     ENCABEZADO de cada sección · 320 ms `cubic-bezier(0.22, 1, 0.36, 1)`.
     VENDE PORQUE: da ritmo al bajar sin cobrar 39 animaciones (P5).
 N11. REEMPLAZO DEL `latido` ACTUAL · hoy globals.css:1306-1309 anima
     `box-shadow` en el punto del pedido en curso, y eso repinta en cada
     fotograma (P7). Mismo efecto visual con un pseudo-elemento que escala y se
     desvanece: `scale(1) opacity(0.45)` → `scale(2.2) opacity(0)`, 2 s
     `ease-out`, infinito. Aplica en globals.css:1589 y mantiene el respaldo de
     movimiento reducido que ya existe en :1609-1612.

 SE PROHÍBEN, explícitamente: parallax, contadores animados de cifras (no hay
 cifras sociales que contar, §3), confeti, carruseles automáticos de banners,
 modales de bienvenida, cursores personalizados, "revelados" tarjeta por tarjeta,
 texto que se escribe solo, animaciones de más de 600 ms fuera de las ambientales
 y cualquier movimiento que no ayude a escoger o a pedir.

 MOVIMIENTO REDUCIDO — regla dura y ya implementada: el repo respeta
 `prefers-reduced-motion` en dos bloques (globals.css:445-452 y 1607-1613) y en
 dos componentes (fruta-del-dia.tsx:25, enlace-ancla.tsx:22). TODA animación
 nueva de esta lista entra en esos bloques. Sin excepciones, y se verifica en
 §10-D3.

───────────────────────────────────────────────────────────────────────────
7. RESTRICCIONES TÉCNICAS REALES (verificadas en el repo, no supuestas)
───────────────────────────────────────────────────────────────────────────
· Stack exacto (package.json:17-33): Next.js 16.3.0 App Router, React 19.2.4,
  TypeScript estricto, Tailwind 4 (@tailwindcss/postcss), @supabase/supabase-js
  2.112.3. CERO dependencias nuevas: nada de librerías de animación, packs de
  iconos, carruseles ni headless-ui. Los glifos son caracteres (◉ ⌕ ✓ ✎ ‹ ›) y
  las frutas son SVG dibujado a mano (ilustracion.tsx).
· CERO imágenes y cero red de terceros. No existe public/ (verificado hoy). No
  agregues .jpg/.png de ningún tipo (§8).
· Componentes de servidor por defecto; "use client" SOLO donde hay estado — hoy:
  frescura, catalogo, tarjeta-producto, tienda, barra-pedido, revisar,
  seguimiento, fruta-del-dia, enlace-ancla, ilustracion. Hero, Pulpas y Pie son
  HTML servido y deben seguir siéndolo (app/catalogo/page.tsx:20-23). Si una
  animación nueva exige convertir el Hero en cliente, no la hagas: resuélvela en
  CSS o mueve el estado a un componente hijo pequeño.
· MODO VITRINA — la restricción que más gente ha roto. Con MODO_VITRINA=1 el
  servidor público sirve ÚNICAMENTE (lib/servidor/modo-vitrina.ts:67-87):
      GET  /catalogo
      GET  /api/catalogo · POST /api/pedidos · GET /api/pedidos/<id>
      GET  /_next/static/*, /_next/image y archivos de raíz CON EXTENSIÓN
  Todo lo demás: 404 limpio, sin cuerpo (proxy.ts). Consecuencias prácticas:
    – No inventes endpoints nuevos: nacerían muertos en producción.
    – Cualquier ruta nueva (la imagen de compartir, §4-G) va a
      `permitidoEnVitrina` Y a lib/servidor/modo-vitrina.test.ts.
    – Una ruta sin punto en el último tramo NO pasa como asset (:101-109).
· El sistema del que se alimenta la vitrina: GET /api/catalogo devuelve
  { catalogo, pausados } y 503 si Supabase no está configurado
  (app/api/catalogo/route.ts:41-42). POST /api/pedidos tiene rate limit y
  responde 429 con "Está mandando pedidos muy seguido..."
  (app/api/pedidos/route.ts:76-81).
· Pruebas: `npm test` corre `node --test "lib/**/*.test.ts"` (package.json:15) —
  o sea, NADA de components/ está cubierto. Toda lógica pura que escribas va a
  lib/ con su prueba; los componentes solo pintan.
· Dónde corre: producción local del negocio con `next start -p 3300`
  (iniciar-mercaplaza.bat) contra la Supabase viva, y en Hostinger, que despliega
  la rama main. OJO: hoy main sigue 2 commits DETRÁS de master (verificado hoy:
  `git rev-list --count main..master` = 2), así que el dominio sirve un build
  viejo. Entregar sin merge master→main = no entregar.
· Comandos que deben quedar verdes: npm run lint · npm run typecheck · npm test ·
  npm run build.

───────────────────────────────────────────────────────────────────────────
8. PROHIBIDO EN ESTE PROYECTO
───────────────────────────────────────────────────────────────────────────
 1. Rehacer la portada desde cero, en un HTML suelto o en otra ruta.
 2. Volver al registro minimalista de manifiesto: ya fue rechazado por el dueño
    sobre esta misma página, con esas palabras.
 3. Azules eléctricos, morados tecnológicos, neones y gradientes "tech"
    (globals.css:257-259). Las únicas rampas permitidas son las rayas planas del
    toldo.
 4. Fotos de stock, de cualquier tipo. No hay un solo asset en el repo y así se
    queda: la ilustración propia es la identidad.
 5. Inventar precios o mostrar un precio de ejemplo (tienda-datos.ts:130 deja
    precioCop en null a propósito).
 6. Publicar horario, dirección, ciudad, barrio, plaza, teléfono, NIT o nombre
    del dueño que no venga del dueño. El horario inventado de pie.tsx:11-14 se
    BORRA en esta entrega.
 7. Cifras sociales de cualquier tipo: años, clientes, familias, kilos, pedidos,
    testimonios, reseñas, estrellas, "los mejores de".
 8. Prometer lo que el sistema no hace: NO hay domicilios, NO hay pago en línea,
    NO hay pasarela. El trato real es: pida, nosotros alistamos, usted recoge y
    paga en la caja.
 9. Cambiar los valores de los tokens de fruta en globals.css:261-270 o las
    paletas de catalogo-datos.ts: los usa también el interior de la app (§5-B).
10. Animar `box-shadow`, `filter`, `blur`, `width/height/top/left`, o atar
    cualquier animación al scroll (parallax). Ver P7.
11. Agregar dependencias, fuentes externas o llamadas a CDN.
12. Romper el modo vitrina o ampliar la superficie pública sin su prueba.
13. Tocar el interior de la app (app/(app)/*): ahí manda el manifiesto y no es
    parte de este trabajo.
14. Usar "La Placita" y "Mercaplaza Nariñense Familiar" como si fueran lo mismo
    sin que el dueño decida (HUECO 6).

───────────────────────────────────────────────────────────────────────────
9. HUECOS DEL DUEÑO — lo primero que hay que leer y responder
───────────────────────────────────────────────────────────────────────────
Nada de esto se rellena con algo verosímil. Cada hueco queda como anclaje vacío
con TODO explícito hasta que llegue el dato.

 1. TELÉFONO / WHATSAPP DEL NEGOCIO. Hoy es null en la base
    (supabase/bootstrap.sql:34-35, 55-56) y no aparece en ninguna parte del
    código (cero coincidencias de "whatsapp" o "wa.me"). SE NECESITA porque sin
    catálogo publicado el cliente no tiene ninguna forma de comprar, y porque
    esta gente compra por WhatsApp. Es el hueco más caro de todos.
 2. DIRECCIÓN EXACTA DEL PUESTO + cómo llegar (¿qué plaza, qué pasillo, qué
    número de puesto?). Hoy null y marcada como placeholder (bootstrap.sql:47-56).
    SE NECESITA porque toda la portada promete "recoja en el puesto" y en ninguna
    parte dice dónde queda el puesto.
 3. HORARIO REAL de atención, incluidos domingos y festivos. SE NECESITA para
    reemplazar el inventado de pie.tsx:11-14, que se borra en esta entrega.
 4. CIUDAD Y PLAZA confirmadas. "Nariñense" es marca, no ubicación; el único
    "Pasto" del repo es un ejemplo comentado (bootstrap.sql:181). SE NECESITA
    para el texto, para el mapa y para que alguien lo encuentre buscando.
 5. NOMBRE DEFINITIVO DEL LOCAL: hoy "Mercaplaza — Principal" declarado
    placeholder, con "Mercaplaza Centro" sugerido en un comentario
    (bootstrap.sql:52-54, 182).
 6. ¿QUÉ NOMBRE MANDA EN LA PORTADA: "La Placita" o "Mercaplaza Nariñense
    Familiar"? Hoy salen los dos en la misma pantalla (hero.tsx:49 y
    app/catalogo/page.tsx:35). SE NECESITA para no presentar dos marcas al mismo
    cliente.
 7. DOMINIO: el sitio vive en dropshoping.com.co, que no tiene relación con
    Mercaplaza (lib/servidor/modo-vitrina.ts:4-6). ¿Se compra uno propio o se
    asume este? Afecta lo que se puede imprimir en un volante.
 8. NIT, solo si quiere que aparezca en el pie o en el recibo (bootstrap.sql:34).
 9. PUBLICAR EL SURTIDO CON PRECIOS desde la caja. Verificado hoy: el mostrador
    publicado tiene UN producto y está agotado. Sin surtido publicado, la portada
    más bonita del mundo no vende nada. Es acción del dueño, no de diseño, y es
    la condición para que esta mejora sirva.
10. CONFIGURAR EN HOSTINGER las variables de Supabase + CLAVE_CAJA +
    MODO_VITRINA=1, y hacer merge master→main (main está 2 commits atrás). Sin
    esto, lo que se mejore no llega al público.
11. OPCIONAL — ¿hay combos o canastas armadas ("mercado de la semana") con
    precio? No existe ninguno en el repo. Si los quiere, los dicta él con
    productos y precios; no se inventan.
12. OPCIONAL — ¿quiere una foto real de su puesto para el héroe o para la tarjeta
    de WhatsApp? Si no, se sigue con ilustración propia, que para este negocio es
    mejor que cualquier banco de imágenes.

───────────────────────────────────────────────────────────────────────────
10. CRITERIOS DE ACEPTACIÓN (verificables, no opinables)
───────────────────────────────────────────────────────────────────────────
A. CÓDIGO Y CONTRATOS
 1. `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` terminan
    sin error. Se pega la salida.
 2. `git diff package.json` no muestra dependencias nuevas y `ls public` sigue
    fallando (cero imágenes agregadas), salvo el asset con extensión de §4-G si
    se eligió esa vía.
 3. La lógica de frescura vive en lib/ con su prueba y `npm test` reporta más
    pruebas que antes.
 4. Si se tocó la superficie pública: lib/servidor/modo-vitrina.test.ts
    actualizado y verde.
 5. `grep -rn "7:00 a. m." components/` no devuelve nada.
 6. `grep -rni "años de experiencia\|clientes satisfechos\|familias\|testimonio"
    components/landing/` no devuelve nada.
 7. `git diff app/globals.css` no muestra cambios en las líneas 261-270 (tokens
    compartidos con el interior) ni en las secciones Hub / plano real; `git diff
    components/landing/catalogo-datos.ts` no muestra cambios de `paleta`.
 8. `git diff app/(app)/` está vacío.

B. LA HERRAMIENTA DE VERDAD VISUAL — Edge headless, con dos trampas verificadas
   en esta máquina (2026-08-19). Léelas antes de capturar nada:
   TRAMPA 1: `msedge --headless --window-size=390,844 --screenshot` NO da un
   viewport de 390 px. Medido: el viewport real queda en 492×752 y el PNG sale
   recortado a 390 — o sea, la captura muestra un layout de escritorio angosto
   cortado, no lo que ve un celular. El ancho mínimo de ventana no baja de 492
   ni con `--headless=old` ni con `--force-device-scale-factor=1`.
   TRAMPA 2: Edge headless reporta `prefers-reduced-motion: reduce` POR DEFECTO.
   Cualquier captura hecha "a lo simple" muestra la página SIN animación, así
   que no sirve ni para aprobar el movimiento ni para probar el respaldo.
   RECETA QUE SÍ FUNCIONA (sin dependencias; Node 24 trae WebSocket global):
     1) Levantar el sitio:  npm run build && npx next start -p 3311
     2) Levantar Edge con puerto de depuración:
        msedge.exe --headless=new --disable-gpu --remote-debugging-port=9222
          --user-data-dir=<carpeta temporal> about:blank
     3) Un script Node que hable CDP por WebSocket y haga, en este orden:
        · Emulation.setDeviceMetricsOverride {width:390, height:844,
          deviceScaleFactor:1, mobile:true}
        · Emulation.setEmulatedMedia {features:[{name:"prefers-reduced-motion",
          value:"no-preference"}]}   ← para ver el movimiento
        · Page.navigate + espera 3,5 s
        · Runtime.evaluate para medir (alturas, offsets, contrastes)
        · Page.captureScreenshot
   Sin esa emulación explícita, ninguna captura de este proyecto es evidencia.

C. IMPACTO Y COLOR — medidos, comparados contra §0
 9. Se entrega una tabla ANTES/DESPUÉS con estos ocho números, tomados con la
    receta de B a 390×844: alto del héroe (hoy 963), y de la primera tarjeta
    pedible (hoy 1.994), borde inferior de la ficha del día (hoy 871), renglones
    del párrafo del héroe (hoy 5), lado de la fruta más grande del pliegue (hoy
    104), alto del documento (hoy 3.616), peso tipográfico del h1 en celular
    (hoy 300) y número de elementos animados (hoy 14).
10. Se cumplen M1 a M7 de §4. Cada meta se demuestra con su número, no con una
    opinión.
11. Captura del pliegue a 390×844 en la que se leen: nombre del negocio,
    titular, CTA principal, la línea viva de frescura y dos frutas de ≥ 120 px.
12. Contraste, comprobado con un script (no a ojo) sobre los colores que
    realmente quedaron en el DOM: todo texto de color sobre crema ≥ 4,5:1, todo
    texto sobre relleno pleno ≥ 4,5:1, todo borde o superficie con significado
    ≥ 3:1. Se pega la tabla de resultados.
13. Ninguna captura muestra azul eléctrico, morado tecnológico, neón ni
    gradiente "tech"; los únicos colores fuera de la base cálida son los de §5.
14. El estado "en el carrito" se distingue en la captura sin ampliar: se ve la
    franja sólida y la insignia, no solo un tinte.

D. ANIMACIÓN — probada, no descrita
15. Con `prefers-reduced-motion: no-preference` emulado, un script cuenta los
    elementos con `animationName !== "none"` dentro del viewport: ≤ 8 (P1).
16. `getComputedStyle` de todo el DOM de /catalogo no devuelve ninguna animación
    ni transición sobre `box-shadow`, `filter`, `width`, `height`, `top` o
    `left` (P7). Se pega la salida del chequeo.
17. Con `prefers-reduced-motion: reduce` emulado, dos capturas separadas por
    2 s son idénticas byte a byte: la fruta no flota, el pregón no corre, la
    ficha del día no rota, el punto del pedido no late.
18. `will-change` aparece en ≤ 2 elementos (P3): `document.querySelectorAll("*")`
    filtrado por `getComputedStyle(e).willChange !== "auto"`.
19. Al hacer scroll más allá del héroe, las animaciones infinitas de esa sección
    quedan en `paused` (P2). Se verifica leyendo `animationPlayState`.
20. El toque en una tarjeta produce N4 + N5 + N6 en una sola secuencia: se
    entregan dos capturas (antes y ~150 ms después del toque, disparado por CDP)
    donde se ve el cambio.

E. COMPORTAMIENTO, probado en los dos modos
21. `next start -p 3302` (modo completo) y `MODO_VITRINA=1 next start -p 3303`.
    En 3303: /catalogo responde 200; /login, /ventas y GET /api/pedidos
    responden 404 sin cuerpo; POST /api/pedidos y GET /api/catalogo funcionan.
    Se pegan los códigos.
22. ESCENARIO SIN CATÁLOGO PUBLICADO: /catalogo carga, se ven los 39 productos,
    la búsqueda y los chips funcionan, NO aparece ningún precio y el cliente
    tiene un camino visible (armar su lista) más el anclaje de contacto, vacío y
    con TODO si el HUECO 1 sigue abierto.
23. ESCENARIO CON CATÁLOGO PUBLICADO: se agrega un producto con un toque, el
    escalonador sube y baja de 500 en 500, "Revisar pedido" abre la hoja, un
    envío con nombre y teléfono válidos devuelve número de pedido, y la cinta de
    seguimiento cambia de estado en ≤ 15 s cuando la caja lo mueve.
24. Con nombre vacío o teléfono de 6 dígitos aparecen exactamente los textos de
    tienda-datos.ts:304-312, y el botón no manda el pedido dos veces si se toca
    rápido.
25. Con 1 solo producto en el mostrador, el contador dice "1 producto" (§4-d5).

F. ACCESIBILIDAD Y PESO
26. Recorrido completo con teclado: buscar → chips → tarjetas → escalonador →
    revisar → enviar, con el foco SIEMPRE visible (globals.css:434-439).
27. El muelle fijo no tapa el último renglón del mostrador (tienda.tsx:321-322).
28. Ningún elemento nuevo depende SOLO de `:hover`: cada gesto tiene su
    equivalente de toque.
═══════════════════════════════════════════════════════════════════════════
