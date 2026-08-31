---
slug: caza-de-huecos-de-mercado
titulo: Cómo se busca un hueco de mercado que Google no encuentra (estudio de mercado en 5 fases)
alias: [estudio de mercado, estudios de mercado, nicho, nichos, hueco de mercado, huecos de mercado, buscar nicho, buscar un nicho, encontrar nicho, encontrar un nicho, idea de negocio, ideas de negocio, que producto construyo, que construyo, nuevo producto, proximo producto, oportunidad de negocio, compliance, cumplimiento, software de cumplimiento, saas de nicho, saas regulatorio, nicho regulatorio, regulacion, regulatorio, arancel, sancion, deadline regulatorio, gremio, gremios, terreno anti-google, terrenos anti-google, anti-google, cazar candidatos, caza de candidatos, cazador, cazadores, matar candidatos, reglas de matar, matanza adversarial, verificacion adversarial, ojos frescos, dossier, dossiers, licencia de matar, compuertas, compuerta, gate, gates, compuerta medible, construir solo si, validar antes de construir, validar un nicho, validar mercado, cementerio de candidatos, cementerio, TAM, ola de agentes de investigacion, investigacion de mercado, market research, cazar huecos, cazar hueco, cuatro terrenos, fase de caza, fase de matanza]
preguntas: ["¿cómo hago un estudio de mercado para encontrar un nicho nuevo?", "necesito una idea de negocio nueva, ¿por dónde empiezo?", "¿cómo busco un hueco de mercado que google no me muestre?", "encontré un nicho que se ve perfecto, ¿ya lo construyo?", "¿quién debe matar un candidato de nicho, el mismo que lo encontró?", "voy a lanzar una ola de agentes a buscar nichos, ¿cómo la organizo?", "¿cuándo dejo de investigar un mercado y empiezo a escribir código?", "¿qué es una compuerta antes de construir un producto?", "¿cómo se hace un dossier de un candidato de nicho?", "¿en qué terrenos busco un negocio que no tenga ya cien competidores?"]
proyectos: [huecos-2026]
confianza: alta
actualizado: 2026-08-28
---

# Cómo se busca un hueco de mercado que Google no encuentra

## Respuesta corta

**Cinco fases, en este orden, y el que caza NUNCA verifica su propio hallazgo.**
**(1) Caza en 4 terrenos anti-Google**: reglas con cumplimiento a 2+ años (nadie
construye todavía), olas de regulación que se copian estado a estado, regulación
extranjera cuyo obligado real está en otro continente, y gremios aburridos con
compradores offline. **(2) Mata en el cementerio con reglas mecánicas**, sin
compasión: 3+ herramientas establecidas = muerto; el regulador ya opera su propio
portal = muerto; el deadline pasó hace más de 6 meses = muerto; lo gratis mata lo
pago. **(3) Verificación adversarial por un agente DISTINTO del cazador**, con
orden explícita de destruir cada sobreviviente. **(4) Dossier completo solo para
quien sobrevive**, y su autor tiene la misma licencia de matar su propio
candidato. **(5) Ningún veredicto es "construir": es "construir solo si"** —
compuertas medibles, baratas y con fecha, corridas antes de escribir una línea de
código.

## Por qué (qué lo pagó)

**Lo pagó evitar construir tres productos muertos.** La corrida huecos-2026
(2026-08-27/28) cazó **31 candidatos** en los 4 terrenos, mató **25** en el
cementerio con evidencia citada (`huecos-2026/KN-003`), y de los que
sobrevivieron a esa primera criba, **el candidato estrella de cada uno de los 4
terrenos murió o quedó herido justo en la fase 3 o 4** — la que un cazador nunca
se aplica a sí mismo:

- **Terreno "cumplimiento a 2+ años" (federal): TSCA 8(a)(7) PFAS para
  importadores.** Parecía sólido — hasta que la fuente primaria mostró que la EPA
  propone eximir justo a los "imported articles", vaciando el universo de
  **131.157 a ~4.000** empresas, con regla y portal todavía inestables
  (`informe-huecos-2026.html:208`).
- **Terreno "olas estatales": rescate de Amara's Law.** El deadline estaba a
  **18 días** cuando se cazó; GreenSoft, Snaplinc y Regbase ya estaban dentro.
  Quien construya hoy no alcanza la ola grande, compite por la ola calmada del
  año 2, ya disputada (`informe-huecos-2026.html:190,219`).
- **Terreno "regulación extranjera": trabajo forzoso multi-régimen en español.**
  Parecía el vendedor perfecto (arancel Sección 301) y murió **en el dossier**,
  con fuente primaria: el arancel es 100% país-nivel, no empresa-nivel
  (`informe-huecos-2026.html:226`; regla completa en
  [[TEMA-filtros-para-matar-candidatos-de-nicho]]).

Sin la fase 3 y la fase 4, **el estudio habría recomendado construir estos tres**
(`huecos-2026/DEC-001`). El cuarto terreno, gremios aburridos offline, sí produjo
un sobreviviente (funerarias) — pero tampoco salió limpio: quedó "construir
solo si" (`huecos-2026/KN-001`). **De 31 candidatos, cero llegaron a "construir"
sin condiciones.**

