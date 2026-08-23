═══════════════════════════════════════════════════════════════════════════
PROMPT — MEJORAR LA VITRINA PÚBLICA DE "MERCAPLAZA NARIÑENSE FAMILIAR"
Objetivo: que la portada /catalogo VENDA, no que se rehaga.
Repo: C:\Users\Kalel\placita   ·   Producción pública: https://dropshoping.com.co
═══════════════════════════════════════════════════════════════════════════

ANTES DE ESCRIBIR UNA LÍNEA
No partes de cero y está prohibido partir de cero. La portada YA EXISTE, funciona
y está desplegada: app/catalogo/page.tsx (52 líneas) + components/landing/* (~3.130
líneas en 16 archivos). Lee estos cinco antes de tocar nada: app/catalogo/page.tsx,
components/landing/{hero,frescura,catalogo,tarjeta-producto,tienda}.tsx, y la
sección "Landing" de app/globals.css:246-452. Un HTML suelto o un rediseño desde
cero PIERDE la conexión viva con /api/catalogo y /api/pedidos y queda fuera del
modo vitrina: eso es entregar nada. Se mejora lo que hay, archivo por archivo.

Lección pagada que manda sobre este trabajo: el 2026-08-05 el dueño rechazó una
versión anterior de ESTA MISMA portada con estas palabras — "la landing que haces
es una basura... muy minimalista... quiero que esta landing sea más interactiva,
más llamativa, es para vender frutas". El minimalismo del manifiesto "El estudio
del ingeniero moderno" es para el INTERIOR de la app (donde el cajero trabaja seis
horas), NO para la portada. La portada tiene un solo trabajo: dar antojo y recibir
el pedido. Esa decisión ya quedó escrita en el propio código, en app/globals.css:
246-259 — respétala y llévala más lejos, no la deshagas.

───────────────────────────────────────────────────────────────────────────
1. EL NEGOCIO (todo con origen; nada de esto es adorno)
───────────────────────────────────────────────────────────────────────────
· Marca REAL, no placeholder: "Mercaplaza Nariñense Familiar". Está insertada como
  la empresa de PRODUCCIÓN en supabase/bootstrap.sql:30-33, comentada como "el
  rebrand del dueño" en lib/seed.ts:3 y fijada por test en lib/seed.test.ts:197,203.
  Título del sitio: app/catalogo/page.tsx:35.
· Qué vende: frutas, verduras, tubérculos y plátanos, granos, pulpas y "y más".
  39 productos exactos, "los 39 del dueño, en el orden en que los cantó",
  en 6 canastas — components/landing/catalogo-datos.ts:78-88 y 88-401.
· Cómo se vende: por PESO, en gramos, con báscula real ACS-TAE-30 leída por Web
  Serial (lib/pesa.ts; protocolo verificado, memory/placita/brief.md:35). El precio
  sale del kardex (precio de compra + margen, lib/dominio/precios.ts).
· Ciclo real: pedido a proveedor lunes/jueves → surtido en el mostrador martes y
  viernes. DIAS_DE_SURTIDO = [2,5] en catalogo-datos.ts:426; decisión DEC-007 en
  memory/placita/brief.md:15.
· Pulpas: fruta del mismo mostrador, despulpada y congelada, vendida al gramo, con
  SLA duro de un día (lib/dominio/pulpas.ts:1-15; sección en pulpas.tsx).
· El flujo completo que hoy FUNCIONA: el cliente arma el carrito en el celular →
  POST /api/pedidos → la caja recibe el pedido → el celular sigue el estado
  preguntando cada 15 s (components/landing/tienda.tsx:58,185-206).
· Dónde opera: NO SE SABE. La dirección y el teléfono están en null y marcados como
  PLACEHOLDER en supabase/bootstrap.sql:46-58; lo único parecido a una dirección en
  todo el repo es un ejemplo COMENTADO ("Calle 00 #00-00, Pasto", bootstrap.sql:182).
  "Nariñense" es parte del nombre de marca, no un dato de ubicación verificado.
  → Ver §9. NO INVENTES CIUDAD, PLAZA NI BARRIO.
· Precios: cero precios en el repo, a propósito. El precio que se muestra es el que
  la caja publicó en vivo; si no hay catálogo publicado, precioCop = null y la
  tarjeta dice "Precio en tienda" (tienda-datos.ts:39-43,119-133;
  tarjeta-producto.tsx:49-53). "NUNCA se inventa un número" está escrito en el
  código: no lo rompas.

───────────────────────────────────────────────────────────────────────────
2. QUIÉN MIRA Y QUÉ DEBE HACER
───────────────────────────────────────────────────────────────────────────
Quien mira: un vecino de la zona, mayoritariamente ama de casa o trabajador, con
celular Android de gama media, datos limitados y ancho de banda pobre, que ya
compra por WhatsApp y llega al sitio por un enlace pegado en un chat. Mira de pie,
con una mano, y a veces con sol en la pantalla. Diseña para 390 px de ancho primero;
el escritorio es el caso secundario.

Qué debe SENTIR, en este orden:
  1) ANTOJO — "esa papaya está buena". La fruta manda: dibujada grande, en color.
  2) FRESCURA COMPROBABLE — "llegó el martes, hace dos días", dicho con el
     calendario en la mano, no con un adjetivo.
  3) CONFIANZA EN EL PESO — "se pesa al gramo delante suyo, sin 'ahí le dejo'"
     (el argumento ya está redactado en hero.tsx:75-79 y frescura.tsx:113-119; es
     el diferencial contra el que le echa el ojo al kilo).

UNA SOLA ACCIÓN PRINCIPAL: ARMAR EL PEDIDO Y ENVIARLO ("Haga su pedido" →
mostrador → carrito → "Revisar pedido" → "Enviar pedido"). Todo lo demás se
subordina. "Entrar al sistema" es para quien atiende y se queda como enlace
discreto, nunca como botón que compita (hero.tsx:85-93), y desaparece solo en modo
vitrina. No agregues un segundo CTA de igual peso: dos CTAs compitiendo = ninguno.

───────────────────────────────────────────────────────────────────────────
3. EVIDENCIA REAL — lo ÚNICO que se puede probar hoy
───────────────────────────────────────────────────────────────────────────
Puedes afirmar (con estos respaldos):
  · "39 productos, los que el dueño canta en su puesto" — catalogo-datos.ts:87-401.
  · "Surtido nuevo martes y viernes" y la cuenta viva de días — catalogo-datos.ts:426
    + frescura.tsx:25-51.
  · "Pesado al gramo" — el sistema es de peso en gramos enteros con báscula real
    (lib/pesa.ts, lib/dominio/*, brief.md:9,35).
  · "Se paga en la caja, cuando recoge" — app/catalogo/page.tsx:37, revisar.tsx:24-27.
  · "El pedido le da un número y usted lo sigue" — seguimiento.tsx:79-118.
  · "Pulpa congelada de la misma fruta" — pulpas.tsx:42-62, lib/dominio/pulpas.ts:1-15.
  · Dibujos propios de cada producto, 20 siluetas SVG hechas a mano
    (ilustracion.tsx, catalogo-datos.ts:9-11,17-38). Esto es un activo, no una
    carencia: ninguna competencia local tiene una vitrina ilustrada así.

NO EXISTE y por lo tanto NO SE ESCRIBE: años de experiencia, número de clientes o
familias, kilos vendidos, testimonios, reseñas, estrellas, premios, "los mejores
de Pasto", "más de X pedidos". No hay una sola de esas cifras en el repo. Si el
dueño las quiere, las dicta él (§9); mientras tanto la portada vende con lo que
puede demostrar.

───────────────────────────────────────────────────────────────────────────
4. ESTRUCTURA SECCIÓN POR SECCIÓN — qué cambia y por qué vende
───────────────────────────────────────────────────────────────────────────
Se conserva el orden actual (app/catalogo/page.tsx:44-51: Hero → Frescura → Tienda
→ Pulpas → Pie), que ya es el orden de una venta. Lo que cambia es cuánto vende
cada una.

A) HERO (components/landing/hero.tsx) — hoy: rótulo "La Placita · frutas y
   verduras" (:49), titular "Fruta fresca de plaza, pesada al gramo" (:52-55),
   párrafo (:75-79), un CTA (:82-84), tres promesas (:96-108), seis frutas
   flotando en órbita (:28-35) y la ficha "Fruta del día" que rota sola cada
   3,4 s (fruta-del-dia.tsx:19).
   PROPÓSITO DE VENTA: antojo en dos segundos + una sola puerta al mostrador.
   MEJORAS EXIGIDAS:
   a1. SUBIR EL ARGUMENTO DE FRESCURA A LA PRIMERA PANTALLA. Hoy la cuenta viva
       ("Fresco desde el martes · hace 2 días · vuelve a llegar el viernes") vive
       en la sección siguiente (frescura.tsx:96-111), es decir, debajo del pliegue
       en celular. El argumento más fuerte de una placita no puede estar en la
       segunda pantalla. Ponlo en el hero como una línea viva junto a las tres
       promesas actuales. Reutiliza EXACTAMENTE el mismo cálculo, no lo dupliques.
   a2. LA FRUTA DEL DÍA DEBE VENDER, NO SOLO GIRAR. Hoy es decorativa: no tiene
       ni un click (fruta-del-dia.tsx completo, cero handlers). Hazla accionable:
       tocarla lleva al mostrador con esa fruta ya enfocada/filtrada (el filtro por
       canasta y la búsqueda ya existen en catalogo.tsx:50-84). Que un toque en
       "Mango" termine en el mango del mostrador es interacción que vende; que gire
       sola y no haga nada es adorno.
   a3. Las seis frutas en órbita (hero.tsx:28-35) se quedan: son el toldo del
       puesto. Si las haces tocables, deben llevar al mismo sitio que a2.

B) FRESCURA (components/landing/frescura.tsx) — franja oscura --tierra con tres
   columnas (surtido / en el mostrador / la pesa) + el "Pregón": marquesina que
   canta los 39 nombres en bucle y se pausa al pasar el mouse (:55-73,
   globals.css:315-319).
   PROPÓSITO: convertir "fresco" (adjetivo vacío) en un hecho con fecha.
   MEJORAS EXIGIDAS:
   b1. MUEVE EL CÁLCULO PURO A lib/. Hoy calcularSurtido/contarDias/faltanDias
       viven dentro del componente (frescura.tsx:25-51) y `npm test` SOLO corre
       lib/**/*.test.ts (package.json:15): el argumento comercial central del
       negocio no tiene ni una prueba. Sácalo a lib/ (p. ej. lib/dominio/frescura.ts)
       con sus tests: hoy es martes, es miércoles, es domingo, es lunes.
       Mantén el patrón de calcular DESPUÉS de montar y el texto fijo mientras
       tanto — la razón está escrita en frescura.tsx:11-14 (hidratación) y es
       correcta.
   b2. EL PREGÓN DEBE CANTAR LO DE HOY. Hoy canta los 39 fijos (frescura.tsx:56).
       Cuando la caja tiene catálogo publicado, que cante lo que HAY hoy (sin
       agotados) usando los datos que ya llegan de /api/catalogo. Sin catálogo
       publicado, se queda como está. En celular no hay hover: la pausa al hover
       (globals.css:319) no basta como única interacción.

