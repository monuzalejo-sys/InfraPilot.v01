# En qué se va el gasto, y cómo bajarlo

**Medido el 2026-08-26 sobre 298 spawns y 39,37 M tokens** registrados en los
`metrics.json` de 9 proyectos. No es criterio: cada notificación de fin de
subagente trae `subagent_tokens` y el orquestador los persiste. Se reproduce
con:

```bash
node tools/costos.mjs            # resumen
node tools/costos.mjs fases      # costo por fase y tier
node tools/costos.mjs fugas      # las tres fugas
node tools/costos.mjs senal      # si los datos se pueden creer
```

El consumo **inline** del orquestador no está metrado en este entorno y no se
inventa. Todo lo de abajo es gasto de subagente — que además es el único que se
puede controlar decidiendo ceremonia y modelo.

---

## 1. La foto

| | spawns | tokens | media | % del gasto |
|---|---|---|---|---|
| opus | 112 | 20,27 M | 181k | **51,5 %** |
| sonnet | 155 | 14,97 M | 97k | 38,0 % |
| mixed (workflows) | 5 | 3,48 M | 697k | 8,8 % |
| haiku | 24 | 651k | 27k | 1,7 % |

Nueve proyectos, muy desigual: placita 33,6 %, villa-broaster 21,5 %, wrd
14,7 %. Fallos reales de capacidad: **10 de 298 spawns (3,4 %)**.

### Costo medio por spawn, por fase y tier

| fase | haiku | sonnet | opus |
|---|---|---|---|
| analysis | — | **64k (24)** | **580k (3)** |
| planning | — | 19k (6) | — |
| build:api | 49k (1) | 163k (5) | 126k (6) |
| build:infra | 55k (3) | 101k (3) | 100k (7) |
| build:lib | 37k (3) | **118k (19)** | **255k (15)** |
| build:page | 62k (5) | **158k (40)** | **325k (17)** |
| build:visual | — | 149k (3) | 173k (32) |
| verification | 6k (3) | 60k (22) | 179k (2) |
| adversarial | — | — | 110k (2) |
| fix | — | 81k (6) | 71k (5) |

Entre paréntesis, cuántos spawns sostienen cada media. Una celda con (1) o (2)
no es una medición, es una anécdota.

---

## 2. Las seis palancas, de la más segura a la más arriesgada

### L1 · Si la tarea ya está en el plan, no se vuelve a analizar ni a planear
**Ahorro: 83k por tarea. Riesgo: ninguno.**

`plan.mjs brief <plan.json> T-042` produce el encargo completo —porqué, pasos,
archivos que posee, criterios comprobables— de forma **determinista y a coste
cero**. Analizar y planear otra vez lo que ya está escrito en el registro es
pagar dos veces por el mismo pensamiento: 64k de análisis + 19k de planeación.

En un proyecto de 40 tareas son **3,3 M de tokens** que dejan de gastarse sin
tocar la calidad de nada. Es la palanca más grande del ecosistema y la única
que no tiene contraindicación.

### L2 · Pedir coordenadas en vez de archivos
**Ahorro: 10-30× por consulta. Riesgo: ninguno.**

```bash
node tools/cerebro.mjs ruta "la plata de qué turno es si cobro después"
```

Devuelve `archivo:línea` y el `sed -n 'a,bp'` acotado. Un tema del cerebro son
~900 líneas; la regla que hacía falta son 6. Aplica en **todas** las fases y
varias veces por turno, así que su efecto compuesto es mayor que su número
individual.

### L3 · El gate de ceremonia, antes que el modelo
**Ahorro: hasta 10×. Riesgo: bajo.**

Está medido en el propio corpus: **168k tokens de subagente para un README de
91 líneas** que se hacía inline. Una tarea de un archivo sin incógnitas se hace
inline con cero spawns; 2-4 archivos, un builder y un verificador; solo lo
multipaso o transversal paga el pipeline completo.

Segundo criterio, independiente del tamaño: **si el orquestador ya tiene el
archivo cargado, lo edita inline**. Un subagente arranca en blanco y tendría
que releer el archivo entero — que es justo el costo que se quería evitar.

### L4 · Agrupar lo trivial en un solo constructor
**Ahorro: ~80 % de los spawns agrupados. Riesgo: bajo.**

El costo de un spawn es casi todo **fijo**: el agente arranca en blanco y relee
todo antes de poder tocar nada. Diez pasos triviales en diez builders haiku son
~450k; los mismos diez, numerados, en UN builder sobre el mismo namespace, son
~60-80k.

