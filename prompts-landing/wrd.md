# PROMPT — LANDING PÚBLICA DE WRD
## "La calle antes de la puerta" — pieza que capta socios durante las 40 noches

Vas a construir la ÚNICA pieza pública de WRD: la página que un desconocido ve ANTES
de toparse con el portón. Hoy no existe. Hoy el visitante cae en `index.html`, ve una
intro animada y de una lo tapa un overlay negro a pantalla completa pidiéndole nombre
y clave (`css/gate.css:33-42` → `#gate.gate { position: fixed; inset: 0 }`;
`js/gate-ui.js:495-497` → sin sesión se pinta el portón SIEMPRE, abierta o cerrada la
fase). Ese portón no explica nada, no muestra ni un producto, ni un precio, ni por qué
alguien debería registrarse. Tu landing es lo que falta: la razón, antes de la puerta.

Escribí en el mismo español del sitio: voseo, corto, sin corporativismo
(`index.html:104` "Tocá el que se te antoje: ahí mismo lo pedís";
`js/gate-ui.js:374` "Elegí un nombre y una clave. Nadie más va a saber cuál es.").

---

## 1. EL NEGOCIO (todo con origen; nada de esto lo inventés vos)

**Marca: WRD. Es REAL y está asentada — no es placeholder.**
- `data.js:19-21` → `nombre: "WRD"`, `siglas: ["W","R","D"]`,
  `significado: ["Semana","Relajada","a Domicilio"]`
- `index.html:8` → `<title>WRD — Semana Relajada a Domicilio</title>`
- `assets/logo.svg` → wordmark + arbusto vectorial hecho a medida (640×360)
- `index.html:44-51` → intro animada que deletrea W·R·D con su significado
- ⚠️ INCONSISTENCIA REAL: `assets/logo.svg:2` dice `<title>WRD — Week Relax Delivery</title>`
  (inglés) contra el "Semana Relajada a Domicilio" de todo lo demás. → **HUECO 7**.
  Hasta que el dueño resuelva, usá SOLO "Semana Relajada a Domicilio".

**Qué vende:** dulces a domicilio. Tres familias de producto en el catálogo vivo:
- PROMOS (3, `data.js:118-140`): Fresas con chocolate x12 $22.000 (antes $28.000,
  etiqueta "🔥 Solo esta semana"); Combo gomitas mega $15.000 ("😋 El más pedido");
  Caja mixta antojo $25.000 (antes $30.000).
- CATÁLOGO (9, `data.js:175-230`): Gomitas clásicas $10.000 · Gomitas ácidas $11.000 ·
  Chocolatinas artesanales $12.000 · Fresas con crema $15.000 · Brownie casero $8.000 ·
  Mini donas variadas $9.000 · Paquete de mecato dulce $14.000 · Obleas rellenas $13.000 ·
  Marshmallows artesanales $10.000.
- PREMIUM (6, `data.js:246-289`): de $65.000 a $140.000. **No es para el visitante**
  (ver §2).
- ⚠️ `data.js:94-97` dice literal que esa lista "es la SEMILLA del catálogo vivo": el
  dueño puede haberla cambiado desde la barra de administración. Por eso **los precios
  NO se escriben a mano en tu HTML: se leen del store en tiempo de carga** (§7). Y por
  eso confirmar el catálogo es **HUECO 5**.

**Operación declarada** (sin confirmar por el dueño → citala como está, no la adornes):
- `data.js:25` → horario "Lun a Dom, 2pm – 10pm"
- `data.js:26` → zona "Toda la ciudad" — **el repo NO nombra ninguna ciudad** (HUECO 3)

**El mecanismo que hace único al negocio — las 40 noches:**
- `data.js:61` → `fechaFin: "2026-09-18T23:59:00-05:00"`. Es el momento exacto en que el
  sitio se vuelve PRIVADO. Antes: cualquiera se registra solo con nombre y clave
  (`js/gate-ui.js:390-391`, campo de referido opcional `js/gate-ui.js:352-372`).
  Después: `js/gate-ui.js:380` → "Este lugar ya cerró sus puertas. Alguien de adentro
  tiene que abrirte", y el código de quien te trajo pasa a ser OBLIGATORIO
  (`js/gate-ui.js:347-351` → campo "¿Quién te trajo?" `required`).
- Las invitaciones son escasas a propósito: solo existen desde el rango 5
  (`data.js:65` `desbloqueaEn: 5`) y los cupos son `{"5":1, "6":3, "7":0}` = 1, 3 e
  ilimitadas (`data.js:78`).
