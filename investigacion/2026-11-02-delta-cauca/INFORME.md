# ¿Cómo podríamos mejorar mucho lo que Delta ya hace en el Cauca?

- Fecha: 2026-11-02
- Para: Prommter — estrategia de producto y de venta en Popayán
- Estado: terminada, con seis huecos declarados al final

## Respuesta corta

1. **Delta existe, es caucana y es vieja.** «DELTA Ingeniería es una empresa Caucana,
   que surge en los años 90» (su propio sitio). Vende cuatro módulos de escritorio para
   Windows —Contabilidad, Cartera, Inventario y Auditoría— bajo el nombre **Delta
   Evolution**. El Inventario «maneja punto de venta con cajón monedero, impresión con
   tiquetera y código de barras». Es el software que usa La Villa.
2. **No se le gana de frente y no hay que intentarlo.** Tiene 30 años de confianza en
   la ciudad, hace **contabilidad de verdad** (PUC, medios magnéticos para la DIAN,
   cartera con intereses de mora, cuatro métodos de costeo) y funciona sin internet
   porque es de escritorio. Nosotros no hacemos contabilidad y somos nuevos.
3. **Donde es estructuralmente débil es donde nosotros somos fuertes.** Delta le entrega
   al dueño **un archivo de lo que pasó**. Nunca le dice **qué hacer**, nunca se lo dice
   **donde el dueño está** —el celular— y no le da **ninguna cara pública** al negocio.
   Eso no lo puede arreglar sin dejar de ser lo que es.
4. **La jugada no es otro POS más bonito: es el piso de arriba de Delta.** Dejarle la
   caja y el libro contable donde ya funcionan, y poner encima el tablero en el
   celular, la rotación con la plata parada, la historia de precios del proveedor, el
   archivo que el contador importa sin teclear, y la vitrina que vende. Se vende sin
   pedirle a nadie que tire su sistema — y el mercado no es un cliente, son **todos los
   negocios de Popayán que ya tienen Delta**.
5. **Hay un bloqueo que decide todo y hoy no está resuelto:** cómo sacamos el dato de
   Delta. Ver §5 y el hueco 4.

---

## 1. Qué es Delta, con sus propias palabras

Leído de `delta-ingenieria.net` el 2026-11-02 y cruzado con las diez fotos del POS de
La Villa del 30 de octubre (`prommter/la-villa-repo/docs/sistema-actual.md`).

| | |
|---|---|
| Quién | «empresa Caucana, que surge en los años 90, para brindar Soluciones Informáticas al sector Financiero» |
| Dónde | Bella Vista Vial Bosque, Popayán · 313 684 00 27 · 316 433 25 52 |
| Producto | **Delta Evolution**: Contabilidad · Cartera · Inventario (con POS) · Auditoría (SAD) |
| Plataforma | Escritorio Windows. En la pantalla de La Villa: `Ventas - Sucursal: 1. Principal - Cajero: ESTEBAN ASTAIZA` |
| POS | «punto de venta con cajón monedero, impresión con tiquetera y código de barras»; «Configuración de balanzas electronicas» |
| Costeo | «Promedio ponderado, UEPS, PEPS y Reposición» |
| DIAN | «MEDIOS MAGNETICOS PARA LA DIAN», PUC, información exógena, homologación NIIF |
| Factura electrónica | **No se menciona en ninguna parte de su sitio.** Pero La Villa emite **FPMV** desde Delta, así que existe por fuera de lo publicado |
| Soporte | Lunes a viernes 8 a.m.–7 p.m., sábados 8 a.m.–2 p.m. |
| Última descarga publicada | **junio de 2020** |
| Último cliente publicado | Giramos S.A., **marzo de 2018** (antes: Asadero Kikos, 2015) |

El número de WhatsApp que aparece en la pantalla de La Villa (`3164332552`) es el mismo
del sitio: **es la misma empresa**, sin duda.

## 2. Por qué se usa tanto, y por qué eso hay que respetarlo

No es inercia. Delta tiene cuatro cosas que nosotros **no** tenemos:

1. **Treinta años en la ciudad.** Un técnico que se conoce, que contesta y que va al local.
2. **Contabilidad completa.** Nosotros alimentamos al contador; Delta **es** el libro.
   Cartera con intereses de mora y multas, estados financieros, medios magnéticos.
   Prometer que reemplazamos eso sería mentir y se vería en la primera declaración.
3. **No depende de internet** por naturaleza: está instalado en el computador del local.
4. **El contador ya sabe manejarlo**, y hay más de sesenta tutoriales publicados.

Y casi con seguridad —hueco 1— **cuesta una fracción de lo que cobramos**: una licencia
de escritorio local contra $1.000.000 al mes.

**Conclusión:** una venta planteada como «cámbiese de Delta a Prommter» es una venta que
se pierde por precio, por confianza y por contabilidad, las tres a la vez.

## 3. Las ocho grietas, cada una con su evidencia

| # | La grieta | De dónde sale | Qué tan grande es |
|---|---|---|---|
| 1 | **El dueño solo ve su negocio parado frente al computador del local.** No hay nube, ni web, ni app: la palabra no aparece una sola vez en su sitio | sitio + pantalla de escritorio | **La más grande.** Es la razón de ser de nuestro tablero |
| 2 | **La existencia no se puede creer.** En las fotos de La Villa se leen −20, −17, −19, −4, −133 y **−474** | fotos del POS | Enorme: sin inventario creíble no hay rotación, ni pedido, ni promoción |
| 3 | **El precio no lo gobierna el catálogo.** Delta tiene un tutorial llamado «Modificar el precio de un producto en una factura» (34 segundos). Resultado medido: `COSTEÑITA 175 ML` a $2.500 y a $2.400 **en la misma factura 16277** | sitio + fotos | Grande: el margen real es desconocido |
| 4 | **Los documentos se modifican, se anulan y hasta se les cambia el número.** Tanto, que auditar es un **módulo aparte, con base de datos aparte** | sitio (Módulo SAD, tutoriales 14 y 15 de Contabilidad) | Grande: lo que para ellos es un módulo que se vende, para nosotros es el comportamiento por defecto |
| 5 | **Entrega listados, no decisiones.** Kárdex, ventas por artículo, existencias, comparativo físico. Nada que diga *qué está quieto, cuánta plata hay dormida ahí y qué hacer* | sitio (sección INFORMES) | Grande: es exactamente lo que pidió el dueño de La Villa |
| 6 | **El mes del contador sigue siendo trabajo.** Da medios magnéticos, pero le falta la otra mitad: el **IVA descontable de las compras**, y el archivo en el formato que el software del contador importa | sitio + investigación DIAN del 28-oct | Media-grande, y es nuestra promesa ya hecha |
| 7 | **El negocio no tiene cara pública.** Delta mira hacia adentro. Ni vitrina, ni catálogo, ni pedidos, ni domicilios. Su propio sitio todavía tiene el texto de plantilla sin reemplazar («demo@example.com», una dirección en Filipinas) y el último cliente publicado es de 2018 | sitio | Grande, y aquí Delta no compite: no es su negocio |
| 8 | **El soporte tiene horario de oficina y la tienda no.** L–V 8–19, sábados hasta las 2, domingo cerrado | sitio | Media, pero se siente: la caja se cae un domingo a las 7 p.m. |

Y un detalle que dice la edad del producto: el sitio sigue vendiendo que la Contabilidad
«aplica el sistema de **ajustes integrales por inflación** en forma automática». En
Colombia los ajustes por inflación se eliminaron hace casi veinte años. `sin fuente
citada en esta investigación — confirmar con el contador antes de usarlo como argumento`

## 4. Las tres rutas

### Ruta A — Reemplazar a Delta
Pelear por el mismo puesto. **Descartada como estrategia principal:** perdemos en precio,
en confianza y en contabilidad, y obliga a migrar datos de un sistema cuya base no
sabemos leer.

