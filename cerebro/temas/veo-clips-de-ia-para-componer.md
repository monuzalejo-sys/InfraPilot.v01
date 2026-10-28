---
slug: veo-clips-de-ia-para-componer
titulo: "Clips de IA (Veo) para componer sobre video real: color del fondo, recorte, zoom, costo y voces"
alias: [veo, veo 3, veo 3.1, veo3, veo 3.1 fast, veo fast, veo lite, google veo, vertex veo, vertex ai, generar video con ia, video con ia, video de ia, video generado con ia, video generativo, imagen a video, image to video, clip de ia, clips de ia, clip de veo, clips de veo, animar con ia, animar un personaje con ia, mascotas con ia, mascota con ia, mascotas de ia, personaje de ia, personajes de ia, hamburguesitas, nano banana, gemini image, gemini flash image, gemini 2.5 flash image, flash image, fondo azul, fondo verde, pantalla azul, pantalla verde, green screen, blue screen, croma, chroma, chromakey, chroma key, quitar el fondo, sacar el fondo, recortar el fondo, recorte de fondo, fondo transparente, despill, derrame de color, similitud, se come los ojos, me comio los ojos, ojos transparentes, piernas transparentes, translucido, 0x40a5da, 0038ff, azul puro, el azul que pedi, color pedido, color real del fondo, camara fija, camara estatica, locked-off, static camera, no zoom, zoom de veo, veo hace zoom, veo se acerca, el personaje crece, cambia de tamano, salto de tamano, encuadre cuadro a cuadro, normalizar el encuadre, cropdetect, alphaextract, percentil, cummax, franja negra, barra negra, bordes negros, 720p, 1080p, sin audio, con audio, generateaudio, voces de veo, voz de veo, voces distintas, voz consistente, tts, gemini tts, gemini 2.5 pro tts, una linea por llamada, subtitulos karaoke, karaoke, tiempos por silaba, tiempos exactos, costo de veo, precio de veo, cuanto cuesta veo, cuanto cuesta un video con ia, cuanto cuesta un clip de ia, dolares por segundo, usd por segundo, gastos.csv, costo estimado, credito de prueba, google cloud, optimizar el gasto, escalon mas barato, nostdin, ffmpeg nostdin, while read, ffmpeg se come la entrada, ffmpeg dentro de un bucle, salta lineas, carpeta sque, como llegar a duo, duo como llegar]
preguntas: ["¿cuánto cuesta Veo por segundo y cuál modelo me conviene?", "Veo me hace zoom aunque le pida cámara fija, ¿cómo lo arreglo?", "¿cómo recorto el fondo de un clip de Veo para ponerlo encima de un video real?", "¿de qué color pido el fondo para quitarlo después?", "el chroma key me comió los ojos y las piernas del personaje, ¿qué le muevo?", "¿genero los clips de Veo con audio o sin audio?", "¿cómo hago que los personajes de IA suenen siempre con la misma voz?", "los personajes cambian de tamaño de un clip a otro, ¿cómo los empareja?", "¿cuánto me cuesta un video de 30 segundos con personajes de IA?", "¿por qué Veo me devuelve una franja negra arriba y abajo?", "ffmpeg me saltó líneas dentro de un while read, ¿qué pasó?"]
proyectos: [duo-burger]
confianza: media
actualizado: 2026-10-18
---

# Clips de IA (Veo) para componer sobre video real

## Respuesta corta

1. **Pide el fondo plano y de un color que el personaje no tenga (azul si lleva
   lechuga), pero MIDE el color que de verdad llegó**: pediste `#0038FF` y llegó
   `#40a4d9`. Úsalo en `chromakey=<medido>:0.12:0.05,despill=type=blue:mix=0.5:expand=0.05`;
   a 0,16 los ojos blancos y las piernas negras ya salen translúcidos y a 0,22
   desaparecen.
