# InfraPilot AI — UI/UX Design System v1.0
**Documento Interno · Confidencial · Junio 2026**

---

## Filosofía de Diseño

> *"La interfaz más rápida es la que el usuario no tiene que aprender."*

InfraPilot AI sigue tres principios de diseño irrenunciables:

1. **El trabajo es el héroe.** La interfaz nunca compite con el contenido. El cromo (chrome) — barras, paneles, botones — existe para servir al presupuesto, no al revés.
2. **La IA es un colaborador, no una caja negra.** Cada sugerencia muestra su confianza, puede editarse y puede rechazarse. El usuario siempre tiene la última palabra.
3. **Los números deben respirar.** Los datos financieros necesitan espacio, jerarquía tipográfica precisa y alineación consistente. Un presupuesto mal presentado parece poco confiable.

---

## Sistema de Diseño

### Paleta de Color

| Token | Hex | Uso |
|---|---|---|
| `slate-900` | `#0F172A` | Sidebar, texto primario, íconos activos |
| `slate-600` | `#475569` | Texto secundario, labels |
| `slate-400` | `#94A3B8` | Texto placeholder, íconos inactivos |
| `slate-200` | `#E2E8F0` | Bordes, divisores |
| `slate-50` | `#F8FAFC` | Fondo de página |
| `white` | `#FFFFFF` | Superficie de cards |
| `indigo-600` | `#4F46E5` | Acción primaria, elementos activos |
| `indigo-50` | `#EEF2FF` | Fondo de elementos activos en sidebar |
| `violet-700` | `#6D28D9` | Identidad de IA — badge, pulsaciones, indicadores |
| `violet-50` | `#F5F3FF` | Fondo de bloques generados por IA |
| `emerald-500` | `#10B981` | Éxito, aprobado, exportado |
| `amber-500` | `#F59E0B` | Advertencia, en revisión, precio desactualizado |
| `rose-500` | `#F43F5E` | Error, rechazado, eliminado |

### Tipografía

**Familia:** Inter (Google Fonts) — weights 400, 500, 600, 700

| Rol | Tamaño | Weight | Uso |
|---|---|---|---|
| `display` | 32px / 2rem | 700 | Títulos de página principales |
| `heading-1` | 24px / 1.5rem | 600 | Títulos de sección |
| `heading-2` | 20px / 1.25rem | 600 | Títulos de cards |
| `heading-3` | 16px / 1rem | 600 | Subtítulos, labels de grupo |
| `body` | 14px / 0.875rem | 400 | Texto general, descripciones |
| `body-medium` | 14px / 0.875rem | 500 | Labels, values en tablas |
| `caption` | 12px / 0.75rem | 400 | Metadata, timestamps |
| `mono` | 13px / 0.8125rem | 400 | Códigos de partida, valores exactos |
| `label` | 11px / 0.6875rem | 600 | Badges, status pills, uppercase labels |

### Espaciado

Base: **4px grid**. Unidades usadas: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

### Bordes y Sombras

```
card shadow:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
card hover:     0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)
modal:          0 20px 60px rgba(0,0,0,0.15)
border-radius:  6px (inputs, badges), 8px (cards), 12px (modals, panels grandes)
```

### Componentes Base

**Badge de IA:**
Pill violeta con ícono de chispa ✦ que aparece en cualquier elemento generado por IA.
`bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 text-[11px] font-semibold`

**Status Pills:**

```
BORRADOR   → slate-100 / slate-600   ○ Borrador
EN REVISIÓN → amber-50 / amber-700   ◑ En revisión
APROBADO   → emerald-50 / emerald-700 ● Aprobado
EXPORTADO  → indigo-50 / indigo-700   ↗ Exportado
ARCHIVADO  → slate-100 / slate-400   ◌ Archivado
```

---

## 1. Menú Lateral (Sidebar Navigation)

### Concepto

Sidebar fija de **240px** de ancho en desktop, colapsable a **64px** (solo íconos) con un toggle. En mobile: drawer deslizable desde la izquierda. Fondo `slate-900`. Siente autoridad sin distraer.

### Anatomía

