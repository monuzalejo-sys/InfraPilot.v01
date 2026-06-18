# InfraPilot AI — Demo Comercial v1.0
**Documento Interno · Ventas y Producto · Junio 2026**

---

## El Principio

> Un ingeniero civil con 15 años de experiencia ha pasado los últimos 3 días elaborando un presupuesto en Excel. Filas, fórmulas, copiar precios del CAPECO, calcular rendimientos de memoria. El martes su cliente le pidió dos versiones más.
>
> Le mostramos InfraPilot AI. En 4 minutos tiene las tres versiones.
>
> Ese es el momento que diseñamos.

---

## Contexto del Demo

**Audiencia:** Ingeniero civil, jefe de presupuestos, gerente de proyectos o dueño de empresa constructora. Entre 28 y 55 años. Ha elaborado al menos 50 presupuestos en su carrera. Sabe exactamente qué debe contener un APU correcto.

**Escenario típico:** Demo en llamada de 30 minutos (15 min de presentación + 15 min de preguntas). También funciona como demo grabada en landing page, o demo en vivo en ferias de construcción.

**El enemigo:** El escepticismo. El ingeniero ha visto promesas de software antes. Su pregunta silenciosa es: *"¿Esto realmente entiende de construcción, o es otro generador genérico de texto?"*

**Nuestra respuesta:** Números reales. APUs reales. Precios del mercado vigentes. Un Excel que él mismo podría firmar y enviar a su cliente.

---

## El Personaje de Demo

**Nombre del proyecto demo:** Edificio Corporativo Torre Azul
**Tipo:** Edificación — oficinas corporativas
**Ubicación:** Miraflores, Lima, Perú
**Descripción completa (lo que el usuario escribe):**

```
Construcción de edificio de oficinas corporativas de 8 pisos
y 2 sótanos en Miraflores, Lima. Área construida por piso:
800 m2. Estructura aporticada de concreto armado f'c=280
kg/cm², losas aligeradas. Fachada de vidrio templado sistema
spider. Acabados de primera categoría. 60 estacionamientos
en sótanos. Ascensores: 3 unidades. Plazo estimado: 12 meses.
```

**Por qué este ejemplo:**
- Cualquier ingeniero civil en LATAM entiende este proyecto de inmediato
- Tiene suficiente complejidad para que la IA demuestre profundidad
- El presupuesto resultante (~$2.5M USD) es creíble y verificable
- Incluye partidas especializadas (vidrio spider, ascensores) que mostrarán que la IA entiende de verdad

---

## Cronograma del Demo Completo

| Fase | Duración | Acumulado |
|---|---|---|
| Entrada y primera impresión | 8 seg | 0:08 |
| Escribir la obra | 22 seg | 0:30 |
| IA procesando (visible) | 45 seg | 1:15 |
| Revisión de presupuesto | 60 seg | 2:15 |
| Análisis de riesgos | 30 seg | 2:45 |
| Proyección financiera | 45 seg | 3:30 |
| Exportación Excel | 20 seg | 3:50 |
| **Total demo** | **~4 min** | |

Los primeros **30 segundos** son el gancho que determina si el ingeniero sigue mirando.

---

## PASO 1 — Entrada y Primera Impresión

**Duración:** 8 segundos
**Pantalla:** Landing page / pantalla de inicio del Cotizador IA

---

### Lo que ve el usuario

La pantalla muestra una interfaz limpia, oscura en el lateral, clara en el centro. En el área principal, un único campo de texto grande con el cursor parpadeando. Encima del campo, el título:

```
Describe tu obra.
Obtén tu presupuesto en minutos.
```

Debajo del campo, en texto pequeño y gris:

```
✦ Utiliza precios CAPECO · CAMACOL · INE actualizados a junio 2026
```

No hay menús desplegables, no hay formularios, no hay instrucciones complejas. Solo un campo de texto.

### Lo que siente el ingeniero

*"¿Solo escribo aquí? ¿Así de simple?"*

La simplicidad radical genera una combinación de curiosidad y escepticismo. Esa tensión es exactamente lo que queremos. El ingeniero quiere ver si la herramienta está a la altura de la promesa.

### Detalle de diseño

- El cursor parpadea en el campo desde que carga la página. No hay animaciones de bienvenida. No hay splash screen. El trabajo empieza inmediatamente.
- En la esquina superior derecha: `◈ InfraPilot AI` en tipografía discreta. Sin taglines. Sin marketing en esta pantalla.
- Debajo del campo, tres ejemplos clickeables de obras previas (en texto gris, 12px):
  - `"Carretera afirmada 15km · Cajamarca"`
  - `"Edificio 5 pisos · Lima"`
  - `"Sistema de agua potable · 2,000 hab."`
  
  Hacer click en cualquiera de estos carga la descripción completa en el campo. En el demo en vivo, el presentador **no usa estos shortcuts** — escribe manualmente para que el ingeniero vea que no hay trampa.

