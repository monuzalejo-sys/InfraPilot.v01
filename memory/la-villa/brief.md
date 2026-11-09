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

**Hay un sistema que funciona en un navegador; el de producción no está
construido.** No son lo mismo y conviene no mezclarlos.

`prommter/la-villa-repo/docs/sistema.html` — un solo archivo, sin internet y sin
instalar nada: se entra por puesto y persona, **se meten productos** (uno por
uno, o el catálogo entero desde el `catalogo.json` del importador), la caja
cobra con ellos, baja la existencia, y de ahí salen inventario, compras,
rotación, cierre, impuestos y el archivo del contador. Lo metido sobrevive a
cerrar la página. Desde el 8-nov-2026.

**Desde el 9-nov está separado por perfiles** (`var PERFILES`, una sola tabla —
`DEC-006`, plano en `docs/puestos-y-personas.md`): el cajero cobra, mira el
estante y cuenta su gaveta, sin costos ni proveedores ni cuentas; el dueño lo
acomoda todo **desde el celular**. Ese día entraron además: la remesa completa
en Compras (el pedido se mete de un golpe, sin ir al local), el archivo de
facturas de compra —las que van al reporte del contador y las que no,
`DEC-007`—, la pantalla «Lo que no se vendió» y la **Ayuda por perfil** dentro
de la app.

> **Cuidado al leerlo:** ese recorte es **cortesía, no candado** (`CON-004`), y
> el celular del dueño y el computador del mostrador **todavía no se ven entre
> ellos**: cada navegador guarda lo suyo. Las dos cosas están dichas en
> pantalla; no las vendas como resueltas.

**El de producción —la derivación de placita, base propia en el VPS, dominio del
cliente— sigue sin empezar**, y eso sigue siendo deliberado: con cuatro hechos
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

## Dónde vive cada cosa

- Repo: `prommter/la-villa-repo` (git propio, sin remoto todavía)
- Memoria: `memory/la-villa/`
- Entregas: `~/Desktop/La Villa/<Tema>/`
- Barra lateral: sección «La Villa» (`cg-33a0c7b2-fc4a-4cb8-b096-b88800a0e652`),
  ventanas: estado y plan · sistema · vitrina · marca · videos animados · videos reales
  (el detalle y el mensaje de arranque de cada una: `prommter/la-villa-repo/docs/ventanas.md`)
  — las seis ABIERTAS desde el 2-nov-2026, cada una con su mensaje de arranque (cwd `/Users/g/orion`, Sonnet)
- Lo que el cliente YA usa hoy, leído de 10 fotos de su POS: `prommter/la-villa-repo/docs/sistema-actual.md`

## Restricciones que son ley

- `la-caja-no-puede-parar` — la venta se guarda en el LOCAL; la nube es espejo.
- `acceso-roles-y-puestos` — dos accesos: primero el puesto, después la persona.
- `un-vps-varios-negocios` — entra al VPS que ya existe, con su propio dominio.
- `cero-datos-inventados` — lo que falte va como hueco visible, no se rellena.
