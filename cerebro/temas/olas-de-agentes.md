---
slug: olas-de-agentes
titulo: Repartir trabajo entre agentes en paralelo sin colisiones ni pérdidas
alias: [ola, olas, ola de agentes, tope de salida, limite de salida, output token maximum, 64000, 64k, respuesta demasiado larga, escribir por tandas, escribir por partes, archivo grande, json grande, no dejo nada, no escribio nada, murio sin dejar rastro, olas de agentes, agentes en paralelo, varios agentes, repartir trabajo, dividir el trabajo, dividir la tarea, partir la tarea, parto la tarea, en cuantos pedazos, pedazos, trozos, trocear, partir en pedazos, granularidad, un builder por paso, por pasos, tamano del encargo, equipo de agentes, paralelo, paralelizar, paralelismo, builder, builders, subagente, subagentes, spawn, spawns, wave, wave.json, manifiesto de ola, colision, colisiones, conflicto de archivos, pisarse, se pisan, muerte de agente, agente muerto, se murio, se murieron, se cayo, se cayeron, limite de sesion, infra-death, infra death, reanudar, reanudacion, recuperar ola, recuperacion de ola, respawn, relanzar, orquestador, orquestrador, contratos, ownership, propiedad de archivos, SendMessage, trabajo perdido, se me murio un agente, se me murio un builder, se me murio el agente, murio a mitad, checklist de rescate, rescate de ola, protocolo de muerte, que hago si se muere un agente, audita el disco, auditar el disco, antes de relanzar, mirar el disco, stub de 0 bytes, 0 bytes, archivo vacio, archivo en cero, tamano en disco, reporte vacio, reporte truncado, no es fallo del modelo, no lo cuentes como fallo, senal de capacidad, infraDeath, INFRA_DEATH, sufijo de fase, arqueologia, trabajo huerfano, delta, respawn estrecho, siembra en disco, sembrar datos, fixture sembrado, qa reanudable, resumeFromRunId, HEAD, mover HEAD, checkout a mitad de sesion, cambio de rama, cambia de rama, rama se movio, rama distinta a mitad, builder en rama vieja, construyendo sobre rama vieja, git checkout, git switch, reflog, conteo de tests no cuadra, numero de tests no coincide, cifra medida que no cuadra, metrica no coincide, discrepancia de tests, señal no ruido, no es ruido, criterios de aceptacion, criterio de aceptacion, leer los criterios, propiedad declarada, propiedad real, lista posee, posee, owns, ninguna ruta, todo componente, cada modulo, glob, criterio transversal, dos tareas chocaron, chocaron, se pisaron sin compartir archivos, colision sin solape, archivos disjuntos y aun asi, verificador en paralelo, dos verificadores, dos medidores, medidor, medir en paralelo, verificador es escritor, quien mide escribe, puerto compartido, mismo puerto, puerto 3200, carpeta data, data compartido, limpieza cruzada, borrar lo que otro usa, turnos.json en cero, aislar el verificador, verificar aislado, verificar:aislado, worktree, copia del arbol, servidor de prueba, levantar servidor para verificar, rojo transitorio, rojo a mitad de la ola, tsc en rojo, tsc rojo de otro carril, falso rojo, rojo falso, error de tipos de otro agente, el arbol quedo verde al final, cuando juzgo el arbol, cuando corro tsc en una ola, builder muerto, builders muertos, relanzar un builder muerto, relanzar builder muerto, que reviso antes de relanzar un builder muerto, reviso antes de relanzar, que reviso antes de relanzar, reviso, revisar antes de relanzar, muerto, muertos, ENOTFOUND, se cayo el dns, dns caido, murieron por hardware, murio por carga, compilando mientras renderiza, ola de video, verificar animacion, verificar video, ola grande, 26 agentes, reanudacion de ola grande, cache del run anterior]
preguntas: ["¿por qué se me murieron los agentes a mitad de la ola?", "¿cómo reparto el trabajo entre varios agentes?", "¿cómo lanzo varios builders sin que se pisen los archivos?", "¿qué hago si un builder se cayó a mitad del trabajo?", "¿cómo recupero una ola que murió?", "¿cuántos agentes puedo lanzar a la vez?", "se me murió un agente, ¿qué hago?", "¿qué reviso antes de relanzar un builder muerto?", "el agente dijo que arrancó pero no veo nada en disco, ¿entregó o no?", "¿cómo anoto una muerte por límite de sesión sin que cuente como fallo del modelo?", "el conteo de tests no coincide con lo esperado, ¿lo ignoro?", "¿puede un subagente cambiar la rama del repo?", "¿por qué dos builders en paralelo construyeron sobre código viejo?", "las dos tareas tenían archivos distintos, ¿por qué se pisaron?", "¿cómo sé de verdad qué archivos va a tocar una tarea?", "¿puedo lanzar dos verificadores a la vez?", "¿por qué el archivo que estaba midiendo cambió a mitad de la medición?", "un agente reportó tsc en rojo durante la ola, ¿lo arreglo?"]
proyectos: [infrapilot, estanco-contable, villa-broaster, wrd, placita, orama, landings, duo-burger]
confianza: alta
actualizado: 2026-09-10
---

# Repartir trabajo entre agentes en paralelo sin colisiones ni pérdidas

## Respuesta corta