---

## PASO 2 — El Usuario Escribe la Obra

**Duración:** 22 segundos (en demo en vivo, el presentador escribe rápido o pega el texto)
**Pantalla:** Cotizador IA — campo de entrada activo

---

### El texto que se escribe

```
Construcción de edificio de oficinas corporativas de 8 pisos
y 2 sótanos en Miraflores, Lima. Área construida por piso:
800 m2. Estructura aporticada de concreto armado f'c=280
kg/cm², losas aligeradas. Fachada de vidrio templado sistema
spider. Acabados de primera categoría. 60 estacionamientos
en sótanos. Ascensores: 3 unidades. Plazo estimado: 12 meses.
```

### Lo que pasa mientras se escribe

El campo crece en altura automáticamente con el texto (no hay scroll). El contador de caracteres aparece en la esquina inferior derecha del campo: `312 / 2000`.

A medida que el ingeniero lee lo que se escribe, reconoce el lenguaje. No es marketing. Es la misma forma en que él describiría una obra a un colega.

El botón de acción aparece en la parte inferior, inicialmente deshabilitado (gris). Al superar 50 caracteres escritos, el botón se activa con una transición suave:

```
[  ✦ Analizar con IA  →  ]
```

Gradiente violeta-índigo. El botón irradia una calidad que dice: *esto hace algo serio*.

### El momento de hacer click

El presentador hace click en `[✦ Analizar con IA]`.

El botón no desaparece. Se transforma: su texto cambia a `Analizando...` y aparece un spinner sutil en el ícono `✦`. La transición dura 200ms. No hay cambio abrupto de pantalla.

**Esto es importante:** el usuario no siente que "fue a otra pantalla". El botón se convirtió en el indicador de progreso. Es una continuidad visual que reduce la ansiedad de espera.

---

## PASO 3 — La IA Procesa (visible, narrativo)

**Duración:** 45 segundos
**Pantalla:** Cotizador IA — estado de procesamiento

---

### Lo que ve el usuario

La pantalla hace una transición suave (300ms fade). El campo de texto sube hacia arriba y se comprime en un banner pequeño que muestra las primeras palabras de la descripción: *"Edificio de oficinas corporativas, 8 pisos..."*

En el centro de la pantalla aparece el panel de progreso. No es una barra de carga genérica. Es una secuencia de **pensamientos de la IA visibles en tiempo real**:

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ✦ InfraPilot IA está analizando tu obra                         │
│                                                                     │
│   ─────────────────────────────────────────────────────────────   │
│                                                                     │
│   ✓  Tipo de obra identificado                                     │
│      Edificación — Oficinas corporativas · Categoría: Primera      │
│                                                                     │
│   ✓  Ubicación reconocida                                          │
│      Miraflores, Lima, Perú · Zona sísmica 4 · Suelo tipo S2      │
│      Precios CAPECO Lima aplicados · Vigente junio 2026            │
│                                                                     │
│   ✓  Especificaciones técnicas extraídas                           │
│      Concreto f'c=280 · Losas aligeradas · Vidrio spider          │
│      3 ascensores · 2 sótanos · 60 estacionamientos               │
│                                                                     │
│   ↻  Estructurando capítulos del presupuesto...                   │  ← animado
│      01 Obras Preliminares                                         │
│      02 Movimiento de Tierras y Excavaciones                       │
│      03 Concreto Armado — Sótanos                                 │
│      04 Concreto Armado — Estructura Principal                    │
│      ↳  generando partidas...                                      │
│                                                                     │
│   ○  Calculando metrados y cantidades                              │
│   ○  Asignando precios unitarios del catálogo CAPECO               │
│   ○  Generando APUs detallados                                     │
│   ○  Verificando coherencia del presupuesto                        │
│                                                                     │
│   ─────────────────────────────────────────────────────────────   │
│                                                                     │
│   ████████████████████░░░░░░░░░░  62%                             │
│                                                                     │
│   💡  Un edificio de oficinas de categoría primera en Lima         │
│       tiene un costo promedio de $280–$380 por m2 construido.      │
│       Esto es consistente con proyectos similares en Miraflores.   │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### El diseño psicológico de esta pantalla

Cada ítem que aparece con `✓` construye confianza. El ingeniero reconoce:

- **"Zona sísmica 4"** — La IA no solo leyó "Lima". Sabe que Miraflores está en zona sísmica 4 y que eso afecta el diseño estructural.
- **"Suelo tipo S2"** — Esto es conocimiento técnico de norma peruana (NTE E.030). Un generador genérico no diría esto.
- **"Precios CAPECO Lima · Vigente junio 2026"** — Los precios no son inventados. Son de la fuente oficial, del mes actual.

El `💡` al final es el golpe de gracia: cita un rango de costo por m2 ($280–$380/m2) que cualquier ingeniero con experiencia en Lima puede verificar mentalmente. Si el resultado final cae en ese rango, la IA ha pasado la prueba de credibilidad.

