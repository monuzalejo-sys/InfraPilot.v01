---
name: orion-cerebro
description: Responde una pregunta con lo que el ecosistema ORION YA sabe — 270+ objetos de conocimiento de 10 proyectos más los temas curados de la bóveda — y siempre con la cita de dónde salió. Usar cuando el usuario pregunte "¿qué sé de X?", "¿cómo hacíamos Y?", "¿ya me pasó esto?", "consulta la bóveda/el cerebro", "/cerebro", o cuando esté por tomar una decisión que ya se tomó antes en otro proyecto. También antes de proponer arquitectura, precios, reglas de negocio o encargos a un generador de diseño: casi siempre hay una lección pagada que aplica.
---

# Pregúntale al cerebro

Tu trabajo aquí **no es opinar**: es responder con lo que ya está pagado con trabajo
real y decir claramente cuándo el cerebro no sabe. Una respuesta inventada con tono
seguro es peor que un "esto no está en la bóveda todavía", porque contamina las
decisiones y nadie puede rastrear de dónde salió.

## 1. Busca antes de pensar

```bash
node C:\Users\Kalel\ORION\tools\cerebro.mjs buscar "<la pregunta tal como la hizo el usuario>" --n 8
```

Pásale la pregunta **literal**, con la jerga y los errores de tipeo del usuario: los
temas traen alias precisamente para eso. La herramienta reindexa sola si alguna
memoria cambió, así que nunca responde con datos viejos. Es local y cuesta ~0:
búscala dos o tres veces con formulaciones distintas antes de rendirte (`"caja"`,
`"turno"`, `"arqueo"` son tres puertas al mismo cuarto).

Filtros útiles: `--proyecto <id>` para acotar a un proyecto, `--temas` para ver solo
la capa curada, `--json` si necesitas procesar el resultado.

## 2. Lee de verdad lo que encontraste

- Si sale un **TEMA**, ábrelo completo: `node ...\cerebro.mjs tema <slug>`. El tema
  es una respuesta ya curada — su bloque "Respuesta corta" es lo que hay que
  contestar, y su bloque "Cuándo NO aplica" es lo que evita que la apliques mal.
- Si salen **objetos de memoria** (`proyecto/ID`), ábrelos en su `state.json` cuando
  el extracto no alcance. La cita que devuelve la búsqueda es la ruta exacta.
- Los documentos `proyecto/costos` son métricas medidas de modelos y fases: úsalos
  para preguntas de "¿qué modelo uso?" o "¿cuánto cuesta esto?".

No cites lo que no abriste. El puntaje de búsqueda ordena, no garantiza.

## 3. Responde

La respuesta tiene tres partes, siempre en este orden:

1. **La respuesta directa**, en dos o tres frases, en imperativo. Lo que hay que hacer.
2. **Por qué se sabe**: qué falló o qué se midió para pagarla, en una frase.
3. **La cita**: `proyecto/ID` o el tema, para que cualquiera pueda comprobarlo.

Si el conocimiento **contradice** lo que el usuario está a punto de hacer, dilo
primero y sin rodeos: para eso existe el cerebro.

Si hay lecciones de **proyectos distintos que se contradicen entre sí**, muestra las
dos con su contexto en vez de elegir por tu cuenta — casi siempre la diferencia es
una condición del negocio que el usuario reconoce al instante.

## 4. Cuando el cerebro no sabe

Dilo con todas las letras: *"esto no está en la bóveda"*. Después puedes responder
con tu criterio general, **pero marcando claramente que es criterio y no memoria del
ecosistema**. Y ofrece cerrar el hueco:

- Si la respuesta se acaba de descubrir en esta sesión, es material para
  [[orion-harvester]] — el agente que alimenta el cerebro.
- Si el hueco es grande (un área entera sin conocimiento), dilo: es información
  valiosa sobre dónde está ciego el ecosistema.

## 5. Después de responder, deja el cerebro mejor

Si en la conversación aparece una lección nueva que pasa la puerta de calidad
(tiene evidencia citable, es accionable y sirve fuera de su proyecto), no la dejes
morir en el chat: propón guardarla, o invoca al agente `orion-harvester` para que la
cosechen y la escriba donde corresponde. El cerebro solo crece si cada sesión le
devuelve algo.

## Salud del cerebro

```bash
node C:\Users\Kalel\ORION\tools\cerebro.mjs estado
```

Devuelve cuántos temas y objetos hay, qué objetos están pobres (menos de 120
caracteres: candidatos a curar o archivar) y qué proyectos no tienen ningún tema
transversal — los huecos reales.
