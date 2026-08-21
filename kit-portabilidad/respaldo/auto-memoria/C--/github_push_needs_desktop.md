---
name: github-push-needs-desktop
description: git push from the Bash/PowerShell tool fails on this machine — use GitHub Desktop instead
metadata: 
  node_type: memory
  type: project
  originSessionId: f08dbda5-22cb-4c77-9bcd-9b7b0cdd127c
---

`git push` run through the terminal tools on this machine fails with
`fatal: User cancelled dialog.` / `/dev/tty: No such device or address`.
Git Credential Manager (`credential.helper = manager`) tries to open an
interactive auth dialog that this non-interactive terminal can't display.

**Why:** Discovered 2026-07-01 while pushing the ORION+InfraPilot merge to
`github.com/monuzalejo-sys/InfraPilot.v01`. No PAT was ultimately needed —
GitHub Desktop was already authenticated on this machine.

**How to apply:** When a push is needed, commit locally via the terminal as
usual, then ask the user to open GitHub Desktop, add/select the repo
(pointing at the correct local folder — watch for GitHub Desktop creating
an accidental new nested repo if the wrong "Create/Clone" option is picked),
and click Publish/Push there. Don't burn time retrying `git push` from the
terminal or asking for a PAT unless the user prefers that route.
