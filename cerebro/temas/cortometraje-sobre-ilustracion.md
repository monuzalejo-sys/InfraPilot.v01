---
slug: cortometraje-sobre-ilustracion
titulo: "Dirigir un cortometraje sobre ilustraciones reales, no redibujarlo en código (Remotion)"
alias: [corto, cortometraje, video, vídeo, video corto, comercial animado, spot, anuncio animado, animacion, animación, animar, remotion, render de video, renderizar video, camara, cámara, movimiento de camara, empuje de camara, empuje de cámara, paneo, panoramica, panorámica, dolly, travelling, zoom, plano, planos, encuadre, encuadres, foco, foco de camara, centro de la camara, corte, cortes, salto de continuidad, salto de eje, dos planos iguales, mismo encuadre, continuidad visual, ilustracion, ilustración, ilustraciones, pintura, pinturas, arte generado, arte del dueno, arte del dueño, dibujos del dueno, gemini, imagenes generadas, generado con ia, redibujar, redibujar en codigo, redibujar en código, svg, personaje en svg, vectores planos, se ve infantil, se ve feo, muy infantil y feo, rechazo del video, rechazo del corto, fotograma, fotogramas, still, stills, frame, frames, nitidez, varianza laplaciana, laplaciano, se ve borroso, se ve pixelado, se ve estirado, ablandado, borde negro, banda negra, descubre el borde, grano, vineta, viñeta, textura de pelicula, textura comun, mp4, encoder, encoder de video, avassetwriter, swift, swiftc, ffmpeg, remotion render, --sequence, secuencia de imagenes, numeracion de fotogramas, verificar animacion, verificar animación, verificador de fotogramas, ola de verificadores, olas de escenas, director, veredicto del director, cuanto puedo acercar la camara, hasta donde puedo hacer zoom, guia de marca, guía de marca, referencias de arte, resolucion nativa, resolución nativa, macos 13, macos 15, ventura, sequoia, compositor de remotion, sigabrt, continuitycamera, titere, títere, titere svg, rig, rig de personaje, muneco articulado, muñeco articulado, mascota animada, mascotas animadas, animar personaje en codigo, animar personaje en código, vectores fieles a la guia, vectores fieles a la guía, estilo inventado, vuelve duo burguer, juntos otra vez, choque de puños, blanco y negro a color, byn, bn a color, telon de pan, telón de pan, ajonjoli, ajonjolí, mono a estereo, mono a estéreo, audio medido, medir audio, dbfs, curva cuadratica, curva cuadrática, manguera svg, guante de cuatro dedos, guante de 4 dedos, ia de google, titere sobre material real, titere sobre tomas reales, mascotas sobre video real, mascotas sobre fotos reales, compuesto sobre material real, ya prendimos las luces, anuncio en vector, a01, igual que los cortometrajes, se ve artificial, rechazo del 18 de octubre, hoja de personaje, hoja de personajes, entintado a mano, estilo cuphead, cuphead, cup head, trazo de pincel, proporciones de bebe, ojos enormes, paleta de caramelo, movimiento rigido, logo para redes, foto de perfil, portada de facebook, 1640x624, 1080x1080, recortar mascotas, redibujar mascotas, flood fill, stickers, resolucion real, resolución real, media escala, prueba barata, render maestro, master, máster, puños no se tocan, tarjeta final, cierre del video, link en la bio, tiktok sin link, hora horneada, redibujar solo un tramo, re-renderizar, texto para publicar, render largo, script de empaque, syntax error, bash -n, ffmpeg corrupto, archivo corrupto, pgrep, decodifica entero, remotion licencia, licencia de remotion, hyperframes, remotion vs hyperframes, motor de video, html a video, el esfuerzo influye, nivel de esfuerzo, quiero mas real, fotorrealista, filtro de color, usa la ia]
preguntas: ["¿cómo hago un corto animado a partir de las ilustraciones del dueño sin que se vea infantil?", "¿hasta dónde puedo acercar la cámara a una pintura sin que se vea borrosa?", "dos escenas me quedaron con el mismo encuadre, ¿cómo las diferencio?", "¿por qué me sale una banda negra cuando empujo la cámara hacia el borde de la pintura?", "¿cómo verifico que una animación quedó bien sin solo leer el código?", "el dueño rechazó el video por infantil, ¿qué hago distinto la próxima vez?", "¿cómo saco el mp4 si Remotion no codifica en esta máquina?", "¿le pido al generador de imágenes que anime, o construyo la animación yo encima de su arte?", "¿por qué el render terminó en verde y no hay ningún archivo de video?", "¿puedo animar un personaje en código (SVG) o eso también se ve infantil?", "el dueño rechazó un video en vectores pero le gustó otro también en vectores, ¿cuál es la diferencia real?", "¿cómo verifico que un personaje animado en código es fiel a la guía de marca?", "¿cómo verifico un efecto de sonido que cambia de mono a estéreo en un fotograma exacto?", "¿puedo meter el títere SVG encima de las tomas reales del local?", "el anuncio le quedó igual a los cortos y el dueño lo quiere más real, ¿le subo el esfuerzo o cambio algo?", "¿cómo le hago el logo y la portada para las redes si ya me dio las mascotas dibujadas en 3D?", "el dueño cambió la hora y el link de todos los videos, ¿renderizo todo otra vez?", "se me dañó el mp4 después de relanzar ffmpeg, ¿qué hice mal?", "¿los videos de Prommter los monto con Remotion o con HyperFrames?", "¿por qué algo que se veía bien en la prueba chiquita salió mal en el video final?"]
proyectos: [duo-burger, prommter]
confianza: alta
actualizado: 2026-11-02
---

