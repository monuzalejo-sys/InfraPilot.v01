# Biblioteca de referencias para landings (transversal a todos los proyectos)

Cada referencia que el dueño entrega (una especificación, una captura, una URL,
un video descrito) se guarda aquí como UNA ficha `NN-slug.md` con la plantilla de
`_PLANTILLA.md`. La ficha separa **qué aporta** (movimiento, composición, color,
copy, interacción) de **qué NO se copia** (marca ajena, textos, datos). El agente
`orion-landing` lee este índice antes de escribir cualquier prompt, elige
2–3 referencias por landing y deja escrito en el prompt QUÉ tomó de cada una y
POR QUÉ (sección "Referencias combinadas"). Después del veredicto del dueño, la
combinación se anota en `ORION/memory/landings/state.json` (KN-/POL-) y la
columna "Resultados" de esta tabla se actualiza: así las combinaciones mejoran
de una landing a la siguiente.

| # | Ficha | Aporta (en una línea) | Usada en | Resultados |
|---|---|---|---|---|
| 01 | [01-hero-carrusel-figuras-toonhub.md](01-hero-carrusel-figuras-toonhub.md) | Hero a pantalla completa: carrusel de 4 figuras con roles (centro/izq/der/fondo), fondo que cambia de color, texto fantasma gigante detrás, flechas circulares, transición única de 650 ms | **villa-broaster v2** (HÉROE) 2026-08-23 · **villa-broaster v3** (PORTADA) 2026-08-23 · **prommter-agencia-v2** (HÉROE) 2026-08-29 | **v2 RECHAZADO en móvil** ("mejor fondo… genérico, apagado"); escritorio sin revisar. Causa por ficha: **el fondo que cambia de color NO se ejecutó** (`--brasa` = 0 apariciones; el medio pintó la portada crema) y con fondo claro **el texto fantasma muere**. Sin animación viva, los roles por índice se ven como discos quietos. → **este mecanismo solo vive sobre fondo oscuro y necesita el disco lateral cortado por el borde.** v3 pendiente (PEND-004). · **prommter 2026-08-29: ACEPTADO** (parcial, sin desglose): con las dos correcciones aplicadas (fondo oscuro + pieza lateral cortada) el dueño dijo "me gustó lo que veo". En la iteración de mejora **NO se re-abre**: un mecanismo aprobado no se toca |
| 02 | [02-scroll-cinematografico-capas-mostar.md](02-scroll-cinematografico-capas-mostar.md) | Escena pegada (sticky 100vh) dirigida por el scroll: capas PNG, título que sube y se va, primer plano que se abre en dos, close-up, paneles de historia con dato grande + línea, slider infinito de tarjetas contra-escalado; todo desde una variable suavizada + ~45 custom properties | **villa-broaster v2** (PROMO/CARTA, solo "dato grande + línea" y capas dentro de la tarjeta) · **villa-broaster v3** (CARTA/PROMO) 2026-08-23 · **prommter-agencia-v2** (CIFRA: comisión, "2 toques / 6 toques / $0", "4 sistemas · 1 en uso") 2026-08-29 | **Lo único que sobrevivió al rechazo.** El **"dato grande + línea"** ("2 sedes", "$0") se ejecutó tal cual y **no fue criticado**: es el mecanismo más resistente de la biblioteca porque **no depende de gesto ni de tiempo**, se ve en una captura. La promo que se arma quedó invisible (estado `promoArmada` en el markup, lienzo estático). v3 pendiente (PEND-004). · **prommter-agencia-v3-mejora 2026-08-29:** primera vez que se toma su **MOTOR** (variable de scroll suavizada `lerp .14` + tramos `smoothstep` + ≤8 custom properties) y no solo el "dato grande", en dosis acotada (una sola escena héroe→calculadora, rail extra ≤ 60 vh, sin capas PNG, sin parallax de puntero). Sin veredicto (PEND-006) |
| 03 | [03-hero-spotlight-revela-segunda-imagen-lithos.md](03-hero-spotlight-revela-segunda-imagen-lithos.md) | Hero oscuro con spotlight que sigue al cursor/dedo y revela una segunda imagen por máscara radial suave; título serif itálica + sans; un solo acento cálido en el CTA; entrada Ken Burns + blur-rise escalonado | **villa-broaster v2** (CIERRE, spotlight que calienta la misma foto) · **villa-broaster v3** (CIERRE, foco ya puesto) 2026-08-23 · **prommter-agencia-v2** (CIERRE, foco fijo sobre el botón + acento único) 2026-08-29 | **v2: ni apareció.** El CSS del foco estaba escrito, pero su valor entero es un gesto y el dueño revisa capturas quietas: no lo mencionó porque no lo vio. → **solo se usa si su estado EN REPOSO ya se ve bien** (foco ya colocado sobre el producto). v3 pendiente (PEND-004). · **prommter-agencia-v3-mejora 2026-08-29:** el foco resuelto en reposo se mantiene y gana **dirección** (órbita mínima de 9 s en el cierre; el halo se traslada al panel del dueño cuando entra el pedido). Sigue sin depender de gesto en táctil. Sin veredicto (PEND-006) |

## Combinaciones candidatas (hipótesis, aún sin veredicto — no son lecciones)

