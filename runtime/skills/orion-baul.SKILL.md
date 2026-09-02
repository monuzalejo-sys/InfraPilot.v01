---
name: orion-baul
description: La pasarela hacia la bóveda de Obsidian — sube TODO lo útil del ecosistema y lo deja enlazado: el estándar y el runtime, la memoria de cada proyecto, los temas del cerebro, los planes de ejecución con una nota por tarea, el historial de sesiones con lo que costó cada una, y los encargos. Usar cuando el usuario diga "sube esto al baúl", "actualiza la bóveda", "/orion-baul", después de crear o avanzar un plan, o cuando algo importante viva solo en un JSON y debería poder consultarse. También corre solo dentro de `/orion-close`.
---

# ORION Baúl — que nada útil se quede enterrado en un JSON

El conocimiento del ecosistema vive en `state.json`, `metrics.json` y
`plan.json`. Eso está bien para las herramientas y es ilegible para una
persona: nadie abre un JSON de 300 objetos para acordarse de algo. La bóveda es
la cara navegable de todo eso, y su valor real es el **grafo**: desde un tema se
ve qué tareas de qué proyectos dependen de él.

`$ORION_HOME` = la raíz con `ORION_STANDARD.md` (por defecto `$ORION_HOME`).
Bóveda: `$ORION_HOME/../ORION-Vault`.

## 1. Empuja

```bash
node "$ORION_HOME/tools/baul.mjs" empujar
```

Un solo comando. Es **determinista — nunca lo delegues a un agente**: un
subagente que "resume" al pasar es exactamente cómo se corrompe una vista.
Sube, en este orden:

| Qué | De dónde | Queda en |
|---|---|---|
| Estándar, RFCs, agentes, skills | el repo ORION | `Sistema/` |
| Memoria de cada proyecto, objeto por objeto | los `state.json` descubiertos | `Proyectos/<id>/` |
| Temas curados del cerebro | `cerebro/temas/` | `Cerebro/` |
| Planes: una nota por tarea, con sus enlaces | los `plan.json` | `Planes/<id>/` |
| Historial de sesiones y su gasto medido | los `metrics.json` | `Sesiones/<id>/` |
| Encargos | `<memoria>/encargos/` | `Encargos/<id>/` |

Banderas: `--proyecto <id>` para uno solo, `--sin-export` cuando solo cambiaron
planes o sesiones (más rápido), `--destino <ruta>` para otra bóveda.

## 2. Comprueba

```bash
node "$ORION_HOME/tools/baul.mjs" estado
```

Cuenta notas por sección. Lo que hay que mirar es si **bajó** respecto al
empujón anterior: una sección que encoge significa que una memoria dejó de
descubrirse — y un proyecto invisible en la bóveda ya pasó, semanas, sin que
nadie lo notara.

## 3. Qué NO se sube, y por qué

- **Secretos, claves, `.env`, tokens.** La bóveda es un repo aparte y se
  sincroniza: lo que entra ahí, sale de la máquina. Si al revisar ves una clave
  en una nota, quítala del ORIGEN (el `state.json`), no de la nota — la nota se
  regenera.
- **Datos personales de clientes reales.** Teléfonos y nombres de personas de
  carne y hueso no se copian a una vista navegable «por si acaso».
- **Código.** El código vive en su repo. La bóveda guarda decisiones,
  lecciones, planes e historial: lo que un archivo `.ts` no puede contar.

## 4. La regla de dirección

**El repo manda; la bóveda es una vista regenerable.** Lo que escribas a mano
en Obsidian **no** vuelve al repo — pero tampoco se pierde:
`cerebro.mjs ruta` barre la bóveda buscando notas escritas a mano y las
devuelve marcadas, precisamente porque no están en ninguna memoria. Son insumo
de la próxima curación: si una nota tuya vale, alguien la convierte en objeto
de memoria o en tema, y entonces sí pasa a ser fuente.

## 5. Reporta

≤10 líneas, en español: cuántas notas por sección, cuánto creció respecto a la
última vez si lo sabes, el gasto total medido del ecosistema, y —si algo bajó—
qué proyecto dejó de aparecer. Nada más: el resultado es la bóveda, no el
mensaje.
