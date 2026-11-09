# Arcum — Later-Phase Modules Activation Checklist (`LATER_PHASE_ACTIVATION.md`)

**Date:** 9 November 2026  
**Status:** Code assembled and verified; initially closed/unwired at launch per `ARCUM_ROBINHOOD_DEV_BRIEF.md`.

---

## 1. Overview & Policy

Per Section 4, 15, and 18 of the Developer Brief:
- **A module present in source is not automatically an active feature.**
- Specialized writer vaults (`CoveredUpVault`, `CashDownVault`, `VaultRegistry`) and token modules (`ArcumStaking`, `FeeRouter` 5% stakers / 5% burn buckets) are compiled and tested, but start **CLOSED / UNWIRED** at initial release.
- Activation requires satisfying all external dependencies, funding requirements, and formal governance approval.

---

## 2. Specialized Writer Vaults Activation Checklist (`CoveredUpVault` & `CashDownVault`)

| Item | Prerequisite Description | Verification Check | Status |
|---|---|---|---|
| **V1** | Contract compilation and unit test verification | `VaultsAndStakingTest::testVaultDepositWhenOpened` passes | ✅ **VERIFIED** |
| **V2** | Initial default state verified as closed | `vault.open() == false` confirmed | ✅ **VERIFIED** |
| **V3** | Dedicated Stock Token inventory established for Covered Call collateral | Collateral custody accounts funded | ⏳ Pending Owner Allocation |
| **V4** | Liquidity and moneyness band selection approved | Moneyness band configured (100% to 150%) | ⏳ Governance Decision |
| **V5** | Production registration in `VaultRegistry` | `VaultRegistry.addVault()` executed | ⏳ Deployment Phase 2 |
| **V6** | Owner approval to enable public deposits | `vault.setOpen(true)` executed via 48h Timelock | ⏳ Launch Window Phase 2 |

---

## 3. Protocol Token & Staking Activation Checklist (`ArcumStaking`)

| Item | Prerequisite Description | Verification Check | Status |
|---|---|---|---|
| **T1** | Token issuance and contract deployment | Official Arcum token address confirmed on Chain `4663` | ⏳ Pending Owner Token Launch |
| **T2** | Uniswap v3 / decentralized liquidity pool funded | TWAP reference source active on Robinhood Chain | ⏳ Liquidity Seeding |
| **T3** | Zero-slash safe fallback verified | `ArcumStakingTest::testStakingZeroSlashSafeAtLaunch` passes | ✅ **VERIFIED** |
| **T4** | FeeRouter recipient registration | `FeeRouter.setRecipient(STAKERS_BUCKET, stakingContract)` | ⏳ Phase 2 Handoff |
| **T5** | Risk disclosure published | Staking explicitly labeled as a **loss-bearing capital layer** | ✅ Documented in Product Terms |
