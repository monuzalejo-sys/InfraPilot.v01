---
name: project-web-agent-leader
description: "Sistema multi-agente para creación de páginas web — WebLeader + 6 sub-agentes especializados, arquitectura de contexto mínimo"
metadata: 
  node_type: memory
  type: project
  originSessionId: 95b813b2-3562-4113-89c8-c7f5666725f0
---

# WebLeader — Sistema Multi-Agente de Creación Web

## Ubicación
`C:\Users\Kalel\web-agent-leader\`

## Estado
Configurado y listo. Sin proyectos completados aún (project_registry.md vacío).

**Why:** Sistema diseñado para crear páginas web de alta calidad mediante coordinación de sub-agentes. El agente líder (WebLeader) nunca genera código directamente — delega, coordina y revisa. Contexto siempre liviano: los sub-agentes escriben a disco, el líder solo maneja resúmenes de 5 líneas.

**How to apply:** Al iniciar cualquier tarea web con este sistema, abrir el directorio `web-agent-leader/` como workspace. El protocolo en CLAUDE.md se activa automáticamente.

## Arquitectura

```
web-agent-leader/
├── CLAUDE.md                    ← protocolo WebLeader (agente líder)
├── .claude/agents/              ← 6 sub-agentes registrados
│   ├── brief-analyst.md         ← primero siempre — clarifica requerimiento
│   ├── qa-guardian.md           ← QA en 3 modos (plan / archivo / cruzado)
│   ├── html-architect.md        ← genera estructura HTML
│   ├── css-designer.md          ← genera estilos
│   ├── js-engineer.md           ← genera interactividad
│   └── ux-reviewer.md           ← revisión final holística
├── memory/                      ← memoria persistente del sistema
│   ├── design_decisions.md
│   ├── user_feedback.md
│   ├── learned_patterns.md
│   └── project_registry.md
└── output/                      ← archivos generados (index.html, styles.css, main.js)
```

## Protocolo de ejecución (orden obligatorio)

1. Leer memoria (user_feedback, design_decisions, últimos 3 proyectos)
2. Brief Analyst → escribe `output/brief.md`
3. QA Guardian Modo 1 → aprueba el plan
4. HTML Architect → `output/index.html` + QA (máx 2 correcciones)
5. CSS Designer → `output/styles.css` + QA (máx 2 correcciones)
6. JS Engineer → `output/main.js` + QA (máx 2 correcciones)
7. QA Modo 3 → consistencia cruzada (máx 2 correcciones)
8. UX Reviewer → revisión holística final
9. Feedback del usuario → actualizar memory/
10. Registrar proyecto en project_registry.md

## Regla de reintentos

Cada sub-agente tiene máximo **2 correcciones** antes de escalar al usuario. Si en el 3er intento el QA sigue emitiendo CORREGIR → detener y reportar al usuario.

## Stack por defecto

HTML vanilla + CSS vanilla con variables `:root` + JS vanilla (sin librerías, salvo especificación contraria).
