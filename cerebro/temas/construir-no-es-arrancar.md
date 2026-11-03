---
slug: construir-no-es-arrancar
titulo: Construir no es arrancar — el trabajo en tiempo de carga que revienta el build
alias: [build, next build, npm run build, compilar, compilacion, no compila, falla el build, build roto, build worker, build worker exited, exited with code 1, worker murio, arranque, arrancar, start, next start, npm run start, despliegue, desplegar, deploy, ci, github actions, workflow, pipeline, variable de entorno, variables de entorno, env, process.env, falta la variable, falta configurar, api key, clave, admin_clave, groq_api_key, secreto, guardia de entorno, guarda de entorno, module scope, nivel de modulo, top level, al importar, al cargar el modulo, process.exit, exit 1, throw al importar, cliente instanciado, instanciar cliente, next_phase, phase-production-build, node_env, production, puerta de calidad, verificar, npm run verificar, la puerta no construye, tests en verde pero no compila, pasa local y falla en ci, no se puede desplegar, 503, error 503, da 503, service unavailable, el hosting responde 503, la app no responde, no carga en el hosting, puerto, port, process.env.port, puerto fijo, puerto clavado, next start -p, hostinger, vercel, railway, render, passenger, pm2, proxy, portero, la app arranca pero no responde, systemd, servicio, service, unit, pm2, pm2 cluster, supervisor, arranca a mano pero no como servicio, path, PATH, command not found, next not found, no encuentra next, npm no esta, ExecStart, main vs master, rama de despliegue, no llega a produccion, publicar.sh, por que no se ve el cambio, fusione y no se ve, fusionado no es desplegado, a donde apunta el dominio, dig, dns, hosting compartido, nada corriendo, npm audit, vulnerabilidad, puerta roja, aviso de seguridad, lockfile, cliente perezoso, lazy client, modo fixture, respuestas grabadas, build sin env, pruebas sin gastar, mock de la ia]
preguntas: ["por que falla npm run build si los tests estan en verde", "que es build worker exited with code 1", "por que me pide una variable de entorno para compilar", "donde instancio un cliente que necesita api key en next", "mi puerta de calidad esta en verde pero la app no despliega", "como distingo compilar de arrancar en next", "por que el build pide la clave si no atiende peticiones", "por que el hosting me da 503", "mi app arranca pero el hosting responde 503", "como se elige el puerto en un hosting", "por que lo fusione y en la caja real no se ve el cambio", "me sale 503 en el sitio que subimos a Hostinger, que miro primero", "la puerta de calidad salio roja por una vulnerabilidad nueva, como lo manejo", "como hago que el build y las pruebas no necesiten la clave de la IA ni gasten plata"]
proyectos: [_permanent, infrapilot, villa-broaster, mercaplaza, placita, duo-burger, escuadra]
confianza: alta
actualizado: 2026-11-02
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

## El hermano del build roto: arrancar no es estar accesible

El mismo día, el mismo proyecto, otro 503 —esta vez del **portero del
hosting**, que es lo que responde cuando detrás no hay nadie escuchando donde
él busca. **Un hosting elige el puerto**, lo pasa en `PORT` y pone un proxy
delante. `next start -p 3200` (o cualquier puerto clavado en el script `start`)
**ignora `PORT`**: la aplicación arranca feliz, escribe "listo" en su registro,
y nadie la encuentra. Medido en villa-broaster: con `PORT=3210` definido,
seguía atendiendo en 3200 y el 3210 no respondía.

El arreglo tiene que servir a dos mundos que no se parecen —el PC de un local,
que necesita un puerto FIJO porque es el número que la cajera ve, y un hosting,
que exige obediencia— así que ni `-p 3200` a secas ni `next start` a secas
sirven. Un lanzador de diez líneas resuelve los dos: `PORT` si está, el puerto
del local si no. **En Node y no en el script de npm**: `${PORT:-3200}` es
sintaxis de shell y un PC con Windows corre `cmd`, donde llegaría literal.

