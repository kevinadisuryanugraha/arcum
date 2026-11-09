---
title: 'Writer Pool accounting, lock, and withdrawal queue'
type: 'feature'
ticket: 4
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

**Problem:** Verify the complete deposit-to-claim lifecycle of `WriterPool.sol`: 24-hour deposit lock, 72-hour asynchronous withdrawal notice ticket queue, and claim execution.

**Approach:** Deploy `WriterPool` implementation and `ERC1967Proxy`, test deposit with share minting and 24h lock enforcement, open withdrawal ticket via `requestWithdraw()`, warp past 72h, and claim payout.

</frozen-after-approval>

## Implementation Notes

- Verified `WriterPool.sol` behind ERC1967Proxy on Cancun EVM.
- Authored test suite `contracts/test/WriterPoolLifecycle.t.sol`:
  - `testDepositLockAndWithdrawalQueue()` [PASS].
  - Proved immediate withdrawal is rejected with `WithdrawalLocked`.
  - Proved notice ticket requires 72 hours maturity before claim.
  - Proved claim burns shares and transfers USDG payout to LP.
- Verified 13 passed tests across 5 contract suites.
