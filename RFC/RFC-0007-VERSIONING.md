# RFC-0007 — Versioning Protocol
## ORION Standard | Tier C-2 | Evolutionary Body

**Status:** Draft
**Version:** 1.0.0-draft
**Depends on:** RFC-0001 through RFC-0006

---

## Purpose

This RFC defines how the ORION Standard itself evolves: what may change at each
version level, which parts of the standard are frozen (Stable Core) versus
extensible (Evolutionary Body), and what a version change means for compliance
claims. It normatively formalizes §5 of ORION_STANDARD.md.

Versioning discipline is what lets an implementation built today keep a
meaningful compliance claim tomorrow. A standard that changes shape without
rules is not a standard — it is a moving target.

---

## 1. The Three-Track Version Model

```
ORION  X . Y . Z
       │   │   └── PATCH — errata, clarifications, typo/diagram fixes.
       │   │        MUST NOT change observable behavior requirements.
       │   └────── MINOR — backward-compatible additions to the
       │            Evolutionary Body only.
       └────────── MAJOR — any breaking change to the Stable Core.
```

**N7-R1:** Every published revision of the standard MUST carry exactly one
version in `X.Y.Z` form. Drafts append `-draft`.

**N7-R2:** A PATCH release MUST NOT add, remove, or alter any normative
requirement's meaning. If a "clarification" changes what a compliant
implementation must do, it is a MINOR (additive) or MAJOR (breaking) change.

**N7-R3:** A MINOR release MAY add: optional object fields, new enum values
that no existing rule forbids, new SHOULD-level rules, new compliance levels,
new lifecycle states (namespaced or non-conflicting), and new RFCs. A MINOR
release MUST NOT change or remove any existing MUST-level requirement.

**N7-R4:** Any change to the Stable Core (below) REQUIRES a MAJOR release.

## 2. Stable Core vs Evolutionary Body

**Stable Core** (breaking these breaks all implementations):
- The `Task` schema (RFC-0001 §3.1)
- The `QAReport` schema and the meaning of PASS/FAIL/ESCALATE (RFC-0001 §4.4)
- The `ContextBudget` schema (RFC-0001 §3.3)
- Core lifecycle states and their transition triggers (RFC-0003)
- The overflow-policy model (RFC-0004 §7)

**Evolutionary Body** (everything else), including but not limited to:
optional fields (e.g. `measurement_mode`), allocation strategies, scalability
conditions (RFC-0005), compliance test cases, and the AMM skill specification.

**N7-R5:** Each RFC section that defines schemas or rules MUST be attributable
to exactly one zone. Where ambiguous, the zone declared in the RFC header
(`Stable Core` / `Evolutionary Body`) governs.

## 3. Deprecation and Upgrade Path

**N7-R6:** When a MAJOR version is released, the previous MAJOR version enters
maintenance mode for 24 months: PATCH releases only, no new features.

**N7-R7:** A SHOULD-level rule introduced in MINOR version `X.Y` MAY be
promoted to MUST no earlier than `X.(Y+1)`. Promotions MUST be listed in the
release notes of the version that performs them.

## 4. Versioned Compliance

**N7-R8:** A compliance claim is only valid against a specific version
(`ORION/<level>/<X.Y>`, per N6-R3). A claim without a version is void.

**N7-R9:** Compliance carries forward automatically across PATCH releases,
MUST be re-tested against the new test suite for MINOR releases (N6-R7), and
is void across MAJOR releases until re-certified (N6-R8).

**N7-R10:** Implementation-specific extensions MUST be namespaced (per N1-R2)
so that no future MINOR release can collide with them. An extension that
squats on an unqualified name forfeits forward compatibility.

## 5. Change Control

**N7-R11:** Every normative change MUST be recorded with: the rule ID(s)
touched, the zone (Core/Body), the version that introduces it, and a one-line
rationale. The RFC Index in ORION_STANDARD.md §8 MUST be updated in the same
change.

**N7-R12:** A change that fails the Alternative Implementation Test (RFC-0006
§4) MUST NOT be released in any version without the documented justification
N6-R5 requires.

---

## 6. Alternative Implementation Test

**Question:** Does this versioning protocol force a specific internal
architecture?

- ATLAS (immutable/functional): version compliance is a property of published
  behavior, not internal structure. ✅ Compatible.
- NOVA (reactive/event-driven): same — claims attach to observable outputs per
  version. ✅ Compatible.
- A runtime that hot-upgrades between ORION versions mid-task: permitted,
  provided each Task completes under a single declared version. ✅ Compatible
  (declare the version at Task creation).

**Result:** Architecture-neutral. The protocol constrains the standard's own
evolution and the validity of claims, not implementations.

---

*End of RFC-0007. This document completes the RFC set of ORION Standard
v1.0-draft.*
