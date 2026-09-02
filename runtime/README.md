# ORION Runtime — operacionalización para Claude

Este directorio versiona cómo se *corre* el estándar ORION. Es la FUENTE
CANÓNICA: **13 agentes y 8 skills**, todos bajo el prefijo `orion-`.

| Grupo | Agentes |
|---|---|
| Fase (uno por etapa de RFC-0003) | `orion-analyst` · `orion-planner` · `orion-builder` · `orion-verifier` · `orion-fixer` · `orion-reflector` · `orion-curator` |
| Entrada (entender y ubicar antes de gastar) | `orion-traductor` (idea dictada → encargo) · `orion-bibliotecario` (dónde está, en coordenadas) |
| Diseño de trabajo | `orion-arquitecto` (estructura del código y número de tareas) · `orion-estratega` (costo, precio y nicho) |
| Conocimiento | `orion-landing` (prompts de diseño) · `orion-harvester` (alimenta el cerebro) |

Skills: `orion` (ejecutar) · `orion-plan` (planear) · `orion-baul` (pasarela a
la bóveda) · `orion-close` (cerrar) · `orion-status` (orientarse) ·
`orion-cerebro` (preguntar) · `orion-validate` (comprobar memoria) ·
`orion-diseno` (sistema visual).

## Una sola verdad — `runtime/` manda

El runtime vive en tres sitios: aquí, en `~/.claude` (las copias que Claude
carga) y embebido en `tools/instalar-orion.mjs` (para instalar en otra máquina).
Mantenerlos a mano falló: el 2026-08-26 había **5 de 15 archivos distintos**, con
deriva en las DOS direcciones —mejoras vivas que el repo no tenía y mejoras del
repo que nunca llegaron a ejecutarse—, y correr el instalador habría revertido
las primeras sin avisar.

```
node tools/runtime.mjs estado        # deriva a tres bandas, con fechas
node tools/runtime.mjs sincronizar   # runtime/ → ~/.claude → payload del instalador
node tools/runtime.mjs recoger --solo <nombre>   # rescate: ~/.claude → runtime/
```

**Mira las fechas antes de elegir**: `sincronizar` escribe desde el repo, así
que si lo bueno está en la copia viva hay que `recoger` primero. Editar un
agente y no sincronizar es exactamente cómo se pierde el trabajo.

## Instalación en otra máquina — un solo comando

```
node tools/instalar-orion.mjs
```

Escribe las copias operativas donde Claude Code realmente las carga:

- `~/.claude/skills/<nombre>/SKILL.md`  ← `runtime/skills/<nombre>.SKILL.md`
- `~/.claude/agents/<nombre>.md`        ← `runtime/agents/<nombre>.md`

Es idempotente y no borra nada: si un archivo cambia, guarda un `.bak` al lado
(ignorados por git) y verifica al final que los archivos quedaron en disco y
que su frontmatter parsea. Otras banderas:

| Bandera | Efecto |
|---|---|
| `--check` | muestra qué haría, sin escribir |
| `--sync-repo <ruta>` | además refresca `<ruta>/runtime/` desde el contenido embebido |
| `--repo-only <ruta>` | SOLO refresca `<ruta>/runtime/`, no toca `~/.claude` |
| `--home <ruta>` | usa otra carpeta en vez de `~/.claude` |

**Después de instalar hay que reiniciar Claude Code**: las skills y los agentes
se cargan al arrancar la sesión.

## Cowork / app de escritorio

Cowork no lee `~/.claude`. Ahí el runtime se instala como plugin: mismo
contenido, empaquetado en `orion.plugin` (manifiesto + `skills/<n>/SKILL.md` +
`agents/*.md`). Se instala desde el chat con el botón del archivo.

Los dos destinos salen del MISMO contenido, así que no hay dos verdades: se
edita aquí y se reinstala.

## `ORION_HOME` — rutas portables