C) TIENDA / MOSTRADOR (tienda.tsx + catalogo.tsx + tarjeta-producto.tsx +
   barra-pedido.tsx + revisar.tsx + seguimiento.tsx) — es la sección protagonista
   y la única con estado. Buscador sin tildes, chips por canasta con contador,
   rejilla de 2 columnas en celular, tarjeta que se tiñe del color de SU fruta,
   escalonador −/+ de 500 g, nota por producto ("que estén maduros"), barra fija
   abajo con total estimado, hoja de revisar con nombre + teléfono, y seguimiento
   con número de pedido y tres escalones.
   PROPÓSITO: que escoger se sienta como señalar en el puesto, y que el pedido
   salga.
   MEJORAS EXIGIDAS:
   c1. EL ESTADO "SIN CATÁLOGO PUBLICADO" ES HOY UN CALLEJÓN SIN SALIDA, Y ES EL
       ESTADO EN QUE ESTÁ LA PRODUCCIÓN. Verifícalo tú mismo: si Supabase no está
       configurado, GET /api/catalogo responde 503 (app/api/catalogo/route.ts:41-42);
       la tienda se queda con la vitrina de respaldo sin precios
       (tienda-datos.ts:119-133), `abierto` es false (tienda.tsx:126), TODAS las
       tarjetas dicen "Solo en el puesto" y no se pueden tocar
       (tarjeta-producto.tsx:158), y el botón de la barra dice "Pedidos cerrados"
       (barra-pedido.tsx:96). Resultado: el CTA principal del hero lleva a un
       mostrador donde no se puede hacer absolutamente nada, y no hay ni un
       teléfono al que llamar. Eso es una portada que no vende.
       ARRÉGLALO ASÍ, y solo así: (i) el aviso ya existente (tienda.tsx:298-307)
       se convierte en un camino, no en una disculpa; (ii) el cliente SIEMPRE
       puede armar su lista aunque no haya precios —dejarlo escoger y llevarse la
       lista al puesto era el comportamiento anterior y está documentado en
       catalogo.tsx:15-18—; (iii) esa lista se puede copiar o mandar por el canal
       de contacto del negocio. Ese canal es el HUECO 1 de §9: si el dueño no lo
       entrega, deja el punto de anclaje listo y VACÍO, con un TODO explícito. No
       inventes número. Y bajo ninguna circunstancia muestres un precio.
   c2. BUSCADOR Y CHIPS PEGAJOSOS EN CELULAR. Hoy se van con el scroll
       (catalogo.tsx:106-161) y con 39 tarjetas en 2 columnas el cliente queda a
       ciegas a media lista. Que la fila de canastas quede fija al llegar a la
       sección, sin tapar la barra del carrito (que vive abajo, barra-pedido.tsx:49).
   c3. FEEDBACK TÁCTIL EN LA TARJETA. Casi todo el encanto actual es :hover
       (globals.css:342-359: la tarjeta sube, la fruta crece y la hoja se inclina)
       y en un celular eso NO OCURRE NUNCA. Da el equivalente al toque: la fruta
       que salta al agregar, la palomita que aparece (ya existe, tarjeta-producto
       .tsx:88-92), y un contador visible de cuánto lleva. Que se vea que el toque
       hizo algo, sin leer.
   c4. NO TOQUES tres reglas del contrato: el total siempre se llama ESTIMADO
       (revisar.tsx:24-27), la cantidad viaja como TEXTO ("1,5 kg",
       tienda-datos.ts:265-296), y la validación de nombre/teléfono repite palabra
       por palabra la del servidor (tienda-datos.ts:298-312).

