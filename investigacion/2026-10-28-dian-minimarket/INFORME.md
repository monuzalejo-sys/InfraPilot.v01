# ¿Qué tiene que declarar a la DIAN un minimarket colombiano y cuál es la forma más eficiente de dárselo?

- Fecha: 2026-10-28
- Para: Prommter — cliente minimarket «La Villa» (Colombia)
- Estado: terminada
- **Esto NO es asesoría tributaria.** Es el insumo para que el dueño hable con un
  contador y para saber qué tiene que construir el software. Toda cifra viaja con su
  fuente; lo que no tiene fuente está marcado como HUECO.

## Respuesta corta

1. **La promesa se sostiene a medias.** Un cierre diario con bases separadas por tarifa
   de IVA es el insumo correcto, pero **no es la declaración**: el IVA se declara
   **cuatrimestral** (no diario) y necesita además el **IVA descontable de las compras**,
   que el software no tiene si no registra las facturas de proveedor. Y si La Villa está
   en **SIMPLE** o es **no responsable de IVA**, las bases por tarifa casi no importan:
   lo que se declara es **ingreso bruto**.
2. **Lo primero que hay que preguntarle al cliente son dos datos**, porque parten el
   problema en dos mundos distintos: (a) ¿está en SIMPLE o en ordinario?, (b) ¿vende más
   o menos de **3.500 UVT al año = $183.309.000** (≈ $509.000/día con 360 días)? Por
   debajo de eso y con un solo local es **no responsable de IVA** y **no está obligado
   a facturar**; por encima, sí.
3. **El riesgo real no es el IVA: es la factura.** Si está en SIMPLE, **está obligado a
   facturar electrónicamente** (ET art. 915). Y si expide tiquete de caja, desde el
   **1 de julio de 2024** ese tiquete debe ser **documento equivalente electrónico
   transmitido a la DIAN** — ya venció para todos los grupos. La DIAN **no** da ese
   documento en su facturador gratuito (fuente secundaria): toca proveedor tecnológico o
   desarrollo propio habilitado.
4. **La forma más eficiente para un minimarket**: emitir el **documento equivalente
   electrónico POS** a través de un proveedor tecnológico habilitado (el software de
   Prommter se le enchufa por API y manda el POS, el inventario y la caja). Así la DIAN
   ya tiene las ventas, el contador las consulta en el portal y **el cierre diario deja
   de ser documento fiscal y pasa a ser control interno del dueño** — que es para lo que
   sirve de verdad.
5. **Lo que el software NO puede prometer**: no declara, no calcula el impuesto a pagar,
   no reemplaza al contador y no es responsable si la base está mal. Ver §7.

## Detalle

### 0. El número que manda todo: la UVT

**UVT 2026 = $52.374** — Resolución DIAN **000238 del 15 de diciembre de 2025**, art. 1
(sustituye el art. 1.2.1 de la Resolución 000227 de 2025; Diario Oficial 53.338 del
17-dic-2025). `citado · fuente primaria`

| Tope | UVT | Pesos 2026 |
|---|---|---|
| No responsable de IVA (ingresos brutos) | 3.500 | **$183.309.000/año** (≈ $15.275.750/mes) |
| Declarar renta persona natural (ingresos brutos) | 1.400 | $73.323.600 |
| Declarar renta persona natural (patrimonio bruto) | 4.500 | $235.683.000 |
| IVA bimestral (si no, cuatrimestral) | 92.000 | $4.818.408.000 |
| SIMPLE grupo 1, primer rango (1,2 %) | 0–6.000 | hasta $314.244.000 |
| SIMPLE grupo 1, segundo rango (2,8 %) | 6.000–15.000 | hasta $785.610.000 |
| Tope del tiquete POS **de papel** | 5 | $261.870 por operación |

*Supuesto de la conversión diaria: 360 días de operación al año. Con 365 días el umbral
de IVA baja a $502.216/día.* `estimado (la aritmética), citado (el tope)`

### 1. Qué declara de verdad un minimarket, y cada cuánto

