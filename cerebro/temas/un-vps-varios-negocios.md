---
slug: un-vps-varios-negocios
titulo: Un VPS, varios negocios — la receta de añadir un cliente al mismo servidor
alias: [vps, servidor, hostinger, kvm, kvm 1, varios clientes, multi cliente, multicliente, varios negocios, segundo cliente, cliente nuevo, agregar cliente, anadir cliente, montar otro, duo burger, duoburger, villa broaster, caddy, caddyfile, proxy inverso, repartidor de dominios, subdominio, subdominios, systemd, servicio, servicios, puertos, puerto, 3200, 3201, 3210, aislar clientes, cuanto aguanta, cuantos clientes caben, ram, memoria, costo por cliente, prorrateo, deploy key, llave de despliegue, https, lets encrypt, certificado, sin ssh, permission denied, instalar-vps.sh, script de instalacion, hpanel, terminal del navegador, subir el sistema al servidor, traefik, puerto 80, puerto 443, timeout, connection refused, ufw, iptables, firewall, reinstalar ubuntu, prommter.online, dominio propio, dominio del cliente, DEC-016, comprar dominio, registro A, dns, clonar placita, derivar de placita, medir el clon, multi-tenant, multitenant, empresa_id, RLS, instancia propia, otra empresa en la misma base, bot en la mac, servidor barato, digitalocean, lightsail, fly.io, siempre encendido, servidor caido, plan suspendido, renovacion del vps, version vieja, contrato 1.3, sistema viejo, se cayo el servidor]
preguntas: ["como agrego otro negocio al mismo vps", "cuantos clientes caben en un vps", "que puertos le doy a cada cliente", "como aislo un cliente de otro en el mismo servidor", "cuanto me cuesta cada cliente al mes", "que pasa si se cae el servidor con varios clientes dentro", "como subimos el sistema al servidor si no tengo acceso al pc", "el vps que acabo de comprar ya tiene algo corriendo en el puerto 80, lo borro o reinstalo", "compramos el dominio del negocio ya o lo dejamos bajo uno de prommter", "para un cliente nuevo lo meto como una empresa mas en la base de mercaplaza o hago otra instancia", "el bot se cae cuando se me va el internet o se duerme la mac, donde lo pongo para que siempre este prendido", "el servidor volvio pero la pagina sale con errores, que puede estar pasando"]
proyectos: [_permanent, villa-broaster, placita, duo-burguer, mercaplaza, copiloto]
confianza: alta
actualizado: 2026-11-02
---

# Un VPS, varios negocios

## Respuesta corta

**Un VPS no se compra por dominio ni por cliente: es un computador entero.**
Delante va un repartidor (Caddy) que mira **qué nombre pidió el visitante** y lo
manda a la aplicación que escucha en ese puerto. Cada negocio aporta:

| Pieza | Regla |
|---|---|
| **Dos nombres** | `<negocio>.<dominio>` para la vitrina y `caja.<negocio>.<dominio>` para el panel |
| **Dos puertos** | uno por app, y **jamás repetidos** entre negocios |
| **Dos servicios** de systemd | uno por app, con `Restart=always` |
| **Su propia carpeta de datos** | dentro de su repo; nunca compartida |
| **Una deploy key por repositorio** | de SOLO LECTURA (GitHub rechaza la misma llave en dos repos) |

**Cuánto cabe, medido y no supuesto** (2026-09-08, KVM 1 con 4 GB): una app Next
en producción ocupa **108 MB**. Un negocio completo —vitrina más sistema— son
**~220 MB**. Con el sistema operativo y una base de datos quedan ~3 GB libres,
así que la RAM no es el límite: **el límite es 1 vCPU**, y son cómodos **3 o 4
negocios**. Cuando empiecen a competir en hora pico, el plan de arriba duplica
todo y la mudanza es de un rato.

**Lo que esto le hace al precio:** la infraestructura cuesta lo mismo con uno que
con cuatro. Un VPS de ~12 USD/mes repartido entre cuatro negocios son **~3 USD
por cliente**, un costo que desaparece en cuanto cobras el primer sistema.

