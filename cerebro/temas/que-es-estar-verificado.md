---
slug: que-es-estar-verificado
titulo: Qué significa que algo "ya quedó": la definición de hecho
alias: [ya quedo, ya quedó, quedo listo, quedo bien, ya esta, ya está, esta listo, listo, terminado, terminada, terminar, estar terminado, esta terminado, cuando esta terminado, que es estar terminado, cuando doy por terminada una tarea, terminado de verdad, acabado, hecho, done, definicion de hecho, definicion de terminado, criterio de aceptacion, criterios de aceptacion, cuando digo que esta listo, dar por bueno, dar por buena, dar por hecho, declarar listo, decir que funciona, compila, compilo, compilar, compilar no es funcionar, basta con compilar, no basta con compilar, corre pero no sirve, funciona pero no hace nada, arranca pero, typecheck, type check, tsc, tsc --noEmit, strict, tsconfig, tsconfig ad-hoc, build, build verde, pasa el build, todo verde, en verde, tests en verde, pasan los tests, self-tests, self tests, selftests, unitarios, tests unitarios, smoke, smokes, camino feliz, e2e, E2E, prueba e2e, punta a punta, de punta a punta, prueba de punta a punta, ejercitar, probar de verdad, qa, QA, qa de agente, reviso, revisar, revision, revisar el trabajo de un agente, reviso el trabajo de un agente, como reviso el trabajo de un agente, revisar el trabajo del agente, revisar lo que hizo el agente, revisar lo que entrego el agente, recibir el trabajo de un agente, auditar el trabajo de un agente, calificar el trabajo de un agente, aprobar el trabajo de un agente, revisar entrega de agente, revisar builder, revisar al builder, revisar subagente, agente, agentes, subagente, builder, builders, el agente dice que quedo, el agente dice que ya quedo, confiar en el agente, confiar en lo que dice el agente, le creo al agente, verifier, verificador, verificacion, verificado, no verificado, QAReport, PASS, FAIL, adversarial, refutador, refutadores, romper el gating, seguridad, auth, admin, RLS, seed, seed limpio, con seed, sin seed, empresa nueva, cuenta nueva, base vacia, catalogo vacio, estado sucio, e2e sucio, datos viejos, datos de la version anterior, version anterior, VERSION_DATOS, migracion, middleware, proxy, PUBLIC_PATHS, curl, sw.js, manifest, webhook, 307, porcentaje, porcentaje de avance, avance, cuanto llevamos, quien califica, quien pone el porcentaje, juez, juez externo, autorreportado, se califica solo, falso positivo, falsos positivos, verde mentiroso]
preguntas: ["como se si algo quedo bien", "que es estar terminado", "basta con que compile", "como reviso el trabajo de un agente", "el build paso verde, ya puedo decir que funciona?", "que pruebo antes de decirle al dueño que quedo listo?", "los tests pasan pero el bug salio en produccion, que me falto probar?", "quien pone el porcentaje de avance?", "mi typecheck da errores y el del proyecto no, a cual le creo?", "hice login y panel de admin, con el verifier normal basta?"]
proyectos: [estanco-contable, arroces, placita, infrapilot, wrd, villa-broaster]
confianza: alta
actualizado: 2026-08-24
---

# Qué significa que algo "ya quedó": la definición de hecho

## Respuesta corta

**Compilar no es funcionar.** `tsc` en verde y "el código aterrizó en disco" no son
evidencia de nada: solo dicen que **corre**, no que **hace lo que promete**.
Para decir "ya quedó", **ejercita el camino completo** — y córrelo en los tres estados
que el seed esconde: **base vacía** (empresa nueva), **base sucia** (restos de otro), y
**datos guardados de la versión anterior**. Si algo lo pide un tercero sin sesión
(PWA, webhook, callback), **pégale un `curl` al servidor corriendo y mira el código**.
**El porcentaje de avance lo pone un juez externo con criterio verificable, nunca
quien hizo el trabajo**: autoverificarse tiene techo. Y si toca auth, admin o permisos,
suma **refutadores dedicados** — el verifier prueba que funcione, no que se rompa.