### Ruta B — El piso de arriba de Delta ← **la recomendada**
Delta se queda con lo que hace bien: cobrar en el mostrador y llevar el libro. Nosotros
tomamos **el mismo dato que Delta ya captura** y entregamos lo que estructuralmente no
puede dar:

- el **tablero en el celular**, con cada cifra auditable hasta la venta que la produjo
- **qué se mueve y qué está quieto**, con la plata parada en cada cosa
- **promociones con la cuenta hecha** y nunca por debajo del costo
- **proveedores con historia de precios de compra** (descubrir el aumento el día que pasa)
- el **archivo del contador** regenerable, con el IVA de las compras incluido
- la **vitrina pública** con catálogo, pedidos y domicilios
- **alertas de existencia imposible**: el negativo deja de ser normal y se vuelve un aviso

Por qué esta: se vende **sin pedirle a nadie que tire su sistema**, que es la objeción que
mata la venta; el mercado deja de ser un cliente y pasa a ser **todos los negocios de
Popayán que ya tienen Delta**; y cae justo donde Prommter ya es bueno —web, celular,
vitrina, marketing— y donde Delta no puede llegar sin volverse otra empresa.

### Ruta C — Reemplazo completo, pero solo en negocios nuevos
Lo que ya estamos haciendo con La Villa y con los que abren de cero. Ahí no hay nada que
migrar ni costumbre que romper. **B es la cuña; C es el destino** de quien después nos
pida la caja también.

## 5. El bloqueo que decide todo: cómo sacamos el dato

La Ruta B no existe si no podemos leer lo que Delta ya tiene. Tres fuentes, de mejor a peor:

1. **Los XML de la factura electrónica.** Son del **contribuyente**, no de Delta, y la
   DIAN los tiene. Si el negocio ya emite FPMV —La Villa lo hace— cada venta vive en un
   documento que el dueño puede pedir. Es la única fuente **independiente del
   proveedor**, y por eso la primera que hay que probar. `hueco 5: falta confirmar cómo
   se descargan en lote y si el documento equivalente POS trae el detalle de ítems`
2. **Los informes que Delta exporta.** Su sitio tiene un tutorial «Tipo de formatos para
   guardar reportes». Si exporta a Excel o CSV, se puede leer, aunque sea a mano al
   principio.
3. **Leer la base de datos de Delta directamente.** Lo más rico y lo más frágil: motor
   desconocido, y nos ata a su versión.

**Lo que hay que hacer primero, y es barato:** pedirle a La Villa que exporte un mes de
informes de Delta y descargue sus documentos electrónicos. Con eso en la mano sabemos si
la Ruta B es un producto o un deseo. Mientras eso no esté, **no se promete el piso de
arriba a ningún cliente**.

## 6. Lo que NO se puede prometer

- **No reemplazamos la contabilidad.** Ni PUC, ni estados financieros, ni medios
  magnéticos. Alimentamos al contador; no somos el libro.
- **No declaramos.** Producimos el informe; firmar es del contador.
- **No somos más baratos.** Si la conversación llega al precio por el precio, perdimos.
- **No tenemos treinta años aquí.** Eso se compensa contestando, no diciéndolo.

## 7. Lo que no se pudo confirmar

1. **Cuánto cuesta Delta.** No publica precios. Hay que preguntarlo a un cliente suyo.
2. **Cuántos negocios de Popayán lo usan.** El dueño dice «bastante»; no está verificado.
   La página de descargas marca entre 1.323 y 1.414 vistas por módulo, lo cual no es un
   número de clientes.
3. **Qué proveedor tecnológico usa Delta para la factura electrónica.** No aparece en su
   sitio y sin embargo La Villa emite FPMV. Importa: puede ser un costo por documento
   que el cliente está pagando sin saberlo.
4. **Con qué base de datos trabaja Delta** y si se puede leer sin su permiso.
5. **Si el XML del documento equivalente POS trae el detalle de ítems** o solo el total.
   De esto depende si se puede medir rotación desde la DIAN.
6. **Si el módulo de Auditoría se cobra aparte.** El sitio lo presenta como producto
   independiente, lo que sugiere que sí.
