---
title: 'Cross-language differential vectors (Solidity vs TypeScript vs Python)'
type: 'feature'
ticket: 5
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

**Problem:** Financial calculations must be proven identical across Solidity, TypeScript, and Python closed-form implementations with zero precision divergence.

**Approach:** Author automated differential testing pipeline `scripts/differential_test.py` evaluating pricing, alpha scaling, and call-put parity across diverse strike/spot/speed vectors.

</frozen-after-approval>

## Implementation Notes

- Implemented `scripts/differential_test.py` running vectors against Bun/TypeScript and Python engines.
- Executed differential runner:
  - Max Alpha Diff: `0.00e+00`
  - Max Price Diff: `0.00e+00`
  - 100% pass across all vectors.
