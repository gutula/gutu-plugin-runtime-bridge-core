import { loadJsonState, updateJsonState } from "@platform/ai-runtime";
import { normalizeActionInput } from "@platform/schema";

export type RuntimeStatus = "online" | "offline" | "degraded";
export type RuntimeTransport = "daemon" | "local-cli" | "remote-worker";
export type WatchedWorkspaceStatus = "active" | "paused" | "lost";
export type WorkspacePolicyStatus = "approved" | "warning" | "blocked";
export type RuntimeSyncMode = "watch" | "manual";
export type RuntimeBranchStrategy = "reuse" | "branch";
export type ProviderDetectionStatus = "detected" | "configured" | "missing";
export type LocalSkillStatus = "discovered" | "imported" | "stale";
export type RuntimeSessionStatus = "prepared" | "running" | "waiting-resume" | "resumed" | "closed";

export type RuntimeRegistrationRecord = {
  id: string;
  tenantId: string;
  label: string;
  status: RuntimeStatus;
  transport: RuntimeTransport;
  endpoint: string | null;
  ownerActorId: string;
  profile: string;
  capabilities: string[];
  lastHeartbeatAt: string;
};

export type WatchedWorkspaceRecord = {
  id: string;
  tenantId: string;
  runtimeId: string;
  repoRef: string;
  host: string;
  workspaceId: string | null;
  workDir: string | null;
  status: WatchedWorkspaceStatus;
  syncMode: RuntimeSyncMode;
  branchStrategy: RuntimeBranchStrategy;
  policyStatus: WorkspacePolicyStatus;
  policyNotes: string[];
  lastSyncedAt: string;
};

export type ProviderDetectionRecord = {
  id: string;
  tenantId: string;
  runtimeId: string;
  providerId: string;
  label: string;
  status: ProviderDetectionStatus;
  detectedVersion: string | null;
  detectedAt: string;
};

export type LocalSkillSourceRecord = {
  id: string;
  tenantId: string;
  runtimeId: string;
  skillKey: string;
  label: string;
  version: string;
  status: LocalSkillStatus;
  schemaRef: string;
  importedSkillId: string | null;
  lastSeenAt: string;
};

