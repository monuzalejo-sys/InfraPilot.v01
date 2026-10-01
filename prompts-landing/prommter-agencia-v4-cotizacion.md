═══════════════════════════════════════════════════════════════════════════════
ENCARGO v4: LANDING DE PROMMTER · PRECIO VISIBLE, COTIZADOR Y SECTORES
Destinatario: quien YA tiene construida la landing de Prommter con
`prommter-agencia-v2.md` (contenido) y `prommter-agencia-v3-mejora.md` (oficio).
Entregable: EL MISMO `index.html`, con las secciones de este encargo añadidas o
cambiadas y rotuladas, más el reporte de medición del §6.
Pieza de referencia YA CONSTRUIDA Y PROBADA: `prommter-agencia-v4-cotizacion.html`,
en esta misma carpeta. No se diseña desde cero: se porta.
Fecha: 2026-09-24. Origen: el dueño, textual:
   «quiero que tengamos el prommter principal de cotizacion y muestre lo que es
   la empresa, cuanto cuesta y demas, el fin es que podamos organizar la empresa
   en sectores que requieran estar a parte»
No sustituye al v2 ni al v3: los dos siguen vigentes en todo lo que este
archivo no descongela de forma expresa en el §2.
═══════════════════════════════════════════════════════════════════════════════

╔═════════════════════════════════════════════════════════════════════════════╗
║ 0 · ANTES DE TOCAR NADA                                                     ║
╚═════════════════════════════════════════════════════════════════════════════╝
 0.1 Lee la ARMADURA del v3 (§0, órdenes 0.1 a 0.10). Rige íntegra y no se copia
     aquí para que no se desincronice. Sigue en pie 0.9 «NO REHACER» y 0.10: si no
     encuentras el entregable construido, PARA y pídelo. Escribir un
     `index.html` nuevo es el peor fallo posible.
     Para encontrarlo: el v2 §7 lo mandaba a `prommter/web/index.html` del PC, y
     el v3 §2.A verificó el 2026-08-29 que esa carpeta no existía. Localízalo
     como dice el v3 §2.A.
 0.2 Abre `prommter-agencia-v4-cotizacion.html` en un navegador y úsalo como
     referencia. Sus tokens son la copia exacta del §5.B del v2 y su tipografía es
     el `<link>` literal del §5.C. No trae ni un color nuevo.
 0.3 La franja ámbar de arriba («Vista previa…», clase `.solo-vista-previa`) y la
     barra superior de la pieza NO se portan: la landing ya tiene las suyas.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 1 · QUÉ CAMBIÓ EN EL NEGOCIO (por eso existe este encargo)                  ║