```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐  │  ← Sidebar (240px, bg: slate-900)
│  │                                │  │
│  │  ◈ InfraPilot AI         [≡]  │  │  ← Logo + toggle colapso
│  │                                │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │ 🔍 Buscar...         ⌘K │  │  │  ← Command palette trigger
│  │  └──────────────────────────┘  │  │
│  │                                │  │
│  │  WORKSPACE                     │  │  ← Section label (11px, slate-500, uppercase)
│  │  ▣  Dashboard                 │  │  ← Item activo (bg: indigo-50/10, text: white)
│  │  ✦  Cotizador IA              │  │  ← Item con badge AI (text: slate-400)
│  │  ☰  Presupuestos              │  │
│  │  ◈  Biblioteca APUs           │  │
│  │                                │  │
│  │  LICITACIONES                  │  │
│  │  ⊞  Licitaciones              │  │
│  │  ◎  Centro Documental         │  │
│  │                                │  │
│  │  ANÁLISIS                      │  │
│  │  ∿  Predictor Financiero      │  │
│  │  ✦  Copiloto IA               │  │  ← Siempre visible, highlight especial
│  │                                │  │
│  │  ─────────────────────────    │  │  ← Divisor
│  │                                │  │
│  │  PROYECTOS RECIENTES           │  │
│  │  ↳ Edificio Los Álamos        │  │  ← Shortcut a proyectos activos (max 5)
│  │  ↳ Vía San Martín km 12      │  │
│  │  ↳ Ptar Lurín                 │  │
│  │  ＋ Nuevo proyecto             │  │
│  │                                │  │
│  │  ─────────────────────────    │  │
│  │                                │  │
│  │  [Avatar] Andrés Mendoza  ⋯  │  │  ← Usuario + org switcher
│  │  Constructora ABC · Pro ✓     │  │  ← Plan actual
│  │                                │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Comportamiento del Ítem de Menú

**Estado inactivo:**
- Ícono: `slate-400`, texto: `slate-400`
- Sin fondo
- Hover: `bg-white/5`, texto `slate-200`, transición 100ms

**Estado activo:**
- Barra izquierda de 2px `indigo-500`
- Fondo: `bg-white/10`
- Texto: `white`, weight 500
- Ícono: `indigo-400`

**Ítem "Copiloto IA"** (tratamiento especial):
- Gradiente sutil en fondo: `from-violet-900/40 to-transparent`
- Ícono pulsante: animación `ring` de `violet-500` cada 4 segundos
- Badge "Nuevo" en amber durante primeras 2 semanas del usuario

### Proyectos Recientes

Cada ítem muestra:
- Ícono de tipo de obra en 14px (color por tipo: vial=amber, edificación=indigo, hidráulica=cyan)
- Nombre truncado a 20 chars con `…`
- Dot de status a la derecha (verde = activo, amber = en revisión)

### Org Switcher

Click en el nombre de la org abre un popover:
- Lista de organizaciones del usuario con avatar
- Opción "Crear nueva organización"
- Plan actual con badge (Free / Starter / Pro / Enterprise)
- Link a "Configuración" y "Facturación"

### Menú Colapsado (64px)

Solo íconos con tooltip en hover:
- Logo compacto `◈` en la parte superior
- Íconos centrados verticalmente
- Badge de notificaciones persiste como dot rojo
- Avatar del usuario en la parte inferior

---

## 2. Dashboard

### Concepto

El Dashboard es la **sala de mando** del proyecto. Primera pantalla que ve el usuario al entrar. No es un panel de métricas vacías — es un resumen operacional que responde: *¿Qué tengo que hacer hoy? ¿Cómo voy?*

Inspiración directa: Stripe Dashboard (densidad de información sin ruido) + Linear (prioridad de tareas accionables).

### Layout General

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Dashboard                                        [+ Nuevo proyecto]   │  ← Page header
│  Buen día, Andrés · Lunes 7 jun 2026                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐│
│  │Proyectos   │  │Presupuesto │  │Licitaciones│  │Créditos IA         ││
│  │activos     │  │total       │  │pendientes  │  │este mes            ││
│  │            │  │            │  │            │  │                    ││
│  │    12      │  │ $2.4M      │  │    3       │  │  847 / 1,000       ││
│  │            │  │ USD        │  │            │  │  ████████░░ 85%    ││
│  │ +2 este mes│  │ +18% vs mes│  │ 1 vence    │  │  [Comprar más]     ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────────────┘│
│                                                                          │
│  ┌──────────────────────────────────────────┐  ┌──────────────────────┐│
│  │ Actividad reciente                       │  │ Acciones rápidas     ││
│  │                                          │  │                      ││
│  │ ● Presupuesto aprobado                  │  │ [✦ Cotizar obra]     ││
│  │   Edificio Los Álamos · hace 2h         │  │                      ││
│  │   por María García                       │  │ [☰ Nuevo presup.]   ││
│  │                                          │  │                      ││
│  │ ● Exportación completada               │  │ [⊞ Nueva licitac.]   ││
│  │   Presupuesto Vía km 12 · hace 5h      │  │                      ││
│  │   → Excel descargado                   │  │ [◎ Subir documento]  ││
│  │                                          │  │                      ││
│  │ ● Comentario en partida               │  │ ─────────────────     ││
│  │   01.03.002 Concreto f'c=210           │  │                      ││
│  │   por Luis Romero · hace 1d            │  │ ✦ Copiloto sugiere:  ││
│  │                                          │  │ "El presupuesto de  ││
│  │ ● APU generado por IA                 │  │ Lurín tiene precios  ││
│  │   Excavación Ptar Lurín · hace 1d     │  │ de cemento de hace   ││
│  │   ✦ 23 partidas · confianza 91%       │  │ 4 meses. ¿Actualizar?"││
│  │                                          │  │ [Ver] [Ignorar]      ││
│  │ [Ver todo →]                            │  │                      ││
│  └──────────────────────────────────────────┘  └──────────────────────┘│
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │ Proyectos activos                               [Ver todos →]       ││
│  │                                                                      ││
│  │  PROYECTO              TIPO        ESTADO      PRESUPUESTO  AVANCE  ││
│  │  ─────────────────────────────────────────────────────────────────  ││
│  │  Edificio Los Álamos   Edificación ● Aprobado  $840,000    ████░░  ││
│  │  Vía San Martín km 12  Vial        ◑ Revisión  $1,200,000  ██░░░░  ││
│  │  PTAR Lurín            Hidráulica  ○ Borrador  $360,000    █░░░░░  ││
│  │  Subest. Chimbote      Eléctrico   ○ Borrador  —           ░░░░░░  ││
│  └──────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### Detalle de Componentes

**Stat Cards (fila superior):**
- 4 columnas en desktop, 2×2 en tablet, 1 columna en mobile
- Número principal: `display` 32px, `slate-900`
- Label: `caption` 12px, `slate-500`, uppercase
- Cambio vs. período anterior: verde si positivo (↑ 18%), rojo si negativo (↓ 3%)
- Card de Créditos IA con progress bar integrada. Cuando < 20%: barra `rose-500` + botón de compra en `amber`

**Card "Copiloto sugiere":**
- Borde izquierdo 2px `violet-500`
- Fondo `violet-50`
- Badge `✦ Copiloto` en `violet-700`
- Texto en `slate-700`, 14px
- Dos acciones: `[Ver]` en `indigo-600` y `[Ignorar]` en `slate-400`
- El copiloto puede sugerir hasta 3 items rotando

**Tabla de Proyectos:**
- Row hover: `slate-50`
- Row click: navega a la vista del proyecto
- Progress bar: barra delgada 6px, `indigo-500` sobre `slate-200`
- Sin presupuesto: `—` en `slate-400`

### Estado Vacío (nuevo usuario)

Cuando no hay proyectos:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    ◈  InfraPilot AI                              │
│                                                                   │
│           Bienvenido a tu espacio de trabajo                     │
│                                                                   │
│    Describe una obra y obtén tu primer presupuesto               │
│    en menos de 5 minutos.                                        │
│                                                                   │
│              [✦ Crear mi primer presupuesto]                     │
│                                                                   │
│    ─────────────────────────────────────────                     │
│    ¿Tienes un proyecto existente?  [Importar Excel]              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

El botón principal usa el tratamiento de IA: gradiente `from-violet-600 to-indigo-600`, texto blanco, `shadow-lg`, hover levanta 2px.

---

## 3. Cotizador IA

### Concepto

La pantalla más importante del producto. Es el **core loop** completo: descripción → revisión → presupuesto. Debe sentirse como hablar con un colega experto, no como llenar un formulario.

Diseño en tres fases (wizard sin pasos visibles): el usuario no sabe que hay "pasos" — la interfaz fluye naturalmente.

### Fase 1: Describe tu Obra

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✦ Cotizador IA                    Nueva cotización            [✕]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    Describe tu obra                                      │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                                                                  │  │
│   │  Escribe aquí la descripción de la obra...                      │  │
│   │                                                                  │  │
│   │  Ejemplo: "Construcción de un edificio residencial de 5 pisos   │  │
│   │  con 20 departamentos en Lima, Perú. Estructura aporticada de   │  │
│   │  concreto armado, acabados de nivel medio-alto. Plazo estimado  │  │
│   │  8 meses. Zona sísmica 4."                                      │  │
│   │                                                                  │  │
│   │                                                          0/2000  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  📎 O adjunta un documento                                      │   │
│   │     PDF de especificaciones, memoria descriptiva, planos        │   │
│   │     Arrastra aquí o  [Seleccionar archivo]                      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   Región de la obra                          Moneda                     │
│   ┌─────────────────────────────────┐  ┌─────────────────────────┐     │
│   │ 🌎 Lima, Perú               ▾ │  │ 🇵🇪 PEN - Sol peruano ▾ │     │
│   └─────────────────────────────────┘  └─────────────────────────┘     │
│                                                                          │
│                                             [Analizar con IA →]        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Comportamiento del textarea:**
- Auto-resize hasta 400px de altura
- Contador de caracteres aparece al escribir el primer caracter
- Al llegar a 80% del límite: contador cambia a `amber-600`
- Placeholder desaparece al hacer focus; aparece un hint animado de 3 ejemplos rotando cada 4s

**El botón "Analizar con IA":**
- Disabled hasta tener al menos 50 caracteres en el textarea O un archivo adjunto
- Habilitado: gradiente `indigo-600 → violet-700`, texto blanco, shadow
- Hover: levanta 1px, shadow más pronunciada
- Click: el botón mismo se convierte en indicador de progreso

### Fase 2: Procesando (estado de carga)

Esta fase dura entre 15-45 segundos. No puede ser una pantalla en blanco.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    ✦ Analizando tu obra                                 │
│                                                                          │
│      La IA está interpretando tu descripción...                         │
│                                                                          │
│      ┌───────────────────────────────────────────────────────────┐      │
│      │                                                           │      │
│      │  ✓  Tipo de obra identificado: Edificación residencial   │      │
│      │  ✓  Región detectada: Lima — precios CAPECO 2026        │      │
│      │  ↻  Identificando partidas de obra gruesa...            │      │  ← animado
│      │  ○  Calculando metrados estimados                        │      │
│      │  ○  Generando APUs                                       │      │
│      │  ○  Validando contra base de precios                     │      │
│      │                                                           │      │
│      └───────────────────────────────────────────────────────────┘      │
│                                                                          │
│      ─────────────────────────────────────────────────────              │
│      Progreso estimado:  ████████████░░░░░░░░  58%                      │
│                                                                          │
│      💡 Sabías que: Los APUs para estructuras de concreto armado         │
│         representan en promedio el 35% del costo directo de              │
│         edificaciones residenciales en Lima.                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Diseño del estado de carga:**
- Los checkmarks `✓` van apareciendo con animación suave (fade + slide left)
- El ítem activo `↻` tiene un spinner de 14px en `indigo-500`
- Los ítems pendientes `○` en `slate-300`
- La barra de progreso es una estimación visual (no real-time) que avanza suavemente
- El "Sabías que" rota entre 5 facts de ingeniería civil relevantes
- Tipografía del fact: `italic`, `slate-500`, 13px

### Fase 3: Revisión de Partidas Identificadas

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✦ Partidas identificadas                      Confianza global: 89%   │
│  Edificio Los Álamos · Lima · PEN                                       │
├────────────────────────────────────┬────────────────────────────────────┤
│ Partidas (23)              [+ Add] │                                     │
│                                    │  Vista previa de APU               │
│ ▼ 01  OBRAS PRELIMINARES          │  ─────────────────────────         │
│   01.01  Limpieza de terreno   ✓  │                                     │
│   01.02  Trazo y replanteo     ✓  │  Selecciona una partida             │
│   01.03  Movilización glb      ✦  │  para ver su APU                    │
│                                    │                                     │
│ ▼ 02  MOVIMIENTO DE TIERRAS       │                                     │
│   02.01  Excavación masiva     ✦  │                                     │
│   02.02  Relleno compactado    ✓  │                                     │
│   02.03  Eliminación material  ✦  │                                     │
│                                    │                                     │
│ ▼ 03  OBRAS DE CONCRETO           │                                     │
│   03.01  Concreto cimientos    ✓  │                                     │
│   03.02  Acero cimientos       ✦  │                                     │
│   03.03  Encofrado losas       ✓  │                                     │
│           ...                      │                                     │
│                                    │                                     │
│ [Siguiente: Generar presupuesto →] │                                     │
└────────────────────────────────────┴────────────────────────────────────┘
```

