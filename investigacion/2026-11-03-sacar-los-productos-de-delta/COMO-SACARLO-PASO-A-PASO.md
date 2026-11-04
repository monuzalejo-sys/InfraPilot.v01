# Cómo sacarlo del sistema, paso a paso

Para La Villa. Esto es para hacerlo **sentado en el computador de la caja**, con
Delta abierto. Son diez minutos.

Lo hace el dueño o el cajero, con su propio usuario. Nosotros miramos y anotamos.
**Nunca entramos con su clave.**

> **Aviso honesto antes de empezar:** los nombres exactos de los menús de Delta no
> los tengo — su manual no los publica en texto. Lo que está escrito abajo es
> **qué buscar**, no dónde está el píxel. Quien lo use medio minuto lo encuentra.
> Si el menú se llama distinto, se anota cómo se llama: eso es lo que convierte
> este papel en un procedimiento que sirve para el próximo cliente con Delta.

---

## Paso 0 — El momento

**Con la caja cerrada**, al terminar el día, o en un rato sin gente. No porque sea
peligroso —no se cambia nada— sino porque un reporte de todos los productos tarda
y no vale la pena tener a alguien esperando para pagar.

Reglas de la visita: **no se instala nada, no se cambia ninguna configuración, no
se borra nada.** Solo se saca un reporte y se copia un archivo.

## Paso 1 — El listado de productos (esto es el 90 % del trabajo)

1. Entrar al módulo **Inventario**.
2. Buscar el menú de **reportes** y, dentro, **«Existencia de productos»**.
   (En el manual de Delta es el tutorial 24 de Inventario, dura 2:10.)
3. Cuando pida los filtros: **que no filtre nada.**
   - todas las bodegas, todos los grupos, todas las marcas;
   - **incluidos los que tienen cero y los que están en negativo.**

   > Este es el error que se comete siempre: se deja un filtro puesto y el reporte
   > trae la mitad del negocio. Si hay una casilla que diga «solo con existencia»,
   > **hay que destildarla.**
4. Sacarlo a pantalla. Si Delta pregunta si lo quiere **detallado o resumido**:
   detallado.
5. Ahora el botón que importa: **Guardar**, **Exportar**, o el ícono del diskette,
   arriba en la barra del visor de reportes.

### Y aquí está el único favor que le pido

**Antes de elegir el formato, una foto de esa lista de formatos.**

Medio segundo de foto. Esa pantalla es la respuesta a la única pregunta que no
pude contestar desde aquí, y contestarla sirve para este negocio y para todos los
que vengan con Delta. (Delta le dedica un tutorial entero de **3:28** a los
formatos para guardar reportes — así que son varios.)

### Qué formato elegir, en este orden

| | Formato | Por qué |
|---|---|---|
| 1.º | **Excel** (`.xlsx` o `.xls`) | lo mejor: las columnas vienen separadas de verdad |
| 2.º | **CSV** o **texto separado** | igual de bueno |
| 3.º | **Texto** (`.txt`, `.prn`) | sirve: el programa reconoce las columnas por posición |
| 4.º | **PDF** | sirve también, pero es el que más trabajo da |

**Cualquiera de los cuatro sirve.** No hay que buscar el mejor: hay que traer uno.

## Paso 2 — Si no hay botón de guardar: se imprime

1. **Imprimir**, y en la lista de impresoras elegir **«Microsoft Print to PDF»**
   (Windows lo trae de fábrica desde Windows 10). Queda un PDF en el computador.
2. Si esa impresora no aparece, **anótelo** y dígamelo: cambia el plan.
3. Último recurso, y funciona: **fotos de la pantalla**, pantalla por pantalla,
   con el listado ordenado por código y sin repetir ni saltarse ninguna. Es lento
   y hay que revisar a mano, pero de ahí también sale el catálogo.

## Paso 3 — Si el reporte no trae precio ni costo

Pasa. Algunos reportes de existencia traen solo la cantidad. Entonces, además:

- la **lista de precios** (en Delta existe el concepto: hay un tutorial de
  «ajuste de valores por lista de precios»);
- el reporte de **productos no inventariados** — y ese, de paso, me dice
  **cuántos productos hay en total**, que es el número que no tengo.

## Paso 4 — Tres facturas electrónicas (XML)

Hay dos maneras y la segunda no toca el computador de Delta.

**A. En el computador:**
1. Preguntar al cajero: «¿dónde quedan los XML de la factura electrónica?».
2. Si nadie sabe: en el Explorador de Windows, en **«Este equipo»**, buscar
   `*.xml` y ordenar por fecha, de más nuevo a más viejo. Suelen estar en una
   subcarpeta de Delta llamada algo como `XML`, `FE` o `Facturas`.
3. **Copiar tres**, de días distintos. No todos — tres.
4. Si Delta **no los guarda**, anótelo. Eso también es una respuesta.

**B. En el portal de la DIAN** (`catalogo-vpfe.dian.gov.co`), **con su usuario**:
→ documentos **emitidos** → descargar. Ahí están los XML de todas sus ventas
electrónicas, sin pedirle nada a nadie. Y de paso, los **recibidos**: las
facturas de sus proveedores, que son las que traen **el costo**.

> Esto lo hace él, con su clave, en su pantalla. Nosotros no entramos a la DIAN
> con la clave de nadie.

## Paso 5 — Una foto de la carpeta de Delta

Clic derecho en el ícono de Delta → **«Abrir ubicación del archivo»**. Foto de esa
ventana, con la columna **«Tipo»** a la vista. **No abrir nada de ahí.**

Las extensiones de esos archivos dicen con qué base de datos trabaja Delta. Es
información para saber qué se puede y qué no — no vamos a tocar esa carpeta.

## Paso 6 — Cómo llega hasta acá

1. Mandarse el archivo **por WhatsApp a sí mismo**, o al correo de La Villa.
   - Si WhatsApp se niega a mandar un `.csv` o un `.txt` —pasa—, se mete en un
     `.zip` o se manda por correo.
2. En esta Mac, el archivo va a la carpeta:

   ```
   ~/Desktop/La Villa/Catálogo/entrada/
   ```

   Todo junto ahí: el reporte, los XML, lo que sea. **No hay que ordenarlo.**
3. Decirme «listo» y yo corro una sola línea:

   ```
   node herramientas/importar-catalogo.mjs "~/Desktop/La Villa/Catálogo/entrada"
   ```

   Sale el catálogo y sale el informe de qué tan completo quedó y qué hay que
   revisar.

---

## Lo que vuelve con el archivo (seis respuestas)

Anotadas en cualquier parte, incluso en un mensaje de voz:

1. **Qué formatos ofrecía** la pantalla de guardar. ← la importante
2. El reporte **¿traía precio? ¿traía costo?** Sí / no.
3. **¿Cuántos productos** tiene el catálogo?
4. **¿Dónde están los XML?** O si Delta no los guarda.
5. **¿Qué extensiones** tiene la carpeta de Delta?
6. **¿Apareció «Microsoft Print to PDF»?** Sí / no.

## Lo que NO hay que hacer

- **No instalar nada** en ese computador. Nada.
- **No copiar la base de datos de Delta.** Eso viene después, sobre una copia,
  con permiso escrito, y solo si hace falta. Hoy no hace falta.
- **No hacerlo con la caja vendiendo.**
- **No dejar filtros puestos** en el reporte (Paso 1.3).
- **No «limpiar» el archivo a mano antes de mandarlo.** Los negativos, los
  repetidos y los precios raros **son justamente lo que hay que ver**. Si se
  arreglan antes, se borra el diagnóstico. Que venga sucio.
