---
title: 'Privilege map and 48-hour timelock ownership transition'
type: 'chore'
ticket: 2
created: '2026-11-09'
status: 'done'
baseline_revision: '1d434a3a3186cbb0feed172dec3a872cfa610e09'
route: 'oneshot'
route_source: 'auto'
risk: 'high'
review: 'none'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Formulate the official privilege and security governance map, confirming 48-hour timelock ownership and isolated operational keys.

**Approach:** Author `docs/PRIVILEGE_MAP.md` documenting all role permissions, timelock constraints, and operational boundaries.

</frozen-after-approval>

## Implementation Notes

- Documented 48-hour timelock enforcement (`0x58c2...a94e`).
- Mapped distinct roles: Timelock Admin, Guardian, Keeper, Hedger, Vol Signer, and Agent Router.
- Verified invariant: selling is never blocked by administrative pauses.
