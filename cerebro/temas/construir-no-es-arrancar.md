---
slug: construir-no-es-arrancar
titulo: Construir no es arrancar — el trabajo en tiempo de carga que revienta el build
alias: [build, next build, npm run build, compilar, compilacion, no compila, falla el build, build roto, build worker, build worker exited, exited with code 1, worker murio, arranque, arrancar, start, next start, npm run start, despliegue, desplegar, deploy, ci, github actions, workflow, pipeline, variable de entorno, variables de entorno, env, process.env, falta la variable, falta configurar, api key, clave, admin_clave, groq_api_key, secreto, guardia de entorno, guarda de entorno, module scope, nivel de modulo, top level, al importar, al cargar el modulo, process.exit, exit 1, throw al importar, cliente instanciado, instanciar cliente, next_phase, phase-production-build, node_env, production, puerta de calidad, verificar, npm run verificar, la puerta no construye, tests en verde pero no compila, pasa local y falla en ci, no se puede desplegar]
preguntas: ["por que falla npm run build si los tests estan en verde", "que es build worker exited with code 1", "por que me pide una variable de entorno para compilar", "donde instancio un cliente que necesita api key en next", "mi puerta de calidad esta en verde pero la app no despliega", "como distingo compilar de arrancar en next", "por que el build pide la clave si no atiende peticiones"]
proyectos: [_permanent, infrapilot, villa-broaster]
confianza: alta
actualizado: 2026-09-08
---

# Construir no es arrancar

## Respuesta corta

**`next build` corre con `NODE_ENV=production` igual que `next start`, pero no
atiende ni una petición.** Todo lo que un módulo haga AL CARGARSE —instanciar un
cliente con API key, validar variables de entorno, matar el proceso si falta
una— se ejecuta también al compilar, donde esas claves todavía no tienen por qué
existir. Resultado: el build muere, y como Next reparte esa fase entre procesos
hijos, lo único que ves es `build worker exited with code: 1`, sin la causa.

Dos reglas:

1. **Nada que dependa de un secreto se construye al importar.** El cliente se
   instancia DENTRO del handler, después de comprobar la clave. La guardia de
   entorno exime la fase de compilación.
2. **Si la guardia tiene que vivir al cargar el módulo, distingue la fase por
   `NEXT_PHASE`**, no por `NODE_ENV`: vale `"phase-production-build"` mientras
   `next build` compila y **no existe** en `next start` (medido en la Mac,
   2026-09-08 — no supuesto). La condición correcta es
   `produccion && !construyendo`.

Y la regla de proceso que lo hace visible: **una puerta de calidad que no
construye no prueba que se pueda desplegar.** `typecheck + lint + tests` puede
estar en verde con la app imposible de compilar.

## Por qué (qué lo pagó)

**Lo pagó dos veces, en dos proyectos, con la misma forma y distinto disfraz.**

**InfraPilot, 2026-07-01** (`infrapilot/KN-005`): el cliente de Groq se
instanciaba a nivel de módulo en `app/api/cotizar/route.ts` y
`app/api/licitaciones/analyze/route.ts`. Sin `GROQ_API_KEY` en el entorno, el
build fallaba. Arreglado moviendo la instanciación dentro de los handlers,
después de la comprobación de la clave (commit `5efdde3`). Se clasificó como
BUG REAL que rompía la compilación.

**Villa Broaster, 2026-09-08**: `lib/servidor/entorno.ts` hacía `process.exit(1)`
al cargarse si faltaba `ADMIN_CLAVE` y `NODE_ENV === "production"`. La guardia
era deliberada y estaba bien argumentada —"que la variable que falta se descubra
en el arranque, delante de quien puede arreglarla, y no a las siete de la noche
delante de la cajera"— pero confundía compilar con arrancar. Ningún CI ni
hosting que compile antes de tener el entorno podía construir la app. Se arregló
con `construyendo = process.env.NEXT_PHASE === "phase-production-build"` y
`obligatoria: produccion && !construyendo` (commit `15c0777`).

**Y lo que dejó que viviera meses:** la puerta del proyecto era
`typecheck && lint && test && contraste && rutas-sin-test` — **sin build**.
Existía un `verificar:completo` que sí construía y **no lo corría nadie**: ni el
CI ni ninguna documentación lo mencionaba. 446 tests en verde, contraste en
verde, y la aplicación no compilaba. El build entró a `verificar` y
`verificar:completo` desapareció: dos nombres para "la puerta" garantizan que se
corra el barato.

## Cómo se comprueba

No se discute, se mide. Para saber en qué fase estás:

```bash
# durante la compilación
NEXT_PHASE="phase-production-build" NODE_ENV=production  # exime
# al arrancar
NEXT_PHASE=undefined              NODE_ENV=production    # la guardia muerde
```

Las dos direcciones se prueban con un segundo Node que solo importa el módulo y
dice si llegó vivo (ver `lib/servidor/entorno.test.ts` en broaster-app): un test
para "compilando sin clave, carga" y **otro para "una fase que no es la de
compilar NO exime"** — sin el segundo, mañana alguien exime con
`if (process.env.NEXT_PHASE)` y abre el hueco que la guardia existía para tapar.

La prueba final es la de verdad: `npm run build` **sin** la variable debe salir
en 0, y `npm run start` **sin** la variable debe salir en 1 con el nombre de la
variable en el mensaje.

## Efecto secundario que aparece al meter el build en la puerta

`next-env.d.ts` lo genera Next y **alterna solo**: apunta a `.next/dev/types`
tras `next dev` y a `.next/types` tras `next build`. Si viaja en el repositorio,
cada verificación deja el árbol sucio con un archivo que nadie editó y que dice
de sí mismo "no editar" — en villa-broaster el dueño llegó a commitear un
"Update next-env.d.ts" a mano desde la web de GitHub para acallarlo. Va al
`.gitignore`: `tsc --noEmit` pasa sin él.
