# PROMPT — Mejora quirúrgica de la landing de Super Arroz del Norte
# Proyecto: C:\Users\Kalel\arroces   |   Ruta: app/page.tsx   |   Fecha del brief: 2026-08-16

## AVISO PREVIO, LÉELO ANTES DE TOCAR NADA

La landing YA EXISTE, YA ESTÁ TERMINADA Y ES CORRECTA. No la vas a rehacer.
`app/page.tsx` (289 líneas) tiene hoy: cabecera, hero, la carta completa con los 9 platos
y sus 42 precios leídos del dominio, "Cómo funciona" en 3 pasos, ubicación + horario +
teléfonos, y footer. Los datos son reales y están bien citados. El código respeta una regla
de oro del repo que TÚ TAMBIÉN vas a respetar: "Los precios de la carta se LEEN de
lib/dominio/carta.ts, nunca se transcriben a mano aquí" (app/page.tsx:9-11).

Tu trabajo es una MEJORA QUIRÚRGICA sobre esa base. Todo lo que no esté nombrado
explícitamente en el apartado 4 se queda EXACTAMENTE como está.

Y la verdad más importante de este brief, dicha con todas las letras:
**el mayor problema de esta landing hoy no es de diseño, es de datos que solo tiene el
dueño.** No hay una sola foto de comida en todo el repo (verificado: no existe carpeta
`public/`, y `rg "next/image|<img"` sobre app/ y components/ da CERO resultados), y el
propio plan del negocio dice "En comida, la foto es la mitad de la venta"
(plan-arroces.html:265). Tampoco hay dirección exacta para que alguien llegue a recoger.
Si haces los cambios visuales de este prompt y el dueño nunca entrega las fotos ni la
dirección, habrás ganado poco. Por eso el apartado 9 va ordenado por impacto y es lo
primero que debe leer el dueño. Haz los cambios igual — están diseñados para funcionar
HOY sin fotos y para recibirlas mañana sin rediseñar nada.

---

## 1. EL NEGOCIO (todo con origen; nada de esto es invención)

- **Marca real: "Super Arroz del Norte".** No es placeholder. Evidencia convergente:
  `package.json:2` (`"name": "super-arroz-del-norte"`), `app/layout.tsx:5` (título del sitio),
  `components/store.tsx:106` (serie de pedidos con prefijo "SAN"),
  `lib/dominio/carta.ts:21-22` (la carta se declara copiada de la carta IMPRESA del negocio).
  RESERVA HONESTA: ningún documento del repo acredita razón social ni NIT — `plan-arroces.html`
  nunca nombra al negocio. Nombre real con altísima probabilidad, sin papel que lo pruebe.
  No inventes razón social, NIT ni "desde 19XX".
- **Qué vende:** arroces grandes para compartir, servidos por porciones, de 2 hasta 8/10
  personas (`app/page.tsx:97-99`; `lib/dominio/carta.ts:23-138`). Nueve platos:
  Arroz Chino, Ranchero, Paisa, Especial, 3 Delicias, con Pollo y Camarón, Siete Carnes,
  Arroz con Todo, y Costilla BBQ por caja. 42 precios exactos, congelados, en
  `lib/dominio/carta.ts:23-138`. Rango real: desde $17.000 (2 porciones) hasta $60.000 (8/10).
  Costilla BBQ: caja 400 g $25.000, caja 800 g $40.000 (`lib/dominio/carta.ts:128-137`).
- **Dónde:** Barrio Yambitará, Popayán (`app/page.tsx:22`; `components/store.tsx:115-120`).
  Una sola sucursal hoy.
- **Horario:** "Todos los días, 10:00 a.m. – 8:00 p.m." (`app/page.tsx:23`).
- **Contacto:** WhatsApp 315 4500415 → `wa.me/573154500415` (`app/page.tsx:17`;
  `app/pedir/formato.ts:19`). Fijo 322 3209117 (`app/page.tsx:20-21`).
- **Dos canales de entrega reales:** "Para recoger — Pasas por el local de Yambitará" y
  "Domicilio — Te lo llevamos hasta la puerta" (`app/pedir/contacto.tsx:26-39`).
- **Cómo llega el pedido al negocio:** `/pedir` arma el pedido y lo saca como mensaje de
  WhatsApp ya redactado (`app/pedir/formato.ts:36-64`). Eso SÍ funciona a distancia.
