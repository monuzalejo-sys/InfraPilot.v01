---
slug: entorno-de-la-maquina
titulo: Lo que cada máquina puede y no puede hacer (son DOS)
alias: [push, git push, subir el codigo, subir a github, publicar el repo, credential, credential manager, github desktop, desktop, commit, rama, remoto, terminal, consola, maquina, entorno, esta maquina, mi pc, computador, dos computadores, dos maquinas, mac, macos, darwin, windows, en cual maquina estoy, instalado, no esta instalado, falta instalar, python, python3, pip, docker, brew, homebrew, node, npm, powershell, ps 5.1, bash, heredoc, comando largo, se corta, truncado, utf8, tildes, acentos, mojibake, encoding, json corrupto, puerto, puertos, localhost, launch.json, servidor local, dev server, arrancar el servidor, wifi, wifi del local, firewall, red local, red publica, lan, celular, telefono, escala de windows, permisos del agente, sandbox, scratchpad, limite de sesion, edge, chrome, chrome headless, pdf, orion_home, uptime, carga, carga del sistema, load average, hilos, nucleos, cuantos nucleos tiene esta mac, cuantos hilos, i5, cpu al limite, se cayo el dns, dns caido, ENOTFOUND, resolucion de dns, compilando en segundo plano, compilar mientras corren agentes, brew compilando, kill -STOP, kill -CONT, suspender un proceso, pausar una compilacion, cuantos agentes en paralelo aguanta esta maquina, timeout, gtimeout, limite de tiempo, comando colgado, perl alarm, tarea programada, scheduled task, permitir siempre, permiso pendiente, AbortError, la pagina no se actualizo, no corrio sola, keep awake, request_keep_awake, caffeinate, mac dormida, se durmio la mac, no dejes apagar, panel del navegador, se cayo el localhost, no me deja abrir, preview_start, Maximum 5 dev servers, http.server, storage is disabled, file://, bsd sed, swiftshader, webgl lento, playwright lento, pruebas tardan 30 minutos, iris plus 640, whisper-cpp, brew install whisper, large-v3-turbo, no hay excel, libreoffice, xlsx, gh auth login, device flow, login/device, dos cuentas github, self-modification, settings.json, settings.local.json, modo automatico, auto mode, clasificador, donde clono, prommter/proyectos, gitlink, typecheck con miles de errores, eslint no termina, carpeta compartida]
preguntas: ["en que maquina estoy trabajando", "puedo hacer push desde la terminal", "que hay instalado en esta maquina y que no", "por que el comando largo se corta a la mitad", "como genero un pdf aqui", "en que puerto arranca cada proyecto", "por que no se publico sola la pagina si dejamos la tarea programada", "por que se me caen los localhost cuando cierro el panel del navegador", "por que las pruebas del 3D tardan una eternidad en la Mac", "como dejo la Mac logueada en mi GitHub", "por que Claude no me puede escribir el settings.json", "en que carpeta clono un proyecto nuevo"]
proyectos: [_permanent, infrapilot, prommter, wrd, villa-broaster, placita, estanco-contable, pollo-landing, landings, duo-burger, que-cremoso, la-villa, cerebro-3d, mercado-de-plantillas, orion-rutina]
confianza: alta
actualizado: 2026-11-02
---

# Lo que cada máquina puede y no puede hacer (son DOS)

## Respuesta corta

**⚠ Corrección 2026-11-02:** este tema decía que en el PC el push por terminal «NO»
funciona. Es verdad solo del push **interactivo** (el diálogo de Git Credential Manager
sin `/dev/tty`). El 2026-09-22 se configuró el sincronizador de duo-burguer para publicar
en el PC con `git -c credential.helper=manager` y `GIT_TERMINAL_PROMPT=0`, y se reportó
que el PC ya publicaba solo; la primera publicación automática en vivo de ese día la hizo
el propio script **en la Mac**, tras rebasar sobre lo que subió el PC. Falta una medición
directa en el PC con ese `-c`: confírmala con un push real antes de afirmarla. La fila de
la tabla se matizó y la historia de abajo se deja tal cual. Además, esta
ola agregó las trampas del **arnés** en la Mac (pasos 12 a 22 de «Cómo se aplica»).

**Hay dos máquinas y no se parecen: mide en cuál estás antes de citar cualquier
límite.** `uname -s` responde en un segundo: `Darwin` es la **Mac**, cualquier otra
cosa es el **PC Windows**. La mitad de las restricciones que este tema documentó
durante meses son del PC y **en la Mac son falsas** — repetirlas ahí no es prudencia,
es dar por imposible algo que funciona.

**En la Mac: `git push` funciona** (`gh` autenticado como `kalelfelpem-glitch` hace de
credential helper), **hay `python3` y `pip3`**, **no hay Edge pero hay Chrome**, y **no
existe el techo de ~8 KB por comando**. En el PC: el push interactivo no sale (con `-c credential.helper=manager` el sincronizador está configurado para publicar, sin medición propia aún; ver arriba), no hay
Python, y el heredoc largo se trunca.

Lo que NO cambia de máquina: **medir antes de rendirse**, y no confundir *"la máquina
no puede"* con *"el agente murió"*.

**Tres cosas que en la Mac nadie ve venir:** una tarea programada que publica se atasca en
un permiso que nadie aprobó; cerrar el panel del navegador de la app apaga los servidores
que el dueño va a abrir; y la Mac dormida mata las corridas largas. Remedios en los pasos
12 a 15.

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
| `git push` por terminal | **SÍ** — `gh` es el helper | interactivo NO (Credential Manager sin `/dev/tty`); con `-c credential.helper=manager` el sincronizador está configurado para publicar y se reportó que funciona (`51184930`, 2026-09-22), sin medición propia aún |
| Python | **SÍ** — `python3` 3.9.6 y `pip3` | NO |
| Navegador Chromium | **Chrome** (no hay Edge) | **Edge** en `Program Files (x86)` |
| Viewport móvil real <480 px | **SÍ**, respeta 390 exactos | NO — Edge calculaba a ~480 |
| Techo por comando de Bash | **sin techo** (15 KB entraron enteros) | ~8 KB, y trunca sin avisar |
| `pdftoppm` / poppler | NO (pero hay `brew`) | NO |
| Docker | NO | NO |
| `timeout` (límite de tiempo a un comando) | **NO** — `command -v timeout gtimeout` vacío (medido 2026-10-18; falla con `command not found`). Usa `perl -e 'alarm 150; exec @ARGV' <comando>`, como en las llamadas largas a Gemini/Veo de duo-burger | no medido |
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

12. **Tarea programada que publica: apruébale los permisos ANTES de llamarla
    «automática».** Córrela una vez a mano y marca «Permitir siempre» para cada
    herramienta que usa (`git`, `publicar.sh`, `curl`); si no, queda esperando un permiso
    que nadie ve y muere con `Tool permission request failed: AbortError`. Su hora es «a
    partir de»: la app la mueve (pedí las 12:10 a.m. y quedó a las 12:23 a.m.) y con la
    Mac dormida corre al despertar, así que lo que debe estar a las 6:00 se programa con
    horas de margen. Al día siguiente comprueba en el sitio real que corrió, y dale
    condición de fin y autoridad mínima (sin commits ni redes).
13. **Corrida larga sin supervisión: keep-awake, sin límite de tiempo y verificado.**
    Pide `request_keep_awake` (o `caffeinate` atado al proceso), confirma al retomar que
    sigue activo y suéltalo al terminar. Uno con tiempo límite caduca solo (el del 9-sep
    había vencido veinte minutos antes de notarse). Un proceso de cobertura quieto, sin
    hijos y sin CPU por 50 min es un cuelgue, no un fallo de prueba: mátalo y repite (en
    esa corrida la Mac además se durmió 80 min y canceló 7 pruebas que pasaron al repetirlas
    despierta).
14. **Servidores que el dueño va a abrir: procesos independientes, no del panel.** La app
    apaga los servidores de `preview_start` al cerrarse el panel. Arráncalos aparte,
    comprueba con una petición real a cada puerto y, antes de una ola o de pedirle que
    mire, avísale «no cierres el panel» y deja un vigilante que reinicie. En producción el
    sistema exige https: en local corre en modo desarrollo.
15. **«Maximum 5 dev servers per folder»**: no detengas los de otras ventanas; sirve la
    carpeta con `python3 -m http.server` en un puerto libre (p. ej. 3610) y ciérralo al
    terminar (una entrada nueva en `launch.json` no destraba el tope). Una app con
    `localStorage` **no se prueba como `file://`** (Storage queda deshabilitado). Y en
    macOS el `sed` BSD falla con flags GNU: edita con Python.
16. **Pruebas con WebGL: el Chrome instalado, sin forzar SwiftShader.** `channel:
    'chrome'` headless; si pasas `--use-angle=swiftshader` renderiza por software a ~1
    fps. Sin forzar nada Chrome elige ANGLE-Metal y rinde a 60 fps. Si dudas, corre el
    mismo script con 3 variantes de args y lee renderer, fps y tiempo de carga.
17. **whisper.cpp: compílalo a mano y córrelo en CPU.** No `brew install` (compila Python
    entero: horas). v1.9.x con cmake desde el código (~3 min), `whisper-cli` en
    `/usr/local/bin`, siempre con `-ng` (sin Metal); el modelo large-v3-turbo (1,6 GB) va
    fuera de git. Presupuesto: 8 s de voz ≈ 45 s; un video de 15 s ≈ 1,5 min.
18. **No hay Excel, LibreOffice ni librería de .xlsx en la Mac.** Lee los .xlsx con un
    script propio que no instale nada, verifica los totales de las hojas que generes con
    un cálculo independiente y dile al dueño que **no se abrieron en Excel real**. Mide
    con `uname -s` antes de darlo por imposible: el PC puede tener Excel.
19. **`gh auth login`: flujo de dispositivo a mano, no con `expect`.** La consola de `gh`
    descarta lo que llega antes de pintar la pregunta. El dueño escribe el código de un
    solo uso en `github.com/login/device`, logueado con la cuenta correcta, y el token
    queda en el almacén de `gh` sin pasar por pantalla. Con dos cuentas en la Mac, da a
    cada clon sus credenciales locales.
20. **Los ajustes de Claude los instala el dueño con un `cp`.** El clasificador del modo
    automático bloquea que Claude escriba `.claude/settings.json`, `settings.local.json`
    o hooks (Self-Modification) y los reintentos por otras rutas caen en Instruction
    Poisoning o Auto-Mode Bypass. No insistas ni lo rodees: deja la plantilla en el repo
    (`docs/publicacion-automatica/settings.json`) y dale el `cp` de una línea más `git
    add`, commit y push para cada máquina. Y no leas el bloqueo como un no del dueño sin
    confirmarlo: el 22-sep Claude se detuvo tras un rechazo de herramienta a las 17:07 y el
    dueño tuvo que escribir «continua con mi peticion» (17:12, tras un `/compact`);
    después el clasificador bloqueó la escritura con Self-Modification (17:16).
21. **Dónde se clona cada cosa:** orion (la casa: memoria, cerebro, herramientas) →
    `prommter/` (la empresa, repo propio) → proyectos clonados dentro de `prommter/`,
    también cada repo de las cuentas. Se registran en el `.gitignore` de prommter como
    repo anidado, nunca submódulo ni gitlink. En el PC la ruta equivalente es
    `prommter/proyectos/<proyecto>`; confirma la vigente antes de dictarle un comando al
    dueño.
22. **Proyecto en carpeta compartida: acota `tsconfig`, ESLint y Prettier a su código**
    (`src/` y la configuración de la raíz) y deja escrito en su CLAUDE.md que todo código
    nuevo fuera de `src/` (un seed en `prisma/`, por ejemplo) se añade a los tres. Con
    `**/*.ts`, `typecheck` daba miles de errores ajenos y `lint` no terminó en 5 minutos;
    acotado, typecheck 7 s y build 23 s. Entre acotar y mover el proyecto, el dueño
    prefirió el cambio mínimo (`prommter/DEC-001`).

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

- **Tarea programada (12):** no hace falta si es de solo lectura sin permisos o si hay
  alguien al lado para aprobar. Para una hora fija pública que no es secreta, mejor que el
  reloj del cliente la muestre y la tarea solo deje el contenido listo de madrugada.
- **Keep-awake y servidores (13–15):** no aplican al PC Windows ni a una máquina que no
  duerme; si el dueño no necesita abrir nada, el servidor del panel basta para las
  pruebas propias. Páginas sin estado local pueden mirarse como `file://`.
- **GPU (16):** en el PC o en un contenedor sin GPU Chrome sí cae a SwiftShader (deja
  `--enable-unsafe-swiftshader` de respaldo y asume pruebas lentas); sin WebGL no se nota.
- **whisper (17):** con GPU real o Apple Silicon, Metal sí acelera y Homebrew no compila Python.
- **Excel (18):** si el dueño solo necesita CSV no hace falta .xlsx.
- **gh (19):** si el dueño puede teclear `gh auth login` en su terminal (ahí el modo
  interactivo sí funciona) o `gh auth status` ya muestra la cuenta correcta.
- **Ajustes (20):** si el dueño aprueba la escritura en el momento en la interfaz no hace
  falta el `cp`; jamás esquives el bloqueo escribiendo por otra ruta.
- **Carpetas (21–22):** repos de terceros u organizaciones ajenas no se clonan en la
  empresa sin permiso; si el proyecto es el único en su carpeta no hay nada que acotar.

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

Cosecha de las ventanas (2026-11-02):

- Contradicción del push en el PC: «En el PC publica con `-c credential.helper=manager`, que es justo lo que esa máquina midió que funciona» y «el propio script hizo el rebase y publicó solo» (esa ejecución fue en la Mac, no en el PC) — ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `51184930`, 2026-09-22).
- Tarea programada atascada: «Tool permission request failed: AbortError: Tool permission stream closed before response received» — ventana [[2026-10-05-duo-burguer-publicar-la-pagina-cada-dia-00-10-ante|Publicar la página cada día]] (transcrito `2cc930f8`, 2026-10-19); «Corrió el 5 de octubre y no volvió a publicar.» y «La hora la ajustó la app (yo pedí 12:10).» — [[2026-09-09-duo-burger|Duo Burger]] (`51184930`, 2026-10-21 y 2026-10-04); «Ya pasaron las 06:00 en Bogotá (son las 09:39). Publico.» y el mismo AbortError el 11-02 — [[2026-10-24-duo-burguer-publicar-la-revelacion-del-evento-sab-|Revelación del evento]] (`d6a3781b`, 2026-10-24). Que esa publicación siga esperando permiso es inferencia del AbortError.
- Servidores y sueño: «no me deja abrir» y «The app shut both servers down when it closed the browser panel, about 28 minutes ago.» — [[2026-09-09-duo-burger|Duo Burger]] (`7f456016`, 2026-10-23); «lleva 50 minutos sin usar CPU» (2026-10-24) y «Siete pruebas se habían cancelado solo porque la Mac se durmió 80 minutos» (2026-10-25) — misma ventana. «Cerrar el panel del navegador apaga los servidores.» — ventana [[2026-10-22-orion-app-de-rutina-sincronizada|ORION app de rutina]] (`b5eb380b`, 2026-10-23).
- Keep-awake: «Buen aviso: el anterior había caducado hace veinte minutos. Ya está reactivado, ahora sin límite de tiempo.» (2026-09-10) y «no lo dejes apagar hasta que acabe» (2026-09-24) — [[2026-09-09-duo-burger|Duo Burger]] (`51184930`). Que el bloqueo caducado fuera `caffeinate` es lectura, no cita.
- Tope de 5 servidores: «Maximum 5 dev servers per folder reached; 5 belong to other chats.» — ventana [[2026-10-31-que-cremoso-marca|Qué Cremoso marca]] (`72ffaa4c`, 2026-11-02); «no los voy a detener yo. Lo rodeo: levanto la vitrina con un servidor estático» y «BSD sed falló; aplico el cambio con Python» — [[2026-10-31-que-cremoso-vitrina|Qué Cremoso vitrina]] (`6f3a4ef7`, 2026-11-02); «Failed to read the 'localStorage' property from 'Window': Storage is disabled» — [[2026-09-09-la-villa-sistema|La Villa sistema]] (`129e1026`, 2026-11-02).
- GPU: «Playwright 1.63 ya no trae Chromium para macOS 13, que es la versión de este equipo.», «Cada página tarda 20-40 s porque el navegador sin interfaz dibuja el 3D por software.» y «58 de 58 pruebas pasan, ahora en 3,6 minutos en vez de 16,6.» — ventana [[2026-10-19-prototipo-web-de-cerebro-3d-interactivo-con-enferm|Prototipo cerebro 3D]] (`71c5f9e6`, 2026-10-19). Las cifras del experimento de 3 filas (ANGLE-Metal sobre Intel Iris Plus 640, 60,3 fps, carga 21,3 s la primera y 5,2 y 4,5 s las siguientes) salen del transcrito crudo (21:53–21:54), no del resumen.
- whisper: «Con Homebrew no se pudo, porque se puso a compilar Python entero y en esta Mac eso tarda horas» y «8 s de voz tardaron 45 s» — ventana [[2026-10-26-contenido-motiongraphus-llamativo|Contenido motion graphics]] (`1f894ae1`, 2026-10-26); el flag `-ng` sale de la memoria del dueño (project_video_en_esta_mac).
- Excel: «en esta Mac no hay Excel ni LibreOffice» y «Los totales coinciden exactamente con un cálculo independiente» (costo directo $98.300.000, total $116.927.850) — [[2026-10-19-mercado-de-plantillas-arquitectura|Mercado de plantillas]] (`007a9e6f`, 2026-10-19); «El Mac no tiene librería para Excel, así que los leo con un script propio que no instala nada.» — [[2026-10-19-dropshipping-con-flujo-n8n|Dropshipping n8n]] (`00af789e`, 2026-10-21).
- gh: «El pipe a través de script no entrega el input a la consola de gh.», «La consola de gh descarta el input pendiente cuando entra en modo lectura» y «los push de placita salen con tu cuenta nueva, sin tocar las credenciales viejas del resto de la Mac» (cuatro intentos en ~14 min, solo el flujo manual funcionó) — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|Sincronizar ORION]] (`630e0fde`, 2026-08-31). Misma ventana para la jerarquía: «adentro de ella va prommter que es nuestra empresa», «y infrapilot es un proyecto mas d prommter, los repos en la cuena tambien son proyectos, guardalos» y «El gitdir movido aún apuntaba al worktree viejo en su config y git no podía ni arrancar para corregirlo».
- Ajustes: «Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Self-Modification].» (17:16), `[Instruction Poisoning]` y `[Auto-Mode Bypass]` (18:16, 18:18), «continua con mi peticion» y «Te lo dejé listo; son dos comandos.» — [[2026-09-09-duo-burger|Duo Burger]] (`51184930`, 2026-09-22).
- Carpeta compartida: «npm run typecheck falla con miles de errores, pero todos vienen de otras carpetas», «npm run lint no terminó en 5 minutos» y «Typecheck en verde (7 s)» — ventana [[2026-10-24-bot-recolector-de-informacion-prommter-fork|Bot recolector Prommter]] (`34a80c58`, 2026-10-24).
- Objetos de memoria de esta cosecha: `_permanent/KN-020` a `KN-024`.

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