Ninguna skill trae rutas absolutas de máquina en sus instrucciones. Cada una
resuelve `ORION_HOME` (la raíz que contiene `ORION_STANDARD.md`, `RFC/`,
`tools/`, `memory/`) así:

1. Variable de entorno `ORION_HOME`.
2. El ancestro más cercano del directorio de trabajo con `ORION_STANDARD.md`.
3. Por defecto: `$ORION_HOME`.

Y adapta cómo lee según el entorno, porque no es el mismo acceso:

| Entorno | Acceso a ORION_HOME |
|---|---|
| Claude Code (terminal) | `Bash` / `Read` directo |
| Cowork en la nube | puente del escritorio: `device_bash` con `~/mnt/ORION`; el `Bash` del contenedor NO ve la carpeta |
| Cowork en tu computador | carpeta montada localmente |

## El modelo de runtime

La conversación principal actúa como Runtime/orquestador de ORION. Cada fase
del ciclo (RFC-0003) mapea a un contrato de comportamiento (RFC-0002) y a un
subagente dedicado:

| Fase        | Contrato                | Agente           | Herramientas |
|-------------|-------------------------|------------------|-----------|
| ANALYZING   | orion:analysis:v1       | orion-analyst    | solo lectura |
| PLANNING    | orion:planning:v1       | orion-planner    | solo lectura |
| BUILDING    | orion:build:v1          | orion-builder    | completas (1 por paso, paralelo si son independientes) |
| VERIFYING   | orion:verification:v1   | orion-verifier   | lectura + correr tests (sin editar) |
| FIXING      | orion:fix:v1            | orion-fixer      | solo los artefactos que nombra el QAReport |
| REFLECTING  | orion:reflection:v1 + orion:memory:v1 | orion-reflector | escribe memory/*.json |
| (curación)  | AMM SPECIFICATION §5-§7 | orion-curator    | dedupe/archiva/compacta memory/*.json |

La reflexión/memoria se persiste en `../memory/<projectId>/state.json` y
`metrics.json` según el esquema de objetos AMM
(`../Skills/autonomous-memory-manager/schemas/`). Los archivos de memoria se
validan con `node ../tools/validate-memory.mjs <memory-dir>` después de cada
reflexión y en el cierre de sesión; el reflector además registra
`modelOutcomes` ({phase, model, verdict}) por corrida, que las corridas futuras
leen para calibrar la elección de modelo (la estrategia ADAPTIVE de RFC-0004
implementada sin medición de tokens). La economía de contexto se impone con
briefs de mínimo privilegio (el orquestador lee memoria/convenciones una vez y
extracta hacia cada brief) y topes duros de salida en cada agente.

## Política de modelo — adaptativa por dificultad (techo: Opus)

El orquestador elige el modelo de cada agente por dificultad, pasándolo en el
parámetro `model` de la herramienta Agent (sobrescribe el frontmatter):

| Dificultad | Modelo | Ejemplos |
|-----------|--------|----------|
| Trivial   | haiku  | renombrar/formatear, valor de config, componente estático pequeño, persistir JSON de memoria |
| Normal    | sonnet | endpoint CRUD, conectar formulario↔API, componente con estado, la mayoría de análisis/planeación/QA |
| Hard      | opus   | diseño de esquema+RLS, debugging sutil, arquitectura de módulo nuevo, sensible a seguridad |

El `orion-analyst` califica dificultad por sub-objetivo/paso; esas
calificaciones eligen el modelo de cada builder/verifier/fixer. Los builders
corren uno por paso, así que un mismo plan puede mezclar un paso haiku y uno
opus en paralelo. El frontmatter de cada agente lleva un default seguro
(sonnet; reflector haiku) para que un spawn ingenuo nunca herede el modelo de la
conversación principal. En este entorno no hay medición de tokens en vivo — la
elección de modelo es la palanca de costo real.

Nota: no hay demonio siempre encendido. El sistema corre cuando se invoca
`/orion` en una conversación; el orquestador hace de runtime para esa tarea.
