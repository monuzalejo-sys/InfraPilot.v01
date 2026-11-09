---
slug: html-de-artifact-como-archivo
titulo: Una página escrita como Artifact se rompe al servirla como archivo (charset, arranque en blanco, contador en cero)
alias: [string.replace, replace con dolar, dolar dolar, replacement pattern, parche por sustitucion, parchear html, parchear con node, forEach is not a function, selector roto, cambiar de persona en celular, display none en movil, pliegue, above the fold, getBoundingClientRect, 375, prueba en celular, DOM sucio, artifact, artefacto, artefacto.html, cuerpo de artifact, html suelto, archivo suelto, charset, utf-8, utf8, doctype, quirks, modo quirks, tildes rotas, emojis rotos, caracteres raros, dÃ­gito, mojibake, codificacion, codificacion rota, python http.server, servidor estatico, meta charset, viewport, file://, doble clic, pantalla en blanco, sistema en blanco, recargar, arranque, abrir(), var hoisting, requestAnimationFrame, raf, document.hidden, contador en cero, contador animado, cifra en cero, animacion de numeros, setTimeout, pestana en segundo plano]
preguntas: ["¿por qué mi parche con replace convirtió dólar-dólar en un solo dólar y el sistema quedó en blanco?", "¿cómo pruebo que un botón es alcanzable desde el celular?", "¿por qué quedó pintado lo del turno anterior al cambiar de persona?", "¿por qué en mi página se ven las tildes y los emojis rotos cuando la publico?", "¿por qué se ve bien con doble clic y mal cuando lo sirvo?", "¿qué le falta a un html que salió de un Artifact para guardarlo como archivo?", "¿por qué el sistema arranca en blanco cuando recargo con el turno abierto?", "¿por qué el contador se queda en $0 si la pestaña no está al frente?", "¿cómo compruebo un html antes de entregarlo al cliente?"]
proyectos: [la-villa]
confianza: alta
actualizado: 2026-11-09
---

# Una página escrita como Artifact se rompe al servirla como archivo

## Respuesta corta

1. Todo HTML que salga de un Artifact y vaya a vivir como archivo (repo, VPS, entrega al cliente) se arregla al guardarlo: `<!doctype html>`, `<html lang="es">`, `<head>`, `<meta charset="utf-8">` y el viewport. El armazón del Artifact los pone; el archivo guardado NO los lleva.
2. Compruébalo **sirviéndolo** (`python3 -m http.server`), no con doble clic: desde `file://` Chrome adivina la codificación y el fallo no se ve.
3. El arranque del script (reabrir el turno, pintar la primera pantalla) va **al final**, después de todas las definiciones.
4. Un contador animado con `requestAnimationFrame` necesita un `setTimeout` que pinte el valor final; rAF puede no disparar nunca aunque `document.hidden` sea `false`.

## Por qué (qué lo pagó)

- **Charset.** Sin charset por HTTP, cada tilde y emoji sale roto («dÃ­gito», «ðŸ“¦»); sin doctype la página entra en modo quirks. Pasó con `sistema.html` y dos demos de La Villa (2026-11-08).
- **Arranque en blanco.** `sistema.html` reabría el turno guardado con `abrir()` en mitad del script, unas 400 líneas antes de asignar el mapa `var PINTA = {...}`. Bastaba con que el cajero recargara con el turno abierto para que el sistema arrancara en blanco, sin aviso en pantalla (el error solo salía en consola).
- **Contador en cero.** La animación usaba rAF con la guarda `if(reduce || document.hidden) pinta(final)`. Medido: rAF puede no disparar con `document.hidden === false` (panel que no pinta, ventana tapada, segundo plano). En una caja, un $0 es peor que no mostrar nada. Arreglo: `setTimeout(..., dur+120)` que pinta el final (sí dispara en segundo plano) y una bandera para que una animación que arranca tarde no vuelva a poner el número en cero.

## Cómo se aplica

1. Al guardar un Artifact como archivo, añade el esqueleto completo (doctype, `lang`, charset, viewport) antes de cualquier otra cosa.
2. Barrido: `grep -L -i 'charset' $(find . -name '*.html')` lista los que no lo declaran.
3. Prueba de servir: levanta un servidor estático sin charset, abre la URL, recarga con estado guardado (turno abierto) y pon la pestaña en segundo plano.
4. En scripts largos: definiciones primero (mapas, funciones), `init()` y reapertura de estado al final.
5. Animaciones de cifras: valor final garantizado por temporizador, no solo por rAF.

6. **Parchear por sustitución de texto: el reemplazo es una FUNCIÓN.** `s.replace(ancla, () => nuevo)`, nunca `s.replace(ancla, nuevo)`: en el reemplazo-cadena el doble dólar pasa a un dólar (y `$&`, `$1` se interpretan), así que la llamada a `$$('.hoja')` quedó `$('.hoja')` y el sistema arrancó en blanco con `$(...).forEach is not a function`. Compilar con `new vm.Script`, contar llaves o `<script>` salió todo en verde; solo lo vio abrir el navegador y leer la consola. Barrido: `grep -n '\$(.\{0,45\}\.forEach'` (descartar los `.map` sobre arreglos).
7. **Móvil de verdad (375×812), tocando botones y midiendo:** todo control de salida (cambiar de persona, entregar caja) debe existir bajo 1000 px; `getBoundingClientRect()` 0×0 delata un `display:none`. La primera cifra debe quedar dentro del pliegue (mide `top` < 812; estaba en 842, quedó en 519). Al abrir sesión se limpian todas las secciones (quedaban 17 KB de Productos, 5 KB de Impuestos y 1 KB de Archivo del contador del turno anterior).

## Cuándo NO aplica

- GitHub Pages sí manda `charset=utf-8`: lo publicado ahí no se ve roto. El riesgo es con otro servidor (VPS, host estático sin charset) y al abrir el archivo en otro contexto; igual se arregla, porque nadie garantiza dónde terminará.
- Una animación puramente decorativa puede quedarse sin red de seguridad; la regla es para cifras que el usuario lee (dinero, conteos).

## Evidencia

- `la-villa/KN-004` (los tres fallos y su arreglo).
- Medición 2026-11-08: 14 de 410 archivos `.html` del ecosistema no declaran charset, con entregables reales: `agenda/tablero.html`, `prommter/contenido/mercaplaza/marca/manual.html`, `prommter/que-cremoso-repo/marca/tablero.html`, `prommter/la-villa-repo/vitrina/vitrina.html`, `vitrina/publicar/index.html`, `prommter/Equipo-villa-broaster/docs/plan-equipo.html` y los `artefacto.html` de duo-burguer.
- `la-villa/KN-006` (el doble dólar, dos veces en el mismo run) y `la-villa/KN-007` (tres fallos solo visibles a 375 px), 2026-11-09.
- Archivo del fallo: `prommter/la-villa-repo/docs/sistema.html`.

## Enlaces

[[caja-y-turnos]] · [[como-entregar-al-dueno]] · [[imprenta-desde-html]]
