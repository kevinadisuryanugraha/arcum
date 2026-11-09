# Arcum — Protocol Privilege & Security Map (`PRIVILEGE_MAP.md`)

**Date:** 9 November 2026  
**Target Network:** Robinhood Chain Mainnet (`4663`)

---

## 1. Role Hierarchy & Timelock Enforcement

```text
[ 48-Hour Timelock Controller (0x58c2...a94e) ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ ArcumEngine Admin ]       [ WriterPool Admin ]
(Upgradeable Proxies)       (Upgrades & Global Caps)

[ Isolated Operational Keypairs (No Upgrades / No Treasury Access) ]
        ├── Keeper Key   ──> storeAccrual(), fillQueued()
        ├── Hedger Key   ──> swapExactIn() (Whitelisted Uniswap Pools Only)
        └── Vol Signer   ──> EIP-712 Signatures (ArcumVolOracle)
```

---

## 2. Granular Role & Access Control Matrix

| Role | Controlled By | Timelock Delay | Granted Capabilities | Prohibited Actions |
|---|---|---|---|---|
| **Timelock Owner / Admin** | Cold Multisig (`0x58c2...a94e`) | **48 Hours** | Upgrade proxy implementations, change fee waterfall, whitelist new stock tokens, adjust risk caps | Cannot withdraw user funds directly; cannot bypass 48h delay |
| **Guardian** | Emergency Multi-Party EOA | **0 Hours (Instant)** | Pause new option buys (`buysPaused`), pause pool deposits on critical volatility surge | **CANNOT block option sells**; cannot touch user funds |
| **Keeper** | Autonomous Worker Daemon | None (Operational) | Call `accrue()` to record funding norm decay, call `fillQueued()` for mature tickets | Cannot spend pool cash; cannot alter series parameters |
| **Hedger** | Automated Delta Rebalance Worker | None (Operational) | Execute exact bounded spot rebalances on whitelisted Uniswap routes | **Cannot transfer USDG out of pool**; cannot exceed 100 bps slippage |
| **Vol Signer** | Dedicated HSM / Secret Key | None (Cryptographic) | Sign EIP-712 typed `VolReading` payloads for on-chain volatility oracle | Cannot sign transactions; cannot spend any protocol gas or funds |
| **Agent Key** | User-Delegated AI / MCP Agent | None (Bounded) | Execute `buyFor`, `sellFor`, `shieldFor` on behalf of owner within on-chain policy | **Cannot change recipient**; cannot exceed budget; cannot trade non-whitelisted stocks |

---

## 3. Key Isolation & Security Guarantees

1. **Zero Key Conflation:** The Keeper daemon, Delta Hedger, and Volatility Signer utilize 3 strictly non-overlapping, distinct cryptographic keypairs. An exploit of the Hedger key cannot sign oracle data or call keeper functions.
2. **Owner-Only Payout Destination:** The `AgentRouter` smart contract enforces that all option tokens minted and all proceeds from option sales are paid directly to the delegating owner account. The agent key has zero custody.
3. **Selling Is Never Blocked:** Administrative buy pauses do not block traders from selling their options. When a market halt occurs, sells automatically escrow into `queuedSells` with ticket receipts.
