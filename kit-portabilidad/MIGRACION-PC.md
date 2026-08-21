# Kit de portabilidad — mismo Claude, misma eficiencia, en cualquier PC

**Objetivo:** que al cambiar de computador, Claude arranque con el MISMO
conocimiento (ORION, skills, agentes, memorias) y la misma eficiencia que
en este. Todo lo replicable viaja por git; lo secreto viaja a mano.

## Qué viaja por dónde

| Pieza | Dónde vive | Cómo viaja |
|---|---|---|
| Estándar ORION + RFC + herramientas | repo `ORION` | GitHub (push/clone) |
| Skills de Claude (orion, orion-close, orion-status, orion-validate, estudio-diseno) | `~\.claude\skills\` | snapshot en `respaldo\` de este kit → GitHub |
| Agentes (analyst, builder, curator, fixer, planner, reflector, verifier, landing-prompter) | `~\.claude\agents\` | snapshot en `respaldo\` → GitHub |
| Configuración de Claude (settings.json, settings.local.json) | `~\.claude\` | snapshot en `respaldo\` → GitHub |
| Auto-memoria de Claude (MEMORY.md + notas por proyecto) | `~\.claude\projects\<proyecto>\memory\` | snapshot en `respaldo\` → GitHub |
| launch.json de la sesión (servers dev) | `fable 5\.claude\launch.json` | snapshot en `respaldo\` → GitHub |
| Memorias ORION de cada proyecto | `<repo>\memory\<proyecto>\` | viajan DENTRO de cada repo |
| La bóveda (vista Obsidian) | `C:\Users\Kalel\ORION-Vault` | repo git propio (desde 2026-08-20) |
| **SECRETOS** (.env.local) | cada repo, gitignored | **USB / gestor de claves — JAMÁS git** |

## Antes de cambiar de PC (en el PC viejo)

1. Ejecutar `respaldar.ps1` (clic derecho → Ejecutar con PowerShell). Copia
   skills, agentes, settings, auto-memoria y launch.json a `respaldo\`.
2. Commit + **push vía GitHub Desktop** de: ORION, ORION-Vault, y todos los
   repos de `prommter\proyectos\` con trabajo local.
3. Copiar a un USB (o gestor de claves) los `.env.local`:
   - `placita\.env.local` (Supabase + clave de caja)
   - `asadero\broaster-app\.env.local`
   - `ORION\infrapilot-app\.env.local`
   - (verificar con: `Get-ChildItem C:\Users\Kalel -Recurse -Filter ".env.local" -Depth 4`)

## En el PC nuevo

1. Instalar: **Node 24+**, **git**, **GitHub Desktop** (iniciar sesión — es
   quien empuja, el push por terminal no funciona con GCM), **Claude Code**.
2. Clonar `ORION` en `C:\Users\<usuario>\ORION` y `ORION-Vault` al lado.
3. Clonar los repos de proyectos en `C:\Users\<usuario>\prommter\proyectos\`.
4. Ejecutar `ORION\kit-portabilidad\restaurar.ps1` — devuelve skills,
   agentes, settings, auto-memoria y launch.json a su sitio en `~\.claude`.
5. Copiar los `.env.local` del USB a cada repo (mismas rutas).
6. Prueba de humo: abrir Claude Code y correr `/orion-status` — debe leer la
   memoria del proyecto y reportar pendientes. Si lo hace, el conocimiento
   llegó completo.

## Mantener el kit vivo

Cada vez que cambie una skill, un agente o la configuración: correr
`respaldar.ps1` y commitear ORION. El respaldo desactualizado es el único
enemigo de este kit.
