---
title: 'Decaying positions tracker with raw vs effective units display'
type: 'feature'
ticket: 3
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

**Problem:** Trader UI must clearly distinguish between raw ERC-20 token count and effective decaying units to prevent user confusion regarding in-kind holding cost.

**Approach:** Implement `Positions` tab displaying raw tokens, norm percentage, and effective units alongside sell actions.

</frozen-after-approval>

## Implementation Notes

- Implemented `Positions` tab in `DashboardPage.tsx`.
- Verified via browser click and snapshot: confirmed raw tokens vs effective units columns.
