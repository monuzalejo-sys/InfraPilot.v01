---
slug: imprenta-desde-html
titulo: Imprenta desde HTML y Chrome (curvas, sangrado, QR, tarjetas numeradas, precios a marcador)
alias: [imprenta, imprimir, mandar a imprimir, para imprimir, pieza impresa, kit de imprenta, pdf para la imprenta, pdf pixelado, pixelado, pixeles, imagenes escondidas, raster, ghostscript, trazar, trazar.mjs, pasar a curvas, en curvas, texto en curvas, outline, vectorizar, vector, eps, illustrator, corel, la imprenta dice que trae fuentes, sangrado, sangre, linea de corte, magenta, merma, chrome redondea, 0,2 mm, sticker, sello de caucho, sello, vaso, letrero, plantilla del proveedor, tarjeta 9x5, rompetrafico, carta 21x27, tabla de acrilico, acrilico, marcador, tiza liquida, casilla del precio, precio a mano, lado dia lado noche, superficie permanente, qr, codigo qr, qr impreso, cartel con qr, qr reducido, 3 cm, dominio sin dns, cname, dig, github pages, rehacer el qr, tarjetas numeradas, tarjetas secretas, un solo diseno, casilla en blanco, sello numerador, plastificado mate, repuestos, zip para imprenta, damero, pattern svg, sombra borrosa]
preguntas: ["¿qué medidas y archivos le mando a la imprenta si el PDF lo saco de Chrome?", "¿por qué la imprenta dice que el PDF trae fuentes si ya lo habíamos pasado a curvas?", "¿por qué el PDF que sale de Chrome sale pixelado y cómo lo paso a vectores?", "¿qué reviso antes de mandar a imprimir un QR para que no toque rehacerlo?", "¿cómo dejo el precio en un tablero de acrílico para que lo cambien con marcador?", "¿cómo mando a imprimir 50 tarjetas numeradas sin pagar 50 diseños?"]
proyectos: [duo-burguer, que-cremoso]
confianza: alta
actualizado: 2026-11-02
---

# Imprenta desde HTML y Chrome

## Respuesta corta

1. Entrega **vector en curvas con sangrado**: medida final + 2 mm, corte aparte en magenta, `-vista.png`.
2. Prueba: render, trazar a curvas, comprobar (0 fuentes, 0 imágenes, QR legible, texto en zona segura); otro render borra el trazado: **comprueba la carpeta final antes del ZIP**.
3. **Un QR impreso no se corrige**: resuelve la dirección, ábrela en un celular, léelo reducido a 3 cm y apúntalo al dominio propio.
4. **Lo que cambia (precios, platos) no se imprime** en superficies permanentes: deja casilla para marcador.
5. **Tarjetas numeradas: un solo diseño**, casilla del número en blanco.

## Por qué (qué lo pagó)

