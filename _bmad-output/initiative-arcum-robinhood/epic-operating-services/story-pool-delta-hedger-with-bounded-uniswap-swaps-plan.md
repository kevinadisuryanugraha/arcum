---
title: 'Pool delta hedger with bounded Uniswap swaps'
type: 'feature'
ticket: 3
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

**Problem:** Implement spot delta hedging logic in `app/src/hedger/hedger.ts` enforcing single-rebalance caps, slippage bounds, and USDG cash buffers.

**Approach:** Implement `ArcumDeltaHedger` evaluating net options delta versus pool spot holdings, and author test suite `app/test/hedger.test.ts`.

</frozen-after-approval>

## Implementation Notes

- Implemented `ArcumDeltaHedger` with:
  - Net Delta target computation.
  - Per-rebalance dollar cap enforcement.
  - 10% USDG cash buffer protection.
  - Slippage limit validation (100 bps default).
- Authored test suite `app/test/hedger.test.ts`: 3 passed, 0 failed.
- Executed `bun test`: 11 passed, 0 failed across all backend suites.
