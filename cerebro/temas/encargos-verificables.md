---
slug: encargos-verificables
titulo: Escribir un encargo que otro pueda ejecutar y cualquiera pueda verificar
alias: [encargo, encargos, brief, briefs, briefing, prompt, prompts, promt, promps, escribir el prompt, armar el prompt, prompt para el agente, prompt de construccion, prompt de diseno, instrucciones al agente, orden al agente, tarea al agente, spec, especificacion, requisitos, criterios de aceptacion, criterio de aceptacion, criterios verificables, definicion de terminado, definicion de hecho, DoD, done, checklist, chequeo, chequeos, autochequeo, autochequeos, grep negativo, greps negativos, grep que de 0, copy congelado, texto congelado, frase congelada, congelar copy, no toques, intocable, prohibiciones, prohibido, lista de prohibido, delegar, delegacion, encargar, mandar a hacer, subagente, subagentes, builder, builders, agente barato, haiku, haiku barato, modelo barato, ejecutor, generador, tercero, freelance, el del equipo, auditar salida, auditar el entregable, revisar lo que entrego, rubrica, rubricas, porcentaje de avance, avance, juez, juez externo, calificar, numeros en el prompt, medible, medibles, adjetivos, se ve bien, hizo otra cosa, no hizo caso, no me hizo caso, se invento, invento datos, relleno, se lo salto, ignoro la instruccion, quedo mal el brief, brief flojo, el grep no lo vio, el grep dio 0 y estaba mal, grep en 0, grep de 0 lineas no basta, grep insuficiente, criterio que solo greppea, verificar con grep, comprobar con grep, valor calculado, valor computado, clamp, calc, variable css, escala de espaciado, tokens de espaciado, espaciado fuera de escala, padding raro, padding que no esta en la escala, arbitrary value, valor arbitrario de tailwind, contraejemplo, contraejemplo en un comentario, la regla se marco a si misma, el comentario salio como infraccion, falso positivo del grep, regla que se autoincumple]
preguntas: ["como le escribo el encargo a un agente", "como hago un brief que no falle", "por que el agente hizo otra cosa", "como cierro un brief para que no invente", "que le pongo al final del prompt para poder verificarlo despues", "le dije que no tocara admin y lo toco igual, que hago", "como le encargo algo a alguien del equipo sin que cada quien se ponga su propia nota", "como se si el subagente si cumplio lo que le pedi", "el grep dio 0 pero igual estaba mal, que me falto", "como verifico un criterio de espaciado o de color", "por que el grep marca mi propio comentario como error"]
proyectos: [wrd, orama, landings, villa-broaster, infrapilot, _permanent]
confianza: alta
actualizado: 2026-08-27
---

# Escribir un encargo que otro pueda ejecutar y cualquiera pueda verificar

## Respuesta corta

**Una prohibición que no se puede comprobar leyendo la salida, no existe.** Convierte
cada regla en un procedimiento: **greps negativos que deben devolver 0 líneas**,
**frases congeladas que deben seguir devolviendo 1+**, y **criterios numerados que
sean mediciones** —ms, px, hex, ratio de contraste— nunca adjetivos. **Un grep en 0 no
cierra un criterio de px, hex o ms: eso se cierra midiendo en el navegador**, y la regla
nunca lleva su contraejemplo escrito tal cual o el propio grep la marca. **Antes de
mandarlo, cuenta lo que pides contra los datos que citas**: el hueco que dejes, el
ejecutor lo rellena inventando. Cierra con una **Definición de terminado que sea la
suma aritmética de esos números** y exige que el ejecutor **pegue la salida**. Si tu
encargo se puede cumplir sin cambiar una sola línea, no era un encargo.

## Por qué (qué lo pagó)

**Lo dice literal la decisión que creó el primer agente con esta regla.** `infrapilot/DEC-011`
razona: *"una prohibición declarada no basta para que un LLM no rellene huecos con
verosimilitud"* — y por eso el "sin inventar nada" del dueño se implementó como
checklist obligatorio, no como intención. El apartado 2 del agente se llama, textual,
**«Sin inventar nada» es un procedimiento, no una intención**
(`C:\Users\Kalel\.claude\agents\orion-landing.md:46`), y termina en la regla que
gobierna todo: *"Un prompt que no se puede verificar no sirve"* (`:124-126`). Se
escribió después de encontrar copy inventado en 3 proyectos distintos —horario falso
confesado en un comentario de código, producto/precio que no existía en el catálogo
real, un testimonio inventado— (`infrapilot/KN-033`).

