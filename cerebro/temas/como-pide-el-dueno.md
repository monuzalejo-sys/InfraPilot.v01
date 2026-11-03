---
slug: como-pide-el-dueno
titulo: Cómo pide el dueño y cómo se lee su mensaje (tarea, pregunta o tema)
alias: [como pide el dueno, como habla el dueno, leer el mensaje, interpretar el pedido, tareas no prompts, tareas no prompt, no estoy promteando, no estoy prompteando, loopear, hacer loop, lista de tareas, hazlo todo, ejecuta todo antes de responder, varias cosas en un mensaje, no me preguntes, sin preguntar, elige la mejor, es pregunta, solo era pregunta, espera solo era pregunta, pregunta no es orden, que te parece, como la ves, que mejoras identificas, evalua mi idea, opinion, no construyas todavia, ahora quiero que trabajemos en, el tema no la tarea, me adelante, no lances trabajo, creo que me dijo, me comento una conocida, validar con la fuente, mensaje como si fuera yo, mensaje para whatsapp, malentendido del pedido, guion de comandos, comandos dictados, antes de correr los comandos, repository not found, repo privado, no existe el repo, cascaron, repo vacio, extension de chrome, claude in chrome, hazlo tu, miralo tu mismo, no me dictes comandos, hpanel, confirm access, rechazo no se rodea, no se lo pidas a otra ventana, clasificador, rodear el permiso, hablame en espanol, en ingles, respondeme en espanol, apunta todo lo que te diga, apuntar todo]
preguntas: ["Oye, cuando te mando varias cosas en un mismo mensaje, ¿por qué no las haces todas antes de contestarme en vez de ir preguntando?", "Si le pregunto cómo ve mi idea, ¿por qué el agente se pone a construir?", "Cuando el dueño solo me dice «ahora trabajemos en tal proyecto», ¿arranco a trabajar o espero el encargo?", "Una conocida me contó algo que le serviría y no me acuerdo bien qué era: ¿lo armo ya o le pregunto primero?", "Te pegué unos comandos de git para sincronizar todo: ¿por qué no los corriste tal cual?", "Te dije que mi repo existe y tú dices que no lo encuentras, ¿cómo puede ser?", "Tengo la extensión de Chrome conectada: ¿puedes hacerlo tú directo en el panel y en GitHub?", "Me bloquearon el push o abrir ventanas, ¿se lo pido a otra ventana o qué hago?", "¿Por qué me estás escribiendo en inglés si te dije que en español?"]
proyectos: [orion, duo-burguer, la-villa, mercaplaza, que-cremoso, cerebro-3d, plantillas-arquitectura]
confianza: alta
actualizado: 2026-11-02
---

# Cómo pide el dueño y cómo se lee su mensaje (tarea, pregunta o tema)

## Respuesta corta

1. Clasifica por el **verbo**: imperativo o lista de puntos = tareas; hazlas todas en el mismo turno, elige la mejor alternativa y justifícala después; informa lo hecho, lo verificado y lo no hecho.
2. Pregunta («cómo la ves», «qué te parece») = evaluación: responde con criterio y espera su «hazlo»; no construyas ni lances agentes.
3. Solo nombra el proyecto = es el tema: lee estado barato, resume y pregunta qué hacemos.
4. Lo que contó un tercero no es pedido: valídalo con la fuente. Lo que él decide, acátalo sin rodearlo.

## Por qué (qué lo pagó)

El dueño maneja varias empresas y su tiempo es el recurso escaso: cada vez que una
ventana confunde el tipo de mensaje le cuesta reenviar, frenar o rehacer.

- **Tareas tratadas como conversación.** El 2026-08-01 lo dijo con estas palabras
  («no estoy promteando, estoy dando tareas») y el 08-03 reenvió el mismo mensaje
  tras un corte de conexión a media respuesta; Claude retomó lo pendiente («me
  faltaban tres tareas») sin pedirle que repitiera. Quedó como memoria de feedback
  (`memoria/feedback_tareas_no_prompts.md`).