2. **Veo ignora «locked-off static camera»**: hace un zoom lento (la caja del
   personaje pasó de 292 a 345 px en ~5 s, +18 %) y trae una franja negra de 10 px
   arriba y abajo a 720p. Recórtala y normaliza el tamaño **cuadro a cuadro**
   midiendo la caja del alfa; un factor fijo no sirve (el zoom varió de +7 % a +24 %
   entre clips).
3. **Genera los clips SIN audio y haz las voces con Gemini TTS, una línea por
   llamada**: voz fija y duración exacta por línea. Veo 3.1 Fast 720p sin audio, US$0,08/s;
   Veo 3.1 con audio, US$0,40/s (precios de terceros al 13-oct-2026: verifícalos antes
   de citarlos). Ojo: `google.mjs` genera por defecto CON audio y a 1080p; pasa
   `--res 720p --sin-audio`. El ahorro grande es el modelo; apagar el audio en Fast
   solo ahorra US$0,02/s.
4. **Dentro de un `while read`, todo `ffmpeg` lleva `-nostdin`**, o se come la
   entrada del bucle y salta líneas.

## Por qué (qué lo pagó)

**Lo pagó un rechazo y un encargo nuevo.** El 2026-10-18 el dueño vio el reel «Ya
prendimos las luces» (sus fotos y tomas reales del local con el títere SVG de las
mascotas compuesto encima) y dijo: *«¿esto lo hiciste con la IA de Google? no me gustó
para nada el resultado»* (`feedback_duo_local_mascotas_rechazo.md`, `duo-burger/KN-032`).
Pidió «usa la IA»: mascotas generadas por IA desde sus hojas de marca, sobre el
recorrido real que él grabó (7:39). La prueba de 10 s (Veo 3.1 con audio, 1080p) costó
US$3,45 y le «agradó un poco más»; la v2 de 30 s, con lo que pidió después (mascotas
más pequeñas, menos detalladas y más animadas, voz más familiar, colores vivos, gasto
optimizado), US$3,38; el proyecto, US$6,83 del crédito de prueba de Google Cloud
(`duo-burger/KN-033`, `contenido/material/gastos.csv`). Su veredicto sobre la v2 sigue
pendiente (`duo-burger/PEND-030`): este tema documenta **un procedimiento medido, no un
resultado aprobado**. Por qué aquí lo hace una IA y no un títere en código:
[[TEMA-cortometraje-sobre-ilustracion]].

**El color que pides no es el que llega.** El prompt a Gemini 2.5 Flash Image decía
*"perfectly flat solid pure blue (#0038FF)"* en las dos tandas de mascotas. Medido el
2026-10-18 en el promedio de las cuatro esquinas de cada PNG generado: `mascotas-v1`
`#358ac8`, `mascotas-v2` `#3f99d2`, `toon-v1` `#44a3da`, `toon-v2` `#40a4d9`; ninguno se
parece a `#0038FF`. Veo conserva el color que recibe: el clip de la prueba v1 sale
`#358bc9` y los de la v2 `#3ea2d9`–`#40a3d8` (seis puntos en `veo2-A2`, `veo2-B` y
`veo2-C`). Por eso la llave se fijó con el color medido, no con el pedido: `0x368cca`
en la v1 y `0x40a5da` en la v2. El azul se eligió porque la lechuga es verde (un croma
verde se la comería; el verde no se probó).

**El umbral de similitud tiene una ventana estrecha.** Barrido reproducido el 2026-10-18
sobre `veo2-A2/01.mp4` (cuadro a 4 s), con
`chromakey=0x40a5da:S:0.05,despill=type=blue:mix=0.5:expand=0.05` y el resultado sobre
magenta: S = 0,08 / 0,12 / 0,16 / 0,22 / 0,30 deja 68.447 / 66.859 / 64.900 / 42.699 /
29.782 píxeles opacos en la zona del personaje izquierdo (de 125.400). A 0,12 queda
limpio; a 0,16 los ojos y las piernas ya dejan pasar el fondo; a 0,22 desaparecen y
empieza a perderse el contorno; a 0,30 queda un fantasma. Cae primero lo que no tiene
color (blanco y negro). *Explicación probable, no medida:* el croma neutro del blanco
y el negro es lo más cercano al azul; los colores cálidos del personaje quedan lejos.
Las pruebas de la sesión (0,12 contra 0,18 en la v1; 0,10 contra 0,14 en la v2) dejaron
0,11 y 0,12: sirve para dibujo plano y 3D con contorno negro grueso, y está medido solo
ahí.

