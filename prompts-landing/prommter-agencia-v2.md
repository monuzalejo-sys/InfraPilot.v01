═══════════════════════════════════════════════════════════════════════════════
PROMPT DE LANDING — PROMMTER (la cara pública de la casa)
Destinatario: quien diseñe/construya la portada. Entregable: UN index.html
autocontenido. Todo dato de negocio lleva su origen archivo:línea.
Sustituye a ORION/prompts-landing/agencia.md (v1, escrito cuando la casa aún no
tenía nombre y cuando el modelo de cobro estaba mal escrito: decía "instalación
una vez y mensualidad"; hoy manda prommter/KN-003 — ver §1.C).
ESTE ARCHIVO SIGUE VIGENTE. Si la landing YA está construida, la iteración de
acabado va en `ORION/prompts-landing/prommter-agencia-v3-mejora.md` (2026-08-29),
que opera ENCIMA del entregable y no sustituye nada de aquí.
Léelo entero antes de escribir una línea.
═══════════════════════════════════════════════════════════════════════════════

╔═════════════════════════════════════════════════════════════════════════════╗
║ 0 · ARMADURA CONTRA EL MEDIO — ESTO VA PRIMERO, ANTES QUE LOS DATOS          ║
╚═════════════════════════════════════════════════════════════════════════════╝
Si te ejecuta un generador de diseño (Claude Design y equivalentes), estas ocho
órdenes mandan sobre cualquier hábito tuyo. Están pagadas con un rechazo medido
el 2026-08-23 (ORION/memory/landings/state.json KN-007, POL-004): el medio ancló
un design system propio "_ds/modernist-<uuid>/" y la dirección de arte del prompt
perdió — la paleta pedida apareció 0 veces en el entregable.

 0.1 NO anclas, NO adjuntas, NO generas y NO "derivas" ningún design system
     predefinido. Si tu flujo va a anclar uno, cancélalo. El entregable no puede
     contener carpeta `_ds/`, ni `theme.json`, ni `_adherence*.json`, ni un
     `<link>` a un `styles.css` externo.
 0.2 TODOS los tokens salen del §5 de este prompt. Está entregado completo, en
     un bloque `:root` listo para pegar, con sus contrastes ya medidos. No hay
     hueco que rellenar: si un color no está en §5, no existe.
 0.3 Radios 14 px (tarjetas) y 999 px (píldoras y botones). NUNCA radio 0.
 0.4 Las pantallas de producto van A COLOR PLENO. Prohibido blanco y negro,
     grayscale, desaturado o "print photography" de cualquier clase.
 0.5 Tipografía: exactamente las dos familias del §5.C, cargadas con el `<link>`
     literal que está escrito ahí. Prohibido dejar el cuerpo en `system-ui`
     por omisión: eso es literalmente la mitad de lo que el dueño llamó
     "genérico" (KN-007, medición: 25 de 32 `font-family` eran `inherit`).
 0.6 Iconos: SVG inline dibujados por ti. Prohibida cualquier librería (Lucide,
     Feather, Font Awesome).
 0.7 La PRIMERA PANTALLA es OSCURA (fondo `--noche #12100E`). Prohibido fondo
     claro o crema a pantalla completa en el héroe. Criterio medible en §10-A8:
     luminancia media de los PÍXELES del PNG del héroe < 0.12 — medida sobre la
     imagen, no leyendo CSS (leyendo CSS el fallo de 2026-08-23 pasaba en falso
     por un factor de 110).
 0.8 Movimiento: en el cuerpo del prompt se te pide MOVIMIENTO CONGELADO (que la
     pantalla se vea viva estando quieta). La coreografía con milisegundos vive
     en el ANEXO B y NO es exigible al lienzo: es para quien programe después.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 1 · EL NEGOCIO — QUÉ VENDE PROMMTER DE VERDAD                               ║
╚═════════════════════════════════════════════════════════════════════════════╝

1.A LA MARCA ES REAL (no es placeholder)
"Prommter" es el nombre de la casa, verificado: `prommter/EMPRESA.md:1` y
`prommter/PROYECTOS.md:1`. Se escribe con dos emes: Pro-mm-ter.
LO QUE NO EXISTE: logo, manual de marca, paleta oficial. Está declarado como
trabajo futuro: *"manual de marca de Prommter cuando exista"*
(`prommter/equipo/README.md:12`) y programado para la semana 4 del plan de la
diseñadora (`equipo/planes/2026-08-21-plan-diseno-grafico.md:27, :50`).
⇒ La paleta y la tipografía del §5 son PROVISIONALES Y DECLARADAS (hueco H-3).
La marca se dibuja tipográficamente, nunca inventes un símbolo/logotipo.

1.B QUÉ VENDE, EN PALABRAS DEL PROPIO DUEÑO (fuente para el copy del héroe)
 • *"Prommter mete al negocio de barrio en el mundo de hoy sin quitarle lo que lo
   hace ganar: le pone una cara pública que le trae clientes propios y unas
   cuentas que cuadran solas."* (`EMPRESA.md:11-13`)
 • La categoría NO es "agencia" ni "desarrollo a medida": es **el sistema
   operativo del negocio local** — *"una sola pieza que atiende, cobra, cuadra y
   vende"* (`EMPRESA.md:15-19`). Definirse por lista de servicios deja a Prommter
   compitiendo por precio contra cualquier freelance (misma cita).
 • **El enemigo tiene nombre y son dos** (`EMPRESA.md:21-31`):
   (1) LA COMISIÓN — las apps de domicilio cobran 20-30 % *"y además el cliente
   no es suyo: no tiene su teléfono y compite por precio junto a sus rivales"*;
   (2) LA CEGUERA — *"No sabe cuál producto le deja plata, cuánto insumo se le va
   sin control, ni cuál de sus dos locales cerró mejor."*
   Prommter le devuelve las dos cosas: *"el cliente propio y el número real"*
   (`EMPRESA.md:32`).
 • ORDEN DE ENTREGA, y es un diferenciador: *"Primero el sistema que cuadra —es
   el que sostiene la mensualidad porque se usa todos los días—, después la cara
   pública que vende, y encima el marketing, que sin los dos anteriores no tiene
   dónde aterrizar ni cómo medirse."* (`EMPRESA.md:37-40`)
 • LO QUE PROMMTER NO HACE (`EMPRESA.md:59-62`): *"No cobra por pago único. No
   entrega páginas que no cambian nunca (el cliente cancela a los tres o cuatro
   meses, y con razón). No deja consumo variable sin tope escrito. No pone datos
   inventados en nada que vea un cliente."* ← esta lista es copy de venta, úsala.

1.C EL MODELO DE COBRO — REGLA DURA, NO NEGOCIABLE
Prommter cobra por **MENSUALIDAD CON PERMANENCIA POR ESCRITO. NUNCA pago único.**
Origen: `prommter/memory/prommter/state.json` KN-003 (corrección del dueño en
vivo el 2026-08-21) y `EMPRESA.md:42-45`. Regla textual del KN-003: *"ninguna
propuesta o landing de Prommter debe presentar el servicio como pago único; si
una memoria de proyecto dice pago único, está desactualizada"*.
 • Estructura por defecto: **instalación + mensualidad**; si se entra SIN
   instalación, la permanencia mínima por escrito no es opcional — *"le estás
   prestando plata al cliente"* (`documentos/agencia/precios.html:266-285`).
 • La pauta/alcance sale de la misma cuota. Caso real citable: 1.000.000 COP/mes,
   sin cobro de arranque, marca y web dentro de la cuota, 100.000/mes de pauta en
   Meta incluidos (`proyectos/orama/plan-servicio-orama.html:1100-1116`) — pero
   ese cliente NO se nombra en la landing (ver §3 y hueco H-5).
 • Se cobra por lo que el cliente gana o ahorra, **jamás por el costo de las
   herramientas**: *"cotizarías en 50.000 COP algo que vale millones para el
   cliente"* (`precios-v2.html:315-316`); lo que se vende es criterio y tiempo,
   no hosting (`precios-v2.html:295-296`).
 • Nunca digas ni insinúes: "pago único", "un solo pago", "lo pagas una vez y es
   tuyo", "sin mensualidad", "licencia de por vida".

1.D LOS TRES NIVELES (contenido fijo, textual de la fuente)
 • **PRESENCIA** — *"Existir, que lo encuentren y que lo contacten"*
   (`precios-v2.html:106-107`). Para: *"negocio que hoy no tiene nada, o solo un
   Instagram. Peluquería, taller, tienda de barrio, profesional independiente"*
   (`:110-111`). Incluye: página de una o pocas secciones (qué hace, catálogo o
   menú con fotos, horarios, ubicación); botón directo a WhatsApp; dominio
   propio; Perfil de Google configurado; adaptada a celular (`:118-124`). La
   mensualidad compra: seguir al aire, dominio renovado, respaldos y **una
   actualización al mes** (`:143-144`).
 • **OPERACIÓN** — *"Recibir pedidos y administrarlos"* (`:160-161`). Para:
   *"restaurante, tienda, servicio con reservas"* (`:164-165`). Resuelve, textual:
   *"dejar de pagar comisión de aplicaciones, tener panel propio, y saber qué se
   vendió"* (`:166-167`). Incluye además del nivel 1: pedidos en línea con
   carrito y confirmación; panel del dueño (ver pedidos, cambiar estado, editar
   productos y precios); base de datos de productos/pedidos/clientes;
   notificación al entrar un pedido; reportes de cuánto, qué y a qué horas se
   vendió; varios usuarios con permisos distintos dueño/cajero (`:172-179`).
 • **AUTOMATIZACIÓN** — *"Que el sistema haga trabajo que hoy hace una persona"*
   (`:226-227`). Para: *"negocio con volumen, varios locales, o que ya está
   pagando a alguien por hacer algo repetitivo"* (`:230-231`). Incluye: flujos
   automáticos; WhatsApp conectado de verdad (confirmar pedido, avisar que va en
   camino); funciones con IA; integraciones de pagos, facturación electrónica y
   domicilios; varios locales con comparación entre ellos; informe mensual y
   acompañamiento (`:238-244`). Consumo variable **siempre con tope escrito**
   (`:259-266`).
 DECISIÓN QUE MANDA SOBRE EL DISEÑO: **Operación es la tarjeta protagonista.**
 No es un truco de diseño, es doctrina propia: *"Este es el nivel donde conviene
 concentrarse… aquí está el negocio"* (`:212-216`) y *"la meta no es cobrar más
 caro — es tener más clientes en el nivel 2"* (`:310`). Además: *"Presenta dos o
 tres opciones, nunca una. Con tres, la mayoría toma la del medio — ponla donde
 te convenga"* (`:319-320`).

1.E CIFRAS DE PRECIO — APAGADAS POR DEFECTO
Los rangos existen y son citables (Presencia 400.000-900.000 instalación +
80.000-150.000/mes `precios-v2.html:140-141`; Operación 1.500.000-3.500.000 +
250.000-500.000/mes `:202-203`; Automatización 4.000.000-10.000.000+ +
700.000-2.000.000+/mes `:272-274`). **Pero NO se publican por defecto**, por dos
razones citables: los dos documentos están rotulados *"Documento interno · No
compartir con clientes"* (`precios.html:44`, `precios-v2.html:47`) y sus rangos
se declaran *"punto de partida razonado, no estudio de mercado"* (`:336-339`).
⇒ Implementa un interruptor `CONFIG.mostrarPrecios = false`. Con false, el bloque
de precios dice **"Se cotiza con sus números, no de catálogo"** (regla propia:
`precios-v2.html:276-277, 317-318`). Deja el bloque con las cifras ya escrito
detrás del interruptor. Publicar cifras exige confirmación del dueño (hueco H-6).

1.F DÓNDE OPERA — NO CONSTA
Los documentos hablan de *"qué se cobra en tu ciudad"* sin nombrarla nunca
(`precios-v2.html:331`, `precios.html:350-352`). Dos clientes SÍ están en Popayán
(`arroces/memory/arroces/brief.md:4` "B/ Yambitará, Popayán";
`PROYECTOS.md:45` "Orama Inmobiliaria (Popayán, Cauca)"), pero deducir de ahí la
ciudad de Prommter sería inventar. Va como token visible [[CIUDAD]] (hueco H-2).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 2 · QUIÉN MIRA Y QUÉ DEBE HACER                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝

QUIÉN: el dueño de un negocio pequeño colombiano con punto físico — *"Micro y
pequeña empresa colombiana de comercio y comida con punto físico, uno o varios
locales, que ya vende bien y factura a mano"* (`EMPRESA.md:34-36`). Asaderos,
plazas de mercado, estancos, arroceras, mayoristas. Mira desde un celular de gama
media, casi siempre por un enlace que le llegó por WhatsApp. No sabe qué es un
stack; sabe exactamente cuánto le descuenta la aplicación de domicilios.

QUÉ DEBE SENTIR, en este orden (es la pregunta que decide el registro visual):
 1. "Esto me está hablando a mí" — reconoce SU tipo de negocio en la primera
    pantalla, no un dibujo de startup.
 2. "Estoy regalando plata todos los meses" — la calculadora (S2).
 3. "Esto ya existe y funciona, no es humo" — pantallas de verdad y trabajos ya
    construidos (S4, S5).
 4. "Puedo preguntar sin comprometerme."
Y una quinta que ningún texto dice: **esta landing ES la muestra del producto.**
Si se ve pobre, el producto se ve pobre.

UNA SOLA ACCIÓN PRINCIPAL: **escribir por WhatsApp a [[WHATSAPP]]**.
Todos los botones de conversión del sitio apuntan al mismo `wa.me`. NO hay
formulario, NO hay correo, NO hay "llámanos", NO hay newsletter, NO hay
"descargar PDF". Dos CTAs compitiendo = ninguno. Hay además una razón de
producto: el nivel Presencia vende *"botón directo a WhatsApp"*
(`precios-v2.html:120`) — la landing lo demuestra siendo eso. Y es el patrón de
la casa: en Orama *todo el tráfico remata en un chat*
(`equipo/planes/2026-08-21-plan-landing-frontend.md:20`).

EL MENSAJE DEL wa.me VA PRECARGADO y arrastra lo que el visitante tocó:
"Hola, tengo {tipo de negocio elegido en el héroe}. Hago unos {A} pedidos por
aplicación al mes de unos ${B} cada uno. Quiero saber cómo funciona."
Razón, de la propia fuente: el método de venta es llegar con el número del
cliente ya calculado (`precios-v2.html:209-211`). Que el mensaje llegue con la
cifra puesta hace la mitad del trabajo de la primera reunión.

MEDIDA DEL PLIEGUE (obligatoria, no opinable): a 390×844, el borde inferior del
botón principal del héroe queda en **y ≤ 720 px** y la calculadora empieza antes
de **y = 1000 px**. Referencia de por qué: una portada de la casa tenía su
primera cosa accionable en y=1994 —2,4 pantallas— y se leyó como "apagada"
(`ORION/memory/landings/state.json` KN-002).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 3 · EVIDENCIA REAL — LO ÚNICO QUE SE PUEDE PROBAR HOY                       ║
╚═════════════════════════════════════════════════════════════════════════════╝

3.A LO QUE EXISTE, VERIFICADO EN DISCO (esta es la ventaja de Prommter)
 (a) **Asadero de pollo broaster con dos sedes** — vitrina móvil donde el cliente
     pide + sistema contable: órdenes que entran solas al panel, gastos con
     concepto obligatorio, comparativa entre sedes con archivo para el contador,
     catálogo con precios editables, usuarios dueño/cajero, caja con turno y
     arqueo. Cobrar toma 2 toques; tomar un pedido, 6 toques sin scroll en un
     celular de 390 px.
     (`prommter/proyectos/villa-broaster/memory/villa-broaster/brief.md:9, :11,
     :13`; sedes en `PROYECTOS.md:14`)
 (b) **Plaza de mercado — EN PRODUCCIÓN, el cliente lo usa a diario**
     (`PROYECTOS.md:22`). Es el único que ya está en uso real todos los días.
 (c) **Restaurante de arroces en Popayán** — carta con precios exactos de la
     carta física, armado de pedido, estados nuevo/preparando/listo/entregado,
     pagos mixtos, turnos y arqueo (`arroces/memory/arroces/brief.md:4, :10-14`).
 (d) **Tres estancos en Bogotá** — punto de venta, reportes para el dueño,
     alertas de stock, multi-local (`estanco-contable/memory/estanco-contable/
     brief.md:4`).
 Y el propio documento de precios ya usa dos de ellos como el ejemplo del nivel
 Operación: *"El caso del broaster y del de arroces"* (`precios-v2.html:165`).

3.B RESTRICCIÓN DURA — NINGUNO ESTÁ PUBLICADO EN INTERNET
 Verificado: el asadero tiene hosting/activación pendiente
 (`villa-broaster/memory/villa-broaster/brief.md:27`); la plaza corre en
 producción LOCAL, puerto 3300, no en internet (`PROYECTOS.md:22`); la web de la
 inmobiliaria está *"lista para GitHub Pages"*, que no es lo mismo que publicada
 (`PROYECTOS.md:49`). Consecuencias innegociables:
  ✗ Ninguna URL de cliente, ningún "ver el sitio", ningún "visítalo".
  ✗ Ninguna captura de pantalla de cliente: no hay permiso escrito de nadie.
  ✓ Los cuatro casos van **ANÓNIMOS por defecto** con las descripciones de 3.A.
    Eso es 100 % cierto y no necesita permiso de nadie.
  ✓ Interruptor `CONFIG.clientesConPermiso = false`. Cuando el dueño consiga
    permiso por escrito, lo pone en true y aparecen los nombres que él escriba en
    el objeto de configuración (hueco H-5). Ojo: la inmobiliaria **no ha firmado**
    (*"En prueba de 10 días antes de firmar"*, `PROYECTOS.md:48`) — no se nombra
    ni con permiso hasta que firme. Y el mayorista de pollo tiene la marca
    pendiente (`PROYECTOS.md:40-43`): tampoco se nombra.

3.C CÓMO SE PRUEBA EL TRABAJO SIN ENLACES: se enseña FUNCIONANDO dentro de la
propia landing (S4). Una demo que el visitante toca vale más que una captura, y
es honesta si va rotulada.

3.D LO QUE NO EXISTE Y POR TANTO NO SE ESCRIBE
Testimonios, número de clientes, años de experiencia, "+X negocios confían",
estrellas, premios, certificaciones, alianzas (Google Partner, Meta Partner),
porcentajes de resultado ("le subimos las ventas un X %"), tiempos de entrega.
Nada de eso está en ninguna fuente. Está pagado: un testimonio inventado lleva
más de una semana desplegado en otro producto de la casa y sigue ahí
(`ORION/cerebro/temas/cero-datos-inventados.md:50-57`). Si el dueño los tiene,
los aporta él (huecos H-8, H-9).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 4 · ESTRUCTURA SECCIÓN POR SECCIÓN                                          ║
║ Cada bloque lleva: PARA QUÉ está · QUÉ dice (con origen) · CÓMO SE VE QUIETO ║
╚═════════════════════════════════════════════════════════════════════════════╝

S0 · BARRA SUPERIOR (fina, sticky) + BARRA FIJA INFERIOR EN MÓVIL
 PARA QUÉ: identidad + el CTA siempre a un pulgar.
 QUÉ: izquierda "Prommter" en display; derecha un solo botón verde WhatsApp
 "Escribir". En < 640 px la barra superior deja solo la marca y el CTA baja a una
 barra fija inferior de 64 px con `env(safe-area-inset-bottom)`.
 QUIETO: la barra inferior siempre visible en cualquier captura.

S1 · HÉROE OSCURO CON CARRUSEL DE NEGOCIOS   ← referencia 01 (§11)
 PARA QUÉ: que en 3 segundos reconozca SU negocio y entienda qué se vende. No
 explica: identifica.
 QUÉ:
  · Fondo `--noche #12100E` con un radial cálido detrás de la pieza central
    (`radial-gradient(120% 80% at 50% 30%, rgba(232,168,58,.20), transparent 60%)`),
    grano SVG fractalNoise al 6 % encima, viñeta.
  · Texto fantasma gigante detrás (z-index 1), `clamp(84px, 26vw, 300px)`,
    `color: rgba(248,246,242,.06)`: la palabra del negocio activo
    (ASADERO / PLAZA / ESTANCO / MAYORISTA). Es textura, no lectura.
  · CUATRO PIEZAS = cuatro TELÉFONOS dibujados en HTML/CSS (no fotos), cada uno
    mostrando la vitrina de un tipo de negocio: asadero, plaza de mercado,
    estanco, mayorista. Roles por índice: centro grande y nítido; izquierda y
    derecha más pequeños con `blur(2px)` y **cortados por el borde de la
    pantalla**; el cuarto al fondo, más pequeño, `blur(4px)`.
  · **El color del héroe cambia con el negocio activo**: asadero → ámbar
    `#E8A83A`; plaza → verde `#5E9E85`; estanco → teja `#E5623E`; mayorista →
    `#C9C2B8`. Cambia el radial, el borde del teléfono central y el color del
    dato grande. El fondo base sigue siendo `--noche`.
  · TITULAR (dirección de copy; la redacción se puede afinar, el hecho no):
    "Su negocio con clientes propios y cuentas que cuadran solas."
    Origen del contenido: `EMPRESA.md:11-13`.
  · BAJADA, una frase: "El sistema que atiende, cobra y cuadra; y la página que
    le trae los clientes. Sin comisión de aplicaciones." (`EMPRESA.md:15-19,
    21-32`).
  · CTA único, verde WhatsApp, alto ≥ 52 px, ancho 100 % en móvil.
  · Debajo del CTA, una línea fina: "Trabajo con negocios en [[CIUDAD]]" (H-2).
 QUIETO (obligatorio — el revisor mira PNG): el teléfono central YA tiene un
 pedido entrando, con su tarjetita "Pedido nuevo · $32.000 · Ejemplo" a medio
 aparecer (opacidad 1, desplazada 6 px, con sombra proyectada), inclinado −7° en
 el eje Y y saliéndose 12 px del encuadre por abajo; el teléfono de la derecha
 asoma cortado por el borde. Nada se ve centrado ni simétrico.

S2 · LOS DOS ENEMIGOS + LA CALCULADORA   ← referencia 02 (§11)
 PARA QUÉ: convertir "¿cuánto cuesta una página?" en "¿cuánto estoy regalando cada
 mes?". Es literalmente el método de venta de la casa (`precios-v2.html:209-211`).
 Va SEGUNDA por eso.
 QUÉ:
  · Sigue en banda oscura (no rompas el ánimo del héroe todavía).
  · Dos enemigos con nombre, en dos columnas (apiladas en móvil):
    **LA COMISIÓN** — "Las aplicaciones de domicilio cobran entre 20 % y 30 %, y
    además el cliente no es suyo: no tiene su teléfono y compite por precio al
    lado de sus rivales." (`EMPRESA.md:23-29`)
    **LA CEGUERA** — "No sabe cuál producto le deja plata, cuánto insumo se le va
    sin control, ni cuál de sus dos locales cerró mejor." (`EMPRESA.md:30-31`)
  · CALCULADORA, dos controles (deslizador + campo escribible, `inputmode
    numeric`): A = pedidos por aplicación al mes (inicial **60**); B = valor
    promedio del pedido (inicial **30.000**).
    Cálculo: venta = A × B; comisión = 20 % a 30 % (`precios-v2.html:205-207`).
  · SALIDA COMO "DATO GRANDE + LÍNEA" (el mecanismo más resistente de la
    biblioteca): cifra en `--ambar #E8A83A` sobre `--noche`, display 700,
    `clamp(44px, 13vw, 96px)`, `font-variant-numeric: tabular-nums`, cruzada por
    una franja diagonal fina del mismo ámbar al 18 %:
        $360.000 – $540.000
        se van cada mes en comisión
        $4.320.000 – $6.480.000 al año
  · CIERRE HONESTO, calcado del original: *"Solo con mover una parte de esos
    pedidos a su propia página, la mensualidad se paga sola"*
    (`precios-v2.html:207-208`). **PROHIBIDO** decir o insinuar que recupera el
    100 %: el propio documento lo dice como "una parte".
  · CTA de sección: WhatsApp con el mensaje precargado que lleva A y B.
 QUIETO: la cifra grande ya está calculada con los valores iniciales; el
 deslizador aparece con el pulgar a un tercio del recorrido, no en el extremo.

S3 · QUÉ ENTREGA Y EN QUÉ ORDEN
 PARA QUÉ: diferenciarse de "el que hace páginas". El orden ES el argumento.
 QUÉ: banda clara (`--papel`). Tres piezas numeradas 01/02/03 con línea vertical
 que las une, textual de `EMPRESA.md:37-40`:
  01 **El sistema que cuadra** — "es el que sostiene la mensualidad porque se usa
     todos los días".
  02 **La cara pública que vende** — catálogo o carta, pedidos que llegan
     directo, dominio propio.
  03 **El marketing** — "sin los dos anteriores no tiene dónde aterrizar ni cómo
     medirse".
 QUIETO: las tres tarjetas escalonadas en diagonal (la 01 más adelante, con
 sombra más profunda), no en fila simétrica.

S4 · "ASÍ SE VE POR DENTRO" — DEMO VIVA
 PARA QUÉ: sustituir el portafolio con enlaces que hoy NO existe (§3.B) y enseñar
 el nivel Operación funcionando. Aquí el producto es protagonista.
 QUÉ: banda oscura otra vez. Dos paneles lado a lado (apilados en móvil):
  IZQUIERDA, el celular del cliente final: catálogo con 3-4 productos GENÉRICOS
  DE EJEMPLO del tipo de negocio elegido en el héroe, carrito, "Confirmar pedido".
  DERECHA, el panel del dueño: el pedido ENTRA con un aviso y avanza por los
  estados reales del sistema construido — **nuevo → preparando → listo →
  entregado** (`arroces/memory/arroces/brief.md:14`) — y debajo una línea de
  reporte: *"cuánto se vendió, qué se vendió, a qué horas"* (`precios-v2.html:177`).
  Tres "datos grandes" bajo la demo, todos citables:
   **2 toques** para cobrar · **6 toques** para tomar un pedido, sin scroll en un
   celular (`villa-broaster/memory/villa-broaster/brief.md:11`) ·
   **$0** de comisión por pedido propio (`precios-v2.html:166-167`).
 SELLO OBLIGATORIO Y VISIBLE (nunca `sr-only`, nunca `display:none`): cinta al
 pie del panel — "Demostración con productos de ejemplo. No es el catálogo de
 ningún cliente." Prohibido usar aquí el nombre, la carta o los precios de un
 cliente real.
 QUIETO: el aviso de "pedido nuevo" ya está en pantalla, el pedido a medio camino
 entre "preparando" y "listo" con el chip anterior desvaneciéndose.

S5 · TRABAJO YA CONSTRUIDO
 PARA QUÉ: credibilidad. Es lo que separa esto de un vendedor de plantillas.
 QUÉ: banda clara. Cuatro tarjetas con los cuatro casos ANÓNIMOS de §3.A, cada
 una diciendo qué se construyó en el idioma del dueño de negocio: "sabe cuánto
 vendió cada sede y las compara", "la caja cuadra al cerrar el turno", "los
 pedidos entran al panel sin recargar nada", "el inventario avisa cuando algo se
 está acabando". NADA de tests, frameworks, puertos ni nombres de herramientas.
 Encima del bloque, un dato grande citable: **"4 sistemas construidos · 1 en uso
 todos los días"** (`EMPRESA.md:93-101`, `PROYECTOS.md:22`).
 Debajo, una sola línea honesta: "Sistemas en funcionamiento, hechos a la medida
 de cada negocio" — sin URLs, sin capturas, sin nombres hasta que haya permiso.
 QUIETO: las cuatro tarjetas con rotación alterna de ±1,5° y sombra dura, como
 fichas puestas sobre una mesa.

S6 · CÓMO SE COBRA — Y QUÉ COMPRA LA MENSUALIDAD
 PARA QUÉ: matar LA objeción del modelo ("¿y por qué pago todos los meses?") y
 dejar el modelo dicho de frente antes de hablar de niveles.
 QUÉ: banda clara con una tarjeta elevada.
  · Encabezado: "Se paga por mes, con permanencia acordada por escrito. Nunca
    pago único." (`prommter/KN-003`, `EMPRESA.md:42-45, 59-62`)
  · Los cuatro puntos, textuales de `precios.html:303-314`:
    "Que siga funcionando: hosting, dominio, respaldos, actualizaciones." ·
    "Que alguien responda: si algo se rompe un viernes por la noche, hay a quién
    llamar." · "Que mejore: cambios pequeños incluidos cada mes." · "Que le diga
    algo: un reporte mensual de cómo va."
  · Y la frase que explica por qué NO se vende una página quieta: "Una página que
    no cambia nunca se cancela a los tres o cuatro meses, y con razón"
    (`precios-v2.html:145-150`, `EMPRESA.md:59-62`).
  · Permanencia mínima en meses: NO se escribe (sigue "a definir" en la única
    propuesta real: `plan-servicio-orama.html:1116`) → hueco H-7 visible.
 QUIETO: la tarjeta con un sello circular "mensual" rotado −8° en la esquina.

S7 · LOS TRES NIVELES
 PARA QUÉ: que se ubique solo y elija; y que Operación se vea como la opción
 obvia (`precios-v2.html:212-216`).
 QUÉ: tres tarjetas con nombre, la frase de para qué sirve y la lista literal de
 §1.D. La del medio (Operación) es más grande (escala 1.06), con fondo
 `--noche`, texto claro y rótulo "El que más se usa".
 INTERACCIÓN QUE VENDE: al tocar una tarjeta, la demo de S4 cambia a lo que ese
 nivel realmente entrega (Presencia = catálogo + botón WhatsApp; Operación = +
 carrito, panel y reporte; Automatización = + aviso automático por WhatsApp y
 comparación entre locales). Así el nivel deja de ser una lista de viñetas.
 PRECIOS: con `mostrarPrecios = false`, en lugar de cifras va "Se cotiza con sus
 números, no de catálogo" (§1.E).
 QUIETO: la tarjeta del medio ya elevada y con su rótulo puesto; la demo de S4
 mostrando el estado "Operación".

S8 · LO QUE SE COBRA APARTE (la sección honesta)
 PARA QUÉ: confianza con un cliente escéptico, y es regla propia: *"Deja por
 escrito qué NO incluye. Ahí se evitan casi todos los problemas"*
 (`precios-v2.html:324`).
 QUÉ: lista literal de `precios.html:249-256`: rediseño completo o cambio de
 identidad; un módulo nuevo que no estaba en el alcance; integración con un
 tercero no prevista; migración de datos desde otro sistema; capacitación más
 allá de la entrega inicial. Tono tranquilo, tamaño normal — no es letra pequeña.

S9 · CÓMO EMPEZAMOS
 PARA QUÉ: bajar el miedo al primer paso.
 QUÉ: tres pasos sin tecnicismos: (1) me escribe por WhatsApp y me cuenta qué
 vende; (2) miramos sus números —cuántos pedidos y de cuánto— y le digo qué nivel
 le sirve; (3) se construye, se publica y queda con mantenimiento mensual.
 SIN PLAZOS DE ENTREGA: no están definidos en ninguna fuente (hueco H-8). Deja el
 sitio marcado en la pantalla con "__ días · lo confirma el dueño".

S10 · CIERRE + PIE   ← referencia 03 (§11)
 PARA QUÉ: última conversión con la cifra del visitante todavía en pantalla.
 QUÉ: banda oscura. Repite el resultado de la calculadora si la usó ("Usted está
 dejando ir hasta $X al mes") y el mismo botón de WhatsApp, en grande.
 PIE: Prommter · [[CIUDAD]] · WhatsApp [[WHATSAPP]]. Sin redes (no constan, H-12),
 sin "© Todos los derechos reservados" de relleno si no hay razón social (H-10).
 QUIETO: un foco cálido radial YA PUESTO sobre el botón (no un foco que hay que
 buscar con el dedo): `radial-gradient(circle 220px at 50% 60%, rgba(232,168,58,
 .22), transparent 70%)`, el resto de la banda a `brightness(.75)`.

SECCIONES QUE NO VAN, y por qué: "Sobre nosotros" corporativo (es una casa
pequeña, no un "nosotros"; H-9 decide si aparece una persona con nombre); blog;
equipo; carrusel de logos de clientes (no hay permiso); FAQ genérica (las
objeciones reales ya están en S6 y S8); precios de catálogo (§1.E).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 5 · REGISTRO VISUAL Y PALETA (tokens completos, contrastes medidos)         ║
╚═════════════════════════════════════════════════════════════════════════════╝

5.A EL REGISTRO, DECIDIDO Y JUSTIFICADO
Quien mira es un CLIENTE AFUERA, no un trabajador adentro ⇒ registro de VENTA.
Está pagado con un rechazo textual del dueño el 2026-08-05 sobre otra landing:
*"muy minimalista… quiero que esta landing sea más interactiva, más llamativa"*
(`ORION/memory/landings/state.json` POL-001). El manifiesto sobrio de la casa es
para el INTERIOR de las apps, no para esta portada (`EMPRESA.md:82-84`).
PERO no caigas al otro extremo: le vende criterio y seriedad a alguien que va a
confiarle la cara y las cuentas de su negocio. El punto exacto es
**EDITORIAL CON CUERPO**: bandas alternadas oscuro/claro, cifras enormes, bloques
de color plano, sombras duras, cero ruido decorativo.
POR QUÉ EL HÉROE ES OSCURO, dicho como decisión y no como ley: aquí el producto
son PANTALLAS, y una pantalla brilla sobre fondo oscuro; además el mecanismo del
héroe (fondo que cambia de color por negocio, ficha 01) está medido como muerto
sobre fondo claro (`referencias/_INDEX.md:16`). No se extrapola la regla de
comida (KN-009): se aplica su mecánica al producto que sí tenemos.

5.B TOKENS — bloque `:root` listo para pegar (si un color no está aquí, no existe)
```css
:root{
  /* superficies */
  --noche:#12100E;   /* fondo de bandas oscuras (negro cálido) */
  --noche-2:#1C1916; /* superficie elevada sobre noche */
  --papel:#F8F6F2;   /* fondo de bandas claras */
  --tarjeta:#FCFBF8;
  --borde:#E7E4DE;
  --hover:#F2EFE9;
  /* tinta */
  --tinta:#111111;
  --gris:#666666;
  --claro:#F8F6F2;   /* texto sobre noche */
  --claro-2:#C9C2B8; /* texto secundario sobre noche */
  --claro-3:#8A8177; /* terciario sobre noche, solo >=16px */
  /* acentos */
  --verde:#2F5D50;   /* acento de marca PROVISIONAL, origen precios.html:9 */
  --verde-cl:#5E9E85;/* el mismo acento cuando va SOBRE noche */
  --ambar:#E8A83A;   /* la plata: cifras grandes, solo sobre noche */
  --teja:#C2452D;    /* la fuga/el enemigo, sobre papel */
  --teja-cl:#E5623E; /* la fuga sobre noche */
  --wa:#25D366;      /* verde WhatsApp: EXCLUSIVO del CTA, ningún otro uso */
  /* forma */
  --r-card:14px; --r-pill:999px;
  --sombra:0 18px 40px rgba(18,16,14,.18);
  --sombra-dura:6px 6px 0 rgba(18,16,14,.14);
}
```

5.C TIPOGRAFÍA — el `<link>` va literal, no lo cambies
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
```
 • Titulares y cifras: **Fraunces** 700, `letter-spacing:-.02em`,
   `line-height:.95`. Escala: h1 `clamp(34px,9vw,72px)`; cifra grande
   `clamp(44px,13vw,96px)`; h2 `clamp(26px,6.4vw,44px)`.
 • Cuerpo, botones y etiquetas: **Manrope** 400/700, `line-height:1.5`, mínimo
   16 px (nunca menos: el visitante es un señor mirando al sol).
 • Respaldo obligatorio en la pila: `Fraunces, Georgia, serif` y
   `Manrope, "Segoe UI", system-ui, sans-serif`, para que el archivo abierto con
   `file://` sin red no se caiga.
 • Cifras siempre `font-variant-numeric: tabular-nums`.
 • ESTAS FAMILIAS SON PROVISIONALES (H-3): cuando exista el manual de marca de
   Prommter, se cambian en un solo sitio.

5.D CONTRASTES YA MEDIDOS (WCAG 2.1, calculados para este prompt — no estimados)
 PASAN, úsalos con confianza:
  #111111 / #F8F6F2 = 17.49 · #666666 / #F8F6F2 = 5.32 · #2F5D50 / #F8F6F2 = 6.94
  #F8F6F2 / #2F5D50 = 6.94 (texto claro dentro del botón verde) ·
  #2F5D50 / #FCFBF8 = 7.24 · #C2452D / #F8F6F2 = 4.65 ·
  #F8F6F2 / #12100E = 17.59 · #C9C2B8 / #12100E = 10.75 ·
  #8A8177 / #12100E = 4.96 · #E8A83A / #12100E = 9.12 ·
  #5E9E85 / #12100E = 6.06 · #E5623E / #12100E = 5.56 ·
  #25D366 / #12100E = 9.57 · #111111 / #25D366 = 9.52 (tinta sobre el CTA verde) ·
  #111111 / #E8A83A = 9.08 (tinta sobre ámbar de fondo).
 FALLAN — PROHIBIDAS, y son justo las que pide el instinto:
  ✗ #E8A83A sobre #F8F6F2 = **1.93** (ámbar como texto sobre papel: invisible).
  ✗ #B98A3C sobre #F8F6F2 = **2.88** — el ocre canónico de la casa NO sirve como
    texto sobre fondo claro; si quieres el "color de la plata que se va" sobre
    papel, usa `--teja #C2452D` (4.65) o ámbar de FONDO con tinta encima (9.08).
  ✗ #2F5D50 sobre #12100E = **2.53** (el verde de marca sobre noche: usa
    `--verde-cl #5E9E85`, 6.06).
  ✗ #C2452D sobre #12100E = **3.78** (usa `--teja-cl #E5623E`, 5.56).
  ✗ #4D7C59 sobre #F8F6F2 = **4.48**: solo para texto ≥ 24 px o ≥ 18.66 px bold.

5.E DENSIDAD, IDIOMA Y TRATO
 • Densidad más alta que en el interior de una app: cada sección un solo mensaje,
   con peso visual (número grande + frase corta + prueba). Aire generoso ENTRE
   bloques, no dentro.
 • Español de Colombia, **de USTED**. Cero anglicismos: nada de growth,
   engagement, funnel, landing, e-commerce, workflow, dashboard. Se dice
   "página", "pedidos", "panel", "reporte", "caja", "cuentas".
 • Frases cortas. Si una frase no la diría en voz alta en un mostrador, se
   reescribe.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 6 · INTERACCIÓN — QUÉ RESPONDE Y POR QUÉ VENDE                              ║
╚═════════════════════════════════════════════════════════════════════════════╝
Cada una se justifica o se cae. Los milisegundos están en el ANEXO B.
 I1 **Selector de negocio en el héroe** (4 piezas, flechas + swipe). Vende porque
    el visitante se ve a sí mismo en 3 segundos: es el "esto me habla a mí". Y su
    elección viaja al mensaje de WhatsApp.
 I2 **Calculadora de comisión** (S2). La interacción principal: convierte un
    precio abstracto en una pérdida concreta y propia, que es el método de venta
    documentado (`precios-v2.html:209-211`).
 I3 **Demo de pedido** (S4). Es la única prueba de producto disponible sin URLs
    ni capturas (§3.B). El visitante confirma un pedido y lo VE entrar al panel.
 I4 **Selector de nivel que reconfigura la demo** (S7 → S4). Conecta cada nivel
    con algo visible en pantalla, en vez de una lista de viñetas.
 I5 **Barra de WhatsApp fija en móvil**. Estos clientes compran por WhatsApp
    desde el celular; el CTA nunca a más de un pulgar.
 I6 **Aparición al entrar en pantalla** (IntersectionObserver, 12 px + opacidad).
    Da vida sin ruido.
MOVIMIENTO PROHIBIDO: parallax de página completa, carruseles automáticos, texto
que se escribe solo, partículas, contadores de urgencia, cursores personalizados,
scroll secuestrado, y cualquier animación infinita que no sea el pedido de la
mini-demo.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 7 · RESTRICCIONES TÉCNICAS REALES (verificadas en disco)                    ║
╚═════════════════════════════════════════════════════════════════════════════╝
 • ENTREGABLE: **un solo archivo `index.html` autocontenido**, con todo el CSS en
   `<style>` y todo el JS en `<script>` dentro del propio archivo. Única petición
   externa permitida: el `<link>` de Google Fonts del §5.C (más los dos
   `preconnect`). Nada más: cero CDN de JS, cero imágenes externas, cero
   analíticas.
   Razones verificadas: (1) `C:\Users\Kalel\prommter` **no tiene `package.json`**
   ni toolchain en la raíz — no hay build que reutilizar; (2) es la convención de
   la casa para landings: `prommter/proyectos/pollo-landing/index.html` es un
   único archivo de 39.093 B (`PROYECTOS.md:40-43`); (3) la única conversión es
   un enlace `wa.me`, así que no hace falta backend ni formulario.
 • DÓNDE VIVE: `C:\Users\Kalel\prommter\web\index.html` (carpeta nueva; hoy la
   raíz de `prommter` solo tiene EMPRESA.md, PLAN-MIGRACION.md, PROYECTOS.md,
   documentos/, equipo/, memory/, proyectos/, reportes/). Si el dueño prefiere
   otra ruta, es lo único de este apartado que se puede mover.
 • IMÁGENES: **ninguna**. Todo se dibuja con CSS y SVG inline — teléfonos,
   pantallas, iconos, grano. Motivo doble: no hay fotos aprobadas de ningún
   cliente (§3.B) y las fotos de stock están prohibidas (§8).
 • PESO OBJETIVO: < 180 KB el archivo. Referencia medida: la landing de pollo
   pesa 39 KB entera.
 • NAVEGADOR OBJETIVO: Chrome/Edge y WebView de Android de gama media. Móvil
   primero (360-430 px). JS moderno sin módulos externos, sin transpilar.
 • STACK DE LA CASA, por si algún día se migra a Next: Next.js + React +
   Tailwind 4 + TypeScript estricto (`EMPRESA.md:72-74`). NO es necesario aquí y
   no lo uses: encarece sin aportar.
 • PUBLICACIÓN: Vercel Hobby (gratis) es lo que la casa ya paga como costo fijo
   (`precios-v2.html:76`) y Hostinger para dominios (`:77`). Los push se hacen a
   mano por GitHub Desktop (`EMPRESA.md:85-87`) — crear el repo es un paso aparte,
   no parte de este entregable.
 • MÁQUINA: Node v24.16.0 (verificado). QA visual con
   `node C:\Users\Kalel\ORION\tools\edge-cdp.mjs` (existe, ver §10).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 8 · PROHIBIDO EN ESTE PROYECTO                                              ║
╚═════════════════════════════════════════════════════════════════════════════╝
 1. **Presentar el servicio como pago único**, o cualquier sinónimo. Regla dura
    del dueño (`prommter/KN-003`, `EMPRESA.md:59-62`).
 2. **Inventar cifras sociales**: años de experiencia, número de clientes,
    testimonios, "+X negocios confían", premios, alianzas, porcentajes de
    resultado, tiempos de entrega. Nada de eso existe en las fuentes.
 3. **Nombrar clientes** (Villa Broaster, Mercaplaza, Super Arroz del Norte, los
    estancos, Orama, la avícola) mientras `clientesConPermiso` sea false. Orama
    además no ha firmado (`PROYECTOS.md:48`) y la avícola tiene marca pendiente
    (`:40-43`).
 4. **URLs, "ver el sitio" o capturas de trabajos**: ninguno está publicado
    (§3.B).
 5. **Publicar cifras de precio** con `mostrarPrecios = false`; los documentos
    fuente están rotulados "Documento interno · No compartir con clientes"
    (`precios.html:44`, `precios-v2.html:47`).
 6. **Fotos de stock**: oficinas, equipos sonriendo, manos sobre un portátil,
    ilustraciones 3D de startup, iconos de librería. Cero.
 7. **Azules eléctricos, morados, neones y gradientes tecnológicos.** Prohibición
    permanente de la casa. Ojo: NO uses los colores `--n1/--n2/--n3` de
    `precios-v2.html:9` (son codificación interna de un documento para imprimir,
    y el vino `#7a4a6e` roza el morado).
 8. **Minimalismo vacío.** Ya fue rechazado textualmente: *"muy minimalista…
    quiero que esta landing sea más interactiva, más llamativa"* (POL-001).
 9. **Portada clara y plana.** Rechazada el 2026-08-23 con *"todo se ve muy
    genérico, apagado"* (KN-009). "Genérico" = lista de filas con círculo de
    inicial, chips arriba, todo centrado y simétrico: no hagas eso.
10. **Jerga técnica en el copy público**: tests, Next.js, Supabase, n8n, Vercel,
    puertos, "multi-tenant", "local-first". No le dicen nada a una peluquería.
11. **La IA como protagonista**: nada de chatbot flotante ni "impulsado por IA"
    en el titular. Es una capacidad del nivel 3 (`precios-v2.html:241`), no la
    promesa de portada.
12. **Copiar la estética de `precios-v2.html`**: es una hoja para imprimir, no una
    pieza de venta.
13. **Ventanas emergentes, banner de cookies decorativo, urgencia falsa**
    ("quedan 3 cupos"), y cualquier promesa que el dueño no pueda cumplir por
    WhatsApp mañana.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 9 · HUECOS DEL DUEÑO — cada uno con SU SITIO DIBUJADO EN LA PANTALLA        ║
╚═════════════════════════════════════════════════════════════════════════════╝
Todos se editan en un único objeto `CONFIG` al principio del `<script>`. Los
tokens sin resolver se ven EN PANTALLA, en una píldora `--ambar` con tinta encima
(9.08 de contraste) y el texto "lo confirma el dueño". Nunca `sr-only`, nunca en
blanco, nunca con un valor verosímil: un placeholder tiene que ser increíble, no
creíble.

 H-1 **WhatsApp de Prommter** — BLOQUEANTE DE PUBLICACIÓN. No existe ningún
     número en todo el repo (verificado con grep). Placeholder obligatorio:
     `573001234567`, visible, con la píldora al lado. Es la única acción del
     sitio: sin esto la landing no se publica.
 H-2 **Ciudad y zona de cobertura** [[CIUDAD]]. Los documentos dicen "tu ciudad"
     sin nombrarla (`precios-v2.html:331`). Dos clientes están en Popayán, pero
     eso es de ellos, no de Prommter. Sitio: bajo el CTA del héroe y en el pie.
 H-3 **Identidad**: logo (o inicial tipográfica), paleta y tipografías
     definitivas. Hoy no existe manual de marca (`equipo/README.md:12`). La
     landing sale completa con la paleta provisional del §5; el día que exista,
     se cambian 12 valores en un sitio.
 H-4 **Dominio y correo.** No constan en ninguna fuente. Sitio: pie.
 H-5 **Permiso escrito de cada cliente** para nombrarlo (4 decisiones: asadero,
     plaza, arrocera, estancos; la inmobiliaria solo cuando firme). Sin permiso
     los casos quedan anónimos y la landing funciona igual.
 H-6 **¿Se publican cifras de precio?** Sí / "desde X" / ninguna. Por defecto
     ninguna. El bloque con los rangos exactos ya está escrito detrás del
     interruptor.
 H-7 **Permanencia mínima en meses** (y penalidad). Sigue "a definir" en la única
     propuesta real (`plan-servicio-orama.html:1116`) y `precios.html:281-285`
     avisa que sin ese número la modalidad sin instalación es un regalo. Sitio:
     S6, junto a "permanencia acordada por escrito".
 H-8 **Tiempos de entrega por nivel.** No están definidos. Sitio: S9, paso 3,
     como "__ días".
 H-9 **¿Aparece una persona con nombre (y foto)?** A un negocio de barrio le
     compra confianza saber quién está detrás. No consta en el repo.
 H-10 **¿Se factura formalmente?** El propio documento lo marca como pendiente
     (`precios-v2.html:332`). Afecta a los clientes que exigen factura y al pie.
 H-11 **¿Autoriza usar capturas reales de los sistemas** (con datos de ejemplo)
     en vez de pantallas dibujadas? Hoy la demo se dibuja entera.
 H-12 **Redes sociales.** No constan; el pie va sin iconos sociales.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 10 · CRITERIOS DE ACEPTACIÓN (verificables, no opinables)                   ║
╚═════════════════════════════════════════════════════════════════════════════╝
FUNCIONALES
 A1 La calculadora con 60 × 30.000 muestra exactamente **1.800.000** de venta y
    **360.000 – 540.000** de comisión (debe coincidir con `precios-v2.html:205-207`).
    Segundo juego a mano: 100 × 25.000 → 2.500.000 y 500.000 – 750.000.
 A2 Un solo destino de conversión: buscar `wa.me` y comprobar que **no hay**
    `<form>`, `mailto:` ni `tel:` (0 apariciones de cada uno).
 A3 El `href` del WhatsApp cambia al mover los deslizadores y al cambiar de
    negocio en el héroe (léelo dos veces con valores distintos).
 A4 La demo de S4: al confirmar el pedido aparece en el panel derecho en < 1 s y
    sus cuatro estados avanzan al tocarlos.
 A5 Con JavaScript desactivado, el texto de las 11 secciones sigue legible y el
    botón de WhatsApp sigue funcionando.
 A6 Los tokens sin resolver ([[CIUDAD]], `573001234567`) se ven en pantalla con
    su píldora. Búsqueda: 0 apariciones de `sr-only` o `display:none` alrededor
    de ellos.
 A7 Ningún nombre de cliente en el archivo con `clientesConPermiso = false`:
    buscar "Villa Broaster", "Mercaplaza", "Super Arroz", "Orama" y "Buenavista"
    → 0 resultados fuera del bloque `CONFIG` comentado.
 A8 Peso del archivo < 180 KB. Peticiones externas: exactamente 3 (2 preconnect
    + 1 stylesheet de Google Fonts) y ninguna más.

VISUALES — la verdad de terreno es Edge por CDP, NUNCA el navegador embebido ni
`msedge --screenshot` (está medido que miente el ancho: da un viewport de 492 px
y recorta el PNG a 390, y reporta `prefers-reduced-motion: reduce` por defecto —
`ORION/memory/landings/state.json` KN-003):
```
node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url "file:///C:/Users/Kalel/prommter/web/index.html" ^
  --width 390 --height 844 --mobile --wait 2500 --shot movil-heroe.png ^
  --eval "JSON.stringify({cta:document.querySelector('[data-cta-principal]').getBoundingClientRect().bottom, calc:document.querySelector('#calculadora').getBoundingClientRect().top, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, fuentes:[...document.fonts].map(f=>f.family), anim:document.getAnimations().length})"
```
 A9  `cta ≤ 720` (el botón principal se alcanza sin scroll) y `calc ≤ 1000`
     (la calculadora empieza antes de una pantalla y cuarto).
 A10 `sw === cw === 390`: cero desbordamiento horizontal.
 A11 Luminancia media de los PÍXELES de `movil-heroe.png` **< 0.12**. Medida
     sobre la imagen, no leyendo `backgroundColor`: leyendo CSS, el fallo de
     2026-08-23 pasaba en falso (0.0030 declarado contra 0.6585 real).
 A12 `fuentes` contiene **Fraunces y Manrope** (dos familias, no una, y ninguna
     `system-ui` como familia principal del cuerpo).
 A13 Contraste: cada par usado está en la lista de §5.D que PASA. Ninguno de los
     cinco pares prohibidos aparece en el archivo.
 A14 Tap targets: todo botón y control con `getBoundingClientRect().height ≥ 44`.
 A15 Repetir capturas a 1440×900 y de las anclas `#calculadora`, `#niveles`,
     `#demo`, `#trabajo`, `#cierre`. Abrir los PNG uno por uno.
 A16 Consola sin errores ni advertencias al cargar y después de tocar
     calculadora, héroe, niveles y demo.
 A17 El entregable no contiene carpeta `_ds/`, ni `theme.json`, ni
     `_adherence*.json`, ni `<link>` a un `styles.css` externo (armadura §0).
 A18 PRUEBA DEL BOCHORNO: pon la captura móvil al lado de la de
     `pollo-landing/index.html`. Si esta se ve más pobre, no está lista — es la
     muestra del producto que vende.

AUTOCHEQUEOS QUE TE HACES SOLO ANTES DE ENTREGAR (contéstalos mirando el PNG):
 · ¿El fondo de la primera pantalla es oscuro? Si es claro o crema, está mal.
 · ¿Se ven DOS tipografías distintas entre titular y cuerpo?
 · ¿Hay una cifra tan grande que se lee a un metro de distancia?
 · ¿Se ve algo cortado por el borde (el teléfono lateral)? Si todo cabe centrado
   y simétrico, quedó genérico.
 · ¿El botón verde de WhatsApp aparece sin hacer scroll?
 · ¿Se ve el sello "productos de ejemplo" en la demo?
 · ¿Aparecen las píldoras de hueco (WhatsApp y ciudad)?

╔═════════════════════════════════════════════════════════════════════════════╗
║ 11 · REFERENCIAS COMBINADAS (biblioteca de la casa, una por zona)           ║
╚═════════════════════════════════════════════════════════════════════════════╝
Fuente: `C:\Users\Kalel\ORION\prompts-landing\referencias\`. Se copia el
MECANISMO, jamás la marca, los textos, las imágenes ni los datos de la referencia.

 ZONA HÉROE — **ficha 01** (`01-hero-carrusel-figuras-toonhub.md`)
  Qué se toma: (a) cuatro piezas con ROLES por índice —centro nítido, laterales
  pequeñas y difuminadas, cuarta al fondo—, ancladas al borde inferior; (b) el
  FONDO CAMBIA DE COLOR con la pieza activa; (c) texto fantasma gigante detrás.
  Traducción: las piezas son cuatro teléfonos con la vitrina de cuatro tipos de
  negocio; el color es el del negocio activo; el fantasma es la palabra del
  negocio.
  Por qué vende: el visitante pasa por cuatro negocios en tres segundos y ve el
  suyo. Es el "esto me habla a mí" del §2, y no se puede lograr con una foto.
  Corrección obligatoria por veredicto pagado (`referencias/_INDEX.md:16`): este
  mecanismo **solo vive sobre fondo oscuro** (sobre claro el fantasma muere) y
  **necesita la pieza lateral cortada por el borde**, o los roles se leen como
  discos quietos. Ambas condiciones están puestas en S1.
  Lo que NO se copia: "TOONHUB", "3D SHAPE", el testimonio, las figuras, los
  pasteles #F4845F/#6BBF7A/#E882B4/#6EB5FF (azul y rosa chocan con POL-001).

 ZONA PRODUCTO/CIFRA — **ficha 02** (`02-scroll-cinematografico-capas-mostar.md`)
  Qué se toma, y SOLO esto: el patrón **"dato grande + una línea"**.
  Dónde: la cifra de comisión en S2, los tres datos de S4 (2 toques / 6 toques /
  $0) y el "4 sistemas · 1 en uso todos los días" de S5.
  Por qué vende: es **el mecanismo más resistente de la biblioteca** —"no depende
  de gesto ni de tiempo, se ve en una captura"— y es lo único que sobrevivió sin
  crítica al rechazo del 2026-08-23 (`_INDEX.md:17`).
  Lo que NO se toma: el rail de 3700 px de scroll, la escena pegada con capas
  PNG, el parallax de puntero y el azul #79b7dd. En móvil el rail es demasiado
  pulgar y aquí no hay fotos que apilar.

 ZONA CIERRE — **ficha 03** (`03-hero-spotlight-revela-segunda-imagen-lithos.md`)
  Qué se toma: **un solo acento cálido sobre fondo oscuro** en el CTA, y el foco
  radial suave — pero **YA PUESTO**, no siguiendo al dedo.
  Por qué así: su veredicto está pagado: en el intento anterior el foco por gesto
  "ni apareció" porque el dueño revisa capturas quietas (`_INDEX.md:18`). Se usa
  solo con su estado en reposo resuelto (S10).
  Por qué vende: concentra toda la atención en el único botón de la página cuando
  el visitante ya tiene su cifra de pérdida en la cabeza.
  Lo que NO se copia: "Lithos", los textos de geología, Playfair Display, las
  imágenes de cloudfront, la máscara por `canvas.toDataURL()` (cara y basura).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 12 · ADAPTACIÓN MÓVIL (390 px es el diseño, no la excepción)                ║
╚═════════════════════════════════════════════════════════════════════════════╝
El móvil es canal principal declarado por el dueño (`ORION/memory/landings/
state.json` POL-003). Se diseña a 390 y el escritorio es esa columna crecida.

 De la ficha 01 (héroe):
  · Alturas en `100dvh`, nunca `100vh` (la barra del navegador se come el CTA).
  · El teléfono central escala a 62 % del ancho (≈242 px); el lateral derecho
    asoma **cortado a la mitad** por el borde; el cuarto (fondo) SE ESCONDE en
    < 640 px — con cuatro piezas en 390 px no se lee ninguna.
  · Gesto: **swipe horizontal** sobre la zona de los teléfonos (`touch-action:
    pan-y` para no matar el scroll vertical) + dos flechas circulares de 44 px.
    El hover no existe: no puede ser el único camino a nada.
  · Texto fantasma baja a `clamp(84px, 26vw, 140px)` y a opacidad .05 para no
    ensuciar el teléfono.
  · El párrafo largo del héroe se esconde en < 640 px; quedan titular + una línea
    + CTA. Es lo que exige la medida A9 (cta ≤ 720).
 De la ficha 02 (dato grande):
  · La cifra pasa a `clamp(44px,13vw,96px)`; los tres datos de S4 se apilan en
    una fila de 3 columnas estrechas con la etiqueta debajo, no al lado.
  · Deslizadores: pista de 8 px, pulgar de 28 px, y **campo numérico visible al
    lado** — en un celular al sol nadie afina un deslizador.
 De la ficha 03 (cierre):
  · El foco es estático (radial fijo). Si hay puntero fino
    (`@media (hover:hover) and (pointer:fine)`) puede seguir al cursor; en táctil
    NO se activa `touchmove`, porque secuestra el scroll.
 Transversal:
  · Tap targets ≥ 44 px en TODO control (criterio A14).
  · Imágenes: no hay (todo CSS/SVG). Presupuesto del archivo < 180 KB.
  · `prefers-reduced-motion: reduce` ⇒ se apagan carrusel automático, entradas y
    contador animado; **el contenido queda en su estado final visible**, nunca
    oculto esperando una animación que no va a correr.
  · Se mide a 390×844 con `edge-cdp.mjs --mobile` (§10) y también a 1440×900. El
    veredicto del dueño se registra POR CANAL, móvil y escritorio por separado.

╔═════════════════════════════════════════════════════════════════════════════╗
║ ANEXO A · OBJETO `CONFIG` (todo lo editable, en un solo sitio)              ║
╚═════════════════════════════════════════════════════════════════════════════╝
```js
const CONFIG = {
  marca: "Prommter",              // REAL — EMPRESA.md:1
  whatsapp: "573001234567",       // ← HUECO H-1. CAMBIAR ANTES DE PUBLICAR
  ciudad: "[[CIUDAD]]",           // ← HUECO H-2
  correo: "",                     // ← HUECO H-4 (vacío = no se pinta)
  mostrarPrecios: false,          // ← HUECO H-6
  clientesConPermiso: false,      // ← HUECO H-5
  permanenciaMeses: null,         // ← HUECO H-7 (null = se pinta "__ meses")
  diasEntrega: { presencia:null, operacion:null, automatizacion:null }, // H-8
  // Nombres reales: SOLO se pintan si clientesConPermiso === true
  clientes: { asadero:"", plaza:"", arrocera:"", estancos:"" }
};
```

╔═════════════════════════════════════════════════════════════════════════════╗
║ ANEXO B · COREOGRAFÍA — PARA LA FASE DE CÓDIGO, NO PARA EL LIENZO           ║
╚═════════════════════════════════════════════════════════════════════════════╝
No se le exige a un generador de artboards; se le exige a quien programe el
`index.html`. Curva por defecto `cubic-bezier(.4,0,.2,1)`.

 A1 Cambio de negocio en el héroe: TODO a la vez (color de radial, posición,
    escala, blur, opacidad) en **650 ms**, con lock `estaAnimando` para que dos
    toques seguidos no se encadenen.
 A2 Entrada del héroe al cargar: opacidad 0→1 + `translateY(18px→0)`, **520 ms**,
    escalonada 0 / 90 / 180 ms (fantasma, teléfonos, titular+CTA). Una sola vez.
 A3 Contador de la calculadora: interpolación de la cifra en **380 ms**,
    `ease-out`; sin rebote.
 A4 Pedido que entra en la demo: la tarjeta cae desde −14 px con opacidad 0→1 en
    **240 ms** y el punto de aviso pulsa 2 veces (600 ms cada pulso). Fin.
 A5 Cambio de estado del pedido: el chip anterior se va con `scale(.94)` +
    opacidad 0 en **160 ms**; el nuevo entra en **200 ms**.
 A6 Selector de nivel: la tarjeta activa sube 6 px y gana sombra en **200 ms**.
 A7 Aparición al hacer scroll (IntersectionObserver, `threshold .18`, una vez):
    opacidad + `translateY(12px)`, **260 ms**, escalón de 60 ms entre hermanos.
 A8 Botón: `scale(1.03)` en **150 ms** al presionar; sombra dura que se acorta.
 PRESUPUESTO: máximo 6 elementos animándose a la vez; `will-change` solo mientras
 dura la transición y se quita al terminar (nunca permanente).
 PROPIEDADES PROHIBIDAS DE ANIMAR: `width`, `height`, `top`, `left`, `margin`,
 `box-shadow` en bucle, `filter: blur()` sobre áreas grandes en móvil. Solo
 `transform` y `opacity`.
 `prefers-reduced-motion: reduce` ⇒ todo lo anterior se salta y el contenido
 aparece en su estado final.
═══════════════════════════════════════════════════════════════════════════════
