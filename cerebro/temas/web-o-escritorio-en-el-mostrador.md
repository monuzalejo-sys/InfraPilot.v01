---
slug: web-o-escritorio-en-el-mostrador
titulo: "¿Web o programa instalado? Qué frena de verdad un sistema web en un mostrador"
alias: [web o escritorio, web o aplicacion, aplicacion de escritorio, programa instalado, instalado en el computador, navegador, en el navegador, app nativa, app movil, pwa, instalar la app, sistema web, sistema en la nube, nos frena, que problemas tiene la web, delta, siigo, siigo nube, pago unico, mensualidad, suscripcion, sin internet, se cae el internet, impresora termica, imprimir recibo, kiosk printing, bascula, web serial, lector de codigo de barras, pistola, scanner, cajon monedero, localstorage, cambio de dominio, se perdieron las ventas, actualizar el sistema, llave privada, firmar documentos, certificado digital, factura electronica desde el navegador]
preguntas: ["¿nos frena en algo que el sistema sea web, o sirve igual que un programa instalado?", "¿el navegador puede hablar con la impresora térmica, la báscula y la pistola?", "¿por qué el cliente prefiere un programa instalado con pago único?", "¿qué pierde un sistema web frente a Delta?", "¿puedo emitir factura electrónica desde una página en el navegador?", "¿qué se rompe si cambio el dominio de la caja?"]
proyectos: [la-villa, placita, mercaplaza, villa-broaster, duo-burguer, prommter]
confianza: alta
actualizado: 2026-11-11
---

# ¿Web o programa instalado? Qué frena de verdad un sistema web en un mostrador

## Respuesta corta

**Para un mostrador, un sistema web bien construido empata con un programa
instalado en todo lo que importa, y gana en lo que hace que un cliente se cambie
—verlo desde el celular—. Pero solo si se construye local primero.** Lo que
frena no es «ser web»: es ser **una página sin servidor**, que es otra cosa.

Lo que sí cuesta de verdad, y hay que decirlo antes de vender:

1. **Sin internet se puede cobrar, pero no sale gratis.** Hay que construir
   almacén local + cola de subida desde el día uno. Ver [[la-caja-no-puede-parar]].
2. **El hardware del mostrador ata el sistema a Chrome en un computador.**
   Impresora térmica y báscula (Web Serial) funcionan, pero no en el celular ni
   en Safari, y hay que probarlas en papel, no en pantalla.
3. **El estado local vive pegado al dominio.** Cambiar de dominio borra la caja
   si no se migra al cierre y con la cola en 0.
4. **Mensualidad contra pago único.** Es la objeción comercial real, no técnica.
5. **Una página sin servidor no puede firmar nada**: ni factura electrónica, ni
   candado de permisos, ni que dos aparatos se vean.

## Por qué (qué lo pagó)

- **Mercaplaza/placita está en producción con un dueño usándolo todos los días**,
  en web: caja en `caja.mercaplaza.prommter.pro`, VPS propio, báscula
  ACS-TAE-30 leída por **Web Serial**, recibo térmico. Prueba de que se puede.
- **Y pagó las tres trampas:** el recibo se cortaba porque el rollo de 58 mm solo
  imprime 48 (28-oct-2026); el estado de la caja vive en `localStorage` **del
  origen**, así que la mudanza de dominio se hizo al cierre y con la cola de
  ventas en 0; y la sincronización tiene reglas que no se pueden copiar a medias
  (ver [[la-caja-no-puede-parar]]).
- **Delta, en el Cauca, se elige por tres cosas** y solo una es técnica: pago
  único, funciona sin internet, y **es el programa del contador**. La tercera no
  la arregla ninguna arquitectura. Ver [[reference-delta-cauca]] / la
  investigación `2026-11-02-que-tiene-delta-y-por-que-lo-eligen`.
- **Y se van de Delta por una sola razón: no lo pueden ver a distancia.** Migran
  a Siigo Nube. O sea: el mercado ya decidió que la nube vale la mensualidad
  cuando el dueño quiere mirar desde el celular. Ese es nuestro terreno.
- **La Villa, 11-nov-2026.** Al preguntar por factura electrónica quedó claro el
  límite exacto: firmar exige una llave privada, y una página que se abre en el
  navegador viaja entera al aparato de quien la abre. Ver
  `investigacion/2026-11-11-emitir-nosotros-la-factura-electronica`.

## Cómo se aplica

1. **No confundas los dos «web».** Página suelta (HTML + localStorage) = maqueta
   que cobra, sirve para enseñar y para que el dueño se acostumbre. Sistema web
   (servidor + base + local primero) = lo que reemplaza a Delta. Decir «ya está
   en web» cuando es lo primero es prometer lo segundo.
2. **Construye local primero o no construyas.** Un mostrador que depende de
   internet cierra cuando se cae, y eso pasa.
3. **Pregunta el hardware ANTES de prometer:** qué impresora (ancho imprimible
   real), qué báscula, qué pistola, si hay cajón monedero. El navegador habla con
   casi todo, pero solo en Chrome de escritorio y con permiso del usuario.
4. **Fija el dominio antes de que entre la primera venta.** Mudarlo después es
   una operación con riesgo de perder la caja del día.
5. **No pelees con el pago único: véndele lo que el instalado no puede** —verlo
   desde el celular, una caja nueva sin licencia, actualizaciones sin ir al
   local, la vitrina conectada al mismo catálogo— y di la mensualidad de frente.
6. **No prometas «app»** solo porque suene más serio. Lo que el cliente llama app
   casi siempre es «que abra con un icono»: eso lo da una PWA instalable, no un
   desarrollo nativo.

## Lo que NO dice este tema

No dice que web gane siempre. Para un negocio sin internet estable, sin ganas de
mirar a distancia y con un contador casado con su programa, **el instalado es la
respuesta correcta** y conviene decirlo en vez de vender lo nuestro.
