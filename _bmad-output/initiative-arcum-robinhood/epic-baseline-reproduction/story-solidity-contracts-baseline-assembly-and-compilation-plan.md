---
title: 'Solidity contracts baseline assembly and compilation'
type: 'feature'
ticket: 2
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

**Problem:** The core smart contracts (Everlasting options math, Greeks, PriceGuard, WriterPool, Reserve, FeeRouter, AgentRouter) must be assembled and compiled under Solidity 0.8.28 with Cancun EVM settings.

**Approach:** Initialize Foundry with OpenZeppelin v5, link Sourcify-verified Robinhood Chain contracts, implement closed-form everlasting math, and verify call/put parity and norm decay via automated test suite.

</frozen-after-approval>

## Implementation Notes

- Configured `foundry.toml` with Solc `0.8.28`, `cancun` EVM, `via_ir = true`, and 200 optimizer runs.
- Installed `openzeppelin-contracts` and `openzeppelin-contracts-upgradeable` at `v5.1.0`.
- Assembled and compiled:
  - `contracts/src/libs/FixedMath.sol` (18-decimal WAD fixed point arithmetic).
  - `contracts/src/libs/EverlastingMath.sol` (Euler-Cauchy closed-form everlasting call/put pricing).
  - `contracts/src/libs/EverlastingGreeks.sol` (Delta, Gamma, Vega).
  - `contracts/src/libs/Funding.sol` (Continuous exponential normalization decay).
  - `contracts/src/OptionToken.sol` (ERC-20 clone per series).
  - `contracts/src/PriceGuard.sol` (IPriceGuard implementation with NYSE market sessions).
  - `contracts/src/WriterPool.sol` (USDG WriterPool implementation from Sourcify).
  - `contracts/src/FeeRouter.sol` (80% workers, 10% treasury, 5% stakers, 5% burn).
  - `contracts/src/Reserve.sol` & `AgentRouter.sol` (From Sourcify verified bytecode).
- Executed `forge test`: 6 passed, 0 failed, 100% pass rate.
