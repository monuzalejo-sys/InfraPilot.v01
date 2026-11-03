---
slug: ventanas-por-cliente
titulo: Las ventanas de un cliente nuevo — seis por tema, mensaje de arranque literal y cómo se abren
alias: [ventanas por cliente, ventanas del cliente, seis ventanas, 6 ventanas, ventana por tema, una ventana un tema, ventanas de contexto, seccion del cliente, seccion en la barra, seccion propia, molde que cremoso, molde cremoso, igual que cremoso, igual que mercaplaza, mensaje de arranque, prompt de ventana, arranque de ventana, ventanas.md, docs/ventanas.md, que NO va aqui, no es villa broaster, notas compartidas, carpeta de notas, side-session-notes, start_session, detach, detach_session, move_sessions, ventana anidada, sesion anidada, nested sessions, abrir ventanas, crear ventanas, ventanas nuevas, ventana mezclada, sesion mezclada, cmd /model, subir a opus, sonnet para leer, estado y plan, videos animados, videos reales, nuevos proyectos y sus secciones, empresa nueva, cliente nuevo ventanas]
preguntas: ["¿cómo abro las ventanas de un cliente nuevo igual que como se hizo con Qué Cremoso?", "¿qué le pongo a una ventana nueva para que no empiece preguntando qué es el cliente?", "¿por qué no puedo mover las ventanas a la sección del cliente?", "le pedí a otra ventana que abriera las ventanas y se quedó parada, ¿qué pasó?", "¿en qué modelo arrancan las ventanas de un cliente y cuándo las subo a Opus?", "esta ventana ya mezcló varios temas, ¿la sigo usando o abro otra?"]
proyectos: [que-cremoso, la-villa, mercaplaza, orion]
confianza: alta
actualizado: 2026-11-02
---

# Las ventanas de un cliente nuevo — seis por tema, mensaje de arranque literal y cómo se abren

## Respuesta corta

1. Por cliente nuevo, abre una **sección propia y seis ventanas, cada una con un solo tema** (estado y plan, sistema, vitrina, marca, videos animados, videos reales).
2. **Escribe el mensaje de arranque en `docs/ventanas.md` y envíalo tal cual**: quién es el cliente y las otras ventanas, «responder siempre en español», «NO es X» si hay nombre parecido, qué leer en orden y «NO construyas: confirma en 3-4 líneas qué falta y espera».
3. Pídelas **DIRECTO** desde una sesión con `start_session`, sin delegarlas por mensaje; suéltalas (`detach_session`) y solo entonces muévelas a la sección.

## Por qué (qué lo pagó)

- El dueño lo pidió dos veces con las mismas palabras: Qué Cremoso (31-oct: «separada en ventana con las ventanas de
  contexto correspondiente como los demas clientes») y La Villa (2-nov: «quiero que crees todas las ventanas de
  trabajo igual que cremoso para la villa»). Cuando una sola ventana lleva plan, caja, vitrina y videos, el contexto
  se llena de lo que no se está haciendo y las decisiones de un tema se pierden entre las de otro.
- **El mensaje literal funciona**: las 6 ventanas de Qué Cremoso (31-oct) y las 5 nuevas de La Villa (2-nov)
  confirmaron su tema, pidieron solo lo que faltaba y no construyeron nada. La ventana de «estado y plan» de La Villa
  encontró sola que las cifras no coinciden (91 frente a 104/108 tareas). La marca de Qué Cremoso dejó su decisión en la
  nota hermana (Ciudad Blanca, copa con cereza, cerrada el 2-nov) y la ventana de vitrina la leyó al arrancar en vez de preguntar.
- **Pedirlas directo tardó minutos; delegarlas no terminó en horas.** Directo: Qué Cremoso completo (repo, 9 huecos, memoria,
  sección y 6 ventanas) en unos 4 minutos (15:48 → 15:52 del 31-oct); las 5 de La Villa en unos 100 segundos con
  memoria y commit (20:12:03 → 20:13:41 del 2-nov). Delegado: la ventana «sistema» de La Villa se las encargó a
  «Nuevos proyectos y sus secciones» a las 18:13 y a las 18:18 llevaba cinco minutos parada esperando un permiso
  (casi seguro el de abrir sesiones) que nadie veía; después el clasificador y el flujo de permisos rechazaron `start_session`
  y seguían sin abrirse hasta que el dueño las pidió a las 20:12 a otra ventana («Ventanas de trabajo para villa»), que las abrió en ~100 s;
  la ventana «Nuevos proyectos» nunca las abrió: el clasificador rechazó su `start_session`.
- **Anidadas se archivan con su padre**: las ventanas que abre «Nuevos proyectos y sus secciones» nacen anidadas bajo
  ella; `move_sessions` falla con «nested sessions move with their parent». Sin `detach_session` previo, la sección del
  cliente se llenaría de ventanas que se archivan cuando se archiva la sesión madre.
- **La sesión mezclada**: la ventana del ecosistema empezó con el catálogo y siguió con La Villa; al crear la sección la
  sesión misma advirtió «esta sesión mezcla dos temas» y acabó titulada «La Villa · sistema» tras cinco temas y dos
  compactaciones: un contexto lleno de lo ajeno.

