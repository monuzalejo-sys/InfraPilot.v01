---
slug: la-caja-no-puede-parar
titulo: La caja no puede parar — local primero, nube después, para negocios con mostrador
alias: [caja, mostrador, punto de venta, pos, sin internet, se cayo internet, se fue el internet, sin conexion, offline, offline first, local primero, funciona sin internet, sincronizacion, sincronizar, sincronizador, outbox, cola de subida, cola pendiente, subir, bajar, merge, conflicto, convergencia, tiempo real, en vivo, ver desde el celular, desde cualquier celular, el dueno quiere ver, control total, dos sedes, dos locales, multi sede, multi local, varias sucursales, sucursales, centralizar, base de datos centralizada, nube, supabase, consecutivo, numero de orden, L1-0007, codigo reasignado, pedidos de la landing, pedidos desde la web, la pagina manda pedidos]
preguntas: ["que necesito para que el dueno vea las dos sedes desde el celular", "como hago que la caja siga vendiendo sin internet", "como sincronizo el local con la nube", "cada cuanto debe subir y bajar datos un punto de venta", "que pasa con los consecutivos cuando hay varias sedes", "como llegan a la caja los pedidos de la pagina web", "que es tiempo real de verdad en un mostrador"]
proyectos: [_permanent, placita, villa-broaster, estanco-contable]
confianza: alta
actualizado: 2026-09-08
---

# La caja no puede parar

## Respuesta corta

**La venta se hace y se guarda en el LOCAL. La nube es un espejo, nunca un
requisito para cobrar.** Un mostrador que depende de internet para cobrar es un
mostrador que cierra cuando se cae la conexión, y eso pasa. El orden correcto es:
el local escribe en lo suyo, encola lo que cambió, y sube cuando puede.

Los tiempos, medidos en placita y verificados en vivo (2026-08-21): **sube** al
volver al primer plano o **cada 4 s**, lo que ocurra primero, con tope de **200
filas por viaje**; **baja** al abrir la aplicación o **cada 10 s**. Y la regla
que salva ventas:

> **Con cola pendiente de subir, NO se baja nada.**

Bajar mientras tienes cambios sin subir es pedirle al sistema que mezcle tu venta
recién cobrada con una versión del servidor que no la tiene. Primero vacías tu
cola, después escuchas.

**"Tiempo real" en un mostrador no es instantáneo: son segundos.** El panel de
villa-broaster refresca órdenes cada 8 s y para el negocio eso ya es en vivo.
Nadie necesita websockets para ver que entró un pedido; necesita no tener que
apretar F5. Prometer instantáneo cuesta arquitectura y no compra nada.

## Por qué (qué lo pagó)

**placita/Mercaplaza** lo construyó y lo verificó contra producción: cada
dispositivo con su almacén local, outbox, y una nube compartida
(`placita/KN-038`). Sin la clave de la caja puesta, 401 en las dos direcciones y
el dispositivo se queda en local — un cajón de arena seguro en vez de un error a
media venta.

Y dejó **dos trampas pagadas** que quien repita el patrón se va a encontrar
(`placita/KN-051`):

1. **El cliente que REARMA a mano la respuesta del servidor** convierte cualquier
   ampliación del contrato en código muerto. Si el servidor empieza a devolver un
   campo nuevo y el cliente reconstruye el objeto campo por campo, el dato se cae
   ahí y nadie se entera. Reenvía lo que llegó, no lo vuelvas a armar.
2. **Convergencia del outbox.** Una fila que el servidor aceptó *con un cambio*
   —le reasignó el código, por ejemplo— tiene que salir de la cola y el cambio
   adoptarse **sin volver a encolarla**. Si se queda, el cliente vuelve a subir el
   valor viejo y el sistema gira para siempre. En placita se resolvió adoptando
   con una operación del almacén que a propósito NO encola.

## Los consecutivos son de cada local, no de la nube

Con varias sedes, el número de la venta se asigna **por local** (`L1-0007`,
`L2-0007`) y por eso dos cajas nunca colisionan aunque estén desconectadas. Lo
que sí colisiona son los pedidos que entran **por la página pública**: esos nacen
en la nube y el local los recibe. Ahí la nube manda: si reasigna el número, el
local lo adopta —ver trampa 2— en vez de discutir.

Y la garantía que no se puede perder al cambiar de almacén: asignar el
consecutivo exige **leer, decidir y escribir sin que nadie se meta en medio**. En
disco lo da una cola de un solo carril; en base de datos tiene que ser una
transacción. Copiar la firma sin copiar la garantía reabre la carrera, y el
síntoma es dos ventas con el mismo número.

## Qué hace falta, en orden

1. **Publicar el sistema tal como está**, todavía sobre su carpeta. Sirve para
   probar en vivo y no cuesta desarrollo.
2. **El almacén centralizado**, detrás del contrato que ya exista — en
   villa-broaster son 18 métodos de datos más 4 de usuarios, y ninguna ruta ni la
   contabilidad se entera del cambio.
3. **El outbox y el sincronizador**, con los tiempos y la regla de arriba.
4. **Apuntar la página pública al sistema publicado**, que si está bien hecho es
   cambiar una variable de entorno y ni un componente se entera.
5. **Prueba de humo de verdad**: un pedido desde la página, que aparezca en la
   caja del local correcto, y que el dueño lo vea desde su celular.

## La pregunta que decide el tamaño, y es de negocio

**¿La caja puede dejar de vender mientras vuelve internet?** Si puede, todo vive
en la nube y el trabajo se reduce a la mitad; un plan de datos móviles de
respaldo en el local cubre casi todo el riesgo por unos dólares al mes. Si no
puede —lo normal en comida y en tienda de barrio—, entra este tema entero.

No la contesta el que programa. La contesta el dueño, y conviene contestarla
antes de escribir la primera línea, porque cambia la arquitectura, no el detalle.