╚═════════════════════════════════════════════════════════════════════════════╝
 1.A HAY CONTRATO Y HAY PRECIO. Desde el 2026-09-10 existe el contrato de servicio
     integral v1 (en la Mac: `prommter/documentos/contratos/contrato-servicio-integral-v1.md`).
     Fija UNA oferta:
      · sistema + vitrina + marketing, que se contratan juntos y no por separado (:91);
      · $1.000.000 al mes (:48);
      · el mes 1 es gratis: es el mes de cortesía y puesta en marcha (:49);
      · 12 meses, 11 mensualidades, total $11.000.000, precio congelado 12 meses (:50-51, :95);
      · sin cobro de arranque;
      · la pauta la paga el cliente aparte (:105);
      · los pedidos por la vitrina entran sin comisión (:548);
      · el acta de entrada en operación se firma a más tardar el día 30; si
        Prommter se demora por causa suya, el cliente no paga; si la demora pasa de
        60 días, el cliente se retira sin deber nada (:95);
      · los datos, la marca y el dominio son del cliente; a la salida se le entregan
        sus datos en CSV o JSON en 10 días hábiles (:103, :107).
 1.B EL DUEÑO DECIDIÓ MOSTRAR EL PRECIO (2026-09-24). Eso cierra el hueco H-6 del
     v2: `CONFIG.mostrarPrecios` pasa a `true`, pero con la cifra del CONTRATO, no con
     los rangos de `precios-v2.html`. Los tres niveles con rangos siguen siendo
     documento interno («no compartir con clientes») y no se publican.
 1.C PROMMTER SE ORGANIZA POR SECTORES. La principal (esta landing) cotiza y vende
     el servicio integral. Prommter Domicilios (una red abierta de domiciliarios
     independientes) y Prommter Referidos (personas que recomiendan y ganan solo
     por venta) van APARTE y todavía no existen. En la landing aparecen SOLO como
     «Abre muy pronto»: sin enlace, sin formulario y sin promesa de fecha.
     Es el patrón que el dueño celebró en Duo Burguer: lo que falta se anuncia con
     gracia, no se esconde ni se finge.
     Ojo: «independientes» es palabra obligatoria. Domicilios no se vende dentro
     del contrato integral, por su cláusula 19.5.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 2 · LO QUE ESTE ENCARGO DESCONGELA (y nada más)                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
 D-1 `CONFIG`: `mostrarPrecios: true`, `permanenciaMeses: 12` (cierra H-7) y las
     claves nuevas del §4. Las demás claves del v2 quedan como estén.
 D-2 S6 «Cómo se cobra, y qué compra la mensualidad»: recibe las cifras reales. Es
     el bloque S-A de la pieza (precio grande en ámbar sobre noche y los tres hechos
     Mes 1 / Meses 2 a 12 / Total del año) más la franja «Qué compra la
     mensualidad» de S-B. El copy de las cuatro razones sale textual del contrato
     (:93).
 D-3 S7 «Los tres niveles» DEJA DE SER TRES NIVELES. Pasa a ser «Lo que recibe por
     ese precio», con las tres tarjetas Sistema / Vitrina / Marketing de S-B, más
     una línea al pie: «¿Necesita algo más grande? Se cotiza con sus números.»
     Razón: el contrato dice que los tres servicios van juntos. Tres niveles con
     precio contradicen el documento que el cliente va a firmar.
     El selector I4 (nivel → demo) se reconecta: cada tarjeta Sistema / Vitrina /
     Marketing pone la demo de S4 en su vista correspondiente. Si S4 no tiene vista
     de marketing, esa tarjeta no dispara nada. No se inventa una vista.
 D-4 NUEVA sección «Cotice en un minuto» (S-C de la pieza), justo después de D-3.
 D-5 NUEVA sección «Lo que es suyo / Lo que no entra» (S-D de la pieza). Si S8 «Lo
     que se cobra aparte» ya dice lo mismo, S8 se REEMPLAZA por S-D, no se duplica.
 D-6 S9 «Cómo empezamos»: sus pasos se cambian por los cuatro de S-E, que ya traen
     el mes de cortesía y el acta del día 30. Esto cierra H-8 en lo que el contrato
     dice. Los plazos por nivel dejan de existir, porque ya no hay niveles.
 D-7 NUEVA sección «Prommter por sectores: Una casa, tres puertas» (S-F de la pieza),
     antes del pie.
 Todo lo demás del v2 y del v3 sigue CONGELADO: héroe, carrusel, S2, S3, S4, S5,
 tokens, tipografías, movimiento y prohibiciones.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 3 · CÓMO SE PORTA EL COTIZADOR                                              ║
╚═════════════════════════════════════════════════════════════════════════════╝
 3.1 UN SOLO ESTADO. La calculadora de S2 y el paso 3 del cotizador preguntan lo
     mismo: pedidos al mes y valor del pedido. Comparten la misma variable. Lo que
     el visitante movió en S2 llega puesto en el paso 3, y al revés. Prohibido que
     la página tenga dos cifras distintas de «lo que le deja a las aplicaciones».
 3.2 EL MENSAJE DE WHATSAPP ES UNO SOLO. El de la pieza (función `mensaje`) incluye:
     tipo de negocio, sedes, pedidos y ticket, domicilios, referidos y el precio
     visto. Reemplaza al mensaje precargado del v2 §2 en TODOS los botones de la
     página, para que al dueño le llegue siempre la conversación completa.
 3.3 CON `CONFIG.whatsapp = null` NINGÚN botón lleva a `wa.me`. El recibo muestra
     «El WhatsApp de Prommter se publica muy pronto», con el mensaje a la vista. La
     barra fija de WhatsApp del móvil (I5 del v2) se oculta mientras sea null, y en
     su lugar va el resumen «Su mensualidad $1.000.000 · Ver cotización» de la
     pieza. No se usa ningún número de muestra: el `573001234567` del v2 puede ser
     el número real de alguien.
 3.4 El recibo es un objeto claro sobre la banda oscura (tarjeta + `--sombra` +
     `--sombra-dura`). En escritorio es fijo al hacer scroll (sticky); en móvil va
     debajo de las preguntas.
 3.5 Las funciones `calcular`, `mensaje` y `pintar` se portan tal cual. Si la
     landing ya tiene su propio `CONFIG`, las claves nuevas se FUSIONAN en ese
     objeto: no se crea un segundo `CONFIG`.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 4 · CONFIG NUEVO (cada clave con su fuente; null = hueco del dueño)         ║
╚═════════════════════════════════════════════════════════════════════════════╝
  mensualidad: 1000000,      // contrato :48
  mesesContrato: 12,         // contrato :95
  mesesGratis: 1,            // contrato :49
  iva: null,                 // contrato :53 → true (+19 %) | false (valor final) | null («se confirma»)
  sedesIncluidas: null,      // anexo A.5 :583 → null = 1 incluida, las demás «se cotizan»
  valorSedeAdicional: null,  // anexo A.5 :585 → pesos al mes por cada sede adicional
  comision: [0.20, 0.30],    // orion/cerebro/temas/cobro-a-clientes.md:66
  ejemplo: { pedidos: 60, ticket: 30000 }   // cobro-a-clientes.md:68
  whatsapp: null             // H-1, ya existía: sigue BLOQUEANDO la publicación

