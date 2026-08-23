# PROMPT — Landing de venta para `estanco-contable`
### (software de caja + contabilidad para estancos con varios locales · Colombia)

Vas a rehacer la portada pública de un producto que YA EXISTE y YA FUNCIONA. No es un
sitio nuevo desde cero: la landing vive dentro del repo Next en
`C:\Users\Kalel\estanco-contable\app\page.tsx` (97 líneas) + `components/landing/{factura,libro,notas}.tsx`.
Tu trabajo es convertir una portada bonita que NO VENDE en una portada que vende, sin
inventar un solo dato. Todo lo que afirmes tiene que poder rastrearse a un archivo del repo.

---

## 0. ANTES DE ESCRIBIR UNA LÍNEA: EL NOMBRE NO EXISTE

**Este producto NO TIENE MARCA COMERCIAL.** Lo que hay en el repo son descripciones genéricas:

- `package.json:2` → `"name": "software-contable-automatizado"`
- `README.md:1` → `# Software Contable Automatizado`
- `app/layout.tsx:6` → `title: "Software Contable Automatizado"`
- `app/manifest.ts:8` → `name: "Estanco — Software Contable"`
- La landing actual se firma "Software contable automatizado" (`app/page.tsx:19` y `:91`)

**"Estancos El Progreso" NO es la marca ni un cliente.** Es la empresa del seed de
demostración (`lib/demo-data.ts:14`) y literalmente el `placeholder` del formulario de
registro (`app/(auth)/registro/page.tsx:192`). Usarla como marca sería inventar un cliente.

Regla operativa: en TODA la landing usa el token literal `[MARCA]` y decláralo **en un solo
sitio** para que el dueño lo cambie en una línea:

    // components/landing/marca.ts
    /** HUECO #1 — el dueño decide el nombre comercial. Hasta entonces, este token
     *  se ve en pantalla a propósito: una landing con el nombre en blanco es honesta;
     *  una con un nombre inventado es una mentira que llega a producción. */
    export const MARCA = "[MARCA — HUECO #1]"

Y consúmelo en: cabecera de la landing, pie, `app/layout.tsx:6` (metadata title),
`app/manifest.ts:8-9`. Cuando el dueño escriba el nombre, la landing entera queda correcta
sin tocar nada más. NO inventes nombre, NO propongas tres opciones bonitas, NO uses
"Estanco" como si fuera marca.

---

## 1. EL NEGOCIO (con orígenes)

Software web de **punto de venta + inventario + contabilidad** para **estancos** (licor,
cigarrillos, cerveza, snacks) en Colombia, hecho para un dueño con **varios locales**:

- "estancos · Colombia" — `README.md:3`
- "lo normal es un dueño con 2-3 estancos" — `app/(auth)/registro/page.tsx:7`
- Multi-tenant: cualquiera registra su empresa + sucursales + cuenta de dueño desde la app
  (`lib/auth.ts:179-231`, `app/(auth)/registro/page.tsx:4-10`), con aislamiento por
  `empresa_id` y RLS en SQL (`supabase/migrations/000_schema.sql`)

Lo que hace HOY, verificado en disco:

| Función | Qué es exactamente | Origen |
|---|---|---|
| Ventas / caja | Búsqueda por código corto (`201⏎`) y lector de barras USB en el MISMO campo (≥8 dígitos busca por `codigoBarras`) | `README.md:126-137`, `app/(app)/ventas/page.tsx` |
| Inventario | Kardex puro: el stock nunca se guarda suelto, se deriva de `compra/venta/ajuste/traslado_*` | `README.md:18-20`, `lib/dominio/inventario.ts` |
| Contabilidad | Costo promedio ponderado móvil → ingresos, costo de ventas, ganancia y margen por día, rango y local | `README.md:21-24`, `lib/dominio/contabilidad.ts` |
| Facturas | Consecutivo por local (`CEN-000001`), precios congelados; anular retira los movimientos del kardex, editar emite deltas | `memory/estanco-contable/state.json:134`, `lib/dominio/facturacion.ts` |
| Caja / turno | Apertura y cierre con arqueo esperado vs contado; efectivo, transferencia, datáfono, mixto, vuelto, descuentos, comisión por medio de pago | `app/(app)/caja/page.tsx:1-20`, `lib/dominio/cierre.ts`, `lib/dominio/pagos.ts` |
| Compras | Sugerencia por producto × local: reponer / mantener / comprar menos / no comprar, con la razón y la cantidad | `README.md:25-28`, `lib/dominio/sugerencias.ts` |
| Reportes | Ventas por rango, top productos, margen por producto, historial de arqueos, desglose por medio de pago, export CSV | `lib/dominio/reportes.ts`, `lib/export-csv.ts` |
| Telegram | `/hoy` `/semana` `/top` `/stock` `/sugerencias` `/ayuda` | `lib/telegram.ts:189-200` |
| Seguridad de caja | Doble login: la PERSONA (usuario+contraseña) y el PUESTO (el PC queda atado a un local; **manda el PC**; PC sin vincular no factura) | `app/(auth)/login/page.tsx:3-18`, `lib/dispositivo.ts` |
| Instalable | PWA con `start_url: /ventas` + service worker | `app/manifest.ts:6-36`, `public/sw.js` |

