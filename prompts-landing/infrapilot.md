# PROMPT — Landing de InfraPilot (evolución, no rediseño)

Vas a trabajar sobre una landing que YA EXISTE y que YA está bien resuelta visualmente.
Tu trabajo NO es rediseñarla: es darle el contenido comercial que hoy no tiene, sin
romper su registro. Lee este brief entero antes de tocar un archivo.

**ARCHIVO REAL:** `C:\Users\Kalel\ORION\infrapilot-app\app\page.tsx`
**OJO DE RUTA:** `C:\Users\Kalel\InfraPilot.v01\infrapilot-app\` está VACÍO (submódulo sin
inicializar, no hay `.gitmodules`). Ahí solo viven documentos de diseño viejos y un backend
NestJS de plantilla sin tocar. Si editas ahí, tu trabajo no existe.

---

## VEREDICTO DE REGISTRO (léelo primero: es la decisión que gobierna todo lo demás)

La regla general del dueño para landings es "cliente afuera = venta": producto protagonista,
color, movimiento, nada de minimalismo. El 2026-08-05 rechazó una landing minimalista de
frutas con estas palabras: *"la landing que haces es una basura... muy minimalista... quiero
que esta landing sea más interactiva, más llamativa, es para vender frutas"*.

**Aquí NO aplica esa corrección, y el motivo es concreto:**

1. Quien mira esta pantalla es un **ingeniero de presupuestos evaluando una herramienta de
   trabajo**, no un comprador de fruta. Va a pasar 6 horas diarias adentro. Lo que necesita
   sentir es *"qué tranquilidad trabajar aquí"* — que es, literalmente, la tesis del
   manifiesto (`C:\Users\Kalel\.claude\skills\estudio-diseno\SKILL.md:9`). En este producto
   **la calma no es una decisión estética: es el argumento de venta**. Una landing ruidosa
   prometería un producto que la app no es, y la primera pantalla del dashboard desmentiría
   la portada.
2. El manifiesto es del propio dueño y su **primera aplicación fue exactamente esta landing**
   (`DEC-010`, commit `3aa86c6` "Landing 'El estudio del ingeniero moderno'";
   `C:\Users\Kalel\ORION\memory\infrapilot\vault\DEC-010.md:17-19`). Rechazarlo aquí sería
   cometer el error simétrico al de la placita.
3. InfraPilot es **producto propio del dueño y marca REAL** — no un cliente externo, no un
   nombre provisional (`app\layout.tsx:19`, `app\manifest.ts:9-11`, wordmark en
   `app\page.tsx:194` y `:396`, remoto `github.com/monuzalejo-sys/InfraPilot.Ai.git`).

**Entonces SE CONSERVA:** paleta, tipografía, composición editorial, piezas-objeto, cápsulas
de herramienta, microinteracciones de 2px/180ms, cero fotos de stock.

**Y LO QUE FALTA NO ES BELLEZA, ES TRABAJO COMERCIAL.** La landing actual tiene tres agujeros
que le cuestan conversiones, y son verificables en el código:

- **(A) No dice qué hace.** Las 410 líneas de `app\page.tsx` no mencionan ni una sola vez las
  cuatro ingenierías, ni APUs, ni topografía, ni Excel, ni IA. Un jefe de presupuestos llega,
  lee "El estudio del ingeniero moderno" / "No es un ERP" (`:207-215`) y se va sin saber si
  la herramienta arma un APU. Ese es el fallo #1.
- **(B) El CTA principal choca contra un muro.** "Entrar al estudio" apunta a `/dashboard`
  (`app\page.tsx:218` y `:389`), que NO es ruta pública (`proxy.ts:8`) y que con Supabase
  configurado redirige a `/login` (`proxy.ts:40-45`). El botón dice "entra" y entrega un
  formulario de contraseña. Además, la landing nunca enlaza `/register`, que sí existe
  (`app\(auth)\register\page.tsx`) y sí es público (`proxy.ts:8`).
- **(C) No hay ni una prueba.** Cero evidencia real; lo único parecido a prueba social en
  todo el repo está INVENTADO (ver Prohibido).

Tu entrega es cerrar A, B y C **en el mismo registro**. Más sustancia, no más ruido.

---

## 1. EL NEGOCIO

InfraPilot (`InfraPilot AI` en metadata) es una **aplicación web de herramientas de cálculo y
presupuestación para ingenierías**, organizada en módulos por profesión. Los cálculos corren
en el navegador con funciones puras (43/43 self-tests PASS, medido 2026-07-28,
`C:\Users\Kalel\ORION\memory\infrapilot\brief.md:45`), la persistencia va a Supabase y dos
funciones usan LLM vía Groq.

Descripción canónica del propio producto: *"Herramientas de ingeniería con IA: presupuestos,
topografía, informática y eléctrica."* (`app\manifest.ts:11-12`).

**Oferta real, disciplina por disciplina — todo sale de `lib\disciplines.ts:34-94`:**

| Disciplina | Descripción literal del registro | Módulos reales |
|---|---|---|
| **Construcción** (`:44-61`) | "Presupuestos de obra con IA: cotización, APUs, precios con comparativa de proveedores, licitaciones y proyección financiera." | Cotizador IA, Presupuestos, Base de Precios, APUs, Proveedores, Lector de datos (IA), Licitaciones (IA), Predictor Financiero |
| **Topografía** (`:62-71`) | "Cálculo de campo: cubicación corte/relleno, nivelación cerrada y poligonal compensada." | Topografía (implementado en `lib\topo\cubicacion.ts`, `nivelacion.ts`, `poligonal.ts`, `csv.ts`, `to-partidas.ts`) |
| **Informática** (`:72-82`) | "Estimación de proyectos de software (fases, roles, puntos de función) y costos de infraestructura cloud." | Ing. Informática (`lib\informatica\estimacion.ts`, `cloud.ts`, `to-presupuesto.ts`) |
| **Eléctrica** (`:83-93`) | "Circuitos ramales (corriente, caída de tensión, calibre y protección) y dimensionado de tableros con balanceo de fases." | Ing. Eléctrica (`lib\electrica\circuitos.ts`, `tableros.ts`) |

**Dónde opera:** el producto se declara para Latinoamérica en sus propios prompts de IA
("experto en presupuestación de obras civiles en Latinoamérica",
`lib\cotizar-prompt.ts:88`), con variantes para acueducto/alcantarillado en Colombia (`:116`)
y vías LatAm (`:171`). Tipos de obra soportados: `edificacion | acueducto | vias`
(`lib\cotizar-prompt.ts:201`). **País y moneda de operación comercial: HUECO #7** — las
señales del repo se contradicen y todas vienen de datos demo.

**Precio: NO EXISTE.** Cero menciones de tarifa, plan o suscripción en todo el repo. El único
`plan: "professional"` es un campo de datos falsos (`lib\mock-data.ts:21`). **HUECO #3.**

---

## 2. QUIÉN MIRA Y QUÉ DEBE HACER

**Audiencia concreta:** ingeniero civil o jefe de presupuestos de una constructora pequeña o
mediana en LatAm; también el ingeniero independiente que cotiza solo. Hoy trabaja en Excel a
mano, con APUs heredados y precios que no sabe si están vigentes. Entra desde el escritorio
de la oficina, pero también desde el móvil en obra.

**Qué debe sentir, en este orden:**
1. *"Esto lo hizo alguien que sabe cómo se arma un presupuesto."* (credibilidad de oficio)
2. *"Sirve para lo mío."* (reconoce su disciplina y sus herramientas por nombre)
3. *"Qué tranquilidad trabajar aquí."* (la promesa del manifiesto, ya cumplida por el diseño)

**UNA SOLA ACCIÓN PRINCIPAL: crear cuenta → `/register`.**

- El mismo botón-herramienta, con el mismo texto, repetido máximo 3 veces (hero, cierre y
  opcionalmente tras el bloque de disciplinas). Nunca dos destinos distintos compitiendo.
- **Cambia el destino de `/dashboard` a `/register`** en `app\page.tsx:218` y `:389`.
  `/register` es ruta pública (`proxy.ts:8`); `/dashboard` no lo es y rebota a `/login`.
- "Ingresar" (`/login`) se queda EXACTAMENTE donde está hoy: mono, 11px, en la cabecera
  (`:195-200`) y en el pie (`:398-403`). Eso es navegación para quien ya tiene cuenta, no un
  segundo CTA. No lo agrandes, no lo conviertas en botón.
- Texto sugerido del botón, en el lenguaje de la cápsula-herramienta que ya existe
  (`◉ ` + label, `app\page.tsx:96-108`): `◉ Crear mi cuenta`. **No escribas "gratis", "prueba
  gratis" ni "sin tarjeta"**: nada en el repo respalda un modelo de precios (HUECO #3).
- **Riesgo que debes reportar, no tapar:** los flujos autenticados NUNCA se probaron de punta
  a punta (`brief.md:46` — "authenticated flows were never clicked through"), y las variables
  de entorno están vacías en local (`.env.local`). Antes de mandar tráfico a `/register`, el
  dueño tiene que confirmar HUECO #2.

---

## 3. EVIDENCIA REAL (lo único demostrable hoy)

Solo puedes usar esto. No hay más.

1. **Cuatro ingenierías operativas con 12 módulos**, verificables en `lib\disciplines.ts:34-94`.
2. **Excel con FÓRMULAS EDITABLES, no valores muertos** — `crearLibroConFormulas()`,
   `lib\excel-export.ts:449`. Es el diferenciador más fuerte y hoy la landing no lo menciona:
   el presupuesto que descarga el ingeniero sigue siendo suyo, lo abre en Excel y las celdas
   siguen calculando. Dilo así, en lenguaje de oficio.
3. **El cálculo corre en tu navegador** (funciones puras + self-tests), la IA solo interviene
   en cotizador y lector (`app\(dashboard)\dashboard\page.tsx:26`). Para un ingeniero
   desconfiado de la IA, esto es tranquilizador: la aritmética no la inventa un modelo.
4. **Se instala como app (PWA)** — `app\manifest.ts`, `public\sw.js`, ambos públicos
   (`proxy.ts:8`).
5. **Los tres pasos honestos**, ya redactados por el propio producto y aprobados en el
   dashboard (`app\(dashboard)\dashboard\page.tsx:15-34`) — reutilízalos casi literales:
   - `01 Elige tu módulo` — "Entra por tu ingeniería. Cada módulo agrupa las herramientas de
     su oficio en un solo lugar."
   - `02 Calcula` — "Cotiza, arma APUs, cubica o estima. Los cálculos corren en tu navegador;
     el cotizador y el lector se apoyan en IA."
   - `03 Exporta y guarda` — "Descarga a Excel con las fórmulas editables o guarda el trabajo
     en tu cuenta."
6. **Hoja de ruta declarada** (`app\(dashboard)\dashboard\page.tsx:37`): "Estructural ·
   Hidráulica · Mecánica" y "Cuentas de equipo por empresa" — como *en camino*, nunca como
   disponible.

**Lo que NO tienes y no vas a fabricar:** ni un cliente, ni un testimonio, ni un número de
usuarios, ni una obra real, ni un benchmark de tiempo. Ver §8 y §9.

---

## 4. ESTRUCTURA SECCIÓN POR SECCIÓN

Orden final: **HERO → LA MESA (existente) → QUÉ ENCUENTRAS AQUÍ (nuevo) → CÓMO FUNCIONA
(nuevo) → LO QUE TE LLEVAS (nuevo) → HOJA DE RUTA (nuevo, corto) → CIERRE → PIE**.

### 4.1 HERO — se conserva casi intacto
`app\page.tsx:181-233`. Titular "El estudio / del ingeniero / moderno." y bajada "No es un
ERP. Es el lugar donde nacen los proyectos." Se quedan tal cual: son del manifiesto
(`SKILL.md:8`) y son buenos.
**Único cambio obligatorio:** añade UNA línea mono bajo la bajada que diga qué es, porque hoy
la portada no lo dice. Contenido exacto, tomado de `manifest.ts:11-12`:
`PRESUPUESTOS · TOPOGRAFÍA · INFORMÁTICA · ELÉCTRICA`
en `font-mono`, 11px, `uppercase`, `tracking-[0.2em]`, color `--muted` — el mismo estilo que
ya usan las etiquetas de sección (`:240-242`). Nada más. El hero no se recarga.
Y cambia el destino del botón a `/register` (§2).

### 4.2 LA MESA DE TRABAJO — se conserva, con una corrección de honestidad
`app\page.tsx:235-381`. Las tres piezas (hoja técnica, plano, libreta de IA) son lo mejor de
la landing y demuestran el producto sin capturas. **Se quedan.**
**Corrección obligatoria:** "Casa Campestre — Popayán" con total `87.950.000`
(`:88-93`, `:268-301`) es una MAQUETA ILUSTRATIVA, no un proyecto real. Hoy se presenta sin
matiz y un comprador puede leerla como caso de cliente. Añade en la hoja técnica, en mono
11px `--muted`, junto al folio (`:263`): `Ejemplo ilustrativo`. Una palabra honesta cuesta
menos que un reclamo.

### 4.3 QUÉ ENCUENTRAS AQUÍ — **la sección nueva más importante** (cierra el agujero A)
Propósito de venta: responder *"¿sirve para lo mío?"* en menos de cinco segundos.
Metáfora física: **el archivador con pestañas** — es del manifiesto (`SKILL.md:49`) y todavía
no se ha usado en esta landing.

- Cuatro pestañas: **Construcción · Topografía · Informática · Eléctrica**.
- Al elegir una, la pieza de abajo muestra la descripción literal de esa disciplina y la
  lista de sus módulos.
- **Los datos NO se escriben a mano.** Importa el registro y renderiza desde ahí:
  `import { getModulosProfesion } from "@/lib/disciplines"` — la función ya excluye la
  entrada de navegación `inicio` (`lib\disciplines.ts:97-99`). Así la landing no puede mentir
  nunca: si mañana se agrega una ingeniería, aparece sola.
- **El módulo `disabled` NO se lista como disponible.** `Copiloto IA` tiene `disabled: true`
  (`lib\disciplines.ts:57`). O lo filtras, o lo muestras con la marca `En camino` y opacidad
  reducida, igual que hace el dashboard (`app\(dashboard)\dashboard\page.tsx:149-155`).
  Nunca en la misma lista visual que los activos.
- Iconos: los que ya trae cada módulo en el registro (`lucide-react`, trazo fino, tamaño
  contenido, `SKILL.md:61-64`). Los módulos con `isAi: true` (Cotizador, Lector, Licitaciones)
  llevan una marca discreta, nunca un badge de color.
- Sin cuadrícula de 12 tarjetas iguales: una pieza protagonista con la lista adentro, en el
  lenguaje de las piezas actuales (`.pieza`, borde `--border`, radio 2px, sombra `--sombra`).

### 4.4 CÓMO FUNCIONA — 01/02/03
Propósito: quitar el miedo a "otra herramienta que hay que aprender".
Los tres pasos de §3.5, verbatim del dashboard. Composición editorial, numeración mono, línea
divisoria de 1px `--border` entre pasos — el mismo patrón que ya existe en
`app\(dashboard)\dashboard\page.tsx:77-97`. No inventes un cuarto paso.

### 4.5 LO QUE TE LLEVAS — la prueba del Excel (cierra parte del agujero C)
Propósito: el diferenciador defendible. Una pieza sola, corta.
Titular sugerido, en el tono del manifiesto: **"El presupuesto sigue siendo tuyo."**
Cuerpo: baja a Excel con las fórmulas vivas, no con números pegados; lo abres, cambias una
cantidad y el total se recalcula. Origen: `lib\excel-export.ts:449` y el paso 03 del dashboard.
Si quieres ilustrarlo, dibújalo en SVG a mano como ya se hace con la planta
(`app\page.tsx:111-171`) — una celda con `=D8*E8` visible. **Nada de capturas inventadas.**

### 4.6 HOJA DE RUTA — cuatro líneas, no más
Propósito: al comprador B2B le importa si el producto está vivo.
"Hoy cuatro ingenierías. Vienen Estructural · Hidráulica · Mecánica y cuentas de equipo por
empresa." (`app\(dashboard)\dashboard\page.tsx:37`). Marcadas como *En camino*, sin fecha —
no hay fecha comprometida en ninguna fuente.

### 4.7 CIERRE — se conserva
`app\page.tsx:384-391`. "Un lugar tranquilo para trabajar en serio." + botón. Solo cambia el
destino a `/register`.

### 4.8 PIE — se amplía solo si el dueño llena huecos
Hoy: wordmark + Ingresar + © 2026 (`:394-407`). **Añade únicamente lo que el dueño entregue**
(contacto — HUECO #4; legales — HUECO #10). Si no entrega nada, el pie se queda igual: mejor
escueto que con enlaces muertos. Nota: `/login` ya enlaza "Términos" y "Política de
privacidad" como texto sin destino (`app\(auth)\login\page.tsx:208-211`); no repitas ese
error en la landing.

---

## 5. REGISTRO VISUAL Y PALETA

**Conserva el bloque de tokens SCOPED que ya está en `app\page.tsx:7-85`. No lo toques, no lo
muevas a `globals.css`.**

Motivo verificado (`KN-029`, `C:\Users\Kalel\ORION\memory\infrapilot\vault\KN-029.md:15`): la
app tiene tokens propios que han derivado del manifiesto — `globals.css` usa
`--paper #f6f3ed`, `--ink #1b1a17`, `--rail #232019`, `--brass #a8895b`. La landing usa los
del manifiesto puro. **Si eliminas el scope, la landing hereda la paleta de la app y pierde
su blanco cálido.** El scope es intencional (comentario en `app\page.tsx:5-6`).