### Los ítems se activan secuencialmente

Los `✓` no aparecen todos a la vez. Cada uno llega con una animación de 80ms de fade + slide. Esto crea la sensación de **ver a alguien trabajar**, no de ver un resultado precargado. El ítem activo `↻` tiene un spinner de 12px.

La barra de progreso avanza de forma no lineal: rápido al principio, más lento en el medio (cuando está calculando APUs), luego un sprint final. Esto es diseño, no técnica — refleja cómo el usuario imagina que trabaja la IA.

### La frase que cierra la espera

Justo antes de que aparezca el resultado (los últimos 3 segundos), todos los ítems están en `✓` y la barra llega al 100%. Aparece por 2 segundos:

```
✦  58 partidas generadas · Revisión recomendada
```

Luego la pantalla hace transición al presupuesto.

---

## PASO 4 — El Presupuesto Generado

**Duración:** 60 segundos de revisión
**Pantalla:** Editor de Presupuesto — vista completa

---

### El primer segundo

La pantalla aparece y lo primero que el ingeniero lee es el número:

```
PRESUPUESTO TOTAL
S/ 9,187,200
```

En tipografía grande, `slate-900`, weight 700. Es el número que toda la conversación estaba esperando.

A la derecha del número, en texto pequeño y verde:

```
✓ Dentro del rango esperado para este tipo de obra
   $280–$380 / m2 · Promedio resultante: $342 / m2
```

El ingeniero puede verificar esto mentalmente. 8 pisos × 800 m2 = 6,400 m2. S/ 9,187,200 ÷ tipo de cambio 3.72 ÷ 6,400 m2 ≈ $385/m2. Está en el límite superior del rango — esperado para acabados de primera y fachada vidrio spider.

**Ha pasado la prueba.**

