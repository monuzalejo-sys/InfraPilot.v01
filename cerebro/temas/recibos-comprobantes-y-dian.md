---
slug: recibos-comprobantes-y-dian
titulo: "Recibos, comprobantes y DIAN: qué se imprime, qué se guarda y qué NO se llama factura"
alias: [recibo, recibos, recibo de venta, factura, facturas, factura electronica, factura electrónica, tiquete, tiquete pos, tiquete de papel, comprobante, comprobantes, comprobante de pedido, mis comprobantes, codigo de retiro, código de retiro, reclamar el pedido, qr del pedido, termica, térmica, impresora termica, impresora térmica, rollo, papel termico, rollo de 58, 58 mm, 80 mm, 48 mm, ancho de impresion, ancho imprimible, recibo cortado, el recibo se corta, recibo se imprime mal, letras gruesas, letras delgadas, letra finita, banda negra, firma prommter, desarrollador de software, kiosk-printing, imprimir, resolucion dian, resolución dian, res dian, numeracion de facturas, rango de numeracion, factura vencida, factura impresa por computador, no responsable de iva, responsable de iva, iva, iva de compras, regimen simple, régimen simple, 3500 uvt, 183 millones, dian, declarar, declaracion, lo que se declara al final del dia, cierre del dia, informe para la dian, contador, quien responde por que, le prometi al cliente, promesa fiscal, pdf por cada venta, rearmar el recibo, cola de facturas, facturas de hoy]
preguntas: ["el recibo sale con la letra muy finita y casi no se lee, ¿cómo lo dejamos?", "¿por qué el recibo se corta a un lado cuando imprime?", "¿puedo imprimir la resolución que trae el recibo viejo?", "¿guardo un PDF por cada venta o solo los datos?", "el cliente quiere guardar su pedido para reclamarlo, ¿le damos una factura?", "le prometí al cliente que el sistema le deja listo lo de la DIAN al final del día, ¿qué reviso antes de cobrarle eso?", "¿el recibo del sistema es factura electrónica?"]
proyectos: [placita, mercaplaza, duo-burger, la-villa]
confianza: media
actualizado: 2026-11-02
---

# Recibos, comprobantes y DIAN: qué se imprime, qué se guarda y qué NO se llama factura

## Respuesta corta

1. **Un recibo no es una factura**: sin facturador electrónico habilitado, el papel dice «Recibo de venta» y **no imprime resolución DIAN** que no puedas confirmar real, vigente y de un tipo que aún exista.
2. Mide el ancho IMPRIMIBLE (58 mm imprimen ~48) y pruébalo impreso, no en pantalla.
3. Guarda los **HECHOS** de la venta y rearma el recibo cada vez, no un PDF por venta.
4. Si el dueño ya le prometió algo fiscal al cliente que no entiende, no lo construyas literal: investiga con fuentes y reescribe la promesa en lo cierto.

## Por qué (qué lo pagó)

- **31-ago/1-sep-2026, Placita.** El dueño rechazó el papel por «letras muy delgadas» (Courier
  de 10,5 px) y pidió algo llamativo con Prommter como desarrollador. Se rehízo todo en negrita
  a 12 px, nombre del negocio grande en mayúsculas, total sobre banda negra invertida y al pie
  «PROMMTER · DESARROLLO DE SOFTWARE», tanto en el recibo de caja como en la reimpresión. Se
  entregó con typecheck limpio, 711/711 tests y build, **pero sin verlo en papel** (no había
  térmica en la Mac): «la prueba de fuego es tu primera venta».
- **28-oct-2026, Mercaplaza.** El recibo se cortaba: se armaba a 80 mm y la impresora es de
  rollo de 58 mm que solo imprime 48 mm de ancho. La causa se confirmó con el driver viejo del
  POS; el arreglo se probó imprimiendo a PDF en papel de 48 mm, no en la impresora real.
