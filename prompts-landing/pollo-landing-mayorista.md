═══════════════════════════════════════════════════════════════════════════
PROMPT DE LANDING — proyecto "pollo-landing"
Mayorista B2B de pollo crudo (entero y despresado) · Colombia
Ruta del proyecto: C:\Users\Kalel\fable 5\pollo-landing
═══════════════════════════════════════════════════════════════════════════

LEE ESTO ANTES DE TOCAR NADA
Este proyecto YA TIENE una landing completa, funcional y verificada en navegador
(index.html, 774 líneas / 39 KB; PASS 2026-08-08 según memory/pollo-landing/brief.md:10).
Tu trabajo es una v2 SOBRE ese archivo, no un rediseño desde cero.

Por qué mejorar y no rehacer (argumento, no gusto):
- La arquitectura de un solo archivo es decisión aceptada del proyecto
  (memory/pollo-landing/state.json:20-22, DEC-001; vigente tras DEC-002 state.json:79).
- El invariante "una sola fuente de verdad" (formulario escribe / admin lee el mismo
  API) está verificado en vivo dos veces (state.json:35-37). Rehacer lo pone en riesgo
  a cambio de nada.
- El formulario de 4 campos NO es una simplificación tuya: es un pedido explícito del
  dueño que redujo la ficha de 8 campos a 4 (state.json:79, DEC-002). Volver a pedir
  NIT, ciudad, correo Y teléfono sería deshacer una decisión pagada.
- El déficit real de esta landing NO es visual. Es: (a) afirma hechos que no están
  probados en ninguna fuente, (b) promete WhatsApp y no hay ni un número en todo el
  repo, (c) no le da al comprador B2B lo que necesita para decidir (cobertura, días de
  ruta, pedido mínimo, forma de pago), (d) tiene un solo breakpoint para una audiencia
  que compra desde el celular.
Ese es exactamente tu encargo.

───────────────────────────────────────────────────────────────────────────
1. EL NEGOCIO
───────────────────────────────────────────────────────────────────────────
Proveedor mayorista de pollo CRUDO en Colombia: entero, despresado y complementos.
Vende a otros negocios, no a consumidor final (index.html:7, :256).

Catálogo real, tal como está hoy en el archivo (NO inventes ni una referencia más;
si el dueño agrega, que lo diga él):
  Entero (index.html:301-318)
   - Pollo entero con menudencias — canal completa con vísceras comestibles.
     Tag "Más pedido". Ideal: asaderos, tiendas, fruvers (:303-305)
   - Pollo entero sin menudencias — canal limpia, lista para porcionar.
     Ideal: restaurantes, casinos, catering (:309-311)
   - Calibres por encargo — "del 2.8 al 4.2 (lb/canal aprox.)" (:315-317)
     [DATO NO VERIFICADO — ver §9 hueco 7]
  Despresado (index.html:324-347)
   - Pechuga: con/sin hueso, con/sin piel; filete y medallón por encargo (:326-328)
   - Pierna-pernil. Tag "Favorito". Ideal: asaderos y broasterías (:332-334)
   - Alas y colombinas: ala completa, medias alas, colombina (:338-340)
   - Porcionado a la medida: empaques por kilo o unidad, marcados por referencia (:344-346)
  Complementos (index.html:353-370)
   - Menudencias: hígado, molleja, corazón, por separado y por kilo (:355-357)
   - Patas: limpias y seleccionadas, por kilo (:361-363)
   - Carcasa y recorte: fondos, caldos, industria (:367-369)

PRECIOS: no van en pantalla. Es decisión del dueño, no un olvido
(index.html:374-377 y brief.md:10). Las tarifas dependen del volumen semanal y se
entregan después del registro. NO pongas precios, ni "desde $X", ni rangos.

Gancho comercial: "programa de clientes" — el negocio se registra con 4 datos y su
volumen semanal le asigna un nivel de incentivo (index.html:481-540, 607-612):
   <50/semana   → promos del mes + descuento en el primer pedido
   50-200       → descuento por recompra + promos del mes
   200-500      → tarifa preferencial mayorista + descuento por recompra
   >500         → convenio corporativo con asesor dedicado + tarifa preferencial
ATENCIÓN: esos cuatro textos son PROPUESTA DEL ASISTENTE, sin aprobación comercial
del dueño (state.json:93, PEND-003). Son una promesa de plata. No los toques y no los
des por firmes: quedan detrás del flag CONFIG.promosAprobadas (§7).