| Obligación | ¿Aplica a una tienda de barrio? | Periodicidad | Fuente |
|---|---|---|---|
| **IVA** | Solo si es **responsable**. No lo es si cumple **las seis** condiciones del ET art. 437 par. 3: ingresos < 3.500 UVT, **un solo** establecimiento, sin franquicia, no usuario aduanero, sin contratos ≥ 3.500 UVT y consignaciones < 3.500 UVT | **Cuatrimestral** (ene-abr, may-ago, sep-dic) por estar muy por debajo de 92.000 UVT | ET 437 par. 3 (Ley 2010/2019 art. 4); ET 600 (Ley 1819/2016 art. 196) |
| **INC (impuesto nacional al consumo)** | **No**, por vender surtido. El INC del 8 % es de expendio de comidas y bebidas (restaurante/bar). Si La Villa monta cocina o vende comida preparada, cambia | Bimestral si aplicara | ET 908 par. 1 y par. 4 (el 8 % se adiciona solo en expendio de comidas y bebidas) |
| **Impuesto a ultraprocesados y bebidas azucaradas** (Ley 2277/2022, ET 513-1 y ss.) | **HUECO**: el responsable parece ser productor/importador y no el minorista, pero **no pude leer el art. 513-7 ni el 513-2**. Verificar con el contador antes de afirmarlo | — | ET 513-8 (base gravable) leído; 513-7 no verificado |
| **Renta** | Sí, salvo que no supere **ninguno** de los topes del ET art. 592 num. 1 (no responsable de IVA + ingresos < 1.400 UVT + patrimonio ≤ 4.500 UVT). Un minimarket con local e inventario normalmente **sí** declara | Anual | ET 592 |
| **Retención en la fuente** | Solo si es **agente retenedor** (típicamente personas jurídicas, o naturales que superan los topes del ET 368-2). Una tienda persona natural pequeña normalmente **no** retiene. **HUECO**: no verifiqué el art. 368-2 en esta investigación | Mensual si aplica | HUECO |
| **ICA municipal (+ avisos y tableros)** | **Sí**, actividad comercial. Pero en **SIMPLE queda integrado** y se paga con el recibo SIMPLE | Depende del municipio (anual o bimestral) | ET 903 (ICA consolidado dentro del SIMPLE); el acuerdo municipal es **HUECO**: no sabemos la ciudad |
| **Información exógena** | **HUECO**: depende de topes anuales que no verifiqué. Casi siempre fuera del alcance de una tienda pequeña | Anual | HUECO |

### 2. SIMPLE vs ordinario: qué cambia para el software

**SIMPLE (ET arts. 903 y ss.)** — un minimarket cae en el **grupo 1 del ET art. 908:
«tiendas pequeñas, mini-mercados, micro-mercados y peluquería»**, tarifa consolidada
**1,2 % · 2,8 % · 4,4 % · 5,6 %** según rango de ingresos brutos anuales (0-6.000,
6.000-15.000, 15.000-30.000, 30.000-100.000 UVT). Última modificación: **Ley 2277 de
2022 art. 44**; los numerales 4 y 5 del art. 908 quedaron inexequibles (Sentencia
C-540 de 2023). `citado`

Lo que cambia, y es lo importante para el software:

- **El SIMPLE sustituye renta e integra el ICA consolidado** (y el INC cuando aplica)
  — ET art. 903. Menos declaraciones, un solo recibo.
- Se paga con **recibos electrónicos SIMPLE bimestrales** (anticipos) y una
  **declaración anual consolidada** (ET 908 par. 4).
- **La base es el ingreso bruto, no la base gravable por tarifa de IVA.** Si La Villa
  está en SIMPLE, el informe que de verdad le sirve es **ingresos brutos por bimestre**,
  no el desglose 0/5/19 %.
- Si además es responsable de IVA, en SIMPLE presenta **una declaración anual
  consolidada de IVA** y transfiere el IVA mensual en el recibo SIMPLE (ET art. 915).
- **Y el golpe**: el ET art. 915 obliga a los del SIMPLE a **expedir factura
  electrónica**, y a adoptarla **dentro de los dos meses siguientes a la inscripción en
  el RUT**. En SIMPLE no hay escapatoria de la factura electrónica. `citado`

**Ordinario, no responsable de IVA**: no declara IVA, **no está obligado a expedir
factura** (ET art. 616-2: «tampoco existirá esta obligación en las ventas efectuadas por
los no responsables del IVA»), y si decide facturar voluntariamente **tiene que hacerlo
electrónicamente** y queda considerado obligado a facturar desde ese momento
(Decreto 442 de 2023, parágrafo 1 del art. 1.6.1.4.3 del DUR 1625/2016). **Ojo con esto:
emitir factura «por si acaso» lo mete solo en la obligación.** `citado`

### 3. ¿Es obligatoria la factura electrónica para una tienda de barrio?