- Y esto es el argumento de venta más fuerte que tenés, con código que lo respalda:
  **quien entra durante las 40 noches no le gasta el cupo a nadie**
  (`js/auth.js:459-462`: "los invitados que entraron durante las 40 noches no gastan
  cupo"). Entrar hoy es gratis; entrar el 19 de septiembre le cuesta a alguien uno de
  sus tres cupos del año.
- Escalera de 7 rangos kanji, con beneficios textuales (`data.js:66-74`):
  客 Visita "Entrar y pedir" (0 compras) · 灯 Farol "El antojo de la noche: 1 producto
  oculto rotativo" (10) · 霧 Niebla "Tu pedido va marcado prioritario para el
  domiciliario" (20) · 夜 Noche "Dulce sorpresa cada 5 pedidos" (30) · 鍵 Llave
  "Premium abierto + 1 invitación" (40) · 月 Luna "3 invitaciones + precio de casa en
  promos" (50) · 夢 Sueño "Invitaciones sin tope + pedido fuera de horario" (60)
  (umbrales en `data.js:64`).
- Cada socio recibe un número correlativo visible (`js/auth.js:644` `socio: filas.length+1`;
  `data.js:82` `mostrarNumeroSocio: true` — "premia a los de las 40 noches") y un ID
  `WRD-XXXXXX` que ES su código para invitar (`js/auth.js:483`).
- Los rangos son PROVISIONALES mientras la puerta esté abierta (`js/rangos.js:49-53`;
  `js/gate-ui.js:549` → "Los rangos se efectúan cuando se cierre la puerta"). No
  prometas nada como definitivo.

**Estado técnico que condiciona todo (leelo antes de escribir una línea):**
`data.js:58-59` tiene `supabaseUrl` y `supabaseAnonKey` VACÍOS → el sitio corre en MODO
DEMO (`js/core/store.js:94-95`: `modo()` devuelve 'real' solo si hay URL y key). En demo,
cada socio que se registre vive SOLO en el navegador donde se registró
(`setup/INSTRUCCIONES.md:3-5`: "Sirve para probar, no para vender: si el cliente pide
desde su celular, vos no ves nada"; `memory/wrd/state.json` RSK-003).
→ **PRECONDICIÓN P0, va arriba de todo en tu entrega: esta landing no se publica hasta
que se complete PEND-001 (conectar Supabase). Si se publica en demo, cada registro que
la landing consiga se evapora en el celular del visitante y el dueño no ve ni uno.**
Construila igual —el trabajo sirve— pero decilo en voz alta al entregar.

---

## 2. QUIÉN MIRA Y QUÉ DEBE HACER

**Mira:** una persona en Colombia, con el celular en la mano, de noche, con antojo de
dulce. Llegó por un link pegado en un estado de WhatsApp, por un QR en un empaque (el
dueño los hace a mano, `memory/wrd/state.json` DEC-003) o porque un amigo le dijo "metete
antes de que cierre". No conoce WRD. No sabe qué es un rango. Tiene 8 segundos de
paciencia y datos móviles.

**Debe SENTIR** (en este orden): 1) esto es un lugar, no una tienda — tiene puerta,
horario y gente adentro; 2) hay algo rico y barato ahí (producto y precio a la vista);
3) la puerta se cierra el 18 de septiembre y después necesito que alguien me abra;
4) entrar ahora es gratis y me deja un número bajo.

**UNA sola acción:** **registrarse como socio antes del 2026-09-18 23:59 (-05:00)**.
El botón lleva a `index.html`, donde sin sesión y en fase abierta el portón se abre
directo en modo REGISTRO (`js/gate-ui.js:495-497` + `vistaDefecto()`: abierta → 'registro').
Un solo CTA repetido, mismo texto, mismo color, todas las veces. Nada de un segundo
botón: no hay WhatsApp real que ofrecer (`data.js:22` es un número de ejemplo) y pedir
requiere cuenta (DEC-004: fase pública = sin pedidos).

**Las otras dos páginas, explícitamente:**
- `premium.html` — es de socios rango 5+ ("La línea Premium", `premium.html:49-50`;
  `data.js:65`). Un visitante sin sesión que la abra recibe el mismo portón. En tu
  landing Premium aparece SOLO como recompensa mencionada dentro de la escalera de
  rangos (texto de `data.js:71`). **Prohibido enlazarla y prohibido mostrar sus precios.**
