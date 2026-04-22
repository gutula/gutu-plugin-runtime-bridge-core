# Runtime Bridge Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Added durable resources for runtimes, watched workspaces, provider detections, local skills, and runtime sessions.
- Added action contracts for runtime register and heartbeat, workspace watch, provider detect, local skill discovery, and session prepare or resume.
- Added a `runtime` workspace plus a `runtime-bridge-builder`.
- Added integration and migration coverage for runtime bridge and resume behavior.
- Added watched-workspace host and root allowlists with operator-visible policy status for blocked and warning posture.

## Current Gaps

- Real daemon transport adapters and logs are not wired behind the control plane yet.
- Provider detection is still represented through durable records rather than live shell probing.
- Remote runner and sandbox capability negotiation are still lightweight.

## Recommended Next

- Add daemon log streams, restart evidence, and crash-recovery reporting.
- Add live provider probing and drift comparison against the durable detection records.
- Add richer capability negotiation for remote runners and sandboxes.
- Add signed runtime profile import for reusable operator setups.

## Later / Optional

- Desktop companion UX after the runtime bridge contract settles.
- Remote fleet management once the same-process runtime state is replaced with real adapters.
