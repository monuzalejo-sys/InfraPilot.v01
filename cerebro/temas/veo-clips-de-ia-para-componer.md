---
slug: veo-clips-de-ia-para-componer
titulo: "Clips de IA (Veo) para componer sobre video real: color del fondo, recorte, zoom, costo y voces"
alias: [veo, veo 3, veo 3.1, veo3, veo 3.1 fast, veo fast, veo lite, google veo, vertex veo, vertex ai, generar video con ia, video con ia, video de ia, video generado con ia, video generativo, imagen a video, image to video, clip de ia, clips de ia, clip de veo, clips de veo, animar con ia, animar un personaje con ia, mascotas con ia, mascota con ia, mascotas de ia, personaje de ia, personajes de ia, hamburguesitas, nano banana, gemini image, gemini flash image, gemini 2.5 flash image, flash image, fondo azul, fondo verde, pantalla azul, pantalla verde, green screen, blue screen, croma, chroma, chromakey, chroma key, quitar el fondo, sacar el fondo, recortar el fondo, recorte de fondo, fondo transparente, despill, derrame de color, similitud, se come los ojos, me comio los ojos, ojos transparentes, piernas transparentes, translucido, 0x40a5da, 0038ff, azul puro, el azul que pedi, color pedido, color real del fondo, camara fija, camara estatica, locked-off, static camera, no zoom, zoom de veo, veo hace zoom, veo se acerca, el personaje crece, cambia de tamano, salto de tamano, encuadre cuadro a cuadro, normalizar el encuadre, cropdetect, alphaextract, percentil, cummax, franja negra, barra negra, bordes negros, 720p, 1080p, sin audio, con audio, generateaudio, voces de veo, voz de veo, voces distintas, voz consistente, tts, gemini tts, gemini 2.5 pro tts, una linea por llamada, subtitulos karaoke, karaoke, tiempos por silaba, tiempos exactos, costo de veo, precio de veo, cuanto cuesta veo, cuanto cuesta un video con ia, cuanto cuesta un clip de ia, dolares por segundo, usd por segundo, gastos.csv, costo estimado, credito de prueba, google cloud, optimizar el gasto, escalon mas barato, nostdin, ffmpeg nostdin, while read, ffmpeg se come la entrada, ffmpeg dentro de un bucle, salta lineas, carpeta sque, como llegar a duo, duo como llegar, marca de agua, watermark, logo de veo, synthid, runware, fal.ai, minimo de recarga, creditos gratis google cloud, 300 dolares, agent platform, gcloud, application default login, cuenta de servicio, llave json, google ai pro, flow, veo en gemini, prompts para gemini, prompts uno por uno, pegar prompts, genera tu, crear material, imagenes con ia, prueba de 10 s, muestra, ejemplo primero, ejemplo para corregir, lote de videos, cuanto cuesta un video, mas barato, lo mas barato, costo de la ia, gastos.csv, cuanto gastamos, flyer del almuerzo, flyer de hoy, gemini-3-pro-image, nano banana pro, se colgo, timeout, pieza urgente, retoque con ia, editar fotos reales, borra productos de la foto, gasto de ia a medias, costo cortado, gastos.csv incompleto, imagenes ilustrativas, costo de imagenes, flyers con ia, arte con ia]
preguntas: ["¿cuánto cuesta Veo por segundo y cuál modelo me conviene?", "Veo me hace zoom aunque le pida cámara fija, ¿cómo lo arreglo?", "¿cómo recorto el fondo de un clip de Veo para ponerlo encima de un video real?", "¿de qué color pido el fondo para quitarlo después?", "el chroma key me comió los ojos y las piernas del personaje, ¿qué le muevo?", "¿genero los clips de Veo con audio o sin audio?", "¿cómo hago que los personajes de IA suenen siempre con la misma voz?", "los personajes cambian de tamaño de un clip a otro, ¿cómo los empareja?", "¿cuánto me cuesta un video de 30 segundos con personajes de IA?", "¿por qué Veo me devuelve una franja negra arriba y abajo?", "ffmpeg me saltó líneas dentro de un while read, ¿qué pasó?", "¿cómo genero con Veo sin marca de agua y sin gastar plata si el dueño solo tiene 60 mil pesos?", "¿hago todo el lote de videos de una, o primero le muestro uno cortico y cuánto costó?", "¿le paso al dueño los prompts para que los pegue en Gemini o los genero yo directo?", "el dueño necesita un flyer para hoy y el modelo de imagen no responde, ¿qué hago?", "¿por qué la foto retocada con IA no sirve si solo le quité el desorden?", "¿cuánto cuesta hacer las imágenes de los flyers con la IA de Google?"]
proyectos: [duo-burger, prommter, mercaplaza]
confianza: media
actualizado: 2026-11-03
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

