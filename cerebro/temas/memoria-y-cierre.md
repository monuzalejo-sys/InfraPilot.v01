---
slug: memoria-y-cierre
titulo: Cómo se cierra una sesión y qué merece quedar guardado
alias: [cerrar sesion, cerrar la sesion, cierre de sesion, cierre, cerrar, close session, session close, terminar de trabajar, acabar de trabajar, fin de sesion, memoria, memoria del proyecto, memorias, guardar, donde guardo, que guardo, guardado, apuntar, anotar, notas, apuntes, bitacora, aprendi, aprendizaje, aprendizajes, leccion, lecciones, reflexionar, reflexion, reflector, curacion, curar, curador, curator, archivar, archivado, deduplicar, duplicados, brief, state, metrics, amm, validar memoria, validador, tier, lifetime, permanente, cerebro, boveda, tema, temas, cosechar, cosecha, harvester, vault, obsidian, commit de memoria, promocion, promover, promover una leccion, subir a permanent, sube a permanent, cuando sube a permanent, tier permanent, ascender, leccion repetida, la misma leccion, misma leccion dos veces, pagar dos veces, volver a pagar, ya lo aprendi, ya lo sabia en otro proyecto, ya me paso en otro proyecto, en otro proyecto, otro proyecto, entre proyectos, cruzar memorias, cruce de memorias, once memorias, segunda factura, regla vs coordenada, regla y coordenada, coordenada, coordenadas, ruta absoluta, rutas absolutas, ruta muerta, la ruta ya no existe, se movio el archivo, numero de linea, archivo y linea, cita caducada, caduca, caducar, envejece, memoria desactualizada, memoria mintiendo, memoria que miente, re-verificar, reverificar, corregir sin borrar, dejar constancia]
preguntas: ["como se cierra una sesion de trabajo", "donde guardo lo que aprendi", "que hago al terminar de trabajar", "que merece quedar guardado en la memoria del proyecto", "por que la memoria crece y nadie la limpia", "donde va una leccion que sirve en otro proyecto", "esta leccion ya la habia aprendido en otro proyecto, que hago con ella", "cuando una leccion sube a permanent", "por que cada proyecto vuelve a pagar la misma leccion", "puedo poner la ruta de un archivo en la memoria", "por que la memoria apunta a un archivo que ya no existe", "como corrijo algo que la memoria dice mal sin borrarlo"]
proyectos: [infrapilot, _permanent, prommter, placita, villa-broaster, estanco-contable, pollo-landing, arroces]
confianza: alta
actualizado: 2026-08-24
---

# Cómo se cierra una sesión y qué merece quedar guardado

## Respuesta corta

Cerrar no es despedirse: son **cuatro pasos en orden — persistir, curar, validar,
alimentar el cerebro —** y solo entonces **commit local, nunca push**. Guarda
únicamente lo que pasa el filtro: **no obvio + reusable + citable**; si no puedes
citarlo con `proyecto/ID`, `archivo:línea` o un número medido, no es lección, es
opinión, y contamina. Y guárdalo en **el cajón que le toca por alcance**:
`brief.md` lo que la próxima sesión lee primero, el `state.json` del proyecto los
hechos de ESE negocio, `ORION/memory/permanent` los hechos de LA MÁQUINA, y
`cerebro/temas` la regla que cruza proyectos. **Nunca borres nada: se archiva con
su ArchiveRecord** — un id que desaparece sin registro el validador no lo ve.

Dos leyes nuevas mandan sobre lo anterior: **si una lección se paga en un SEGUNDO
proyecto deja de ser del proyecto y sube ya** (`_permanent/KN-014`), y **al
escribirla se separa la regla de la coordenada** — la regla se enuncia para que
sobreviva sola, la ruta se marca como pista a re-verificar (`_permanent/KN-015`).

## Por qué (qué lo pagó)

**Lo pagó una curación que borró conocimiento en silencio.** El 2026-07-06 una
curación con `haiku` eliminó `DEC-008` y `KN-022` de `state.json` **sin dejar
ArchiveRecord**. El validador es *stateless* —compara el archivo contra el
esquema, no contra su versión anterior— así que la pérdida le resultó invisible y
el archivo quedó VÁLIDO. Se recuperaron desde el historial de git. Quien lo
detectó no fue una regla: fue **el diff del vault regenerado**, archivos `.md`
que desaparecieron sin estar en la lista de archivado del curador. La guarda
permanente que quedó es `tools/check-r8.mjs` dentro del hook de pre-commit, que
compara lo staged contra `git HEAD` y bloquea el commit si algún id se esfumó
(`infrapilot/KN-027`; hoy 2026-08-24 el hook activo está instalado y es idéntico
a la copia versionada, `.git/hooks/pre-commit` = `tools/hooks/pre-commit`).

