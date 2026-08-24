---
slug: pantalla-publica
titulo: Qué tiene que lograr una pantalla que mira un cliente
alias: [landing, landings, lending, landin, pagina publica, pagina publica de ventas, pagina del cliente, la pagina que ve el cliente, pagina web, pagina, web, sitio, sitio web, portada, portadas, home, inicio, hero, heroe, encabezado, pliegue, above the fold, primera pantalla, lo primero que se ve, vitrina, vitrinas, escaparate, catalogo publico, tienda, tienda en linea, ecommerce, carrito, menu publico, carta, demo comercial, maqueta de venta, cara al cliente, cliente afuera, publico, de cara al publico, vender, venta, vende, que venda, conversion, convertir, captacion, captar, leads, registro, formulario, formularios, campos, cuantos campos, cta, boton, boton principal, llamado a la accion, accion principal, whatsapp, remate, movil, movil primero, mobile first, celular, en el celular, pantalla del celular, desde el celular, telefono, responsive, 390, 390px, 480, canal principal, canal real, que va primero, que va arriba, arriba del todo, orden de las secciones, orden de la pagina, jerarquia, apagado, apagada, generico, generica, minimalista, muy minimalista, vacia, pobre, sosa, llamativa, llamativo, divertido, colorido, mas color, subirle el color, que de gusto verlo, registro visual, tono, direccion de arte, manifiesto, estudio del ingeniero moderno, calma, rechazo, rechazado, me la rechazaron, no le gusto, rehacer, sobrecorregir, referencias, fichas, mecanismo, tokens compartidos, globals css, grep consumidores, cambiar un color, paleta, app vs landing, diferencia entre la app y la pagina, adentro y afuera, interior de la app, pos, dashboard]
preguntas: ["que debe tener la pagina que ve el cliente", "como hago que la landing venda", "que pongo en la portada", "cual es la diferencia entre la app y la pagina publica", "el dueño dice que la landing esta muy apagada y generica, que le cambio?", "la landing puede usar el mismo estilo del sistema por dentro?", "cuantos campos le pido en el formulario de captacion?", "puedo subirle el color a los tokens pa que la portada venda mas?", "el cliente rechazo el diseño, rehago todo o solo lo que critico?", "que va primero en el celular", "en que orden pongo las secciones de la pagina", "cuantos botones pongo en la portada"]
proyectos: [landings, villa-broaster, placita, pollo-landing, infrapilot, orama]
confianza: alta
actualizado: 2026-08-24
---

# Qué tiene que lograr una pantalla que mira un cliente

## Respuesta corta

Pregúntate **quién mira**, y no lo contestes con "público vs privado" sino con **qué
necesita SENTIR esa persona para comprar**: al que va a pedir comida se le vende con
producto gigante, fondo oscuro, color y movimiento; al ingeniero que va a vivir horas
dentro de la app se le vende con la misma **calma** del interior, porque la calma es el
producto. Después, **una sola acción principal**, alcanzable sin scroll y con su estado
siempre a la vista —y pregúntale antes lo único que necesitas para cumplirla (sede,
canal) en vez de asumirlo por él—. **Diseña a 390 px**: el móvil es el canal, el
escritorio es esa misma columna centrada. Y **mide**: si lo primero que se puede pedir
queda a dos pantallas y media, la portada no está vendiendo. Nada que prometas en
pantalla puede ser algo que el servidor no vaya a honrar.

## Por qué (qué lo pagó)

**Lo pagó un rechazo con nombre y fecha.** El 2026-08-05, sobre la portada de la
placita, el dueño escribió textual: *"la landing que haces es una basura… muy
minimalista… quiero que esta landing sea más interactiva, más llamativa, es para vender
frutas"* (`landings/POL-001`). Lo que se había hecho no estaba mal ejecutado: estaba
**en el registro equivocado**. Se le había aplicado a una vitrina el manifiesto visual
del *estudio del ingeniero moderno* (`infrapilot/DEC-010`), que existe para que un
trabajador aguante ocho horas adentro sin cansarse. Adentro, el aire vacío es descanso;
afuera, el mismo aire vacío se lee como **negocio pobre**.

