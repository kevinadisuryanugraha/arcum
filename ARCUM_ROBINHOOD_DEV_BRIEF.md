# Arcum — Robinhood Chain Developer Brief

**Prepared:** 4 November 2026, Asia/Makassar  
**Updated:** 4 November 2026 — product name confirmed as Arcum  
**Status:** developer handoff; direct functional and UI adaptation  
**Our product name:** Arcum — confirmed by the owner; domain, logo, palette and token identifiers pending  
**Reference product:** https://get-lemniscate.tech/  
**Source baseline:** https://github.com/lemniscatedev/lemniscate  
**Target network:** Robinhood Chain mainnet, chain ID `4663`

> **Arahan owner:** Bangun Arcum sebagai copycat langsung Lemniscate di Robinhood Chain. Gunakan source publik yang tersedia sebagai dasar, pertahankan fungsi, alur pengguna, struktur halaman dan mekanisme finansial referensi. Bangun sistem operasional yang lengkap di bawah identitas kita sendiri. Fitur pembeda dibahas setelah parity tercapai. Tahapan pengerjaan bukan izin mengurangi scope menjadi website demo.

This brief is an implementation specification. It does not claim our fork is deployed, tested or independently audited. Reference observations, inherited defaults and proposed operational requirements are distinguished below.

## 1. Product outcome and scope

Build Arcum, a complete everlasting-options product for Robinhood Chain Stock Tokens, settled in USDG. Users can buy Up/call and Down/put exposure, protect an existing Stock Token holding through Shield, manage and sell positions, provide capital to the Writer Pool, inspect fees and risk, and authorize bounded agent execution.

Deliver the marketing site, trading dashboard, contracts, API, indexer, keeper, hedger, volatility engine, agent tooling, deployment configuration, monitoring and recovery documentation as one working product.

### Confirmed product identity — Arcum

- Use **Arcum** in the landing page, application, onboarding, documentation and release materials.
- **Lemniscate remains the reference product.** Keep its website, repository URLs, pinned commit, source identifiers and required license notices intact for implementation traceability.
- The full direct-copycat scope and financial mechanics remain required. The name change does not approve changes to pricing, fees, risk controls or delivery criteria.
- Domain, social handles, logo, palette, package scope and protocol-token name/ticker are separate decisions. Do not assume that the product name establishes availability or approval of those identifiers.

### Required scope rules

- Use the reference implementation and interaction flows as the baseline. Do not replace the options model with perpetual futures, binary bets or another pricing model.
- Preserve complete functional scope. Keep source-present later-phase modules in the implementation inventory with explicit activation status.
- Deploy and operate our own protocol instances and services. Reuse canonical third-party assets/venues only after verification.
- Our brand, addresses, treasury, operator keys and token identifiers must be independent of Lemniscate's.
- Use real quotes, receipts, funds, liabilities and market states. Demo data must remain explicitly labeled and isolated from production.
- No additional feature, changed economics or extra chain is approved merely because it seems useful. Record proposals separately.
- An inherited defect must be reproduced, documented and corrected with regression evidence; functional parity does not require copying a known vulnerability.

The reference already operates on Robinhood Chain. A first-mover claim is not part of this brief.

## 2. Reproducible source baseline and reuse

Pin the inspected repository snapshot before adaptation:

```text
Repository: https://github.com/lemniscatedev/lemniscate
Commit:     1d434a3a3186cbb0feed172dec3a872cfa610e09
License:    MIT at repository root
```

Source permalink: https://github.com/lemniscatedev/lemniscate/tree/1d434a3a3186cbb0feed172dec3a872cfa610e09

Preserve MIT notices and produce a dependency/asset-license inventory. The web handoff explicitly distinguishes licenses for adapted template/runtime material, photographs, fonts and third-party marks. Root MIT licensing does not assign unrestricted ownership of every visual asset.

| Path | Reusable foundation |
|---|---|
| `contracts/src/` | Engine, pool, registry, oracle, permissions, fees, protection and later-phase modules |
| `contracts/test/`, `contracts/INVARIANTS.md` | Unit, fuzz, stateful and integration tests with stated invariants |
| `contracts/script/` | Deployment profiles, post-deploy checks, bytecode/upgrade verification and fork tooling |
| `app/src/` | Bun/TypeScript services, database, API, pricing reference, MCP and integrations |
| `app/deployments/4663.json` | Upstream deployment reference; never our deployment manifest |
| `vol-engine/` | Python volatility calculation, signing, posting and tests |
| `web/` | Portable static marketing/dashboard snapshot, runtime modules, assets, build scripts and handoff |
| `.github/`, `.audit-grade/` | Operational/security notes and internal review artifacts; not independent audit certification |

Create `BASELINE.md` recording toolchains, build/test results, skipped dependencies, source/deployment drift and the approved parity target. Record any intentional movement to a newer upstream commit through a reviewed change log; do not silently track `main`.

## 3. Product mechanics developers must preserve

### Buyers

- Up is a call; Down is a put. Both reference the value of a Stock Token according to the inherited price/multiplier rules.
- Options have no scheduled maturity. Daily and Weekly are model/funding speeds, not expiry dates.
- The buyer pays a bounded amount in USDG. The design has no buyer margin debt or ordinary liquidation mechanism.
- Continuing holding cost reduces effective option units through the series normalization factor. A buyer can lose the entire purchase amount.
- Closing means selling the remaining effective position at the executable bid, subject to pricing, pool liquidity and queue rules.

