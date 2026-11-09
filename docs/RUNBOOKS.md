# Arcum — Emergency Operational Runbooks (`RUNBOOKS.md`)

**Date:** 9 November 2026  
**Target Network:** Robinhood Chain Mainnet (`4663`)

---

## Runbook 1: Oracle Feed Failure & Missing Price
- **Symptom:** `PriceGuard.read(stock)` returns `PriceStatus.MISSING` or `stale = true`.
- **Immediate Impact:** New option purchases and Shield buys on that stock are paused automatically (`SessionBlocksBuys`). Existing option sells remain permitted at the last recorded good price (`lastGoodPrice`).
- **Mitigation:**
  1. Inspect primary Chainlink feed status on Blockscout.
  2. Verify if NYSE session is `CLOSED` or `HALTED`.
  3. If primary feed is permanently deprecated, queue an admin proposal through the 48-Hour Timelock to call `PriceGuard.setStock(stock, newFeedConfig)`.

---

## Runbook 2: NYSE Equity Market Halt (LULD / Circuit Breaker)
- **Symptom:** Underlying stock trading is suspended on NYSE.
- **Protocol Action:** Guardian or automated watcher calls `PriceGuard.setMarketHalt(stock, true)`.
- **Execution State:**
  - Buys are rejected immediately.
  - Sells cannot execute instantly at stale prices; instead, `ArcumEngine.sell()` escrows the user's OptionTokens and issues a `QueuedSell` ticket with a `SellQueued` event.
- **Resolution:**
  - Once trading resumes, call `PriceGuard.setMarketHalt(stock, false)`.
  - Keeper daemon calls `ArcumEngine.fillQueued(ticket)` to settle escrowed sells at the opening mark price.

---

## Runbook 3: Corporate Actions & Stock Splits
- **Symptom:** Stock undergoes a forward or reverse split (e.g. 10:1 split on NVDA).
- **Protocol Action:**
  1. Pause series creation on affected stock via `SeriesRegistry.setBuyable(seriesId, false)`.
  2. Multiplier in `PriceGuard` is updated to reflect post-split token units.
  3. Existing series strikes and norm values remain mathematically preserved; new strikes matching post-split pricing are listed.

---

## Runbook 4: Stale Sigma / Volatility Signer Outage
- **Symptom:** Python volatility engine daemon fails to post EIP-712 signed readings for > 2 hours.
- **Protocol Action:** `ArcumEngine` reverts buy transactions with `StaleVol()`.
- **Mitigation:**
  1. Check `vol_engine` service logs on host: `journalctl -u arcum-vol-engine`.
  2. Restart Python daemon: `cd vol-engine && uv run python -m vol_engine.daemon`.
  3. If signing key is corrupted, rotate key in `VolOracle` contract.

---

## Runbook 5: Abnormal Spot Hedge Loss / Slippage Exceeded
- **Symptom:** Delta hedger fails to rebalance spot tokens due to Uniswap liquidity depletion (> 100 bps slippage).
- **Protocol Action:** Hedger halts automatic swap and logs `HedgeSlippageExceeded`.
- **Mitigation:**
  1. The Writer Pool retains its cash buffer and absorbs residual delta without executing unsafe trades.
  2. First-loss capital in `Reserve.sol` covers any deficit.
  3. Hedger resumes execution once pool liquidity deepens.

---

## Runbook 6: Compromised Operator Key & Rapid Rotation
- **Symptom:** Keeper or Hedger private key is leaked or compromised.
- **Protocol Action:**
  1. Guardian immediately calls `setHedgerFrozen(true)` on `WriterPool`.
  2. Timelock owner or multi-role admin revokes `KEEPER_ROLE` or `HEDGER_ROLE` from old address and grants it to the replacement keypair.
  3. Note: The compromised operational key **CANNOT withdraw funds or upgrade contracts**, eliminating catastrophic capital loss.

---

## Runbook 7: Deep Blockchain Reorg (> 10 blocks)
- **Symptom:** Robinhood Chain node reports reorg event.
- **Protocol Action:**
  1. `ArcumIndexer` detects parent block hash mismatch.
  2. Automatically executes `indexer.rollback(safeBlock)` removing orphaned event records.
  3. Deterministic replay ingests canonical chain blocks from the fork point.

---

## Runbook 8: Complete Web Interface / API Outage (Independent Exit)
- **Symptom:** Vercel / Cloudflare hosting or Bun API server is offline.
- **Protocol Action:**
  1. Users download the standalone, script-free `arcum-independent-exit-guide.html` from `/exit` or repository root.
  2. Users execute option sales or Writer Pool withdrawal claims directly on Robinhood Chain using `cast` (Foundry) or Blockscout contract write tabs.
  3. No central intermediary can prevent user withdrawals.