**Panel izquierdo — Lista de partidas:**
- Árbol colapsable por sección
- `✓` = partida identificada con alta confianza (verde)
- `✦` = partida generada por IA (badge violeta) — hover muestra tooltip "Generado por IA · Confianza 87%"
- `⚠` = partida con precio desactualizado (amber)
- Click en partida → muestra su APU en el panel derecho
- Cada partida tiene un menú contextual `⋯` en hover: Editar nombre, Duplicar, Eliminar
- `[+ Add]` abre un input inline para agregar partida manual

**Panel derecho — Vista previa de APU:**
Cuando una partida está seleccionada:

```
│  Vista previa de APU                                                    │
│  ─────────────────────────────────────────────────────────              │
│  02.01  Excavación masiva         ✦ Generado por IA                    │
│  Unidad: m3    Rendimiento: 120 m3/día                                  │
│                                                                          │
│  MATERIALES                                    Subtotal: S/ 0.00        │
│  ────────────────────────────────────────────────────────               │
│  (ninguno)                                                               │
│                                                                          │
│  MANO DE OBRA                                  Subtotal: S/ 18.40       │
│  ────────────────────────────────────────────────────────               │
│  Capataz         hh   0.067   S/ 28.00   S/ 1.88                       │
│  Operario        hh   0.267   S/ 22.00   S/ 5.87                       │
│  Oficial         hh   0.267   S/ 19.00   S/ 5.07                       │
│  Peón            hh   0.533   S/ 17.00   S/ 9.06 ← valores editables   │
│                                                                          │
│  EQUIPOS                                       Subtotal: S/ 12.50       │
│  ────────────────────────────────────────────────────────               │
│  Excavadora 200HP hm  0.067   S/ 180.00  S/ 12.06                      │
│  Herramientas     %MO 3.00%             S/ 0.55                         │
│                                                                          │
│  ═════════════════════════════════════════════════════                  │
│  PRECIO UNITARIO                               S/ 30.90 / m3            │
│                                                                          │
│  Precios vigentes: Ene 2026 · Fuente: CAPECO                           │
│  [✎ Editar APU completo]   [↺ Regenerar]   [✓ Aceptar]               │
└─────────────────────────────────────────────────────────────────────────┘
```

**Microinteracciones de la revisión:**
- Click en cualquier valor numérico del APU → se convierte en input inline
- Cambio de valor → recalcula totales en tiempo real con animación suave (number flip)
- `[↺ Regenerar]` → vuelve a llamar a la IA solo para esa partida
- `[✓ Aceptar]` → marca la partida como revisada, el `✦` se convierte en `✓`
- El botón "Siguiente" muestra el conteo: "Siguiente (18 de 23 revisadas) →"
- Si hay partidas sin revisar: aparece un modal de confirmación

---

## 4. Presupuestos

### Concepto

Vista de gestión y detalle de presupuestos. Dos subvistas: la **lista** de presupuestos por proyecto, y el **editor** de presupuesto individual. El editor es el workspace principal donde el usuario pasa más tiempo.

