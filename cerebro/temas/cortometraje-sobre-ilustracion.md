---
slug: cortometraje-sobre-ilustracion
titulo: "Dirigir un cortometraje sobre ilustraciones reales, no redibujarlo en código (Remotion)"
alias: [corto, cortometraje, video, vídeo, video corto, comercial animado, spot, anuncio animado, animacion, animación, animar, remotion, render de video, renderizar video, camara, cámara, movimiento de camara, empuje de camara, empuje de cámara, paneo, panoramica, panorámica, dolly, travelling, zoom, plano, planos, encuadre, encuadres, foco, foco de camara, centro de la camara, corte, cortes, salto de continuidad, salto de eje, dos planos iguales, mismo encuadre, continuidad visual, ilustracion, ilustración, ilustraciones, pintura, pinturas, arte generado, arte del dueno, arte del dueño, dibujos del dueno, gemini, imagenes generadas, generado con ia, redibujar, redibujar en codigo, redibujar en código, svg, personaje en svg, vectores planos, se ve infantil, se ve feo, muy infantil y feo, rechazo del video, rechazo del corto, fotograma, fotogramas, still, stills, frame, frames, nitidez, varianza laplaciana, laplaciano, se ve borroso, se ve pixelado, se ve estirado, ablandado, borde negro, banda negra, descubre el borde, grano, vineta, viñeta, textura de pelicula, textura comun, mp4, encoder, encoder de video, avassetwriter, swift, swiftc, ffmpeg, remotion render, --sequence, secuencia de imagenes, numeracion de fotogramas, verificar animacion, verificar animación, verificador de fotogramas, ola de verificadores, olas de escenas, director, veredicto del director, cuanto puedo acercar la camara, hasta donde puedo hacer zoom, guia de marca, guía de marca, referencias de arte, resolucion nativa, resolución nativa, macos 13, macos 15, ventura, sequoia, compositor de remotion, sigabrt, continuitycamera]
preguntas: ["¿cómo hago un corto animado a partir de las ilustraciones del dueño sin que se vea infantil?", "¿hasta dónde puedo acercar la cámara a una pintura sin que se vea borrosa?", "dos escenas me quedaron con el mismo encuadre, ¿cómo las diferencio?", "¿por qué me sale una banda negra cuando empujo la cámara hacia el borde de la pintura?", "¿cómo verifico que una animación quedó bien sin solo leer el código?", "el dueño rechazó el video por infantil, ¿qué hago distinto la próxima vez?", "¿cómo saco el mp4 si Remotion no codifica en esta máquina?", "¿le pido al generador de imágenes que anime, o construyo la animación yo encima de su arte?", "¿por qué el render terminó en verde y no hay ningún archivo de video?"]
proyectos: [duo-burger]
confianza: alta
actualizado: 2026-09-10
---

# Dirigir un cortometraje sobre ilustraciones reales, no redibujarlo en código

## Respuesta corta

**No redibujes con código: dirige cámara, luz, ritmo y rótulos sobre arte YA
TERMINADO** (pinturas completas, a su resolución nativa, con una textura común
—grano + viñeta— que unifica sesiones de arte distintas). La cámara sobre una
ilustración tiene un límite físico: con zoom `z` el foco solo llega a
`[1/(2z), 1-1/(2z)]` sin descubrir un borde negro, y ampliar la pintura fuente
más de 3x la ablanda de forma medible; dos planos pegados al mismo borde se
distinguen por **escala** (relación ≥ 1,3), nunca por foco. Verifica
renderizando fotogramas sueltos y **midiéndolos** (posición, nitidez,
columnas de borde) — nunca leyendo el código — y que el director revise cada
veredicto, no solo lo cuente. Si el compositor de video no arranca en tu
máquina, renderiza `--sequence` y codifica aparte; un render que termina en
verde sin producir el archivo no es una entrega.

## Por qué (qué lo pagó)

