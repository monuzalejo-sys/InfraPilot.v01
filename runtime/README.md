# ORION Runtime — operacionalización para Claude

Este directorio versiona cómo se *corre* el estándar ORION. Es la FUENTE
CANÓNICA: 7 agentes de fase (uno por etapa del ciclo RFC-0003), 2 agentes de
conocimiento (landing-prompter, que escribe prompts de diseño y aprende de los
veredictos; orion-harvester, que alimenta el cerebro) y 6 skills.

## Instalación — un solo comando

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
3. Por defecto: `C:\Users\Kalel\ORION`.

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
