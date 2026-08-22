# PROMPT — DEMO web de Orama Inmobiliaria (login → home 3D → catálogos)

> **Para:** Claude Design.
> **Entregable:** UN solo archivo `index.html` autocontenido, sin build, sin frameworks, sin CDN de JS/CSS.
> **Naturaleza:** MODELO DE VENTA para enseñarle al cliente. Navegación simulada, sin backend.
> **Fecha del encargo:** 2026-08-21.
> **Marca:** real y fija. **Catálogo:** ficticio y autorizado (ver §1.B).

---

## 0. Lo primero: qué es esto y qué NO es

Estás construyendo la **maqueta navegable** que la agencia le va a mostrar a Orama Inmobiliaria para que el cliente vea "cómo se sentiría" su web. No es la web de producción. Por eso:

- **Sí hay** navegación real entre pantallas (login → home → catálogo arriendo / catálogo venta → ficha de inmueble), filtros que filtran de verdad (sobre un array en memoria), animaciones completas, y datos de inmueble completos.
- **No hay** backend, base de datos, envío de formularios, autenticación real, API de mapas, ni pasarela. El botón "Entrar" entra con cualquier cosa escrita (incluso vacío). Los botones de WhatsApp abren un aviso de demo, no `wa.me`.
- Toda pantalla lleva, en el pie, la marca de agua textual `Demo · sin funcionalidad real` (11px, `--cal-dim`, `letter-spacing:.18em`, mayúsculas). Eso protege a la agencia de que el cliente crea que ya está funcionando.

Quien mira la pantalla es **un cliente afuera decidiendo si compra el servicio**, no un trabajador adentro. Registro de **VENTA**: color, movimiento, producto (las casas) protagonista. Nada de minimalismo austero.

---

## 1. El negocio y los datos

### 1.A — Lo que es REAL y no se toca (fuentes citadas)

| Dato | Valor | Origen |
|---|---|---|
| Nombre | **Orama Inmobiliaria** — fijo, no negociable | `fable 5\orama\memory\orama\brief.md:7`; `fable 5\orama\memory\orama\state.json:63` (CON-001) |
| Significado | *orama* = "visión" en griego (ὅραμα) | `brief.md:7` |
| Logo | Ventana en arco con sol en el horizonte | `brief.md:8`; SVG exacto en `propuesta-orama.html:421-425` |
| Tinta | `#0F2E36` (oscuro, confianza) | `brief.md:10` |
| Cal | `#F4EDDF` (cálido, neutral) | `brief.md:11` |
| Ámbar | `#FFB648` (energía, calidez) | `brief.md:12` |
| Teja | `#E2734B` (tierra, raíces) | `brief.md:13` |
| Verde WhatsApp | `#2ED96E` — **solo** para elementos de WhatsApp | `brief.md:14`; comentario `propuesta-orama.html:19` |
| Tipografías | Fraunces (display) · Instrument Sans (texto) · Caveat (notas a mano) | `brief.md:16-18` |
| Bot | se llama **Ori**, atiende por WhatsApp 24/7 | `brief.md:43`; `state.json:49` (DEC-003) |
| Cuello de botella del cliente | falta **INVENTARIO** (casas para ofrecer), no demanda | `brief.md:37`; `state.json:48-49` (DEC-003) |

**Consecuencia estratégica que debe verse en la demo:** como al cliente le faltan casas, la pantalla no puede ser solo un buscador. En el home, junto a las dos opciones del comprador, va una **tercera puerta más discreta pero permanente: "Tengo un inmueble"** (captación de propietarios) — es el objetivo comercial nº1 del negocio (`brief.md:42`). No compite con la acción principal: vive abajo, como franja, no como tercer slide (ver §4.2).

### 1.B — Lo que es DEMO

> ### ⚠️ [DATOS DEMO — inmuebles, precios, barrios, fotos y códigos son FICTICIOS, inventados con autorización explícita del dueño de la agencia el 2026-08-21]
>
> Todo el §6 (catálogo) es material de exhibición. **Debe aparecer visible en la propia página**, no solo en este prompt: una cinta fija en el pie de ambos catálogos que diga, en Instrument Sans 12px sobre `--teja`:
> `Inmuebles de muestra. Precios y direcciones ficticios, para efectos de demostración.`
> Sin eso, el cliente puede creer que ya subimos su inventario.

### 1.C — Lo que NO se inventa (huecos, §9)

Teléfono/WhatsApp real, dirección de la oficina, ciudad real de operación, horario, nombre de los asesores. **No los rellenes con nada verosímil.** Van como marcadores `[HUECO n]` visibles en la página, con fondo `rgba(255,182,72,.16)` y borde punteado `1px dashed var(--ambar)` — que se vean, para que el cliente los llene en la reunión.

---

## 2. Quién mira, qué debe sentir, qué debe hacer

- **Audiencia:** el dueño de Orama Inmobiliaria, en una reunión, probablemente desde un celular o un portátil, decidiendo si paga $1.000.000 COP (`brief.md:22`).
- **Qué debe sentir:** "esto se ve más caro de lo que me está costando, y se ve *mío*". Confianza (Tinta), calidez de hogar (Cal/Ámbar/Teja), y que sus casas se ven bien.
- **Acción principal, UNA:** que atraviese el flujo completo `login → home → deslizar → catálogo → abrir una ficha` sin que nadie le explique nada. Todo lo demás está subordinado a eso.
- **Anti-objetivo:** que se quede admirando una animación y no llegue al catálogo. Si una animación retrasa la llegada a las casas, se recorta.

---

## 3. Arquitectura técnica (heredada de la plantilla de calidad)

**Reutiliza la ARQUITECTURA de** `C:\Users\Kalel\ORION\prompts-landing\plantillas\login-video-pixel-locked.md` — es el estándar de calidad que entregó el dueño el 2026-08-21. Concretamente sus secciones 0, 2, 5, 6, 7:

1. **Un solo `index.html`**, todo inline (CSS, JS, SVG, imágenes). `<!DOCTYPE html>`, `<html lang="es">`, `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, `<title>Orama Inmobiliaria</title>`.
2. **Media hero con `poster`** en el login, para que el primer pintado nunca sea un hueco vacío (plantilla §2).
3. **Tokens calibrados en `:root`**, valores explícitos, no aproximaciones (plantilla §3).
4. **Motor responsive de 3 modos por JS** con `clearInline()` obligatorio en cada cambio de modo (plantilla §6) — **aplícalo SOLO a la pantalla de login**, que es la única composición escalada. Home y catálogos son maquetación de flujo normal (grid + clamp), sin escalado de viewport: ahí el escalado haría el texto ilegible en móvil. Dilo así en un comentario del código.
5. **Animación de entrada WAAPI que corre una sola vez, con pre-paint guard** `entry-pending` en `<html>` desde un `<script>` en `<head>` antes de la hoja de estilos, con liberación de seguridad a 3500 ms (plantilla §7). Sin JS, la página se ve completa: no pongas `<noscript>`.

> **Los números de la plantilla pertenecen al diseño "Signal" y NO se copian.** Todos los tokens de tamaño, tracking, posición y tiempo se **recalibran** al diseño Orama; los valores base están en §5 y §7 de este documento. Si heredas un `--hl1-fs:69.14px` de Signal, lo hiciste mal.

**Permitido:** una única petición externa, la de tipografías, exactamente la que ya usa la propuesta aprobada:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600&family=Caveat:wght@500;600&display=swap">
```
(origen: `propuesta-orama.html:3-4`). Si puedes incrustar las tres familias como `data:font/woff2` en `@font-face`, mejor — es lo que pide la plantilla §1 — pero entonces declara `font-display:block`. En cualquiera de los dos casos, define pilas de respaldo para que sin red no se vea roto:
- Display: `"Fraunces",Georgia,"Times New Roman",serif`
- Texto: `"Instrument Sans",system-ui,-apple-system,"Segoe UI",sans-serif`
- Mano: `"Caveat",cursive`