Condiciones para agrupar: triviales, misma zona del árbol, e independientes
entre sí. Si uno depende de otro, un fallo se lleva el lote entero.

### L5 · Bajar de tier donde sonnet ya tiene historial limpio
**Ahorro potencial: ~4,9 M sobre el corpus histórico. Riesgo: medio — hay que leerlo bien.**

Los dos casos con muestra suficiente para defenderlos:

- **`build:page`**: opus 325k (17 spawns) contra sonnet 158k (**40 spawns**).
  Sonnet tiene el doble de muestra y el doble de barato. Diferencia ≈ 2,8 M.
- **`build:lib`**: opus 255k (15) contra sonnet 118k (**19**). Diferencia ≈ 2,1 M.
- **`analysis` en opus**: 580k contra 64k, con 24 spawns de sonnet limpios
  detrás. Son solo 3 spawns, pero cuestan 9× — no hay caso donde se justifique.

**El error que hay que evitar al leer esto.** Que opus casi no falle (102 de
107 ok) **no** significa que sobre: significa que la rúbrica está funcionando y
le está dando lo difícil. Bajar todo a sonnet de golpe convierte un ahorro en
una tanda de fix-cycles, que cuestan más. La forma correcta es bajar **por tipo
de trabajo con historial limpio**, uno cada vez, y dejar que un FAIL lo suba
solo.

Y hay una zona donde el tier barato **no** se toca aunque salga `ok`: hechos de
negocio y texto de cara al público. Tres proyectos pagaron por separado la
misma lección —un seed con lotes en 0 gramos, la ciudad «Rionegro» inventada en
keywords, género gramatical equivocado en documentos del equipo— y **los tres
figuran como `ok` en las métricas**, porque el spawn terminó. `verdict: ok`
mide que el spawn aterrizó, no que acertó.

### L6 · No perder agentes
**Ahorro: variable. Riesgo: ninguno.**

Las muertes por límite de sesión son el fallo #1 histórico y llegan **en
racimo**: tres olas del corpus perdieron 2, 4 y 6 agentes a la vez, porque
comparten la misma cuota y se agota para todos al tiempo. Lo caro no es la
muerte: es relanzar a ciegas trabajo que ya estaba escrito en disco.

`plan.mjs ola --wave <ruta>` deja el manifiesto escrito **antes** del segundo
spawn, con quién posee qué. Cuando algo muera, se audita el disco contra ese
manifiesto en vez de hacer arqueología.

---

## 3. Dos cosas que hay que arreglar para que los números sigan sirviendo

**48 de 298 spawns (16,1 %) están registrados con 0 tokens.** La medición se
perdió ahí. Un presupuesto calibrado sobre datos con un 16 % de huecos arrastra
ese error para siempre: los `subagent_tokens` de la notificación se anotan
siempre, también cuando el spawn falla.

**17 spawns usan subtipos de fase inventados** (`build:landing`,
`build:dashboard-editorial`, `build:topografia`…), cada uno una sola vez. Un
subtipo con un dato no calibra nada, solo parte la muestra. Los canónicos son
cinco —`build:visual`, `build:page`, `build:api`, `build:lib`, `build:infra`— y
lo que distingue al proyecto o a la pieza va en otro campo, nunca en `phase`.
Hoy la disciplina está en 91,7 %; conviene que no baje.

---

## 4. Qué se hace mañana, en orden

1. **Todo proyecto con trabajo pendiente estrena `plan.json`** (`/orion-plan`).
   Es L1, la palanca grande, y no funciona sin el registro.
2. **`ruta` antes de abrir cualquier archivo.** Ya está en la fase 1 del skill
   `orion`; falta la costumbre.
3. **`analysis` deja de ir a opus.** Sin excepciones salvo diseño transversal
   declarado.
4. **`build:page` y `build:lib` bajan a sonnet por defecto**, uno cada vez, con
   el historial vigilado. Suben otra vez ante el primer FAIL de capacidad —no
   ante una muerte de sesión, que no es lo mismo.
5. **Anotar siempre los tokens medidos**, también en los spawns que fallan, y
   marcar `infraDeath: true` cuando sea muerte de sesión.
6. **Revisar `costos.mjs fugas` al cerrar cada sesión.** Una recomendación sin
   cifra no cambia una costumbre; la cifra sí.
