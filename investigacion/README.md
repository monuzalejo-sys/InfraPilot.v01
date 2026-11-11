# Investigación

Aquí se guarda **toda** investigación que hagamos: mercado, competencia, precios,
herramientas, leyes, proveedores, ideas de negocio. Nada se queda solo en el chat.

## Cómo se guarda

Una carpeta por investigación, con la fecha delante para que se ordenen solas:

```
investigacion/
  2026-10-18-tema-corto/
    INFORME.md      ← la conclusión arriba, luego el detalle
    fuentes.md      ← enlaces y de dónde salió cada dato
    (adjuntos: capturas, PDF, tablas .csv)
```

El `INFORME.md` empieza siempre así:

```
# <Pregunta que se investigó>

- Fecha: AAAA-MM-DD
- Para: <empresa o proyecto: Prommter, Duo Burguer, Mercaplaza, …>
- Estado: en curso | terminada

## Respuesta corta
<lo que hay que saber en 3–5 líneas>

## Detalle
...

## Lo que no se pudo confirmar
<huecos: lo que no tiene fuente se dice, no se inventa>
```

## Índice

Cada investigación nueva se apunta aquí, la más reciente arriba.

- **2026-11-11 · [¿Podemos emitir nosotros la factura electrónica?](2026-11-11-emitir-nosotros-la-factura-electronica/INFORME.md)** — sí, por dos caminos: proveedor tecnológico por API (semanas) o software propio habilitado (meses). Lo que lo frena no es la ley sino dónde corre el programa: firmar exige una llave privada y eso no vive en un HTML del navegador, así que **la factura electrónica obliga a construir el sistema de producción**. Delta y nosotros pueden convivir con prefijos distintos. $17–$50 por documento, con pruebas gratis. Para Prommter · La Villa.
- **2026-11-03 · [Sacar los productos de Delta](2026-11-03-sacar-los-productos-de-delta/INFORME.md)** — cinco caminos para no reescribir el catálogo a mano; el bueno es el propio «Reporte existencia de productos» de Delta, y si solo sale impreso también se lee. Las bases de códigos de barras de internet: medidas, 4 de 15. La herramienta que lo recibe ya está hecha y probada en `la-villa-repo/herramientas`, y el [paso a paso para sacarlo en la caja](2026-11-03-sacar-los-productos-de-delta/COMO-SACARLO-PASO-A-PASO.md) está escrito. Para Prommter · La Villa.
- **2026-11-02 · [Qué tiene Delta y por qué lo eligen](2026-11-02-que-tiene-delta-y-por-que-lo-eligen/INFORME.md)** — pago único, sin internet y, sobre todo, es el programa del contador (100 empresas por licencia; ACOPI lo exige en un aviso de oct-2026). Se van cuando quieren ver el negocio a distancia: el rival del piso de arriba es la migración a Siigo Nube, no Delta. Con 12 alternativas y sus precios. Para Prommter.
- **2026-11-02 · [Salida de datos de Delta](2026-11-02-salida-de-datos-delta/INFORME.md)** — en curso. Delta no es proveedor tecnológico DIAN; el XML trae el detalle por producto y el precio unitario, pero la DIAN no lo da en lote; ajustes por inflación eliminados en 2007. Lo demás, en el [pedido a La Villa](2026-11-02-salida-de-datos-delta/PEDIDO-LA-VILLA.md). Para Prommter.
- **2026-11-02 · [Delta en el Cauca](2026-11-02-delta-cauca/INFORME.md)** — qué es el software que se usa en Popayán, sus ocho grietas con evidencia, y por qué la jugada es el *piso de arriba* de Delta y no reemplazarlo. Para Prommter.

| Fecha | Tema | Para | Estado |
|-------|------|------|--------|
| 2026-10-28 | [Qué declara a la DIAN un minimarket y cuál es la forma más eficiente](2026-10-28-dian-minimarket/INFORME.md) | Prommter · minimarket La Villa | terminada |