- **No, si es no responsable de IVA y no factura** (ET 616-2). Es el único caso de salida.
- **Sí, si está en SIMPLE** (ET 915), sin importar lo pequeño que sea.
- **Sí, si es responsable de IVA** (obligado a facturar, régimen general).
- **El tiquete POS de papel tiene tope de 5 UVT = $261.870 por operación** sin impuestos
  (ET art. 616-1 par. 2, redacción de la **Ley 2155 de 2021 art. 13**; calendario fijado
  por la **Resolución DIAN 001092 de 2022**). Por encima de ese valor hay que expedir
  factura electrónica. **Confirmado**, con un matiz grande: una vez se implementa el
  **documento equivalente electrónico**, el límite de cuantía **deja de aplicar**
  (considerandos de la Resolución 000165 de 2023). `citado`
- **El tiquete POS no da derecho a IVA descontable ni a costos y deducciones al
  comprador**, y el comprador puede exigir factura electrónica (ET 616-1 par. 4). Para un
  minimarket esto es operación diaria: el cliente que compra para su negocio va a pedir
  factura. **El software tiene que poder convertir una venta POS en factura electrónica.**
- **Documento soporte de pago de nómina electrónica** (Resolución DIAN **000013 del 11 de
  febrero de 2021**, art. 4, compilado como 1.5.3.2.3 en la Resolución 000227 de 2025):
  obligados los **contribuyentes de renta que hagan pagos por relación laboral y que
  requieran soportar costos y deducciones**. Traducción: si La Villa tiene empleados y
  descuenta la nómina en renta, sí. **Si está en SIMPLE, HUECO**: la resolución no
  menciona al SIMPLE y no encontré doctrina que lo resuelva. `citado + HUECO`

### 4. El POS electrónico hoy: ya venció, y sí se transmite a la DIAN

**Resolución DIAN 000165 del 1 de noviembre de 2023** (Diario Oficial 52.567 del
2-nov-2023) rige el sistema de facturación, derogó la Resolución 000042 de 2020 y expidió
el **Anexo Técnico de Documento Equivalente Electrónico v1.0**. Su **art. 23**
—modificado por la **Resolución 000008 de 2024**— fijó el calendario del
**documento equivalente electrónico tiquete de máquina registradora con sistema POS**:

| Grupo | Fecha | Sujetos |
|---|---|---|
| 1 | **1-may-2024** | Grandes contribuyentes |
| 2 | **1-jun-2024** | Declarantes de renta que no sean grandes contribuyentes |
| 3 | **1-jul-2024** | **No declarantes de renta y quienes no tengan ninguna de las calidades anteriores** |

`citado · fuente primaria (normograma DIAN)`

**Conclusión dura: el plazo venció para todos el 1 de julio de 2024.** Hoy, 2026-10-28,
un negocio que expide tiquete de caja debe emitirlo como documento equivalente
electrónico, **generado y transmitido a la DIAN para validación** (el art. 23 remite a
los arts. 29, 31 y 33; los plazos de transmisión están en el art. 62, también modificado
por la Resolución 000008 de 2024 — **el plazo exacto en horas es HUECO**, no lo leí).
Ya no basta con «los libros».

Dos cosas más, de peso:
- **El DEE POS no tiene límite de cuantía** y, a diferencia del tiquete de papel, **sí da
  derecho al comprador a IVA descontable y a costos y deducciones** si queda identificado
  en el documento (micrositio DIAN de documento equivalente electrónico). Requisitos:
  nombre/razón social y NIT o cédula del adquirente, cantidad, unidad de medida,
  descripción y códigos de los bienes. `citado · fuente primaria`
- **Alternativa legal**: quien no quiera implementar el DEE puede **facturar
  electrónicamente el 100 % de sus operaciones** (fuente secundaria: Sovos; el
  fundamento está en la Resolución 000165, no lo verifiqué artículo por artículo).
  `citado · secundaria`

**Vigencia a tener en cuenta**: la Resolución 000165 de 2023 fue **compilada en la
Resolución DIAN 000227 de 2025** (el art. 23 es hoy el 1.5.1.3.3.1). Cualquier cita
formal al contador debería hacerse sobre la compilación de 2025. **Y marcado para
verificar**: mi conocimiento llega a may-2026; **no encontré ninguna norma de 2026 que
cambie esto, pero no puedo descartarla**.

### 5. La promesa: «separado todo lo que tiene que declarar al final del día»

**Veredicto: bien intencionada, mal planteada. No está mentida, está incompleta.**

Qué le falta para «servir para declarar»:

1. **La periodicidad no es diaria.** IVA cuatrimestral, SIMPLE bimestral, renta e ICA
   anuales. El cierre diario es **insumo**, nunca la declaración. Lo que el contador usa
   es el **acumulado del período**.
