---
slug: documentos-para-personas
titulo: Escribir un documento que una persona de verdad va a usar
alias: [manual, manuales, manual de uso, documento, documentos, documentacion, instructivo, instrucciones, guia, guias, cartilla, plan, planes, plan de equipo, plan de trabajo, onboarding, induccion, capacitacion, capacitar, entrenar, ensenar, explicar, explicarle, explico, empleado, empleado nuevo, empleados, trabajador, trabajador nuevo, personal, gente, equipo, cajero, cajera, mostrador, rol, roles, paso a paso, tutorial, ayuda, readme, pdf, imprimir, celular, folleto, hoja, procedimiento, protocolo, entrega al cliente, para que arranque, pdf para el contador, pdf del contador, pdf para quien lo reenvia, lo reenvia sin traducir, hoja de datos del cliente, chrome headless, print-to-pdf, no-pdf-header-footer, kMDItemNumberOfPages, qlmanage, pdftoppm, guion para grabar, guiones para grabar, guiones de reel, reel por dia, grabar videos reales, que me falta para que funcione, ya quedo, paso uno detallado, guiar paso a paso, un paso a la vez, dns, hpanel, a quien le toca]
preguntas: ["¿cómo le explico el proyecto a un empleado nuevo?", "¿cómo le enseño el sistema a un cajero nuevo?", "¿qué documento le entrego al equipo para que arranque?", "¿cómo escribo un manual que la gente sí lea?", "¿por qué me rechazaron el plan de trabajo que escribí?", "¿Qué nos falta para que ya funcionen los pedidos en línea y qué me toca hacer a mí?", "¿Cómo armo el PDF de lo que necesitamos del contador y cómo lo reviso en esta Mac?", "El dueño quiere grabar videos reales en el local, ¿cómo le armo los guiones para que le sirvan?"]
proyectos: [villa-broaster, placita, wrd, prommter, estanco-contable, duo-burguer, la-villa]
confianza: alta
actualizado: 2026-11-02
---

# Escribir un documento que una persona de verdad va a usar

## Respuesta corta

Un documento para una persona no es un resumen del proyecto: es **una ruta de
trabajo para UN lector con nombre**. Cuatro reglas. **(1) Pártelo en dos piezas
por audiencia**: una interactiva móvil-primero, que se lee de pie, y un PDF
formal por persona con **solo lo suyo**; el documento único y genérico ya fue
rechazado una vez. **(2) Abre por "lo que falta" y por la ruta de lectura de ESA
persona** —*"si es cajero, lo suyo es 5, 6, 7, 8, 9 y 13"*— nunca por quién
manda ni por la estructura de la empresa. **(3) Escribe en los verbos del que
trabaja** (vender, pesar, entrar con su PIN) y **cita textual lo que ve en
pantalla**, respondiendo siempre sus dos preguntas: *¿puedo seguir trabajando?*
y *¿es mío este problema o de otro?* **(4) Nada entra sin verificarse abriendo la
pantalla**, y lo que solo se leyó en el código va marcado como tal al pie de la
sección.

## Por qué (qué lo pagó)

Lo pagaron un plan de equipo devuelto y un manual que resultó ser una auditoría.

**El rechazo.** El 2026-08-22 el primer plan de equipo de Villa Broaster —ya
construido, interactivo— fue devuelto: *"vista previa interactiva rechazada"*
(`villa-broaster/DEC-010`). Lo que pidió el proyecto no fue un cambio de gusto
sino de **encuadre**, y quedó literal: planes *"orientados 100% a la ejecución
del proyecto sin referencias al dueño ni estructura empresarial en el
frontispicio del documento"*, con **"lo que falta" al frente** y la publicación
en web pública como entregable central. Rehacerlo costó, medido en
`villa-broaster/metrics.json` (`session-2026-08-22-planes-v2-marketing`):
**300.726** tokens de `build:visual` en opus, **185.556 + 95.742** de
`build:page` en sonnet y **77.953** de análisis. Un documento mal encuadrado no
se arregla con un párrafo: se reescribe entero.

