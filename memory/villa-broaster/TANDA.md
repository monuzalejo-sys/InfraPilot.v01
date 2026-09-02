# villa-broaster — la tanda de ahora

> 8 tareas, de 260 que tiene el plan (0 hechas).
> Generado de `plan.json` v9. Se regenera con `plan.mjs tanda`.

## Lo que vamos a hacer

**Objetivo del proyecto.** Dejar a Villa Broaster cobrando, cuadrando y vendiendo en internet con datos reales del cliente

**Esta tanda, en una línea por área:**

- **backend** (4) — Correr las pruebas del dominio sin servidor y sin base de datos; Cortar el arranque si falta una variable de entorno declarada; Dejar un solo módulo que escribe cada hecho y una sola fuente para leerlo; Envolver cada ruta para que ninguna excepción salga sin registro.
- **calidad** (1) — Darle a la vitrina la misma puerta de calidad que al sistema.
- **operacion** (3) — Impedir por código que dos procesos escriban data/, no solo por documento; Sacar el destino del proxy de la vitrina fuera del código; Publicar los tres repos y abrirle la puerta al equipo.

**Cuesta** 1850k tokens de subagente y va en modo evolución: cada tarea lleva su chequeo de regresión, porque hay un sistema vivo.

---

## 1. Impedir por código que dos procesos escriban data/, no solo por documento

`T-007` · operacion · nivel N0 (Cimientos) · dificultad hard · necesita varios agentes · ~689k tokens

**Por qué.** El carril de escritura de lib/servidor/almacen-disco.ts:207-231 serializa dentro de UN proceso de Node y nada más: dos procesos sobre la misma carpeta leen el mismo consecutivo, sacan el mismo L1-0007 y una venta desaparece sin que nadie se entere hasta el cuadre. Hoy la única defensa es una frase en docs/REPOS.md y docs/CAMBIO-DE-CAMINO.md; docs/DESPLIEGUE.md, que es donde T-05 dice que va escrita, ni siquiera existe. Y ya pasó de verdad: KN-020 registra que dos verificadores en paralelo compartieron data/ y dejaron turnos.json en 0 bytes.

**Qué hay que hacer.**

1. Crear lib/servidor/cerrojo.ts: al abrir el almacén, escribir un archivo de cerrojo en data/ con el pid y la hora, y negarse a arrancar con un mensaje claro si ya hay uno vivo.
2. Un cerrojo viejo de un proceso muerto no puede dejar el local sin caja: comprobar si el pid sigue vivo y, si no, tomarlo.
3. Hacer la carpeta de datos configurable por variable de entorno, con data/ como valor por defecto, para que un verificador pueda apuntar a su propia copia (es la mitad operativa de KN-020).
4. Escribir docs/DESPLIEGUE.md con la regla del único escritor, la rotación de ADMIN_CLAVE, qué se copia y qué no de data/, y qué hacer cuando el cerrojo queda trabado.
5. Test que arranque dos almacenes contra la misma carpeta y compruebe que el segundo falla en vez de escribir.

**Archivos que toca (y nadie más):** `broaster-app/lib/servidor/almacen-disco.ts` · `broaster-app/lib/servidor/almacen-disco.test.ts` · `broaster-app/lib/servidor/cerrojo.ts` · `broaster-app/lib/servidor/cerrojo.test.ts` · `docs/DESPLIEGUE.md`

**No se tocan:** `broaster-app/lib/servidor/almacen.ts` · `broaster-app/lib/servidor/contabilidad.ts` · `docs/REPOS.md`

**Cómo sabremos que quedó bien.**

- el segundo proceso se niega a escribir → **pasa el caso de dos almacenes sobre la misma carpeta: el segundo falla con mensaje, no escribe**
  ```bash
  cd broaster-app && npm test -- --test-name-pattern="cerrojo"
  ```
- la regla está escrita donde T-05 la pide → **1 o más (hoy el archivo no existe)**
  ```bash
  grep -c "una sola instancia\|UNA sola instancia" docs/DESPLIEGUE.md
  ```