## Por qué (qué lo pagó)

**Lo pagó, primero, el "compila pero no está probado" que nadie cerró.** En
estanco-contable hay dos pendientes abiertos desde el **2026-08-01** que siguen en
estado `Ready` hoy, **23 días después**. `PEND-016` lo dice con todas las letras en su
`reason`: *"el codigo compila pero compilar no es funcionar"* — el código de la ola S1
aterrizó (12 referencias a `localStorage` en `components/store.tsx`, `tsc` exit 0) pero
el builder murió por límite diario justo antes de la prueba de recarga, así que **nadie
puede afirmar que la persistencia funciona**. `PEND-017` es el mismo patrón para
registro→vínculo: *"tsc da exit 0 pero la prueba en navegador quedo a medias"*. Dos
tareas que en cualquier reporte se habrían anotado como hechas.

**Lo pagó un builder que ACERTÓ y a nadie le sirvió.** El mismo proyecto: un builder
predijo el bug —*"una empresa recien registrada ve listas vacias"*— **y quedó sin
cerrar** (`estanco-contable/KN-012`, campo `context`). Resultado: `registrarEmpresa`
guardaba las sucursales en el almacén de auth y la pantalla de vinculación las leía del
seed demo, así que **todo dueño que se registraba quedaba encerrado fuera de su propia
app** y no podía facturar. Lo encontró el dueño usando el producto el 2026-08-01. Una
predicción sin prueba no es conocimiento: es una deuda.

**Lo pagó un 38/38 en verde con el bug adentro.** En arroces, el dominio pasó **38
self-tests de 38** (carta 6/6, pagos 8/8, cierre 6/6, pedido 18/18) y aun así
`pedidosDelTurno` filtraba por la fecha de **toma** del pedido en vez de por
`Pedido.cobradoEn`: la plata cobrada en el turno por pedidos tomados antes de abrir
salía como "sobrante" y las ventas del turno en $0. `arroces/KN-001` es explícito:
*"El bug NO fue de capacidad del modelo (el builder de S2/sonnet compiló y pasó sus
self-tests); solo lo reveló la verificación E2E en navegador, no el tsc ni los
self-tests unitarios."* Los self-tests probaban el módulo **consigo mismo**; el bug
vivía en la frontera pedir→panel→caja→cierre.

**Lo pagó el seed, tres veces, en el mismo proyecto.** El estado limpio y sembrado es
el único que **nunca existe en producción**:

| Estado no probado | Qué se escapó | Cita |
|---|---|---|
| Base **vacía** (empresa nueva) | `crearProveedor` existía en el store **sin ninguna UI que lo llamara**: una empresa nueva no podía registrar mercancía jamás, porque el recibo de bodega exige proveedor. El seed lo tapaba con proveedores precargados. | `placita/KN-026` (commit `956d15e`) |
| Base **sucia** (empresa vieja `emp-placita`) | El outbox subía un `empresa_id` ajeno y Supabase respondía **500 por RLS**. Lección literal: *"e2e sucio > e2e limpio"*. | `placita/KN-018` (commit `dc9d079`) |
| Datos de la **versión anterior** | Un campo nuevo obligatorio tumbó la página de productos (`undefined.toFixed`) con los datos v2 del navegador del dueño. Dev funcionaba con datos frescos; producción caía. *"El typecheck no ve los datos viejos del navegador y el QA de los builders solo probo con seed fresco."* | `placita/KN-009` (2026-08-07) |

**Lo pagó el build verde que no ve el middleware.** En InfraPilot, `proxy.ts` redirigía
`/sw.js` y `/manifest.webmanifest` a `/login` con un **307** porque ninguna estaba en
`PUBLIC_PATHS`. *"The build passed and each builder verified their own piece in
isolation; the failure only surfaced running curl against the dev server"*
(`infrapilot/KN-028`). Lo cazó el verificador en vivo, no `tsc` ni el build.

