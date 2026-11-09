---
type: epic
title: "Milestone C — Operating Services, Indexer, Keeper, Hedger & Vol Engine"
parent: "initiative-arcum-robinhood"
covers: ["M-C"]
status: done
---

# Epic 3: Milestone C — Operating Services, Indexer, Keeper, Hedger & Vol Engine

## Intent
Deliver the off-chain operational backend services in Bun/TypeScript and Python: high-throughput event indexer with reorg protection, keeper daemon for funding accrual and queue fulfillment, automated spot hedger, and volatility oracle pipeline.

## Outcome
All 4 background services operate continuously with dedicated isolated keypairs, deterministic database restart cursors, and Prometheus telemetry.

## Done When
1. Bun indexer ingests on-chain contract events into Postgres/TimescaleDB with zero lost blocks and deterministic replay.
2. Keeper service automates daily/weekly funding norm decay, epoch rollovers, and queued sell/claim execution.
3. Hedger service computes pool spot delta and executes bounded rebalances within Uniswap slippage caps.
4. Volatility engine computes implied volatility curves from historical stock returns and signs valid EIP-712 oracle posts.
5. All 4 service keys (Keeper, Hedger, Vol Signer, Admin) are strictly isolated with zero cross-custody.

## References
- `ARCUM_ROBINHOOD_DEV_BRIEF.md` Sections 6, 12, 14, 17.
- `PARAMETERS.md`
