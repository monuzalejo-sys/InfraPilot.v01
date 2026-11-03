---
slug: pedidos-y-dinamicas-de-un-local
titulo: Pedidos, sorteos y redes de un local (Duo Burguer): QR por mesa, platos armables, Coljuegos y no manejar las redes del cliente
alias: [qr por mesa, qr de mesa, mesa 1, mesa 2, mesa-1, origen del pedido, punto qr, puntos qr, sin registro, sin cuenta, historial de pedidos, modificar pedido, pedido modificable, cinco minutos, 5 minutos, token de edicion, localstorage, datos personales, habeas data, autorizacion de datos, pedido directo, armar el desayuno, armable, arma tu hamburguesa, platos armables, desayuno a 6000, almuerzo a 12000, costeo, desglosar costes, margenes, insumos, recetas, precio de adicion, sorteo, sorteos, rifa, rifas, coljuegos, permiso de coljuegos, ganador al azar, concurso, dinamica, dinamicas, dinamica de redes, promocion en instagram, tarjeta coleccionable, tarjetas secretas, truco o duo, regalo por numero, fidelizacion, oportunidades, publicar en redes, redes sociales, instagram, facebook, tiktok, meta business suite, tiktok studio, publicar solo, programar videos, comportamientos automatizados, cuenta bloqueada, chrome extension, duo burguer, duo burger]
preguntas: ["¿cómo hago que el pedido llegue marcado con la mesa sin que nadie lo diferencie a mano, y sin pedirle registro al cliente?", "¿cómo cobro un plato que el cliente arma, si todavía no tengo el costo de cada ingrediente?", "¿puedo hacer un sorteo en Instagram para el negocio sin meterme en problemas?", "¿cómo hacemos un sorteo donde nadie pueda registrarse desde la casa?", "¿puedes publicar tú solo los videos en mis redes todos los días con mi Chrome abierto?", "agregué la mesa 3 y el pedido llega sin mesa, ¿qué pasó?"]
proyectos: [duo-burger]
confianza: media
actualizado: 2026-11-02
---

# Pedidos, sorteos y redes de un local

## Respuesta corta

1. **Evita que el cliente haga trabajo administrativo o que el negocio custodie datos**: sin registro ni historial en servidor; el pedido vive en el teléfono.
2. Cada QR de mesa lleva su origen (`?o=mesa-N`): da de alta la mesa **ANTES de poner su QR** o el pedido cae como «directo» sin error.
3. Un sorteo con ganador al azar necesita permiso de Coljuegos (según la investigación): díselo al dueño y propón una variante sin azar.
4. **Nunca publiques ni programes en las redes del cliente manejando su navegador**: prepárale el contenido y que programe él.

## Por qué (qué lo pagó)

Cinco decisiones y un fallo de Duo Burguer (hamburguesería de Popayán, septiembre–octubre 2026):

- **QR por mesa (15-sep).** El dueño pidió que cada mesa tenga un QR identificable para el
  sistema y que no hubiera que diferenciarlo a mano. Se eligió el QR sobre un selector manual:
  «así nadie puede marcar una mesa desde su casa». Verificado contra el sistema real el 22-sep:
  el pedido de la mesa 2 llegó como mesa 2, sin pedir ningún dato personal. Las mesas 3 y 4 se
  generaron el 23-sep pero seguían sin alta en el sistema el 24-sep: sin alta, el pedido llega sin mesa.
- **Sin registro, modificable 5 minutos (15-sep).** El dueño rechazó un historial de pedidos
  «porque sería guardar mucha información» y pidió que el cliente vea lo que pidió al volver
  y lo pueda modificar 5 minutos (primero dijo 3; vale 5), hasta que la cocina lo empiece.
- **Platos armables (13 y 15-sep).** El dueño pidió que el cliente pueda armar su desayuno y,
  cuando se desglose el 100 % de los gastos, su propia hamburguesa con el valor calculado por
  el sistema; el 15-sep pidió desglosar la mayor cantidad de costes para manejar márgenes. El
  PC entregó el costeo (insumos, recetas, gastos, márgenes) en una semana.
- **Coljuegos (11-sep).** La investigación con unas 50 fuentes numeradas cambió el plan: el
  bautizo de las mascotas por votación y el 2×1 para dúos no necesitan permiso; una rifa sí.
  El 21-oct el dueño diseñó un sorteo de Halloween con tarjetas (los premios, 30 en total, los
  fijó el 23-oct) y el permiso quedó como hueco abierto: la regla sigue viva.
