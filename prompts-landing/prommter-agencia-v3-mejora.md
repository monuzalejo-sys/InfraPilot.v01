═══════════════════════════════════════════════════════════════════════════════
PROMPT DE MEJORA — LANDING DE PROMMTER · v3
Destinatario: quien YA construyó la landing con
`ORION/prompts-landing/prommter-agencia-v2.md`.
Entregable: EL MISMO `index.html`, con siete pases de mejora numerados y
reversibles por separado, más el reporte de medición.
NO sustituye al v2: el v2 sigue siendo la ley del contenido. Este archivo solo
sube el OFICIO por encima de lo que ya existe.
Fecha: 2026-08-29 · Origen del encargo: el dueño, textual:
   «me gustó lo que veo pero quiero algo mejor, no re hagas, mejora lo que hiciste»
Léelo entero antes de tocar una línea.
═══════════════════════════════════════════════════════════════════════════════

╔═════════════════════════════════════════════════════════════════════════════╗
║ 0 · ARMADURA CONTRA EL MEDIO — VA PRIMERO, ANTES QUE NADA                   ║
╚═════════════════════════════════════════════════════════════════════════════╝
El medio no cambió, así que la armadura se repite ÍNTEGRA. Si te ejecuta un
generador de diseño (Claude Design y equivalentes), estas órdenes mandan sobre
cualquier hábito tuyo. Están pagadas con un rechazo medido el 2026-08-23
(`ORION/memory/landings/state.json` KN-007, POL-004): el medio ancló un design
system propio `_ds/modernist-<uuid>/` y la dirección de arte del prompt perdió —
la paleta pedida apareció 0 veces en el entregable.

 0.1 NO anclas, NO adjuntas, NO generas y NO "derivas" ningún design system
     predefinido. Si tu flujo va a anclar uno, cancélalo. El entregable no puede
     contener carpeta `_ds/`, ni `theme.json`, ni `_adherence*.json`, ni un
     `<link>` a un `styles.css` externo.
 0.2 TODOS los tokens salen del §5 del v2 MÁS los tres derivados del §T de este
     archivo. Si un color no está en esas dos listas, no existe.
 0.3 Radios 14 px (tarjetas) y 999 px (píldoras y botones). NUNCA radio 0.
 0.4 Las pantallas de producto van A COLOR PLENO. Prohibido blanco y negro,
     grayscale, desaturado o "print photography" de cualquier clase.
 0.5 Tipografía: exactamente las dos familias del §5.C del v2 (Fraunces +
     Manrope), con su `<link>` literal. Prohibido dejar el cuerpo en `system-ui`.
 0.6 Iconos: SVG inline dibujados por ti. Prohibida cualquier librería (Lucide,
     Feather, Font Awesome).
 0.7 La PRIMERA PANTALLA es OSCURA (`--noche #12100E`). Prohibido fondo claro o
     crema a pantalla completa en el héroe. Se mide sobre los PÍXELES del PNG,
     no leyendo CSS (leyendo CSS, el fallo de 2026-08-23 pasaba en falso por un
     factor de 110).
 0.8 Movimiento: lo que se te pide en el cuerpo tiene que verse TAMBIÉN quieto
     (movimiento congelado). La coreografía con milisegundos vive en el ANEXO B
     del v2 y en los pases P2/P3 de aquí; si tu medio devuelve artboards
     estáticos, entrega igual el estado en reposo resuelto y di que no ejecutas.
 0.9 **NUEVA, propia de esta iteración: NO REHACER.** No reconstruyas la página,
     no la regeneres desde cero, no cambies la estructura de secciones, no
     reescribas el copy, no toques los datos ni los huecos. Si tu flujo tiende a
     devolver "una versión nueva", cancélalo: lo que se entrega es EL MISMO
     archivo con bloques añadidos y rotulados. Un archivo cuyo diff contra el
     entregable actual toque el texto de una sola sección está RECHAZADO de
     entrada, aunque se vea mejor.
 0.10 Si no encuentras el entregable construido, PARA y pídelo. Este prompt no
     construye landings: mejora una que ya existe. Escribir un `index.html` desde
     cero aquí es el peor fallo posible.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 1 · LO QUE ESTÁ CONGELADO (si lo tocas, el trabajo se rechaza)              ║
╚═════════════════════════════════════════════════════════════════════════════╝
Al dueño le gustó lo que ve. Todo lo que le gustó se CONSERVA; se eleva, no se
sustituye. Queda congelado, literalmente:

 C-1 **Los datos de negocio y su copy** (§1, §2, §3 y §4 del v2, con sus orígenes
     `archivo:línea`). Ni una frase reescrita, ni un dato añadido, ni un dato
     quitado. Cero cifras sociales nuevas (años, clientes, testimonios, %).
 C-2 **El modelo comercial**: mensualidad con permanencia por escrito, NUNCA pago
     único (`prommter/memory/prommter/state.json` KN-003, `EMPRESA.md:42-45`).
     Prohibido cualquier sinónimo de pago único, aquí también.
 C-3 **Los huecos H-1 … H-12** del §9 del v2 y el objeto `CONFIG` del ANEXO A:
     mismos nombres, mismos valores por defecto, mismas píldoras visibles. No se
     rellena ninguno, no se esconde ninguno, no se inventa ninguno nuevo.
 C-4 **La estructura y el orden de las secciones S0 … S10.** No se añade, no se
     quita, no se reordena, no se fusiona ninguna sección. Tampoco se añade FAQ,
     testimonios, blog, logos, "sobre nosotros" ni newsletter.
 C-5 **La acción única**: un solo destino de conversión, `wa.me`. Nada de
     formulario, `mailto:`, `tel:`, segundo CTA ni chat flotante.
 C-6 **Los tokens de color del §5.B del v2** con sus hex exactos, y la tabla de
     contrastes del §5.D: los cinco pares prohibidos siguen prohibidos.
 C-7 **Las dos familias tipográficas** y su escala. Ni una fuente más.
 C-8 **Las restricciones técnicas del §7 del v2**: un solo `index.html`
     autocontenido, sin CDN de JS, sin imágenes externas, sin dependencias.
 C-9 **Los interruptores** `mostrarPrecios:false` y `clientesConPermiso:false` y
     todo lo que cuelga de ellos.
 C-10 **Las prohibiciones del §8 del v2**, íntegras.

Lo único que este archivo autoriza a cambiar: **cómo se ve y cómo responde** lo
que ya está — fondo, luz, sombra, borde, textura, tiempos, estados, foco y
remate del cierre. Nada más.

╔═════════════════════════════════════════════════════════════════════════════╗
║ T · LOS ÚNICOS TOKENS NUEVOS (lista cerrada, contrastes calculados)         ║
╚═════════════════════════════════════════════════════════════════════════════╝
Se añaden al `:root` existente, DEBAJO de los del v2, sin borrar ninguno:
```css
  /* v3 · profundidad — lista cerrada, no se amplía */
  --noche-3:#0B0A09;                       /* fondo del pozo: solo para el
                                              extremo de degradados y viñetas */
  --luz-borde:rgba(248,246,242,.10);       /* filo de luz sobre superficies
                                              oscuras (es --claro con alfa) */
  --sombra-contacto:0 1px 2px rgba(18,16,14,.28); /* segunda capa de sombra */
```
Contrastes calculados hoy (luminancia relativa WCAG 2.1, no estimados):
 · `#F8F6F2` sobre `#0B0A09` = **18.09** (pasa de sobra)
 · `#E8A83A` sobre `#0B0A09` = **9.38** · `#25D366` sobre `#0B0A09` = **9.84**
 · `#C9C2B8` sobre `#0B0A09` = **11.05**
