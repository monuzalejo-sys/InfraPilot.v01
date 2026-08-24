---
name: orion-validate
description: "Valida una memoria de proyecto ORION (state.json/metrics.json) contra el esquema AMM usando el validador local, reporta errores y advertencias, y repara violaciones de esquema si se le pide. Usar cuando el usuario pide validar o revisar la memoria ORION, sospecha corrupción de memoria, o después de ediciones manuales a state.json."
---

# ORION Validate — chequeo de conformidad de memoria

La forma ejecutable del principio ORION "la conformidad se prueba, no se
afirma" (RFC-0006) aplicada a los archivos de memoria.

## 0. Entorno y rutas

`ORION_HOME` = raíz del repo ORION (contiene `ORION_STANDARD.md`, `tools/`,
`memory/`). Resuélvelo así: variable de entorno `ORION_HOME` → el ancestro más
cercano que contenga `ORION_STANDARD.md` → por defecto en esta máquina
`C:\Users\Kalel\ORION`. En Claude Code usas `Bash`/`Read` directo; en Cowork en
la nube la carpeta llega por el puente del escritorio
(`mcp__remote-devices__device_bash`, con `ORION_HOME=~/mnt/ORION`) y el `Bash`
del contenedor **NO** la ve. Verifica con un listado barato antes de asumir una
ruta.

## Procedimiento

1. Determina el directorio de memoria: `$ORION_HOME/memory/<projectId>/`
   (por defecto en esta máquina `$ORION_HOME/memory/infrapilot`; si el usuario
   nombra otro proyecto, usa su directorio).
2. Corre `node $ORION_HOME/tools/validate-memory.mjs <memory-dir>`. Ese único
   comando es todo el chequeo — no re-verifiques sus hallazgos releyendo los
   archivos salvo que estés a punto de reparar.
3. **VALID:** reporta la línea de resumen + cualquier advertencia, y qué
   significan (p. ej. "objetos archivables → corre /orion-close cuando
   convenga"). Listo.
4. **INVALID:** lista cada error con una explicación de una línea. Luego repara:
   - Arreglos mecánicos (tier equivocado para un lifetime, formato de timestamp
     malo, campo de payload faltante recuperable del contexto) — arregla directo
     con ediciones quirúrgicas, sube `version`, pon `updated` en los objetos
     tocados.
   - Conflictos semánticos (ids duplicados con contenido distinto, dependencias
     sobre objetos que nunca existieron) — muéstrale el conflicto al usuario y
     pregunta cuál lado gana antes de tocar nada.
   Re-corre el validador hasta que quede VALID.
5. Si el script mismo falta o revienta, dilo exactamente así y ofrece
   restaurarlo del historial de git — no valides 20 objetos a ojo.

Reporta en el idioma del usuario. Máximo 20 líneas.
