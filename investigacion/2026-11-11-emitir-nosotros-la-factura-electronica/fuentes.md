# Fuentes — ¿podemos emitir nosotros la factura electrónica?

Consultadas el 2026-11-11. Marcadas `oficial` las de la DIAN; el resto son páginas
comerciales de proveedores o portales de software, útiles para saber qué se vende y a
qué precio, **no** para zanjar una duda de norma.

## Norma

- `oficial` Resolución 165 de 2023, normograma de la DIAN —
  https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0165_2023.htm
  Regula el documento equivalente electrónico POS. Modificada por la Resolución 119 de
  2024; exige la versión 1.0 del Anexo Técnico de Documento Equivalente Electrónico.
- `oficial` Guía de habilitación en factura electrónica —
  https://www.dian.gov.co/impuestos/factura-electronica/Documents/Presentacion_habilitacion.pdf
  Modos de operación (software propio / PT) y asociación de prefijos. **Documento
  antiguo**: los buscadores lo reportan con más de 1.400 días. No confirma cambios de 2026.
- `oficial` Instructivo de registro y habilitación —
  https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/instructivo-de-registro-y-habilitacion-en-factura-electronica-dian/
- UVT 2026 = $52.374 · Resolución DIAN 000238 de 2025 — ya citada y verificada en
  [2026-10-28-dian-minimarket](../2026-10-28-dian-minimarket/fuentes.md).

## Qué venden los proveedores (páginas comerciales)

- Dataico — https://www.dataico.com/facturacion-electronica · se declara PT autorizado,
  incluye POS electrónico, API REST.
- Bilidox — https://bilidox.com/ · PT autorizado, API para documento equivalente POS,
  planes desde ~$24.000/año por 15 documentos. Listado con ~275 días de antigüedad.
- Yabi (Neia SAS) — https://www.yabi.co/ · PT autorizado, cobra por créditos; dice que un
  mismo negocio puede usar PT distintos para resoluciones distintas.
- Misfacturas — https://soporte.misfacturas.com.co/hc/es-419/articles/24353755078164 ·
  manual de API de integración de documento equivalente, incluido POS.
- Factus — https://www.factus.com.co/ · factura de venta y notas crédito; **no menciona
  POS**. Sandbox compartido gratis e ilimitado; precios solo por WhatsApp.
- MATIAS — https://matias-api.com/ · **no es PT**: opera en modo software propio, el
  habilitado es el cliente. Precios ~$17–$44 por documento, vigentes hasta 31-dic-2026;
  cifras inconsistentes entre páginas del mismo sitio.
- Nextpyme Plus — https://nextpyme.plus/ · también software propio; ~$24/doc bajando a
  ~$17/doc por volumen.

## Prefijos y numeración

- Cifrato — https://cifrato.ai/blog/como-asociar-prefijos-en-la-dian-guia-paso-a-paso ·
  «¿Puedo tener varios prefijos asociados al mismo tiempo? Sí»; hay que repetir la
  asociación por cada resolución (venta, POS, contingencia); al cambiar de proveedor,
  retirar la asociación anterior.
- DLP Systems — https://www.dlpsystems.co/normatividad/nuevos-prefijos-cambio-modelo-facturacion-electronica/ ·
  sostiene que cambiar de modelo obliga a prefijo nuevo desde 1. **Interpretación de
  proveedor, sin verificar en la norma.**
- Siigo — https://siigofacturacion.portaldeclientes.siigo.com/asociar-prefijos-de-facturacion-dian/ ·
  reglas de forma del prefijo.

## El tope de 5 UVT (sin zanjar)

- Alegra — https://blog.alegra.com/colombia/facturadores-electronicos-tiquetes-pos-5-uvt/
- Scrampi — https://scrampi.com/herramientas/tiquete-pos-o-factura/ · sostiene que el tope
  es solo del tiquete **físico**, hoy válido únicamente en contingencia.
- Sistepos — https://sistepos.com/valor-de-la-uvt-2026-en-colombia-tabla-de-conversion-y-topes-para-tu-negocio/
- **HUECO**: ninguna fuente oficial consultada lo zanja, y al menos una guía comercial se
  contradice dentro de la misma página.
