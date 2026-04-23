# Runtime Bridge Core Flows

## Happy paths

- `runtime.runtimes.register`: Governed action exported by this plugin.
- `runtime.daemons.heartbeat`: Governed action exported by this plugin.
- `runtime.workspaces.watch`: Governed action exported by this plugin.
- `runtime.providers.detect`: Governed action exported by this plugin.
- `runtime.skills.discover`: Governed action exported by this plugin.
- `runtime.sessions.prepare`: Governed action exported by this plugin.
- `runtime.sessions.resume`: Governed action exported by this plugin.

## Operational scenario matrix

- No operational scenario catalog is exported today.

## Action-level flows

### `runtime.runtimes.register`

Governed action exported by this plugin.

Permission: `runtime.runtimes.register`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `runtime.daemons.heartbeat`

Governed action exported by this plugin.

Permission: `runtime.daemons.heartbeat`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `runtime.workspaces.watch`

Governed action exported by this plugin.

Permission: `runtime.workspaces.watch`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `runtime.providers.detect`

Governed action exported by this plugin.

Permission: `runtime.providers.detect`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `runtime.skills.discover`

Governed action exported by this plugin.

Permission: `runtime.skills.discover`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `runtime.sessions.prepare`

Governed action exported by this plugin.

Permission: `runtime.sessions.prepare`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `runtime.sessions.resume`

Governed action exported by this plugin.

Permission: `runtime.sessions.resume`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `runtime.runtimes`, `runtime.watched-workspaces`, `runtime.provider-detections`, `runtime.local-skills`, `runtime.sessions`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


## Cross-package interactions

- Direct dependencies: `auth-core`, `org-tenant-core`, `role-policy-core`, `audit-core`, `execution-workspaces-core`, `integration-core`
- Requested capabilities: `ui.register.admin`, `api.rest.mount`, `data.write.runtime`
- Integration model: Actions+Resources+UI
- ERPNext doctypes used as parity references: none declared
- Recovery ownership should stay with the host orchestration layer when the plugin does not explicitly export jobs, workflows, or lifecycle events.
