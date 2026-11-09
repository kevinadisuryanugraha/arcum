---
type: epic
title: "Milestone A — Baseline Reproduction & Toolchain Verification"
parent: "initiative-arcum-robinhood"
covers: ["M-A"]
status: done
---

# Epic 1: Milestone A — Baseline Reproduction & Toolchain Verification

## Intent
Establish a completely reproducible upstream baseline from commit `1d434a3a3186cbb0feed172dec3a872cfa610e09`. Measure and verify all 5 toolchains (`Foundry/Solidity 0.8.28`, `Bun 1.4.2`, `Python 3.11+ / uv`, `Node >=18`, `Postgres/TimescaleDB`). Catalog source-verified contracts from Sourcify on Robinhood Chain `4663` and generate `BASELINE.md`.

## Outcome
All core packages (`contracts/`, `app/`, `vol-engine/`, `web/`) build cleanly in local environments with zero unhandled errors. Every upstream dependency and license notice is audited.

## Done When
1. Upstream commit `1d434a3a3186cbb0feed172dec3a872cfa610e09` and Sourcify verified sources are assembled and cross-referenced.
2. Foundry contract compilation succeeds on Cancun EVM settings with Solidity `0.8.28`.
3. Bun typecheck and test suite pass with zero errors in `app/`.
4. Python volatility engine dependencies install via `uv` / `pip` and test suite passes in `vol-engine/`.
5. Frontend dependencies install cleanly in `web/` and build command generates distribution bundles.
6. `BASELINE.md` is authored, recording toolchain versions, test pass rates, and identified gaps.

## Boundaries
- Does not change contract logic or swap parameters.
- Does not deploy live contracts to Robinhood Chain mainnet.

## References
- `ARCUM_ROBINHOOD_DEV_BRIEF.md` Sections 2, 6, 21, 22.
- `PARAMETERS.md`
- Upstream Commit: `1d434a3a3186cbb0feed172dec3a872cfa610e09`