**Lo pagó un encargo que se podía cumplir sin cambiar nada.** El prompt v1 de la
portada de Mercaplaza estaba bien investigado, con orígenes y sin datos inventados, y
tres días después el dueño pidió **exactamente lo mismo**: *"un prompt para un diseño
de landing con animaciones, mejores colores, más llamativa"*. La causa está medida:
v1 trataba sus tres ejes como **adjetivos** ("que tenga movimiento", "producto
protagonista") en vez de como especificaciones (`landings/KN-002`). La medición base
del build al 2026-08-19 a 390×844 —documento 3616 px, héroe 963 px, primera tarjeta
pedible en y=1994 (2,4 pantallas), 14 elementos animados, 7 con `will-change`
permanente— es lo que el v2 sí pudo poner como meta numérica.

**Lo pagó tres veces el hueco que deja el encargo.** Un builder haiku inventó la
ciudad **"Rionegro"** en las keywords SEO —trabajo técnico correcto, dato de negocio
falso—; costó 2 ediciones inline arreglarlo y **8 líneas de grep** detectarlo:
*"barato de auditar, caro de no verlo"* (`villa-broaster/KN-008`). Otro builder
escribió **en femenino** el plan del diseñador de landing y dejó un `$name` literal
sin expandir en la salida (`villa-broaster/KN-014` punto 4, `villa-broaster/DEC-010`).
Y el prompt v2 de la vitrina **mandaba dibujar 23 productos citando solo 10**: dos de
los tres verificadores adversariales lo marcaron como BLOQUEA **antes de ejecutar**,
evitando que el generador inventara 13 nombres y precios
(`villa-broaster/metrics.json`, `session-2026-08-24-prompt-v3-landing`).

**Y lo pagó el hecho de que "salió bien" no significa nada.** `_permanent/KN-016`:
`verdict: ok` en las métricas mide **que el spawn aterrizó, no que acertó**. Los tres
desastres documentados de haiku —seed corrupto, "Rionegro", el género equivocado—
figuran los tres como `ok`, porque el spawn terminó. Sin criterio verificable en el
encargo, ni el ejecutor ni las métricas te avisan.

**Del otro lado, cuando el encargo trae números, se nota.** El prompt de la demo de
Orama cerró con **23 criterios numerados** (`orama-demo.md:473-501`) y el resultado
fue **PASS 12/12 con 0 ciclos de corrección**, medido: 84.925 tokens de opus
escribiendo el prompt + 73.949 de sonnet verificando (`orama/KN-002`; el plan de
servicio, misma disciplina, `orama/KN-003`, también 12/12).

**Y para personas es la misma regla.** El proyecto pidió literal *"tú vas a ser juez
del avance"*, y la rúbrica quedó escrita: *"el porcentaje lo asigna ORION cada viernes
según criterios VERIFICADOS (tests, navegador, archivos, PRs), nunca autorreportados;
solo sube con evidencia"* (`villa-broaster/DEC-011`). La semana 1 arrojó números
incómodos pero reales —E1 0 · E2 50 · E3 12 · E4 0 · E5 40 · E6 0 · E7 0 · E8 15—
en vez de la niebla optimista de preguntarle a cada quien cómo va.

## Cómo se aplica

1. **Antes de escribir, cuenta.** Ítems que pides vs. ítems que citas. Si pides 23
   productos y adjuntas 10, el ejecutor inventa 13. Lo mismo con fotos, secciones,
   pantallas y campos. Es la comprobación más barata del encargo entero.
2. **Prohibiciones numeradas, cada una con su cita.** No "no metas nada de admin":
   una lista donde cada punto dice qué está prohibido **y por qué existe**, con su
   `archivo:línea` o su decisión. El modelo son los 11 puntos de
   `LANDING-PROMPT.md:457-483` — el 10 dice *"Botón que abra WhatsApp directo: eso fue
   explícitamente reemplazado por el modal de pedido (DEC-004). No lo revivas"*.
   Sin esa frase, el siguiente builder lo revive de buena fe.
3. **Greps negativos: cada uno debe devolver 0 líneas.** Escribe el comando exacto y
   el número esperado. Los siete de `LANDING-PROMPT.md:531-558` cubren: sin siembra ni
   escritura del catálogo, sin superficie administrativa, sin productos ni precios
   hardcodeados, sin placeholders ni WhatsApp directo, sin dependencias externas
   nuevas, sin cifras sociales inventadas, sin promesa de contacto del negocio.
   Detalle que ya se pagó: el grep de precios va **solo sobre HTML**, porque en CSS un
   `10000` sería un `z-index` y daría falso positivo (`:543`).
3b. **El grep en 0 es el primer filtro, no la prueba — y para tamaño, color o espaciado
   la prueba es medir en el navegador.** Medido el 2026-08-26: el criterio *"no hay
   espaciados fuera de la escala"* se comprobaba con un grep de `p-[Npx]` sobre `app/` y
   `components/` y daba **0**, pero midiendo el CSS ya calculado a 390 px aparecieron
   **dos paddings de 22 px** que salían de `p-[clamp(22px,2.6vw,34px)]`: el valor prohibido
   estaba ahí, envuelto en un `clamp` que el patrón no caza (`villa-broaster/KN-024`).
   Regla: **si el criterio habla de píxeles, hex, ms o ratio, el grep se acompaña de un
   `getComputedStyle` en el ancho real** — un criterio que solo greppea da falsa
   tranquilidad, y el ejecutor la reporta de buena fe. El cómo se mide está en
   [[TEMA-verificar-con-evidencia]].
3c. **Una regla que se verifica con grep NO puede llevar su contraejemplo escrito tal
   cual.** En el mismo run, la regla se documentó en un comentario del código con el
   valor prohibido literal, y **el propio grep de la regla marcó el comentario como
   infracción** (`villa-broaster/KN-024`). Costó una vuelta entera de verificación.
   Escribe el contraejemplo partido (`p-[` + `22px]`), descrito en palabras, o excluye
   comentarios en el propio comando — y decídelo **al escribir el encargo**, no cuando
   el grep dé rojo.
4. **Copy congelado: cada frase debe seguir devolviendo 1+ línea.** 13 greps con su
   archivo en `:560-576`, más el texto nuevo que debe aparecer **una sola vez** como
   constante compartida (`:578-582`). Es lo que impide que un ejecutor "mejore" el
   texto que el dueño ya aprobó.
5. **Criterios que son mediciones, no adjetivos.** Numerados y corribles 1:1. De los
   23 de Orama: *"el borde inferior de `#btnEntrar` queda en y ≤ 700px"* (3), *"la
   entrada dura entre 1700 y 1900 ms"* (4), *"≥20 pares `dt`/`dd` y ningún `dd` vacío"*
   (9), *"cero overflow horizontal a 320, 390, 414, 768, 1024, 1440 y 1920px"* (14),
   *"como máximo 6 animaciones corriendo a la vez"* (22). En un encargo de diseño,
   **"específico" quiere decir números**: inventario de animación con ms y curva,
   tabla de tokens reales con contraste calculado, y medidas del pliegue tomadas del
   build real con su meta (`landings/KN-002`).
6. **Tabla de estados forzables a mano.** No basta el camino feliz: una fila por caso
   raro con *cómo se fuerza* y *qué se debe ver*. Los 6 de `LANDING-PROMPT.md:584-593`:
   store vacío, agotado, quedan pocas, singular ("Queda 1", no "Quedan 1"), sin
   límite, y carrera de stock.
7. **Autochequeos que el propio ejecutor se aplica antes de entregar**, escritos como
   preguntas de sí/no. Los 10 de `villa-app-villa-broaster-v3.md:1205-1236` abren con
   *"Si alguna respuesta es «no», vuelve atrás"*: ¿el fondo de la portada es oscuro?
   ¿puedes señalar el origen de cada cadena de texto? ¿congelaste la página
   (`getAnimations()` = 0) y sigue pareciendo que algo acaba de pasar? Un criterio que
   el ejecutor puede comprobar solo vale más que diez adjetivos.
8. **Definición de terminado = la suma aritmética.** Literal: *"Los siete greps de
   10.1 en 0. Los 13 de 10.2 con sus líneas. Los 6 casos de 10.3 verificados. Los 7
   flujos de 10.4 pasando. Las 8 medidas de 10.5 dentro de meta, con las 12 capturas"*
   (`LANDING-PROMPT.md:644-650`). Nadie negocia con una suma.
9. **Di cómo se reporta, y exige la confesión.** Commits separados y nombrados, la
   salida de los greps **pegada**, las capturas adjuntas, y arriba de todo la lista de
   archivos tocados. Y la regla honesta: *"Si tocaste alguno de los congelados, ponelo
   en la primera línea del reporte con la razón; esconderlo es peor que haberlo hecho"*
   (`:652-656`).
10. **Marca lo intocable arriba del todo, antes de los datos.** El encargo de WRD abre
    con *"Este encargo es conservador… No lo reconstruyas. No lo «mejores». No lo
    refactorices"* y una regla de oro con la lista de archivos que obligan a pararse
    (`:11-23`). En un generador de diseño la pieza equivalente es la ARMADURA, también
    arriba de todo (`landings/POL-004`).
11. **Para una persona del equipo, la misma estructura con otras palabras.**
    Definición de hecho para todos: *"`verificar` en verde en la app tocada; probado en
    navegador real (y en 390px si es vitrina o login); sin datos inventados; sin claves
    en el código; si cambió una regla de negocio, hay test que la demuestra"*
    (`villa-broaster/PLAN-EQUIPO.md:60-63`), más un checklist de revisión por PR
    (`:65-69`). Y el porcentaje lo pone un **juez externo** con la escala escrita por
    hitos comprobables —*"Base construida y verificada (107 tests) = 50; integrada en
    main con QA independiente = 80; T-11 completa = 100"*
    (`docs/semanal/avance.json:23`)—, publicado en un formato que la gente sí abre: un
    PDF de 110 mm × 195 mm, tamaño de celular (`villa-broaster/DEC-011`, commit
    `76af678`). Aquí solo se escribe el criterio; **quién lo califica y con qué prueba
    es [[TEMA-que-es-estar-verificado]]**.
12. **Deja el encargo escrito también cuando NO se ejecutó.** `wrd/PEND-006` guarda la
    ola completa bajo el rótulo *"Contenido exacto para relanzar sin arqueología"*:
    cada pieza con su modelo, su alcance y sus congelados. Un pendiente escrito así se
    relanza; uno escrito como intención se vuelve a pensar desde cero.

## Cuándo NO aplica

- **En exploración y prototipos desechables.** Congelar copy y superficies mata la
  iteración. Primero explora, cierra la dirección, y **recién ahí** escribe los
  números (`landings/KN-002` es explícito: medir un build que no existe es teatro).
- **No congeles greps sobre código que vos mismo pediste refactorizar en esa misma
  ola**: vas a estar peleando contra tu propio encargo.
- **En código puro con tests, la prueba ya es la auditoría.** El grep exhaustivo de
  salida es para **texto que va a leer un humano** —SEO, metadata, copy, un documento
  dirigido a una persona con nombre—. Ojo con el matiz: el trabajo técnico del modelo
  barato salió bien las tres veces; lo que falla es el dato de negocio
  (`villa-broaster/KN-008`, `_permanent/KN-016`).
- **En tareas de una sola pasada que vas a revisar entera a mano**, el checklist
  cuesta tokens y el revisor humano es más barato. Es la misma lógica de la ceremonia
  proporcional: el pipeline completo costó **~10x** lo inline —168k tokens de
  subagente para un README de 91 líneas— (`infrapilot/DEC-007`).
- **Un criterio solo es verificable si el MEDIO puede ejecutarlo.** Aquí el corpus se
  contradice y hay que leer las dos mitades: Orama, con 23 criterios numéricos sobre
  un ejecutor que devuelve código vivo, salió **PASS 12/12 con 0 fix cycles**
  (`orama/KN-002`); Villa Broaster v2, también con números y orígenes, fue
  **rechazado** porque el generador devuelve láminas quietas y su inventario de diez
  animaciones midió `getAnimations()` = **1** (`landings/KN-008`, `landings/POL-004`).
  Los números hacen el encargo **verificable**, no lo hacen **cumplible**: antes de
  numerar, pregunta qué de eso puede ejecutar el destinatario (ver
  [[TEMA-generadores-de-diseno]]).
- **Un criterio verificable también puede ser IMPOSIBLE, y eso no lo caza ningún
  grep.** El autochequeo 2 del v3 tuvo que corregirse porque, bajo `mix-blend-mode:
  multiply`, *"la costra nunca puede ser más brillante que una etiqueta blanca, y
  pedirlo sería pedir un imposible"* (`villa-app-villa-broaster-v3.md:1211-1212`). Lo
  encontró un panel adversarial, no el ejecutor. **Hueco abierto del corpus**: nada
  comprueba que los criterios sean satisfacibles, y la única red que existe hoy costó
  1.083.934 tokens (11 agentes, 30 hallazgos, 20 graves corregidos —
  `villa-broaster/metrics.json`, `session-2026-08-24-prompt-v3-landing`).
- **Tensión medida sobre la LONGITUD del encargo.** El estándar dice *"un brief de
  agente = objetivo + insumos de su fase + extractos relevantes + qué significa
  «terminado»; si pasa de ~60 líneas, estás pegando en vez de extractando"*
  (`.claude\skills\orion\SKILL.md:139-141`). Y sin embargo los encargos que sí
  aterrizaron miden 501 (`orama-demo.md`), 656 (`LANDING-PROMPT.md`) y 1270 líneas
  (`villa-app-villa-broaster-v3.md`). No se contradicen si separas las dos cosas:
  el cap de 60 líneas gobierna el **contexto que pegas** —eso se extracta— y no la
  **especificación** —criterios, prohibiciones y greps, que son el entregable de la
  garantía—. Regla práctica: subagente dentro de tu propia corrida, donde vos ya
  leíste las fuentes y vas a corregir inline → brief corto. Ejecutor **fuera** de tu
  contexto —un generador, otra ventana, una persona— → documento largo, porque no hay
  orquestador que lo corrija.
- **El juez externo no sirve si el criterio no es barato de comprobar**, ni si el juez
  es la misma persona que ejecuta: ahí el ritual pierde todo su valor y es mejor no
  montarlo (`villa-broaster/DEC-011`). Y no conviertas en checklist algo que **no
  sabés verificar**: eso produce teatro de proceso sin garantía.

## Evidencia

- `C:\Users\Kalel\fable 5\wrd\docs\LANDING-PROMPT.md` — el encargo modelo, 656 líneas:
  `:11-23` (regla de oro y archivos que obligan a pararse), `:457-483` (11
  prohibiciones con su cita), `:531-558` (7 bloques de grep negativo, meta 0 líneas),
  `:560-582` (13 frases congeladas + 1 constante nueva que aparece una sola vez),
  `:584-593` (6 estados forzables a mano), `:595-610` (7 flujos de regresión),
  `:612-640` (8 medidas con su meta y método + 12 capturas), `:644-656` (Definición de
  terminado como suma + cómo se reporta + regla de confesar lo congelado).
- `C:\Users\Kalel\ORION\prompts-landing\orama-demo.md:473-501` — 23 criterios de
  aceptación numerados, todos con número duro (ver 3, 4, 9, 14, 22).
- `orama/KN-002` — PASS 12/12, 0 fix cycles; costos medidos en `source`: opus 84.925
  tokens escribiendo + sonnet 73.949 verificando. `orama/KN-003` — 12/12 en el plan de
  servicio.
- `landings/KN-002` — "si el prompt se puede cumplir sin cambiar una línea, no era un
  prompt"; los tres ejes como especificación; medición base de placita al 2026-08-19.
- `villa-broaster/KN-024` (2026-08-26, T-034) — **el límite medido del grep negativo**:
  `p-[Npx]` en 0 y aun así dos paddings de **22 px** calculados a 390 px, escondidos en
  `p-[clamp(22px,2.6vw,34px)]`; y la trampa gemela, la regla escrita en un comentario con
  su contraejemplo literal que el propio grep marcó como infracción. Dos vueltas de
  verificación, una por cada trampa.
- `landings/POL-004` — armadura + anexo: las dos piezas fijas de todo prompt a un
  generador. `landings/KN-008` — `getAnimations()` = 1 sobre el entregable del v2.
- `infrapilot/DEC-011` — "una prohibición declarada no basta… convertirla en
  procedimiento verificable es lo que la hace cumplible run tras run".
  `infrapilot/KN-033` — el copy de relleno que llega a producción (3 proyectos).
  `infrapilot/DEC-007` — ceremonia proporcional: el pipeline completo ~10x lo inline.
- `C:\Users\Kalel\.claude\agents\orion-landing.md:46` (título del apartado 2),
  `:50-70` (los 6 pasos del procedimiento; `:65` "verosímil es exactamente la forma que
  tiene una mentira útil"), `:124-126` ("Un prompt que no se puede verificar no
  sirve"), `:158-162` (qué debe traer el reporte del ejecutor).
- `villa-broaster/KN-008` — "Rionegro" inventado por haiku; 2 correcciones inline, 8
  líneas de grep para detectarlo. `villa-broaster/KN-014` punto 4 y
  `villa-broaster/DEC-010` — género femenino al diseñador de landing y residuo `$name`
  sin expandir.
- `C:\Users\Kalel\prommter\proyectos\villa-broaster\memory\villa-broaster\metrics.json`,
  `session-2026-08-24-prompt-v3-landing` — literal: *"mandaba dibujar 23 productos
  citando solo 10 → el medio habría inventado 13 nombres y precios"*; 11 agentes,
  1.083.934 tokens, fixCycles 1.
- `C:\Users\Kalel\ORION\prompts-landing\villa-app-villa-broaster-v3.md:1174-1204`
  (8 prohibiciones de la armadura), `:1205-1236` (10 autochequeos de sí/no),
  `:1211-1212` (el criterio imposible, corregido), `:1240-1257` (ANEXO B: coreografía
  B1-B10 con ms y curva, rotulada "no es para ti, lienzo").
- `villa-broaster/DEC-011` — rúbrica del juez externo y semana 1 (E1 0 · E2 50 · E3 12
  · E4 0 · E5 40 · E6 0 · E7 0 · E8 15), commit `76af678` verificado.
  `C:\Users\Kalel\prommter\proyectos\villa-broaster\docs\semanal\avance.json:13,23,121`
  — criterios por entrega y el texto de la rúbrica.
- `C:\Users\Kalel\prommter\proyectos\villa-broaster\PLAN-EQUIPO.md:60-63` (definición
  de hecho para personas) y `:65-69` (checklist de revisión del senior en cada PR).
- `_permanent/KN-016` — `verdict: ok` mide que el spawn aterrizó, no que acertó; los
  tres desastres de haiku figuran como `ok`.
- `wrd/PEND-006` — el pendiente escrito como encargo relanzable ("contenido exacto para
  relanzar sin arqueología"). `wrd/KN-004` — la ronda adversarial que encontró 16
  hallazgos reales y que el encargo de la landing declara intocable.
- `C:\Users\Kalel\.claude\skills\orion\SKILL.md:139-141` — el cap de ~60 líneas por
  brief de agente, la otra mitad de la tensión de longitud.

## Enlaces

- [[TEMA-que-es-estar-verificado]] — **el tema hermano**: este es escribir el encargo,
  aquel es juzgar el resultado. Si tu pregunta es *"¿esto ya quedó?"* o *"¿cómo reviso
  lo que entregó el agente?"*, es ese y no este.
- [[TEMA-verificar-con-evidencia]] — cómo se mide en esta máquina lo que aquí escribes
  como criterio (captura por CDP, medición, y por qué no se confía en la vista).
- [[TEMA-cero-datos-inventados]] — qué puede entrar como dato en el encargo y qué se
  entrega como hueco numerado.
- [[TEMA-generadores-de-diseno]] — cuando el ejecutor es un lienzo quieto: armadura,
  estado congelado y anexo de coreografía.
- [[TEMA-olas-de-agentes]] — el otro lado del brief: quién posee qué archivo y qué se
  declara intocable cuando son varios ejecutores a la vez.
- [[TEMA-modelos-y-costos]] — cuánta ceremonia y qué modelo merece el encargo antes de
  escribirlo.
- [[TEMA-documentos-para-personas]] — cuando el ejecutor es una persona del equipo y el
  encargo es un plan que va a abrir en el celular.
