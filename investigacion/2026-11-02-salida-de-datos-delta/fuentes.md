# Fuentes — Salida de datos de Delta

Consultadas el 2026-11-02. «Primaria» = la norma o la autoridad misma; «secundaria» =
alguien contándola.

## DIAN — factura electrónica y documento equivalente

| Fuente | Qué se sacó | Calidad |
|---|---|---|
| [Micrositio DIAN · Proveedores Tecnológicos](https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/proveedores-tecnologicos/) | Qué es el Catálogo de Participantes | primaria |
| [`Proveedores-habilitados-15102026.xlsx`](https://www.dian.gov.co/impuestos/factura-electronica/Documents/Proveedores-habilitados-15102026.xlsx) | 96 proveedores (filas 3–98), modificado 2026-10-14. Búsqueda de `DELTA`, `CAUCA`, `POPAY`: cero coincidencias | primaria |
| [Anexo Técnico de Documento Equivalente Electrónico v1.0](https://www.dian.gov.co/impuestos/factura-electronica/Documents/Anexo-Tecnico-Documento-Equivalente-Electronico-V1-0-final.pdf) (Res. 000165 de 2023), 1.546 págs. | `ProviderID` y `softwareID` (pág. 31); sección 8.2, tiquete POS (págs. 91–134): `LineCountNumeric` (pág. 100), `InvoicedQuantity` 1..1 y regla cantidad × precio unidad (pág. 120). Texto extraído con PDFKit | primaria |
| [Micrositio DIAN · Documento Equivalente Electrónico](https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/documento-equivalente-electronico/) | Tiquete POS: «Deberá indicar cantidad, unidad de medida, y descripción específica y códigos» | primaria |
| [Oficio DIAN 013246 del 1-ago-2025](https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_13246_2025.htm) | Software propio / adquirido («aquel que le compra a un tercero») / proveedor tecnológico; el de software adquirido se habilita por el art. 28 de la Res. 000165 | primaria |
| [Consultor Contable · Consultar y descargar las facturas electrónicas recibidas](https://www.consultorcontable.com/consultar-y-descargar-facturas-electronicas-recibidas/) (fecha en página: 10-05-2026) | «DESCARGAR LISTADOS» por rango de fechas; XML por CUFE uno a uno; existen herramientas privadas para descarga masiva | secundaria |
| [Ficha de extensión de navegador en extscope.org](https://extscope.org/extension/enjicjcdnlbniehokaffngefbjdpncdb) | «Histórico > Descarga de Listados … Exportar a Excel» | secundaria débil |
| [Universidad Nacional · Presentación consulta FE, nov-2022](https://gerencia.unal.edu.co/fileadmin/Gestion-Financiera/Facturacion_electronica/Presentacion_consulta_FE___Noviembre_2022.pptx__1_.pdf) | Rango de consulta «máximo hasta tres (3) meses» | secundaria, vieja; no se abrió el documento, solo el extracto del buscador |

## Ajustes integrales por inflación

| Fuente | Qué se sacó | Calidad |
|---|---|---|
| [Decreto 1536 de 2007 · Gestor Normativo de Función Pública](https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=27693) | Arts. 1 y 7 leídos en el texto: estados financieros no se ajustan por inflación; derogatoria de la reexpresión en Decs. 2649 y 2650 de 1993. Firmado 7-may-2007, D.O. 46.621 | primaria |
| [Oficio DIAN 095985 de 2007](https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_95985_2007.htm) | Ley 1111 art. 78 rige desde su promulgación, D.O. 46.494 del 27-dic-2006; costo fiscal sobre el costo ajustado al 31-dic-2006 | primaria |
| [Circular DIAN 0009 de 2007](https://cancilleria.gov.co/sites/default/files/Normograma/docs/circular_dian_0009_2007.htm) (copia en el normograma de Cancillería) | Sección II.f: «la derogatoria del sistema de ajustes integrales por inflación para efectos fiscales». **No** enumera los artículos derogados de ese sistema. La lista 318–322, 328, 417… que el buscador le atribuía es del **impuesto de remesas** | primaria |

## Delta Ingeniería

| Fuente | Qué se sacó | Calidad |
|---|---|---|
| `http://delta-ingenieria.net/2020habc/index.php/es/` (portada) | Sin mención de factura electrónica, precios ni motor de base de datos. El HTTPS rechaza la conexión; se leyó por HTTP | primaria |
| `…/productos-main/38-modulo-de-auditoria-sad` | «Las operaciones se registran sobre una base de datos diferente a la base de datos de las aplicaciones Delta» | primaria |
| `…/descargas` y sus tres subcategorías | Solo «descargas para el mes de junio de 2020», sin archivos ni enlaces públicos | primaria |

## Búsquedas que no dieron nada

- `"Delta Ingeniería" Popayán facturación electrónica proveedor tecnológico` → solo
  tesis genéricas de Popayán y empresas homónimas de otros países.
- `"Delta Ingenieria" … "factura electrónica" Delta Evolution` (búsqueda extendida) →
  Guatemala, República Dominicana, Argentina, México. Ninguna caucana.
- Precio de Delta Evolution → nada en ninguna búsqueda.
- `Popayán empleo … "manejo de Delta"` (extendida) → el buscador devolvió un aviso de
  ACOPI Cauca en elempleo.com que pediría «manejo comprobable del sistema contable
  Delta». Al abrir [el listado de ofertas de Popayán](https://www.elempleo.com/co/ofertas-empleo/popayan)
  el aviso **no apareció**. Queda como señal no verificada.
- Descarga oficial de XML en lote desde la DIAN → ninguna fuente, ni oficial ni de
  terceros, la documenta.
