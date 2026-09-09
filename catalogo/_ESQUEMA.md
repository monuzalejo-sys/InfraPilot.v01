# Catálogo de arquetipos de tarea — formato

Un **arquetipo** es una tarea que *cualquier* proyecto de cierta forma necesita
en cierto nivel. No es una tarea concreta: es la plantilla de la que
`tools/plan.mjs generar` saca tareas concretas para un proyecto real.

Norma: RFC-0008 §3. Un archivo JSON por categoría, en esta carpeta.

## Estructura del archivo

```json
{
  "categoria": "seguridad",
  "nombre": "Seguridad",
  "meta": "Que nadie haga lo que no le toca, y que se pueda demostrar.",
  "arquetipos": [ /* … */ ]
}
```

## Estructura de un arquetipo

```json
{
  "id": "sec.auth.limite-intentos",
  "titulo": "Limitar intentos de login por cuenta y por IP",
  "nivel": "N1",
  "dificultad": "normal",
  "ceremonia": "1-builder",
  "porQue": "Sin límite, un diccionario de 10.000 claves se prueba entero en minutos contra el PIN de la cajera.",
  "queHacer": [
    "Contar intentos fallidos por (usuario, ventana de 15 min) y por (IP, ventana de 15 min), en el servidor.",
    "Al 5º fallo de la cuenta, rechazar durante 15 min con un mensaje que NO revele si el usuario existe.",
    "Registrar cada bloqueo con hora, usuario e IP en la tabla de auditoría.",
    "El contador se reinicia con un login correcto, no con el paso del tiempo solamente."
  ],
  "aceptacion": [
    { "check": "6 intentos fallidos seguidos devuelven 429 en el 6º",
      "comando": "npm test -- limite-intentos",
      "espera": "test verde; el 6º POST /login responde 429" },
    { "check": "El mensaje de error es idéntico para usuario inexistente y clave mala",
      "comando": "grep -rn \"no existe\\|usuario no encontrado\" app/api/login/",
      "espera": "0 líneas" }
  ],
  "aplicaSi": { "superficies": ["panel-interno", "api"], "multiUsuario": true },
  "porCada": null,
  "posee": ["app/api/login/**", "lib/servidor/limite-intentos.ts"],
  "cerebro": ["tema:acceso-roles-y-puestos"]
}
```

## Reglas de los campos

| Campo | Regla |
|---|---|
| `id` | `categoria.subgrupo.nombre`, minúsculas, sin tildes, estable para siempre. Es la clave con la que un plan dice de dónde salió una tarea. |
| `titulo` | Imperativo, una línea, ≤80 caracteres. Lo que se hace, no el área. «Limitar intentos de login», no «Seguridad de login». |
| `nivel` | `N0` cimientos · `N1` funciona · `N2` aguanta · `N3` escala · `N4` excelencia. Ver RFC-0008 §2. |
| `dificultad` | `trivial` mecánico y totalmente especificado · `normal` camino claro · `hard` ambigüedad, diseño transversal, seguridad o alto radio de daño. |
| `ceremonia` | `inline` (1 archivo, sin incógnitas) · `1-builder` · `ola` (varios agentes). |
| `porQue` | **Una o dos frases: qué se rompe si NO se hace.** Concreto, no genérico. «Sin esto un diccionario prueba 10.000 claves en minutos», no «mejora la seguridad». |
| `queHacer` | 3-7 pasos numerados. Es lo que lee el ejecutor: si un paso admite dos lecturas, está mal escrito. Nombra archivos, tablas, campos y valores reales cuando el arquetipo los fija. |
| `aceptacion` | **≥1, y al menos una tiene que ser un hecho observable** (N8-R3): salida de comando, código HTTP, conteo, medición. Prohibidos los adjetivos. Los greps negativos (`espera: "0 líneas"`) y las frases congeladas (`espera: "1+ líneas"`) son la forma más barata de verificar. |
| `aplicaSi` | Condición contra `perfil`. Claves posibles: `stack`, `superficies`, `entidades`, `rutas`, `roles`, `publico`, `dineroReal`, `datosPersonales`, `multiUsuario`, `equipo` (`solo-orion` / `orion+humanos`), `etapa`, `modo`. Ausente = aplica siempre. Las listas se cumplen si **alguno** coincide (`["*"]` = «que tenga al menos uno»); los booleanos si son idénticos; las cadenas por igualdad. |
| `porCada` | `null` (una vez) o `"entidad"` / `"ruta"` / `"superficie"` / `"rol"`. Con valor, se instancia una tarea por cada elemento real del perfil, y `{{entidad}}` etc. se sustituyen en `titulo`, `queHacer`, `posee` y `aceptacion`. |
| `posee` | Archivos o globs que la tarea posee en exclusiva. Puede llevar `{{entidad}}`. **Obligatorio** si `ceremonia` no es `inline`: sin esto, dos tareas de la misma ola se pisan. |
| `cerebro` | Conocimiento previo que aplica: `tema:<slug>` de `cerebro/temas/`, o `<proyecto>/<ID>` de una memoria. Si no hay ninguno, lista vacía — no inventes citas. |