**Prohibido:** three.js, GSAP, Tailwind CDN, Google Maps, iconos de librería, cualquier `<script src>` externo. El 3D es CSS (§7.E).

**Presupuesto de peso:** el archivo final ≤ **4,5 MB**. Si te pasas, baja las fotos secundarias de las fichas de 2 a 1 antes de tocar la foto principal de tarjeta. Reporta el peso final en un comentario al inicio del archivo.

---

## 4. Las cuatro pantallas

Router simulado por hash: `#/login`, `#/home`, `#/arriendo`, `#/venta`. Una función `ir(vista)` que conmuta `hidden` en cuatro `<section>` y anima la transición (A18/A19 de §7.A). `history.pushState` para que el botón atrás del navegador funcione — es lo primero que prueba cualquiera en una demo. Arranca siempre en `#/login`. La ficha de inmueble es un overlay, no una vista de router (se cierra con Esc y con el botón atrás).

### 4.1 — LOGIN (`#/login`)

**Propósito de venta:** que en 2 segundos el cliente diga "esa es mi marca y esa es una casa bonita".

Composición heredada de la plantilla §5, recalibrada. Marco de referencia **1440×900**:

```
--W:1440; --H:900; --mediaW:822; --paneW:618; --cardW:548; --cardH:812;
```

- `.stage{position:fixed;inset:0;overflow:hidden}`
- `.media` — columna izquierda, `width:57.083%` (822/1440), `overflow:hidden`. Dentro: la media hero (§8.A) a `object-fit:cover; object-position:56% 50%`, un `.scrim` (apagado en escritorio, encendido en móvil) y el `.hero` con:
  - **Sello Orama**: el SVG del arco con sol, 64px de alto, trazo `#F4EDDF` 5px, sol `#FFB648` — copia literal de los tres `path` de `propuesta-orama.html:422-424`.
  - **Badge** (píldora, alto 36px, `padding:0 16px 0 18px`, `border-radius:999px`, fondo `rgba(10,33,41,.72)`, `backdrop-filter:blur(7px) saturate(120%)`, texto Cal 13px `letter-spacing:.02em`): **"Casas en Pasto, con quien responde"** → *[texto DEMO: si el cliente opera en otra ciudad, cambia solo esta palabra, ver HUECO 3]*.
  - **Titular** Fraunces 600, dos líneas, `line-height:.98`, `letter-spacing:-.02em`, tamaño base 58px sobre el marco de 1440: línea 1 **"Un catálogo"**, línea 2 **"con puertas abiertas."** Color `--cal`, `text-shadow:0 2px 22px rgba(6,20,26,.42)` (lo necesita para leerse sobre la foto).
  - **Nota a mano** Caveat 500, 22px, `--ambar`, rotada `-2deg`, debajo del titular: *"entra y mira lo que hay hoy"*.
- `.panel` — columna derecha, fondo `--tinta-0 #0A2129`. Dentro `.card`: `width:548px; height:812px; border-radius:24px; background:rgba(15,46,54,.86); backdrop-filter:blur(26px) saturate(150%); border:1px solid rgba(151,199,211,.16); box-shadow:1px 10px 28px rgba(3,12,16,.42), 0 1px 3px rgba(3,12,16,.30)`.
  - `.card-in` de 548×812 con `transform-origin:left top`, escalado por JS (plantilla §6, modo `land`).
  - **H1** Fraunces 600, 38px, `letter-spacing:-.022em`, Cal: **"Bienvenido a Orama"**.
  - **Sub** Instrument Sans 400, 16px, `--cal-dim`: **"Entra al catálogo. Casas en arriendo y en venta, actualizadas."**
  - Campo **usuario** (`type="email"`, `autocomplete="email"`, `aria-label="Correo"`, placeholder `Ej. andrea@correo.com`), alto 58px, fondo `rgba(244,237,223,.06)`, borde `1.5px solid rgba(151,199,211,.28)`, radio 12px, texto Cal, `caret-color:var(--ambar)`, **`font-size:16px` en móvil** (evita el zoom de iOS).
  - Campo **clave** (`type="password"`, `autocomplete="current-password"`, placeholder `Contraseña`), alto 58px, fondo `rgba(244,237,223,.04)`, sin borde.
  - **Botón principal** `#btnEntrar`, ancho completo, alto 62px, `border-radius:999px`, fondo `linear-gradient(180deg,#FFB648 0%,#F0A335 100%)`, texto `#0F2E36` Instrument Sans 600 17px, más una flecha SVG inline (`viewBox="0 0 22 22"`, `d="M3 11h15.4M11 3.3l7.7 7.7-7.7 7.7"`, `stroke="#0F2E36"`, `stroke-width="2.6"`, `linecap/linejoin round`). Etiqueta: **"Entrar al catálogo"**.
  - **Divisor** con la palabra **"o"** (Instrument Sans 700, 11px, `letter-spacing:.8px`, `--cal-dim`) entre dos reglas de `1.5px` de `rgba(151,199,211,.22)`. Asimetría deliberada como en la plantilla: la regla izquierda `flex:0 0 186px`, la derecha `flex:0 0 185px`.
  - **Botón secundario** `#btnWa`: borde `1.5px solid rgba(46,217,110,.45)`, fondo `rgba(46,217,110,.08)`, texto `#2ED96E`, ícono WhatsApp SVG inline, etiqueta **"Escríbele a Ori por WhatsApp"**. Al pulsarlo: aviso de demo (§4.5), NO abre `wa.me`.
  - **Pie de la card**: `¿Tienes una casa para arrendar o vender? ` + enlace subrayado (`text-underline-offset:3px`, `text-decoration-thickness:2px`, color `--ambar`) **"Publícala con nosotros"** → lleva a `#/home` y hace scroll a la franja de captación.
- **Sin `<form>`, sin submit.** Ambos botones `type="button"`. `#btnEntrar` corre un spinner teatral de exactamente **900 ms** (A20) y luego `ir('home')`. Entra con los campos vacíos: si el cliente teclea algo, también entra. Nunca muestres un error.

### 4.2 — HOME (`#/home`)

**Propósito de venta:** el momento "wow" de la demo, y la bifurcación. Dos opciones **deslizables**, una sola decisión.

Fondo: el mismo cielo de la propuesta —
```css
background:
  radial-gradient(1200px 520px at 50% 106%, rgba(255,182,72,.14), transparent 62%),
  linear-gradient(180deg,#0A2129 0%,#0C2830 55%,#0F2E36 100%);
```
(heredado de `propuesta-orama.html:45-47`).

Orden vertical:
1. **Barra superior** (56px, `position:sticky`, `backdrop-filter:blur(10px)`, fondo `rgba(10,33,41,.72)`, borde inferior `1px solid rgba(151,199,211,.16)`): sello del arco 26px + "orama" Fraunces 600 20px + "INMOBILIARIA" 9px `letter-spacing:.42em` `--ambar`. A la derecha, botón fantasma "Salir" que devuelve a `#/login`.
2. **Saludo**: Fraunces 600, `clamp(1.9rem,5.6vw,2.9rem)`, `text-wrap:balance`, Cal: **"¿Qué estás buscando hoy?"** + nota Caveat `--ambar` rotada `-2deg`: *"desliza para elegir →"*.
3. **La maqueta 3D** (§7.B). Alto 240–320px en móvil. Es el elemento que responde al deslizamiento del selector.
4. **El selector deslizable** (§7.C): dos tarjetas-puerta a pantalla casi completa.
   - Slide 1 — **"Comprar casa"**, subtítulo `4 inmuebles en venta` `[DEMO]`, acento **Teja `#E2734B`**, ícono: llave. Destino `#/venta`.
   - Slide 2 — **"Arrendar casa"**, subtítulo `4 inmuebles en arriendo` `[DEMO]`, acento **Ámbar `#FFB648`**, ícono: puerta abierta. Destino `#/arriendo`.
   - *(El dueño dijo "vender o arrendar"; se resuelve como **Comprar / Arrendar** porque son las dos cosas que hace quien BUSCA, y la demo se navega desde los ojos del buscador. Vender es lo que hace el propietario, y eso vive en la franja de captación del punto 6.)*
