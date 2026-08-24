---
slug: olas-de-agentes
titulo: Repartir trabajo entre agentes en paralelo sin colisiones ni pérdidas
alias: [ola, olas, ola de agentes, olas de agentes, agentes en paralelo, varios agentes, repartir trabajo, dividir el trabajo, dividir la tarea, partir la tarea, parto la tarea, en cuantos pedazos, pedazos, trozos, trocear, partir en pedazos, granularidad, un builder por paso, por pasos, tamano del encargo, equipo de agentes, paralelo, paralelizar, paralelismo, builder, builders, subagente, subagentes, spawn, spawns, wave, wave.json, manifiesto de ola, colision, colisiones, conflicto de archivos, pisarse, se pisan, muerte de agente, agente muerto, se murio, se murieron, se cayo, se cayeron, limite de sesion, infra-death, infra death, reanudar, reanudacion, recuperar ola, recuperacion de ola, respawn, relanzar, orquestador, orquestrador, contratos, ownership, propiedad de archivos, SendMessage, trabajo perdido]
preguntas: ["¿por qué se me murieron los agentes a mitad de la ola?", "¿cómo reparto el trabajo entre varios agentes?", "¿cómo lanzo varios builders sin que se pisen los archivos?", "¿qué hago si un builder se cayó a mitad del trabajo?", "¿cómo recupero una ola que murió?", "¿cuántos agentes puedo lanzar a la vez?"]
proyectos: [infrapilot, estanco-contable, villa-broaster, wrd, placita, landings]
confianza: alta
actualizado: 2026-08-24
---

# Repartir trabajo entre agentes en paralelo sin colisiones ni pérdidas

## Respuesta corta

**Escribe tú los archivos compartidos ANTES de repartir**: tipos, seed, tokens de
diseño y esqueletos van a disco primero, se declaran **intocables** en cada brief, y
cada agente recibe archivos propios que nadie más toca. **Deja `wave.json` escrito
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

Ahí está la respuesta a *"¿por qué se me murieron a mitad de la ola?"*: **no fallaron
los modelos, se acabó la sesión**, y se acabó para todos al mismo tiempo porque el
paralelismo consume la cuota compartida en paralelo. Por eso un infra-death jamás se
anota como señal de capacidad del modelo (`wrd/KN-005`, `infrapilot/KN-018`).

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

## Cómo se aplica

**Antes de lanzar (esto es la mitad del trabajo):**

1. **Escribe tú los archivos compartidos y decláralos intocables** en cada brief:
   contrato de tipos, seed/datos de demo, tokens visuales, esqueletos de página. Los
   builders codean contra archivos **reales en disco**, no contra una descripción
   (`estanco-contable/KN-001`, `villa-broaster/KN-006`).
2. **Reparte por propiedad disjunta de archivos**, no por "tema". Cada brief dice
   *exactamente* qué archivos/namespace posee ese agente y que no toque nada más
   (`ORION/runtime/skills/orion.SKILL.md:188-196`). Si dos tienen que tocar el mismo
   archivo, el trabajo está mal cortado.
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

**Cuando uno cae (protocolo de recuperación, en este orden):**

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
13. **Anótalo como evento de infraestructura, no como fallo del modelo**: la convención
    es `verdict: fail` con la fase sufijada `:infra-death` (ej. `build:page:infra-death`),
    porque el validador de `metrics.json` solo acepta `ok|fail|escalate` (`wrd/KN-005`).

**Al cerrar la ola:**

14. Descomenta/cablea los contratos cruzados que quedaron en TODO y **vuelve a
    verificar** (`infrapilot/KN-026`).
15. **Solo el orquestador escribe la memoria**, después de recolectar los veredictos
    (`infrapilot/RSK-003`).
16. Borra `wave.json` (`ORION/runtime/skills/orion-close.SKILL.md:31`).

## Cuándo NO aplica

- **Tarea de 1 a 4 archivos: no montes ola.** Lo trivial va inline con cero spawns;
  2-4 archivos, un builder y un verificador. El pipeline completo costó **~10x** para
  un README de 91 líneas (`infrapilot/DEC-007`). Una ola tiene costo fijo de
  orquestación que solo se amortiza con trabajo de verdad — ver [[TEMA-modelos-y-costos]].
- **Agentes que escriben su propia memoria NO se paralelizan.** Ocho `landing-prompter`
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

**Reparto sin colisiones**
- `estanco-contable/KN-001` — pre-materializar tipos + seed + `globals.css`: 0 TODOs, 0 fix-cycles.
- `villa-broaster/KN-006` — recurso compartido intocable + contratos HTTP: 5/5 spawns limpios.
- `wrd/KN-003` — esqueletos del orquestador + namespaces estrictos: 4 builders, 0 conflictos.
- `infrapilot/KN-026` — contratos cruzados con TODO comentado: funciona, cuesta un micro-fix.
- `infrapilot/KN-031` — el solape de propiedad ENTRE olas no lo cubre nada de lo anterior.
- `infrapilot/RSK-003` — 8 agentes paralelos sobre el mismo `state.json` lo corrompen.

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