- `proveedor.html` — panel interno de los dos admins 影/静 (`data.js:86-87`), con
  `<meta name="robots" content="noindex">` (`proveedor.html:6`) y "Solo administración"
  (`proveedor.html:45`). **Tu landing no lo nombra ni lo enlaza jamás.** (Ojo: el pie de
  `index.html:118` sí trae "Acceso proveedor"; no repliques eso.)

**Fricción conocida, no la arregles a escondidas:** al tocar el CTA, el visitante ve
otra vez la intro animada si es su primera visita a `index.html` (`index.html:25-36`
lee `wrd_intro_vista`; hay botón "Saltar", `index.html:50`). Tu landing es de SOLO
LECTURA: **no escribas `wrd_intro_vista` ni ninguna clave `wrd_v1_*`**. Si el dueño
quiere saltarse la intro para quien viene de la landing, es decisión suya (HUECO 12).

---

## 3. EVIDENCIA REAL (lo único que hoy se puede probar)

Usá esto y nada más:
1. La fecha de cierre es verificable y está en el código: `data.js:61`. El contador que
   pongas es el mismo que corre adentro (`js/fase.js`).
2. Los precios y los productos existen en el catálogo vivo y se leen en vivo (§7).
3. La escalera de 7 rangos con sus beneficios textuales: `data.js:66-74`.
4. La economía de invitaciones: 1 / 3 / sin tope desde rango 5 (`data.js:78`, `data.js:65`)
   y "entrar ahora no le gasta cupo a nadie" (`js/auth.js:459-462`).
5. Que registrarse no pide correo, ni cédula, ni tarjeta: nombre y clave
   (`js/gate-ui.js:337-345` campos del form; copy `js/gate-ui.js:374`).
6. Que el teléfono se pide una sola vez, al pedir, y para una sola cosa:
   `js/pedido-modal.js:303` → "Solo para que el domiciliario te llame si lo necesita".
   El pedido pide nombre, número, dirección y notas (`js/pedido-modal.js:305-306`).
7. Que te dan un número de socio correlativo (`js/auth.js:644`, `data.js:82`).

**NO existe, y por lo tanto no aparece:** testimonios, reseñas, estrellas, cantidad de
clientes, pedidos entregados, años de experiencia, premios, "más de X familias", logos
de aliados, fotos de producto (el repo tiene CERO imágenes de comida: `assets/` contiene
únicamente `logo.svg`; PEND-005 sigue abierto).
**Caso especial — "N adentro":** el sitio muestra un contador de socios junto al reloj
(`js/gate-ui.js:790-791`, `data.js:83`). **En la landing va PROHIBIDO**: en modo demo ese
número cuenta solo los socios del navegador de quien mira; publicarlo sería inventar una
cifra social. Si algún día se conecta Supabase, el dueño decide si lo quiere (HUECO 11).

---

## 4. ESTRUCTURA, SECCIÓN POR SECCIÓN

Móvil primero (360-390px), una columna, scroll corto. Siete bloques, en este orden.

**S1 · PORTADA — "hay un lugar y tiene reloj"**
Propósito: en 3 segundos, marca + antojo + urgencia + botón.
Contenido: `assets/logo.svg` (única imagen permitida, ya tiene `role="img"` y título) ·
tagline real `index.html:87` "Dulces a tu puerta, sin afán." · el CONTADOR grande, vivo,
calculado de `data.js:61` (nunca escrito a mano) · CTA único ("Entrar antes de que
cierre" o similar, decidilo vos, corto) · debajo, en chico: horario `data.js:25` y zona
`data.js:26` (con la ciudad como HUECO 3 marcada `[CIUDAD]` en el código si no llegó).
El texto del contador reusa los tramos de `js/fase.js:111-132`: calma "Quedan N noches
abiertas." (≥21) / aviso "La puerta se cierra en N noches." (20-8) / presión "N noches.
Después, solo los de adentro." (7-1) / final "Se cierra en HH:MM:SS." (<24h) / cerrada
"Las puertas están cerradas.". Al escribir esto (2026-08-16) faltan 33 noches → tramo
"calma"; según `js/fase.js:91-93` + `data.js:61` pasa a "aviso" el 2026-08-29 23:59, a
"presión" el 2026-09-11 23:59 y a "final" el 2026-09-17 23:59.

**S2 · QUÉ ES ESTO — tres líneas, cero adjetivos**
Propósito: que entienda el negocio antes de mirar precios.
Contenido: dulces a domicilio · horario `data.js:25` · zona `data.js:26` · y el "desde
$X" **calculado del catálogo cargado** (el mínimo real; hoy daría $8.000 por el Brownie
casero, `data.js:216-222`, pero no lo escribas: calculalo).