**Seis reglas más (2026-11-02), de cómo se contrata y se pide la IA:**
5. **Muestra antes que lote:** una muestra de 10–12 s con su costo y correcciones concretas; el lote (14 anuncios por semana, 21 días de campaña) solo con su visto bueno.
6. **Genera tú por API y entrega solo lo aprobado:** no le des al dueño hojas de prompts para pegar en Gemini o Flow. A él déjale lo que solo él hace: cuentas, tarjeta, fotos reales.
7. **Poca plata, créditos de Google Cloud:** US$300 de prueba por 90 días y `gcloud auth application-default login`; por API el video sale sin el logo «Veo» visible (según guías de terceros; solo se comprobó que la foto por API no trae marca visible; verifica el primer clip de Veo).
8. **Pieza con hora:** usa el modelo de imagen que ya respondió en la sesión anterior, pon un tope corto de espera por llamada (a definir; en el caso real no se midió ninguno) y cae al modelo que ya funcionó al primer timeout.
9. **Retoque de fotos reales con IA:** compara con el original antes del lote; si borra productos que sí están, frena aunque sea más barato.
10. **Gasto cortado a medias:** dilo en la entrega y pídele al dueño que lo confirme en la facturación de Google.

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

**Refuerzo 2026-11-03 (contradicción de precio, según el proveedor).** Un análisis de mercado
leyó las páginas de modelo de Runware ese día y encontró: Veo 3.1 Fast US$ 0,15/s (US$ 0,60 por
4 s a 720p), Veo 3.1 US$ 0,40/s con audio a 1080p, Veo 3.1 Lite US$ 0,08/s a 1080p con audio y
Kling 3.0 Pro US$ 0,168/s con audio (0,112 sin audio) (`prommter/contenido/canal-youtube/base-de-hechos.md:145`,
F-121, primaria, confirmado por un verificador). Coinciden con la tabla de arriba el Standard
(0,40) y el Lite a 1080p (0,08); **no coincide Fast** (0,15 en Runware frente a 0,10–0,12 con audio
en la tarifa de la API de Gemini de benchlm.ai): el precio de un mismo modelo depende del proveedor,
y el 0,15 es exactamente el valor de «referencia» que antes llevaba `google.mjs`. Además,
fal.ai da de baja el endpoint `fal-ai/veo3.1` el 2026-11-17 (`base-de-hechos.md:144`, F-120).
Y queda **sin resolver** si el proveedor activo hoy es Runware (el informe del 3-nov describe la
fábrica con Runware) o Google Cloud (arriba, el dueño descartó Runware el 5–6 oct por un mínimo
de recarga de US$ 50): confirma proveedor y mínimo antes de cotizar. Ver
[[TEMA-youtube-reglas-y-plata-2026-2027]].

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

**Lo pagó la plata del dueño y su desconfianza de los prompts (5-6 de octubre).** El dueño
puso 60.000 COP (≈ US$15). Claude dijo que Runware pedía «al menos 5 dólares» en la cuenta
(el saldo gratis de 5 centavos no alcanzaba); el dueño replicó que el mínimo de recarga era
de 50 dólares, más del triple de lo que quería poner, y Runware se descartó. La memoria
anterior decía ≥US$5: vale lo que él midió. Se pivotó a la prueba gratis de Google Cloud
(US$300 en créditos durante 90 días): la primera foto de la Cheddar salió en 12 s, sin marca
visible y sin archivo de llave que filtrar (la política de Google bloquea descargar llaves de
cuenta de servicio en cuentas nuevas), y después sirvió para TTS, Lyria y Veo: los US$6,83 de
«Cómo llegar» salieron del crédito. Antes, tras recibir seis prompts para fotos de la
Cheddar, el dueño respondió que no sentía que fueran a quedar bien y pidió que Claude edite
y use algo para crear el material. El logo «Veo» visible en la app de Gemini y en Flow con
plan Pro viene de guías de terceros: no se probó.

