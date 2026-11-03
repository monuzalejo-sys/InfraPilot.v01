# Lo que tiene Delta Evolution — inventario completo

Leído del sitio `delta-ingenieria.net` (por HTTP; el HTTPS rechaza la conexión) el
2026-11-02: las cuatro fichas de producto, las dos páginas de videotutoriales (65
videos de YouTube embebidos) y las dos fichas de clientes. **Todo lo de aquí está en su
sitio**; lo deducido se marca.

## Los cuatro módulos

### Inventario (con punto de venta)

- **Punto de venta:** «punto de venta con cajón monedero, impresión con tiquetera y
  código de barras»; configuración de **balanzas electrónicas** (tutorial 17).
- **Artículos** en grupos y subgrupos, con descripción, unidad de presentación,
  referencia, impuestos, **«Precios Público (6)»** —seis listas de precio por
  artículo—, costo unitario, cantidades y stock. Productos **compuestos** y
  **unidades adicionales** (tutoriales 2 y 3).
- **Costeo:** «Promedio ponderado, UEPS, PEPS y Reposición».
- **Documentos por prefijo:** pedidos, cotizaciones, compras, ventas, entradas,
  salidas, devoluciones en compras y en ventas. «No se pueden digitar documentos
  repetidos y permite el manejo de documentos pendientes.»
- **Facturación conectada al kárdex:** «Maneja facturación en línea, descargando
  automáticamente los artículos del inventario y efectuando la actualización
  respectiva del kárdex».
- **Informes:** kárdex general y por artículo, ventas por artículo, grupo y subgrupo,
  documentos por cliente, **cierres de caja**, informes de proveedores; existencias,
  productos no inventariados, **comparativo de inventario físico** (tutoriales 22–27).
- **Otros, por tutorial:** resolución y prefijos de facturación (6, 7), marcar un ítem
  como **obsequio** (9), **modificar el precio de un producto en una factura** (12),
  documentos temporales (13), **alertas** (15), ajuste por lista de precios (18),
  anulación y reversión (19), devoluciones (21).
- Todavía anuncia «el cálculo de los ajustes por inflación por cada uno de los
  elementos» del inventario.

### Contabilidad

- Estados financieros, libros auxiliares, mayor y balances, balance de prueba,
  consolidados, presupuesto.
- **«Permite manejar la contabilidad en forma independiente de 100 empresas.»**
- **PUC «Comercial, Cooperativo u Oficial»**, información exógena y **medios
  magnéticos para la DIAN**, informe trimestral «ideal para los CGN`s (contralorías
  regional y nacional)».
- Flexibilidad que un contador agradece: «permite efectuar modificaciones en cualquier
  mes y actualizar los saldos siguientes»; «los cierres mensuales se pueden realizar
  varias veces»; cambiar el número de un documento (tutorial 14); documentos
  pendientes para digitaciones largas.
- NIIF: subir plan de cuentas NIIF y **homologación de cuentas** (tutoriales 30–31).
- Retenciones y **certificados de ingresos y retenciones** (22, 27); cierre de año en
  tres partes (32); usuarios del sistema (33); **copias de respaldo** (34); **tipos
  de formato para guardar reportes** (25).
- Todavía anuncia «ajustes integrales por inflación en forma automática» — eliminados
  en 2007 (ver [salida de datos §4](../2026-11-02-salida-de-datos-delta/INFORME.md)).

### Cartera

- Créditos que la empresa **otorga y recibe**, «con intereses de mora y multas»;
  cuotas por fecha de vencimiento, descuentos y retenciones; abonos; deuda a la fecha
  de evaluación; análisis de cartera, relación de saldos, plan de pagos.
- Clientes y proveedores agrupados **por zonas**.

### Auditoría (SAD)

- Registra cada creación, modificación y eliminación de documentos de los tres módulos,
  con fecha, hora, usuario y terminal, **en una base de datos aparte**.
- Guarda **todas las versiones** de un documento, «desde el original hasta el último
  documento modificado».

## Los 65 videotutoriales

27 de Inventario (numerados del 1 al 27, falta el 10) y 38 de Contabilidad (del 1 al
34, con subnúmeros). Cada uno dura entre 0:30 y 6:18. **No se pudo leer la fecha ni las
vistas de los videos:** YouTube no devuelve esos datos sin navegador. `HUECO`

## Los clientes que publica

| Cliente | Producto | Fecha de venta | Vistas de la ficha |
|---|---|---|---|
| Asadero Kikos — «el mejor pollo de Popayán con servicio las 24h» | Delta Contabilidad | 9-abr-2015 | 2.880 |
| Giramos S.A. — giros y traslado de dinero | Delta Inventarios | 3-mar-2018 | 4.138 |

Dos clientes publicados en once años. **No es la medida de cuántos tiene**: es la medida
de cuánto le importa el sitio.

## Lo que el inventario dice (lectura nuestra, no del sitio)

- **Es un programa de contador antes que de tendero.** Cien empresas por instalación,
  PUC cooperativo y oficial, informes para contralorías, cierres que se rehacen. Quien
  más gana con Delta es **el contador que lleva muchos negocios**. `inferencia`
- **Nació para el sector financiero y cooperativo** («para brindar Soluciones
  Informáticas al sector Financiero»), y la cartera con mora y multas y el PUC
  cooperativo lo confirman. El POS de tienda vino después, montado sobre el
  inventario. `inferencia, coherente con su propio texto`
- **Lo que trae para el mostrador es completo** para una tienda: seis listas de
  precio, balanza, código de barras, productos compuestos, obsequios, devoluciones,
  cuadre de caja, conteo físico con comparativo.
- **Las grietas que vimos en La Villa son funciones, no fallas:** cambiar el precio
  dentro de la factura tiene tutorial propio, y el conteo físico existe —pero
  alguien tiene que hacerlo para que las existencias no queden en −474.