- REGRESIÓN · el consecutivo por local sigue sin repetirse → **pass 177 o más, fail 0; los tests de numeración L1-XXXX y del carril siguen verdes**
  ```bash
  cd broaster-app && npm test
  ```
- REGRESIÓN · la app arranca normalmente con un solo proceso → **código de salida 0, y el servidor levantado responde 200 en /api/admin/login**
  ```bash
  cd broaster-app && npm run build
  ```

_Ya sabemos algo de esto:_ `donde-vive-el-dato` · `dominio-migraciones-y-copias` · `olas-de-agentes`

**Lanzar:** `/orion T-007`

## 2. Sacar el destino del proxy de la vitrina fuera del código

`T-008` · operacion · nivel N0 (Cimientos) · dificultad trivial · se hace inline

**Por qué.** villa-app/next.config.ts escribe http://localhost:3200 a mano en el rewrite de /api/:path*. Es exactamente lo que su propio comentario promete evitar («el día que broaster-app cambie de puerto o de máquina, se cambia una línea aquí»): funciona en el PC del dueño y no funciona el día que las dos apps se desplieguen, porque en producción el sistema no está en el localhost de la vitrina. La vitrina es stateless y no tiene .env.example, así que el que despliegue no tiene ni dónde mirar qué configurar.

**Qué hay que hacer.**

1. Leer el destino de una variable de entorno con http://localhost:3200 como valor por defecto de desarrollo.
2. Fallar al construir, no en caliente, si en producción la variable no está definida: una vitrina que arranca apuntando a un backend que no existe muestra «No pudimos conectarnos con la cocina» a todo el que entre.
3. Crear villa-app/.env.example con la variable, para qué sirve y el valor de desarrollo, siguiendo el tono del .env.example del sistema.
4. Conservar el rewrite del mismo origen: nada de URL absoluta en el bundle del cliente, que es lo que hoy evita CORS y esconde el backend.

**Archivos que toca (y nadie más):** `villa-app/next.config.ts` · `villa-app/.env.example`

**No se tocan:** `villa-app/lib/api.ts` · `broaster-app/.env.example`

**Cómo sabremos que quedó bien.**

- el puerto ya no está escrito a mano como único destino → **1 o más (hoy 0, y localhost:3200 aparece 1 vez sin alternativa)**
  ```bash
  grep -c "process.env" villa-app/next.config.ts
  ```
- la variable está documentada → **el archivo existe (hoy no) y nombra la variable del destino**
  ```bash
  ls villa-app/.env.example
  ```
- REGRESIÓN · en desarrollo la vitrina sigue hablando con el sistema sin configurar nada → **con broaster-app en :3200 y sin definir la variable, GET http://localhost:3201/api/productos responde 200 con el catálogo**
- REGRESIÓN · la vitrina compila → **código de salida 0**
  ```bash
  cd villa-app && npm run verificar:completo
  ```

_Ya sabemos algo de esto:_ `donde-vive-el-dato` · `entorno-de-la-maquina`

**Lanzar:** `/orion T-008`

## 3. Darle a la vitrina la misma puerta de calidad que al sistema

`T-009` · calidad · nivel N0 (Cimientos) · dificultad normal · un constructor · ~221k tokens

**Por qué.** villa-app/package.json define verificar como «npm run typecheck» y nada más: no hay lint —no existe villa-app/eslint.config.js— ni un solo test (find de *.test.* sobre villa-app devuelve 0 archivos). Pero docs/REPOS.md declara que la puerta de cada PR es npm run verificar y que dos personas —diseñador de landing y diseñadora— van a escribir ahí por PR. Hoy esa puerta deja pasar cualquier cosa que compile, y lo que la vitrina calcula sí es plata: totalCarrito y precioPromo deciden el número que el cliente ve antes de pedir.

**Qué hay que hacer.**