**Y lo pagó descubrir que el verifier busca lo que funciona, no lo que se rompe.** En
WRD sesión 3 el verifier ya había dado **FAIL**; aun así los smokes solo recorren el
camino feliz. Dos adversarios en paralelo encontraron **16 hallazgos** que los smokes no
vieron nunca, incluido **un PIN de admin real filtrado en un comentario tipo doctest**
dentro del código — algo que ningún test de comportamiento iba a mirar
(`wrd/KN-004`). Los números están en la métrica: `verification/sonnet fail 51 161 tok`,
seguido de `adversarial/opus 94 008` y `adversarial/opus 125 667`
(`wrd/memory/wrd/metrics.json:123-125`), y los 16/16 confirmados y arreglados.

**De ahí sale la regla del juez.** El proyecto de Villa Broaster pidió literalmente el
2026-08-22: *"me gusto el porcentaje; tu vas a ser juez del avance"*, y la decisión que
lo formaliza fija la rúbrica: **el porcentaje lo asigna el juez cada viernes según
criterios VERIFICADOS (tests, navegador, archivos, PRs), nunca autorreportados; solo
sube con evidencia** (`villa-broaster/DEC-011`). Lo más fino está dentro de la propia
rúbrica: la entrega E2 fue **construida y verificada por el mismo ORION**, y aun así su
criterio dice *"Base construida y verificada (…107 tests) = 50; integrada en main con
**QA independiente** = 80"* (`docs/semanal/avance.json`). Es decir: **la
autoverificación, hecha bien y con 107 tests en verde, topa en 50 sobre 100.** Los otros
30 puntos los da alguien que no lo construyó.

## Cómo se aplica

**La escalera de "ya quedó".** Cada peldaño responde una pregunta distinta, y ninguno
responde la del siguiente. Di en voz alta en cuál estás.

| # | Peldaño | Qué prueba de verdad |
|---|---|---|
| 0 | **Aterrizó** — archivos en disco con tamaño > 0, commiteado | Que **existe**. No es verificación. |
| 1 | **Corre** — el `typecheck`/`build` **del proyecto** | Que no explota al compilar. Nada más. |
| 2 | **Se ejercita** — el camino completo en navegador, **cruzando la frontera** entre módulos | Que hace lo que promete, en el flujo real |
| 3 | **Sobrevive a lo que no es el seed** — vacío, sucio y viejo | Que le sirve a un cliente de verdad |
| 4 | **Lo miró alguien que no lo hizo** — verificador independiente, una evidencia por condición | Que no te estás creyendo a ti mismo |
| 5 | **Alguien intentó romperlo** — refutadores, solo si toca auth/admin/permisos/RLS | Que además es seguro |

1. **Nunca reportes el peldaño 1 como si fuera el 2** — ni al dueño, ni en la memoria del
   proyecto. En `state.json`, "escrito y typechequeado" y "ejercitado" son dos frases
   distintas; si mezclas las dos, dentro de tres semanas nadie sabrá cuál era
   (`estanco-contable/PEND-016`, `PEND-017`, `KN-010`). El protocolo escrito ya lo dice:
   *"never claim PASS from a type-check alone"*
   (`ORION/runtime/skills/orion.SKILL.md:220-221`).
2. **Usa el gesto que corresponde a la afirmación.** Son dos pruebas opuestas y
   confundirlas produce falsos verdes y falsos rojos:
   - *"la mutación funciona"* → **navega por los ENLACES de la app**. Un F5 remonta el
     provider y ya no estás probando la mutación (`estanco-contable/KN-010`).
   - *"el dato persiste"* → **recarga con F5** y confirma que la venta y el stock
     descontado siguen ahí (`estanco-contable/PEND-016`). Verificar mutaciones recargando
     fue justamente lo que escondió durante días que el store **no** persistía.