- **Sorteo por compras (21–23-oct).** El dueño no quería que cualquiera registrara una tarjeta
  desde la página y pidió que fuera solo para quien come ahí, con más tarjetas cuantos más
  combos. Se construyó en dos partes y pasó revisión de seguridad, privacidad y cobro (6 hallazgos
  corregidos; puerta verde con 2.058 a 2.075 pruebas). El 23-oct fijó los premios del sábado 31
  (8 perros, 4 hamburguesas, 10 bonos de 10 %, 6 de 15 % y 2 de 40 %) y decidió que no necesita
  permiso por ser un evento de temporada; Claude no pudo confirmar si Coljuegos aplica.
- **Redes (4-oct, fallo).** El dueño pidió que Claude publicara «solo cada día» y le dio el
  control; al abrir Meta Business Suite en su Chrome, Facebook mostró el aviso de comportamientos
  automatizados tras una tarde de cambios seguidos (renombrar la página, borrar publicaciones).
  Se paró, no se programó nada y la programación quedó en manos del dueño (unos 20 min para toda
  la semana). Perder la cuenta del negocio cuesta más que el tiempo ahorrado.

## Cómo se aplica

1. **QR por mesa:** `?o=mesa-N` en la URL; el pedido llega con ese origen. No pidas selector
   manual ni datos personales. **El formato `mesa-N` de un QR ya impreso no se cambia.**
2. **Antes de poner el QR de una mesa nueva**, dala de alta en el sistema (`/admin/puntos-qr`);
   si no, el pedido cae como directo sin error. Comprueba con un pedido de prueba que llegue con su mesa.
3. **Sin cuentas ni historial en servidor.** El pedido vive en el teléfono (`localStorage`, se borra al
   día siguiente); al volver, el cliente lo ve y lo modifica 5 minutos o hasta que la cocina lo
   empiece. Si hace falta recordar algo del cliente, que sea en su aparato y con fecha de borrado.
4. **Platos armables:** desayuno y almuerzo a precio fijo con opciones (desayuno $6.000 con huevos
   revueltos o pericos, rancheros +$1.000, café o agua de panela, maduro o papas; almuerzo $12.000
   con principio, plato fuerte y ensalada). La hamburguesa armable se cobra con los precios de
   adición de la carta hasta que el sistema tenga el costo de cada ingrediente; si lo armado coincide
   con un plato de la carta, se cobra el precio de la carta. Pide el costeo (insumos, compras con
   historial, recetas por plato, gastos, márgenes) desde el día uno: de ahí saldrá el precio de lo armable.
5. **Antes de diseñar cualquier dinámica** para un negocio colombiano, pregunta: ¿hay ganador al
   azar? Si lo hay, necesita permiso de Coljuegos (multas de hasta noventa millones, según la
   investigación). Votación y 2×1 no lo necesitan. Si el dueño quiere rifa, díselo antes y propón
   regalo fijo por número.
6. **Sorteo o tarjeta que premia compras:** se registra únicamente donde la compra es verificable
   (la caja): la cajera escribe nombre, celular y autorización de datos y el sistema numera la
   tarjeta. La página solo consulta y pide DOS datos (celular y número de una tarjeta) para que
   nadie vea las de otro. Cada tarjeta es una oportunidad; el dueño sortea desde el panel con
   aleatorio criptográfico y no antes de la fecha; lo que no pasa por caja (domicilio) no participa
   y recoger sí.
7. **Redes del cliente:** prepara por día el video, el texto y la hora (carpeta lista para copiar)
   y guíalo para que programe él en Meta Business Suite y TikTok Studio. Si sale el aviso de
   comportamientos automatizados, no toques nada: cierra tu pestaña y dile que lo descarte.
8. **Tabaco y licor fuera de la vitrina pública** de un minimarket, estanco o tienda: la Ley
   1335 de 2009 prohíbe la publicidad de productos de tabaco y la del licor está restringida.
   En La Villa quedaron excluidos de la vitrina desde el mensaje de arranque (confianza media:
   salió de la investigación de Claude, no de un abogado). El catálogo interno de la caja sí
   los lleva.

## Cuándo NO aplica

- **QR/sin registro:** no para pedidos de recoger o domicilio, donde sí hay que pedir nombre,
  teléfono y autorización de datos, ni para negocios que quieran fidelización con cuenta. La
  decisión es del dueño y vale para Duo Burguer.
- **Platos armables:** cuando exista el costeo, el precio de lo armable sale de los insumos y no
  de las adiciones; no aplica a negocios sin recetas estables ni a platos de un solo precio.