Paleta de la landing (ya presente en `app\page.tsx:9-18`, idéntica a `SKILL.md:19-28`):
```
--bg #F8F6F2   --card #FCFBF8   --sidebar #171717   --ink #111111
--muted #666666   --border #E7E4DE   --hover #F2EFE9
--ok #4D7C59   --warn #B98A3C   --error #B94A48
```
Los colores funcionales aparecen SOLO donde comunican estado (hoy: el punto verde `--ok` de
"En obra", `:330`; el subrayado ocre `--warn` de la nota a lápiz, `:70-75`). Ni uno más.

**Tipografía:** Inter (`--font-inter`) para texto, JetBrains Mono (`--font-mono`) para
etiquetas, folios y cifras — ambas ya cargadas en `app\layout.tsx:6-16`. Titulares
`font-light`, `clamp()` responsivo, `tracking` levemente negativo, mucho aire. Las cifras
siempre `tabular-nums` (patrón ya usado en `:286` y `:299`). No agregues fuentes.

**Densidad:** una pantalla dice pocas cosas bien dichas (`SKILL.md:40`). Mantén el ritmo
actual de aire: `py-24 sm:py-32 lg:py-40` entre secciones, ancho máximo `74rem`. Las tres
secciones nuevas NO deben duplicar el largo de la página: apunta a que la landing completa
quepa en unos 5-6 scrolls de móvil.

