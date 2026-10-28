# Fuentes — la «Res.» del recibo de Mercaplaza

- Fotos del recibo del POS viejo (Effective Software), factura 284872 del 28-10-2026: `~/Downloads/IMG_4711.HEIC`, `IMG_4712.HEIC`.
- Res. DIAN 055 de 2016: lo que la factura debe imprimir de la autorización (número, fecha, vigencia, rango, sin ceros a la izquierda). https://accounter.co/normatividad/resoluciones/resolucion-dian-055-14-de-julio-de-2016 · https://cijuf.org.co/node/10735
- Res. DIAN 019 de 2016: vigencia máxima de 2 años de la autorización de numeración. https://normas.cra.gov.co/Gestor/docs/resolucion_dian_0019_2016.htm
- Res. DIAN 042 de 2020 (derogó la 055 de 2016, controles de POS y factura por computador): https://normograma.mintic.gov.co/mintic/docs/pdf/resolucion_dian_0042_2020.pdf · INCP: https://incp.org.co/publicaciones/infoincp-publicaciones/impuestos/2021/09/tiquete-de-maquinas-registradoras-pos-no-constituye-un-sistema-tecnico-de-control/
- Res. DIAN 165 de 2023 (deroga la 042, rige hoy): https://normograma.invima.gov.co/normograma/docs/pdf/resolucion_dian_0165_2023.pdf
- No responsables de IVA y obligación de facturar (art. 616-2 E.T.; tiquetes POS voluntarios): https://actualicese.com/obligacion-de-no-responsables-del-iva-de-convertir-tiquetes-pos-a-factura-electronica/
- Lista de no obligados a facturar (art. 1.6.1.4.3 DUR 1625/2016) en doctrina: https://cijuf.org.co/node/20988
- UVT 2026 y topes: ver `../2026-10-28-dian-minimarket/fuentes.md`.
- Dígito de verificación del NIT 1061730716 → 1, calculado con el módulo 11 de la DIAN (`lib/emisor.ts`, probado con el NIT de la DIAN 800197268-4).