**El segundo pago fue de esquema.** `KN-001..005` de infrapilot nacieron con
`lifetime: Permanent` y `tier: Project`. El validador los cazó y la reparación
obligó a decidir de verdad qué era eterno: `KN-001` subió a `tier Permanent`
(hecho de la máquina), `KN-002..005` bajaron a `lifetime Project` (hechos del
proyecto, no verdades eternas) — `infrapilot/KN-007`, chequeo en
`ORION/tools/validate-memory.mjs:112-113`.

**El costo de no curar está medido hoy.** Las 11 memorias del ecosistema validan
VÁLIDAS; la deuda no es memoria inválida, es **memoria cara**: 5 de 11 superan el
umbral de 25 objetos activos con el que `validate-memory.mjs:163` avisa —
placita 55, infrapilot 52, villa-broaster 39, estanco-contable 31, wrd 26.

**Y el daño real no se ve en `state.json`, se ve en el `brief.md`**, porque desde
ORION v3 el brief —no el state— **es el contexto primario del orquestador**
(`infrapilot/DEC-008`, mejora 4). `ORION/memory/infrapilot/brief.md:56` declara
*"Version: 34. Last AMM: 2026-07-28"* y la línea 54 *"Active: 46 objects"*,
cuando `state.json` va por versión 36, 52 objetos y `lastAmmRun` 2026-08-16. Su
lista "Open Work (8 Pending)" incluye `PEND-009`, `PEND-014` y `PEND-017`, los
tres archivados el 2026-08-16 como `ARC-19/ARC-20/ARC-21`, y **no menciona
`PEND-018` ni `PEND-019`, que sí están abiertos**. Una sesión que arranque de ahí
trabaja sobre tres cosas cerradas y no ve dos abiertas. Encima el curador se
impone un techo de ≤50 líneas para el brief y **4 de los 8 briefs lo rompen**:
infrapilot 57, orama 69, estanco-contable 72, placita 88.

**El cajón equivocado deja el conocimiento invisible.** `prommter/KN-002` es un
hecho de máquina puro —PowerShell 5.1 reescribió un JSON UTF-8 con BOM y mojibake
y el validador reventó con *"Unexpected token"*; se recuperó con `git checkout` +
la herramienta Edit— y su propio `context` reconoce que *"amerita copia en
ORION/memory/permanent cuando el arbol de ORION este limpio (hoy esta sucio, no
se toco)"*. Cuatro días después, `_permanent` no contenía ni una mención a
powershell o utf-8. **Corregido el 2026-08-24 tras volver a medirlo:** el árbol de
`memory/` ya **no** está sucio —se commiteó esa misma noche (`d6f99ec`, `a6a67e4`)
y `git status` no reporta nada bajo `memory/`—, `_permanent` pasó de 11 a **16**
objetos… **y la copia sigue sin hacerse**: `permanent/state.json` no menciona ni
`powershell` ni `utf-8`. Se venció la excusa y el paso aplazado no ocurrió igual.
La conclusión original —*"el cierre no terminó en commit"*— era la causa
equivocada; la verdadera es que **la promoción a mano nunca se dispara sola**,
que es exactamente lo que corrige la ley 1 de abajo.

**Un solo escritor a la vez.** La curación de infrapilot lleva bloqueada desde el
2026-08-20 y fue una decisión, no un olvido: la sesión organizadora *no* la hizo
a propósito **para evitar doble escritor** sobre un árbol sucio
(`prommter/PEND-002`). Está medido por qué: 8 `landing-prompter` en paralelo
comparten `ORION/memory/landings/state.json` y por eso se les prohibió escribir
(`infrapilot/RSK-003`).

**El cierre es también donde se toma la nota del cerebro.** Al escribir este tema
`cerebro.mjs probar` daba **18/26 (69%)**; al cierre del 2026-08-24 va en **26/26
(100%)** y `cerebro.mjs citas` en **786 verificadas / 0 rotas**. Ese número es la
diferencia entre un ecosistema que aprende y uno que solo acumula — y el hecho de
que esta misma frase haya tenido que reescribirse tres veces en una noche es la
ley 2 en vivo: **la regla aguanta, la cifra caduca.**