### Writers

- The USDG Writer Pool takes the other side of option trades, holds hedges and records option liabilities.
- Depositors receive pool shares and participate in the pool's economics. NAV per share can fall.
- Capital entry and exit must use inherited conservative liability/NAV bounds. Do not value the pool as cash alone.
- Deposit locks, withdrawal queue, claim-time valuation, partial payouts and claim expiry/requeue behavior are core product behavior.

### Shield

Match the inherited flow: verify the user's Stock Token holding and select an eligible Weekly Down series using the requested protection percentage. The code selects from listed buyable put strikes; do not invent an unavailable strike or guarantee exact continuous coverage.

Shield buys protection; it does not lock a guaranteed portfolio floor forever. Effective option units continue to decay and exit depends on valid pricing and settlement.

## 4. Full parity matrix

| Module | Required delivery | Required evidence |
|---|---|---|
| Up/Down trading | Name, speed and strike selection; quote, exact approval, buy, positions and sell | Real local/fork/test transactions and confirmed balances |
| Holding cost | Effective units, norm history, continuing cost and value display | Cross-language vectors, accrual and transfer tests |
| Shield | Holding check, eligible put selection, quote and bounded purchase | Direct-wallet and delegated-agent journeys |
| Writer Pool | Deposit, shares, valuation, lock, request/claim/requeue and partial payouts | Accounting and queue tests plus user journey |
| Market/price guard | Session, fresh price, multiplier, TWAP, halt, continuity and corporate-action states | Invalid/stale/discontinuous-price scenarios |
| Volatility | Data pipeline, sigma/skew/event adjustment, signing and on-chain validity | Reproducible calculation and accepted/rejected posts |
| Risk | Capacity, concentration, stress, drawdown, cash/hedge limits and pause behavior | Enforced boundaries and independent exit tests |
| Hedging | Pool-owned spot inventory, bounded swaps and monitoring | Rebalance, slippage, loss-budget and failure tests |
| Fees/reserve | Income capture, pending fees, reserve and distribution | Conservation/reconciliation and distribution receipts |
| Agent policies/MCP | Read, quote, buy/sell/Shield, budget, expiry, permission and revoke | Agent cannot exceed policy or redirect value |
| Paid data/x402 | Reference-compatible payment challenge, cap and retry behavior | Successful paid read; replay/duplicate/overcharge rejection |
| Account abstraction | Supported smart account, user operation, sponsorship and normal-wallet fallback | Explicit capability status and funded integration tests |
| Receipts/indexing | Activity, positions, pricing/NAV history and inherited proof/receipt publication | Event replay, reorg and proof verification |
| Marketing/dashboard | Reference pages and all dashboard tabs with our identity | Screen/state parity and responsive review |
| Writer rewards | Reproducible eligible points and funded payouts under approved program | Epoch input/output hashes and payout reconciliation |
| Later-phase writer vaults | CoveredUp, CashDown and registry modules | Build/test, wiring and activation checklist |
| Later-phase token modules | Staking, fee tiers, loss layer and buy/burn | Build/test, actual token/route prerequisites and activation checklist |
| Operations/exit | Service isolation, monitoring, direct exit and incident handling | Recovery and outage drills |

Later-phase modules are included in engineering scope. Their initial production activation should match the approved reference release state. A module in source is not automatically a live feature.

## 5. Reference maturity and conflicts to resolve

Public material contains stale descriptions. Maintain a matrix comparing source, public text, configured services and chain state.

Known review points:

1. README describes deployed contracts and an upgrade; some security text still describes earlier development stages.
2. README deployment guidance describes a Safe default, while security policy documents an actual owner-EOA exception behind a 48-hour timelock. Verify roles directly. Do not describe a deployment as multisig-controlled based on a field called `safe`.
3. The available review report is labeled AI pre-audit; security policy does not establish an independent external audit. Our fork cannot inherit an external-audit claim.
4. Staking/burn and specialized writer vaults exist in source but are described as off/closed at launch. Runtime configuration must determine status.
5. Frontend handoff describes an older portable snapshot and empty-config defaults, while checked-in/live configuration has production endpoints. Inspect actual files rather than following stale prose literally.
6. MCP is described as in progress in one overview, although implementations are present. Reproduce actual capabilities before marking them complete.
7. API launch limits include display constants. Compare them with current contract parameters so UI cannot authorize capacity merely because a constant says it exists.

The prior review on 4 November observed an API-reported NAV near 200.01 USDG, zero open option liability and a matching USDG pool balance on-chain. That is a point-in-time infrastructure observation, not proof of adoption, profit, full audit coverage or our deployment readiness.

## 6. Architecture and stack

Preserve the inherited module boundaries initially:

```text
contracts/     Solidity + Foundry, linked libraries and deployment scripts
app/           Bun/TypeScript API, indexer, keeper, hedger, MCP and database
vol-engine/    Python market-data/volatility pipeline and oracle posting
web/           Static/browser-rendered marketing site and trading dashboard
deployments/   Our versioned network manifests and non-secret parameters
docs/          Baseline, parity register, operations and handover
```