---

## 6. INTERACCIÓN

Se conserva todo lo que ya hay: piezas que se elevan 2px con sombra más larga a 180ms
(`app\page.tsx:33-45`), rotación mínima de papeles solo en ≥768px (`:49-53`), la flecha que
avanza 2px (`:65-66`), y el bloque `prefers-reduced-motion` (`:77-84`) — que **debe cubrir
también todo lo que agregues**.

Tres interacciones nuevas. Cada una tiene que ganarse el sitio:

1. **Pestañas de disciplina (§4.3).** *Por qué vende:* es la objeción número uno —
   "¿sirve para lo mío?" — resuelta en un clic, con la lista real de módulos. Es la única
   interacción imprescindible. Transición de contenido: fade 180ms, sin deslizamientos ni
   alturas que salten (reserva `min-height` para que la página no baile al cambiar de
   pestaña). Accesible por teclado (`role="tablist"`, flechas, foco visible).
2. **La nota de la IA aparece al entrar en pantalla.** *Por qué vende:* reproduce el
   comportamiento real del producto — la IA como compañero silencioso que "aparece sin
   interrumpir" (`SKILL.md:79-86`). Fade + 4px de subida, 180ms, una sola vez, con
   `IntersectionObserver`. Si el usuario pidió menos movimiento, aparece ya visible.