D) PULPAS (components/landing/pulpas.tsx) — "Producto estrella" según su propio
   rótulo (:43), con bolsa flotante y cuatro sabores (lulo, mango, maracuyá,
   papaya, :10).
   PROBLEMA VERIFICADO: la sección del "producto estrella" no tiene NI UN SOLO
   enlace ni botón en sus 67 líneas. Es un afiche sin puerta.
   MEJORA EXIGIDA: un CTA que lleve al mostrador con la canasta "Pulpas" ya
   seleccionada (la canasta existe: catalogo-datos.ts:83; el chip la filtra:
   catalogo.tsx:138-153). Y como la pulpa se vende al gramo y dura, es la sección
   ideal para el argumento de "compre una vez, licúe toda la semana" — dicho con
   lo que ya está escrito en :47-51, sin prometer sabores fijos (los sabores
   cambian con el surtido, :53-55).

E) PIE (components/landing/pie.tsx)
   PROBLEMA GRAVE Y URGENTE: el horario que hoy se publica en producción ES
   INVENTADO Y ESTÁ CONFESADO EN EL CÓDIGO — pie.tsx:8-14: "TODO(dueño): confirmar
   el horario real... Estos son los de una plaza de barrio típica y están puestos
   para que la portada no salga coja — no son un dato verificado". Un negocio
   real está publicando horas de atención falsas.
   MEJORA EXIGIDA: BÓRRALO. Mientras el dueño no entregue el horario real (§9,
   hueco 3), el pie no muestra horas. Un pie sin horario es incómodo; un horario
   falso hace que alguien llegue a las 6:30 p. m. a un puesto cerrado y no vuelva.
   El pie debe quedar preparado para recibir, cuando lleguen: dirección + cómo
   llegar, horario y teléfono. Ni uno solo de esos tres se rellena "provisional".

