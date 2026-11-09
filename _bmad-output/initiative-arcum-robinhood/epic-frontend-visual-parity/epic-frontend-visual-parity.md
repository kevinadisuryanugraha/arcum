---
type: epic
title: "Milestone D — 100% Visual & Functional Parity Frontend (Arcum Adaptation)"
parent: "initiative-arcum-robinhood"
covers: ["M-D"]
status: done
---

# Epic 4: Milestone D — 100% Visual & Functional Parity Frontend (Arcum Adaptation)

## Intent
Deliver a front-end application with 100% visual, layout, typographic, motion, and functional fidelity to the reference Lemniscate platform, adapted cleanly to the Arcum brand and Robinhood Chain mainnet requirements specified in the Developer Brief.

## Visual Design Standard (Anti-Slop, High-End Agency Tier)
- **Palette:** Luxury institutional dark theme — Deep Midnight Obsidian (`#070B19` / `#0B132B`), Champagne Gold accent (`#D4AF37` / `#C5A880`), Crisp Off-White typography (`#F8FAFC` / `#E2E8F0`), Subtle slate borders (`#1E293B`), Emerald Green Up/Call (`#10B981`), Crimson Rose Down/Put (`#F43F5E`).
- **Typography:** Wide editorial hierarchy with crisp tracking, tabular numerical figures for Greek/option metrics, and zero awkward text wraps.
- **Micro-Interactions:** Smooth Framer/GSAP motion transitions, tactile button states, active tab underlines, and real-time decay animation.
- **Session Indicators:** Real-time visual session badges (`REGULAR`, `EXTENDED`, `CLOSED - Weekend Decay Active`, `HALTED`).
- **Responsive:** 100% seamless experience across desktop widescreen, laptop, tablet, and mobile.

## Outcome
All 21 reference routes, learning modules, market explanation pages, and full trading dashboard tabs are live with real wallet connectivity, accurate Greeks calculation, and responsive UX.

## Done When
1. **Marketing & Informational Pages Complete:**
   - `/`, `/products`, `/markets`, `/protocol`, `/costs`, `/writers`
   - Market detail: `/markets/upside`, `/markets/shield`, `/markets/daily-and-weekly`, `/markets/writer-pool`
   - Learning center: `/learn`, `/learn/everlasting-options`, `/learn/daily-holding-cost`, `/learn/shield-protection`, `/learn/stock-token-pricing`
   - Deployment & legal: `/agents`, `/contracts`, `/privacy`, `/product-terms`
2. **Dashboard Tabs Fully Functional (`/dashboard`):**
   - `overview`: Portfolio metrics, active positions, PnL, pool share summary.
   - `trade`: Interactive option chain, Up/Down strike selection, speed toggle (Daily/Weekly), bounded quote modal, exact approval, and buy execution.
   - `positions`: Raw token balance vs effective decaying units display, historical norm chart, sell execution, and queued sell status.
   - `shield`: Stock Token wallet balance detector, eligible Down strike selector, bounded cost quote, and 1-click protection purchase.
   - `pool`: Writer pool NAV breakdown, conservative entry valuation, deposit flow (USDG approval + deposit), withdrawal queue ticket tracker, and claim execution.
   - `agents`: Active agent policies, remaining spend allowance, allowed stocks checklist, and revoke action.
   - `activity`: Complete transaction receipt history with Blockscout explorer links.
   - `settings`: Network status, RPC endpoint selector, and user preferences.
3. **Independent Exit Surface:** `/exit` route active with automated downloadable standalone HTML exit guide.
4. **All Edge States Handled:** Disconnected wallet, wrong chain (auto-prompt switch to `4663`), empty pool / pool filling badge, API unavailable fallback, transaction pending/confirmed/reverted toasts.

## References
- `ARCUM_ROBINHOOD_DEV_BRIEF.md` Section 7, 8, 20.
- `web/handoff/ROUTES.md`, `HANDOFF.md`, `DEPLOYMENT.md`, `ASSETS.md`
- `PARAMETERS.md`
