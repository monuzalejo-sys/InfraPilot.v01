# Restaura el conocimiento de Claude en un PC nuevo desde el repo ORION.
# Correr DESPUES de clonar ORION y de instalar Claude Code.
# No pisa a ciegas: si ya existe algo en ~\.claude, hace copia .antes-del-kit.

$ErrorActionPreference = "Stop"
$kit = Split-Path -Parent $MyInvocation.MyCommand.Path
$respaldo = Join-Path $kit "respaldo"
$claude = Join-Path $env:USERPROFILE ".claude"

if (-not (Test-Path $respaldo)) { throw "No hay carpeta respaldo\ - corre primero respaldar.ps1 en el PC viejo y trae el repo actualizado." }
New-Item -ItemType Directory -Force $claude | Out-Null

function Restaurar($origen, $destino) {
  if (-not (Test-Path $origen)) { return }
  if (Test-Path $destino) {
    $copia = "$destino.antes-del-kit"
    if (Test-Path $copia) { Remove-Item $copia -Recurse -Force }
    Move-Item $destino $copia
  }
  Copy-Item $origen $destino -Recurse
  "restaurado: $destino"
}

Restaurar (Join-Path $respaldo "skills") (Join-Path $claude "skills")
Restaurar (Join-Path $respaldo "agents") (Join-Path $claude "agents")

foreach ($f in "settings.json", "settings.local.json", "keybindings.json", "CLAUDE.md") {
  $origen = Join-Path $respaldo $f
  if (Test-Path $origen) { Restaurar $origen (Join-Path $claude $f) }
}

# Auto-memoria: se restaura por proyecto bajo projects\<nombre>\memory
$autoMem = Join-Path $respaldo "auto-memoria"
if (Test-Path $autoMem) {
  Get-ChildItem $autoMem -Directory | ForEach-Object {
    $destino = Join-Path $claude ("projects\" + $_.Name + "\memory")
    New-Item -ItemType Directory -Force (Split-Path $destino) | Out-Null
    Restaurar $_.FullName $destino
  }
}

$launch = Join-Path $respaldo "launch.json"
if (Test-Path $launch) {
  "launch.json respaldado disponible en $launch - copialo a la carpeta .claude de tu sesion de trabajo y AJUSTA las rutas si el usuario de Windows cambio."
}

"Listo. Prueba de humo: abrir Claude Code y correr /orion-status."