**La franja negra mide 10 px a 720p.** Fila a fila en `veo2-A2` (720×1280): las filas
0–9 y 1270–1279 tienen luminancia media ≤4 y desde la fila 10 sale ≈148. En el clip de
1080×1920 de la prueba v1 son ≈14–15 px, de ahí la cifra «unos 15 px». La v2 recortó 15
px por lado con margen: `crop=720:1250:0:15`.

**El zoom aparece aunque se pida lo contrario.** Cada clip llevó este texto: *"Locked-off
static camera: no zoom, no pan, no camera movement; the two characters stay the same size
and in the same place, full bodies always visible with empty space around them."* Medido
con `cropdetect` sobre `alphaextract` (`src/llegar/cajas.json`, 192 cuadros a 24 fps), la
altura BRUTA de la caja en A2 va de 292 px (cuadro 0) a 345 (a los 5 s; 343 a los 4,5 s):
+18 %, el dato de la sesión. Como la caja también cambia con la pose (brazos arriba), el
estimador robusto —el mismo de `scripts/llegar/encuadre.mjs:8-9,52-53`, percentil 25 de
la altura en ±12 cuadros, que además **nunca baja**— da para A2 298 (0 s), 305 (1 s), 321
(2 s), 333 (3 s), 336 (4 s), 344 (5 s) y 344 hasta el final: +15 %, plano desde los 5 s.
Entre clips va de +7 % (B: 290→309) a +24 % (A: 294→364), con B2 +12 % (300→335).
Los cinco partieron de la misma imagen (`toon-v2/01.png`) y arrancan en 292–294 px de caja
bruta. El piso es la mediana de la línea de los pies (±6) y el centro la mediana
horizontal (±12). La escala resultante compensa el zoom: en A2 baja de 1,38 (1 s) a 1,26
(3 s) y 1,22 (6 s) (`src/llegar/encuadre.json`). En el clip donde saltan y giran (la
celebración, C) la caja engaña (su p25 sube de 297 a 478): va con encuadre fijo y un
factor puesto a ojo, ÷1,18, comparando en el corte con los clips vecinos
(`encuadre.mjs:41-50`).
Lo pagó una falla real: la revisión de Gemini Pro marcó un destello en 0:26 (las dos
hamburguesas aparecen un instante en miniatura) y la sesión lo rastreó al cambio de
tamaño del clip C en los cuadros 786–799.

**El costo.** Lista de precios por segundo «publicada al 13-oct-2026»
(`contenido/estudio/google.mjs:33-40`):

| Modelo | Con audio (720p / 1080p) | Sin audio (720p / 1080p) |
|---|---|---|
| Veo 3.1 | 0,40 | 0,20 (sin fuente verificada) |
| Veo 3.1 Fast | 0,10 / 0,12 | 0,08 / 0,10 |
| Veo 3.1 Lite | 0,05 / 0,08 | no distingue |