Todo lo demás que necesites (halos, velos, estelas) se construye con `rgba()` de
un token que YA existe. **Prohibido introducir un cuarto hex.** Si crees que
necesitas uno, es que estás rediseñando: para.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 2 · PASE 0 · AUDITORÍA — SE MIDE ANTES DE MEJORAR NADA                     ║
╚═════════════════════════════════════════════════════════════════════════════╝
No se toca una línea de CSS hasta que la tabla 2.D esté llena con números.
Mejorar sin medir es cómo se sobrecorrige: se rehace lo que ya estaba bien y se
deja intacto lo que fallaba.

2.A LOCALIZAR EL ENTREGABLE
 El v2 dijo `C:\Users\Kalel\prommter\web\index.html`. **Verificado el 2026-08-29:
 esa carpeta NO existe todavía** (la raíz de `prommter` tiene EMPRESA.md,
 PLAN-MIGRACION.md, PROYECTOS.md, documentos/, equipo/, memory/, proyectos/,
 reportes/ y `_cuarentena-borrar/`). Antes de nada: localiza el archivo real que
 el dueño ya vio y **reporta su ruta absoluta**. Si el archivo vive en otra
 carpeta, se mejora ahí mismo; mover el archivo NO es parte de este encargo.
 Si no aparece, PARA (armadura 0.10).

2.B HERRAMIENTAS DE MEDICIÓN (ya existen o se crean en `qa/`, que NO se publica)
 (1) `C:\Users\Kalel\ORION\tools\edge-cdp.mjs` — existe y es la verdad de
     terreno. NUNCA `msedge --screenshot` ni el navegador embebido: está medido
     que miente el ancho (piso de viewport ~492 px, PNG recortado a 390) y que
     reporta `prefers-reduced-motion: reduce` por defecto
     (`ORION/memory/landings/state.json` KN-003).
 (2) `qa/luminancia.mjs` — mide la luz REAL de los píxeles de un PNG, sin
     dependencias. Probado hoy contra un PNG de `#12100E` puro (devolvió
     `media 0.0053`, `desv 0`). Cópialo tal cual:
```js
// qa/luminancia.mjs — luminancia media y RELIEVE de un PNG. Uso: node qa/luminancia.mjs captura.png
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
const buf = readFileSync(process.argv[2]);
let p = 8, w = 0, h = 0, bd = 0, ct = 0, inter = 0; const idat = [];
while (p < buf.length) {
  const len = buf.readUInt32BE(p); const tipo = buf.toString('ascii', p + 4, p + 8);
  const datos = buf.subarray(p + 8, p + 8 + len);
  if (tipo === 'IHDR') { w = datos.readUInt32BE(0); h = datos.readUInt32BE(4); bd = datos[8]; ct = datos[9]; inter = datos[12]; }
  else if (tipo === 'IDAT') idat.push(datos); else if (tipo === 'IEND') break;
  p += 12 + len;
}
if (bd !== 8 || inter !== 0) { console.error('solo PNG 8-bit no entrelazado'); process.exit(2); }
const canales = ({ 0: 1, 2: 3, 4: 2, 6: 4 })[ct];
const raw = inflateSync(Buffer.concat(idat));
const bpp = canales, stride = w * bpp; const img = Buffer.alloc(h * stride); let q = 0;
for (let y = 0; y < h; y++) {
  const filtro = raw[q++]; const fila = raw.subarray(q, q + stride); q += stride;
  const off = y * stride, prev = off - stride;
  for (let x = 0; x < stride; x++) {
    const a = x >= bpp ? img[off + x - bpp] : 0, b = y > 0 ? img[prev + x] : 0;
    const c = (x >= bpp && y > 0) ? img[prev + x - bpp] : 0; let v = fila[x];
    if (filtro === 1) v += a; else if (filtro === 2) v += b; else if (filtro === 3) v += (a + b) >> 1;
    else if (filtro === 4) { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
    img[off + x] = v & 255;
  }
}
const lin = (u) => { const s = u / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const L = new Float64Array(w * h);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  const i = y * stride + x * bpp;
  const r = img[i], g = canales >= 3 ? img[i + 1] : img[i], b2 = canales >= 3 ? img[i + 2] : img[i];
  L[y * w + x] = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b2);
}
const est = (arr) => {
  let s = 0; for (const v of arr) s += v; const m = s / arr.length;
  let d = 0; for (const v of arr) d += (v - m) * (v - m);
  const orden = Float64Array.from(arr).sort(); const pc = (t) => orden[Math.min(orden.length - 1, Math.floor(t * orden.length))];
  return { media: +m.toFixed(4), desv: +Math.sqrt(d / arr.length).toFixed(4), p05: +pc(0.05).toFixed(4), p95: +pc(0.95).toFixed(4) };
};
const tercio = (k) => est(L.subarray(Math.floor(h * k / 3) * w, Math.floor(h * (k + 1) / 3) * w));
console.log(JSON.stringify({ archivo: process.argv[2], ancho: w, alto: h, total: est(L), tercioSuperior: tercio(0), tercioMedio: tercio(1), tercioInferior: tercio(2) }, null, 1));
```
 (3) **Sonda de fluidez** (va como `--eval`; probada hoy, devolvió
     `{fps:60.8, frames:92, framesLargos:0}` en una página de control). Mide
     cuadros por segundo mientras la página se desplaza sola:
```
--eval "(async()=>{const t0=performance.now();let f=0,largos=0,ult=t0;await new Promise(r=>{const b=()=>{const t=performance.now();if(t-ult>20)largos++;ult=t;f++;window.scrollBy(0,14);if(t-t0<1500)requestAnimationFrame(b);else r();};requestAnimationFrame(b);});const ms=performance.now()-t0;return{fps:+(f/(ms/1000)).toFixed(1),frames:f,framesLargos:largos,animacionesVivas:document.getAnimations().length,scrollFinal:Math.round(scrollY)};})()"
```
 TRAMPA VERIFICADA HOY, apúntala: con `--mobile`, si la página **no** tiene
 `<meta name="viewport" content="width=device-width, initial-scale=1">`, Edge
 reporta `innerWidth: 980` y toda la medida se va al piso. Si tu primera corrida
 devuelve 980, el problema es el `<meta>`, no el CSS: arréglalo antes de seguir.

