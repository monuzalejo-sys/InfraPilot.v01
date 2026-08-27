---
slug: verificar-con-evidencia
titulo: Cómo se comprueba un resultado en esta máquina (y por qué no se confía en la vista)
alias: [captura, capturas, captura de pantalla, capturas de pantalla, pantallazo, pantallazos, screenshot, screenshots, sacar una captura, tomar una foto de la pagina, imagen de la pagina, captura del sitio, pantallazo del sitio, captura de la web, captura de la landing, foto del sitio, png, pdf, pdfs, generar pdf, generar un pdf, genero un pdf, genero pdf, generacion de pdf, hacer un pdf, sacar un pdf, saco un pdf, armar un pdf, pasar a pdf, paso a pdf, convertir a pdf, html a pdf, de html a pdf, exportar a pdf, imprimir a pdf, imprimir en pdf, print-to-pdf, edge headless, edge, msedge, headless, cdp, edge-cdp, edge-cdp.mjs, navegador, navegador embebido, pane, browser, poppler, pdftoppm, python, verificar, verificacion, comprobar, comprobacion, evidencia, prueba, probar, medir, medicion, mediciones, qa, qa visual, calidad, veredicto, pass, fail, movil, celular, 390, viewport, overflow, desborde, desbordamiento, bamboleo, scroll lateral, animacion, animaciones, getanimations, reduced motion, tap target, scrollwidth, clientwidth, papel, impresora, imprimir, factura, comprobante, caja, cajero, mostrador, arqueo, bascula, en esta maquina, cortada, cortado, recortada, recortado, captura recortada, captura cortada, screenshot cortado, se ve cortado a la derecha, corrido a la derecha, se sale a la derecha, ancho equivocado, se ve mal en celular, getcomputedstyle, css calculado, estilo calculado, valor calculado, clamp, calc, var css, variable css, escala de espaciado, espaciado, padding, paddings, margenes, token de diseno, tokens de diseno, valor arbitrario, arbitrary value, tailwind, el grep no lo vio, grep en 0, grep no basta, buscar con grep el valor, medir el padding, medir espaciados, medir colores, contraste calculado]
preguntas: ["como saco una captura de una pagina en esta maquina", "como genero un pdf", "¿cómo verifico que esto de verdad quedó bien?", "¿por qué la captura se ve cortada a la derecha?", "¿cómo pruebo cómo se ve en celular?", "¿cómo compruebo que el PDF no salió corrupto?", "¿cómo saco un pantallazo del sitio?", "¿cómo tomo un screenshot de la landing?", "el grep no encontró nada pero el diseño está mal, ¿cómo lo compruebo?", "¿cómo mido los paddings o colores reales de una pantalla?"]
proyectos: [_permanent, landings, wrd, placita, villa-broaster, estanco-contable]
confianza: alta
actualizado: 2026-08-27
---

# Cómo se comprueba un resultado en esta máquina

## Respuesta corta

**Captura + medición de cualquier página, en un solo comando:**
`node C:/Users/Kalel/ORION/tools/edge-cdp.mjs --url <archivo|url> --width 390 --height 844 --mobile --shot salida.png`
— y después **abre el PNG con Read**: la captura es la evidencia, no el recuerdo.
**PDF:** escribe el documento en HTML con `@page`, imprímelo con Edge headless
(`--headless --disable-gpu --no-pdf-header-footer --print-to-pdf=<salida.pdf> <file:///entrada.html>`)
y **valídalo contando `/Type /Page` con node** — aquí no hay Python ni poppler.
**Nunca** uses `msedge --screenshot` a secas para juzgar móvil (miente el ancho y apaga
las animaciones) ni el navegador embebido para juzgar CSS. **Todo veredicto lleva un
número medido**; si no puedes escribir el número, todavía no verificaste.

## Por qué (qué lo pagó)

**Lo pagó una vista que mentía.** En WRD sesión 4 (2026-08-10) el panel de navegador
embebido afirmaba que un `<main>` con `visibility:hidden` seguía visible; se perdieron
varias iteraciones "arreglando" un CSS que estaba perfecto, hasta que Edge headless
mostró la pantalla real: negra, con solo el gate. El panel reporta mal `visibility`
computada y `checkVisibility({visibilityProperty:true})` —incluso con `!important` o
inline— y con el pane oculto los screenshots directamente se cuelgan
(`wrd/KN-006`, `_permanent/KN-007`, `_permanent/KN-008`).