3. **Revelar la fórmula en la hoja técnica.** *Por qué vende:* hace visible el diferenciador
   del Excel. Al pasar el cursor (o tocar, en móvil) sobre una partida, se muestra en mono y
   `--muted` la operación detrás del monto. Sin popovers flotantes: se despliega en la propia
   línea, dentro del papel.

**Prohibido en interacción:** parallax, contadores que suben solos, marquesinas, partículas,
cursores personalizados, autoplay de video, rebotes, giros, brillos, cualquier cosa que
rebote o llame la atención sin función (`SKILL.md:74-77` y `:88-92`).

---

## 7. RESTRICCIONES TÉCNICAS REALES

Verificadas en `C:\Users\Kalel\ORION\infrapilot-app\package.json`:

- **Next.js 16.2.7 (App Router) · React 19.2.4 · TypeScript 5 · Tailwind 4.**
- Disponibles y ya instaladas: `lucide-react ^1.17.0`, Radix UI (avatar, dialog,
  dropdown-menu, progress, select, separator, tabs, tooltip, slot), `recharts ^3.8.1`,
  `xlsx ^0.18.5`, `@supabase/ssr`, `@supabase/supabase-js`, `groq-sdk`, `clsx`,
  `tailwind-merge`, `class-variance-authority`.