F) NUEVO — LA TARJETA DEL ENLACE COMPARTIDO (esto sí es un archivo nuevo)
   Verificado: no existe carpeta public/, ni icon, ni opengraph-image, ni favicon,
   ni manifest en todo el proyecto. Este sitio se comparte por WhatsApp —así compra
   esta gente— y hoy el enlace viaja como texto pelado, sin imagen y sin ícono.
   Es la primera impresión de la marca y no existe.
   MEJORA EXIGIDA: una imagen de compartir generada EN CÓDIGO con las mismas
   ilustraciones SVG y la paleta de fruta (nada de fotos), más un ícono de sitio.
   ATENCIÓN A LA TRAMPA (§7): en modo vitrina la ruta pública de un
   `opengraph-image.tsx` no lleva extensión y esAssetPublico() la bloquearía con
   404 (lib/servidor/modo-vitrina.ts:86,101-109). O la agregas a la lista blanca
   CON su test, o usas un archivo estático con extensión. Verifícalo corriendo,
   no de memoria.

───────────────────────────────────────────────────────────────────────────
5. REGISTRO VISUAL Y PALETA
───────────────────────────────────────────────────────────────────────────
Registro: VENTA, no manifiesto. Justificación: quien mira es un cliente en el
andén, no un cajero en su turno (y el dueño ya rechazó el registro contrario sobre
esta misma página, ver arriba). El interior de la app —/ventas, /inventario,
/dashboard— NO se toca y sigue en registro de calma.

