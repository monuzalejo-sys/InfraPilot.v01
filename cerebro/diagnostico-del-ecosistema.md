---
slug: diagnostico-del-ecosistema
titulo: Diagnóstico del ecosistema (lo que solo se ve mirando las 11 memorias juntas)
alias: [diagnostico, radiografia, estado del ecosistema, contradicciones, huecos, que me falta, donde estoy ciego, deuda de conocimiento, doctrina]
fecha: 2026-08-24
corpus: 110 lecciones cosechadas de 11 memorias (102 candidatas descartadas por la puerta de calidad)
---

# Diagnóstico del ecosistema

> Producido el 2026-08-24 por 10 lectores independientes —uno por memoria— y una
> síntesis que los cruzó. **No es opinión: cada afirmación de abajo salió de
> objetos de memoria reales y se puede comprobar abriéndolos.** Es la primera vez
> que las 11 memorias se leen juntas.

## Forma del cerebro
 De las 110 lecciones, ~45 no hablan de ningún negocio sino del propio taller (agentes, modelos, verificación, herramientas de Windows). Es un activo raro —casi nadie tiene su método escrito así— pero también dice dónde se fue el tiempo. Las otras ~65 se concentran en UN solo tipo de cliente: negocio físico colombiano con caja, inventario y turnos. Ahí sí hay doctrina, y es vendible.

## La doctrina que nadie escribió como tal
 Cinco lecciones de cuatro proyectos dicen lo mismo con palabras distintas: el registro tiene que reflejar el HECHO FÍSICO, no la intención del software ni quién lo tecleó. La plata pertenece al turno del cobro (arroces), el origen del inventario lo manda el puesto y no la persona (estanco), la factura se marca impresa cuando salió el papel (placita), la jornada la fija la zona horaria del local (estanco/arroces), y lo que teclea la cajera se valida contra el rango físico del mostrador (placita). Esa es la columna vertebral del lado de negocio y hoy vive dispersa en cinco memorias. Hay prueba de que la capa transversal funciona cuando alguien la usa a mano: villa-broaster diseñó TurnoCaja desde cero apoyándose explícitamente en la regla de la arrocera. El objetivo del cerebro es que eso deje de depender de que alguien se acuerde.

## Lo que más se repite no es sabiduría, es una regla que nunca se automatizó
 Ocho lecciones en seis proyectos (placita, infrapilot, estanco, wrd, villa, orama) dicen la misma frase: "el agente muerto ya escribió; audita el disco antes de relanzar, y no lo cuentes como fallo del modelo". Se pagó al menos seis veces. Peor: los tres remedios están repartidos —git log (placita), tamaño de archivo en disco (wrd), manifiesto de ola escrito antes de los spawns (infrapilot)— y el procedimiento correcto es la UNIÓN de los tres, que no existe escrita en ninguna parte. El propio ecosistema tiene la lección que explica por qué se sigue pagando: una regla solo se cumple si se convierte en procedimiento verificable. No se la aplicó a sí mismo. Ese checklist unificado es el primer artefacto que debería salir de este cerebro.

## Segundo y tercer repetido
 CDP vs --screenshot: cinco lecciones miden lo mismo en cuatro proyectos entre el 10 y el 21 de agosto, y solo al final alguien lo empaquetó en edge-cdp.mjs. "No inventes datos": ocho lecciones en seis proyectos, y aun así infrapilot lleva una semana con un testimonio falso vivo en su página de login con el pendiente en Ready. Patrón: cada proyecto vuelve a pagar la lección de máquina porque la promoción a `permanent` es manual y llega tarde (permanent tiene 9 objetos y sessionCount 0). Regla que se cae de madura: si una lección se paga en un SEGUNDO proyecto, deja de ser del proyecto y sube sola a permanent.

## Contradicciones entre proyectos (lo más caro de todo el corpus)

1) SQL. Infrapilot sostiene desde el 2026-07-28 que en esta máquina no se pueden probar migraciones (no hay psql, ni Supabase CLI, ni Docker) y por eso 003_organizations.sql sigue sin ejecutarse, con /organizaciones y /perfil en 503 y la Etapa 5 trabada. Estanco demostró el 2026-07-29 —un día después— que con embedded-postgres se levanta un Postgres real y validó 37/37 asserts, y su lección dice explícitamente que aplica a la migración 003 de infrapilot. Casi un mes de bloqueo con la solución escrita al lado, en otra memoria. Esta es exactamente la consulta que el cerebro debía haber contestado y no existía.
2) Borrar documentos. Estanco conserva un verbo "eliminar" destructivo que reutiliza consecutivo; wrd quitó el grant de delete en el servidor para que nadie pueda borrar un gasto jamás. Los dos le venden al mismo tipo de negocio colombiano. La decisión que las reconcilia (¿factura DIAN o comprobante interno?) lleva pendiente desde julio y además condiciona el precio del software.
3) Placeholders. "Todo relleno nace bloqueante" (infrapilot) vs "el placeholder declarado no bloquea el build" (pollo-landing). Se reconcilian con una frontera que hoy está implícita: cosmético o identitario se puede parquear con pendiente bloqueante de publicación; afirmación de hecho, cifra o cualquier dato que cambie comportamiento, nunca. Si no se hace explícita, un agente elegirá la que le convenga.
4) Modelo y ceremonia. Conviven tres criterios sin síntesis: por tamaño de tarea (infrapilot), por registro/audiencia de la pieza (villa), por plan cerrado y dominio calcado (arroces). Leídos juntos, el eje real parece ser audiencia + irreversibilidad, no tamaño —pero eso nadie lo escribió.
5) Fuente única de verdad (colapsa los almacenes) vs duplicación deliberada (outbox, cola de escrituras, cache). Cada lección nombra su excepción, pero el cerebro tiene que devolverlas JUNTAS o producirá consejos opuestos según cuál recupere.