- **CERO dependencias nuevas.** No instales nada: `npm install` desde URL externa está
  bloqueado por política y `xlsx` tiene vulnerabilidades pendientes de un upgrade manual
  (`brief.md:11`, `brief.md:36`).
- **NO es un HTML suelto.** La landing es una página del app Next: `app\page.tsx`, Server
  Component con su `<style>` scoped, cuyas únicas importaciones hoy son `next/link` y
  `lucide-react`.
- **Para la interactividad:** extrae los trozos que necesiten estado a
  `components\landing\*.tsx` con `"use client"` arriba, y mantén `app\page.tsx` como Server
  Component (así el HTML de venta sigue llegando al primer byte y a los buscadores). La
  lectura de `lib\disciplines.ts` se hace en el servidor y se pasa por props serializables —
  ojo: `icon` es un componente, no cruza el límite servidor→cliente como dato; renderízalo en
  el servidor o mapea por `href` en el cliente.
- **Next 16 tiene breaking changes:** consulta `node_modules\next\dist\docs\` antes de usar
  una API que no esté ya en el repo (`brief.md:6`).
- **No toques `app\globals.css`** (ver §5) ni `proxy.ts` ni `lib\disciplines.ts`.
- **Dónde corre:** desplegado en Vercel según reporte del dueño, pero **sin URL guardada en
  el repo** (HUECO #1) y con las tres variables de entorno vacías en local (`.env.local`).
  Sin Supabase configurado, `proxy.ts:13-14` deja pasar todo el tráfico sin auth y la UI cae a
  datos falsos con el aviso "Modo demo — sin conexión a base de datos"
  (`components\demo-notice.tsx:21`). La landing no depende de eso, pero `/register` sí.
- **Git:** los push por CLI fallan en esta máquina (no hay `/dev/tty`); se pushea con GitHub
  Desktop (`brief.md:7`). Hay 7 commits del submódulo sin subir (PEND-004). No intentes
  `git push`.

---

## 8. PROHIBIDO EN ESTE PROYECTO

**Datos falsos que YA VIVEN en el repo y que NO puedes reciclar en la landing:**
- ❌ **"Carlos Quispe · Jefe de Presupuestos · Lima, Perú"** y su testimonio *"Lo que antes me
  tomaba 3 días, ahora lo tengo en 4 minutos"* (`app\(auth)\login\page.tsx:97-105`) — es un
  testimonio INVENTADO. No hay tal persona. No lo copies, no lo adaptes, no lo "inspires".
- ❌ **"Andrés Mendoza" / "Constructora ABC"** (`lib\mock-data.ts:10-24`) — usuario y empresa
  de demo.
- ❌ **"Edificio Torre Azul", Miraflores, inversión 15.932.621 PEN**
  (`lib\financial-model.ts:1-22`) — proyecto demo del predictor.
- ❌ **"Presupuestos completos en menos de 5 minutos"** (`login\page.tsx:13`) — no existe
  ninguna medición que lo respalde.
- ❌ **"APUs con precios CAPECO actualizados"** (`login\page.tsx:14`) — NO hay integración ni
  dataset CAPECO en el repo; lo único que existe es una cadena de texto en el pie de una hoja
  de Excel (`lib\excel-export.ts:276`). Afirmarlo es prometer una fuente de datos inexistente.
- ❌ **"Exportación Excel y PDF"** (`login\page.tsx:16`) — solo hay exportación a Excel.
  **No menciones PDF.**
- ❌ **"Análisis de riesgos automático por IA"** (`login\page.tsx:15`) — no verificado.
- ❌ **Copiloto IA como función disponible** — está `disabled: true` (`lib\disciplines.ts:57`).
- ❌ **Cuentas de equipo / organizaciones como función disponible** — el código existe pero la
  migración `003_organizations.sql` NUNCA SE HA EJECUTADO y `/organizaciones` y `/perfil`
  degradan a 503 (`RSK-001`, `brief.md:9` y `:51`). Va en "en camino", jamás en la lista de lo
  que hay hoy.
- ⚠️ **Proveedores / comparativa de precios**: el módulo está en el registro y en el código,
  pero su migración `002_suppliers_quotes.sql` está pendiente de aplicar (`PEND-015`,
  `brief.md:37`). Puedes nombrarlo como módulo (sale del registro), pero **no construyas una
  promesa comercial encima de él** hasta que el dueño confirme que la migración corrió.

**Prohibiciones generales:**
- ❌ Cifras sociales de cualquier tipo: años de experiencia, número de usuarios, obras
  presupuestadas, "+X constructoras confían", premios, logos de clientes.
- ❌ Fotos de stock: ingenieros con casco sonriendo, apretones de manos, rascacielos
  genéricos. Si algún día hay fotografía, será obra real, concreto, acero, madera, planos, luz
  cálida (`SKILL.md:70-72`).
- ❌ Azules eléctricos, morados, neones, gradientes tecnológicos, 15 colores, botones
  brillantes, iconos gigantes, cajas por todas partes, la IA como chatbot protagonista, nada
  que parezca plantilla (`SKILL.md:88-92`).
- ❌ Precios, planes, descuentos o "gratis" mientras el HUECO #3 siga abierto.
- ❌ Rediseñar el hero, cambiar el titular, cambiar la paleta o "modernizar" la tipografía.
- ❌ Crear un archivo HTML aparte o una landing paralela.

---

## 9. HUECOS DEL DUEÑO

Nada de esto existe en el repo. Cada uno se queda como hueco visible hasta que el dueño lo
llene; ninguno se rellena con algo verosímil.

1. **URL pública / dominio.** El despliegue en Vercel está reportado pero no hay dominio
   guardado en ningún archivo ni en memoria. *Se necesita para:* metadata canónica, Open
   Graph y para verificar la landing en producción.
2. **¿Están las 3 variables en Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`,
   `GROQ_API_KEY`)?** En local están vacías. *Se necesita para:* saber si el CTA "Crear mi
   cuenta" realmente crea una cuenta o cae en modo demo. **Es el hueco que decide si la
   landing convierte o desperdicia el tráfico.**