- **Tema tomado por tarea.** El 09-09, tras «ahora quiero que trabajemos en duo
  burguer», se lanzó un análisis con subagente y se creó una carpeta de memoria
  nueva; Claude frenó («eso era el tema, no la tarea») y la dejó sin commitear. El
  encargo real (un corto de 15 a 20 s) llegó una hora y cuarto después.
- **Pregunta tomada por orden.** En el cerebro 3D, a «qué mejoras identificas» se
  contestó con 20 ítems sin construir y él respondió «quiero que apliques las 20»:
  su protocolo es preguntar, decidir y ordenar. En la app de rutina aclaró «es
  pregunta» a media sesión. En plantillas de arquitectura, tras «¿lo podemos hacer
  escalable?» Claude creó un archivo y el dueño lo frenó («espera solo era
  pregunta»).
- **Pedido de oídas.** El encargo nació de «creo que me dijo…» de una estudiante; se
  construyó un Excel de cuadro de áreas (un día de trabajo) y al contestar ella
  quería un cuadro de costo y presupuesto. Lo destapó el mensaje «como si fuera yo»
  que el propio dueño pidió.
- **Guion dictado contra realidad.** El 08-31 el guion asumía una carpeta y un repo
  por proyecto; en la máquina había UN repo con origen funcional y los destinos no
  existían. Correrlo habría dejado el origen en URLs muertas.
- **«No existe» dicho sin mirar la cuenta.** Claude le dijo dos veces que el repo no
  existía (verificado con las credenciales de la otra cuenta); era privado y el
  dueño tenía razón. Costó ~1 h.

## Cómo se aplica

1. **Clasifica** el mensaje: ¿verbo de orden o lista? → tareas. ¿Interrogativo o
   «dime qué piensas»? → evaluación. ¿Solo un nombre de proyecto? → tema.
2. **Tareas:** haz el loop completo antes de responder. Entre alternativas elige la
   mejor y justifícala después; pregunta solo lo que únicamente él sabe y cambia el
   tamaño del trabajo. Si el mensaje se reenvía por un corte, retoma lo pendiente.
   Cierra con hecho / verificado / no hecho.
3. **Evaluación:** qué está bien, dónde se fue rápido, qué falta, y termina en la
   decisión que le toca a él. Ni agentes ni código hasta su «aplícalas» / «hazlo».
4. **Tema:** lee memoria, repos y cerebro (barato), contesta con lo que sabes, pregunta
   qué hacemos. No crees carpetas ni lances análisis.
5. **Pedido de oídas:** no construyas. Dale un mensaje corto, en su voz y listo para
   pegar en WhatsApp: qué es exactamente, en qué programa lo hacen, para qué lo usan,
   qué es lo tedioso, cuánto pagarían. Las preguntas técnicas, en un segundo mensaje.
   Lo copia y manda él, nunca Claude.
6. **Comandos o guion que él dicta:** `ls` de las rutas, `git remote -v`,
   `git ls-remote` del destino y `git status` antes de correr. Si el guion supone algo
   que no es, no lo ejecutes ni cambies un origen que responde. Sin remoto aún:
   commits locales + `git bundle` verificado; para borrar, a la Papelera sin vaciar.
7. **Si él dice que algo existe y tú no lo ves**, un «Repository not found» es privado
   o inexistente (desde fuera no se distinguen): mira tu autenticación
   (`gh auth status`, `gh repo list`) antes de contradecirlo. Y antes de prometer
   «abrir un local» de un proyecto, mide qué trae el clon (`ls`,
   `git log --oneline | wc -l`): varios repos de la cuenta eran cascarones con solo el
   «Initial commit» y el código real vivía en el PC.
8. **Con la extensión de Chrome conectada, hazlo tú:** lee su terminal, crea los
   registros DNS, da de alta llaves públicas de despliegue de solo lectura; no le
   dictes comandos. Los clics de pago o compra, de crear o abrir un firewall y el
   «Confirm access» de GitHub son suyos: llévalo a la pantalla exacta y dile el clic.
   Si el sistema bloquea la consola root, dilo y reintenta más estrecho cuando él
   insista. Comprueba antes que la extensión esté conectada.