| Component | Responsibility and boundary |
|---|---|
| Browser/wallet | Intent, user authorization, exact approvals, signing, transaction and queue visibility |
| API | Quotes, discovery and unsigned intent data; query-layer state does not replace contract enforcement |
| Indexer | Canonical event ingestion, snapshots, history, rollback and replay |
| Keeper | Sessions, accrual, series, risk monitoring, queued fills, receipts, fees and maintenance |
| Hedger | Computes exposure and invokes permitted pool-owned execution; operator key does not custody pool capital |
| Vol engine | Derives and signs valid sigma/event posts with a separate key |
| Agent server | Bounded owner-authorized interaction through AgentRouter and optional paid data |
| Contracts | Assets, liabilities, ownership, policy, price/risk checks, queues and settlement |
| Database | Durable indexed/query/operational records with provenance and restart cursors |

Pinned upstream requirements include Solidity `0.8.28`, Cancun EVM settings, Bun `1.4.2`, Postgres 16/TimescaleDB and Python 3.11+. Web package supports Node >=18 and recommends a newer supported runtime. Use manifests/lockfiles as build authority and verify chain opcode compatibility.

The read-only data/API path must not accidentally acquire funded keeper/hedger keys. Some API subfeatures can use scoped signing authority, such as sponsorship or payment verification; audit those boundaries separately rather than claiming every process is universally keyless.

## 7. Frontend adaptation and visual parity

The source frontend is an adapted Framer/React runtime with editable custom JavaScript/CSS and static HTML entries. It is not an ordinary Next.js component repository or an editable original Framer project.

For the fastest faithful copycat, reproduce the supplied frontend first. If our team migrates it to Next.js, preserve captured layouts, page hierarchy, states, motion, navigation and interactions. A framework migration must not change financial behavior or delay baseline reproduction unnecessarily.

### Editing map

| Area | Source reference |
|---|---|
| Brand/navigation/content and custom sections | `web/dist/lemniscate.js` |
| Theme/layout/typography/responsiveness | `web/dist/lemniscate.css`, `web/dist/dashboard.css` |
| Dashboard behavior | `web/dist/dashboard.js` |
| API/wallet/ABI/region/profile integration | `web/dist/chain/` |
| Service/network and capability configuration | `web/dist/config.js` |
| Native route/layout modules | `web/dist/runtime/`; rebuild generated bundles instead of editing bundle outputs |
| Routes and handoff | `web/handoff/ROUTES.md`, `HANDOFF.md`, `DEPLOYMENT.md`, `ASSETS.md` |

Reference colors include navy, gold, cream and pale blue. Use Arcum as the product name. Our final palette, logo and domain are pending; use clearly marked temporary assets in development and keep visual changes minimal until owner selection.

### Pages and dashboard

| Surface | Required reference routes/states |
|---|---|
| Marketing | `/`, `/products`, `/markets`, `/protocol`, `/costs`, `/writers` |
| Market explanations | `/markets/upside`, `/markets/shield`, `/markets/daily-and-weekly`, `/markets/writer-pool` |
| Learning | `/learn`, `/learn/everlasting-options`, `/learn/daily-holding-cost`, `/learn/shield-protection`, `/learn/stock-token-pricing` |
| Agent/deployment information | `/agents`, `/contracts` |
| Product information | `/privacy`, `/product-terms` with our actual entity and policy |
| Dashboard | `/dashboard` tabs: overview, trade, positions, shield, pool, agents, activity, settings |
| Independent exit | `/exit` and a downloadable standalone exit guide generated from our deployment |

Resolve differences between the handoff's older route count and current website routes; `/writers` and later informational pages must not be missed because they are absent from an old list.

Every flow needs disconnected, wrong-chain, loading, empty, unavailable API, stale data, no liquidity/capacity, approval, signature, submitted, confirmed, reverted, queued, claimable and partial-payment states. Preserve mobile navigation, browser back/forward, deep links, keyboard access and reduced motion.

## 8. Network and deployment identity

| Profile | Chain ID | Requirements |
|---|---:|---|
| Mainnet | `4663` | Robinhood Chain; ETH gas; independently verified external assets/routes |
| Testnet | `46630` | Own test deployments; mocks clearly identified |
| Local fork | `31337` | Pinned mainnet state with local execution and non-production keys |

Reference public RPC: `https://rpc.mainnet.chain.robinhood.com`. Explorer: `https://robinhoodchain.blockscout.com`. Production RPC/provider capacity, archive support and failover behavior must be selected and tested.

Reference USDG: `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168`, 6 decimals. Launch names in the reviewed source: NVDA, TSLA, SPY, QQQ and AAPL. Verify each token, feed, multiplier, market session and hedge pool against current official/network/on-chain data.

Upstream Engine `0x1C1f41721fe49c8dee117B17De1006817C974687` and Writer Pool `0x67fF1306201bCbEBCBB749DcF0cb2686ec11B58A` are reference deployments only. Do not point our product at them by accident.

Create our manifest with contract/proxy/implementation addresses, linked libraries, start blocks, code hashes, compiler settings, initializer parameters, roles, timelock, USDG, stocks/feeds/multipliers, hedge routes, AA dependencies and enabled modules. Publish our contract sources and verify implementation slots and role handoff.

Update frontend configuration, static deployment files, API loader, exit guide, token bar, metadata, cache keys and environment variables consistently. CI must reject unapproved upstream operator endpoints, treasury recipients or token addresses in a production artifact.

## 9. Contract inventory and adaptation

