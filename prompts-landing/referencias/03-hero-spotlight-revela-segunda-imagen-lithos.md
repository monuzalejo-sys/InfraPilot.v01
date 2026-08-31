# 03 · Hero oscuro con spotlight que sigue al cursor y revela una segunda imagen ("Lithos")

- **Recibida:** 2026-08-23 · **Fuente:** especificación en texto entregada por el dueño · **Stack original:** React 18 + TS + Vite + Tailwind + lucide-react
- **Para qué la dio el dueño:** referencia para combinar en landings; canal principal móvil.

## Qué aporta (mecanismos reutilizables)
- **Composición:** hero a pantalla completa (`100dvh`), imagen base + **segunda imagen encima recortada por una máscara circular suave** que sigue al cursor; título de dos líneas centrado arriba (`top 14%`): línea 1 en serif itálica, línea 2 en sans, ambas enormes con tracking negativo; dos bloques de texto pequeño abajo (izquierda: contexto; derecha: propuesta + botón naranja `#e8702a`); nav fija con píldora translúcida centrada (`bg-white/20 backdrop-blur-md`) y botón blanco "Sign Up" a la derecha.
- **Movimiento / interacción:** cursor con suavizado (`lerp 0.1` en RAF); la máscara es un `<canvas>` oculto que pinta un gradiente radial (paradas 0→1, 0.4→1, 0.6→0.75, 0.75→0.4, 0.88→0.12, 1→0, radio 260 px) y lo aplica como `mask-image` (data URL) al div de la imagen revelada; entrada "premium": Ken Burns de 1.8 s en la imagen base (`scale 1.12 → 1`), título con `blur 12px + translateY 28px → 0` en 1.1 s escalonado (0.25 s / 0.42 s), párrafos con fade-up a 0.7/0.85 s, easing `cubic-bezier(0.16,1,0.3,1)`; `prefers-reduced-motion` apaga todo y muestra opaco.
- **Color:** base negra + imágenes oscuras + texto blanco al 80 % + un solo acento cálido naranja `#e8702a` (hover `#d2611f`) en el CTA. La idea de "un solo acento cálido sobre fondo oscuro" cuadra con POL-001.
- **Tipografía / copy:** Playfair Display itálica para la primera línea (emoción) y Inter para la segunda (claridad); títulos `text-5xl → 7xl → 8xl`; tracking `-0.05em` / `-0.08em`; párrafos `text-sm` con `leading-relaxed`.

## Qué NO se copia
- "Lithos", "Layers hold / tales of time", "Start Digging", "Course / Field Guides / Geology / Plans / Live Tour / Sign Up", los dos textos de geología, las imágenes de higgs.ai/cloudfront, el logo SVG.
- La máscara vía `canvas.toDataURL()` en cada render (ver riesgos): el MECANISMO se conserva con `mask-image: radial-gradient(...)` en CSS puro movido con variables `--x/--y`.

## Cómo se traduce a un negocio real (Villa Broaster u otro)
| Referencia | Proyecto |
|---|---|
| Imagen base oscura + imagen revelada | Base: pollo crudo / canasta vacía / la freidora en penumbra; revelada: el pollo broaster dorado recién salido (o el producto con su precio). El spotlight "destapa" el antojo |
| "Layers hold / tales of time" | "Hecho por tandas / como en casa" (eslogan real: "Pollo broaster hecho por tandas"); sin cifras inventadas |
| Botón "Start Digging" naranja | "Pedir ahora" en el naranja de la vitrina `#ff8a20` (o rojo `#e01e2b`), mismo tamaño y comportamiento |
| Nav píldora translúcida | Sedes como píldora: "Villa del Viento · Vía al Bosque" (selector), nunca links vacíos |
| Dos párrafos abajo | Izquierda: "Se paga al recibir, domicilio o recoger"; derecha: horario SOLO si está confirmado, si no se omite |

## Riesgos al usarla
- **Móvil no tiene cursor:** el spotlight debe seguir al dedo (`touchmove`/`pointermove` con `touch-action: none` SOLO dentro del hero, no en toda la página, o el usuario no puede hacer scroll), o moverse solo con una animación lenta (órbita) cuando no hay puntero; al cargar, debe estar visible sobre el producto, no en `(-999,-999)` (en la referencia arranca oculto: en móvil eso significa hero sin revelación = hero sin gracia).
- **Rendimiento:** `canvas.toDataURL()` en cada frame es caro y genera basura; usar `mask-image: radial-gradient(circle 260px at var(--x) var(--y), ...)` y actualizar solo variables. Dos imágenes grandes: WebP ≤180 KB cada una, `fetchpriority="high"` en la base.
- **Contraste:** texto blanco al 80 % sobre foto; medir sobre la zona real de la imagen (no sobre negro).
- **Entrada con blur 12 px:** en gama baja tartamudea; bajar a 6 px en móvil o usar solo fade-up.
- **Nav fija con `backdrop-blur`:** caro en móvil; en < 640 px la referencia la esconde (bien), dejar solo marca + CTA.