### 4.1 Lista de Presupuestos

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Presupuestos                                    [+ Nuevo presupuesto]  │
│                                                                          │
│  [🔍 Buscar proyectos...]   [Tipo ▾]  [Estado ▾]  [Fecha ▾]           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PROYECTO                  TIPO        MONTO TOTAL     ESTADO    FECHA  │
│  ──────────────────────────────────────────────────────────────────     │
│                                                                          │
│  Edificio Los Álamos       Edificación  S/ 840,000     ● Aprobado  Jun  │
│  Lima, Perú · 5 pisos                                              2026 │
│  Versión 3 · 47 partidas · Exportado 2 veces                           │
│                                                                          │
│  Vía San Martín km 12      Vial         S/ 1,200,000   ◑ Revisión Jun  │
│  Piura, Perú · 8.5 km                                              2026 │
│  Versión 2 · 63 partidas · Modificado hace 2 días                      │
│                                                                          │
│  PTAR Lurín                Hidráulica   S/ 360,000     ○ Borrador  May  │
│  Lima, Perú · 180 l/s                                              2026 │
│  Versión 1 · 28 partidas · ✦ Generado por IA                          │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────     │
│  Mostrando 3 de 12 proyectos                          [Cargar más]     │
└─────────────────────────────────────────────────────────────────────────┘
```

**Cards de proyecto:**
- Fila completa clickeable → va al editor del presupuesto
- Menú `⋯` en hover: Duplicar, Archivar, Exportar, Ver historial
- Badge de estado a la derecha con dot de color
- Subtítulo: metadata contextual (tipo, ubicación, dimensión de obra)
- Tag `✦ Generado por IA` para presupuestos originados en el Cotizador

### 4.2 Editor de Presupuesto

La vista más densa y sofisticada de la aplicación. Layout en **tres paneles** redimensionables.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Presupuestos    Edificio Los Álamos — Versión 3              [⋯]   │
│                    ○ Borrador  ·  Modificado hace 2 min                │
├────────────┬────────────────────────────────────────┬───────────────────┤
│  Secciones │                                        │ Resumen           │
│  (200px)   │  Editor de partidas                   │ (280px)           │
│            │                                        │                   │
│  ▼ 01 Obr. │  01.03.002  Concreto f'c=210 kg/cm²   │ Costo directo     │
│    Prelim. │  ─────────────────────────────────     │ S/ 702,500        │
│  ▼ 02 Mov. │                                        │                   │
│    Tierras │  Unidad  m3    Cantidad  1,240.50       │ Gastos generales  │
│  ▼ 03 Con. │                                        │ 10% · S/ 70,250   │
│    Armado  │  MATERIALES              S/ 285.40     │                   │
│  ▼ 04 Mur. │  ┌──────────────────────────────────┐ │ Utilidad          │
│  ▼ 05 Rev. │  │Mat.  Und  Cant   P.Unit  Total   │ │ 8% · S/ 56,200    │
│  ▼ 06 Pav. │  │Cem.  bls  9.73  14.50   141.09  │ │                   │
│  ─────────  │  │Arena m3   0.51  85.00   43.35   │ │ Imprevistos       │
│  + Sección  │  │Grav. m3   0.54  95.00   51.30   │ │ 5% · S/ 35,125    │
│            │  │Agua  m3   0.18  8.00    1.44    │ │                   │
│            │  │Adip. lt   0.27  18.00   4.86    │ │ ─────────────────  │
│            │  │Enc.  m2   5.00  8.90    44.50   │ │ Subtotal           │
│            │  └──────────────────────────────────┘ │ S/ 864,075        │
│            │                                        │                   │
│            │  MANO DE OBRA            S/ 42.60      │ IGV 18%           │
│            │  EQUIPOS                 S/ 18.20      │ S/ 155,534        │
│            │  ─────────────────────────────────     │                   │
│            │  PRECIO UNITARIO         S/ 346.20     │ ═════════════════  │
│            │                                        │ TOTAL             │
│            │  Costo total partida                   │ S/ 1,019,609      │
│            │  1,240.50 × S/ 346.20 = S/ 429,545    │                   │
│            │                          ✦ Generado   │ [↓ Exportar]      │
│            │                             confianza 87%                  │
│            │                                        │ [⊞ Compartir]    │
│            │  [← Anterior]          [Siguiente →]  │                   │
├────────────┴────────────────────────────────────────┴───────────────────┤
│  [✦ Agregar partida con IA]  [+ Agregar manual]  [🔍 Desde biblioteca] │
└─────────────────────────────────────────────────────────────────────────┘
```

**Panel izquierdo — Árbol de secciones:**
- Colapsable, drag para reordenar secciones
- Cada sección muestra subtotal al colapsar
- Click en partida → la carga en el panel central
- Sección activa: borde izquierdo `indigo-500`
- Hover en sección: aparece `⋯` para editar nombre, mover, eliminar

**Panel central — Editor de APU:**
- El APU completo de la partida seleccionada
- Tabla inline editable: click en cualquier celda → input
- Al cambiar P.Unit: recalcula Total y propaga al resumen derecho en tiempo real
- Fila nueva: botón `+` al final de cada grupo (materiales, MO, equipos)
- Drag handle `⠿` para reordenar filas
- Badge `✦ Generado` con score de confianza en hover muestra qué fuente de precios usó

**Panel derecho — Resumen financiero:**
- Sticky — se queda fijo mientras el usuario desplaza el centro
- Los valores se animan (number transition) cuando cambia algún precio
- Parámetros editables inline: % gastos generales, % utilidad, % imprevistos, % IGV
- Al cambiar un parámetro: todos los montos recalculan con una animación suave de 200ms
- `[↓ Exportar]`: dropdown con opciones Excel / PDF / Formato OSCE / Formato SERCOP
- `[⊞ Compartir]`: genera link de vista de solo lectura del presupuesto

**Barra inferior:**
- `[✦ Agregar partida con IA]`: abre el Cotizador IA en modo "agregar partida" (contexto del presupuesto actual)
- `[+ Agregar manual]`: agrega fila vacía al final de la sección activa
- `[🔍 Desde biblioteca]`: abre panel lateral de la Biblioteca APUs

### Historial de Versiones

Dropdown desde `[⋯]` en el header:

```
┌────────────────────────────────────────────────┐
│  Historial de versiones                   [✕]  │
│                                                 │
│  ● Versión 3  (actual)                         │
│    Hoy 14:32 · Andrés Mendoza                  │
│    +3 partidas, precios actualizados             │
│                                                 │
│  ○ Versión 2                                   │
│    2 jun · María García                         │
│    Revisión de gastos generales (10% → 12%)     │
│    [Restaurar]  [Comparar con actual]           │
│                                                 │
│  ○ Versión 1  (generada por IA)               │
│    28 may · ✦ InfraPilot AI                    │
│    Generación inicial — 44 partidas             │
│    [Restaurar]  [Comparar con actual]           │
└────────────────────────────────────────────────┘
```

---

## 5. Biblioteca APUs

### Concepto

La Biblioteca es el **catálogo de conocimiento** de la organización. APUs propios, plantillas del sistema, y el catálogo global de precios unitarios. Es el lugar donde el usuario construye su ventaja competitiva: precios calibrados a su realidad.

### Layout Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Biblioteca APUs                      [+ Crear APU]  [↑ Importar]     │
│                                                                          │
│  [Mis APUs]   [Plantillas sistema]   [Catálogo de precios]             │
│  ─────────────────────────────────────────────────────────              │
│                                                                          │
│  🔍 Buscar APUs...            [Tipo ▾] [Región ▾] [Uso reciente ▾]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ESTRUCTURAS DE CONCRETO                                          (14)  │
│  ──────────────────────────────────────────────────────────────────     │
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │ Concreto f'c=175   │  │ Concreto f'c=210   │  │ Concreto f'c=280   ││
│  │ kg/cm²             │  │ kg/cm²             │  │ kg/cm²             ││
│  │                    │  │                    │  │                    ││
│  │ S/ 285.40 / m3    │  │ S/ 346.20 / m3    │  │ S/ 412.80 / m3    ││
│  │                    │  │                    │  │                    ││
│  │ Lima · Ene 2026   │  │ Lima · Ene 2026   │  │ Lima · Ene 2026   ││
│  │ Usado 8 veces      │  │ Usado 23 veces     │  │ Usado 5 veces      ││
│  │                    │  │ ★ Más usado        │  │                    ││
│  │ [Ver] [Usar]       │  │ [Ver] [Usar]       │  │ [Ver] [Usar]       ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
│  MOVIMIENTO DE TIERRAS                                            (8)   │
│  ──────────────────────────────────────────────────────────────────     │
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐                        │
│  │ Excavación c/equip │  │ Relleno compactado │                        │
│  │                    │  │ material propio    │                        │
│  │ S/ 28.40 / m3     │  │ S/ 18.60 / m3     │                        │
│  │ Lima · Ene 2026   │  │ Lima · Ene 2026   │                        │
│  │ [Ver] [Usar]       │  │ [Ver] [Usar]       │                        │
│  └────────────────────┘  └────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tabs:**
- `Mis APUs`: APUs propios de la organización (editables)
- `Plantillas sistema`: APUs globales de InfraPilot (read-only pero copiables)
- `Catálogo de precios`: precios unitarios de recursos individuales (materiales, MO, equipos)

