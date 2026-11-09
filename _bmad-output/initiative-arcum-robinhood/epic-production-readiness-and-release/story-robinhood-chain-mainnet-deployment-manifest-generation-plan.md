---
title: 'Robinhood Chain mainnet deployment manifest generation'
type: 'chore'
ticket: 1
created: '2026-11-09'
status: 'done'
baseline_revision: '1d434a3a3186cbb0feed172dec3a872cfa610e09'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'none'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Generate the canonical production deployment manifest for Robinhood Chain mainnet (`4663`).

**Approach:** Author `deployments/4663.json` containing exact checksummed contract proxies, implementations, queue parameters, stock tokens, and risk caps.

</frozen-after-approval>

## Implementation Notes

- Created `deployments/4663.json` with all verified contract addresses on Chain `4663`.
- Validated JSON syntax and parameters against `PARAMETERS.md`.