- **PDF de Chrome con píxeles ocultos (2026-09-24).** La primera tanda del kit de Duo traía hasta **116 imágenes escondidas** en los PDF; la imprenta trabaja con vectores y tendría que vectorizar. Salen en píxeles los fondos CSS repetidos (damero, rayas), `box-shadow` con difuminado, `<pattern>` de SVG y `filter`. Un solo trazo al 50 % dentro de un ícono hacía que Ghostscript aplanara una cara entera del EPS en una foto, y se descartó el EPS. Con la herramienta de curvas las 10 piezas pasaron a vector puro: 0 fuentes, 0 píxeles, iguales al original, con los degradados del logo conservados.
- **Trazado deshecho (2026-09-25).** Tras una ola de agentes la carta quedó sin pasar a curvas porque el último render reescribió el PDF después del trazado; se vio en la revisión final, no por el pipeline. Con la comprobación al final, el 2026-10-01 las tarjetas salieron comprobadas.
- **QR a un dominio sin DNS (2026-09-13 a 09-15).** Se entregó un cartel A5 listo para imprimir con QR a un subdominio `.com` que nunca tuvo DNS: faltaba un CNAME que solo el dueño podía crear, y 17 horas después todavía no existía. Dos días después se movió la carta al dominio propio de Duo, se rehízo el QR («el anterior no se debe imprimir»), y la impresión solo quedó libre cuando el dueño aclaró que ese dominio era suyo para ese negocio. Aparte, un QR de 46 mm falló al reducirlo a 30 mm; a 43 mm pasa, y con texto encima no leía.
- **Precios en superficies permanentes (2026-09-23).** Para la tabla de acrílico de 100×100 el dueño pidió «solo el espacio marcado de donde iria el precio para llenarlo con un marcador», con lado noche y lado día («oscuro mas no indiferenciable»); el 09-24 la rehízo dinámica y quedó como tablero de la casa sin platos ni precios impresos.
- **Tarjetas numeradas (2026-10-01).** Claude había entregado 50 diseños numerados (PDF de 50 páginas) y el dueño corrigió: «tiene que ser solo un diseño». Se rehízo con un frente, un reverso y 55 tarjetas iguales.
- **Medida real (Qué Cremoso, 2026-11-02).** Sticker de 6 cm, sticker de 4 cm, tarjeta 9×5 y sello de 40 mm pasaron la prueba de imprenta; los de 6 cm, 4 cm y el sello midieron 0,2 mm menos y la tarjeta 0,2 mm menos de ancho, todo dentro del sangrado.

## Cómo se aplica

1. **Pregunta primero qué formato pide la imprenta.** Si acepta PDF con fuentes incrustadas, nada de esto es obligatorio; si pide vector, sigue.
2. **Dibuja en vector lo que Chrome rasteriza.** Damero, rayas y tramas forma por forma, recortadas a su caja; sombras duras en lugar de difuminadas; sin `pattern` ni `filter`; íconos en colores sólidos **sin opacidad** (un pliegue al 50 % se pre-mezcla como color sólido).
3. **Pasa cada PDF a curvas con Ghostscript (versión WASM, `-dNoOutputFonts`) y comprueba:** 0 fuentes, 0 imágenes, y que se vea igual que el original. Homebrew ya no trae Ghostscript precompilado para macOS 13. **Entrega PDF en curvas, no EPS.**
4. **Orden fijo:** render → trazar → comprobar. Corre la comprobación sobre la carpeta que va al ZIP, no sobre la de una corrida anterior.
5. **Medidas:** medida final + 2 mm de sangrado; línea de corte en un archivo aparte (magenta); `-vista.png` con el corte encima. Sello de caucho: una tinta, negro, al derecho (lo invierte quien lo fabrica). Vaso y letrero no se producen sin la plantilla del proveedor y las medidas de la fachada: se piden como hueco.
6. **QR antes de imprimir:** (a) resuelve la dirección (`dig` o `curl`) y ábrela en un celular; si falta un registro DNS, dale al dueño la tabla exacta (Tipo, Nombre, Apunta a) y vuelve a comprobar antes de decir que está en vivo; (b) confirma con el dueño qué dominio es de ese negocio y apunta a él, no a `github.io`, para que el cartel sobreviva a una mudanza; (c) lee cada QR con su dirección, también reducido a 3 cm; (d) si la dirección cambia, se rehace y el anterior no se imprime.
7. **Superficie permanente (acrílico, tablero): imprime solo lo estable** (marca, lema, horario, dirección). Casilla vacía y clara en ambas caras para que el marcador se vea igual de día y de noche; marcador negro de día, tiza líquida de noche; el lado noche oscuro pero diferenciable. El papel que se reimprime (carta 21×27) sí lleva precios, comprobados plato por plato contra la fuente de datos.
8. **Tarjetas numeradas o coleccionables:** UN diseño con la casilla del número vacía (ventana amplia para marcador permanente o sello numerador) y ~10 % de repuesto (55 para 50). Nada que dependa del número (color por familia, regalo) va impreso. La ficha dice cómo numerar (01–50, sin repetir, probar en una de repuesto) y el acabado: plastificado mate, nunca brillante sobre el QR.
9. **Lo estético manda sobre lo técnico:** que pase los comprobadores no es aprobar; mira cada pieza al tamaño real y pregunta si llama la atención desde la calle ([[TEMA-gusto-visual-del-dueno]]). Para Duo, sin teléfono ni Nequi (la web y el horario sí).