**Lo pagó un rechazo textual.** El primer intento (18 s, personajes en SVG
plano, paleta de caramelo, fondo synthwave) lo rechazó el dueño sin matices:
*"no me gustó para nada, muy infantil y feo"*. Lo que sí funcionó, en la misma
conversación: pedirle referencias y arte real —guía de marca con códigos
exactos, once escenas completas generadas por él mismo con Gemini a
1376×768— y construir la película ENCIMA de ese arte: cámara, luz, ritmo y
rótulos. La decisión quedó registrada así: *"Es lo que el arte permite y lo
que el dueño pidió: quiere UN BUEN RESULTADO, y con fotogramas pintados
completos el techo de calidad está en la dirección de cámara y en la textura
común, no en redibujar"* (`duo-burger/DEC-005`). La causa de fondo: el código
es malo fingiendo encanto dibujado a mano y bueno en cámara, luz, tipografía y
ritmo — con arte real debajo el techo sube muchísimo
(`feedback_video_no_infantil.md`, memoria del dueño).

**Lo pagó una banda negra.** La primera prueba de cámara empujó hacia un
letrero con `foco.y = 0,3` y descubrió un borde negro: la pintura escalada
solo cubre el encuadre si el foco cae dentro de `[1/(2z), 1-1/(2z)]`. Con dos
sujetos pegados al mismo borde a la misma escala, el resultado medido es el
MISMO encuadre — dos cortes seguidos que se leen como salto de continuidad — y
ampliar una pintura de 1376×768 más de 3x le baja la varianza laplaciana de
632 a 15, una pérdida de nitidez medible a simple vista
(`duo-burger/KN-014`, `src/film/kit/Pintura.tsx:51-61`).

**Lo pagó, sobre todo, una ola de verificación con números.** Ocho
constructores (opus) sobre un kit común + ocho verificadores independientes
(opus) que renderizaron 4-6 fotogramas cada uno, los ABRIERON y midieron
(posición de sujetos, varianza laplaciana, columnas de borde para banda negra
o píxel estirado). Vuelta 1: 3 de 8 aprobadas. Vuelta 2, con correctores que
recibieron los problemas ya medidos: 5 de 8. Vuelta 3: 7 de 8, y la octava la
resolvió el director. Todo lo que encontraron era real e invisible leyendo el
código: un empuje que derivaba hacia abajo porque el recorte anti-borde
clavaba el foco en el límite; dos cortes con el mismo encuadre porque ambos
chocaban contra el mismo borde izquierdo; un rótulo sobre las caras; una
explosión delante en vez de detrás de los personajes (`duo-burger/KN-013`).
Costo medido: 3,03 M tokens de subagente (1,84 M + 0,75 M de reanudación +
0,44 M de tercera vuelta), ~2,5 h de pared con concurrencia 2 en esta Mac
(`duo-burger/metrics.json`, sesión 2026-09-10).

**Lo pagó, por último, un compositor de video que no arranca.** Remotion
4.0.523 dibuja los 540 fotogramas perfectos en esta Mac (macOS 13.7.8
Ventura), pero su codificador (`@remotion/compositor-darwin-x64`) está
compilado para macOS 15 y muere con `SIGABRT` buscando
`_AVCaptureDeviceTypeContinuityCamera` (`duo-burger/KN-003`). `brew install
ffmpeg` tardó más de cuatro horas compilando desde fuente. La salida que
funcionó: `remotion render --sequence` + un programa de sesenta líneas en
Swift con `AVAssetWriter` que usa el H.264 por hardware del propio macOS, sin
instalar ni descargar nada (`duo-burger/KN-009`, `scripts/encoder.swift`).

## Cómo se aplica

1. **Antes que nada, arte y referencias**, no un prompt de animación: guía de
   marca con códigos de color exactos, y escenas completas (personajes ya
   dentro) generadas a una resolución fija. Sin esto, cualquier código que
   escribas está fingiendo el dibujo, no dirigiéndolo.