### El presupuesto completo

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Cotizador    Edificio Torre Azul · Miraflores, Lima    ✦ IA v91%   │
│                 ○ Borrador · Generado hace 23 segundos                  │
├────────────────────────┬──────────────────────────────┬─────────────────┤
│  Secciones             │  Partidas                    │  Resumen        │
│                        │                              │                 │
│  ▼ 01 Preliminares    │  03.04  Concreto columnas    │  Costo directo  │
│     S/ 48,200         │  f'c=280 kg/cm²              │  S/ 7,236,000   │
│                        │  ──────────────────────────  │                 │
│  ▼ 02 Mov. Tierras    │  Unidad: m3                  │  G. Generales   │
│     S/ 312,000        │  Metrado: 864.00 m3          │  10%            │
│                        │                              │  S/ 723,600     │
│  ▼ 03 Conc. Sótanos   │  MATERIALES   S/ 342.80      │                 │
│     S/ 1,240,000      │  Cemento IP   bls  10.00 ... │  Utilidad       │
│                        │  Arena gr.    m3   0.54  ... │  8%             │
│  ▼ 04 Est. Principal  │  Grava 3/4"   m3   0.56  ... │  S/ 578,880     │
│     S/ 2,180,000      │  Aditivo sup. lt   1.20  ... │                 │
│                        │  Encofrado    m2   4.80  ... │  Imprevistos    │
│  ▼ 05 Muros y Rev.    │                              │  5%             │
│     S/ 980,000        │  MANO DE OBRA S/ 68.40       │  S/ 361,800     │
│                        │  Capataz  hh  0.080  28.00  │                 │
│  ▼ 06 Arq. y Acab.    │  Operario hh  0.640  22.00  │  ─────────────  │
│     S/ 1,840,000      │  Oficial  hh  0.640  19.00  │  Subtotal       │
│                        │  Peón     hh  0.320  17.00  │  S/ 8,900,280   │
│  ▼ 07 Inst. y Espec.  │  Herram.  %MO 3.00%         │                 │
│     S/ 636,000        │                              │  IGV 18%        │
│     └ Ascensores      │  EQUIPOS      S/ 42.60       │  S/ 1,602,050   │
│     └ Vidrio spider   │  Vibrador  hm  0.080   8.50  │                 │
│     └ Instalac.       │  Grúa torre hm  0.200  180.00│  ═══════════════│
│                        │  Bomba conc hm  0.100  85.00 │  TOTAL          │
│  58 partidas          │                              │  S/ 10,502,330  │
│  7 secciones          │  ─────────────────────────  │                 │
│  ✦ 94% IA · 6% calc.  │  P. UNITARIO  S/ 454.00/m3  │  [↓ Exportar]  │
│                        │                              │  [⊞ Compartir] │
└────────────────────────┴──────────────────────────────┴─────────────────┘
```

### Los momentos de credibilidad en el presupuesto

**Momento 1 — La sección 07:**
El ingeniero ve: `07 Instalaciones y Especialidades` con sublíneas:
- `↳ Ascensores (3 unidades)`
- `↳ Fachada vidrio spider`
- `↳ Instalaciones eléctricas y sanitarias`

Esto demuestra que la IA no olvidó los ascensores ni el muro cortina. Leyó el texto completo y lo modeló.

**Momento 2 — El APU del concreto f'c=280:**
El ingeniero lee la tabla de componentes:
- Cemento Portland IP (no tipo I — correcto para Lima)
- Aditivo superplastificante (necesario para f'c=280)
- Grúa torre (necesaria para 8 pisos)
- Bomba de concreto

Cada componente es correcto para este tipo de obra. Un ingeniero que ha especificado concreto f'c=280 sabe que necesita aditivos. La IA también lo sabe.

**Momento 3 — El costo por m2:**
`S/ 454.00/m3` de concreto armado. El ingeniero puede verificar: el concreto f'c=280 en Lima está entre S/ 420 y S/ 480/m3 según el proveedor. El número es real.

**Momento 4 — El badge de confianza:**
`✦ 91%` en el header. No dice 100%. La honestidad de ese número —no perfecto— genera más confianza que si dijera 100%. El ingeniero piensa: *"Al menos me dicen qué no están seguros."*

Al hacer hover sobre el badge: tooltip que dice *"9% de partidas marcadas para revisión por precio desactualizado o especificación ambigua"*.

### La edición en tiempo real

El presentador hace click en el valor `10%` de Gastos Generales y lo cambia a `12%`. En tiempo real, el panel derecho recalcula:

```
G. Generales  12% → S/ 868,320    (era S/ 723,600)
TOTAL         → S/ 10,696,050     (era S/ 10,502,330)
```

Los números cambian con una animación suave (300ms). El cambio propaga instantáneamente. El ingeniero ve que no hay fórmulas que romper — la herramienta maneja la lógica.

---

## PASO 5 — Análisis de Riesgos

**Duración:** 30 segundos
**Pantalla:** Tab "Riesgos" dentro del presupuesto, o panel lateral que aparece automáticamente

---

### La transición

Mientras el ingeniero revisa el presupuesto, aparece en la barra lateral del Copiloto:

```
┌─────────────────────────────────────────────────────┐
│  ✦ Copiloto identificó 3 riesgos en este proyecto  │
│  [Ver análisis de riesgos]                          │
└─────────────────────────────────────────────────────┘
```

Al hacer click, se abre un panel que se desliza desde la derecha (no reemplaza la pantalla):

### Los tres riesgos

```
┌──────────────────────────────────────────────────────────────────────┐
│  ✦ Análisis de Riesgos — Torre Azul                            [✕]  │
│  Generado por IA · 3 riesgos identificados                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ⚠  RIESGO 1 — ALTO                                                 │
│  Variación de precio del acero corrugado                             │
│                                                                       │
│  El acero representa el 18.4% del costo directo (S/ 1,331,424).     │
│  En los últimos 6 meses, el acero corrugado en Lima ha tenido       │
│  una variación de ±12%. Una subida del 10% en acero impacta        │
│  el presupuesto en S/ 133,142 adicionales.                          │
│                                                                       │
│  Probabilidad: Alta (mercado volátil)                                │
│  Impacto: S/ 133,142 (1.3% del total)                              │
│                                                                       │
│  ✦ Recomendación: Incluir cláusula de reajuste de precios en el    │
│  contrato referenciada al índice de acero del Banco Central.        │
│                                                                       │
│  [+ Agregar contingencia al presupuesto]                             │
│                                                                       │
│  ─────────────────────────────────────────────────────────────────   │
│                                                                       │
│  ⚠  RIESGO 2 — MEDIO                                                │
│  Zona sísmica 4 — Diseño estructural especial                        │
│                                                                       │
│  Miraflores está clasificada en zona sísmica 4 según NTE E.030.    │
│  Edificios de más de 7 pisos en esta zona requieren análisis         │
│  dinámico y posiblemente aisladores sísmicos en la base.            │
│                                                                       │
│  El presupuesto actual no incluye aisladores sísmicos.              │
│  Si el diseño estructural los requiere: +S/ 320,000–480,000.        │
│                                                                       │
│  Probabilidad: Media (depende del estudio de mecánica de suelos)    │
│  Impacto: S/ 320,000–480,000 (3.1–4.6% del total)                 │
│                                                                       │
│  ✦ Recomendación: Solicitar estudio de mecánica de suelos antes    │
│  de finalizar el diseño estructural. Partida incluida como          │
│  provisional en sección 01.                                          │
│                                                                       │
│  [+ Agregar partida provisional]                                     │
│                                                                       │
│  ─────────────────────────────────────────────────────────────────   │
│                                                                       │
│  ℹ  RIESGO 3 — BAJO                                                 │
│  Plazo de entrega — fachada vidrio spider                            │
│                                                                       │
│  Los sistemas de vidrio spider tienen tiempo de fabricación e       │
│  importación de 14–18 semanas. Con un plazo de obra de 12 meses,  │
│  la orden de compra debe realizarse en el mes 2 máximo.             │
│                                                                       │
│  Probabilidad: Baja si se gestiona a tiempo                         │
│  Impacto: Potencial ampliación de plazo 4–8 semanas                │
│                                                                       │
│  ✦ Recomendación: Incluir en el cronograma la compra anticipada    │
│  de la fachada como hito crítico en mes 2.                          │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Por qué este análisis impresiona

