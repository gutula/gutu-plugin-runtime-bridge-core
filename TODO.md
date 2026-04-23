# Runtime Bridge Core TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Exports 7 governed actions: `runtime.runtimes.register`, `runtime.daemons.heartbeat`, `runtime.workspaces.watch`, `runtime.providers.detect`, `runtime.skills.discover`, `runtime.sessions.prepare`, `runtime.sessions.resume`.
- Owns 5 resource contracts: `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.
- Adds richer admin workspace contributions on top of the base UI surface.
- Defines a durable data schema contract even though no explicit SQL helper module is exported.

## Current Gaps

- No standalone plugin-owned event, job, or workflow catalog is exported yet; compose it through actions, resources, and the surrounding Gutu runtime.
- The repo does not yet export a domain parity catalog with owned entities, reports, settings surfaces, and exception queues.

## Recommended Next

- Deepen runtime observability and failure recovery patterns as more production workflows depend on bridge handoffs.
- Clarify adapter stability and compatibility boundaries before expanding bridge coverage further.
- Add deeper provider, persistence, or evaluation integrations only where the shipped control-plane contracts already prove stable.
- Expand operator diagnostics and release gating where the current lifecycle already exposes strong evidence paths.
- Promote important downstream reactions into explicit commands, jobs, or workflow steps instead of relying on implicit coupling.

## Later / Optional

- More connector breadth, richer evaluation libraries, and domain-specific copilots after the baseline contracts settle.