1. Añadir eslint con la misma configuración del sistema (broaster-app/eslint.config.js como referencia, sin copiar reglas que no apliquen a una app sin servidor).
2. Escribir tests de nodo para lib/carrito.ts —agregar, quitar, el total con promos, leerSedeDeUrl y abrirSedesInicial— y para lib/formato.ts, con el mismo runner que el sistema (node --test sobre lib/**/*.test.ts).
3. El caso que más importa: el total que pinta el carrito tiene que dar igual al que devuelve el servidor, porque un adorno que cobre de menos es cobrarle de más al cliente en la confirmación (lo advierte la cabecera de lib/promos.ts).
4. Cambiar verificar a typecheck + lint + test para que la puerta del PR signifique algo.
5. No subir la barra por encima de lo que hay: si un archivo de componentes no pasa lint hoy, se arregla o se exceptúa con motivo escrito, no se apaga la regla entera.

**Archivos que toca (y nadie más):** `villa-app/package.json` · `villa-app/eslint.config.js` · `villa-app/lib/carrito.ts` · `villa-app/lib/carrito.test.ts` · `villa-app/lib/formato.ts` · `villa-app/lib/formato.test.ts`

**No se tocan:** `villa-app/lib/promos.ts` · `villa-app/lib/api.ts` · `broaster-app/eslint.config.js`

**Cómo sabremos que quedó bien.**

- la vitrina tiene tests → **pass 8 o más, fail 0 (hoy no existe el script)**
  ```bash
  cd villa-app && npm test
  ```
- la puerta del PR incluye lint y tests → **código de salida 0, y la salida muestra typecheck, lint y test —no solo typecheck**
  ```bash
  cd villa-app && npm run verificar
  ```
- REGRESIÓN · el total del carrito coincide con el del servidor → **armar un pedido con una promo en el navegador: el total de BarraCarrito es idéntico al totalCop de la orden creada**
- REGRESIÓN · el sistema no se toca → **código de salida 0, pass 176 o más, fail 0**
  ```bash
  cd broaster-app && npm run verificar
  ```

_Ya sabemos algo de esto:_ `que-es-estar-verificado` · `verificar-con-evidencia`

**Lanzar:** `/orion T-009`

## 4. Publicar los tres repos y abrirle la puerta al equipo

`T-015` · operacion · nivel N0 (Cimientos) · dificultad normal · se hace inline

**Por qué.** Los tres remotos de GitHub existen y están VACÍOS: 48 commits de trabajo real (32 del equipo, 11 del sistema, 5 de la vitrina) siguen solo en este computador porque los repos se clonaron DENTRO de las carpetas de trabajo y un clon vacío anidado no sube nada de lo que está afuera (KN-016). El equipo —senior, diseñador de landing, diseñadora— no puede empezar: tienen tres repos en blanco. Y no se puede resolver desde aquí: git por terminal en esta máquina no autentica contra GitHub, así que el push va por GitHub Desktop y lo hace el dueño.

**Qué hay que hacer.**

1. Seguir docs/REPOS.md: borrar los tres repos vacíos en GitHub y recrearlos privados SIN README, sin .gitignore y sin licencia, para no heredar el Initial commit que diverge.
2. GitHub Desktop → File → Add local repository sobre las tres rutas locales, y Push origin en cada una.
3. Invitar por rol: repo de equipo las tres personas con Read; sistema al senior con Write; vitrina al diseñador de landing y a la diseñadora con Write.
4. Proteger main en los tres: PR obligatorio, 1 aprobación, sin bypass.
5. Actualizar docs/REPOS.md con la fecha de publicación y el estado real, para que el documento deje de describir un futuro.
6. Comprobar que data/ NO viajó: el .gitignore del sistema lo excluye salvo la semilla, y ahí dentro hay ventas.

**Archivos que toca (y nadie más):** `docs/REPOS.md`

**No se tocan:** `docs/CAMBIO-DE-CAMINO.md` · `broaster-app/.gitignore` · `.gitignore`

**Cómo sabremos que quedó bien.**

