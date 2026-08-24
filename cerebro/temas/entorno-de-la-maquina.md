---
slug: entorno-de-la-maquina
titulo: Lo que esta máquina puede y no puede hacer
alias: [push, git push, subir el codigo, subir a github, publicar el repo, credential, credential manager, github desktop, desktop, commit, rama, remoto, terminal, consola, maquina, entorno, esta maquina, mi pc, computador, dos computadores, instalado, no esta instalado, falta instalar, python, pip, docker, node, npm, powershell, ps 5.1, bash, heredoc, comando largo, se corta, truncado, utf8, tildes, acentos, mojibake, encoding, json corrupto, puerto, puertos, localhost, launch.json, servidor local, dev server, arrancar el servidor, wifi, wifi del local, firewall, red local, red publica, lan, celular, telefono, escala de windows, permisos del agente, sandbox, scratchpad, limite de sesion]
preguntas: ["por que no me deja hacer push desde la terminal", "por que no puedo subir el codigo a github desde aqui", "que hay instalado en esta maquina y que no", "por que el comando largo se corta a la mitad", "por que el celular no abre el sistema en la wifi del local", "en que puerto arranca cada proyecto"]
proyectos: [_permanent, infrapilot, prommter, wrd, villa-broaster, placita, estanco-contable, pollo-landing, landings]
confianza: alta
actualizado: 2026-08-24
---

# Lo que esta máquina puede y no puede hacer

## Respuesta corta

**El push por terminal no falla por tu repo: falla por la máquina.** Git Credential
Manager no tiene consola donde pedir la clave (`no /dev/tty`) y aborta con *"User
cancelled dialog"*. **Commitea siempre —a `main` o a una rama— y sube por GitHub
Desktop, que ya está autenticado**, dejando escrita la lista de commits pendientes.
La misma lógica manda en todo lo demás: aquí **no hay Python, ni Docker, ni
poppler**; sí hay Node 24, npm, git y Edge. Y **todo comando de Bash de más de ~8 KB
se trunca**: los archivos grandes se escriben con Write/Edit, nunca por heredoc.
Antes de decir "no se puede", **mide qué SÍ hay** (`node -v`, `command -v python`):
casi siempre existe el sustituto.

## Por qué (qué lo pagó)

Lo pagó el primer commit de ORION. El 2026-07-01, `git push -u origin main` murió con
el diálogo de Git Credential Manager cancelado y sin `/dev/tty` donde pedir
credenciales (`infrapilot/KN-001`). El hecho se ascendió a machine-level porque no
era del repo: pasa en **todos** los repos de esta máquina (`_permanent/KN-001`). Hoy
sigue vigente: `git config --global` devuelve `credential.helper=manager`, y GitHub
Desktop está instalado en `C:\Users\Kalel\AppData\Local\GitHubDesktop`.

De ahí salió una política, no un parche: ORION **autocommitea al pasar verificación y
nunca hace push**, y lista los commits pendientes para el dueño
(`infrapilot/DEC-005`). El costo de no tenerla escrita se ve en la cola: siete
commits esperando en `infrapilot/PEND-004`, seis repos por re-agregar más los commits
del asadero en `prommter/PEND-001`, y el primer push nunca hecho de
`pollo-landing/PEND-002`.

**La trampa más cara de este tema es una memoria que se contradice sola.**
`villa-broaster/KN-014` registra como patrón *"git commit + git push origin
feature/roles-puestos mantiene main limpio"*. Comprobado el 2026-08-24 en
`C:\Users\Kalel\prommter\proyectos\villa-broaster\broaster-app`: la rama
`feature/roles-puestos` existe **local**, y `git remote -v` no devuelve **nada** — no
hay remoto, así que ese push no ocurrió nunca. La mitad buena del patrón (commitear a
una rama en vez de dejarlo en stash) es real y salvó el trabajo; la mitad del push es
un recuerdo inventado por un agente que asumió una máquina normal.

El resto de los límites también se pagaron con fallos concretos:

- **Sin Python**: no hay `python` ni `python3`, así que reportlab/pypdf no son opción;
  se descubrió generando el plan del asadero (`_permanent/KN-004`). Tampoco hay
  `pdftoppm`, así que Read no renderiza páginas de PDF (`_permanent/KN-005`).
