# Respalda el conocimiento de Claude de este PC al repo ORION.
# Correr cada vez que cambie una skill, un agente o la configuracion.
# JAMAS copia secretos: excluye cualquier .env* por regla.

$ErrorActionPreference = "Stop"
$kit = Split-Path -Parent $MyInvocation.MyCommand.Path
$respaldo = Join-Path $kit "respaldo"
$claude = Join-Path $env:USERPROFILE ".claude"

# Limpia el respaldo anterior (el kit vive en git: la historia queda alla)
if (Test-Path $respaldo) { Remove-Item $respaldo -Recurse -Force }
New-Item -ItemType Directory -Force $respaldo | Out-Null

# 1. Skills y agentes (el corazon del conocimiento operativo)
Copy-Item (Join-Path $claude "skills") (Join-Path $respaldo "skills") -Recurse
Copy-Item (Join-Path $claude "agents") (Join-Path $respaldo "agents") -Recurse

# 2. Configuracion de Claude
foreach ($f in "settings.json", "settings.local.json", "keybindings.json", "CLAUDE.md") {
  $ruta = Join-Path $claude $f
  if (Test-Path $ruta) { Copy-Item $ruta $respaldo }
}

# 3. Auto-memoria de Claude (MEMORY.md y notas por proyecto)
$proyectos = Join-Path $claude "projects"
if (Test-Path $proyectos) {
  Get-ChildItem $proyectos -Directory | ForEach-Object {
    $mem = Join-Path $_.FullName "memory"
    if (Test-Path $mem) {
      $destino = Join-Path $respaldo ("auto-memoria\" + $_.Name)
      New-Item -ItemType Directory -Force $destino | Out-Null
      Copy-Item (Join-Path $mem "*") $destino -Recurse
    }
  }
}

# 4. launch.json de la sesion de trabajo (servers dev)
$launch = "C:\Users\Kalel\fable 5\.claude\launch.json"
if (Test-Path $launch) { Copy-Item $launch (Join-Path $respaldo "launch.json") }

# 5. Guardia anti-secretos: si algo .env* se colo, fuera.
Get-ChildItem $respaldo -Recurse -Filter ".env*" -Force -ErrorAction SilentlyContinue |
  Remove-Item -Force

"Respaldo listo en $respaldo. Ahora: commit de ORION + push via GitHub Desktop."
