# Arcum — Protocol Parameters Register (`PARAMETERS.md`)

**Date:** 9 November 2026  
**Status:** Canonical reference parameters extracted directly from `ARCUM_ROBINHOOD_DEV_BRIEF.md` and verified on-chain deployments on Robinhood Chain (Chain ID `4663`).

---

## 1. Network & Settlement Identifiers

| Parameter | Value | Description |
|---|---|---|
| **Product Name** | `Arcum` | Confirmed by owner; direct functional copycat of Lemniscate |
| **Reference Protocol** | `Lemniscate` | Reference repo commit: `1d434a3a3186cbb0feed172dec3a872cfa610e09` |
| **Target Chain** | Robinhood Chain Mainnet | Chain ID: `4663` |
| **Testnet Chain** | Robinhood Chain Testnet | Chain ID: `46630` |
| **Local Fork Chain** | Local Anvil Fork | Chain ID: `31337` |
| **Gas Token** | `ETH` | Standard native gas on Robinhood Chain |
| **Settlement Asset** | `USDG` | `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` (6 decimals) |
| **Public RPC** | `https://rpc.mainnet.chain.robinhood.com` | Official Robinhood Chain mainnet RPC |
| **Block Explorer** | `https://robinhoodchain.blockscout.com` | Blockscout explorer for Chain `4663` |

---

## 2. Launch Stock Tokens & Canonical Feed Addresses

| Stock Symbol | Underlying Asset | Token Address on Robinhood Chain (`4663`) | Decimals | Session Model |
|---|---|---|---|---|
| **NVDA** | NVIDIA Corp. Tokenized Stock | `0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec` | 18 | NYSE Equity Hours |
| **TSLA** | Tesla, Inc. Tokenized Stock | `0x322f0929c4625ed5bad873c95208d54e1c003b2d` | 18 | NYSE Equity Hours |
| **SPY** | SPDR S&P 500 ETF Trust | `0x117cc2133c37b721f49de2a7a74833232b3b4c0c` | 18 | NYSE Equity Hours |
| **QQQ** | Invesco QQQ Trust | `0xd5f3879160bc7c32ebb4dc785f8a4f505888de68` | 18 | NYSE Equity Hours |
| **AAPL** | Apple Inc. Tokenized Stock | `0xaf3d76f1834a1d425780943c99ea8a608f8a93f9` | 18 | NYSE Equity Hours |

---

## 3. Reference Protocol Contract Deployments (Upstream Audit Baseline)

| Component | Upstream Deployed Address | Implementation Address | Verification Source |
|---|---|---|---|
| **LemniscateEngine (Proxy)** | `0x1C1f41721fe49c8dee117B17De1006817C974687` | `ERC1967Proxy` | Verified on Sourcify |
| **WriterPool (Proxy)** | `0x67fF1306201bCbEBCBB749DcF0cb2686ec11B58A` | `0xF69F0Be7599e02DCf8B4494c6841845FC54994aC` | Verified on Sourcify |
| **AgentRouter** | `0x0Dd88438A7d5Aa39141240BC846482cB3a74D0c9` | Standalone contract | Verified on Sourcify |
| **Reserve (Loss Layer)** | `0x2f719703bf5d569975c5cf32748b64d1926762b7` | Standalone contract | Verified on Sourcify |
| **FeeRouter** | `0x01dcf620ebd6b4db8cba7834bd0f2245855eea6e` | Standalone contract | Deployed on Chain `4663` |
| **Timelock Controller** | `0x58c276f4a75602fcf722b0119dc774466884a94e` | 48-Hour delay admin | Verified on Sourcify |
| **LMNI Token (Upstream)** | `0x63b5C2B1eB93Ad62EA06560370f4f317eE1b97D3` | ERC-20 (`18` dec) | Verified on Sourcify |

*Note: Arcum will deploy independent instances of all contracts under our own ownership manifests. Upstream addresses serve strictly as the behavioral and bytecode reference.*

---

## 4. Financial & Option Mechanics

