---
slug: escenas-3d-en-hyperframes
titulo: "Escenas 3D (three.js, modelo glb) dentro de HyperFrames, deterministas cuadro a cuadro"
alias: [three.js, threejs, three js, tres js, webgl, 3d en video, escena 3d, modelo 3d, glb, gltf, draco, gltfloader, dracoloader, hf-seek, hfseek, hf seek, waitUntil, wait until, __hfWaitForSeekCompletion, hyperframes, hyper frames, hiperframes, render determinista, determinista, cuadro a cuadro, fotograma a fotograma, pintar(t), funcion pura del tiempo, reloj, requestAnimationFrame, raf, clock, camara 3d, giro de un modelo, cerebro 3d, atlas 3d, importmap, import map, sin red, offline, playwright png alfa, webm con alfa, vp9 yuva420p, canal de youtube, mentes brillantes, muestra de 10 segundos, render lento, un solo worker]
preguntas: ["¿cómo meto un modelo 3D en un video de HyperFrames sin que salte o parpadee entre cuadros?", "¿se puede usar three.js dentro de HyperFrames?", "¿qué es hf-seek y para qué sirve?", "¿cómo hago que una escena WebGL salga igual cada vez que se renderiza?", "¿cuánto se demora renderizar un video con 3D en HyperFrames?", "¿hay que hacer la escena 3D aparte y pegarla como video con transparencia?", "el modelo 3D no cargó en el primer fotograma del render, ¿qué hago?", "¿cómo hago que una línea o un rótulo siga a una parte de un modelo que gira?"]
proyectos: [prommter, cerebro-3d]
confianza: media
actualizado: 2026-11-03
---

# Escenas 3D (three.js) dentro de HyperFrames, deterministas cuadro a cuadro

## Respuesta corta

**Pinta la escena three.js con una función pura del tiempo, `pintar(t)`, y llámala solo desde el evento `hf-seek`.** HyperFrames 0.8.136 dispara `hf-seek` en cada búsqueda con `detail.time` y `detail.waitUntil(promesa)`, y no captura el fotograma hasta que esa promesa se cumple. Pon el oyente en el `<head>` (antes de cualquier módulo) y haz que la promesa espere a que el `.glb` esté cargado y pintado. Nada de `requestAnimationFrame`, `Date.now()`, `performance.now()` ni reloj de three: giro, cámara, entrada, salida, luces, rótulos y sombra salen de `t`. Con eso NO hace falta el camino B (página aparte + 300 PNG con alfa + WebM): la escena vive en el `index.html`. Copia three, los loaders y el decodificador Draco a `assets/` y resuélvelos con `importmap` local.

## Por qué (qué lo pagó)

El 2026-11-03 el dueño pidió una muestra de 10 s para el canal de YouTube («la parte de atrás» de una mente brillante) con el cerebro real de su atlas 3D. El riesgo era que WebGL pintara según el reloj real: el render de HyperFrames salta a fotogramas sueltos (ver [[TEMA-montar-video-con-material-real-del-celular]], «GSAP en HyperFrames»), así que cualquier estado que dependa del tiempo transcurrido sale distinto o congelado. El gancho `hf-seek` lo resolvió: el primer render salió bien y la pieza pasó la verificación (10,000 s, 1920×1080, 30 fps, AAC 48 kHz, −13,9 LUFS). El camino B quedó descartado por innecesario, no por haber fallado.

## Cómo se aplica