La paleta ya está decidida en el código y es la correcta; úsala tal cual, no
inventes colores de marca (app/globals.css):
  Base cálida (:14-20)     --bg #f8f6f2 · --card #fcfbf8 · --ink #111111
                           --muted #666666 · --border #e7e4de · --hover #f2efe9
  Acentos de FRUTA (:262-269, cada uno ES un producto del mostrador)
                           --verde-aguacate #4f6d38 · --verde-hoja #5f8a3a
                           --naranja-papaya #d9722e · --rojo-tomate #c8402f
                           --amarillo-banano #dda52c · --morado-cebolla #8b4a72
                           --crema-honda #f1ece1 · --tierra #2e261c
  Canastas (catalogo-datos.ts:78-85) frutas #d9722e · verduras #5f8a3a ·
  tubérculos #a8763f · granos #6f7f39 · pulpas #b8443f · y más #5d8a6a
Regla no negociable, ya escrita en globals.css:252-255: EL COLOR SIGNIFICA. Cada
acento es el color real de una fruta del mostrador, plantado por React en la
variable --fruta (catalogo-datos.ts:445-447). Ningún color decorativo nuevo.

Tipografía: Nunito variable, servida desde el propio dominio por next/font
(app/layout.tsx:21-25) — cero peticiones a Google, porque la placita opera con
internet malo. No agregues fuentes. Titulares grandes en peso ligero con
clamp() (hero.tsx:51, catalogo.tsx:95); el cuerpo y las cifras, en peso normal y
mínimo 0,9375 rem, que esto se lee de pie y con sol.

Densidad: celular primero. Dos columnas de tarjeta en 390 px (catalogo.tsx:196),
zonas de toque generosas (el −/+ se opera con el pulgar), y la barra del carrito
siempre alcanzable abajo. El aire del manifiesto se sacrifica donde estorbe al
antojo: aquí una pantalla llena de fruta es correcta.

───────────────────────────────────────────────────────────────────────────
6. INTERACCIÓN — cada una se justifica o se cae
───────────────────────────────────────────────────────────────────────────
SE QUEDAN (ya existen y ya venden):
 · Toldo de lona rayada, tres colores planos (globals.css:293-304). Es el toldo
   del puesto: dice "mercado" antes de leer una palabra.
 · Fruta flotando con compás distinto cada una (globals.css:272-275,309-312;
   hero.tsx:24-35). Da vida sin distraer porque nada respira al unísono.
 · Pregón corriendo (globals.css:280-282,315-319). Es el vendedor cantando lo que
   trajo: 39 nombres pasando es prueba de surtido.
 · Tarjeta que se tiñe de su fruta y le crece el cuerpo (globals.css:342-359).
 · Escalonador de 500 g (tienda-datos.ts:143-146). Es cómo se pide en una plaza,
   "más, más" — no un input numérico.
 · Seguimiento que se refresca cada 15 s solo con la pestaña visible
   (tienda.tsx:56-58,185-206). Un pedido cambia tres veces en media hora; un socket
   abierto sería lujo, y una pantalla que miente sería peor.
SE AGREGAN (y esta es su justificación comercial):
 · Contador vivo de frescura en la primera pantalla (§4-a1): convierte el
   argumento más fuerte en lo primero que se ve.
 · Fruta del día tocable (§4-a2): un toque de antojo aterriza en el producto.
 · Chips pegajosos (§4-c2): navegar 39 productos sin perder el rumbo.
 · Respuesta táctil al agregar (§4-c3): confirmación sin leer.
 · CTA en pulpas (§4-d): la sección del producto estrella deja de ser un cul-de-sac.