**Y se pagó otra vez, 18 días después, en el mismo error de fondo.** El 2026-08-23, con
la portada de Villa Broaster en crema y la carta en oscuro, el veredicto fue *"quiero
mejor fondo… todo se ve muy genérico, apagado, hazlo divertido, llamativo, que dé gusto
verlo"* (`landings/KN-009`, capturas `cap-top.png` / `cap-carta.png` a 390×844). **La
primera palabra del reclamo fue FONDO**: en comida es lo primero que se juzga, antes que
la tipografía y antes que el copy.

**Hay un número que dice mejor que ningún adjetivo qué falla en una portada.** La
medición base del build de Mercaplaza al 2026-08-19, a 390×844: documento **3616 px**,
héroe **963 px**, y **la primera tarjeta que se podía pedir en `y=1994`, o sea 2,4
pantallas de scroll** (`landings/KN-002`). Una pantalla pública cuya acción vive a dos
pantallas y media de distancia no es una portada apagada: es una portada que **no tiene
dónde comprar**.

**El silencio de la pantalla también cuesta.** El barrido de QA del 2026-08-23 encontró
que la vitrina de Villa Broaster **ignoraba `?sede=` y nunca preguntaba la sede**, así
que **todo el mundo caía en Villa del Viento** — con dos locales abiertos
(`villa-broaster/KN-015`). El arreglo quedó escrito en el propio código como contrato:
*"primero la URL, luego lo guardado, luego el default… Si ninguna de las dos primeras
existe, es la primera visita de alguien a secas: **se le pregunta en vez de asumir Villa
del Viento por él**"* (`villa-app/lib/carrito.ts:195-202`), y la señal
`abrirSedesInicial` existe *"en vez de dejar a alguien pidiendo en Villa del Viento sin
saber que existe Vía al Bosque"* (`:176-181`). Del mismo barrido: el banner de promo
**solo de Villa del Viento se mostraba aunque la sede activa fuera Vía al Bosque**.

**El formulario se pagó con un rechazo de frente.** La v1 de la landing B2B de pollo
pedía **8 campos** de ficha comercial —razón social, NIT, tipo, contacto, teléfono,
email, ciudad, productos, volumen— y se cayó entera. `pollo-landing/DEC-002` la
reemplazó por **4 obligatorios**, con el objetivo escrito: *"fidelizar al máximo — pedir
solo lo necesario para reenviar incentivos por el canal preferido y saber qué volumen
maneja"*. El cambio se ve medido en `metrics.json`: sesión 2026-08-08 *"validacion
bloquea envio vacio 8/8 campos"* → sesión 2026-08-09 *"envio vacio marca 4 campos sin
guardar"*.

**Y una promesa de pantalla que el servidor no puede honrar es una trampa de checkout.**
En villa-app el servidor **congela los precios del catálogo al crear la orden**, así que
un "antes/ahora" en la UI de promos haría que el carrito prometa menos de lo que la
orden confirma; por eso las promos ahí **venden curaduría, no rebajas inventadas**
(`villa-broaster/KN-009`). La regla derivada es dura y sirve para toda pantalla pública:
**si la UI promete un número, el servidor tiene que poder honrar exactamente ese
número**.

## Cómo se aplica

1. **Elige registro por quién mira, y escríbelo antes de diseñar.** Cliente comprando →
   producto protagonista, color y movimiento con gusto (cálida de base + acentos del
   propio producto), interactividad real, **cero fotos de stock genéricas**. Trabajador
   adentro → manifiesto al pie de la letra (`landings/POL-001`). **En los dos casos
   siguen prohibidos** los azules eléctricos, morados, neones y gradientes tecnológicos.
   Antes de aplicar la regla, lee la excepción de InfraPilot en *Cuándo NO aplica*: el
   eje real no es adentro/afuera.