2.C LAS SEIS CORRIDAS DE LA AUDITORÍA (todas contra el archivo actual, SIN tocarlo)
```
node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url "<RUTA_REAL>" --width 390 --height 844 --mobile --wait 2500 --shot qa/antes-390-heroe.png --eval "JSON.stringify({cta:document.querySelector('[data-cta-principal]')?.getBoundingClientRect().bottom, calc:document.querySelector('#calculadora')?.getBoundingClientRect().top, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, alto:document.documentElement.scrollHeight, anim:document.getAnimations().length, fuentes:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family), sombras:[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e).boxShadow;return s&&s!=='none'&&!s.includes('), ')}).length, focos:[...document.styleSheets].flatMap(h=>{try{return [...h.cssRules]}catch(e){return []}}).filter(r=>r.selectorText&&r.selectorText.includes('focus-visible')).length})"
node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url "<RUTA_REAL>" --width 390 --height 844 --mobile --wait 2500 --shot qa/antes-390-cierre.png --eval "document.querySelector('#cierre').scrollIntoView(); 'ok'"
node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url "<RUTA_REAL>" --width 390 --height 844 --mobile --wait 1200 <SONDA_DE_FLUIDEZ>
node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url "<RUTA_REAL>" --width 390 --height 844 --mobile --reduce --wait 2500 --shot qa/antes-390-reduce.png
node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url "<RUTA_REAL>" --width 1440 --height 900 --wait 2500 --shot qa/antes-1440.png
node C:\Users\Kalel\ORION\tools\edge-cdp.mjs --url "<RUTA_REAL>" --width 390 --height 844 --mobile --full --wait 2500 --shot qa/antes-390-completa.png
node qa/luminancia.mjs qa/antes-390-heroe.png   (y lo mismo con -cierre y -1440)
```
 Además, a mano: tamaño del archivo en KB, y las capturas de las anclas
 `#calculadora`, `#demo`, `#niveles`, `#trabajo`, `#cierre`.

2.D TABLA DE AUDITORÍA — llénala antes de escribir CSS
 | # | Métrica | Cómo se obtiene | Meta v2 (no empeorar) | Meta v3 | Medido ANTES | Pase que la mueve |
 |---|---|---|---|---|---|---|
 | 1 | Alto del héroe a 390 | primera sección `.getBoundingClientRect().height` | — | ≤ 100dvh | | — |
 | 2 | Borde inferior del CTA | `cta` | ≤ 720 | ≤ 720 | | P7 (vigila) |
 | 3 | Inicio de la calculadora | `calc` | ≤ 1000 | ≤ 1000 | | P7 (vigila) |
 | 4 | Desbordamiento horizontal | `sw` vs `cw` | 390 = 390 | 390 = 390 | | P7 (vigila) |
 | 5 | Luminancia media del héroe | `luminancia.mjs total.media` | < 0.12 | < 0.12 | | P1 |
 | 6 | **Relieve del héroe** (desv.) | `luminancia.mjs total.desv` | — | **≥ 0.015** | | **P1** |
 | 7 | **Relieve por tercios** | dif. entre tercio más claro y más oscuro | — | **≥ 0.004** | | **P1** |
 | 8 | Fluidez al desplazar | sonda `fps` / `framesLargos` | — | **≥ 50 / ≤ 3** | | P2, P3, P7 |
 | 9 | Animaciones vivas | `document.getAnimations().length` | — | 1 ≤ n ≤ 6 | | P2–P4 |
 | 10 | Sombras de una sola capa | conteo del `--eval` | — | **0** | | P5 |
 | 11 | Reglas `:focus-visible` | conteo del `--eval` | — | **≥ 1 por tipo de control (5)** | | P4, P5 |
 | 12 | Peso del archivo | KB en disco | < 180 KB | < 180 KB y **≤ ANTES + 20 KB** | | P7 |
 | 13 | Fuentes cargadas | `fuentes` | Fraunces + Manrope | igual | | P7 (vigila) |
 | 14 | Consola | `console` / `exceptions` | vacías | vacías | | P7 |
 | 15 | Estado con `--reduce` | captura `antes-390-reduce.png` | contenido visible | igual + sin huecos | | P2, P3, P7 |
 | 16 | Cierre: luz en el botón | `luminancia.mjs` del PNG de `#cierre` | — | tercio del botón **≥ 1.3 ×** el tercio más oscuro | | P3, P6 |

2.E REGLA DE DECISIÓN (esto es lo que evita la sobrecorrección)
 · Si una métrica **ya cumple la meta v3**, el pase asociado **NO se aplica**.
   Se escribe en el reporte "ya cumple, pase omitido" y se pasa al siguiente.
   Aplicar un pase "por si acaso" sobre algo que ya funcionaba es exactamente el
   error que este encargo quiere evitar (`landings/KN-009`, apartado "importante
   para no sobrecorregir": lo que el dueño NO criticó, se conserva).
 · Si una métrica **incumple una meta del v2** (filas 2, 3, 4, 5, 12, 13, 14),
   arreglarla es **P-corrector y va PRIMERO**, antes que cualquier pase estético.
   Una landing bonita con el CTA en y=1100 sigue siendo una landing fallada.
 · Si una métrica no se puede medir porque el selector no existe (`#calculadora`,
   `[data-cta-principal]`…), **no inventes el número**: reporta "no medible" y di
   qué selector falta. Un dato inventado en la auditoría envenena los siete pases.
╔═════════════════════════════════════════════════════════════════════════════╗
║ 3 · CÓMO SE APLICAN LOS PASES (anti-sobrecorrección, obligatorio)          ║
╚═════════════════════════════════════════════════════════════════════════════╝
 3.1 **Un pase por vez, en orden.** Se aplica P1, se mide P1, se reporta P1; solo
     entonces empieza P2. Prohibido mezclar dos pases en la misma edición.
 3.2 **Cada pase vive en un bloque rotulado y reversible.** En el `<style>`:
```css
/* ═══ P3 · LUZ QUE ACOMPAÑA — INICIO (v3) ═══ */
   …
/* ═══ P3 · FIN ═══ */
```
     En el `<script>`, una función por pase: `function paseP3(){…}`, llamada solo
     si `CONFIG.mejoras.p3 === true`. Se añade UNA clave al `CONFIG` existente,
     sin tocar las demás:
```js
  mejoras: { p1:true, p2:true, p3:true, p4:true, p5:true, p6:true }, // v3
```
     Reversión = poner una clave en `false` (efecto inmediato) o borrar el bloque
     rotulado (reversión total). Cada pase tiene que poder apagarse SIN romper
     ningún otro: si P4 depende de que P2 esté encendido, está mal hecho.
 3.3 **Nada fuera del pase.** Prohibido "aprovechar el viaje" para retocar copy,
     mover una sección, cambiar un margen que no está en el pase, renombrar una
     clase, reordenar el HTML o "limpiar" código. Si ves algo que te parece
     mejorable y no está en la tabla 2.D, **anótalo en el reporte** y no lo
     toques. Esa lista de "vistos y no tocados" es parte del entregable.
 3.4 **Antes/después por pase.** Captura a 390 antes y después de cada pase, en
     `qa/`, con el nombre del pase. Si el después no mueve el número que el pase
     prometía, el pase se revierte: no se queda "porque igual se ve lindo".
 3.5 **Los criterios no se negocian.** Si un pase solo cumple su criterio
     rompiendo otro (fluidez, peso, contraste, altura del CTA), se revierte
     entero y se reporta el conflicto. No bajes la meta para que pase el trabajo.
 3.6 **El diff manda.** Al terminar, el diff contra el archivo original tiene que
     ser explicable línea por línea, y no puede contener cambios en el texto
     visible de ninguna sección (excepto los tres textos nuevos que P4/P6
     autorizan explícitamente, listados ahí).

╔═════════════════════════════════════════════════════════════════════════════╗
║ P1 · ATMÓSFERA Y PROFUNDIDAD DEL FONDO                                      ║
║ Qué sube: que el fondo deje de ser una capa y pase a ser un espacio.        ║
╚═════════════════════════════════════════════════════════════════════════════╝
POR QUÉ VENDE: el visitante juzga la portada antes de leerla, y lo primero que
juzga en una portada oscura es si hay AIRE detrás del producto o si es una
cartulina negra. Está pagado en otro proyecto de la casa: la primera palabra del
reclamo del dueño el 2026-08-23 fue "fondo" (`landings/KN-009`). Aquí no hay
rechazo — hay aceptación —, así que no se cambia el fondo: **se le pone hondura.**

QUÉ SE TOCA: exclusivamente las capas de fondo de las bandas (héroe, S2, S4, S10
oscuras; S3, S5, S6, S7, S8, S9 claras) y las junturas entre bandas.
QUÉ NO SE TOCA: ningún contenido, ninguna tipografía, ningún color de texto,
ninguna altura de sección.

CÓMO, en cinco capas apiladas dentro de la MISMA banda (todas con `::before` /
`::after` y `pointer-events:none`, ninguna con un elemento nuevo en el HTML si se
puede evitar):
 a) **Base**: sigue `--noche #12100E`. Sin cambios.
 b) **Halo de sección**: un radial cálido que ya existe en el héroe; se
    generaliza a las otras tres bandas oscuras con el color propio de cada una:
    S2 `--teja-cl` (el enemigo), S4 `--verde-cl` (el sistema funcionando),
    S10 `--ambar` (la plata). Alfa 0.10–0.16, nunca más:
    `radial-gradient(120% 80% at 50% 26%, rgba(<token>,.14), transparent 62%)`.
 c) **Pozo**: `linear-gradient(180deg, transparent 55%, var(--noche-3) 100%)`
    en el último 45 % de cada banda oscura. Es lo que hace que la sección
    siguiente parezca estar más lejos, no pegada.
 d) **Grano**: SVG `feTurbulence type="fractalNoise" baseFrequency="0.9"
    numOctaves="2"` en un tile de 160 × 160 px como data-URI, `opacity .06`,
    `background-repeat: repeat`, `mix-blend-mode: overlay`. Solo sobre bandas
    oscuras. En bandas claras, en su lugar, un patrón de puntos de 1 px cada
    22 px al 3 % de `--borde` para que el papel no se lea como plástico.
 e) **Viñeta**: `radial-gradient(120% 90% at 50% 45%, transparent 55%,
    rgba(11,10,9,.55) 100%)` en héroe y cierre. En las bandas intermedias, no.