# Dirigir un cortometraje sobre ilustraciones reales, no redibujarlo en código

**⚠ Corrección 2026-11-02:** el contra-matiz del 18-oct (más abajo) quedó corto: dice
que con material real «el techo está en la edición». El mismo 18-oct el dueño rechazó
también «la edicion de los colores» y, ante dos caminos de mejor edición, no eligió
ninguno: pidió IA. Y el 4-oct, al rechazar A01, preguntó si el esfuerzo influía; la
respuesta fue que pule el acabado pero no cambia el registro. Regla vigente: si
rechaza por «igual que los cortos» o «se ve artificial», **cambia la fuente de imagen,
no el esfuerzo** (sus tomas con el color real y sin filtros de ambiente; imágenes o
video generados por API) y deja al código cámara, ritmo, tipografía y cierre de marca.
La edición pura solo vale cuando la fuente ya es la toma real sin filtro. La v2 con IA
no tiene veredicto del dueño (`duo-burger/PEND-030`). El contra-matiz queda abajo como
historia.

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

**Matiz (2026-10-01):** esto no es "nunca código" — es "nunca estilo
inventado". Si en vez de fotografiar arte ya pintado vas a CONSTRUIR el
personaje en código (un títere vectorial), reemplaza "arte ya terminado" por
"guía de marca verificable": compara el render directamente contra un
recorte de la guía en cada entrega, no contra tu criterio. Ver "Cuándo NO
aplica".

**Contra-matiz (2026-10-18):** la aprobación del 1-oct fue de una pieza ENTERA en
vectores fieles a la guía, un mundo dibujado de punta a punta. El mismo títere
**compuesto sobre material real** (fotos y tomas del local) lo rechazó el dueño —
*«¿esto lo hiciste con la IA de Google? no me gustó para nada el resultado»*
(`duo-burger/PEND-029`)— y antes había rechazado un anuncio de producto en vectores
por «igual que el resto de cortometrajes» (A01, 2026-10-04). Con material real
debajo, el techo está en la edición (color, ritmo, cortes, sonido, tipografía); si
aparecen personajes, que los genere una IA a partir de sus hojas de marca (ver
[[TEMA-veo-clips-de-ia-para-componer]]) y no un títere en código pegado encima.

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