- **Lo que NO funciona a distancia (restricción dura CON-001):** no hay backend; el estado
  vive en localStorage por navegador (`components/store.tsx:96`), así que el pedido que el
  cliente arma en su celular NO aparece en `/panel` de la cocina — al negocio le llega el
  texto de WhatsApp, y ese texto es la fuente de verdad (`memory/arroces/brief.md:34`).
  Consecuencia que debes tener presente: el consecutivo "SAN-000001" se genera en el
  navegador del cliente (`components/store.tsx:106,139`), así que dos clientes distintos
  pueden generar el mismo número. **Por eso la landing NO puede prometer seguimiento del
  pedido, estado en tiempo real, ni presumir del número de pedido como si fuera un folio
  único del negocio.**
- **No está desplegado:** no hay hosting ni dominio (`memory/arroces/vault/PEND-004.md`).
  No cites ninguna URL pública ni la pongas en metadatos.

## 2. QUIÉN MIRA Y QUÉ DEBE HACER

**Quién:** el comensal de Popayán, en el celular, casi siempre con hambre y casi siempre
decidiendo para un grupo: almuerzo de familia, reunión de oficina, domingo con visita.
Compra por WhatsApp, no por formulario. Está comparando entre dos o tres opciones y lo que
lo decide es (a) qué tan rico se ve, (b) cuánto le cuesta para los que son, (c) qué tan
fácil es pedir. No está buscando una experiencia de marca: está buscando almuerzo.

**Qué debe sentir:** hambre y alivio. "Esto alcanza para los seis que somos, cuesta
$39.000, y pedirlo son dos toques." La landing actual es correcta pero fría: es 100%
tipográfica, en pesos ligeros y grises, sin una sola imagen ni un solo acento de color
(`app/globals.css:4-15` + `app/page.tsx` completo). Se lee como el interior de una
herramienta, no como un restaurante. Ese registro ya fue rechazado por el dueño en otro
proyecto por "muy minimalista" para una portada de venta. Aquí se corrige, sin destruir lo
que ya funciona.

**UNA sola acción principal: ARMAR EL PEDIDO EN `/pedir`.**
Hoy compiten dos CTAs en el hero como iguales: "Pedir a domicilio" → /pedir
(`app/page.tsx:102-112`) y "Escribir por WhatsApp" → wa.me (`app/page.tsx:113-121`).
Eso es un empate y un empate no vende. Decisión: gana `/pedir`, porque su salida es un
mensaje de WhatsApp estructurado, con líneas, porciones y total ya calculado por el dominio
(`app/pedir/formato.ts:36-59`) — al negocio le llega mejor información que un "hola,
cuánto vale el arroz". WhatsApp directo BAJA a rol de utilidad (cabecera, barra fija y
ficha de contacto), visualmente subordinado, con texto de duda, no de compra
("¿Preguntas? Escríbenos").

**Corrige además dos fallos concretos de conversión, ambos verificados:**
1. El CTA del hero dice "Pedir a domicilio" (`app/page.tsx:106`), pero `/pedir` sirve
   igual para recoger en el local (`app/pedir/contacto.tsx:26-39`). Ese texto le está
   diciendo a la mitad de los clientes que la página no es para ellos.
   Cámbialo por un texto que cubra ambos canales: **"Armar mi pedido"**.
2. El teléfono de la cabecera lleva la clase `hidden ... sm:flex` (`app/page.tsx:77`):
   **en móvil, la cabecera no ofrece NINGUNA acción**, justo en el dispositivo donde está
   el 100% de esta audiencia. Se arregla en el apartado 4.

## 3. EVIDENCIA REAL — lo único que hoy se puede probar

Esto es todo lo que tienes para convencer. Es poco, pero es verdad, y basta:

- **La carta completa con los 42 precios a la vista.** Un restaurante que publica todos sus
  precios, por porción, sin "consultar valor", genera confianza inmediata. Ya está hecho
  (`app/page.tsx:150-188`). Es tu mejor activo: no lo escondas ni lo resumas.
- **La escala de porciones.** De 2 a 8/10 personas en el mismo plato. Ningún competidor de
  barrio lo comunica así de claro. Es el diferenciador y hoy está mencionado de pasada en
  una línea de texto (`app/page.tsx:97-99`); pasa a ser interacción (apartado 6).