**S3 · LO QUE SE PIDE — el producto es el protagonista**
Propósito: provocar el antojo. Es la sección más grande de la página.
Contenido: las 3 promos (`tipo: "promo"`) grandes arriba, con precio y `precioAntes`
tachado y la `etiqueta` cuando exista; abajo, la grilla del catálogo permanente
(`tipo: "catalogo"`). **Todo leído del store en vivo (§7), nunca escrito en el HTML
(regla KN-006 del repo: "data.js solo siembra y después manda el store").**
Sin fotos: replicá el tratamiento que ya usa la app para producto sin foto — emoji
grande (🍬 🍫 🍓 rotando por índice, `js/render.js:25,63-65`) sobre el tinte naranja de
`css/home.css:217-225`. Se tiene que ver intencional, no roto.
⚠️ La tarjeta **no abre el modal de pedido** (eso es la app y necesita sesión): al
tocarla, llevá al CTA. Dejalo explícito en el copy de la sección
("Para pedir hay que estar adentro").

**S4 · LAS SIETE LLAVES — el mecanismo, hecho juego**
Propósito: convertir "una tienda más" en "un lugar donde se sube".
Contenido: los 7 rangos de `data.js:66-74` con su kanji, nombre, umbral (`data.js:64`) y
beneficio textual, renderizados desde `WRD_DATA.config.rangos` (si el dueño los cambia,
la landing cambia sola). Interacción en §6. Copy obligatorio de honestidad, porque el
código lo dice: los rangos son provisionales hasta que cierre la puerta
(`js/rangos.js:49-53`, `js/gate-ui.js:549`). Premium se nombra acá y solo acá, como lo
que se abre en 鍵 Llave (`data.js:71`).

**S5 · EL 19 DE SEPTIEMBRE — la sección que vende**
Propósito: mostrar la pérdida, que es más fuerte que la ganancia.
Contenido: dos estados enfrentados, con las frases EXACTAS del portón —
hoy: "Parece que por fin diste con el lugar." (`js/gate-ui.js:373`) + "Elegí un nombre y
una clave." (`js/gate-ui.js:374`);
después: "Este lugar ya cerró sus puertas. Alguien de adentro tiene que abrirte."
(`js/gate-ui.js:380`) + campo obligatorio "¿Quién te trajo?" (`js/gate-ui.js:347-351`).
Y el dato duro: las invitaciones salen del rango 5 en adelante, 1 · 3 · sin tope
(`data.js:78`, `data.js:65`), pero **entrar ahora no le gasta el cupo a nadie**
(`js/auth.js:459-462`). Cerrá con el CTA.

**S6 · CÓMO FUNCIONA — tres pasos, sin letra chica**
Propósito: bajar el miedo a registrarse.
1) Elegís un nombre y una clave. Nada de correo (`js/gate-ui.js:337-345`, copy :374).
2) Pedís producto por producto; te piden nombre, número, dirección y una nota
   (`js/pedido-modal.js:305-306`), y el número es solo para que el domiciliario llame si
   lo necesita (`js/pedido-modal.js:303`). **Nunca escribas "te contactamos"** — el
   propio repo lo prohíbe en `index.html:110-112`.
3) Cada entrega suma un sello, los sellos suben el rango, el rango abre beneficios
   (`data.js:64`, `js/rangos.js`). Y quedás con un número de socio bajo, para siempre
   (`js/auth.js:644`, `data.js:82`).

**S7 · CIERRE Y PIE**
CTA por última vez + el contador otra vez (más chico) + pie con "W R D — Semana Relajada
a Domicilio" (`index.html:116`) y "Hecho con antojo." (`index.html:117`).
Sin enlace a proveedor. Sin redes (no existen: HUECO 8). Sin dirección (no existe).

---

## 5. REGISTRO VISUAL Y PALETA

**Decisión, y su razón:** usás la paleta propia de WRD, NO la paleta cálida clara del
manifiesto "estudio del ingeniero moderno". Dos motivos: (a) la landing es la fachada de
una marca que YA tiene identidad decidida y construida (DEC-002 en
`memory/wrd/state.json`, tokens en `css/base.css:33-99`), y mandar al visitante de una
página beige a una app negra sería una costura visible; (b) la política de landings del
dueño manda vender, no calmar — el minimalismo del manifiesto es para el interior de la
app, donde alguien trabaja. Las prohibiciones del manifiesto siguen vigentes y esta
paleta las cumple: es negro cálido + naranja + ámbar, cero azul eléctrico, cero morado,
cero neón, cero gradiente tecnológico.