| Contract/module | Required behavior |
|---|---|
| `LemniscateEngine` and engine libraries/helper | Buy/sell/Shield, quote, accrue, mark, caps, stress and drawdown, queued sells, linked-library/storage integrity |
| `SeriesRegistry` | Stock/side/strike/speed identity, buyability, normalization, archival/relist epochs and old-position exit |
| `OptionToken` / factory | Per-series ERC-20 clones; engine-only mint/burn; accrual before balance changes; hold/transfer rules |
| `PriceGuard` | Feed/multiplier/session reads, TWAP cross-check, continuity and invalid-feed behavior |
| `VolOracle` | Signature/domain/nonce validation, sigma bounds, step/rate/validity and earnings block windows |
| `MarketHours` | Configured sessions and supported NYSE-calendar fallback |
| `WriterPool` and pool libraries | Shares, NAV/liability bounds, collateral, spot hedges, income/loss layers, lock and withdrawal queue |
| `Reserve` / `FeeRouter` | First-loss cash layer, fee obligations, timed distribution, held buckets and recipients |
| `AgentRouter` | Owner policy, expiry, allowed stocks, spend accounting and owner-only value destination |
| Hedge adapter / TWAP reference | Approved pool routing, exact allowance and bounded execution |
| Paymaster / AA integration | Supported smart accounts, signed sponsorship, caps and safe normal-wallet fallback |
| `CoveredUpVault`, `CashDownVault`, `VaultRegistry` | Source-present later-phase collateralized writer vaults and epoch settlement |
| `LmnsStaking`, `LmnsBuyBurn` | Source-present token tiers, loss layer, delayed unstake and routed buy/burn |

Retain upstream contract/class names initially where that helps auditability. Map public names to our brand deliberately. Do not globally replace strings inside signature domains, storage namespaces or series/proof identifiers.

## 10. Pricing and in-kind funding

Use the inherited closed-form everlasting model and its TypeScript reference. Do not substitute a fixed-expiry Black-Scholes quote or a linear price multiplier.

Source references: `contracts/src/libs/EverlastingMath.sol`, `EverlastingGreeks.sol`, `Funding.sol`, `FixedMath.sol`, `EngineHelper.sol`, and `app/src/pricing/`.

Implementation requirements:

- Preserve S/K/sigma/tau units, WAD conversions, USDG decimals, rounding and domain bounds.
- Reproduce call/put parity and precision near/far from strike and at boundary values.
- Distinguish model mid, inventory adjustment, session spread, fee and executable bid/ask.
- Quote actual cost/proceeds with the same accrual and fee logic that execution uses. Avoid a quote that fails its own exact maximum due to rounding or accrued fees.
- Show effective units separately from ERC-20 raw balance. Effective units are raw token balance multiplied by the current normalization factor.
- Preserve exponential funding accrual: norm decreases using the bounded inherited rate and elapsed calendar time. Funding must not become negative or increase norm.
- Preserve gap/stale-vol rules and floors, and the accrual-before-mint/burn/transfer behavior.
- Daily uses tau 86,400 seconds; Weekly uses 604,800 seconds. These are not maturity times. Weekend/closed time still counts for holding cost.
- Implement dust, archival and series relisting without destroying old holders' exit path or removing liabilities from accounting.

Run shared vectors and differential tests across Solidity, TypeScript and the Python/reference calculation. Demonstrate precision and conservation; a visually plausible quote is insufficient.

## 11. Price guard, market sessions and corporate actions

Implement REGULAR, EXTENDED, CLOSED, UNKNOWN and HALTED states as inherited. New purchases, exits, fees and queued operations must use the appropriate session rules.

Required scenarios:

- Valid/stale/invalid Chainlink feed, bad timestamp/round, unknown session and missing price.
- Feed versus trade/reference TWAP disagreement, missing observation window and manipulated spot pool.
- Stock Token multiplier applied exactly once; raw-token value and strike units remain consistent through split/dividend changes.
- Continuity jumps and confirming feed rounds before normal operation resumes.
- Closed-session exits with wider spread/appropriate last-good pricing; halt/stale in-session exits queue instead of fabricating a current price.
- Long-halt settlement, next-open timing, pending sells and cancellation behavior.

Do not convert a failed oracle read into a zero-price normal market. PriceGuard returning a classified status rather than reverting does not mean execution may ignore that status.

Source tests must prove how missing TWAP affects buys, sells, LP deposits/claims and queue fills. Respect the audited-fix deployment caveat: source and deployed PriceGuard may have different fallback behavior. Our fresh deployment must use one compatible reviewed set.

## 12. Volatility engine and data quality

Adapt the Python engine, signed EIP-712 posting and on-chain constraints. Preserve separate keeper, hedger and volatility-signing keys.

The inherited pipeline uses regular-hours return history, overnight gaps, floors/markup, strike skew, earnings and weekend adjustments. Some historical inputs require seeding, and conservative defaults are explicitly flagged when history is insufficient.

Deliver:

- A reproducible dataset/snapshot and calculation log per posted sigma.
- Verified event/earnings sources and explicit disagreement or missing-history handling.
- Signature domain/chain/verifier binding, nonces, validity, step/rate/floor constraints and safe signer rotation.
- Dry-run mode, durable posting intents and reconciliation of submitted versus indexed posts.
- Monitoring for stale posts, rejected steps, data gaps, earnings blocks and feed quality.

