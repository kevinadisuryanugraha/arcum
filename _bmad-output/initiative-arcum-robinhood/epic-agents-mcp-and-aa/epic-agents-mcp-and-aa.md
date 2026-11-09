---
type: epic
title: "Milestone E — Agent Router, MCP Server, Paid Reads & Account Abstraction"
parent: "initiative-arcum-robinhood"
covers: ["M-E"]
status: done
---

# Epic 5: Milestone E — Agent Router, MCP Server, Paid Reads & Account Abstraction

## Intent
Deliver automated trading interfaces: the owner-controlled on-chain `AgentRouter`, Model Context Protocol (MCP) server integration, paid data payment scheme (x402), and ERC-4337 Account Abstraction capabilities.

## Outcome
AI agents can interact safely with Arcum protocol through verified MCP tools while strictly confined to owner-defined spend budgets, expiry dates, and allowed asset scopes.

## Done When
1. `AgentRouter.sol` policy checks verified: agent cannot exceed budget, cannot trade expired policies, cannot trade unauthorized stock tokens, and all sale proceeds return directly to owner.
2. MCP server exposes full tool inventory (`chain`, `quote`, `buy`, `sell`, `shield`, `positions`, `pool`) in both stdio and authenticated HTTP modes.
3. Untrusted prompts or malicious agent inputs cannot alter withdrawal recipients or drain owner allowances.
4. ERC-4337 Account Abstraction support verified: UserOperation construction, paymaster sponsorship verification, and fallback to normal wallet.
5. x402 paid data protocol verified with duplicate/replay attack rejection.

## References
- `ARCUM_ROBINHOOD_DEV_BRIEF.md` Section 9, 16.
- `PARAMETERS.md`
