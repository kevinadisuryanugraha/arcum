---
title: 'Bun event indexer with persistent cursors'
type: 'feature'
ticket: 1
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

**Problem:** Implement the event indexer service in Bun/TypeScript to track contract events, maintain persistent block cursors, and handle reorg rollbacks.

**Approach:** Implement `app/src/indexer/indexer.ts` tracking block hashes and event deduplication, and author unit tests in `app/test/indexer.test.ts`.

</frozen-after-approval>

## Implementation Notes

- Implemented `ArcumIndexer` with:
  - Block cursor persistence (`chainId`, `lastBlockNumber`, `lastBlockHash`).
  - Event deduplication using `${txHash}-${logIndex}` identifiers.
  - Reorg detection and deterministic rollback method.
- Executed `bun test`: 6 passed, 0 failed across indexer and pricing suites.
- Verified TypeScript compilation: 0 errors.
