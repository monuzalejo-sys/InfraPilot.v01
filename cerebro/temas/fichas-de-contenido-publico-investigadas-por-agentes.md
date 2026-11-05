---
slug: fichas-de-contenido-publico-investigadas-por-agentes
titulo: "Fichas de contenido público investigadas por agentes: el error está en el título y el gancho, no en las cifras (barrido y verificación de PMID por máquina)"
alias: [ficha, fichas, ficha de episodio, fichas de episodios, banco de episodios, banco de fichas, fichas investigadas por agentes, agentes investigadores, investigacion con agentes, titulo y gancho, gancho que promete de mas, titulo que promete de mas, promete de mas, prometer un mecanismo, mecanismo no leido, titulo sensacionalista, titulo engañoso, titulo enganoso, clickbait cientifico, extender ratones a personas, resultado en ratones, estudio en ratones, experimento en ratones, la primera vez, la primera resonancia, el primero, el unico, sin fuente, pmid, pmids, pubmed, pmc, doi, e-utilities, eutilities, esummary, entrez, verificar referencias, verificar referencias por maquina, verificar citas bibliograficas, referencias bibliograficas, cita bibliografica, muestreo de fichas, barrido de fichas, barrido de titulos, banco-cambios, nivel_fuente, resumen leido, solo el resumen, por abrir, divulgacion cientifica, contenido de salud, neurociencia, ketamina, psilocibina, revisor medico, firma medica, mentes brillantes, 90 episodios]
preguntas: ["los agentes me investigaron 90 episodios, ¿puedo confiar en las fichas o las reviso?", "¿cómo reviso que el título y el gancho de mi video de ciencia no prometan más de lo que dice el estudio?", "el estudio fue en ratones, ¿puedo poner en el título que «el cerebro» hace tal cosa?", "¿puedo decir «la primera vez que…» en un video si la fuente no lo dice?", "¿cómo verifico por máquina que los PMID de las referencias existen y son del autor y año que dice la ficha?", "una muestra de fichas salió con errores, ¿reviso todo el banco o solo esas?", "¿cuánto cuesta verificar 170 referencias de PubMed?", "si todos los PMID cuadran, ¿ya puedo publicar lo que dice la ficha?"]
proyectos: [prommter]
confianza: media
actualizado: 2026-11-05
---

# Fichas de contenido público investigadas por agentes: el error está en el título y el gancho

## Respuesta corta

1. **Trata cada ficha investigada por agentes como borrador:** las cifras salen bien; lo que falla es lo que la ficha PROMETE (título y gancho).
2. **Haz un barrido específico de título y gancho contra la propia ficha.** Marca todo el que prometa un mecanismo que la fuente leída no explica, extienda un resultado de ratones a personas, diga «la primera» o «el único» sin fuente, le hable de «tú» al lector en un tema de riesgo o describa mal el diseño del estudio.
3. **Verifica por máquina todas las referencias que tengan PMID:** `esummary` de E-utilities en lote (hasta 100 por llamada) y compara primer autor, año, volumen, páginas o DOI. Barato; pero solo prueba que la cita existe y cuadra, no que diga lo que la ficha afirma.
4. **Si una muestra pequeña sale con problemas, barre todo el banco:** 7 de 15 fichas con problemas llevaron a revisar las 96 (59 cambiaron).
5. **El barrido reduce el error, no lo elimina:** el verificador por guion y la firma de un revisor sobre todo lo visible siguen siendo obligatorios.

## Por qué (qué lo pagó)

El 2026-11-05 el plan de contenido de Prommter (canal de divulgación sobre cerebro y fármacos, 3 videos al día) recibió un banco de 90 episodios más 6 comodines, investigado por agentes. Un muestreo de 15 fichas halló **problemas en 7**: las cifras estaban bien, y el error estaba en títulos y ganchos que prometían de más y en un diseño mal descrito (`plan-de-contenido.md:292`). Los casos, con su ficha (`banco-cambios.md`):

- **Prometía un mecanismo que nadie leyó.** M04 «¿qué sostiene el esfuerzo en el cerebro?» cuando la fuente (Westbrook y Braver 2016) es una revisión teórica sobre cómo se decide si un esfuerzo vale la pena (`:152`). X12 decía que la nicotina «entra porque se parece» a la acetilcolina, similitud estructural que el resumen leído no dice (`:329`). X14 «Por qué no recuerdas…» prometía un mecanismo que la ficha no verificó, y hablaba de «tú» en un tema de riesgo de anuncios medio (`:343`). X15 «enseñó cómo se guarda un recuerdo» sin haber leído el artículo de 1957 (`:368`). M20 «¿por qué un olor trae un recuerdo entero?» cuando los estudios miden recuerdos más emocionales, no más completos ni exactos (`:444`).
- **Extendía ratones a personas.** X06 (cafeína): el título pasó a decir «según un experimento en ratones», y el gancho «no le añade energía a tu cerebro» no estaba en ninguna fuente (`:201-206`, Huang 2005). X24 (ketamina): se abrió el resumen de Zanos 2016 y confirmó que es en ratones (`:524`).
- **«La primera» sin fuente.** X27 (psilocibina): «la primera resonancia con psilocibina intravenosa» no estaba en la fuente, y «solo bajaba la actividad» simplificaba, porque se midió flujo sanguíneo y señal BOLD, no actividad neuronal (`:604-606`).