A 5-minute grid derived from sparse oracle updates is not equivalent to a complete 5-minute trading tape. Document forward filling and its effect on realized volatility; do not remove inherited floors merely because a quiet series appears stable.

Do not change the quantitative model during branding work. Model changes require separate review, stress replay and updated cross-language fixtures.

## 13. Writer Pool accounting, claims and liquidity

Implement the whole deposit-to-exit path:

1. User reviews current NAV, capacity, liability/hedge exposure and risk.
2. User approves the exact USDG amount and deposits.
3. Shares are minted at the inherited conservative entry valuation with the applicable premium.
4. Deposit lock expires before a withdrawal request can be made.
5. Request creates a ticket; no promise of a fixed request-time USDG amount.
6. At maturity, the user claims using claim-time valuation and available liquidity.
7. Partial payment burns only the paid shares; remaining entitlement remains tracked. Missed claim windows requeue as defined.

Reference timings: 24-hour deposit lock, 72-hour withdrawal delay and seven-day claim window. Confirm production values on-chain and preserve hard minima in deployment tooling.

NAV must account for cash, hedges, option liabilities, eligible loss cover and fees owed. Preserve the distinction between book-value views, exact liability recomputation and conservative NAV liability bounds used for capital flows. Tests, not stale comments, determine the accepted accounting path.

Specific requirements:

- No profit from a deposit/withdrawal round trip caused by stale liability marks or rounding.
- Donation/first-deposit/virtual-share behavior tested; no unsupported claim that all pool cash came from tracked writer deposits.
- Pro-rata shortfall handling cannot reward repeated calls or claim order within the inherited payout period.
- Blocked USDG transfers, unavailable hedge liquidity or stale cover must not erase obligations.
- Fees must not force an unsafe hedge sale; outstanding fees remain separately tracked as the source defines.
- A pool balance is not proof of solvency. Compare assets and liabilities consistently.

## 14. Hedging, risk capacity and failure behavior

Adapt pool-held spot hedges and bounded Uniswap execution. The hedger proposes the target; the pool enforces permitted routes, approvals, freshness, slippage, cash buffers and loss limits.

Initial source profile keeps off-chain perp hedging disabled unless a real venue/account is configured. Do not advertise an active short/perp hedge merely because an equity-posting function exists.

Reference risk defaults to reproduce and verify:

| Parameter | Reviewed reference |
|---|---|
| Total outstanding option-value cap | 35% of pool NAV |
| Per-name outstanding cap | 8% of pool NAV |
| Per-series cap | 40,000 USDG, with additional dynamic bounds |
| Per-account per-series cap | 25,000 USDG |
| Stress budget | 20% of NAV; inherited full revaluation scenarios |
| Drawdown trigger | New-buy pause beyond 15% over the tracked 30-day NAV/share window |
| Pool filling UI threshold | 25,000 USDG; display threshold, not a binary on-chain opening rule |
| Reference minimum trade | 1 USDG, subject to configured guards |
| Post-buy hold | Reference 30-minute pricing/transfer rules; selling itself remains possible under the inherited rules |

Extract actual contract parameters into `PARAMETERS.md`. Dynamic capacity depends on the book, session, hedge liquidity and multiple caps; UI cannot simply use 8% of NAV as every trade's allowance.

Test gaps, unfavorable volatility changes, missing hedges, exhausted reserve, thin liquidity, concurrent buys, stale marks and repeated hedge losses. Pausing new buys/deposits must not become an undocumented administrator block on supported sells/withdrawals/claims. Price and cash constraints still apply to exit settlement.

## 15. Fees, reserve and token economics

Preserve economic mechanics first. Final product-token identifiers, recipients and reward funding require explicit owner selection before production.

### Distinguish fee bases

Reference runtime quotes expose a 3-bps fee, model/session-dependent spread and a minimum spread. Source defaults include a protocol share of spread/funding income. These are different concepts; do not display the protocol-income share as a percentage of the user's total trade notional.

Implement separate ledger/report fields for premium, bid/ask spread, direct trade fee, holding-cost income, protocol capture, reserve funding, pending fees and distributions. A premium received is accompanied by an option liability; it is not all profit.

### FeeRouter defaults

| Allocation of protocol fee | Default |
|---|---:|
| Workers | 80% |
| Treasury | 10% |
| Stakers | 5% |
| Buy/burn bucket | 5% |

The worker allocation is further split between pool writers, keeper and hedger under the pinned configuration. The inherited default worker split is 60/20/20 of the worker bucket. Distributions run on the configured period; rounding and held buckets must reconcile. A zero recipient means a held allocation where the source defines it, not permission to redirect it to treasury.

The reserve receives its configured portion of eligible spread until its target is reached. Confirm percentages and waterfall with current contracts. Loss coverage is finite and cannot guarantee NAV.

### Later-phase token modules

Implement and test the supplied staking, fee-tier, unstake, loss-cover and buy/burn modules. Preserve disabled/unwired behavior until our own token, eligible liquidity route, TWAP, cover/per-call caps and funding are configured. Staking can be a loss-bearing layer; never describe it as risk-free passive rewards.

No contract should accidentally use LMNI as our product token. A token launch or liquidity position is a separate funded operational action, not an automatic outcome of renaming the repository.

## 16. Agent Router, MCP, x402 and account abstraction

Preserve owner-controlled on-chain policies: agent address, budget, maximum per trade, expiry, allowed names, sell/Shield permissions and revocation. Spend accounting and receipts must remain correct through retries and policy updates.