5. **Indicadores**: dos puntos; el activo se estira de 8px a 26px (A25).
6. **Franja de captación** (el objetivo comercial nº1, `brief.md:42`): banda de ancho completo, fondo `--tinta-2 #153B45`, borde superior `3px solid var(--teja)`, con título Fraunces 24px **"¿Tienes una casa vacía?"**, línea de apoyo Instrument Sans `--cal-dim` **"Publícala con Orama. Nosotros la mostramos, filtramos y te llevamos solo a quien va en serio."** y botón verde WhatsApp **"Publicar mi inmueble"** → aviso de demo. Es visualmente más pequeña que el selector: no compite.
7. **Pie** con el sello Orama, los HUECOS de contacto (§9) y las dos marcas de agua (demo + datos ficticios).

### 4.3 — CATÁLOGOS (`#/arriendo` y `#/venta`)

Son la MISMA plantilla, alimentada por el mismo array con distinto filtro `operacion`. No dupliques marcado.

1. **Barra superior sticky** igual que en el home + un **conmutador segmentado** `Arriendo | Venta` (píldora, fondo `rgba(244,237,223,.08)`, la pestaña activa con fondo Ámbar y texto Tinta). Cambia de vista sin recargar.
2. **Encabezado** (≤300px de alto en móvil): título Fraunces 600 `clamp(1.7rem,5vw,2.5rem)` — *"Casas en arriendo"* / *"Casas en venta"* — más contador en vivo: **"4 inmuebles disponibles"** (se actualiza al filtrar).
3. **Chips de filtro**, fila con scroll horizontal, `scroll-snap-type:x proximity`, sin barra visible. Filtran de verdad sobre el array en memoria: `Todos` · `1–2 habitaciones` · `3+ habitaciones` · `Con parqueadero` · `Estrato 3` · `Estrato 4`. Chip activo: fondo `--ambar`, texto `--tinta-1`. Si un filtro deja 0 resultados, muestra un estado vacío con la nota Caveat *"no hay nada con ese filtro… todavía"* y un botón "Ver todos". Nunca una pantalla en blanco.
4. **Grid de tarjetas**: 1 columna <640px, 2 columnas 640–1023px, 3 columnas ≥1024px, `gap:20px`, ancho máximo del contenedor 1180px.
5. **Anatomía de la tarjeta** (fondo `--papel #F6EFE1`, texto `--tinta-papel #16323A`, radio 14px, sombra `0 4px 18px rgba(3,12,16,.35)`, `overflow:hidden`):
   - Foto en relación **3:2**, arriba, `object-fit:cover`.
   - **Insignia de operación** sobre la foto, esquina superior izquierda: `EN ARRIENDO` fondo `--ambar` / `EN VENTA` fondo `--teja` texto `#F6EFE1`; 10px, `letter-spacing:.18em`, mayúsculas, radio 4px, `padding:4px 9px`.
   - **Píldora de estrato** esquina superior derecha: `Estrato 4`, fondo `rgba(15,46,54,.82)`, texto Cal, 11px.
   - **Precio** en Fraunces 700, 26px, `font-variant-numeric:tabular-nums`, formato colombiano con puntos de miles y `$` — `$1.450.000` seguido de `/mes` en Instrument Sans 13px `--tinta-papel-2` (solo en arriendo). En venta, el precio va solo.
   - **Titular** del inmueble, Instrument Sans 600, 16px, 2 líneas máximo (`-webkit-line-clamp:2`).
   - **Ubicación**: ícono de pin SVG inline + `Barrio, Ciudad`, 13px, `--tinta-papel-2`.
   - **Fila de specs** con 4 íconos SVG inline dibujados por ti (cama, ducha, regla/área, carro), separados por `1px` de `--papel-2`: `3 hab · 2 baños · 78 m² · 1 parq.`
   - **Botón** ancho completo, alto 44px, fondo `--tinta-1`, texto Cal, radio 10px: **"Ver ficha completa"**.
6. **Cinta de datos ficticios** (§1.B) fija al pie del listado.

### 4.4 — FICHA DE INMUEBLE (overlay)

Es donde se cumple el requisito "datos claros y completos". Overlay `position:fixed;inset:0;z-index:60;overflow-y:auto`, fondo `rgba(6,20,26,.80)` + `backdrop-filter:blur(6px)`, panel `--papel`, ancho `min(760px,100%)`, radio 16px arriba (hoja inferior en móvil: `border-radius:20px 20px 0 0`, entra desde abajo). Cierra con la X, con `Esc`, con clic en el fondo y con el botón atrás del navegador. Devuelve el foco al botón que la abrió.

Contenido, en este orden:
1. **Galería**: 3 fotos, la principal grande + dos miniaturas; cambio con crossfade de 260 ms (A30). Flechas ← → y swipe. Contador `1/3`.
2. **Banda de cabecera** fondo `--tinta-1`, texto Cal: código del inmueble (`ORA-A-102`) a la izquierda, estado (`Disponible` en `--wa` / `Reservado` en `--teja`) a la derecha.
3. **Precio** Fraunces 700 34px + `/mes` + línea inmediata con **administración**: `+ $180.000 de administración` (arriendo) o `Predial y escrituras a cargo del comprador` (venta).
4. **Titular** Fraunces 600 22px + ubicación completa.
5. **Tabla de datos** — `<dl>` en grid `repeat(auto-fit,minmax(150px,1fr))`, celdas `--papel` separadas por 1px de `--papel-2`, `dt` 10px `letter-spacing:.18em` mayúsculas `--tinta-papel-2`, `dd` 15px 600 (mismo patrón que `propuesta-orama.html:251-258`). Campos obligatorios, TODOS presentes en los 8 inmuebles:
   `Tipo` · `Operación` · `Precio` · `Administración` · `Estrato` · `Ciudad` · `Barrio` · `Área construida` · `Área del lote` (o `—`) · `Habitaciones` · `Baños` · `Parqueaderos` · `Piso / Niveles` · `Antigüedad` · `Estado del inmueble` · `Servicios incluidos` · `Mascotas` · `Requisitos` (arriendo) o `Forma de pago` (venta) · `Disponible desde` · `Código`.
6. **Descripción** en prosa, 3–5 frases, tono de asesor que conoce el barrio, sin adjetivos de folleto ("hermoso", "exclusivo", "de ensueño" están prohibidos). Habla de luz, orientación, ruido, cercanías reales al barrio ficticio.
7. **Lista de características** con viñeta `✓` en `--teja` (patrón de `propuesta-orama.html:259-261`): 5–7 ítems.
8. **Mini plano del sector**: NO uses ninguna API de mapas. Dibuja un SVG estilizado heredado del plano de la propuesta (`propuesta-orama.html:454`, clases `.calle`/`.manzana` con `stroke-dasharray:2 11` y la animación `hormigas`), con un pin Ámbar y la nota `Ubicación aproximada, referencial`.
9. **Cierre**: botón WhatsApp verde ancho completo **"Preguntar por esta casa"** → aviso de demo, más la nota Caveat *"Ori te responde en menos de un minuto, a cualquier hora"*.

### 4.5 — Aviso de demo (modal reutilizable)

