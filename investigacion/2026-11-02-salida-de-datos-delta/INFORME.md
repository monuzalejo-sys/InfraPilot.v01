# ¿Se puede sacar el dato de Delta? Y lo que la web dice —y no dice— de su factura electrónica, su base, su precio y su alcance

- Fecha: 2026-11-02
- Para: Prommter — el bloqueo de la Ruta B («el piso de arriba de Delta»)
- Sigue a: [Delta en el Cauca](../2026-11-02-delta-cauca/INFORME.md)
- Estado: **en curso** — todo lo que se podía responder desde la web está aquí; lo que
  solo resuelven La Villa, su computador o un contador quedó convertido en
  [`PEDIDO-LA-VILLA.md`](PEDIDO-LA-VILLA.md)

## Respuesta corta

1. **Delta NO es proveedor tecnológico habilitado por la DIAN.** No aparece entre los
   **96** del listado oficial del 15 de octubre de 2026. Y aun así La Villa emite FPMV.
   Hay dos explicaciones posibles y la norma admite las dos (§2): o La Villa factura
   **a su propio nombre con Delta como «software adquirido»** —sin intermediario ni
   cobro por documento— o Delta se apoya en un proveedor habilitado que no nombra.
   **Se resuelve sin preguntarle a nadie: el XML trae el NIT del proveedor en el campo
   `ProviderID`** (anexo técnico DIAN, pág. 31). Una factura de La Villa basta (§2.4).
2. **El detalle de productos sí viaja en el documento electrónico.** La DIAN exige que
   el documento equivalente POS indique «cantidad, unidad de medida, y descripción
   específica y códigos», y su anexo técnico rechaza la línea cuyo valor no cuadre con
   cantidad × **precio unitario**. La rotación por producto —y el precio cambiado a
   mano— **existen en el XML**.
3. **Pero la DIAN no lo entrega en lote.** Su portal descarga **listados** en Excel por
   rango de fechas; los XML, uno por uno (fuente secundaria). 489 documentos al mes a
   mano no es un producto. **Cambia el plan:** el listado DIAN sirve para el tablero de
   *ventas* sin tocar Delta; el *detalle por producto* hay que sacarlo de **Delta o de
   los XML que Delta guarda en el computador del local**.
4. **Los ajustes integrales por inflación ya no existen en Colombia** — confirmado con
   fuente primaria: contables, Decreto 1536 de 2007; fiscales, Ley 1111 de 2006 art. 78
   (según la DIAN).
   El sitio de Delta todavía los anuncia. Es evidencia de un **sitio** desactualizado,
   no de un software desactualizado; usarlo así y no de otra manera (§4).
5. **Precio, número de clientes y motor de base de datos: no son públicos.** Se buscó y
   no aparece. Eso es un dato: **la única forma de saberlos es en el local**. Lo que sí
   apareció: el módulo de Auditoría guarda sus registros **en una base de datos aparte**.

**Siguiente paso:** mandar el [`PEDIDO-LA-VILLA.md`](PEDIDO-LA-VILLA.md). Con lo que
devuelva se cierran los huecos 1, 4, 5 y 6 de la investigación de Delta de un golpe.

---

## 1. Qué se buscó y qué salió, punto por punto de la cola

| # | Pregunta de la cola | Resultado | Estado |
|---|---|---|---|
| 1 | ¿Los XML se bajan en lote? ¿El POS trae ítems? | Ítems y precio unitario: **sí** (micrositio y anexo técnico DIAN). Lote: **listados sí, XML no** en el portal (secundaria) | parcial — se prueba en La Villa |
| 2 | ¿Cuánto cuesta Delta? | No publica precios; ninguna búsqueda dio una cifra | hueco → pedido |
| 3 | ¿Cuántos negocios de Popayán lo usan? | No hay cifra pública. Una señal indirecta **no verificada** (§5) | hueco → método propuesto |
| 4 | ¿Qué proveedor tecnológico usa Delta? | **Delta no está en la lista DIAN de 96 habilitados**. Dos hipótesis | parcial — lo cierra un XML |
| 5 | ¿Qué base de datos usa y se puede leer? | No público. Auditoría usa una base **separada** | hueco → se mira en el local |
| 6 | ¿Auditoría se cobra aparte? | Se presenta como módulo independiente con base propia; sin precio | hueco → pedido |
| 7 | ¿Siguen los ajustes por inflación? | **No.** Eliminados en 2006–2007 | **cerrado** |

