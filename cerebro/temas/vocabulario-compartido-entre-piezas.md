---
slug: vocabulario-compartido-entre-piezas
titulo: Cuando dos piezas hablan por igualdad de cadenas, el vocabulario vive en un solo sitio
alias: [sinonimo, sinónimo, sinonimos, sinónimos, vocabulario, vocabulario cerrado, vocabulario compartido, enum, enums, valores permitidos, lista cerrada, lista de valores validos, aplicaSi, filtro contra perfil, perfil vs filtro, columna, enum contra columna, rol, roles, tabla de permisos, permiso que nunca se dispara, permiso no se aplica, condicion que nunca aplica, aplica siempre, nunca aplica, plan corto, el plan salio corto, arquetipo inalcanzable, inalcanzable, desajuste silencioso, fallo silencioso, error silencioso, sin error, no da error, no truena, no explota, coincidencia exacta, igualdad de cadena, comparacion de cadenas, string exacto, texto exacto, alias de vocabulario, mapa de alias, normalizar, normalizacion, dos vocabularios, dos listas de valores, dos catalogos, dos diccionarios, contrato por texto, contrato de texto libre, JSON suelto sin tipos, enum vs columna, rol vs tabla, permiso vs rol, filtro vs enum, quien declara el vocabulario, un solo sitio, fuente unica de vocabulario, superficies, web-publica, publico, catalogo de arquetipos, orion-arquitecto, plan.mjs, aplicaSi booleano, dos archivos que deberian coincidir]
preguntas: ["por que este arquetipo dice que aplica siempre y nunca entro al plan", "por que el plan me salio mas corto de lo que esperaba", "escribi un permiso pero nunca se dispara, que reviso primero", "tengo un filtro y un perfil que deberian coincidir y no coinciden, por que no me da error", "como evito que un sinonimo apague un filtro en silencio", "donde deberia vivir el vocabulario cerrado de un enum que usan dos archivos distintos", "un rol y una tabla de permisos dejaron de coincidir, como lo detecto"]
proyectos: [orion]
confianza: alta
actualizado: 2026-09-09
---

# Cuando dos piezas hablan por igualdad de cadenas, el vocabulario vive en un solo sitio

## Respuesta corta

**Cuando dos piezas se comunican por igualdad exacta de cadenas —un filtro
contra un perfil, un enum contra una columna, un rol contra una tabla de
permisos— el desajuste NO da error: apaga en silencio todo lo que depende de
ese valor.** No se ve un log rojo; se ve un plan más corto, un permiso que
nunca se aplica, un arquetipo "que aplica siempre" que nunca aplicó. Pon el
vocabulario en **un solo sitio** que ambos lados lean o citen — nunca lo
copies a mano en el segundo archivo — y agrega una comprobación que **falle**
si aparece un valor fuera de la lista cerrada. Un párrafo que pide "usa estos
valores" no es una comprobación: es la misma advertencia que ya falló una vez.

## Por qué (qué lo pagó)

**El propio archivo que lo advertía era el que lo causaba.** El agente
`orion-arquitecto` dictaba como vocabulario cerrado de `superficies`:
`web-publica · panel-interno · caja · api · movil`. Los 535 arquetipos del
catálogo filtraban por `publico · panel-interno · caja · api · vitrina ·
landing`. Los dos vocabularios nunca coincidieron. Consecuencia medida: cinco
arquetipos —entre ellos `sec.permisos.la-landing-no-es-puerta-de-administracion`,
`perf.carga.imagenes-en-formato-moderno-con-techo-de-kb`,
`perf.render.auditoria-de-animados-y-will-change`— fueron **inalcanzables
durante meses** para todo proyecto con web pública, incluido villa-broaster,
que sí tiene una (`orion/KN-022`). Lo más caro de este hallazgo no es el bug:
es que el archivo del agente **ya decía la frase exacta que lo explica** —"un
sinónimo tuyo hace que esos arquetipos no entren y el plan salga corto sin que
nadie se entere"— y era su propia lista la que incumplía su propia advertencia
(`runtime/agents/orion-arquitecto.md:37-44`). Adjuntar la regla en prosa no
cerró el hueco; la comprobación tenía que ser un valor comparado contra otro,
no un recordatorio.

## Cómo se aplica

1. **Antes de escribir un segundo archivo que declare el mismo vocabulario que
   otro ya declaró, decide un dueño.** El catálogo (`catalogo/_ESQUEMA.md`) es
   hoy el dueño del vocabulario de `superficies`, `stack` y los booleanos de
   perfil; cualquier otro archivo que lo mencione (un agente, una guía) lo
   **cita**, no lo copia (`catalogo/_ESQUEMA.md:68-108`).
2. **Si de verdad hace falta que dos archivos declaren la misma lista por
   separado, escribe la comprobación que los compara y falla si difieren.**
   No hay ninguna en este caso todavía — lo que existe es el remedio más barato
   del punto 3. Un script de 10 líneas que extrae los valores usados en uno y
   los compara contra los aceptados en el otro habría cazado esto sin esperar
   a un plan real.