- los tres remotos ya tienen la historia → **en cada uno de los tres repos locales, devuelve una rama main cuyo sha coincide con el de git rev-parse HEAD**
  ```bash
  git ls-remote --heads origin
  ```
- no se publicó ninguna venta → **solo data/.gitkeep y data/seed/productos.json; ni ordenes.json, ni turnos.json, ni usuarios.json**
  ```bash
  cd broaster-app && git ls-files data/
  ```
- REGRESIÓN · las rutas locales siguen funcionando después de mover repos → **código de salida 0, pass 176 o más, fail 0**
  ```bash
  cd broaster-app && npm run verificar
  ```
- main está protegida en los tres → **un push directo a main es rechazado en los tres repos y la regla exige 1 aprobación**

_Ya sabemos algo de esto:_ `entorno-de-la-maquina` · `encargos-verificables`

**Lanzar:** `/orion T-015`

## 5. Correr las pruebas del dominio sin servidor y sin base de datos

`T-019` · backend · nivel N0 (Cimientos) · dificultad normal · un constructor · ~221k tokens

**Por qué.** Una prueba que exige el servidor arriba y la base sembrada se corre el día que se escribe y nunca más. El dominio es lo único que se puede probar en segundos: si eso también cuesta un despliegue, no se prueba nada.

**Qué hay que hacer.**

1. Poner las reglas de negocio en funciones que reciben los hechos por parámetro y devuelven el resultado.
2. Escribir sus pruebas sin `fetch`, sin cliente de base y sin variables de entorno.
3. Dejar `npm test -- dominio` corriendo solo esas, y anotar en el README los segundos que tarda: es la línea base contra la que se notará si alguien las vuelve lentas.
4. Dejar escrito que las pruebas que sí necesitan servidor van en otro comando, no mezcladas con estas.

**Archivos que toca (y nadie más):** `tests/dominio/**` · `README.md`

**Cómo sabremos que quedó bien.**

- Las pruebas de dominio no tocan red, base ni entorno → **0 líneas**
  ```bash
  grep -rnE 'fetch\(|createClient|process\.env' tests/dominio/
  ```
- Corren en limpio → **exit 0**
  ```bash
  npm test -- dominio
  ```
- Tardan lo que dice el README → **segundos dentro del número anotado en el README**
  ```bash
  npm test -- dominio 2>&1 | tail -3
  ```
- Regresión: lo que ya funcionaba sigue funcionando → **exit 0, y el mismo número de tests que antes del cambio o más**
  ```bash
  npm run verificar
  ```

_Ya sabemos algo de esto:_ `que-es-estar-verificado`

**Lanzar:** `/orion T-019`

## 6. Cortar el arranque si falta una variable de entorno declarada

`T-020` · backend · nivel N0 (Cimientos) · dificultad normal · un constructor · ~221k tokens

**Por qué.** Una variable que falta no falla al desplegar: falla a las 7 de la noche, cuando la cajera cobra y la ruta devuelve 500 sin decir por qué. El fallo tiene que ocurrir en el arranque, no en la venta.

**Qué hay que hacer.**

1. Listar en `lib/servidor/entorno.ts` TODA variable que el servidor lee, con su tipo y si es obligatoria.
2. Leerlas una sola vez al cargar el módulo; si falta una obligatoria, abortar el proceso con el nombre exacto de la variable en el mensaje.
3. Prohibir `process.env` fuera de ese módulo: el resto del código importa el objeto ya leído.
4. Dejar `.env.example` con todas las claves y sin un solo valor real.

**Archivos que toca (y nadie más):** `lib/servidor/entorno.ts` · `.env.example`

**Cómo sabremos que quedó bien.**

- Ninguna variable se lee fuera del módulo de entorno → **0 líneas**
  ```bash
  grep -rn 'process.env' --include='*.ts' app/ lib/ | grep -v 'lib/servidor/entorno.ts'
  ```
- Sin una variable obligatoria el proceso no arranca → **EXIT distinto de 0 y el texto DATABASE_URL en la salida**
  ```bash
  env -u DATABASE_URL npm run start; echo EXIT=$?
  ```
