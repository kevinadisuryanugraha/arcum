---
title: 'Service key isolation and health monitoring API'
type: 'feature'
ticket: 5
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

**Problem:** Expose telemetry endpoints (`/v1/health`, `/v1/config`, `/v1/pool`) and verify key isolation preventing shared custody between Keeper, Hedger, and Volatility Signer.

**Approach:** Implement `app/src/api/server.ts` with Bun HTTP server and author verification tests in `app/test/api.test.ts`.

</frozen-after-approval>

## Implementation Notes

- Implemented `createHealthResponse` and `startServer` exposing:
  - `/v1/health`: chain status, service health, and key isolation boolean.
  - `/v1/config`: network configuration and fee structure.
  - `/v1/pool`: Writer Pool NAV metrics and capacity.
- Authored test suite `app/test/api.test.ts`: verified HTTP responses and key reuse detection.
- Executed `bun test`: 13 passed, 0 failed across all 5 backend suites.
- Executed `bun run typecheck`: 0 errors.