3. **Cuando ya encuentres el desajuste, no borres de golpe el término viejo.**
   Añade un alias que normalice el sinónimo hacia el valor real, para no
   invalidar lo que ya está escrito con el término equivocado, y deja
   documentado cuál de los dos es el nombre verdadero. La forma mínima:
   ```js
   const ALIAS = { superficies: { "web-publica": "publico", "publica": "publico" } }
   const normalizar = (clave, v) => { /* aplica el alias a ambos lados antes de comparar */ }
   ```
   (`tools/plan.mjs:123-145`, función `aplica()`). El alias es un parche de
   transición, no la solución final: la solución es que nadie vuelva a escribir
   el sinónimo, porque el vocabulario vive en un solo sitio legible.
4. **Sospecha primero de un sinónimo cuando el síntoma es AUSENCIA, no error.**
   "Este arquetipo dice que aplica siempre y nunca entró", "el plan salió más
   corto de lo esperado", "puse un permiso y nunca se dispara": los tres son la
   misma familia de bug que un `TypeError`, pero sin la ventaja de que algo
   truene. La primera pregunta no es "¿qué lógica está mal?" sino "¿los dos
   lados están escribiendo literalmente la misma cadena?".
5. **Un vocabulario cerrado documentado en un solo sitio humano-legible es
   barato y evita la mitad de esto.** `catalogo/_ESQUEMA.md:68-108` lista hoy
   los valores exactos de `superficies`, `stack` y los trece interruptores
   booleanos de perfil, con la frase de advertencia arriba del todo. Un agente
   que necesite ese vocabulario debe leerlo de ahí, no reescribirlo de memoria.

## Cuándo NO aplica

- **Si el contrato ya es tipado** (un enum de TypeScript importado en los dos
  lados, o una clave foránea de base de datos), el compilador o el motor ya
  hacen la comprobación que falla — este tema es para cuando el vocabulario
  vive en texto libre (JSON, YAML, prosa de un agente) sin nada automático que
  lo compruebe.
- **No es la misma clase que "dos fuentes de verdad" de un dato de negocio**
  ([[TEMA-donde-vive-el-dato]]). Ahí dos sitios escriben o leen el mismo
  HECHO y se desincronizan con el tiempo. Aquí ninguno de los dos escribe
  nada: dos sitios **declaran por separado** el mismo vocabulario y dejan de
  coincidir porque nadie los comparó nunca. El síntoma también es distinto:
  allá es "no hay X" después de crearlo; acá es "esto nunca se dispara" o "el
  plan salió corto".
- **Un alias no es la corrección definitiva.** Sirve para no romper lo que ya
  está escrito con el término viejo mientras se corrige el emisor; si se deja
  para siempre sin revisar quién sigue produciendo el sinónimo, el problema
  solo se disfrazó.

## Evidencia

- `orion/KN-022` (Permanent) — el hallazgo completo: vocabulario cerrado
  declarado en dos sitios que nunca coincidió; cinco arquetipos inalcanzables
  durante meses, incluido `sec.permisos.la-landing-no-es-puerta-de-administracion`;
  corregido en `tools/plan.mjs`, `catalogo/_ESQUEMA.md` y el agente.
- `catalogo/_ESQUEMA.md:68-108` — "El vocabulario de `aplicaSi` (cerrado — un
  sinónimo rompe el filtro en silencio)"; la tabla de valores exactos de
  `superficies`, `stack` y los trece interruptores booleanos.
- `runtime/agents/orion-arquitecto.md:37-44` — el propio archivo que causaba el
  desajuste, con la advertencia textual ya escrita antes de que se corrigiera:
  "un sinónimo tuyo —por descriptivo que sea— hace que esos arquetipos no
  entren y el plan salga corto sin que nadie se entere".
- `tools/plan.mjs:123-145` — el mapa `ALIAS` y la función `normalizar()`
  dentro de `aplica()`: la comprobación que hoy hace que `web-publica` se lea
  como `publico` en los dos lados antes de comparar.
- Commit `f936077` (repo orion, 2026-09-09) — "El catálogo aprende a construir
  web: 190 arquetipos y dos categorías nuevas", incluye la corrección del
  sinónimo en los tres archivos donde vivía el vocabulario.
- `orion/KN-017` (Permanent, dependencia de KN-022) — el patrón hermano de la
  misma familia de bug silencioso: un arquetipo "que aplica siempre" casi
  nunca existe; ahí faltaba la condición entera, aquí la condición existía
  pero comparaba contra el vocabulario equivocado.

## Enlaces

- [[TEMA-donde-vive-el-dato]] — la otra mitad de "una sola fuente": ese tema
  es sobre HECHOS que dos sitios escriben o leen; este es sobre VOCABULARIO
  que dos sitios declaran por separado.
- [[TEMA-planes-de-ejecucion]] — dónde viven el catálogo y el perfil que
  chocaron, y cómo `plan.mjs ola`/`validar` dependen de que el vocabulario
  coincida.
- [[TEMA-la-caja-no-puede-parar]] — el mecanismo hermano nacido en la misma
  sesión: los trece interruptores booleanos de perfil, opt-in por diseño.
- [[TEMA-que-es-estar-verificado]] — por qué un recorte o un filtro se prueba
  en los dos sentidos, hacia adelante y hacia atrás, antes de confiar en él.