**El destinatario es una persona, no un rol.** En esa misma primera versión un
builder barato le escribió **en femenino** al diseñador de landing
(`villa-broaster/KN-013`, `villa-broaster/KN-014`): *"plan-{rol}.html/pdf va a
PERSONAS, nombres cuentan"*. No lo detectó ninguna prueba: hubo que buscarlo a
mano en el fuente antes del commit, junto con residuos de variables sin expandir
(un archivo literal `docs/planes$name.pdf`).

**Escribir el manual encontró bugs.** El manual de Mercaplaza
(`placita/KN-037`) son 18 secciones y 54 páginas, y al redactarlo el builder
descubrió verdades del producto que nadie había escrito: la báscula captura sin
exigir peso estable, la merma es **solo-dueño**, la factura electrónica es un
stub informativo que **no emite**. Costó ~557.000 tokens (dos builders opus,
251.800 + 305.153, `placita/metrics.json`
`session-2026-08-21-manual-pantalla-completa`) y a cambio quedó como *"la única
fuente oficial de verdad operativa del dueño"*. Redactar para una persona obliga
a abrir cada pantalla: es una auditoría con otro nombre.

**La honestidad se escribe en el papel, no se promete.** De las 18 secciones,
**12 se verificaron en vivo y 6 contra código**, y cada una cierra diciendo cuál
fue: `placita/manual/05-vender.md` termina en *"Verificado contra código
2026-08-21 — prueba en vivo pendiente."*

**Releer cuesta casi lo mismo que escribir.** La relectura de los cinco planes
(9 arreglos de redacción, tipografía y glifos) consumió **299.402 + 254.111**
tokens en dos builders sonnet (`session-2026-08-23-relectura-planes`).
Presupuesta la relectura desde el principio; no es un extra.

## Cómo se aplica

1. **Dos piezas por audiencia** (`villa-broaster/KN-013`). (A) `plan-equipo.html`:
   fragmento HTML sin `<html>/<head>/<body>` —abre en el navegador y se publica
   como Artifact—, móvil-primero, con tablero de entregas, tabs por rol,
   acordeones por tarea y calendario. (B) `docs/planes/plan-{rol}.pdf`: un PDF
   formal por persona (22/19/13/12/13 páginas) con **solo su talón**: qué hace en
   cada etapa, criterios de hecho, bloqueadores y a quién le pide revisión.
2. **Ruta de lectura por rol en la primera pantalla**, antes de cualquier
   contenido: *"si nunca lo ha usado, secciones 1 a 5 en orden"*, *"si es cajero,
   lo suyo es 5, 6, 7, 8, 9 y 13"*, *"si algo se ve raro, vaya derecho a la 17"*
   (`placita/MANUAL-DE-USO.md:19-27`). Y una promesa explícita: *"No hay que
   saber de computadores para seguirlo"* (`:16`).
3. **Una sección = un archivo**, para poder imprimir una sola y dejarla pegada
   junto a la caja (`placita/MANUAL-DE-USO.md:28`, carpeta `placita/manual/`).
4. **Titula con los verbos del que trabaja**, no con los sustantivos del sistema:
   `05-vender.md`, `06-la-bascula.md`, `03-entrar-con-su-pin.md`,
   `15-avisos-que-no-son-errores.md`, `17-si-algo-se-ve-raro.md`.
