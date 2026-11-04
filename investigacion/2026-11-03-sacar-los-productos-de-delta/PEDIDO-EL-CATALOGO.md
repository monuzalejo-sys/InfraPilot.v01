# Lo que necesitamos para no escribir su catálogo a mano

Para La Villa. Son diez minutos en el computador de la caja. **No se instala nada
y no se cambia nada**: solo se guarda un reporte y se copia.

Lo hace el cajero o el dueño, con su propio usuario. Nosotros miramos y anotamos.

---

## 1. El listado de productos (esto es lo importante)

En Delta, módulo **Inventario** → el reporte **«Existencia de productos»**.

Cuando salga en pantalla, **guárdelo**. En el menú de guardar, Delta ofrece
varios formatos: **si está Excel, Excel; si no, el que sea** —CSV, texto, PDF—.
Cualquiera nos sirve.

> **Y anótenos qué opciones le ofreció esa pantalla.** Eso solo ya nos dice cómo
> hacerlo la próxima vez, en este negocio y en cualquier otro con Delta.

Si el reporte **no trae el precio ni el costo**, saque también:
- la **lista de precios** (Inventario → «Ajuste de valores por lista de precios»
  enseña dónde vive), y
- el reporte de **productos no inventariados**, que de paso nos dice cuántos
  productos hay en total.

## 2. Tres facturas electrónicas, si aparecen

Tres archivos **XML** de facturas FPMV —por ejemplo la 16277—. Hay que saber
dónde los deja Delta: se le pregunta al cajero, o a Delta directamente, «¿dónde
quedan los XML de la factura electrónica?».

Con **una sola** sabemos quién transmite sus facturas y si está pagando algo por
documento sin saberlo. Con un mes, sacamos cuánto se vende de cada cosa.

Si Delta **no los guarda**, anótelo: eso también es una respuesta.

## 3. Una foto de la carpeta de Delta

Sin abrir nada: solo la ventana del Explorador con la carpeta donde está
instalado Delta. Los nombres y las extensiones de los archivos nos dicen con qué
base de datos trabaja. **No vamos a tocar esa carpeta.**

---

## Lo que va a pasar después

Ese archivo entra en la máquina que ya está hecha y sale su catálogo completo, más
una lista de lo que hay que revisar: los productos con existencia imposible —en
sus facturas se leen −20, −133 y −474—, los que se vendieron a dos precios
distintos el mismo día, y los que están por debajo del costo.

Eso último no es un defecto de la importación: es lo que su sistema de hoy no le
está diciendo.

**Una advertencia honesta:** la existencia que traiga el archivo no se puede
creer, porque hoy está en negativo. El catálogo lo pone el archivo; el número de
cada estante lo tiene que poner un conteo. Es un día de trabajo y se hace una
sola vez.