**Lo pagó, tres semanas después, una aprobación que obliga a matizar todo lo
anterior.** El 2026-10-01 el dueño vio un corto de 32 s hecho TODO en
vectores con código —artefacto «Vuelve Duo Burguer»—, con las mascotas
dibujadas fieles a la guía de marca, y dijo *"ese me gustó"*, pidiendo uno
"mucho mejor" y "algo que lo diferencie de cualquier marca" (`feedback_video_no_infantil.md`,
matiz del 2026-10-01; `project_duo_burguer_corto_juntos.md`). El eje real del
rechazo de septiembre nunca fue "código sí/no" ni "vector sí/no": fue el
ESTILO INVENTADO (paleta synthwave y personajes que no eran los de la guía).
El segundo corto, "Juntos otra vez" (62,4 s), construyó un títere articulado
en código como un conjunto CERRADO de estados con nombre —seis `Ojos`, nueve
`Boca`, un guante de cuatro dedos con seis poses (`Mano`), brazos y piernas
como curva cuadrática (`manguera()`)— y lo verificó comparando el render
DIRECTAMENTE contra un recorte de la guía de marca, fotograma por fotograma:
la primera versión tenía la lechuga y el tomate aplastados y sin argollas,
invisible hasta ponerla al lado de la guía (`duo-burger/KN-028`;
`src/corto/rig/Burger.tsx:24-25,213,299,413-424`, `src/corto/rig/Guante.tsx:11,50-91`
en `prommter/duo-burguer-video`).

**Y midió también el sonido, no solo la imagen.** El choque de puños en el
fotograma 840 tenía que sonar como el salto de un disco viejo mono a alta
fidelidad estéreo. Medido con `scripts/banda/medir.mjs` contra el audio real
(`public/corto/banda.wav`, corrida del 2026-10-01): la proporción
RMS(L−R)/RMS(L+R) pasa de 0,0000 antes del fotograma 840 a 0,3227 después, y
el nivel salta de −37,3 dBFS (20 ms antes del golpe) a −11,3 dBFS (en el
golpe) — la misma disciplina de "ábrelo y mídelo" del fotograma, aplicada
también al audio (`duo-burger/KN-029`).

**Y lo pagó, diecisiete días después, un rechazo que obliga a matizar el matiz.** El
2026-10-15 se hicieron una imagen (4:5 y 9:16) y el reel «Ya prendimos las luces»
(23,2 s) con las fotos y tomas reales del local y las dos mascotas del rig vectorial
compuestas dentro, y cuidadas a conciencia: sombra de contacto, contraluz ámbar ≤0,4,
sombra sobre el cuerpo, el mismo grano y seguimiento con Vision de un objeto pegado al
portacarta (`duo-burger/KN-032`). El 2026-10-18 el dueño respondió *«¿esto lo hiciste
con la IA de Google? no me gustó para nada el resultado»*: era código (Remotion), sus
fotos y el títere SVG (`duo-burger/PEND-029`, `feedback_duo_local_mascotas_rechazo.md`).
La memoria del dueño lo lee como el tercer rechazo de la misma familia, después del
logo vectorial y del anuncio A01 (`feedback_anuncios_mas_real.md`): para él un dibujo
vectorial puesto sobre material real no es profesional aunque la integración técnica
esté bien hecha, y que lo confundiera con IA dice que el montaje se ve artificial. Pidió
«usa la IA»; lo que se hizo y lo que costó está en
[[TEMA-veo-clips-de-ia-para-componer]] (veredicto de la v2 aún pendiente,
`duo-burger/PEND-030`).

**Y lo pagó, el 4-oct, una pregunta del dueño sobre el esfuerzo.** A01 («La Cheddar», 12 s,
vectores fieles a la guía, revisado fotograma a fotograma) se rechazó a la primera vista:
*«ese anuncio es igual que el resto de cortometrajes, quiero algo llamativo»*. El dueño
preguntó si subir el nivel de esfuerzo cambiaba algo; la respuesta de Claude: *«Lo que
decide que se vea real es la fuente de las imágenes.»* El 18-oct el reel del local
(sus tomas con cielo azul y tonos cálidos añadidos + títere SVG) cayó entero, filtro de
color incluido, y se pasó a IA generada por API (prueba de 10 s, US$3,45, «me agradó un
poco más»; v2 sin veredicto). El 19-oct Claude lo resumió: el cielo azul y los tonos
cálidos puestos a la foto del local tampoco gustaron.

**La causa del «muy infantil» tiene cuatro señales chequeables** (diagnóstico propio del
09-10, tras el rechazo del teaser de 18 s): relleno plano con contorno negro uniforme
(lenguaje de sticker y emoji); ojos enormes y redondos sobre un cuerpo pequeño y redondo
(proporciones de bebé); paleta de caramelo; movimiento rígido sin arrastre ni desfase.
Detrás está el techo del código: sin trazo de pincel de grosor variable, sin temblor de
línea, sin textura de papel. Con la guía real del dueño (1312×1199) ampliada a 900 px
el arte aguantó, y el corto de 45,2 s a 1376×768 se entregó sin otro rechazo.