Un solo componente, invocado por todo botón sin función. Panel `--papel`, 320px, radio 12px, sello Orama arriba, título Fraunces 18px **"Esto es una demostración"**, cuerpo: **"En la versión real, este botón abre WhatsApp y te contesta Ori."** Botón único **"Entendido"**. Aparece con `scale(.96)→1` + opacidad en 240 ms. Nunca uses `alert()`.

---

## 5. Paleta, contraste y tipografía

### 5.A — Tokens (`:root`), heredados de `propuesta-orama.html:8-24`

```css
:root{
  --tinta-0:#0A2129;   /* cielo profundo: fondo de app */
  --tinta-1:#0F2E36;   /* Tinta de marca: superficie base */
  --tinta-2:#153B45;   /* superficie elevada: barras, franjas */
  --linea:rgba(151,199,211,.34);
  --linea-suave:rgba(151,199,211,.16);
  --cal:#F4EDDF;       /* texto principal sobre oscuro */
  --cal-dim:#A9C3C9;   /* texto secundario sobre oscuro */
  --ambar:#FFB648;     /* acento 1: arriendo, CTA principal, sol */
  --ambar-suave:rgba(255,182,72,.16);
  --teja:#E2734B;      /* acento 2: venta, sellos, viñetas */
  --wa:#2ED96E;        /* SOLO WhatsApp/Ori */
  --papel:#F6EFE1;     /* tarjetas y fichas */
  --papel-2:#EDE3CE;
  --tinta-papel:#16323A;
  --tinta-papel-2:#5B7078;
}
```

**"El azul oscuro me llama la atención"** (dueño, 2026-08-21): ese azul oscuro **es la Tinta `#0F2E36` de la marca**, ya decidida en `brief.md:10`. No hay que buscar otro. Es la base de toda la demo: fondo de las tres pantallas, barras, banda de cabecera de la ficha y color de texto sobre el papel. No es un azul eléctrico ni un morado — es un petróleo profundo, y por eso cumple la prohibición del sistema del dueño.

### 5.B — Contraste calculado (WCAG 2.1, medido, no estimado)

| Texto | Fondo | Ratio | Uso permitido |
|---|---|---|---|
| `#F4EDDF` Cal | `#0F2E36` Tinta | **12,31** | cualquier tamaño |
| `#F4EDDF` Cal | `#0A2129` | **14,28** | cualquier tamaño |
| `#F4EDDF` Cal | `#153B45` | **10,34** | cualquier tamaño |
| `#A9C3C9` Cal-dim | `#0F2E36` | **7,74** | cualquier tamaño |
| `#A9C3C9` Cal-dim | `#153B45` | **6,50** | cualquier tamaño |
| `#FFB648` Ámbar | `#0F2E36` | **8,22** | cualquier tamaño |
| `#FFB648` Ámbar | `#153B45` | **6,90** | cualquier tamaño |
| `#0F2E36` Tinta | `#FFB648` Ámbar | **8,22** | texto del botón principal ✅ |
| `#16323A` | `#F6EFE1` Papel | **11,83** | texto de tarjeta y ficha |
| `#5B7078` | `#F6EFE1` Papel | **4,55** | ✅ solo ≥14px; ❌ nunca bajo 14px |
| `#2ED96E` WA | `#0F2E36` | **7,69** | texto y borde de WhatsApp |
| `#E2734B` Teja | `#0F2E36` | **4,64** | ⚠️ **solo ≥18px o ≥14px negrita**; prohibido en texto corrido |
| `#E2734B` Teja | `#F6EFE1` Papel | **2,70** | ❌ **FALLA. Prohibido como texto sobre papel.** Teja sobre papel solo como **fondo de insignia** (con texto `#F6EFE1` encima), **borde** o **viñeta ✓** decorativa. Para texto naranja sobre papel usa `#B5522E` (ratio ≥ 5,3) — pero no lo llames Teja, es una variante de servicio. |

La insignia `EN VENTA` (texto `#F6EFE1` sobre fondo `#E2734B`) queda en **2,70** y es texto pequeño: **no vale**. Corrígela así: fondo `#E2734B` con texto `#2A1206` (ratio ≈ 7,0), o fondo `--tinta-1` con texto `--teja` a 11px negrita — elige una y aplícala en las dos apariciones (tarjeta y ficha).

### 5.C — Tipografía

| Rol | Familia | Peso | Tamaño | Tracking |
|---|---|---|---|---|
| Titular de pantalla | Fraunces | 600 | `clamp(1.9rem,5.6vw,3.4rem)` | `-.02em` |
| Titular de tarjeta / ficha | Fraunces | 600 | 16px / 22px | `-.01em` |
| Precio | Fraunces | 700 | 26px (tarjeta) / 34px (ficha) | `-.015em`, `tabular-nums` |
| Cuerpo | Instrument Sans | 400 | 15–17px, `line-height:1.6` | 0 |
| Etiqueta de dato (`dt`) | Instrument Sans | 500 | 10px mayúsculas | `.18em` |
| Nota a mano | Caveat | 500 | 20–24px, rotada `-2deg` | 0 |

Fraunces es variable (`opsz 9..144`): en titulares ≥40px usa `font-variation-settings:'opsz' 96` para que las serifas se afinen; en 16px usa `'opsz' 14`. Es la diferencia entre "usé la fuente" y "usé bien la fuente".

**Las notas a mano en Caveat son parte de la marca** (`brief.md:18`, clase `.mano` en `propuesta-orama.html:38`): pon **exactamente una por pantalla**, no más. Login, home, catálogo y ficha: una cada uno. Dos en la misma pantalla la abaratan.

### 5.D — El Sello Orama como referencia de calidad

El logo (arco + sol) aparece en **exactamente cinco lugares**, y en ninguno más:
1. Hero del login, 64px, animado al entrar (A2–A4).
2. Barra superior del home y de los catálogos, 26px, estático.
3. Modal de aviso de demo, 32px.
4. Pie de página, 40px, con el lockup completo `orama` + `INMOBILIARIA`.
5. Marca de agua en la ficha: el arco a 180px, `opacity:.05`, `--cal`, detrás de la tabla de datos, `pointer-events:none`.

El lockup completo se compone así (heredado de `propuesta-orama.html:426-427`): "orama" en Fraunces 600 minúscula, y debajo "INMOBILIARIA" a `.5em` de tracking con `padding-left:.5em` para compensar el tracking del último carácter. Ese `padding-left` no es opcional: sin él el lockup queda descentrado.

---

## 6. [DATOS DEMO — ficticios, autorizados por el dueño 2026-08-21] Catálogo

Ocho inmuebles, en un array `const INMUEBLES = [...]` al inicio del `<script>`, con un comentario en mayúsculas que diga que son ficticios. Ciudad demo: **Pasto, Nariño** (ver HUECO 3: si el cliente opera en otra ciudad, cambian solo `ciudad` y `barrio`).

### 6.A — En arriendo (4)

| # | Código | Titular | Barrio | Precio/mes | Admin | Estrato | Área | Hab | Baños | Parq | Piso/Niveles | Antigüedad | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ORA-A-101 | Apartamento luminoso con vista al Galeras | La Aurora | $1.450.000 | $180.000 | 4 | 78 m² | 3 | 2 | 1 | Piso 6 de 8 | 6 años | Disponible |
| 2 | ORA-A-102 | Casa de dos pisos con patio y taller | Torobajo | $2.300.000 | — | 4 | 145 m² (lote 180 m²) | 4 | 3 | 2 | 2 niveles | 18 años | Disponible |
| 3 | ORA-A-103 | Apartaestudio a tres cuadras de la Plaza de Nariño | Centro | $850.000 | $120.000 | 3 | 42 m² | 1 | 1 | 0 | Piso 3 de 4 | 12 años | Reservado |
| 4 | ORA-A-104 | Casa con local en primer piso | Fátima | $1.900.000 | — | 3 | 120 m² (lote 150 m²) | 3 | 2 | 1 | 2 niveles | 24 años | Disponible |