5. **Los avisos de pantalla, citados textuales y en tabla** *Aviso | Qué pasó |
   Qué hacer*, y en cada fila las dos respuestas que la persona necesita: si
   puede seguir (*"la caja sigue vendiendo"*) y de quién es el problema (*"Es del
   dueño: entrar a Supabase, abrir el SQL Editor y pegar…"*).
   Ver `placita/manual/15-avisos-que-no-son-errores.md`.
6. **Traduce tu jerga, y con dos palabras basta**: Kardex y FEFO explicados en
   una frase cada uno, arriba del índice (`placita/MANUAL-DE-USO.md:37-45`).
7. **Antes de arrancar, dile qué tener a mano y cuánto va a tardar de verdad**:
   *"Se hace una sola vez y toma como media hora. No hay que saber programar: es
   copiar, pegar y hacer clic"* + la lista de insumos
   (`wrd/setup/INSTRUCCIONES.md:11-18`). Y nombra los botones como se ven
   ("*Start your project*, botón verde, arriba a la derecha").
8. **Los huecos van escritos como huecos**, con apartado propio: *"HUECOS que el
   dueño debe llenar antes de arrancar"* y *"Qué NO incluye"*
   (`prommter/equipo/planes/plantilla-plan.md`). En Prommter la regla es previa
   al trabajo: toda idea del dueño **se vuelve plan escrito `AAAA-MM-DD-nombre`
   antes de ser trabajo** (`prommter/KN-001`).
9. **Criterio de hecho verificable y avance con evidencia**: el porcentaje solo
   sube si hay algo que se pueda abrir —tests en verde, demo, PR, archivo—, y si
   no hay evidencia nueva **no se mueve aunque haya trabajo hecho**
   (`villa-broaster/DEC-011`, `docs/semanal/README.md`).
10. **Antes de entregar, audita a mano**: género gramatical del destinatario,
    nombre correcto, residuos de plantilla sin expandir (`villa-broaster/KN-014`).
11. **Formato y máquina**: HTML → PDF con Edge headless; para leerlo en el
    teléfono, `@page 110mm × 195mm` con `print-color-adjust` en las barras; para
    ver cómo queda, `edge-cdp.mjs --shot`, nunca `--screenshot` plano
    (ver [[TEMA-verificar-con-evidencia]]).
12. **Modelo por pieza** (medido): opus para la pieza visual de cara al equipo,
    sonnet para los PDF formales largos (`villa-broaster/KN-013`, calibración
    confirmada en `session-2026-08-22-plan-equipo-tres-repos`).

13. **Si el lector es el dueño y le toca ejecutar, guíalo de a UN paso.** A «¿ya
    funciona?» o «¿qué nos falta?» contesta con hechos, sondeando lo real (¿resuelve el
    DNS?, ¿responde con HTTPS?, ¿qué carta y versión tiene el sistema?, ¿ya cambió el
    PIN?), y reparte los bloqueos por responsable (dueño / PC / Mac), primero el que
    frena todo. Luego: dónde tocar, valores campo por campo, qué NO tocar; espera su «ya
    quedó» y compruébalo tú antes del siguiente paso. Lee el procedimiento en el código,
    no en la documentación de otro agente (la del PC decía que reiniciar activaba el PIN
    nuevo: era falso, solo lo activa el script de arranque).
14. **Documento que otro reenvía (contador, proveedor): escríbelo para quien lo reenvía.**
    Abre con lo que ya miramos de su negocio; cada pregunta con casilla, espacio para
    responder y una línea gris con el porqué; resalta las dos que más mueven el
    trabajo; cierra con el cuadro «el sistema registra y transmite · el contador decide
    y firma · el dueño responde por el mostrador» y «no es asesoría tributaria». En esta
    Mac se genera con Chrome headless (`--print-to-pdf --no-pdf-header-footer`): no hay
    `pip` (entorno protegido) ni `pdftoppm`; cuenta páginas con
    `mdls -name kMDItemNumberOfPages` y mira la 1 con `qlmanage -t -s 1400`. Copia en
    `~/Desktop/<Cliente>/<Tema>/` ([[TEMA-como-entregar-al-dueno]]).
15. **Guiones para que el dueño grabe:** reales (sin gastar la animación), claros,
    graciosos, interactivos (comentar o etiquetar) y que muestren el punto, no solo
    vendan; un reel por día. PDF carta detallado (~18 págs.): reglas de celular, luz y
    sonido, frase para pedir permiso a clientes, utilería con el reel donde se usa,
    orden de grabación por bloques de luz y lugar (6 bloques ≈ 3 h), una página por reel
    (tomas con plano, segundos, qué se dice, texto en pantalla, plan B, texto para
    publicar) y cómo devolver las tomas. Sin el evento secreto en cámara ni teléfonos a
    la vista. Revisa página por página que nada se desborde: el PDF salió con 24 págs.
    y bajó a 18 al corregir dos desbordadas.

## Cuándo NO aplica

- **Si el lector es una máquina, todo se invierte.** `CLAUDE.md`, `AGENTS.md`,
  briefs de agente y objetos de memoria se escriben densos y con cita
  `archivo:línea`, sin ruta de lectura ni tono amable: ver [[TEMA-memoria-y-cierre]].
- **Si el lector es un cliente comprando, manda vender, no explicar.** La señal
  es quién mira: trabajador adentro = calma; cliente afuera = venta
  (`landings/POL-001`, [[TEMA-generadores-de-diseno]]).
- **Un documento no sustituye el aviso en la pantalla.** La migración pendiente
  de placita se resolvió porque **la caja la nombra en vivo** y el manual solo
  la explica (`placita/KN-040` + `manual/15`). Si la persona necesita el PDF
  para no equivocarse, el arreglo va en la interfaz.
- **No montes el pipeline completo para un documento pequeño**: el ciclo entero
  costó ~168k tokens de subagente para un README de 91 líneas
  (`infrapilot/DEC-007`); 1 archivo se escribe inline ([[TEMA-modelos-y-costos]]).
- **HUECO DECLARADO — nadie ha leído todavía estos documentos.** El corpus no
  tiene ninguna inducción de empleado en sentido laboral (contrato, horario,
  reglas de la casa): todo lo que hay son documentos **de proyecto** y **de uso**.
  Y ningún destinatario real los ha recibido: `villa-broaster/PEND-004` sigue
  *Ready* —falta invitar al equipo a los repos—, así que **todo el veredicto
  registrado es del dueño, ninguno del trabajador**. La primera vez que un
  empleado lea uno, hay que escribir aquí qué le falló.

- **Guía de a un paso (13):** no si el dueño es técnico o ya trae el procedimiento; en
  cambios de bajo riesgo pueden darse varios pasos juntos. Un «ya quedó» puede ser
  prematuro («quedé antes del comando, espérame los 5 min»): compruébalo, no lo asumas.
- **PDF para reenviar (14):** el recorrido con Chrome es el de la Mac; en el PC Windows
  se usa Edge headless con otras rutas. No aplica a documentos que no pasan por
  intermediario.
- **Guiones para grabar (15):** no para el contenido animado de campaña. Las ideas
  concretas de reels (el teclado que ya sabe, «los dos de Duo») son propuestas de
  Claude, **no validadas**: no las cuentes como lo que funciona. Dentro de la ventana
  no hay veredicto del dueño sobre el PDF.

## Evidencia

- `villa-broaster/DEC-010` — el primer plan visual rechazado y la instrucción
  literal de encuadre ("solo el proyecto", "lo que falta al frente").
- `villa-broaster/KN-013` — las dos piezas (interactiva + PDF por rol), sus
  páginas, y las cuatro lecciones de producción (género, residuos, capturas, PDF).
- `villa-broaster/KN-014` — auditoría manual de género y residuos pre-commit.
- `villa-broaster/DEC-011` — ritual semanal: PDF de celular 110×195 mm y el
  porcentaje que solo sube con evidencia.
- `villa-broaster/PEND-004` (Ready) — el equipo aún no ha sido invitado: nadie
  del destino ha leído los planes.
- `placita/KN-037` — manual de 18 secciones / 54 páginas, 12 verificadas en vivo
  y 6 contra código, pie de verificación por sección; hallazgos de producto.
- `placita/KN-040` — el aviso en pantalla nombra la migración que falta; el
  manual solo la explica.
- `prommter/KN-001` — plantilla de plan y la regla "toda idea se vuelve plan
  escrito antes de ser trabajo".
- `prommter/KN-004` — ritmo del equipo, tablero de 5 columnas, verificador
  distinto del autor, huecos del dueño listados.
- `estanco-contable/KN-006` — plan entregado como artefacto visual publicado;
  regla: si se actualiza, **republicar el mismo `file_path`** para conservar la URL.
- `landings/POL-001` — tensión de registro (calma adentro, venta afuera).
- `infrapilot/DEC-007` — ceremonia proporcional: 168k tokens para un README de
  91 líneas.
- Archivos: `prommter/placita/MANUAL-DE-USO.md` (:16, :19-27, :28,
  :37-45) y `.../manual/01..18-*.md`;
  `prommter/Equipo-villa-broaster/docs/plan-equipo.html` (149 KB) y
  `docs/planes/plan-{desarrollador-senior,disenador-landing,disenadora,marketing}.pdf`;
  `docs/semanal/README.md` + `avance.json` + `generar.mjs`;
  `fable 5/wrd/setup/INSTRUCCIONES.md:11-18`;
  `prommter/equipo/planes/plantilla-plan.md`.
- Costos medidos: `villa-broaster/metrics.json` (sesiones
  `plan-equipo-tres-repos`, `planes-v2-marketing`, `relectura-planes`) y
  `placita/metrics.json` (`manual-pantalla-completa`).

**Refuerzo 2026-11-02 (cosecha de ventanas del dueño).**

Guiar de a un paso (L-A2-08):
- «lo que va el pc para el sistema es suficiente para funcionar ya?» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-25)
- «okey vamos al paso uno detallado» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-28)
- «comprueba vamos al paso 5» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-28)
- «mentira quede antes del comando esperame los 5 m=in» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-28)
- «Reiniciar el sistema no activa el PIN nuevo.» — ventana [[2026-09-09-duo-burger|duo burger]] (transcrito `51184930`, 2026-09-28)