**El logo y la portada pagaron lo mismo en pequeño.** La primera entrega, con las
mascotas redibujadas en vectores planos, fue «muy malo… pesimo»: el dueño ya había dado
una hoja con las mascotas a color, en 3D y desde varios ángulos (*«no esos stikers, yo te
di material donde se veian colores…»*). Rehecho recortando SU arte, quedó aprobado
(*«me gusto lo que hiciste»*). El primer recorte falló: dos rayos rojos oscuros pasaban
por contorno negro; la muralla se definió como «todos los canales bajos» (umbral sobre el
máximo de R, G, B), no solo oscuro.

**Un máster pasó la prueba a media escala con dos defectos.** El 09-10 las revisiones
se hacían a media escala (el grano a resolución completa ponía de rodillas a un i5 de 4
hilos). Con el máster vertical de 540 fotogramas ya renderizado, un solo fotograma a
resolución real mostró que los puños no llegaban a tocarse y que la boca a medio abrir
era pura dentadura. Hubo que corregir y relanzar el máster completo.

**Cuatro cambios del dueño en 18 días tocaron píxeles ya horneados.** La cuenta de TikTok
no tiene enlace en la bio (tarjeta final de los 21 videos rehecha); la regla de las 6 a.m.
(V04 y V21 completos: el despertador marcaba las 11); el evento renombrado «Halloween y
reapertura» (2 escenas del corto, fotogramas 1308–1715 de 1872, cuando el máster entero
había tardado 25 min 46 s); y la dinámica retirada de la página (la tarjeta pasó de
«la dinámica se va a las 10 p.m.» a «mira la carta y pide en la página»). Todo lo demás
salió del calendario sin render.

**Un render largo se dañó dos veces.** El máster de «Juntos otra vez» (1872 fotogramas a
1080×1920, 25 min 46 s) terminó con error de sintaxis en la línea 29 del script de
empaque. Al relanzar, el ffmpeg que se había detenido seguía cerrando el mismo archivo
mientras el nuevo escribía encima: archivo corrupto. Rehecho con otro nombre: 71,5 MB,
1872 fotogramas, 62,4 s, decodificado sin errores.

**La licencia decidió el motor del video nuevo de Prommter.** El 6-oct, preguntado por
HyperFrames, Claude explicó que Remotion «exige licencia paga a empresas de más de tres
personas, y Prommter ya tiene equipo», y que HyperFrames no cobra. En esta Mac
HyperFrames corrió con el Chrome del sistema (3 s en 41 s; 15 s ≈ 2 min) y los dos
videos de marca de 15 s hechos con él se entregaron; el títere aprobado ya corrió
dentro de HyperFrames. La condición de la licencia salió de una búsqueda web de Claude,
no de la página oficial de Remotion.

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
13. **Si construyes un personaje en código en vez de dirigir cámara sobre
    arte ya pintado, el títere es un conjunto CERRADO de estados con nombre,
    no una reinterpretación por fotograma**: enumera los estados posibles de
    cada parte (ojos, boca, manos) como un tipo (`Ojos`, `Boca`, `Mano`) y
    compón las poses combinando esos estados, nunca inventando geometría
    nueva escena por escena. Verifica contra la guía de marca con una
    comparación de imagen lado a lado, igual que verificas un fotograma: sin
    eso, "fiel a la guía" es una afirmación sin evidencia.
14. **Cuando un momento de dirección depende de un corte sincronizado de
    imagen Y sonido** (un choque, un flash, un corte seco), mide los dos por
    separado alrededor del mismo fotograma exacto: la proporción de energía
    entre canales para un salto mono→estéreo, el nivel en dBFS para un golpe.
    "Se ve bien" y "se escucha bien" son afirmaciones sin evidencia hasta que
    midas ambos.

15. **Si el estilo pedido es de ilustración entintada a mano (tipo Cuphead), no lo
    fabriques con formas planas.** Antes de animar pide guía de marca con códigos de
    color, hoja de personaje, escenarios y guion gráfico, y anima ESOS recortes con un
    único componente de personaje (así no hay deriva entre escenas). Antes de entregar
    revisa las cuatro señales de «infantil» de la sección «Por qué».