Value from agent trades must go to the owner. The agent may not change its recipient, expand its own budget or bypass expiry by calling another path. Queued agent sells belong to the owner; use the current engine cancellation path rather than assuming a legacy router interface remains operational.

MCP reference tools include chain, quote, buy, sell, Shield, positions and pool capabilities. Generate an exact tool inventory from `app/src/mcp/tools.ts` and map the namespace for our product. Test schemas, policy reads, errors, read-only mode, stdio and authenticated HTTP mode.

Use the contract as production policy authority. An environment-only policy mirror that resets spend after restart is development-only and must not silently protect real funds.

Treat third-party metadata, market descriptions and agent prompts as untrusted input. They cannot authorize new spending, grant allowances, change recipients or reveal signing secrets. Typed executable intents need explicit bounds.

For x402, preserve supported scheme verification, per-call spending caps and duplicate/retry handling. Track agent-data payment separately from owner trading budget unless a specific implemented policy includes it.

For ERC-4337, verify EntryPoint, factory/Kernel implementation, allowed execution encoding, sponsorship signer, daily caps and funding. Source can include paymaster code while the live frontend has `oneTap:false`; publish our actual capability status. Supported normal-wallet transactions must remain usable without sponsorship.

## 17. API, database, receipts and indexing

Use inherited `/v1` schemas and OpenAPI as the interface baseline. Frontend and API must agree on units, statuses, reasons and freshness.

| Endpoint family | Required data/behavior |
|---|---|
| Health/config | Deployment, chain, freshness, capabilities, caps and effective parameters |
| Chains/series/vol | Option grid, bid/ask, Greeks, cost, buyability/reasons, sigma and norm history |
| Quote/intents | Exact bounded quote and unsigned transaction/user-operation data |
| Pool | NAV, conservative bounds, exposures, reserve, capacity, locks and queue |
| Accounts | Positions/effective units, activity, policies and smart-account mapping |
| Corporate actions/upcoming | Verified event state, listing status and optional notifications |
| AA | User-operation configuration, authorized send and result tracking |

Record chain ID, deployment version, block/hash, transaction/hash/log index and timestamps on indexed records. Use deduplication, persistent cursors, reorg rollback and deterministic replay. Database snapshots are a query layer; the chain is canonical for financial ownership and permissions.

Trading/LP/queue intents need stable identifiers and explicit pending/submitted/confirmed/reverted/unknown states. Do not resubmit a different action because an RPC call timed out before receipt reconciliation.

Adapt inherited receipt/Merkle-root publication with exact construction and verification tooling. A root commits to selected records; it does not independently prove oracle accuracy, correct model design or solvency.

Keep API/indexer/migrations/queues independently observable. Backfills must respect RPC log limits and preserve data provenance. Do not let display-only API launch constants diverge from enforced contracts without a visible error.

## 18. Writer rewards and specialized writer vaults

Include the supplied rewards calculation and payout workflow, with our own program configuration and funded token budget. Source includes eligibility, time-weighted deposits, exclusions, wallet caps and distribution options. Verify whether over-cap amounts remain unallocated or are redistributed under the selected configuration; do not infer this from a generic helper comment.

Reference public program describes 1,000,000 LMNI per week for eight weeks, a 1,000-USDG time-weighted eligibility level and a 10% per-wallet cap. These are upstream program terms, not our automatically approved token commitments.

Our reward release needs reproducible event inputs, exact epoch boundaries, configured exclusions, allocation digest, sufficient token balance, payment receipts and total reconciliation. Wallet caps do not prove person-level identity resistance. Requested withdrawals and transferred shares must affect eligibility as implemented.

For CoveredUp/CashDown writer vaults, preserve collateral constraints, out-of-the-money coverage bands, pending deposits, epoch accounting, funding/spread share and buyback liabilities. Test failed hook/payout behavior, deferred obligations and whether unpaid income is carried forward or not. Start closed/unwired when matching the reference launch state; activation requires a complete integration demonstration.

## 19. Capital and operating budget

The operator is not required to be counterparty using personal funds for every trade. However, real writer capital is indispensable to real trade capacity.

Two separate budgets must be explicit:

| Budget | What it funds |
|---|---|
| Protocol risk capital | Writer USDG deposits, optional owner seed, reserve and any activated loss-bearing stake |
| Operations | Contract deployment/verification, keeper/hedger gas, RPC/data access, compute, database/storage, monitoring and optional paymaster sponsorship |

Do not promise meaningful trade size with an empty/tiny pool. Provide zero-pool and filling-pool screens, actual maximum affordable exposure and a demonstrated capacity curve using inherited caps. If owner seed is zero, the product must show that honestly and acquire independent deposits before advertising deep liquidity.

Hedging liquidity, a product-token buyback route, reward funding and sponsored gas do not appear automatically after deploying contracts. Record required third-party accounts/assets separately from reusable source.

## 20. Access, administration and emergency exit

Preserve the supported invitation/region controls with clear scope. Website/API gates are not on-chain enforcement unless contracts implement them. Public source describes permissionless contract calls; do not market a frontend gate as a protocol security boundary.

Produce a privilege map for admin, timelock owner, guardian, keeper, hedger, vol signer, paymaster signer, x402 settler and agent. Match inherited delays and review owner-EOA versus multisig as an explicit production ownership decision. Do not silently create a direct deployer bypass.