**Antes de instalar en un VPS, míralo (no lo des por vacío):** `docker ps -a` y
`ss -tlnp`. **Sin SSH desde la máquina de trabajo, no esperes:** entrega un
instalador idempotente, probado con el Caddy real, para pegar en la terminal del
navegador de hPanel. **El dominio propio del cliente se compra cuando firma, no
antes:** mientras tanto, subdominio de Prommter. **Y pon la renovación del VPS en la
agenda:** si el plan se suspende, caen todos los clientes que viven ahí.

## La receta, por negocio

Asigna primero los puertos y anótalos donde no se pierdan:

```
villa-broaster   sistema 3200   vitrina 3201
duo-burger       sistema 3210   vitrina 3211
<el siguiente>   sistema 3220   vitrina 3221
```

1. **DNS**: dos registros `A` a la IP del VPS. Propaga en minutos si los
   servidores de nombres ya son del mismo proveedor.
2. **Llaves**: una por repositorio, generadas en el servidor, pegadas en
   *Settings → Deploy keys* **sin** permiso de escritura.
3. **Clonar** pasando la llave en el propio comando — ver
   `construir-no-es-arrancar` para las trampas de `sudo -u` y de la huella.
4. **Compilar**: `npm ci && npm run build` como el usuario del servicio.
5. **Servicios**: copiar los dos `.service`, cambiar **puerto, rutas y el archivo
   de entorno** para que no choquen con los del vecino, `daemon-reload`,
   `enable --now`.
6. **Caddy**: añadir el bloque de sus dos nombres al `Caddyfile` y
   `systemctl reload caddy`. El certificado lo saca solo la primera vez que
   alguien entra.
7. **Comprobar desde fuera**, nunca desde el propio servidor: las dos
   direcciones, el certificado, y que el catálogo traiga productos de verdad.

## Lo que hay que aceptar antes de meter el segundo

**Un solo servidor es un solo punto de caída: si se apaga, se apagan todos los
clientes a la vez.** Es asumible mientras cada negocio siga vendiendo sin la
nube (ver `la-caja-no-puede-parar`), y deja de serlo cuando uno de ellos factura
lo suficiente como para no poder esperar. Ahí se separa ese, o se paga alta
disponibilidad — no antes: pagar por redundancia que nadie ha necesitado todavía
es el error opuesto y también cuesta.

**Y los datos de un negocio nunca se mezclan con los de otro.** Carpeta propia,
usuario propio si se quiere apretar más, y jamás dos procesos sobre la misma
carpeta — esa regla no cambia por estar acompañados.

## Cuando no hay SSH: instalador idempotente y dos comandos para pegar

La Mac no tiene SSH al VPS (`Permission denied (publickey,password)`) y a veces el
PC que sí lo tiene no está disponible. No esperes al PC: escribe un instalador
**idempotente** que haga `git pull`, `npm ci`, **ensayo de la migración sobre una
COPIA de la base**, migrar, build y reiniciar, y que **deshaga si algo falla**.
Pruébalo en la Mac con el mismo servidor web real (Caddy): que la página cargue, que
el catálogo salga del sistema, que las rutas de administración queden bloqueadas y
que salga «Ya volvemos» con el sistema caído. Después dale al dueño **uno o dos
comandos** para pegar en la terminal del navegador de hPanel, pidiéndole la captura
del final **con los secretos tapados**. El 28-sep dejó Duo Burguer en línea con
candado a las 19:44, con el certificado emitido solo, y el mismo comando se volvió el
canal de despliegue (se entregó de nuevo el 1-oct y el 22-oct). **Avisa antes de
correrlo:** recargar Caddy corta unos segundos a TODOS los negocios del mismo VPS,
también Villa Broaster.

## Un VPS nuevo puede venir ocupado