3. **Corre el camino real cuatro veces**, no una: con seed, **vacío**, **sucio** y
   **viejo** (`placita/KN-026`, `KN-018`, `KN-009`). Antes de gritar bug en el camino
   vacío, decide **qué vacío es correcto**: en estanco-contable los locales existen desde
   el registro (vacío = bug) pero los productos y movimientos todavía no (vacío = correcto)
   — `estanco-contable/KN-013`.
4. **Si el módulo tiene cronología, el E2E tiene que CRUZAR la frontera.** Toma un pedido
   **antes** de abrir turno, abre caja, cóbralo dentro, cierra y exige que el arqueo
   cuadre exacto. Ahí gastas el presupuesto de verificación, no en más unitarios
   (`arroces/KN-001`; ver [[TEMA-caja-y-turnos]]).
5. **Todo lo que pida un tercero sin sesión, pruébalo con una petición real contra el
   servidor corriendo y mira el código de estado**: assets de PWA, webhooks, `.well-known`,
   callbacks de OAuth o de pasarela, sitemap, robots. El arreglo vive en
   `C:\Users\Kalel\ORION\infrapilot-app\proxy.ts:8` (`PUBLIC_PATHS`) y la comprobación en
   `:40` (`isPublic`) — `infrapilot/KN-028`.
6. **Ante una discrepancia de typecheck, gana el `tsc` del proyecto.** Si chequeas con una
   config propia fuera del proyecto, **hereda o replica `strict: true`**: sin strict se
   apaga `strictNullChecks`, TypeScript deja de estrechar uniones discriminadas y reporta
   `TS2339 "Property X does not exist"` sobre código correcto. Pasó con
   `lib/dominio/devolucion.ts`: la config suelta reportó 2 errores que el tsc del proyecto
   no ve (`estanco-contable/KN-011`). El chequeo canónico está declarado en el
   `package.json` del proyecto: `"typecheck": "tsc --noEmit"`
   (`estanco-contable/package.json:10`). Un agente con prisa "corrige" esos falsos
   positivos y ensucia dominio que ya estaba probado.
7. **Área de seguridad → refutadores, después del verifier y NUNCA el mismo agente.**
   1-2 adversarios en paralelo, modelo fuerte, áreas separadas (uno el SQL/permisos, otro
   el gating de la app), encargo único: **romper el gating y encontrar credenciales**, con
   hallazgos en `archivo:línea`. No des el trabajo por bueno hasta que vuelvan
   (`wrd/KN-004`).
8. **El porcentaje lo pone el juez, con criterio escrito ANTES.** Cada entrega lleva su
   criterio verificable y sus escalones (`villa-broaster/DEC-011`; ejemplo real en
   `C:\Users\Kalel\prommter\proyectos\villa-broaster\docs\semanal\avance.json`, entrega
   E3: *"Diseño aprobado = 12; T-02 = 40; T-03 = 70; T-04 = 100"*). Dos consecuencias que
   duelen y son el punto: **una entrega sin evidencia se queda en 0** aunque haya trabajo
   detrás (E1 y E4 están en 0 por definiciones que nadie escribió), y **lo que
   verificaste tú mismo topa en 50** hasta que lo mire un QA independiente.
9. **Escribe el veredicto con su número y su condición**, no con adjetivos. Cómo se saca
   ese número en esta máquina —captura, medición, PDF, `curl`— es
   [[TEMA-verificar-con-evidencia]].

## Cuándo NO aplica

- **Cambios puramente de tipos o refactors sin comportamiento nuevo**: ahí `tsc` + build
  **SÍ** es la verificación proporcional. No montes un E2E para renombrar un símbolo o
  mover un archivo.
- **Módulos puros sin cronología** (cálculo de carta y precios, formateo, validaciones de
  un solo instante): los self-tests bastan y el E2E es desperdicio de tiempo y tokens. La
  cronología es lo que los rompe, y esos módulos no tienen (`arroces/KN-001`).