16. **Rechazo por «igual que los cortos» o «se ve artificial»: no ofrezcas «las mismas
    tomas mejor editadas» ni subas el esfuerzo.** Cambia la fuente (tomas del dueño con
    el color real, sin cielo azul ni tonos cálidos añadidos; o imágenes y video de IA por
    API) y consigue el material ANTES de construir. Ver
    [[TEMA-veo-clips-de-ia-para-componer]].
17. **Logo, foto de perfil y portada: recorta el arte que el dueño dio, no lo redibujes.**
    Recorte por flood fill desde el borde con umbral sobre el canal máximo (R, G, B).
    Medidas entregadas: perfil 1080×1080 igual para Instagram, TikTok y Facebook (todo
    dentro del círculo) y portada de Facebook 1640×624 con lo importante al centro. Pon el
    resultado al lado de la hoja antes de entregar y avisa si el arte fuente (1376×768)
    se ve blando: pide la versión grande.
18. **Antes del máster, abre al menos un fotograma a la resolución final.** Las pruebas a
    media escala sirven para iterar barato; el detalle fino (guantes que se tocan, bocas
    a medio abrir) solo se ve a resolución real. Corrige y recién entonces lanza el máster.
19. **Separa cada video en cuerpo estable + tarjeta final** (los últimos ~54 fotogramas,
    1,8 s) y deja fuera de los píxeles lo que el dueño cambia: hora de publicación,
    «link en la bio», nombre del evento, qué dinámica está activa. El CTA propio de cada
    red va en el «Texto para publicar» (versión IG/FB/WhatsApp y versión TikTok con la URL
    escrita). Si algo cambia, redibuja solo ese tramo y re-empaca.
20. **Render de 20+ minutos: pasa el script de empaque por `bash -n` (o `zsh -n`) antes de
    lanzar.** Si falla al final, los fotogramas ya existen: codifica aparte. Si relanzas
    una codificación detenida, confirma con `pgrep` que el proceso viejo murió, escribe a
    un nombre NUEVO y comprueba que decodifica entero (`ffmpeg -v error -i f -f null -`),
    su duración y su tamaño.
21. **Video nuevo de una empresa de más de tres personas (Prommter): HyperFrames**, que no
    exige licencia; Remotion queda para lo ya hecho o hasta comprar la licencia. Verifica
    la condición en la página oficial de Remotion antes de decidir. Lo del Chrome de
    HyperFrames en esta Mac vive en [[TEMA-montar-video-con-material-real-del-celular]].

## Cuándo NO aplica

- **"No redibujes con código" no significa "nunca uses código para
  dibujar": significa no INVENTES el estilo.** El rechazo de septiembre de
  2026 fue al estilo (paleta synthwave, personajes que no eran los del
  dueño), no a la técnica: un títere vectorial construido en código SÍ se
  aprobó en octubre cuando cada trazo (proporciones, colores, expresiones)
  salió de la guía de marca y el render se comparó directamente contra ella,
  fotograma a fotograma. Si vas a construir en vez de fotografiar, la
  condición que reemplaza "arte ya terminado" es "comparación directa contra
  la guía de marca en cada entrega", no "nunca código"
  (`feedback_video_no_infantil.md`; `duo-burger/KN-028`).
- **Pero un títere en código, aunque sea fiel a la guía, NO va compuesto sobre
  material real** (fotos o tomas del local): se rechazó el 2026-10-18 con la
  integración técnica cuidada. Si el dueño no lo pide explícitamente con ese estilo,
  no lo propongas; la ruta es edición pura y, si hacen falta personajes, generados por
  IA desde sus hojas de marca (ver el contra-matiz de la «Respuesta corta»).
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

- **El rechazo de A01 y del reel NO prueba que los vectores sean el problema:** el
  corto «Juntos otra vez» (vectores fieles a la guía, historia animada de punta a punta)
  se aprobó, y el 10-01 el dueño aprobó un corto todo en vectores con sus mascotas
  exactas. La regla «cambia la fuente» aplica a anuncios de producto y a piezas sobre
  material real; no a una historia dibujada entera ni cuando él pide expresamente estilo
  ilustrado. Tampoco des por aprobada la v2 con IA.
- **«Pide el arte al dueño» (paso 15) no aplica a estilos tipográficos, geométricos,
  fotográficos o 3D**, que el código sí hace bien; ni a un títere vectorial FIEL a la
  guía (ver el matiz del 2026-10-01). Si el dueño no entregó material, se construye y se
  compara contra un recorte de la guía.