3. **Precio y modelo de negocio.** Elegir uno: precio público mensual, "en beta gratuita" con
   fecha, o "solicitar acceso" con lista de espera. *Se necesita para:* sin esto la landing
   informa pero no cierra, y el visitante que sí está interesado se va sin saber cuánto vale.
4. **Canal de contacto** (WhatsApp de negocio, email o formulario). No hay ninguno en el
   repo. *Se necesita para:* el ingeniero que duda necesita preguntar; en Colombia eso pasa
   por WhatsApp.
5. **Una prueba real, aunque sea una sola.** Un usuario o una obra presupuestada con la
   herramienta, con nombre, cargo, ciudad y permiso explícito para publicarlo. *Se necesita
   para:* hoy la landing no tiene ni una prueba, y la única que existe en el repo es falsa.
6. **Una medición de tiempo real** (obra X, N partidas, T minutos desde la descripción hasta
   el Excel). *Se necesita para:* poder decir "en minutos" sin mentir. Sin el dato, la landing
   no habla de tiempo.
7. **País, moneda y razón social de operación.** Las señales del repo se contradicen y todas
   son demo: Popayán-Colombia en la landing, Lima-Perú en el predictor y el login. *Se
   necesita para:* el pie, la moneda de los ejemplos y la coherencia del discurso LatAm.
