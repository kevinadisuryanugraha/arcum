---
title: 'Volatility engine Python environment and pytest suite'
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

**Problem:** The Python volatility engine (`vol-engine/`) must compute annualized realized volatility, apply skew/weekend adjustments, solve closed-form everlasting option prices, and execute an automated pytest test suite under Python 3.11+.

**Approach:** Setup `pyproject.toml` with `uv`, implement `vol_engine/volatility.py`, and author pytest suite testing volatility bounds, alpha scaling, and call-put parity.

</frozen-after-approval>

## Implementation Notes

- Configured `pyproject.toml` with `hatchling` and `pytest`.
- Implemented `vol_engine/volatility.py` with log-return variance calculation, 20% floor (`MIN_SIGMA_BPS`), alpha parameter derivation, and closed-form option pricing.
- Executed `uv run pytest`: 4 passed, 0 failed, 100% pass rate.