1. **Oyente en `<head>`** (`mentes-muestra-10s/index.html:21-31`): una promesa global (`__cerebroListo`) con su `ok`/`mal` expuestos, y `window.addEventListener("hf-seek", e => e.detail.waitUntil(listo.then(pintar => pintar(Number(e.detail.time) || 0))))`. Va antes del módulo para no perder la primera búsqueda.
2. **Carga antes del primer fotograma** (`index.html:529-547`): al cargar el glb, ocultar lo que no se ve, `renderer.compile`, `pintar(0)` y solo entonces resolver la promesa con `pintar`. Si falla la carga, rechazar (`__cerebroMal`) para que el render falle en voz alta y no entregue un video vacío.
3. **`pintar(t)` pura** (`index.html:458-527`): `f = t*30`; cada magnitud es `mezclar(a, b, curva(tramo(f, inicio, fin)))` con las curvas de GSAP tomadas por `gsap.parseEase` (`:430-438`) y los momentos en `tiempos.js`. Un grep de `requestAnimationFrame|Date.now|performance.now` en el `index.html` no da coincidencias.
4. **Lo 2D que acompaña al 3D se calcula en la misma función**: la línea y el punto del rótulo se anclan proyectando un punto del modelo a pantalla (`index.html:503-520`), y la sombra de contacto sale de la misma distancia de cámara (`:522-526`). Así siguen el giro sin una segunda línea de tiempo.
5. **Sin red para el modelo**: `three` 0.186.1, `GLTFLoader`, `DRACOLoader`, `RoomEnvironment` y `libs/draco/gltf/` copiados a `assets/three/`, resueltos con `<script type="importmap">` (`index.html:17-19`). Ojo: GSAP y las fuentes de este proyecto siguen viniendo del CDN (`:9-13`); «sin red» es solo del modelo.
6. **Calidad del contorno**: canvas con `antialias`, `alpha`, `preserveDrawingBuffer` y `setPixelRatio(1.5)` (se pinta a 2880×1620 y el navegador baja a 1920×1080) (`index.html:377-378`). Se usó así y salió limpio; no se probó sin `preserveDrawingBuffer`.
7. **Render**: `bash estudio/render.sh <proyecto>` (Chrome del sistema vía `HYPERFRAMES_BROWSER_PATH`; el de HyperFrames no arranca en macOS 13). El MP4 queda con fecha y hora en el nombre. Reserva tiempo: **10 s a 1920×1080 y 30 fps tardaron 1 min 50 s**, y HyperFrames se bajó solo a un worker por el costo de WebGL; no lances otras tareas pesadas mientras corre.
8. **Verifica el archivo, no el log**: `ffprobe` del MP4 dio h264 1920×1080 30/1, 10,000 s y AAC 48 kHz; mira además fotogramas sueltos (`renders/fotogramas/`).

## Cuándo NO aplica

- Si la pieza es solo tipografía, formas o imágenes, no metas three.js: GSAP + CSS rinden más rápido y renderizan sin el costo de WebGL.
- Con Remotion el mecanismo es otro (`--sequence`, `useCurrentFrame`), ver [[TEMA-cortometraje-sobre-ilustracion]]; `hf-seek` es de HyperFrames 0.8.136, no verificado en otras versiones.
- Si el 3D debe correr en un navegador sin WebGL, o la escena necesita física/simulación que avanza por pasos, `pintar(t)` pura no basta (habría que precalcular la trayectoria por fotograma). No se probó aquí.
- Confianza media: una sola producción (10 s). El tiempo de render (1:50, un worker), el aviso de lint de HyperFrames (2 avisos de estructura —archivo largo y `#escena` anidado—, 0 errores) y el descarte del camino B los reportó el constructor de la pieza; no quedó un `render.log` en `renders/` para releerlos. Para un video de 60 s no extrapoles sin medir.
- El veredicto del dueño sobre la pieza (gusto, canal) no está recogido; esto cubre solo la técnica.

## Evidencia

- `prommter/contenido/estudio/mentes-muestra-10s/index.html:21-31` (oyente `hf-seek` en `<head>`), `:458-527` (`pintar`), `:499` (`renderer.render`), `:529-547` (carga y resolución de la promesa), `:17-19` (importmap), `:377-378` (renderer y pixel ratio).
- `prommter/contenido/estudio/mentes-muestra-10s/GUION.md:54-74` (camino A elegido, B descartado, modelo y materiales).
- `prommter/contenido/estudio/render.sh:5-6` (Chrome del sistema, `hyperframes@0.8.136`).
- `prommter/contenido/estudio/mentes-muestra-10s/renders/mentes-muestra-10s.mp4`: ffprobe 2026-11-03, h264 1920×1080, 30/1, 10,000 s; AAC 48 kHz.
- Modelo: `/Users/g/orion/cerebro-3d/public/models/cerebro-ligero.glb` (1,35 MB, Draco, CC BY-SA 4.0: la atribución viaja con el video).

## Enlaces

- [[TEMA-montar-video-con-material-real-del-celular]] (HyperFrames en esta Mac: Chrome del sistema, GOP, GSAP por fotogramas sueltos).
- [[TEMA-cortometraje-sobre-ilustracion]] (cámara sobre arte terminado; Remotion `--sequence`; HyperFrames por licencia).
- [[TEMA-youtube-reglas-y-plata-2026-2027]] (el canal para el que se hizo la muestra).
