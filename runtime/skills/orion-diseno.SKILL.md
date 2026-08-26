---
name: orion-diseno
description: "Sistema de diseño 'El estudio del ingeniero moderno' — manifiesto visual del usuario para InfraPilot y productos afines. Usar SIEMPRE que se diseñe o rediseñe UI (landing, dashboard, componentes): paleta cálida exacta, tipografía con aire, componentes como objetos físicos, botones-herramienta, composición editorial, IA como compañero silencioso. Incluye las prohibiciones explícitas del usuario."
---

# El estudio del ingeniero moderno

> "No es un ERP. No es un software. Es el lugar donde nacen los proyectos."
> Al abrirlo, el ingeniero debe pensar: **"Qué tranquilidad trabajar aquí."**

La interfaz reduce el estrés. No impresiona con efectos. Imagina entrar a un
estudio de arquitectura: luz natural, madera clara, concreto pulido, acero
cepillado, planos sobre una mesa, una pantalla impecablemente organizada.

## Paleta (EXACTA — no inventar variantes)

```css
:root {
  --bg: #F8F6F2;        /* fondo — blanco cálido, NUNCA blanco puro */
  --card: #FCFBF8;      /* superficies */
  --sidebar: #171717;   /* sidebar oscuro */
  --ink: #111111;       /* texto principal */
  --muted: #666666;     /* texto secundario */
  --border: #E7E4DE;    /* bordes */
  --hover: #F2EFE9;     /* hover de superficies */
  --ok: #4D7C59;        /* éxito — verde bosque apagado */
  --warn: #B98A3C;      /* advertencia — ocre */
  --error: #B94A48;     /* error — ladrillo */
}
```

PROHIBIDO: azules eléctricos, morados, neones, gradientes tecnológicos.
El color funcional (ok/warn/error) aparece SOLO donde comunica estado.

> **Valores exactos: `app/globals.css` manda (KN-029).** Los hex de arriba son
> el manifiesto — la referencia de intención y temperatura. Los tokens que
> InfraPilot tiene realmente implementados han derivado (`--paper: #f6f3ed`,
> `--rail: #232019`, `--ink: #1b1a17`, `--muted: #8a857c`, `--card: #fbfaf7`,
> `--ok: #5b7a5e`, `--warn: #a8623b`). Si necesitas un valor literal —
> `theme_color` de un manifest PWA, un SVG, un correo — **lee
> `app/globals.css` y usa ese**. Esta skill manda en composición, metáfora y
> prohibiciones; globals.css manda en hex. Si de verdad hay que reunificarlos,
> es una decisión del usuario, no un arreglo silencioso de builder.

## Tipografía

- Familias: SF Pro Display / Inter / Geist (system-ui stack está bien).
- **Títulos enormes, peso ligero** (font-light/normal, nunca black en títulos
  grandes), tracking levemente negativo, MUCHO aire alrededor.
- Sin exceso de información: una pantalla dice pocas cosas, bien dichas.
- Ejemplo de tono: `Buenos días, Kalel.` / `Proyecto activo` /
  `Casa Campestre — Popayán`.

## Componentes = objetos físicos de escritorio

No "tarjetas". Piezas que evocan el objeto real:
- **Presupuesto** → hoja técnica (márgenes de pliego, cabecera con folio).
- **Proyecto** → plano desplegado (marca de doblez sutil, esquinas).
- **Documentos** → archivador (pestañas, lomos).
- **IA** → libreta donde alguien dejó recomendaciones (nota al margen,
  subrayado a lápiz).
La metáfora se logra con bordes, proporciones y micro-detalles — nunca con
skeuomorfismo pesado ni texturas de imagen.

## Botones = herramientas

Cápsulas con MUCHO padding, un glifo fino delante, animación suave:
`◉ Crear proyecto` · `⌂ Nuevo presupuesto` · `✦ Analizar licitación` ·
`→ Exportar Excel`. Un solo botón protagonista por vista. Sin brillos.

## Iconografía

Solo Lucide (o trazo equivalente): fino, sin relleno, nada 3D, tamaño
contenido, mucho espacio alrededor.

## Composición

Editorial y ORGÁNICA — no cuadrícula uniforme de 20 tarjetas. Una pieza
protagonista grande, piezas secundarias asimétricas, líneas de tiempo como
elemento horizontal. Aire generoso entre bloques. Fotografía (si se usa):
concreto, acero, madera, planos, renders, drones, obra real — luz cálida,
jamás stock genérico.

## Microinteracciones

Hover: elevación 2px + sombra muy suave + transición ~180ms ease.
Nada rebota. Nada gira. Nada exagerado. Todo vivo pero sereno.

## IA — compañero silencioso

NUNCA un chat como protagonista. La IA vive dentro de las piezas, como
anotaciones contextuales de un colega:
- En presupuesto: “La excavación parece subestimada.”
- En proyecto: “Este cronograma puede reducirse 6 días.”
- En licitación: “Encontré un requisito que puede afectar la propuesta.”
Formato: nota discreta (libreta/margen), aparece sin interrumpir.

## Prohibiciones absolutas del usuario

❌ Dashboards saturados · ❌ cajas por todas partes · ❌ 15 colores ·
❌ gradientes tecnológicos · ❌ iconos gigantes · ❌ botones brillantes ·
❌ IA como chatbot principal · ❌ interfaces que parecen plantillas.

## Cómo aplicar esta skill

1. Antes de escribir UI, releer paleta + prohibiciones.
2. Definir la pieza protagonista de la vista (una sola).
3. Elegir la metáfora física de cada componente y lograrla con tipografía,
   borde y proporción — no con decoración.
4. Revisar contra la pregunta final: ¿esto transmite “qué tranquilidad
   trabajar aquí”? Si algo compite por atención sin función, se quita.
