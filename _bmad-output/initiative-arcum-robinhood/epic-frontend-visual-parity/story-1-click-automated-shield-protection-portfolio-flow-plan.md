---
title: '1-Click automated Shield protection portfolio flow'
type: 'feature'
ticket: 4
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

**Problem:** Build automated portfolio downside protection interface for Stock Token holders.

**Approach:** Implement `Shield` tab in `DashboardPage.tsx` inspecting token holdings, calculating protection strike, and providing 1-click execution.

</frozen-after-approval>

## Implementation Notes

- Implemented `Shield` tab with stock selector, balance detector, and protection percentage slider.
- Verified in browser snapshot: confirmed combobox, slider, and execution button.