MARCA: "Avícola Buenavista" es [PLACEHOLDER]. Está probado por la memoria del propio
proyecto: state.json:21 ("es PLACEHOLDER hasta que el dueno defina nombre real"),
state.json:50 (PEND-001) y brief.md:17. Hoy está escrito a mano en 4 sitios del HTML
—index.html:6 (title), :238 (header), :567 (footer)— y en el nombre del CSV
exportado, "registros-buenavista-…" (index.html:759). Tu v2 tiene que dejar que el
día que el dueño diga el nombre real se cambie en UN solo sitio. Ver §7.

Dónde opera: el archivo solo dice "Colombia" (index.html:253, :568). Ni ciudad, ni
planta, ni zona de reparto. Hueco 3.

───────────────────────────────────────────────────────────────────────────
2. QUIÉN MIRA Y QUÉ DEBE HACER
───────────────────────────────────────────────────────────────────────────
Quién mira: el que COMPRA en un negocio pequeño colombiano — el dueño del asadero,
la administradora del restaurante, el de compras del casino, el tendero. Está en el
celular, probablemente en WhatsApp. No tiene hambre: tiene un costo por plato que
cuadrar y un proveedor que le falló. Los siete tipos que el propio formulario
reconoce: asadero/broastería, restaurante, casino/catering, tienda/fruver,
distribuidor mayorista, hotel/institución, otro (index.html:496-502).

Qué debe SENTIR, en este orden:
  1) "estos manejan volumen de verdad, no me van a quedar mal el sábado"
  2) "tienen mi corte y mi calibre"
  3) "registrarme no me compromete a nada y me sale barato averiguar"
Nada de emoción gastronómica, nada de "delicioso", nada de fotos de un plato servido.
Esto no se come: se revende. El lenguaje es de abastecimiento, no de antojo.