2. **Falta la mitad de la cuenta: las compras.** La declaración de IVA (formulario 300)
   se liquida con IVA generado **menos IVA descontable** de las compras. Un cierre de
   ventas, por perfecto que sea, no produce el impuesto a pagar. **Si el software no
   registra las facturas de proveedor, el dato que entrega es la mitad del problema.**
3. **Si está en SIMPLE o es no responsable de IVA, el desglose por tarifa es casi
   decorativo** — lo que se declara es ingreso bruto. Construir el desglose 0/5/19 % y
   presentárselo como «lo de la DIAN» a un cliente del SIMPLE es prometer precisión
   donde no hace falta.
4. **Un minimarket tiene de todo**: excluidos (gran parte de la canasta familiar, ET 424),
   exentos (ET 477), 5 % (ET 468-1) y 19 %. Clasificar cada producto es un trabajo de
   maestro de datos, no de reporte. **Ese es el verdadero costo oculto de la promesa.**

**Qué usa el contador de verdad, y con qué periodicidad**: el **libro auxiliar de ventas
del período** (ventas gravadas separadas por tarifa, exentas y excluidas) + el **libro
auxiliar de compras con su IVA descontable**, cruzados contra los **documentos
electrónicos que ya están en el sistema de la DIAN**. Con POS electrónico implementado,
la DIAN **ya tiene las ventas** y el contador las consulta allí. `estimado — es práctica
contable estándar, no una norma que pueda citar; márquelo como HUECO formal`

**Replanteo honesto de la promesa, que sí se puede cumplir:**
> «Al cerrar el día, el sistema deja el total de ventas, el desglose por tarifa de IVA y
> el consolidado del mes y del período, listo para el contador — y emite cada venta como
> documento electrónico ante la DIAN. El sistema no declara: el contador declara con eso.»

### 6. Los cuatro caminos, comparados

| Camino | Qué resuelve | Qué no resuelve | Costo |
|---|---|---|---|
| **(a) Cierre diario con totales por tarifa al contador** | Control interno del dueño, caja cuadrada, insumo del período | **No cumple la obligación de facturar.** No trae compras. Trabajo manual del contador cada mes | $0 adicional (lo construye Prommter) |
| **(b) Factura electrónica con proveedor tecnológico** | Cumple todo, y cubre al cliente que pide factura | Exige NIT/nombre del adquirente en cada venta: **inviable como flujo único en una tienda de barrio con cola en la caja** | Siigo Facturación desde **$9.992/mes** (24 doc/año) y plan **gratis con 5 documentos al año**; Alegra Facturación **Emprendedor $17.900/mes** |
| **(c) Documento equivalente electrónico POS** ← **recomendado** | **Es la obligación vigente desde 1-jul-2024.** Venta rápida sin pedir datos, y con datos del adquirente da IVA descontable. La DIAN recibe las ventas: el contador no depende de que le manden archivos | No lo da el facturador gratuito de la DIAN (secundaria). Hay que habilitarse y usar proveedor o desarrollo propio | Siigo **Sistema POS + Facturación**: Esencial **$28.750/mes**, Inicio **$43.943/mes**, Avanzado **$67.493/mes** (precios de pago anual, cliente nuevo). Alegra **POS Emprendedor $25.900/mes** (su página **no menciona** el DEE) |
| **(d) Exportar archivo para el software del contador** | Ahorra digitación | **HUECO: no pude verificar qué formato aceptan Siigo, World Office ni Helisa.** No cumple ninguna obligación por sí solo | Siigo Contador: **gratis** 1 empresa, **$44.658/mes** ilimitado (lo paga el contador, no el cliente) |

**Recomendación: (c) + (a).** El POS electrónico cumple la ley y le quita al cliente el
riesgo de sanción; el cierre diario le da al dueño lo que de verdad quería (saber cuánto
vendió y que la caja cuadre). **(b)** se construye como botón «el cliente pide factura»
sobre el mismo proveedor, no como flujo principal. **(d)** solo si el contador lo pide, y
preguntándole a él el formato.

**Nota de costo**: todos los precios de proveedores son `citado` de páginas comerciales
(no fuente legal), tomados el 2026-10-28, y **ninguna de las dos páginas dice si incluyen
IVA**. Alegra no menciona el documento equivalente electrónico en su página de precios;
Siigo dice explícitamente que la emisión ilimitada desde Siigo Nube **no incluye** el DEE
POS. **Antes de cotizar hay que confirmar por escrito con el proveedor que su plan emite
documento equivalente electrónico POS.**

### 7. Qué NO puede prometer el software (y el riesgo de lo ya prometido)