- **La composición de cada arroz, ingrediente por ingrediente**
  (`lib/dominio/carta.ts:27,41,55,69,81,93,105,118,131`). "Tocineta, costilla, chorizo,
  pollo, maíz, albóndiga, cerveroni, camarón, maduro y verduras" vende sola: es apetito
  escrito. Hoy está en gris muted a 15px; merece más peso visual.
- **Dos canales y tres formas de pedir** (WhatsApp, teléfono fijo, en línea).
- **Se cocina al momento** ("Tu arroz se hace al momento, recién pedido",
  `app/page.tsx:57`).

**Lo que NO tienes y por tanto NO existe:** reseñas, calificaciones, testimonios, número de
clientes, kilos vendidos, años de experiencia, premios, fotos, logo, redes sociales, perfil
de Google Business. CERO. Verificado en todo el repo. No inventes ni uno solo, ni siquiera
en forma vaga ("los payaneses ya lo saben", "el favorito del barrio"). No añadas sección de
testimonios vacía ni con textos de ejemplo.

## 4. ESTRUCTURA SECCIÓN POR SECCIÓN

Formato: [SE QUEDA] no lo toques · [CAMBIA] modifícalo así · [NUEVO] añádelo.

**0. Cabecera — `app/page.tsx:72-83` — [CAMBIA]**
Propósito: que en cualquier momento haya una salida a pedir.
Hoy muestra el nombre en texto y el teléfono fijo oculto en móvil (`:77`).
Cambia a: nombre a la izquierda (ver apartado 5 sobre el logotipo tipográfico) y a la
derecha un botón compacto **"Pedir"** → `/pedir` visible SIEMPRE, también en móvil, con
área táctil ≥44px. El teléfono fijo se conserva pero solo desde `sm:`. Hazla `sticky top-0`
con fondo `--bg` y borde inferior; sin sombra dramática.

**1. Hero — `app/page.tsx:87-147` — [CAMBIA, conservando el copy]**
Propósito: hambre en 3 segundos + una sola acción.
- SE CONSERVA TAL CUAL el titular **"Arroz para la mesa larga."** (`:94`) y el párrafo
  "Arroces grandes para compartir, servidos por porciones — desde 2 hasta reuniones de 8 o
  10. Se recogen en el local de Yambitará o llegan hasta la puerta." (`:96-100`). Es buen
  copy, es verdad y no se toca.
- El titular sube de `font-light` a peso alto y tamaño mayor en móvil (ver apartado 5).
- El eyebrow "Restaurante de arroces · Popayán" (`:90-92`) se conserva y se le añade a la
  derecha el **chip de estado "Abierto ahora / Cerrado"** (apartado 6).
- CTA: uno solo, grande, pleno, sobre `--brasa`: **"Armar mi pedido"** → `/pedir`.
  Debajo, en tamaño menor y sin fondo: "¿Preguntas? Escríbenos por WhatsApp" → `wa.me`.
- La tarjeta lateral del plato insignia (`:125-145`, Arroz con Todo, elegido en `:68`)
  SE CONSERVA en su lógica, pero pasa a ser **el primer HUECO DE FOTO** (ver más abajo) con
  el nombre, la descripción completa y "Desde $24.000" calculado con
  `Math.min(...producto.variantes.map(v => v.precio))` — NO transcribas 24000 a mano.
  Hoy usa `variantes.slice(0, 3)` (`:130`), lo cual es correcto pero seco.

