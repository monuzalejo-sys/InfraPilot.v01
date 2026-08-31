---
slug: aprendizajes-de-placita-mercaplaza
titulo: Lo que placita/Mercaplaza enseñó pagando — lecciones del POS y la vitrina de la frutería
alias: [placita, mercaplaza, mercaplaza nariñense, mercaplaza nariñense familiar, fruteria, frutería, vitrina de frutas, landing de frutas, landing minimalista rechazada, la landing es una basura, POL-001, minimalismo rechazado, portada que vende, dar antojo, vender antojo, no inventar numeros, nunca se inventa un numero, precio en tienda, evidencia comprobable, prompt con adjetivos, prompt con numeros, encargo interpretable, medir el build, medicion de terreno, pliegue, primera tarjeta, prohibido partir de cero, html suelto, rediseño desde cero, mejorar archivo por archivo, bascula, báscula, web serial, ACS-TAE-30, venta por peso, venta al gramo, kardex, dias de surtido, surtido martes y viernes, pulpas, sla de pulpas, un solo cta, cta unico, android gama media, 390px, dropshoping.com.co, repo placita, C:\Users\Kalel\placita, fotos mercaplaza, fotos heic]
preguntas: ["¿qué se aprendió con placita/mercaplaza?", "¿por qué el dueño rechazó la landing minimalista?", "¿cuándo aplica el manifiesto minimalista y cuándo no?", "¿cómo se escribe un prompt de diseño que sí cambie la página?", "¿por qué está prohibido rehacer la portada desde cero?", "¿qué números puede afirmar una landing sin inventar?", "¿dónde vive el repo de placita y dónde están las fotos de mercaplaza?", "¿cómo se mide una landing antes de opinar sobre ella?"]
proyectos: [placita]
---

Placita es el sistema real de "Mercaplaza Nariñense Familiar": frutería que vende
por peso (gramos enteros, báscula ACS-TAE-30 leída por Web Serial), con catálogo
web, pedidos desde el celular y caja. **Repo autoritativo: `C:\Users\Kalel\placita`
(PC Windows) · producción: https://dropshoping.com.co/catalogo**. No hay repo git
de placita en la Mac; aquí solo están los prompts (`ORION/prompts-landing/placita-mercaplaza.md`
y `-v2.md`), 111 fotos HEIC del negocio en `~/Downloads/mercaplaza docs` (con copia
en `~/Documents/respaldo-proyectos-20260831/`) y la reliquia `placita_pos_system.html`.

## Lección 1 — El minimalismo tiene dueño y lugar (POL-001, pagada el 2026-08-05)

El dueño rechazó la portada minimalista con estas palabras: "la landing que haces
es una basura... muy minimalista... quiero que esta landing sea más interactiva,
más llamativa, es para vender frutas". La regla que quedó: el manifiesto "El
estudio del ingeniero moderno" gobierna el **interior** de la app, donde el cajero
trabaja seis horas; la **portada** tiene un solo trabajo — dar antojo y recibir el
pedido. Un mismo producto puede exigir dos registros visuales opuestos, y volver
al registro rechazado es reincidir, no refinar. La decisión quedó escrita en el
propio código (globals.css, sección Landing) para que ningún rediseño la deshaga.

## Lección 2 — Encargo con adjetivos = página igual; encargo con números = cambio

v1 del prompt decía "que tenga movimiento" y "usa la paleta que ya está": cada
quien lo interpretó a su manera y la página quedó igual — el dueño volvió a pedir
lo mismo el 2026-08-19. v2 corrigió el método: inventario **cerrado** de
animaciones, tabla de color con contraste **medido**, y medidas del pliegue
tomadas sobre el build real (viewport 390×844 por CDP). El diagnóstico que mandó:
la primera tarjeta de producto aparecía a 2,4 pantallas de scroll. Se opina
después de medir, y lo numerado no se negocia; lo que falta se marca como hueco
del dueño, no se rellena.

## Lección 3 — Prohibido partir de cero

Un HTML suelto o un rediseño en otra ruta "queda bonito" pero pierde el flujo
vivo (celular arma carrito → POST /api/pedidos → la caja recibe → el celular
consulta estado cada 15 s): eso es entregar nada. `placita_pos_system.html` es el
fósil de ese anti-patrón. La portada se mejora archivo por archivo sobre lo que
ya funciona y está desplegado.

## Lección 4 — Nunca se inventa un número

Cero precios en el repo a propósito: el precio mostrado es el que la caja publicó
en vivo; si no hay catálogo publicado, `precioCop = null` y la tarjeta dice
"Precio en tienda". Nada de testimonios, estrellas, "años de experiencia" ni
"más de X pedidos" que el repo no pueda probar. Lo que sí se afirma, con
respaldo: 39 productos ("los que el dueño canta, en su orden"), surtido martes y
viernes con cuenta viva de días, pesado al gramo delante del cliente, pago en
caja al recoger, pulpa congelada de la misma fruta con SLA de un día.

## Lección 5 — Una acción, una audiencia

Un solo CTA principal (armar y enviar el pedido); "Entrar al sistema" es un
enlace discreto para quien atiende, nunca un botón que compita. Se diseña primero
para el vecino real: Android de gama media, datos limitados, 390 px, una mano y
sol en la pantalla. El activo diferencial son las 20 siluetas SVG propias de los
productos — ninguna competencia local tiene una vitrina ilustrada así.