**Lo pagó también una captura que mentía.** `msedge --headless=new --window-size=390,844
--screenshot` produce un PNG de 390 px, pero la página se maqueta a **492 px** y el PNG
sale **recortado**: se ve un layout ancho cortado, no lo que ve un celular
(`landings/KN-003`, medido con página sonda el 2026-08-19; **reproducido el 2026-08-24**:
PNG 390×844, `innerWidth=492`). Y el mismo binario reporta
`prefers-reduced-motion: reduce` por defecto, así que **toda captura simple sale sin
animación** — inútil para aprobar movimiento. Sobre el entregable de Claude Design,
`document.getAnimations()` devolvió **1** en toda la página pese a un inventario de diez
animaciones en el prompt (`landings/KN-008`).

**Dos reglas del corpus se contradicen, y hoy se zanjó con medición.** `wrd/KN-008` culpa
a la escala de Windows (125 %) y receta compensar: `--window-size=488` para "ver 390".
`landings/KN-003` dice que es un **piso duro ~492** que no baja ni con
`--force-device-scale-factor=1`. Medición del 2026-08-24 con la página sonda:
`--window-size=800 → innerWidth 776`, `600 → 576`, `488 → **492**`, `390 → **492**`.
No es escala (800 daría 1000): es **24 px de cromo más un piso**. Gana `landings/KN-003`.
La receta del 488 parecía funcionar solo porque 488 cae justo al lado del piso y recorta
apenas 4 px. **Vale la regla más nueva y medida: `_permanent/KN-010` — `edge-cdp.mjs`,
que emula el viewport de verdad (`innerWidth=390` confirmado hoy) y enciende el
movimiento.**

**Y lo pagó un falso positivo.** Verificando el teclado del PIN del estanco se diagnosticó
un bug que no existía: los clicks JS síncronos no dejan re-renderizar entre pulsaciones,
así que el estado leído era el inicial. El componente estaba bien; costó varios intentos
(`estanco-contable/KN-003`).

**La misma desconfianza ya es regla de negocio.** En placita, `impresaEn` **no** se estampa
al iniciar la impresión: solo después de que el humano responde *"¿Salió el papel?"*
(`placita/DEC-013`). Que la API diga "impreso" no es evidencia de que salió papel — igual
que un screenshot del pane no es evidencia de cómo se ve la pantalla.

## Cómo se aplica

1. **Captura y medición de una página — el caso del 90 %.**
   `node C:/Users/Kalel/ORION/tools/edge-cdp.mjs --url <archivo|url> --width 390 --height 844 --mobile --shot out.png`
   Devuelve JSON con `innerWidth/innerHeight`, `scrollWidth`, `clientWidth`, `overflowX`,
   `scrollHeight`, `getAnimations().length`, `reducedMotion`, fuentes cargadas, título,
   consola y excepciones, más el PNG. Flags útiles: `--full` (página entera), `--eval "<js>"`
   (mide lo que quieras), `--wait ms`, `--reduce` (para probar el respaldo de accesibilidad),
   `--width 1440` sin `--mobile` para escritorio.
2. **Abre el PNG con la herramienta Read.** Un PNG que nadie miró no es evidencia.
3. **PDF.** Documento en HTML con `@page`/`@media print`, y:
   `"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="C:\ruta\salida.pdf" "file:///C:/ruta/entrada.html"`
   (`_permanent/KN-004`). Para celular, tamaño de página propio: `@page 110mm x 195mm`
   más `print-color-adjust` para que las barras de color impriman
   (`villa-broaster/DEC-011`).
4. **Valida el PDF con node**, porque no hay renderizador: que empiece por `%PDF-`,
   contenga `%%EOF` y tenga páginas contando `/Type\s*\/Page(?!s)`
   (`_permanent/KN-005`; implementación real en
   `C:\Users\Kalel\prommter\proyectos\villa-broaster\docs\semanal\generar.mjs:114-125`).
   Comprobado el 2026-08-24 sobre un PDF recién generado: `%PDF- true`, `%%EOF true`,
   1 página, 18 300 bytes.
