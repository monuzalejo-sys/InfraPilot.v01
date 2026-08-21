---
name: orion-ecosystem-map
description: "Where every piece of the user's ORION cognitive-runtime ecosystem lives and how the parts fit together"
metadata: 
  node_type: memory
  type: project
  originSessionId: f3699fee-0513-4610-99a0-57a1ad6dfb83
  modified: 2026-08-10T21:56:34.541Z
---

The ORION ecosystem (the user's own standard for AI cognitive runtimes) spans:

- **Standard + RFCs**: `C:\Users\Kalel\ORION\ORION_STANDARD.md` + `RFC\RFC-0001..0006` (RFC-0007 versioning still unwritten). Repo = InfraPilot.v01 (github.com/monuzalejo-sys); `infrapilot-app` is a submodule (InfraPilot.Ai) with the Next.js product.
- **Phase agents** (user-level, `C:\Users\Kalel\.claude\agents\`): orion-analyst, orion-planner, orion-builder (one per plan step, parallel), orion-verifier, orion-fixer, orion-reflector, orion-curator — 1:1 with RFC-0002 contracts + AMM curation. Model policy: adaptive by difficulty (haiku/sonnet/opus ceiling), rated by the analyst per step.
- **Skills** (`C:\Users\Kalel\.claude\skills\`): orion (main lifecycle), orion-status (session-start briefing), orion-close (SESSION_CLOSE + curation), orion-validate (memory compliance).
- **Project memories** (AMM schema, always in the OUTERMOST repo): `ORION\memory\{infrapilot,permanent}`, `placita\memory\placita` (Mercaplaza — sistema POS en producción local, puerto 3300, `iniciar-mercaplaza.bat`), `estanco-contable\memory\estanco-contable`, `asadero\memory\asadero`, `arroces\memory\arroces`. Validator: `node C:\Users\Kalel\ORION\tools\validate-memory.mjs <memory-dir>`.
- **Vaults**: per-project view via `tools\generate-vault.mjs <memory-dir>`; global Obsidian vault `C:\Users\Kalel\ORION-Vault` (no es repo) via `tools\export-vault.mjs <destino> <memorias-externas...>` — pass the external project memories explicitly or they stay invisible. "Alimentar las bóvedas" = regenerate both layers.
- **Vehículos de publicación** (patrón GitHub Desktop, todos en `C:\Users\Kalel\ORION\`, ignorados por el repo ORION): `mercaplazarepo` ← `placita` (rama master), `superarrozrepo` ← `arroces` (master), `estancorepo` ← `estanco-contable` (main), `wrdrepo` (del dueño, no tocar). REGLA DURA aprendida 2026-08-08: NUNCA dejar un remoto local configurado en un vehículo — GitHub Desktop lo toma como destino de push ("Publish this branch to...") en vez de ofrecer "Publish repository", y el push al repo de trabajo falla con remote-rejected (branch checked out). Flujo de subida SIN remoto persistente: `cd <vehículo>; git pull C:\Users\Kalel\<repo-trabajo> <rama>` (URL directa, ff tras el merge inicial) y el dueño pulsa Publish/Push en Desktop. Los repos de trabajo son donde se committea; los vehículos solo espejan.
- **Constraint**: `git push` fails in this environment (Credential Manager, no /dev/tty) — commit locally, user pushes via GitHub Desktop. Autocommit on verification PASS is standing policy (DEC-005 in state.json).

- **Familia de apps de comercio local** (mismo stack Next+TS+TW4+store localStorage, dominio puro con `__selfTest()`): `C:\Users\Kalel\estanco-contable` (la mayor, multi-tenant) y `C:\Users\Kalel\arroces` (Super Arroz del Norte, construida 2026-08-05, memoria en `arroces\memory\arroces\`); `asadero` contiene `broaster-app` (Next 16, cliente real "Villa Broaster", pollo broaster con sedes Villa del Viento y Vía al Bosque; landing pública + pedidos + admin con clave y gastos; construida 2026-08-08, marca real y contable 2026-08-10); `placita` solo tiene planes. OJO: el proyecto del pollo BROASTER es `asadero\broaster-app`; `fable 5\pollo-landing` es OTRO negocio (mayorista de pollo crudo, marca placeholder "Avícola Buenavista"). Al portar módulos contables entre ellas, auditar supuestos temporales (KN-001 de arroces: la plata pertenece al turno del COBRO, no de la toma del pedido).

Sessions in `C:\Users\Kalel` (pre-fable) hold older ORION memories under `projects\C--Users-Kalel\memory\` — [[user-working-style]] applies across all of them.