- **Recortar su arte (paso 17) no aplica si no entregó material**, ni si el arte fuente es
  demasiado pequeño para el formato: pide el original en alta.
- **El fotograma a resolución real (paso 18) no hace falta** en pruebas de lógica o de
  temporización que no dependen del detalle fino.
- **Tarjeta final redibujable (paso 19):** no aplica a una pieza única y eterna sin CTA ni
  fecha (un corto de marca), ni cuando el cambio afecta a toda la historia y no solo al
  cierre.
- **`bash -n` y nombre nuevo (paso 20):** no vale la pena en codificaciones de pocos
  segundos, donde repetir cuesta menos que validar.
- **HyperFrames sobre Remotion (paso 21):** no aplica a piezas personales o de equipos de
  hasta tres personas si se compra la licencia, ni a piezas hechas en Remotion que solo se
  re-renderizan. Confianza media: la condición de licencia no se verificó en la fuente
  oficial.

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
- `feedback_video_no_infantil.md` (memoria permanente del dueño, con matiz
  del 2026-10-01) — la cita textual del rechazo de septiembre, lo que pidió a
  cambio, y la cita textual de la aprobación de octubre («ese me gustó») que
  distingue estilo inventado de técnica.
- `duo-burger/KN-028` — el títere de las mascotas (`src/corto/rig/Burger.tsx`)
  verificado fotograma por fotograma contra `docs/marca/guia-de-marca.png`:
  cero desviación de paleta. Es la verificación de "fiel a la guía", no una
  afirmación.
- `duo-burger/KN-029` + medición directa (`node scripts/banda/medir.mjs
  public/corto/banda.wav`, 2026-10-01) — el audio también se mide, no se
  escucha: RMS(L−R)/RMS(L+R) pasa de 0,0000 (antes del fotograma 840) a 0,3227
  (después); el nivel salta de −37,3 dBFS a −11,3 dBFS en el golpe.
- `duo-burger/DEC-019` — la decisión de dirección del segundo corto: B/N
  hasta el puño, color que estalla en círculo (`clipPath: circle()`,
  `src/corto/Corto.tsx:85`), "telón de pan" de apertura/cierre, firma del
  ajonjolí que rueda.
- `project_duo_burguer_corto_juntos.md` (memoria permanente) — "Juntos otra
  vez" (62,4 s): dónde vive el código, la idea que diferencia, y la
  advertencia de que la música está medida pero nadie la ha oído.
- `src/corto/rig/Burger.tsx:24-25,213,299,413-424` y
  `src/corto/rig/Guante.tsx:11,50-91` (`prommter/duo-burguer-video`) — el
  títere como estados con nombre: seis `Ojos`, nueve `Boca`, guante de cuatro
  dedos con seis `Mano`, brazos y piernas como curva cuadrática (`manguera()`).
- `src/corto/kit/Logo.tsx:1-7` y `src/corto/kit/Titulo.tsx:11,21`
  (`prommter/duo-burguer-video`) — dos trampas de Remotion: el logo va de SVG
  incrustado (no `<image>`) para no depender de una carga, y el ancho de cada
  letra se mide con canvas sin memo a propósito.
- `duo-burger/PEND-029` (Done) y `feedback_duo_local_mascotas_rechazo.md` (memoria
  permanente del dueño) — el rechazo del 2026-10-18 del títere compuesto sobre
  material real, con su cita textual y la regla «no volver a componerlo sin que él lo
  pida». `duo-burger/KN-032` — cómo se integraron las mascotas en las tomas.
  `feedback_anuncios_mas_real.md` — el rechazo del anuncio A01 (2026-10-04).
- **Contradicción abierta en la memoria del proyecto:** `duo-burger/KN-031` (Current,
  2026-10-04) afirma que sin fotos reales el techo de un anuncio de comida es el vector
  fiel; el dueño rechazó justamente ese A01 el mismo día y la memoria del proyecto no lo
  registra (solo `feedback_anuncios_mas_real.md`). Vale la regla posterior: no más
  anuncios en vector. No se tocó la memoria del proyecto.

