---
name: orion-plan
description: Convierte una idea dictada en el PLAN DE EJECUCIÓN de un proyecto — no el plan que se le enseña al cliente, sino el que dice qué vamos a construir nosotros, en qué orden, quién posee cada archivo, cómo se comprueba cada cosa, cuánto cuesta en tokens y cuánto se puede cobrar. Genera un registro consultable (plan.json) más su vista legible, con tareas por niveles de madurez y camino de mejora después de terminado. Usar cuando el usuario diga "hazme un plan", "planea este proyecto", "qué tareas hay que hacer", "/orion-plan", o cuando dicte un montón de ideas sobre un proyecto y haya que ordenarlas antes de construir.
---

# ORION Plan — el plan con el que TÚ vas a ejecutar

Norma: RFC-0008. Un plan en prosa hay que leerlo entero para usarlo; aquí el
plan es un **registro** al que se le pregunta «¿qué sigue?». La prosa se genera
desde el registro y nunca al revés.

`$ORION_HOME` = la raíz con `ORION_STANDARD.md` (por defecto `C:\Users\Kalel\ORION`).
Baúl: `C:\Users\Kalel\ORION-Vault`.

## 0. Qué te dieron

`args` es la idea en crudo: normalmente dictada, larga, con correcciones a
mitad, ejemplos y énfasis. **No la interpretes tú.** Ese es el trabajo del
traductor, y el motivo de que exista: un mensaje dictado leído en crudo pierde
las correcciones y convierte los ejemplos en requisitos.

Si `args` viene vacío, pregunta de qué proyecto es el plan y qué se quiere
lograr. Una sola pregunta.

Identifica el proyecto: `projectId` = carpeta del repo, en minúsculas. Memoria
= `<raíz-del-repo-más-externa>/memory/<projectId>/`. El plan vive ahí, junto a
`state.json`.

## 1. Entender y ubicar — en paralelo, siempre

Lanza los dos en UN solo mensaje:

- **`orion-traductor`** (opus) con la idea en crudo **tal cual**, sin resumir.
  Devuelve el ENCARGO: entregables, decisiones ya tomadas, correcciones,
  ejemplos que no son requisitos, huecos con su asunción, tensiones y fuera de
  alcance.
- **`orion-bibliotecario`** (haiku) con la pregunta en las palabras del dueño y
  el directorio del proyecto. Devuelve el PAQUETE DE RUTA: coordenadas de lo
  que el ecosistema ya sabe.

De aquí en adelante **el ENCARGO es la fuente de verdad de lo que se pidió**, y
las rutas se EXCERPTAN a los briefs siguientes. Ningún agente posterior vuelve
a leer el mensaje original ni a buscar en el cerebro.

Si el traductor devuelve ESCALATE, haz sus preguntas al usuario y para. Si
devuelve tensiones, **dilas antes de construir el plan**, no después.

## 2. Abrir el registro

```bash
node "$ORION_HOME/tools/plan.mjs" nuevo "<memory-dir>" --proyecto <projectId> --objetivo "<la frase del ENCARGO>" --modo <genesis|evolucion>
```

**El modo no es un detalle** (N8-R2): `genesis` es construir de cero — nada que
romper, paralelismo ancho. `evolucion` es que hay un sistema vivo y alguien
usándolo — toda tarea nace con chequeo de regresión y el radio de daño manda
sobre el tamaño. Míralo, no lo supongas: si hay código y hay usuario, es
`evolucion`.

Si ya existe un `plan.json`, **no lo reemplaces**: léelo con `estado` y trabaja
sobre él. Un plan con tareas hechas es historia medida; rehacerlo la borra.

## 3. La estructura y las tareas propias — `orion-arquitecto` (opus)

Bríefalo con: el ENCARGO completo, el directorio del proyecto, el modo, y las
2-5 rutas del bibliotecario que apliquen (excerptadas, no las rutas para que
las relea).

Devuelve el perfil observado y las tareas que solo este proyecto necesita.
Aplícalos:

```bash
node "$ORION_HOME/tools/plan.mjs" perfil "<plan.json>" --set stack=... --set superficies=... --set entidades=... --set rutas=... --set publico=... --set dineroReal=... --set datosPersonales=... --set multiUsuario=... --set equipo=...
node "$ORION_HOME/tools/plan.mjs" agregar "<plan.json>" --archivo <tareas-del-arquitecto.json>
```

El perfil es lo que hace que un catálogo genérico produzca un plan específico:
**una entidad de más genera trabajo inventado, y ese trabajo se hace**. Si el
arquitecto no pudo señalar una entidad en un archivo, no la metas.

## 4. Lo que el proyecto necesita aunque nadie lo pidió — el catálogo

```bash
node "$ORION_HOME/tools/plan.mjs" generar "<plan.json>" --dry     # mira cuánto entra
node "$ORION_HOME/tools/plan.mjs" generar "<plan.json>"
```