Datos complementarios:
1. Servicios incluidos: `Ninguno`. Mascotas: `Sí, hasta dos pequeñas`. Requisitos: `Seguro de arrendamiento o dos codeudores con finca raíz`. Disponible desde: `Inmediato`. Estado del inmueble: `Remodelado en 2024`. Características: piso en porcelanato claro, cocina integral en madera clara, ventanal de 2,4 m en la sala, calentador a gas, ascensor, portería 24 h, depósito en sótano.
2. Servicios incluidos: `Agua`. Mascotas: `Sí`. Requisitos: `Codeudor con finca raíz en Pasto`. Disponible desde: `1 de octubre`. Estado: `Buen estado, pintura nueva`. Características: patio interior de 24 m² con lavadero cubierto, cuarto útil convertible en taller, garaje doble en línea, chimenea en la sala, tres habitaciones con clóset de obra.
3. Servicios incluidos: `Agua, energía e internet`. Mascotas: `No`. Requisitos: `Un codeudor asalariado`. Disponible desde: `15 de septiembre`. Estado: `Amoblado`. Características: amoblado completo, cocina americana, escritorio empotrado bajo la ventana, edificio con vigilancia, a 350 m de la Plaza de Nariño.
4. Servicios incluidos: `Ninguno`. Mascotas: `Sí`. Requisitos: `Seguro de arrendamiento`. Disponible desde: `Inmediato`. Estado: `Requiere pintura`. Características: local de 28 m² con vitrina a la calle y baño independiente, vivienda separada en el segundo piso con entrada propia, patio de ropas, tres habitaciones, cerca del mercado de Fátima.

### 6.B — En venta (4)

| # | Código | Titular | Barrio | Precio | Estrato | Área | Hab | Baños | Parq | Niveles | Antigüedad | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | ORA-V-201 | Casa campestre con huerta y vista al valle | Chachagüí | $520.000.000 | 4 | 210 m² (lote 800 m²) | 4 | 3 | 3 | 2 niveles | 9 años | Disponible |
| 6 | ORA-V-202 | Apartamento con balcón sobre los cerros | Pandiaco | $265.000.000 | 4 | 92 m² | 3 | 2 | 1 | Piso 4 de 6 | 5 años | Disponible |
| 7 | ORA-V-203 | Casa esquinera de tres alcobas y estudio | Las Cuadras | $380.000.000 | 4 | 160 m² (lote 168 m²) | 3 | 3 | 2 | 2 niveles | 15 años | Disponible |
| 8 | ORA-V-204 | Apartamento para estrenar, entrega en diciembre | El Ejido | $185.000.000 | 3 | 64 m² | 2 | 2 | 1 | Piso 7 de 12 | Obra nueva | Disponible |

Datos complementarios:
5. Forma de pago: `Contado o crédito hipotecario`. Administración: `$95.000 (condominio)`. Servicios: `Agua propia (pozo), energía, gas propano`. Estado: `Excelente`. Características: clima templado a 25 minutos de Pasto, huerta con 12 frutales, terraza cubierta de 30 m², chimenea de leña, alcoba principal con vestier, condominio cerrado con portería.
6. Forma de pago: `Contado o crédito hipotecario`. Administración: `$210.000`. Estado: `Excelente`. Características: balcón de 6 m² con vista a los cerros, cocina abierta con isla, ascensor, salón comunal, zona de BBQ, dos ascensores, a 5 minutos de la Universidad de Nariño.
7. Forma de pago: `Contado, crédito o permuta por apartamento`. Administración: `—`. Estado: `Buen estado`. Características: esquinera con luz por dos costados, estudio independiente en el segundo piso, patio de 20 m², garaje cubierto para dos carros, calentador de paso, barrio residencial tranquilo.
8. Forma de pago: `Cuota inicial en 12 meses + crédito`. Administración: `$150.000 (proyectada)`. Estado: `Obra nueva, entrega diciembre`. Características: acabados a elegir, cocina integral incluida, ventanería en PVC, gimnasio y salón social, parqueadero cubierto, subsidio de vivienda aplicable.

**Formato de precio en pantalla:** siempre con separador de miles de punto y símbolo `$` — `$1.450.000`, `$520.000.000`. Nunca `COP 1450000` ni `1.45M`. En el `dl` de la ficha, el precio de arriendo se escribe `$1.450.000 mensuales`.

---

## 7. Inventario de animación (cerrado y numerado)

Todo lo que se mueve está aquí. **Si no está en esta lista, no se anima.** Formato: elemento · gesto · disparador · retardo/duración · curva.

Curvas nombradas (declaradas una vez):
`--e-salida:cubic-bezier(.4,0,1,1)` · `--e-entrada:cubic-bezier(.16,1,.3,1)` · `--e-suave:cubic-bezier(.22,1,.36,1)` · `--e-tacto:cubic-bezier(.2,.7,.3,1)` · `--e-trazo:cubic-bezier(.6,0,.3,1)`

### 7.A — Entrada del login (WAAPI, corre UNA sola vez; plantilla §7)

| # | Elemento | Gesto (from →) | Disparador | Retardo | Dur. | Curva |
|---|---|---|---|---|---|---|
| A1 | `.card` | `opacity:0`, `translateY(12px) scale(.988)` (compacto: `translateY(14px)`) | carga | 40 | 820 | entrada |
| A2 | arco del logo | `stroke-dashoffset:340 → 0` | carga | 120 | 1100 | trazo |
| A3 | línea de horizonte | `stroke-dashoffset:60 → 0` | carga | 780 | 520 | salida-suave (`ease-out`) |
| A4 | sol | `opacity:0`, `translateY(10px)` | carga | 900 | 700 | `ease-out` |
| A5 | `.badge` | `opacity:0`, `translateY(8px)` | carga | 170 | 480 | suave |
| A6 | titular línea 1 | `translateY(16px)` + `clip-path:inset(100% 0 0 0)` | carga | 300 | 760 | entrada |
| A7 | titular línea 2 | ídem | carga | 390 | 760 | entrada |
| A8 | nota Caveat | `opacity:0`, `rotate(-8deg) translateY(6px)` → `rotate(-2deg)` | carga | 1150 | 620 | suave |
| A9 | `#h1` | `translateY(10px)` | carga | 520 | 620 | entrada |
| A10 | `#sub` | `translateY(10px)` | carga | 610 | 560 | entrada |
| A11 | `#usuario` | `translateY(8px)` | carga | 740 | 520 | suave |
| A12 | `#clave` | `translateY(8px)` | carga | 810 | 520 | suave |
| A13 | `#btnEntrar` | `translateY(8px)` | carga | 950 | 560 | entrada |
| A14 | `.divisor` | `translateY(6px)` | carga | 1080 | 440 | suave |
| A15 | `#btnWa` | `translateY(8px)` | carga | 1160 | 540 | entrada |
| A16 | pie de la card | `translateY(6px)` | carga | 1270 | 500 | suave |

Todos los `to` son `{opacity:1, transform:'none'}` (los titulares además `clipPath:'inset(0 0 0 0)'`). **El último píxel se asienta en 1770 ms.** Intención, en orden: *la superficie establece profundidad → la marca se dibuja sola → el formulario se resuelve al final.*
Disparo: `Promise.race([document.fonts.ready, timeout 650ms])` + doble `requestAnimationFrame`. Al terminar: `Promise.allSettled(...)` → `cancel()` de todas → quitar `entry-pending` y limpiar `will-change`. **La media hero NO se anima nunca: es el escenario.**

### 7.B — Continuas