La procedencia es débil y hay que decirlo: la página oficial de Vertex no cargó completa
en la consulta (el WebFetch devolvió «truncated»); la tabla salió de benchlm.ai (fecha
2026-10-13, tarifa de la API de Gemini, no de Vertex) y de un resumen de búsqueda sobre
Vertex para el «sin audio» de Fast. El 0,20 de Veo 3.1 sin audio no aparece en ninguna
fuente leída. Antes, `google.mjs` llevaba Fast a 0,15 US$/s «de referencia» (transcript
línea 984), que no coincide con esta tabla: otra razón para verificar. Lo que registra
`gastos.csv` es **estimado por el propio script**
(`google.mjs:12,41-46`: «Vertex no lo devuelve»), no facturado. Lo medido (estimado):
una prueba de 8 s con Veo 3.1 normal con audio, US$3,20; cinco clips Fast 720p sin audio
de 8 s, US$0,64 cada uno = US$3,20; una imagen de Gemini 2.5 Flash Image, US$0,04. La v2
completa fue US$3,20 de Veo más US$0,18 en lo demás (dos imágenes, las voces y las
revisiones). **La cuenta de «un quinto»** es 0,08 contra 0,40 por segundo de clip; se
descompone en cambiar de modelo (con audio 0,40 → 0,10, ÷4) y apagar el audio en Fast
(0,10 → 0,08, −20 %). Apagar el audio en Fast se justifica por control de la voz, no por
plata.

**Las voces.** Cada línea es una llamada a `voz.mjs` (Gemini 2.5 Pro TTS, WAV 24 kHz
mono): la duración de cada línea es la del WAV, exacta (`ffprobe`); `voces.mjs` las
acelera a 1,08× (`atempo`, `:40`), deja 0,14 s entre frases y ancla la llegada y la
tarjeta final (`:25-29`). Por palabra el tiempo **se reparte por sílabas** dentro de la
línea (`:60-69`): sirve para subtítulos tipo karaoke, no es alineación fonética. En la
prueba v1, con las voces de Veo, Gemini Flash dio tiempos por palabra pero confundía
quién hablaba (nota de la sesión, transcript línea 858), y con los parámetros que usa
`google.mjs:79` (solo `generateAudio`) no hay cómo fijar la misma voz de un clip al
siguiente (ver «Huecos»). El casting de las dos voces
se hizo con una sola llamada a Gemini Pro (`contenido/estudio/juez.mjs`), ver
[[TEMA-montar-video-con-material-real-del-celular]].

**El bucle que saltó líneas.** `scripts/llegar/preparar.sh:13-16` procesa los 13 tramos con
`… | while read id mix; do ffmpeg … ; done`. Sin `-nostdin`, `ffmpeg` lee la entrada
estándar y se come bytes de las líneas siguientes: apareció una carpeta llamada «sque»,
que es exactamente el final de `t02-via-bosque` (`src/llegar/tramos.json:16`). Reproducido
el 2026-10-18:

```
printf 't01-panoramica 1\nt02-via-bosque 2\nt03-primax 2\n' | while read id mix; do
  ffmpeg -re -f lavfi -i testsrc=s=64x64:r=30:d=3 -f null - 2>/dev/null; echo "[$id]"; done
# [t01-panoramica]  [via-bosque]  [primax]      <- se comió "t02-" y "t03-"
# con -nostdin:     [t01-panoramica]  [t02-via-bosque]  [t03-primax]
```

Cuanto más dura la codificación, más come: con `d=1,5` se llevó 1 carácter por línea, con
`d=3` cuatro; con las secuencias de JPG reales, hasta dejar «sque». Con `-nostdin`
(`preparar.sh:16`) el `tramos.log` salió con los 13 tramos completos.

## Cómo se aplica

1. **Primero la imagen, después el video.** Una imagen cuesta ≈US$0,04 y un clip de 8 s
   Fast 720p sin audio US$0,64 (`gastos.csv`). Itera la imagen (Gemini 2.5 Flash Image con
   las hojas de marca del dueño como referencia: `google.mjs imagen '<prompt>' <carpeta>
   --fotos a.png,b.png --formato 9:16`) hasta que personaje, fondo plano y composición
   estén bien, y solo entonces paga el clip.
2. **Pide el fondo plano y mide el que llegó** (promedio de las cuatro esquinas del PNG y
   del cuadro 0 del clip). Ese valor es el color de la llave.
