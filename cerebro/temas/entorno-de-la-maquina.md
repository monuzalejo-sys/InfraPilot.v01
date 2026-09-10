---
slug: entorno-de-la-maquina
titulo: Lo que cada máquina puede y no puede hacer (son DOS)
alias: [push, git push, subir el codigo, subir a github, publicar el repo, credential, credential manager, github desktop, desktop, commit, rama, remoto, terminal, consola, maquina, entorno, esta maquina, mi pc, computador, dos computadores, dos maquinas, mac, macos, darwin, windows, en cual maquina estoy, instalado, no esta instalado, falta instalar, python, python3, pip, docker, brew, homebrew, node, npm, powershell, ps 5.1, bash, heredoc, comando largo, se corta, truncado, utf8, tildes, acentos, mojibake, encoding, json corrupto, puerto, puertos, localhost, launch.json, servidor local, dev server, arrancar el servidor, wifi, wifi del local, firewall, red local, red publica, lan, celular, telefono, escala de windows, permisos del agente, sandbox, scratchpad, limite de sesion, edge, chrome, chrome headless, pdf, orion_home, uptime, carga, carga del sistema, load average, hilos, nucleos, cuantos nucleos tiene esta mac, cuantos hilos, i5, cpu al limite, se cayo el dns, dns caido, ENOTFOUND, resolucion de dns, compilando en segundo plano, compilar mientras corren agentes, brew compilando, kill -STOP, kill -CONT, suspender un proceso, pausar una compilacion, cuantos agentes en paralelo aguanta esta maquina]
preguntas: ["en que maquina estoy trabajando", "puedo hacer push desde la terminal", "que hay instalado en esta maquina y que no", "por que el comando largo se corta a la mitad", "como genero un pdf aqui", "en que puerto arranca cada proyecto"]
proyectos: [_permanent, infrapilot, prommter, wrd, villa-broaster, placita, estanco-contable, pollo-landing, landings, duo-burger]
confianza: alta
actualizado: 2026-09-10
---

# Lo que cada máquina puede y no puede hacer (son DOS)

## Respuesta corta

**Hay dos máquinas y no se parecen: mide en cuál estás antes de citar cualquier
límite.** `uname -s` responde en un segundo: `Darwin` es la **Mac**, cualquier otra
cosa es el **PC Windows**. La mitad de las restricciones que este tema documentó
durante meses son del PC y **en la Mac son falsas** — repetirlas ahí no es prudencia,
es dar por imposible algo que funciona.

**En la Mac: `git push` funciona** (`gh` autenticado como `kalelfelpem-glitch` hace de
credential helper), **hay `python3` y `pip3`**, **no hay Edge pero hay Chrome**, y **no
existe el techo de ~8 KB por comando**. En el PC: nada de eso — el push sale por GitHub
Desktop, no hay Python, y el heredoc largo se trunca.

Lo que NO cambia de máquina: **medir antes de rendirse**, y no confundir *"la máquina
no puede"* con *"el agente murió"*.

## Por qué (qué lo pagó)

Lo pagó una creencia que sobrevivió a su propia máquina. `_permanent/KN-001` decía
—en presente, sin decir de qué computador hablaba— que el push por terminal no
funciona. Nació de un fallo real: el 2026-07-01, en el PC, `git push -u origin main`
murió con el diálogo de Git Credential Manager cancelado y sin `/dev/tty`
(`infrapilot/KN-001`). De ahí salió una política sensata para ESE computador:
autocommitear y no empujar nunca (`infrapilot/DEC-005`).

El problema es que la casa se mudó a la Mac el 2026-08-31 y **la creencia se mudó con
ella**. Ninguna sesión intentó un push durante semanas porque la memoria decía que era
imposible. El costo se puede señalar con el dedo: **`villa-app-repo` y
`Equipo-villa-broaster` estuvieron cinco semanas vacíos en GitHub** mientras su código
vivía suelto en `~/Downloads` sin control de versiones, y nadie lo notó — un repo vacío
no da error, solo silencio (`villa-broaster/KN-016`). El 2026-09-01 el dueño derogó la
regla y los dos subieron por terminal en un minuto; la política nueva está en
`_permanent/DEC-001`.

La lección que deja no es sobre git. Es que **un hecho de máquina sin la máquina escrita
al lado caduca en silencio** y se lleva por delante decisiones enteras. Por eso este
tema pasó de hablar de "esta máquina" a hablar de las dos.

## Lo que hay en cada una

Medido el 2026-09-01 en la Mac y el 2026-08-24 en el PC:

| | Mac (`Darwin 22.6.0`, x86_64) | PC (Windows) |
|---|---|---|
| `git push` por terminal | **SÍ** — `gh` es el helper | NO — Credential Manager sin `/dev/tty` |
| Python | **SÍ** — `python3` 3.9.6 y `pip3` | NO |
| Navegador Chromium | **Chrome** (no hay Edge) | **Edge** en `Program Files (x86)` |
| Viewport móvil real <480 px | **SÍ**, respeta 390 exactos | NO — Edge calculaba a ~480 |
| Techo por comando de Bash | **sin techo** (15 KB entraron enteros) | ~8 KB, y trunca sin avisar |
| `pdftoppm` / poppler | NO (pero hay `brew`) | NO |
| Docker | NO | NO |
| Node / npm / git | v24.18.0 · 11.16.0 · 2.39.2 | v24.16.0 · 11.13.0 · 2.55.0 |
| CPU | i5, **4 hilos** — no aguanta una ola de agentes mientras algo compila nativo | no medido |

`ORION_HOME` vale `/Users/g/orion` en la Mac (declarado en `~/.claude/settings.json`) y
`$ORION_HOME` en el PC. **Todo comando del runtime se escribe con la variable,
nunca con la ruta literal** — es lo que hace que los mismos 21 archivos de agentes y
skills sirvan en las dos.

## Cómo se aplica

1. **Mide la máquina antes de citar un límite**: `uname -s`, y si hace falta
   `command -v python3`, `node -v`, `command -v docker`. Cuesta un segundo y evita
   media hora de plan imposible — o, peor, dar por muerto algo que funciona.
2. **En la Mac, publicar es parte de terminar**: al pasar la verificación se commitea
   **y se empuja** (`_permanent/DEC-001`). Siguen pidiendo permiso `--force`,
   reescribir historia publicada, borrar ramas remotas, y empujar a una `main` que
   exija PR. En el PC, commitear y dejar la lista para GitHub Desktop.
3. **Si un push grande muere con `RPC failed; HTTP 400 curl 22`, no es un permiso: es
   el buffer.** `git config http.postBuffer 524288000` en ese repo y entra. Lo pagó el
   repo del equipo, con 19 MB de PDFs.
4. **Diagnostica antes de culpar a la autenticación**: si `git remote -v` sale vacío,
   falta crear el remoto. Y antes de dar una historia por perdida, **pregúntale al
   remoto** con `git ls-remote --heads origin` — los 35 commits del sistema de
   villa-broaster estaban en GitHub mientras el clon local parecía vacío
   (`villa-broaster/KN-035`).
5. **PDF**: en la Mac, Chrome headless con `--print-to-pdf` sobre un HTML con
   `@page`/`@media print` (`_permanent/KN-004`). Se verifica parseando la estructura con
   node —`%PDF-`, contar `/Type /Page`, cerrar en `%%EOF`— porque `pdftoppm` no está
   (`_permanent/KN-005`).
6. **QA visual**: `node $ORION_HOME/tools/edge-cdp.mjs`, que localiza el navegador según
   la plataforma (`_permanent/KN-010`). Si una medida sale rara, lo primero que hay que
   mirar es si la página trae `<meta name="viewport">`: sin él, `innerWidth` se va a 980
   sin importar lo que pidas (`_permanent/KN-009`).
7. **Archivos grandes con Write/Edit igual**, aunque en la Mac el heredoc aguante: el
   heredoc no avisa cuando algo sale mal a la mitad.
8. **Comparar un árbol traído del PC contra un checkout en la Mac miente**: CRLF contra
   LF marcó 166 archivos como distintos con cero diferencias reales. `diff
   --strip-trailing-cr` (`villa-broaster/KN-035`). Y los archivos venidos de Windows
   llegan con modo 700: git los ve como `100755` y ensucia el árbol con cambios de modo
   sin contenido — `chmod 644/755` después de copiar.
9. **Lo que solo puede hacer el dueño se escribe como Pending, no se intenta**:
   `npm install` desde URL, escrituras a bases compartidas, ajustes de seguridad del
   sistema, e invitaciones y protección de ramas en GitHub (`infrapilot/KN-019`).
10. **Antes de lanzar una ola en esta Mac, mira `uptime`.** Es un i5 de 4 hilos: con
    carga por encima de ~8 la ola se suicida, y por encima de eso puede tumbar hasta la
    resolución de DNS. Medido el 2026-09-09: con `brew` compilando ffmpeg desde fuente
    (más de cuatro horas) **mientras tres agentes renderizaban video en paralelo**, la
    carga llegó a **46 sobre 4 hilos** y **cinco spawns murieron seguidos** — tres a la
    vez con `ENOTFOUND` porque el DNS se cayó, dos más después por límite de sesión.
    Ninguna de las cinco fue falta de capacidad del modelo: no subas ningún escalón de
    tier por esto (`duo-burger/KN-008`). Remedios que sí funcionaron: **`kill -STOP`**
    sobre el proceso que compila (se reanuda después con `-CONT` sin perder el trabajo
    de compilación, en vez de matarlo y repetirlo), bajar los bancos de prueba a media
    resolución mientras algo pesado corre en segundo plano, y avisar en el brief de no
    lanzar renders en paralelo. Ver [[TEMA-olas-de-agentes]] para el resto del
    protocolo de muerte por infraestructura.
