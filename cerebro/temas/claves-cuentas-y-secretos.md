---
slug: claves-cuentas-y-secretos
titulo: "Claves, tokens y cuentas: que ningún secreto pase por el chat, y no tocar la cuenta equivocada"
alias: [secreto, secretos, clave expuesta, clave en el chat, contrasena en el chat, pegue la contrasena, guarda esta contrasena, guardar contrasena, donde estan las contrasenas, cuales son las contrasenas, contrasenas del sistema, rotar contrasena, rotar clave, gestor de contrasenas, pin expuesto, ver el pin, pin temporal, pin de fabrica, PIN_ARRANQUE, historial de la terminal, historial de comandos, pegar la terminal, pantallazo con clave, token, tokens, token de telegram, botfather, llave, llaves, llave de api, api key, apikey, pegar la llave, poner la llave, tu-llave, read -rs, pbpaste, archivo .env, env, variables de entorno, textedit, runware, fal.ai, llave de google, olvide la clave, se me olvido la clave, recuperar clave, clave del admin, hash de la clave, crackear, clasificador, credential materialization, auto mode, pdf de claves, claves de correos, borrar el pdf, ya las guarde, contrasenas de 20 caracteres, cuenta de google equivocada, cuenta equivocada, conector de calendar, google calendar cuenta, sesion de chrome, openssl rand, archivo 600]
preguntas: ["¿Cuáles son las contraseñas del sistema y dónde las guardo?", "Le pegué la contraseña en el chat, ¿qué hago?", "¿Cómo te paso la llave o el token sin ponerlo en el chat y cómo sabes que quedó bien?", "Le di un comando al dueño para guardar la llave y no pasa nada, ¿cómo lo guío mejor?", "Se me olvidó la clave del admin, ¿la puedes sacar del hash?", "¿Cuándo borras el PDF con las claves nuevas?", "¿Por qué no usaste la cuenta de Google que ya tenía abierta?"]
proyectos: [villa-broaster, duo-burguer, wrd, correos-por-empresa, dropshipping-n8n, plan-de-anuncios, agenda-4-empresas]
confianza: alta
actualizado: 2026-11-02
---

# Claves, tokens y cuentas: que ningún secreto pase por el chat, y no tocar la cuenta equivocada

## Respuesta corta

1. No des comandos que impriman PIN, claves o tokens: diagnostica con sí/no o conteos.
2. Contraseña pegada en el chat: no la escribas en archivos; que la rote y viva solo en su gestor.
3. Claves del sistema: genéralas en el servidor, archivo 600, sin mostrarlas; tokens: los pega él en su `.env`, validados sin imprimir.
4. Claves nuevas: solo en un PDF, que se borra cuando él confirme que las guardó.
5. Antes de escribir en una cuenta de Google, confirma que es la pedida.

## Por qué (qué lo pagó)

- **PIN expuesto, 28-sep (Duo Burguer).** El PIN de fábrica que el dueño escogió quedó escrito en su
  terminal y en el chat al fijarlo; después pidió «un comando para ver el pin» (otra exposición) y
  entró «con el código viejo»: su PIN definitivo era el expuesto. Hubo que pedirle cambiarlo otra
  vez y borrar la variable `PIN_ARRANQUE` del servidor y el historial. Lo que sí resolvió fue el
  diagnóstico que no imprimía secretos (si el PIN guardado coincide, bloqueos, horas desde que
  se sembró).
- **Contraseña pegada para «guardarla», 8/9-sep (sistema de Villa Broaster).** El dueño pegó una
  contraseña de base de datos para que Claude la guardara y luego preguntó «cuáles son las contraseñas
  del sistema»: espera que Claude las tenga. La respuesta correcta fue un **mapa**, no valores: cuál
  es, dónde vive, quién la ve. `ADMIN_CLAVE` del dueño (20+ caracteres, archivo 600 generado en el
  servidor «sin que aparezca en pantalla»), PIN de los cajeros (scrypt, se crean desde el panel),
  `SESION_SECRETO` derivado (si cambia `ADMIN_CLAVE` se cierran las sesiones), root del VPS (panel del
  hosting) y llaves de despliegue de solo lectura. Claude: «No la sé, y fue a propósito.»
- **Llave pegada en la línea equivocada, 20-oct (bot de Telegram).** El token del bot quedó pegado
  en la línea de la llave de Claude; Claude lo movió sin mostrarlo y avisó que el editor abierto,
  si guardaba, **pisaba la corrección**. El segundo intento salió bien.
