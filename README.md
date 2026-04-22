# Runtime Bridge Core

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Governed daemon and local-runtime control plane for runtime registration, watched workspaces, provider detection, local skill discovery, and resumable runtime sessions.

![Maturity: Hardened](https://img.shields.io/badge/Maturity-Hardened-0f766e) ![Verification: Docs+Build+Typecheck+Lint+Test+Contracts+Integration+Migrations](https://img.shields.io/badge/Verification-Docs%2BBuild%2BTypecheck%2BLint%2BTest%2BContracts%2BIntegration%2BMigrations-6b7280) ![DB: postgres+sqlite](https://img.shields.io/badge/DB-postgres%2Bsqlite-2563eb) ![Integration Model: Actions+Resources+Builders+UI](https://img.shields.io/badge/Integration%20Model-Actions%2BResources%2BBuilders%2BUI-6b7280)

**Maturity Tier:** `Hardened`

## Part Of The Gutu Stack

| Aspect | Value |
| --- | --- |
| Repo kind | First-party plugin |
| Domain group | AI Systems |
| Primary focus | runtimes, watched workspaces, provider detection, local skills, resumable sessions |
| Best when | You want Multica-style daemon and workspace watch ergonomics without sacrificing governed runtime state and policy visibility. |
| Composes through | Actions+Resources+Builders+UI |

- `runtime-bridge-core` turns local daemon and runtime state into first-class governed contracts instead of implicit machine-local behavior.
- `ai-skills-core`, `company-builder-core`, and future out-of-process runners consume this layer to bridge local discovery and safe resume flows.

## What It Does Now

- Exports 7 governed actions: `runtime.runtimes.register`, `runtime.daemons.heartbeat`, `runtime.workspaces.watch`, `runtime.providers.detect`, `runtime.skills.discover`, `runtime.sessions.prepare`, `runtime.sessions.resume`.
- Owns 5 public resources: `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.
- Adds a `runtime` workspace plus a `runtime-bridge-builder` under `tools`.
- Persists runtime health, watched workspace posture, host and root policy evaluation, detected providers, local skill discovery state, and resumable session metadata.
- Gives the governed work OS a clean bridge for local coding runtimes and operator-visible resume behavior.

## Maturity

`runtime-bridge-core` is `Hardened` because it exports durable runtime bridge contracts, exposes operator-facing control-room surfaces, and carries unit, contract, integration, and migration coverage across the public surface.

## Verified Capability Summary

- Group: **AI Systems**
- Verification surface: **Docs+Build+Typecheck+Lint+Test+Contracts+Integration+Migrations**
- Tests discovered: **6** files across unit, contract, integration, and migration lanes
- Integration model: **Actions+Resources+Builders+UI**
- Database support: **postgres + sqlite**

## Dependency And Compatibility Summary

| Field | Value |
| --- | --- |
| Package | `@plugins/runtime-bridge-core` |
| Manifest ID | `runtime-bridge-core` |
| Repo | `gutu-plugin-runtime-bridge-core` |
| Depends On | `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `execution-workspaces-core`, `integration-core` |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.runtime` |
| Provided Capabilities | `runtime.runtimes`, `runtime.local-skills`, `runtime.sessions` |
| Runtime | bun>=1.3.12 |
| Database | postgres, sqlite |
| Integration Model | Actions+Resources+Builders+UI |

## Capability Matrix

| Surface | Count | Details |
| --- | --- | --- |
| Actions | 7 | runtime register, heartbeat, watch, detect, local skill discover, session prepare, session resume |
| Resources | 5 | runtimes, watched workspaces, provider detections, local skills, sessions |
| Builders | 1 | `runtime-bridge-builder` |
| Workspaces | 1 | `runtime` |
| UI | Present | control room, session console, builder, admin commands |

## Quick Start For Integrators

Use this repo inside a compatible Gutu workspace so its `workspace:*` dependencies resolve truthfully.

```bash
bun install
bun run build
bun run test
bun run docs:check
```

```ts
import {
  manifest,
  registerRuntimeAction,
  discoverLocalSkillAction,
  RuntimeResource,
  RuntimeSessionResource
} from "@plugins/runtime-bridge-core";

console.log(manifest.id);
console.log(registerRuntimeAction.id);
console.log(discoverLocalSkillAction.id);
console.log(RuntimeResource.id, RuntimeSessionResource.id);
```

## Current Test Coverage

- Root verification scripts: `bun run build`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:contracts`, `bun run test:integration`, `bun run test:migrations`, `bun run test:unit`, `bun run docs:check`
- Unit files: 2
- Contracts files: 2
- Integration files: 1
- Migrations files: 1

## Known Boundaries And Non-Goals

- This plugin models daemon and runtime bridge state; it does not ship a real desktop app or OS service manager in this rollout.
- Provider detection is represented as durable detection records, not live shell probing.
- External runner transport and remote sandbox execution still build on top of these contracts rather than being embedded here.

## Recommended Next Milestones

- Add richer daemon log ingestion and crash-recovery evidence.
- Add live provider probing and richer runtime heartbeat diagnostics beyond the durable detection records shipped now.
- Expand runtime capability negotiation for out-of-process execution handoff.
- Add signed runtime profile import and workspace bootstrap templates.

## More Docs

See [DEVELOPER.md](./DEVELOPER.md), [TODO.md](./TODO.md), [SECURITY.md](./SECURITY.md), and [CONTRIBUTING.md](./CONTRIBUTING.md).