## Cuándo NO aplica

- **Impresión casera, piezas solo digitales o PDF de uso interno:** el texto vivo no es problema y no hace falta sangrado ni curvas.
- **Diseño hecho directamente en Illustrator o Corel:** el problema de píxeles ocultos no existe.
- **Proveedor con su propia plantilla:** esa manda sobre estas medidas.
- **QR de pruebas que no se imprime:** basta que lea. Si el dominio no está bajo tu control, no inventes un subdominio: avisa al dueño con la tabla de registros que le toca crear.
- **Precios a marcador:** no aplica a papel que se reimprime seguido ni a datos que no cambian. **Tarjetas:** no aplica si la numeración es parte del arte (lotes de lujo, serigrafía numerada) o la imprenta ofrece numeración variable barata.
- Los 0,2 mm de merma son una medición en esta Mac con este Chrome; si cambia el motor, vuelve a medir.

## Evidencia

- «La primera tanda traía hasta 116 imágenes escondidas, y eso le toca vectorizar a la imprenta.», «Con eso, Ghostscript convierte la cara entera del EPS en una foto» y «Las 10 pasan: vector puro en curvas, 0 fuentes, 0 píxeles, iguales al original.» — ventana [[2026-09-09-duo-burger|Duo Burger]] (transcrito `51184930`, 2026-09-24). Medición detallada en la memoria del dueño reference_imprenta_vector_curvas.
- «La carta quedó sin pasar a curvas: el último render reescribió el PDF después del trazado.» (2026-09-25) y «Comprobado: todo en vector y en curvas, el QR se lee y nada se sale del margen.» (2026-10-01) — misma ventana (`51184930`).
- «La carta está publicada y lista para duoburguer.prommter.com, pero todavía no abre para nadie.» (2026-09-13), «Lo acabo de revisar y todavía no existe.» (09-13), «El QR, rehecho… El anterior no se debe imprimir.» (09-15) y «cada QR leído con su dirección, también reducido a 3 cm» (09-23) — misma ventana (`51184930`).
- «quiero que dejes solo el espacio marcado de donde iria el precio para llenarlo con un marcador» y «quiero que lo de la noche sea oscuro mas no indiferenciable» (2026-09-23); «Todo se escribe a mano: de día con marcador negro, de noche con tiza líquida.» (09-24) — misma ventana (`51184930`). El mensaje «dinámica, que no sea fija… útil para nosotros para cambios» está recogido en la memoria del dueño feedback_imprenta_llamativa; no aparece literal en el resumen de la ventana.
- «espacio en blanco en el numero de la tarjeta por que tiene que ser solo un diseño» y «La ficha técnica pide 55 tarjetas iguales, sin numerar» — misma ventana (`51184930`, 2026-10-01).
- «miden 0,2 mm menos de lo pedido, porque Chrome redondea la página» y «Todas pasaron la prueba de la imprenta: cero fuentes y cero píxeles.» — ventana [[2026-10-31-que-cremoso-marca|Qué Cremoso marca]] (transcrito `72ffaa4c`, 2026-11-02 17:47).

## Enlaces

- [[TEMA-gusto-visual-del-dueno]] — por qué lo correcto técnicamente no basta: más color y más mensaje.
- [[TEMA-marca-de-un-cliente-nuevo]] — de dónde salen las piezas al cerrar la marca.
- [[TEMA-pantalla-publica]] — el lado web de las mismas marcas.
- [[TEMA-dominio-migraciones-y-copias]] — dominios y DNS.
- [[TEMA-olas-de-agentes]] — la ola que dejó la carta sin curvas.
