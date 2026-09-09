---
slug: modelos-y-costos
titulo: Qué modelo usar para cada tipo de trabajo, y cuánto cuesta de verdad
alias: [modelo, modelos, que modelo, elegir modelo, seleccion de modelo, calibracion, calibrar, haiku, sonnet, opus, tier, tiers, nivel, niveles, modelo barato, modelo caro, economico, costo, costos, coste, precio, gasto, gastar, presupuesto, tokens, token, cuanto cuesta, cuanto gasta, cuanto vale, cuanto cuesta una ola, costo de una ola, costo de la ola, cuanto cuesta una ola de agentes, presupuesto de una ola, presupuestar la ola, gasto de una ola, ola, olas, oleada, ola de agentes, builder, builders, builder visual, build visual, buildvisual, constructor, spawn, spawns, subagente, subagentes, agente, agentes, panel de agentes, modeloutcomes, subagent tokens, metrics, metricas, medicion, medido, inline, pipeline, ceremonia, ciclo de vida, escalar, escalada, escalate, infra death, muerte de sesion, limite de sesion, limite diario, verdict, veredicto, fallo, falla, adversarial, juez, verificador, analista, reflector, fase, fases, taxonomia, taxonomía, inventar estructura, inventar la taxonomia, categoria nueva, esquema fijo, seguir un patron, seguir un patron con ejemplos, ambiguedad de estructura]
preguntas: ["que modelo uso para un builder visual", "cuando uso haiku y cuando opus", "cuanto cuesta una ola de agentes", "cual es el modelo mas barato que aguanta esta tarea", "cuantos tokens gasta un builder", "vale la pena pagar opus para esto"]
proyectos: [infrapilot, placita, villa-broaster, estanco-contable, wrd, arroces, landings, orion, _permanent]
confianza: alta
actualizado: 2026-09-09
---

# Qué modelo usar para cada tipo de trabajo, y cuánto cuesta de verdad

## Respuesta corta

**Antes de elegir modelo, elige ceremonia**: una tarea de 1 archivo se hace inline con
cero spawns — el pipeline completo cuesta ~10x (168k tokens de subagente para un README
de 91 líneas, `infrapilot/DEC-007`). Después elige por **dificultad, no por importancia**:
`haiku` lo mecánico y totalmente especificado (~50k tokens/spawn), `sonnet` por defecto
(~111k), `opus` solo para diseño transversal, seguridad, depuración sutil y alto radio de
daño (~167k). Para un **builder visual**: interior de app con referencia clara → `sonnet`
(bastó dos veces seguidas en villa-broaster); vitrina pública o dirección de arte → `opus`
con panel. **Nunca dejes hechos de negocio ni texto de cara al público en el tier barato**:
sale técnicamente correcto e inventa datos. Y presupuesta la ola con números medidos: una
app entera desde cero fueron 12 spawns / **1,11 M tokens**; una ola grande de producción,
15 spawns / **2,3 M**; un panel de diseño de 11 agentes, **1,08 M** en un solo encargo.

## Por qué (qué lo pagó)

Esto no es criterio: son **298 spawns medidos y 39.372.000 tokens** (corte 2026-08-26; antes 280 y 32,7 M) registrados en
`modelOutcomes` de seis memorias (infrapilot, placita, villa-broaster, estanco-contable,
wrd, arroces). La medición es real, no estimada: la notificación de fin de cada spawn trae
`subagent_tokens` y el orquestador la persiste (`_permanent/KN-002`); el consumo inline del
propio orquestador **no está metrado y nunca se inventa**.