9. **Un rechazo no se rodea:** si él o el clasificador rechazan una acción (abrir
   sesiones, push), no la repitas por otra vía ni se la pidas a otra ventana. Deja
   hecho lo local (commit, el arranque escrito en un archivo), nombra los commits sin
   publicar con su id, da el comando exacto y ofrece las dos salidas: que lo diga en el
   chat o que lo haga él. Una investigación que solo contesta una pregunta se guarda
   en local; no se publica sin que se pida. (Qué hacer con lo que el rechazo dejó a
   medias: [[TEMA-rechazado-no-es-no-ejecutado]].)
10. **Español con él, siempre:** también los avisos de progreso entre herramientas y lo
    que sigue a una compactación. Código, nombres de archivo y comandos pueden ir como
    estén.
11. **«Apunta todo lo que te diga»** (pedido del 2026-09-23): cada regla, decisión o
    dato de negocio que dicte va a `apuntes`, la plata a `movimientos`; confirma en una
    línea qué quedó apuntado y no completes montos que no dio
    (`memoria/feedback_apuntar_todo.md`).
12. **Visión grande dictada: guárdala entera y construye solo el paso que toca.** Cuando el
    dueño suelta la idea completa (campañas, apagado automático, otra plataforma), escríbela en
    `docs/vision.md` del proyecto y sigue con el paso en curso; él lo pidió así: *«quiero que
    guardes mi idea y que vayamos por pasos, ahora estamos en el inicio apenas»*.

## Cuándo NO aplica

- **«Tareas, no prompts» no es licencia para todo.** Si la acción es irreversible o
  cuesta plata (borrar sin respaldo, force-push, comprar, pagar), se confirma antes.
- **Preguntar o ejecutar lo separa el verbo, no el tono.** Mensaje con verbos de orden
  o lista: se ejecuta sin preguntar. Mensaje con «has visto…», «te parece…», «es
  pregunta»: se evalúa. Si el cliente es nuevo y solo hay nombre y rubro, ver
  [[TEMA-huecos-del-dueno]].
- **Pedido de oídas:** no aplica si el dueño ya describió el producto con precisión, ni
  cuando construirlo cuesta minutos y sirve de pregunta (entonces se entrega rotulado
  como hipótesis).
- **Guion dictado:** los comandos que solo leen no necesitan el contraste. Si
  `gh auth status` ya muestra la cuenta dueña y aun así da 404, el nombre o la ruta
  puede estar mal: confírmalo con él.
- **Chrome:** si la extensión no está conectada (el 31-ago no lo estaba; el 9-sep sí), o
  la acción mueve plata, cambia seguridad o maneja credenciales, el clic es suyo aunque
  lo pida. Ver [[TEMA-claves-cuentas-y-secretos]].
- **Rechazo:** si vino de un fallo técnico (AbortError, el flujo de permisos se cerró)
  y el dueño dice que reintentes, se inspecciona el estado y se reintenta.
- **Idioma:** si él pide expresamente otro idioma.

## Evidencia

**Tareas, no prompts** (L-D-01)
- «cuando te de tareas tienes que loopear, no estoy promteando, estoy dando tareas» — ventana [[2026-07-28-estructura-anthropic-para-arnes-y-flujo-de-trabajo|estructura anthropic para arnes y flujo de trabajo]] (transcrito `0f0c7084`, 2026-08-01)
- «Instrucciones recibidas como tareas. Ejecuto las cinco sin volver a consultarte.» — ventana [[2026-07-28-estructura-anthropic-para-arnes-y-flujo-de-trabajo|estructura anthropic para arnes y flujo de trabajo]] (transcrito `0f0c7084`, 2026-08-01)
- «Retomo donde quedé — me faltaban tres tareas.» — ventana [[2026-07-28-estructura-anthropic-para-arnes-y-flujo-de-trabajo|estructura anthropic para arnes y flujo de trabajo]] (transcrito `0f0c7084`, 2026-08-03)
- Memoria del dueño: `memoria/feedback_tareas_no_prompts.md`.