**Escribe tú los archivos compartidos ANTES de repartir**: tipos, seed, tokens de
diseño y esqueletos van a disco primero, se declaran **intocables** en cada brief, y
cada agente recibe archivos propios que nadie más toca. **Reparte leyendo los CRITERIOS
de aceptación, no la lista `posee`**: un criterio que dice *"ninguna ruta…"* o *"todo
componente…"* reclama ese glob entero, y **quien levanta un servidor para medir también
escribe** — puerto y datos propios, o en serie. **Un rojo de `tsc` mientras la ola corre
no es veredicto**: el árbol se juzga una vez, al cerrar. **Deja `wave.json` escrito
antes del segundo spawn**: quién posee qué y cuál es su contrato. **Cuando uno muera
—y van a morir: es el fallo #1 medido— no lo relances**: mira primero `git status`,
`git log` y el tamaño en disco, porque casi siempre el código ya está escrito y lo que
murió fue su autoverificación; reanúdalo con `SendMessage` sobre su transcript, no con
un spawn nuevo. **Nunca dos agentes escribiendo el mismo archivo de memoria.**

## Por qué (qué lo pagó)

**Las muertes no son mala suerte: son el modo de fallo número uno, medido.** El
rediseño del ecosistema a v3 se disparó porque el análisis de 16 sesiones arrojó
**5 de 28 spawns muertos por infraestructura** (`infrapilot/DEC-008`). No fue un
pico:

- 2026-07-05: **3 de 10 spawns** murieron a mitad del trabajo (dos por límite de
  sesión/contexto, uno por conexión cerrada), todos dejando trabajo real a medias
  en disco (`infrapilot/KN-018`).
- 2026-07-29: **4 builders a la vez** (C1, C2, D1, D2) murieron por límite diario
  — y **los cuatro ya habían entregado** (`estanco-contable/KN-009`).
- 2026-08-22: **4 builders a la vez** otra vez, de fases distintas (`build:page`×2,
  `build:visual`, `build:lib`): cuatro procesos en paralelo alcanzaron el timeout
  **simultáneamente** porque comparten la misma cuota de sesión (`villa-broaster/KN-014`).
- En WRD los cortes se llevaron **~592k tokens** en infra-deaths (`wrd/KN-005`).
- 2026-09-09: **tres builders a la vez** murieron con `ENOTFOUND` en la MISMA Mac de
  siempre — no fue límite de sesión, fue el **hardware**: `brew` compilaba ffmpeg desde
  fuente mientras esos tres renderizaban video, la carga llegó a **46 sobre 4 hilos** y
  la resolución de DNS se cayó. Otros dos murieron después, esos sí por límite de
  sesión. Cinco muertes, dos causas distintas, la misma tanda (`duo-burger/KN-008`;
  ver [[TEMA-entorno-de-la-maquina]] para el remedio con `uptime` y `kill -STOP`).
- 2026-09-10, la ola más grande medida hasta ahora: **8 de 26 spawns** murieron por
  límite de sesión a mitad de una tanda de escenas de video. La reanudación —**26
  agentes de nuevo, 0 muertes**— recuperó todo del cache del run anterior y solo
  ejecutó lo que faltaba (749.863 tokens contra 1.843.859 de la ola original): la
  reanudación no es solo para builders individuales, escala a la ola entera
  (`duo-burger/metrics.json`, sesión 2026-09-10).

Ahí está la respuesta a *"¿por qué se me murieron a mitad de la ola?"*: la causa más
común es que **no fallaron los modelos, se acabó la sesión**, y se acabó para todos al
mismo tiempo porque el paralelismo consume la cuota compartida en paralelo — pero no es
la única: si varios agentes rinden a la vez que algo pesado compila de forma nativa en
la misma máquina, el sistema entero (hasta el DNS) puede ceder antes que la cuota de
sesión. Por eso un infra-death jamás se anota como señal de capacidad del modelo
(`wrd/KN-005`, `infrapilot/KN-018`, `duo-burger/KN-008`).

**Lo caro no es la muerte: es la arqueología después.** Tres proyectos pagaron la
misma lección por separado y coinciden: el builder muerto **casi siempre ya escribió
el código**; lo que muere es su fase de autoverificación en navegador
(`estanco-contable/KN-009`). En Placita un builder "muerto a mitad de tarea" ya había
**commiteado todo** (`f718df8`) antes de morir (`placita/KN-041`). Relanzarlo a ciegas
duplica trabajo terminado y quema más límite — que es exactamente lo que no sobra.

**Del lado de las colisiones, el patrón ganador está validado tres veces:**

| Corrida | Qué pre-materializó el orquestador | Resultado medido |
|---|---|---|
| `estanco-contable/KN-001` (4 builders, 2 opus + 2 sonnet) | `lib/types.ts` + `lib/demo-data.ts` + `globals.css` **antes** de la ola | **0 TODOs pendientes** (vs 2 en ROAD-001), 0 ciclos de fix, ~427k tokens |
| `villa-broaster/KN-006` (3 builders + contratos HTTP) | tokens de diseño en `globals.css`, declarado intocable en cada brief | **5/5 spawns** sin conflicto de archivos ni fix-cycles, QA 9/9 |
| `wrd/KN-003` (4 builders, OLA1) | esqueletos HTML completos, inline; builders solo con namespaces JS/CSS | **4 builders, ni un solo conflicto de archivos** |

La alternativa —dejar que un builder consuma lo que otro está produciendo y comente
el import con un TODO— *funciona*, pero se paga: en ROAD-001 quedó un import olvidado
al descomentar, detectado en verificación (`infrapilot/KN-026`). Villa lo zanjó
explícitamente: **pre-materializar el recurso compartido en el orquestador es más
barato que comentar/descomentar imports** (`villa-broaster/KN-006`).