El VPS de Villa Broaster traía un Traefik de hacía 6 semanas respondiendo 404 a todo
en los puertos 80/443. Antes de instalar Caddy: `docker ps -a` y `ss -tlnp`. Para
quitar el Traefik, averigua su carpeta (`docker inspect … working_dir`) y bájalo con
`docker compose down` para que no reviva al reiniciar; **deja Docker instalado**. Al
quitarlo, 80/443 dieron timeout desde fuera y se sospechó de un firewall durante más
de una hora (00:22 a 01:38). **No teorices el firewall: entra por la consola web y
mira `iptables -S` y `ss -tlnp`.** Por dentro estaba todo limpio (ufw inactivo,
INPUT ACCEPT, ningún firewall en el panel de Hostinger y Caddy ya sirviendo 200): no
hacía falta reinstalar Ubuntu, que además borra todo el servidor.

## Dominio: subdominio de Prommter hasta que el cliente firme

Publica cada negocio bajo un subdominio libre de un dominio de Prommter
(`<negocio>.prommter.<tld>` y `caja.<negocio>…`) y deja el **dominio propio, a nombre
del cliente**, para cuando firme, reparta la dirección o pida correo propio. El dueño
lo decidió así para Villa Broaster y para Duo Burguer: **no lo vuelvas a proponer
antes**. Migrar después cuesta un registro A y una línea de Caddy, y las dos
direcciones pueden convivir. Antes de tocar el DNS mira qué sirve hoy el dominio:
un 200 en `prommter.online` era la página de aparcado de Hostinger, no una web, y el
«dominio a 1 COP» exigía 3 años. Toca solo el subdominio, nunca el raíz. La compra del
dominio la confirma el dueño, no Claude.

## Clonar un sistema maduro para otro cliente: medir y dar instancia propia

Antes de derivar un cliente nuevo de un sistema en producción, **mide por módulo
cuántos archivos sirven y cuántos arrastra sin servir** (una tarea de medir el clon).
En Placita (241 archivos) sirven venta (168), inventario (59), lotes (64), cierre
(54) y jornada (39); no sirven factura (54) + DIAN (29), canastillas (32), pulpas (17)
ni báscula (5): copiarlo entero mete 137 archivos callados. Y **no lo metas como una
empresa más en la base del cliente que ya cobra plata real**: instancia, dominio y
base propios. Placita tiene `empresa_id` y políticas RLS, pero una sola empresa, y el
inquilino se resuelve en la conexión, así que una instancia sirve a una sola empresa;
el aislamiento nunca se probó con dos clientes reales.

## Un bot con usuario real sale de la Mac

Cuando alguien externo depende del bot, el cliente nunca ve el error crudo:
**reintentos silenciosos** en la red (Telegram hasta 5, con espera de 1, 3, 8 y 15 s;
el modelo 4, con tope de 2 min por intento) y un mensaje claro si aun así falla. La
causa de fondo —cortes del internet de la Mac y el reposo— se resuelve con un servidor
siempre encendido: compara 2–3 opciones con precio mensual y fuente, **y mide también
contra el VPS que el dueño ya paga** (~US$3 por cliente, según este tema). El plan
de servidor recomendó DigitalOcean 1 GB con respaldo semanal por US$7,20/mes
(Lightsail 512 MB ≈ US$5,50; Fly.io ≈ US$3,84) y no mencionó el VPS KVM que ya tiene.
La mudanza de la base del bot, con su trampa del WAL, está en
[[TEMA-dominio-migraciones-y-copias]].

## Si el VPS se cae: todos los clientes caen, y al volver verifica la versión