UNA SOLA ACCIÓN PRINCIPAL: completar el registro del programa de clientes
(#registro). Todo lo demás es subordinado.
- El hero hoy tiene dos botones que compiten: "Únase al programa" y "Ver productos"
  (index.html:258-259). Deja UN botón (registro) y baja "Ver productos" a enlace de
  texto con flecha, sin fondo ni borde.
- WhatsApp, cuando el dueño dé el número, NO es un segundo CTA de igual rango: es
  canal de rescate. Vive en (a) un botón flotante discreto solo en móvil, (b) el
  footer, (c) el fallback de error del formulario. Nunca en el hero.

───────────────────────────────────────────────────────────────────────────
3. EVIDENCIA REAL (lo único que se puede probar HOY)
───────────────────────────────────────────────────────────────────────────
Sé consciente de lo pobre que es esta lista. Precisamente por eso no la infles.
  - Amplitud de catálogo: 10 referencias en 3 familias, con "Ideal para" por corte
    (index.html:301-370). Un comprador entiende de inmediato si le sirve.
  - El programa por volumen con 4 niveles (index.html:607-612), CONDICIONADO a la
    aprobación del dueño (PEND-003).
  - Fricción mínima demostrable: 4 campos, sin NIT ni papeleo, y respuesta inmediata
    en pantalla con el nivel asignado (index.html:486-535, 641-651).
  - Promesa de no-compromiso, ya escrita: "Registrarse no lo obliga a nada"
    (index.html:476) y la línea de privacidad (index.html:539).

Lo que NO existe y por tanto NO se puede mostrar:
  - CERO clientes captados: data/registros.json está en `[]` (data/registros.json:1).
    No hay testimonios, ni logos, ni "más de X negocios confían". Prohibido inventarlos.
  - CERO fotos en el repo (no hay .png/.jpg/.webp en ninguna carpeta; comprobado con
    listado completo del proyecto: solo .gitignore, index.html, serve.mjs, memory/,
    data/). El único activo visual es un SVG de gallina dibujado a mano
    (index.html:237, 268-279).
  - CERO documentos: no hay certificado INVIMA, ni registro sanitario, ni razón
    social, ni NIT, ni año de fundación en ningún archivo.

REGLA DURA DE ESTA LANDING: las frases de confianza que hoy están escritas en el HTML
—"Beneficio certificado INVIMA" (:262), "Planta con certificación INVIMA y
trazabilidad por lote" (:404), "despacho en menos de 24 horas" (:282, :389),
"vehículos termo refrigerados con registro de temperatura" (:394), "facturación
electrónica" (:264, :414, :453), "un asesor asignado" (:414), "rutas fijas con día y
franja horaria" (:408-409)— son COPY ESCRITO POR UN ASISTENTE, no hechos verificados
del negocio. Ninguna tiene respaldo en el repo. En tu v2 ninguna de esas frases se
imprime sola: todas pasan a depender del bloque CONFIG (§7) y solo aparecen si el
dueño las marcó como ciertas. Si el dueño no toca nada, la landing no afirma nada.

───────────────────────────────────────────────────────────────────────────
4. ESTRUCTURA SECCIÓN POR SECCIÓN
───────────────────────────────────────────────────────────────────────────
Orden final de la página (móvil manda: así se lee en 390 px).

0. FRANJA DE BORRADOR (nueva, temporal)
   Propósito: que nadie publique la landing con un nombre falso.
   Si CONFIG.marca.confirmada === false, imprime arriba del header una franja fina
   (fondo --maiz-suave, texto #8A6614): "BORRADOR — el nombre de la marca es
   provisional. No publicar." No se puede cerrar. Desaparece sola en cuanto el flag
   sea true. Justificación: KN-001 de la memoria de landings — presentar "Avícola
   Buenavista" como definitivo sería inventar.

1. HEADER (existe, index.html:234-247)
   Marca + 3 anclas + botón "Únase al programa". El nombre sale de CONFIG, no
   hardcodeado. Mantén sticky con blur (index.html:33-37).

2. HERO (existe, index.html:250-285) — reescribe el contenido, conserva la estructura
   Propósito: decir en 3 segundos qué venden y a quién.
   - H1: conserva "Pollo fresco, entregado todos los días a su negocio."
     (index.html:255) — es correcto y es B2B.
   - Subtítulo: conserva index.html:256 pero borra "Frescura del día, calibres
     consistentes y cadena de frío de principio a fin" si CONFIG no lo respalda.
   - Chip superior: "Proveedor mayorista · {ciudad}" y si no hay ciudad, "Colombia"
     como está hoy (index.html:253).
   - Las 3 notas verdes de confianza (index.html:262-264) pasan a renderizado
     condicional: se pintan SOLO las que estén en CONFIG.compromisos. Si el array
     está vacío, esa fila no existe. Igual el sello "beneficio y despacho en 24 h"
     (index.html:280-283).
   - Ilustración: mantén el SVG de gallina (index.html:268-279). Es feo sustituirlo
     por stock y no hay fotos. Si el dueño entrega fotos reales (hueco 6), la foto
     reemplaza al SVG; mientras tanto el SVG se queda y punto.
   - Un solo botón (§2).

3. CALCULADORA DE ABASTECIMIENTO (nueva) — la pieza que hace la diferencia
   Propósito: enganchar al que piensa en volumen y llevarlo al formulario ya decidido.
   Contenido: un input numérico "¿cuántos pollos maneja por semana?" y, al escribir,
   muestra en vivo: pollos/mes (× 4.3 semanas) y a qué nivel del programa aplica,
   leyendo el MISMO objeto PROMOS de index.html:607-612 (una sola fuente de verdad,
   igual que el patrón ya verificado en KN-001). Un botón "Aplicar a mi registro"
   baja a #registro y deja preseleccionado el rango correspondiente en el select
   (index.html:523-529).
   NO calcula dinero. No hay precios (§1) y no te los vas a inventar.
   Si CONFIG.promosAprobadas === false, la calculadora sigue mostrando pollos/mes
   pero el nivel se muestra como "sujeto a confirmación comercial" en vez de la
   promesa concreta.

4. PRODUCTOS (existe, index.html:288-378) — conservar tal cual
   Propósito: "sí tienen mi corte". Los 3 tabs + tags + "Ideal para" ya funcionan
   (index.html:293-297, script :597-604). Solo dos arreglos:
   - Accesibilidad: los botones tienen role="tab" pero no aria-selected ni
     aria-controls, y los paneles no tienen role="tabpanel" (index.html:293-299).
     Complétalo y haz que funcione con flechas del teclado.
   - En móvil los 3 tabs se salen del ancho: hazlos scroll horizontal con snap,
     o dos líneas. Verifícalo a 390 px.
   La nota de precios por volumen (index.html:374-377) se queda: es honesta y empuja
   al registro.

5. LO QUE RECIBE SU COCINA — hoy "Por qué nosotros" (index.html:381-418)
   Propósito: confianza operativa. Hoy son 6 piezas numeradas con afirmaciones sin
   respaldo. Reescríbela como rejilla que se pinta DESDE CONFIG.compromisos: cada
   compromiso que el dueño confirmó se vuelve una tarjeta; los que no, no existen.
   Si el dueño confirma solo dos, se ven dos tarjetas y la sección sigue viéndose
   bien (diseña para 2, 4 y 6 elementos).
   Añade a la lista de compromisos posibles, porque son las que un comprador B2B
   pregunta primero y hoy no están en la página: días de ruta, zona de cobertura,
   pedido mínimo, forma de pago/plazo. Todas condicionadas a CONFIG (huecos 4, 8, 9, 10).

6. PARA QUIÉN TRABAJAMOS (existe, index.html:421-432) — conservar
   Los 6 chips con icono (asaderos, restaurantes, casinos, tiendas/fruvers,
   distribuidores, hoteles) son los mismos 7 tipos del formulario (index.html:496-502)
   y funcionan como espejo de identidad. Mejora: al hacer clic en un chip, se
   preselecciona ese tipo en el formulario y baja hasta él. Interacción con función,
   no adorno.

7. CÓMO FUNCIONA (existe, index.html:435-457) — conservar los 3 pasos
   Paso 1 "Regístrese en un minuto", paso 2 "Reciba su promoción", paso 3 "Reciba sus
   entregas". Ajuste: el paso 3 hoy afirma cadena de frío, remisión por lote,
   facturación electrónica y pedidos por WhatsApp (index.html:453) — que quede solo
   lo que CONFIG confirme, y "Pedidos por WhatsApp" solo si hay número.

8. REGISTRO (existe, index.html:460-550) — el corazón, no lo rompas
   Propósito: convertir. 4 campos obligatorios y NADA MÁS (DEC-002, state.json:79):
   nombre del negocio, tipo, canal (radio WhatsApp|Correo con campo único que cambia
   label/placeholder/validación) y pollos por semana. Se conserva el promo-hint
   instantáneo (index.html:531-534, script :641-651) y la validación cliente
   (script :653-674).
   Mejoras permitidas y necesarias:
   - Fallback de error: hoy si el POST falla se muestra un texto muerto
     (index.html:538). Cámbialo por: mismo mensaje + botón "Enviármelo por WhatsApp"
     que abre wa.me con el mensaje ya redactado (negocio, tipo, volumen) — solo si
     hay número en CONFIG. Sin número, deja el texto actual.
   - Estado de éxito (index.html:542-547): conservar, incluido el mensaje
     personalizado con el nivel asignado (script :697-700).
   - En móvil: el formulario debe verse completo sin zoom, inputs de 16 px mínimo
     (para que iOS no haga zoom), botón de ancho completo.

9. ADMIN OCULTO (existe, index.html:553-563, script :716-769) — NO TOCAR
   ?admin=1, tabla, exportar CSV, vaciar. Es la trastienda del proveedor. Lo único
   que cambia es que el nombre del CSV (script :759) salga de CONFIG y no diga
   "buenavista" a mano.

10. FOOTER (existe, index.html:565-571)
    Marca desde CONFIG, la línea descriptiva, el año. Añade WhatsApp y ciudad SOLO si
    están en CONFIG. Nada de redes sociales inventadas.

───────────────────────────────────────────────────────────────────────────
5. REGISTRO VISUAL Y PALETA
───────────────────────────────────────────────────────────────────────────
Registro: VENDEDOR, cálido, de marca avícola colombiana — no minimalista. Es una
portada pública y el que mira es un cliente, no un trabajador dentro de la app. El
manifiesto "estudio del ingeniero moderno"
(C:\Users\Kalel\.claude\skills\orion-diseno\SKILL.md) aplica al INTERIOR de las
apps del dueño; aplicarlo a una landing ya costó un rechazo textual del dueño el
2026-08-05 ("la landing que haces es una basura... muy minimalista... quiero que esta
landing sea más interactiva, más llamativa"). Del manifiesto se mantienen SIEMPRE las
prohibiciones (SKILL.md:32) y el fondo cálido, nunca blanco puro.
Matiz B2B: vendedor no es estridente. El comprador de un casino no confía en una
página que grita. Color con seguridad, tipografía firme, cero confeti.

Paleta EXACTA, ya definida en el archivo (index.html:9-23) — no la cambies:
  --bg #FBF6EE   --card #FFFDF9   --ink #221A12   --muted #6E635A
  --border #EAE2D6   --hover #F4EDE1
  --rojo #C2452D (primario, botones)   --rojo-oscuro #9E3722 (hover)
  --maiz #E8A83A   --maiz-suave #F7E9CD   --verde #4D7C59 (validación/confianza)
  sombras: 0 2px 14px rgba(60,40,20,.08) y 0 8px 28px rgba(60,40,20,.14)

Tipografía: la del sistema, sin excepción — "Segoe UI", system-ui, -apple-system,
sans-serif (index.html:27). No puedes cargar Google Fonts: no hay CDN permitido (§7).
Titulares en 800, con clamp como ya está (index.html:67, :86). Los precios no
existen, así que el peso visual lo cargan los titulares y las tarjetas.

Densidad: tarjetas como objetos con borde de 1 px y radio 14-18 px, aire generoso
entre secciones (64 px desktop, 40 px móvil), franjas alternas con .franja para
separar bloques (index.html:381, :435).

───────────────────────────────────────────────────────────────────────────
6. INTERACCIÓN — cada una justificada o se cae
───────────────────────────────────────────────────────────────────────────
SE QUEDA (ya existe y sirve):
 - Tabs de producto con fade de 0.3 s (index.html:96-98, script :597-604) → deja
   elegir familia sin scroll infinito. Añade aria y teclado.
 - Nivel de promoción al instante al elegir volumen (script :641-651) → recompensa
   inmediata a mitad del formulario; sube la conversión del campo más pesado.
 - Campo de contacto que cambia de forma según el canal (script :625-638) → evita
   pedir teléfono Y correo. Es la razón de que sean 4 campos.
 - Hover de tarjetas y botones con translateY(-2px) (index.html:53) → suficiente.
SE AGREGA (con motivo):
 - Calculadora pollos/semana → pollos/mes → nivel, con "aplicar a mi registro"
   (§4.3) → habla el idioma del que compra por volumen y precarga el formulario.
 - Chips de tipo de negocio que preseleccionan el select (§4.6) → un clic menos.
 - Barra CTA fija inferior en móvil (< 860 px) con "Únase al programa", que aparece
   al pasar el hero y se esconde cuando #registro está en pantalla → el CTA nunca
   queda a 4 pantallas de distancia en un celular.
 - Botón WhatsApp flotante en móvil, solo si CONFIG.whatsapp existe → canal real de
   compra en Colombia.
 - Fallback WhatsApp cuando el POST falla (§4.8) → hoy un fallo del servidor pierde
   el cliente.
SE PROHÍBE: carruseles de testimonios (no hay testimonios), contadores animados de
clientes/kilos (no hay cifras), parallax, partículas, cursores custom, preloaders,
scroll-jacking, cualquier animación que dure más de 400 ms.

───────────────────────────────────────────────────────────────────────────
7. RESTRICCIONES TÉCNICAS REALES (verificadas en el repo, no negociables)
───────────────────────────────────────────────────────────────────────────
El proyecto entero son 7 archivos: .gitignore, index.html, serve.mjs,
data/registros.json, memory/pollo-landing/{brief.md, metrics.json, state.json}.
NO hay package.json. NO hay node_modules. NO hay README. NO hay carpeta de assets.

 a) UN SOLO ARCHIVO AUTOCONTENIDO. Todo el CSS en <style> (index.html:8-230) y todo
    el JS en <script> al final (index.html:573-772). Es DEC-001, decisión aceptada
    (state.json:20-22). PROHIBIDO: React, Next, Vue, Tailwind, Alpine, jQuery,
    GSAP, bundlers, npm install, archivos .css o .js externos.
 b) CERO CDN y cero red externa. Ni fuentes, ni iconos, ni analytics. Los iconos son
    SVG inline como ya lo son (index.html:262-264, 302, 425-430). El único enlace
    externo permitido en toda la página es https://wa.me/… y solo cuando el dueño dé
    el número.
 c) JS vanilla ES5-friendly como el que ya hay (var, function, forEach) más async/await
    y fetch, que ya se usan (script :577-594). No uses sintaxis que exija transpilar.
 d) SERVIDOR: `node serve.mjs` desde C:\Users\Kalel\fable 5\pollo-landing →
    http://localhost:4173 (serve.mjs:66). Solo librería estándar de Node
    (node:http, node:fs/promises, node:path, node:url — serve.mjs:1-4).
    OJO Windows: las rutas se resuelven con fileURLToPath (serve.mjs:6) porque el
    espacio de "fable 5" rompe URL.pathname (state.json:36).
 e) CONTRATO DEL API — INVARIANTE. El formulario escribe y el admin lee el MISMO
    origen: GET/POST/DELETE /api/registros → data/registros.json (serve.mjs:26-55,
    helpers api* en index.html:577-594). El POST del servidor construye el registro
    con una lista FIJA de claves: fecha, negocio, tipo, medio, contacto, pedidos,
    promo (serve.mjs:36-44). Cualquier campo nuevo que mandes desde el HTML SE
    DESCARTA EN SILENCIO. Si de verdad hiciera falta un campo (no debería: DEC-002
    fija 4), hay que tocar serve.mjs y el array COLS de index.html:720 a la vez.
    El servidor exige negocio + contacto + pedidos o responde 400 (serve.mjs:33-34).
 f) IMÁGENES: el MIME map de serve.mjs:8 solo conoce .html .css .js .svg .png. Un
    .jpg o .webp se serviría como application/octet-stream y no se vería. Si el dueño
    entrega fotos, o se convierten a .png, o se añade la entrada MIME en serve.mjs.
    Dilo en el reporte; no lo hagas a escondidas.
 g) SEGURIDAD — LÍNEA ROJA: el API no tiene autenticación y ?admin=1 no es una
    protección (index.html:717-718). La memoria del proyecto es explícita: "NO
    exponer a internet sin auth" (state.json:108, DEC-003). Tu v2 corre en la máquina
    o LAN del proveedor. No propongas túneles, ni ngrok, ni desplegarlo público, ni
    quitar el gate del admin. Publicar en internet es PEND-001 y está bloqueado en el
    dueño (state.json:50).
 h) DATOS DE CLIENTES: data/ está en .gitignore (.gitignore:1-3, "data de clientes
    reales nunca se commitea"). No commitees data/registros.json ni pongas datos
    reales en el HTML.
 i) GIT: repo local, rama main, 3 commits, SIN remoto (PEND-002, state.json:64). El
    push por terminal falla en esta máquina; se hace por GitHub Desktop. No intentes
    push.
 j) BLOQUE CONFIG — así se resuelve el placeholder y los huecos de un golpe.
    Al principio del <script>, un único objeto con comentarios en español:
       var CONFIG = {
         marca:      { nombre: 'Avícola Buenavista', confirmada: false },
         whatsapp:   '',       // solo dígitos con indicativo: 573001234567
         ciudad:     '',       // ej: 'Pasto, Nariño'
         cobertura:  [],       // ej: ['Pasto','Ipiales','Túquerres']
         diasRuta:   '',       // ej: 'lunes, miércoles y viernes'
         pedidoMinimo: '',     // ej: '30 pollos por entrega'
         formaPago:  '',       // ej: 'contado o crédito a 8 días'
         compromisos: [],      // los de §4.5 que el dueño confirme, uno por uno
         certificacion: null,  // { entidad:'INVIMA', numero:'…' } o null
         calibres:   '',       // ej: '2.8 a 4.2 lb/canal'
         promosAprobadas: false,
         foto:       ''        // 'foto-despacho.png' (solo .png o .svg, ver f)
       };
    REGLA DE ORO DEL RENDER: lo que está vacío NO SE PINTA. Marca cada nodo
    dependiente con data-req="whatsapp|ciudad|certificacion|…" y bórralo del DOM al
    cargar si su dato falta. Con CONFIG tal como lo entregas (todo vacío), la landing
    no debe afirmar ni una sola cosa que no esté probada, y aun así debe verse
    completa y vendedora. Eso es lo que se te está midiendo.
    El nombre de marca se inyecta desde CONFIG en: <title>, header, footer y nombre
    del CSV (hoy index.html:6, :238, :567, :759). Deja el texto del placeholder como
    contenido de respaldo en el HTML para que se lea aunque el JS falle.

