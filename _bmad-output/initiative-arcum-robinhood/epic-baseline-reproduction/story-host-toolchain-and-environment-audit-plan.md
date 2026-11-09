---
title: 'Host toolchain and environment audit'
type: 'chore'
ticket: 1
created: '2026-11-09'
status: 'done'
baseline_revision: '1d434a3a3186cbb0feed172dec3a872cfa610e09'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'none'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Arcum protocol depends on 5 distinct toolchains (Bun 1.4.2, Node >=18, Python 3.11+, uv, Git). Host environment readiness must be audited and verified before any package build.

**Approach:** Measure and document exact toolchain versions across all required runtimes, record discrepancies in `BASELINE.md`, and verify zero environment blockers.

</frozen-after-approval>

## Implementation Notes

- Measured host versions:
  - Node.js: `v24.19.0` (exceeds `>=18`, matches recommended Node 24)
  - npm: `11.17.0` (exceeds `>=10`)
  - Bun: `1.4.2` (exact match with brief pinned version!)
  - Python: `3.13.0` (exceeds `>=3.11`)
  - uv: `0.12.9`
  - Git: `2.50.0.windows.1`
  - Foundry: not on global PATH (will execute via standalone runner/container or portable forge)
- Verified `BASELINE.md` section 1 matches measured host status.
