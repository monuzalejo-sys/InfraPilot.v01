---
slug: generadores-de-diseno
titulo: Cómo se le encarga trabajo a un generador de diseño (Claude Design y equivalentes)
alias: [claude design, generador, disenador ia, landing, vitrina, portada, artboard, lienzo, design system, ds, modernist, maqueta, mockup, dc.html, prompt de diseno, figma]
preguntas: ["¿qué le doy a Claude Design para que haga webs de más calidad?", "¿por qué el diseño que me devolvió se ve genérico y apagado?", "¿cómo evito que me cambie la paleta?", "¿por qué no se movió nada de lo que pedí?", "¿cómo hago un prompt de landing que no falle?"]
proyectos: [landings, villa-broaster, orama, pollo-landing]
confianza: alta
actualizado: 2026-08-24
---

# Cómo se le encarga trabajo a un generador de diseño

## Respuesta corta

Un generador de diseño no es un diseñador con criterio: es un ejecutor con **sesgos
propios que le ganan a tu encargo si no los bloqueas por escrito**. Tres reglas, en
este orden. **(1) Prohíbele su design system**: si no se lo prohíbes en imperativo,
ancla uno genérico —claro, plano, tipografía neutra— y ese sistema le gana a tu
dirección de arte. **(2) Escribe para un lienzo quieto**: devuelve láminas
estáticas, así que todo lo que describas como movimiento hay que describirlo
además en su **estado congelado**; la coreografía real va en un anexo aparte,
dirigida al programador, no al generador. **(3) Dale materia prima medida, no
adjetivos**: hex, píxeles, grados, contrastes calculados y las fotos reales; lo que
dejes en adjetivos ("moderno", "llamativo") lo resuelve con su promedio, y su
promedio es exactamente lo genérico que vas a rechazar.

## Por qué (qué lo pagó)

Lo pagó una landing rechazada. El 2026-08-23 se ejecutó en Claude Design el prompt
v2 de la vitrina de Villa Broaster —bien investigado, con datos reales y orígenes
`archivo:línea`— y el dueño lo rechazó en móvil: *"todo se ve muy genérico,
apagado; quiero mejor fondo, animaciones más vivas"*. Al abrir el entregable
aparecieron las dos causas, medibles:

- El zip traía una carpeta `_ds/modernist-<uuid>/` que **el generador se autoimpuso**:
  fondo `#f3f2f2`, radio 0, tipografía Archivo y una instrucción explícita de
  imprimir las fotos en blanco y negro. Nuestra dirección era oscura y cálida: el
  design system ajeno la aplastó, y la portada salió crema con el titular casi
  invisible.
- `document.getAnimations()` devolvió **1** en toda la página. El inventario de diez
  animaciones del prompt (fondo que cambia por producto, promo que se arma, foco que
  calienta) no existió nunca: el medio no anima, compone.

De los tres mecanismos que se le pidieron, uno **no se ejecutó**, otro quedó
**invisible** (dependía de un gesto) y solo sobrevivió el que **se ve quieto en una
captura**: el "dato grande + línea".

## Cómo se aplica

1. **Armadura arriba del todo**, antes de los datos: prohibido anclar, adjuntar,
   generar o "derivar" cualquier design system; los tokens salen de tu apartado de
   paleta y de ningún otro lado; prohibido el fondo claro a pantalla completa si tu
   dirección es oscura; prohibido convertir las fotos a blanco y negro o desaturarlas.
2. **Autochequeos que el propio generador se aplica antes de entregar**, redactados
   como preguntas verificables: *"abre tu lámina: ¿el fondo de la portada es oscuro?
   Si es claro, está mal"*. Un criterio que el ejecutor puede comprobar solo vale más
   que diez adjetivos.
3. **Estado congelado obligatorio**: cada vez que describas movimiento, describe
   también cómo se ve detenido (la pieza siguiente asomando cortada por el borde, la
   promo a medio armar, el foco ya puesto sobre el producto).
4. **Anexo de coreografía aparte**, con milisegundos y curvas, dirigido a quien
   programe después. No se le pide al lienzo.
5. **Entrega por pantallas** (portada, catálogo, detalle, carrito, confirmación) con
   propósito de venta por pantalla, no "una landing".
6. **Todo dato de negocio con origen `archivo:línea`**, lo de ejemplo marcado como
   ejemplo dentro del propio diseño, y lo que falta como **hueco numerado** — nunca
   relleno verosímil (ver [[TEMA-cero-datos-inventados]]).
7. **Revisa con evidencia, no de memoria**: capturas a 390×844 por CDP y una medición
   (`getAnimations()`, `scrollWidth` vs `clientWidth`) antes de dar un veredicto.

## Cuándo NO aplica

- **En el interior de una app de trabajo** la dirección se invierte: ahí manda la
  calma del manifiesto del estudio, no la venta. La señal es quién mira la pantalla:
  trabajador adentro = calma; cliente afuera = venta.
- **Si el generador SÍ produce código vivo** (no láminas), la regla 2 se relaja y la
  coreografía vuelve al encargo principal. Verifícalo midiendo, no suponiendo.
- **Cuando el dueño autoriza datos de demostración** para una maqueta comercial, el
  contenido inventado se especifica completo —una demo con huecos no vende— pero se
  marca como ficticio en dos sitios, para que el cliente final no crea que su
  inventario ya está cargado.

## Evidencia

- `landings/KN-007` — el design system ajeno, con el contenido de `_ds/modernist-*/readme.md`.
- `landings/KN-008` — el lienzo estático, medido con `document.getAnimations()` = 1.
- `landings/KN-009` — la portada clara mata el hambre en comida.
- `landings/POL-004` — las dos piezas fijas obligatorias en todo prompt a un generador.
- `landings/POL-001` — tensión de registro: calma adentro, venta afuera.
- `landings/POL-002` — datos de demo autorizados se marcan dos veces.
- Prompts comparables: `ORION/prompts-landing/villa-app-villa-broaster-v2.md` (rechazado)
  y `...-v3.md` (con armadura y anexo).
- Biblioteca de mecanismos con su veredicto por ficha: `ORION/prompts-landing/referencias/_INDEX.md`.

## Enlaces

- [[TEMA-cero-datos-inventados]] — la regla que gobierna el contenido de cualquier página pública.
- [[TEMA-verificar-con-evidencia]] — cómo se mide un resultado visual en esta máquina.