**Cards de APU:**
- Precio unitario en tipografía `heading-2` peso 600, `slate-900`
- Metadata secundaria: región, fecha de vigencia
- `★ Más usado` badge cuando está en top 3 de la organización
- `[Ver]`: abre modal de detalle del APU
- `[Usar]`: permite seleccionar en qué presupuesto agregar esta partida
- Hover: card eleva sombra, aparece checkbox para selección múltiple

### Modal de Detalle de APU

```
┌──────────────────────────────────────────────────────────────────┐
│  Concreto f'c=210 kg/cm²             ✦ Plantilla sistema  [✕]  │
│  Unidad: m3 · Rendimiento: 10 m3/día · Lima, Perú              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  MATERIALES                                    S/ 285.40 / m3   │
│  ─────────────────────────────────────────────────────────────   │
│  Cemento Portland I    bls   9.73   S/ 14.50   S/ 141.09        │
│  Arena gruesa          m3    0.51   S/ 85.00   S/ 43.35         │
│  Grava 3/4"            m3    0.54   S/ 95.00   S/ 51.30         │
│  Agua                  m3    0.18   S/ 8.00    S/ 1.44          │
│  Aditivo plastificante lt    0.27   S/ 18.00   S/ 4.86          │
│  Encofrado metálico    m2    5.00   S/ 8.90    S/ 44.50         │
│                                                                   │
│  MANO DE OBRA                                   S/ 42.60 / m3   │
│  ─────────────────────────────────────────────────────────────   │
│  Capataz              hh    0.080   S/ 28.00   S/ 2.24          │
│  Operario             hh    0.800   S/ 22.00   S/ 17.60         │
│  Oficial              hh    0.800   S/ 19.00   S/ 15.20         │
│  Peón                 hh    0.400   S/ 17.00   S/ 6.80          │
│  Herramientas         %MO   3.00%              S/ 0.76          │
│                                                                   │
│  EQUIPOS                                        S/ 18.20 / m3   │
│  ─────────────────────────────────────────────────────────────   │
│  Vibrador concreto    hm    0.080   S/ 8.50    S/ 0.68          │
│  Mezcladora           hm    0.080   S/ 15.00   S/ 1.20          │
│  Bomba concreto       hm    0.080   S/ 205.00  S/ 16.40         │
│                                                                   │
│  ══════════════════════════════════════════════════════════════   │
│  PRECIO UNITARIO TOTAL                         S/ 346.20 / m3   │
│  Precios: CAPECO Lima · Vigente desde: Ene 2026                 │
│                                                                   │
│  [Copiar a mis APUs]   [Usar en presupuesto]   [Cerrar]        │
└──────────────────────────────────────────────────────────────────┘
```

### Tab: Catálogo de Precios

Vista de tabla para explorar precios individuales de recursos:

```
│  🔍 Buscar "cemento"...                                          │
│                                                                   │
│  RECURSO                  TIPO      UNIDAD   PRECIO    REGIÓN   │
│  ───────────────────────────────────────────────────────────     │
│  Cemento Portland I       Material  bls      S/ 14.50  Lima     │
│  Cemento Portland V       Material  bls      S/ 16.80  Lima     │
│  Cemento Portland I       Material  bls      S/ 13.90  Arequipa │
│  Cemento antisalitre      Material  bls      S/ 17.20  Lima     │
│                                                                   │
│  Fuente: CAPECO · Enero 2026 ·  ⚠ Actualización pendiente Mayo │
```

Alerta de desactualización cuando un precio tiene más de 3 meses de antigüedad.

---

## 6. Licitaciones

### Concepto

Centro de gestión de procesos de selección pública y privada. Combina el tracking de fechas clave con el checklist de requisitos y la generación de propuestas. Inspirado en la claridad de Linear para tracking de estado.

### Vista de Pipeline (kanban)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Licitaciones                                     [+ Nueva licitación] │
│                                                                          │
│  [Pipeline]   [Lista]   [Calendario]                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PREPARACIÓN (2)        EN PROPUESTA (3)     ENVIADA (1)   RESULTADO   │
│  ──────────────         ─────────────        ─────────     ────────     │
│                                                                          │
│  ┌──────────────────┐   ┌──────────────────┐  ┌───────────────────┐   │
│  │ Carretera Cusco  │   │ Presa San Juan   │  │ Edificio MAE     │   │
│  │ INVIAS — Col.   │   │ SENAMHI — Perú  │  │ Priv. — Perú    │   │
│  │                  │   │                  │  │                   │   │
│  │ S/ 4.2M est.    │   │ S/ 8.1M est.    │  │ S/ 1.2M          │   │
│  │                  │   │                  │  │                   │   │
│  │ ⏰ Vence 15 jun  │   │ ⏰ Vence 22 jun  │  │ Enviada 5 jun    │   │
│  │ 8 días          │   │ ⚠ 15 días        │  │                   │   │
│  │                  │   │                  │  │ Esperando        │   │
│  │ ■■■□□ 60%       │   │ ■■■■□ 80%       │  │ resultado         │   │
│  │ Checklist 3/5   │   │ Checklist 4/5   │  │                   │   │
│  └──────────────────┘   └──────────────────┘  └───────────────────┘   │
│                                                                          │
│                         ┌──────────────────┐                           │
│                         │ Plantas Lima     │                           │
│                         │ MML — Perú      │                           │
│                         │                  │                           │
│                         │ S/ 560K est.    │                           │
│                         │ ⏰ Vence 30 jun  │                           │
│                         │ ■□□□□ 20%       │                           │
│                         └──────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Cards de licitación:**
- Color del header por urgencia: verde (>15 días), amber (7-15 días), rojo (<7 días)
- Progress bar del checklist: porcentaje de requisitos cumplidos
- Countdown: "8 días" en normal, "⚠ 3 días" en amber/rojo cuando es urgente
- Drag entre columnas para cambiar estado