JUNTURAS (esto es la mitad del efecto y cuesta 4 líneas): entre banda oscura y
banda clara, hoy hay un corte. Se sustituye por: 1 px de `--luz-borde` arriba de
la banda clara + 28 px de degradado desde `--noche-3` al `--papel`. El ojo lo lee
como un plano que se aleja, no como dos rectángulos pegados.

VELO QUE ENFOCA (de la ficha 02, traducido y bajado de dosis): cada banda oscura
lleva un velo cálido vertical cuya alfa es mayor arriba y abajo que en el centro
—`0.30 / 0.00 / 0.40` de `rgba(18,16,14,α)`—, de modo que **el centro de la
sección es lo más iluminado**. En la referencia eso se hacía con un azul
`74,181,224` que aquí está prohibido (POL-001): el velo es del propio `--noche`.

CRITERIOS DE ACEPTACIÓN DE P1 (sobre `qa/despues-p1-390-heroe.png`)
 P1-a `total.media` < 0.12 — el héroe sigue siendo oscuro.
 P1-b `total.desv` ≥ 0.015 — hay relieve; una cartulina plana da 0.000
      (medido: `#12100E` puro = media 0.0053, desv 0.0000).
 P1-c Diferencia ≥ 0.004 entre el tercio más claro y el más oscuro del héroe.
 P1-d Lo mismo (P1-b) en la captura de `#cierre`.
 P1-e Peso: +6 KB como máximo sobre la auditoría (el grano es un data-URI de
      ~700 bytes; si tu grano pesa 40 KB, es un PNG y está mal).
 P1-f Fluidez: sin cambio respecto a la auditoría (± 3 fps). Ningún fondo
      animado, ningún `filter: blur()` sobre áreas grandes.

╔═════════════════════════════════════════════════════════════════════════════╗
║ P2 · COREOGRAFÍA DIRIGIDA POR EL SCROLL (ficha 02, dosis acotada)          ║
║ Qué sube: que el paso del héroe a la calculadora se sienta dirigido.        ║
╚═════════════════════════════════════════════════════════════════════════════╝
POR QUÉ VENDE: la calculadora es el arma de venta de la casa (llegar con el
número del cliente ya calculado, `precios-v2.html:209-211`). Hoy el visitante
"llega" a ella; con este pase, la página **lo entrega** a ella: los teléfonos se
apartan y la cifra ocupa su lugar. Es el mismo movimiento que hace un vendedor
cuando aparta los folletos y pone la calculadora sobre el mostrador.

ALCANCE — UNA SOLA ESCENA. Del héroe (S1) a la cifra de S2. Ninguna otra sección
se dirige por scroll. Prohibido explícitamente, tomado de la ficha 02 y
descartado a propósito: el rail de 3700 px, la escena pegada larga, las capas
PNG, el parallax de puntero y el slider infinito. En móvil eso es demasiado
pulgar y aquí no hay fotos que apilar.

MOTOR (es el mecanismo real de la ficha 02, reducido):
```js
// una sola variable suavizada + tramos con smoothstep; la CSS solo lee var(--x)
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smoothstep=(e0,e1,v)=>{const x=clamp((v-e0)/(e1-e0));return x*x*(3-2*x);};
// s = píxeles desplazados dentro de la escena; suavizado: s = lerp(s, objetivo, .14)
```
 · Se escriben **como máximo 8** custom properties por cuadro. Ni una más.
 · `requestAnimationFrame` con guardia `rafPending`; se deja de pedir cuadros
   cuando `|s - objetivo| < 0.08`.
 · Listener de scroll `{passive:true}`. Prohibido `preventDefault` en scroll.

QUÉ SE MUEVE (y nada más):
 · `--sal-heroe` = `smoothstep(0, 420, s)`:
   titular y bajada suben `-60 px` y se desvanecen (`opacity 1→0`);
   los cuatro teléfonos se **abren en abanico**: el central baja 24 px y escala
   0.94; el izquierdo y el derecho derivan ∓ 8 vw y ganan 1 px de blur.
   Es la traducción honesta del "splitframe que se abre" de la ficha 02: aquí lo
   que se abre son las pantallas para dejar ver el número.
 · `--entra-cifra` = `smoothstep(220, 620, s)`:
   la cifra de comisión entra contra-escalada (`scale 1.06 → 1`) y su franja
   diagonal ámbar **barre** de 0 % a 100 % del ancho (`clip-path: inset(0 X% 0 0)`).
   La cifra NUNCA aparece de cero: su valor ya está calculado desde la carga.

PRESUPUESTO Y LÍMITES
 · El alto del documento no puede crecer más de **60 vh** respecto a la auditoría
   (el rail extra). Si tu escena necesita más, se corta la escena, no el criterio.
 · Solo `transform`, `opacity`, `clip-path`. Prohibido animar `width`, `height`,
   `top`, `left`, `margin`, `box-shadow` o `filter: blur()` de áreas grandes.
 · `will-change` solo mientras la escena está en pantalla; se quita al salir.
 · Si `matchMedia('(prefers-reduced-motion: reduce)').matches` o
   `navigator.hardwareConcurrency <= 4`: **la escena se congela en su estado
   final legible** (titular visible, cifra visible, franja al 100 %). Nunca
   contenido escondido esperando una animación que no va a correr.