## El vocabulario de `aplicaSi` (cerrado — un sinónimo rompe el filtro en silencio)

El generador compara valores **exactos** contra el perfil. Un sinónimo por
descriptivo que sea hace que el arquetipo no entre y que el plan salga corto
**sin que nadie se entere**. Ya pasó: los planes reales escribieron
`web-publica` donde el catálogo dice `publico`, y 5 arquetipos —entre ellos
`sec.permisos.la-landing-no-es-puerta-de-administracion`— fueron inalcanzables
durante meses. Hoy `plan.mjs` normaliza ese alias, pero la regla sigue: usa
estos valores y ninguno más.

**Listas** (aplica si coincide alguno; `["*"]` = «que tenga al menos uno»):

| clave | valores |
|---|---|
| `superficies` | `publico` (alias aceptado: `web-publica`) · `panel-interno` · `caja` · `api` · `vitrina` · `landing` · `movil` |
| `stack` | `nextjs` · `react` · `node` · `typescript` · `tailwind` · `postgres` · `supabase` · `sqlite` · `mysql` · `json-en-disco` · `static` |
| `entidades` / `rutas` / `roles` | abiertos; en `aplicaSi` se usan casi siempre como `["*"]` |

**Booleanos** — y aquí está la regla que protege a los proyectos de mostrador:
**una clave booleana en `true` solo dispara si el perfil la declara en `true`
a propósito.** Un perfil que no la menciona nunca recibe esas tareas. Por eso
nada de nube, CDN, tenants ni suscripciones aterriza en el plan de una caja
registradora que corre en el computador del local (tema `la-caja-no-puede-parar`):

| clave | significa | qué desbloquea |
|---|---|---|
| `publico` | hay pantalla que ve cualquiera | landing, SEO, contraste al sol |
| `dineroReal` | se mueve plata de verdad | invariantes contables, auditoría |
| `datosPersonales` | se guardan datos de personas | habeas data, borrado, logs sin cédulas |
| `multiUsuario` | más de una persona lo usa | roles, sesiones, permisos |
| `nube` | algo corre en un servidor remoto que pagamos | hosting, CDN, dominios, ambientes |
| `multiTenant` | varios clientes distintos en la misma base | aislamiento por tenant y su prueba |
| `suscripcion` | se cobra recurrente por internet | pasarela, planes, reintentos de cobro |
| `autoservicio` | la cuenta se crea sola, sin que un humano apruebe | onboarding, verificación de correo |
| `equipoCliente` | el cliente invita a su propia gente | invitaciones, transferir propiedad |
| `correoSaliente` | el sistema le escribe a alguien | cola de correo, rebotes, SPF/DKIM |
| `apiPublica` | alguien de afuera consume nuestra API | versionado, llaves, paginación |
| `traficoAnonimo` | cualquiera del planeta puede tocar la puerta | rate limiting, protección de abuso |
| `tiempoReal` | la pantalla se entera sola de los cambios | canal en vivo, reconexión, tope |

Otros: `equipo` (`solo-orion` / `orion+humanos`) · `modo` (`genesis` / `evolucion`) · `etapa` (`N0`…`N4`).

## Las tres reglas que hacen bueno un arquetipo

1. **El `porQue` nombra el daño, no el beneficio.** «Sin índice, la consulta de
   ventas del mes escanea la tabla entera y a los 50.000 registros la pantalla
   tarda 4 s» sirve; «mejora el rendimiento» no sirve para decidir nada.
2. **La aceptación se puede correr.** Si para saber si está hecha hay que
   opinar, el arquetipo no está terminado. Un `comando` con su `espera` vale
   más que tres párrafos.
3. **`aplicaSi` es honesto.** Un arquetipo que aplica siempre casi nunca
   existe: los que se marcan «siempre» sin serlo llenan los planes de ruido y
   entrenan al dueño a ignorarlos.

## Lo que NO va en el catálogo

- Tareas de **un** proyecto (esas las escribe `orion-arquitecto` leyendo el repo).
- Tareas que dependen de una decisión que nadie tomó todavía: eso es un HUECO,
  y va como pregunta en el encargo, no como tarea.
- Rellenos para inflar el número. El valor del catálogo es que **todo lo que
  hay dentro se puede defender**; un catálogo con paja se deja de leer.

## Validar

```bash
node tools/plan.mjs catalogo --validar
```

Comprueba: ids únicos y bien formados, campos obligatorios, `aceptacion` con al
menos un hecho observable, `posee` presente cuando la ceremonia lo exige,
placeholders `{{…}}` sólo donde hay `porCada`, y niveles/dificultades válidos.