Tokens exactos (usalos por variable, no copies el hex — `css/base.css`):
- fondo `--wrd-fondo #0A0A0A` (:44), superficies `--wrd-superficie #151110` (:45),
  `--wrd-superficie-alta #1F1917` (:46), bordes `#2A2220` / `#3D312C` (:47-48)
- marca `--wrd-naranja #FF6A00` (:51), `--wrd-naranja-claro #FF8C33` (:52),
  `--wrd-naranja-hondo #C24E00` (:53)
- acento `--wrd-ambar #FFB347` (:56) — reservado a lo premium y a foco
- `--wrd-verde #7BC96F` (:60) SOLO micro-detalles (punto de "abierto", check). Nunca
  superficies: lo dice el propio comentario del token (:58-59)
- texto `#FFF6EE` / `#C9BDB4` / `#9C8F86` (:63-65) y **`--wrd-sobre-naranja #1A0D00`
  para texto ENCIMA del naranja — blanco sobre naranja no pasa AA** (:66-67)
- tintes listos `--wrd-naranja-tinte`, `--wrd-ambar-tinte` (:79-81); espaciado en
  múltiplos de 4 (:83-92); radios (:94-99)

Tipografía ya cargada por `css/base.css:24`: **Baloo 2** (500-800) para marca y títulos,
**Nunito** (400/600/700) para cuerpo (`css/base.css:39-40`). No agregues otra fuente ni
otro `@import`.

Densidad y ritmo: títulos gordos y redondos (Baloo 2 es una display gruesa: nada de
"peso ligero con mucho aire" acá, ese es el otro registro), tarjetas con radio grande
(`--wrd-radio-3/4`), fondo negro con el mismo rescoldo naranja que ya usa el portón
(`css/gate.css:41` → `radial-gradient(... rgb(var(--wrd-naranja-rgb)/0.16) ...)`), y
contraste AA garantizado en todo texto normal (`css/base.css:20`).

---

## 6. INTERACCIÓN (cada una se justifica o no va)

1. **Contador vivo** (obligatorio). Late cada 60 s y cada 1 s en el último día, igual que
   `js/fase.js:156-163`. Vende porque la escasez es real y verificable.
2. **Escalera de rangos manipulable**: los 7 kanji en fila; al tocar/hover uno, se
   despliega su beneficio y su umbral. En móvil, carrusel con snap. Vende porque
   convierte una lista de reglas en algo que el pulgar explora — y es el mecanismo que
   diferencia a WRD de cualquier tienda de dulces.
3. **Interruptor "¿y el 19 de septiembre?"** en S5: al activarlo, la sección se apaga a
   negro, el copy se reemplaza por el de fase privada y el formulario ilustrado suma el
   campo obligatorio "¿Quién te trajo?". Vende porque muestra la puerta cerrándose en vez
   de contarlo. Es la única animación "grande" permitida.
4. **Tarjetas de producto con reacción física**: elevación + escala 1.045 al hover, igual
   que `css/home.css:211-213`, y el precio tachado apareciendo al lado del vigente. Vende
   porque el producto es el protagonista y tiene que sentirse tocable.
5. **CTA pegajoso en móvil**: aparece abajo al pasar la portada, con el contador en
   miniatura adentro. Vende porque la decisión se toma tarde, cuando ya vio los precios.
6. **Prohibidas**: partículas, parallax de fondo, cursores custom, contadores que suben
   solos hacia una cifra inventada, "N personas viendo esto ahora".

Todo lo animado se apaga bajo `prefers-reduced-motion` (`css/base.css:21` lo exige, y
`css/home.css:227-231` ya tiene el patrón). Aviso de QA: los entornos de prueba locales
FUERZAN reduced-motion (KN-002 en `memory/wrd/state.json`); si una captura se ve estática,
puede ser eso y no un bug — verificalo neutralizando la media query en una copia parcheada.

---

## 7. RESTRICCIONES TÉCNICAS REALES (verificadas en el repo, no negociables)

- **No hay build step. No hay `package.json`, ni `node_modules`, ni framework, ni
  bundler** (verificado: la raíz del repo tiene solo los 3 HTML, `data.js`, `assets/`,
  `css/`, `js/`, `setup/`, `memory/` y los iconos). Es HTML + CSS + JS vanilla en IIFE
  con namespaces `WRD*` y tokens `--wrd-` (DEC-001 en `memory/wrd/state.json`).
- **Archivos que creás (y ningún otro):**
  `C:\Users\Kalel\fable 5\wrd\landing.html`
  `C:\Users\Kalel\fable 5\wrd\css\landing.css`
  `C:\Users\Kalel\fable 5\wrd\js\landing.js` → expone únicamente `window.WRDLanding = { montar }`.
