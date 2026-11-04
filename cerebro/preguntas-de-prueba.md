# Preguntas que el cerebro TIENE que responder

Esto es la prueba de regresión del cerebro. Se corre con:

```bash
node $ORION_HOME/tools/cerebro.mjs probar
```

Cada línea es una pregunta escrita **como la haría el dueño** (informal, sin
tildes a veces, con la jerga del negocio) seguida de `=>` y la señal que debe
aparecer en el primer resultado: un `slug` de tema, o un `proyecto/ID` de
objeto. Si el primer resultado no la contiene, la prueba falla y eso significa
una de dos cosas: falta el tema, o el tema existe pero sus `alias` no cubren
cómo se pregunta de verdad.

La medida de este archivo no es que todo pase. Es que **cuando algo falla, se
sabe exactamente qué conocimiento hay que cosechar**.

## Preguntas

que modelo uso para un builder visual => modelos-y-costos
cuando uso haiku y cuando opus => modelos-y-costos
cuanto cuesta una ola de agentes => modelos-y-costos
como cobro rapido en la caja => caja-y-turnos
la plata de que turno es si cobro despues => caja-y-turnos
que pasa si cierro el turno con plata de otro turno => caja-y-turnos
por que no se puede borrar un gasto => invariantes-contables
que reglas de contabilidad no se pueden romper => invariantes-contables
por que no hay un total de ventas a secas => invariantes-contables
que pasa si dos procesos escriben el mismo json => invariantes-contables
como es el login de los sistemas de la casa => acceso-roles-y-puestos
el cajero que puede ver => acceso-roles-y-puestos
como saco una captura de una pagina en esta maquina => verificar-con-evidencia
como genero un pdf => verificar-con-evidencia
por que no me deja hacer push desde la terminal => entorno-de-la-maquina
que le doy a claude design para que quede mejor => generadores-de-diseno
por que el diseno me quedo generico y apagado => generadores-de-diseno
que hago si el dueno rechaza un diseno => generadores-de-diseno
por que se me murieron los agentes a mitad de la ola => olas-de-agentes
como reparto el trabajo entre varios agentes => olas-de-agentes
como se cierra una sesion de trabajo => memoria-y-cierre
donde guardo lo que aprendi => memoria-y-cierre
cuanto le cobro a un cliente por un sistema => cobro-a-clientes
como le explico el proyecto a un empleado nuevo => documentos-para-personas
que datos puedo poner en una pagina publica => cero-datos-inventados
puedo inventar precios para una demo => cero-datos-inventados
donde guardo el stock => donde-vive-el-dato
puedo tener el total guardado en la tabla => donde-vive-el-dato
cuantas fuentes de verdad debe haber => donde-vive-el-dato
cuando esta bien duplicar datos => donde-vive-el-dato
como agrego un campo a algo que ya esta guardado => dominio-migraciones-y-copias
como pruebo una migracion sql => dominio-migraciones-y-copias
se me rompio la pagina con los datos viejos => dominio-migraciones-y-copias
en que orden se aplican las migraciones => dominio-migraciones-y-copias
como se si algo quedo bien => que-es-estar-verificado
que es estar terminado => que-es-estar-verificado
basta con que compile => que-es-estar-verificado
como reviso el trabajo de un agente => que-es-estar-verificado
como le escribo el encargo a un agente => encargos-verificables
como hago un brief que no falle => encargos-verificables
por que el agente hizo otra cosa => encargos-verificables
que debe tener la pagina que ve el cliente => pantalla-publica
como hago que la landing venda => pantalla-publica
que pongo en la portada => pantalla-publica
se me murio un agente => olas-de-agentes
que reviso antes de relanzar un builder muerto => olas-de-agentes
hazme un plan para este proyecto => planes-de-ejecucion
por donde empiezo con este proyecto => planes-de-ejecucion
cuantas tareas hace falta para terminar esto => planes-de-ejecucion
que se me esta olvidando en este proyecto => planes-de-ejecucion
que sigue ahora => planes-de-ejecucion
que hacemos despues de entregarlo => planes-de-ejecucion
como hago un estudio de mercado para encontrar un nicho nuevo => caza-de-huecos-de-mercado
necesito una idea de negocio nueva por donde empiezo => caza-de-huecos-de-mercado
encontre un nicho que se ve perfecto ya lo construyo => caza-de-huecos-de-mercado
quien debe matar un candidato de nicho el mismo que lo encontro => caza-de-huecos-de-mercado
que es una compuerta antes de construir un producto => caza-de-huecos-de-mercado
un arancel o una sancion es buen gatillo para vender software de cumplimiento => filtros-para-matar-candidatos-de-nicho
como se si el alivio de un arancel es por empresa o por pais => filtros-para-matar-candidatos-de-nicho
encontre un regulador con portal de reporte igual construyo el normalizador => filtros-para-matar-candidatos-de-nicho
por que mi cliente recibiria el software gratis => filtros-para-matar-candidatos-de-nicho
la multa es baratisima comparada con mi suscripcion eso importa => filtros-para-matar-candidatos-de-nicho
como saco el precio de compra si solo tengo el precio de venta y el margen => invertir-formulas-redondeadas
el cartel dice un precio y la caja cobra otro por que => invertir-formulas-redondeadas
dividir para sacar la compra no me cuadra con lo que cobra el sistema => invertir-formulas-redondeadas
como invierto una formula que redondea => invertir-formulas-redondeadas
el dueno rechazo un video en vectores pero le gusto otro tambien en vectores cual es la diferencia => cortometraje-sobre-ilustracion
puedo animar un personaje en codigo o se va a ver infantil otra vez => cortometraje-sobre-ilustracion
puedo meter el titere svg encima de las tomas reales del local => cortometraje-sobre-ilustracion
cuanto cuesta veo por segundo => veo-clips-de-ia-para-componer
veo me hace zoom aunque le pido camara fija como lo arreglo => veo-clips-de-ia-para-componer
como recorto el fondo de un clip de veo para ponerlo sobre un video real => veo-clips-de-ia-para-componer
el chroma key me comio los ojos y las piernas del personaje => veo-clips-de-ia-para-componer
genero los clips de veo con audio o sin audio => veo-clips-de-ia-para-componer
de que color pido el fondo para quitarlo despues => veo-clips-de-ia-para-componer
ffmpeg me salto lineas dentro de un while read => veo-clips-de-ia-para-componer
gemini me dio el segundo de cada letrero y no coincide con el video => montar-video-con-material-real-del-celular
puedo pasarle el video terminado a gemini para que me diga que corregir => montar-video-con-material-real-del-celular
como elijo una voz si no la puedo oir => montar-video-con-material-real-del-celular
timeout no existe en esta mac como le pongo limite de tiempo a un comando => entorno-de-la-maquina