## 2. La factura electrónica de Delta: quién la transmite

### 2.1 Delta no está en la lista oficial

La DIAN publica el «Catálogo de Participantes», que según su propio micrositio es «un
servicio público para dar a conocer las empresas Proveedores Tecnológicos autorizados
por la DIAN». Se bajó el archivo vigente, `Proveedores-habilitados-15102026.xlsx`
(modificado el 2026-10-14): **96 proveedores**, NIT y razón social. Se buscaron
`DELTA`, `CAUCA` y `POPAY` en todas sus cadenas: **cero coincidencias**. `citado ·
fuente primaria`

### 2.2 Entonces, ¿cómo emite La Villa? Dos hipótesis

La DIAN reconoce tres maneras de cumplir con la factura electrónica. El **Oficio
013246 del 1 de agosto de 2025** distingue el software **propio** (el que el facturador
desarrolla), el **adquirido** («aquel que le compra a un tercero») y el del **proveedor
tecnológico**, y dice que quien usa software adquirido se habilita él mismo por el
procedimiento del art. 28 de la Resolución 000165 de 2023. `citado · fuente primaria`

| Hipótesis | Qué significa | Qué cambia para nosotros |
|---|---|---|
| **A. Delta es «software adquirido»** | La Villa está habilitada a su propio nombre y transmite directo a la DIAN usando Delta. No hay intermediario | No hay un costo oculto por documento. El XML lo genera Delta en el computador del local: **probablemente ahí quedan guardados** |
| **B. Delta se apoya en un proveedor habilitado** | Por debajo hay uno de los 96, contratado por Delta o por La Villa | Puede haber un cobro por documento o por paquete. Y ese proveedor **suele** tener portal propio con descarga — pero eso es una suposición, no un dato |

No hay fuente pública que decida entre las dos. `HUECO`

### 2.3 Cómo se resuelve sin preguntarle a Delta

Dos caminos, los dos en manos del dueño de La Villa:

1. **Abrir un XML de una FPMV.** El documento electrónico identifica el software con el
   que se generó y quién lo transmitió. Si el NIT que aparece es el de La Villa o el de
   Delta, es la hipótesis A; si es el de uno de los 96 del listado, es la B y ya sabemos
   cuál. `ver §2.4 sobre qué campo exacto mirar`
2. **El portal de facturación de la DIAN** muestra el modo de operación con el que está
   habilitado el contribuyente (la DIAN publica un «instructivo de registro y selección
   del modo de operación»). Lo mira el dueño con su usuario; **nosotros nunca entramos
   con su clave.**

### 2.4 El campo exacto del XML

Leído en el **Anexo Técnico de Documento Equivalente Electrónico v1.0** (Resolución
000165 de 2023), estructura común, pág. 31 de 1.546. `citado · fuente primaria`

| Campo del XML | Qué dice el anexo |
|---|---|
| `sts:DianExtensions/sts:SoftwareProvider/sts:ProviderID` | «Identificador del Proveedor Tecnológico utilizado en la emisión del Documento Equivalente. **Un Obligado a facturar puede ser también Proveedor Tecnológico para sí mismo** u otros, en cuyo caso será Proveedor Tecnológico». Lleva el NIT sin DV; el DV va en `@schemeID` |
| `sts:DianExtensions/sts:SoftwareProvider/sts:softwareID` | «Identificador del software habilitado para la emisión del documento equivalente electrónico» |

**La lectura:** si en `ProviderID` aparece **el NIT de La Villa**, La Villa transmite por
sí misma con Delta como software → hipótesis A. Si aparece **otro NIT**, se busca en el
listado de los 96 → hipótesis B, y ya sabemos quién es y a quién preguntarle el precio
por documento. Una sola factura basta.

## 3. ¿Se puede sacar el dato desde la DIAN?

### 3.1 El documento trae el detalle por producto

El micrositio de la DIAN sobre el documento equivalente electrónico, para el tiquete
POS: «Deberá indicar cantidad, unidad de medida, y descripción específica y códigos».
`citado · fuente primaria`

Esto importa porque significa que **la rotación por producto existe dentro del
documento fiscal**, no solo dentro de Delta. Es dato del contribuyente.

Dos matices:

- La Villa emite **FPMV, «Factura de Venta POS Electrónica»** (leído en su pantalla).
  El nombre no dice si en el XML es una **factura electrónica** o un **documento
  equivalente POS**. Se sabrá con el primer XML. Para el detalle de ítems da igual: el
  documento equivalente lo exige, y una factura lleva por definición la descripción de
  lo vendido. `la parte de la factura no se verificó contra el anexo 1.9 en esta
  investigación`
- **El anexo técnico lo confirma campo por campo** para el tiquete POS (§8.2, págs.
  91–134): `cbc:LineCountNumeric` es el «número o cantidad de elementos InvoiceLine»
  (pág. 100); cada línea lleva `cbc:InvoicedQuantity` obligatoria, 1..1 (pág. 120); y
  el valor de la línea **se rechaza** si no es igual a «Cantidad x Precio Unidad menos
  descuentos más recargos», calculado con `cac:Price/cbc:PriceAmount` (pág. 120).
  Traducción: **el precio unitario de cada línea está en el XML.** El precio cambiado a
  mano dentro de la factura —la grieta 3 de Delta, la Costeñita a $2.500 y a $2.400 en
  el mismo tiquete— **se puede detectar desde el documento fiscal.** `citado · fuente
  primaria`

### 3.2 Pero el portal no lo entrega en lote

| Qué | Qué dice la fuente | Fuente | Calidad |
|---|---|---|---|
| Listados | El portal `catalogo-vpfe.dian.gov.co` tiene «DESCARGAR LISTADOS», filtrable por conceptos o rango de fechas, de documentos **emitidos y recibidos** | consultorcontable.com, 10-may-2026 | secundaria |
| Formato del listado | Excel («Exportar a Excel») | ficha de una extensión de navegador | secundaria débil |
| Columnas del listado | **No encontrado.** No sabemos si trae ítems; casi seguro que no, porque es un listado de documentos | — | `HUECO` |
| XML | Se consultan por CUFE, «una a una» | consultorcontable.com | secundaria |
| XML en lote | **No hay ninguna fuente oficial que documente una descarga masiva de XML.** Existen herramientas privadas que lo automatizan | consultorcontable.com | búsqueda negativa |
| Límite de fechas | Para la consulta de facturas: «máximo hasta tres (3) meses» | presentación de la Universidad Nacional, nov-2022 | secundaria y vieja; puede no aplicar al listado |

### 3.3 Lo que esto cambia en el plan

El piso de arriba se parte en dos, según de dónde sale el dato:

| Lo que muestra | De dónde sale | Depende de Delta |
|---|---|---|
| Ventas por día, por hora, ticket promedio, IVA cobrado | **Listado DIAN** en Excel (si trae fecha, total e IVA por documento — por confirmar) | **No** |
| Rotación por producto, plata parada, precio cambiado a mano, promociones con la cuenta hecha | **XML** (uno por uno desde la DIAN: inviable) o **los XML que Delta guarda** o **un informe exportado de Delta** | **Sí** |
| Existencias, compras, proveedores con historia de precios | Solo **Delta** (las compras de proveedores llegan a La Villa como facturas **recibidas**: esas sí están en el listado de recibidos) | Parcial |

Las facturas de compra recibidas son la sorpresa buena: si los proveedores de La Villa
le facturan electrónicamente, **la historia de precios de compra y el IVA descontable
están en la DIAN** sin pasar por Delta. Es la grieta 5 («le falta el IVA de las
compras»), atacada por la puerta de atrás. `HUECO: no sabemos qué proporción de los
proveedores de La Villa le factura electrónicamente`

## 4. Ajustes integrales por inflación: cerrado

**Contables.** Decreto 1536 del 7 de mayo de 2007 (Diario Oficial 46.621), art. 1, que
reescribe el art. 51 del Decreto 2649 de 1993: «Los estados financieros no deben
ajustarse para reconocer el efecto de la inflación». El art. 7 deroga «todas las
referencias a la obligación de reexpresión de cifras contables por el sistema de
ajustes integrales por inflación» de los Decretos 2649 y 2650 de 1993. `citado · fuente
primaria (Gestor Normativo de Función Pública)`