- **Archivos que NO tocás, ni una coma:** `index.html`, `premium.html`, `proveedor.html`,
  `data.js`, todo `js/` existente, todo `css/` existente, `setup/`, `memory/`.
- **Orden exacto de scripts en `landing.html`** (y ninguno más):
  `data.js` → `js/core/util.js` → `js/core/store.js` → `js/productos-store.js` →
  `js/fase.js` → `js/landing.js`.
- **PELIGRO — no cargues NUNCA** `js/gate-ui.js`, `js/auth.js`, `js/intro.js`,
  `js/render.js`, `js/pedido-modal.js` ni `js/admin-productos.js`: `gate-ui` pinta el
  portón `position:fixed; inset:0` encima de todo (`css/gate.css:33-42`) y te tapa la
  landing entera. Tampoco copies el script de "cloak" `.wrd-cargando` de
  `index.html:25-36`: acá no hay puerta que ocultar y solo lograrías una pantalla en
  blanco.
- **Datos del catálogo, en vivo y de solo lectura:** `await WRDStore.init()` y después
  `WRDProductos.listar('promo')` / `listar('catalogo')`
  (API en `js/productos-store.js:461-468`; firma `listar(tipo, opts)` en :~370). **No
  llames a `sembrar()`** ni escribas nada: la landing es de SOLO LECTURA (no toca
  `localStorage`, no crea claves `wrd_v1_*`, no modifica el estado de la app).
  Cascada de degradación: si `listar` devuelve `ok:false` o lista vacía → leé
  `window.WRD_DATA.promos` / `.catalogo` (la semilla, `data.js:118+` y `:175+`); si eso
  tampoco está → ocultá la sección entera. Nunca una grilla rota, nunca un precio
  hardcodeado en el HTML (regla KN-006 del proyecto).
- **CSS:** `landing.html` enlaza primero `css/base.css` (trae tokens + fuentes) y después
  `css/landing.css`. En `landing.css` **ni un hex suelto**: todo por token `--wrd-`; si
  falta un color, se usa una mezcla de los existentes, no se inventa uno nuevo (misma
  regla que declara `css/gate.css:4-7`). Clases con prefijo `.lp-` para no chocar con
  nada del app.
- **Única dependencia externa de todo el proyecto:** Google Fonts por `@import` en
  `css/base.css:24`. No agregues CDNs, ni librerías, ni analytics, ni fuentes nuevas.
- **Imágenes:** solo `assets/logo.svg`. No hay otra imagen de contenido en el repo
  (`assets/` = `logo.svg` y nada más; en la raíz solo `favicon.ico` y
  `apple-touch-icon.png`, 677 bytes).
- **Dónde corre:** servidor local estático `http://localhost:4181` (entrada `wrd` en
  `C:\Users\Kalel\fable 5\.claude\launch.json`, KN-001 en `memory/wrd/state.json` — que
  además avisa que ese archivo es compartido: reverificá el puerto antes de levantar).
  En producción, cualquier host estático (PEND-002 sigue abierto: no hay hosting elegido,
  y `git remote -v` está vacío → el repo nunca se publicó).
- **Ruta pública:** dejala en `/landing.html`. Que el dominio sirva la landing como raíz
  y el app en otra ruta es una decisión de hosting del dueño (HUECO 10); renombrar
  `index.html` rompería enlaces internos (p. ej. `js/gate-ui.js:455` vuelve a
  `index.html`).
- **SEO:** `<title>` y `<meta name="description">` propios, `lang="es"`,
  `theme-color #0A0A0A` como en `index.html:6`. **Sin Open Graph todavía**: `og:url`
  necesita el dominio real (`data.js:23` es `wrd.example.com`, un ejemplo) y `og:image`
  necesita un PNG que no existe (HUECOS 2 y 4). Dejá el bloque comentado con un TODO
  visible, no lo llenes con algo verosímil.

---

## 8. PROHIBIDO EN ESTE PROYECTO

1. Fotos de stock, ilustraciones compradas, renders de IA o cualquier imagen que no sea
   `assets/logo.svg`. No hay fotos de producto y no se simulan.
2. Inventar cifras sociales: socios, pedidos entregados, años, testimonios, reseñas,
   estrellas, "más de X familias". **Incluido el "N adentro"** de `js/gate-ui.js:790-791`:
   en modo demo cuenta localhost, publicarlo es fabricar un número.