- **Mismo día, la «Res.» del recibo viejo.** El recibo del POS anterior mostraba una resolución
  de julio de 2020, con un rango irreal (1 a 10 millones) y de un tipo de factura («impresa por
  computador») que la DIAN eliminó. Según la investigación de la sesión: las autorizaciones
  duran máximo 2 años (la de 2020 venció en 2022) y el número no tenía la forma de una real. El
  recibo nuevo se llama «Recibo de venta», dice «No responsable de IVA» y no imprime resolución.
  El dueño decidió «por ahora sin factura electrónica»; si vuelve el tema, primero se pregunta al
  contador si las ventas pasan de 3.500 UVT (≈ $183 millones al año con la UVT 2026 de $52.374),
  porque desde ahí el negocio está obligado a factura o POS electrónico.
- **28-oct-2026, guardar facturas.** En Mercaplaza cada factura quedó como unas pocas líneas en
  la base de datos, sin PDF ni imagen, y el recibo se vuelve a armar igual cada vez que se pide:
  no gasta espacio ni duplica la verdad.
- **23-oct-2026, Duo Burguer.** El dueño pidió «un tipo de factura» al hacer el pedido en línea,
  guardable para reclamar con un número. Se entregó un comprobante, no una factura.
- **28-oct-2026, La Villa.** El dueño admitió «aun no se como funciona especificamente lo de la
  dian, pero le dije que el va a tener separado» lo que se declara al final del día. La
  investigación halló que nadie declara a diario (IVA cada cuatro meses, anticipos del Régimen
  Simple cada dos); que el IVA es ventas menos compras y el plan no tenía las compras; que en
  Régimen Simple no se resta nada (1,2–5,6 % de lo vendido); y que el tiquete POS en papel venció
  el 1-jul-2024 (hoy se transmite). Después las capturas del cliente mostraron IVA 0/5/19 %,
  o sea responsable de IVA. La promesa no era mentira: estaba incompleta.

## Cómo se aplica

1. **Antes de diseñar el papel**, pregunta el ancho imprimible real (specs del fabricante, driver
   o prueba impresa), no el del rollo. Si no hay térmica a mano, di en la entrega que no se vio
   en papel y qué se probó en su lugar (PDF a 48 mm).
2. **Estilo de papel térmico:** negrita en todo, 12 px con fuente de trazo firme, negocio arriba
   en mayúsculas, total en banda negra, datos por jerarquía, firma de Prommter al pie (recibo y
   reimpresión). Vive en el CSS de impresión; en pantalla no cambia. La firma exacta es
   decisión de cada negocio.
3. **Resolución DIAN en el papel:** solo si el contador entrega una vigente de verdad, y entonces
   en un único campo de configuración (`EMISOR.resolucion`) del que sale el renglón. Si no se
   puede confirmar, no se imprime. Un número «de ejemplo» del programa viejo no se copia.
4. **Persistir:** los hechos en la base; el recibo es una vista que se arma bajo demanda.
   Congela en la venta lo que se cobró (nombre, precio, pagos) para que reimprimir no cambie el
   papel si luego sube el precio (ver [[TEMA-invariantes-contables]]). Reimpresiones con sello
   COPIA o ANULADA.
5. **Comprobante del pedido en línea:** número del pedido (se puede adivinar), **código de retiro
   de 4 caracteres (no se adivina)**, QR que la caja escanea, guardar como imagen, PDF tamaño
   recibo o compartir, y «Mis comprobantes» durante 30 días en el celular; la caja busca por
   número o por código. El pie dice que la factura la expide la DIAN. Di lo que no pudiste
   verificar (aquí: que el QR se escanee con un lector real).
6. **Promesa fiscal heredada:** (a) investiga con fuentes primarias (ver
   [[TEMA-fuente-primaria-y-normas]]); (b) reescribe la promesa en lo cierto; (c) escribe, antes de
   firmar y en la propia pantalla, quién responde de qué: **el sistema registra y transmite, el
   contador declara y firma, el dueño responde por el mostrador**; (d) registra las compras con
   su IVA: sin ellas el cierre exagera lo que se debe.

## Cuándo NO aplica

