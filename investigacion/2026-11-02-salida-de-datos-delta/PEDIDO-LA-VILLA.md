# Lo que hay que pedirle a La Villa (y a un contador)

Sale de [`INFORME.md`](INFORME.md). Con esto se cierran casi todos los huecos de Delta en
una visita. **Reglas:**

- Lo hace **el dueño o el cajero de La Villa**, en su computador y con su usuario.
  Nosotros miramos y anotamos. **Nunca entramos con su clave** a la DIAN ni a Delta.
- **No se instala nada ni se cambia nada** en el computador de Delta. Solo se exporta,
  se copia y se fotografía.
- Si algo no se puede, se anota **que no se pudo y por qué**: eso también es un dato.

## A. Del computador de Delta (lo más importante)

1. **Exportar un mes de informes**, octubre de 2026, en el formato que Delta deje
   (Excel, CSV, PDF — anotar **qué opciones ofrece** la pantalla de «guardar reporte»):
   - ventas **con detalle por producto** (no solo totales);
   - existencias actuales;
   - compras del mes (los documentos `COM-xxxx`).
2. **Tres XML de facturas FPMV**, por ejemplo la 16277. Hay que encontrar dónde los guarda
   Delta (preguntar al cajero o a Delta: «¿dónde quedan los XML de la factura
   electrónica?»). Si Delta **no** los guarda, se anota.
   → Con uno solo se sabe **quién transmite la factura** (campo `ProviderID`) y si es
   factura o documento equivalente POS.
3. **Foto de la carpeta donde está instalado Delta** (sin abrir nada): los nombres y
   extensiones de los archivos dicen el motor de base de datos. Si es fácil, también
   una foto de los servicios de Windows que están corriendo.

## B. Del portal de la DIAN (con el usuario del dueño de La Villa)

4. En `catalogo-vpfe.dian.gov.co`, **«Descargar listados»** de octubre de 2026:
   - documentos **emitidos** (sus ventas);
   - documentos **recibidos** (las facturas de sus proveedores).
   Guardar el Excel tal cual. → Dice qué columnas trae y si sirve para el tablero de
   ventas **sin tocar Delta**, y cuántos de sus proveedores le facturan electrónicamente.
5. Mirar con qué **modo de operación** está habilitado (software propio, adquirido o
   proveedor tecnológico) y, si aparece, el nombre del proveedor.

## C. Preguntas al dueño de La Villa

6. ¿Cuánto le paga a Delta? Licencia de una vez, mensualidad, soporte, por módulo.
   ¿Qué módulos tiene (Contabilidad, Cartera, Inventario, **Auditoría**)? ¿La Auditoría
   la pagó aparte?
7. ¿Quién le montó la factura electrónica? ¿Paga algo por cada factura o por paquete?
   ¿Paga el certificado de firma digital? ¿Cuánto?
8. ¿Conoce otros negocios de Popayán que usen Delta? ¿Cuáles? (Para contar el mercado
   sin inventarlo.)
8b. **¿Quién le recomendó Delta?** ¿Su contador, otro negocio, Delta mismo? ¿Su
   contador lleva otros clientes en Delta? (Comprueba si el que decide es el contador —
   ver [qué tiene Delta §2.3](../2026-11-02-que-tiene-delta-y-por-que-lo-eligen/INFORME.md).)

## D. Al contador (el de La Villa o cualquiera de Popayán)

9. ¿El programa de Delta **todavía calcula** ajustes por inflación en la contabilidad, o
   solo lo dice su página? (La norma ya está resuelta: se eliminaron en 2007.)
10. ¿Cuántos de sus clientes en Popayán llevan Delta?
