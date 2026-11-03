---
slug: como-entregar-al-dueno
titulo: Cómo se le entrega el trabajo al dueño (dónde, en qué forma y diciendo qué quedó)
alias: [como entregar al dueno, entrega al dueno, donde dejo el archivo, donde dejo los archivos, dejalo a la mano, deja el zip a la mano, zip a la mano, carpeta a la mano, descargas, escritorio por proyecto, carpeta por proyecto, desktop, abrir en finder, finder seleccionado, papelera zip viejo, version vieja, que no se confunda de version, mandar a la imprenta, para mandarlo, para subirlo a redes, dejame el archivo para mandarlo, dos archivos, mejor calidad y liviano, video liviano, video para whatsapp, 720x1280, 1080x1920, drive no, no prepares copias, no borres entregas anteriores, prueba de 10 s, texto para publicar, ya se aplico, ya esta aplicado, aplicado, tres sitios, github caja nube, push o pull, pull en el pc, tengo que hacer push, redeploy, antes y despues, que quedo y que no, aplicaste todas las mejoras, lista de lo propuesto, check y equis, esto no es el presupuesto, datos de ejemplo inventados, que no es, entrega parcial, ayuda dentro de la app, seccion ayuda por perfil, novedades]
preguntas: ["¿Dónde le dejo al dueño los archivos para que los mande a la imprenta?", "¿Cómo le dejo al dueño lo que tiene que mandar para que no se confunda de versión?", "¿Cómo le entrego los videos al dueño y dónde los dejo en la Mac?", "¿Ya se aplicó lo que te pedí o todavía no lo veo en la caja del local?", "¿Esto que me entregas trae todo lo que me prometiste o algo quedó por fuera?", "¿Tengo que hacer push desde el PC para ver el cambio?"]
proyectos: [duo-burguer, mercaplaza, placita, wrd, plantillas-arquitectura, prommter]
confianza: alta
actualizado: 2026-11-02
---

# Cómo se le entrega el trabajo al dueño (dónde, en qué forma y diciendo qué quedó)

## Respuesta corta

1. Entrega **a la mano y con el estado dicho**: archivos en `~/Desktop/<Proyecto>/<Tema>/` (nada suelto ni con prefijo «Proyecto - »), adjuntos también en el chat si va a reenviarlos.
2. Si reempacas **la misma pieza** (el ZIP de imprenta), manda tu versión anterior a la Papelera para que no envíe la equivocada; **las entregas anteriores (videos ya hechos) no se borran ni se reemplazan: lo nuevo va al lado.**
3. Video: dos archivos, 1080×1920 y 720×1280 (~9 MB, para WhatsApp).
4. Di en cuál de los tres sitios quedó el cambio (GitHub, caja del local, web) y **qué de lo propuesto quedó y qué no** (✅/❌ con la razón).

## Por qué (qué lo pagó)

- **Versiones que se confunden al enviar.** El 09-23 pidió «deja el zip a la mano en
  descargas para mandarlo»; el 09-24, «déjame la carpeta a la mano». Se dejó la carpeta
  final y un ZIP del mismo nombre, abiertos en Finder, y el ZIP viejo del 23 a la
  Papelera «para que no se confundan al enviar».
- **Video: de Drive a dos archivos locales.** Pidió «déjalo en un drive en mi correo» y
  terminó en «no prepares copias. dame uno con la mejor calidad y uno liviano, déjalos
  aquí en la Mac» (62,4 s: 173 MB y 9,2 MB).
- **Una prueba suya borrada sin preguntar.** El 10-18, al empacar «Cómo llegar», se
  borró del Escritorio la prueba de 10 s —era del dueño, para comparar— y hubo que
  reconstruirla desde sus cuadros y su audio.
- **«Aplicado» son tres sitios.** El 09-01 creyó que tenía que hacer push desde su PC
  para ver el cambio y preguntó si ya estaba «aplicado»; la respuesta correcta era que
  GitHub sí, la caja del local aún no (necesita pull y reiniciar) y la web tampoco.
- **Entrega parcial sin decirlo.** En plantillas de arquitectura el dueño tuvo que
  preguntar «¿aplicaste todas las mejoras de las que hablaste?»: 4 de 8 faltaban
  (cantidades por medidas, hoja de cotización con logo, APU, conexión con el cuadro de
  áreas) y Claude admitió que debió decirlo al entregar.

## Cómo se aplica

1. **Destino por defecto:** `~/Desktop/<Proyecto>/<Tema>/` (regla del dueño del
   2026-10-23, `memoria/feedback_escritorio_por_proyecto.md`: Duo Burguer, Mercaplaza,
   Prommter, WRD, Escuadra; un proyecto nuevo estrena su carpeta). La regla anterior
   (Descargas «a la mano») sigue valiendo en lo de fondo: carpeta + ZIP del mismo
   nombre, abiertos, sin versiones viejas.
2. **Si va a reenviar o subir** (imprenta, redes, WhatsApp, correo): adjunto en el chat
   para descargarlo **y** en su carpeta. Selecciónalo en Finder
   (`open -R <ruta>`; si `reveal_path` rechaza la ruta por quedar fuera de las carpetas
   de la sesión, ábrelo por otra vía). La versión anterior, a la Papelera; no toques
   carpetas que no son tuyas.
3. **Verifica sobre lo ya copiado** (medidas, fuentes, imágenes), no sobre los archivos
   de trabajo.
4. **Video:** dos archivos (1080×1920 y 720×1280 ~9 MB) con su «Texto para publicar»,
   sin Drive ni copias intermedias. Al empacar, lo anterior del Escritorio se queda;
   lo nuevo va al lado. Si pesa demasiado para el chat: carpeta + ruta completa.