SE PROHÍBEN: parallax, contadores animados de cifras que no existen, "confeti",
carruseles automáticos de banners, modales de bienvenida, cursores personalizados,
cualquier animación que no ayude a escoger o a pedir.
REGLA DURA: prefers-reduced-motion se respeta, y ya está implementado
(globals.css:445-452 y fruta-del-dia.tsx:25). Todo lo que agregues entra en esa
lista. Sin excepciones.

───────────────────────────────────────────────────────────────────────────
7. RESTRICCIONES TÉCNICAS REALES (verificadas en el repo, no supuestas)
───────────────────────────────────────────────────────────────────────────
· Stack exacto (package.json:17-33): Next.js 16.3.0 App Router, React 19.2.4,
  TypeScript estricto, Tailwind 4 (@tailwindcss/postcss), @supabase/supabase-js
  2.112.3. CERO dependencias nuevas: no animation libs, no icon packs, no
  carruseles, no headless-ui. Los glifos son caracteres (◉ ⌕ ✓ ✎ ‹ ›) y las frutas
  son SVG dibujado a mano (ilustracion.tsx, catalogo-datos.ts:9-11).
· CERO imágenes y cero red de terceros. No existe public/. No agregues .jpg/.png
  de stock ni de ningún tipo (ver §8).
· Componentes de servidor por defecto; "use client" SOLO donde hay estado — hoy:
  frescura, catalogo, tarjeta-producto, tienda, barra-pedido, revisar, seguimiento,
  fruta-del-dia, enlace-ancla. Hero, Pulpas y Pie son HTML servido y deben seguir
  siéndolo (app/catalogo/page.tsx:20-23).
· MODO VITRINA — la restricción que más gente ha roto. Con MODO_VITRINA=1 el
  servidor público sirve ÚNICAMENTE (lib/servidor/modo-vitrina.ts:42-87):
      GET  /catalogo
      GET  /api/catalogo          POST /api/pedidos          GET /api/pedidos/<id>
      GET  /_next/static/*, /_next/image, y archivos de raíz CON EXTENSIÓN
  Todo lo demás: 404 limpio, sin cuerpo (proxy.ts). Consecuencias prácticas:
    – No inventes endpoints nuevos: nacerían muertos en producción.
    – Cualquier ruta nueva que necesites (p. ej. la imagen de compartir) hay que
      agregarla a permitidoEnVitrina Y a lib/servidor/modo-vitrina.test.ts.
    – Recuerda que una ruta sin punto en el último tramo NO pasa como asset.
· El sistema del que se alimenta la vitrina: GET /api/catalogo devuelve
  { catalogo, pausados } y 503 si Supabase no está configurado
  (app/api/catalogo/route.ts:37-51). POST /api/pedidos tiene rate limit y responde
  429 con "Está mandando pedidos muy seguido..." (app/api/pedidos/route.ts:79-82).
  Los tres estados del cliente son nuevo/preparando/listo, más entregado y
  cancelado como finales (tienda-datos.ts:331-337).
· Pruebas: `npm test` corre `node --test "lib/**/*.test.ts"` (package.json:15) —
  o sea, NADA de components/ está cubierto. Toda lógica pura que escribas va a
  lib/ con su test; los componentes solo pintan.
· Dónde corre: producción local del negocio con `next start -p 3300`
  (iniciar-mercaplaza.bat) contra la Supabase viva; y en Hostinger, que despliega
  la rama main. Ojo: hoy main está 2 commits DETRÁS de master (verificado:
  `git rev-list --count main..master` = 2), así que el dominio sirve un build
  viejo. Entregar sin merge master→main = no entregar (memory/placita/state.json:378,
  vault/PEND-018.md:17).
· Comandos que deben quedar verdes: npm run lint · npm run typecheck · npm test ·
  npm run build.