## Cómo se aplica

1. **Antes de abrir nada**, en el repo del cliente: `docs/ventanas.md` con una tabla «qué va ahí / qué NO va ahí» por
   ventana y el mensaje de arranque literal de cada una. La misma tabla en el README y el id de la sección en el brief
   de memoria. (Receta completa del alta de una empresa: repo + huecos, memoria validada, correo, carpeta en el escritorio, sección y ventanas.)
2. **El mensaje de arranque tiene tres bloques**:
   - *Contexto*: quién es el cliente, cuáles son las otras cinco ventanas, «responder siempre en español», y el «NO es X»
     cuando hay riesgo de confusión (La Villa **no** es Villa Broaster).
   - *Tarea*: «eres la ventana X; tu tema es…; lee en este orden…; aquí solo va…; NO construyas: confirma en 3-4 líneas
     qué falta y espera; si llega otro tema, avisa y manda a su ventana».
   - *Notas compartidas*: la carpeta de notas del grupo, para que lo que decide una ventana lo lea la hermana.
3. **Ábrelas desde la sesión que tenga `start_session`** (no todas la tienen). Si la tuya no la tiene, **deja todo escrito
   y que el dueño abra las ventanas con un clic**; no encargues a otra ventana por mensaje.
4. **Orden de operaciones**: abrir → `detach_session` a cada una → `move_sessions` a la sección → comprobar que la
   barra las muestra bajo el cliente.
5. **Modelo**: nacen en Sonnet porque solo leen y esperan. Cuando el dueño empieza el diseño de esa ventana, él corre
   `/model` y la sube a Opus (ejemplo: la ventana de marca de Qué Cremoso quedó en `claude-opus-5-5` el 2-nov).
6. **Si el tema de una ventana cambia**, abre una nueva o renombra la existente en vez de seguir acumulando contexto
   ajeno.

## Cuándo NO aplica

- **Cliente de una sola ventana** o un cliente pequeño sin vitrina, marca ni videos: no abras las seis por costumbre.
- **Trabajo que continúa en una ventana que ya tiene el contexto cargado**: no la cierres para reabrirla con el molde.
- **Sesión que sí tiene `start_session` y el dueño autorizó en ese mismo turno**: ábrelas tú mismo sin intermediarios;
  la regla de «directo» no pide ceremonia extra.
- Las seis ventanas son un molde, no un dogma: Mercaplaza usa cuatro ventanas (videos animados, videos reales, sistema y
  vitrina) porque «Clientes» quedó vacía; adáptalo al cliente.

## Evidencia

- «separada en ventana con las ventanas de contexto correspondiente como los demas clientes» — ventana [[2026-10-31-nuevos-proyectos-y-sus-secciones|Nuevos proyectos y sus secciones]] (transcrito `69d97ed6`, 2026-10-31)
- «confirma en pocas líneas qué tema le toca y se queda esperando al dueño, sin construir nada» — ventana [[2026-10-31-nuevos-proyectos-y-sus-secciones|Nuevos proyectos y sus secciones]] (transcrito `69d97ed6`, 2026-10-31)
- «nested sessions move with their parent» (error de `move_sessions`, 15:50) — misma ventana (`69d97ed6`, 2026-10-31)
- «quiero que crees todas las ventanas de trabajo igual que cremoso para la villa» y «lee lo suyo, confirma en pocas líneas qué le toca y espera tus instrucciones» — ventana [[2026-11-02-ventanas-de-trabajo-para-villa|Ventanas de trabajo para La Villa]] (transcrito `ac13a4f2`, 2026-11-02)
- «La marca quedó cerrada el 2-nov (Ciudad Blanca, copa con cereza)» — ventana [[2026-10-31-que-cremoso-vitrina|Qué Cremoso · vitrina]] (transcrito `6f3a4ef7`, 2026-11-02)
- «[cmd /model] claude-opus-5-5» — ventana [[2026-10-31-que-cremoso-marca|Qué Cremoso · marca]] (transcrito `72ffaa4c`, 2026-11-02)
- «lleva cinco minutos parada esperando a que usted le conteste» y «esta sesión mezcla dos temas» — ventana [[2026-09-09-la-villa-sistema|La Villa · sistema]] (transcrito `129e1026`, 2026-11-02 y 2026-10-28)
- Memoria del dueño: `feedback_ventanas_por_tema.md` y `project_receta_proyecto_nuevo.md` (en `~/.claude/projects/-Users-g-orion/memory/`).

## Enlaces

- [[TEMA-marca-de-un-cliente-nuevo]] — qué hace la ventana de marca cuando abre.
- [[TEMA-huecos-del-dueno]] — lo que cada ventana pide al dueño, en una sola lista numerada.
- [[TEMA-varias-ventanas-mismo-repo]] — cuando las ventanas comparten repo: commits con rutas, ramas y PID.
- [[TEMA-piloto-con-cliente-real]] — de la ventana de sistema al uso real.
- [[TEMA-modelos-y-costos]] — por qué se arranca en Sonnet y se sube a Opus solo para diseñar.