5. **Dónde quedó el cambio:** (1) GitHub, la copia maestra; (2) la caja del local,
   que necesita `git pull` en el PC y reiniciar con el `.bat`; (3) la web de
   producción, que necesita redeploy. **Push sube, pull baja:** el dueño no debe hacer
   push, dale el pull exacto. Si aún no puede verlo, levántalo en la Mac y muéstrale el
   antes y el después.
6. **Qué quedó y qué no:** si propusiste varias mejoras y entregas parte, la primera
   línea es la lista ✅/❌ de lo propuesto con la razón de cada omisión; los datos de
   ejemplo se rotulan como inventados («que no los use para cotizar»); y si el archivo
   va a un tercero, di también qué NO es («esto es el cuadro de áreas, no el
   presupuesto»).
7. **Lo que falta se anuncia, no se esconde:** en lo público, la función apagada dice
   «abren muy pronto» (`memoria/feedback_lo_que_falta_se_anuncia.md`; ver
   [[TEMA-cero-datos-inventados]]).
8. **Todo sistema que le hagas a un cliente lleva su Ayuda dentro de la app,** por
   perfil (pocos accesos / cajero / dueño) y con «Novedades» arriba; se actualiza en el
   mismo commit de cada cambio visible (`memoria/feedback_ayuda_por_perfil.md`, pedido el
   2026-11-02). Ver [[TEMA-documentos-para-personas]].

## Cuándo NO aplica

- Si el dueño pide otro destino o formato, o es un video interno de prueba que nadie más
  va a ver, no hace falta el par de calidades.
- Si el despliegue ya es automático (el VPS de Mercaplaza publica `master` al hacer
  push), el sitio (3) no pide acción: verifica y dilo. Las rutas y el `.bat` pueden haber
  cambiado: usa los vigentes.
- La lista ✅/❌ sobra cuando el dueño pidió solo un subconjunto («empecemos por lo que
  ella pedía») y la primera línea de la entrega ya lo dice.
- Archivos muy pesados: no al chat; carpeta más ruta completa.
- **Un destino excepcional lo fija él:** el PDF conjunto de claves de correos quedó
  suelto en el Escritorio por pedido suyo hasta que lo guardara.

## Evidencia

**Archivos dentro del chat y en su carpeta** (L-A2-24)
- «dejame el archivo a mi para mandarlo» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-24)
- «Te dejo aquí los archivos para que los subas» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-10-01)
- «La versión del 24 la pasé a la papelera para que no se confundan.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-25)

**A la mano: carpeta y ZIP, abiertos en Finder** (L-A1-19)
- «deja el zip a la mano en descargas para mandarlo» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-23)
- «dejame la carpeta a la mano» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-24)
- «El ZIP viejo del 23 lo paso a la papelera, recuperable, para que no se confundan al enviar.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-24)
- «Te la dejé abierta en Finder.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-24)
- «That path is not a file or folder inside this session's folders» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-23)

**Video: dos archivos y no borrar entregas** (L-B-10)
- «dejalo en un drive en mi correo» — ventana [[2026-10-01-mejora-de-video-en-artefactos|mejora de video en artefactos]] (transcrito `5f2b61e1`, 2026-10-01)
- «no prepares copias. dame uno con la mejor calidad y uno liviano, dejalos aqui en la mac» — ventana [[2026-10-01-mejora-de-video-en-artefactos|mejora de video en artefactos]] (transcrito `5f2b61e1`, 2026-10-15)
- «Entendido: nada de Drive. Te dejo dos archivos en la Mac» — ventana [[2026-10-01-mejora-de-video-en-artefactos|mejora de video en artefactos]] (transcrito `5f2b61e1`, 2026-10-01)
- «720×1280, para WhatsApp» — ventana [[2026-10-01-mejora-de-video-en-artefactos|mejora de video en artefactos]] (transcrito `5f2b61e1`, 2026-10-01)
- «Al empacar borré la prueba de 10 s del Escritorio sin preguntarte.» — ventana [[2026-10-01-mejora-de-video-en-artefactos|mejora de video en artefactos]] (transcrito `fc142d00`, 2026-10-18)

**Tres sitios para «aplicado»** (L-D-09)
- «para poder ver los cambios tengo que hacer el push desde mi pc» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-09-01)
- «el push ya está hecho… Lo que tu PC necesita no es push sino pull» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-09-01)
- «de igual forma quiere decir que ya se aplicaron los cambios que te pedi?» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-09-01)
- «aplicado» tiene tres lugares distintos en tu operación — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-09-01)

**Qué quedó y qué no** (L-F-02)
- «aplicaste todas las mejoras de las que hablaste?» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)
- «Igual debí decírtelo claramente al entregarlo.» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)
- «Los precios son inventados como referencia; que no los use para cotizar.» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)

Memorias del dueño: `memoria/feedback_escritorio_por_proyecto.md`,
`memoria/feedback_lo_que_falta_se_anuncia.md`, `memoria/feedback_ayuda_por_perfil.md`.

## Enlaces

- [[TEMA-como-pide-el-dueno]] — cómo leer lo que pide antes de entregar.
- [[TEMA-huecos-del-dueno]] — cuando lo que falta es un dato suyo.
- [[TEMA-documentos-para-personas]] — el documento para un lector concreto.
- [[TEMA-cero-datos-inventados]] — rotular lo que es ejemplo.
- [[TEMA-imprenta-desde-html]] — las piezas que van a imprenta.