2. **Renderiza a la resolución nativa del arte.** No la reescales por
   conveniencia del formato de salida; si el formato de salida exige otra
   proporción, recorta o repinta, no estires.
3. **Aplica una textura común** (grano + viñeta) a toda la película, encima de
   cualquier pintura: es lo que hace que fotogramas de sesiones de arte
   distintas se lean como una sola película, y de paso disimula la pérdida de
   nitidez de los acercamientos fuertes.
4. **Diseña cada encuadre dentro de la ventana `[1/(2z), 1-1/(2z)]`.** Un
   sujeto pegado al borde no se puede centrar salvo con zoom absurdo (>8):
   acepta que quede descentrado pero ENTERO, o sube el zoom hasta que quepa
   entero, nunca fuerces el foco más allá del límite (`src/film/kit/Pintura.tsx:58-61`
   recorta esto automáticamente; que el kit lo haga no exime de diseñar el
   plano dentro del rango).
5. **Para diferenciar dos cortes que comparten el mismo borde, cambia la
   ESCALA (relación ≥ 1,3), no el foco.** El foco ya está saturado en el
   límite; moverlo un poco no cambia el encuadre lo suficiente para leerse
   como un corte distinto.
6. **No amplíes una pintura fuente más de 3x.** Si el plano lo exige, sabe que
   la nitidez cae de forma medible (varianza laplaciana) y que el grano común
   es lo que lo disimula, no una corrección de más zoom.
7. **Verifica con una ola que MIDE fotogramas, no que lee código**:
   constructores + verificadores independientes que renderizan 4-6
   fotogramas, los abren, y miden posición de sujetos, nitidez (laplaciano) y
   columnas de borde. Cuenta con al menos tres vueltas: construir, corregir
   con los problemas ya medidos, y una vuelta final donde el director resuelve
   a mano lo que quede.
8. **El director mira el veredicto, no solo lo cuenta.** Un verificador puede
   leer mal la dirección de un problema (confundir un eje con una posición) y
   bloquear una escena que sí está bien; eso solo se detecta revisando la
   evidencia, no confiando en el conteo de aprobados.
9. **Los fallos de DIRECCIÓN DE CÁMARA no los resuelve un corrector
   automático.** Dos planos idénticos se arreglan con escalas distintas —una
   decisión de visión, no una corrección de precisión— y eso lo decide quien
   dirige, no el ciclo de corrección.
10. **Antes de construir nada, prueba el render completo de punta a punta**
    (dibujar + codificar) con un fotograma de prueba. Si el compositor nativo
    no arranca en tu máquina (macOS anterior a Sequoia, sin `@remotion/compositor`
    compatible), usa `remotion render <comp> <dir> --sequence` y codifica
    aparte con `AVAssetWriter` en Swift (60 líneas, sin dependencias que
    instalar) en vez de esperar una compilación de ffmpeg de horas.
11. **Ojo con la carpeta de secuencia**: si su nombre empieza con un punto
    (`.frames-Cuadrado`), Remotion la interpreta como extensión de archivo y
    rechaza la salida en silencio. Nómbrala sin punto inicial.
12. **Nunca confíes en un código de salida verde.** Comprueba que el MP4
    EXISTE, que dura lo que debe, y extrae un fotograma de DENTRO del video
    (no del render) para confirmar que el contenido es el esperado — ver
    [[TEMA-que-es-estar-verificado]], que documenta la misma trampa en software
    de otro dominio.

## Cuándo NO aplica

- **Si el arte fuente es vectorial hecho a mano (SVG), no pintura rasterizada**,
  el límite de nitidez por ampliación (laplaciano) no aplica igual —un vector
  no pierde definición al escalar—, pero el límite geométrico del encuadre
  (`[1/(2z), 1-1/(2z)]`) y la verificación por medición de fotogramas siguen
  aplicando sin cambios.
