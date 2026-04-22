import { defineResource } from "@platform/schema";
import { z } from "zod";

import {
  localSkillSources,
  providerDetections,
  runtimeRegistrations,
  runtimeSessions,
  watchedWorkspaces
} from "../../db/schema";

export const RuntimeResource = defineResource({
  id: "runtime.runtimes",
  description: "Runtime and daemon registry for local and remote execution bridges.",
  businessPurpose: "Keep runtime health, ownership, and capability posture visible and auditable.",
  table: runtimeRegistrations,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    label: z.string().min(2),
    status: z.enum(["online", "offline", "degraded"]),
    transport: z.enum(["daemon", "local-cli", "remote-worker"]),
    endpoint: z.string().nullable(),
    ownerActorId: z.string().min(2),
    profile: z.string().min(2),
    capabilityCount: z.number().int().nonnegative(),
    providerCount: z.number().int().nonnegative(),
    lastHeartbeatAt: z.string()
  }),
  fields: {
    label: { searchable: true, sortable: true, label: "Runtime" },
    status: { filter: "select", label: "Status" },
    transport: { filter: "select", label: "Transport" },
    ownerActorId: { searchable: true, sortable: true, label: "Owner" },
    lastHeartbeatAt: { sortable: true, label: "Heartbeat" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["label", "status", "transport", "ownerActorId", "lastHeartbeatAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Runtime bridge registry for local and remote governed execution.",
    citationLabelField: "label",
    allowedFields: ["label", "status", "transport", "endpoint", "ownerActorId", "profile", "lastHeartbeatAt"]
  }
});

export const WatchedWorkspaceResource = defineResource({
  id: "runtime.watched-workspaces",
  description: "Watched workspace records attached to runtime bridges.",
  businessPurpose: "Track which repos and workspaces a runtime owns and how it syncs them.",
  table: watchedWorkspaces,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    runtimeId: z.string().min(2),
    repoRef: z.string().min(3),
    host: z.string().min(1),
    workspaceId: z.string().nullable(),
    workDir: z.string().nullable(),
    status: z.enum(["active", "paused", "lost"]),
    syncMode: z.enum(["watch", "manual"]),
    branchStrategy: z.enum(["reuse", "branch"]),
    policyStatus: z.enum(["approved", "warning", "blocked"]),
    policyNoteCount: z.number().int().nonnegative(),
    lastSyncedAt: z.string()
  }),
  fields: {
    repoRef: { searchable: true, sortable: true, label: "Repo" },
    host: { searchable: true, sortable: true, label: "Host" },
    runtimeId: { searchable: true, sortable: true, label: "Runtime" },
    status: { filter: "select", label: "Status" },
    syncMode: { filter: "select", label: "Sync" },
    policyStatus: { filter: "select", label: "Policy" },
    lastSyncedAt: { sortable: true, label: "Last Sync" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["repoRef", "host", "runtimeId", "status", "policyStatus", "syncMode", "lastSyncedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Workspace watch posture for daemon and local runtime orchestration.",
    citationLabelField: "repoRef",
    allowedFields: [
      "repoRef",
      "host",
      "runtimeId",
      "workspaceId",
      "workDir",
      "status",
      "syncMode",
      "branchStrategy",
      "policyStatus",
      "policyNoteCount",
      "lastSyncedAt"
    ]
  }
});

export const ProviderDetectionResource = defineResource({
  id: "runtime.provider-detections",
  description: "Detected or configured model and coding providers for a runtime.",
  businessPurpose: "Keep provider auto-detect and configuration drift visible in the runtime bridge.",
  table: providerDetections,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    runtimeId: z.string().min(2),
    providerId: z.string().min(2),
    label: z.string().min(2),
    status: z.enum(["detected", "configured", "missing"]),
    detectedVersion: z.string().nullable(),
    detectedAt: z.string()
  }),
  fields: {
    runtimeId: { searchable: true, sortable: true, label: "Runtime" },
    providerId: { searchable: true, sortable: true, label: "Provider" },
    status: { filter: "select", label: "Status" },
    detectedAt: { sortable: true, label: "Detected" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["runtimeId", "providerId", "status", "detectedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Provider detection inventory for runtime bridge planning and policy checks.",
    citationLabelField: "providerId",
    allowedFields: ["runtimeId", "providerId", "label", "status", "detectedVersion", "detectedAt"]
  }
});

export const LocalSkillSourceResource = defineResource({
  id: "runtime.local-skills",
  description: "Locally discovered skills exposed by a runtime bridge.",
  businessPurpose: "Make local skill discovery visible and importable instead of hiding it in runtime-specific metadata.",
  table: localSkillSources,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    runtimeId: z.string().min(2),
    skillKey: z.string().min(2),
    label: z.string().min(2),
    version: z.string().min(1),
    status: z.enum(["discovered", "imported", "stale"]),
    schemaRef: z.string().min(2),
    importedSkillId: z.string().nullable(),
    lastSeenAt: z.string()
  }),
  fields: {
    label: { searchable: true, sortable: true, label: "Local Skill" },
    runtimeId: { searchable: true, sortable: true, label: "Runtime" },
    status: { filter: "select", label: "Status" },
    importedSkillId: { searchable: true, sortable: true, label: "Imported Skill" },
    lastSeenAt: { sortable: true, label: "Last Seen" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["label", "runtimeId", "status", "importedSkillId", "lastSeenAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Local runtime skill discovery state used by governed skill import workflows.",
    citationLabelField: "label",
    allowedFields: ["skillKey", "label", "version", "runtimeId", "status", "schemaRef", "importedSkillId", "lastSeenAt"]
  }
});

export const RuntimeSessionResource = defineResource({
  id: "runtime.sessions",
  description: "Resumable runtime session records linked to watched workspaces or issues.",
  businessPurpose: "Keep session resume posture durable so local runtime recovery stays auditable.",
  table: runtimeSessions,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    runtimeId: z.string().min(2),
    workspaceId: z.string().nullable(),
    issueId: z.string().nullable(),
    agentProfileId: z.string().nullable(),
    sessionId: z.string().min(2),
    workDir: z.string().nullable(),
    status: z.enum(["prepared", "running", "waiting-resume", "resumed", "closed"]),
    checkpointId: z.string().nullable(),
    lastHeartbeatAt: z.string(),
    lastResumedAt: z.string().nullable(),
    updatedAt: z.string()
  }),
  fields: {
    runtimeId: { searchable: true, sortable: true, label: "Runtime" },
    sessionId: { searchable: true, sortable: true, label: "Session" },
    status: { filter: "select", label: "Status" },
    issueId: { searchable: true, sortable: true, label: "Issue" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["runtimeId", "sessionId", "status", "issueId", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Runtime session inventory for resume and recovery-aware operator flows.",
    citationLabelField: "sessionId",
    allowedFields: ["runtimeId", "workspaceId", "issueId", "agentProfileId", "sessionId", "workDir", "status", "checkpointId", "lastHeartbeatAt", "lastResumedAt", "updatedAt"]
  }
});

export const runtimeBridgeResources = [
  RuntimeResource,
  WatchedWorkspaceResource,
  ProviderDetectionResource,
  LocalSkillSourceResource,
  RuntimeSessionResource
] as const;