5. **Mide, no mires.** El repertorio que ya se pagó:
   - **desborde móvil**: `scrollWidth` vs `clientWidth` — pero **el bamboleo real** se prueba
     con `scrollTo(5,0)` y leyendo `scrollX` después: los `fixed inset-x-0` producen falsos
     positivos de ~3 px en `scrollWidth` (`placita/KN-036`). Ojo: `edge-cdp.mjs` reporta
     `overflowX` justamente por `scrollWidth > clientWidth`
     (`ORION/tools/edge-cdp.mjs:117`), así que ante un desborde de pocos píxeles hay que
     confirmarlo con `--eval` y `scrollX`.
   - **orden visual en móvil**: posiciones **Y** de `getBoundingClientRect()`, nunca el
     orden del markup — `order` de CSS engaña a cualquier lectura del DOM (`placita/KN-036`).
   - **movimiento**: `document.getAnimations().length` (`landings/KN-008`).
   - **escala de espaciado, color o tipografía (todo lo que sea un valor de diseño)**: el
     grep del valor literal **no basta y miente tranquilizando**. `p-[Npx]` daba 0 en
     `app/` y `components/` y aun así, midiendo a 390 px con `--eval` sobre
     `getComputedStyle(el).padding` de cada elemento, salieron **dos paddings de 22 px**
     escondidos en `p-[clamp(22px,2.6vw,34px)]` (`villa-broaster/KN-024`, 2026-08-26). Lo
     mismo vale para `calc()`, variables CSS, valores heredados y clases compuestas: **el
     grep es el primer filtro, el CSS calculado en el ancho real es la prueba**. Y mídelo
     en **cada ancho que el criterio nombre**: un `clamp` es correcto a 1440 px y
     prohibido a 390.
   - **tocable**: tap targets ≥ 40 px y campos de formulario ≥ 16 px de fuente, o iOS Safari
     hace zoom al enfocar (`villa-broaster/KN-015`, `placita/KN-036`).
   - **pantalla llena sin scroll**: viewport vs `scrollHeight` en la resolución real —
     medido 1366×768 = 768/768 y 1280×800 = 800/800 en `/ventas` (`placita/KN-031`).
6. **Flujo, no pixeles: ahí el pane embebido sí sirve**, incluso oculto —
   `get_page_text`, `read_page`, `form_input` (maneja inputs controlados de React) y
   `javascript_tool` con `.click()` nativo. Para llenar inputs de React **no** uses el setter
   nativo (`Illegal invocation`): usa `form_input` (`_permanent/KN-007`). Entre tecla y tecla,
   espera 150-200 ms y **lee el estado real** (`estanco-contable/KN-003`). Para comprobar una
   mutación, navega por los **enlaces** de la app, no con F5: la recarga remonta el provider
   (`estanco-contable/KN-010`).
7. **Escribe el veredicto con su número y su condición.** El manual de placita lleva pie de
   verificación por sección —qué se probó en vivo, qué contra código, qué falló—
   (`placita/KN-037`); el porcentaje semanal de villa-broaster solo sube con evidencia
   verificada (tests, navegador, archivos, PRs), nunca autorreportada
   (`villa-broaster/DEC-011`).
8. **Antes de dar por bueno un e2e con datos, mira dónde cayeron.** El e2e de facturación de
   placita se hizo sin clave de caja: el outbox devuelve 401 y nada sube a la Supabase real
   (`placita/KN-028`) — pero ese mismo navegador quedó con facturas de prueba en
   `localStorage`, y eso hoy es un riesgo abierto (`placita/RSK-004`).

## Cuándo NO aplica

- **Escritorio, sin movimiento y sin dudas de ancho**: `--screenshot` a secas basta y es más
  rápido. Es exactamente lo que dice `_permanent/KN-010` al retirarlo solo del QA móvil.
- **El pane embebido no está prohibido.** Son fiables `.hidden`, `checkVisibility` para
  `display`, `display:none` y **la geometría de `getBoundingClientRect`** (es métrica de
  layout). Lo que no es fiable es `visibility` computada y los screenshots
  (`_permanent/KN-008`, `wrd/KN-008`).
- **Un PDF no se puede VER en esta máquina** — hueco explícito del corpus. No hay
  `pdftoppm` ni renderizador interno: lo que se verifica es la **estructura** del PDF más una
  **captura del HTML fuente** (`villa-broaster/KN-013`, punto 4). Si alguien pide "revisa que
  el PDF se vea bien", lo honesto es capturar el HTML y decir que el PDF solo se validó
  estructuralmente.
- **Trabajo sensible a seguridad** (auth, admin, RLS): medir no alcanza. WRD sesión 3: el
  verificador dio FAIL y dos adversarios dedicados encontraron **16 hallazgos reales** que los
  smokes no vieron, incluido un PIN de admin filtrado en un comentario (`wrd/KN-004`).
- **Hardware real** (báscula, impresora, datáfono): ninguna medición de navegador lo
  reemplaza. La verificación de la báscula quedó marcada como "requiere confirmación del dueño
  en mostrador" (`placita/KN-034`), y la impresión solo se da por buena con el papel en la mano
  (`placita/DEC-013`).
- **El barrido completo cuesta**: el QA de villa-broaster del 2026-08-23 midió 133k + 174k
  tokens en los dos agentes de QA, más 88k + 102k de builders y 77k del verificador
  (`villa-broaster/KN-015`). Eso se justifica ante un release, no ante un cambio de una línea
  (ver [[TEMA-modelos-y-costos]]).