### Vista de Detalle de Licitación

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Licitaciones   Presa San Juan — SENAMHI                    [⋯]     │
│                   Concurso Público · Perú · ⏰ 15 días restantes       │
├─────────────────────────────┬───────────────────────────────────────────┤
│                             │                                            │
│  Checklist de requisitos    │  Propuesta                                │
│  ─────────────────────────  │  ─────────────────────                   │
│                             │                                            │
│  ADMINISTRATIVOS           │  Presupuesto base                         │
│  ☑ RUC activo              │  Presa San Juan — v2                      │
│  ☑ No estar inhabilitado   │  S/ 8,100,000                             │
│  ☑ Carta de presentación   │                                            │
│  ☐ Certificado SUNARP      │  Monto ofertado                           │
│    Pendiente              │  ┌─────────────────────────────────────┐   │
│                             │  │  S/ [    7,850,000.00         ]   │   │
│  TÉCNICOS                  │  └─────────────────────────────────────┘   │
│  ☑ Experiencia 15 años     │  Variación: -3.1% respecto al referencial │
│  ☑ Ing. residente CIP      │                                            │
│  ☐ Informe hidráulico      │  ──────────────────────────────────────── │
│    Cargar documento       │                                            │
│                             │  Documentos de propuesta                  │
│  FINANCIEROS               │  ☑ Carta de presentación [↓ PDF]         │
│  ☑ Estado financiero 2025  │  ☑ Propuesta técnica [↓ PDF]             │
│  ☐ Carta bancaria          │  ☐ Presupuesto detallado                  │
│    Pendiente              │    [✦ Generar con IA]                     │
│                             │                                            │
│  4 de 8 cumplidos ■■■■□□□□ │  [✦ Generar propuesta completa]          │
│                             │                                            │
│  [+ Agregar requisito]     │  [↑ Enviar propuesta]                    │
└─────────────────────────────┴───────────────────────────────────────────┘
```

**Checklist:**
- Click en checkbox → toggle inmediato con animación de check
- Item incumplido: `☐` con texto `slate-900` + sub-texto `slate-400` indicando acción
- Hover en item pendiente: botón inline `[Cargar]` o `[Completar]`
- Progress visual: `■■■■□□□□` en header actualiza en tiempo real

**Panel de propuesta:**
- Campo de monto ofertado: input numérico con formato automático
- Variación: verde si < referencial, rojo si > referencial, con % calculado en tiempo real
- `[✦ Generar con IA]`: genera el documento de presupuesto en el formato del concurso
- `[✦ Generar propuesta completa]`: genera carta de presentación + memoria técnica + presupuesto

---

## 7. Predictor Financiero

### Concepto

Módulo de análisis e inteligencia financiera. No es solo una calculadora — es el lugar donde el usuario toma decisiones estratégicas sobre viabilidad y riesgo. Diseño inspirado en Stripe Analytics: datos primero, sin decoración innecesaria.

### Vista Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Predictor Financiero                                     [+ Proyectar] │
│                                                                          │
│  Proyecto: [Edificio Los Álamos           ▾]   Versión: [Base ▾]       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Margen bruto     │  │ ROI estimado     │  │ Punto de equilibrio  │  │
│  │                  │  │                  │  │                      │  │
│  │   18.4%          │  │   24.2%          │  │   Mes 6              │  │
│  │                  │  │                  │  │                      │  │
│  │ S/ 154,560       │  │                  │  │ de 8 meses plazo     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Curva S — Avance Físico y Financiero                             │ │
│  │                                                                    │ │
│  │  100% ─                                    ╭────────────────      │ │
│  │       │                              ╭─────╯                      │ │
│  │   75% ─                        ╭────╯                             │ │
│  │       │                  ╭─────╯   ─── Avance físico              │ │
│  │   50% ─           ╭─────╯         ─── Avance financiero           │ │
│  │       │      ╭────╯               • Hoy                          │ │
│  │   25% ─ ╭────╯                                                    │ │
│  │       │─┴────┬────┬────┬────┬────┬────┬────┬────                 │ │
│  │       │  M1   M2   M3   M4   M5   M6   M7   M8                   │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────┐  ┌─────────────────────────────┐ │
│  │  Flujo de Caja Proyectado        │  │  Análisis de Sensibilidad   │ │
│  │                                  │  │                             │ │
│  │  MES  INGRESOS   EGRESOS  SALDO  │  │  Variable    -10%   +10%   │ │
│  │  ───  ─────────  ───────  ─────  │  │  Cemento    +1.2%  -1.2%  │ │
│  │  M1   S/ 80K     S/ 95K   -15K  │  │  Acero      +2.1%  -2.1%  │ │
│  │  M2   S/ 100K    S/ 88K   -3K   │  │  MO         +3.4%  -3.4%  │ │
│  │  M3   S/ 120K    S/ 102K  +15K  │  │  Equipos    +0.8%  -0.8%  │ │
│  │  M4   S/ 140K    S/ 110K  +45K  │  │                             │ │
│  │  ...  ...        ...      ...   │  │  ✦ Mayor riesgo: Mano       │ │
│  │                                  │  │    de obra (+3.4%)          │ │
│  │  [Ver tabla completa]            │  │                             │ │
│  └──────────────────────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Curva S:**
- Gráfica SVG responsive, sin librería de terceros visible para el usuario
- Dos líneas: física (`indigo-500`) y financiera (`violet-500`)
- Punto "Hoy" con dot interactivo: hover muestra `M3 · Físico 28% · Financiero 22%`
- Área entre las curvas sombreada sutilmente cuando hay desvío
- Animación de dibujo al cargar (stroke-dashoffset de 0 a 100% en 1.2s)

**Análisis de Sensibilidad:**
- Tabla de impacto en margen por variación de precio de insumos clave
- `✦` señala el insumo de mayor riesgo (calculado por IA)
- Hover en celda: tooltip con "Si el cemento sube 10%, el margen pasa de 18.4% a 17.2%"
- Cada fila puede expandirse para ver qué partidas se ven más afectadas

### Modal: Configurar Proyección

```
┌────────────────────────────────────────────────────────────────┐
│  Configurar proyección                                    [✕]  │
│                                                                 │
│  Parámetros financieros                                        │
│  ─────────────────────────────────────────────────────────     │
│  Duración del proyecto   [  8  ] meses                         │
│  Tipo de valorización    [Mensual           ▾]                 │
│  % anticipo              [  20  ] %                            │
│  % retención             [  5   ] %                            │
│                                                                 │
│  Ingresos estimados                                            │
│  ─────────────────────────────────────────────────────────     │
│  Precio de venta / contrato   S/ [  1,019,609.00  ]           │
│  (Por defecto: igual al presupuesto total)                     │
│                                                                 │
│  Escalación de precios                                         │
│  ─────────────────────────────────────────────────────────     │
│  Aplicar índice de precios    [✓] Sí                          │
│  Fuente                       [CAPECO Lima 2026      ▾]       │
│  Factor anual                 [  4.2  ] %                      │
│                                                                 │
│                         [Cancelar]   [✦ Generar proyección]  │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. Centro Documental

### Concepto

Repositorio organizado de todos los documentos del espacio de trabajo. Exportaciones generadas, planos cargados, memorias descriptivas, propuestas de licitación. Diseño inspirado en la claridad de Dropbox Paper: el archivo como ciudadano de primera clase.

### Layout Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Centro Documental                              [+ Subir]  [✦ Generar] │
│                                                                          │
│  [Todos]  [Presupuestos]  [Planos]  [Licitaciones]  [Memorias]         │
│                                                                          │
│  🔍 Buscar documentos...                [Proyecto ▾] [Tipo ▾] [Fecha ▾]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ESTA SEMANA                                                             │
│  ──────────────────────────────────────────────────────────────────     │
│                                                                          │
│  ┌─────┐  Presupuesto_LosAlamos_v3.xlsx                                │
│  │XLSX │  Edificio Los Álamos · Presupuesto · 2.4 MB                   │
│  │     │  Exportado hoy 14:32 · por Andrés Mendoza                     │
│  └─────┘  [↓ Descargar]  [👁 Vista previa]  [🔗 Compartir]  [⋯]     │
│                                                                          │
│  ┌─────┐  Propuesta_PrSanJuan_v1.pdf                                   │
│  │ PDF │  Presa San Juan · Licitación · 1.1 MB                         │
│  │     │  Generado ayer · ✦ Generado por IA                            │
│  └─────┘  [↓ Descargar]  [👁 Vista previa]  [🔗 Compartir]  [⋯]     │
│                                                                          │
│  ESTE MES                                                                │
│  ──────────────────────────────────────────────────────────────────     │
│                                                                          │
│  ┌─────┐  Planos_PTAR_Lurin.pdf                                        │
│  │ PDF │  PTAR Lurín · Planos · 8.7 MB                                 │
│  │     │  Subido hace 5 días · por María García                        │
│  └─────┘  [↓ Descargar]  [✦ Extraer metrados]  [⋯]                   │
│                                                                          │
│  ┌─────┐  Memoria_SanMartin.docx                                       │
│  │DOCX │  Vía San Martín · Memoria técnica · 340 KB                    │
│  │     │  Subido hace 8 días · por Luis Romero                         │
│  └─────┘  [↓ Descargar]  [👁 Vista previa]  [✦ Analizar]  [⋯]       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Íconos de archivo:**
- XLSX: fondo `emerald-100`, texto `emerald-700`, icono de tabla
- PDF: fondo `rose-100`, texto `rose-700`, icono de documento
- DOCX: fondo `indigo-100`, texto `indigo-700`, icono de texto
- Planos/CAD: fondo `amber-100`, texto `amber-700`, icono de plano

