---
title: 'Live stock ticker and market session state bar'
type: 'feature'
ticket: 1
created: '2026-11-09'
status: 'done'
baseline_revision: '1d434a3a3186cbb0feed172dec3a872cfa610e09'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'none'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Trader UI requires live equity feeds (NVDA, TSLA, SPY, QQQ, AAPL) with 24h delta, IV, and dynamic session indicators (`REGULAR`, `EXTENDED`, `CLOSED`).

**Approach:** Implement `StockTickerBar.tsx` and Navbar session status pill, verified via browser snapshot.

</frozen-after-approval>

## Implementation Notes

- Implemented `web/src/components/StockTickerBar.tsx` with live price and IV badges.
- Verified live rendering on `http://localhost:3001/` via agent_browser snapshot.