Con esa señal se hizo el barrido (`banco-cambios.md:9-11`): **59 de 96 fichas con al menos un cambio de contenido (128 cambios de campo)**, se rotuló el nivel de fuente de las 96 (primaria 65, secundaria 19, por abrir 12), se reabrieron las fuentes de sensibilidad alta que el muestreo no vio, y las 4 de riesgo de anuncios alto (ketamina, psilocibina, LSD, opioides) se difirieron fuera del primer mes. Además se extrajeron **242 menciones (172 PMID distintos)** y se consultaron con `esummary` en **2 llamadas**: en todas coincidieron primer autor y año; coincidieron también volumen, páginas o DOI donde la ficha los traía, y los 54 pares PMID-PMC se cruzaron sin discrepancias. **PMID corregidos: ninguno.** El único error de PMID que halló el muestreo (un dígito, 26515461 por 26516461, en X30) no estaba en el archivo recibido.

Lectura: lo que una máquina puede comprobar (que la referencia existe y cuadra) salió limpio y casi gratis; lo que cambió 59 fichas fue lo que solo se ve leyendo la promesa contra lo leído.

## Cómo se aplica

1. **En el brief del investigador:** título y gancho se escriben DESPUÉS de leer la fuente y solo afirman lo que lo leído dice; cada ficha rotula qué se leyó (resumen o texto completo), el nivel de la fuente (primaria, secundaria, por abrir) y el tipo de estudio (ratones, humanos, revisión teórica, transversal).
2. **Muestrea antes de confiar:** un agente distinto del que investigó revisa una muestra fija (aquí 15). Con una proporción alta de problemas, el remedio es el barrido de todo el banco, no corregir las fichas muestreadas.
3. **Barrido de título y gancho, cinco preguntas por ficha:** ¿promete un mecanismo («por qué», «cómo») que la fuente leída no explica? ¿el resultado es en animales o in vitro y el título lo dice? ¿«primera», «único», «nadie», «siempre» tienen fuente? ¿le habla de «tú» en un tema de riesgo? ¿el diseño del estudio está bien descrito?
4. **Referencias por máquina:** extrae los PMID de todos los campos, consulta `esummary` en lotes de hasta 100 y compara autor, año y volumen, páginas o DOI; cruza los pares PMID-PMC. Corrige y anota; si sale limpio, anótalo también.
5. **Sensibilidad alta:** reabre la fuente de las fichas de salud o riesgo, y las de riesgo de anuncios alto no entran al primer mes.
6. **Deja el rastro antes/después/por qué por campo** (aquí `banco-cambios.md`), para que el revisor del guion sepa qué se tocó y por qué.
7. **No cierres la fase con esto:** cada guion pasa por su verificador y, en salud, por la firma de un revisor sobre todo lo visible.

## Cuándo NO aplica

- **`esummary` no verifica significado.** Confirma que la referencia existe y sus datos cuadran; no que el estudio diga lo que el título sugiere. Las cifras que no dependen de un PMID (tamaños de efecto, porcentajes) no se recomprobaron (`banco-cambios.md:737`).
- **Sin PMID no hay verificación por máquina:** libros, manuscritos, conferencias y textos de época se revisan leyendo; el mismo archivo lista como no abiertos a Penfield y Boldrey 1937, Scoville y Milner 1957, Aserinsky y Kleitman 1953, Luria, Ericsson 1993 y otros (`:737`).
- **Las tasas (7 de 15, 59 de 96) son de un banco, un tema y un grupo de agentes:** no son una tasa de error general de los agentes. No se midió cuántos errores quedaron después del barrido, y 12 fichas seguían con la fuente por abrir (`banco-cambios.md:10`).
- La ciencia de las fichas se leyó sobre todo en resúmenes (`plan-de-contenido.md:290`): un barrido no sustituye leer el texto completo cuando el guion depende de un detalle.
- **No aplica a material interno** que no se publica; allí un título flojo no promete nada a un público.

## Evidencia

- Muestreo y barrido: `prommter/contenido/canal-youtube/plan-de-contenido/plan-de-contenido.md:288-292` («El estado real del banco») y `:419` (fila «90 episodios ya investigados» → «Fichas de partida, con su estado real»).
- Cifras del barrido y verificación de PMID: `plan-de-contenido/banco-cambios.md:9` (59 de 96; 128 cambios), `:10` (nivel de fuente), `:11` (242 menciones, 172 PMID, 2 llamadas, 54 pares PMC, cero corregidos, el PMID de X30), `:737` (qué no se verificó).
- Casos: `banco-cambios.md:152` (M04), `:201-206` (X06), `:329` (X12), `:343` (X14), `:368` (X15), `:444` (M20), `:524` (X24), `:604-606` (X27).
- Objeto del proyecto que resume el plan: prommter/KN-019.

## Enlaces

- [[TEMA-fuente-primaria-y-normas]] — rotular el nivel de la fuente; aquí se añade que el título puede prometer más que la fuente aun con la fuente bien citada.
- [[TEMA-abogado-del-diablo-antes-de-recomendar]] — el verificador cita-a-hecho y el crítico adversarial: misma familia de controles, aplicada a un informe.
- [[TEMA-cero-datos-inventados]] — lo que no está en la fuente no se escribe, tampoco en un gancho.
- [[TEMA-verificar-con-evidencia]] — comprobar con una medición, no con la creencia.
- [[TEMA-youtube-reglas-y-plata-2026-2027]] — el canal para el que se hicieron las fichas.