## La memoria ya está mintiendo en detalles verificables
 pollo-landing apunta a C:/Users/Kalel/fable 5/pollo-landing, carpeta que ya no existe; estanco dice que fechaNegocio vive en facturacion.ts cuando se movió a jornada.ts; landings avisa que sus propios números de línea se desplazaron. Con los proyectos repartidos en tres raíces (ORION/, prommter/proyectos/, fable 5/), la evidencia archivo:línea caduca más rápido de lo que se cura. El cerebro necesita separar REGLA (no caduca) de COORDENADA (caduca) y reverificar la coordenada en el momento de citarla.

## Confianza inflada
 Casi todo viene marcado "confianza alta", pero varias son política escrita o arquitectura sin veredicto del dueño (la plantilla de login reutilizada, el método de fichas de referencia, la política de claves), no reglas pagadas con un fallo. El ecosistema tiene la lección que lo prohíbe —sin veredicto no siembres— y no se la aplica a sí mismo. Convendría un subconjunto marcado "escrita, no pagada".

## Huecos evidentes (hay trabajo real y cero conocimiento persistido)

- Facturación electrónica DIAN y legalidad colombiana: condiciona el modelo de anulación de cuatro productos y hasta el precio del software. Cero lecciones.
- Despliegue, hosting y respaldo: diez proyectos, uno solo en producción. Arroces y pollo-landing tienen el hosting bloqueado, villa sabe que Vercel es disco efímero. No hay una sola lección de deploy, dominio, backup, ni de qué pasa cuando el local se queda sin internet.
- Precio y contrato: dos lecciones (mensualidad con permanencia, piloto a mano). Nada de cuánto vale cada producto, qué incluye la cuota, ni qué pasa si el cliente deja de pagar —siendo que se vende software a negocios reales.
- Soporte y operación post-entrega: placita está EN PRODUCCIÓN con el dueño usándola y no hay conocimiento de soporte, capacitación ni respaldo. El PIN 0000 vigente semanas es el síntoma, y el manual (que produjo el hallazgo de "merma = solo dueño") aparece una sola vez y de pasada.
- Usuarios reales: hay reglas diseñadas PARA la cajera (conteo a ciegas, gramos vs kilos, merma con motivo) pero ninguna lección de haberla OBSERVADO usando el sistema. Todo el QA es de agente.
- WhatsApp: es el canal real de al menos tres negocios y no hay una sola lección sobre integrarlo, sustituirlo o medirlo.
- Datos personales: se guardan teléfonos de clientes reales (registros de pollo-landing) sin una línea sobre habeas data ni ley 1581, en Colombia.
- Material real del cliente: se prohíbe el stock y se generan imágenes, pero nadie escribió cómo se consigue la foto real (la sesión de grabación del D7 de orama es el único rastro).

## Lecciones que no encajaron en ningún tema

- 'Una fórmula de Excel sin su valor precalculado se pierde en silencio' (infrapilot) — quedó parqueada en 'maquina-y-herramientas' por afinidad de herramienta, pero su pregunta real ('¿cómo le entrego al contador un Excel editable que no se rompa?') no la responde ningún tema: es la ÚNICA lección de entregables ofimáticos del ecosistema, en un negocio donde 4 productos son contables. Si aparece una segunda, merece tema propio.
- 'Código terminado que no fue aprobado va a rama feature/*, nunca a stash' (villa-broaster) — parqueada en 'permisos-y-equipo' porque comparte el eje 'quién toca main'. En realidad es disciplina de git para trabajo pausado por orden del dueño, y no existe ningún tema de flujo de trabajo con git (ramas, PRs, commits, qué se versiona) pese a que hay 10 repos.
- 'El porcentaje de avance lo pone un juez externo con criterio verificable, nunca el que hizo el trabajo' (villa-broaster) — parqueada en 'encargos-verificables' por el criterio medible, pero su pregunta real ('¿cómo le reporto avance a un equipo humano o a un cliente?') pertenece a un tema de gestión de equipo que hoy tendría solo 2-3 lecciones (esta, la de repos separados por rol y la de la rama pausada). Es un tema en formación: vale la pena vigilarlo.
- 'El estado que decide qué ve el cliente se lee de la URL primero, y si no hay, se pregunta' (villa-broaster) — parqueada en 'mostrador-real' por el caso de las dos sedes, pero técnicamente es una regla de precedencia de estado en el front (URL > local > default) que también aplica a idioma, moneda y tenant. Encaje a medias por los dos lados.
