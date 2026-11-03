---
slug: varias-ventanas-mismo-repo
titulo: Varias ventanas (o dos máquinas) sobre el mismo repo — commits con rutas, ramas, PID y órdenes escritas
alias: [varias ventanas mismo repo, otra sesion, otra ventana, ventanas paralelas, nos pisamos, pisar archivos, staging compartido, commit con rutas explicitas, git commit -- ruta, git add -A, git add -a, commitear solo lo mio, no toques sus archivos, orion compartido, arbol compartido, pkill, matar por pid, kill por pid, fork de la conversacion, copia de la conversacion, arranca el bloque, ya estaba hecho, bloque ya hecho, orden al pc, orden para el pc, mensaje al pc, ORDEN-PC, ventana del pc, issue de github, coordinar mac y pc, archivos sin commitear, sin commitear, git status sucio, trabajo ajeno en el arbol, dos ventanas a la vez, archivos preparados de otra ventana]
preguntas: ["hay otra ventana trabajando en este repo: ¿cómo hago commit sin llevarme sus archivos?", "¿puedo matar lo que está corriendo sin tumbar la otra ventana?", "me pidieron arrancar un bloque: ¿cómo sé que no está ya hecho o que otra ventana no lo está haciendo ahora?", "¿cómo le mando una orden clara a la ventana del PC si desde la Mac no puedo escribirle?", "el repo tiene un montón de archivos sin commitear, ¿hago git add -A?", "¿cómo coordino dos ventanas que tocan un proyecto a la vez?"]
proyectos: [orion, duo-burguer, mercaplaza, wrd, bot-recolector-prommter]
confianza: alta
actualizado: 2026-11-02
---

# Varias ventanas (o dos máquinas) sobre el mismo repo — commits con rutas, ramas, PID y órdenes escritas

## Respuesta corta

1. **Nunca `git add -A` ni `git commit -a`**: el árbol es compartido; commitea con rutas explícitas (`git commit -m "…" -- ruta1 ruta2`).
2. Antes de un bloque lee `git log` y `git status`: si hay archivos o migraciones que no escribiste, **otra sesión está en lo mismo: para sin cambiar nada y pregunta cuál lo termina**.
3. **Mata procesos solo por PID exacto**, nunca por nombre (`pkill`).
4. Si la otra ventana está en otra máquina, deja la orden numerada en el repo, con un issue y un mensaje para el dueño.

## Por qué (qué lo pagó)

- **Commit ajeno casi se cuela (24-sep, Duo Burguer / orion).** Al commitear la memoria en orion, el índice traía cuatro
  archivos preparados por la otra sesión; el commit llevó solo los dos propios y desde ahí se commitea con rutas
  explícitas, como pidió la otra sesión. El árbol de orion se comparte entre ventanas.
- **Árbol sucio permanente.** El 9-sep una ventana vio «200 archivos sin commitear» de la migración de rutas Windows→Mac;
  el 2-nov seguía así (la nota del lote contaba 145 entradas modificadas sin commitear desde entonces, y hoy `git status`
  muestra más de 200 porque encima escriben otras ventanas). Con un `git add -A` se habría metido trabajo ajeno en el commit propio.
- **`pkill` por nombre (16-oct, Mercaplaza).** Un `pkill` de `chrome-headless-shell` pudo haber matado el render de otra ventana
  (la de Duo) que usaba el mismo programa; desde ahí «solo detengo procesos por su PID».
- **Dos ventanas, mismos archivos (26-oct).** La ventana del sistema de WRD (la sesión se titula «Sistema orion pulido») avisó que otra ventana («Vitrina interactiva y
  visual») estaba trabajando justo en la tienda y que esos archivos eran suyos y su commit no los iba a incluir.
- **Bloque ya hecho / hecho en paralelo (24-oct y 2-nov, bot recolector de Prommter).** El dueño pidió «arrancar el 0.2» y git ya
  tenía el 0.2, 0.3 y 0.4 desde agosto, con el CLAUDE.md diciendo que solo había docs: se comprobó en verde y se corrigió el
  estado en vez de rehacer. Días después, al decir «arranca 0.5» en la copia (fork) de la conversación, la sesión original
  ya había escrito el esquema de Prisma y una migración sin aplicar; seguir habría pisado los mismos archivos y la misma base.
  Se paró sin cambiar nada y se preguntó qué sesión lo terminaba.
- **La otra ventana está en otra máquina (15-sep).** El dueño fijó «el pc es el sistema, tú eres la vitrina» y pidió que la
  Mac pusiera a trabajar al PC, pero desde la Mac su ventana no aparece. La orden se dejó en el repo y en un issue de GitHub
  con seis pasos (CI en rojo, rutas de la tienda, evento, día de entrega, publicar, costeo). Arrancó tarde (a las 21:10 todavía no
  había empezado), pero siete días después el PC pasó de 88 a 262 de 330 tareas con la revisión automática en verde.
- **Otra ventana curó y commiteó la memoria a mitad de una cosecha (03-nov, 04:39 UTC).** Mientras los escritores de la
  cosecha de ventanas tenían editada la memoria de ORION, la ventana «Orion: app de rutina sincronizada» cerró su
  sesión: su curador reescribió esa memoria y su commit (`7fe4d35`, «memoria orion: curación») se llevó también lo que
  había dejado la cosecha, bajo un mensaje ajeno. No se perdió nada porque el curador leyó el archivo ya editado; si lo
  hubiera leído antes, habría borrado ese trabajo sin aviso. Por eso: lee la memoria fresca justo antes de guardarla
  (leer, cambiar y guardar en un solo paso, nunca desde una copia de hace una hora) y mira `git log` antes de tu commit.