3. Escribir productos, nombres o precios a mano en el HTML/CSS/JS (KN-006). Todo del store.
4. Usar el WhatsApp de ejemplo `573001234567` (`data.js:22`) o el dominio
   `wrd.example.com` (`data.js:23`). Ni un `wa.me`, ni un `tel:`, ni un botón flotante
   verde de WhatsApp.
5. Enlazar o mencionar `proveedor.html` (`proveedor.html:6` es `noindex`, es el panel de
   los admins 影/静).
6. Enlazar `premium.html` o listar sus precios: es contenido de rango 5+ (`data.js:65`).
7. Segundo CTA compitiendo con el registro. Uno solo, repetido.
8. Prometer "te contactamos", "te llamamos" o cualquier respuesta que el sistema no da
   (`index.html:110-112` lo prohíbe explícitamente).
9. Formularios propios en la landing: no hay backend para recibirlos. El único punto de
   captura es el portón de `index.html`.
10. Azules eléctricos, morados, neones, gradientes tecnológicos (prohibición permanente
    del sistema de diseño del dueño).
11. El registro minimalista beige del manifiesto. Lección pagada del 2026-08-05: una
    landing pública hecha así fue rechazada por "muy minimalista"; una portada tiene que
    vender.
12. Escribir "Week Relax Delivery" (`assets/logo.svg:2`) hasta que el dueño resuelva la
    contradicción con `data.js:21`.
13. Tocar cualquier archivo existente del repo.

---

## 9. HUECOS DEL DUEÑO (esto es lo primero que tiene que leer él)

**P0 — antes que todos: conectar Supabase (PEND-001).** Sin `supabaseUrl` +
`supabaseAnonKey` en `data.js:58-59`, el sitio está en modo demo y **cada socio que la
landing capte muere en el celular del visitante** (`js/core/store.js:94-95`; RSK-003;
`setup/INSTRUCCIONES.md:3-5`). Publicar la landing antes de esto es gastar la ventana de
las 40 noches a cambio de nada. Van con él PEND-004 (rotar los PIN de 4 dígitos de los
admins, RSK-002) y PEND-005 (subir fotos reales).

1. **Número de WhatsApp real.** Hoy solo existe el ejemplo `573001234567`
   (`data.js:22`). Se necesita para el domiciliario y para cualquier link de contacto.
2. **Dominio real.** Solo hay `wrd.example.com` (`data.js:23`). Sin él no hay Open Graph,
   ni QR que se pueda imprimir.
3. **Ciudad y zona de cobertura.** El repo dice "Toda la ciudad" (`data.js:26`) y no
   nombra ninguna. Sin ciudad, un visitante no sabe si le llega.
4. **Una imagen para compartir (1200×630 PNG).** No existe ninguna; el logo es SVG y no
   sirve para previsualizaciones de WhatsApp/Instagram.
5. **Confirmar los 18 productos y sus precios.** `data.js:94-97` los declara semilla; hay
   2 promos más comentadas como ejemplo (`data.js:142-156`). La landing muestra precios
   públicos: si están mal, es una promesa incumplida.
6. **Costo del domicilio y formas de pago.** No aparecen en ningún archivo; el modal de
   pedido solo pide nombre, número, dirección y notas (`js/pedido-modal.js:305-306`).
   Es la primera pregunta que va a hacer todo el mundo.
7. **Qué significa la sigla.** "Semana Relajada a Domicilio" (`data.js:21`, `index.html:8`)
   vs "Week Relax Delivery" (`assets/logo.svg:2`). Hay que elegir uno.
8. **Redes y correo de contacto.** No hay ninguno en el repo. Sin esto, el pie queda sin
   segunda vía de contacto.
9. **Términos y política de datos.** El sitio recoge nombre, teléfono y dirección
   (`js/pedido-modal.js:305-306`) y no existe ninguna página legal ni razón social.
10. **Ruta pública.** ¿El dominio sirve la landing como raíz y el app en `/tienda`, o la
    landing vive en `/landing.html`? Es configuración del hosting (PEND-002).
11. **¿Mostrar cuántos socios hay adentro?** Existe el dato (`data.js:83`,
    `js/gate-ui.js:790-791`) pero solo tiene sentido con Supabase conectado y con un
    número que al dueño le sirva mostrar.
12. **¿Saltar la intro para quien viene de la landing?** Hoy vería la animación otra vez
    (`index.html:25-36`). Se puede, pero toca la app: decisión suya.
13. **Fecha de inicio de las 40 noches.** Solo está la de fin (`data.js:61`). Si quiere
    decir "noche 7 de 40" en algún lado, hace falta.

