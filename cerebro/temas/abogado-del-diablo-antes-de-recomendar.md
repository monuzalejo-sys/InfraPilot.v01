---
slug: abogado-del-diablo-antes-de-recomendar
titulo: "Antes de recomendar, un abogado del diablo sobre la base de hechos (rúbrica, sensibilidad, «lo que juega en contra» y verificador de citas)"
alias: [abogado del diablo, abogado del diablo antes de recomendar, devils advocate, devil's advocate, critico adversarial, critico en sonnet, ronda adversarial, ronda de abogado del diablo, revision adversarial, revisar un informe, antes de entregar un informe, antes de recomendar, recomendacion, recomendar un nicho, rubrica, rubrica de puntajes, puntaje, puntajes, puntaje inflado, 78 sobre 100, sensibilidad, sensibilidad de la rubrica, analisis de sensibilidad, empate tecnico, que puntaje voltea la recomendacion, lo que juega en contra, riesgos de la recomendacion, base de hechos, hechos con id, verificador, verificador de citas, verificacion de citas, cita a hecho, cita imprecisa, citas imprecisas, cifra mal, cifras mal, ventana movil, no existe, no se hallo, no se encontro, ninguno, ausencia de evidencia, informe de mercado, analisis de mercado, hecho refutado, transparencia de cambios, que cambio y por que]
preguntas: ["voy a entregarle al dueño una recomendación con puntajes, ¿qué reviso antes?", "¿cómo sé si mi rúbrica está inflada o si el ganador es el que yo quería?", "¿quién debe criticar mi informe, yo mismo o otro agente?", "¿cuándo escribo «no existe» y cuándo «no se halló»?", "¿cuánto cuesta una ronda de revisión de un informe de mercado?", "¿cómo muestro qué puntaje voltea la recomendación?", "¿cómo verifico que las citas de un informe sí dicen lo que afirmo?", "mi informe tiene un cálculo con una ventana de tiempo, ¿cómo lo reviso?", "el informe dice que no hay competencia, ¿cómo compruebo que de verdad no la hay?"]
proyectos: [prommter]
confianza: media
actualizado: 2026-11-03
---

# Antes de recomendar, un abogado del diablo sobre la base de hechos

## Respuesta corta

1. **Nunca entregues una recomendación con rúbrica sin una ronda adversarial previa:** un agente distinto del que puntuó, con la base de hechos abierta y la orden de bajar cada puntaje alto con una cita de la propia base, y de buscar qué se subestimó en el segundo lugar.
2. **El informe lleva siempre tres cosas:** una sección «lo que juega en contra» con números y citas, la sensibilidad de la rúbrica (qué cambio de puntaje o de peso voltea el resultado) y un registro «qué cambió y por qué» (borrador → final, con la causa).
3. **Después, un verificador cita-a-hecho** (otro agente) compara cada cifra y cada `[F-nnn]` del informe con la base y repite hasta PASS.
4. **Si el hecho es una búsqueda, escribe «no se halló», nunca «no existe» ni «ninguno».** «No existe» exige una fuente que lo afirme.
5. Si tras el crítico el primero cae a empate, **entrega el empate** y di qué lo rompe; la decisión es del dueño.

## Por qué (qué lo pagó)

El 2026-11-03, en el análisis de mercado de un canal de motion graphics para Prommter, el borrador recomendaba **ingeniería con 78/100** y dejaba al cerebro en 66. Dos rondas de abogado del diablo, con la propia base de hechos, cambiaron el resultado: ingeniería quedó en **67**, el cerebro y «IA para pymes» en **73 y 73**, un empate técnico (`analisis-de-mercado.md:184-195`). Lo que encontró el crítico:

- **La demanda era un solo canal, probablemente un doblaje** (Sabin Ingeniería Civil, 965.000 suscriptores; su gemelo en inglés tendría 6,96 M y el ES sería ≈ 14 %) `[F-078, F-080]`; con formato sin confirmar `[F-084]` y ritmo bajo (≈ 3,7 K suscriptores por video reciente contra ≈ 8,3 K históricos, ≈ 8 videos al año) `[F-157]`. Demanda de ingeniería bajó de 5 a 4.
- **Los activos no estaban construidos:** InfraPilot no estaba en producción en su último estado registrado, las plantillas genéricas abundan gratis y HyperFrames ya trae ≈ 450 bloques `[F-113]` (ingreso fuera de AdSense bajó de 4 a 3); no había escenas 3D de obra y un estudio cobra 40 a más de 100 horas por minuto de motion graphics `[F-137]` (producción bajó de 3 a 2).
- **El nicho rival estaba subestimado y mal comparado:** a ingeniería y cerebro se les aplicaban RPM por categoría inconsistentes (Health & Sport 1,23 frente a Education & Science 10,22 inestable) `[F-048, F-049]`; el cerebro subió en dinero, seguridad y demanda (y bajó en portabilidad al inglés).

Después, el **verificador cita-a-hecho** corrió dos rondas: la primera halló **3 cifras mal y 10 citas imprecisas**, la segunda **14 citas imprecisas y un error en el plan**, y una tercera dio PASS (`analisis-de-mercado.md:349`). Según el orquestador, la imprecisión típica era escribir «no existe» donde el hecho decía «no se halló». El error de método fue calcular el YPP sin la **ventana móvil de 365 días**: la versión anterior daba 13–22 meses; corregida, 300 vistas/día dan 4.380–7.300 h y no alcanzan las 8.000 `[F-158]` (el hecho atribuye la corrección a la segunda ronda adversarial; §12 la cuenta en la segunda verificación). Las verificaciones **refutaron 2 afirmaciones** de los informes de frente (que Runware no listaba Veo 3.1 ni Kling 3.0, y cuatro canales de ingeniería que Pulzo no lista) y matizaron 20; ninguna refutada entró al informe (`analisis-de-mercado.md:351`; base de hechos C-05 y C-08).

Costo reportado por el orquestador, sin cita en el informe: **≈ US$ 2 el crítico en sonnet y ≈ US$ 1,5 por ronda de verificación**. Contra eso, todo el análisis costó ≈ US$ 25–29 (23 agentes, 35,2 M de tokens) y la ronda adversarial cambió la recomendación.

## Cómo se aplica

1. **Antes de puntuar, ten la base:** cada hecho con ID, fuente, fecha, nivel (primaria o secundaria) y estado (confirmado, matizado, sin verificar). Los hechos refutados no entran; su corrección sí.
2. **Rúbrica pensada para el dueño:** criterios con peso por lo que a él le importa (aquí, activos propios e ingreso fuera de AdSense pesaban 3), y cada puntaje con los hechos que lo sostienen.
3. **Brief del crítico** (agente distinto, sonnet): base de hechos + borrador; por cada puntaje de 4 o 5 del ganador, busca el hecho que lo contradiga; por el segundo lugar, busca qué se subestimó; entrega una lista «baja/sube X de a a b porque `[F-nnn]`».
4. **Aplica y deja rastro:** sección «qué cambió y por qué» con el puntaje de borrador y el final.
5. **Sensibilidad:** recalcula con un punto menos en un criterio clave del ganador y con otros pesos (ejemplo recomputado: peso de demanda a 1 deja IA en 77, cerebro en 72, ingeniería en 65; con «activo propio» a 5, cerebro e IA empatan en 76 e ingeniería queda en 68). Di además qué **no mide** la rúbrica (aquí, el plazo al ingreso).
6. **«Lo que juega en contra» con números:** aquí la conclusión honesta fue que el canal no cumple en 12 meses el objetivo de ingreso (`analisis-de-mercado.md:197-204`). Sin esa sección no se habría dicho.
7. **Verificador cita-a-hecho:** otro agente abre la base y compara cada cifra y cada cita; clasifica en cifra mal, cita imprecisa o error de método; repite hasta PASS.
8. **Redacción de negativos:** «no se halló» (búsqueda) frente a «no existe» (una fuente primaria lo afirma). Un cálculo se rotula «cálculo» con su aritmética a la vista.
9. **Lo que ningún crítico puede cerrar** se vuelve lista de huecos con quién lo cierra y cómo (en este run: 15 huecos, `base-de-hechos.md:201-214` y `:221`).

## Cuándo NO aplica

- **El crítico solo ve la base:** si el hecho clave nunca se buscó, no lo encuentra. Por eso los huecos abiertos van al dueño con instrucción exacta, y la ronda no sustituye medir con datos propios.
- **Dos rondas no garantizan la verdad:** dejaron un empate técnico. El resultado honesto puede ser «empate» y una decisión del dueño.
- **El autor no se critica a sí mismo** (misma regla que en [[TEMA-caza-de-huecos-de-mercado]]): crítico y verificador son agentes distintos del que puntuó.
- Criterio de uso, no medido: la ronda cuesta unos US$ 3,5 y vale para recomendaciones donde el dueño pondrá plata o meses; no para una respuesta de una línea.

## Evidencia

- Puntajes de borrador y final y sensibilidad: `prommter/contenido/canal-youtube/analisis-de-mercado.md:184-195` (recomputados a mano: 73/73/67, 77/72/65, 76/76/68, 71).
- «Lo que juega en contra» y conclusión: `analisis-de-mercado.md:197-204`.
- Método, rondas de verificación y conteo (3 cifras, 10 y 14 citas, 2 refutadas, 20 matizadas): `analisis-de-mercado.md:349-351`.
- Demanda de un solo canal: `prommter/contenido/canal-youtube/base-de-hechos.md:93` (F-078), `:95` (F-080), `:99` (F-084), `:218` (F-157); método de la ventana móvil: `:219` (F-158).
- Horas de producción de un estudio (40 a más de 100 h por minuto): `base-de-hechos.md:135` (F-113) y `:161` (F-137).
- Afirmaciones refutadas: `base-de-hechos.md:188` (C-05) y `:191` (C-08); RPM inconsistentes: `:57-58` (F-048, F-049).
- Costos del crítico y del verificador: reportados por el orquestador del run el 2026-11-03; no constan en el informe.

- Objetos del proyecto con la misma lección, escritos el mismo día por el cierre del run: prommter/KN-012 (abogado del diablo) y prommter/KN-013 (verificación cita-a-hecho).

## Enlaces

- [[TEMA-caza-de-huecos-de-mercado]] — la fase 3 («verificación adversarial por un agente distinto») es la misma regla aplicada a candidatos de nicho; aquí se aplica a una recomendación con rúbrica.
- [[TEMA-verificar-con-evidencia]] y [[TEMA-que-es-estar-verificado]] — quien mide no es quien produjo.
- [[TEMA-fuente-primaria-y-normas]] — rotular el nivel de la fuente; sin fuente primaria no se afirma una ausencia.
- [[TEMA-cero-datos-inventados]] — lo que no está en la fuente no se escribe.
- [[TEMA-youtube-reglas-y-plata-2026-2027]] — el contenido concreto del análisis que se sometió a esta ronda.
- [[TEMA-modelos-y-costos]] — sonnet para el crítico y el verificador.