**Cómo se lee un 503 sin adivinar** — el registro de la aplicación en el panel
del hosting lo dice en un vistazo:

| El registro dice | Qué pasa |
|---|---|
| **Fila 0, antes de abrir el registro:** `dig +short <dominio>` no da la IP del VPS, o `curl -I` a esa IP responde el 503 del hosting compartido | El dominio sigue apuntando a un hosting vacío: arregla el DNS, no el código |
| "falta configurar `<VARIABLE>`" | La app se negó a arrancar a propósito: define la variable |
| Nada, o "arrancó bien", y aun así 503 | Escucha en un puerto donde el proxy no la busca |
| `Cannot find module` / falla al instalar | Se importó el repositorio equivocado (típico: el de documentación, que no tiene `package.json`) |

La lección que une las tres filas con el resto del tema: **ninguna la ve la
puerta de calidad local.** Tests, tipos, lint y hasta el build pueden estar en
verde mientras la app es indesplegable. Lo único que prueba que se puede
desplegar es desplegar.

## Tercer hermano: arranca a mano y falla como servicio

El lanzador que resuelve el puerto suele terminar llamando al binario del
framework **por PATH** (`spawn("next start …", {shell:true})`, o `npm run start`).
Funciona en tu terminal y **falla como servicio del sistema**: `systemd` no trae
el PATH de una sesión interactiva, así que `next` no aparece y el servicio muere
al arrancar — precisamente cuando nadie está mirando la pantalla.

Se resuelve resolviendo el binario **por ruta**, deducida del propio archivo del
lanzador y no del directorio desde el que lo llamen:

```js
const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const BIN = join(RAIZ, "node_modules", ".bin", enWindows ? "next.cmd" : "next")
spawn(BIN, ["start", "-p", String(puerto)], { cwd: RAIZ, stdio: "inherit", shell: enWindows })
```

De paso desaparece el `shell: true` fuera de Windows: los argumentos viajan como
lista y no hay línea de comandos que nadie tenga que interpretar. **Compruébalo
arrancando con `node` directo, sin npm** — si eso funciona, el servicio va a
funcionar.

**Y el supervisor importa.** Para un sistema cuya cola de escrituras vive DENTRO
de un proceso, `pm2` es una trampa: su modo cluster levanta varias copias sobre
la misma carpeta y se pisan los datos. `systemd` levanta una sola, que es lo que
hace falta. La elección del supervisor es una decisión de integridad de datos, no
de gusto.

**Fila 0 (cosecha 2026-11-02): ante un 503, primero a dónde apunta el dominio.** Antes de leer código
haz dos pruebas de 30 segundos: `dig +short <dominio>` y `curl -I` a esa IP. Un 503 es el portero de
un hosting sin nada detrás, también cuando el dominio sigue apuntando al hosting compartido vacío y
no al VPS. En Villa Broaster Claude diagnosticó `ADMIN_CLAVE` y el puerto clavado en 3200 (defectos
reales, ya arreglados), pero el 503 que veía el dueño era DNS: apareció horas después, al medir el
dominio que dio para publicar. Solo después baja a la tabla del registro.

## Cuarto hermano: fusionado en GitHub no es desplegado

Antes de decir «ya quedó publicado», **comprueba cuál es la rama que el servidor de verdad
despliega** (puede ser `master` y no `main`, el default de GitHub). Si no coinciden, fusiona
también a esa rama o corre el script de publicar correspondiente. El recibo nuevo de Mercaplaza
quedó fusionado a `main` y nunca llegó a la caja real porque el VPS publica desde `master`
(`placita/KN-075`; riesgo de fondo en `placita/RSK-005`: dos ramas, `main` por defecto e iba
atrasada). El 2-nov, tras el PR #3, se dejaron `main` y `master` iguales para que el servidor pudiera
bajar la versión nueva. Mismo patrón con WRD y Hostinger. Comprueba la rama en cada proyecto: nunca
la asumas. Ver [[TEMA-un-vps-varios-negocios]].