**Acciones contextuales por tipo:**
- **Presupuesto Excel/PDF:** Descargar, Vista previa, Compartir, Duplicar, Eliminar
- **Planos PDF:** Descargar, `✦ Extraer metrados` (IA analiza el plano), Eliminar
- **Memoria técnica:** Descargar, Vista previa, `✦ Analizar` (IA extrae especificaciones)

**`[✦ Generar]`** — Dropdown:
```
┌──────────────────────────────────────┐
│  Generar documento                   │
│  ────────────────────────────────    │
│  ✦ Presupuesto en Excel              │
│  ✦ Presupuesto en PDF                │
│  ✦ APUs detallados                   │
│  ✦ Memoria de cálculo                │
│  ✦ Propuesta de licitación OSCE      │
│  ✦ Propuesta de licitación SERCOP    │
└──────────────────────────────────────┘
```

### Vista Previa de Documento

Overlay full-screen con el documento renderizado:
- Barra superior: nombre del archivo, botones Descargar y Cerrar
- Área central: preview del PDF o tabla del Excel
- Panel lateral derecho (solo para presupuestos): resumen financiero del documento
- Zoom, scroll, búsqueda dentro del documento

---

## 9. Copiloto IA

### Concepto

El Copiloto es el **asistente experto siempre disponible**. No es un chatbot genérico — es un ingeniero civil senior que conoce todos tus proyectos, presupuestos y el mercado de precios de construcción. Puede responder preguntas, sugerir optimizaciones, comparar presupuestos, y ejecutar acciones directamente.

Acceso: icono persistente en la esquina inferior derecha `⊞ Copiloto` que abre un panel lateral. También accesible desde el menú lateral.

### Panel del Copiloto (modo lateral)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Contenido de la página actual]              │ ┌─────────────────────┐ │
│                                               │ │ ✦ Copiloto IA  [✕] │ │
│                                               │ │ claude-sonnet-4-6   │ │
│                                               │ ├─────────────────────┤ │
│                                               │ │                     │ │
│                                               │ │ Contexto actual:    │ │
│                                               │ │ Edificio Los Álamos │ │
│                                               │ │ Presupuesto v3      │ │
│                                               │ │                     │ │
│                                               │ │ ─────────────────── │ │
│                                               │ │                     │ │
│                                               │ │  Hola, Andrés.     │ │
│                                               │ │  Veo que estás     │ │
│                                               │ │  trabajando en     │ │
│                                               │ │  Los Álamos.       │ │
│                                               │ │                    │ │
│                                               │ │  El precio del     │ │
│                                               │ │  concreto f'c=210  │ │
│                                               │ │  que usas          │ │
│                                               │ │  (S/ 346.20/m3)   │ │
│                                               │ │  está basado en    │ │
│                                               │ │  precios de Ene    │ │
│                                               │ │  2026. CAPECO      │ │
│                                               │ │  actualizó en      │ │
│                                               │ │  mayo. ¿Actualizo  │ │
│                                               │ │  las 8 partidas    │ │
│                                               │ │  afectadas?        │ │
│                                               │ │                    │ │
│                                               │ │  [Sí, actualizar] │ │
│                                               │ │  [Ver cambios]    │ │
│                                               │ │  [No por ahora]   │ │
│                                               │ │                    │ │
│                                               │ │ ─────────────────── │ │
│                                               │ │                     │ │
│                                               │ │ ┌─────────────────┐ │ │
│                                               │ │ │ Escribe aquí... │ │ │
│                                               │ │ └─────────────────┘ │ │
│                                               │ │ [↑ Enviar]  [⊕]   │ │ │
│                                               │ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Vista Full-Screen del Copiloto

Cuando el usuario navega a "Copiloto IA" desde el menú:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✦ Copiloto IA                                                          │
│  Tu asistente experto en ingeniería civil y presupuestos                │
├─────────────────────────────────────────────┬───────────────────────────┤
│                                             │                            │
│  Conversaciones                             │  Chat                      │
│  ─────────────────────────────────         │  ─────────────────────────  │
│                                             │                            │
│  Hoy                                        │                            │
│  • Precios cemento Los Álamos               │  ┌─────────────────────┐  │
│  • Comparación vs. mercado                  │  │       ✦             │  │
│                                             │  │                     │  │
│  Esta semana                                │  │  Copiloto IA        │  │
│  • Riesgo licitación San Juan               │  │                     │  │
│  • APU excavación Lurín                     │  │  ¿En qué puedo     │  │
│  • Optimización gastos generales            │  │  ayudarte hoy?     │  │
│                                             │  │                     │  │
│  ─────────────────────────────────         │  │  Tengo acceso a     │  │
│                                             │  │  todos tus          │  │
│  Acciones rápidas                           │  │  proyectos y        │  │
│  ─────────────────────────────────         │  │  presupuestos.      │  │
│  ✦ Analizar viabilidad de proyecto         │  └─────────────────────┘  │
│  ✦ Comparar con mercado                    │                            │
│  ✦ Revisar precios desactualizados         │  Sugerencias:              │
│  ✦ Generar memoria de cálculo              │  ────────────────────────  │
│  ✦ Detectar partidas faltantes             │  "¿Cuánto cuesta excavar   │
│  ✦ Optimizar presupuesto                   │  1,000 m3 en Lima hoy?"    │
│                                             │                            │
│  [+ Nueva conversación]                    │  "Compara Los Álamos vs.   │
│                                             │  Lurín en margen"          │
│                                             │                            │
│                                             │  "¿Qué partidas me         │
│                                             │  faltan en PTAR Lurín?"    │
│                                             │                            │
│                                             │  ────────────────────────  │
│                                             │  ┌──────────────────────┐  │
│                                             │  │ Escribe tu pregunta  │  │
│                                             │  │                      │  │
│                                             │  └──────────────────────┘  │
│                                             │  [📎]           [↑ Enviar] │
└─────────────────────────────────────────────┴───────────────────────────┘
```

### Capacidades del Copiloto (con ejemplos de respuesta)

**Consultas de precios:**
> "¿Cuánto cuesta el acero corrugado f'y=4200 en Lima hoy?"
> 
> "El acero corrugado Ø3/8" cotiza a S/ 3.45/kg en Lima según CAPECO Mayo 2026. En tu presupuesto de Los Álamos estás usando S/ 3.20/kg (Ene 2026). Diferencia de 7.8%. ¿Actualizo?"

**Análisis comparativo:**
> "Compara el costo de mano de obra de Los Álamos vs Lurín"
>
> "Los Álamos: S/ 18.40/m3 promedio en MO (19.2% del costo directo). Lurín: S/ 22.80/m3 (25.1%). Lurín tiene mayor proporción de MO porque incluye partidas de instalaciones sanitarias especializadas."

**Detección de partidas faltantes:**
> "¿Qué partidas me podrían faltar en el presupuesto de Lurín?"
>
> "Revisé las 28 partidas de PTAR Lurín. Detecto posibles omisiones:
> • Pruebas hidráulicas de tuberías (usual en PTARs)
> • Desinfección del sistema
> • Placa recordatoria (exigida por OTASS)
> ¿Agrego estas partidas?"

**Acciones ejecutables desde el chat:**
- `[Actualizar precios]` → ejecuta la actualización de precios en el presupuesto
- `[Agregar partidas]` → agrega las partidas sugeridas al presupuesto
- `[Ver diferencias]` → abre comparador de versiones
- `[Exportar resumen]` → genera un PDF del análisis conversacional

### Diseño del Mensaje del Copiloto

```
┌────────────────────────────────────────────────────────────┐
│  ✦  · claude-sonnet-4-6 · hace un momento                │
│                                                             │
│  El costo de mano de obra especializada en PTAR Lurín     │
│  es S/ 22.80/m3, un 24% mayor al promedio de             │
│  instalaciones similares en Lima (S/ 18.40/m3).           │
│                                                             │
│  Esto se debe principalmente a 3 partidas:                │
│  • Instalación de electrobombas (S/ 85/und)               │
│  • Montaje de tableros eléctricos (S/ 420/und)            │
│  • Pruebas y puesta en marcha (S/ 12,000 glb)             │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Costo MO Los Álamos  ████████░░  S/ 18.40/m3     │   │
│  │ Costo MO Lurín       ██████████  S/ 22.80/m3     │   │
│  │ Promedio mercado     ███████░░░  S/ 19.20/m3     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  [Ver detalle partidas]   [Comparar proyectos]            │
└────────────────────────────────────────────────────────────┘
```

El Copiloto puede renderizar **mini-gráficas inline** usando barras de texto, y **botones de acción** que ejecutan operaciones reales en el sistema.

---

## 10. Interacciones Globales y Estados del Sistema

### Command Palette (⌘K)

Accesible desde cualquier pantalla. El power-user tool.

```
┌──────────────────────────────────────────────────────────────────┐
│  🔍 Buscar o ejecutar comando...                            [⌘K] │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PROYECTOS RECIENTES                                             │
│  ▣  Edificio Los Álamos          ir al proyecto                 │
│  ▣  Vía San Martín km 12         ir al proyecto                 │
│                                                                   │
│  ACCIONES                                                        │
│  ✦  Cotizar nueva obra            abrir Cotizador IA            │
│  ☰  Nuevo presupuesto             crear desde cero              │
│  ⊞  Nueva licitación              registrar concurso            │
│  ↓  Exportar presupuesto actual   Excel o PDF                   │
│                                                                   │
│  NAVEGACIÓN                                                      │
│  ∿  Predictor Financiero          ir al módulo                  │
│  ◎  Centro Documental             ir al módulo                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Notificaciones (campanilla)

