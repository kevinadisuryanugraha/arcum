---
title: 'Automated Shield protection flow verification'
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

**Problem:** Verify that Shield can inspect user's Stock Token holdings, automatically resolve the optimal registered Weekly Down Put series, and execute bounded protection purchase.

**Approach:** Implement `_buyInternal` in `ArcumEngine.sol` and test automated Put series matching and purchase in `contracts/test/Shield.t.sol`.

</frozen-after-approval>

## Implementation Notes

- Added `_buyInternal()` supporting direct buyer and delegated payer flows.
- Implemented `shield()` resolving target strike at `spot * (1 - pctBelow)` and routing to Weekly Put series.
- Authored test suite `contracts/test/Shield.t.sol`: `testShieldAutomatedPutPurchase()` [PASS].
- Verified 12 passed tests across all 4 contract test suites.