11. **Puertos, de un archivo, no de memoria** — `$ORION_HOME/.claude/launch.json`. En la
    Mac hoy: `placita` 3300, `placita-pos` 4173. En el PC el archivo era compartido entre
    sesiones y otra podía pisarlo, así que verifica tu entrada antes de arrancar
    (`wrd/KN-001`).

## Cuándo NO aplica

- **No confundas "la máquina no puede" con "el agente murió"**. Cuando un builder cae
  por límite de sesión, el código normalmente **ya está en disco**: audita disco, `tsc`
  y build antes de re-spawnear (`estanco-contable/KN-009`, `villa-broaster/KN-014`).
  Ver [[TEMA-olas-de-agentes]].
- **Estas son verdades de las máquinas de trabajo, no del stack ni de la máquina del
  cliente.** En el mostrador de la plaza el sistema corre con `npm start -p 3300` y el
  estado vive en el navegador: **2 PCs = 2 inventarios** (`placita/KN-008`).
- **Toda medición tiene fecha, y este tema es la prueba.** Media docena de sus
  afirmaciones caducaron al cambiar de computador sin que nadie lo notara. Si dudas,
  vuelve a medir antes de repetir la restricción — es más barato que la restricción.
- **Los límites de PowerShell son del PC y allá siguen vigentes**: PS 5.1 corrompe JSON
  UTF-8 con BOM y mojibake (`prommter/KN-002`). En la Mac no existe PowerShell, y por eso
  se quitó de las herramientas de `orion-verifier`.

## Evidencia

Medición propia del 2026-09-01 en la Mac:

```
uname -s → Darwin 22.6.0 · x86_64
node v24.18.0 · npm 11.16.0 · git 2.39.2
python3 3.9.6 · pip3 SI · docker NO · pdftoppm NO · brew 6.0.20
gh auth status → Logged in to github.com account kalelfelpem-glitch
git config --global credential.helper → (sin helper global; gh lo provee)
Chrome SI (/Applications/Google Chrome.app) · Edge NO
push real: villa-app-repo 09859a5..de20b97 · Equipo-villa-broaster 4f91358..f3b5fe3
```

- `_permanent/KN-001` — corregido: el push funciona aquí; el hecho viejo era del PC.
- `_permanent/DEC-001` — política nueva: publicar es parte de terminar, con sus límites.
- `_permanent/KN-004`, `KN-005` — PDF con Chrome; verificación sin poppler.
- `_permanent/KN-009`, `KN-010` — el piso de viewport era de Edge; la herramienta ya es multiplataforma.
- `_permanent/KN-011` — el techo de ~8 KB por comando era de Windows.
- `_permanent/KN-018` — el kit completo de la Mac, pieza por pieza.
- `villa-broaster/KN-016` — los repos vacíos y sus cinco semanas de silencio.
- `villa-broaster/KN-035` — preguntarle al remoto antes de dar una historia por perdida; CRLF y modos 700.
- `infrapilot/DEC-005` — la política vieja de autocommit, ya alineada con DEC-001.
- `prommter/KN-002` — PowerShell 5.1 corrompe JSON UTF-8 (solo PC).
- `estanco-contable/KN-008` — se puede probar SQL real: `embedded-postgres` en el scratchpad, 37/37.
- `duo-burger/KN-008` — i5 de 4 hilos; carga 46 tumbó el DNS con `brew` compilando y tres
  agentes renderizando a la vez; `kill -STOP`/`-CONT` como remedio que no pierde trabajo.

### Huecos explícitos (el corpus NO lo respalda)

- **No hay evidencia de despliegue a internet desde ninguna de las dos máquinas.**
  `pollo-landing/PEND-001` y `arroces/PEND-004` siguen bloqueados por "definir hosting".
- **Los síntomas del navegador embebido (`_permanent/KN-007`, `KN-008`) no se
  reverificaron en la Mac.** La lección —la verdad visual es un navegador de verdad, no
  el pane— se sostiene; los síntomas concretos, no están medidos aquí.
- **No hay nota de impresora, báscula ni lector de barras conectados a la Mac.**
- **El firewall y el WiFi "pública" que bloqueaban el celular (`wrd/KN-009`) son del
  PC.** En la Mac no se ha probado el acceso desde el celular por LAN.

## Enlaces

- [[TEMA-verificar-con-evidencia]] — cómo se mide un resultado (navegador, capturas, PDF).
- [[TEMA-olas-de-agentes]] — qué hacer cuando el límite de sesión mata builders.
- [[TEMA-modelos-y-costos]] — el otro límite duro del entorno: cuánto cuesta cada spawn.