**Riesgo 1:** El ingeniero sabe que el acero es volátil. Pero probablemente nunca calculó el impacto exacto en porcentaje sobre su presupuesto específico. La IA lo hace. No es un consejo genérico — es un análisis de su obra.

**Riesgo 2:** Este es el que puede cambiar la conversación. El sistema no solo nombra el riesgo — da el rango de costo adicional por los aisladores sísmicos (`S/ 320,000–480,000`). Esto muestra que la IA conoce la norma peruana NTE E.030 y entiende sus implicaciones presupuestales.

**Riesgo 3:** El plazo de importación del vidrio spider es un riesgo que muchos ingenieros no modelan explícitamente hasta que es tarde. Que la IA lo mencione como hito crítico en mes 2 demuestra comprensión del proceso constructivo real.

### La acción inmediata

El presentador hace click en `[+ Agregar contingencia al presupuesto]` del Riesgo 1. Aparece un diálogo:

```
┌────────────────────────────────────────────────────────┐
│  Agregar contingencia por volatilidad de acero        │
│                                                         │
│  Monto sugerido: S/ 133,142 (10% sobre costo acero)   │
│  O personalizar: [_______________]                      │
│                                                         │
│  Agregar como:                                          │
│  ○ Porcentaje adicional de imprevistos (+1.3%)          │
│  ● Partida específica "Contingencia — acero"            │
│                                                         │
│  [Cancelar]              [Agregar al presupuesto]      │
└────────────────────────────────────────────────────────┘
```

Click en `[Agregar al presupuesto]`. El total del panel derecho se actualiza en tiempo real: `S/ 10,635,472`. El ingeniero ve que el sistema modifica el presupuesto directamente desde el análisis de riesgos.

---

## PASO 6 — Proyección Financiera

**Duración:** 45 segundos
**Pantalla:** Módulo Predictor Financiero

---

### La transición

En el panel de resumen del presupuesto, botón prominente:

```
[∿ Ver proyección financiera →]
```

Click. Aparece el Predictor Financiero con el proyecto Torre Azul precargado.

### La pantalla de proyección

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ∿ Proyección Financiera — Torre Azul                    ✦ Generado    │
│  Presupuesto base: S/ 10,635,472 · 12 meses · Precio contrato: a def. │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Margen bruto     │  │ ROI del proyecto  │  │ Punto de equilibrio  │  │
│  │                  │  │                  │  │                      │  │
│  │   16.8%          │  │   22.4%          │  │   Mes 7 de 12        │  │
│  │  S/ 1,786,760    │  │                  │  │                      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                          │
│  Nota: precio de venta = presupuesto total. Ajusta el precio            │
│  de contrato para ver el impacto en margen.                             │
│                                                                          │
│  Precio de contrato: S/ [  12,422,037  ]  ← editable                  │
│                          (margen 14.4% sobre costo)                     │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Curva S — Avance físico y financiero proyectado                        │
│                                                                          │
│  100% ┤                                               ╭──────────      │
│       │                                       ╭───────╯                │
│   75% ┤                             ╭─────────╯                        │
│       │                    ╭────────╯     ─── Físico (indigo)          │
│   50% ┤          ╭─────────╯              ─── Financiero (violet)      │
│       │   ╭──────╯                                                     │
│   25% ┤───╯                                                            │
│       ├────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────    │
│       │ M1  M2   M3   M4   M5   M6   M7   M8   M9  M10  M11  M12     │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Flujo de caja mensual (12 meses)                                       │
│                                                                          │
│  MES   VALORIZACIÓN   EGRESOS       SALDO MES    SALDO ACUM.           │
│  ────  ────────────   ─────────     ─────────    ──────────            │
│  M1    S/ 621,600     S/ 890,400    -S/ 268,800  -S/ 268,800           │
│  M2    S/ 932,400     S/ 1,020,000  -S/ 87,600   -S/ 356,400           │
│  M3    S/ 1,242,000   S/ 980,000    +S/ 262,000  -S/ 94,400            │
│  M4    S/ 1,242,000   S/ 1,100,000  +S/ 142,000  +S/ 47,600 ← positivo│
│  M5    S/ 1,552,500   S/ 1,080,000  +S/ 472,500  +S/ 520,100           │
│  ...   ...            ...           ...          ...                    │
│                                                                          │
│  ⚠ Los primeros 3 meses requieren capital de trabajo: S/ 356,400      │
│    Recomendación: solicitar anticipo del 15% al cliente (S/ 1,863,305) │
│                                                                          │
│                                   [↓ Exportar proyección]              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Los momentos de impacto en la proyección