3. **Veo con imagen de arranque, cámara fija y espacio alrededor:**
   `node google.mjs video '<prompt>' <carpeta> --foto <imagen.png> --seg 8 --res 720p --sin-audio`.
   El modelo por defecto es Fast. Tarda 66–77 s por clip de 8 s (`veo2-*.log`); lánzalos en
   paralelo. Escribe «full bodies always visible with empty space around them» y asume
   que el zoom llegará igual.
4. **Recorta:** `chromakey=<color medido>:0.12:0.05,despill=type=blue:mix=0.5:expand=0.05,crop=720:1250:0:15,format=rgba`
   a PNG con alfa. Antes de fijar el umbral barre 3–4 valores sobre un fondo magenta
   (`color=c=0xff00ff`) y MIRA ojos y piernas; no copies el 0,12 a otro estilo sin barrer.
5. **Mide la caja de cada cuadro** (`alphaextract,cropdetect=limit=40:round=2:reset=1:skip=0`)
   y genera la escala, la izquierda y el piso por cuadro con `encuadre.mjs`. Al clip donde
   el personaje salta o gira dale encuadre fijo y ajusta el factor a ojo contra los
   vecinos **en el corte**.
6. **Voces aparte:** una llamada por línea, tempo 1,08×, hueco de 0,14 s, y los tiempos
   salen del `ffprobe` de cada WAV.
7. **Revisa el mp4 terminado con Gemini Pro y verifica cada falla que marque en cuadros**
   (qué sí y qué no se le puede creer, en [[TEMA-montar-video-con-material-real-del-celular]]).
8. **Anota el gasto** (`google.mjs` lo hace solo) y dile al dueño el total en US$ y en
   pesos, desglosado y con la procedencia: es estimado, no facturado
   (`feedback_ia_costo.md`).
9. **En cada `ffmpeg` dentro de un `while read`, `-nostdin`.** Fuera de un bucle no hace
   falta.

## Cuándo NO aplica

- **Si la pieza entera es vectorial** (un corto con las mascotas fieles a la guía) no
  hace falta IA: ver [[TEMA-cortometraje-sobre-ilustracion]].
- **Si necesitas labios sincronizados con la voz** (primer plano, personaje que habla a
  cámara), la ruta sin audio no te lo da: la boca «habla» pero no sigue la línea. En la
  prueba v1, con audio de Veo, la sesión anotó «bocas sincronizadas» (transcript línea
  858); en «Cómo llegar» no se midió el desfase porque las mascotas miden 420 px de 1920
  de alto (`encuadre.mjs:24`). En primer plano, genera con audio y paga el escalón.
- **720p alcanzó solo porque las mascotas van pequeñas:** la escala final sobre el clip
  fue 1,15–1,45× (`src/llegar/encuadre.json`). Si el personaje ocupa media pantalla, cotiza
  1080p (Fast sin audio, 0,10).
- **El 0,12 y el color medido son de dibujo plano y 3D con contorno negro.** Con otro
  estilo, vuelve a barrer. Si el personaje tiene azul, cambia el color del fondo: la regla
  es «uno que el personaje no tenga».
- **La tabla de precios caduca y su fuente es secundaria:** verifica contra la consola de
  facturación de Google Cloud antes de presupuestar o de citarla.
- **El clip de celebración (saltos, giros, brazos arriba)** no se normaliza por caja; ver
  el paso 5.

## Evidencia

- `duo-burger/KN-033` (la receta y el costo total), `duo-burger/KN-032` (el rechazo del
  títere sobre material real), `duo-burger/PEND-030` (veredicto de la v2 sin recoger).
- Memoria permanente del dueño: `feedback_duo_local_mascotas_rechazo.md` (la cita del
  rechazo), `project_duo_como_llegar.md` (receta y v1 con Veo normal), `feedback_ia_costo.md`
  (anotar y optimizar el gasto).