───────────────────────────────────────────────────────────────────────────
8. PROHIBIDO EN ESTE PROYECTO
───────────────────────────────────────────────────────────────────────────
 1. Presentar "Avícola Buenavista" como marca definitiva. Es placeholder probado
    (state.json:21, :50; brief.md:17).
 2. Inventar teléfono, WhatsApp, dirección, ciudad, NIT, razón social, correo,
    dominio o redes. No existe ninguno en el repo.
 3. Inventar precios, "desde $X", descuentos con cifra o tarifas por kilo.
 4. Cifras sociales de cualquier tipo: años de experiencia, número de clientes,
    toneladas/kilos vendidos, "más de X negocios confían", premios, testimonios,
    logos de clientes. Hay CERO registros (data/registros.json:1).
 5. Afirmar INVIMA, trazabilidad por lote, despacho en 24 h, termos con registro de
    temperatura, facturación electrónica o asesor asignado sin que estén en CONFIG.
 6. Fotos de stock de pollo, granjas, camiones o cocinas. Cero. Si no hay foto real,
    manda el SVG dibujado.
 7. Azules eléctricos, morados, neones, gradientes tecnológicos (SKILL.md:32).
    Tampoco verde "orgánico" tipo agro-startup ni degradados de moda.
 8. Minimalismo de manifiesto en la portada: fue rechazado explícitamente por el
    dueño el 2026-08-05.
 9. Añadir campos al formulario. El dueño bajó de 8 a 4 a propósito (DEC-002,
    state.json:79). Nada de NIT, ciudad, comentarios, ni "cuéntenos su necesidad".