- **El número `3x` y la ventana `[1/(2z), 1-1/(2z)]` no son universales**: son
  la geometría de ESTE kit de cámara (`src/film/kit/Pintura.tsx`) sobre
  pinturas de 1376×768. Si cambia el recorte anti-borde o la relación de
  aspecto del lienzo, recalcula — no copies el número.
- **La ruta de encoder Swift + `AVAssetWriter` es una solución de macOS
  anterior a Sequoia sin ffmpeg instalado.** Si ffmpeg ya está disponible, o
  el proyecto corre en Linux/Windows, usa el compositor normal de Remotion o
  ffmpeg directo; no reinventes el encoder.
- **Esto es dirección de cámara sobre arte ya resuelto, no un sustituto del
  encargo de diseño.** Para pedirle ilustraciones o piezas estáticas a un
  generador, la regla de "prohibir y rellenar" vive en
  [[TEMA-generadores-de-diseno]]; este tema empieza donde el arte ya existe.

## Evidencia

- `duo-burger/DEC-005` — decisión de dirigir cámara/luz/efectos sobre once
  pinturas completas, y por qué (el techo de calidad está en la dirección, no
  en redibujar).
- `duo-burger/KN-014` — el límite físico del encuadre, la regla de escala vs.
  foco para distinguir cortes, y la pérdida de nitidez medida (632 → 15) al
  ampliar más de 3x.
- `duo-burger/KN-012` — los fallos propios de cada pintura y su remedio en el
  plano (banda negra, texto inventado fuera de encuadre, letrero viejo vs.
  nuevo, grano/viñeta para unificar personajes entre escenas).
- `duo-burger/KN-013` — la ola de verificación por medición de píxeles en tres
  vueltas, con los dos límites del bucle (verificador que lee mal la
  dirección; fallos de dirección de cámara que un corrector no resuelve).
- `duo-burger/KN-006` — seis lecciones de animación pagadas mirando
  fotogramas (aplaste que se sale del cuadro, duración de un fogonazo,
  separación derivada de la escala, distancia de manos al acercar cámara,
  anticipación en dos tiempos, radio de los guantes).
- `duo-burger/KN-003` — el compositor de Remotion no codifica en macOS 13
  (`SIGABRT` por `_AVCaptureDeviceTypeContinuityCamera`), pero sí dibuja.
- `duo-burger/KN-009` — el encoder de 60 líneas en Swift con `AVAssetWriter`,
  540 fotogramas de 1080×1920 en 45 s sin instalar nada.
- `duo-burger/KN-010` — un render terminó en verde sin producir archivo (carpeta
  con punto inicial interpretada como extensión); se comprobó abriendo el MP4,
  no leyendo el código de salida.
- `duo-burger/metrics.json`, sesión 2026-09-10 — 3,03 M tokens de subagente y
  el desglose de las tres vueltas de verificación.
- `src/film/kit/Pintura.tsx:51-61` (`prommter/duo-burguer-video`) — el recorte
  anti-borde implementado: `const lim = 1 / (2 * z)`.
- `feedback_video_no_infantil.md` (memoria permanente del dueño) — la cita
  textual del rechazo y lo que pidió a cambio.

## Enlaces

- [[TEMA-generadores-de-diseno]] — el mismo principio de "dale materia prima
  real, no adjetivos" aplicado a piezas estáticas en vez de video.
- [[TEMA-que-es-estar-verificado]] — "compilar no es funcionar" es la misma
  trampa que "el render terminó en verde y no hay archivo".
- [[TEMA-olas-de-agentes]] — cómo se organizó la ola de constructores y
  verificadores, y qué hacer cuando mueren a mitad de ola.
- [[TEMA-entorno-de-la-maquina]] — por qué esta misma Mac no aguantaba la ola
  de render mientras compilaba ffmpeg.
