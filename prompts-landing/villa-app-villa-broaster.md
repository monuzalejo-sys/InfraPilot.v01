# PROMPT — Página pública de VILLA BROASTER (villa-app)

Vas a construir la **página pública de Villa Broaster** dentro de `villa-app`. Villa Broaster
es un **cliente real**: dos sedes que abren mañana. Todo lo que esta página prometa, el
negocio lo tiene que cumplir. No hay margen para adornos verosímiles.

Raíz de todas las rutas citadas: `C:\Users\Kalel\asadero\`.
Antes de escribir una línea de código lee `villa-app/AGENTS.md:1-9`: este Next.js **no es el
que conoces** (16.3.0), consulta `node_modules/next/dist/docs/` para lo que uses.

---

## 1. EL NEGOCIO (todo con origen; nada de esto lo inventes tú)

- **Marca real:** "Villa Broaster". Eslogan: **"Pollo broaster hecho por tandas"**
  (`villa-app/lib/marca.ts:15-18`). No es placeholder: `broaster-app/components/marca/datos.ts:9-11`
  dice literal "Nombres y ubicaciones YA SON LOS REALES".
- **Dos sedes** (`villa-app/lib/marca.ts:35-52`), y de cara al cliente **jamás** se dicen
  "local 1 / local 2" (`villa-app/lib/marca.ts:9-10`):
  1. **Villa del Viento** — zona "Barrio Villa del Viento" — "El local de toda la vida, en
     pleno barrio." — horario `11:00 a.m. – 9:00 p.m.` [SIN CONFIRMAR, ver hueco H-2] —
     domicilio `25 – 35 min` [SIN CONFIRMAR, H-8].
  2. **Vía al Bosque** — zona "Sobre la vía al Bosque" — "A la orilla de la vía, con
     parqueadero." — horario `11:00 a.m. – 10:00 p.m.` [H-2] — domicilio `30 – 40 min` [H-8].
- **Las direcciones son a propósito el SECTOR, sin nomenclatura**, por petición del dueño:
  "no inventar calles ni carreras" (`broaster-app/components/marca/datos.ts:12-14`).
- **La ciudad/municipio NO aparece en ningún archivo del repo.** Un builder barato ya inventó
  una vez la ciudad "Rionegro" en keywords SEO (`memory/asadero/state.json`, KN-008). No la
  escribas ni en el copy, ni en metadata, ni en un alt.
- **Qué se vende:** 5 categorías — Presas, Combos, Familiar, Acompañantes, Bebidas
  (`villa-app/types/dominio.ts:33-51`); 23 productos con precio por sede
  (`broaster-app/data/seed/productos.json`).
  **CUIDADO CRÍTICO:** ese catálogo es de EJEMPLO. El propio código lo dice: "NO son los
  precios de este negocio" (`broaster-app/lib/servidor/almacen-disco.ts:360-366`) y sigue
  como pendiente bloqueado (`memory/asadero/state.json`, PEND-003). **Por eso esta página
  NO escribe ni un precio en el código** (ver §4 y §7).
- **Se paga al recibir, no hay pago en línea:** "No pagas nada ahora. Se paga al recibir."
  (`villa-app/components/tienda/HojaCheckout.tsx:109`).
- **Domicilio es el canal prioritario**, "recoger" es la alternativa
  (`villa-app/components/tienda/HojaCheckout.tsx:10-12, :55`).
- **Los precios pueden diferir entre sedes** y la app siempre lee `precioPorLocal[sede]`
  (`villa-app/types/dominio.ts:28-31`, `villa-app/components/tienda/HojaSedes.tsx:76-79`).

---

## 2. QUIÉN MIRA Y QUÉ DEBE HACER

**Quién:** una persona del pueblo, con hambre, a las 7 de la noche, con el celular en una
mano. Puede que nunca haya pedido comida por internet y sospeche que le van a pedir tarjeta.
Llega aquí desde una campaña (estado de WhatsApp, Facebook, un QR en la bolsa del domicilio):
el dueño pidió expresamente una **"página pública como destino de campañas"**
(`memory/asadero/state.json`, DEC-007 · reason).

**Qué debe sentir, en este orden:** (1) hambre — el pollo sale ahora, por tandas;
(2) cercanía — es el local del barrio, no una app extraña; (3) confianza — no hay que
registrarse ni pagar por internet.

**UNA sola acción principal: PEDIR.** El botón dice **"Pedir ahora"** y lleva a la carta ya
existente con la sede escogida: `/?sede=1` o `/?sede=2`. Todo lo demás en la página es
subordinado y se ve subordinado.

**Acción secundaria, callada y abajo:** dejar correo o celular en la lista
(`POST /api/suscriptores`, existe y funciona: `broaster-app/app/api/suscriptores/route.ts:6-48`).
Es la intención original del producto — "registro simple para email marketing"
(`memory/asadero/state.json`, DEC-003 · reason) — pero **nunca** compite con "Pedir": otro
tamaño, otro peso, después del cierre. Dos CTAs peleando = ninguno.

---

## 3. EVIDENCIA REAL — lo único que hoy se puede probar

No hay testimonios, ni reseñas, ni años de operación, ni número de clientes: `data/ordenes.json`
y `data/gastos.json` están en `[]` (cero órdenes reales). **Nada de eso puede aparecer.**
Lo que SÍ es verdad comprobable y vende solo:

1. **"Hecho por tandas"** — es el eslogan real del negocio (`villa-app/lib/marca.ts:17`), y es
   exactamente el argumento de frescura de un asadero. Es el eje de la página.
2. **Dos sedes reales, con carácter distinto** — una de barrio "de toda la vida", otra sobre
   la vía "con parqueadero" (`villa-app/lib/marca.ts:41, :49`). Eso ubica y da respaldo.
3. **No pagas nada por internet** (`HojaCheckout.tsx:109`) y **no hay que crear cuenta**
   ("Pedir pollo no puede costar un registro", `HojaCheckout.tsx:5-8`). Para este público es
   el argumento de confianza más fuerte que existe.
4. **El pedido tiene número de verdad**, el mismo que se canta en el mostrador — formato
   `L1-0042` (`villa-app/types/dominio.ts:88-89`) — y **estado en vivo**: "Pedido recibido",
   "En el aceite", "Listo", "Entregado"
   (`villa-app/components/orden/Confirmacion.tsx:29-55`). Enséñalo: es prueba de que esto no
   es un formulario que cae en un correo.
5. **Precios reales por sede** traídos del mismo sistema que cobra en la caja (§4, sección 4).

Prohibido convertir en copy cualquier frase de la landing vieja borrada (`git show
db19168:broaster-app/components/landing/hero.tsx`): decía "Apanado a mano cada mañana" y
"Tanda fresca todo el día", y **ninguna de las dos tiene fuente** — son copy inventado que
sobrevivió en git. Si el dueño las confirma (H-9), entran; hasta entonces, no existen.

---

## 4. ESTRUCTURA, SECCIÓN POR SECCIÓN

Móvil primero (390 px). En escritorio **no** se estira a lo ancho: columna centrada, igual
que la app (`villa-app/app/globals.css:147-158`, `.columna` max 480 px) — aquí puedes subir
a ~560 px para que respire, pero se sigue viendo como la misma casa.

**1. Héroe — "El pollo sale ahora"** *(propósito: dar hambre en 2 segundos)*
Marca "Villa Broaster" grande, eslogan "Pollo broaster hecho por tandas" debajo. Una sola
frase de apoyo construida solo con hechos citados (ej.: "Frito por tandas en nuestras dos
sedes. Pides, y se paga al recibir."). Fondo: calor de freidora — rojo hondo + naranja, con
el resplandor cayendo desde arriba, en el mismo espíritu que `Encabezado.tsx:28-35` pero
mucho más grande y vivo. Botón **"Pedir ahora"** que abre el paso 2.

**2. Selector de sede como parte del héroe** *(propósito: mover el único paso obligatorio de
la app a la portada, en vez de añadir uno)*
Dos tarjetas grandes, una por sede: nombre, zona, referencia y su demora de domicilio.
Tocar una **no** abre nada: cambia el CTA a `/?sede=N` y lo lanza. Con esto la persona llega
a la carta ya posicionada y **no repite** la elección: la app la persiste
(`villa-app/lib/carrito.ts:44, :150-153, :190-193`). Esta es la resolución de la tensión
"vender sin meter un paso de más": el paso no se suma, se muda.

**3. "Así se hace" — tandas** *(propósito: diferenciar, no decorar)*
Tres piezas cortas, solo con lo verificable: se fríe por tandas; hay dos sedes que hacen el
mismo pollo ("Las dos hacen el mismo pollo, por tandas", `HojaSedes.tsx:30`); el pedido entra
a la cocina que te queda cerca. Sin cifras, sin historia familiar, sin "desde 19xx".

**4. Vitrina de la carta — PRECIOS EN VIVO, NUNCA ESCRITOS** *(propósito: mostrar que hay
comida de verdad y cuánto cuesta)*
Isla de cliente que llama a `traerProductos()` de `villa-app/lib/api.ts:77-87` (va por el
rewrite `/api/*` → `:3200`, `villa-app/next.config.ts:24-31`), filtra un puñado de productos
por `id` (sugeridos: `familiar-8-completo`, `combo-personal-1`, `presa-contramuslo`,
`acomp-papa-criolla`) y pinta **nombre, descripción y `precioPorLocal[sede]`** tal como
lleguen. Formatea con `formatoCop` de `villa-app/lib/formato.ts`.
Reglas duras de esta sección:
- **Cero precios literales en el código.** Si mañana el dueño corrige su carta en el admin,
  la página se corrige sola. Así jamás publicamos como real un precio de ejemplo.
- Mientras carga: esqueleto con la forma final (mira `Tienda.tsx:281-299`).
- **Si la API falla, la sección se degrada en silencio**: se muestran los nombres sin precio
  o se oculta entera, y el héroe y el CTA siguen intactos. Una página de campaña no puede
  romperse porque el backend esté apagado.
- Las imágenes: **no hay fotos** y no se usan de banco. Usa `ArteProducto`
  (`villa-app/components/tienda/ArteProducto.tsx`), que dibuja cada producto con sus
  iniciales sobre paneles cálidos por categoría (`:20-26`), en tamaño `lg`.

**5. Las dos sedes, completas** *(propósito: ubicar y dar respaldo físico)*
Nombre grande, zona, referencia, horario [H-2] y demora [H-8]. **Sin dirección exacta, sin
mapa, sin teléfono** (el único que existe es `(604) 000 00 00`, marcado REEMPLAZAR,
`broaster-app/components/marca/datos.ts:22-23, :52, :62`). Cada tarjeta cierra con su propio
"Pedir de esta sede" → `/?sede=N`.

**6. "Pedir es así" — tres pasos** *(propósito: quitar el miedo, que es lo que frena la
primera compra)*
(1) Armas el pedido y ves el total antes de enviar. (2) Domicilio o recoger; solo pedimos
nombre, teléfono y dirección — sin cuentas ni contraseñas (`HojaCheckout.tsx:5-8, :68-73`).
(3) Te damos un número como `L1-0042` y ves su estado: "Pedido recibido" → "En el aceite" →
"Listo" (`Confirmacion.tsx:29-45`). Cierra con **"No pagas nada ahora. Se paga al recibir."**
citado tal cual (`HojaCheckout.tsx:109`).

**7. Cierre + CTA repetido** *(propósito: rematar)*
El mismo botón "Pedir ahora", ahora con la sede que la persona tocó arriba (si no tocó
ninguna, usa la 1 y dilo: "Pides en Villa del Viento — cámbiala aquí").

**8. Lista de correo (secundaria)** *(propósito: capitalizar al que hoy no va a pedir)*
Formulario mínimo: nombre + correo **o** celular (el servidor exige al menos uno,
`broaster-app/lib/servidor/contabilidad.ts:628-660`). `POST /api/suscriptores` con
`{nombre, email?, telefono?}`; maneja **201** (quedó), **409** ("ya estabas en la lista", en
tono amable, no error) y **400** (mensaje del servidor tal cual). Copy honesto: solo promete
avisar cuando haya novedades — no prometas descuentos, no existen.

**9. Pie**
Marca, eslogan, las dos sedes por nombre. **Nada más**: sin redes (no hay ninguna en el
repo), sin correo, sin teléfono, sin NIT, sin "© 2026 todos los derechos" inventado.

**Sección que NO va (y por qué):** promociones y cupones. Existen 4 promos y 3 cupones
(`VB-VIENTO-01`, `VB-BOSQUE-01`, `VB-TANDA-05`) en `villa-app/lib/promos.ts:56-127`, pero el
archivo dice en su cabecera "Estas promociones NO existen en broaster-app: viven aquí,
escritas a mano" (`:1-7`). En la app son un prototipo que el dueño mira; en una página de
campaña serían una oferta pública que alguien va a reclamar en el mostrador mañana. **No
entran hasta que el dueño apruebe cuáles honra** (hueco H-6).

---

## 5. REGISTRO VISUAL Y PALETA

Esta página **VENDE**: producto protagonista, tipografía grande, color en masa y movimiento
con oficio. No apliques aquí el minimalismo sobrio del interior de las apps del dueño — ya
rechazó una portada por eso ("muy minimalista... quiero que sea más interactiva, más
llamativa"). Regla de la casa: **"Landing/cara pública VENDE (vivid, interactive). Interior
sobrio."** (`memory/asadero/brief.md:21`).

Y al mismo tiempo: **usa exactamente los tokens que ya existen** en
`villa-app/app/globals.css:30-51`, porque la persona va a saltar de esta página a la carta en
un toque y tiene que ser la misma casa. Reutilizar los tokens no es minimalismo: lo vivo lo
pone la escala, la masa de color y el movimiento.

- Capas: `--noche #0a0a0a` → `--base #141414` → `--carta #212121` → `--carta-alta #2b2b2b`.
- `--rojo #e01e2b`: **solo como relleno** (botones, cabeceras, sellos) con blanco encima.
- `--naranja #ff8a20`: acento de texto — precios, ganchos, chips. `--naranja-suave #ffb066`.
- Textos: `--crema #f7ece1` / `--crema-suave #b9aaa0` / `--tenue #998a81`. `--verde #4ade80`
  solo para estados buenos.
- Bordes `--linea #363130`, radio `--radio 18px`.
- Tipografía: la del sistema que ya usa el body (`globals.css:112`). Jerarquía marcada:
  héroe 40–56 px extrabold con `tracking-tight`, cuerpo 15–16 px. Nada por debajo de 12,5 px.
- Todo texto pasa **AA** sobre su fondo, como el resto del proyecto (`globals.css:19-28`).
- Paleta fija confirmada por el dueño en `Prompt-Claude-Design-VillaApp.md:41-47`: no la
  cambies, no agregues colores nuevos.

---

## 6. INTERACCIÓN — cada una se justifica o se cae

1. **Calor de freidora en el héroe:** un resplandor rojo/naranja que respira lento (~6 s,
   `opacity`/`scale` sutiles). Justificación: es lo único que puede dar hambre mientras no
   haya fotos. Debe verse bien **quieto** también.
2. **Tarjetas de sede que responden al toque:** al tocar, la tarjeta se marca como elegida
   (borde `--naranja`, sello "Elegida", igual que `HojaSedes.tsx:51-55`) y el CTA principal
   cambia su destino y su texto ("Pedir de Vía al Bosque"). Justificación: es la decisión que
   la app necesita; resolverla aquí ahorra un paso adentro.
3. **Precios que aparecen:** al llegar de la API, las tarjetas entran con `animate-revelar`
   (ya existe, `globals.css:88-97`). Justificación: comunica "esto está vivo, es el precio de
   hoy en tu sede".
4. **CTA pegajoso en móvil:** cuando el héroe sale de pantalla, el botón "Pedir ahora" baja
   como barra fija abajo — mismo lenguaje que `BarraCarrito`. Justificación: la decisión de
   pedir llega en cualquier scroll; que no haya que buscar el botón.
5. **Aparición al hacer scroll** en las secciones 3, 5 y 6 con `IntersectionObserver` +
   `animate-revelar`. Sutil (6 px y opacidad). Justificación: ritmo de lectura; nada más.
6. **`.presionable`** (`globals.css:176-179`) en todo lo tocable: es la única confirmación
   táctil que hay sin teclado.
7. **`prefers-reduced-motion`:** ya está resuelto globalmente (`globals.css:138-144`); no lo
   pises con animaciones inline que lo esquiven.

Nada de parallax pesado, contadores que suben, carruseles automáticos ni confeti.

---

## 7. RESTRICCIONES TÉCNICAS REALES (verificadas)

- **Dónde vive:** ruta nueva del App Router **dentro de `villa-app`**: `app/inicio/page.tsx`
  + componentes en `components/inicio/`. **No** un HTML suelto (esto es entrega, no maqueta)
  y **no** dentro de `broaster-app`: esa app es software contable puro y su raíz redirige a
  `/admin` (`broaster-app/app/page.tsx:12-13`); su landing se borró a propósito en el pivote
  (`memory/asadero/brief.md:5`, commit `dcd18b7`). No la repongas allá.
- **La raíz `/` sigue siendo la carta** (`villa-app/app/page.tsx:12-14`). No la toques: quien
  ya conoce el sitio no puede toparse con una portada entre el hambre y el pedido. La landing
  es el destino de campaña; el día que el dueño decida que el dominio raíz sea la portada,
  eso se resuelve con una regla en el proxy o un `redirect`, no reescribiendo la app
  (hosting sigue sin decidir: `memory/asadero/state.json`, PEND-004).
- **Deep link de sede — único cambio permitido fuera de `components/inicio/`:** en
  `villa-app/lib/carrito.ts`, dentro del `useEffect` que ya lee lo guardado (`:176-180`), la
  sede inicial debe priorizar `?sede=1|2` de `window.location.search` sobre
  `leerSedeGuardada()` (`:150-153`); si el valor no es `"1"` ni `"2"`, se ignora. El efecto
  que ya persiste (`:190-193`) lo deja guardado. Nada de `useSearchParams` (obligaría a un
  `Suspense` nuevo): lee `window.location.search` dentro de ese efecto de cliente.
- **Stack, sin excepciones:** Next.js 16.3.0 (App Router) + React 19.2.4 + TypeScript 5 +
  Tailwind v4 vía `@tailwindcss/postcss` (`villa-app/package.json:12-24`). **Cero
  dependencias nuevas** — el proyecto tiene exactamente tres de runtime. Nada de framer-motion,
  GSAP, iconos npm, fuentes de Google ni CDNs. Los iconos se dibujan como SVG inline, igual
  que en `Encabezado.tsx:43-51`.
- **No hay carpeta `public/` ni un solo asset.** Si necesitas algo gráfico, se dibuja en SVG/CSS.
- **Datos:** villa-app es una vitrina, no dueña de datos (`villa-app/next.config.ts:3-15`).
  Todo lo que consuma sale de `/api/*` por el rewrite a `:3200` (`:24-31`), y **solo** con las
  funciones de `villa-app/lib/api.ts`. No escribas URLs absolutas ni `localhost:3200` en
  ningún componente.
- **Textos de marca:** siempre desde `villa-app/lib/marca.ts` (`NEGOCIO`, `SEDES`,
  `sedePorNumero`). Ni un nombre de sede escrito a mano.
- **Servidor vs cliente:** la página es Server Component; solo son `"use client"` las islas
  que lo necesitan (vitrina de precios, selector de sede + CTA, formulario de correo, reveal
  por scroll). El héroe debe llegar pintado en el HTML: es una campaña, se abre con datos
  móviles.
- **Metadata propia** de `/inicio` (título y descripción). Sin `keywords` con lugares. Ojo con
  KN-008: el copy público se audita contra `components/marca/datos.ts`.
- **Corre en:** `npm run dev` en `:3201`, con `broaster-app` levantado en `:3200`
  (`villa-app/package.json:6-11`). La página debe funcionar aunque `:3200` esté caído.

---

## 8. PROHIBIDO EN ESTE PROYECTO

1. **Fotos de banco de imágenes.** No hay ni una foto real (`ArteProducto.tsx:1-12`); una
   foto genérica de pollo frito es una mentira sobre el producto de este señor.
2. **Precios escritos en el código.** Los 23 productos son de ejemplo
   (`almacen-disco.ts:360-366`). Todo precio sale de la API o no sale.
3. **Ciudad, municipio, calle, carrera o mapa.** Prohibición del dueño
   (`components/marca/datos.ts:12-14`) y ya hubo un incidente ("Rionegro", KN-008).
4. **Teléfonos.** `(604) 000 00 00` es relleno marcado REEMPLAZAR. Ni un botón de llamar, ni
   un WhatsApp inventado.
5. **Cifras sociales de cualquier tipo:** años de experiencia, "más de X familias", pollos
   vendidos, calificaciones, testimonios, logos de "confían en nosotros". Cero existen.
6. **Descuentos, "antes/ahora", precios tachados.** El servidor congela precios y no sabe de
   rebajas: un descuento pintado se convierte en un cobro distinto en la confirmación
   (`villa-app/lib/promos.ts:9-23`, KN-009).
7. **Publicar los cupones VB-\*** ni las 4 promos hasta que el dueño las apruebe (H-6).
8. **Azules eléctricos, morados, neones, gradientes tecnológicos.** Prohibición permanente
   del sistema de diseño del dueño; y aquí además desentonan con el rojo/naranja de la marca.
9. **Sidebar izquierda.** Regla dura, sin excepciones (`memory/asadero/brief.md:21`).
10. **Inglés en la interfaz** (`Prompt-Claude-Design-VillaApp.md:59`).
11. **Tocar `broaster-app`**, `app/page.tsx` de villa-app, o el flujo de carrito/checkout.
12. **Reciclar el copy de la landing borrada** sin fuente (ver §3).
13. **Prometer cobertura, costo de domicilio o mínimo de pedido:** no existen en el dominio.

---

## 9. HUECOS DEL DUEÑO (esto es lo primero que hay que leer)

Nada de esto se rellena con algo verosímil. Mientras falte, la sección correspondiente no se
publica o se queda sin ese dato.

- **H-1 · Teléfono / WhatsApp de pedidos.** Hoy solo existe `(604) 000 00 00` marcado
  REEMPLAZAR. *Por qué:* en el pueblo la mitad de la gente va a querer llamar o escribir por
  WhatsApp antes que llenar un formulario; sin este dato la página pierde su segundo canal.
- **H-2 · Horarios reales de cada sede.** Los de `11:00–9:00 p.m.` y `11:00–10:00 p.m.` vienen
  marcados REEMPLAZAR en el original (`datos.ts:50-51, :60-61`). *Por qué:* publicar un horario
  falso manda gente a un local cerrado.
- **H-3 · Carta y precios reales por sede.** Los 23 productos son ejemplo (PEND-003). *Por qué:*
  aunque la página lee precios en vivo, el dueño tiene que dejar su carta verdadera en el
  admin **antes** de publicar, o mostrará precios de ejemplo con su nombre encima.
- **H-4 · Fotos reales** (al menos el balde familiar, un combo y las dos fachadas). *Por qué:*
  es lo que más vendería, y hoy no existe ninguna; el arte con iniciales es un plan B honesto.
- **H-5 · Logo real y, si existe, colores de marca impresos.** Solo hay `app/icon.svg`.
- **H-6 · Qué promociones honra de verdad.** Las 4 promos y los 3 cupones son prototipo
  (`lib/promos.ts:1-7`). *Por qué:* un cupón en una página de campaña es una promesa que
  alguien va a reclamar en el mostrador mañana.
- **H-7 · Cobertura del domicilio, costo y pedido mínimo.** No están modelados en ninguna
  parte. *Por qué:* "domicilio" sin decir hasta dónde genera pedidos que hay que cancelar.
- **H-8 · ¿Se confirman "25–35 min" y "30–40 min"?** El propio código dice que "hoy nadie la
  calcula, la dice el dueño" (`lib/marca.ts:30-32`). *Por qué:* en una portada eso se lee como
  compromiso.
- **H-9 · Una frase de oficio verificable:** desde cuándo existe el negocio, quién fríe, qué
  tiene el apanado. *Por qué:* sin ella la página no puede contar ninguna historia — y con
  ella, la sección "Así se hace" pasa de correcta a memorable.
- **H-10 · ¿Se activa la lista de correo?** La API existe, pero hoy nadie la usa. *Por qué:*
  capturar correos que nadie va a leer es peor que no capturarlos.
- **H-11 · Dominio, hosting y a qué URL apuntarán las campañas** (PEND-004: no hay repo remoto
  ni hosting). *Por qué:* sin esto la página existe pero no tiene dónde publicarse, y hay que
  decidir si el dominio raíz será la carta o esta portada.
- **H-12 · Redes sociales**, si las hay. *Por qué:* el pie no puede inventar iconos.

---

## 10. CRITERIOS DE ACEPTACIÓN (verificables, no opinables)

Ejecuta todo desde `C:\Users\Kalel\asadero\villa-app`.

- **A1 · Compila:** `npm run typecheck` y `npm run build` terminan sin errores ni warnings
  nuevos.
- **A2 · Sin dependencias nuevas:** `git diff --stat package.json package-lock.json` sale
  vacío.
- **A3 · Sin datos inventados** (todas deben dar 0 resultados en `app/inicio` y
  `components/inicio`):
  - `rg "\(604\)|Rionegro|Calle |Carrera |Cra\.|Kra|NIT" app/inicio components/inicio`
  - `rg "\d{1,3}\.\d{3}" app/inicio components/inicio` → 0 (ningún precio escrito a mano)
  - `rg -i "testimonio|clientes felices|años de experiencia|familias|reseñ|★|4\.[0-9] estrellas" app/inicio components/inicio`
  - `rg -i "VB-VIENTO|VB-BOSQUE|VB-TANDA|antes \$|descuento" app/inicio components/inicio`
  - `rg -i "#(0[0-9a-f]{2}[0-9a-f]{3}|[0-9a-f]{0,2}(f{2})(f{2}))|blue|purple|indigo|violet" app/inicio components/inicio` → revisar a mano que no haya azules/morados ni hex fuera de los tokens de `globals.css`.
- **A4 · La raíz no cambió de comportamiento:** `git diff app/page.tsx` sale vacío y abrir
  `http://localhost:3201/` sigue mostrando la carta directamente, sin pantalla intermedia.
- **A5 · Deep link de sede:** abrir `http://localhost:3201/?sede=2` muestra "Pides en **Vía al
  Bosque**" en el encabezado, y en la consola
  `localStorage.getItem("villa-broaster:sede:v1") === "2"`. Con `?sede=9` o sin parámetro,
  se comporta como antes.
- **A6 · Aguanta el backend caído:** con `broaster-app` **apagado**,
  `curl -s -o /dev/null -w "%{http_code}" http://localhost:3201/inicio` devuelve `200`, el
  héroe y el botón "Pedir ahora" se ven, y no aparece ningún mensaje de error técnico.
- **A7 · Suscriptores de verdad:** con `broaster-app` levantado, enviar el formulario dos
  veces con el mismo correo produce primero un mensaje de éxito (201) y luego el mensaje
  amable de "ya estabas" (409). Verificable también con
  `curl -X POST localhost:3201/api/suscriptores -H "content-type: application/json" -d '{"nombre":"Prueba","email":"a@b.co"}'`.
- **A8 · Verdad de terreno visual — Edge headless a PNG** (el navegador embebido no cuenta):
  - `& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --window-size=390,2400 --screenshot="$env:TEMP\inicio-movil.png" "http://localhost:3201/inicio"`
  - `& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --window-size=1280,2000 --screenshot="$env:TEMP\inicio-escritorio.png" "http://localhost:3201/inicio"`
  - En los PNG debe cumplirse: (a) el botón "Pedir ahora" es lo más contrastado de la primera
    pantalla; (b) en escritorio el contenido está en columna centrada, no estirado; (c) no hay
    texto cortado ni desbordes horizontales; (d) el formulario de correo se ve claramente
    menos importante que el CTA.
- **A9 · Movimiento:** con `prefers-reduced-motion: reduce` activo en DevTools, ninguna
  animación de la página se mueve, y la página se entiende igual con todo quieto.
- **A10 · Contraste:** cada par texto/fondo que introduzcas queda anotado con su ratio en un
  comentario, como ya se hace en `globals.css:37-46`, y ninguno baja de 4.5:1 (3:1 para
  texto ≥ 24 px).
- **A11 · Trazabilidad:** todo dato visible de la página se puede señalar en `lib/marca.ts`,
  en la respuesta de `/api/productos` o en esta lista de hechos. Si algo no se puede señalar,
  se borra antes de entregar.