- **Si el comando de captura se hace largo**, no lo pases por Bash con heredoc: arriba de ~8 KB
  se trunca en esta máquina y el archivo no se crea (`_permanent/KN-011`). Escribe el script
  con Write.
- **Ruido que no es falla**: Edge headless escupe líneas `ERROR:` en stderr (task_manager,
  `LoadEnclaveImageW error 577`) y aun así escribe el PNG/PDF. Si de verdad no escribió el
  archivo, reintenta con `--user-data-dir` fresco (`_permanent/KN-009`).

## Evidencia

- `_permanent/KN-004` — generar PDF con Edge headless; no hay Python en esta máquina.
- `_permanent/KN-005` — validar un PDF sin poppler contando `/Type /Page`.
- `_permanent/KN-007` — qué funciona en el pane embebido con el pane oculto.
- `_permanent/KN-008` — la verdad de terreno visual/CSS es Edge headless, no el pane.
- `_permanent/KN-009` — piso de viewport ~480-500 px y ruido intermitente de Edge.
- `_permanent/KN-010` — `edge-cdp.mjs`: la herramienta vigente de QA visual.
- `_permanent/KN-011` — límite de ~8 KB del tool Bash.
- `landings/KN-003` — las dos trampas de Edge headless (ancho y reduced-motion) y la receta CDP.
- `landings/KN-008` — `getAnimations()` = 1 sobre el entregable del generador.
- `villa-broaster/KN-024` — grep de `p-[Npx]` en 0 y **dos paddings de 22 px** medidos a
  390 px con `getComputedStyle`, escondidos en `p-[clamp(22px,2.6vw,34px)]`: el límite
  exacto entre buscar en el código y medir en el navegador.
- `landings/POL-003` — móvil es canal principal: toda combinación se mide por CDP a 390 px.
- `wrd/KN-006` — el pane miente sobre `visibility`; iteraciones perdidas.
- `wrd/KN-008` — captura compensada a 488 px (**refutada por medición, ver abajo**); la
  geometría del pane sí es fiable; esa misma captura cazó un bug real
  (`input[type=password]` sin `width:100%`).
- `wrd/KN-004` — ronda adversarial en trabajo sensible a seguridad.
- `wrd/KN-002` — los entornos locales fuerzan `prefers-reduced-motion`.
- `placita/KN-036` — `scrollTo(5,0)`+`scrollX` para el bamboleo; posiciones Y para el orden; 16 px en campos.
- `placita/KN-031` — medición de viewport lleno en resoluciones reales.
- `placita/KN-037` — manual con pie de verificación honesto por sección.
- `placita/KN-028` — e2e de facturación sin ensuciar la nube real; `placita/RSK-004` (riesgo que dejó).
- `placita/KN-034` — verificación con hardware real requiere el mostrador.
- `placita/DEC-013` — "¿Salió el papel?": la versión de negocio de esta misma regla.
- `estanco-contable/KN-003` — falso positivo por no medir el estado real.
- `estanco-contable/KN-010` — verificar mutaciones navegando por enlaces, no con F5.
- `villa-broaster/KN-015` — barrido QA 2026-08-23 con sus costos medidos.
- `villa-broaster/KN-013` — no hay renderizador PDF interno; usar CDP y no `--screenshot`.
- `villa-broaster/DEC-011` — el porcentaje solo sube con evidencia verificada; PDF de celular.
- Código: `C:\Users\Kalel\ORION\tools\edge-cdp.mjs:108-117` (emulación de viewport y de
  `prefers-reduced-motion`, y el bloque de métricas) y
  `C:\Users\Kalel\prommter\proyectos\villa-broaster\docs\semanal\generar.mjs:105-125`
  (impresión con Edge + `validarPdf`).
- **Medición propia 2026-08-24** (página sonda que imprime `innerWidth`, Edge en
  `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`):
  `--screenshot --window-size=390,844` → PNG 390×844 con `innerWidth=492`;
  `488 → 492`; `600 → 576`; `800 → 776`. Es cromo fijo (24 px) + piso, **no** escala 125 %.
  `edge-cdp.mjs --width 390 --mobile` → `innerWidth=390`, `reducedMotion=false`.
  PDF generado y validado: `%PDF-` sí, `%%EOF` sí, 1 página.

## Enlaces

- [[TEMA-generadores-de-diseno]] — el paso 7 de su "cómo se aplica" es este tema: revisar con
  evidencia (captura a 390 por CDP + una medición) antes de dar un veredicto.
- [[TEMA-modelos-y-costos]] — cuánto cuesta de verdad una ronda de QA y cuándo no vale la pena.
- [[TEMA-caja-y-turnos]] — donde vive la otra cara de "no confíes en la vista": la plata y el
  papel se confirman contra el mundo físico, no contra lo que dice la pantalla.