CRITERIOS DE ACEPTACIÓN DE P2
 P2-a Sonda de fluidez: `fps ≥ 50` y `framesLargos ≤ 3` a 390 px.
 P2-b `scrollHeight` crece ≤ 0.6 × `innerHeight` respecto a la auditoría.
 P2-c Con `--reduce`: titular, bajada y cifra tienen `opacity: 1` y la franja
      está al 100 % (compruébalo con `--eval` sobre `getComputedStyle`).
 P2-d Las filas 2, 3 y 4 de la tabla no empeoran (CTA ≤ 720, calc ≤ 1000,
      sin desbordamiento horizontal).
 P2-e `document.getAnimations().length` ≤ 6 en cualquier punto del recorrido.
 P2-f Con el pase apagado (`CONFIG.mejoras.p2=false`) la página se ve exactamente
      como antes de P2. Compruébalo con la captura.

╔═════════════════════════════════════════════════════════════════════════════╗
║ P3 · LUZ QUE ACOMPAÑA (ficha 03, elevada de "foco fijo" a "foco que dirige")║
╚═════════════════════════════════════════════════════════════════════════════╝
POR QUÉ VENDE: la ficha 03 tiene un veredicto pagado en contra cuando el foco
depende de un gesto (`referencias/_INDEX.md:18`: "ni apareció"). El v2 lo
resolvió dejándolo QUIETO sobre el botón, y eso funcionó. Este pase no lo
devuelve al gesto: lo mantiene resuelto en reposo y le añade **dirección** —el
foco señala lo que el visitante tiene que mirar en ese momento.

QUÉ SE TOCA: dos sitios, ninguno más.
 (1) **Cierre S10** — el foco radial ya puesto sobre el botón se conserva tal
     cual en reposo, y se le añade una **órbita mínima**: `translate(±10px, ±6px)`
     en 9 s, `ease-in-out`, `alternate`. Es el latido de una lámpara, no un
     movimiento: si se nota como animación, está mal calibrado. Sobre puntero
     fino (`@media (hover:hover) and (pointer:fine)`) el foco puede seguir al
     cursor con `lerp .1`, **solo dentro del bloque de cierre**. En táctil no se
     activa `touchmove` (secuestra el scroll).
 (2) **Demo S4** — el halo cálido pasa del teléfono del cliente al panel del
     dueño **cuando el pedido entra**, en 400 ms. Propósito de venta: el
     visitante ve que la prueba del producto es que el pedido llega solo al
     panel; el foco se lo dice sin una palabra. En reposo, el halo está sobre el
     panel del dueño con el aviso ya en pantalla (estado congelado del v2).

CÓMO, sin coste: `mask`/`filter` sobre áreas grandes están prohibidos. El foco es
un `radial-gradient` en un `::after` con `opacity` y `transform` animados, nada
más. Nada de `backdrop-filter`, nada de `canvas`, nada de `toDataURL`.

CRITERIOS DE ACEPTACIÓN DE P3
 P3-a En `qa/despues-p3-390-cierre.png` (sin tocar nada), el tercio donde está el
      botón tiene `media` ≥ 1.3 × el tercio más oscuro de esa captura.
 P3-b Con `--reduce`, la órbita no corre: `getAnimations()` en el bloque de
      cierre = 0 y el foco sigue visible sobre el botón.
 P3-c El foco del cierre NO se pierde al cargar (nada de arrancar en
      `(-999,-999)`: ese es el error documentado de la ficha 03).
 P3-d Fluidez sin cambio (± 3 fps) respecto a P2.
 P3-e Ninguna regla nueva con `backdrop-filter` ni `filter: blur()` sobre
      contenedores de más de 200 × 200 px.

╔═════════════════════════════════════════════════════════════════════════════╗
║ P4 · MICROINTERACCIONES CON PROPÓSITO (exactamente SEIS, ni una más)       ║
╚═════════════════════════════════════════════════════════════════════════════╝
Regla: cada microinteracción responde a una duda concreta de compra. Si no
puedes escribir la duda que resuelve, no se implementa. Están numeradas y
cerradas: **añadir una séptima es rediseñar**.

 M1 · **El botón dice lo que va a enviar.** Duda: "¿a qué me comprometo si toco?"
    Al presionar: `scale(.985)` en 120 ms y la sombra dura se acorta de 6 px a
    2 px (se siente físico). Y bajo el botón principal, una línea de 13 px en
    `--claro-2` que muestra el mensaje ya armado: *"se envía: Hola, tengo un
    asadero. Hago unos 60 pedidos…"*, truncada a una línea con elipsis.
    ⚠ Es UNO de los tres textos nuevos que este prompt autoriza (§3.6). No es
    copy de venta: es la vista previa literal del mensaje que ya existe en el v2.
 M2 · **La cifra encaja al soltar.** Duda: "¿este número es de verdad o es una
    animación?" Mientras se arrastra el deslizador la cifra se actualiza sin
    animación (respuesta inmediata = confianza); **al soltar**, la cifra hace un
    encaje de 200 ms (`scale 1.03 → 1`) y la franja diagonal se redibuja. Marcas
    en la pista cada 20 pedidos, de 1 px, en `--claro-3`. El campo escribible se
    subraya con 2 px de `--ambar` mientras tiene el foco.
 M3 · **El nivel se conecta con la demo.** Duda: "¿qué me toca a mí de esta
    lista?" Al elegir un nivel en S7, además de la elevación de 6 px que ya
    existe, aparece una **guía de 2 px** en `--verde-cl` desde el borde inferior
    de la tarjeta activa hacia el ancla de la demo, con una flecha de 8 px. Dura
    lo que dura la selección. Hace visible la relación causa-efecto que el v2 ya
    programó (I4) y que hoy es invisible.
 M4 · **El pedido avanza con un clic visual.** Duda: "¿esto lo mueve una persona
    o el sistema?" Al cambiar de estado, el chip anterior sale con `scale(.94)` +
    opacidad 0 en 160 ms y el nuevo entra en 200 ms con un parpadeo ÚNICO del
    borde (`--luz-borde` → `--verde-cl` → `--luz-borde`, 240 ms). Una sola vez,
    nunca en bucle.
 M5 · **Se ve dónde está el teclado.** Duda: accesibilidad real, no adorno.
    `:focus-visible` en TODOS los controles: anillo de 2 px `--ambar` con
    `outline-offset: 2px` sobre noche y 2 px `--verde` sobre papel. Prohibido
    `outline: none` sin sustituto. Cinco tipos de control como mínimo: enlace,
    botón, deslizador, campo numérico, tarjeta seleccionable.
 M6 · **El número viaja con el visitante.** Duda: "¿de cuánto estábamos
    hablando?" La barra fija inferior de móvil, a partir de que la calculadora
    sale de pantalla, muestra la cifra en pequeño junto al botón:
    *"$360.000/mes · Escribir"*. Vuelve a "Escribir por WhatsApp" en el cierre.
    ⚠ Segundo texto nuevo autorizado, y sale de la propia calculadora: no es un
    dato nuevo, es el resultado del cálculo del v2.

TAP TARGETS: todo lo que se toca sigue con ≥ 44 px de alto (criterio A14 del v2).
Ninguna de estas seis puede depender de `hover`: en táctil no existe.

