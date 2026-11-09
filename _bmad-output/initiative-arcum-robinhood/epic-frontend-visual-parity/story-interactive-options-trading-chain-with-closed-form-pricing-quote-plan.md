---
title: 'Interactive options trading chain with closed-form pricing quote'
type: 'feature'
ticket: 2
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

**Problem:** Deliver an interactive options trading matrix with live strike selection, Up/Down toggle, Daily/Weekly speed selection, closed-form pricing quotes, and approval stepper.

**Approach:** Implement `Trade` tab in `DashboardPage.tsx` using `web/src/utils/pricing.ts`, verified via browser interaction and screenshot.

</frozen-after-approval>

## Implementation Notes

- Implemented option chain with ATM/ITM/OTM strikes, delta, daily decay, and 3 bps fee calculation.
- Verified modal stepper (`approving` -> `approved` -> `buying` -> `success`).
- Captured verified visual artifact `artifacts/dashboard_top.png`.