───────────────────────────────────────────────────────────────────────────
8. PROHIBIDO EN ESTE PROYECTO
───────────────────────────────────────────────────────────────────────────
 1. Rehacer la portada desde cero, o en un HTML suelto, o en otra ruta.
 2. Volver al registro minimalista de manifiesto: ya fue rechazado por el dueño
    sobre esta misma página, con esas palabras.
 3. Azules eléctricos, morados tecnológicos, neones y gradientes de degradado
    "tech" (globals.css:257-259, README.md:43-45). Las únicas rampas permitidas son
    las rayas planas del toldo.
 4. Fotos de stock. De cualquier tipo. No hay ni un asset en el repo y así se queda:
    la ilustración propia es la identidad.
 5. Inventar precios, o mostrar un precio de ejemplo (tienda-datos.ts:41).
 6. Publicar horario, dirección, ciudad, barrio, plaza, teléfono, NIT o nombre
    completo del dueño que no venga del dueño. El horario inventado que hay hoy
    (pie.tsx:11-14) se BORRA en esta entrega.
 7. Cifras sociales de cualquier tipo: años, clientes, familias, kilos, pedidos,
    testimonios, reseñas, estrellas, "los mejores de".
 8. Prometer lo que el sistema no hace: NO hay domicilios, NO hay pago en línea, NO
    hay pasarela, NO hay factura electrónica operativa (es un stub con insignia "En
    preparación", app/(app)/factura-electronica/page.tsx:26). El trato real y único
    es: pida, nosotros alistamos, usted recoge y paga en la caja.
 9. Romper el modo vitrina o ampliar la superficie pública sin test.
10. Agregar dependencias, fuentes externas o llamadas a CDN.
11. Tocar el interior de la app (app/(app)/*): ahí manda el manifiesto y no es
    parte de este trabajo.
12. Usar "La Placita" y "Mercaplaza Nariñense Familiar" como si fueran lo mismo sin
    que el dueño decida (§9, hueco 6). Hoy conviven en la misma página: la metadata
    dice Mercaplaza (app/catalogo/page.tsx:35) y el rótulo y el pie dicen La Placita
    (hero.tsx:49, pie.tsx:32,67).

───────────────────────────────────────────────────────────────────────────
9. HUECOS DEL DUEÑO — lo primero que hay que leer y responder
───────────────────────────────────────────────────────────────────────────
Nada de esto se rellena con algo verosímil. Cada hueco queda como anclaje vacío con
TODO explícito hasta que llegue el dato.

 1. TELÉFONO / WHATSAPP DEL NEGOCIO. Hoy es null en la base (bootstrap.sql:34-35,
    55-56) y no aparece en ninguna parte del repo (verificado: cero coincidencias de
    "whatsapp" o "wa.me" en todo el código). SE NECESITA porque sin catálogo
    publicado el cliente no tiene ninguna forma de comprar (§4-c1), y porque esta
    gente compra por WhatsApp. Es el hueco más caro de todos.
 2. DIRECCIÓN EXACTA DEL PUESTO + referencia de cómo llegar (¿qué plaza, qué
    pasillo, qué número de puesto?). Hoy null y marcada como placeholder
    (bootstrap.sql:54-56). SE NECESITA porque toda la portada promete "recoja en el
    puesto" y en ninguna parte dice dónde queda el puesto.
 3. HORARIO REAL de atención, incluyendo domingos y festivos. SE NECESITA para
    reemplazar el inventado de pie.tsx:11-14, que se borra en esta entrega.
 4. CIUDAD Y PLAZA confirmadas. "Nariñense" es marca, no ubicación; el único
    "Pasto" del repo es un ejemplo comentado (bootstrap.sql:182). SE NECESITA para
    el texto, para el mapa y para el SEO local.
 5. NOMBRE DEFINITIVO DEL LOCAL: hoy "Mercaplaza — Principal" declarado placeholder,
    con "Mercaplaza Centro" sugerido en un comentario (bootstrap.sql:52-54,182).
 6. ¿QUÉ NOMBRE MANDA EN LA PORTADA: "La Placita" o "Mercaplaza Nariñense
    Familiar"? Hoy salen los dos en la misma pantalla. SE NECESITA para no
    presentar dos marcas al mismo cliente.
 7. DOMINIO: el sitio vive en dropshoping.com.co, que no tiene relación con
    Mercaplaza (lib/servidor/modo-vitrina.ts:5-6; state.json:378). ¿Se compra un
    dominio propio o se asume este? Afecta lo que se puede imprimir en un volante.
 8. NIT, solo si quiere que aparezca en pie/recibo (bootstrap.sql:34).
 9. PUBLICAR EL CATÁLOGO CON PRECIOS desde la caja. Sin eso la vitrina no puede
    vender, por diseño y con razón (tienda.tsx:141-154). Es acción del dueño, no de
    diseño, y es la condición para que esta mejora sirva de algo.
10. CONFIGURAR EN HOSTINGER las 4 variables de Supabase + CLAVE_CAJA +
    MODO_VITRINA=1, y hacer merge master→main (vault/PEND-018.md:17; main está 2
    commits atrás). Sin esto, GET /api/catalogo responde 503 en el dominio y lo que
    mejores no llega al público.
11. OPCIONAL — ¿hay canastas o combos armados (p. ej. "mercado de la semana") con
    precio? No existe ninguno en el repo. Si los quiere, los dicta él con productos
    y precios; no se inventan.
12. OPCIONAL — ¿quiere una foto real de su puesto para el hero o para la tarjeta de
    WhatsApp? Si no, se sigue con ilustración propia, que es mejor que cualquier
    foto de banco de imágenes.

───────────────────────────────────────────────────────────────────────────
10. CRITERIOS DE ACEPTACIÓN (verificables, no opinables)
───────────────────────────────────────────────────────────────────────────
Código y contratos
 1. `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` terminan sin
    error. Se pega la salida.
 2. `git diff package.json` no muestra dependencias nuevas, y `ls public` sigue sin
    existir (cero archivos de imagen agregados).
 3. La lógica de frescura vive en lib/ y tiene test propio; `npm test` reporta más
    pruebas que antes (hoy: 552 unitarias + 7 de integración, KN-020).
 4. Si se tocó la superficie pública: lib/servidor/modo-vitrina.test.ts actualizado
    y verde.
Datos inventados fuera
 5. `grep -rn "7:00 a. m." components/` no devuelve NADA.
 6. `grep -rni "años de experiencia\|clientes satisfechos\|familias\|testimonio"
    components/landing/` no devuelve nada.
 7. Ninguna cadena de precio embebida en components/landing/ fuera de las que
    formatean lo que llega de /api/catalogo.
Comportamiento, probado en dos modos
 8. `npm run build` y luego `next start -p 3302` (modo completo) y
    `MODO_VITRINA=1 next start -p 3303` (modo vitrina). En 3303: /catalogo responde
    200; /login, /ventas y GET /api/pedidos responden 404 sin cuerpo; POST
    /api/pedidos y GET /api/catalogo funcionan. Se pegan los códigos de respuesta.
 9. ESCENARIO SIN CATÁLOGO (el de la producción de hoy): con Supabase sin
    configurar, /catalogo carga, se ven los 39 productos, la búsqueda y los chips
    funcionan, NO aparece ningún precio, y el cliente TIENE un camino de acción
    visible (armar su lista) más el anclaje de contacto —vacío y marcado con TODO
    si el hueco 1 sigue abierto—. Captura como prueba.
10. ESCENARIO CON CATÁLOGO PUBLICADO: se agrega producto con un toque, el
    escalonador sube y baja de 500 en 500, "Revisar pedido" abre la hoja, un envío
    con nombre y teléfono válidos devuelve número de pedido, y la cinta de
    seguimiento aparece abajo y cambia de estado en ≤15 s cuando la caja lo mueve.
11. Con nombre vacío o teléfono de 6 dígitos aparecen exactamente los textos de
    tienda-datos.ts:304-312, y el botón no manda el pedido dos veces si se toca
    rápido (tienda.tsx:259-269).
Visual — la verdad de terreno es Edge headless a PNG, NO el navegador embebido
12. Capturas PNG con Edge headless (verifica la ruta del binario en la máquina):
      msedge.exe --headless=new --disable-gpu --window-size=390,844
        --screenshot=cap-movil-1.png http://localhost:3302/catalogo
    en 390×844 (celular) y 1440×900 (escritorio), de: primera pantalla, mostrador
    con chips, tarjeta ya agregada al carrito, hoja de revisar y pantalla de
    pedido enviado. Se entregan los PNG.
13. En la captura de 390×844 de la PRIMERA pantalla se lee: el nombre del negocio,
    el titular, el CTA principal y la línea viva de frescura. Si la frescura no
    entra en esa captura, el criterio a1 no está cumplido.
14. Ninguna captura muestra azul eléctrico, morado tecnológico, neón ni gradiente
    de degradado; los únicos colores fuera de la base cálida son los acentos de
    fruta de §5.
15. Con movimiento reducido activo, ninguna captura de dos tomas seguidas difiere:
    la fruta no flota, el pregón no corre, la fruta del día no rota.
Accesibilidad y peso
16. Recorrido completo con teclado: buscar → chips → tarjetas → escalonador →
    revisar → enviar, con el foco SIEMPRE visible (globals.css:434-439).
17. La barra fija del carrito no tapa el último renglón del mostrador
    (tienda.tsx:321-322).
═══════════════════════════════════════════════════════════════════════════
