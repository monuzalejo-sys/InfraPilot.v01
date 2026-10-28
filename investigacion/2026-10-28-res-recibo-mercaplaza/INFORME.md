# ¿Qué es la «Res.» que imprimía el recibo del POS viejo de Mercaplaza, y debe ir en el nuevo?

- Fecha: 2026-10-28
- Para: Mercaplaza Nariñense (placita-repo, recibo de caja)
- Estado: terminada
- **Esto NO es asesoría tributaria.** Es lo que hay que saber para hablar con el contador
  y para decidir qué imprime el software.

## Respuesta corta

1. «Res. 102345594 de Fecha: 2020-07-04 · Rango autorizado: 1 a 10000000 · Fac. FACTURA
   IMPRESA POR COMPUTADOR» es el renglón de la **resolución de autorización de numeración
   de la DIAN**: el permiso para numerar facturas, con fecha, vigencia y rango. Las
   facturas que la usan deben imprimir número, fecha y rango de esa autorización (Res.
   DIAN 055 de 2016).
2. **Esa resolución no sirve hoy, y lo más probable es que nunca haya sido real:**
   - las autorizaciones reales tienen un número largo de formulario 1876 (14 dígitos o
     más, empiezan por 18760…); «102345594» no tiene esa forma;
   - duran como máximo **2 años**: una de julio de 2020 venció en 2022;
   - autorizan rangos cortos, no **diez millones** de números desde el 1;
   - el sistema «factura por computador» lo eliminó la DIAN (Res. 042 de 2020 derogó la
     055 de 2016; hoy rige la Res. 165 de 2023: factura electrónica, y talonario solo de
     contingencia).
   Parece el valor de ejemplo que trae la plantilla de Effective Software.
3. **«SIMPLIFICADO» tampoco existe ya**: desde las leyes 1943 de 2018 y 2010 de 2019 se
   dice **«no responsable de IVA»**.
4. **Una persona natural no responsable de IVA no está obligada a facturar**
   (art. 616-2 del E.T. y art. 1.6.1.4.3 del DUR 1625 de 2016), siempre que cumpla las
   condiciones. La principal: ingresos brutos de menos de **3.500 UVT = $183.309.000 al
   año** (unos **$509.000 diarios**) y un solo local. Ver
   [la investigación del minimarket](../2026-10-28-dian-minimarket/INFORME.md) §0.
5. **Qué hace el recibo nuevo**: se llama **«Recibo de venta»** (no «factura») y dice
   «No responsable de IVA». **No imprime ninguna resolución** mientras el contador no
   entregue una vigente; si la entrega, se llena `resolucion` en `lib/emisor.ts` y el
   renglón aparece solo.

## La pregunta que hay que hacerle al contador (o a Leady)

**¿Mercaplaza vende más de $183 millones al año (unos $509.000 diarios)?**
- **No**, y tiene un solo local: no responsable de IVA, no obligada a facturar. El
  recibo actual está bien como comprobante.
- **Sí**: es responsable de IVA y **sí está obligada** a factura electrónica o a
  documento equivalente electrónico POS transmitido a la DIAN (el tiquete de papel ya no
  vale desde el 1-jul-2024). Eso es un proyecto aparte: proveedor tecnológico habilitado
  conectado por API (ver la investigación del minimarket, §4).

Una plaza de mercado con dos cajas puede pasar ese tope. No lo sabemos: **HUECO**.

## Lo que no se pudo confirmar

- Si la resolución 102345594 existió alguna vez. Leady la puede consultar en el portal
  MUISCA de la DIAN, con su usuario. No se hizo porque requiere su clave.
- Las ventas anuales reales de Mercaplaza (el dato que decide todo).
- Las fuentes no se ponen de acuerdo sobre si un no responsable que expide tiquetes POS
  *voluntariamente* tiene que volverlos electrónicos (Actualícese dice las dos cosas).
  Imprimir «recibo de venta» y no «factura» o «tiquete POS» esquiva la duda.

Fuentes: [fuentes.md](fuentes.md).