## Dos leyes nuevas: cuándo sube de cajón, y cómo se escribe la frase

Salieron de leer las 11 memorias juntas por primera vez, la noche del 2026-08-24,
y ya viven en la memoria permanente: `_permanent/KN-014` y `_permanent/KN-015`.
Cambian dos cosas de este tema: **el criterio del cajón** y **la forma de la frase
que se guarda**.

### Ley 1 — Si una lección se paga en un SEGUNDO proyecto, deja de ser del proyecto

El disparador para subir a `permanent` **no es la antigüedad ni el número de
sesiones: es la segunda factura.** La primera vez que un proyecto aprende algo, es
suyo. La segunda vez que OTRO proyecto tropieza con lo mismo, ya es un hecho de la
máquina: se promueve o se escribe como tema transversal, y las dos memorias
apuntan ahí en vez de duplicarlo (`_permanent/KN-014`).

**Lo pagó un mes de bloqueo con la solución escrita al lado.** El 2026-07-28
infrapilot registró como riesgo que en esta máquina no se podían ejecutar
migraciones SQL —sin `psql`, sin Supabase CLI, sin Docker— y por eso
`003_organizations.sql` se quedó sin correr, con `/organizaciones` y `/perfil` en
503 y la Etapa 5 trabada (`infrapilot/RSK-001`). **Al día siguiente**, el
2026-07-29, estanco-contable demostró lo contrario levantando un PostgreSQL real
en el scratchpad y validando su migración con **37/37 asserts**; su lección dice
textualmente que aplica *"a cualquier proyecto de esta maquina (incluida la
migracion 003 de infrapilot)"* (`estanco-contable/KN-008`). Nadie las cruzó.
Pasaron **27 días** hasta que la capa transversal lo encontró y escribió
`infrapilot/KN-035`; la refutación llevaba **26 de esos 27 días** escrita en otra
memoria. No se aprendió nada nuevo: **se dejó de perder lo ya aprendido.** (El
cómo se prueba una migración no es de este tema: está en
[[TEMA-dominio-migraciones-y-copias]].)

**Y no falló la etiqueta, falló el traslado.** `estanco-contable/KN-008` nació ya
marcado `tier: Permanent` ese mismo 2026-07-29 — y ahí sigue, dentro del
`state.json` de su proyecto. Medido hoy 2026-08-24 recorriendo las 11 memorias:
**23 objetos llevan `tier: Permanent` y viven dentro de la memoria de un
proyecto** (infrapilot 17, estanco-contable 5, arroces 1) sobre 265 objetos de
proyecto, mientras `ORION/memory/permanent/state.json` tiene 16 objetos y su
`metrics.json` sigue con `sessionCount: 0`. **El `tier` es un deseo; el archivo es
la dirección.** Marcar Permanent sin mover el objeto no promueve nada, y por eso
el ecosistema volvió a pagar la misma lección ocho veces en seis proyectos
(el agente muerto ya escribió), cinco veces en cuatro (capturas por CDP) y ocho
veces en seis (no inventar datos) — el recuento está en `_permanent/KN-014`.

**Corrección con constancia.** La regla 4 del curador
(`~/.claude/agents/orion-curator.md:30-32`) exige para promover *"referenced
across ≥3 sessions AND High impact"* y remata *"Rare — when in doubt, don't"*. Esa
es la regla que produjo el atasco: **≥3 sesiones del MISMO proyecto no se cumplen
nunca para una lección que ya pagó otro proyecto.** Sigue valiendo para lo que se
repite dentro de un proyecto; **para el caso que importa —dos proyectos distintos—
queda sustituida por `_permanent/KN-014`: una sola repetición, promoción
inmediata.** Lo que NO se toca es el tercer requisito de esa misma regla, *"no
project-specific names/paths"*: es justamente el puente a la ley 2.

### Ley 2 — Separa la REGLA de la COORDENADA: la regla no caduca, la coordenada sí

