# Arcum — Protocol Invariants & Mathematical Properties (`INVARIANTS.md`)

**Date:** 9 November 2026  
**Target Network:** Robinhood Chain Mainnet (`4663`)

---

## Invariant 1: Non-Negative Time Value
- **Definition:** For any valid positive underlying spot $S > 0$, strike $K > 0$, volatility $\sigma > 0$, and speed $\tau > 0$:
  $$V(S) \ge \text{Payoff}(S)$$
  $$\text{Time Value} = V(S) - \text{Payoff}(S) \ge 0$$
- **Proof & Test:** Verified via `InvariantsFuzzTest::testFuzz_TimeValueNonNegative` across 256 stateful fuzz iterations.

---

## Invariant 2: Monotonically Non-Increasing Normalization Factor
- **Definition:** Holding cost decays the series normalization factor in-kind over elapsed time $\Delta t \ge 0$:
  $$\text{Norm}_{t_1} \le \text{Norm}_{t_0} \quad \forall t_1 \ge t_0$$
  $$\text{Norm}_t > 0 \quad \text{for all finite } t$$
- **Proof & Test:** Verified via `InvariantsFuzzTest::testFuzz_NormMonotonicallyDecreasing` and `EverlastingMathTest::testFundingNormDecay`.

---

## Invariant 3: Call-Put Parity Preservation
- **Definition:** Everlasting call and put prices on identical underlyings, strikes, and funding speeds satisfy:
  $$V_{call}(S, K) - V_{put}(S, K) = S - K$$
- **Proof & Test:** Verified in Solidity (`EverlastingMathTest::testCallPutParity`), TypeScript (`pricing.test.ts`), and Python (`test_volatility.py`).

---

## Invariant 4: Bounded Option Delta
- **Definition:** First derivatives of everlasting option prices with respect to underlying spot price are strictly bounded:
  $$\Delta_{call} \in [0, 1], \quad \Delta_{put} \in [-1, 0]$$
  $$\Delta_{call} - \Delta_{put} = 1.0$$
- **Proof & Test:** Verified via `InvariantsFuzzTest::testFuzz_DeltaBounds`.

---

## Invariant 5: Pool Solvency & Liability Bounds
- **Definition:** Total allowable open option liabilities across the protocol cannot exceed the risk capacity of the Writer Pool:
  $$\text{Total Option Liability} \le 35\% \times \text{NAV}_{pool}$$
  $$\text{Per-Name Option Liability} \le 8\% \times \text{NAV}_{pool}$$
  $$\text{Per-Series Option Liability} \le 40,000 \text{ USDG}$$
- **Proof & Test:** Enforced on-chain by `ArcumEngine.capBps()`.

---

## Invariant 6: Selling Is Never Blocked by Administrative Pauses
- **Definition:** When `buysPaused` is activated by the Guardian, option holders can still sell their positions at the executable bid. If the underlying market is in a `HALTED` session, sells are escrowed with ticket receipts into `queuedSells`.
- **Proof & Test:** Verified via `ArcumEngineTest::testQueuedSellOnMarketHalt`.

---

## Invariant 7: Owner-Only Payout Destination for Delegated Agents
- **Definition:** When an authorized AI or MCP agent executes a trade via `AgentRouter`, all option tokens minted and all proceeds from option sales must be delivered directly to the delegating owner account:
  $$\text{Recipient}_{mint} \equiv \text{Owner}, \quad \text{Recipient}_{payout} \equiv \text{Owner}$$
- **Proof & Test:** Verified via `AgentRouterTest::testAgentCanBuyWithinBudget`.