- **Llave que «no hace nada», 6-oct (anuncios).** 26 minutos y unos 10 mensajes del dueño: el primer
  comando guardó el texto de ejemplo «tu-llave» en vez de la llave real (sin avisar), la llave de 32
  caracteres era de **Runware**, no del servicio que Claude suponía (se vio solo cuando el dueño mostró
  la captura), y dos llaves quedaron visibles en el historial de la terminal. El dueño: «que culpa tengo».
- **Clasificador de seguridad, 13-sep (WRD).** Al intentar sacar la clave del administrador a partir de
  su hash, la herramienta fue bloqueada y la respuesta se cortó. El camino limpio (poner una clave nueva
  elegida por el dueño) no se bloqueó. Ver «Qué NO se hace» abajo: es una regla de conducta, no un truco.
- **Claves de correos por empresa, 23-oct.** Las contraseñas de 20 caracteres solo existieron en el PDF
  (ni en el chat, ni vistas por Claude, ni en otro archivo); el PDF se borró del Escritorio solo cuando
  el dueño confirmó que ya las tenía guardadas. En esa misma tarea, al ordenar el Escritorio por
  proyecto, revisar capturas sueltas disparó el bloqueo «Credential Materialization».
- **Cuenta equivocada, 23-sep (horario).** El dueño pidió el horario en una cuenta de Google, pero Chrome
  solo tenía abierta la sesión de **otra** y el conector de Calendar no estaba activo; no se forzó la
  cuenta disponible porque no era la pedida.

## Cómo se aplica

1. **Comandos que le das al dueño: nunca imprimen secretos.** Él pega pantallas enteras. Usa
   comprobaciones de sí/no o conteo (si coincide, cuántos bloqueos hay, cuántos caracteres tiene). Si debe fijar un PIN
   temporal, dile **antes** que es desechable y que el definitivo tiene que ser otro que solo él sepa;
   luego borra la variable del servidor y el historial.
2. **Si pega una contraseña en el chat y pide guardarla:** no la escribas en archivo alguno ni la repitas.
   Si es real, que la **rote** y viva solo en el panel del hosting o su gestor. Dile que lo que cayó en el
   chat ya está comprometido.
3. **Las claves del sistema se crean en el servidor**, directo a un archivo `600` solo-root
   (`openssl rand` sin eco). Cuando pregunte «¿cuáles son las contraseñas?», contesta con el mapa
   (cuál, dónde vive, quién la ve), no con valores.
4. **Pedirle una llave o un token:**
   - dile la variable y el **número de línea**; que lo pegue él, nunca por el chat;
   - al primer fallo, pídele una **captura con la llave tapada** para ver en qué servicio está
     (la llave puede ser de otro proveedor);
   - **jamás un comando con texto de ejemplo** («tu-llave»): al correrlo tal cual guarda el ejemplo y no
     avisa. Usa `read -rs` que pida la llave y diga **cuántos caracteres guardó**, y valida el formato sin
     imprimirla;
   - verifica sin imprimir valores qué variable quedó llena; si corregiste el archivo, avísale que
     **cierre el editor sin guardar** (si guarda, pisa tu corrección);
   - al terminar, que borre las llaves viejas del historial de la terminal; pon un **tope de gasto
     mensual** en la consola de la API.
5. **Claves nuevas de un proyecto (correos, cuentas):** solo dentro de un PDF, jamás en chat ni en otro
   archivo de texto. **No lo borres hasta que el dueño diga explícitamente que ya las guardó**: antes de
   eso no hay copia. Los registros (`registro.json`) nunca llevan claves.
6. **Cuentas de Google:** antes de crear eventos o escribir en una cuenta, comprueba qué sesión está
   abierta en el navegador y qué conector está activo. Si no es la pedida, **no uses la que sí está
   disponible**: pide que conecte la correcta.
7. **Qué NO se hace con una clave perdida:** nunca intentes recuperar la clave de un administrador desde
   su hash por ningún método: el sistema de permisos lo bloquea porque no se distingue de un ataque.
   Ofrece fijar una clave **nueva** que el dueño elija (hash nuevo). La recuperación de las cuentas de
   correo, además, es por Google, no por Claude.
8. **Carpetas con posibles credenciales** (capturas sueltas en el Escritorio, configuraciones): para y
   pide permiso explícito antes de abrirlas una por una para clasificarlas.