- **Prototipo desechable o demo de venta donde el seed ES el producto**: probar el camino
  de empresa nueva no aplica porque no hay empresa nueva. (Pero si la demo lleva datos
  inventados, eso tiene sus propias reglas: [[TEMA-cero-datos-inventados]].)
- **No generalices "todo se prueba con curl".** La regla es específica de **rutas que pide
  un tercero sin cookie de sesión**; para flujos autenticados el navegador real sigue
  siendo el test (`infrapilot/KN-028`).
- **El e2e sucio, nunca contra la base real del negocio.** Hazlo contra copia o con el
  candado de red cerrado: en placita el e2e de facturación fue seguro porque sin clave de
  caja el outbox devuelve 401 y nada sube (`placita/KN-028`) — pero **dejó 4 facturas de
  prueba completas en el `localStorage` de ese navegador**, y eso hoy es un riesgo abierto:
  si alguien configura ahí la clave de caja, la siguiente sincronización contamina el
  inventario vivo (`placita/RSK-004`, `status: Open`).
- **El adversarial no sustituye al verifier**: encuentra lo que el verifier **no busca**,
  no lo que el verifier ya cubre. Y no lo montes para trabajo cosmético o de contenido sin
  superficie de datos (`wrd/KN-004`).
- **Config distinta a propósito**: si lo que quieres es medir cuánto se rompe al
  **endurecer** (migrar un proyecto legacy a `strict`), la config distinta es justamente el
  punto — pero ahí los errores son **deuda a pagar**, no falsos positivos que ignorar
  (`estanco-contable/KN-011`).
- **Un agente muerto no es un agente que falló.** Antes de rebajar la nota o relanzar,
  mira `git status`, `git log` y el tamaño en disco: casi siempre el código ya está escrito
  y lo que murió fue su autoverificación — ver [[TEMA-olas-de-agentes]].
- **El barrido completo cuesta.** La escalera entera se justifica ante un release o ante
  código que toca plata; no ante un cambio de una línea — ver [[TEMA-modelos-y-costos]].

## Evidencia

**Compilar ≠ funcionar**
- `estanco-contable/PEND-016` — `Ready`, `High`, creado 2026-08-01, **sigue abierto**;
  su `reason`: *"el codigo compila pero compilar no es funcionar"*.
- `estanco-contable/PEND-017` — mismo patrón en registro→vínculo: *"tsc da exit 0 pero la
  prueba en navegador quedo a medias"*.
- `estanco-contable/KN-010` — actualizado 2026-08-03: el store ya persiste (12 refs a
  `localStorage`, `tsc` exit 0) pero *"la prueba de recarga de punta a punta NO se ha
  corrido todavia"*; y el método: mutación por enlaces, no por F5.
- `estanco-contable/KN-012` — bug de dos fuentes de verdad; en `context`: un builder lo
  **predijo** y quedó sin cerrar; el dueño lo encontró usando la app el 2026-08-01.
- `estanco-contable/KN-013` — qué vacío es bug y qué vacío es correcto en empresa nueva.
- `ORION/runtime/skills/orion.SKILL.md:220-221` — *"never claim PASS from a type-check
  alone"*; el verificador debe **ejercitar** la feature.

**Verde con el bug adentro**
- `arroces/KN-001` (Permanent) — *"solo lo reveló la verificación E2E en navegador, no el
  tsc ni los self-tests unitarios"*.
- `C:\Users\Kalel\prommter\proyectos\arroces\memory\arroces\brief.md:8-12` — 38/38
  self-tests: carta 6/6, pagos 8/8, cierre 6/6, pedido 18/18.
- `arroces/memory/arroces/metrics.json` — `fixCycles: 1`; `verify/sonnet ok 74 803 tok`,
  `fix/opus ok 114 381 tok`; nota de sesión: *"el bug de cierre NO fue de capacidad del
  modelo (lo reveló el E2E…)"*.