- **Portada móvil de comida (Villa Broaster PEND-009):** hero = 01 (carrusel con fondo que cambia, swipe) · tras el hero = 02 solo en su mecanismo de "dato grande + línea" para sedes y "se paga al recibir" (sin rail de 3700 px) · cierre = 03 como pieza de antojo (spotlight con el dedo que revela el pollo dorado) o el CTA naranja único. Se confirma o se descarta con el veredicto del dueño en móvil.
- **VEREDICTO 2026-08-23 (móvil): la combinación se rechazó, y la causa no fue elegir mal las fichas sino el MEDIO.** Claude Design ancló un design system propio ("Modernist": fondo claro, radio 0, Archivo, fotos en blanco y negro) y devolvió artboards estáticos (`document.getAnimations()` = 1). Resultado: de los tres mecanismos, uno **no se ejecutó** (01, fondo por producto), otro **quedó invisible** (03, foco por gesto) y solo sobrevivió el que se ve quieto (02, dato grande). Lecciones en `ORION/memory/landings/state.json`: **KN-007** (armadura contra el DS del medio), **KN-008** (lienzo estático → movimiento congelado + anexo de coreografía), **KN-009** (portada clara mata el hambre), **POL-004**.
- **Ejecutada el 2026-08-23 en `villa-app-villa-broaster-v2.md`, con dos correcciones sobre la hipótesis:** (a) de la 02 no se toma el rail de scroll sino las **capas contra-escaladas dentro de la tarjeta de promo** (la promo se arma sola al tocarla) — es el único modo honesto de que una promo se sienta oferta cuando el descuento tachado está prohibido; (b) la 03 **no puede revelar una segunda imagen** porque en disco hay una sola foto por producto y no se inventan assets: el foco **calienta** la misma foto (`brightness(.35) saturate(.5)` fuera / `1.15` a color pleno dentro). Sigue **pendiente de veredicto, y el veredicto se anota por canal (móvil / escritorio)**.

- **Ejecutada el 2026-08-29 en `prommter-agencia-v2.md` (landing de la propia casa, rubro SOFTWARE, no comida):** hero = **01** con las dos correcciones que dejó su veredicto (fondo obligatoriamente oscuro + pieza lateral cortada por el borde), pero las "figuras" son cuatro **teléfonos dibujados en CSS/SVG** con la vitrina de cuatro tipos de negocio (asadero / plaza / estanco / mayorista) y el fondo cambia de color por negocio; cifra = **02**, solo el "dato grande + línea", usado tres veces (comisión $360.000–$540.000, "2 toques / 6 toques / $0", "4 sistemas · 1 en uso todos los días"); cierre = **03**, únicamente su acento cálido único sobre oscuro y el **foco ya puesto** sobre el botón (nada por gesto). Apuesta explícita a verificar: sacar la dirección oscura fuera de comida, justificada porque **aquí el producto son pantallas y una pantalla brilla sobre fondo oscuro** — no por extrapolar KN-009. **VEREDICTO PARCIAL 2026-08-29, POSITIVO:** la landing se construyó y el dueño dijo *"me gustó lo que veo pero quiero algo mejor, no re hagas, mejora lo que hiciste"*. Es la **primera aceptación de una combinación** tras dos rechazos. No dijo canal ni desglosó por ficha: eso sigue abierto (`landings/PEND-005`).

- **Iteración de ACABADO, no de rediseño (2026-08-29, `prommter-agencia-v3-mejora.md`):** cuando una combinación ya fue aceptada, la siguiente vuelta **no re-abre el hero**. Se sube el escalón dentro de las mismas fichas: de la **02** se pasa del "dato grande" a su **motor de scroll** (dosis acotada, una escena); de la **03** se pasa del "foco fijo" al **foco que dirige la mirada**; la **01** se congela. Regla de combinación derivada (nº 8 abajo). Sin veredicto (`landings/PEND-006`).

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
6. **El mecanismo tiene que verse EN REPOSO** (pagada el 2026-08-23, KN-008). Antes
   de elegir una ficha, pregúntate cómo se ve **congelada en una captura**: si su
   valor entero depende de un gesto o de una transición, el revisor —y el generador
   de diseño, que devuelve artboards— no la va a ver. Se usa igual, pero
   especificando su **estado congelado** (foco ya puesto, promo a medio armar,
   pieza siguiente asomando cortada) y bajando la coreografía a un anexo.
7. **La paleta del proyecto se defiende por escrito** (pagada el 2026-08-23, KN-007).
   El generador ancla design systems genéricos claros/planos si el prompt no se lo
   prohíbe en imperativo y con criterio medible. Toda combinación va acompañada de
   la "armadura contra el medio" del apartado correspondiente.
8. **Una ficha aceptada no se re-abre; se sube un escalón dentro de ella**
   (2026-08-29, `landings/KN-012`). Si el dueño acepta la landing y pide "algo
   mejor", la zona que le gustó se congela y la mejora se busca en el mecanismo
   siguiente de la MISMA ficha (de "dato grande" a su motor de scroll; de "foco
   fijo" a "foco que dirige"), en pases acotados y reversibles. Cambiar de ficha
   en una zona aprobada es rehacer, y rehacer es la forma más cara de perder una
   aceptación.