The 48-hour admin timelock gives notice, not immunity from malicious upgrades. Document exceptional ownership such as the gas paymaster and the exact resources each key controls. Preserve distinct service keys and scoped keystore/password-file access.

Ship `/exit` and a locally downloadable script-free guide generated from our real addresses. Explain how to sell or queue, cancel a queued sell, request/claim/requeue pool withdrawals and inspect approvals when our app/API is unavailable. Asset/price/queue restrictions still apply; do not promise an instantaneous emergency cash withdrawal.

Runbooks: oracle failure, market halt, corporate action, stale sigma, missing TWAP, exhausted cash, issuer freeze, compromised operator key, abnormal hedge loss, pending malicious upgrade, database restore, reorg, RPC outage and frontend outage.

## 21. Meaningful tests and independent review

Reproduce inherited suites before changing economics or storage. Record commit, toolchain, environment and actual results; do not copy pass counts from an upstream README.

| Area | Required checks |
|---|---|
| Maths | Cross-language values/Greeks, call/put parity, extreme S/K/sigma, precision and rounding |
| Funding/tokens | Monotone norm, long gaps, stale rates, zero/dust supply, every balance-change hook and old-series exits |
| Quotes/trades | Quote/execution parity, exact fee ceiling, slippage/deadline, min trades, repeat/concurrent transactions |
| Oracle/sessions | Bad rounds, stale feeds, missing TWAP, continuity, closed market, earnings and corporate actions |
| Pool | Cash/hedge/liability conservation, share accounting, donation, NAV bounds, first deposit and no round-trip extraction |
| Queue | Maturity, claim-time valuation, partial payouts, claim-order independence, missed window and ownership |
| Risk/hedges | Concentration/stress/drawdown, gap losses, malicious route, cleared allowances, budgets and frozen hedger |
| Loss/fees | Reserve waterfall, owed fees, held buckets, correct allocations, route failure and phase-off behavior |
| Agents/AA | Budget/revoke/expiry, recipient binding, owner queue, paid reads, sponsorship abuse and unsupported account code |
| Data/services | Reorg/restart, duplicate logs, stale snapshots, durable intents, key isolation and replay |
| UI | Every route/tab, mobile, empty/filling pool, errors, approved wallet flows and transaction/queue status |
| Deployment | Linked libraries, bytecode, proxy implementation/storage, roles, timelock and exit guide correctness |

Use the upstream invariant map, fuzz/stateful tests, replay simulator and fork fixtures as foundations. Stress testing supports a bounded model; it does not guarantee that all market paths remain solvent.

The inherited AI pre-audit is not an independent review of our fork. Commission focused review of financial accounting, oracle bindings, upgrade/role paths, agent/AA permissions and material modifications before user funds rely on them.

## 22. Build and deployment workflow

Initial source acquisition:

```bash
git clone https://github.com/lemniscatedev/lemniscate.git
cd lemniscate
git checkout 1d434a3a3186cbb0feed172dec3a872cfa610e09
```

Follow pinned scripts and lockfiles. Baseline command families:

```bash
# Contracts
cd contracts
forge build
forge test

# App/services — run from app/
bun install --frozen-lockfile
bun run typecheck
bun test
bun run lint:copy

# Web — run from web/
npm ci
npm run check
npm test
npm run build

# Vol engine — isolated environment, run from vol-engine/
python3 -m venv .venv
. .venv/bin/activate
pip install -e '.[dev]'
pytest -q
```

Commands under each comment use the stated directory; do not paste the whole block sequentially without changing to the correct package. Integration tests may require database, Foundry output or local chain setup. Resolve and document skipped dependencies.

Review `scripts/ci-local.sh`, `contracts/script/README.md`, `app/scripts/fork/`, service deployment scripts and frontend build tooling. Source CI may skip jobs in private repositories: ensure our private build actually runs required checks rather than displaying a successful skipped workflow.

Sequence: reproduce clean baseline; run local/fork flows; adapt identity/config; deploy own test environment; verify contract/ABI/service/frontend wiring; run full acceptance; prepare own mainnet manifest and ownership/funding decisions; deploy/verify; repeat live read-only checks and controlled acceptance with authorized test funds.

No deployment/private key belongs in the repository. Review scripts before enabling FFI, broadcast or production transaction submission. Default development and CI credentials must never control production capital.

## 23. Milestones and responsibilities

| Milestone | Concrete delivery | Exit condition |
|---|---|---|
| A — Baseline | Pinned fork, builds/tests, source/deployment/feature map, captured UI | Reproducible report and blockers identified |
| B — Financial core | Our contracts, maths, oracle/vol, sessions and pool on local/fork | Buy/sell/Shield/deposit/claim work with failure tests |
| C — Operating services | API, indexing, keeper, hedger, receipts and monitoring | Restart/reorg/stale-data recovery and reconciled state |
| D — Full frontend | Reference pages, dashboard, real wallet integration and our identity | Screen/state parity, mobile and true receipt/queue flows |
| E — Agents and optional rails | MCP/policies, paid reads, AA and source-present later modules | Complete tests; explicit active/disabled capability flags |
| F — Release readiness | Economics/config, own manifests, review fixes, funding plan and exit/runbooks | Full evidence matrix and production decisions closed |

