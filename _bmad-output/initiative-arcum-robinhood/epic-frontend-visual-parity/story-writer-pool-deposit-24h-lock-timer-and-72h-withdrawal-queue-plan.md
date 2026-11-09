---
title: 'Writer Pool deposit, 24h lock timer, and 72h withdrawal queue'
type: 'feature'
ticket: 5
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

**Problem:** Deliver Writer Pool UI with conservative entry bounds, 24h deposit lock timer, and 72h asynchronous withdrawal ticket tracker.

**Approach:** Implement `Pool` tab in `DashboardPage.tsx` displaying NAV breakdown, APR, deposit and withdrawal queue forms.

</frozen-after-approval>

## Implementation Notes

- Implemented `Pool` tab with NAV stats ($2.50M), APR (18.4%), and 72h queue rules.
- Verified in browser snapshot: confirmed deposit input and withdrawal request buttons.
