---
title: 'Buy, Sell and Queued Sells execution on local node'
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

**Problem:** Implement the core option execution pathways: `buy()`, `sell()`, and `queuedSell` on `HALTED` session in `ArcumEngine.sol`, verifying USDG settlements and OptionToken minting and burning.

**Approach:** Implement `contracts/src/ArcumEngine.sol`, integrate with `PriceGuard` and `SeriesRegistry`, pull USDG into the Writer Pool, mint OptionTokens, and escrow tokens with ticket emission when market is halted.

</frozen-after-approval>

## Implementation Notes

- Implemented `ArcumEngine.sol` with:
  - Exact 3 bps fee calculation + dynamic speed spread.
  - `buy()`: USDG transfer from buyer to pool, OptionToken minting to recipient.
  - `sell()`: OptionToken burning, norm scaling, USDG payout from pool to seller.
  - `queuedSells`: Escrows OptionTokens on `HALTED` session, issues ticket with `SellQueued` event.
- Authored test suite `contracts/test/ArcumEngine.t.sol`:
  - `testBuyUpOption()` [PASS]
  - `testSellOption()` [PASS]
  - `testQueuedSellOnMarketHalt()` [PASS]
- Executed `forge test`: 11 passed, 0 failed, 100% pass rate.