## Quinto hermano: la puerta se pone roja sin que toques código

Antes de cualquier despliegue corre la puerta completa. Si se pone roja por un aviso NUEVO de
dependencias (`npm audit`) sin que tu código haya cambiado, **sube la dependencia en un commit
aparte (solo lockfile)** y repite, reservando unos 13 min por vuelta. Si el aviso es de una función
que no usas, registra la excepción con su porqué en vez de subir a ciegas. En 24 días la puerta de
Duo Burger se bloqueó cuatro veces: Next.js crítico (1-oct), `sharp` y `source-map-js` (22-oct; la
puerta tarda unos 782 s hasta ese fallo), Next.js 16.4.2 por un fallo crítico de control remoto en el
sistema de imágenes que usa el proyecto (23-oct) y `zod` (24-oct). Dependencias solo de desarrollo, sin
exposición y sin arreglo: documenta la excepción y sigue, sin mezclar la subida con una entrega que
ya estaba verde.

## Sexto: cliente de IA perezoso y pruebas gratis

Instancia el cliente de IA al primer uso (nunca al cargar el módulo) y ofrece un **modo con respuestas
grabadas (fixtures)**. Deja como criterio numerado que `env -i PATH HOME npm run build` salga 0 con el
`.env` apartado, y corre el escenario de pruebas y la verificación visual en modo fixture. En Escuadra
el build sin variables pasó en la tanda 0 (`BUILD_SIN_ENV=0`) y de nuevo en el lanzamiento; las pruebas
del escenario no gastan nada y todo el uso real de IA durante la construcción fue 37 llamadas a Opus
(US$ 1,70) y 21 a Haiku (US$ 0,01), frente a unos US$ 1.300 de agentes. No aplica a scripts de un solo
uso que sin la clave no tienen sentido (una migración de datos hecha con IA).

## Cuándo NO aplica lo añadido el 2026-11-02

- **Rama de despliegue:** si el pipeline de CI/CD despliega solo al fusionar a la rama default, igual
  se comprueba en cada proyecto.
- **503:** si sale del propio panel con el mensaje «falta clave» ya sabes la causa, y si ya verificaste
  que el dominio apunta al VPS pasas directo al registro de la app.

## Evidencia (cosecha de ventanas 2026-11-02)

- 503: «me dice que 503 no funciona» (2026-09-08), «Un 503 casi nunca es un error de la aplicación: es el
  portero diciendo que detrás no hay nadie.» (2026-09-08) y «No era el sistema de Villa Broaster: era el
  dominio apuntando a un sitio vacío.» (2026-09-08) — ventana
  [[2026-09-08-sistema-de-villa-orion|Sistema de Villa]] (transcrito `f7689b06`).
- Rama: «El servidor publica desde la rama master y ese cambio había quedado en main» (2026-10-28) y
  «main y master quedaron iguales, así que el servidor ya puede bajar la versión nueva» (2026-11-02) —
  ventana [[2026-10-15-mercaplaza-sistema|Mercaplaza sistema]] (`1760cf3b`).
- npm audit: «De paso se actualizó una pieza del sistema (Next.js) por una falla de seguridad crítica»
  (2026-10-01) — ventana [[2026-09-09-duo-burger|Duo Burger]] (`51184930`); «HOY NO PASA: falla
  auditoria-npm (sharp 0.35.4 y source-map-js 1.2.1» (2026-10-22), «The check caught a newly published
  critical flaw» (2026-10-23) y «subo zod por el aviso de seguridad y vuelvo a correr el gate» (2026-10-24)
  — ventana [[2026-09-09-duo-burger|Duo Burger]] (`7f456016`).
- Fixtures: «con .env apartado, env -i PATH HOME npm run build → BUILD_SIN_ENV=0» (2026-10-23) y «37
  llamadas a Opus por US$ 1,70.» (2026-11-03 UTC) — ventana
  [[2026-10-22-orion-app-de-rutina-sincronizada|Orion app de rutina]] (`b5eb380b`).