**Hay un recurso compartido que la propiedad disjunta de archivos NO cubre: la rama
del repo.** En PLACITA (sesión 2026-08-24) la suite dio **626 tests cuando debían
ser 644**; perseguir esos 18 destapó, por el reflog, que algo había movido HEAD
entre `master` y `main` repetidamente **a mitad de la ola**, con dos builders
construyendo en paralelo sin saberlo sobre la rama vieja (`placita/KN-052`). Darlo
por bueno habría dejado todo el trabajo posterior de esos dos builders montado sobre
código desactualizado. La causa de fondo por la que había dos ramas divergentes en
primer lugar quedó como hipótesis sin confirmar del todo, pero la cadena de checkouts
sí quedó registrada en el reflog (`placita/RSK-005`). **Ojo con el corolario de
calibración**: los dos builders que trabajaron sobre la rama equivocada no
representan un fallo de capacidad del modelo — fue el entorno moviéndoles el suelo
por debajo, igual que un infra-death (`placita/KN-052`).

**Hay una segunda forma de morir, y no es el límite de sesión: el TOPE DE SALIDA.**
Medido el 2026-08-26 construyendo el catálogo de ORION: cinco builders escribían
un JSON grande cada uno; cuatro entregaron (122, 142, 147 y 85 KB) y **uno murió
con «Claude's response exceeded the 64000 output token maximum», dejando el disco
vacío**. La diferencia no fue el modelo ni el tamaño del archivo —el que murió
iba a ser el más pequeño de los cinco—: fue que los que sobrevivieron lo
escribieron **por tandas** (20 y 31 llamadas de herramienta) y el que murió
intentó una sola escritura gigante. Se reconoce al instante porque **no deja
nada**: no es un archivo a medias, es un archivo que no existe. Y como cualquier
muerte de infraestructura, **no es un fallo de capacidad del modelo** y no debe
subir su tier.

## Cómo se aplica

**Antes de lanzar (esto es la mitad del trabajo):**

0. **Si el encargo produce un archivo generado grande, pide que se escriba por
   tandas** y que compruebe entre una y otra (para JSON, que siga parseando).
   Ninguna escritura debería acercarse al tope de salida. Un builder que planea
   volcar 40 KB de una vez es un builder que va a morir sin dejar rastro.
1. **Escribe tú los archivos compartidos y decláralos intocables** en cada brief:
   contrato de tipos, seed/datos de demo, tokens visuales, esqueletos de página. Los
   builders codean contra archivos **reales en disco**, no contra una descripción
   (`estanco-contable/KN-001`, `villa-broaster/KN-006`).
2. **Reparte por propiedad disjunta de archivos**, no por "tema". Cada brief dice
   *exactamente* qué archivos/namespace posee ese agente y que no toque nada más
   (`ORION/runtime/skills/orion.SKILL.md:188-196`). Si dos tienen que tocar el mismo
   archivo, el trabajo está mal cortado.
2b. **La propiedad REAL de una tarea no es su lista `posee`: es el conjunto de archivos
   que sus CRITERIOS DE ACEPTACIÓN obligan a tocar.** Un criterio que empieza por
   *"ninguna ruta…"*, *"todo componente…"*, *"cada módulo…"* **reclama ese glob entero**
   aunque la tarjeta no lo nombre. Medido el 2026-08-26: T-023 declaraba poseer
   `lib/servidor/respuesta.ts` y T-028 `lib/dominio/**` —cero solape en el papel, así que
   se lanzaron en paralelo—, pero sus criterios eran *"ninguna ruta arma JSON a mano"* y
   *"ninguna ruta pasa de 60 líneas"*: **las dos obligaban a reescribir las mismas 24
   rutas de `app/api`**. Uno alcanzó a pisar `comparativa/csv/route.ts` con un Write, lo
   detectó, **paró**, vigiló mtimes ~4 minutos hasta que el otro quedó quieto y rehízo lo
   suyo **encima de la convención del compañero** en vez de imponer la suya. No se perdió
   nada, pero fue disciplina del agente, no diseño del orquestador
   (`villa-broaster/KN-023`). **Antes de paralelizar, lee los criterios, no la lista de
   archivos**: si dos criterios cuantifican sobre el mismo glob, o es UNA tarea, o van en
   serie, o uno de los dos criterios se recorta a los archivos que sí posee.
2c. **Un verificador que levanta un servidor es un ESCRITOR, aunque su trabajo sea
   leer.** La propiedad disjunta se pensó para builders y **no cubre el puerto, la
   carpeta de datos ni el árbol de trabajo**. El 2026-08-25 dos medidores lanzados en
   paralelo sobre la misma pantalla compartieron puerto 3200, `data/` y árbol: uno vio su
   archivo pasar de **758 a 840 líneas a mitad de la medición** y tuvo que descartar la
   tanda entera; en `data/` aparecieron 3 turnos y 3 órdenes que ninguno creó; y la
   limpieza cruzada dejó `data/turnos.json` en **0 bytes** —malformado, no `[]`— que solo
   no reventó porque el `JSON.parse` del almacén va envuelto en `catch`
   (`villa-broaster/KN-020`). Tres reglas: **puerto propio y copia propia de los datos, o
   en serie**; **nadie borra lo que no creó** (la limpieza cruzada corrompe en silencio y
   es peor que dejar basura); y **comprobación de salida obligatoria** tras medir —
   `git status` limpio, ningún `data/*.json` en cero bytes, y el arreglo que se midió
   todavía en el archivo. La forma barata de cumplirlo es un comando, no un recordatorio:
   `npm run verificar:aislado` pide puerto libre al sistema, copia `data/` a una carpeta
   desechable, levanta ahí y borra al salir, y **se niega a arrancar en los puertos de
   trabajo** (`villa-broaster/broaster-app/package.json:20`,
   `villa-broaster/broaster-app/scripts/aislado.mjs`, `villa-broaster/docs/DESPLIEGUE.md`
   §6 «Quien mide arranca con un comando»).
