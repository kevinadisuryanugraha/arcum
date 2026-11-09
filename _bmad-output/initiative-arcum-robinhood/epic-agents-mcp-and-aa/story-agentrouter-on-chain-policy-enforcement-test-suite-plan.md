---
title: 'AgentRouter on-chain policy enforcement test suite'
type: 'feature'
ticket: 1
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

**Problem:** Verify on-chain policy constraints in `AgentRouter.sol`: budget bounds, max-per-trade limits, allowed stocks whitelist, and owner-only recipient enforcement.

**Approach:** Implement interface getters on `ArcumEngine.sol` and author comprehensive Foundry test suite in `contracts/test/AgentRouter.t.sol`.

</frozen-after-approval>

## Implementation Notes

- Added `usdg()`, `registry()`, and `priceGuard()` view functions to `ArcumEngine.sol` matching `IAgentRouterEngine`.
- Authored test suite `contracts/test/AgentRouter.t.sol`:
  - `testAgentCanBuyWithinBudget()` [PASS]: tokens mint to owner, budget decrements.
  - `testAgentCannotTradeExceedingMaxPerTrade()` [PASS]: reverts `MaxPerTradeExceeded`.
  - `testAgentCannotTradeUnallowedStock()` [PASS]: reverts `StockNotAllowed`.
  - `testOwnerCanRevokeAgentPolicy()` [PASS]: reverts `PolicyIsRevoked`.
- Executed `forge test`: 20 passed, 0 failed across all 7 suites.
