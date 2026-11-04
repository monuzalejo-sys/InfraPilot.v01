# ¿Cómo sacamos los productos de Delta para no escribirlos a mano desde cero?

- Fecha: 2026-11-03
- Para: Prommter · minimarket La Villa (y después, cualquier negocio con Delta)
- Sigue a: [Salida de datos de Delta](../2026-11-02-salida-de-datos-delta/INFORME.md)
- Estado: **terminada en lo que se podía hacer desde aquí.** Falta un archivo real
  de La Villa, y la herramienta que lo va a recibir ya está escrita y probada.

## Respuesta corta

1. **No hay que escribir nada a mano.** Hay cinco maneras de sacar el catálogo y
   cuatro de ellas no dependen de que Delta nos deje nada.
2. **La buena es el propio reporte de Delta.** Su módulo de Inventario tiene un
   `Reporte existencia de productos`, y su manual tiene un tutorial entero —de
   3 minutos y medio— que se llama **«Tipo de formatos para guardar reportes»**.
   Delta guarda reportes en varios formatos; cuáles exactamente, no lo publica.
3. **Y si solo saliera impreso, también sirve.** Un reporte impreso a PDF se lee
   igual: ya está hecho el lector. Lo único que no se puede leer es lo que no se
   puede imprimir, y eso no existe.
4. **Las ventas electrónicas son la segunda fuente, y es gratis.** Cada FPMV
   lleva adentro código, descripción, cantidad, **precio unitario** y tarifa de
   IVA. Un mes de ventas es el catálogo de todo lo que de verdad se mueve, más la
   rotación, sin pedirle permiso a nadie.
5. **Lo que NO sirve: las bases de códigos de barras de internet.** Se midió hoy
   con los 15 códigos reales leídos en las facturas de La Villa: solo **4**
   devolvieron un nombre utilizable. Sirve para ponerle foto bonita a la vitrina,
   no para armar el catálogo (§3).
6. **Ya está construido lo que recibe todo eso**: `herramientas/` en
   `la-villa-repo`, probado de punta a punta con los cinco formatos (§4). Lo que
   falta es un archivo de verdad, y eso es un [pedido de diez minutos](PEDIDO-EL-CATALOGO.md).

---

## 1. Delta sí deja sacar: lo dice su propio manual

Leído el 2026-11-03 en las dos páginas de tutoriales de `delta-ingenieria.net`.
Son videos de clic, sin voz, publicados por Delta. `citado · fuente primaria`

| Tutorial | Dura | Por qué importa |
|---|---|---|
| Inventario · **24 Reporte existencia de productos** | 2:10 | **Es el reporte que queremos**: el listado de productos con su existencia |
| Inventario · 25 Reporte productos no inventariados | 2:08 | Los que están creados y nunca se contaron. Dice el tamaño del desorden |
| Inventario · 26 Reporte comparativo inventario físico | 2:11 | Compara lo contado con lo que dice el sistema |
| Inventario · **27 Cómo realizar un inventario físico** | 6:18 | El más largo de los 26. Hay un procedimiento de conteo montado |
| Inventario · 18 Ajuste de valores por lista de precios | 1:52 | Existe el concepto de **lista de precios**, y se ajusta en bloque |
| Inventario · 23 Reporte listado de documentos | 2:19 | Las ventas del mes, documento por documento |
| Inventario · 17 Configuración de balanzas electrónicas | 0:55 | Una balanza se carga con un archivo de productos. Pista, no certeza |
| Contabilidad · **25 Tipo de formatos para guardar reportes** | 3:28 | Tres minutos y medio hablando de **formatos** para guardar. No es un botón: son varios |
| Contabilidad · 24 Visualización de reportes · 23 Funcionalidades menú reportes | 2:28 · 1:16 | Hay un visor de reportes con menú propio |
| Contabilidad · **2 Importación de plan de cuentas** | 2:46 | Delta también **importa** archivos. Hoy no nos sirve (es el plan de cuentas, no productos), pero prueba que el programa lee archivos de afuera |
| Inventario · 1 Crear Producto | 0:47 | Crear un producto se explica en 47 segundos. Hacerlo 800 veces es el problema que estamos evitando |

**Lo que esto prueba:** que el catálogo sale. **Lo que no prueba:** en qué
formatos exactamente. Esos tres minutos y medio del tutorial 25 contestan la
pregunta y no se pudieron ver —son videos sin voz y no hay transcripción—.
Se mira en el local en medio minuto. `HUECO 1`

## 2. Los cinco caminos

| # | De dónde | Qué entrega | Qué NO entrega | Costo | Riesgo |
|---|---|---|---|---|---|
| **1** | **Reporte de existencias de Delta**, guardado en Excel/CSV/texto | código, descripción, unidad, existencia, último precio de compra, precio con IVA, tarifa | rotación | diez minutos del cajero | ninguno: no se toca nada |
| **2** | **El mismo reporte, impreso a PDF** | lo mismo | lo mismo | lo mismo | ninguno |
| **3** | **Los XML de las ventas (FPMV)** de un mes | código, descripción, cantidad vendida, **precio unitario**, tarifa, y `ProviderID` | costo y existencia; y solo lo que se vendió | ninguno: es dato del contribuyente | ninguno |
| **4** | **Las facturas de compra recibidas** en el portal de la DIAN | código del proveedor, descripción, **costo**, IVA descontable, quién se lo vende | solo los proveedores que facturan electrónicamente | ninguno | ninguno |
| **5** | **La base de datos de Delta** en el computador del local | todo, incluido el kárdex | — | hay que saber el motor | **el más alto**: nos ata a su versión y se puede leer como pasar por encima del proveedor |