Pon la fecha de renovación en la agenda con margen. Desde la noche del 22-oct hasta el
25-oct 04:09 UTC el servidor no respondió (ni ping, ni puerto web, ni SSH), en plena
semana de lanzamiento de Halloween de Duo Burguer, y Villa Broaster vive en el mismo
VPS. **La causa (plan sin pagar) es una inferencia no confirmada**: ábrela como
hipótesis y confírmala en el panel del proveedor. Si no responde nada, trátalo como
plan y no como ataque: trabaja en local con **un solo comando de despliegue listo**.
Cuando vuelva, **no supongas que volvió igual**: volvió con el sistema anterior al
20-oct (contrato 1.3: almuerzos fijos, sin combo ni sorteo) mientras el sistema local y
la vitrina nueva ya iban en el 1.5, y el dueño veía errores. Consulta la versión de
contrato en vivo y compárala con la que espera la vitrina antes de culpar a la página.
**Riesgo:** la caja de Duo corre en ese mismo VPS; si el local ya operara con ella, el
corte la dejaría sin servicio, lo que choca con [[TEMA-la-caja-no-puede-parar]]
(ver la condición allí).

## Cuándo NO aplica (lo nuevo)

- **El instalador sin SSH:** si hay SSH o despliegue automático, úsalos.
- **El Traefik del VPS nuevo:** si el VPS viene de una plantilla que vas a usar
  (Coolify, Dokploy), no la borres: despliega con ella. Reinstalar Ubuntu solo con el
  dueño confirmando que no hay nada que perder.
- **Subdominio de Prommter:** cuando el cliente firma, reparte la dirección en el
  local, el empaque o volantes, o pide correo propio o posicionamiento en Google, ahí
  se compra el dominio a su nombre y se migra.
- **Instancia propia:** una sucursal de la MISMA empresa (mismo dueño y contabilidad)
  sí cabe en la misma instancia; y cuando el aislamiento ya se probó con dos empresas
  reales.
- **Bot fuera de la Mac:** si el bot es solo para el dueño y puede pausarse; si el VPS
  no tiene CPU libre (el límite medido es 1 vCPU); o si no hay SSH desde la máquina de
  trabajo.
- **VPS caído:** si el corte viene de otra causa (DNS, certificado, proceso caído),
  confírmalo en el panel antes de asumir que es el plan.

## Evidencia (lo nuevo)

- «Permission denied (publickey,password)» y «Quedó en línea, y lo comprobé desde aquí»
  — ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `51184930`, 2026-09-28).
- «Tienes Docker con un solo contenedor: un Traefik suelto, levantado con docker
  compose», «no hay ningún firewall creado en Hostinger» e «INPUT ACCEPT — dentro del
  servidor no hay ningún bloqueo» — ventana [[2026-09-08-sistema-de-villa-orion|Sistema
  de Villa]] (transcrito `f7689b06`, 2026-09-09).
- «por ahora quiero que funcione asi, ya lo haremos bien… que funcione me importa
  quiero manejarlo», «creo que para duo burger tambien va a ser asi y ya» y «el 200 era
  la página de aparcado de Hostinger, no una web tuya» — misma ventana `f7689b06`,
  2026-09-09.
- «Copiar el repo entero mete esos 137 callados», «el aislamiento nunca se ha probado
  con dos clientes reales» y «una instancia sirve a una sola empresa» — ventana
  [[2026-09-09-la-villa-sistema|La Villa, sistema]] (transcrito `129e1026`, 2026-10-28).
- «Haz que el bot reintente cuando se caiga el internet» y «Si el Mac se duerme, el bot
  se pausa hasta que despierte» — ventana [[2026-10-19-dropshipping-con-flujo-n8n|Bot
  del dropshipping]] (transcrito `00af789e`, 2026-10-23 y 2026-10-20); «DigitalOcean
  Basic de 1 GB con respaldo semanal, por US$7,20 al mes» — ventana
  [[2026-10-23-plan-para-pasar-el-bot-a-un-servidor-barato|Plan del servidor barato]]
  (transcrito `690265d7`, 2026-10-23).
- «The server isn't responding at all: no ping, no web port, no SSH.», «¡El servidor
  volvió! duoburguer.prommter.shop responde otra vez.» y «el servidor volvió, pero con
  el sistema viejo.» — ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito
  `7f456016`, 2026-10-23 y 2026-10-25).