**Lo que la medición contradice.** Si se cuentan los veredictos crudos, los tres tiers
fallan casi igual: haiku 1 de 24, sonnet 6 de 149, opus 3 de 101. Eso **no** significa que
el modelo dé igual — significa que la rúbrica ya está haciendo su trabajo: el orquestador
le da a opus lo difícil, y por eso opus no falla más. Leer la tabla al revés ("total, todo
sale ok, bajemos todo a haiku") es el error que este tema existe para evitar.

**Lo que sí falló, y por qué.** De las 24 filas no-ok, **19 son muertes de sesión**
(infra-death), no fallos de capacidad: 13 llevan la marca explícita
(`estanco-contable/KN-009`, `wrd/KN-005`) y 6 más están documentadas en las notas de sesión
y en `infrapilot/KN-018`. Se reconocen por el gasto: los `escalate` de 7, 269, 793 y 2.295
tokens no fallaron la tarea, **nunca la empezaron**. Una fila más (`wrd`, verification
sonnet, 51.161 tokens, `fail`) es un verificador **haciendo bien su trabajo**: devolvió
FAIL con 16/16 hallazgos reales. Queda **un solo fallo de capacidad con causa registrada
en todo el corpus**: `placita`, build:visual opus, **283.543 tokens quemados** — y la causa
no fue el modelo sino el **insumo**: la primera pasada del plano se hizo solo con el boceto
del dueño y salió mal; se corrigió con el plano arquitectónico limpio en 1 ciclo de fix.

**Y una sesión aisló la variable que de verdad separa sonnet de opus DENTRO de un
mismo tipo de trabajo: no es el volumen ni la importancia, es si hay que inventar
la estructura.** Seis constructores en paralelo escribieron 190 arquetipos de
catálogo contra el mismo esquema fijo. Los cuatro que **reforzaron una categoría
ya existente** —con ejemplos delante para copiar el patrón— salieron con sonnet:
18-25 arquetipos cada uno, 0 problemas de validación, 118.790 / 101.333 / 92.721 /
82.791 tokens. Los dos que **inventaron una categoría nueva desde cero** —sin
subgrupos previos que copiar— se hicieron con opus, también limpios, pero a
**~1,7× el costo por unidad de trabajo** (145.270 y 167.453 tokens)
(`orion/KN-024`). Nada de esto era más difícil de *escribir* línea por línea: la
diferencia real es la ambigüedad de la taxonomía, no el tamaño del archivo ni
cuánto importaba el resultado. No contradice la rúbrica de arriba —opus para
"diseño transversal"—, la precisa: dentro de una misma fase (`build:lib`,
escribir contra un esquema ya fijo), lo que hace falta el escalón caro es la
parte de **inventar** la estructura, no la parte de **poblarla**.

**Y lo que el tier barato sí cuesta, aunque marque `ok`.** Tres proyectos pagaron la misma
lección por separado: un seed generado con haiku metió lotes de productos por unidad con
0 gramos y **el bug solo lo vio el e2e del POS, no la revisión de código**
(`placita/KN-006`); un builder haiku inventó la ciudad "Rionegro" en las keywords SEO —
trabajo técnico correcto, dato de negocio falso (`villa-broaster/KN-008`); y builders
baratos escribieron género gramatical equivocado en documentos públicos del equipo
(`villa-broaster/KN-014`). Ninguno de esos tres aparece como `fail` en las métricas.

## Cómo se aplica

1. **Gate de ceremonia primero** (`SKILL.md` §1d, líneas 153-170). Trivial (1 archivo,
   sin incógnitas) = todo inline, 0 spawns. Small (2-4 archivos) = build inline o UN
   builder + verificador spawneado. Substantial (multipaso, transversal o de riesgo) =
   pipeline completo. Ante la duda, **empieza abajo**: un FAIL escala solo.
   **Segundo criterio, independiente del tamaño: si el orquestador YA tiene el
   archivo grande leído en su propio contexto, edítalo inline en vez de
   delegar** — un subagente arranca en blanco y tendría que releer el archivo
   entero para poder tocarlo, que es exactamente el costo que el gate de
   ceremonia quiere evitar. Delegar es para lo que empieza de cero, no para lo
   que el orquestador ya trae cargado (placita, commit `1b0475c`, 2026-08-24:
   edición sobre `components/store.tsx`, ~4.500 líneas ya leídas por el
   orquestador, hecha inline a propósito).
2. **Rúbrica por dificultad** (`SKILL.md` §1b, líneas 86-106): trivial→`haiku`,
   normal→`sonnet`, hard→`opus`. Techo opus, piso haiku (`infrapilot/DEC-004`). El
   analista puntúa cada sub-objetivo y **los builders van uno por paso**, así que una
   misma ola puede tener un paso haiku y uno opus corriendo en paralelo.
2b. **Dentro de una misma fase, sube a opus solo la parte que exige INVENTAR
   la estructura, no la que la sigue.** Escribir contra un esquema fijo con
   ejemplos delante (reforzar una categoría, extender una lista con el mismo
   patrón) lo hace sonnet igual de limpio y a ~0,6× el costo; escribir la
   primera instancia de algo —una categoría nueva sin subgrupos previos, la
   primera regla de un dominio que no existía— es donde el radio de daño de
   una mala taxonomía justifica opus (`orion/KN-024`).
3. **Builder visual — decide por registro, no por "es diseño"**: interior sobrio de app de
   trabajo con referencia clara → `sonnet` (villa-broaster lo bajó de opus a sonnet y salió
   ok dos runs seguidos: 242.961 y 119.494 tokens); vitrina pública, dirección de arte o
   prompt de landing → `opus`, y si el rechazo es caro, **panel** (ver punto 5).
4. **Seguridad: el verificador normal no alcanza.** En auth/admin/RLS suma adversarios
   dedicados en opus además del verifier. En wrd el verifier sonnet dio FAIL y 2 adversarios
   opus (94.008 + 125.667 tokens) encontraron 16 hallazgos que los smokes no vieron,
   incluido un PIN de admin filtrado en un comentario (`wrd/KN-004`).
5. **Presupuesta la ola con estos números medidos** (promedio por spawn, y por si te lo
   preguntan de golpe):

   **Refrescada el 2026-08-26** sobre 298 spawns / 39,37 M, con los subtipos de
   build normalizados (antes se promediaban sufijos inventados y eso partía la
   muestra). Entre paréntesis, **cuántos spawns sostienen cada media**: una
   celda con (1) o (2) es una anécdota, no una medición. Se reproduce con
   `node tools/costos.mjs fases`:

   | Fase | haiku | sonnet | opus |
   |---|---|---|---|
   | analysis | — | **64k (24)** | **580k (3)** ← 9× más caro |
   | planning | — | 19k (6) | — |
   | build:page | 62k (5) | **158k (40)** | **325k (17)** |
   | build:lib | 37k (3) | **118k (19)** | **255k (15)** |
   | build:api | 49k (1) | 163k (5) | 126k (6) |
   | build:infra | 55k (3) | 101k (3) | 100k (7) |
   | build:visual | — | 149k (3) | 173k (32) |
   | verification | 6k (3) | 60k (22) | 179k (2) |
   | adversarial | — | — | 110k (2) |

   Lo que esta pasada añade: **opus se lleva el 51,5 % del gasto** (20,27 M de
   112 spawns) y en `build:page` y `build:lib` cuesta más del doble que sonnet
   **teniendo sonnet el doble de muestra limpia**. Son los dos sitios donde
   bajar de tier está mejor respaldado. `analysis` en opus no tiene defensa
   ninguna. Y dos huecos que hay que cerrar para que estos números sigan
   valiendo: **48 de 298 spawns (16,1 %) están anotados con 0 tokens**, y 17
   usan subtipos de fase inventados que aparecen una sola vez
   (`node tools/costos.mjs senal`).

   Olas completas medidas: **génesis de una app entera** (arroces, web comercial +
   operación desde cero) = 12 spawns / **1.114.811 tokens** / 1 ciclo de fix; **ola grande
   de producción** (placita, ventas sobre Supabase) = 15 spawns / **2.305k**; **8 prompts
   de landing en paralelo** = **664.950 tokens** (83k cada uno); **panel de 11 agentes**
   para una dirección de arte (4 direcciones + 2 jurados + redactor + 3 verificadores
   adversariales + corrector) = **1.083.934 tokens en una sola fila**; **sesión de 35
   spawns** (wrd, tienda gamificada) = **3.543.447 tokens**, de los que ~592k se perdieron
   en muertes de sesión. **Sesión pequeña con calibración limpia** (placita, commit
   `1b0475c`, 2026-08-24: surtido masivo + gasto de un toque + inventario
   vigente) = 5 spawns, **todos `sonnet`, todos PASS a la primera, cero ciclos
   de arreglo**: 2 de dominio+tests (71.631 y 77.138 tokens), 2 de pantalla
   (73.784 y 110.862) y 1 de verificación de 10 condiciones (106.904). Sirve
   como el caso límpio contra el que medir: cuando `sonnet` no falla ni una vez
   en una tanda de 5, no hay señal para subir a `opus` en ese tipo de trabajo.
6. **Regla dura del tier barato**: haiku sí para código mecánico contra spec; haiku **no**
   para datos semilla con invariantes cruzadas, copy público, metadata/keywords o cualquier
   texto que tenga que ser **verdad**. Si igual lo usas ahí, audita su salida con grep
   contra la fuente de datos real — "barato de auditar, caro de no verlo"
   (`villa-broaster/KN-008`).
7. **Registra el veredicto sin contaminar la señal, y usa el campo, no el sufijo.** Una
   muerte por límite de sesión se anota con `verdict: fail` **y `infraDeath: true` en esa
   fila de `modelOutcomes`** — es la convención que hay que fijar hacia adelante: ya es
   mayoritaria (10 filas en estanco-contable contra 2 sufijadas en wrd) y no obliga a
   deshacer texto del nombre de la fase para recuperarla después. El sufijo
   `build:page:infra-death` (`wrd/KN-005`) se sigue leyendo por compatibilidad, pero no se
   recomienda para filas nuevas. **Sin marca de ningún tipo, la muerte desaparece**: tres
   memorias (infrapilot, placita, villa-broaster) documentan muertes de sesión solo en la
   nota de la sesión y CERO filas de `modelOutcomes` las señalan — invisibles para
   cualquier lectura que no sea la prosa completa (`_permanent/KN-017`).
8. **Antes de re-spawnear a un muerto, mira el disco.** El código del builder normalmente
   ya está escrito; lo que muere es su auto-verificación. En estanco-contable murieron 4
   builders y los 4 habían entregado (`estanco-contable/KN-009`); en placita el builder
   "muerto" ya había commiteado todo (`placita/KN-041`). Re-spawnear duplica trabajo ya
   pagado.
9. **Lee `modelOutcomes` al abrir memoria**: si un tier acumula FAILs reales en un tipo de
   paso, sube ese trabajo un escalón; si opus lleva runs sin fallar en algo, bájalo uno.
   Eso es el bucle adaptativo (`SKILL.md` líneas 115-120).

## Cuándo NO aplica

- **Un `fail` en una fila `verification` es una buena noticia, no un fallo del modelo.**
  Significa que el verificador encontró cosas. No lo uses para calibrar hacia arriba.
- **Subir de tier NO sustituye la verificación e2e.** El bug de cierre de arroces lo
  produjo un builder sonnet que compiló y pasó sus propios self-tests; la nota de la
  sesión es explícita: *"no lo habría evitado opus en S2"* — lo reveló el e2e en navegador
  (`arroces/KN-001`). Si tu plan para evitar bugs es pagar opus, no tienes plan.
- **Barato en tier no siempre es barato en tokens.** En placita, la memoria más madura,
  sonnet gastó **más** que opus en la misma fase: build:page 256k (sonnet, 9/9 ok) contra
  224k (opus, 10/10 ok), y build:api 218k contra 181k. El tier bajo itera más. Mide antes
  de asumir el ahorro.
- **Estos números son tokens, no dinero.** El corpus **no registra precio por token ni
  costo en pesos ni en dólares** en ninguna de las 11 memorias: un opus de 167k tokens no
  cuesta "1,5 veces" un sonnet de 111k. Hueco explícito — si necesitas el costo monetario,
  hay que traer la tarifa de fuera, y nadie la ha guardado aquí.
- **El corpus no puede medir la calidad silenciosa por tier.** El `verdict: ok` lo escribe
  el orquestador cuando el spawn aterriza su trabajo, no cuando el trabajo resulta
  correcto: por eso los tres desastres de haiku (seed corrupto, ciudad inventada, género
  equivocado) figuran como `ok`. Segundo hueco explícito: **no hay ninguna métrica de
  defectos-por-tier detectados después del run.** Hasta que exista, la regla 6 se sostiene
  sobre tres incidentes narrados, no sobre una tasa.
- **No paralelices agentes que escriben su propia memoria.** 8 orion-landing a la vez
  comparten `ORION/memory/landings/state.json` y lo corrompen; se les prohibió escribir por
  eso (`infrapilot/RSK-003`). El ahorro de paralelizar no compensa un state.json roto.
- **Ola paralela sin recurso compartido pre-materializado no aplica esta economía**: si el
  orquestador no fija antes tipos, seed y `globals.css`, los builders chocan y el ahorro se
  va en fix-cycles (`estanco-contable/KN-001`, `villa-broaster/KN-006`, `wrd/KN-003`).

## Evidencia

- `infrapilot/DEC-004` — política de modelos adaptativa por dificultad, techo opus, piso
  haiku; "model choice is the only real cost lever".
- `infrapilot/DEC-007` — ciclo de vida proporcional; el pipeline completo mide ~10x el
  inline (168k tokens de subagente para un README de 91 líneas).
- `infrapilot/DEC-008` — calibración aplicada: subtipos `build:visual|page|api|lib|infra`
  para no diluir señal, y "infra-deaths no cuentan como señal de capacidad".
- `_permanent/KN-002` — `subagent_tokens` medido por spawn; el consumo inline del
  orquestador no está metrado y nunca se fabrica.
- `infrapilot/KN-018` — 3 de 10 spawns muertos dejando trabajo real en disco; protocolo de
  recuperación y regla de no re-spawnear a ciegas.
- `estanco-contable/KN-009` y `placita/KN-041` — 4 builders muertos que ya habían
  entregado; revisar disco/git antes de reconstruir.
- `wrd/KN-005` — convención `fase:infra-death` para no confundir muerte con fallo;
  ~592k tokens perdidos en cortes en una sola sesión.
- `_permanent/KN-017` — el agregador de costos de `cerebro.mjs` no leía ninguna de las
  dos convenciones y contaba muertes como fallos; corregido, y hallazgo de que 3
  memorias no marcan la muerte de ninguna forma. Regla hacia adelante: usar el campo
  `infraDeath: true`, no el sufijo.
- `wrd/KN-004` — ronda adversarial opus en trabajo security-sensitive: verifier sonnet
  FAIL + 2 adversarios opus (94.008 + 125.667 tokens) → 16 hallazgos, PIN de admin filtrado.
- `placita/KN-006` — seed generado con haiku, invariante cruzada rota, detectada solo por
  el e2e.
- `villa-broaster/KN-008` — builder haiku inventó "Rionegro" en keywords SEO; regla de
  auditar copy público del tier trivial.
- `villa-broaster/KN-014` — builders baratos no auditan género gramatical en documentos
  públicos; 4 builders muertos a la vez por límite de sesión, reanudados por SendMessage.
- `orion/KN-024` (2026-09-09) — 6 constructores en paralelo, mismo esquema fijo
  (arquetipos de catálogo): 4 refuerzos con sonnet (18-25 arquetipos, 0 problemas de
  validación, 118.790/101.333/92.721/82.791 tokens) contra 2 categorías nuevas con
  opus (52 y 54 arquetipos, también limpias, 145.270 y 167.453 tokens, ~1,7× por
  unidad de trabajo). La variable que separa los dos grupos es si había taxonomía
  previa que copiar, no el volumen ni la importancia del texto.
- `arroces/KN-001` — el bug de supuesto temporal no fue de capacidad del modelo; lo reveló
  el e2e, no lo habría evitado opus.
- `infrapilot/RSK-003` — 8 agentes con memoria propia en paralelo corrompen el state.json
  compartido.
- Rúbrica viva: `~/.claude/skills/orion/SKILL.md` §1b (líneas 79-120, tabla de
  dificultad y bucle de aprendizaje) y §1d (líneas 153-170, ceremonia proporcional).
- Mediciones crudas — `modelOutcomes` de:
  `$ORION_HOME/memory/infrapilot/metrics.json` (29 sesiones),
  `$ORION_HOME/prommter/placita/memory/placita/metrics.json` (40),
  `$ORION_HOME/prommter/villa-broaster/memory/villa-broaster/metrics.json` (18),
  `$ORION_HOME/prommter/estanco-contable/memory/estanco-contable/metrics.json` (9),
  `(fable 5 — carpeta del PC, no existe en la Mac)\wrd/memory/wrd/metrics.json` (7),
  `$ORION_HOME/prommter/arroces/memory/arroces/metrics.json` (1).
  Totales agregados en este tema: 280 filas, 32.741.161 tokens; haiku 24 spawns / 651k;
  sonnet 149 / 14.415k; opus 101 / 14.191k.
- Olas citadas: `arroces/session-2026-08-05-genesis-arroces` (12 spawns, 1.114.811),
  `placita/session-2026-08-13-ventas-supabase-fase-a` (15, 2.305k),
  `infrapilot/session-2026-08-16-001` (18 spawns, ~1,39M, 0 muertes; 8 prompts de landing =
  664.950), `villa-broaster/session-2026-08-24-prompt-v3-landing` (panel de 11 agentes,
  1.083.934), `placita/session-2026-08-08-pos-plano-tareas` (build:visual opus `fail`,
  283.543), `placita` commit `1b0475c` (2026-08-24, surtido+gasto+inventario: 5
  spawns, todos `sonnet`, todos `ok` a la primera — 71.631, 77.138, 73.784,
  110.862, 106.904 — medición del orquestador, pendiente de reflejarse en
  `placita/metrics.json`; y la edición inline sobre `components/store.tsx`
  [~4.500 líneas] hecha sin spawn por ya estar leído).

## Enlaces

- [[TEMA-generadores-de-diseno]] — qué se le entrega al generador; explica por qué el
  build:visual que falló en placita falló por el insumo y no por el tier.
- [[TEMA-cero-datos-inventados]] — la regla que hace inaceptable el tier barato en
  cualquier texto que tenga que ser verdad.
- [[TEMA-verificar-con-evidencia]] — el e2e que atrapa lo que ningún tier evita.