PDF para quien lo reenvía (L-E-18):
- «quiero que me dejes en un pdf lo que necesitamos de el para empezar» — ventana [[2026-09-09-la-villa-sistema|la villa sistema]] (transcrito `129e1026`, 2026-10-28)
- «quiero que me des un pdf explicando lo que necesitamos de el contador» — ventana [[2026-09-09-la-villa-sistema|la villa sistema]] (transcrito `129e1026`, 2026-10-31)
- «lo reenvía sin tener que traducir nada» — ventana [[2026-09-09-la-villa-sistema|la villa sistema]] (transcrito `129e1026`, 2026-10-31)
- «pdftoppm is not installed» — ventana [[2026-09-09-la-villa-sistema|la villa sistema]] (transcrito `129e1026`, 2026-10-28)

Guiones para grabar (L-B-15):
- «no quiero quemar los videos de animacion» — ventana [[2026-10-14-aqui-en-esta-ventana-de-contexto|aqui en esta ventana de contexto]] (transcrito `940655a9`, 2026-10-14)
- «unos que no sean solo ventas» — ventana [[2026-10-14-aqui-en-esta-ventana-de-contexto|aqui en esta ventana de contexto]] (transcrito `940655a9`, 2026-10-14)
- «quiero que grabemos el contenido de la semana hoy» — ventana [[2026-10-14-aqui-en-esta-ventana-de-contexto|aqui en esta ventana de contexto]] (transcrito `940655a9`, 2026-10-14)
- «quiero que sea bien detallado» — ventana [[2026-10-14-aqui-en-esta-ventana-de-contexto|aqui en esta ventana de contexto]] (transcrito `940655a9`, 2026-10-15)
- «Revisé cada página y nada queda cortado ni se pasa a la hoja siguiente.» — ventana [[2026-10-14-aqui-en-esta-ventana-de-contexto|aqui en esta ventana de contexto]] (transcrito `940655a9`, 2026-10-15)

## Enlaces

- [[TEMA-verificar-con-evidencia]] — cómo se imprime el PDF y cómo se captura para revisarlo.
- [[TEMA-modelos-y-costos]] — cuánto cuesta cada pieza y con qué modelo se hace.
- [[TEMA-acceso-roles-y-puestos]] — qué ve cada persona en el sistema; el documento por rol es su espejo en papel.
- [[TEMA-generadores-de-diseno]] — cuando la pieza la construye un generador de diseño.
- [[TEMA-memoria-y-cierre]] — el documento que se escribe para máquinas, no para personas.
- [[TEMA-como-entregar-al-dueno]] — dónde y cómo se le deja el documento al dueño.
- [[TEMA-huecos-del-dueno]] — el PDF de lo que falta y cómo pedirlo.
