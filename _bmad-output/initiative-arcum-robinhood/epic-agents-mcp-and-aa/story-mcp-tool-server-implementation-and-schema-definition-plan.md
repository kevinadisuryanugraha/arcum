---
title: 'MCP tool server implementation and schema definition'
type: 'feature'
ticket: 2
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

**Problem:** Build Model Context Protocol (MCP) server definitions in TypeScript exposing quote, chain, and shield capabilities to AI agents with strict Zod validation.

**Approach:** Implement `app/src/mcp/tools.ts` with parameter schemas and execution handler, verified via `app/test/mcp.test.ts`.

</frozen-after-approval>

## Implementation Notes

- Implemented `QuoteToolSchema`, `ChainToolSchema`, and `ShieldToolSchema` using Zod.
- Implemented `ArcumMCPHandler.handleQuote()` evaluating closed-form option prices for agent queries.
- Authored test suite `app/test/mcp.test.ts`: verified schema bounds and execution handler.
- Executed `bun test`: 15 passed, 0 failed across all 6 backend suites.