3. **Donde no se puede separar por archivo, separa por namespace**: builders que solo
   escriben su prefijo de JS/CSS sobre un HTML que escribió el orquestador
   (`wrd/KN-003`).
4. **Contrato explícito entre los que se hablan** (forma HTTP, firma de función, y sus
   códigos de error) para que el consumidor pueda verificarlo contra el productor real
   — en Villa el builder de landing verificó 201/409/400 contra la API del otro
   (`villa-broaster/KN-006`).
5. **`wave.json` antes del segundo spawn**: `{startedAt, objective, steps:[{step,
   model, owns:[rutas], contract, status}]}` en `memory/<projectId>/`. Efímero, no se
   commitea, se borra al cerrar la ola
   (`ORION/runtime/skills/orion.SKILL.md:198-206`, `ORION/runtime/skills/orion-close.SKILL.md:31`).
   Es lo que permite que **otra sesión** recupere una ola muerta sin arqueología
   (`ORION/runtime/skills/orion.SKILL.md:46-49`).
6. **Manda commitear temprano y seguido** dentro del brief: el commit es lo que
   convierte un builder muerto en trabajo recuperable (`wrd/KN-005`, `placita/KN-041`).
7. **Plan de ≥3 pasos: pon checkpoints.** Verifica el paso del que dependen los demás
   *antes* de lanzar los dependientes; fallar rápido en el paso 1 es mucho más barato
   que descubrirlo tras el paso 5 (`ORION/runtime/skills/orion.SKILL.md:208-212`).
7b. **La rama es un recurso compartido, no de un solo builder: prohíbe explícitamente
   que un subagente mueva HEAD** (`git checkout`, `git switch`, `git stash` que cambie
   de rama) — un `checkout` de cualquiera de ellos mueve el suelo bajo TODOS los
   demás sin que se enteren (`placita/KN-052`, `placita/RSK-005`). Y antes de confiar en
   **cualquier** medición agregada durante la ola (conteo de tests, de archivos, de
   rutas), confirma en qué rama estás parado: una cifra que no coincide con lo
   esperado es señal de que el terreno cambió, nunca ruido a ignorar.
7c. **Un rojo emitido MIENTRAS la ola corre no es evidencia de nada.** En la tanda del
   2026-08-26 dos agentes reportaron su `verificar` en **rojo** por errores de `tsc` en
   archivos **del otro, a medio escribir**; cuando terminaron todos, el árbol quedó verde
   y limpio (`villa-broaster/KN-023`). La causa es estructural: `tsc`, el build y la suite
   son del **proyecto entero**, no del carril, así que cada agente compila el trabajo a
   medias de sus compañeros. **El veredicto de tipos/build/tests se toma UNA vez, al
   cerrar la ola, y lo toma el orquestador**; un rojo intermedio se anota como *"pendiente
   de recheck al cierre"* y **nunca dispara un arreglo**. Creérselo cuesta doble: el
   orquestador se pone a arreglar algo que no está roto y encima pisa a quien lo estaba
   escribiendo. El corolario del brief: pídele al agente que reporte **qué rompió de lo
   suyo**, no el color global del árbol.