El catálogo es la respuesta a «¿qué se me está olvidando?», que es la pregunta
que una conversación nunca contesta bien. Instancia por nivel de madurez y por
cada entidad/ruta real del perfil.

Si `--dry` devuelve un número que no cabe en la vida del proyecto, **acota por
nivel** (`--nivel N0,N1,N2`) en vez de podar a mano: los niveles altos siguen
en el catálogo y entran cuando toque. Un plan no se recorta borrando trabajo
real; se recorta diciendo hasta dónde llega esta etapa.

## 5. El número — `orion-estratega` (sonnet)

En paralelo con el paso 4. Bríefalo con: el objetivo, el perfil, el nicho del
negocio y el presupuesto que devuelve `plan.mjs estado`. Devuelve costo de
construcción, costo mensual de tenerlo vivo, comparables con URL y precio
propuesto con todos sus supuestos.

Pega su bloque `NEGOCIO` en `plan.json`. **Sin `supuestos` el plan no valida**
(N8-R7) — y eso es a propósito: una cifra sin supuestos es una cifra inventada
con buena presentación.

## 6. Lo que solo tú puedes escribir

El registro ya tiene las tareas. Faltan cuatro cosas que ningún agente sabe y
que son las que hacen que el plan se lea:

1. **`resumen`** — 3-8 líneas: el plan entero en una lectura. Es lo que evita
   que alguien tenga que abrir las 400 tareas para saber de qué va.
2. **`niveles[].meta` y `niveles[].salida`** — qué persigue cada nivel en este
   proyecto y **la condición observable con la que se sale de él**.
3. **`hitos`** — los 3-6 momentos que le importan al dueño («el cliente puede
   cobrar», «está en internet»), cada uno con las tareas que lo componen y su
   criterio comprobable.
4. **`escalabilidad`** — qué se hace DESPUÉS de terminar, cada mejora con su
   **disparador observable** (N8-R6): «cuando pasen 500 pedidos al día», no
   «más adelante». Una mejora sin disparador es un deseo y no se agenda.

Escríbelas en un archivo y entra con un comando — **no edites `plan.json` a
mano**: retocar un registro de 400 tareas con un editor de texto es como se
corrompe:

```bash
node "$ORION_HOME/tools/plan.mjs" narrar "<plan.json>" --archivo narrativa.json
```

Los ids de `hitos[].requiere` y `escalabilidad[].tareas` se pueden dar **por
título**: el comando los resuelve y avisa de los que no existen. Y rechaza una
mejora sin disparador, que es la forma de que N8-R6 no dependa de que alguien
se acuerde.

## 7. Comprobar y publicar

```bash
node "$ORION_HOME/tools/plan.mjs" validar "<plan.json>"     # forma ejecutable de RFC-0008 §5
node "$ORION_HOME/tools/plan.mjs" md "<plan.json>"          # PLAN.md, generado
node "$ORION_HOME/tools/baul.mjs" empujar --proyecto <projectId> --sin-export
```

Si `validar` da INVÁLIDO, **arréglalo antes de enseñar el plan**. Los errores
que más salen y qué significan de verdad:

- *«ninguna aceptación es un hecho observable»* — esa tarea no se puede
  terminar, solo abandonar.
- *«ceremonia sin posee»* — esa tarea no se puede lanzar en paralelo sin
  arriesgar una colisión.
- *«modo evolución sin chequeo de regresión»* — esa tarea puede romper algo que
  hoy funciona y nadie se enteraría.

## 8. Entregar

Al usuario, en español, **≤35 líneas**:

1. **El plan en una frase** y el modo (génesis o evolución), con por qué.
2. **La cuenta**: N tareas, repartidas por categoría y por nivel. Una tabla.
3. **Los hitos** con lo que hace falta para cada uno.
4. **Lo que cuesta**: presupuesto en tokens de subagente, costo mensual de
   tenerlo vivo, precio propuesto — cada cifra con su supuesto en media línea.
5. **Los huecos del ENCARGO**: lo que falta decidir, con la asunción que se
   tomó mientras tanto. Esto es lo primero que el dueño debe leer.
6. **La primera ola**, tal cual sale de:

   ```bash
   node "$ORION_HOME/tools/plan.mjs" ola "<plan.json>" --max 4
   ```

7. Y cómo se ejecuta, literalmente: `/orion T-001` corre una tarea del plan de
   punta a punta y la marca hecha con su evidencia y su gasto medido.

**No pegues el plan entero.** Está en `PLAN.md` y en el baúl; pegarlo aquí es
gastar el contexto en algo que ya está en disco (N8-R11).

## Lo que este skill NO hace

No construye. Al terminar hay un plan, no código. Si el usuario quiere que
además se ejecute, eso es `/orion` — y ahora `/orion` sabe leer el plan.
