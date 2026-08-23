# Biblioteca de referencias para landings (transversal a todos los proyectos)

Cada referencia que el dueño entrega (una especificación, una captura, una URL,
un video descrito) se guarda aquí como UNA ficha `NN-slug.md` con la plantilla de
`_PLANTILLA.md`. La ficha separa **qué aporta** (movimiento, composición, color,
copy, interacción) de **qué NO se copia** (marca ajena, textos, datos). El agente
`landing-prompter` lee este índice antes de escribir cualquier prompt, elige
2–3 referencias por landing y deja escrito en el prompt QUÉ tomó de cada una y
POR QUÉ (sección "Referencias combinadas"). Después del veredicto del dueño, la
combinación se anota en `ORION/memory/landings/state.json` (KN-/POL-) y la
columna "Resultados" de esta tabla se actualiza: así las combinaciones mejoran
de una landing a la siguiente.

| # | Ficha | Aporta (en una línea) | Usada en | Resultados |
|---|---|---|---|---|
| 01 | [01-hero-carrusel-figuras-toonhub.md](01-hero-carrusel-figuras-toonhub.md) | Hero a pantalla completa: carrusel de 4 figuras con roles (centro/izq/der/fondo), fondo que cambia de color, texto fantasma gigante detrás, flechas circulares, transición única de 650 ms | **villa-broaster v2** (zona HÉROE) — `villa-app-villa-broaster-v2.md`, 2026-08-23 | pendiente de veredicto |
| 02 | [02-scroll-cinematografico-capas-mostar.md](02-scroll-cinematografico-capas-mostar.md) | Escena pegada (sticky 100vh) dirigida por el scroll: capas PNG, título que sube y se va, primer plano que se abre en dos, close-up, paneles de historia con dato grande + línea, slider infinito de tarjetas contra-escalado; todo desde una variable suavizada + ~45 custom properties | **villa-broaster v2** (zona PROMO/CARTA, solo 2 mecanismos: "dato grande + línea" y capas contra-escaladas dentro de la tarjeta; sin rail de scroll), 2026-08-23 | pendiente de veredicto |
| 03 | [03-hero-spotlight-revela-segunda-imagen-lithos.md](03-hero-spotlight-revela-segunda-imagen-lithos.md) | Hero oscuro con spotlight que sigue al cursor/dedo y revela una segunda imagen por máscara radial suave; título serif itálica + sans; un solo acento cálido en el CTA; entrada Ken Burns + blur-rise escalonado | **villa-broaster v2** (zona CIERRE, spotlight sin segunda imagen: calienta la misma foto), 2026-08-23 | pendiente de veredicto |

## Combinaciones candidatas (hipótesis, aún sin veredicto — no son lecciones)

- **Portada móvil de comida (Villa Broaster PEND-009):** hero = 01 (carrusel con fondo que cambia, swipe) · tras el hero = 02 solo en su mecanismo de "dato grande + línea" para sedes y "se paga al recibir" (sin rail de 3700 px) · cierre = 03 como pieza de antojo (spotlight con el dedo que revela el pollo dorado) o el CTA naranja único. Se confirma o se descarta con el veredicto del dueño en móvil.
- **Ejecutada el 2026-08-23 en `villa-app-villa-broaster-v2.md`, con dos correcciones sobre la hipótesis:** (a) de la 02 no se toma el rail de scroll sino las **capas contra-escaladas dentro de la tarjeta de promo** (la promo se arma sola al tocarla) — es el único modo honesto de que una promo se sienta oferta cuando el descuento tachado está prohibido; (b) la 03 **no puede revelar una segunda imagen** porque en disco hay una sola foto por producto y no se inventan assets: el foco **calienta** la misma foto (`brightness(.35) saturate(.5)` fuera / `1.15` a color pleno dentro). Sigue **pendiente de veredicto, y el veredicto se anota por canal (móvil / escritorio)**.

## Reglas de combinación (se afinan con cada veredicto)

1. **Una referencia manda el hero, otra la carta/sección de producto, otra el
   cierre.** Nunca tres referencias peleando por la misma sección.
2. **Se copia el MECANISMO, nunca el contenido:** del TOONHUB se toma el carrusel
   y el cambio de fondo; jamás "3D SHAPE", "TOONHUB", el testimonio ni las figuras.
3. **La paleta la pone el proyecto, no la referencia** (POL-001: cálida de base +
   acentos del producto; nada de azules eléctricos, morados, neones).
4. **Cada mecanismo se justifica en términos de venta** ("el cambio de color por
   producto hace que el cliente pase 4 productos en 3 segundos"), si no, se cae.
5. **Móvil primero**: una referencia de escritorio se adapta (swipe, tap targets
   ≥40 px, sin hover como único camino) o no se usa.
