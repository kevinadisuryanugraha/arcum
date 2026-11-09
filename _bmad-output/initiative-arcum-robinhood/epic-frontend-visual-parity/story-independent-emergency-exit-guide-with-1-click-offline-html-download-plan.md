---
title: 'Independent emergency exit guide with 1-click offline HTML download'
type: 'feature'
ticket: 6
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

**Problem:** Provide an independent `/exit` guide enabling offline user recovery when frontend or API is unavailable, as required by Section 20 of the brief.

**Approach:** Implement `ExitPage.tsx` with cast command lines and 1-click standalone HTML offline export.

</frozen-after-approval>

## Implementation Notes

- Implemented `ExitPage.tsx` providing direct cast commands and dynamic standalone HTML generator.
- Verified in browser snapshot: confirmed download button and command examples.
