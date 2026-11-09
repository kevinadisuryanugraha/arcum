---
title: 'ERC-4337 Account Abstraction and paymaster integration'
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

**Problem:** Support gas sponsorship for user trades via ERC-4337 paymaster rules with safe fallback to standard wallet execution.

**Approach:** Implement `app/src/aa/paymaster.ts` tracking daily gas limits, verified via `app/test/aa.test.ts`.

</frozen-after-approval>

## Implementation Notes

- Implemented `ArcumPaymaster` enforcing daily sponsorship budget and fallback to normal wallet.
- Authored test suite `app/test/aa.test.ts`: verified budget limits and rejection when limit is exhausted.
- Executed `bun test`: 16 passed, 0 failed across all 7 backend suites.