| # | Elemento | Gesto | Disparador | Dur. | Curva |
|---|---|---|---|---|---|
| A17 | poster/video del login | Ken Burns: `scale(1) → scale(1.06)` + `translate(0,0) → translate(-1.2%,-1%)` | carga | 28000, `alternate infinite` | `ease-in-out` |
| A18 | maqueta 3D en reposo | `--ry: -22deg → -8deg` | carga del home | 9000, `alternate infinite` | `ease-in-out` |
| A19 | ventanas de la maqueta | `opacity:.25 → 1` escalonadas 140 ms | 400 ms tras entrar al home | 500 c/u, una vez | suave |

A17 y A18 son las **únicas dos animaciones infinitas de todo el archivo**. A17 se apaga si el diseñador consiguió un video real (el video ya se mueve). A18 se pausa mientras el puntero está sobre la escena.

### 7.C — Interacción

| # | Elemento | Gesto | Disparador | Dur. | Curva |
|---|---|---|---|---|---|
| A20 | maqueta 3D | seguimiento del puntero: `--ry` ±14°, `--rx` ±10° alrededor del reposo | `pointermove` sobre `.escena` | 120 (seguimiento) / 600 (regreso al soltar) | linear / entrada |
| A21 | pista del selector | `translate3d(calc(var(--i)*-100%),0,0)` | arrastre, flechas, teclas ←/→ | 520 | suave |
| A22 | tarjeta-puerta inactiva | `rotateY(-12deg) scale(.92) opacity(.55)` ↔ activa `rotateY(0) scale(1) opacity(1)` | mismo que A21 | 520 | suave |
| A23 | indicador activo | `width:8px → 26px` **vía `transform:scaleX()`, no `width`** | cambio de slide | 300 | suave |
| A24 | spinner del login | `rotate(0 → 360deg)` | clic en `#btnEntrar` | 700, `linear infinite`, vive exactamente 900 ms | linear |
| A25 | salida de vista | `opacity:1→0`, `translateY(0 → -10px)` | `ir(vista)` | 260 | salida |
| A26 | entrada de vista | `opacity:0→1`, `translateY(14px → 0)` | 60 ms tras A25 | 420 | entrada |
| A27 | tarjeta de inmueble (aparición) | `opacity:0→1`, `translateY(18px→0) scale(.985→1)` | `IntersectionObserver` `threshold:.18`, `rootMargin:"0px 0px -8% 0px"`, **una sola vez por tarjeta**, escalonado 70 ms, máximo 6 en cola | 560 | entrada |
| A28 | tarjeta (hover, solo puntero fino) | `translateY(-6px)` + sombra `0 4px 18px → 0 14px 34px rgba(3,12,16,.45)` | `:hover` bajo `@media (hover:hover) and (pointer:fine)` | 240 | tacto |
| A29 | foto de la tarjeta | `scale(1 → 1.05)` | hover de la tarjeta | 600 | tacto |
| A30 | botones (todos) | `:hover{filter:brightness(1.08)}` · `:active{transform:translateY(1px)}` | puntero | 180 | tacto |
| A31 | chip de filtro | color de fondo y texto | clic | 200 | tacto |
| A32 | grid al filtrar | las que salen `opacity→0 scale(.97)` 180 ms; las que entran, A27 sin escalonado (`stagger 40`) | clic en chip | 180 / 400 | salida / entrada |
| A33 | overlay de ficha (fondo) | `opacity:0→1` | apertura | 220 | suave |
| A34 | overlay de ficha (panel) | `translateY(28px)→0` + opacidad (móvil: `translateY(100%)→0`) | apertura | 380 | suave |
| A35 | galería de la ficha | crossfade entre fotos | flecha/swipe | 260 | suave |
| A36 | modal de demo | `scale(.96)→1` + opacidad | apertura | 240 | suave |
| A37 | calles del mini plano | `stroke-dashoffset → -260` (hormigas) | visible en la ficha | 26000 linear infinite, **solo mientras la ficha está abierta** | linear |
| A38 | `:focus-visible` | `outline:2px solid var(--ambar); outline-offset:3px` | teclado | 0 | — |

### 7.D — Presupuesto y prohibiciones de movimiento

- **Propiedades animables: `transform`, `opacity`, `clip-path`, `stroke-dashoffset`, `filter:brightness`. Nada más.**
- **Prohibido animar:** `width`, `height`, `top`, `left`, `margin`, `padding`, `background-position`, `box-shadow` en bucle, `filter:blur` ligado al scroll, `backdrop-filter` en transición.
- **Prohibido:** parallax de fondo atado a `scroll`, contadores que suben solos, texto que se escribe letra por letra, confeti, cursor personalizado, elementos que persiguen el mouse, autoplay con sonido.
- Máximo **6 elementos animándose en un mismo frame**. Las tarjetas se revelan de a 6, no las 4/8 de golpe.
- `will-change` **nunca es permanente**: se pone al armar la animación y se retira en `finished`/`animationend`. Máximo 4 elementos con `will-change` vivo a la vez.
- Objetivo: **60 fps en un gama media** (la demo se va a ver en el celular del cliente). Si un efecto no llega, se quita el efecto, no se baja el frame rate.
- `@media (prefers-reduced-motion:reduce)`: todo A1–A37 se apaga (`animation-duration:.01ms!important; transition-duration:.01ms!important`), los trazos SVG quedan en `stroke-dashoffset:0`, sol y titulares en `opacity:1;transform:none`, `html{scroll-behavior:auto}` — mismo patrón que `propuesta-orama.html:408-413`. La página queda **completa y legible**, nunca a medio dibujar.

### 7.E — El 3D, sin dependencias

CSS puro: `perspective` + `transform-style:preserve-3d`. **Nada de three.js, ni WebGL, ni canvas, ni CDN.**

```
.escena{perspective:1200px; perspective-origin:50% 40%}
.maqueta{transform-style:preserve-3d; transform:rotateX(var(--rx,-12deg)) rotateY(var(--ry,-22deg))}
```

Composición de la maqueta — una casita-arquetipo Orama, 240 (ancho) × 150 (alto) × 140 (fondo) px:

| Cara | Transform | Relleno |
|---|---|---|
| frente | `translateZ(70px)` | `linear-gradient(180deg,#F4EDDF,#E6DBC6)` |
| atrás | `rotateY(180deg) translateZ(70px)` | `#D8CDB8` |
| lateral izq. | `rotateY(-90deg) translateZ(120px)` | `#E0D5C0` |
| lateral der. | `rotateY(90deg) translateZ(120px)` | `#CFC3AC` |
| piso | `rotateX(-90deg) translateZ(75px)` | `rgba(15,46,54,.35)` |
| techo (2 planos) | `rotateX(±34deg)` desde el borde superior | `--teja #E2734B` y `#C9603C` |
| 4 ventanas | `translateZ(71px)`, 34×44px, radio `17px 17px 0 0` (**forma de arco: son el logo**) | `--ambar` con `box-shadow:0 0 18px rgba(255,182,72,.55)` |
| puerta | `translateZ(71px)`, 40×64px, arco arriba | `--tinta-2` |
| sombra | elipse bajo la maqueta, `filter:blur(18px)`, `background:rgba(3,12,16,.55)`, **no rota** | — |

Las ventanas en arco son la firma: la maqueta 3D **es el logo de Orama en volumen**. Dilo en un comentario del código para que nadie las cambie por rectángulos.

Vínculo con el selector (esto es lo que hace que el 3D no sea decorativo): al deslizar entre "Comprar" y "Arrendar", `--ry` interpola de `-22deg` a `-4deg` **siguiendo el dedo en tiempo real**, no al soltar. La casa gira mientras el cliente decide. En escritorio, además, A20 (seguimiento del puntero). En táctil no hay `pointermove`, así que el arrastre del selector es la única fuente de giro — y basta.

