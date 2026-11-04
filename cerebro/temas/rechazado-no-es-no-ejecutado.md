---
slug: rechazado-no-es-no-ejecutado
titulo: Una herramienta rechazada o interrumpida pudo haber hecho la mitad — inspecciona antes de reintentar
alias: [rechazado, rechazada, rechazo, tool use rejected, the tool use was rejected, interrumpido, interrumpida, interrumpi, cancele el comando, cancelado, abortado, aborte, reintento, reintentar, reintentar comando, volver a correr, correr de nuevo, heredoc, cat >>, comando compuesto, comando encadenado, && encadenado, media ejecucion, a medias, mitad hecha, idempotente, idempotencia, no idempotente, migrate dev, prisma migrate, migration.sql, _prisma_migrations, accion irreversible, commit y push juntos, separar llamadas, una llamada una cosa, new_string was NOT written]
preguntas: ["el usuario rechazo el comando, lo vuelvo a correr?", "cancelaron la herramienta - se alcanzo a ejecutar algo?", "me interrumpieron a mitad del comando, como se que quedo hecho?", "el reintento me escribio dos veces el mismo bloque en el archivo", "puedo juntar editar el sql y aplicar la migracion en un solo comando?", "el harness dijo que no se escribio - es cierto?", "como evito que un rechazo deje la mitad hecha?"]
proyectos: [prommter]
confianza: media
actualizado: 2026-11-02
---

# Una herramienta rechazada o interrumpida pudo haber hecho la mitad — inspecciona antes de reintentar

## Respuesta corta

**Un tool call rechazado o interrumpido NO significa "no hizo nada".** Si el comando era compuesto (`cat >> archivo <<EOF … EOF` y luego otra cosa), la primera parte pudo ejecutarse antes del rechazo, aunque el mensaje diga que no se escribió.
**Antes de reintentar, mira el artefacto**: cuenta lo que tu bloque debería haber añadido (`grep -c`), mira `git status`/`git diff`, y si hay migraciones consulta la tabla de control (`_prisma_migrations`).
**Una llamada = una cosa.** Separa la edición de la acción irreversible que la consume (aplicar migración, commit, push, deploy) en llamadas distintas: así un rechazo no puede dejar la mitad hecha.
**Prefiere escrituras idempotentes** (reescribir el archivo entero o editar con reemplazo exacto) a `>>`, que duplica en cada reintento.

## Por qué (qué lo pagó)

El 2026-11-02, en prommter (bloque 0.5, migración inicial de Prisma), el orquestador lanzó una sola llamada Bash: `cat >> migration.sql <<EOF` con el bloque SQL manual (UNIQUE parciales y CHECKs) seguido de `npx prisma migrate dev`. El usuario la rechazó y el harness informó que no se había escrito nada. Era falso para la primera mitad: el bloque ya estaba en el archivo. El reintento lo añadió otra vez y quedó duplicado: **5 `CREATE UNIQUE INDEX` en vez de 3**. Se salvó porque se contaron las sentencias antes de aplicar y `_prisma_migrations` estaba vacía: nada llegó a la base (`prommter/KN-003`). Si el `migrate dev` hubiera corrido con el archivo duplicado, habría fallado a medias o dejado una migración registrada con SQL malo, que en Prisma se arregla a mano.

## Cómo se aplica

1. Tras un rechazo o interrupción, trata el estado como **desconocido**, no como "intacto".
2. Inspecciona antes de volver a lanzar: `grep -c "CREATE UNIQUE INDEX" archivo.sql` contra lo esperado, `git status`, `git diff`, y la tabla de control de la herramienta (`SELECT * FROM _prisma_migrations`).
3. Al diseñar el comando: **edición en una llamada, acción irreversible en otra**, y entre ambas verifica (conteo, `git diff`).
4. Para archivos generados por herramienta (migration.sql) prefiere escribir el archivo completo o un reemplazo exacto en vez de `>>`: repetirlo da el mismo resultado.
5. Si el reintento ya duplicó, no apliques: arregla el archivo primero y vuelve a contar.

## Cuándo NO aplica

- Comandos de solo lectura (`ls`, `grep`, `git status`): reintentar es seguro, no hay nada que inspeccionar.
- Operaciones ya idempotentes por construcción (`CREATE ... IF NOT EXISTS`, reemplazo exacto de una cadena): reintentar es seguro, aunque igual mira que el resultado sea el esperado.
- Una edición hecha con Edit/Write que el harness rechazó **antes** de ejecutar sí puede no haber escrito nada; aun así, verificar cuesta un `grep`. El problema es suponerlo.

## Evidencia

- `prommter/KN-003` (Project, Knowledge, 2026-11-02): la regla y el incidente, con el conteo 5 vs 3 de `CREATE UNIQUE INDEX` y la tabla `_prisma_migrations` vacía.
- Única observación hasta hoy: confianza `media`. Si otro proyecto repite el patrón con otra herramienta, súbela a `alta` y añade la cita.

## Enlaces

- [[TEMA-dominio-migraciones-y-copias]] — SQL leído no es SQL ejecutado; aquí el caso inverso: SQL escrito que creías no escrito.
- [[TEMA-verificar-con-evidencia]] — todo estado se afirma con un número medido (aquí, un conteo), no con lo que dijo el mensaje.
- [[TEMA-entorno-de-la-maquina]] — límites del entorno y del harness; mide en vez de suponer.