**Cuando uno cae (protocolo de recuperación, en este orden):** resumen; el
procedimiento completo, con el comando de cada paso, está abajo en
*[Se me murió un agente](#se-me-murió-un-agente-checklist-de-rescate-los-tres-remedios-unidos)*.

8. **No relances nada todavía.** Primero `git status` + `git log` — puede estar todo
   commiteado (`placita/KN-041`).
9. **Audita el disco contra lo que ese agente decía poseer**: grep de señales por
   archivo, `tsc`, build, y **el tamaño de los archivos** — un stub de 0 bytes
   significa que reportó "started" y no aterrizó nada (`wrd/KN-005`,
   `estanco-contable/KN-009`, `infrapilot/KN-018`).
10. **Reanuda por `SendMessage` sobre el transcript** en vez de spawnear de nuevo: en
    Villa las 4 muertes simultáneas se reanudaron así, sin re-pagar el trabajo
    (`villa-broaster/KN-014`).
11. **Si hay que respawnear, respawnea el delta**, con alcance estrecho a los archivos
    que faltan — nunca la tarea ancha original (`infrapilot/KN-018`).
12. **Un reporte vacío o truncado no es una muerte**: hubo un builder que terminó bien
    en disco y devolvió un informe truncado. Verifica el artefacto antes de concluir
    nada (`infrapilot/KN-018`).
13. **Anótalo como evento de infraestructura, no como fallo del modelo, y usa el campo
    hacia adelante**: `verdict: fail` **con `infraDeath: true` en esa fila** (el validador
    de `metrics.json` solo acepta `ok|fail|escalate`, así que el verdict sigue siendo
    `fail`, lo que cambia es que se marca aparte). El sufijo en la fase
    (`build:page:infra-death`, `wrd/KN-005`) fue la primera convención y se sigue leyendo,
    pero **no la repitas en filas nuevas**: obliga a deshacer el sufijo para recuperar la
    fase real, y un agregador que solo conoce una de las dos convenciones cuenta la
    muerte como fallo del modelo sin que nadie lo note — le pasó al propio agregador de
    costos del cerebro (`_permanent/KN-017`). **Y si no marcas la fila de ninguna forma,
    la muerte desaparece de toda medición futura**, aunque la cuentes en la nota de la
    sesión: es lo que pasó en tres memorias de este mismo corpus.

**Al cerrar la ola:**

14. Descomenta/cablea los contratos cruzados que quedaron en TODO y **vuelve a
    verificar** (`infrapilot/KN-026`).
15. **Solo el orquestador escribe la memoria**, después de recolectar los veredictos
    (`infrapilot/RSK-003`).
16. Borra `wave.json` (`ORION/runtime/skills/orion-close.SKILL.md:31`).

## Se me murió un agente: checklist de rescate (los tres remedios, unidos)

Esto es **lo que más se repite en todo el ecosistema**: ocho lecciones en seis
proyectos —placita, infrapilot, estanco-contable, wrd, villa-broaster y orama—
dicen la misma frase con palabras distintas (*"el agente muerto ya escribió;
audita el disco antes de relanzar, y no lo cuentes como fallo del modelo"*) y se
pagó al menos seis veces (`_permanent/KN-014`). Nunca fue por no saberlo: los
**tres remedios vivían en tres memorias distintas** —`git log` en placita, el
**tamaño del archivo en disco** en wrd, el **manifiesto de ola escrito antes de
los spawns** en infrapilot— y el procedimiento correcto es la **unión de los
tres**. Aquí está unida. Se corre **en orden**: cada paso ve un modo de muerte
que el anterior no puede ver.

**0 · El único paso que va ANTES de la muerte: deja el manifiesto escrito.**
Antes del segundo spawn, no después. Sin él, todo lo que sigue es arqueología a
mano; con él, hasta *otra sesión* puede rescatar la ola.

```jsonc
// memory/<projectId>/wave.json  — efímero, gitignored, se borra al cerrar
{ "startedAt": "2026-08-24T02:30:00.000Z", "objective": "...",
  "steps": [{ "step": "P1 ...", "model": "opus", "owns": ["ruta/a.ts"],
              "contract": "1 línea de aceptación", "status": "spawned" }] }
```

Es la mejora #1 de la v3 y nació justamente de las muertes (`infrapilot/DEC-008`);
el esquema y el momento de escribirlo están en
`ORION/runtime/skills/orion.SKILL.md:198-206`, y ya está ignorado por git en
`ORION/.gitignore:7` (`memory/*/wave.json`). **Verificado con código, no de
memoria:** el mecanismo está vivo ahora mismo —
`$ORION_HOME/memory/permanent/wave.json` existe con 3 pasos en estados
`done` / `en curso` / `pendiente`.

**1 · No relances. Lee el manifiesto y saca la lista de lo que ese agente decía
poseer.**

```bash
cat "$ORION_HOME/memory/<proj>/wave.json"     # Bash
type $ORION_HOME/memory\<proj>\wave.json      # PowerShell
```

Si aparece un `wave.json` al arrancar una sesión, **la sesión anterior murió a
mitad de ola** y ese archivo es el mapa: builders → archivos → contrato
(`ORION/runtime/skills/orion.SKILL.md:46-49`). Si no lo hay, la lista de
propiedad está en el brief que le mandaste; recupérala antes de seguir.

**2 · Remedio de placita — mira git ANTES de reconstruir nada.**

```bash
cd <repo> && git status --porcelain && git log --oneline -10 --stat
```

Un builder "muerto a mitad de tarea" puede haber **commiteado todo** justo antes
de caer: pasó en la corrida de gastos + cierre de caja (`placita/KN-041`).
**Verificado con código hoy, no citado de memoria:** el commit `f718df8` existe
en el repo de placita —*"Gastos con motivo y cantidad + cierre de caja que cuenta
plata"*, 19 archivos tocados, incluidos `cierre-caja.tsx` (278 líneas) y
`gastos.ts` + sus tests. Reconstruir eso a ciegas habría sido gasto puro.

**3 · Remedio de wrd — el TAMAÑO en disco, archivo por archivo. `started` no es
`aterrizó`.**

```bash
cd <repo> && ls -l <los archivos que decía poseer>                       # Bash
Get-ChildItem -Recurse <carpetas> | Select-Object Length,FullName        # PowerShell
```

Git no ve al builder que no commitea, así que el paso 2 no basta. **Un archivo de
0 bytes significa que el builder reportó que empezó y no persistió nada:
trátalo como NO hecho** (`wrd/KN-005`). Si no lo miras, planificas la ola
siguiente sobre archivos que no existen. **Verificado con código hoy:** en
`(fable 5 — carpeta del PC, no existe en la Mac)\wrd/sistema\` siguen en **0 bytes** `js/datos.js`,
`js/vista-pedidos.js`, `js/vista-catalogo.js`, `js/vista-contable.js`,
`js/vista-socios.js`, `js/vista-datos.js` y `css/sistema.css` —siete— mientras
`js/app.js` (16.518 b) y `js/acceso.js` (6.189 b) sí aterrizaron; sigue abierto
como `wrd/PEND-006`. Excepción: si **tú** creaste stubs a propósito para reservar
rutas, anótalo o vas a relanzar builders que ya terminaron.

**4 · Que el archivo pese no quiere decir que la función esté. Grep de señales +
compilar.**

```bash
cd <repo> && npx tsc --noEmit && npm run build
grep -n "<símbolo exportado que ese paso prometía>" <archivo esperado>
```

El protocolo de estanco es literalmente *auditar disco (grep de señales por
archivo) + `tsc` + build* antes de re-spawnear (`estanco-contable/KN-009`).
**Audita de verdad, uno por uno:** en la ola del 29-jul los **4 de 4** muertos
habían entregado, pero en la del 30-jul **2 de 6 no escribieron ni una línea** —y
uno de esos dos, el *store hub* G1, **bloqueaba 5 páginas**. Asumir "siempre
entregan" deja un hueco invisible.

**5 · Verifica el artefacto tú mismo. Lo que muere casi siempre es la
autoverificación, no la entrega.**

```bash
node $ORION_HOME/tools/edge-cdp.mjs --url <url> --mobile --eval "<comprobación>"
```

En estanco lo que se cae es la fase de auto-verificación en navegador, no el
código (`estanco-contable/KN-009`). En orama el `verify` murió por límite de
sesión y el orquestador **cerró la verificación inline con `edge-cdp`, 12/12
PASS**, sin re-spawnear nada (`orama/metrics.json`, nota del spawn `verify`).
Y ojo con el falso positivo inverso: **un reporte vacío o truncado no es una
muerte** — hubo un builder que terminó bien en disco y devolvió
*"leaving the build running in background"*; relanzarlo habría duplicado trabajo
terminado (`infrapilot/KN-018`).

**6 · Recién ahora decides, y por agente, no por ola.**

| Lo que encontraste | Qué se hace | Quién lo pagó |
|---|---|---|
| Commiteado / completo en disco y verificado | **Nada.** Márcalo `done` y sigue | `placita/KN-041`, `estanco-contable/KN-009` |
| Falta poco y es pequeño | Termina el **delta inline** en el orquestador | `infrapilot/KN-018` |
| Falta trabajo real y el transcript vive | **`SendMessage` sobre el mismo agente**, no un spawn nuevo | `villa-broaster/KN-014`, `villa-broaster/KN-011` |
| El transcript se perdió | Re-spawn **estrecho, solo a los archivos que faltan** — nunca la tarea ancha original | `infrapilot/KN-018` |
| 0 bytes / no escribió nada | Relanzar completo, y esta vez el brief ordena *"escribí el archivo PRIMERO, después refinalo"* | `wrd/KN-005` |

Villa reanudó así **4 builders muertos a la vez** por límite de sesión, sin
re-pagar el trabajo (`villa-broaster/KN-014`). Lo que abarata la reanudación es
haber **sembrado en disco** antes: en un QA de 8+ pasos, la orden `L1-0001`, el
gasto `G1-0001` y el producto sembrados sobrevivieron a dos muertes del verifier
y evitaron repetir clics y navegación (`villa-broaster/KN-011`). Una excepción
dura: si el agente pudo dejar el sistema **inconsistente** —migración a medias,
escrituras a base de datos, algo publicado— revertir es más seguro que "terminar
el delta" (`infrapilot/KN-018`).

**7 · Anótalo como evento de INFRAESTRUCTURA. Una muerte por límite de sesión NO
es un fallo de capacidad del modelo y no puede contarse como tal.**

No es una cortesía al modelo: es que **contarla como fallo corrompe la
calibración con la que eliges modelo la próxima vez**. Los cuatro builders de
villa murieron *porque cuatro procesos en paralelo comparten la misma cuota y
alcanzaron el timeout simultáneamente* — los modelos no fallaron nada
(`villa-broaster/KN-014`, `wrd/KN-005`, `infrapilot/KN-018`).

La forma correcta es **la unión de las dos convenciones que hoy existen sueltas**,
y hay una razón medida para hacer las dos cosas:

```jsonc
{ "phase": "build:page:infra-death",   // ← sufijo: lo SEPARA en la tabla de calibración
  "model": "sonnet", "verdict": "fail", // el validador solo acepta ok|fail|escalate
  "tokens": 0, "infraDeath": true,
  "note": "[INFRA_DEATH: límite de sesión, NO señal de capacidad] entregado en disco, verificado por el orquestador" }
```

**Verificado con código, y es el hallazgo que decide cuál convención vale:** el
agregador del propio cerebro agrupa por `phase|model` y cuenta como *fallida*
cualquier salida con verdict `fail` o `escalate`, **sin mirar jamás el campo
`infraDeath` ni la nota** (`ORION/tools/cerebro.mjs:203-211`). Consecuencia
medida sobre las memorias reales:

- **estanco-contable**, que marca con el campo: `build:page`/sonnet se lee hoy
  como **4 fallidas de 10**; descontando las 4 infra-deaths es **0 de 6**.
  `build:visual`/opus se lee **4 de 7**; real, **1 de 4**.
- **wrd**, que sufija la fase: las muertes salen en filas propias
  (`build:page:infra-death|opus`, `build:api:infra-death|opus`) y **no ensucian**
  la fila de `build:page|opus`.

Es decir: **el sufijo en `phase` es lo único que hoy protege la calibración**; el
campo y la nota sirven para auditar después. Pon los dos.

**8 · Cierra la ola en el manifiesto.** Actualiza el `status` de cada paso
mientras aterrizan y **borra `wave.json`** al terminar
(`ORION/runtime/skills/orion.SKILL.md:198-206`,
`ORION/runtime/skills/orion-close.SKILL.md:31`). Un `wave.json` viejo que
sobrevive le miente a la próxima sesión, que creerá que hay una ola muerta que
rescatar.

**Lo que este checklist NO promete.** No promete que el trabajo esté: promete que
lo vas a saber **antes** de gastar en relanzarlo. La tasa medida de "murió pero
entregó" va de **4 de 4** (estanco, 29-jul) a **4 de 6** (estanco, 30-jul) a
**0 de 7 archivos** (wrd, sesión 7): por eso el paso 3 y el paso 4 no son
opcionales ni intercambiables.

## Cuándo NO aplica

- **Tarea de 1 a 4 archivos: no montes ola.** Lo trivial va inline con cero spawns;
  2-4 archivos, un builder y un verificador. El pipeline completo costó **~10x** para
  un README de 91 líneas (`infrapilot/DEC-007`). Una ola tiene costo fijo de
  orquestación que solo se amortiza con trabajo de verdad — ver [[TEMA-modelos-y-costos]].
- **Agentes que escriben su propia memoria NO se paralelizan.** Ocho `orion-landing`
  a la vez comparten `ORION/memory/landings/state.json` y lo corrompen; se les prohibió
  escribir por eso. Si hay que paralelizarlos, serializa la escritura o que solo el
  orquestador escriba (`infrapilot/RSK-003`).
- **Dependencia fuerte proveedor→consumidor: secuencia, no paralelices.** Si el
  consumidor no puede compilar sin lo del otro, el paralelismo no compensa el
  comentar/descomentar (`infrapilot/KN-026`).
- **La propiedad disjunta protege DENTRO de una ola, no ENTRE olas.** Dos builders de
  olas distintas tocaron `presupuestos/page.tsx`; el segundo reestructuró la página y
  el trabajo del primero sobrevivió solo en la vista de detalle, no en la de lista. Al
  planear varias olas, lleva la cuenta de qué archivos tocó cada ola y **re-verifica**
  los de olas anteriores después de cualquier ola que reestructure
  (`infrapilot/KN-031`). Se detectó leyendo el HTML prerenderizado, no el build.
- **Builder barato que toca texto público**: el paralelismo no exime de auditar. Un
  builder haiku inventó una ciudad ("Rionegro") en las keywords SEO — trabajo técnico
  correcto, dato de negocio inventado (`villa-broaster/KN-008`). Ver
  [[TEMA-generadores-de-diseno]] y la regla de cero relleno (`infrapilot/KN-033`).

## Evidencia

**Muertes y recuperación**
- `infrapilot/DEC-008` — v3 nace de 5/28 spawns muertos por infra; define `wave.json`.
- `infrapilot/KN-018` — 3/10 spawns muertos el 2026-07-05; protocolo de diff de
  propiedad vs `git status`; modo de muerte "reporte vacío/truncado".
- `estanco-contable/KN-009` — 4 builders muertos por límite diario, **los 4 habían
  entregado**; lo que muere es la autoverificación en navegador.
- `placita/KN-041` — el "muerto" ya había commiteado todo (`f718df8`); revisar
  `git status`/`git log` ANTES de reconstruir.
- `villa-broaster/KN-014` — límite de sesión mató 4 builders a la vez; reanudación por
  `SendMessage` sobre transcript.
- `wrd/KN-005` — `wave.json` + commits tempranos + `resumeFromRunId` + verificar
  **tamaño en disco** (stub de 0 bytes); ~592k tokens perdidos en infra-deaths;
  convención `phase:infra-death`.
- `wrd/PEND-006` — la ola C que nunca se lanzó: los 7 stubs de 0 bytes siguen ahí,
  con el contenido exacto para relanzarla sin arqueología.
- `villa-broaster/KN-011` — sembrar la evidencia en disco antes de un QA largo lo
  hace reanudable; el verifier sobrevivió 2 muertes por `SendMessage`.
- `orama/metrics.json` — spawn `verify`/sonnet, verdict `escalate`, 0 tokens, nota
  *"muerte de infraestructura: límite de sesión; no es señal de capacidad;
  verificación completada inline por orquestador con edge-cdp (12/12 PASS)"*. Es el
  sexto proyecto que paga la misma lección, y una **tercera** forma de anotarla.
- `_permanent/KN-014` — la regla que explica por qué se pagó seis veces: si una
  lección se paga en un SEGUNDO proyecto deja de ser del proyecto y sube a
  `permanent`. Este checklist es su primera aplicación.
- `ORION/tools/cerebro.mjs:203-211` — el agregador cuenta `fail`/`escalate` como
  fallo agrupando por `phase|model` y **nunca** lee `infraDeath` ni la nota: por eso
  el sufijo en la fase es la única marca que protege la calibración.

**Reparto sin colisiones**
- `estanco-contable/KN-001` — pre-materializar tipos + seed + `globals.css`: 0 TODOs, 0 fix-cycles.
- `villa-broaster/KN-006` — recurso compartido intocable + contratos HTTP: 5/5 spawns limpios.
- `wrd/KN-003` — esqueletos del orquestador + namespaces estrictos: 4 builders, 0 conflictos.
- `infrapilot/KN-026` — contratos cruzados con TODO comentado: funciona, cuesta un micro-fix.
- `infrapilot/KN-031` — el solape de propiedad ENTRE olas no lo cubre nada de lo anterior.
- `infrapilot/RSK-003` — 8 agentes paralelos sobre el mismo `state.json` lo corrompen.
- `placita/KN-052` — conteo de tests 626 vs 644 esperados; la discrepancia de 18 fue
  la única pista de que HEAD se había movido entre `master`/`main` a mitad de la ola;
  nota de calibración: no penalizar a los builders, fue el entorno.
- `placita/RSK-005` (Open) — el repo tiene dos ramas y GitHub las tenía divergidas;
  causa exacta de por qué algo movió HEAD a mitad de sesión, sin confirmar del todo.
- `villa-broaster/KN-023` — listas `posee` disjuntas (`lib/servidor/respuesta.ts` vs
  `lib/dominio/**`) y **colisión real** en las 24 rutas de `app/api`, porque los
  criterios *"ninguna ruta arma JSON a mano"* y *"ninguna ruta pasa de 60 líneas"*
  reclamaban el mismo glob. Incluye el rojo transitorio de `tsc` entre carriles que se
  volvió verde al cerrar la ola. Depende de `villa-broaster/KN-020`.
- `villa-broaster/KN-020` — dos VERIFICADORES en paralelo comparten puerto 3200, `data/`
  y árbol: archivo de 758→840 líneas a mitad de medición, 3 turnos y 3 órdenes que nadie
  creó, `data/turnos.json` en **0 bytes** por limpieza cruzada. Es la extensión explícita
  de este tema de builders a medidores.
- `$ORION_HOME/prommter/villa-broaster/docs/DESPLIEGUE.md` §6 — la regla ya
  escrita para el equipo (verificador = escritor, prohibida la limpieza cruzada,
  comprobación de salida) y el comando `npm run verificar:aislado`
  (`broaster-app/package.json:20`, `broaster-app/scripts/aislado.mjs`).

**El protocolo escrito (archivo:línea)**
- `ORION/runtime/skills/orion.SKILL.md:188-196` — un builder por paso; el brief declara los archivos que posee.
- `ORION/runtime/skills/orion.SKILL.md:198-206` — esquema de `wave.json` y cuándo escribirlo.
- `ORION/runtime/skills/orion.SKILL.md:46-49` — si existe `wave.json` al arrancar, la sesión anterior murió a mitad de ola.
- `ORION/runtime/skills/orion.SKILL.md:208-212` — checkpoints antes de lanzar los pasos dependientes.
- `ORION/runtime/skills/orion-close.SKILL.md:31` — borrar `wave.json` al cerrar.

**HUECO MEDIDO — la tasa de muerte no se puede consultar desde `metrics.json`.**
Sobre los **263 spawns** registrados en las cinco memorias con métricas
(infrapilot 62, placita 68, villa-broaster 50, wrd 50, estanco-contable 33), **solo 2
llevan el sufijo `:infra-death`**, ambos en `wrd`. Las demás muertes entraron como
fallo normal o no entraron:

- `estanco-contable/metrics.json`, sesión cerrada 2026-07-29: **4 salidas `escalate`
  sin tokens** (`build:page`/sonnet ×2, `build:visual`/opus ×2) — son exactamente las
  4 muertes que narra `estanco-contable/KN-009`, contadas hoy como fallo de capacidad
  del modelo.
  **CORRECCIÓN (2026-08-24, comprobada abriendo el archivo):** decir que estanco no
  las marcó era falso. Esas 4 —y otras 6 de la sesión del 30-jul, **10 en total**—
  sí llevan `infraDeath: true` y la nota `[INFRA_DEATH: limite diario, NO senal de
  capacidad]`. El problema es otro y es peor: **la marca no sirve de nada porque
  nadie la lee.** El agregador (`ORION/tools/cerebro.mjs:203-211`) agrupa por
  `phase|model` y cuenta `fail`/`escalate` como fallo **sin mirar el campo ni la
  nota**, así que `build:page`/sonnet aparece con 4 fallos de 10 cuando su fallo real
  es 0 de 6, y `build:visual`/opus con 4 de 7 cuando es 1 de 4. Lo que separa de
  verdad es **el sufijo en `phase`** (wrd: `build:page:infra-death|opus` sale en su
  propia fila y deja limpia la de `build:page|opus`). El sesgo a la baja de la
  calibración de estanco sigue siendo real; lo que cambia es el arreglo: **no basta
  con anotar `infraDeath`, hay que sufijar la fase** — ver el paso 7 del checklist.
- `infrapilot/metrics.json`, sesión 2026-07-05: 3 `escalate` con **793, 269 y 7
  tokens** — las 3 muertes de `infrapilot/KN-018`. *Un spawn con tokens de dos o tres
  cifras no trabajó: murió.* Sirve como detector.
- `villa-broaster/metrics.json`: **50 spawns, 0 `fail` y 0 `escalate`**, pese a que
  `villa-broaster/KN-014` documenta 4 builders muertos el 2026-08-22 — ahí las muertes
  no llegaron a la métrica en absoluto.

Consecuencia práctica: hoy la fiabilidad de una ola **se lee en las lecciones, no en
los números**, y la calibración de modelos de `estanco-contable` está sesgada a la
baja por muertes de infraestructura. Arreglarlo es reetiquetar esas salidas con el
sufijo, no reescribir el veredicto.

## Enlaces

- [[TEMA-modelos-y-costos]] — cuánta ceremonia merece la tarea y qué modelo por paso, antes de decidir si hay ola.
- [[TEMA-verificar-con-evidencia]] — cómo se comprueba en esta máquina que un builder de verdad aterrizó.
- [[TEMA-generadores-de-diseno]] — encargo a un ejecutor sin criterio propio; misma disciplina de brief, otro medio.