## Especificación original (tal cual se recibió)

Build a full-screen, dark-themed hero section for a geology brand called **Lithos**, using **React 18 + TypeScript + Vite + Tailwind CSS** and **lucide-react** for icons. The signature feature is a **cursor-following spotlight that reveals a second image** through a soft circular mask on top of a base image. Match every detail below exactly.

### Fonts
Add this to the top of `src/index.css`, then `@tailwind base/components/utilities`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
* { font-family: 'Inter', sans-serif; }
.font-playfair { font-family: 'Playfair Display', serif; }
```
- Body/UI font: **Inter**.
- Display/wordmark accent: **Playfair Display, italic**.

### Asset URLs (use these exactly)
- Base image (`BG_IMAGE_1`):
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85`
- Reveal image (`BG_IMAGE_2`):
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85`

### Layout & structure
Root wrapper: `min-h-screen bg-white tracking-[-0.02em]`, inline `fontFamily: "'Inter', sans-serif"`.

**Section** (`<section>`): `relative w-full overflow-hidden h-screen bg-black`, inline `style={{ height: '100dvh' }}`. Layers, by z-index:
1. **Base image** (`z-10`): `absolute inset-0 bg-center bg-cover bg-no-repeat`, background = `BG_IMAGE_1`.
2. **Reveal layer** (`z-30`): a `RevealLayer` component (see below) showing `BG_IMAGE_2`.
3. **Heading** (`z-50`): `absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none`. An `<h1>` with `text-white leading-[0.95]` containing two block spans:
   - Line 1: `block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl`, inline `letterSpacing: '-0.05em'`, text **"Layers hold"**.
   - Line 2: `block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1`, inline `letterSpacing: '-0.08em'`, text **"tales of time"**.
4. **Bottom-left paragraph** (`z-50`): `hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px]`. `<p className="text-sm text-white/80 leading-relaxed">` — "Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us."
5. **Bottom-right block** (`z-50`): `absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5`. Contains a `<p className="text-xs sm:text-sm text-white/80 leading-relaxed">` — "Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet." — and a **Start Digging** button: `bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30`.

### The cursor spotlight reveal (core mechanic)
In the parent, define `const SPOTLIGHT_R = 260;` and track the mouse with smoothing:
- Refs: `mouse` (raw), `smooth` (eased), `rafRef`; state `cursorPos` (init `{x:-999,y:-999}`).
- `mousemove` listener stores raw `e.clientX/clientY`.
- A `requestAnimationFrame` loop lerps: `smooth.x += (mouse.x - smooth.x) * 0.1` (same for y), then `setCursorPos`. Clean up listener + cancel RAF on unmount.

`RevealLayer({ image, cursorX, cursorY })`:
- Holds a hidden `<canvas>` (`absolute inset-0 pointer-events-none`, `style={{display:'none'}}`) sized to `window.innerWidth/Height` on mount + resize.
- A reveal `<div>` (`absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none`) with the reveal image as background.
- On every render: clear canvas, build a **radial gradient** at `(cursorX, cursorY)` from radius 0 → `SPOTLIGHT_R` with stops:
  `0 → rgba(255,255,255,1)`, `0.4 → 1`, `0.6 → 0.75`, `0.75 → 0.4`, `0.88 → 0.12`, `1 → 0`.
  Fill an arc of radius `SPOTLIGHT_R` with it. Then `canvas.toDataURL()` and apply it as `maskImage`/`webkitMaskImage` on the reveal div with `maskSize: '100% 100%'`. This makes the second image visible only inside the soft glowing circle that trails the cursor.

### Navigation (fixed, over hero)
`<nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">`:
- **Left**: an inline SVG logo (26×26, viewBox `0 0 256 256`, `fill="#ffffff"`, path `M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z`) + wordmark `<span className="text-white text-2xl font-playfair italic">Lithos</span>`.
- **Center pill** (`hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1`): buttons **Course** (active: full white text), then **Field Guides, Geology, Plans, Live Tour** (`text-white/80 ... hover:bg-white/20 hover:text-white transition-colors`, `px-4 py-1.5 rounded-full text-sm font-medium`).
- **Right (desktop)**: `hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100` — **Sign Up**.