**Los tres estados que el seed esconde**
- `placita/KN-026` — camino de **empresa nueva**: `crearProveedor` sin UI; commit `956d15e`.
- `placita/KN-018` — e2e con estado **sucio**: `empresa_id` ajeno → RLS 500; commit `dc9d079`.
- `placita/KN-009` — datos de la **versión anterior**: `undefined.toFixed` en producción
  2026-08-07; *"el QA de los builders solo probo con seed fresco"*.
- `placita/KN-028` / `placita/RSK-004` — cómo se hizo el e2e sin ensuciar la nube real, y
  el riesgo abierto que dejó en el `localStorage` del navegador de pruebas.

**Lo que el build no ve**
- `infrapilot/KN-028` — `/sw.js` y `/manifest.webmanifest` con 307 a `/login`; *"the
  failure only surfaced running curl against the dev server"*.
- `C:\Users\Kalel\ORION\infrapilot-app\proxy.ts:4-8` (el comentario explica el porqué y
  define `PUBLIC_PATHS`) y `:40` (`isPublic`).

**El verifier no busca romper**
- `wrd/KN-004` — 16 hallazgos de 2 adversarios opus tras un verifier que ya dio FAIL;
  PIN de admin filtrado en un comentario doctest.
- `C:\Users\Kalel\fable 5\wrd\memory\wrd\metrics.json:123-125` — `verification/sonnet
  fail 51161` → `adversarial/opus 94008` → `adversarial/opus 125667`.

**Falsos positivos del verificador**
- `estanco-contable/KN-011` (Permanent) — tsconfig ad-hoc sin `strict` inventa `TS2339`
  en `lib/dominio/devolucion.ts`; 2 errores que el tsc del proyecto no ve.
- `estanco-contable/package.json:10` — `"typecheck": "tsc --noEmit"` es el chequeo canónico.

**El juez externo**
- `villa-broaster/DEC-011` — *"tu vas a ser juez del avance"*; rúbrica: porcentaje por
  criterios **verificados** (tests, navegador, archivos, PRs), **nunca autorreportados**;
  semana 1 (2026-08-22): E1 0, E2 50, E3 12, E4 0, E5 40, E6 0, E7 0, E8 15; PDF de 11
  páginas, commit `76af678`.
- `C:\Users\Kalel\prommter\proyectos\villa-broaster\docs\semanal\avance.json` — criterio
  de E2: *"Base construida y verificada (…107 tests) = 50; integrada en main con QA
  independiente = 80; T-11 completa = 100"*, sobre trabajo **construido y verificado por
  el propio ORION** (campo `resumen`). El techo de la autoverificación es un número, y es 50.

**Hueco medido — la definición de hecho no está enforced en ninguna parte.** El protocolo
la enuncia (`orion.SKILL.md:220-221`) pero nada la comprueba: `PEND-016` y `PEND-017`
llevan **23 días** en `Ready` diciendo "compila pero no se probó", y el corpus no tiene un
solo objeto que registre "verificación pendiente cerrada". Hoy la única rúbrica escrita
que convierte evidencia en número vive en **un solo proyecto**
(`villa-broaster/docs/semanal/avance.json`); los demás reportan verificación en prosa.

## Enlaces

- [[TEMA-verificar-con-evidencia]] — el **cómo** físico: capturas, mediciones, PDF y qué
  herramienta miente en esta máquina. Este tema dice **qué hay que probar**; ese dice
  **con qué se prueba**.
- [[TEMA-olas-de-agentes]] — cuando quien tenía que verificar se murió a mitad: auditar
  disco antes de concluir nada.
- [[TEMA-modelos-y-costos]] — cuánta ceremonia de verificación merece la tarea.
- [[TEMA-dominio-migraciones-y-copias]] — el peldaño "datos viejos" con su receta completa
  (bump de versión + migración en el mismo commit).
- [[TEMA-caja-y-turnos]] — el E2E que cruza la frontera de turno, contado desde el negocio.
- [[TEMA-memoria-y-cierre]] — cómo se escribe en memoria la diferencia entre "escrito" y
  "ejercitado" para que sobreviva a la sesión.