- **El papel automático por venta ya NO es la regla de Mercaplaza.** El 28-oct el dueño pidió
  «que se guarde la cola de facturas y que se imprima solo el que pida»: cobrar guarda y no
  imprime; el papel sale solo desde Opciones (Esc → U la última, F facturas de hoy;
  `placita/DEC-037`). Lo del estilo grueso sigue valiendo para cuando sí se imprime; lo de
  «imprimir cada venta» quedó superado (el `--kiosk-printing` que el 31-ago se añadió a los
  lanzadores de Edge, sin que se pidiera, pertenece a esa etapa: revisa si sigue haciendo falta).
  No reintroducir impresión automática ni topes de papel.
- **Contradicción documentada, no fusionada:** *guardar solo hechos* sirve para un recibo
  interno; si el documento es una **factura electrónica ya timbrada o enviada** hay que
  conservarlo TAL CUAL, no solo sus datos.
- **Negocio que ya factura electrónicamente con su POS** (La Villa con Delta: FPMV, 489
  documentos en 29 días): ahí el comprobante complementa y no reemplaza, y el trabajo es heredar
  su numeración, no empezar a facturar.
- **Cuando el contador del cliente ya fijó por escrito régimen, periodicidad e informe**: se
  construye a su medida y no se re-investiga.
- Las cifras (UVT, 3.500 UVT, vigencia de 2 años, tarifas del Régimen Simple) son de confianza
  **media**: salen de la investigación de la sesión, no de una consulta a la norma. Confírmalas
  con el contador. Esto no es asesoría tributaria.

## Evidencia

- «quiero letras un poco mas gruesas a la hora de imprimir son letras muy delgadas»; «que
  prommter quede ahi como desarollador de software»; «todo el papel va en bold a 12px»; «No
  tengo térmica aquí para ver el papel físico, así que la prueba de fuego es tu primera venta»
  — ventana [[2026-08-31-sincronizar-orion-y-proyectos-fork|Sincronizar Orion y proyectos (fork)]] (transcrito `630e0fde`, 2026-08-31 y 09-01).
- «el recibo se arma a 80 mm y la impresora es de rollo de 58 mm (imprime solo 48 mm de ancho)»
  y «La DIAN eliminó la factura impresa por computador» — ventana [[2026-10-15-mercaplaza-sistema|Mercaplaza: sistema]] (transcrito `1760cf3b`, 2026-10-28). También «por ahora sin
  factura electronica» (19:31).
- «cada factura queda como unas pocas líneas en la base de datos (productos, precios, pagos,
  quién y cuándo), sin PDF ni imagen. El recibo se vuelve a armar igualito cada vez que alguien
  lo pide» — misma ventana (transcrito `1760cf3b`, 2026-10-28 19:51).
- «quiero que hagas un tipo de factura cuando se haga el pedido, y que lo pueda guardar»; «El
  número se puede adivinar, el código no»; «no pude comprobar con un lector que se escanee bien»
  — ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `7f456016`, 2026-10-23).
- «aun no se como funciona especificamnte lo de la dian, pero le dije que el va a tener
  separado»; «Nadie declara diariamente. El IVA se declara cada cuatro meses»; «Eso no estaba en
  el plan y ya lo metí.» — ventana [[2026-09-09-la-villa-sistema|La Villa: sistema]] (transcrito `129e1026`, 2026-10-28).
- `placita/DEC-037` — papel a pedido: cobrar guarda la venta y el recibo sale solo si se pide.
- `investigacion/2026-10-28-dian-minimarket/` — la investigación del cierre y la DIAN para el
  minimarket (régimen, periodicidad, tiquete POS).

## Enlaces

- [[TEMA-fuente-primaria-y-normas]] — cómo se cita una norma y se rotula el nivel de la fuente.
- [[TEMA-invariantes-contables]] — congelar en el documento lo que se cobró; anular, no borrar.
- [[TEMA-donde-vive-el-dato]] — hechos persistidos, derivados rearmados.
- [[TEMA-aprendizajes-de-placita-mercaplaza]] — el POS de la frutería donde nacieron estas reglas.
- [[TEMA-cero-datos-inventados]] — un número de resolución que no puedes confirmar es un dato
  inventado.
