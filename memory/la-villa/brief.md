# La Villa — brief

**Minimarket, cliente nuevo de Prommter.** Proyecto abierto el 2026-10-28.

> **No es Villa Broaster.** Ese es un asadero, otro cliente, con sus propios
> repos y sus sedes en el barrio Villa del Viento. El nombre se escribe siempre
> «La Villa», con artículo.

## Todo lo que el dueño dijo, textual

> «quiero que crees un nuevo proyecto para prommter, este cliente tiene un minimarket, se llama la villa»

Catorce palabras. De «minimarket» se deduce esto y **nada más**: vende surtido
**por unidad**, tiene una **caja** que cobra, tiene **inventario** que se repone,
y hay **alguien atendiendo**.

## Lo que NO se sabe

Nueve huecos, todos escritos con su asunción y quién los contesta, en
`prommter/la-villa-repo/HUECOS.md`. **No los rellenes desde aquí ni los deduzcas:
lee ese archivo.** El que más pesa: ¿puede la caja cobrar sin internet? Si la
respuesta fuera «sí puede», el trabajo se reduce a la mitad.

## Estado

**Proyecto creado, nada construido**, y eso es deliberado: con cuatro hechos
cualquier pantalla saldría de negocio inventado.

- Plan: `memory/la-villa/PLAN.md` — 91 tareas (12 de encuadre + 79 cimientos), modo génesis
- Decisión del camino: `memory/la-villa/decisiones/camino-a-b-c.md` — **pendiente de firma**
- Qué se hereda: `memory/la-villa/evidencia/inventario-placita.md`
- Estado del clon de placita: `memory/la-villa/evidencia/clon-placita.md` — AL DÍA el 2026-10-28

## Cómo se construye

Derivando de **placita** (sistema de Mercaplaza, 241 archivos en producción), con
**base e instancia propias** en el VPS existente y **dominio propio comprado a
nombre del cliente**. Meterla como empresa más en la base de Mercaplaza está
**descartado por el dueño** (commit `24d1822`). De una plantilla se hereda la
arquitectura y nunca los datos, precios, dominio, puertos ni la deploy key.

## Restricciones que son ley

- `la-caja-no-puede-parar` — la venta se guarda en el LOCAL; la nube es espejo.
- `acceso-roles-y-puestos` — dos accesos: primero el puesto, después la persona.
- `un-vps-varios-negocios` — entra al VPS que ya existe, con su propio dominio.
- `cero-datos-inventados` — lo que falte va como hueco visible, no se rellena.