**Lo pagó la costumbre del dueño de pedir una muestra y preguntar el precio.** Pidió «primero
un ejemplo para ver que hay que corregir» (A01, 12 s: se rechazó antes de producir la parrilla)
y «primero un clip de 10 s para darle forma a la idea» (Cómo llegar: US$3,45, unos 14.000
pesos, «me agradó un poco más»; la v2 de 30 s con sus correcciones, US$3,38). A cada
cotización de IA respondió con «¿no hay forma de que sea más barato?» o «¿es lo más barato
que hay?». Las tarifas por segundo salían de tablas de terceros: «estimados y no la factura
real».

**Lo pagó una pieza con hora.** El 6-oct a las 16:09 UTC (11:09 en Popayán) pidió el flyer
del almuerzo de hoy; los dos modelos de imagen más nuevos de Google se quedaron colgados sin
responder y hubo que volver al que ya había funcionado. Entrega a las 19:58 UTC, casi las 3
p.m.: 3 h 49 min después, pasada la hora de almuerzo.

**Lo pagó un retoque que borró uchuvas (Mercaplaza).** Al retocar fotos reales del local para
quitar los cartelitos de precio, el modelo barato quitó los precios pero también se llevó las
uchuvas del centro: dejó de ser el local real. Se pasó a Gemini 3 Pro Image; 8 retoques
más una prueba con el modelo barato costaron US$1,11 (~4.500 pesos). Los retoques que se cortaron a medias no quedaron
en `gastos.csv` y hubo que pedirle al dueño que lo confirmara en Google Cloud.

**Lo midieron las imágenes de flyers.** Las imágenes de arte salieron a ~US$0,04 cada una (modelo
no registrado; el retoque con Gemini 3 Pro Image salió a ~US$0,12 por llamada, así que cotiza
según el modelo): 10 imágenes del arte de Halloween (21-oct) fueron US$0,40 (unos 1.600 COP) y 6 de los flyers de
bandeja paisa, Duo Drácula y Duo Lobo (25-oct) US$0,24 (unos 1.000 COP). Se dijo que las
fotos de la comida no eran los platos reales y al flyer de la bandeja no se le puso precio
porque el dueño no lo dio.

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

10. **Cotizando IA, el escalón más barato primero** y qué se pierde, antes del recomendado;
    al entregar, el total real en US$ y en pesos, aclarando si es estimado.
11. **Conecta la API y genera tú** (Google con la sesión de la Mac); mira cada resultado y
    entrega solo lo aprobado. Primera foto de la Cheddar: 12 s, el orden de capas salió mal y
    se corrigió en los prompts siguientes. Antes de pedir una recarga a otro proveedor,
    verifica su mínimo en su página oficial.
12. **Para piezas publicables no uses Veo desde la app de Gemini ni Flow con plan Pro**; por
    API sale sin el logo (según guías de terceros; solo se comprobó que la foto por API no trae
    marca visible; verifica el primer clip de Veo), aunque queda la firma invisible y las redes
    pueden etiquetar «IA».
13. **Pieza con hora:** modelo de imagen ya probado, tope corto de espera por llamada (a definir; no se midió ninguno),
    caer al modelo que ya funcionó al primer timeout, y dejar anotado en el código cuál es el estable. Los modelos nuevos se
    prueban en piezas sin hora.
14. **Foto real retocada:** compárala contra el original ANTES de procesar el lote; si el modelo
    quita o altera algo que sí está en la foto, frena todo.
15. **Si un proceso de pago se interrumpe, anótalo en la entrega** («esto no quedó en
    `gastos.csv`, confírmalo en la facturación del proveedor»), no solo lo completado.
16. **Imágenes de IA de comida o de local:** rotúlalas ilustrativas y no «el plato real»; no les
    pongas ingredientes ni precio que el dueño no dio; cámbialas cuando haya fotos reales.

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

- **Créditos de Google (reglas 7 y 12):** pasados los 90 días (hasta comienzos de enero) o
  agotados los US$300 el gasto es real: mira la factura de Google, no las tarifas de terceros.
  En un servidor sin navegador la sesión de usuario no sirve (usa identidad de servicio). Para
  borradores internos la marca visible no importa.
- **Muestra antes que lote (regla 5):** si el formato ya fue aprobado y producir cada pieza
  cuesta casi nada (plantillas diarias validadas), se produce el lote sin pedir muestra.