Panel de notificaciones en el header (icono con badge numérico):

```
┌──────────────────────────────────────────────────────────┐
│  Notificaciones                             [Marcar todo] │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ● Exportación lista                          hace 2m    │
│    Presupuesto_LosAlamos_v3.xlsx está listo              │
│    [Descargar]                                            │
│                                                           │
│  ● Comentario de María García                 hace 1h    │
│    En 01.03.002 Concreto f'c=210: "Revisar..."           │
│    [Ver comentario]                                       │
│                                                           │
│  ⚠ Licitación próxima a vencer               hace 3h    │
│    Presa San Juan vence en 15 días                        │
│    [Ver licitación]                                       │
│                                                           │
│  ✦ Copiloto detectó algo                      ayer       │
│    Precios de cemento actualizados en CAPECO              │
│    [Ver sugerencia]                                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Toast Notifications

Notificaciones transitorias en la esquina inferior derecha:

```
✓  Presupuesto guardado          [Deshacer]    ← emerald, 4 segundos
✦  APU generado · 23 partidas   [Revisar →]   ← violet, 6 segundos
⚠  Precio desactualizado                       ← amber, 5 segundos
✕  Error al exportar            [Reintentar]   ← rose, persiste
```

### Estados de Carga

**Skeleton loading** (nunca spinners aislados):
- Las cards del dashboard muestran rectángulos grises animados (shimmer) mientras cargan
- Las tablas muestran 5 filas skeleton antes de los datos reales
- El APU en el editor muestra filas skeleton antes de renderizar los componentes

**Shimmer animation:**
```css
background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
animation: shimmer 1.5s infinite;
```

### Responsive Behavior

| Breakpoint | Layout |
|---|---|
| > 1280px | Sidebar 240px + contenido full |
| 1024–1280px | Sidebar 64px (colapsado por defecto) + contenido full |
| 768–1024px | Sidebar como drawer + contenido full-width |
| < 768px | Bottom navigation bar (5 íconos) + contenido full-width |

**Bottom navigation mobile (< 768px):**
```
[🏠 Inicio] [✦ Cotizar] [☰ Presupuestos] [⊞ Licitac.] [⋯ Más]
```

---

## 11. Onboarding (Primera experiencia)

### Flujo de 4 pasos (progreso visual en header)

**Paso 1 — Perfil de empresa**
```
┌──────────────────────────────────────────────────────────────┐
│  ① Empresa  ② Región  ③ Moneda  ④ Primer proyecto          │
│  ─────●─────○──────────○──────────○                         │
│                                                               │
│  ¿Cómo se llama tu empresa?                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Constructora...                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Tipo de empresa                                              │
│  ○ Empresa constructora    ○ Consultora de ingeniería        │
│  ○ Estudio de arquitectura ○ Contratista independiente       │
│                                                               │
│                                          [Continuar →]       │
└──────────────────────────────────────────────────────────────┘
```

**Paso 4 — Primer proyecto (puede saltarse)**
```
│  Crea tu primer proyecto ahora                               │
│  o hazlo después — tu decides.                               │
│                                                               │
│  [✦ Crear mi primer presupuesto]   [Explorar la app →]     │
```

"Explorar la app" lleva al dashboard con datos de demo cargados (proyecto de ejemplo real).

---

## 12. Principios de Interacción

1. **Toda acción de IA es reversible.** Siempre hay un `[Deshacer]` o `[Restaurar versión]` disponible.

2. **Los números siempre muestran su origen.** Al hover sobre cualquier monto: tooltip con `Fuente: CAPECO Lima · Ene 2026`.

3. **El autoguardado es silencioso.** Un dot gris parpadeante en el header indica "guardando". Al completar: dot verde durante 2 segundos. Sin popups.

4. **Los estados vacíos tienen siguiente paso.** Nunca hay una pantalla vacía sin un CTA claro y contextual.

5. **El copiloto observa pero no interrumpe.** Las sugerencias aparecen en la barra de Copiloto del dashboard, nunca como modales bloqueantes en medio del trabajo.

6. **La confianza de la IA siempre es visible.** Ningún elemento generado por IA aparece sin su badge `✦` y su score de confianza en hover.

7. **Los datos financieros tienen su propio ritmo.** Al cambiar un parámetro, los números transicionan suavemente (300ms ease-out) — no hacen pop brusco.

---

*Documento preparado por: Diseño de Producto — InfraPilot AI*
*Versión: 1.0 · Fecha: Junio 2026*
*Clasificación: Confidencial — Uso interno*