- .env.example declara todas las claves → **conteo igual al número de variables declaradas en entorno.ts**
  ```bash
  grep -cE '^[A-Z_]+=' .env.example
  ```
- Regresión: lo que ya funcionaba sigue funcionando → **exit 0, y el mismo número de tests que antes del cambio o más**
  ```bash
  npm run verificar
  ```

_Ya sabemos algo de esto:_ `entorno-de-la-maquina`

**Lanzar:** `/orion T-020`

## 7. Dejar un solo módulo que escribe cada hecho y una sola fuente para leerlo

`T-021` · backend · nivel N0 (Cimientos) · dificultad hard · un constructor · ~277k tokens

**Por qué.** Si un hecho se escribe en dos sitios, la pantalla lee del que no es: toda empresa recién registrada veía «no tiene locales», no podía vincular el primer equipo, y sin vínculo no se factura. El síntoma es siempre «no hay X justo después de crear X».

**Qué hay que hacer.**

1. Hacer la tabla hecho → módulo que lo escribe → módulo que lo lee, con archivo y línea de cada uno.
2. Donde haya dos escritores, elegir uno y dejar el otro llamándolo, nunca copiando su lógica.
3. Donde la pantalla lea de una fuente distinta a la que escribe, cambiar la lectura; no sincronizar las dos.
4. Dejar la tabla en `docs/donde-vive-el-dato.md` y actualizarla cuando entre un hecho nuevo.

**Archivos que toca (y nadie más):** `docs/donde-vive-el-dato.md` · `tests/crear-y-leer.test.ts`

**Cómo sabremos que quedó bien.**

- Cada hecho tiene un único escritor → **tabla hecho→escritor→lector completa; 0 filas con dos escritores**
- Crear y leer devuelve el mismo dato → **exit 0; un test por cada hecho de la tabla**
  ```bash
  npm test -- crear-y-leer
  ```
- Regresión: lo que ya funcionaba sigue funcionando → **exit 0, y el mismo número de tests que antes del cambio o más**
  ```bash
  npm run verificar
  ```

_Ya sabemos algo de esto:_ `donde-vive-el-dato`

**Lanzar:** `/orion T-021`

## 8. Envolver cada ruta para que ninguna excepción salga sin registro

`T-022` · backend · nivel N0 (Cimientos) · dificultad normal · un constructor · ~221k tokens

**Por qué.** Una excepción sin envolver llega al navegador como 500 vacío y al log como nada: el reporte que llega es «no me deja cobrar» y no hay rastro que buscar.

**Qué hay que hacer.**

1. Escribir un envoltorio en `lib/servidor/borde.ts` que reciba el manejador, lo ejecute dentro de try/catch y convierta cualquier excepción en la respuesta de error de la casa.
2. Registrar en el catch el mensaje, la pila y el identificador de la petición ANTES de responder.
3. Aplicar el envoltorio a todas las rutas; no dejar ninguna exportada en crudo.
4. Distinguir dos casos: rechazo de negocio (4xx, previsto) y fallo (5xx, se registra con pila).

**Archivos que toca (y nadie más):** `lib/servidor/borde.ts` · `tests/borde-no-lanza.test.ts`

**Cómo sabremos que quedó bien.**

- Toda ruta pasa por el envoltorio → **0 archivos**
  ```bash
  grep -rLn 'borde' app/api --include='route.ts'
  ```
- Una excepción provocada deja línea en el log y devuelve la forma de error → **exit 0; el caso que lanza responde 500 con la clave error**
  ```bash
  npm test -- borde-no-lanza
  ```
- Regresión: lo que ya funcionaba sigue funcionando → **exit 0, y el mismo número de tests que antes del cambio o más**
  ```bash
  npm run verificar
  ```

**Lanzar:** `/orion T-022`

---

Cuando termine una: `plan.mjs hecho plan.json <id> --evidencia "<lo que se vio>" --tokens <medidos>`.
Para la siguiente tanda: `plan.mjs tanda plan.json --n 8`.
