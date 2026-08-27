---
slug: planes-de-ejecucion
titulo: Cómo se planea el trabajo de un proyecto para ejecutarlo con agentes
alias: [plan, planes, plan de trabajo, plan de ejecucion, plan del proyecto, planear, planificar, planeacion, planificacion, hacer un plan, armar el plan, hazme un plan, necesito un plan, quiero un plan, por donde empiezo, por donde arranco, que hago primero, que sigue, que sigue ahora, cual es la siguiente tarea, siguiente tarea, proxima tarea, tareas, lista de tareas, cuantas tareas, numero de tareas, cuantas tareas hay, en cuantas tareas, backlog, roadmap, hoja de ruta, hoja de trabajo, etapas, fases del proyecto, niveles, nivel de madurez, madurez, N0, N1, N2, N3, N4, cimientos, escalar, escalabilidad, mejoras despues, que sigue despues de terminar, terminar el proyecto, cuando esta terminado, plan.json, planmjs, plan mjs, registro de tareas, catalogo, arquetipo, arquetipos, que se me olvida, que me falta, que falta por hacer, checklist del proyecto, ceremonia, presupuesto de tareas, cuanto va a costar el proyecto, construir de cero, genesis, modificar lo que existe, evolucion, brownfield, greenfield, plan para el cliente, plan para nosotros, plan de equipo, posee, propiedad de archivos, criterios de aceptacion, criterio que cuantifica, ninguna ruta, todo componente, cada modulo, glob en posee, dos tareas se pisan, ola disjunta, plan.mjs ola]
preguntas: ["hazme un plan para este proyecto", "por donde empiezo con este proyecto", "cuantas tareas hace falta para terminar esto", "que hago primero y que despues", "que se me esta olvidando en este proyecto", "que sigue ahora", "como se cuando el proyecto esta terminado", "que hacemos despues de entregarlo"]
proyectos: [orion, infrapilot, villa-broaster, placita, orama]
confianza: alta
actualizado: 2026-08-27
---

# Cómo se planea el trabajo de un proyecto para ejecutarlo con agentes

## Respuesta corta

**El plan no es un documento: es un registro al que se le pregunta.** Vive en
`<memoria>/plan.json`, y cualquier prosa (`PLAN.md`) se GENERA desde él. Nunca
lo leas entero para elegir trabajo — pregúntale: `plan.mjs siguiente` da las
tres tareas listas en cinco líneas, `plan.mjs ola` da el conjunto más grande de
tareas paralelas **sin colisión de archivos**, y `plan.mjs brief T-042` produce
el encargo completo, determinista y a coste cero. Cada tarea trae **por qué**
(qué se rompe si no se hace), **qué hacer** (pasos sin ambigüedad), **qué
archivos posee en exclusiva**, y **cómo se comprueba** (un comando con su
salida esperada, nunca un adjetivo). El plan se ordena por **niveles de
madurez** —N0 cimientos, N1 funciona, N2 aguanta, N3 escala, N4 excelencia—, no
por áreas, y cada nivel tiene una condición observable para darse por
terminado. Y declara **modo**: `genesis` (de cero, nada que romper) o
`evolucion` (hay sistema vivo y alguien usándolo, así que **toda** tarea lleva
chequeo de regresión).

## Por qué (qué lo pagó)

**Porque el plan que existía era para otra persona.** El de villa-broaster
—`PLAN-EQUIPO.md` con E1..E8 y tarjetas `T-01..T-11`— está bien hecho y sirve:
le dice a un humano qué recibe y de qué responde. Pero no le sirve al runtime,
que necesita otra cosa: qué archivo toca cada tarea, qué comando la comprueba,
y qué se puede lanzar en paralelo. Faltaba el plan **de ejecución**, y sin él
esa decisión se re-tomaba en conversación en cada sesión.

**Porque re-derivar cuesta 83k por tarea, medidos.** Análisis 64k + planeación
19k, promedio sobre 24 y 6 spawns respectivamente (`orion/KN-002`). Si la tarea
ya está especificada en el registro, `plan.mjs brief` la sirve por cero: en un
proyecto de 40 tareas son **3,3 M de tokens** que dejan de gastarse sin tocar
la calidad de nada (`orion/KN-003`). Es la palanca de gasto más grande del
ecosistema y la única sin contraindicación.

**Porque un plan de mil tareas en prosa es inservible.** Leerlo entero para
sacar una tarea es exactamente el costo que la economía de contexto existe para
evitar. De ahí la regla dura: la selección es por consulta, nunca por lectura
completa (RFC-0008 N8-R11).

**Porque las colisiones entre builders son el fallo #1 medido**, y hasta ahora
evitarlas dependía de que el orquestador se acordara. Con `posee` obligatorio
por tarea, «¿estas dos se pisan?» pasa a ser una pregunta que responde un
script (`plan.mjs ola`), no un juicio a las 2 de la mañana.

**Con un límite que ya se pagó: `ola` compara listas `posee`, y la propiedad real
la fijan los CRITERIOS.** El 2026-08-26 dos tareas con `posee` disjunto
(`lib/servidor/respuesta.ts` vs `lib/dominio/**`) colisionaron en las mismas 24
rutas de `app/api`, porque sus criterios eran *"ninguna ruta arma JSON a mano"* y
*"ninguna ruta pasa de 60 líneas"* (`villa-broaster/KN-023`). **Un criterio que
empieza por "ninguna ruta…", "todo componente…" o "cada módulo…" es una
declaración de propiedad sobre ese glob**: o se escribe en `posee`, o `ola` va a
dar por paralelizables dos tareas que no lo son. Al redactar la tarjeta, la regla
práctica es: si el criterio cuantifica sobre un glob, ese glob entra en `posee`.