10. Frameworks, CDN, dependencias, archivos externos, build (§7a-b).
11. Exponer el API o el admin a internet, o quitarles el poco gate que tienen
    (state.json:108).
12. Tocar el contrato de claves del API sin tocar serve.mjs y COLS a la vez (§7e).
13. Copy de consumidor final: "delicioso", "jugoso para tu familia", "antójate".
    Aquí nadie come, todos revenden.

───────────────────────────────────────────────────────────────────────────
9. HUECOS DEL DUEÑO (lo primero que tiene que leer él)
───────────────────────────────────────────────────────────────────────────
Cada uno va al bloque CONFIG. Mientras estén vacíos, la landing funciona pero calla.
 1. NOMBRE REAL DE LA MARCA. Hoy "Avícola Buenavista" es provisional (state.json:21).
    Sin esto la landing no se publica: la franja de BORRADOR no se quita.
 2. NÚMERO DE WHATSAPP comercial (con indicativo). La página promete "pedidos por
    WhatsApp" en 4 sitios (index.html:376, :414, :453, :468) y no hay ni un dígito en
    todo el repo. Es el mayor agujero de conversión: en Colombia se compra por ahí.
 3. CIUDAD Y ZONA DE COBERTURA. Hoy solo dice "Colombia" (index.html:253, :568). Un
    restaurante no se registra si no sabe si le llegan.
 4. DÍAS Y FRANJA DE RUTA. Se afirma "rutas fijas con día y franja acordados"
    (index.html:408-409) sin decir cuáles. Decir "martes y viernes" vende más que
    "rutas fijas".
 5. CERTIFICACIÓN SANITARIA: entidad y número. Se afirma INVIMA dos veces
    (index.html:262, :404) sin ningún documento en el repo. Es lo primero que pide un
    casino o un hotel; también es lo que más caro sale afirmar en falso.
 6. FOTO REAL: una sola sirve (el despacho, las canastillas, el camión, la sala de
    corte). Sin foto seguimos con el dibujo. Formato .png o .svg (§7f).
 7. CALIBRES REALES. Hoy dice "del 2.8 al 4.2 lb/canal aprox." (index.html:316):
    ¿es el rango verdadero?
 8. PEDIDO MÍNIMO por entrega. No aparece en ninguna parte y es la primera pregunta
    de una tienda pequeña.
 9. FORMA DE PAGO Y PLAZO (contado, crédito a 8/15/30 días) y si hay factura
    electrónica de verdad (se afirma en index.html:264, :414, :453).