╔═════════════════════════════════════════════════════════════════════════════╗
║ 5 · HUECOS DEL DUEÑO (bloquean publicar, no construir)                      ║
╚═════════════════════════════════════════════════════════════════════════════╝
 H-1  WhatsApp de Prommter. Sin él no se publica.
 H-13 ¿Prommter es responsable de IVA? (contrato :53) → `CONFIG.iva`.
 H-14 ¿Cuántas sedes y usuarios entran en la mensualidad y cuánto vale una sede
      adicional? (anexo A.5) → `CONFIG.sedesIncluidas` y `CONFIG.valorSedeAdicional`.
 H-15 ¿El dominio va incluido o a cargo del cliente? (contrato :58). Hoy la página
      solo dice que el dominio es del cliente, que es cierto en los dos casos.
 H-2  Ciudad: sigue como estaba en el v2.
 H-5  Permiso para nombrar clientes: sigue como estaba en el v2.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 6 · CRITERIOS DE ACEPTACIÓN (se miden y se reportan con número)             ║
╚═════════════════════════════════════════════════════════════════════════════╝
 A1 60 pedidos × $30.000 → el recibo dice «$360.000 a $540.000» al mes y «entre
    $4.320.000 y $6.480.000 al año». 120 × $25.000 → «$600.000 a $900.000».
 A2 Tres sedes con `sedesIncluidas: null` → «1 incluida; 2 adicionales se cotizan
    con usted» y la nota «Más las sedes adicionales, que se cotizan con usted».
 A3 Con `iva: true`, `sedesIncluidas: 1`, `valorSedeAdicional: 150000` y tres sedes
    → $1.300.000 al mes, IVA «+ 19 % ($247.000 al mes)», total «$14.300.000 + IVA».
    Con `iva: false` → «no aplica: el valor es final» y $14.300.000.
 A4 Con `whatsapp: null`, `document.querySelectorAll('a[href*="wa.me"]').length === 0`.
 A5 A 390×844: `document.documentElement.scrollWidth === 390` y ningún elemento
    sobresale por la derecha. A 1280×800: el recibo es sticky.
 A6 Búsqueda de texto sobre el HTML final, con CERO apariciones: «pago único»,
    «un solo pago», «sin mensualidad», «licencia de por vida» (regla KN-003).
 A7 Cero apariciones de rangos de precio de niveles (400.000, 1.500.000, 4.000.000,
    etc.) y de las palabras «Presencia» y «Automatización» con precio.
 A8 Domicilios y Referidos aparecen solo con la píldora «Abre muy pronto»: sin
    `<a>`, sin `<form>` y sin fecha.
 A9 Contrastes del v2 §5.D: ámbar solo sobre noche; la cifra de la fuga en teja
    sobre claro; `--wa` solo en el botón de WhatsApp.
 A10 Con JavaScript apagado, el precio y todas las secciones se ven: nada queda en
    `opacity:0`. La pieza lo resuelve con la clase `.js` en `<html>`.
 A11 Consola sin errores. Capturas antes y después a 390×844 y 1280×800 de D-2, D-3,
    D-4 y D-7.
 La pieza de referencia pasó A1, A2, A3, A5, A10 y A11 en la Mac el 2026-09-24
 (Chrome del panel de Claude, emulando 390×844 y 1280×800).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 7 · LO QUE NO SE HACE                                                       ║
╚═════════════════════════════════════════════════════════════════════════════╝
 · No se rehace la landing, ni se reescribe el copy de lo congelado.
 · No se publica mientras H-1 siga vacío.
 · No se nombra a ningún cliente sin su casilla de portafolio marcada (contrato
   :77-83).
 · No se añaden formularios, correo ni «llámanos»: la única acción sigue siendo
   WhatsApp.
 · No se da fecha de apertura de Domicilios ni de Referidos.
 · No se explica la ley de repartidores en la landing: eso vive en el diseño
   interno del sector, no en la portada.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 8 · DESPUÉS DE MONTARLO                                                     ║
╚═════════════════════════════════════════════════════════════════════════════╝
 `prommter.com` existe y está estacionado en Hostinger (`dig` del 2026-09-24: NS
 solar/lunar.dns-parking.com, A 2.57.91.91). Los registros para apuntarlo a donde
 viva la landing los crea el PC, que es el que entra a Hostinger. Se comprueba con
 `dig` y `curl` antes de dar el enlace por publicado.
 Los sectores apartes usarán `domicilios.prommter.com` y `referidos.prommter.com`
 cuando existan. Hoy no se crea ningún registro para ellos.