- **Bash se trunca a ~8 KB**: un heredoc de ~150 líneas reventó con *unexpected EOF*
  en la línea 145 y **no creó el archivo**; además el wrapper colapsa `\\` en `\`.
  Pagado el 2026-08-21 escribiendo `edge-cdp.mjs` (`_permanent/KN-011`).
- **PowerShell 5.1 corrompe UTF-8**: un `Get-Content -Raw` + `-replace` +
  `Set-Content -Encoding utf8` sobre un JSON sin BOM lo devolvió con BOM y mojibake, y
  el validador ORION reventó con *Unexpected token* (`prommter/KN-002`).
- **El clasificador de permisos bloquea dos cosas**: `npm install` desde una URL/CDN, e
  INSERT/UPDATE/DELETE contra bases compartidas sin permiso explícito
  (`infrapilot/KN-019`). Por eso el parche del `xlsx` de SheetJS quedó como tarea del
  dueño y no como algo que un agente pueda forzar (`infrapilot/KN-017`).
- **El celular del dueño no entra por WiFi** aunque el server escuche en `0.0.0.0`: la
  red del local está categorizada como **pública** en Windows y el firewall corta las
  entrantes a node (`wrd/KN-009`).

Y una barrera que resultó ser falsa, que es la razón de medir antes de rendirse: se
creía que no se podía probar SQL sin Supabase ni Docker. `npm i embedded-postgres`
levanta un PostgreSQL **18.4 real** en el scratchpad; así se validó
`001_rol_actual.sql` con 37/37 asserts (`estanco-contable/KN-008`).

## Cómo se aplica

1. **Git, siempre igual**: `git add` + `git commit` (a `main` o a `feature/*`), y
   **parar ahí**. Escribe el pendiente con los hashes exactos y el repo, para que el
   dueño lo suba en GitHub Desktop en un minuto. Nunca `git push`.
2. **Diagnostica antes de culpar al credential manager**: si `git remote -v` sale
   vacío, el problema no es la autenticación, es que **falta crear el remoto** — ese
   es el caso de `pollo-landing/PEND-002` y de `broaster-app` hoy.
3. **Mide el entorno, no lo supongas**: `node -v`, `npm -v`, `git --version`,
   `command -v python`, `command -v docker`. Cuesta un segundo y evita media hora de
   plan imposible.
4. **Archivos grandes con Write/Edit**; comandos Bash cortos (<~5 KB) y sin depender
   de backslashes literales (`_permanent/KN-011`).
5. **JSON y UTF-8 jamás con cmdlets de PS 5.1**: usa Edit o node. Si ya se corrompió,
   `git checkout` del archivo y volver a aplicar con Edit (`prommter/KN-002`).
6. **Puertos, de un archivo, no de memoria** — `C:\Users\Kalel\fable 5\.claude\launch.json`:
   `wrd` 4181 (línea 8), `broaster-app` 3200 (14), `villa-app` 3201 (20), `placita`
   3300 (26). Ese archivo es **compartido entre sesiones de proyectos distintos**: otra
   sesión puede pisarlo, así que verifica que tu entrada siga ahí antes de arrancar
   (`wrd/KN-001`).
7. **Para probar desde el celular**: el server escucha en `0.0.0.0` e imprime la IP LAN
   al arrancar (es DHCP: léela del log, no la memorices). Si no entra, es el perfil de
   red — lo cambia **el dueño**: Configuración → Red e Internet → marcar "Red privada"
   (`wrd/KN-009`).
8. **Lo que solo puede hacer el dueño se escribe como Pending, no se intenta**: push,
   `npm install` desde URL, escrituras a la base compartida, ajustes de seguridad de
   Windows (`infrapilot/KN-019`, `infrapilot/KN-017`).
9. **Cuidado con el navegador de esta máquina en `localhost:3300`**: su localStorage
   guarda facturas de PRUEBA completas; si alguien configura ahí la clave de caja, la
   siguiente sincronización sube datos falsos al negocio vivo (`placita/RSK-004`).

## Cuándo NO aplica

- **No confundas "la máquina no puede" con "el agente murió"**. Cuando un builder cae
  por límite de sesión, el código normalmente **ya está en disco**: audita disco, `tsc`
  y build antes de re-spawnear — en una corrida los 4 builders muertos habían entregado
  (`estanco-contable/KN-009`), y en otra el trabajo ya estaba commiteado
  (`villa-broaster/KN-014`). Ver [[TEMA-olas-de-agentes]].
- **Estas son verdades de ESTA máquina, no del stack ni de la máquina del cliente.** En
  el mostrador de la plaza el sistema corre con `npm start -p 3300` desde
  `iniciar-mercaplaza.bat` y el estado vive en el navegador: **2 PCs = 2 inventarios**
  (`placita/KN-008`). Nada de lo de arriba explica eso.
- **Toda medición tiene fecha.** El caso de `embedded-postgres` demuestra que una
  imposibilidad puede caducar (`estanco-contable/KN-008`): si dudas, vuelve a medir
  antes de repetir la restricción.
- **Para juzgar cómo se VE algo**, este tema no es la fuente: el navegador embebido y
  Edge headless tienen trampas propias (viewport mínimo ~492 px, `prefers-reduced-motion`
  forzado, escala de Windows al 125%) que están en `landings/KN-003`, `_permanent/KN-008`,
  `_permanent/KN-009` y `_permanent/KN-010`. Ver [[TEMA-verificar-con-evidencia]].

## Evidencia

Medición propia del 2026-08-24 en esta máquina:

```
node v24.16.0 · npm 11.13.0 · git 2.55.0.windows.1
python: NO · python3: NO · pdftoppm: NO · docker: NO
msedge: SI  (C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe)
git config --global → credential.helper=manager
GitHub Desktop: C:\Users\Kalel\AppData\Local\GitHubDesktop  (instalado)
broaster-app → rama local feature/roles-puestos · git remote -v: (vacío)
```

- `_permanent/KN-001` — push por terminal imposible; GitHub Desktop es la vía. Aplica a todo repo de la máquina.
- `infrapilot/KN-001` — el fallo original (`git push -u origin main`, 2026-07-01) del que salió el hecho.
- `infrapilot/DEC-005` — política: autocommit al pasar verificación, push manual.
- `infrapilot/PEND-004`, `prommter/PEND-001`, `pollo-landing/PEND-002` — la cola real de commits sin subir.
- `villa-broaster/KN-014` — contradicción documentada: registra un `git push origin feature/*` que la máquina no permite; la rama existe local y sin remoto.
- `_permanent/KN-004` — no hay Python; Edge headless en `Program Files (x86)` es el sustituto.
- `_permanent/KN-005` — no hay `pdftoppm`: un PDF se verifica parseando su estructura con node.
- `_permanent/KN-011` — Bash se trunca a ~8 KB y colapsa `\\`; archivos grandes con Write.
- `prommter/KN-002` — PowerShell 5.1 corrompe JSON UTF-8 (BOM + mojibake); recuperación con `git checkout` + Edit.
- `infrapilot/KN-019` — dos bloqueos del clasificador de permisos: `npm install` por URL y escrituras a BD compartida.
- `infrapilot/KN-017` — consecuencia: el upgrade de `xlsx` por tarball CDN es acción manual del dueño.
- `estanco-contable/KN-008` — se puede probar SQL real aquí: `embedded-postgres` (PostgreSQL 18.4) en el scratchpad, 37/37.
- `wrd/KN-001` — `.claude/launch.json` es compartido entre sesiones; el puerto de wrd ya cambió de 4180 a 4181.
- `wrd/KN-009` — firewall + WiFi "pública" bloquean el celular; lo arregla el dueño.
- `placita/KN-008` — producción local: `iniciar-mercaplaza.bat`, `npm start -p 3300`, 2 PCs = 2 inventarios.
- `placita/RSK-004` — el localStorage de `localhost:3300` de esta máquina contiene facturas de prueba.
- `estanco-contable/KN-009` — muerte por límite de sesión ≠ falta de capacidad: el código ya suele estar en disco.
- Puertos verificables: `C:\Users\Kalel\fable 5\.claude\launch.json:4-27`.
- Herramienta de QA visual instalada y verificada: `C:\Users\Kalel\ORION\tools\edge-cdp.mjs` (`_permanent/KN-010`).

### Huecos explícitos (el corpus NO lo respalda)

- **No hay ninguna nota sobre si `git fetch`/`clone`/`pull` funcionan** en esta máquina.
  Todo lo documentado es sobre `push`. No supongas que fallan igual: mídelo.
- **No hay evidencia de despliegue a internet desde aquí.** `pollo-landing/PEND-001` y
  `arroces/PEND-004` siguen bloqueados por "definir hosting"; ningún objeto describe un
  deploy ejecutado desde esta máquina.
- **No hay nota de impresora, báscula ni lector de barras conectados a ESTA máquina**;
  lo que existe es código de esos periféricos en el sistema del local.

## Enlaces

- [[TEMA-verificar-con-evidencia]] — cómo se mide un resultado en esta máquina (Edge, capturas, PDF).
- [[TEMA-olas-de-agentes]] — qué hacer cuando el límite de sesión mata builders.
- [[TEMA-modelos-y-costos]] — el otro límite duro del entorno: cuánto cuesta cada spawn.