## Cómo se aplica

1. **Antes de cada commit**: `git status` y `git diff --cached --stat`. Si hay staged que no es tuyo, no lo toques:
   `git commit -m "…" -- <tus rutas>`. Nada de `git add -A`, `git add .`, `git commit -a`.
2. **Avísale a la otra sesión** cuáles rutas son tuyas; si el árbol lleva días sucio, dilo al dueño (el trabajo suelto lo
   puede pisar cualquier ventana).
3. **Rama propia** que no se solape en archivos con la de la otra ventana; confirma explícitamente qué archivos toca cada una antes de publicar.
4. **Procesos**: `pgrep`/`ps` para ver el PID que lanzaste tú y `kill <PID>`; ni `pkill` ni `killall` por nombre.
5. **Al recibir «arranca el bloque X»**: `git log --oneline -15`, `git status`, hora de los archivos (`ls -lt`). Tres desenlaces:
   ya está hecho (verifica y corrige el estado), lo hace otra sesión ahora (para y pregunta), o es tuyo (arranca). En una
   copia de conversación esto vale doble: el original sigue vivo.
6. **Orden a otra máquina/ventana que no alcanzas**: `docs/ORDEN-PC-<fecha>.md` con tareas **numeradas por prioridad**,
   un issue de GitHub que lo enlace y un mensaje corto para que el dueño lo pegue allá. **Mide su avance en su plan (tareas
   hechas sobre total), no en su palabra.**
7. Para sincronizar Mac y PC sin intermediarios, ver la memoria `project_publicacion_automatica_mac_pc.md` (hook de sincronizar en Duo Burguer).

## Cuándo NO aplica

- **Eres la única sesión con cambios** en ese árbol (compruébalo con `git status`): un commit normal basta.
- **Tú lanzaste los agentes paralelos y les repartiste archivos propios**: ahí manda el reparto de [[TEMA-olas-de-agentes]], no esta regla.
- **Tienes un canal directo comprobado hacia la otra ventana**: úsalo además; la orden escrita en el repo igual queda como fuente y nunca sobra.
- Si ya confirmaste que no hay ninguna otra sesión activa sobre el repo, el cuidado extra con `pkill` no hace falta.

## Evidencia

- «Mi commit en orion solo llevó mis dos archivos de memoria; los cuatro preparados son de la otra sesión.» y «De aquí en adelante commiteo en orion con rutas explícitas.» — ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `51184930`, 2026-09-24)
- «hay 200 archivos sin commitear de trabajo anterior» — ventana [[2026-09-09-la-villa-sistema|La Villa · sistema]] (transcrito `129e1026`, 2026-09-09)
- «el pkill de chrome-headless-shell pudo haber tocado otro proceso igual si la ventana de Duo lo estaba usando. De aquí en adelante solo detengo procesos por su PID» — ventana [[2026-10-15-mercaplaza-videos-reales|Mercaplaza · videos reales]] (transcrito `500d4cd5`, 2026-10-16)
- «está trabajando ahora mismo en la tienda. Esos archivos son suyos y mi commit no los va a incluir» — ventana [[2026-10-26-sistema-orion-pulido|Sistema orion pulido]] (transcrito `a1d8de4a`, 2026-10-26)
- «el bloque 0.2 ya está hecho y commiteado, igual que 0.3 y 0.4» (24-oct), «Sí, arranca 0.5» y «Alguien está haciendo el bloque 0.5 en paralelo justo ahora» (2-nov) — ventana [[2026-10-24-bot-recolector-de-informacion-prommter-fork|Bot recolector de información Prommter (fork)]] (transcrito `34a80c58`)
- «el pc es el sistema tu eres la vitrina», «Le dejé la orden en el repo y en un issue de GitHub.», «Lo que falta es del PC, y todavía no ha empezado la orden de hoy.» y «Pasó de 88 a 262 de 330 tareas y su revisión automática está en verde.» — ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `51184930`, 2026-09-15 y 2026-09-22)
- `7fe4d35` (2026-11-02 23:40 -0500, «memoria orion: curación (KN-002 obsoleto…)»): toca la memoria de ORION (estado,
  métricas y resumen); la nota de curación sale del subagente de la ventana [[2026-10-22-orion-app-de-rutina-sincronizada|Orion: app de rutina sincronizada]]
  (transcrito `b5eb380b`) y el `KN-024` que commiteó ya traía la anotación de la cosecha — ventana [[2026-11-03-alimentar-vault-de-obsidian|Alimentar vault de Obsidian]] (transcrito `278748af`).
- Hecho medido el 2026-11-02: `git status --porcelain` en `/Users/g/orion` devolvió 211 entradas (138 modificadas, 13 borradas, 60 sin seguimiento), mezcla de la migración vieja y de la cosecha en curso.

## Enlaces

- [[TEMA-olas-de-agentes]] — repartir archivos entre agentes que tú lanzas (aquí: sesiones que no lanzaste tú).
- [[TEMA-ventanas-por-cliente]] — cómo se abren las ventanas que luego comparten repo.
- [[TEMA-entorno-de-la-maquina]] — qué puede y qué no puede cada máquina (Mac y PC).
- [[TEMA-que-es-estar-verificado]] — comprobar en verde antes de dar un bloque por hecho.