**Solo nombra el proyecto = tema** (L-A1-18)
- «ahora quiero que trabajemos en duo burguer» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-09)
- «Tienes razón, freno. Me adelanté: eso era el tema, no la tarea.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-09)
- «Lo único que dejé escrito es una carpeta nueva, `memory/duo-burger/`, sin commitear.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-09)

**Pregunta de opinión: evalúa y no construyas** (L-G-15)
- «primero quiero que me digas que potencial le ves y que tanta competencia hay» — ventana [[2026-10-22-orion-app-de-rutina-sincronizada|orion app de rutina sincronizada]] (transcrito `251100b4`, 2026-10-22)
- «es pregunta» — ventana [[2026-10-22-orion-app-de-rutina-sincronizada|orion app de rutina sincronizada]] (transcrito `251100b4`, 2026-10-22)
- «antes dime que te parecio mi idea y mi forma de adaptarme a los muros que me pusiste» — ventana [[2026-10-22-orion-app-de-rutina-sincronizada|orion app de rutina sincronizada]] (transcrito `b5eb380b`, 2026-10-22)
- «que mejoras identificas» — ventana [[2026-10-19-prototipo-web-de-cerebro-3d-interactivo-con-enferm|prototipo web de cerebro 3d interactivo con enferm]] (transcrito `71c5f9e6`, 2026-10-19)
- «quiero que apliques las 20 mejoras» — ventana [[2026-10-19-prototipo-web-de-cerebro-3d-interactivo-con-enferm|prototipo web de cerebro 3d interactivo con enferm]] (transcrito `71c5f9e6`, 2026-10-19)

**Pedido de oídas: valida con la fuente** (L-F-01)
- «okey si quiero que hagamos la 1, lo podemos hacer escalable?» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)
- «espera solo era pregunta» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)
- «me comento que habria mucha demanda para algo asi como plantillas creo que me dijo» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)
- «quiero que me des un mensaje natural explicando lo que necesito de ella como si fuera yo jaja» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)
- «ya me explico lo que era y no era lo que hicimos jaja» — ventana [[2026-10-19-mercado-de-plantillas-arquitectura|mercado de plantillas arquitectura]] (transcrito `007a9e6f`, 2026-10-19)

**Guion dictado contra estado real** (L-D-05)
- «No existe /Users/g/ORION. Busco dónde están realmente esos proyectos» — ventana [[2026-08-31-sincronizar-orion-y-proyectos|sincronizar orion y proyectos]] (transcrito `71802505`, 2026-08-31)
- «No ejecuté la sincronización: los repos destino no existen en GitHub» — ventana [[2026-08-31-sincronizar-orion-y-proyectos|sincronizar orion y proyectos]] (transcrito `71802505`, 2026-08-31)
- «reemplazar el origin funcional por URLs muertas habría dejado el repo roto sin sincronizar nada» — ventana [[2026-08-31-sincronizar-orion-y-proyectos|sincronizar orion y proyectos]] (transcrito `71802505`, 2026-08-31)
- «no he creado orion, quiero que guardes los proyecos» — ventana [[2026-08-31-sincronizar-orion-y-proyectos|sincronizar orion y proyectos]] (transcrito `71802505`, 2026-08-31)
- «Bundles verificados con el historial completo de los 5 repos» — ventana [[2026-08-31-sincronizar-orion-y-proyectos|sincronizar orion y proyectos]] (transcrito `71802505`, 2026-08-31)