El software **puede**: registrar cada venta, clasificar el producto por tarifa de IVA
según como lo hayan parametrizado, cerrar la caja del día, acumular el período, emitir el
documento electrónico ante la DIAN a través de un proveedor habilitado y exportar los
auxiliares.

El software **no puede, y hay que decirlo por escrito en la propuesta**:

1. **No declara ni presenta nada ante la DIAN.** Las declaraciones las firma y presenta el
   contribuyente (y las firma un contador cuando la ley lo exige).
2. **No decide el régimen** (SIMPLE vs ordinario) ni si el cliente es responsable de IVA.
3. **No garantiza que la tarifa de cada producto esté bien.** Esa clasificación la define
   el contador o el comerciante; el software la aplica. **Quien parametriza, responde.**
4. **No produce el IVA a pagar** si no entran las compras al sistema.
5. **No reemplaza al contador** ni asume sanciones por extemporaneidad o inexactitud.

**El riesgo de malentendido es real.** «Va a tener separado todo lo que tiene que declarar»
suena, en oído de tendero, a «el sistema me resuelve la DIAN». Si llega una sanción, el
cliente va a mirar a Prommter. **Recomendación concreta**: antes de firmar, ponerlo en la
propuesta en tres renglones —qué entrega el sistema, qué hace el contador, qué responde el
comerciante— y pedirle al cliente el **nombre de su contador** para validar el formato del
informe con él en la primera semana. Así la promesa se convierte en alcance y deja de ser
un riesgo.

### 8. Qué debe construir el software (lista de alcance)

1. **Campo de tarifa de IVA por producto** (excluido / exento / 0 % / 5 % / 19 %), editable,
   con historial de cambios — porque la tarifa cambia por ley.
2. **Cierre de caja diario** con: total vendido, base por tarifa, IVA generado por tarifa,
   total excluidos y exentos, medios de pago, y diferencia de caja.
3. **Acumulados por mes, bimestre y cuatrimestre** — porque son los períodos reales.
4. **Registro de compras con su IVA descontable** (aunque sea foto de la factura + totales):
   sin esto el informe no sirve para declarar IVA.
5. **Interfaz de facturación detrás de una abstracción** para enchufar el proveedor DIAN
   sin rehacer el módulo — exactamente la mitigación que ya acordó la casa en
   `villa-broaster/PEND-001` (2026-08-08).
6. **Botón «el cliente pide factura»**: convertir una venta POS en factura electrónica con
   los datos del adquirente.
7. **Exportación** en CSV/Excel de los auxiliares de ventas y compras, con el formato
   validado **con el contador del cliente**, no inventado.

## Lo que no se pudo confirmar (HUECOS)

1. **Datos del cliente**: ciudad, ventas al mes, régimen (SIMPLE u ordinario), si es
   responsable de IVA, si tiene empleados en nómina, si es persona natural o jurídica, si
   ya tiene contador y si ya está habilitado en el sistema de facturación de la DIAN.
   **Sin esto no se puede cerrar el alcance ni el precio.** Son siete preguntas para la
   reunión.
2. **Responsable del impuesto a ultraprocesados y bebidas azucaradas** (ET 513-1 y ss.):
   no leí los arts. 513-2 ni 513-7. Probablemente no afecta al minorista, pero no lo afirmo.
3. **Retención en la fuente**: no verifiqué el ET art. 368-2 (cuándo una persona natural es
   agente retenedor).
4. **Información exógena**: topes no verificados.
5. **ICA**: tarifa y periodicidad dependen del acuerdo del municipio, que no conocemos.
6. **Plazo exacto de transmisión** del documento equivalente electrónico a la DIAN
   (art. 62 de la Resolución 000165/2023, modificado por la 000008/2024): no lo leí.
7. **¿El facturador gratuito de la DIAN emite documento equivalente electrónico POS?**
   La única fuente que lo responde es **secundaria** (Actualícese, 15-mar-2024: dice que
   **no**). El micrositio de la DIAN no lo aclara. **Verificar con la DIAN.**
8. **Nómina electrónica en el SIMPLE**: la Resolución 000013 de 2021 no menciona al SIMPLE.
9. **Formato de importación de Siigo, World Office y Helisa**: no encontré documentación.
   Hay que preguntárselo al contador del cliente.
10. **Qué informe exacto usa el contador**: lo describí por práctica contable estándar, no
    por norma citable. Es `estimado`.
11. **Normas posteriores a mayo de 2026**: busqué y no aparecieron cambios de 2026, pero mi
    conocimiento llega hasta mayo de 2026. **Confirmar vigencia antes de prometerle algo
    al cliente.**