- Código en `prommter/duo-burguer-video`: `scripts/llegar/encuadre.mjs:5-11,24,41-55`,
  `scripts/llegar/voces.mjs:14,25-29,40,60-69`, `scripts/llegar/preparar.sh:13-16`,
  `src/llegar/cajas.json` (caja bruta de A2: 292/301/321/334/342/345 px a 0/1/2/3/4/5 s;
  percentil 25 de A2: 298/305/321/333/336/344), `src/llegar/encuadre.json`,
  `src/llegar/tramos.json:16`.
- Código en `prommter/contenido/estudio`: `google.mjs:12,33-46,72,74,77-79,93`,
  `voz.mjs:3-4`, `juez.mjs:3-5`. Gasto: `prommter/contenido/material/gastos.csv`
  (filas del 2026-10-18). Logs: `contenido/material/duo/2026-W42/como-llegar/veo2-*.log`
  (66–77 s por clip) y el aviso del SDK en `veo2-A.log:1`.
- Mediciones propias del cosechador (2026-10-18), reproducibles sobre
  `contenido/material/duo/2026-W42/como-llegar/`: color de esquinas de `mascotas-v1`,
  `mascotas-v2`, `toon-v1`, `toon-v2` y de los clips; franja negra de `veo2-A2/01.mp4`
  (10 px) y `veo-v1/01.mp4` (14 px); barrido de similitud; reproducción de `-nostdin`.
- Transcript de la sesión, `~/.claude/projects/-Users-g-orion/fc142d00-3f1d-4f95-a94c-9ccd5d075194.jsonl`:
  prompts de imagen con `#0038FF` (líneas 638 y 928), texto de cámara fija (988),
  comando de recorte de la v2 (1162), consulta de precios y su resultado (905-913),
  diagnóstico del destello de 0:26 (1414).

## Huecos de este tema

- **La v2 no tiene veredicto del dueño** (`duo-burger/PEND-030`) y nadie ha oído las voces.
- **«Cada clip de Veo trae voces distintas» es lo esperado, no lo medido:** solo se generó
  UN clip con audio (`veo-v1`); no se comparó entre clips. Del caso sin audio solo hay una
  opinión de Gemini Pro sobre el video terminado: «Son dos voces distintas y se mantienen
  consistentes durante todo el video» (transcript línea 1390), no una medición.
- **El 0,20 de Veo 3.1 sin audio no tiene fuente**, y los precios no se contrastaron con la
  factura de Google Cloud; todo el gasto salió del crédito de prueba.
- **No se midió la sincronía boca-voz** de la ruta sin audio.
- **No se probó otro prompt contra el zoom** ni un croma verde ni otra tonalidad de azul:
  solo se sabe que esta redacción de «cámara fija» no lo evitó en ninguno de los cinco
  clips.
- **Mantenimiento:** el SDK avisa que `generateVideos({prompt, image})` está deprecado y
  pide el argumento `source` (`veo2-A.log:1`); `google.mjs:79` lo usa tal cual.

## Enlaces

- [[TEMA-montar-video-con-material-real-del-celular]] — Gemini como oídos y ojos (marcas de
  tiempo, revisor del mp4, casting de voces), HDR del iPhone y qué tapar.
- [[TEMA-cortometraje-sobre-ilustracion]] — cuando el personaje se dibuja en código y por
  qué sobre material real no funcionó.
- [[TEMA-generadores-de-diseno]] — el mismo principio de materia prima medida para
  imágenes y láminas.
- [[TEMA-que-es-estar-verificado]] — un render en verde no es una entrega: aquí se mide el
  color, el umbral y la caja.
- [[TEMA-modelos-y-costos]] — el costo de los agentes se mide en tokens; este tema es el
  de los medios generativos, que se factura por segundo o por pieza.
- [[TEMA-entorno-de-la-maquina]] — ffmpeg y las herramientas de esta Mac.
