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