## Cuándo NO aplica

- **Llaves PÚBLICAS** (SSH, deploy keys), dominio e IP del VPS **no son secretos** y se pueden pegar. Las
  claves de demostración van en `.env.example`.
- Si la clave se entrega por un **canal seguro** (gestor de contraseñas que la inyecta, sobre sellado), o
  el comando imprime algo que no es sensible, la regla 1 no estorba pero tampoco hace falta.
- **Inicio de sesión por navegador (OAuth/gcloud):** no hay llave que pegar, y esa es la vía preferida
  cuando existe.
- No sustituye **rotar** la clave que ya cayó en el chat: guardar el mapa no arregla una exposición.
- Poner una clave NUEVA sí se puede (calcular el hash correspondiente); el límite es solo intentar
  adivinar o descifrar la VIEJA.
- Si necesitas las mismas claves repartidas en varios PDF (uno por empresa), no se pueden copiar de un
  archivo a otro (el clasificador lo bloquea): genera claves **nuevas** para cada separación.
- Mover o renombrar archivos **sin abrirlos** no dispara el bloqueo de credenciales; salta al revisar qué
  hay dentro de lo que parece una credencial.
- Si el dueño **no especificó** qué cuenta de Google usar, se puede usar la única sesión disponible.

## Evidencia

- «el número quedó escrito en la terminal y en este chat» — ventana [[2026-09-09-duo-burger|Duo Burger]]
  (transcrito `51184930`, 2026-09-28); también «quiero que me des un comando para ver el pin» y
  «ya entre con el codigo viejo» (misma ventana, 2026-09-28).
- «guarda esta contraseña y dime como solucionamos lo de la base de datos», «no voy a guardar esa
  contraseña en ningún archivo», «Genero la clave sin que aparezca en pantalla», «cuales son las
  contrase;as del sistema», «No la sé, y fue a propósito.» — ventana
  [[2026-09-08-sistema-de-villa-orion|Sistema de Villa Orion]] (transcrito `f7689b06`, 2026-09-08/09).
- «Permission for this action was denied by the Claude Code auto mode classifier» — ventana
  [[2026-09-13-abrir-locales-wrd-vitrina-y-sistema|Abrir locales WRD]] (transcrito `449b4666`, 2026-09-13).
- «Solo existen en ese PDF. No salieron en el chat, yo tampoco las vi y no están en ningún otro archivo»
  y «Borré el PDF del Escritorio... No lo envié a la papelera, así que no se puede recuperar» — ventana
  [[2026-10-23-correos-y-claves-para-proyectos|Correos y claves]] (transcrito `52401c56`, 2026-10-23).
- «Permission for this action was denied... Reason: [Credential Materialization]» — misma ventana
  (transcrito `52401c56`, 2026-10-23).
- «el token quedó pegado en la línea de ANTHROPIC_API_KEY y no en la de TELEGRAM_TOKEN», «ciérralo sin
  guardar. Si lo guardas, vuelve a escribir la versión vieja encima de la corregida» — ventana
  [[2026-10-19-dropshipping-con-flujo-n8n|Dropshipping con flujo n8n]] (transcrito `00af789e`, 2026-10-20).
- «guardó el texto de ejemplo «tu-llave» en vez de tu llave real», «no es fal.ai, es Runware», «en
  intentos anteriores pegaste dos llaves sueltas, y quedaron visibles en el historial» — ventana
  [[2026-10-05-plan-de-anuncios-profesionales|Plan de anuncios profesionales]] (transcrito `3d75e606`,
  2026-10-06).
- «No lo metí en esa cuenta porque no es la que pediste» — ventana
  [[2026-09-23-horario-diario-y-gestion-financiera|Horario diario y gestión financiera]] (transcrito
  `90266543`, 2026-09-23).
- Memoria del dueño `project_correos_por_empresa` (claves solo en PDF; las cuentas las crea el dueño; no
  se extraen claves de un PDF a otro).

## Enlaces

- [[TEMA-acceso-roles-y-puestos]] — el login de los sistemas (PIN, bloqueos, qué ve cada rol); aquí está la
  conducta alrededor de los secretos, allá el diseño del acceso.
- [[TEMA-como-pide-el-dueno]] — qué cosas no se hacen por él aunque las pida.
- [[TEMA-como-entregar-al-dueno]] — dónde queda el PDF en el Escritorio.
- [[TEMA-ventanas-por-cliente]] — una cuenta/correo por empresa.
