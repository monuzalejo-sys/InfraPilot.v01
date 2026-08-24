---
slug: memoria-y-cierre
titulo: Cómo se cierra una sesión y qué merece quedar guardado
alias: [cerrar sesion, cerrar la sesion, cierre de sesion, cierre, cerrar, close session, session close, terminar de trabajar, acabar de trabajar, fin de sesion, memoria, memoria del proyecto, memorias, guardar, donde guardo, que guardo, guardado, apuntar, anotar, notas, apuntes, bitacora, aprendi, aprendizaje, aprendizajes, leccion, lecciones, reflexionar, reflexion, reflector, curacion, curar, curador, curator, archivar, archivado, deduplicar, duplicados, brief, state, metrics, amm, validar memoria, validador, tier, lifetime, permanente, cerebro, boveda, tema, temas, cosechar, cosecha, harvester, vault, obsidian, commit de memoria]
preguntas: ["como se cierra una sesion de trabajo", "donde guardo lo que aprendi", "que hago al terminar de trabajar", "que merece quedar guardado en la memoria del proyecto", "por que la memoria crece y nadie la limpia", "donde va una leccion que sirve en otro proyecto"]
proyectos: [infrapilot, _permanent, prommter, placita, villa-broaster, estanco-contable]
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
se toco)"*. Cuatro días después, los 11 objetos de `_permanent` no contienen ni
una mención a powershell o utf-8, y el árbol de ORION **sigue** con
`memory/infrapilot/state.json` y `metrics.json` modificados sin commit. El paso
aplazado no se hizo porque **el cierre no terminó en commit**: ese es el
mecanismo exacto por el que se pierde una lección ya escrita.

**Un solo escritor a la vez.** La curación de infrapilot lleva bloqueada desde el
2026-08-20 y fue una decisión, no un olvido: la sesión organizadora *no* la hizo
a propósito **para evitar doble escritor** sobre un árbol sucio
(`prommter/PEND-002`). Está medido por qué: 8 `landing-prompter` en paralelo
comparten `ORION/memory/landings/state.json` y por eso se les prohibió escribir
(`infrapilot/RSK-003`).

**El cierre es también donde se toma la nota del cerebro.** Hoy
`cerebro.mjs probar` da **18/26 preguntas (69%)** y `cerebro.mjs citas` reporta
275 citas verificadas con 5 rotas —todas apuntando a temas aún no escritos—. Ese
número es la diferencia entre un ecosistema que aprende y uno que solo acumula.

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
3. **El cajón por alcance:**

   | Qué es | Dónde va |
   |---|---|
   | Lo que la próxima sesión debe leer primero | `<memoria>/brief.md` (≤50 líneas, se **regenera**) |
   | Hecho que solo vive dentro de un proyecto | objeto en el `state.json` de ese proyecto |
   | Hecho de la máquina (rutas, herramientas, límites) | `ORION/memory/permanent/state.json` |
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
- **No subas nada a Permanent por tu cuenta.** Solo si se referenció en ≥3
  sesiones, es de alto impacto y no lleva nombres ni rutas del proyecto — y una
  mera propuesta jamás sube a Permanent sin confirmación del dueño.
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
- Puntaje del cerebro al 2026-08-24: `cerebro.mjs probar` pasó de **18/26 (69%)
  antes de escribir este tema a 22/26 (85%) después**; `cerebro.mjs citas` da 357
  verificadas y 3 rotas, todas apuntando a `cero-datos-inventados`, un tema aún
  no escrito.

## Enlaces

- [[TEMA-modelos-y-costos]] — qué modelo lanzar en cada fase y por qué el cierre
  con haiku es barato pero necesita la guarda de `check-r8.mjs`.
- [[TEMA-verificar-con-evidencia]] — la disciplina de medir antes de afirmar, que
  es la misma que exige una cita por afirmación guardada.
- [[TEMA-entorno-de-la-maquina]] — por qué el cierre termina en commit local y el
  push se hace por GitHub Desktop.
- [[TEMA-caja-y-turnos]] — el otro "cierre", el del dinero del negocio.