8. **Logotipo propio.** Solo existen `public\icon-192.png` e `icon-512.png`; el resto de
   `public\` son los SVG de plantilla de `create-next-app`. *Se necesita para:* wordmark,
   favicon e imagen de compartir. Mientras tanto la landing usa el wordmark tipográfico actual.
9. **¿Capturas reales del producto, o seguimos con SVG dibujados a mano?** Hoy no hay ni una
   captura en el repo. *Se necesita para:* decidir si la sección de disciplinas muestra
   interfaz real. Recomendación: seguir con SVG (envejecen mejor y no filtran datos), pero es
   decisión del dueño.
10. **Términos y política de privacidad.** No existen, y la app guarda datos de usuarios en
    Supabase. *Se necesita para:* el registro puede requerirlos legalmente, y `/login` ya los
    enlaza como texto muerto.
11. **Nombre a mostrar: "InfraPilot" o "InfraPilot AI".** Hoy conviven: `layout.tsx:19` y
    `manifest.ts:9` dicen "InfraPilot AI"; el wordmark de la landing dice "InfraPilot".
    *Default si no responde:* wordmark "InfraPilot" en la landing, "InfraPilot AI" solo en el
    `<title>`. No es bloqueante.

---

## 10. CRITERIOS DE ACEPTACIÓN

Verificables, no opinables. Si uno falla, la entrega no está lista.

**Contenido y honestidad**
1. `grep -riE "Carlos Quispe|Andrés Mendoza|Constructora ABC|Torre Azul|CAPECO|PDF|5 minutos|4 minutos"` sobre `app/page.tsx` y `components/landing/` devuelve **0 resultados**.
2. `grep -riE "más de [0-9]|\+[0-9]+ (clientes|empresas|constructoras|usuarios)|años de experiencia"` devuelve **0 resultados**.
3. La lista de disciplinas y módulos se renderiza a partir de `getModulosProfesion()` importada de `@/lib/disciplines` — comprobable porque el import existe y **ningún label de módulo aparece escrito como literal** en el JSX de la landing.
4. `Copiloto IA` no aparece en la lista de módulos disponibles; si aparece, es con marca "En camino" y opacidad reducida. Comprobación: cambiar `disabled: true` a `false` en una copia local altera lo que se ve.
5. Ni "organizaciones" ni "cuentas de equipo" figuran como función disponible; solo en hoja de ruta.
6. La hoja técnica lleva visible la marca `Ejemplo ilustrativo`.
7. Aparece explícitamente el diferenciador del Excel con fórmulas editables.

**Funcionamiento**
8. `npm run build` termina en **exit 0**; `tsc` limpio; `eslint` con **0 errores** (línea base medida 2026-07-28: 38 rutas, `brief.md:45`). El número de rutas no debe bajar.
9. El CTA principal apunta a `/register`. Ningún CTA apunta a `/dashboard` (que rebota a `/login` por `proxy.ts:40-45`). Comprobable con `grep -n 'href="/' app/page.tsx`.
10. `app/page.tsx` sigue siendo Server Component: **no** contiene `"use client"` en su primera línea.
11. `package.json` no cambió (`git diff --stat package.json` vacío).
12. `app/globals.css` no cambió.

**Verdad de terreno visual — Edge headless a PNG, no el navegador embebido**
13. Con `npm run dev` levantado, capturar y **abrir los PNG**:
    ```
    msedge --headless --disable-gpu --hide-scrollbars \
      --window-size=390,3000 --screenshot="shot-movil.png" "http://localhost:3000/"
    msedge --headless --disable-gpu --hide-scrollbars \
      --window-size=1440,3000 --screenshot="shot-desktop.png" "http://localhost:3000/"
    ```
14. A 390px y a 375px: **sin scroll horizontal**, ningún texto cortado, ninguna cifra
    partida, ninguna pieza rotada que desborde (las rotaciones solo entran en ≥768px por
    diseño, `app\page.tsx:49-53` — no lo rompas).
15. En las capturas, el fondo es `#F8F6F2` (blanco cálido), no `#f6f3ed` (el de la app) ni
    blanco puro: prueba de que el scope de tokens sigue intacto.
16. No hay ni un píxel azul, morado o neón. No hay gradientes de color (el único degradado
    permitido es el blanco→transparente de la luz del hero, `app\page.tsx:184-191`).

**Interacción**
17. Con las pestañas: cambiar de disciplina no altera la altura de la sección (la página no
    salta). Verificable capturando con cada pestaña activa y comparando el alto total.
18. Navegación por teclado: Tab llega a las pestañas y al CTA, con foco visible; flechas
    cambian de pestaña.
19. Con `prefers-reduced-motion: reduce` activo, ninguna de las tres interacciones nuevas
    anima; la nota de la IA se ve desde el inicio. Verificable con
    `msedge --headless --force-prefers-reduced-motion` o emulación en DevTools.
20. Con JavaScript deshabilitado, el contenido de las cuatro disciplinas sigue siendo legible
    (aunque sea todo a la vez): el HTML de venta no puede depender del cliente.