**El déficit inicial (meses 1-3):**
La tabla muestra que los primeros 3 meses el flujo es negativo. Esto no es una falla del sistema — es una verdad financiera de la construcción que la IA modela correctamente. El ingeniero lo reconoce de inmediato.

La alerta al final de la tabla (`⚠ Capital de trabajo: S/ 356,400`) con la recomendación de solicitar anticipo del 15% es el tipo de consejo que un gerente de proyectos con experiencia daría. La IA lo hace automáticamente.

**El precio de contrato editable:**
El presentador cambia el precio de `S/ 12,422,037` a `S/ 13,000,000`. El margen cambia en tiempo real:

```
Margen bruto: 16.8% → 22.2%
ROI:          22.4% → 29.1%
```

El ingeniero puede jugar con el precio de oferta y ver el impacto en margen al instante. Esto es análisis de sensibilidad que normalmente requiere una planilla de cálculo separada.

---

## PASO 7 — Exportar Excel

**Duración:** 20 segundos
**Pantalla:** Modal de exportación → descarga

---

### El botón de exportación

En cualquier pantalla (presupuesto o proyección), el botón prominente:

```
[↓ Exportar a Excel]
```

Click. Aparece el modal:

```
┌──────────────────────────────────────────────────────────────────┐
│  Exportar — Torre Azul                                      [✕]  │
│                                                                   │
│  Formato                                                          │
│  ● Excel (.xlsx)     ○ PDF profesional     ○ Formato OSCE        │
│                                                                   │
│  Contenido a incluir                                              │
│  ☑ Resumen ejecutivo del presupuesto                             │
│  ☑ Presupuesto general por partidas                              │
│  ☑ APUs detallados (58 hojas)                                    │
│  ☑ Metrados y cantidades                                         │
│  ☑ Análisis de riesgos                                           │
│  ☑ Proyección financiera y Curva S                               │
│  ☑ Flujo de caja mensual                                         │
│  ☐ Cronograma de obra (requiere Plan Pro)                        │
│                                                                   │
│  Personalización                                                  │
│  Logo de empresa:  [Constructora ABC_logo.png  ✓]               │
│  Moneda:           [PEN — Soles peruanos  ▾]                    │
│  Idioma:           [Español  ▾]                                  │
│                                                                   │
│  Nombre del archivo: Presupuesto_TorreAzul_v1_jun2026.xlsx      │
│                                                                   │
│                           [Cancelar]   [↓ Generar y descargar]  │
└──────────────────────────────────────────────────────────────────┘
```

### La generación (8 segundos)

Click en `[↓ Generar y descargar]`. El modal se cierra. En la esquina inferior derecha aparece un toast:

```
↻  Generando Excel...  Torre Azul
```

8 segundos después:

```
✓  Presupuesto listo   [↓ Descargar]   Torre Azul
```

El archivo se descarga automáticamente.

---

## El Archivo Excel — Anatomía Detallada

**Nombre del archivo:** `Presupuesto_TorreAzul_v1_jun2026.xlsx`

El Excel abre con 7 hojas. El ingeniero ve en la primera hoja:

### Hoja 1: Portada

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                       │
│   [LOGO CONSTRUCTORA ABC]                                            │
│                                                                       │
│                                                                       │
│                 PRESUPUESTO DE OBRA                                  │
│                                                                       │
│      PROYECTO:   EDIFICIO DE OFICINAS CORPORATIVAS "TORRE AZUL"     │
│      UBICACIÓN:  Miraflores, Lima, Perú                             │
│      ÁREA:       6,400 m² construidos · 8 pisos + 2 sótanos        │
│      PROPIETARIO: [campo para llenar]                                │
│      ELABORADO:  InfraPilot AI · junio 2026                         │
│      REVISADO:   [campo para firma]                                  │
│      FECHA:      07 de junio de 2026                                 │
│                                                                       │
│      MONTO TOTAL: S/ 10,635,472.00                                  │
│      (Diez millones seiscientos treinta y cinco mil...)              │
│                                                                       │
│   Precios según CAPECO Lima · Vigentes junio 2026                   │
│   Incluye IGV 18%                                                    │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

El logo de la empresa aparece en la esquina superior izquierda. El monto en letras. La fecha del día. Se ve como un documento profesional que alguien puede firmar y entregar.

### Hoja 2: Resumen Ejecutivo