2. **Una sola acción principal por pantalla, y que su estado no se esconda.** En
   villa-app la barra del carrito *"aparece pegada abajo apenas cae la primera cosa y no
   se va más"*, porque *"en un pedido de comida la pregunta que se repite es '¿en cuánto
   voy?', y responderla sin abrir nada es la diferencia entre seguir pidiendo y abandonar
   el carrito"* (`components/tienda/BarraCarrito.tsx:4-13`). En Orama la acción única es
   otra y también está declarada: **todo el tráfico remata en WhatsApp**, con dos embudos
   separados —"Tengo un inmueble" para propietarios y catálogo para buscadores—
   (`orama/DEC-003`).
3. **Mide la distancia hasta esa acción, a 390×844, antes de discutir estética.** Si la
   primera cosa pedible cae después de una pantalla, muévela; `y=1994` fue el diagnóstico
   real de una portada que "se veía apagada" (`landings/KN-002`). Captura con
   `edge-cdp.mjs --width 390 --mobile --shot` y **abre el PNG**: Edge headless tiene piso
   de viewport ~480-500 px y el `--screenshot` plano miente (ver
   [[TEMA-verificar-con-evidencia]]).
4. **Pregunta lo mínimo que necesitas para cumplir la acción, en vez de asumirlo.**
   Precedencia explícita —URL > guardado > default— y **si no hay ninguno, se abre solo
   el selector** (`villa-app/lib/carrito.ts:159-167, 195-202`). Un default silencioso en
   una pantalla pública no es un default: es un pedido mandado al local equivocado.
5. **Móvil primero de verdad, no "responsive".** El dueño lo dijo así: *"que también
   aprenda a adaptar esas combinaciones para móvil, que es uno de nuestros canales
   principales"* (`landings/POL-003`). En villa-app eso se ve en el código: la vitrina es
   **una columna de 480 px centrada incluso en escritorio, a propósito**
   (`app/globals.css:153`, `components/tienda/BarraCarrito.tsx:29`,
   `components/tienda/Hoja.tsx:63`, decisión registrada en `villa-broaster/KN-015`), con
   `env(safe-area-inset-bottom)` en la barra y hojas a `max-h-[88dvh]`. Checklist de
   canal: apilar o esconder, **swipe en vez de hover**, tap ≥40 px, `100dvh`, imágenes
   ≤150 KB, fallback de `prefers-reduced-motion` (`landings/POL-003`).
6. **Formulario: solo los campos del siguiente contacto.** Quién es, qué tipo de negocio,
   **un** canal de contacto y cuánto mueve. NIT, ciudad, correo *y* teléfono a la vez,
   lista de productos y comentarios se preguntan cuando ya te compró — igual salen en la
   primera llamada. El canal va como radio WhatsApp/Correo con **un solo campo** que
   cambia label, placeholder, `inputmode` y validación (`pollo-landing/index.html:486-537`,
   canal dinámico en `:508-514` + `:623-638`, validación distinta en `:653-659`).
7. **Que cada campo le devuelva algo en el instante en que lo responde.** El campo que te
   sirve a TI conviértelo en uno que le sirve a ÉL: al elegir volumen se pinta al
   instante a qué nivel de beneficio aplica (`index.html:640-651`, bloque `promo-hint` en
   `:531-534`), ese resultado **viaja dentro del registro** (`:682`) y la pantalla de
   éxito lo repite con su nombre y su canal —*"¡Bienvenido, X! Sus incentivos llegarán
   por WhatsApp al … Su nivel: …"*— en vez de un "gracias" genérico (`:697-700`).