Con los proyectos repartidos en tres raíces (`ORION\`, `prommter\proyectos\`,
`fable 5\`), **la evidencia `archivo:línea` envejece más rápido de lo que se
cura** (`_permanent/KN-015`). Dos coordenadas podridas, verificadas hoy abriendo
el disco en vez de creerle a la memoria:

- **`estanco-contable/KN-005`** enuncia una regla excelente —jornada contable ≠
  fecha UTC: en Bogotá una venta de las 11 p.m. cae al día siguiente— y remata con
  la coordenada *"pasa por fechaNegocio(fecha) de lib/dominio/facturacion.ts"*.
  Falso hoy: `fechaNegocio` se **define** en
  `prommter/proyectos/estanco-contable/lib/dominio/jornada.ts:34`; `facturacion.ts`
  solo la re-exporta y deja escrito en su línea 76 *"viven ahora en jornada.ts (una
  sola fuente)"*. **El código dejó la nota del traslado y la memoria nunca se
  enteró.** La regla sigue siendo verdad; caducó solo la dirección.
- **`pollo-landing/DEC-001`** afirma que el repo vive en
  `C:/Users/Kalel/fable 5/pollo-landing`. Verificado hoy: esa carpeta no existe
  —`fable 5` contiene `.claude`, `wrd` y `wrd-serve.mjs`— y el repo real está en
  `C:\Users\Kalel\prommter\proyectos\pollo-landing`. Un agente que le crea abre una
  ruta muerta y puede concluir que el proyecto se perdió.

**Cómo se escribe entonces.** Dos frases, siempre en este orden:

1. **La regla, enunciada para sobrevivir sola** — que se entienda y se pueda
   aplicar sin abrir ningún archivo, sin nombres de carpeta ni números de línea.
   Si la frase deja de significar algo cuando borras la ruta, todavía no es una
   regla: es una nota.
2. **La coordenada, marcada como pista** — *"hoy en `<ruta>` (re-verificar al
   citarla)"*. Nunca al revés, y nunca la coordenada sola.

Y al **citar** una coordenada guardada, ábrela primero; si se movió, corrígela en
el mismo movimiento, no después. Esta ley ya está hecha máquina en el propio
verificador: `cerebro.mjs:509-513` comprueba `proyecto/ID` —que es estable— y
**no** comprueba rutas de archivo, precisamente porque las rutas no son
comprobables en el tiempo. Excepción que se mantiene: **las rutas absolutas de
HERRAMIENTAS de la máquina sí valen y van completas** (`ORION/tools/edge-cdp.mjs`,
el validador) porque no se mueven con los proyectos — ver
[[TEMA-entorno-de-la-maquina]].

**Corregir no es borrar.** El modelo a copiar es lo que se le hizo a
`infrapilot/RSK-001` cuando la ley 1 lo desmintió: el riesgo no se borró, se le
añadió dentro del texto *"[2026-08-24 CORREGIDO: la premisa 'no se puede ejecutar
en esta maquina' es FALSA — ver KN-035 y estanco-contable/KN-008. El riesgo sigue
abierto porque la migracion no se ha ejecutado, no porque no se pueda.]"*. La
premisa muerta queda visible, con fecha y con el puntero a lo que la mató.

## Cómo se aplica

1. **¿Quedó trabajo sin reflexionar?** Lanza `orion-reflector` (haiku; sonnet solo
   si la lección es sutil) con un resumen compacto de la corrida y la **ruta
   absoluta** del directorio de memoria. Si todo se reflexionó ya, **sáltalo**: no
   escribas objetos de ruido solo para tener algo que persistir.
2. **Filtro de valor, antes de escribir un objeto:** no obvio + reusable +
   citable. Fuera lo mecánico de rutina, lo re-derivable del repo y las conjeturas
   de baja confianza. Prefiere **tres lecciones excelentes a quince mediocres**, y
   di cuántas descartaste. Lo que sale de un **fallo, un rechazo del dueño o una
   medición** vale más que veinte sesiones exitosas.
2b. **Busca antes de escribir, en las OTRAS memorias.** Un
   `cerebro.mjs buscar "<la lección>"` cuesta ~0. Si ya aparece en otro proyecto,
   no la escribas otra vez: **es la segunda factura, y por la ley 1 sube ya** a
   `permanent` o a un tema, con las dos memorias apuntando ahí. Saltarse este
   paso es lo que costó 27 días en el caso de las migraciones.
2c. **Regla primero, coordenada después.** Escribe la regla de forma que se
   entienda sin abrir ningún archivo, y solo entonces añade la ruta como *"hoy en
   `<ruta>` (re-verificar)"*. Y si vas a **citar** una ruta que ya estaba en
   memoria, **ábrela antes**: hay dos coordenadas podridas medidas
   (`estanco-contable/KN-005`, `pollo-landing/DEC-001`).
3. **El cajón por alcance:**

   | Qué es | Dónde va |
   |---|---|
   | Lo que la próxima sesión debe leer primero | `<memoria>/brief.md` (≤50 líneas, se **regenera**) |
   | Hecho que solo vive dentro de un proyecto | objeto en el `state.json` de ese proyecto |
   | Hecho de la máquina (rutas, herramientas, límites) | `ORION/memory/permanent/state.json` |
   | **Lección que YA apareció en otra memoria (segunda factura)** | **`ORION/memory/permanent/state.json`, movida de verdad — no basta con ponerle `tier: Permanent` donde está** |
   | Regla pagada que sirve en varios proyectos | tema nuevo en `ORION/cerebro/temas/<slug>.md` |
   | Matiz o evidencia nueva de algo ya sabido | **refuerzo** del tema existente, nunca un tema duplicado |

4. **Curar** con `orion-curator` (haiku, `triggeredBy: SESSION_CLOSE`): fusiona
   duplicados (gana el de mayor prioridad, el perdedor va a `supersedes[]`),
   archiva lo que cumple **las tres condiciones** —estado terminal **y** nadie
   activo lo referencia **y** (impacto Low **o** lifetime Sprint)—, y si algo
   activo depende de un objeto, **degrádalo, no lo archives**. Antes de archivar
   un terminal de alto impacto, **extrae su lección reusable a un Knowledge**. Al
   final, regenera `brief.md`.
5. **Escribe la sesión en `metrics.json` con números medidos**: un `modelOutcomes`
   por spawn `{phase, model, verdict, tokens}` con el `subagent_tokens` que
   entrega el orquestador. Si no te lo dieron, **omite el campo — jamás lo
   inventes**; el consumo inline del orquestador no está medido (`_permanent/KN-002`).
6. **Validar**: `node C:\Users\Kalel\ORION\tools\validate-memory.mjs <memoria>`.
   No se cierra dejando memoria inválida. Invariante que ya falló antes:
   `sessionCount` debe ser igual a `sessions.length`.
7. **Regenerar el vault**: `node C:\Users\Kalel\ORION\tools\generate-vault.mjs
   <memoria>` — script determinista, **lo corre el orquestador, nunca un agente**;
   los agentes solo hacen trabajo de juicio (`infrapilot/DEC-008`). Borra
   `wave.json` si su ola terminó. Ese diff es el detector de pérdidas.
8. **Alimentar el cerebro**: si la lección serviría en OTRO proyecto, lanza
   `orion-harvester` — que **busca primero** y refuerza en vez de duplicar; si
   encuentra una contradicción entre proyectos, documenta las dos con su condición
   de negocio en lugar de fusionarlas. Después, siempre: `cerebro.mjs citas`
   (tiene que salir **cero rotas**), `cerebro.mjs probar` (**no puede bajar**;
   si bajó, tu tema nuevo le está robando preguntas a otro y hay que separar los
   alias) y `cerebro.mjs exportar`.
9. **Commit local** en el repo que guarda esa memoria, mensaje
   `orion: session close — memory curation (vN)`. **No hagas push** desde la
   terminal: deja escrita la lista de commits pendientes para GitHub Desktop
   (ver [[TEMA-entorno-de-la-maquina]]).
10. **Reporta ≤15 líneas**: fusionados/archivados, activos antes → después, nueva
    versión, resultado de validación, commits hechos y los Pending abiertos que
    encabezan la próxima sesión.

## Cuándo NO aplica

- **La ceremonia escala con la tarea.** La reflexión es obligatoria en todos los
  niveles —inline o con spawn—, pero **la curación no**: lanza el curador solo si
  el validador avisa (>25 objetos), hay ≥3 objetos en estado terminal, o el
  reflector detectó casi-duplicados (`infrapilot/DEC-007`).
- **Si no se aprendió nada, no inventes un objeto.** Escribir "por escribir"
  encarece todas las sesiones futuras: cada objeto que dejas se paga en tokens
  cada vez que alguien abre esa memoria.
- **Archivar no siempre adelgaza.** villa-broaster tiene 39 objetos activos y solo
  **1** en estado terminal: ahí no hay nada que archivar, y la palanca es fusionar
  duplicados y mantener el `brief.md` dentro de sus 50 líneas — no el archivado.
- **Con el árbol sucio o con otra sesión escribiendo, no cures.** Se aplaza a
  propósito (`prommter/PEND-002`) y **nunca** se deja que N agentes en paralelo
  escriban el mismo `state.json` (`infrapilot/RSK-003`).
- **No subas nada a Permanent por tu cuenta** *(matizado el 2026-08-24, no
  derogado)*. El umbral de ≥3 sesiones + alto impacto + sin nombres ni rutas del
  proyecto (`~/.claude/agents/orion-curator.md:30-32`) **sigue aplicando cuando la
  repetición es dentro del MISMO proyecto**. Deja de aplicar cuando la lección ya
  se pagó en OTRO proyecto: ahí basta la segunda vez y se sube en el acto
  (`_permanent/KN-014`). Lo que no cambia: una **mera propuesta** jamás sube a
  Permanent sin confirmación del dueño, y nada sube arrastrando nombres o rutas
  del proyecto.
- **El vault es de una sola vía.** Las ediciones a mano en `vault/` son *insumo*
  para la próxima curación, no se sincronizan de vuelta a `state.json`.
- **Esto no es el cierre de caja del negocio.** Aquí "cierre" es el de la sesión
  de trabajo; el arqueo, el turno y a quién pertenece la plata están en
  [[TEMA-caja-y-turnos]].

## Hueco explícito

**El corpus no dice cómo se retira un TEMA del cerebro.** Para los objetos de
memoria existe todo el aparato —ArchiveRecord, invariante de no-borrado,
`check-r8.mjs`—, pero para los temas solo existe la regla de "refuerza, no
dupliques" y "documenta las dos versiones contradictorias". `cerebro.mjs` no tiene
comando de archivar ni de retirar (sus comandos son `indexar`, `buscar`, `tema`,
`estado`, `exportar`, más `citas` y `probar`, que ni siquiera aparecen en su
propia ayuda). Cuando un tema quede desactualizado, hoy no hay procedimiento
pagado con un fallo real: **no lo inventes en el momento, decídelo con el dueño y
escríbelo aquí.**

## Evidencia

- `infrapilot/KN-027` — la curación que borró `DEC-008` y `KN-022` sin
  ArchiveRecord, invisible al validador stateless; guarda `tools/check-r8.mjs`.
- `infrapilot/KN-007` — invariante `tier` ⟷ `lifetime` y las violaciones reales
  que reparó; chequeo en `ORION/tools/validate-memory.mjs:112-113`.
- `infrapilot/KN-009` — el hook de pre-commit valida la memoria en cada commit; la
  copia activa `.git/hooks/pre-commit` **no** está versionada y hay que
  reinstalarla tras un clon.
- `infrapilot/DEC-008` — ORION v3: `brief.md` como contexto primario del
  orquestador, reflector atómico con auto-validación, `wave.json`, vault Obsidian,
  y la política de que los scripts deterministas los corre el orquestador.
- `infrapilot/DEC-007` — ceremonia proporcional: reflexión siempre, pipeline
  completo solo para trabajo sustancial.
- `infrapilot/RSK-003` — 8 agentes en paralelo sobre el mismo `state.json`;
  escritura de memoria serializada.
- `prommter/PEND-002` — curación de infrapilot (52 objetos) bloqueada a propósito
  para evitar doble escritor sobre el árbol sucio de ORION.
- `prommter/KN-002` — lección de máquina atrapada en la memoria del proyecto
  equivocado; su propio `context` pide la copia a `permanent` que sigue sin hacerse.
- `_permanent/KN-002` — `subagent_tokens` medidos por spawn; el consumo inline del
  orquestador no está medido y **nunca se fabrica**.
- `_permanent/KN-014` — ley 1: una lección pagada en un segundo proyecto sube a
  permanent; el recuento de lecciones repetidas (8 en 6 proyectos / 5 en 4 / 8 en 6).
- `_permanent/KN-015` — ley 2: la regla no caduca, la coordenada sí; por eso el
  verificador comprueba `proyecto/ID` y no rutas.
- `infrapilot/RSK-001` (2026-07-28) vs `estanco-contable/KN-008` (2026-07-29, ya
  nacido `tier: Permanent`) vs `infrapilot/KN-035` (2026-08-24): **27 días de
  bloqueo, 26 de ellos con la refutación escrita en otra memoria**. RSK-001 es
  además el modelo de corrección con constancia: la premisa falsa se marcó dentro
  del texto, no se borró.
- Medición 2026-08-24 recorriendo los `state.json` de las 11 memorias: **23
  objetos con `tier: Permanent` guardados dentro de la memoria de un proyecto**
  (infrapilot 17, estanco-contable 5, arroces 1) sobre 265 objetos de proyecto,
  contra 16 objetos en `ORION/memory/permanent/state.json` cuyo `metrics.json`
  sigue en `sessionCount: 0`.
- Coordenadas podridas verificadas abriendo el disco: `estanco-contable/KN-005`
  dice `lib/dominio/facturacion.ts` y `fechaNegocio` se define en
  `lib/dominio/jornada.ts:34` (con `facturacion.ts:76` anunciando el traslado y la
  línea 84 re-exportando); `pollo-landing/DEC-001` apunta a
  `C:/Users/Kalel/fable 5/pollo-landing`, carpeta inexistente (`fable 5` solo tiene
  `.claude`, `wrd`, `wrd-serve.mjs`), con el repo real en
  `C:\Users\Kalel\prommter\proyectos\pollo-landing`.
- Ley 2 hecha máquina: `C:\Users\Kalel\ORION\tools\cerebro.mjs:509-513` — el
  verificador de citas resuelve `proyecto/ID` contra el índice y no intenta
  resolver ninguna ruta de archivo.
- Regla del curador matizada, no derogada:
  `~/.claude/agents/orion-curator.md:30-32` (*"referenced across ≥3 sessions AND
  High impact"*, *"Rare — when in doubt, don't"*).
- Medición 2026-08-24 con `validate-memory.mjs` sobre las 11 memorias: todas
  VÁLIDAS; avisan por >25 objetos placita (55), infrapilot (52), villa-broaster
  (39), estanco-contable (31) y wrd (26); estanco además avisa 2 archivables
  (`PEND-002`, `PEND-010`).
- Brief desfasado: `ORION/memory/infrapilot/brief.md:54,56` (46 objetos, v34,
  último AMM 2026-07-28) contra `state.json` (52 objetos, v36, `lastAmmRun`
  2026-08-16); lista `PEND-009/014/017` ya archivados (`ARC-19/20/21`) y omite
  `PEND-018` y `PEND-019`.
- Techo de brief roto: infrapilot 57, orama 69, estanco-contable 72, placita 88
  líneas contra el ≤50 de la regla 8 de `~/.claude/agents/orion-curator.md`.
- Contraejemplo bien curado: placita, 40 sesiones, 6 cierres con
  `triggeredBy: SESSION_CLOSE` en `metrics.json`, 32 ArchiveRecords y 0 objetos en
  estado terminal; la nota del cierre v31 deja escrita la comprobación
  *"76 IDs entrada = 76 salida"*.
- Procedimiento canónico: `~/.claude/skills/orion-close/SKILL.md`,
  `~/.claude/agents/orion-curator.md` (reglas 1-8),
  `~/.claude/agents/orion-reflector.md` (filtro de valor y orden dependency-safe),
  `~/.claude/agents/orion-harvester.md` (puerta de calidad de cuatro criterios).
- Puntaje del cerebro a lo largo del 2026-08-24, medido tres veces la misma noche:
  `cerebro.mjs probar` **18/26 (69%)** antes de escribir este tema → **22/26 (85%)**
  después → **26/26 (100%)** al cierre; `cerebro.mjs citas` **357 verificadas / 3
  rotas** → **786 verificadas / 0 rotas**. Las rotas del camino eran punteros a
  temas aún no escritos y una cita con el proyecto mal escrito en
  `donde-vive-el-dato.md` (nombraba `estanco-contable/KN-010` con el slug corto, que
  no existe como proyecto). Detalle que vale la ley 2: **el verificador es
  literal**, así que ni siquiera se puede citar de ejemplo una cita rota.

## Enlaces

- [[TEMA-modelos-y-costos]] — qué modelo lanzar en cada fase y por qué el cierre
  con haiku es barato pero necesita la guarda de `check-r8.mjs`.
- [[TEMA-verificar-con-evidencia]] — la disciplina de medir antes de afirmar, que
  es la misma que exige una cita por afirmación guardada.
- [[TEMA-entorno-de-la-maquina]] — por qué el cierre termina en commit local y el
  push se hace por GitHub Desktop.
- [[TEMA-caja-y-turnos]] — el otro "cierre", el del dinero del negocio.