### Animations (premium, on load)
Add to `index.css`:
```css
@keyframes heroReveal { 0%{opacity:0;transform:translateY(28px);filter:blur(12px)} 100%{opacity:1;transform:translateY(0);filter:blur(0)} }
@keyframes heroFadeUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
@keyframes heroZoom { 0%{transform:scale(1.12)} 100%{transform:scale(1)} }
.hero-anim { opacity:0; animation-fill-mode:forwards; animation-timing-function:cubic-bezier(0.16,1,0.3,1); }
.hero-reveal { animation-name:heroReveal; animation-duration:1.1s; }
.hero-fade { animation-name:heroFadeUp; animation-duration:1s; }
.hero-zoom { animation:heroZoom 1.8s cubic-bezier(0.16,1,0.3,1) forwards; }
@media (prefers-reduced-motion: reduce){ .hero-anim,.hero-zoom{ animation:none; opacity:1; } }
```
Apply:
- Base image div → add `hero-zoom` (slow Ken Burns zoom-out).
- Heading line 1 → `hero-anim hero-reveal`, inline `animationDelay: '0.25s'`; line 2 → same with `'0.42s'` (blur-rise, staggered).
- Bottom-left paragraph wrapper → `hero-anim hero-fade`, `animationDelay: '0.7s'`.
- Bottom-right wrapper → `hero-anim hero-fade`, `animationDelay: '0.85s'`.

### Responsiveness
- Heading scales `text-5xl` → `sm:text-7xl` → `md:text-8xl`.
- Center nav pill and desktop Sign Up are `hidden` below `md`; the mobile hamburger is `md:hidden`.
- Bottom-left paragraph is `hidden sm:block`; bottom-right block is full-width on mobile (`left-5 right-5`) and right-anchored from `sm`.
- Use `100dvh` so mobile browser chrome doesn't clip the section.

## Historial de uso
| Fecha | Proyecto | Combinada con | Veredicto del dueño | Por qué |
|---|---|---|---|---|
| 2026-08-23 | villa-broaster · prompt v2 — zona **CIERRE** | fichas 01 (héroe) y 02 (promo) | **RECHAZADO por invisible.** El dueño no lo mencionó siquiera: en la revisión (capturas 390×844) este mecanismo **no existió** | Se tomó la máscara radial que sigue al dedo, pero **sin segunda imagen**: no hay pares de fotos por producto y no se inventan assets, así que el foco *calienta* la misma (fuera `brightness(.35) saturate(.5)`, dentro `1.15`). Radio 150 px (no 260), arranca visible sobre el producto, `touch-action:none` solo dentro de la pieza, y orbita sola a los 3 s sin toque. **Qué pasó:** el CSS estaba escrito (`mask-image: radial-gradient(circle 150px at var(--fx,50%) var(--fy,42%))` + `brightness(1.15)`), pero el lienzo de Claude Design es estático y el dueño revisa PNG: **un mecanismo que solo existe mientras el dedo se mueve es un mecanismo que no se entregó** (KN-008). Lección de ficha: esta referencia **solo se usa si su estado en reposo ya se ve bien**. |
| 2026-08-29 | **prommter** · `prommter-agencia-v2.md` — zona **CIERRE** | fichas 01 (héroe) y 02 (cifra) | pendiente (PEND-005) | Uso mínimo y deliberado: se toma **un solo acento cálido sobre fondo oscuro** en el CTA y el **foco ya puesto** (radial fijo de 220 px sobre el botón de WhatsApp, resto de la banda a `brightness(.75)`). El seguimiento del dedo queda **prohibido en táctil** (secuestra el scroll) y solo se permite con puntero fino vía `@media (hover:hover) and (pointer:fine)`. Es la ficha aplicada al revés de como nació: aquí su valor no es la revelación, es concentrar la mirada en el único botón de la página cuando el visitante ya tiene su cifra de pérdida en la cabeza. |
| 2026-08-23 | villa-broaster · prompt **v3** — zona **CIERRE** | fichas 01 (portada) y 02 (carta) | pendiente (PEND-004) | El foco deja de depender del dedo: se entrega **ya puesto sobre la presa**, con halo caliente visible y el resto de la foto en penumbra, más el rastro del dedo dibujado. El arrastre pasa al anexo de coreografía (fase de código). Es el mismo mecanismo, pero **en estado congelado se ve**; en estado latente no existía. |
| 2026-08-29 | **prommter** · `prommter-agencia-v3-mejora.md` — zona **CIERRE + DEMO** | fichas 01 (héroe congelado) y 02 (motor de scroll) | pendiente (PEND-006) | Escalón siguiente sobre el "foco ya puesto" que se aceptó: el reposo se mantiene idéntico (es lo que el dueño vio y aprobó) y se le añade **dirección**. (a) Cierre: órbita mínima de `translate(±10px, ±6px)` en 9 s `ease-in-out alternate` — si se nota como animación, está mal calibrada; seguimiento del cursor solo con puntero fino. (b) Demo S4: el halo **se traslada** del teléfono del cliente al panel del dueño cuando entra el pedido (400 ms), para que la mirada vea la prueba del producto sin una palabra. Criterio medible del reposo: en la captura del cierre, el tercio del botón tiene luminancia ≥ 1.3 × el tercio más oscuro. Prohibido `backdrop-filter`, `canvas` y `toDataURL`. |