10. APROBACIÓN DE LOS 4 NIVELES DE INCENTIVO (index.html:607-612). Son propuesta del
    asistente, no política comercial (PEND-003, state.json:93). Son un compromiso de
    plata: hay que revisar umbrales y beneficios antes de publicar.
11. TIEMPO REAL DE BENEFICIO/DESPACHO. Se afirma "menos de 24 horas"
    (index.html:282, :389). ¿Se cumple siempre?
12. PUBLICACIÓN: dominio, hosting y backend en nube para que los registros lleguen
    sin que la máquina del proveedor esté prendida (PEND-001, state.json:50). Mientras
    tanto la landing solo capta en LAN local.

───────────────────────────────────────────────────────────────────────────
10. CRITERIOS DE ACEPTACIÓN (verificables, uno por uno)
───────────────────────────────────────────────────────────────────────────
Entrega solo cuando los 12 pasen. Se comprueban con comandos, no con opinión.

A. INTEGRIDAD DEL PROYECTO
 1. `ls` en C:\Users\Kalel\fable 5\pollo-landing sigue mostrando exactamente
    .gitignore, index.html, serve.mjs, data\, memory\. Sin package.json, sin
    node_modules, sin carpeta build.
 2. Buscar en index.html `src="http` y `href="http`: 0 coincidencias, salvo un
    https://wa.me/ si el dueño dio número. Buscar `<link ` y `<script src`: 0.