- **Coljuegos:** no aplica a promociones sin azar. No reemplaza consultar con Coljuegos o un
  abogado la modalidad exacta, y la cifra de la multa viene de la investigación del agente:
  confírmala antes de citarla al cliente. **Contradicción documentada:** la investigación del
  11-sep dice que una rifa necesita permiso; el dueño decidió el 23-oct que el sorteo de
  tarjetas del 31 no, por ser evento de temporada, y Claude no pudo confirmarlo. Trátalo como
  riesgo abierto: si el sorteo crece (premios mayores, venta de boletas, abierto a quien no
  compró), consulta a un contador por permisos.
- **Sorteo por compras:** si no hay caja que verifique la compra, usa otro mecanismo de verificación.
- **Redes:** si la plataforma ofrece API oficial de publicación con la cuenta autorizada por el
  dueño, o si el dueño mismo opera la herramienta de programación. Tampoco aplica a publicar la
  PÁGINA WEB del cliente: eso sí se automatiza (la página de Duo Burguer sale cada día a las 6:00).

## Evidencia

- Dueño, memoria `project_duo_burguer_mesas_qr` (2026-09-15): «desde el cliente, que nosotros no
  tengamos que hacer el diferenciador»; `project_duo_burguer_pedido_modificable`: «no quiero lo de
  registro de pedidos porque sería guardar mucha información». Estas dos citas del dueño solo
  están en las memorias, no en el resumen de la ventana.
- «Preferí esto al selector manual: así nadie puede marcar una mesa desde su casa.», «El pedido de
  la mesa 2 llegó como mesa 2, sin pedir ningún dato personal.» y «Mesas 3 y 4: hay que darlas de
  alta en `/admin/puntos-qr` antes de ponerlas. Si no, esos pedidos llegan sin mesa.» — ventana
  [[2026-09-09-duo-burger|Duo Burguer]] (transcrito `51184930`, 2026-09-15 / 09-22 / 09-24).
- «quiero que el cliente pueda armar su desayuno», «cuando desglosemos el 100% de los gastos
  podamos hacer que armen su propia hamburguesa y que les de el valor» (2026-09-13),
  «en el sistema quiero que podamos desglozar la mayor cantidad de costes, para asi poder manejar
  los margenes con mayor precision» (2026-09-15), «Si lo que arma ya existe en la carta, se cobra
  el precio de la carta.» y «Costeo con insumos, recetas, gastos y márgenes.» (2026-09-22) — misma
  ventana (`51184930`).
- «En Colombia, un sorteo con ganador al azar necesita permiso de Coljuegos. Multas de hasta
  noventa millones.» y «El bautizo de las mascotas por votación y el 2×1 para dúos no lo
  necesitan; una rifa sí.» — misma ventana, 2026-09-11 (investigación en `docs/plan-de-contenido-01.md`).
- «cualquierda puede registrar una tarjeta, y solo quiero que sea para los que vayan a comer
  ahi», «entre mas combos compre mas tarjetas tiene y mas posibildad de ganar» (2026-10-21),
  «para recoger si cuenta siempre» (2026-10-23) y «The 6 review findings were fixed and checked
  again.» (2026-10-22) — ventana [[2026-09-09-duo-burger|Duo Burguer]] (transcrito `7f456016`).
- «si tengo en chrome abierto las cuentas puedes publicar solo cada dia?», «quiero que te encargues
  de esto siempre, tu vas a tener el control» y «Sospechamos que hay comportamientos automatizados
  en tu cuenta» — ventana [[2026-09-09-duo-burger|Duo Burguer]] (transcrito `51184930`, 2026-10-04).
  Memoria `feedback_duo_publicar_6am`: las redes del dueño no se manejan desde el navegador.
- «Cigarrillos y licor NO se publican (Ley 1335 de 2009)» — ventana [[2026-11-02-la-villa-vitrina|La Villa · vitrina]]
  (transcrito `74eade2c`, 2026-11-02); origen: «Ley 1335 de 2009 (tobacco advertising prohibited;
  liquor advertising restricted)» — ventana [[2026-09-09-la-villa-sistema|La Villa · sistema]] (transcrito `129e1026`).

## Enlaces

- [[TEMA-piloto-con-cliente-real]] — el mismo método de preguntarle al cliente qué le duele.
- [[TEMA-acceso-roles-y-puestos]] — quién registra en caja y quién consulta.
- [[TEMA-caja-y-turnos]] — la caja como único lugar verificable de la compra.
- [[TEMA-cero-datos-inventados]] — la cifra de la multa viene de la investigación: confírmala.
- [[TEMA-pantalla-publica]] — la página pública que consulta tarjetas y recibe el QR.