Tamaño real: 43 archivos TS/TSX, 12.278 líneas en `app/ + lib/ + components/`; 10 módulos de
dominio en `lib/dominio/`, todos con `__selfTest`.

**Precio: NO EXISTE en ningún archivo del repo.** Solo aparece como trabajo futuro
("Precios por sucursal, prueba gratis" — `memory/estanco-contable/brief.md:71`). Ver HUECO #2.
**Dónde opera:** el software es para estancos en Colombia; la empresa que lo vende no tiene
ciudad, dirección ni teléfono en el repo. Ver HUECO #3.

---

## 2. QUIÉN MIRA Y QUÉ DEBE HACER

**Quién:** el dueño de 2-3 estancos en Colombia. Cuarenta y pico, factura a mano o con una
caja registradora tonta, lleva la plata en un cuaderno, revisa el celular a las 11 de la
noche después de cerrar la reja. No es un CTO. No compara features en una tabla: compara
"¿esto me dice cuánto gané de verdad o me va a dar más trabajo?".

**No confundir con el otro usuario:** dentro del negocio hay dos roles, dueño y cajero
(`lib/demo-data.ts:26-29`, `components/app-shell.tsx:80-87`). **La landing le habla SOLO al
dueño.** El cajero no compra nada.

**Qué debe sentir, en este orden:**
1. "Este man conoce mi negocio" (el aguardiente, la cajetilla, el arqueo, la reja).
2. "Esto ya existe y funciona" — no una promesa, un producto que puede tocar ahora mismo.
3. "No es un ERP, no me va a complicar la vida."
4. "Puedo preguntar sin compromiso."