**«Repository not found» y repos cascarón** (L-D-06)
- «lo verifiqué hoy: ninguna de tus dos cuentas tiene ese repo» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-08-31)
- «pero ya tienes acceso al repo por que no puedes hacer arreglos?» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-08-31)
- «pero tengo abierto el git en aplicacion y el git en navegador aqui en la mac» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-08-31)
- «Y tenías razón desde el principio: el repo sí existía — era privado» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-08-31)
- «El repo wrdrepo está vacío — un cascarón con solo el ‘Initial commit’» — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|sincronizar orion y proyectos fork]] (transcrito `630e0fde`, 2026-08-31)

**Con Chrome conectado, hazlo tú** (L-D-19)
- «tengo la extension de chrome hazlo» — ventana [[2026-09-08-sistema-de-villa-orion|sistema de villa orion]] (transcrito `f7689b06`, 2026-09-09)
- «miralo tu mismo» — ventana [[2026-09-08-sistema-de-villa-orion|sistema de villa orion]] (transcrito `f7689b06`, 2026-09-09)
- «quiero que lo hagas» — ventana [[2026-09-08-sistema-de-villa-orion|sistema de villa orion]] (transcrito `f7689b06`, 2026-09-09)
- «el clic que cambia el firewall y el que confirma la compra los das tú» — ventana [[2026-09-08-sistema-de-villa-orion|sistema de villa orion]] (transcrito `f7689b06`, 2026-09-09)
- «esa línea no la cruzo aunque me lo pidas» — ventana [[2026-09-08-sistema-de-villa-orion|sistema de villa orion]] (transcrito `f7689b06`, 2026-09-09)

**Un rechazo no se rodea** (L-E-11)
- «The user doesn't want to take this action right now.» — ventana [[2026-10-31-nuevos-proyectos-y-sus-secciones|nuevos proyectos y sus secciones]] (transcrito `69d97ed6`, 2026-11-02)
- «Que otra ventana me lo pida no cambia tu decisión, así que te lo dejo a ti.» — ventana [[2026-10-31-nuevos-proyectos-y-sus-secciones|nuevos proyectos y sus secciones]] (transcrito `69d97ed6`, 2026-11-03)
- «[Out-of-Place Publication]» — ventana [[2026-09-09-la-villa-sistema|la villa sistema]] (transcrito `129e1026`, 2026-11-02)
- «Blocked by classifier.» — ventana [[2026-09-09-la-villa-sistema|la villa sistema]] (transcrito `129e1026`, 2026-09-09)

**Español, también en los avisos** (L-A2-22)
- «Now I'll write the new front and back in the generator.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-10-03)
- «Perdón, sigo en español.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `7f456016`, 2026-10-23)
- «(twice: respond in Spanish)» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `7f456016`, 2026-10-24)
- Según el resumen de compactación del 24-oct el dueño pidió «español» dos veces; el
  tema no trae la frase literal suya, solo la respuesta de Claude.

**Apuntar todo:** `memoria/feedback_apuntar_todo.md` (pedido del 2026-09-23).

**Visión por pasos:** «quiero que guardes mi idea y que vayamos por pasos, ahora estamos en el
inicio apenas, quiero que terminemos el bot con la base de datos» — ventana
[[2026-10-19-dropshipping-con-flujo-n8n|Dropshipping con flujo N8N]] (transcrito `00af789e`, 2026-10-20).

## Enlaces

- [[TEMA-como-entregar-al-dueno]] — la otra mitad: cómo se le devuelve el trabajo.
- [[TEMA-huecos-del-dueno]] — qué hacer cuando falta un dato suyo.
- [[TEMA-rechazado-no-es-no-ejecutado]] — una herramienta rechazada pudo hacer la mitad.
- [[TEMA-caza-de-huecos-de-mercado]] — validar con la fuente antes de construir un nicho.
- [[TEMA-cero-datos-inventados]] — lo que no dio, no se completa.
- [[TEMA-claves-cuentas-y-secretos]] — lo que nunca se hace por él aunque lo pida.
- [[TEMA-varias-ventanas-mismo-repo]] — cuando otra ventana te pide algo.
- [[TEMA-gusto-visual-del-dueno]] — cómo juzga lo que ve.