Assign named owners/reviewers for Solidity/financial maths, backend/data, vol/hedging, frontend, agent/AA and QA/operations. One developer may own several areas, but no area may remain unowned.

Provide estimates after baseline reproduction, split by adaptation, missing integration, framework migration, test/review and external dependencies. Do not quote a calendar guarantee based only on the availability of a public repo.

## 24. Acceptance demonstrations and handover

Final demonstrations must use our deployments and services:

1. New user connects, sees the correct network/name/speed/strike, obtains a bounded quote, buys and verifies effective units and receipt.
2. Time advances and holding cost reconciles across token balance, norm, API and displayed value.
3. User sells normally; a separate run produces a queued sell under the applicable failure state, followed by supported cancellation/fill.
4. User with a Stock Token holding buys Shield; an oversized or unavailable-strike request is rejected safely.
5. Two writers deposit, wait through real configured locks, request withdrawals and demonstrate normal, partial and requeued claims with no claim-order extraction.
6. A spot hedge is rebalanced within limits; an invalid/slippage/loss-budget action fails without unauthorized value movement.
7. A gap/stale feed/earnings/corporate-action scenario changes buyability and pricing correctly while preserving obligations.
8. Fees, reserve and all recipients reconcile; disabled later-phase buckets remain held as intended.
9. An agent operates within policy; over-budget, expired, revoked and wrong-name requests fail; proceeds always go to the owner.
10. AA/x402 paths work where enabled and are accurately unavailable elsewhere; reference-capability flags agree across UI/API/contracts.
11. Source-present specialized vaults/token modules pass activation tests, with production enablement controlled by the agreed configuration.
12. Operator restores services and database/indexer state; user follows independent exit instructions during app downtime.

Handover package:

- Source repository/history, pinned dependencies, license and asset provenance.
- `BASELINE.md`, `PARAMETERS.md`, feature/activation/parity register and architecture decisions.
- Reproducible build artifacts, ABIs, deployment manifests, code hashes, verification links and privilege map.
- Test/replay/review evidence with environments and unresolved findings.
- API/MCP schemas, user flows, funding/queue explanations and developer setup.
- Fee/claim/reward reconciliation, service metrics and operating budget.
- Deployment, key rotation, backup/restore, incident, upgrade and independent-exit runbooks.
- Secure transfer of operator credentials outside documents/source control.

Acceptance register columns: feature, source path, observed reference state, our implementation, owner, tests, demo evidence, active/disabled status, environment and blocker.

## 25. Pending owner decisions

Development can begin with the pinned source and non-production configuration. Resolve these before the affected production action:

| Decision | Needed before |
|---|---|
| Logo, domain, palette and handles; product name is confirmed as Arcum | Public branding and package publication |
| Protocol-token identity, supply/distribution, rewards and liquidity | Token module activation or public token commitments |
| Treasury/worker/reward recipients and final parameters | Production settlement/initialization |
| Timelock ownership, guardian and operational authorities | Production role handoff |
| Zero-seed versus owner-seeded pool and acquisition plan | Meaningful trading-capacity claims |
| RPC/data/hosting capacity and optional gas sponsorship | Production service readiness |
| Later-phase module activation target | Enabling collateral/staking/AA-dependent public flows |
| Actual product access settings and entity documentation | Public availability and published terms |

Keep the direct-copycat scope as the delivery target. Pending brand choices are not a reason to substitute another product model or stop reproducible baseline work.

## 26. Primary references and evidence boundary

- Product: https://get-lemniscate.tech/
- Writers: https://get-lemniscate.tech/writers
- Learning: https://get-lemniscate.tech/learn
- Contracts: https://get-lemniscate.tech/contracts
- Source snapshot: https://github.com/lemniscatedev/lemniscate/tree/1d434a3a3186cbb0feed172dec3a872cfa610e09
- License: https://github.com/lemniscatedev/lemniscate/blob/1d434a3a3186cbb0feed172dec3a872cfa610e09/LICENSE
- Security policy: https://github.com/lemniscatedev/lemniscate/blob/1d434a3a3186cbb0feed172dec3a872cfa610e09/.github/SECURITY.md
- Internal AI review: https://github.com/lemniscatedev/lemniscate/blob/1d434a3a3186cbb0feed172dec3a872cfa610e09/.audit-grade/2026-10-29-audit.md
- Invariant map: https://github.com/lemniscatedev/lemniscate/blob/1d434a3a3186cbb0feed172dec3a872cfa610e09/contracts/INVARIANTS.md
- Frontend handoff: https://github.com/lemniscatedev/lemniscate/tree/1d434a3a3186cbb0feed172dec3a872cfa610e09/web/handoff
- Vol engine: https://github.com/lemniscatedev/lemniscate/tree/1d434a3a3186cbb0feed172dec3a872cfa610e09/vol-engine
- Reference API health: https://api.get-lemniscate.tech/v1/health
- Reference API pool: https://api.get-lemniscate.tech/v1/pool
- Reference API configuration: https://api.get-lemniscate.tech/v1/config
- Official chain documentation: https://docs.robinhood.com/chain/
- Official network settings: https://docs.robinhood.com/chain/connecting/
- Official canonical assets: https://docs.robinhood.com/chain/contracts/

The review inspected public source, selected documentation, API responses and a read-only pool token balance. It did not execute the full upstream test suite, trade user funds, complete an external audit, verify every production role/bytecode or deploy our product. Those are developer delivery requirements, not completed claims.