**La recomendación: 1 (o 2) + 3, y 4 para el costo.** El 5 no se toca todavía, y
cuando se toque será **sobre una copia**, nunca sobre el archivo vivo, nunca con
la caja abierta y con permiso escrito del dueño. Lo primero que hay que hacer
con el 5 no es leerlo: es **mirar qué extensiones tiene la carpeta de Delta**,
porque eso solo dice qué motor es, y no toca nada.

**Y una cosa que hay que hacer de todas formas:** el camino 1 trae la existencia,
y la existencia de Delta **no se puede creer** —en las fotos del POS se leen −20,
−133 y −474—. Así que la importación no termina en el archivo: termina con un
**conteo físico**, que Delta además ya sabe hacer (tutoriales 25, 26 y 27). El
catálogo lo pone el archivo; el número de cada estante lo pone el conteo.

## 3. Las bases de códigos de barras de internet: medido, no supuesto

Se tomaron los **15 códigos EAN reales** leídos en las facturas de La Villa y se
consultaron contra Open Food Facts, la base abierta de productos. Resultado:

| | |
|---|---|
| Devolvieron nombre y marca utilizables | **4** — Head & Shoulders 375 ml, Ducales 120 g, Leche Alquería, Arroz Florhuila 500 g |
| Respondieron pero sin nombre | 2 |
| No existen en la base | 9 |

**27 % de aciertos.** Y de precio, costo, IVA o existencia: nada, nunca — esas
bases no tienen precios colombianos. Conclusión: sirve para **la foto y el nombre
bonito de la vitrina pública**, que es lo que el dueño va a querer después. Como
fuente del catálogo, no.

## 4. Lo que ya quedó construido

En `prommter/la-villa-repo/herramientas/`:

- **`importar-catalogo.mjs`** — recibe lo que sea y saca el catálogo del sistema
  más un **informe de importación**. Entiende Excel `.xlsx` (sin instalar nada:
  lo abre con el `unzip` del sistema), CSV, TSV, texto de ancho fijo y una
  carpeta de XML de factura electrónica. Mezcla varias fuentes por código: el
  reporte pone el costo y la existencia, los XML ponen la rotación y los precios
  distintos.
- **`leer-pdf.swift`** — saca la tabla de un PDF con el PDFKit que ya trae la Mac
  (aquí no hay `pdftotext`). Con `--tsv` no reconstruye la página letra por
  letra: agrupa las letras en celdas y las celdas en columnas por su posición,
  que es lo único que aguanta que los números vayan pegados a la derecha.

**Probado de punta a punta** con los cinco caminos de entrada, incluida la cadena
completa `PDF → TSV → catálogo` con todos los campos correctos. Los archivos de
prueba están en `herramientas/ejemplos/` y **están marcados como inventados**:
lo único real en ellos son los códigos, los nombres y los números leídos en las
fotos del POS.

Tres cosas que hace el informe de importación y que valen más que el catálogo:

1. Dice **qué tan completo quedó** campo por campo, en porcentaje. Si el 40 % no
   tiene costo, se ve antes de construir nada encima.
2. Saca aparte **la existencia negativa**, **el mismo producto con dos precios**,
   **lo que se vende por debajo del costo** y **las tarifas de IVA que no existen
   en Colombia**. Son las grietas de Delta, convertidas en una lista de trabajo.
3. Deja escrito que **la base y el impuesto son calculados**, no leídos: Delta
   guarda el precio con el IVA adentro, se parte una sola vez en la importación y
   queda guardado como cifra. El sistema nunca vuelve a dividir entre 1,19.

## 5. Lo que falta, y es de diez minutos

Está en [`PEDIDO-EL-CATALOGO.md`](PEDIDO-EL-CATALOGO.md): el reporte de
existencias guardado como salga, y —si aparecen— tres XML de factura. Con eso la
importación deja de ser un plan y pasa a ser un archivo.

Y el **cómo**, para hacerlo sentado en la caja —qué menú buscar, qué filtro NO
dejar puesto, qué formato elegir, y qué hacer cuando el botón de guardar no
existe— está en [`COMO-SACARLO-PASO-A-PASO.md`](COMO-SACARLO-PASO-A-PASO.md).
Los nombres exactos de los menús siguen siendo el `HUECO 1`: la guía dice **qué
buscar**, no finge saber dónde está el píxel.

**Hasta que ese archivo no llegue, no se le promete a ningún cliente que le
migramos el catálogo.** Se le dice lo que es verdad: que está hecha la máquina y
que falta meterle el primer papel.

## Lo que no se pudo confirmar

1. **En qué formatos guarda Delta un reporte.** Lo contesta el tutorial 25 de
   Contabilidad, que son videos sin voz; y lo contesta mejor la pantalla, en el
   local, en medio minuto.
2. **Si el reporte de existencias trae el precio y el costo**, o solo la
   existencia. Si solo trae la existencia, hay que sacar además la lista de
   precios (tutorial 18).
3. **Cuántos productos tiene La Villa en el catálogo.** Sin eso no se sabe si
   esto ahorra dos días o dos semanas. El reporte 25, «productos no
   inventariados», lo dice de paso.
4. **Si el procedimiento de inventario físico de Delta imprime una hoja de
   conteo** con todos los productos. Es lo normal en un programa así, pero es una
   deducción, no un dato.
5. **Dónde guarda Delta los XML** de la factura electrónica, o si los guarda.
   Viene de la investigación del 2-nov y sigue abierto.
6. **Con qué base de datos trabaja Delta.** Se resuelve mirando las extensiones
   de la carpeta, sin abrir nada.