**2. "¿Cuántos son?" — [NUEVO] — la pieza que hace que esta landing venda**
Propósito: convertir la duda real del cliente ("¿alcanza para los que somos y cuánto me
sale?") en una respuesta de un toque. Va inmediatamente después del hero, antes de la carta.
- Fila de botones con los tamaños REALES que existen en el dominio. Derívalos leyendo
  `CARTA` y agrupando por `variante.etiqueta`; NO los escribas a mano. Hoy dan:
  "2 porciones", "3 porciones", "4 porciones", "6 porciones", "7/8 porciones",
  "8/10 porciones" (`lib/dominio/carta.ts:29-136`), más "Caja 400 g" / "Caja 800 g" que
  pertenecen solo a Costilla BBQ (`:133-136`) y NO deben aparecer como tamaño de grupo.
- Al elegir un tamaño, la sección de la carta (abajo) filtra a los platos que lo ofrecen y
  muestra ese precio en grande. Comportamiento verificable con los datos actuales:
  "2 porciones" deja 3 platos (Chino, Ranchero, Paisa); "8/10 porciones" deja 5 (Chino,
  Ranchero, Paisa, Siete Carnes, con Todo); "3 porciones" deja los 8 arroces.
- Estado por defecto: ninguno seleccionado = se ven los 9 platos con todos sus precios
  (comportamiento actual intacto). Debe haber un botón "Ver todo" para volver.
- Costilla BBQ NUNCA se filtra fuera: cuando hay un tamaño seleccionado, se muestra aparte
  bajo el rótulo **"Para acompañar"** con sus dos cajas y sus precios.
- Sin JavaScript debe verse la carta completa (el filtro es una mejora, no un requisito).

**3. La carta — `app/page.tsx:150-188` — [CAMBIA en presentación, NO en datos]**
Propósito: apetito + prueba de precio.
- Sigue leyendo `CARTA` de `lib/dominio/carta.ts`. Los 42 precios siguen siendo visibles.
  Cero precios escritos a mano. Cero platos añadidos, quitados o reordenados: el orden es el
  de la carta impresa (`lib/dominio/carta.ts:21-22`).
- Cada plato pasa de fila tipográfica a **tarjeta con hueco de foto** (ver abajo), nombre en
  peso alto, ingredientes en tamaño de lectura cómoda (no gris tenue), y sus porciones como
  fila de chips compactos `etiqueta · precio` en vez de la lista de renglones punteados —
  en móvil, seis renglones por plato × 9 platos es un muro de números.
- Añade "Desde $X" (mínimo calculado) como ancla de precio en cada tarjeta.
- Cada tarjeta lleva su propio botón "Pedir este" → `/pedir` (mismo destino; no inventes
  deep-linking a un plato: `/pedir` no acepta parámetros hoy, verificado en
  `app/pedir/page.tsx:28-49`).

**HUECOS DE FOTO — cómo se hacen (regla dura):**
Hoy no hay ni una imagen y puede que tarden en llegar. Construye cada hueco así:
- Contenedor con `aspect-[4/5]` en móvil y `aspect-[3/2]` en escritorio, fondo
  `--card`, borde `--border`, y dentro: el número del plato (01…09) en gigante y muy bajo
  contraste + los ingredientes. Debe parecer una decisión de diseño, no un error de carga.
- Prepara la ruta final: crea `public/platos/` y documenta en un comentario los nombres
  exactos que se esperan (`arroz-chino.jpg`, `arroz-ranchero.jpg`, `arroz-paisa.jpg`,
  `arroz-especial.jpg`, `arroz-3-delicias.jpg`, `arroz-pollo-camaron.jpg`,
  `arroz-siete-carnes.jpg`, `arroz-con-todo.jpg`, `costilla-bbq.jpg` — los `id` de
  `lib/dominio/carta.ts`). El componente debe renderizar `next/image` si el archivo existe
  y el marcador si no, sin romper el build cuando la carpeta está vacía.
- PROHIBIDO rellenar el hueco con foto de stock, de banco de imágenes, generada por IA, o
  de otro restaurante. Una foto de un arroz que no es el suyo es una mentira sobre el
  producto y ese es el error que este proyecto no se puede permitir.

**4. Cómo funciona — `app/page.tsx:191-209` — [SE QUEDA casi intacto]**
Los tres pasos "Pides / Preparamos / Recoges o te lo llevamos" (`:35-65`) son correctos,
están bien escritos y tutean de forma consistente (hay un comentario en `:31-34` explicando
por qué; respétalo: **todo texto nuevo va en tuteo, nunca voseo**). Único cambio permitido:
adaptar tipografía y acentos al registro nuevo. NO añadas un cuarto paso con tiempos de
entrega — no existe ningún dato de minutos en el repo (hueco #4).

**5. Ubicación y horario — `app/page.tsx:212-265` — [CAMBIA poco]**
La ficha con dirección, horario y teléfonos se conserva íntegra. Cambios:
- Añade "Cómo llegar" solo si el dueño entrega la dirección exacta (hueco #2). Mientras
  tanto NO pongas mapa embebido ni enlace a Google Maps de "Yambitará" a secas: mandar a un
  cliente a un barrio entero es peor que no mandarlo.
- El chip "Abierto ahora / Cerrado" se repite aquí junto al horario.
- Añade UNA línea honesta sobre el domicilio, copiada del texto que ya usa la app:
  "El costo del domicilio se confirma por WhatsApp según la zona"
  (`app/pedir/contacto.tsx:84`). No inventes tarifas ni "domicilio gratis".

**6. Footer — `app/page.tsx:268-285` — [SE QUEDA]**
Correcto. Solo ajusta tipografía. No añadas iconos de redes sociales: no existe ninguna
cuenta verificada (hueco #8).

**7. Barra fija móvil — [NUEVO]**
Aparece al pasar el hero, solo `<sm`: botón pleno "Armar mi pedido" (→ `/pedir`) ocupando
la mayor parte, y a la derecha un botón cuadrado de WhatsApp. Alto ≥56px, respeta
`env(safe-area-inset-bottom)`, y no tapa el footer.

**8. Metadatos — `app/layout.tsx:4-8` — [CAMBIA]**
El título y la descripción actuales son buenos y se conservan. Falta lo que decide si un
enlace pegado en un chat de WhatsApp se ve como un restaurante o como un link pelado:
añade `openGraph` (title, description, locale `es_CO`, type `website`) y `twitter: summary`.
NO pongas `metadataBase` con un dominio inventado: el proyecto no está desplegado
(`memory/arroces/vault/PEND-004.md`); déjalo comentado con una nota de que lo llena el
dueño (hueco #6). La imagen OG queda pendiente de las fotos (hueco #1); si quieres, genera
una tipográfica con `next/og` (viene incluido en Next, no es dependencia nueva).
No hay favicon: crea `app/icon.svg` con el logotipo tipográfico del apartado 5 (letras y
color, sin dibujar un plato que no has visto).

**SECCIONES QUE NO VAS A CREAR:** testimonios, "sobre nosotros" con historia, contador de
años/clientes, logos de "confían en nosotros", newsletter, blog, galería de fotos genérica,
formulario de contacto (el canal es WhatsApp). Ninguna tiene datos que la sostenga.

## 5. REGISTRO VISUAL Y PALETA

**Decisión de registro y por qué:** venta, no manifiesto. Quien mira esta pantalla es un
cliente afuera, no un trabajador adentro; el interior de la app (`/panel`, `/caja`,
`/pedir`) conserva el registro sobrio del sistema de diseño y NO se toca en este trabajo.
En la portada: producto protagonista, más peso, más contraste, más color, más apetito.

**Paleta: cero hexadecimales inventados.** Todos los colores salen de `app/globals.css:4-15`,
que ya existe. Base cálida intacta:
`--bg #F8F6F2` · `--card #FCFBF8` · `--ink #111111` · `--muted #666666` · `--border #E7E4DE`
· `--hover #F2EFE9` · bloque oscuro `--sidebar #171717`.
Los acentos de venta se declaran como tokens NUEVOS de landing en `globals.css`, reusando
hexes que ya están en el archivo (para no ensuciar la semántica de estado de la app):
```css
/* Acentos de la portada pública — mismos hexes que los estados de la app,
   renombrados porque aquí son marca, no semáforo. */
--brasa:   #B94A48;  /* = --error : CTA principal, precio destacado, brasa/BBQ */
--achiote: #B98A3C;  /* = --warn  : subrayados, chips de porción, calidez */
--hoja:    #4D7C59;  /* = --ok    : solo el chip "Abierto ahora" */
```
Uso: `--brasa` para el CTA principal y los precios "Desde $X"; `--achiote` para chips de
porción, número de plato y detalles; `--hoja` solo para el estado abierto. Un bloque en
`--sidebar` como máximo (candidato: la sección "¿Cuántos son?") para dar ritmo.
Nunca degradados entre estos colores; color plano.

**Tipografía:** hoy NO hay tipografía elegida — `app/layout.tsx` no usa `next/font` y se
cae al stack del sistema. Para el registro de venta importa. Usa `next/font/google` (viene
con Next; no instalas nada): **Fraunces** para titulares y nombres de plato (peso 700-900,
tamaño grande, `tracking-tight`) e **Inter** para cuerpo e interfaz (400/500). Ambas se
autoalojan en build; ninguna se carga por CDN en runtime.
CONDICIÓN HONESTA: si la máquina está sin red, `next build` con `next/font/google` falla.
Si eso pasa, NO metas un `<link>` a Google Fonts: quédate con el stack del sistema, sube
los pesos (`font-semibold`/`font-bold` en titulares) y déjalo anotado.
El logotipo tipográfico de la cabecera es "Super Arroz del Norte" en Fraunces, con "Norte"
en `--brasa`. No dibujes un isotipo: no hay marca gráfica (hueco #7).

**Densidad:** titular del hero `text-5xl` en móvil / `text-7xl` en escritorio con peso alto
(hoy es `font-light`, `app/page.tsx:93`). Espaciado vertical entre secciones: baja de
`py-20` a `py-14` en móvil. Ancho `max-w-5xl` se conserva. Bordes redondeados como ya
existen (`rounded-2xl`).

## 6. INTERACCIÓN — cada una justificada o se cae

1. **Selector "¿Cuántos son?"** (apartado 4.2). Es la única interacción imprescindible:
   responde la pregunta que de verdad frena la compra de un arroz para compartir y sale
   100% de datos reales. Transición de 180ms, `prefers-reduced-motion` respetado.
2. **Chip "Abierto ahora / Cerrado"**. Calculado en cliente contra el horario real
   10:00–20:00 todos los días (`app/page.tsx:23`), zona `America/Bogota`. Renderízalo solo
   tras montar para evitar desajuste de hidratación; antes de montar muestra solo el
   horario. Si está cerrado, el CTA no se desactiva: cambia el subtexto a "Abrimos a las
   10:00 a.m. — deja tu pedido listo". Vende urgencia sin mentir.
3. **Tarjetas de plato con elevación al hover / feedback al toque.** Micro, 180ms. Justifica
   que la tarjeta es tocable.
4. **Barra fija móvil que entra al salir el hero.** El 100% de la audiencia decide en el
   celular a media página; sin esto, pedir exige volver arriba.
5. **Chips de porción con estado activo.** Feedback inmediato del filtro.

**Interacciones prohibidas por decorativas:** carruseles automáticos, parallax, contadores
que suben, partículas, cursores personalizados, animaciones de entrada por scroll en cada
elemento, splash screens. Ninguna vende un arroz.

## 7. RESTRICCIONES TÉCNICAS REALES (verificadas en el repo)

- **Stack exacto** (`package.json:12-27`): Next.js **16.2.7** App Router, React **19.2.4**,
  TypeScript 5, Tailwind CSS 4 vía `@tailwindcss/postcss`, `lucide-react ^1.17.0`.
- **NO instales NADA.** Sin framer-motion, GSAP, swiper, embla, shadcn, ni ninguna otra.
  Todo el movimiento con CSS/Tailwind. Iconos: solo `lucide-react` (ya se usan ArrowRight,
  Bike, ChefHat, Clock, MapPin, MessageCircle, Phone en `app/page.tsx:14`).
- **NO es un HTML autocontenido.** Es una app Next existente. Editas archivos, no creas una
  página suelta.
- **Archivos que puedes tocar:** `app/page.tsx`, `app/globals.css`, `app/layout.tsx`,
  nuevos componentes bajo `app/` (p. ej. `app/inicio/carta-publica.tsx`,
  `app/inicio/estado-apertura.tsx`, `app/inicio/barra-movil.tsx`), `app/icon.svg`,
  y crear `public/platos/`.
- **Archivos PROHIBIDOS:** todo `lib/dominio/*` (tiene 38/38 self-tests que deben seguir
  pasando, `memory/arroces/brief.md:8-12`), `lib/types.ts`, `components/store.tsx`, y las
  rutas `/pedir`, `/panel`, `/caja`. En esta pasada `/pedir` NO se rediseña; la coherencia
  se mantiene porque la paleta base no cambia.
- **`app/page.tsx` sigue siendo Server Component** (razonado en `app/page.tsx:5-7`). Lo
  interactivo se extrae a componentes `"use client"` hijos, que reciben `CARTA` importada
  del dominio. No pongas `"use client"` en `page.tsx`.
- **Sin backend, sin base de datos, sin variables de entorno, sin llamadas de red en
  runtime.** No añadas analítica, ni píxel, ni chat de terceros.
- **Móvil primero.** Referencia de diseño: 390×844. Escritorio es la adaptación.
- **Debe pasar:** `npm run typecheck`, `npm run lint` y `npm run build` sin errores ni
  warnings nuevos. El proyecto no está desplegado; no toques `next.config.ts` salvo que
  añadas imágenes remotas (no lo hagas: las fotos irán en `public/`).

## 8. PROHIBIDO EN ESTE PROYECTO

1. Rehacer la página desde cero o borrar secciones que hoy funcionan.
2. Transcribir un precio a mano en la UI. Todo precio sale de `lib/dominio/carta.ts`.
3. Añadir, quitar, renombrar o reordenar platos, porciones o precios.
4. Fotos de stock, de bancos de imágenes, generadas por IA, o de otro restaurante.
5. Cifras sociales inventadas: años de experiencia, número de clientes, "más de X familias",
   pedidos servidos, calificaciones, testimonios, premios. NO EXISTE NINGUNA en el repo.
6. Inventar tarifas de domicilio, tiempos de entrega en minutos, pedido mínimo, promociones,
   combos, descuentos, bebidas, entradas, postres o adiciones. Nada de eso existe en la
   carta del código.
7. Inventar dirección exacta, coordenadas, mapa de "Yambitará" a secas, razón social, NIT,
   año de fundación, nombre del dueño ni enlaces a redes sociales.
8. Prometer seguimiento del pedido, estado en tiempo real o confirmación automática:
   no hay backend (CON-001, `memory/arroces/brief.md:34`).
9. Enlazar `/panel` o `/caja` desde la página pública: están sin autenticación
   (`memory/arroces/vault/DEC-004.md`; PEND-005). La portada no menciona su existencia.
10. Azules eléctricos, morados, neones y degradados tecnológicos. Prohibición permanente del
    sistema de diseño; aquí además serían absurdos: es comida.
11. Modo oscuro global, jerga de programador visible ("localStorage", rutas escritas como
    texto — ver `app/page.tsx:38-40`), `alert()`, y voseo mezclado con tuteo
    (`app/page.tsx:31-34`).
12. Formularios que capturen datos personales en la portada: sin política de tratamiento de
    datos (Ley 1581 de 2012) no se recogen datos aquí (hueco #10).

## 9. HUECOS DEL DUEÑO — ordenados por impacto en ventas

**Los tres primeros valen más que cualquier rediseño. Léelos primero.**

1. **FOTOS REALES DE LOS 9 PLATOS.** (PEND-002, `memory/arroces/vault/PEND-002.md:15-17`).
   Qué se necesita: una foto por plato + una del arroz insignia para el hero, tomadas con
   celular, luz de día, plato servido completo, fondo limpio, en vertical (4:5). Nombres de
   archivo = el `id` del plato (lista en el apartado 4). Por qué: es una landing de comida
   sin comida a la vista; el propio plan del negocio lo dice —"En comida, la foto es la
   mitad de la venta" (`plan-arroces.html:265`). **Es el dato de mayor retorno del proyecto.**
2. **DIRECCIÓN EXACTA + ENLACE DE GOOGLE MAPS.** Hoy solo existe "Barrio Yambitará,
   Popayán" (`app/page.tsx:22`). Por qué: uno de los dos canales de venta es que el cliente
   vaya a recoger (`app/pedir/contacto.tsx:30`), y hoy nadie puede llegar. Se necesita
   calle, número, punto de referencia y el enlace del pin.
3. **DOMINIO Y DESPLIEGUE.** (PEND-004). Una landing sin URL vende cero. Se necesita: el
   dominio elegido (o autorización para usar un subdominio gratuito) para publicar y para
   completar los metadatos de vista previa en WhatsApp.
4. **COSTO DEL DOMICILIO POR ZONA.** (PEND-003, `memory/arroces/vault/PEND-003.md:15`).
   Hoy la app dice "se confirma por WhatsApp según la zona"
   (`app/pedir/contacto.tsx:84`). Por qué: el precio desconocido es la fricción número uno
   antes de escribir. Se necesita: lista de barrios/zonas y valor, o un valor único.
5. **TIEMPO DE PREPARACIÓN Y DE ENTREGA.** No hay ningún número de minutos en el repo. Por
   qué: quien pide para 8 personas necesita saber si llega antes de que lleguen los
   invitados. Se necesita: minutos típicos para recoger y para domicilio, y en hora pico.
6. **BEBIDAS, ADICIONES Y PRECIOS DE EXTRAS.** El plan lo pregunta explícitamente ("¿Qué se
   le puede agregar o quitar a cada arroz, y cuánto vale?", `plan-arroces.html:260`) y hoy
   no existen en `lib/dominio/carta.ts`. Por qué: sube el ticket sin esfuerzo. Se necesita:
   lista con precios; entrarían primero al dominio y de ahí solas a la landing.
7. **LOGOTIPO / IDENTIDAD.** No hay ningún archivo de marca; la cabecera usa texto plano
   (`app/page.tsx:74`). Por qué: favicon, vista previa al compartir y empaques. Se necesita:
   el logo en SVG o PNG con fondo transparente, o luz verde para dejar el logotipo
   tipográfico propuesto.
8. **PRUEBA SOCIAL REAL.** Hoy no hay ni una reseña. Se necesita: perfil de Google Business
   activo, o 3 a 5 testimonios reales con nombre y autorización, o cuentas de Instagram /
   Facebook si existen. **Hasta que lleguen, la landing no dirá NADA sobre reputación.**
9. **HORARIO FINO.** Solo existe "Todos los días, 10:00 a.m. – 8:00 p.m."
   (`app/page.tsx:23`). Se necesita: si algún día cierra, festivos, y última hora para pedir.
10. **DATOS FORMALES Y LEGALES.** Razón social, NIT y política de tratamiento de datos
    (Ley 1581 de 2012, exigida en `plan-arroces.html`). Por qué: pie de página serio y
    requisito antes de capturar cualquier dato personal.

## 10. CRITERIOS DE ACEPTACIÓN (verificables, no opinables)

**A. Integridad de los datos — se comprueba con comandos, no mirando:**
1. `npm run typecheck` y `npm run lint` → 0 errores. `npm run build` → build exitoso.
2. `rg -n "1[0-9]000|2[0-9]000|3[0-9]000|4[0-9]000|5[0-9]000|60000" app/` → CERO
   resultados. Ningún precio escrito a mano en la UI.
3. `rg -ni "unsplash|pexels|placeholder\.com|picsum|lorem ipsum|dall|midjourney" app/ public/`
   → CERO resultados.
4. `rg -ni "años de experiencia|clientes satisfechos|familias|testimonio|reseña|estrellas|⭐"
   app/` → CERO resultados.
5. `rg -n "import .*CARTA" app/` → la carta se importa del dominio en toda pantalla que
   muestre precios. `git diff --stat lib/ components/` → SIN CAMBIOS.
6. En la página renderizada aparecen los 9 nombres de plato exactos y, sin filtro activo,
   los 42 precios. Cuenta los nodos de precio: deben ser 42.

**B. Conducta — se prueba a mano en `npm run dev`:**
7. Con "2 porciones" seleccionado se ven exactamente 3 arroces (Chino, Ranchero, Paisa) más
   la Costilla BBQ bajo "Para acompañar". Con "8/10 porciones", exactamente 5 arroces.
   "Ver todo" restaura los 9.
8. El botón "Pedir" de la cabecera es visible y tocable a 390px de ancho.
9. La barra fija móvil aparece tras pasar el hero y no tapa el footer al final del scroll.
10. Con JavaScript desactivado, la carta completa con los 42 precios sigue visible y los
    enlaces a `/pedir` y a `wa.me` funcionan.
11. Todos los enlaces de WhatsApp apuntan a `573154500415` y los de teléfono a
    `+573154500415` / `+573223209117`. Cero números nuevos.
12. Un solo `<h1>` en la página. Áreas táctiles ≥44px. Contraste AA en texto sobre
    `--brasa` y sobre `--sidebar`.

**C. Verdad de terreno visual — Edge headless a PNG (NO el navegador embebido):**
13. Con `npm run dev` levantado, captura y REVISA los PNG:
```powershell
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
& $edge --headless=new --disable-gpu --hide-scrollbars --window-size=390,3600 `
  --screenshot="$env:TEMP\san-movil.png" http://localhost:3000/
& $edge --headless=new --disable-gpu --hide-scrollbars --window-size=1440,3600 `
  --screenshot="$env:TEMP\san-escritorio.png" http://localhost:3000/
```
14. En `san-movil.png` se debe cumplir, mirando el PNG: el titular y el CTA "Armar mi
    pedido" entran en los primeros 844px; el CTA es el elemento de mayor peso visual de esa
    franja; ningún hueco de foto parece un error de carga; ningún texto se desborda ni se
    corta; no hay una sola zona azul, morada ni de neón.
15. Los dos PNG se adjuntan como evidencia de la entrega. Sin PNG no hay entrega.

**D. Honestidad:**
16. Toda afirmación de hecho visible en la página se puede rastrear a
    `lib/dominio/carta.ts`, `app/page.tsx` (constantes de contacto) o `app/pedir/*`.
    Si aparece una frase que no se puede citar, se borra antes de entregar.
17. En el reporte final, lista qué huecos del apartado 9 siguen abiertos. No los tapes.