| Parameter | Inherited Value | Unit / Format | Description |
|---|---|---|---|
| **Daily Speed Funding Tau ($\tau_{daily}$)** | `86,400` | seconds (1 day) | Model funding parameter; NOT a maturity/expiry date |
| **Weekly Speed Funding Tau ($\tau_{weekly}$)** | `604,800` | seconds (7 days) | Model funding parameter; NOT a maturity/expiry date |
| **Base Trade Fee** | `3` | basis points (`0.03%`) | Direct protocol trade fee charged on executed value |
| **Math Precision Standard** | `1e18` (WAD) | fixed-point integer | Solved closed-form everlasting option formula precision |
| **USDG Decimal Scaling** | `1e6` | integer | Converts between 18-dec WAD internal math and 6-dec USDG token |
| **Holding Cost Decay** | Continuous / exponential | decay factor | $\text{Norm}_{t} = \text{Norm}_{t_0} \times \exp(-\lambda \Delta t)$; weekend/closed time counts |
| **Effective Units Calculation** | $\text{Balance}_{ERC20} \times \text{Norm}$ | decimal units | Trader holds raw ERC-20, but exercisable units decay over time |
| **Minimum Trade Size** | `1.0` | USDG | Minimum allowable buy or sell transaction |
| **Post-Buy Hold Window** | `1,800` | seconds (30 mins) | Minimum elapsed time before normal transfer/pricing rules settle |

---

## 5. Writer Pool & Liquidity Constraints

| Parameter | Inherited Value | Description |
|---|---|---|
| **Deposit Lock Duration** | `24` hours (`86,400` s) | Minimum holding time after deposit before withdrawal can be requested |
| **Withdrawal Notice Delay** | `72` hours (`259,200` s) | Delay between withdrawal ticket request and maturity for claim |
| **Claim Window** | `7` days (`604,800` s) | Window during which matured withdrawal ticket can be claimed |
| **Pool Filling Threshold** | `25,000` USDG | Display threshold indicating pool is under initialization capacity |
| **Total Open Liability Cap** | `35%` of Pool NAV | Maximum total option liability the pool may absorb across all names |
| **Per-Name Concentration Cap** | `8%` of Pool NAV | Maximum option liability for any single stock (e.g. NVDA) |
| **Per-Series Cap** | `40,000` USDG | Hard maximum liability per individual strike/speed series |
| **Per-Account Series Cap** | `25,000` USDG | Maximum liability a single user account can purchase in one series |
| **Stress Test Loss Budget** | `20%` of Pool NAV | Bound for multi-scenario stress revaluation before pausing new buys |
| **Drawdown Circuit Breaker** | `15%` NAV drop / 30d | Triggers automatic pause on new option writing |

---

## 6. Fee Distribution Waterfall (`FeeRouter`)

| Recipient | Allocation Share | Sub-Allocation Details |
|---|---|---|
| **Workers** | `80%` | Split: `60%` Writer Pool, `20%` Keeper Operator, `20%` Hedger Operator |
| **Protocol Treasury** | `10%` | Dedicated Arcum protocol governance & development treasury |
| **Stakers (Phase 2)** | `5%` | Reserved for future Arcum token stakers (held in escrow until activated) |
| **Buy & Burn (Phase 2)** | `5%` | Reserved for market buyback and burn (held in escrow until activated) |

---

## 7. Market Sessions & Oracle Rules

| Market Session State | Trading Permitted? | Pricing Source | Queued Operations |
|---|---|---|---|
| `REGULAR` (NYSE 9:30–16:00 ET) | Yes (Full) | Live Chainlink Feed + TWAP check | Immediate execution |
| `EXTENDED` (Pre/Post-Market) | Yes (Restricted) | Extended session oracle + wider spread | Bounded slippage required |
| `CLOSED` (Nights & Weekends) | Exits only (Wider spread) | Last good price + continuous decay | Buys paused; Sells permitted at wide bid |
| `HALTED` (Circuit Breaker / Vol Gap) | No | Price frozen / stale | Buys rejected; Sells escrowed to `QueuedSells` |
| `UNKNOWN` | No | Revert / fail-safe | All operations paused until state resolved |