- Ventana [[2026-10-05-plan-de-anuncios-profesionales|Plan de anuncios profesionales]]
  (transcrito `3d75e606`): «ese anuncio es igual que el resto de cortometrajes, quiero
  algo llamativo» y «Lo que decide que se vea real es la fuente de las imágenes.»
  (2026-10-05); sobre licencias: «exige licencia paga a empresas de más de tres personas, y
  Prommter ya tiene equipo» y «HyperFrames no cobra nada» (2026-10-06); «3 segundos
  salieron en 41 segundos, así que uno de 15 tardará unos 2 minutos» y «la técnica de
  meter el títere aprobado dentro de HyperFrames funcionó» (2026-10-06).
- Ventana [[2026-10-01-mejora-de-video-en-artefactos|Mejora de video en artefactos]]
  (transcrito `5f2b61e1`): «esto lo hiciste con la ia de google? no me gusto para nada el
  resultado» y «no me gusto ni la edicion de los colores de la imagen ni nada en general»
  (2026-10-18); «el diseño se separa mucho del material que te he dado» (2026-10-01);
  «no esos stikers, yo te di material donde se veian colores, el logo de distintos
  angulos tipo 3d» (2026-10-15); «la muralla es solo el negro de verdad (todos los canales
  bajos), no el rojo oscuro» (2026-10-01); «me gusto lo que hiciste» (2026-10-03);
  «vuelvo a dibujar solo la tarjeta final de cada video (los últimos 54 fotogramas), no el
  video entero» (2026-10-03); «La tarjeta final de los videos ya no dice «link en la bio»»
  (2026-10-03); «en el del día 4, el despertador marca las 11» (2026-10-05); «25:46.09
  total», «scripts/render-corto.sh: line 29: syntax error near unexpected token» y «el
  ffmpeg que detuve seguía cerrando el mismo archivo mientras el nuevo escribía encima»
  (2026-10-01); «71,5 MB, 1080×1920, 1872 fotogramas, 62,4 s, se decodifica entero sin
  errores» (2026-10-01).
- Ventana [[2026-10-01-mejora-de-video-en-artefactos|Mejora de video en artefactos]]
  (transcrito `fc142d00`): «El cielo azul y los tonos cálidos que le puse a la foto del
  local no te gustaron» (2026-10-19); «I redraw only the two scenes with the banner
  (frames 1308–1715).» y «decía «la dinámica se va a las 10 p.m.» y ahora dice «mira la
  carta y pide en la página»» (2026-10-21).
- Ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `51184930`): «no me gusto para
  nada, muy infantil y feo»; «Relleno plano con contorno negro uniforme. Eso es lenguaje
  de sticker y de emoji.»; «Proporciones de bebé. Ojos enormes y redondos sobre un cuerpo
  pequeño y redondo» (2026-09-10); «ampliado a 900 píxeles el arte aguanta» (2026-09-10);
  «A resolución real veo dos cosas que a media escala se perdían: los puños no llegan a
  tocarse» y «Ahora los puños se tocan y la boca sonríe. Relanzo el máster con las
  correcciones.» (2026-09-10); «El grano de película a resolución completa la habría
  puesto de rodillas» (2026-09-09).

## Enlaces

- [[TEMA-generadores-de-diseno]] — el mismo principio de "dale materia prima
  real, no adjetivos" aplicado a piezas estáticas en vez de video.
- [[TEMA-que-es-estar-verificado]] — "compilar no es funcionar" es la misma
  trampa que "el render terminó en verde y no hay archivo".
- [[TEMA-olas-de-agentes]] — cómo se organizó la ola de constructores y
  verificadores, y qué hacer cuando mueren a mitad de ola.
- [[TEMA-entorno-de-la-maquina]] — por qué esta misma Mac no aguantaba la ola
  de render mientras compilaba ffmpeg.
- [[TEMA-montar-video-con-material-real-del-celular]] — el caso contrario: el
  material son tomas reales del iPhone (HDR→SDR, HyperFrames, qué tapar).
- [[TEMA-veo-clips-de-ia-para-componer]] — lo que se hizo después del rechazo del
  18-oct: personajes generados por IA (Veo) compuestos sobre el material real, con su
  color de fondo, recorte, zoom, costo y voces medidos.
- [[TEMA-gusto-visual-del-dueno]] — lo que a este dueño le parece infantil, artificial o
  profesional, visto en todas las piezas.
- [[TEMA-como-pide-el-dueno]] — pedir muestra primero y dar material real antes de construir.