<!-- Cosecha de las ventanas, 2026-11-02: preguntas reales por tema nuevo o reforzado -->
parce, el anuncio le quedó igual a los cortos y el dueño dice que lo quiere más real, le subo el esfuerzo al modelo o qué cambio => cortometraje-sobre-ilustracion
se me dañó el mp4 después de relanzar ffmpeg, qué hice mal => cortometraje-sobre-ilustracion
cómo saco el tiempo de cada palabra para subtítulos animados sin que whisper se invente cosas => montar-video-con-material-real-del-celular
la voz de ia dice mal el nombre de la marca, cómo lo arreglo => montar-video-con-material-real-del-celular
cómo genero con veo sin marca de agua y sin gastar plata si el dueño solo tiene 60 mil pesos => veo-clips-de-ia-para-componer
por qué la foto retocada con ia no sirve si solo le quité el desorden => veo-clips-de-ia-para-componer
hago el video con fondo oscuro como las referencias que me pasó o en colores claros => gusto-visual-del-dueno
el dueño dijo no me gustó para nada, qué hago antes de rehacer => gusto-visual-del-dueno
le invento un logo nuevo o uso el que ya tienen pintado => marca-de-un-cliente-nuevo
cómo le presento la marca a un cliente nuevo para que escoja rápido => marca-de-un-cliente-nuevo
por qué la imprenta dice que el pdf trae fuentes si ya lo pasamos a curvas => imprenta-desde-html
qué reviso antes de mandar a imprimir un qr para que no toque rehacerlo => imprenta-desde-html
la demo para el cliente la hago oscura o clara => gusto-visual-del-dueno
cuando te mando varias cosas en un mismo mensaje, por qué no las haces todas antes de contestarme => como-pide-el-dueno
te dije es pregunta y te pusiste a construir, cómo debías leer mi mensaje => como-pide-el-dueno
dónde le dejo al dueño los archivos para que los mande a la imprenta sin que se confunda de versión => como-entregar-al-dueno
ya se aplicó lo que te pedí o todavía no lo veo en la caja del local => como-entregar-al-dueno
cómo le pido al dueño todo lo que me falta sin llenarle el chat de preguntas => huecos-del-dueno
me dan un cliente nuevo con solo el nombre y el rubro, qué entrego y qué no construyo todavía => huecos-del-dueno
cómo armo el pdf de lo que necesitamos del contador y cómo lo reviso en esta mac => documentos-para-personas
el recibo sale con la letra muy finita y casi no se lee, cómo lo dejamos para que se vea bien => recibos-comprobantes-y-dian
le prometí al cliente que el sistema le deja listo lo de la dian al final del día, qué reviso antes de cobrarle eso => recibos-comprobantes-y-dian
el buscador me dio un artículo de ley: lo cito así o lo confirmo en la norma => fuente-primaria-y-normas
cuánto cuesta de verdad el vps y el dominio, y sirve el plan gratis de supabase => fuente-primaria-y-normas
cómo dejo una sección que aparezca unos días y se quite sola => donde-vive-el-dato
por qué el readme dice 91 tareas y el plan 108, y cómo evito que pase => donde-vive-el-dato
el sistema de pedidos todavía no funciona: qué le pongo a la página en vez del botón => cero-datos-inventados
qué rama publica el vps de mercaplaza, main o master => aprendizajes-de-placita-mercaplaza
qué es estar terminado, basta con que compile => que-es-estar-verificado
el otro equipo dice que ya dejó todo conectado, cómo compruebo si se puede publicar => que-es-estar-verificado
desplegué y la tienda sale sin productos, qué pasó => que-es-estar-verificado
el recordatorio me quedó a las 3 de la mañana, por qué las horas me salen corridas => verificar-con-evidencia
por qué la captura me muestra algo distinto de lo que de verdad pasa en la página => verificar-con-evidencia
lo fusioné y en la caja real no se ve el cambio, por qué => construir-no-es-arrancar
la puerta de calidad salió roja por una vulnerabilidad nueva, cómo la manejo => construir-no-es-arrancar
cómo hago para que la sorpresa del evento no se vea antes de la fecha en la página => encargos-verificables
cómo abro las ventanas de un cliente nuevo igual que como se hizo con qué cremoso => ventanas-por-cliente
qué le pongo a una ventana nueva para que no empiece preguntando qué es el cliente => ventanas-por-cliente
hay otra sesión de claude trabajando en el mismo repo: cómo hago commit sin llevarme sus archivos => varias-ventanas-mismo-repo
cómo le mando una orden clara a la ventana del pc si desde la mac no puedo escribirle => varias-ventanas-mismo-repo
por qué se me cae el servidor de desarrollo cuando trabajan varios agentes a la vez => olas-de-agentes
se acabó el límite de uso a mitad de una ola de agentes, cómo retomo sin perder nada => olas-de-agentes
por qué tengo que pushear yo cómo hacemos para que lo del pc y la mac quede publicado solo => memoria-y-cierre
el sistema de permisos me bloquea el push, lo fuerzo o qué hago => memoria-y-cierre
cuántos tokens me cuesta tener simorgh encendido y a partir de cuándo deja de valer la pena => memoria-y-cierre
cómo lanzo agentes sin que se me dispare el gasto como pasó en escuadra => modelos-y-costos
cuánto costó de verdad la ola del 9 de septiembre => modelos-y-costos
cuántos tokens gastamos de verdad y por qué el plan decía otra cosa => planes-de-ejecucion
vamos a empezar un proyecto nuevo, cuál es el primer paso antes de construir => planes-de-ejecucion
el arquitecto volvió a escribir el perfil con palabras que el catálogo no reconoce, cómo lo evito => vocabulario-compartido-entre-piezas
por qué no se publicó sola la página si dejamos la tarea programada => entorno-de-la-maquina
por qué se me caen los localhost cuando cierro el panel del navegador => entorno-de-la-maquina
por qué las pruebas del 3d tardan una eternidad en la mac y cómo las acelero => entorno-de-la-maquina
por qué claude no me puede escribir el settings.json y qué hago para activar los hooks => entorno-de-la-maquina
cómo subimos el sistema al servidor si no tengo acceso al pc => un-vps-varios-negocios
el vps que acabo de comprar ya tiene algo corriendo en el puerto 80, lo borro o reinstalo => un-vps-varios-negocios
para un cliente nuevo, lo meto como una empresa más en la base de mercaplaza o hago otra instancia => un-vps-varios-negocios
por qué la caja no me deja cobrar si el producto sí está ahí => la-caja-no-puede-parar
necesito una base de datos para que el dueño vea las ventas de los dos locales desde el celular => la-caja-no-puede-parar
qué pasa con las ventas pendientes si cambio el dominio de la caja => dominio-migraciones-y-copias
voy a pasar el bot a otro computador, basta con copiar el archivo de la base => dominio-migraciones-y-copias
se me olvidó la clave del admin, la puedes sacar del hash => claves-cuentas-y-secretos
le di un comando al dueño para guardar la llave y no pasa nada, cómo lo guío mejor => claves-cuentas-y-secretos
el dueño pegó una contraseña en el chat y me pidió guardarla, qué hago => claves-cuentas-y-secretos
el dueño dice que el pin es correcto y el sistema no lo deja entrar, qué revisamos => acceso-roles-y-puestos
está bien tener la vitrina y la caja bajo el mismo dominio o las separo => acceso-roles-y-puestos
aquí en popayán todos usan delta, cómo lo mejoramos sin pedirle al cliente que lo cambie => caza-de-huecos-de-mercado
cómo reviso si vale la pena vender plantillas o excel en un nicho antes de armarlos => caza-de-huecos-de-mercado
acabo de investigar un tema: dónde queda guardado y cómo lo encuentro después => caza-de-huecos-de-mercado
cuánto le cobro a un minimarket y cómo defiendo el millón si otros pos cobran $40.000 => cobro-a-clientes
el cliente puede pagar solo por la vitrina y no por el sistema => cobro-a-clientes
meta me dice que estoy vendiendo bien pero la plata no cuadra: cómo calculo lo que de verdad me deja cada anuncio => piloto-con-cliente-real
cuánto me va a costar al mes tener el bot respondiendo con claude y cómo lo bajo => piloto-con-cliente-real
cómo cobro un plato que el cliente arma, si todavía no tengo el costo de cada ingrediente => pedidos-y-dinamicas-de-un-local
puedo hacer un sorteo en instagram para el negocio sin meterme en problemas => pedidos-y-dinamicas-de-un-local
puedes publicar tú solo los videos en mis redes todos los días con mi chrome abierto => pedidos-y-dinamicas-de-un-local
me rechazaron el comando que editaba y aplicaba la migración, qué reviso antes de repetirlo => rechazado-no-es-no-ejecutado
cancelé la herramienta a la mitad, cómo sé si alcanzó a escribir => rechazado-no-es-no-ejecutado
después de reintentar quedó el bloque duplicado en el sql => rechazado-no-es-no-ejecutado
tengo cambios sin commitear de hace dos meses, los publico tal cual => varias-ventanas-mismo-repo
voy a pasar las rutas de windows a la mac, qué cuidado tengo => entorno-de-la-maquina
cuantos suscriptores y horas necesito para monetizar un canal de youtube => youtube-reglas-y-plata-2026-2027
que cambia en youtube el 1 de febrero de 2027 => youtube-reglas-y-plata-2026-2027
si subo shorts de 15 segundos todos los dias me pagan => youtube-reglas-y-plata-2026-2027
cuanto paga youtube por mil vistas en colombia => youtube-reglas-y-plata-2026-2027
me quitan la monetizacion si uso voz de ia y no muestro la cara => youtube-reglas-y-plata-2026-2027
cuanto me retienen de impuestos de youtube viviendo en colombia => youtube-reglas-y-plata-2026-2027
puedo abrir social blade o google trends desde un agente => youtube-reglas-y-plata-2026-2027
voy a entregar una recomendacion con puntajes que reviso antes => abogado-del-diablo-antes-de-recomendar
cuando escribo no existe y cuando no se hallo => abogado-del-diablo-antes-de-recomendar
como verifico que las citas de un informe dicen lo que afirmo => abogado-del-diablo-antes-de-recomendar
como muestro que puntaje voltea la recomendacion => abogado-del-diablo-antes-de-recomendar