8. **Cuando te rechacen con adjetivos, tradúcelos antes de tocar nada — y no
   sobrecorrijas.** *"Apagado"* = fondo claro y plano donde el producto no brilla.
   *"Genérico"* = layout estándar de app (lista de filas con círculo de inicial, chips
   arriba, todo centrado y simétrico). *"Que dé gusto verlo"* = que haya algo que **mirar**
   en cada pantalla, no solo algo que leer (`landings/KN-009`). **Conserva explícitamente
   lo que no criticaron** —ahí sobrevivieron la paleta oscura de la carta, los precios en
   naranja, la cinta EJEMPLO y el dato grande "2 sedes / $0"— y **degrada de rol** lo que
   estorbaba en vez de prohibirlo: el crema `#f7ece1` dejó de ser fondo de pantalla y
   quedó como tinta y como "plato" bajo la foto (las fotos llegan en PNG **sin alfa**, y
   sobre negro se verían como recortes sucios).
9. **Cambiar un color compartido es un cambio de ALCANCE, no de gusto: grepea primero
   quién más lo consume.** En placita los tokens de fruta de `:root` los usaba también el
   interior de la app (hub de zonas, página de pulpas) y las paletas por producto del
   catálogo las importaban dos pantallas internas: subirles saturación "para que la
   portada venda" habría repintado pantallas de trabajo (`landings/KN-004`). Solución:
   **tokens nuevos con alcance de portada** (una clase contenedora en el `<main>` público)
   y trabajar solo sobre clases verificadas como exclusivas de la landing. *Ojo: los
   números de línea de KN-004 ya se desplazaron por un refactor posterior —el patrón sigue
   en pie, reejecuta el grep.*
10. **Si partes de referencias, fíchalas por MECANISMO y combina una por zona.** Hero /
    producto / cierre, nunca tres peleando por la misma sección, cada mecanismo
    justificado en términos de venta, y el veredicto anotado **por canal** —móvil y
    escritorio por separado— para que la siguiente combinación parta de lo que funcionó
    (`landings/POL-003`; biblioteca en
    `C:/Users/Kalel/ORION/prompts-landing/referencias/_INDEX.md`). Ya hay resultados
    sembrados ahí: el mecanismo más resistente de la biblioteca es el **"dato grande +
    línea"**, *"porque no depende de gesto ni de tiempo, se ve en una captura"*; el
    spotlight por gesto **"ni apareció"** en el veredicto porque el dueño revisa capturas
    quietas.
11. **Cero datos inventados de cara al público** — precios, horarios, teléfonos,
    testimonios, cifras. La regla completa, con la frontera de lo que sí se puede parquear
    y cómo se marca una demo autorizada, vive en [[TEMA-cero-datos-inventados]]; no se
    repite aquí.

## Cuándo NO aplica

- **La regla "cliente afuera = venta" NO es universal, y está documentado que no lo es.**
  Para la landing de InfraPilot se decidió **conservar el registro calmado** del
  manifiesto: *"quien mira esa landing es el mismo ingeniero que va a vivir horas dentro
  de la app, así que la calma ES el argumento de producto. La señal correcta para elegir
  registro no es 'público vs privado' sino **qué necesita SENTIR quien mira la pantalla
  para comprar**"* (`infrapilot/KN-032`, que matiza `infrapilot/DEC-010`). Los dos casos
  conviven, cada uno con su condición de negocio, y **no se fusionan**:
  - **Compra por deseo o impulso** (comida, fruta, pedido para hoy) → color, producto
    gigante, movimiento. Placita y Villa Broaster.
  - **Compra por alivio del caos** (software donde el comprador va a trabajar) → calma,
    aire, sobriedad; el vacío ahí no se lee como pobreza sino como orden. InfraPilot.
  - **Y el eje NO es B2B vs B2C**: la landing de pollo es B2B mayorista y vende con rojo
    teja `#C2452D` y maíz `#E8A83A` sobre blanco cálido, porque quien compra sigue siendo
    un asadero que decide por antojo y por margen (`pollo-landing/memory/pollo-landing/brief.md`).
