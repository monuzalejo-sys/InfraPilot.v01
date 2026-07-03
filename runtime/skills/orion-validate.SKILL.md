---
name: "orion-validate"
description: "Validates an ORION project memory (state.json/metrics.json) against the AMM schema using the local validator script, reports errors/warnings, and repairs schema violations on request. Use when the user asks to validate/check ORION memory, suspects memory corruption, or after manual edits to state.json."
---

# ORION Validate — memory compliance check

The executable form of ORION's "compliance is testable, not assertable"
(RFC-0006) for memory files.

1. Determine the memory dir: `<outermost-repo-root>/memory/<projectId>/`
   (default for this machine: `C:\Users\Kalel\ORION\memory\infrapilot`; if the
   user names another project, use its dir).
2. Run `node C:\Users\Kalel\ORION\tools\validate-memory.mjs <memory-dir>`.
   That one command is the whole check — do not re-verify its findings by
   re-reading the files unless you're about to repair.
3. **VALID:** report the summary line + any warnings, and what they mean
   (e.g. "archivable objects → run /orion-close when convenient"). Done.
4. **INVALID:** list each error with a one-line explanation. Then repair:
   - Mechanical fixes (wrong tier for a lifetime, bad timestamp format,
     missing payload field recoverable from context) — fix directly with
     surgical edits, bump `version`, set `updated` on touched objects.
   - Semantic conflicts (duplicate IDs with different content, dependencies
     on objects that never existed) — show the user the conflict and ask
     which side wins before touching it.
   Re-run the validator until VALID.
5. If the script itself is missing or crashes, say exactly that and offer to
   restore it from git history — don't hand-validate 20 objects by eye.

Report in the user's language. Keep it ≤20 lines.
