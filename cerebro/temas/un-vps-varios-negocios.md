---
slug: un-vps-varios-negocios
titulo: Un VPS, varios negocios — la receta de añadir un cliente al mismo servidor
alias: [vps, servidor, hostinger, kvm, kvm 1, varios clientes, multi cliente, multicliente, varios negocios, segundo cliente, cliente nuevo, agregar cliente, anadir cliente, montar otro, duo burger, duoburger, villa broaster, caddy, caddyfile, proxy inverso, repartidor de dominios, subdominio, subdominios, systemd, servicio, servicios, puertos, puerto, 3200, 3201, 3210, aislar clientes, cuanto aguanta, cuantos clientes caben, ram, memoria, costo por cliente, prorrateo, deploy key, llave de despliegue, https, lets encrypt, certificado]
preguntas: ["como agrego otro negocio al mismo vps", "cuantos clientes caben en un vps", "que puertos le doy a cada cliente", "como aislo un cliente de otro en el mismo servidor", "cuanto me cuesta cada cliente al mes", "que pasa si se cae el servidor con varios clientes dentro"]
proyectos: [_permanent, villa-broaster, placita]
confianza: alta
actualizado: 2026-09-08
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