**Y lo pagó, medido en tokens, que la disciplina es barata comparada con
construir a ciegas.** El estudio completo costó **991.339 tokens en 11
agentes**: la caza en los 4 terrenos (E1–E4) corrió en `sonnet` y costó 381.845
tokens; la matanza adversarial (K1–K3, verificadores independientes) también
`sonnet`, 243.349 tokens; y solo los dossiers de los finalistas (D1–D4) usaron
`opus`, 366.145 tokens — y de esos 4 dossiers, **uno se mató a sí mismo**
(`informe-huecos-2026.html:406-411`). El patrón barato-para-cazar,
caro-solo-para-el-sobreviviente es el mismo que documenta
[[TEMA-modelos-y-costos]]; aquí queda medido en un dominio distinto al de
código.

## Cómo se aplica

1. **Escribe las reglas de matar en imperativo y con número, antes de cazar.**
   No se negocian caso por caso en el cementerio: 3+ herramientas = muerto,
   portal propio del regulador = muerto, deadline pasado >6 meses = muerto, lo
   gratis mata lo pago.
2. **Un agente por terreno, en paralelo, con modelo barato.** Cada terreno bien
   cazado produce 5–8 candidatos (`informe-huecos-2026.html:177`); `sonnet`
   bastó para las 4 caza en esta corrida.
3. **El cementerio se resuelve con una búsqueda corta.** Si un candidato no
   muere ahí en minutos aplicando las reglas mecánicas, todavía no gastes
   verificación adversarial en él — pero tampoco lo pases a dossier sin esa
   verificación.
4. **La verificación adversarial la hace SIEMPRE alguien que no cazó ni
   escribió el candidato**, con la orden explícita de destruirlo: censo hondo
   (incluye consultoras de precio fijo y lo gratis), ¿paga el comprador de
   verdad?, riesgo regulatorio, canal, ventana. Aquí es donde murió el
   candidato estrella de cada terreno — no en la caza.
5. **Solo al dossier le llegan los sobrevivientes, y en `opus`.** El autor del
   dossier recibe la misma licencia de matar que el verificador: si encuentra
   algo letal con fuente primaria, mata su propio candidato en vez de
   defenderlo.
6. **Todo veredicto final es condicional.** Escribe la compuerta —qué se mide,
   cuánto cuesta, con qué fecha— antes de escribir cualquier código. Ninguna
   compuerta de esta corrida costó más de USD 100 ni más de 60 días
   (`huecos-2026/RSK-001`, `PEND-001`, `PEND-002`, `PEND-003`).
7. **Un candidato en reserva no se re-usa sin volver a correr su compuerta.**
   PFAS quedó explícitamente detrás de los otros dos, "solo si las otras dos
   fallan" (`huecos-2026/PEND-003`).

## Cuándo NO aplica

- **Si ya hay cliente o dolor confirmado por fuera**, esto no es un "hueco de
  mercado": es un encargo. El método es para cuando todavía no hay comprador
  esperando.
- **En un terreno donde Google sí indexa bien** (keyword de alto volumen de
  búsqueda) no hace falta este método — ahí ya hay competencia visible y el
  problema es otro (diferenciación, precio, canal), no descubrimiento.
- **Si el gatillo es evidentemente país-nivel desde la fuente primaria**, no
  hace falta correr las 5 fases completas: mátalo en el cementerio (fase 2) con
  la regla específica — ver [[TEMA-filtros-para-matar-candidatos-de-nicho]].
- **Si no hay presupuesto para cazador + verificador + dossier** (~991k tokens
  medido en esta corrida), recorta terrenos, no fases: saltarse la
  verificación adversarial es exactamente donde se coló el error 3 de 4 veces
  en esta corrida.

## Evidencia

- `huecos-2026/DEC-001` — la decisión del método en 5 fases, con el resultado
  citado: 31 candidatos, 25 muertos, el candidato estrella de cada terreno
  muerto o herido en fase 3/4.
- `huecos-2026/KN-001` — veredicto final: tres finalistas, ninguno "construir"
  sin condiciones.
- `huecos-2026/KN-003` — el cementerio: 25 candidatos muertos con evidencia y
  URL citada por candidato, y las reservas vivas sin verificar a fondo.
- `huecos-2026/RSK-001`, `PEND-001`, `PEND-002`, `PEND-003` — las compuertas
  medibles de los tres finalistas, con costo y fecha.
- `C:\Users\Kalel\fable 5\huecos-2026\informe-huecos-2026.html` — informe
  completo con todas las fuentes primarias. Puntos citados aquí: línea 120 (31
  candidatos/4 terrenos), líneas 177–181 (las 5 fases en prosa del propio
  informe), línea 190 y 219 (Amara's Law, deadline 18 días), línea 208 (TSCA
  8(a)(7), universo 131.157→~4.000), línea 226 (trabajo forzoso, Sección 301
  país-nivel), líneas 406–411 (tabla de costos por fase: caza 381.845
  tokens/sonnet/4 agentes, matanza adversarial 243.349/sonnet/3 verificadores,
  dossiers 366.145/opus/4 finalistas "1 se mató a sí mismo", total 991.339
  tokens/11 agentes).

## Enlaces

- [[TEMA-filtros-para-matar-candidatos-de-nicho]] — las reglas nuevas que esta
  corrida le agregó al método: qué mata (o salva) un candidato regulatorio
  concreto antes de gastarle un dossier.
- [[TEMA-modelos-y-costos]] — confirma el patrón barato-para-buscar,
  caro-solo-para-el-sobreviviente con un dato medido nuevo (991.339 tokens/11
  agentes en un estudio de mercado completo, no en una ola de código).
- [[TEMA-verificar-con-evidencia]] — el mismo principio de fondo ("todo
  veredicto lleva un número, y quien mide no es quien produjo") aplicado a
  mercado en vez de a código.
