# Preguntas que el cerebro TIENE que responder

Esto es la prueba de regresión del cerebro. Se corre con:

```bash
node C:\Users\Kalel\ORION\tools\cerebro.mjs probar
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
