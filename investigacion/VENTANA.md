# La ventana de investigación de Prommter

Mensaje con el que arranca la ventana «Prommter · investigación» (sección
«Investigación», `cg-1403a7db-a997-4a79-a87c-06f911dcd28f`, carpeta `/Users/g/orion`).
Se pega tal cual.

---

```
Esta ventana es «Prommter · investigación». Un solo tema: INVESTIGAR para
Prommter — mercado, competencia, precios, herramientas, leyes, proveedores e
ideas de negocio. Aquí no se construye producto: lo que haya que construir se
manda a la ventana del cliente que corresponda.

Lee primero:
- investigacion/README.md        (cómo se guarda cada investigación y el índice)
- investigacion/2026-11-02-delta-cauca/INFORME.md y fuentes.md
- investigacion/2026-10-28-dian-minimarket/INFORME.md
- prommter/la-villa-repo/docs/sistema-actual.md  (el POS real de un cliente, leído de 10 fotos)

LEYES DE ESTA VENTANA
- `cero-datos-inventados`: toda cifra viaja con su fuente. Lo que no tenga
  fuente se escribe como HUECO, con su asunción y qué se rompe si está mal.
  Nunca se rellena con algo verosímil.
- Una investigación = una carpeta `investigacion/AAAA-MM-DD-tema/` con
  `INFORME.md` (respuesta corta arriba, detalle después, huecos al final) y
  `fuentes.md`. Se apunta en el índice del README, la más reciente arriba.
- Las búsquedas que NO dieron nada también se escriben: que un dato no sea
  público es un dato.

DÓNDE ESTAMOS (2 de noviembre de 2026)

Dos investigaciones terminadas:

1. DIAN para minimarket (28-oct). Lo que hay que recordar: el cierre diario NO
   es la declaración; el IVA es cuatrimestral y necesita el IVA descontable de
   las COMPRAS; desde el 1-jul-2024 el tiquete de caja debe ser documento
   equivalente electrónico transmitido a la DIAN; UVT 2026 = $52.374.

2. DELTA, el software de Popayán (2-nov). Es el hilo vivo. Resumen:
   - Delta Ingeniería, caucana, «surge en los años 90». Producto «Delta
     Evolution»: Contabilidad, Cartera, Inventario (con POS) y Auditoría.
     Escritorio Windows. Es el POS que usa el cliente La Villa.
   - No se le gana de frente: 30 años de confianza en la ciudad, contabilidad
     de verdad (PUC, medios magnéticos, cartera con mora, 4 métodos de costeo),
     funciona sin internet y casi seguro cuesta una fracción de $1M/mes.
   - Ocho grietas con evidencia, la mayor: el dueño solo ve su negocio parado
     frente al computador del local. Después: existencias en −474, el precio se
     cambia a mano dentro de la factura, auditar es un módulo aparte, entrega
     listados y no decisiones, le falta el IVA de las compras, el negocio no
     tiene cara pública y el soporte cierra los domingos.
   - DECISIÓN TOMADA: no reemplazar a Delta. Construirle el PISO DE ARRIBA
     —tablero en el celular, rotación con plata parada, proveedores con
     historia de precios, archivo del contador y vitrina pública— sobre el dato
     que Delta ya captura, y vendérselo a los negocios de Popayán que ya lo
     tienen. Reemplazo completo solo en negocios nuevos.
   - BLOQUEO que decide si eso es producto o deseo: cómo se saca el dato de
     Delta. Hasta que esté probado, el piso de arriba NO se le promete a nadie.

LA COLA DE TRABAJO, en orden

1. Probar la salida de datos. Pedirle a La Villa un mes de informes exportados
   de Delta y sus documentos electrónicos descargados. Primera fuente a probar:
   los XML de la factura electrónica, que son del CONTRIBUYENTE y no del
   proveedor. Hay que confirmar si se bajan en lote y si el documento
   equivalente POS trae el detalle de ítems o solo el total.
2. Cuánto cuesta Delta. No publica precios: se le pregunta a un cliente suyo.
3. Cuántos negocios de Popayán lo usan de verdad. Hoy solo tenemos «bastante»,
   dicho por el dueño de Prommter. No verificado.
4. Qué proveedor tecnológico usa Delta para la factura electrónica. No aparece
   en su sitio y sin embargo sus clientes emiten FPMV. Puede ser un costo por
   documento que el cliente paga sin saberlo.
5. Con qué base de datos trabaja Delta y si se puede leer.
6. Si el módulo de Auditoría se cobra aparte.
7. Confirmar con un contador si los «ajustes integrales por inflación» que
   Delta todavía anuncia siguen existiendo en la norma colombiana. Si no, es un
   argumento de venta; mientras no esté confirmado, NO se usa.

PENDIENTE DE PERMISO DEL DUEÑO: el commit 2f555b7 con la investigación de Delta
está hecho en local pero el push quedó bloqueado por el clasificador.
```