| SECCIÓN | DESCRIPCIÓN | PARCIAL S/ | % COSTO |
|---|---|---|---|
| 01 | Obras Preliminares | 48,200 | 0.7% |
| 02 | Movimiento de Tierras | 312,000 | 4.3% |
| 03 | Concreto Armado Sótanos | 1,240,000 | 17.1% |
| 04 | Estructura Principal | 2,180,000 | 30.1% |
| 05 | Muros y Revestimientos | 980,000 | 13.5% |
| 06 | Arquitectura y Acabados | 1,840,000 | 25.4% |
| 07 | Instalaciones Especiales | 636,000 | 8.8% |
| **COSTO DIRECTO** | | **7,236,200** | **100%** |
| Gastos Generales (10%) | | 723,620 | |
| Utilidad (8%) | | 578,896 | |
| Imprevistos (5%) | | 361,810 | |
| Contingencia Acero | | 133,142 | |
| **SUBTOTAL** | | **9,033,668** | |
| IGV 18% | | 1,626,060 | |
| **TOTAL PRESUPUESTO** | | **10,659,728** | |

### Hoja 3: Presupuesto Detallado por Partidas

58 filas con formato profesional. Columnas:
`Ítem | Descripción | Unidad | Metrado | P.Unit | Parcial | Observaciones`

Cada fila alternada en fondo gris muy sutil. Headers con fondo azul oscuro, texto blanco. Subtotales por sección en negrita. La fuente de cada precio unitario en la columna de observaciones: `CAPECO Lima Jun-26`.

### Hoja 4: APUs (una sub-hoja por partida, o tabla vertical)

APU completo de cada partida. Mismo formato que usa el CAPECO en sus boletines. El ingeniero lo reconoce inmediatamente.

```
ANÁLISIS DE PRECIOS UNITARIOS

Partida:      03.04  Concreto en columnas f'c=280 kg/cm²
Rendimiento:  10.00 m3/día
Unidad:       m3
Fecha:        Junio 2026
Región:       Lima, Perú
Fuente:       CAPECO - Boletín Costos y Presupuestos

MATERIALES
─────────────────────────────────────────────────────
Cemento Portland IP   bls  10.00  S/ 15.80  S/ 158.00
Arena gruesa          m3    0.54  S/ 88.00  S/ 47.52
Grava 3/4"            m3    0.56  S/ 98.00  S/ 54.88
Agua                  m3    0.18  S/ 8.00   S/ 1.44
Aditivo superplast.   lt    1.20  S/ 22.00  S/ 26.40
Encofrado met. col.   m2    4.80  S/ 9.40   S/ 45.12
                                    SUBTOTAL  S/ 333.36

MANO DE OBRA
─────────────────────────────────────────────────────
Capataz               hh   0.080  S/ 28.00  S/ 2.24
Operario              hh   0.640  S/ 22.00  S/ 14.08
Oficial               hh   0.640  S/ 19.00  S/ 12.16
Peón                  hh   0.320  S/ 17.00  S/ 5.44
Herramientas          %MO  3.00%            S/ 1.02
                                    SUBTOTAL  S/ 34.94

EQUIPOS
─────────────────────────────────────────────────────
Vibrador para concreto hm   0.080  S/ 8.50   S/ 0.68
Grúa torre             hm   0.200  S/ 180.00 S/ 36.00
Bomba de concreto      hm   0.100  S/ 85.00  S/ 8.50
Andamios               und  1.000  S/ 2.80   S/ 2.80
                                    SUBTOTAL  S/ 47.98

═══════════════════════════════════════════════════════
PRECIO UNITARIO TOTAL                       S/ 416.28/m3
```

### Hoja 5: Proyección Financiera

Tabla mensual (12 columnas) con valorización, egresos, saldo mensual, saldo acumulado. La Curva S como gráfica nativa de Excel (no imagen) — el ingeniero puede modificarla.

### Hoja 6: Análisis de Riesgos

Los 3 riesgos en formato tabular con columnas: `Riesgo | Probabilidad | Impacto S/ | Recomendación`.

### Hoja 7: Configuración y Metadatos

Parámetros del presupuesto (para referencia):
- Región: Lima
- Fuente de precios: CAPECO Jun-26
- Tipo de cambio USD/PEN: 3.72
- Zona sísmica: 4
- Categoría de acabados: Primera

---

## El Momento de Silencio

Cuando el Excel abre ante el ingeniero, hay un momento de silencio.

No porque la herramienta sea imperfecta. Sino porque el documento que está mirando es **el mismo tipo de documento que él hace manualmente en 3 días**. Con el mismo formato. Con los mismos precios. Con los mismos APUs.

Ese silencio es el producto.

---

## Guión del Presentador (versión 4 minutos)

### Opening (0:00 – 0:15)

*"Le voy a mostrar algo simple: voy a escribir una obra, y en menos de 4 minutos vamos a tener el presupuesto completo con APUs, análisis de riesgos y proyección financiera. Sin plantillas, sin preconfiguración. Escribo esto ahora mismo."*

### Durante el procesamiento (1:15 – 2:15)

