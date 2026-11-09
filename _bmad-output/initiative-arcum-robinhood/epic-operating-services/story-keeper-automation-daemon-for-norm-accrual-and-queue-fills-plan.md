---
title: 'Keeper automation daemon for norm accrual and queue fills'
type: 'feature'
ticket: 2
created: '2026-11-09'
status: 'done'
baseline_revision: '1d434a3a3186cbb0feed172dec3a872cfa610e09'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: 'none'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Automate continuous funding norm accrual (`accrue()`) and queued sell fulfillment when market halts clear.

**Approach:** Implement `app/src/keeper/keeper.ts` with interval-based accrual triggers and market halt state polling, verified via `app/test/keeper.test.ts`.

</frozen-after-approval>

## Implementation Notes

- Implemented `ArcumKeeper` with:
  - Series state registry and elapsed-time accrual trigger.
  - In-kind norm decay calculation matching `Funding.sol`.
  - Queued sell ticket management: holds during `HALTED` session, automatically fulfills upon resume.
- Authored test suite `app/test/keeper.test.ts`: 2 passed, 0 failed.
- Executed `bun test`: 8 passed, 0 failed across indexer, keeper, and pricing suites.