Distinguir arrastre de toque: desplazamiento < 8px = toque (navega); ≥ 8px = arrastre (no navega). Umbral de cambio de slide: 60px de recorrido **o** velocidad > 0,35 px/ms. `touch-action:pan-y` en la pista para no secuestrar el scroll vertical.

---

## 8. Dirección de arte de las imágenes

**Cero fotos de stock genéricas.** Nada de sofá chesterfield gris, cocina blanca sin contexto, familia sonriendo, o el salón escandinavo que sale en todos los portales. Estas casas tienen que parecer casas de Pasto.

### 8.A — Reglas globales

- **Cámara:** altura de ojo 1,50 m, equivalente 24–28 mm, **sin distorsión de barril**, verticales verticales (perspectiva corregida). Nada de ojo de pez ni contrapicado dramático.
- **Luz:** natural, media mañana o última hora de la tarde. Una fuente dominante por ventana, sombras suaves y direccionales. **Prohibido el HDR agresivo** (ese look plano de portal inmobiliario barato) y el flash frontal.
- **Sin personas, sin mascotas, sin texto, sin marcas visibles, sin logos, sin marca de agua.**
- **Paleta del contenido alineada a la marca**, sin ser disfraz: muros en blanco cálido o `#F4EDDF`, madera clara, textiles en tonos teja y ámbar, alguna planta real (monstera, sansevieria, helecho), porcelanato claro. Un solo objeto de acento cálido por foto.
- **Señales locales sutiles** que un colombiano reconoce: reja delgada en ventana, cocina con estufa a gas y campana, patio de ropas con lavadero en concreto, calentador de paso a la vista en el baño, vista a montaña verde y nubes bajas. No caricaturicen: uno o dos por foto, no todos.
- **Formato:** relación 3:2, exportadas a WebP calidad ~72, ancho 960px, **≤ 90 KB** la principal de cada tarjeta y **≤ 70 KB** las secundarias de ficha. Incrústalas como `data:image/webp;base64`.
- `alt` **descriptivo y en español** en cada una ("Sala con ventanal de dos metros y piso claro, apartamento en La Aurora"). No `alt="imagen"`.
- Cada inmueble lleva **3 fotos** en la ficha, en este patrón: **(1) espacio social · (2) cocina o baño · (3) exterior, patio o vista**. La (1) es la de la tarjeta.

### 8.B — Ruta alternativa si no puedes generar imágenes

Si no dispones de generación de imagen, **no uses stock ni rectángulos grises**. Compón cada visual como **ilustración arquitectónica SVG inline** en la paleta Orama: axonometría de interior a línea de 2px en `--linea` sobre fondo `--tinta-2`, con los planos de luz en `--ambar` a 12–20% y los textiles en `--teja`. Estilo coherente con el plano de barrio de `propuesta-orama.html:454-476`. **Las 24 imágenes van todas por la misma ruta**: mezclar foto e ilustración se ve a un metro de distancia y arruina la demo.

### 8.C — Media hero del login

Una **casa, no un halcón** (el halcón es de la plantilla "Signal" y no tiene nada que ver aquí).

- **Sujeto:** fachada de casa colombiana contemporánea al **atardecer**, vista de tres cuartos desde la acera. Ventanas encendidas en ámbar cálido — el mismo ámbar del logo. Muro en blanco cálido, un tramo de ladrillo a la vista o madera, antejardín pequeño con planta grande, montaña difusa al fondo, cielo con el degradado azul-petróleo que se vuelve la Tinta de la marca. Sin coche, sin gente, sin número de casa legible.
- **Por qué esta imagen y no otra:** el hero tiene que decir "hogar al final del día" y, al mismo tiempo, entregarle a la marca su propio azul oscuro y su propio ámbar sin que parezca filtro.
- **Encuadre:** vertical 1200×1600 para la columna del escritorio, con el punto de interés (la ventana iluminada) en el **tercio superior derecho**, porque la columna se recorta por la izquierda cuando la pantalla se angosta.
- **Poster obligatorio** como `data:image/webp;base64` (≤ 220 KB).
- **Video: opcional.** Si dispones de un `.mp4` local (5 s, mudo, loop, empuje de cámara muy lento), úsalo con `autoplay muted loop playsinline preload="auto" poster="…"` y **dos** `<video>` (variante alta y ancha) como en la plantilla §2. **Si no lo tienes, no inventes una URL ni enlaces a un CDN**: usa solo el poster con el Ken Burns A17, que da el mismo efecto sin peso ni petición externa. Deja un comentario en el código diciendo cuál de las dos rutas tomaste.
- En móvil, `.scrim` se enciende: `linear-gradient(180deg,rgba(6,20,26,.05) 16%,rgba(6,20,26,.35) 52%,rgba(6,20,26,.86) 100%)`, para que el titular blanco se lea sobre la fachada.

---

## 9. Prohibido en este proyecto

1. **Azules eléctricos, morados, neones y gradientes tecnológicos.** La Tinta `#0F2E36` es petróleo profundo, no `#0066FF`. Si un color no está en §5.A, no existe (única excepción: `#B5522E` y `#2A1206` de las correcciones de contraste).
2. **Verde WhatsApp fuera de WhatsApp.** `--wa` solo en botones y elementos de Ori.
3. **Cambiar el nombre, el logo, la paleta o las tipografías.** Están cerrados en DEC-001/CON-001 (`state.json:19,63`).
4. **Inventar datos del cliente real**: teléfono, dirección, años de experiencia, número de inmuebles gestionados, testimonios, "más de X familias", premios, reseñas, calificación de estrellas. **Ninguna cifra social.** Lo que falte va como HUECO (§10).
5. **Fotos de stock genéricas** y placeholders grises (`via.placeholder.com`, `picsum.photos`, `unsplash.com/random` — todos prohibidos, además son peticiones externas).
6. **Minimalismo austero.** Ya fue rechazado por el dueño en otro proyecto ("muy minimalista… quiero que sea más interactiva, más llamativa"). Esta pantalla vende.
7. **Dependencias externas de JS/CSS**, `alert()`, `confirm()`, `console.log` en el entregable, `!important` fuera del bloque de `prefers-reduced-motion`, `<table>` para maquetar.
8. **Backend simulado con mentira**: ningún mensaje del tipo "Enviado correctamente" o "Sesión iniciada". Todo botón sin función abre el modal de demo (§4.5).
9. **Scroll horizontal** en cualquier ancho entre 320px y 1920px.
10. **Texto en las imágenes.** Los precios y datos van en HTML, no quemados en el pixel — si no, el cliente pide cambiar un precio y hay que rehacer la foto.

---

## 10. Huecos del dueño (lo primero que hay que llenar)

Van visibles en la página, con `background:var(--ambar-suave); border:1px dashed var(--ambar); padding:2px 6px; border-radius:4px`.

| # | Dato | Dónde va | Por qué se necesita |
|---|---|---|---|
| 1 | **Número de WhatsApp real de Orama** | pie de las 4 pantallas, botón de la ficha, franja de captación | Es el único canal de conversión de todo el modelo: `brief.md:43` dice que todo el tráfico remata en WhatsApp con Ori. Sin él la demo no puede mostrar el cierre. |
| 2 | **Dirección de la oficina** (y si atiende presencial) | pie de página | Un inmobiliaria sin dirección física pierde confianza en Colombia; y define si hace falta un mapa. |
| 3 | **Ciudad y zona real de operación** | badge del login, campo `ciudad` de los 8 inmuebles, barrios | La demo usa **Pasto** como muestra. Si Orama opera en Ipiales, Popayán o Tumaco, cambian los barrios y hasta los rangos de precio. Es un cambio de una línea, pero hay que saberlo antes de la reunión. |
| 4 | **Horario de atención humana** | pie + ficha, junto a la nota de Ori | El argumento "Ori responde 24/7" solo brilla si se contrasta con el horario humano. |
| 5 | **Nombre del asesor o asesores** | ficha de inmueble, franja de contacto | Las fichas venden más con una persona detrás; hoy no hay ninguna y no se puede inventar. |
| 6 | **¿El cliente quiere de verdad un login delante del catálogo?** | decisión de producto | El dueño lo pidió para la demo y así se entrega. Pero conviene decirle al cliente, en la reunión, que en producción una puerta cerrada delante del catálogo **reduce** los buscadores que llegan — y que la web real puede tener el catálogo abierto y el login solo para propietarios que quieren ver el estado de su inmueble. Es una pregunta, no un cambio: **no la resuelvas por tu cuenta en la demo.** |
| 7 | **¿Tiene matrícula de arrendador / RNT o registro de la Cámara?** | pie legal | Si lo tiene, va en el pie y sube la confianza de un propietario que va a entregar su casa. |