*"Mientras la IA trabaja, noten lo que está detectando: zona sísmica 4, suelo S2, precios CAPECO de este mes. No es texto genérico — está leyendo la norma peruana. Y miren este dato: nos da un rango esperado de $280–$380 por metro cuadrado. Vamos a ver si el resultado cae ahí."*

### Al ver el presupuesto (2:15 – 2:45)

*"S/ 10.6 millones. Ocho pisos en Miraflores, acabados de primera. Dividan eso por los 6,400 metros cuadrados construidos: $385 por metro cuadrado. En el límite superior del rango que nos dijo la IA, lo cual es correcto para fachada vidrio spider. Ahora miren el APU del concreto f'c=280: cemento Portland IP, aditivo superplastificante, grúa torre. Están todos. No faltan componentes."*

### Al ver los riesgos (2:45 – 3:15)

*"Esto es lo que me parece más valioso. La IA detecta que el acero representa el 18% del costo y cuantifica el impacto de una subida del 10%. Y detecta el riesgo sísmico — edificio de 8 pisos en zona 4 puede requerir aisladores. Eso son entre S/ 320,000 y S/ 480,000 adicionales si el estudio de suelos lo determina. Eso es información que un ingeniero experimentado te diría. Aquí la tienes en 30 segundos."*

### Al exportar (3:30 – 3:50)

*"Exportamos. 8 segundos. Abran el Excel."*

[Silencio mientras el Excel abre]

*"Portada con su logo, resumen ejecutivo, 58 partidas detalladas, APUs completos, proyección financiera con Curva S. Esto es lo que se entrega a un cliente. Esto es lo que se presenta en una licitación. Y lo generamos en 4 minutos."*

---

## Variantes del Demo según Audiencia

### Para el dueño de empresa constructora (3 minutos)

Énfasis en velocidad y competitividad: *"Sus competidores que ya usan esto cotizan en 30 minutos lo que a su equipo le toma 3 días. ¿Cuántas licitaciones pierden por no llegar a tiempo?"*

Foco en: la rapidez del demo, el Excel profesional, el costo de la suscripción vs. el costo de un presupuestador (mención rápida al final).

### Para el jefe de presupuestos (4 minutos — versión completa)

Énfasis en precisión técnica: mostrar el APU completo, el origen de cada precio (CAPECO), la edición inline. *"No reemplaza su criterio profesional — lo amplifica. Usted siempre revisa y aprueba antes de exportar."*

Foco en: el badge de confianza 91%, la edición en tiempo real, la vista de historial de versiones.

### Para el gerente de proyectos (4 minutos)

Énfasis en análisis de riesgos y financiero: *"¿Cuántos proyectos han tenido pérdidas por no modelar el riesgo del acero o el déficit de caja en los primeros meses? La proyección financiera es automática y viene con recomendaciones."*

Foco en: el análisis de riesgos, el flujo de caja mensual, la alerta de capital de trabajo.

### Demo en feria/evento (90 segundos — versión relámpago)

Solo Pasos 2, 3 y 4. Descripción escrita en 10 segundos, procesamiento en 45 segundos, presupuesto visible. Termina mostrando el número total y el APU del concreto. Deja un QR para probar la demo interactiva.

---

## Métricas de Éxito del Demo

| Métrica | Objetivo |
|---|---|
| Tiempo hasta primera impresión positiva ("oh, interesante") | < 30 segundos |
| Tasa de solicitud de prueba gratuita post-demo | > 40% |
| Tasa de conversión demo → suscripción en 30 días | > 20% |
| NPS post-demo (0–10) | > 7 |
| Pregunta más frecuente en el Q&A | "¿Funciona para [tipo de obra específica]?" |

La última métrica es clave: cuando un ingeniero pregunta si funciona para su tipo de obra específica, ya cree que funciona. Solo quiere confirmar su caso particular. En ese punto, el demo ha ganado.

---

## Lo que el Demo No Muestra (y por qué)

Deliberadamente omitimos en el demo de 4 minutos:

1. **El onboarding** — El usuario del demo ya tiene cuenta. No hay formularios en el demo.
2. **La colaboración multiusuario** — Relevante pero no urgente en el primer impacto.
3. **La edición manual detallada** — El poder está en que la IA genera primero. La edición es para el paso siguiente.
4. **Los planes y precios** — Nunca durante el demo. Primero el valor, luego el precio.
5. **Las limitaciones** — Si el ingeniero pregunta qué tipos de obra no soporta, la respuesta es honesta y directa. Pero no lo sacamos durante el demo.

El demo muestra una sola cosa con excelencia: **en 4 minutos, un ingeniero civil tiene un presupuesto profesional que normalmente le toma 3 días.**

Todo lo demás es contexto.

---

*Documento preparado por: Producto y Ventas — InfraPilot AI*
*Versión: 1.0 · Fecha: Junio 2026*
*Clasificación: Confidencial — Uso interno*
