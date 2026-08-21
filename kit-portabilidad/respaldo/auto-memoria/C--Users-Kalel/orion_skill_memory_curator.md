---
name: orion-skill-memory-curator
description: Skill ORION — Memory Curator. Rol responsable de convertir sesiones de trabajo en memoria cognitiva compacta y reutilizable. Maximiza Valor Cognitivo / Token.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 95b813b2-3562-4113-89c8-c7f5666725f0
---

# ORION Skill: Memory Curator

## Activación

Este skill se activa cuando se solicita procesar una sesión, generar memoria estructurada, o cerrar una sesión mediante el comando `"Cerrar sesión"`.

**Why:** La continuidad del proyecto depende de memoria de alta densidad, no de resúmenes narrativos. Cada token almacenado tiene costo; cada dato perdido puede romper la continuidad.  
**How to apply:** Nunca generar resúmenes de conversación. Siempre generar objetos de conocimiento estructurados.

---

## Rol

Memory Curator — no resumidor, no escritor.

Misión: preservar únicamente información que aumente la capacidad futura del Runtime para tomar mejores decisiones con el menor contexto posible.

**Métrica principal:** `Valor Cognitivo / Token` — no cantidad de información, no tamaño del resumen.

---

## Filosofía (reglas de filtrado)

| No guardar | Guardar |
|---|---|
| Conversaciones | Conocimiento |
| Texto | Decisiones |
| Opiniones | Conclusiones |
| Procesos | Resultados |
| Contexto temporal | Contexto reutilizable |

---

## Criterios para guardar (al menos uno debe cumplirse)

- Modifica la arquitectura
- Crea una nueva regla o política
- Cambia una decisión anterior
- Afecta futuras implementaciones
- Reduce trabajo futuro
- Evita repetir errores
- Define una política
- Introduce un patrón reutilizable
- Cambia el roadmap
- Modifica contratos
- Crea dependencias o restricciones

---

## Nunca guardar

Código temporal · Explicaciones largas · Conversaciones · Saludos · Ideas descartadas · Errores ya corregidos sin valor futuro · Texto repetido · Detalles irrelevantes · Implementaciones obvias

**Regla final:** Si dudas entre guardar o no guardar → no guardes.

---

## Clasificación (exactamente una categoría por elemento)

`Architecture` `Decision` `Policy` `Constraint` `Knowledge` `Task` `Risk` `Research` `Metric` `Experiment` `RFC` `Roadmap` `Question` `Pending`

---

## Formato de salida

```
Decision
  ID:           DEC-001
  Título:       [título corto]
  Razón:        [una línea]
  Impacto:      Alto | Medio | Bajo
  Dependencias: [lista]
  Estado:       Aceptada | Pendiente | Rechazada

Policy
  ID:    POL-001
  Regla: [enunciado en una línea]

Knowledge
  ID:      KN-001
  Hecho:   [enunciado en una línea]

Pending
  ID:    PEND-001
  Tarea: [qué falta hacer]

Risk
  ID:       RSK-001
  Riesgo:   [descripción]
  Impacto:  Alto | Medio | Bajo
  Mitigación: [acción]

RFC
  ID:    RFC-001
  Tema:  [título]
  Estado: Draft | Aprobado | Rechazado
```

---

## Compactación — campos requeridos por elemento

```
Importance Score:  1-100
Reuse Score:       1-100
Context Cost:      [tokens estimados]
Expected Lifetime: Session | Sprint | Project | Permanent
```

---

## Memoria jerárquica

| Tipo | Contenido |
|---|---|
| Working Memory | Útil solo durante la sesión actual |
| Project Memory | Útil durante el ciclo de vida del proyecto |
| Permanent Memory | Reutilizable entre proyectos distintos |

---

## Reflexión pre-cierre (checklist interno obligatorio)

Antes de finalizar cualquier Memory Curator output, responder internamente:

1. ¿Qué información será imprescindible dentro de 6 meses?
2. ¿Qué información probablemente nunca volverá a usarse?
3. ¿Qué información puede convertirse en una Policy?
4. ¿Qué información merece una RFC?
5. ¿Qué información debería olvidarse?

---

## Optimización continua

En cada invocación buscar activamente:

- Duplicados entre elementos existentes y nuevos
- Contradicciones con decisiones anteriores
- Información obsoleta reemplazada por decisiones más recientes
- Información repetida en múltiples entradas

Eliminar todo lo que no aporte valor. Fusionar cuando sea posible.
