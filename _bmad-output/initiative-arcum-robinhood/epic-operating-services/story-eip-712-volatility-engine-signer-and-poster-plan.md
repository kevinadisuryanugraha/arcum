---
title: 'EIP-712 volatility engine signer and poster'
type: 'feature'
ticket: 4
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

**Problem:** Build an EIP-712 typed volatility posting signer in Python for Robinhood Chain (ID 4663) that signs `VolReading` structures with isolated keypairs.

**Approach:** Implement `vol_engine/signer.py` using `eth-account` with domain separator `ArcumVolOracle`, verified via `tests/test_signer.py`.

</frozen-after-approval>

## Implementation Notes

- Implemented `VolatilitySigner` supporting EIP-712 typed message generation and cryptographic signing.
- Verified typed message recovery: recovered signer matches public account address.
- Executed `uv run python -m pytest`: 5 passed, 0 failed across signer and volatility suites.