- **A veces la respuesta correcta es que NO haya pantalla pública.** El 2026-08-20
  (commit `8705f06`) el catálogo público de Mercaplaza **se eliminó entero**: murieron
  `app/catalogo/`, `components/landing/` (16 archivos), el modo vitrina y 533 líneas de
  `globals.css` (849→316). El dominio quedó alojando **solo el sistema**, y lo que
  sobrevivió fueron las **APIs** como puerta del futuro canal (`placita/DEC-017`). La
  página de ventas estilo Rappi quedó **aparcada, lista y funcional, en un repo
  separado** (`C:\Users\Kalel\placita-tienda`), a la espera de una decisión de negocio
  (`placita/KN-035`). Mantener dos superficies públicas en el mismo código es un costo
  que hay que querer pagar.
- **El fondo oscuro es de comida, no de todo rubro.** No lo extrapoles sin veredicto: una
  inmobiliaria o un SaaS pueden querer claro —en Orama el propio dueño eligió tinta
  profunda `#0F2E36` con superficies de papel `#F4EDDF`— (`landings/KN-009`,
  `orama/DEC-001`). Y sigue **sin veredicto** la frontera entre "divertido" y
  "gritado/barato" del registro de cartel de feria.
- **El feedback instantáneo juega en contra si el beneficio no está aprobado.** En pollo
  quedó escrito: *"el dueño debe aprobar los textos/umbrales de PROMOS antes de publicar
  (son propuesta)"* (`pollo-landing/PEND-003`). Prometer en pantalla algo que después toca
  desdecir por WhatsApp es peor que no prometer nada.
- **Los 4 campos no aplican a altas que necesitan el dato para operar**: facturación
  electrónica (NIT), despacho (dirección), cumplimiento legal. Ahí el campo es
  obligatorio aunque duela la conversión — pero pídelo **en un segundo paso**, después de
  que ya dijo que sí.
- **No hace falta grepear tokens si la landing es un archivo autocontenido** separado del
  app (el caso de las demos y de la plantilla de login), ni cuando el token es de uso
  único y el grep lo confirma (`landings/KN-004`).
- **La pantalla pública lee una superficie estrecha, a propósito.** El catálogo público de
  placita expone **7 campos** y *"Pedido ≠ hecho contable (factura solo en POS)"*
  (`placita/DEC-009`); el CORS está habilitado **solo** en `GET /api/catalogo`,
  `POST /api/pedidos` y `GET /api/pedidos/<id>` — las rutas con `x-clave-caja` **no
  ofrecen CORS, a propósito** (`placita/KN-035`); y villa-app **no tiene almacén**: lo
  único que guarda es el carrito en el navegador (`villa-app/lib/carrito.ts:4-10`). Si tu
  pantalla pública necesita leer más que eso, revisa el diseño antes de abrir el permiso.
- **HUECO DECLARADO — todos los veredictos de este tema son del dueño, ninguno de un
  cliente final.** No hay una sola medición de conversión real, ni de tráfico, ni de
  abandono de carrito en todo el corpus: lo que está pagado es **qué acepta el dueño**,
  no **qué convierte**. Además el veredicto de escritorio de la combinación de
  referencias sigue sin registrarse (*"escritorio sin revisar"*, `_INDEX.md`). La primera
  vez que exista un número de conversión real, hay que volver a escribir aquí.

## Evidencia

- `landings/POL-001` — tensión de registro y la cita textual del rechazo del 2026-08-05
  ("es para vender frutas"); alcance: toda landing pública, nunca el interior.
- `landings/KN-002` — por qué la v1 no bastó, y **la medición del pliegue** a 390×844:
  3616 px de documento, héroe 963 px, primera tarjeta pedible en `y=1994` (2,4 pantallas).
- `landings/KN-009` — la portada clara mata el hambre; traducción operativa de "apagado /
  genérico / que dé gusto verlo"; qué NO tocar; el crema degradado de rol; fotos PNG sin alfa.
- `landings/KN-004` — grepear antes de cambiar un color compartido; tokens nuevos con
  alcance de portada (números de línea desplazados por refactor: reejecutar el grep).
- `landings/POL-003` — móvil como canal principal (cita textual del dueño), fichas por
  mecanismo, una por zona, veredicto por canal.