**Porque «qué se me está olvidando» es la pregunta que una conversación nunca
contesta bien.** Por eso el plan se arma de dos fuentes y hacen falta las dos:
el **catálogo** de arquetipos (lo que cualquier proyecto de esta forma necesita
en cada nivel) y las **tareas propias** que solo se saben leyendo este repo. El
catálogo trajo, la primera vez que se cruzó con un proyecto real, tareas de
respaldo ensayado y de habeas data que nadie había puesto en ninguna lista.

## Cómo se aplica

1. **Traduce antes de planear.** Si la idea vino dictada, pásala por
   `orion-traductor`: separa las correcciones que hiciste a mitad, los ejemplos
   que no son requisitos, el énfasis («mil tareas») de la lectura operativa, y
   deja cada hueco con su asunción por defecto. Un planeador que lee el dictado
   en crudo se lleva el ejemplo por requisito.
2. **Declara el modo mirando, no suponiendo.** ¿Hay código y hay alguien
   usándolo? Es `evolucion`, y entonces cada tarea nace con su regresión.
3. **El perfil se observa del disco.** Stack, superficies, entidades, rutas,
   roles. **Una entidad que no puedas señalar en un archivo no entra**: el
   catálogo instancia una tarea por entidad, y una entidad inventada genera
   trabajo inventado que después alguien hace (N8-R9).
4. **Genera del catálogo y acota por nivel, no a mano.** Si `generar --dry`
   devuelve más de lo que cabe en la vida del proyecto, limita con
   `--nivel N0,N1,N2`. Un plan no se recorta borrando trabajo real; se recorta
   diciendo hasta dónde llega esta etapa.
5. **Añade lo propio con `orion-arquitecto`**, que además decide el número de
   tareas con una cuenta que se puede mostrar: entidades × trabajo por entidad
   + pantallas × trabajo por pantalla + integraciones + transversal.
6. **Escribe tú las cuatro cosas que ningún agente sabe**: el `resumen` (el
   plan entero en una lectura), la meta y la **condición de salida observable**
   de cada nivel, los hitos que le importan al dueño, y la escalabilidad —cada
   mejora con su **disparador observable** («cuando pasen 500 pedidos al día»),
   porque una mejora sin disparador es un deseo y no se agenda (N8-R6).
7. **Valida antes de enseñarlo.** `plan.mjs validar` es la forma ejecutable de
   la norma. Los tres errores que más salen dicen algo grave: «ninguna
   aceptación es un hecho observable» = esa tarea no se puede terminar, solo
   abandonar; «ceremonia sin posee» = no se puede paralelizar sin arriesgar
   colisión; «modo evolución sin regresión» = puede romper algo vivo y nadie se
   enteraría.
8. **Cierra el bucle al terminar cada tarea**: `plan.mjs hecho T-042
   --evidencia "<lo que se OBSERVÓ>" --tokens <medidos>`. Sin la escritura de
   vuelta el plan es un documento; con ella es un lazo de control, y es el lazo
   lo que hace que el presupuesto converja en vez de seguir siendo una
   estimación prestada (N8-R10).

## Cuándo NO aplica

- **Tareas sueltas y triviales.** Un arreglo de un archivo no necesita entrar
  al registro: la ceremonia tiene que ser proporcional. El plan es para el
  trabajo que dura más de una sesión.
- **Cuando el dueño todavía no decidió qué es el producto.** Un plan sobre una
  idea sin cerrar produce tareas que se descartan enteras. Eso es un encargo
  con huecos, no un plan.
- **El plan del cliente sigue siendo otra cosa.** Este no lo reemplaza: el
  cliente necesita saber qué recibe, cuándo y por cuánto, y eso se escribe para
  una persona con nombre (ver [[TEMA-documentos-para-personas]]). Enseñarle a
  un cliente un registro de 400 tareas es la forma más rápida de que deje de
  leer.
- **Un plan viejo con tareas hechas no se rehace.** Eso borra historia medida.
  Se lee con `estado` y se sigue.

## Evidencia

- `RFC/RFC-0008-EXECUTION-PLANS.md` — la norma completa: forma del objeto, los
  cinco niveles con su condición de salida, y §5 la conformidad, que es lo que
  `plan.mjs validar` ejecuta.
- `tools/plan.mjs` — implementación de referencia; `catalogo/_ESQUEMA.md`, el
  formato de los arquetipos.
- `orion/DEC-002` (el plan es un registro), `orion/KN-003` (83k por tarea que
  se ahorran), `orion/KN-006` (`porCada`: cómo un catálogo acotado produce
  cientos de tareas sin inventar ninguna), `orion/KN-007` (`ola` vuelve
  computable la no-colisión).
- `orion/KN-002` — las medias medidas de las que sale el presupuesto: análisis
  sonnet 64k sobre 24 spawns, planeación 19k sobre 6.
- `villa-broaster/DEC-010` y `prommter/KN-001` — el plan **para personas**, que
  es el otro artefacto y no se mezcla con éste.

## Enlaces

[[TEMA-encargos-verificables]] (cada tarea del plan es un encargo: las mismas
reglas de criterio comprobable) · [[TEMA-olas-de-agentes]] (`posee` y `ola` son
la versión computable de su doctrina) · [[TEMA-modelos-y-costos]] (de dónde
sale el presupuesto y la ceremonia de cada tarea) ·
[[TEMA-que-es-estar-verificado]] (qué cuenta como evidencia para marcar una
tarea hecha) · [[TEMA-documentos-para-personas]] (el plan del cliente, que es
otro documento) · [[TEMA-cero-datos-inventados]] (N8-R9 es esa misma regla
aplicada a los planes).