**UNA sola acción principal: escribir por WhatsApp.** En Colombia, un dueño de estanco no
llena un formulario de leads: manda un mensaje. Todo el peso visual del CTA va ahí
(HUECO #3 para el número). Secundario, con mucho menos peso: "Probar la demo".

**El CTA actual está roto y hay que decirlo:** hoy el único CTA es "Entrar al sistema" →
`/dashboard` (`app/page.tsx:38-40` y `:84-86`), y `/dashboard` está detrás de un guard de
sesión que redirige a `/login` (`app/(app)/layout.tsx:24-31`). Un interesado que llega de
Google cae en un formulario de usuario y contraseña que no tiene: callejón sin salida.
"Entrar al sistema" es para clientes que YA compraron; llévalo al pie, discreto, como
enlace de texto.

---

## 3. EVIDENCIA REAL (lo único que se puede probar hoy)

**El producto es la única prueba que existe.** No hay testimonios, ni clientes citables, ni
cifras de tracción, ni logos, ni fotos: `public/` contiene únicamente `icon-192.png`,
`icon-512.png` y `sw.js`. La memoria del proyecto menciona "Cliente real: dueño de 3 estancos
en Bogotá" (`memory/estanco-contable/brief.md:4`) pero **no hay un solo dato de ese cliente en
el código** — no lo cites, no lo cuentes, no lo conviertas en un caso de éxito.

Lo que SÍ puedes usar como evidencia, porque se puede tocar:

- **La demo jugable** con el catálogo real del seed (10 productos con precio en COP y EAN,
  `lib/demo-data.ts:38-47`) y 3 locales (`lib/demo-data.ts:31-35`).
- **La cuenta hecha con el mismo código que factura**: la landing importa
  `lib/dominio/contabilidad.ts` e `lib/dominio/inventario.ts`. Ese es el argumento honesto y
  poco común: *lo que ve en la portada lo calcula el mismo motor que va a llevarle el negocio.*
- **Los comandos del bot**, textuales de `lib/telegram.ts:189-200`.
- **El detalle que demuestra oficio**: el consecutivo por local `CEN-000001`, el arqueo
  esperado vs contado, "manda el PC". Nadie inventa esos detalles sin haber estado en una caja.

---

## 4. ESTRUCTURA, SECCIÓN POR SECCIÓN

Cada sección dice para qué está. Si una no vende, se cae.

**S0 · Cabecera (fina, no menú de SaaS).**
`[MARCA]` a la izquierda; a la derecha "Estancos · Colombia" y el botón WhatsApp. Sin menú
de 6 enlaces: en móvil solo `[MARCA]` + WhatsApp. *Propósito: que el contacto esté SIEMPRE a
un toque.*

**S1 · Hero — la promesa + el producto vivo.**
Conserva el titular actual, es bueno y está en la voz del negocio:
"Cierro la reja / y ya sé cuánto gané." (`app/page.tsx:29-31`). Bajada: reescribe la actual
(`app/page.tsx:32-36`) a máximo 2 líneas. A la derecha, **NO** la tira de papel: el **mini
punto de venta jugable** (ver S2). Un CTA WhatsApp grande + "Probar la demo" en texto.
*Propósito: en 5 segundos, qué es y que se puede tocar.*

**S2 · "Facture una venta ahora mismo" — la demo interactiva (el corazón de la landing).**
Componente cliente. Diez botones con los productos REALES del seed y su precio real
(`lib/demo-data.ts:38-47`): Aguardiente Antioqueño 750ml $62.000 · Ron Medellín Añejo 750ml
$78.000 · Águila 330ml $3.500 · Poker 330ml $3.500 · Club Colombia Dorada $4.500 · Marlboro
Rojo $12.000 · L&M Azul $9.500 · Coca-Cola 400ml $4.000 · Agua Cristal 600ml $2.500 · Papas
Margarita $3.000. El visitante toca y ve, en vivo y a la vez:
1. la tira de papel térmico armándose (reutiliza `components/landing/factura.tsx`, que ya
   resuelve el rasgado del cortador con máscara CSS — no lo rehagas);
2. el stock del producto bajando (kardex);
3. **la ganancia real** calculada al promedio ponderado con los costos del seed
   (`lib/demo-data.ts:51-54`: P01 46.000, P03 2.400, P06 9.200…), en `--ok`.
Un rótulo permanente y legible: "Datos de demostración". Y una frase que remata:
"Esta cuenta la hace el mismo código que va a llevar su negocio."
*Propósito: sustituir el testimonio que no tenemos por una prueba que el visitante se hace solo.*

**S3 · El libro de los tres locales.**
Reutiliza `components/landing/libro.tsx` (la banda reglada con folio y doble filete: es la
mejor pieza que tiene esta landing). Tres correcciones obligatorias:
- el folio 03 dice "Estanco Sur" (`components/landing/libro.tsx:12`) pero el local del seed se
  llama **"Estanco La 80"** (`lib/demo-data.ts:34`). Cuádralo con el seed.
- las cifras están escritas a mano en el componente (`libro.tsx:10-19`) y hoy nada dice que
  son de ejemplo: añade el rótulo "Demostración" en la banda. Un número sin etiqueta se lee
  como el resultado de un cliente real, y eso es inventar.
- añade UNA frase de venta al pie de la banda: qué gana el dueño viendo sus 3 locales en una
  sola página.
*Propósito: el argumento multi-local, que es la razón por la que este software existe.*
**Ojo con la promesa multi-local: ver HUECO #5 antes de publicar.**

**S4 · "Lo que ve el dueño" — los módulos, contados como alivios, no como features.**
Seis bloques, uno por ruta real (`components/app-shell.tsx:80-87`) más Caja y Equipo. Cada
uno: nombre de la sección + una línea de lo que le quita de encima + el detalle técnico que
lo hace creíble. Ejemplos ya verificados que puedes usar textualmente:
- *Ventas*: teclea `201⏎ 201⏎ 301⏎` sin soltar el producto; el lector USB entra por el mismo
  campo, sin drivers (`README.md:126-137`).
- *Facturas*: anular no borra el documento, retira los movimientos del kardex, para que la
  ganancia del día no quede falseada (`state.json:134`).
- *Caja*: al cerrar el turno, lo que el sistema dice que debe haber contra lo que hay en la
  gaveta (`lib/dominio/cierre.ts`).
- *Compras*: qué pedir y cuánto, con la razón en una frase (`lib/dominio/sugerencias.ts`).
- *Reportes*: margen por producto y export a CSV (`lib/dominio/reportes.ts`, `lib/export-csv.ts`).
- *Equipo*: el cajero solo ve Ventas; si teclea la URL de reportes, el shell la bloquea
  (`README.md:116-120`, `components/app-shell.tsx`).
*Propósito: cubrir la objeción "¿me sirve para todo el día o solo para cobrar?".*

**S5 · La noche (fondo tinta) + el bot.**
Conserva la sección oscura (`app/page.tsx:65-75`, `components/landing/notas.tsx`): el cambio
de tono funciona y da respiro. Añade dentro la **lista real de comandos** de
`lib/telegram.ts:189-200` como una conversación de Telegram, no como bullets.
*Propósito: "puedo saber cómo va el negocio sin ir al local" — el argumento emocional del
dueño con 3 locales.*

**S6 · Precio. `[HUECO #2]`.**
Deja la sección construida y visible con el token `[PRECIO — HUECO #2]` en el sitio exacto de
la cifra, con la estructura ya montada (qué incluye, por local o por empresa, si hay prueba)
para que el dueño solo escriba números. **NO inventes precio, ni "desde", ni rangos, ni
"consúltenos" disfrazado.** Sin precio, el visitante no se autocalifica y toca el WhatsApp
del vendedor para preguntar lo que debería estar en pantalla.

**S7 · Preguntas honestas (la sección que más vende en B2B pequeño).**
Escribe las respuestas EXACTAS a lo que hoy el sistema no hace, porque el dueño de estanco
las va a preguntar el primer minuto:
- *¿Me sirve para la DIAN?* → hoy emite comprobante interno de venta, **no** factura
  electrónica validada por la DIAN (`memory/estanco-contable/state.json:178-179`). Redáctalo
  claro y sin promesa de fecha. Mentir aquí es fraude, y en Colombia es fraude caro.
- *¿Funciona sin internet?* → hoy la operación vive en el navegador del equipo
  (`components/store.tsx:24-31`); offline-first es roadmap (`brief.md:63`), no producto.
- *¿Y si tengo 2 locales? ¿3?* → el registro pide empresa + sucursales
  (`app/(auth)/registro/page.tsx:4-10`).
- *¿Mis datos quedan mezclados con los de otro negocio?* → una clave de datos por empresa y
  RLS por `empresa_id` en el esquema (`components/store.tsx:24-31`, `supabase/migrations/000_schema.sql`).
  Si Supabase sigue sin activarse (HUECO #5), redacta esto en presente sobre lo que sí corre
  hoy y **no** hables de "la nube".
*Propósito: quitar del medio las tres objeciones que matan la venta antes del WhatsApp.*

**S8 · Cierre + CTA.**
Una frase, un botón de WhatsApp, y el pie: `[MARCA]` · "Estancos · Colombia" · enlace de texto
pequeño "Entrar al sistema" para clientes actuales.

---

## 5. REGISTRO VISUAL Y PALETA — y por qué NO es el de un asadero

**La decisión:** paleta cálida del propio producto, densidad y color MUY por encima de la
landing actual, producto en primer plano, movimiento con causa. **No** el registro de una
landing de comida (rojos, apetito, fotos grandes), y **no** el minimalismo de museo que tiene
hoy la portada.

**Por qué:** quien mira es un cliente afuera, así que la portada tiene que VENDER — pero lo
que vende a un dueño de estanco no es el grito, es **ver el software funcionando y las cifras
cuadrando**. Además esta landing es la puerta del mismo producto: si la portada gritara en
neón y adentro estuviera el escritorio sobrio (skill `estudio-diseno`, restricción dura del
proyecto en `memory/estanco-contable/brief.md:50`), el comprador sentiría el cambiazo. Se
mantiene la familia visual y se sube el volumen con lo que el producto ya tiene: color de
dato, densidad y demo jugable.

**Tokens exactos (ya existen, `app/globals.css:11-25`) — úsalos, no inventes hex:**
`--bg #f8f6f2` · `--card #fcfbf8` · `--sidebar #171717` · `--ink #111111` · `--muted #666666`
· `--line #e7e4de` · `--hover #f2efe9` · `--ok #4d7c59` · `--warn #b98a3c` · `--error #b94a48`
· `--sombra` y `--sombra-alta` (nunca sombra negra: tinte 58,48,36).

**Sube el volumen así, no de otra forma:**
- `--ok` (verde) y `--warn` (ocre) pasan de filete decorativo a **protagonistas de dato**:
  verde = ganancia, ocre = alerta de stock. Son los acentos del propio producto.
- La banda tinta `--sidebar` a sangre como cambio de tono (ya está, funciona).
- Cifras grandes y tabulares (`.cifra`, `globals.css:108`): el número ES la imagen. No hay
  fotos y no las va a haber.
- Más densidad que el interior de la app: menos aire muerto entre secciones, más cosas que
  mirar por pantalla. La landing actual respira tanto que parece vacía.

**Tipografía:** la del sistema ya definida (`globals.css:33`, SF Pro Display / system-ui).
Títulos `clamp()` en peso light con `tracking -0.03…-0.04em` (`app/page.tsx:28`), rótulos en
`.rotulo` (11px, mayúsculas, tracking .18em), cifras en `.cifra`.

**Componentes como objetos:** `.pieza`, `.pieza-hover`, `.herramienta`, `.herramienta-suave`
(`globals.css:60-94`). Ya existen. Úsalos.

---

## 6. INTERACCIÓN — cada una justificada o se cae

1. **Mini punto de venta jugable (S2).** LA interacción de esta landing. Vende porque
   convierte "dice que descuenta el inventario solo" en "lo vi bajar cuando toqué el botón".
   Toque → línea en el papel + stock abajo + ganancia arriba, todo en el mismo gesto.
2. **Cambio de local en la banda-libro (S3).** Tocar un folio resalta ese local y recalcula el
   total. Vende el argumento multi-local, que es la razón de compra.
3. **El comando de Telegram (S5).** Tocar `/hoy` o `/stock` muestra la respuesta del bot como
   mensaje entrante. Vende el "sin ir al local".
4. **Entrada por scroll de las bandas** con `.animate-rise` ya existente (`globals.css:54`,
   260ms, sin rebote). Nada más.
5. **`.herramienta:hover` -2px** en botones (ya existe).

**Prohibido en interacción:** parallax, contadores que suben solos hasta una cifra inventada,
carruseles de logos, tickers, cursores custom, partículas, cualquier cosa que se mueva sola y
no comunique un dato. Respeta `prefers-reduced-motion` (ya contemplado en `globals.css:111-115`).
En móvil (donde va a mirar el dueño), la demo de S2 debe funcionar con el pulgar y sin
scroll horizontal.

---

## 7. RESTRICCIONES TÉCNICAS REALES (verificadas en `package.json`)

- **Stack fijo:** Next.js **16.2.7** (App Router) + React **19.2.4** + TypeScript estricto +
  Tailwind **4** (`package.json:12-17`). No es un HTML suelto: la landing es `app/page.tsx`
  dentro de este repo.
- **Única dependencia de UI permitida: `lucide-react` ^1.17.0.** No hay framer-motion, ni GSAP,
  ni recharts, ni shadcn, ni fuentes de Google, ni CDN. **No instales nada**: añadir una
  dependencia es decisión del dueño en este proyecto (el patrón está documentado con
  `@supabase/ssr`, `README.md:70-77`). Animaciones = `@keyframes` en `globals.css`; gráficos =
  SVG a mano (ya hay ejemplo: `Sparkline` en `components/landing/libro.tsx:118-139`).
- **Server Components por defecto.** `"use client"` solo en el componente de la demo jugable.
- **Reutiliza, no rehagas:** `components/landing/factura.tsx` (tira térmica con rasgado por
  máscara), `libro.tsx` (banda contable), `notas.tsx` (la noche). Están bien hechos.
- **Importa el dominio real** desde la landing (`lib/dominio/contabilidad.ts`,
  `lib/dominio/inventario.ts`, `lib/demo-data.ts`, `components/format.ts` para `fmtCOP`).
  Nada de recalcular a mano lo que el motor ya calcula.
- **No toques** `app/(app)/**`, `lib/dominio/**`, `lib/auth.ts`, `lib/dispositivo.ts` ni el
  esquema SQL. Landing y metadata, nada más.
- **Dónde corre:** local, `npm run dev` → `http://localhost:3000`. **No está desplegado**: no
  hay `vercel.json`, ni `netlify.toml`, ni `Dockerfile` en el repo. No escribas "visite
  nuestro sitio" ni pongas dominio (HUECO #7).
- **No rompas la build:** `npm run build` y `npx tsc --noEmit` deben salir en 0, y
  `npm run lint` limpio.

---

## 8. PROHIBIDO EN ESTE PROYECTO

1. **Inventar la marca.** Sin `[MARCA]` no hay nombre. "Estancos El Progreso" jamás como
   marca ni como cliente (es seed + placeholder de formulario).
2. **Inventar precio, plan o prueba gratis.** No existen en el repo.
3. **Cifras sociales de cualquier tipo:** "+50 estancos", "3 años", "10.000 facturas",
   "clientes en Bogotá", testimonios, caras, nombres, premios. **Cero.** Ni siquiera con
   apariencia de ejemplo.
4. **Prometer facturación electrónica DIAN.** Hoy no la hace (`state.json:178-179`).
5. **Anunciar devoluciones o fiado/crédito.** La lógica existe y está probada
   (`lib/dominio/devolucion.ts`, `lib/dominio/credito.ts`) pero **no tiene ninguna pantalla**
   — verificado: cero referencias en `app/` y `components/`.
6. **Hablar de nube, respaldo o sincronización entre locales en tiempo real** mientras
   Supabase siga apagado (`lib/datos.ts:20` y `:46-74` comentados; `cargarDatos()` devuelve
   `DEMO`). Ver HUECO #5.
7. **Fotos de stock.** Ni cajeros sonrientes, ni botellas de banco de imágenes, ni mockups de
   MacBook flotando. `public/` no tiene una sola foto y así se queda: lo visual es el producto.
8. **Azules eléctricos, morados, neones, gradientes tecnológicos, glass.** Restricción dura
   del proyecto (`memory/estanco-contable/brief.md:50`). Nota: una línea vieja de la memoria
   menciona un "--accent azul" y `.glass` (`state.json:17`); **está obsoleta** — manda
   `app/globals.css:11-25`, que no tiene azul ninguno.
9. **Cifras sin etiquetar como demostración.** Todo número visible sale del seed o lleva
   rótulo "Datos de demostración".
10. **Productos que no están en el catálogo.** Aviso: la landing actual ya inventa
    "Ron Viejo de Caldas 375 ml $38.000" y pone Marlboro a $12.500
    (`components/landing/factura.tsx:16-21`), cuando el seed dice $12.000 y no tiene ese ron
    (`lib/demo-data.ts:38-47`). Corrígelo.
11. **Dos CTAs compitiendo.** Un WhatsApp manda; el resto son enlaces de texto.
12. **Minimalismo de museo.** El dueño ya rechazó una landing por "muy minimalista" (lección
    de `ORION/memory/landings/state.json`, POL-001). Aire sí; vacío no.

---

## 9. HUECOS DEL DUEÑO (lo primero que hay que leer)

1. **Nombre comercial del producto.** No existe ninguno en el repo. Sin él la landing sale con
   `[MARCA]` visible. Es el hueco #1 porque afecta cabecera, pie, `<title>` y manifest.
2. **Precio.** ¿Cuánto cuesta, por local o por empresa, mensual o anual? ¿Hay instalación o
   migración cobrada aparte? ¿Prueba gratis y de cuántos días? Sin esto la sección S6 va con
   el token a la vista.
3. **WhatsApp / teléfono / correo comercial.** Cero menciones en todo el repo. **Es el CTA
   principal**: sin este dato la landing no puede vender, solo informar.
4. **¿Quién vende?** ¿Persona natural, empresa, ciudad? El comprador de un pueblo pregunta
   "¿usted dónde queda?" antes de pagar.
5. **DECISIÓN — ¿se publica antes o después de activar Supabase?** Hoy los datos viven en el
   `localStorage` de cada equipo (`components/store.tsx:24-31`), así que la promesa "tres
   locales, un solo cuaderno" **no se cumple entre PCs distintos** todavía. Dos caminos, y hay
   que elegir uno antes de escribir el copy definitivo: **(A)** publicar ya, sin prometer
   consolidación en vivo entre locales; **(B)** activar `@supabase/ssr` + migraciones
   (PEND-001, `brief.md:62`) y entonces sí prometerlo. **No publiques (B) escrito si el
   sistema está en (A).**
6. **DIAN.** ¿Se va a integrar factura electrónica y en qué plazo? Condiciona el precio y la
   respuesta de S7 (`state.json:178-179`, PEND-009).
7. **Dominio y despliegue.** No hay nada de deploy en el repo. ¿Dónde va a vivir esta landing?
8. **Logo o marca gráfica.** `public/` solo tiene los dos íconos PWA. Si no hay logo, la
   cabecera va con `[MARCA]` en tipografía y punto (es una decisión válida, no un problema).
9. **¿Se conserva el tono actual?** El titular "Cierro la reja y ya sé cuánto gané" y las
   piezas de papel son buenas y este prompt las mantiene; no consta en ningún sitio si el
   dueño las aprobó. Si no le gustan, dilo antes y se rehace la voz, no la estructura.
10. **Credenciales de la demo pública.** Para que "Probar la demo" funcione hay que mostrar
    usuario `dueno` / contraseña `estanco2026` (`lib/demo-data.ts:23,26`) o crear un botón que
    abra sesión demo. **Riesgo:** esas credenciales sirven para el seed; en cuanto Supabase
    esté activo, publicarlas deja de ser inocuo. Decisión del dueño.

---

## 10. CRITERIOS DE ACEPTACIÓN (verificables, no opinables)

**Build y tipos**
1. `npm run build` termina en 0 y sigue generando las mismas rutas de la app.
2. `npx tsc --noEmit` en 0. `npm run lint` sin errores.
3. `git diff --name-only` no muestra ningún archivo bajo `app/(app)/`, `lib/dominio/`,
   `lib/auth.ts`, `lib/dispositivo.ts` ni `supabase/`.
4. `git diff package.json` vacío: cero dependencias nuevas.

**No-invención (grep, no criterio)**
5. `grep -rn "Estanco Sur" app components` → sin resultados (hoy sí aparece en `libro.tsx:12`).
6. `grep -rniE "años de experiencia|clientes satisfechos|\+[0-9]+ (estancos|negocios|clientes)|testimonio|DIAN validad" app components` → sin resultados.
7. `grep -rn "Ron Viejo de Caldas" app components` → sin resultados.
8. Todo producto y precio que aparezca en pantalla existe en `lib/demo-data.ts:38-47`
   (revisar uno por uno contra el archivo).
9. Cada bloque con cifras muestra en pantalla la palabra "demostración" (o "ejemplo"), visible
   sin hover y con contraste real.
10. Los tokens `[MARCA]`, `[PRECIO — HUECO #2]` y `[WHATSAPP — HUECO #3]` aparecen **tal cual**
    en el render mientras el dueño no los llene, y `MARCA` está definido en un único archivo.

**Venta**
11. Existe exactamente **un** CTA de peso (WhatsApp) por pantalla-scroll; "Entrar al sistema"
    quedó como enlace de texto en el pie.
12. La demo del punto de venta responde al toque: al agregar un producto cambian a la vez el
    papel, el stock y la ganancia; la ganancia coincide con lo que devuelve
    `lib/dominio/contabilidad.ts` para esa misma canasta (compruébalo con un cálculo a mano
    sobre los costos de `lib/demo-data.ts:51-54`).
13. Las seis preguntas de S7 están respondidas y ninguna respuesta promete algo que el repo no
    haga hoy.

**Visual (la verdad de terreno es Edge headless a PNG, no el navegador embebido)**
14. Con `npm run dev` corriendo, captura y **mira** los PNG:

        msedge --headless=new --disable-gpu --window-size=1280,3000 --screenshot=escritorio.png http://localhost:3000
        msedge --headless=new --disable-gpu --window-size=390,2400 --screenshot=movil.png     http://localhost:3000

15. En `movil.png`: sin scroll horizontal, botones de la demo alcanzables con el pulgar,
    ninguna cifra cortada, el CTA de WhatsApp visible sin bajar.
16. En `escritorio.png`: ninguna banda vacía de más de una pantalla de alto sin contenido
    (el defecto exacto por el que se rechazó la landing anterior de otro proyecto).
17. Muestreo de color sobre los PNG: no aparece ningún azul/morado saturado; los acentos son
    `#4d7c59` y `#b98a3c` sobre `#f8f6f2` / `#171717`.
18. `prefers-reduced-motion: reduce` deja la página quieta y legible (`globals.css:111-115`).