CRITERIOS DE ACEPTACIÓN DE P4
 P4-a Las seis existen y se disparan con TOQUE (no con hover). Compruébalo
      lanzando eventos `pointerdown/pointerup` por `--eval` y capturando.
 P4-b Conteo de reglas `:focus-visible` ≥ 5; conteo de `outline:none` sin
      sustituto = 0.
 P4-c La línea de vista previa del mensaje (M1) coincide **carácter por
      carácter** con el prefijo del `href` de `wa.me` (decodificado).
 P4-d Con `--reduce`: las seis siguen funcionando, sin transición (el estado
      final se aplica de golpe). Ninguna queda inservible.
 P4-e `getAnimations()` ≤ 6 simultáneas en el peor momento (tocar el deslizador
      mientras la demo avanza).
 P4-f Ninguna microinteracción añade un elemento que ocupe espacio en el flujo
      antes de dispararse (nada de reservar huecos vacíos).

╔═════════════════════════════════════════════════════════════════════════════╗
║ P5 · DENSIDAD DE DETALLE FINO (el oficio: bordes, sombras, texto, estados)  ║
╚═════════════════════════════════════════════════════════════════════════════╝
POR QUÉ VENDE: esta landing **es la muestra del producto** (§2 del v2: "si se ve
pobre, el producto se ve pobre"). Un dueño de negocio no sabe decir "la sombra es
de una sola capa", pero sí sabe decir "esto se ve hecho a la carrera". Este pase
no cambia nada de sitio: cambia el acabado de lo que ya está.

 5.1 **Sombras, siempre en dos capas.** Nunca una sola.
     Sobre papel: `var(--sombra-contacto), var(--sombra)`.
     Sobre noche: `var(--sombra-contacto), 0 24px 60px rgba(11,10,9,.55),
     inset 0 1px 0 var(--luz-borde)` — la tercera es el filo de luz que hace que
     una tarjeta oscura sobre fondo oscuro exista.
     La `--sombra-dura` del v2 se conserva donde ya está (fichas de S5, botón):
     es carácter, no error.
 5.2 **Bordes.** Sobre papel: 1 px `--borde`. Sobre noche: 1 px `--luz-borde`
     (nunca un gris opaco: sobre oscuro, el borde es luz, no tinta).
 5.3 **Radios anidados.** Radio interior = radio exterior − relleno. Una píldora
     de 999 px dentro de una tarjeta de 14 px con 12 px de relleno pide 
     `border-radius: 2px` en el rectángulo interior, no 14. Los dos radios del
     sistema (14 / 999) no cambian.
 5.4 **Texto.**
     · `font-variant-numeric: tabular-nums` en TODA cifra (calculadora, precios
       apagados, "2 toques", "6 toques", "$0", "4 sistemas").
     · `text-wrap: balance` en h1/h2/h3; `text-wrap: pretty` en párrafos.
     · Ancho de medida: 58–64 caracteres. Si un párrafo pasa de 64ch en
       escritorio, se le pone `max-width`, no se le baja el tamaño.
     · `letter-spacing: -.02em` solo en display (Fraunces). Manrope va a 0.
     · `hyphens: none` y `overflow-wrap: anywhere` en las cifras largas para que
       "$4.320.000" nunca parta a mitad.
 5.5 **Textura de superficie.** Las tarjetas claras llevan un `1px` superior de
     `rgba(255,255,255,.9)` (filo de papel) y las oscuras el `inset` de 5.1.
     Nada de degradados en tarjetas: son objetos planos con luz, no botones de
     2011.
 5.6 **Tabla de estados obligatoria** (valores exactos, cinco controles):
     | Control | Reposo | Hover (solo `hover:hover`) | Activo/Presionado | Foco visible | Deshabilitado |
     |---|---|---|---|---|---|
     | Botón WhatsApp | `--wa` + sombra dura 6 px | brillo 1.06 | `scale(.985)`, sombra 2 px | anillo 2 px `--ambar` | — (nunca se deshabilita) |
     | Botón secundario | borde 1 px | fondo `--hover` | `scale(.99)` | anillo 2 px `--verde` | opacidad .45, `cursor:not-allowed` |
     | Tarjeta de nivel | sombra 2 capas | sube 2 px | sube 6 px + borde `--verde` | anillo 2 px | — |
     | Deslizador | pista 8 px, pulgar 28 px | pulgar 30 px | pulgar 30 px + halo | anillo 2 px `--ambar` | — |
     | Campo numérico | borde 1 px `--borde` | borde `--gris` | — | borde 2 px `--ambar` | — |
     Todas las transiciones de estado: 120–200 ms, `cubic-bezier(.4,0,.2,1)`.
 5.7 **Alineación óptica de lo pequeño**: las píldoras de hueco (H-1, H-2) y el
     sello "mensual" ya existen; se les alinea la línea base con el texto vecino
     y se les da `letter-spacing: .02em` en mayúsculas. No se les cambia el texto.

CRITERIOS DE ACEPTACIÓN DE P5
 P5-a Conteo de elementos con `box-shadow` de una sola capa = **0** (usa el
      `--eval` de la auditoría, fila 10).
 P5-b Conteo de cifras sin `tabular-nums` = 0 (recorre los nodos con dígitos en
      las secciones S2, S4, S5, S7).
 P5-c La tabla 5.6 está implementada entera: cinco controles × cinco estados.
      Prueba cada estado por `--eval` y captura tres de ellos.
 P5-d Contraste: ningún par nuevo fuera de la lista que PASA en §5.D del v2 y §T
      de aquí. Ninguno de los cinco pares prohibidos aparece.
 P5-e Peso: +8 KB máximo sobre P4.
 P5-f Ningún cambio de tamaño de fuente, de familia ni de espaciado entre
      secciones. Si el `scrollHeight` cambia más de 40 px por este pase, algo se
      movió que no debía.

╔═════════════════════════════════════════════════════════════════════════════╗
║ P6 · REMATE DEL CIERRE                                                      ║
╚═════════════════════════════════════════════════════════════════════════════╝
POR QUÉ VENDE: es la última pantalla y la única donde el visitante ya tiene su
propio número en la cabeza. Hoy (v2) es "banda oscura + cifra repetida + botón
con foco". Sube a **pantalla de remate**, sin cambiar el contenido:

 6.1 **Composición**: el cierre ocupa `100dvh` a 390 px, con el botón entre el
     45 % y el 75 % de la altura del viewport y el pie completo visible sin
     scroll adicional. Nadie debería tener que desplazarse después del botón.
 6.2 **Jerarquía**: la cifra del visitante (si usó la calculadora) arriba, en
     display; debajo la frase honesta del v2 (*"solo con mover una parte de esos
     pedidos…"*, `precios-v2.html:207-208` — **prohibido** insinuar el 100 %);
     debajo el botón con su foco (P3); debajo, en 13 px `--claro-3`, los tres
     pasos ya escritos en S9, en una línea: *"escribe · miramos sus números · le
     digo qué nivel le sirve"*.
     ⚠ Tercer y último texto nuevo autorizado, y es una condensación literal de
     S9 del v2: no aporta ningún dato que no esté ya en la página.
 6.3 **Sello**: se reutiliza el sello circular rotado −8° que ya existe en S6
     ("mensual"), en el pie del cierre, al 60 % de opacidad. No se dibuja un
     sello nuevo ni se le inventa texto.
 6.4 **Pie**: mismo contenido (Prommter · [[CIUDAD]] · WhatsApp [[WHATSAPP]]),
     con las píldoras de hueco intactas. Se le añade un filo de `--luz-borde`
     arriba y se le baja el peso visual a `--claro-3`. Sin redes (H-12), sin
     "© todos los derechos reservados" (H-10).
 6.5 **Fin de página**: `--noche-3` puro en los últimos 120 px. La página termina
     apagándose; no termina en un corte.

CRITERIOS DE ACEPTACIÓN DE P6
 P6-a En la captura del ancla `#cierre` a 390 × 844: el borde inferior del botón
      está entre `0.45 × 844` y `0.75 × 844`, y el pie es visible en la misma
      captura.
 P6-b La cifra del cierre coincide con la de la calculadora tras mover los
      deslizadores (léela dos veces con valores distintos).
 P6-c El texto de 6.2 no introduce ninguna promesa nueva: compáralo palabra por
      palabra con S9 del v2.
 P6-d `luminancia.mjs` sobre la captura del cierre cumple P3-a.
 P6-e Con la calculadora sin tocar, el cierre muestra el valor inicial
      (60 × 30.000 → 360.000–540.000), nunca un hueco vacío.

╔═════════════════════════════════════════════════════════════════════════════╗
║ P7 · RE-MEDICIÓN, PRESUPUESTO Y ENTREGA                                     ║
╚═════════════════════════════════════════════════════════════════════════════╝
 7.1 Se repiten las SEIS corridas de 2.C sobre el archivo mejorado, con nombres
     `qa/despues-*`. Se rellena la columna "Medido DESPUÉS" de la tabla 2.D.
 7.2 **Nada empeora.** Filas 2, 3, 4, 5, 12, 13, 14: si una empeoró, el pase
     culpable se revierte. No se entrega con una regresión "compensada" por una
     mejora.
 7.3 **Presupuesto duro**: peso final < 180 KB y ≤ auditoría + 20 KB; fluidez
     ≥ 50 fps con ≤ 3 cuadros largos; ≤ 6 animaciones simultáneas; consola sin
     errores ni advertencias tras tocar héroe, calculadora, niveles y demo.
 7.4 **Accesibilidad**: con `--reduce` el contenido queda en su estado final
     visible (nada oculto), y sin JavaScript el texto de las 11 secciones sigue
     legible y el botón de WhatsApp sigue funcionando (criterio A5 del v2).
 7.5 **Comparativa**: seis pares de PNG antes/después (héroe, calculadora, demo,
     niveles, trabajo, cierre) a 390 y el par de 1440. Se miran uno por uno.
 7.6 **Prueba del bochorno** (se mantiene del v2): la captura móvil al lado de
     `prommter/proyectos/pollo-landing/index.html`. Si esta se ve más pobre, no
     está lista.
 7.7 **ENTREGABLE FINAL**: (a) el mismo `index.html` con los seis bloques
     rotulados; (b) `qa/` con capturas, JSON de las corridas y los dos scripts;
     (c) un reporte de una página: tabla 2.D completa antes/después, qué pase
     movió cada número, qué pases se OMITIERON por "ya cumple", y la lista de
     "vistos y no tocados" (§3.3).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 4 · PROHIBIDO EN ESTA ITERACIÓN (además de todo el §8 del v2)              ║
╚═════════════════════════════════════════════════════════════════════════════╝
 1. **Rehacer.** Reconstruir la página, regenerarla, "empezar de nuevo pero
    mejor", cambiar la estructura o el orden de las secciones.
 2. **Tocar el contenido**: copy, datos, cifras, orígenes, huecos, `CONFIG`,
    interruptores, nombres de clientes, modelo de cobro.
 3. **Añadir**: secciones, fotos, ilustraciones, mascotas, patrones decorativos
    ajenos, iconos de librería, una tercera tipografía, un cuarto color.
 4. **Efectos de catálogo**: glassmorphism, neomorfismo, degradados de startup,
    brillos animados en bucle, parallax de página completa, cursor personalizado,
    preloader/splash, sonido, confeti, contadores de urgencia, ventanas
    emergentes, banner de cookies decorativo.
 5. **Azules eléctricos, morados, neones y gradientes tecnológicos.** Sigue
    siendo prohibición permanente de la casa.
 6. **Movimiento sin propósito**: si no puedes escribir en una línea qué duda de
    compra resuelve, se cae. Y ninguna animación infinita salvo la órbita de P3
    y el pedido de la demo, ambas ya autorizadas.
 7. **Bajar un criterio** para que pase el trabajo, o mezclar dos pases en una
    edición, o entregar sin la tabla medida.
 8. **"Ya que estoy"**: arreglar, limpiar, refactorizar o renombrar cualquier
    cosa que no esté en la tabla 2.D.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 5 · REFERENCIAS COMBINADAS EN ESTA ITERACIÓN (apartado 11)                 ║
╚═════════════════════════════════════════════════════════════════════════════╝
Biblioteca: `C:\Users\Kalel\ORION\prompts-landing\referencias\`. Se copia el
MECANISMO, jamás la marca, los textos, las imágenes ni los datos.

 ZONA HÉROE — **ficha 01** (carrusel de figuras con roles + fondo que cambia):
  **NO SE RE-ABRE.** Ya está construida y el dueño dijo que le gustó. El único
  contacto con ella es P1 (el fondo sobre el que vive gana relieve) y P2 (los
  teléfonos se apartan al salir). Sus roles por índice, su fantasma gigante y su
  cambio de color por negocio se quedan **exactamente como están**. Reabrir un
  mecanismo aprobado es la forma más cara de perder una aceptación.

 ZONA CIFRA/ESCENA — **ficha 02** (`02-scroll-cinematografico-capas-mostar.md`):
  En el v2 se tomó **solo** el "dato grande + una línea", que es el mecanismo más
  resistente de la biblioteca. Ahora se sube un escalón y se toma su **MOTOR**:
  una sola variable de scroll suavizada (`lerp .14`) + tramos con `smoothstep`
  escribiendo custom properties, y la idea del "primer plano que se abre en dos"
  traducida a los teléfonos que se apartan (P2). Se siguen descartando, a
  propósito, el rail de 3700 px, las capas PNG, el parallax de puntero y el
  slider infinito. Por qué vende: entrega al visitante a la calculadora en vez de
  dejar que llegue solo.
  Lo que NO se copia: Mostar, las fotos de cloudfront, `Ogg Medium`, el azul
  `#79b7dd` ni el velo `74,181,224` (aquí el velo es del propio `--noche`).

 ZONA CIERRE — **ficha 03** (`03-hero-spotlight-revela-segunda-imagen-lithos.md`):
  En el v2 se tomó su acento cálido único y el foco YA PUESTO. Ahora se le añade
  **dirección**: órbita mínima en el cierre y foco que se traslada al panel del
  dueño cuando entra el pedido (P3). Sigue sin depender de gesto: su estado en
  reposo es el que se juzga, porque el dueño revisa capturas quietas
  (`referencias/_INDEX.md:18`, veredicto pagado).
  Lo que NO se copia: "Lithos", Playfair, las imágenes remotas, la máscara por
  `canvas.toDataURL()` (cara y basura).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 6 · ADAPTACIÓN MÓVIL DE CADA PASE (apartado 12 — 390 px es el diseño)      ║
╚═════════════════════════════════════════════════════════════════════════════╝
El móvil es canal principal declarado (`landings/POL-003`): el enlace llega por
WhatsApp. Se diseña a 390 y el escritorio es esa columna crecida.

 · **P1** — Grano al 6 % en móvil (en escritorio puede subir a 7 %); tile de
   160 px reutilizado, nunca uno por sección. El pozo `--noche-3` se acorta a los
   últimos 30 % en móvil para no oscurecer texto. Viñeta solo en héroe y cierre:
   en pantalla pequeña, más viñetas = túnel.
 · **P2** — La escena se dirige con SCROLL, que en móvil sí existe (a diferencia
   del hover). Rail extra ≤ 60 vh, y a 390 px el abanico de los teléfonos es de
   ∓ 8 vw, no de ∓ 46 vw como la referencia: con tres piezas en 390 px, más
   apertura las saca de pantalla. Sin parallax de puntero. Con
   `hardwareConcurrency <= 4`, escena congelada en su estado final.
 · **P3** — En táctil, el foco NO sigue al dedo (secuestra el scroll): órbita
   lenta y nada más. El seguimiento al cursor vive tras
   `@media (hover:hover) and (pointer:fine)`.
 · **P4** — Las seis se disparan con toque; tap targets ≥ 44 px; la vista previa
   del mensaje (M1) a una sola línea con elipsis; la barra inferior con la cifra
   (M6) respeta `env(safe-area-inset-bottom)` y no tapa el pie.
 · **P5** — Las sombras de dos capas bajan su radio en móvil (60 px → 36 px):
   sombras enormes en pantalla chica son niebla. Medida de párrafo 58ch.
 · **P6** — `100dvh`, nunca `100vh` (la barra del navegador se come el botón).
 · **Transversal** — Alturas en `dvh`; sin imágenes (todo CSS/SVG);
   `prefers-reduced-motion: reduce` con contenido en estado final visible; se
   mide a 390 × 844 con `edge-cdp.mjs --mobile` y también a 1440 × 900, y el
   veredicto del dueño se registra **por canal, móvil y escritorio por separado**.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 7 · CRITERIOS DE ACEPTACIÓN CONSOLIDADOS (lo que se revisa al final)       ║
╚═════════════════════════════════════════════════════════════════════════════╝
 B1  Existe el reporte con la tabla 2.D llena ANTES y DESPUÉS. Sin tabla, no hay
     entrega (aunque la página se vea mejor).
 B2  Cada pase está en su bloque rotulado y se apaga solo con su clave de
     `CONFIG.mejoras`. Apagar los seis devuelve la página al estado v2.
 B3  El diff no toca el copy, los datos, los huecos ni el orden de secciones.
     Únicas excepciones: los tres textos autorizados (M1, M6, 6.2).
 B4  Héroe: `media < 0.12`, `desv ≥ 0.015`, diferencia entre tercios ≥ 0.004.
 B5  CTA ≤ 720 px, calculadora ≤ 1000 px, `scrollWidth === clientWidth === 390`.
 B6  Fluidez ≥ 50 fps, ≤ 3 cuadros largos, ≤ 6 animaciones simultáneas.
 B7  Peso < 180 KB y ≤ auditoría + 20 KB. Peticiones externas: exactamente 3.
 B8  Sombras de una sola capa: 0. Cifras sin `tabular-nums`: 0.
 B9  `:focus-visible` en los cinco tipos de control; `outline:none` huérfano: 0.
 B10 Con `--reduce`: todo visible en estado final, órbita apagada, escena de P2
     congelada. Sin JS: texto legible y `wa.me` operativo.
 B11 Cierre: botón entre el 45 % y el 75 % del viewport, pie visible, luz sobre
     el botón ≥ 1.3 × el tercio más oscuro.
 B12 Sin `_ds/`, sin `theme.json`, sin `<link>` a CSS externo (armadura §0.1).
 B13 Contraste: ningún par prohibido; los tres tokens nuevos son los del §T y
     ninguno más (busca hex en el archivo y compáralos con la lista).
 B14 Consola limpia tras tocar héroe, calculadora, niveles, demo y cierre.
 B15 Prueba del bochorno superada (7.6).
 B16 Comparativa de seis pares de capturas entregada y mirada una por una.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 8 · HUECOS DEL DUEÑO (apartado 9) — NINGUNO NUEVO, Y ESO ES A PROPÓSITO    ║
╚═════════════════════════════════════════════════════════════════════════════╝
Este prompt **no crea huecos**: los H-1 … H-12 del §9 del v2 siguen vigentes tal
cual, con sus píldoras visibles en pantalla, y ninguno se rellena aquí. Un pase
de acabado que necesitara un dato nuevo del dueño estaría cambiando el contenido,
que es justo lo prohibido (C-1, C-3).
Los dos que siguen siendo **bloqueantes de publicación** y conviene recordarle:
 H-1 el número de WhatsApp (hoy `573001234567`, placeholder visible) y
 H-2 la ciudad [[CIUDAD]]. La landing se puede mejorar entera sin ellos; no se
 puede publicar sin ellos.
Lo único que este archivo le pide al dueño es un **veredicto por canal** (§9).

╔═════════════════════════════════════════════════════════════════════════════╗
║ 9 · QUÉ REPORTAR PARA QUE LA CASA APRENDA                                  ║
╚═════════════════════════════════════════════════════════════════════════════╝
Al entregar, deja escrito (va a `ORION/memory/landings/state.json` y a la columna
"Resultados" de `referencias/_INDEX.md`):
 · Qué pases se aplicaron, cuáles se OMITIERON por "ya cumple" y cuál se revirtió
   por conflicto de criterio.
 · Qué número movió cada pase (de la tabla 2.D), no adjetivos.
 · El veredicto del dueño **en móvil y en escritorio por separado**, con su
   causa. Preguntas concretas que hay que hacerle:
   (1) el fondo con relieve (P1) se lee como "mejor" o como "más oscuro";
   (2) la escena dirigida por scroll (P2) le pareció elegante o mareadora;
   (3) la vista previa del mensaje (M1) le da confianza o le estorba;
   (4) el cierre rematado (P6) le parece un final o le sigue faltando algo.
 · Si el medio respetó la armadura (§0): eso se acumula por herramienta.

╔═════════════════════════════════════════════════════════════════════════════╗
║ 10 · RELACIÓN CON LOS DOCE APARTADOS DE UN PROMPT DE LANDING               ║
╚═════════════════════════════════════════════════════════════════════════════╝
Este archivo es un prompt de MEJORA, no un prompt de landing completo. Los
apartados 1 (el negocio), 2 (quién mira y qué debe hacer), 3 (evidencia real),
4 (estructura sección por sección), 7 (restricciones técnicas) y 8 (prohibido)
**no se repiten aquí a propósito**: siguen mandando los del v2 sin un solo
cambio, y duplicarlos abriría la puerta a que se desincronicen — que es
exactamente cómo caducó el prompt anterior de la casa (`landings/KN-011`).
Los que sí se elevan viven aquí: 5 (registro visual) en P1 y P5, 6 (interacción)
en P2, P3 y P4, 9 (huecos) en §8, 10 (criterios) en §7 y en cada pase, 11
(referencias) en §5, 12 (móvil) en §6.
═══════════════════════════════════════════════════════════════════════════════