- **Generar tú (regla 6):** no aplica si la herramienta no tiene API o solo se maneja
  automatizando el navegador (Flow; a este dueño Facebook ya le marcó la cuenta por
  automatización), ni si el dueño quiere probar él mismo. Las fotos reales del producto solo
  las toma él.
- **Tope de espera corto (regla 8):** no sirve para video (Veo tarda minutos); y en piezas sin
  urgencia justo se quiere probar el modelo nuevo.
- **Retoque (regla 9):** no aplica a fotos genéricas o ilustraciones que no pretenden
  documentar el local real. **Gasto a medias (regla 10):** si el proceso se completó, el gasto
  anotado en `gastos.csv` basta.
- **Costo de imágenes:** ~US$0,04 (arte de flyers; el retoque con Gemini 3 Pro Image ~US$0,12) es solo imagen; video, voz y música tienen otras tarifas. Si
  el dueño exige foto real del producto, la IA solo sirve de relleno marcado.

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

- Ventana [[2026-10-05-plan-de-anuncios-profesionales|Plan de anuncios profesionales]] (transcrito `3d75e606`): «pide al menos 5 dólares en la cuenta» (2026-10-06); «el problema es que es minimo de 50 dolares» (2026-10-06); «Google regala 300 dólares en créditos durante 90 días a las cuentas nuevas de Google Cloud» (2026-10-06); «Esa traba es una regla de seguridad que Google pone por defecto a las cuentas nuevas: no deja descargar llaves.» (2026-10-06); «no hay forma de que no haya marca de agua?» y «llevan un logo visible de «Veo»» (2026-10-06); «dame primero un ejemplo para ver que hay que corregir de el plan» (2026-10-05); «y no hay forma de que sea mas barato?» y «es lo mas barato que hay>» (2026-10-06); «no siento que vaya a quedar bien ni tampoco me parece que realmente esos promts den algo bueno» (2026-10-05); «y si quiero que tu edites y uses algo para crear el material un material de buena calidad» y «La primera foto de la Cheddar salió en 12 segundos, con los créditos gratis de Google» (2026-10-06); «quiero que hagas un flayer para el almuerzo hoy», «los dos modelos de imagen más nuevos de Google se quedaron colgados sin responder» y «Ya son casi las 3 de la tarde.» (2026-10-06).
- Ventana [[2026-10-01-mejora-de-video-en-artefactos|Mejora de video en artefactos]] (transcritos `5f2b61e1` y `fc142d00`): «Salió del crédito gratis de prueba de Google Cloud (US$300), así que de tu bolsillo no se ha pagado nada» (`5f2b61e1`, 2026-10-18); «quiero que primero edites un clip de 10 s para que le demos forma a la idea» y «explotes de la mejor forma lo que tenemos en ia a disposicion» (`5f2b61e1`, 2026-10-18); «unos US$3,45 (alrededor de 14.000 pesos)» (`5f2b61e1`, 2026-10-18); «lo optimices de la mejor manera sin perder calidad» y «los costos son estimados y no la factura real» (`fc142d00`, 2026-10-18).
- Ventana [[2026-10-15-mercaplaza-vitrina|Mercaplaza vitrina]] (transcrito `587359bb`, 2026-11-03 UTC): «el modelo barato quitó los precios pero también se llevó productos (las uchuvas del centro). Eso no sirve porque deja de ser el local real» y «Los retoques que corté a medias no aparecen ahí, así que confírmalo en la facturación de Google».
- Ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `7f456016`): «Costo de la IA para el arte: US$0,40 (unos 1.600 pesos), 10 imágenes con Gemini» (2026-10-21); «Las 6 imágenes costaron US$0,24, unos $1.000 pesos» y «no son tus platos reales» (2026-10-25).

## Huecos de este tema

- **Tampoco se probó que el video de Veo por API salga sin logo visible:** solo la foto por API se comprobó sin marca.
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
- **El logo «Veo» visible en la app de Gemini y en Flow con plan Pro** viene de guías de terceros citadas en la ventana del 6-oct; no se probó. La procedencia del mínimo de 50 dólares de Runware es lo que dijo el dueño (la ventana cita una página de ayuda de Runware, no abierta aquí).

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
- [[TEMA-como-pide-el-dueno]] — muestra primero, material real, cuánto cuesta.
- [[TEMA-gusto-visual-del-dueno]] — por qué pidió IA y rechazó el vector sobre material real.
