# ¿Puede el sistema de Prommter emitir la factura electrónica de La Villa?

- Fecha: 2026-11-11
- Para: Prommter — cliente minimarket «La Villa» (Popayán, Colombia)
- Estado: terminada
- Continúa [2026-10-28-dian-minimarket](../2026-10-28-dian-minimarket/INFORME.md), que
  respondió *qué* tiene que declarar. Esta responde *si lo podemos emitir nosotros*.
- **Esto NO es asesoría tributaria.** Es el insumo para decidir qué construir y para que
  el dueño lo hable con su contador. Lo que no tiene fuente está marcado como HUECO.

## Respuesta corta

1. **Sí hay forma, y son dos.** (a) Enchufarnos a un **proveedor tecnológico (PT)
   autorizado** por API: él firma y transmite a la DIAN, nosotros emitimos desde la caja.
   (b) **Software propio habilitado**: La Villa registra NUESTRO software en su cuenta de
   la DIAN, pasa el set de pruebas y emite él mismo. La (a) es semanas; la (b) es meses.
2. **No es un problema legal, es un problema de dónde corre el programa.** Hoy el sistema
   es **un archivo HTML en el navegador**. Firmar un documento electrónico exige una
   **llave privada** (certificado de firma digital) y transmitirla a la DIAN: eso no puede
   vivir en una página que se descarga al teléfono de cualquiera que abra el enlace.
   **Necesita el sistema de producción con servidor** — justo la parte que no está
   construida. La factura electrónica no es un botón que falte: es la razón para construirlo.
3. **No hay que pelear con Delta.** Un mismo NIT puede tener **varias resoluciones de
   numeración**, y los prefijos **se asocian uno a uno a cada software** en el portal de
   la DIAN. O sea: Delta sigue con su prefijo y el nuestro arranca con otro. No se pisan,
   no se duplican números. Es lo que permite migrar por partes en vez de de un salto.
4. **Lo que se emite en el mostrador no es «la factura»**, es el **documento equivalente
   electrónico POS** (lo que Delta ya manda como FPMV). Varios PT lo soportan por API
   —Dataico, Bilidox, Yabi, Misfacturas— y otros, como Factus, no lo mencionan.
   **Al elegir PT, lo primero que se pregunta es si soporta POS electrónico**, no factura
   de venta: casi todos venden lo segundo.
5. **Cuesta poco por documento y nada por empezar.** Entre **$17 y $50 por documento**
   según proveedor y volumen, con **ambiente de pruebas gratis** (Factus, por ejemplo,
   lo da ilimitado). Con ~100 ventas diarias ≈ 3.000 documentos/mes ≈ **$51.000 a
   $150.000 al mes**. HUECO: no está confirmado cuántas ventas diarias hace La Villa.
6. **Recomendación:** PT por API, no software propio. Lo que La Villa gana no es
   «facturar» —ya factura con Delta— sino **dejar de tener dos sistemas**: hoy la venta
   se teclea en Delta y el inventario vive aparte. El día que nuestra caja transmita, la
   venta se registra una sola vez.

## Detalle

### 1. Las dos rutas, y en qué se diferencian de verdad

| | Proveedor tecnológico (PT) | Software propio habilitado |
|---|---|---|
| Quién responde ante la DIAN | El obligado (La Villa), pero el PT pone la infraestructura | La Villa, sola |
| Qué construimos nosotros | Llamadas a una API REST | XML UBL 2.1, firma XAdES, CUFE/CUDE, QR, eventos, contingencia |
| Certificado de firma digital | Lo pone el PT | Lo compra La Villa (entidad acreditada por ONAC) |
| Set de pruebas ante la DIAN | Del PT, ya aprobado | Nuestro, hay que pasarlo |
| Tiempo | Semanas | Meses |
| Costo | Por documento | Certificado + desarrollo + mantener el anexo técnico al día |

El anexo técnico **cambia** (la versión 1.0 del Anexo de Documento Equivalente la exigió
la Resolución 165 de 2023, modificada por la 119 de 2024). Con software propio, cada
cambio de anexo es trabajo nuestro y riesgo del cliente; con PT, es del PT. Esa es la
razón de fondo para la recomendación, más que el costo.

Nota: **MATIAS** y **Nextpyme** venden API pero operan en modo «software propio» —el
habilitado es el cliente, no ellos—. No es lo mismo que un PT y cambia quién responde.

### 2. Por qué hoy no se puede, aunque la norma lo permita

Para emitir hay que **firmar** cada documento con una llave privada y transmitirlo. Eso
necesita un servidor del lado nuestro. Un HTML que se abre en el navegador manda el
programa entero al aparato de quien lo abre: ahí no se guarda una llave que vale por la
identidad fiscal del negocio. Es el mismo límite que ya está escrito en el sistema para
los permisos («esconder la pantalla es cortesía, no candado»).

Es decir: **la factura electrónica obliga a construir el sistema de producción** — base
propia en el VPS, dominio del cliente, caja que guarda local y espeja a la nube. Eso ya
estaba en el plan; esto le pone fecha y motivo.

### 3. Convivir con Delta sin romper nada

La autorización de numeración queda **a nombre del contribuyente** y no se vincula sola a
ningún software: los prefijos se asocian **uno a uno** a cada software en el portal. Así
que el camino sin riesgo es:

1. La Villa pide a la DIAN una **resolución de numeración nueva, con prefijo propio**.
2. Ese prefijo se asocia a nuestro software (o al PT).
3. Delta sigue intacto con el suyo mientras se prueba.
4. Cuando el dueño se convenza, se apaga Delta y se retira su asociación.

Advertencia hallada: al cambiar de modelo de operación (de PT a software propio o al
revés) hay proveedores que sostienen que **toca prefijo nuevo empezando en 1**. Es
interpretación de proveedor, no norma verificada: HUECO, lo confirma el contador.

### 4. El límite de 5 UVT: ya no manda donde creíamos

UVT 2026 = **$52.374** (Resolución DIAN 000238 de 2025), o sea 5 UVT ≈ **$261.870**.
La mayoría de fuentes recientes sostiene que ese tope era del **tiquete de papel** y que
el **POS electrónico se expide sin importar el valor**. Otras guías comerciales dicen lo
contrario y **se contradicen dentro de la misma página**. HUECO: no encontré el documento
oficial que lo zanje. Para La Villa casi no cambia nada —sus ventas son de pocos miles de
pesos—, pero el software debe poder emitir **factura de venta** cuando el cliente la pida
(empresa, alguien que necesita soportar el costo), no solo POS.

### 5. Lo que hay que preguntar antes de contratar nada

1. ¿El PT soporta **documento equivalente POS electrónico**, no solo factura de venta?
2. ¿Está en el **listado oficial de PT autorizados** de la DIAN? (no basta con que su
   página lo diga)
3. ¿Soporta el **anexo técnico vigente** y la **contingencia** cuando se cae internet?
4. ¿Cuánto cuesta el documento a nuestro volumen real, y qué pasa si lo pasamos?
5. ¿Qué entrega cuando el negocio se quiera ir? (los documentos son del cliente)

### 6. Lo que esto NO resuelve

- No declara ni calcula lo que hay que pagar. Sigue siendo del contador.
- No quita el trámite: la **habilitación y la resolución de numeración las pide el dueño**
  con su clave de la DIAN. Nosotros no entramos a la DIAN con la clave de nadie.
- No arregla el inventario: la existencia la arregla un conteo físico, no la DIAN.