**Fiscales.** La Circular DIAN 0009 de 2007 (sección II.f) habla de «la derogatoria
del sistema de ajustes integrales por inflación para efectos fiscales», hecha por el
art. 78 de la Ley 1111 de 2006, que rige desde su promulgación en el Diario Oficial
46.494 del 27 de diciembre de 2006. Desde el año gravable 2007 el costo fiscal de los
activos se toma sobre el costo ajustado al 31 de diciembre de 2006 (Oficio DIAN 095985
de 2007). `citado · fuente primaria (DIAN); no se leyó el texto de la ley ni qué
artículos exactos del Estatuto deroga`

> Ojo, corregido en esta misma investigación: un buscador atribuía a esta derogatoria
> los artículos 318 a 322 y 328 del Estatuto. Al abrir la circular, **esos artículos son
> del impuesto complementario de remesas**, no de los ajustes por inflación. No se usa.

**Cómo se usa, y cómo no.** El sitio de Delta dice que su contabilidad «aplica el
sistema de ajustes integrales por inflación en forma automática». Eso prueba que **el
sitio** no se actualiza desde hace casi veinte años en ese texto. **No prueba** que el
software los siga calculando: el programa pudo actualizarse y el texto no. Se puede
decir «su página todavía vende algo que la ley quitó en 2007» —es verdad y es
verificable—; **no** se puede decir «su contabilidad está mal». El contador ya no hace
falta para la norma; sí para saber si el programa todavía lo hace (pedido, pregunta 9).

## 5. Lo que no apareció — y que no aparezca es un dato

| Búsqueda | Resultado |
|---|---|
| Precio de Delta Evolution, de cualquier módulo | Nada. Ni en su sitio ni en terceros |
| Factura electrónica en el sitio de Delta | Ni una mención en portada, productos ni descargas |
| Motor de base de datos | El sitio no lo dice. Las páginas de descarga (junio de 2020) **no tienen archivos públicos**: probablemente están detrás del «Log In» del sitio |
| Clientes de Delta en Popayán | Ninguna lista, ninguna cifra |
| Avisos de empleo que pidan Delta | **Una sola señal, no verificada**: un buscador devolvió un aviso de ACOPI Cauca en elempleo.com que pediría «manejo comprobable del sistema contable Delta». Al abrir el listado de ofertas de Popayán **no apareció**. No se usa como evidencia hasta ver el aviso |
| «Delta Ingeniería» + factura electrónica en la web | Solo empresas homónimas de Guatemala, República Dominicana, Argentina y México |

**Lo que sí salió, de paso:** el módulo de Auditoría registra las operaciones «sobre una
base de datos diferente a la base de datos de las aplicaciones Delta». Hay **al menos
dos bases** en el computador del local. `citado · sitio de Delta`

### Cómo contar los negocios con Delta sin inventar el número

El número no está en la web. Tres maneras de producirlo, de la más barata a la más
cara:

1. **Preguntarle a La Villa** si conoce otros negocios con Delta (pedido, pregunta 8).
2. **Preguntarle a dos o tres contadores de Popayán** cuántos de sus clientes llevan
   Delta. El contador es el nodo: ve muchos negocios.
3. **Censo de mostrador:** recorrer una zona comercial y anotar qué software se ve en la
   pantalla de cada caja. Da una proporción real en una muestra, no una cifra de la
   ciudad, y así se tiene que escribir.

## Lo que no se pudo confirmar

1. **Hipótesis A o B** del proveedor tecnológico (§2.2). Se cierra con un XML.
2. **Si el listado Excel de la DIAN trae fecha, total e IVA por documento** (y no solo
   el CUFE). Si no los trae, el tablero de ventas también depende de Delta. **Se rompe:**
   la mitad «sin Delta» de §3.3.
3. **Si hay descarga de XML en lote** desde algún lado oficial. Asumimos que no. **Si
   sí existe**, mejor: la Ruta B queda casi independiente de Delta.
4. **Dónde guarda Delta los XML** en el computador del local, y si los guarda.
5. **Si el XML de La Villa es factura o documento equivalente POS.** Si es documento
   equivalente, el detalle y el precio unitario están confirmados (§3.1); si es
   factura, falta leerlo en el anexo 1.9.
6. **Precio de Delta, de Auditoría y de la factura electrónica**: solo en el local.
7. **Cuántos negocios de Popayán usan Delta**: método en §5.
8. **Motor de base de datos**: solo en el local, mirando y sin tocar (pedido, punto 3).
9. **Qué proporción de los proveedores de La Villa le factura electrónicamente** — de
   eso depende cuánto de «compras» sale de la DIAN.
