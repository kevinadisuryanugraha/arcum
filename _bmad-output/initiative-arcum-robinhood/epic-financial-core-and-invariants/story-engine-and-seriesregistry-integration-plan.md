---
title: 'Engine and SeriesRegistry integration'
type: 'feature'
ticket: 1
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

**Problem:** Implement `SeriesRegistry` contract to list everlasting series, deploy `OptionToken` clones, track epochs, and persist normalization factor accruals.

**Approach:** Implement `contracts/src/SeriesRegistry.sol` satisfying `ISeriesRegistry`, supporting relisting thresholds and epoch transitions, with automated Foundry test suite.

</frozen-after-approval>

## Implementation Notes

- Implemented `SeriesRegistry.sol` with:
  - Allowed stocks whitelist.
  - Deterministic series ID calculation: `keccak256(abi.encode(stock, isCall, strike, tauSeconds, epoch))`.
  - Automated `OptionToken` deployment per series.
  - Relisting epoch logic: archiving prior epoch when new epoch is listed.
- Authored test suite `contracts/test/SeriesRegistry.t.sol`:
  - `testListSeriesDailyUp()` [PASS]
  - `testEpochRelisting()` [PASS]
- Executed `forge test`: 8 passed, 0 failed, 100% pass rate.
