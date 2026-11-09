---
type: epic
title: "Milestone B — Financial Core, Everlasting Maths & Invariants"
parent: "initiative-arcum-robinhood"
covers: ["M-B"]
status: done
---

# Epic 2: Milestone B — Financial Core, Everlasting Maths & Invariants

## Intent
Validate and adapt the core everlasting options math, engine, registry, price guard, and writer pool contracts. Execute cross-language differential vectors between Solidity, TypeScript, and Python, ensuring zero precision drift.

## Outcome
Full options trading (Buy Up/Down, Sell, Queued Sells, Shield protection) and Writer Pool accounting (deposit, shares, valuation, withdrawal queue, partial payouts) operate flawlessly on a local Robinhood Chain fork (`31337`).

## Done When
1. Closed-form everlasting math vectors match within 1 wei across Solidity (`contracts/src/libs/EverlastingMath.sol`), TypeScript (`app/src/pricing/`), and Python (`vol-engine/`).
2. `PriceGuard` handles all 5 market session states (`REGULAR`, `EXTENDED`, `CLOSED`, `HALTED`, `UNKNOWN`) and enforces TWAP cross-checks.
3. `WriterPool` enforces conservative liability/NAV bounds, 24h deposit lock, 72h withdrawal delay, and 7-day claim window.
4. Shield flow validates user's Stock Token balance and purchases eligible Weekly Down series.
5. Invariant test suites pass: pool assets always cover total option liabilities and protocol reserve.

## References
- `ARCUM_ROBINHOOD_DEV_BRIEF.md` Sections 3, 9, 10, 11, 13, 14.
- `PARAMETERS.md`