---

## 11. Criterios de aceptación (verificables, numerados)

**Cómo se verifica lo visual:** Edge headless **por CDP**, no con `--screenshot` a secas. En esta máquina, `msedge --headless=new --window-size=390,844 --screenshot` **no** da un viewport de 390px (queda en 492px y recorta el PNG), y Edge headless reporta `prefers-reduced-motion: reduce` por defecto, así que una captura simple sale sin animación. Receta correcta: levantar Edge con `--remote-debugging-port=9222`, abrir el WebSocket de `/json/list` (Node 24 ya trae `WebSocket` global, sin dependencias) y llamar a `Emulation.setDeviceMetricsOverride {width,height,deviceScaleFactor:1,mobile:true}`, `Emulation.setEmulatedMedia {features:[{name:"prefers-reduced-motion",value:"no-preference"}]}`, `Page.navigate`, `Runtime.evaluate` (para medir) y `Page.captureScreenshot`.

Mediciones a **390×844** salvo que se indique otro ancho.

1. **Flujo completo.** `#/login` → clic en "Entrar al catálogo" → `#/home` → deslizar → `#/venta` → abrir una ficha → cerrar → conmutar a `#/arriendo`. Cero errores en consola en todo el recorrido (`Runtime.consoleAPICalled` y `Log.entryAdded` vacíos de `error`/`warning`).
2. **Botón atrás.** Estando en la ficha, el botón atrás la cierra sin salir de la vista. Estando en `#/venta`, el atrás devuelve a `#/home`. Estando en `#/home`, devuelve a `#/login`.
3. **Login sin scroll.** A 390×844, el borde inferior de `#btnEntrar` queda en **y ≤ 700px** y `document.documentElement.scrollHeight <= 844 + 8`. La card completa (H1, dos campos, botón) se ve sin desplazar.
4. **Entrada única.** El cronómetro desde `load` hasta que la última animación WAAPI resuelve `finished` está entre **1700 y 1900 ms**. Al redimensionar la ventana después, **no vuelve a correr** (`document.getAnimations().length === 0` salvo A17/A18).
5. **Home, primer pliegue.** A 390×844: la maqueta 3D mide entre **240 y 320px** de alto; el rótulo "Comprar casa" tiene su borde superior en **y ≤ 620px**; se ve la tarjeta activa completa **y al menos el 12% de la siguiente** (pista de que se desliza) — mídelo con `getBoundingClientRect()`.
6. **El 3D reacciona al dedo.** Con `Input.dispatchTouchEvent` (o `Input.synthesizeScrollGesture` horizontal) a media distancia del recorrido, `getComputedStyle(maqueta).transform` **cambia respecto al reposo antes de soltar**. Si solo cambia al soltar, está mal.
7. **Deslizamiento.** Un arrastre de 70px cambia de slide; uno de 30px vuelve al origen; un toque de 4px de desplazamiento **navega** al catálogo. Las teclas ← → también cambian de slide.
8. **Catálogo, precio en el primer pliegue.** A 390×844, el precio de la primera tarjeta es visible con su `rect.bottom <= 620`. El encabezado del catálogo (título + contador + chips) ocupa **≤ 300px**.
9. **Los 8 inmuebles, con los 20 campos.** `INMUEBLES.length === 8`; 4 con `operacion:'arriendo'` y 4 con `'venta'`. Abriendo cada ficha, el `<dl>` tiene **≥ 20 pares `dt`/`dd`** y **ningún `dd` vacío** (los no aplicables dicen `—`).
10. **Formato de precio.** Ninguna cadena visible cumple `/\d{4,}/` sin separadores: todos los precios se ven `$1.450.000` / `$520.000.000`.
11. **Filtros reales.** Clic en `3+ habitaciones` en arriendo deja exactamente **3** tarjetas (ORA-A-101, 102, 104) y el contador dice `3 inmuebles disponibles`. Clic en `Todos` restaura 4.
12. **Imágenes.** 8 tarjetas con imagen distinta; 24 imágenes en total; **ninguna** `src` apunta a un dominio externo (`document.images` → todas `data:` o rutas relativas); **todas** tienen `alt` de ≥ 25 caracteres en español.
13. **Contraste.** Ningún texto de la página cae bajo 4,5:1 contra su fondo real, salvo texto ≥18px o ≥14px negrita, que puede bajar a 3:1. Verificar puntualmente: insignia `EN VENTA`, píldora de estrato, `--tinta-papel-2` sobre papel, `--cal-dim` sobre `--tinta-2`.
14. **Cero overflow horizontal** a 320, 390, 414, 768, 1024, 1440 y 1920px: `document.documentElement.scrollWidth <= window.innerWidth` en los siete.
15. **Cambio de modo del login.** De 1400 → 900 → 700px la columna de media se estrecha **sin salto y sin recargar**; al pasar a tableta en vertical y volver, el layout es correcto **sin recargar** (prueba de que `clearInline()` funciona: ninguno de `.media`, `.panel`, `.card`, `.card-in`, `.hero` conserva estilos inline del modo anterior).
16. **iOS zoom.** Todos los `input` tienen `font-size >= 16px` computado bajo 700px de ancho.
17. **Movimiento reducido.** Con `Emulation.setEmulatedMedia` en `reduce`: `document.getAnimations()` devuelve **0** transiciones/animaciones vivas tras 500 ms, y la página está **completa y legible** (nada con `opacity:0` ni `clip-path:inset(100% …)`).
18. **Sin JS.** Con `Emulation.setScriptExecutionDisabled true`, la página renderiza la pantalla de login completa y visible (el guard `entry-pending` nunca se aplica). No hay `<noscript>`.
19. **Teclado.** Tab recorre en orden lógico: usuario → clave → Entrar → WhatsApp → enlace del pie. `:focus-visible` es siempre visible en ámbar. La ficha atrapa el foco mientras está abierta y lo devuelve al cerrar.
20. **Honestidad de la demo.** Las cadenas `Demo · sin funcionalidad real` y `Inmuebles de muestra. Precios y direcciones ficticios` están presentes y visibles (no `display:none`, no `sr-only`) en el DOM de las cuatro pantallas / los dos catálogos respectivamente. Los 7 HUECOS aparecen con su marcador punteado ámbar.
21. **Peso y autocontención.** El archivo pesa ≤ 4,5 MB. Toda petición de red del `Network` domain es a `fonts.googleapis.com`/`fonts.gstatic.com` o ninguna. Cero `<script src>` externos.
22. **Presupuesto de movimiento.** En cualquier instante del recorrido, `document.getAnimations().filter(a=>a.playState==='running').length <= 6`, y los elementos con `will-change` distinto de `auto` son ≤ 4.
23. **Capturas de entrega.** PNG a 390×844 y 1440×900 de: login, home (con el selector a medio deslizar), catálogo de arriendo, catálogo de venta y una ficha abierta. Diez imágenes. Son lo que se le enseña al dueño antes de la reunión con el cliente.