B. NO INVENCIÓN (lo más importante)
 3. Con CONFIG tal como se entrega (todo vacío / confirmada:false), abrir la página y
    buscar en el DOM renderizado: "INVIMA", "24 h", "24 horas", "facturación
    electrónica", "termo", "trazabilidad" → 0 coincidencias.
 4. Con CONFIG vacío la página NO muestra ni un número de teléfono, ni una dirección,
    ni una cifra de clientes/años/kilos, ni un precio. Revisión visual del PNG.
 5. La franja "BORRADOR — nombre provisional. No publicar" se ve arriba. Al poner
    marca.confirmada:true y nombre:'X', la franja desaparece y "X" aparece en el
    título de la pestaña, el header, el footer y el nombre del CSV descargado.
 6. Al llenar CONFIG (whatsapp, ciudad, 3 compromisos, certificación), esos bloques
    aparecen y la maqueta no se rompe. Probar también con 2 y con 6 compromisos.

C. EL FUNNEL SIGUE VIVO (invariante KN-001, state.json:35-37)
 7. `node serve.mjs`; en http://localhost:4173 llenar los 4 campos y enviar →
    responde 201, aparece la pantalla de éxito con el nivel asignado, y
    data\registros.json pasa de [] a un registro con las claves exactas fecha,
    negocio, tipo, medio, contacto, pedidos, promo.
 8. Abrir http://localhost:4173/?admin=1 → la tabla muestra esa fila; "Exportar CSV"
    baja un archivo con el nombre desde CONFIG; "Vaciar registros" lo deja en [] y la
    tabla lo refleja sin recargar.
 9. Formulario: exactamente 4 campos obligatorios. Enviar vacío → marca los 4 y hace
    scroll al primero. Cambiar el radio a Correo → el label, el placeholder y la
    validación cambian; escribir "abc" → error de correo.