- `landings/KN-001` — marca real vs `[PLACEHOLDER]`: "Avícola Buenavista" es provisional,
  "Villa Broaster" es cliente real.
- `landings/POL-002` / `POL-004` — datos demo autorizados marcados dos veces; las dos
  piezas fijas de todo prompt a un generador (ver los temas enlazados).
- `infrapilot/KN-032` — **la excepción**: la calma como argumento de producto; la señal es
  qué necesita sentir quien mira, no público vs privado.
- `infrapilot/DEC-010` — el manifiesto *estudio del ingeniero moderno* y sus prohibiciones
  cromáticas, vigentes en los dos registros.
- `villa-broaster/KN-015` — QA 2026-08-23: la vitrina ignoraba `?sede=` (todos caían en
  Villa del Viento), tap targets 40 px, banner de promo mostrado en la sede equivocada,
  columna de 480 px en escritorio como decisión.
- `villa-broaster/KN-009` — promos sin descuento falso: si la UI promete un número, el
  servidor debe poder honrarlo exactamente.
- `villa-broaster/KN-005` — pivote DOS CARAS: `broaster-app` (sistema, puerto 3200) y
  `villa-app` (vitrina, puerto 3201, **stateless**, paleta `#0a0a0a` / rojo `#e01e2b` /
  naranja `#ff8a20`), repos separados por rol.
- `placita/DEC-017` — el catálogo público **eliminado** (commit `8705f06`): 16 archivos de
  landing, modo vitrina y `globals.css` 849→316; sobreviven las APIs.
- `placita/KN-035` — la tienda pública aparcada en repo aparte; CORS solo en las 3 rutas
  públicas, nunca en las protegidas por `x-clave-caja`.
- `placita/DEC-009` — catálogo de 7 campos públicos; "Pedido ≠ hecho contable".
- `pollo-landing/DEC-001` → `DEC-002` — 8 campos rechazados, 4 campos con canal único y
  promo por volumen; medición en `metrics.json` (2026-08-08 vs 2026-08-09).
- `pollo-landing/PEND-003` — los textos y umbrales de PROMOS son propuesta hasta que el
  dueño los apruebe.
- `orama/DEC-003` — todo el tráfico remata en WhatsApp; dos embudos (propietarios /
  buscadores). `orama/DEC-001` — paleta clara de otro rubro.
- Código verificado en disco el 2026-08-24:
  `villa-app/lib/carrito.ts:4-10, 159-167, 176-181, 195-202` ·
  `villa-app/components/tienda/BarraCarrito.tsx:4-13, 24, 29` ·
  `villa-app/components/tienda/Hoja.tsx:63` · `villa-app/app/globals.css:153` ·
  `pollo-landing/index.html:486-537, 508-514, 640-651, 697-700` ·
  `pollo-landing/memory/pollo-landing/brief.md`.
- Biblioteca de referencias con Resultados por canal ya poblados:
  `C:/Users/Kalel/ORION/prompts-landing/referencias/_INDEX.md` + fichas `01-`, `02-`, `03-`.

## Enlaces

- [[TEMA-generadores-de-diseno]] — **el tema hermano**: éste habla de la PANTALLA, ése del
  EJECUTOR que la dibuja (armadura contra su design system, movimiento congelado, anexo de
  coreografía).
- [[TEMA-cero-datos-inventados]] — qué se puede escribir como dato en una página pública y
  qué es mentira verosímil; demos autorizadas y huecos visibles.
- [[TEMA-encargos-verificables]] — cómo se convierte "más llamativa" en ms, hex, píxeles y
  criterios que otro puede comprobar.
- [[TEMA-verificar-con-evidencia]] — capturar a 390×844 por CDP y medir en vez de opinar.
- [[TEMA-acceso-roles-y-puestos]] — la otra cara: qué ve cada persona **adentro**, donde
  manda la calma.
- [[TEMA-cobro-a-clientes]] — la web pública es parte de la cuota mensual, no un entregable
  suelto.