---

## 10. CRITERIOS DE ACEPTACIÓN (verificables, no opinables)

**La verdad visual es Edge headless a PNG. El panel de navegador embebido de esta máquina
NO sirve** — no compone frames ("Browser pane is not displayed") y además reporta mal
`getComputedStyle`/`checkVisibility` para `visibility` (KN-006 en
`C:\Users\Kalel\fable 5\wrd\memory\wrd\state.json`: en la sesión 4 se perdieron varias
iteraciones creyéndole al panel). Comando exacto, con perfil fresco:

    & "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=390,844 --virtual-time-budget=6000 --user-data-dir="$env:TEMP\edge-wrd-lp" --screenshot="$env:TEMP\lp-movil.png" "http://localhost:4181/landing.html"

y otra igual con `--window-size=1440,900`. Después **abrí los PNG y miralos**.

Se acepta si y solo si:
1. **Móvil 390×844:** en el primer viewport se ven, sin scroll: el logo, la tagline, el
   contador con un número de noches y el CTA. Comprobado en el PNG.
2. **Escritorio 1440×900:** ninguna sección con línea de texto de más de ~75 caracteres;
   la grilla de catálogo no deja huecos rotos.
3. **El contador coincide con `data.js:61`.** Prueba: en una COPIA del repo, cambiá
   `fechaFin` a `"2026-08-20T23:59:00-05:00"` → la landing debe decir "N noches" con N
   coherente y el copy del tramo correspondiente; ponela en el pasado
   (`"2020-01-01T00:00:00-05:00"`) → debe mostrar "Las puertas están cerradas." y el CTA
   debe cambiar a la variante de fase privada (no puede seguir invitando a registrarse
   como si nada). Dos capturas PNG como evidencia.
4. **Cero datos hardcodeados.** `grep -nE "22\.?000|15\.?000|Gomitas|Fresas con|Brownie|夢|夜" landing.html`
   no devuelve nada. Los productos y los rangos salen del store / `WRD_DATA`.
5. **Cero hex sueltos en `css/landing.css`:** `grep -nE "#[0-9a-fA-F]{3,8}\b" css/landing.css`
   devuelve 0 líneas (todo va por token `--wrd-`).
6. **Cero fugas y cero inventos:** `grep -nE "proveedor\.html|premium\.html|wa\.me|573001234567|wrd\.example\.com|Week Relax" landing.html css/landing.css js/landing.js`
   devuelve 0 líneas.
7. **Cero dependencias nuevas:** `grep -nE "https?://|cdn|unpkg|jsdelivr" landing.html css/landing.css js/landing.js`
   devuelve 0 líneas (las fuentes ya vienen de `css/base.css:24`).
8. **Ni una imagen fuera del logo:** `grep -n "<img" landing.html` solo puede apuntar a
   `assets/logo.svg`.
9. **No se carga el portón:** `grep -n "gate-ui\|auth.js\|intro.js\|pedido-modal" landing.html`
   devuelve 0 líneas, y la captura PNG no muestra ningún overlay negro con formulario.
10. **Solo lectura:** `grep -nE "localStorage|sessionStorage|sembrar\(|insert\(|update\(" js/landing.js`
    devuelve 0 líneas.
11. **Un solo CTA:** todos los botones de acción llevan al mismo destino (`index.html`) y
    dicen lo mismo. Contalos en el HTML.
12. **Degradación:** con la red de fuentes caída y con `WRDProductos` fallando (simulalo
    renombrando temporalmente `js/productos-store.js` en una copia), la página sigue
    legible y sin secciones rotas: o muestra la semilla, o esconde la sección.
13. **Accesibilidad:** contraste AA en todo texto normal (nada de blanco sobre naranja:
    usá `--wrd-sobre-naranja`, `css/base.css:66-67`); todo lo interactivo alcanzable por
    Tab con foco visible; los kanji decorativos con `aria-hidden="true"` como ya hace
    `js/gate-ui.js:358`.
14. **`prefers-reduced-motion: reduce`** apaga TODA animación (verificalo con una captura
    en un perfil que la fuerce).
15. **La app sigue intacta:** `git status` muestra exactamente 3 archivos nuevos
    (`landing.html`, `css/landing.css`, `js/landing.js`) y CERO modificados.
16. **Prueba de humo de negocio, la que decide:** alguien que nunca oyó de WRD lee la
    landing en el móvil y puede responder sin ayuda: qué venden, cuánto cuesta lo más
    barato, hasta cuándo puede entrar solo, y qué pasa si llega tarde.