10. Con el servidor apagado, enviar el formulario → mensaje de error visible y (si hay
    WhatsApp en CONFIG) botón que abre wa.me con el mensaje prellenado. Sin CONFIG,
    el mensaje de error sin botón. Nunca una pantalla muerta.

D. VERDAD DE TERRENO VISUAL — Edge headless a PNG, no el navegador embebido
11. Con `node serve.mjs` corriendo, generar y MIRAR los dos PNG:
    & "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new `
      --disable-gpu --hide-scrollbars --window-size=390,3200 `
      --screenshot="$env:TEMP\pollo-movil.png" "http://localhost:4173/"
    & "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new `
      --disable-gpu --hide-scrollbars --window-size=1440,3000 `
      --screenshot="$env:TEMP\pollo-desktop.png" "http://localhost:4173/"
    (si esa ruta de Edge no existe, prueba C:\Program Files\Microsoft\Edge\Application\)
    En el PNG de 390 px: los 3 tabs no se desbordan, el formulario cabe sin scroll
    horizontal, la barra CTA inferior se ve, ningún texto queda cortado, ningún botón
    mide menos de 44 px de alto.
12. Calculadora: escribir 300 → muestra "≈1.290 pollos/mes" y el nivel 200-500; el
    botón "Aplicar a mi registro" baja al formulario con "200 – 500 / semana" ya
    seleccionado y el promo-hint visible. Con promosAprobadas:false, en vez del
    beneficio concreto dice "sujeto a confirmación comercial".

REPORTE FINAL OBLIGATORIO: qué secciones conservaste, qué reescribiste, la lista de
huecos que quedaron vacíos en CONFIG, y si tocaste serve.mjs (y por qué). Si en algún
punto te faltó un dato, dilo — no lo rellenes.
═══════════════════════════════════════════════════════════════════════════