export type RuntimeSessionRecord = {
  id: string;
  tenantId: string;
  runtimeId: string;
  workspaceId: string | null;
  issueId: string | null;
  agentProfileId: string | null;
  sessionId: string;
  workDir: string | null;
  status: RuntimeSessionStatus;
  checkpointId: string | null;
  lastHeartbeatAt: string;
  lastResumedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type RuntimeBridgeState = {
  runtimes: RuntimeRegistrationRecord[];
  watchedWorkspaces: WatchedWorkspaceRecord[];
  providerDetections: ProviderDetectionRecord[];
  localSkillSources: LocalSkillSourceRecord[];
  sessions: RuntimeSessionRecord[];
};

export type RegisterRuntimeInput = {
  tenantId: string;
  actorId: string;
  runtimeId: string;
  label: string;
  transport: RuntimeTransport;
  endpoint?: string | undefined;
  ownerActorId: string;
  profile: string;
  capabilities: string[];
};

export type HeartbeatRuntimeInput = {
  tenantId: string;
  actorId: string;
  runtimeId: string;
  status: RuntimeStatus;
};

export type WatchRuntimeWorkspaceInput = {
  tenantId: string;
  actorId: string;
  watchId: string;
  runtimeId: string;
  repoRef: string;
  workspaceId?: string | undefined;
  workDir?: string | undefined;
  status?: WatchedWorkspaceStatus | undefined;
  syncMode: RuntimeSyncMode;
  branchStrategy: RuntimeBranchStrategy;
};

export type DetectRuntimeProvidersInput = {
  tenantId: string;
  actorId: string;
  runtimeId: string;
  detections: Array<{
    detectionId: string;
    providerId: string;
    label: string;
    status: ProviderDetectionStatus;
    detectedVersion?: string | undefined;
  }>;
};

export type DiscoverLocalSkillInput = {
  tenantId: string;
  actorId: string;
  runtimeId: string;
  sourceId: string;
  skillKey: string;
  label: string;
  version: string;
  schemaRef: string;
  status?: LocalSkillStatus | undefined;
  importedSkillId?: string | undefined;
};

export type PrepareRuntimeSessionInput = {
  tenantId: string;
  actorId: string;
  sessionRecordId: string;
  runtimeId: string;
  workspaceId?: string | undefined;
  issueId?: string | undefined;
  agentProfileId?: string | undefined;
  sessionId: string;
  workDir?: string | undefined;
  checkpointId?: string | undefined;
};

export type ResumeRuntimeSessionInput = {
  tenantId: string;
  actorId: string;
  sessionRecordId: string;
};

const runtimeBridgeStateFile = "runtime-bridge-core.json";

function seedRuntimeBridgeState(): RuntimeBridgeState {
  return normalizeRuntimeBridgeState({
    runtimes: [
      {
        id: "runtime:local-dev",
        tenantId: "tenant-platform",
        label: "Local Dev Runtime",
        status: "online",
        transport: "daemon",
        endpoint: "unix:///tmp/gutu-runtime.sock",
        ownerActorId: "actor-admin",
        profile: "default",
        capabilities: ["watch", "resume", "local-skills"],
        lastHeartbeatAt: "2026-04-22T14:00:00.000Z"
      }
    ],
    watchedWorkspaces: [
      {
        id: "watch:ops-review",
        tenantId: "tenant-platform",
        runtimeId: "runtime:local-dev",
        repoRef: "git://workspaces/ops-review",
        host: "workspaces",
        workspaceId: "workspace:ops-review",
        workDir: "/workspaces/ops-review",
        status: "active",
        syncMode: "watch",
        branchStrategy: "reuse",
        policyStatus: "approved",
        policyNotes: [],
        lastSyncedAt: "2026-04-22T14:01:00.000Z"
      }
    ],
    providerDetections: [
      {
        id: "provider:openai",
        tenantId: "tenant-platform",
        runtimeId: "runtime:local-dev",
        providerId: "openai",
        label: "OpenAI",
        status: "configured",
        detectedVersion: "gpt-5.4",
        detectedAt: "2026-04-22T14:00:30.000Z"
      }
    ],
    localSkillSources: [
      {
        id: "local-skill:ops-triage",
        tenantId: "tenant-platform",
        runtimeId: "runtime:local-dev",
        skillKey: "ops-triage",
        label: "Ops Triage",
        version: "v1",
        status: "discovered",
        schemaRef: "schema://local-skills/ops-triage",
        importedSkillId: null,
        lastSeenAt: "2026-04-22T14:01:20.000Z"
      }
    ],
    sessions: [
      {
        id: "runtime-session:ops-review",
        tenantId: "tenant-platform",
        runtimeId: "runtime:local-dev",
        workspaceId: "workspace:ops-review",
        issueId: "issue:pack0-review",
        agentProfileId: "agent-profile:ops-triage",
        sessionId: "session:ops-review",
        workDir: "/workspaces/ops-review",
        status: "waiting-resume",
        checkpointId: "checkpoint:ops-review",
        lastHeartbeatAt: "2026-04-22T14:01:40.000Z",
        lastResumedAt: null,
        createdAt: "2026-04-22T14:01:40.000Z",
        updatedAt: "2026-04-22T14:01:40.000Z"
      }
    ]
  });
}

function loadRuntimeBridgeState(): RuntimeBridgeState {
  return normalizeRuntimeBridgeState(loadJsonState(runtimeBridgeStateFile, seedRuntimeBridgeState));
}

function persistRuntimeBridgeState(updater: (state: RuntimeBridgeState) => RuntimeBridgeState): RuntimeBridgeState {
  return normalizeRuntimeBridgeState(updateJsonState(runtimeBridgeStateFile, seedRuntimeBridgeState, updater));
}

export function listRuntimeRegistrations(): RuntimeRegistrationRecord[] {
  return loadRuntimeBridgeState().runtimes.sort((left, right) => left.label.localeCompare(right.label));
}

export function listWatchedWorkspaces(): WatchedWorkspaceRecord[] {
  return loadRuntimeBridgeState().watchedWorkspaces.sort((left, right) => right.lastSyncedAt.localeCompare(left.lastSyncedAt));
}

export function listProviderDetections(): ProviderDetectionRecord[] {
  return loadRuntimeBridgeState().providerDetections.sort((left, right) => right.detectedAt.localeCompare(left.detectedAt));
}

export function listLocalSkillSources(): LocalSkillSourceRecord[] {
  return loadRuntimeBridgeState().localSkillSources.sort((left, right) => right.lastSeenAt.localeCompare(left.lastSeenAt));
}

export function listRuntimeSessions(): RuntimeSessionRecord[] {
  return loadRuntimeBridgeState().sessions.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function getRuntimeBridgeOverview() {
  const state = loadRuntimeBridgeState();
  return {
    totals: {
      runtimes: state.runtimes.length,
      onlineRuntimes: state.runtimes.filter((runtime) => runtime.status === "online").length,
      watchedWorkspaces: state.watchedWorkspaces.length,
      policyWarnings: state.watchedWorkspaces.filter((workspace) => workspace.policyStatus === "warning").length,
      policyBlocks: state.watchedWorkspaces.filter((workspace) => workspace.policyStatus === "blocked").length,
      localSkills: state.localSkillSources.length,
      resumableSessions: state.sessions.filter((session) => session.status === "waiting-resume" || session.status === "resumed").length
    }
  };
}

export function registerRuntime(input: RegisterRuntimeInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  persistRuntimeBridgeState((state) => ({
    ...state,
    runtimes: upsertById(state.runtimes, {
      id: input.runtimeId,
      tenantId: input.tenantId,
      label: input.label,
      status: "online",
      transport: input.transport,
      endpoint: input.endpoint ?? null,
      ownerActorId: input.ownerActorId,
      profile: input.profile,
      capabilities: uniqueSorted(input.capabilities),
      lastHeartbeatAt: now
    })
  }));

  return {
    ok: true as const,
    runtimeId: input.runtimeId,
    status: "online" as const
  };
}

export function heartbeatRuntime(input: HeartbeatRuntimeInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  persistRuntimeBridgeState((state) => ({
    ...state,
    runtimes: state.runtimes.map((runtime) =>
      runtime.id === input.runtimeId && runtime.tenantId === input.tenantId
        ? {
            ...runtime,
            status: input.status,
            lastHeartbeatAt: now
          }
        : runtime
    )
  }));

  return {
    ok: true as const,
    runtimeId: input.runtimeId,
    status: input.status
  };
}

export function watchRuntimeWorkspace(input: WatchRuntimeWorkspaceInput) {
  normalizeActionInput(input);
  const state = loadRuntimeBridgeState();
  const runtime = ensureRuntimeExists(state, input.tenantId, input.runtimeId);
  const now = new Date().toISOString();
  const evaluation = evaluateWorkspacePolicy(runtime.profile, input.repoRef, input.workDir ?? null, input.syncMode, input.branchStrategy);
  const status: WatchedWorkspaceStatus =
    evaluation.policyStatus === "blocked" ? "paused" : input.status ?? "active";
  persistRuntimeBridgeState((state) => ({
    ...state,
    watchedWorkspaces: upsertById(state.watchedWorkspaces, {
      id: input.watchId,
      tenantId: input.tenantId,
      runtimeId: input.runtimeId,
      repoRef: input.repoRef,
      host: evaluation.host,
      workspaceId: input.workspaceId ?? null,
      workDir: input.workDir ?? null,
      status,
      syncMode: input.syncMode,
      branchStrategy: input.branchStrategy,
      policyStatus: evaluation.policyStatus,
      policyNotes: evaluation.policyNotes,
      lastSyncedAt: now
    })
  }));

  return {
    ok: true as const,
    watchId: input.watchId,
    status,
    policyStatus: evaluation.policyStatus
  };
}

export function detectRuntimeProviders(input: DetectRuntimeProvidersInput) {
  normalizeActionInput(input);
  ensureRuntimeExists(loadRuntimeBridgeState(), input.tenantId, input.runtimeId);
  const now = new Date().toISOString();
  persistRuntimeBridgeState((state) => ({
    ...state,
    providerDetections: [
      ...state.providerDetections.filter(
        (entry) => !(entry.runtimeId === input.runtimeId && entry.tenantId === input.tenantId && input.detections.some((candidate) => candidate.detectionId === entry.id))
      ),
      ...input.detections.map((detection) => ({
        id: detection.detectionId,
        tenantId: input.tenantId,
        runtimeId: input.runtimeId,
        providerId: detection.providerId,
        label: detection.label,
        status: detection.status,
        detectedVersion: detection.detectedVersion ?? null,
        detectedAt: now
      }))
    ]
  }));

  return {
    ok: true as const,
    runtimeId: input.runtimeId,
    detectionCount: input.detections.length
  };
}

export function discoverLocalSkill(input: DiscoverLocalSkillInput) {
  normalizeActionInput(input);
  ensureRuntimeExists(loadRuntimeBridgeState(), input.tenantId, input.runtimeId);
  const now = new Date().toISOString();
  persistRuntimeBridgeState((state) => ({
    ...state,
    localSkillSources: upsertById(state.localSkillSources, {
      id: input.sourceId,
      tenantId: input.tenantId,
      runtimeId: input.runtimeId,
      skillKey: input.skillKey,
      label: input.label,
      version: input.version,
      status: input.status ?? "discovered",
      schemaRef: input.schemaRef,
      importedSkillId: input.importedSkillId ?? null,
      lastSeenAt: now
    })
  }));

  return {
    ok: true as const,
    sourceId: input.sourceId,
    status: input.status ?? "discovered"
  };
}

export function prepareRuntimeSession(input: PrepareRuntimeSessionInput) {
  normalizeActionInput(input);
  ensureRuntimeExists(loadRuntimeBridgeState(), input.tenantId, input.runtimeId);
  const now = new Date().toISOString();
  const status: RuntimeSessionStatus = input.checkpointId ? "waiting-resume" : "prepared";
  persistRuntimeBridgeState((state) => ({
    ...state,
    sessions: upsertById(state.sessions, {
      id: input.sessionRecordId,
      tenantId: input.tenantId,
      runtimeId: input.runtimeId,
      workspaceId: input.workspaceId ?? null,
      issueId: input.issueId ?? null,
      agentProfileId: input.agentProfileId ?? null,
      sessionId: input.sessionId,
      workDir: input.workDir ?? null,
      status,
      checkpointId: input.checkpointId ?? null,
      lastHeartbeatAt: now,
      lastResumedAt: null,
      createdAt: state.sessions.find((entry) => entry.id === input.sessionRecordId && entry.tenantId === input.tenantId)?.createdAt ?? now,
      updatedAt: now
    })
  }));

  return {
    ok: true as const,
    sessionRecordId: input.sessionRecordId,
    status
  };
}

export function resumeRuntimeSession(input: ResumeRuntimeSessionInput) {
  normalizeActionInput(input);
  const now = new Date().toISOString();
  let status: RuntimeSessionStatus = "resumed";
  persistRuntimeBridgeState((state) => {
    const existing = state.sessions.find((entry) => entry.id === input.sessionRecordId && entry.tenantId === input.tenantId);
    if (!existing) {
      throw new Error(`Unknown runtime session '${input.sessionRecordId}'.`);
    }
    status = "resumed";
    return {
      ...state,
      sessions: upsertById(state.sessions, {
        ...existing,
        status,
        lastHeartbeatAt: now,
        lastResumedAt: now,
        updatedAt: now
      })
    };
  });

  return {
    ok: true as const,
    sessionRecordId: input.sessionRecordId,
    status
  };
}

function normalizeRuntimeBridgeState(state: RuntimeBridgeState): RuntimeBridgeState {
  return {
    runtimes: state.runtimes.map((entry) => ({ ...entry, capabilities: uniqueSorted(entry.capabilities) })),
    watchedWorkspaces: state.watchedWorkspaces.map((entry) => ({
      ...entry,
      host: entry.host ?? deriveRepoHost(entry.repoRef),
      policyStatus: entry.policyStatus ?? "approved",
      policyNotes: [...(entry.policyNotes ?? [])]
    })),
    providerDetections: state.providerDetections.map((entry) => ({ ...entry })),
    localSkillSources: state.localSkillSources.map((entry) => ({ ...entry })),
    sessions: state.sessions.map((entry) => ({ ...entry }))
  };
}

function ensureRuntimeExists(state: RuntimeBridgeState, tenantId: string, runtimeId: string) {
  const runtime = state.runtimes.find((entry) => entry.id === runtimeId && entry.tenantId === tenantId);
  if (!runtime) {
    throw new Error(`Unknown runtime '${runtimeId}'.`);
  }
  return runtime;
}

function evaluateWorkspacePolicy(
  profile: string,
  repoRef: string,
  workDir: string | null,
  syncMode: RuntimeSyncMode,
  branchStrategy: RuntimeBranchStrategy
) {
  const host = deriveRepoHost(repoRef);
  const policy = resolveWorkspacePolicy(profile);
  const policyNotes: string[] = [];
  let policyStatus: WorkspacePolicyStatus = "approved";

  if (!policy.allowedHosts.includes(host)) {
    policyStatus = "blocked";
    policyNotes.push(`Host '${host}' is not allowlisted for profile '${profile}'.`);
  }
  if (workDir !== null && !policy.allowedRoots.some((root) => workDir.startsWith(root))) {
    policyStatus = "blocked";
    policyNotes.push(`Workspace '${workDir}' is outside the allowed roots for profile '${profile}'.`);
  }
  if (policyStatus !== "blocked" && syncMode === "watch" && branchStrategy === "reuse" && host !== "workspaces") {
    policyStatus = "warning";
    policyNotes.push("Remote watched workspaces should branch instead of reusing the working branch.");
  }
  if (policyStatus === "approved" && workDir === null) {
    policyStatus = "warning";
    policyNotes.push("Watched workspace does not expose a durable work directory yet.");
  }

  return {
    host,
    policyStatus,
    policyNotes
  };
}

function resolveWorkspacePolicy(profile: string) {
  const sharedHosts = ["workspaces", "github.com", "gitlab.com", "local"];
  const sharedRoots = ["/workspaces", "/automation", "/company"];
  const policies: Record<string, { allowedHosts: string[]; allowedRoots: string[] }> = {
    default: {
      allowedHosts: sharedHosts,
      allowedRoots: sharedRoots
    },
    support: {
      allowedHosts: ["workspaces", "github.com", "local"],
      allowedRoots: ["/workspaces", "/company"]
    },
    finance: {
      allowedHosts: ["workspaces", "github.com"],
      allowedRoots: ["/workspaces", "/company"]
    }
  };
  const exact = policies[profile];
  if (exact) {
    return exact;
  }
  return {
    allowedHosts: [...sharedHosts],
    allowedRoots: [...sharedRoots]
  };
}

function deriveRepoHost(repoRef: string) {
  try {
    return new URL(repoRef).host || "local";
  } catch {
    if (repoRef.startsWith("git@")) {
      return repoRef.split("@")[1]?.split(":")[0] ?? "local";
    }
    return "local";
  }
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  const remaining = items.filter((entry) => entry.id !== item.id);
  return [...remaining, item];
}
