import { defineAction } from "@platform/schema";
import { z } from "zod";

import {
  detectRuntimeProviders,
  discoverLocalSkill,
  heartbeatRuntime,
  prepareRuntimeSession,
  registerRuntime,
  resumeRuntimeSession,
  watchRuntimeWorkspace
} from "../services/main.service";

export const registerRuntimeAction = defineAction({
  id: "runtime.runtimes.register",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    runtimeId: z.string().min(2),
    label: z.string().min(2),
    transport: z.enum(["daemon", "local-cli", "remote-worker"]),
    endpoint: z.string().min(3).optional(),
    ownerActorId: z.string().min(2),
    profile: z.string().min(2),
    capabilities: z.array(z.string().min(2)).min(1)
  }),
  output: z.object({
    ok: z.literal(true),
    runtimeId: z.string(),
    status: z.enum(["online", "offline", "degraded"])
  }),
  permission: "runtime.runtimes.register",
  idempotent: true,
  audit: true,
  handler: ({ input }) => registerRuntime(input)
});

export const heartbeatRuntimeAction = defineAction({
  id: "runtime.daemons.heartbeat",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    runtimeId: z.string().min(2),
    status: z.enum(["online", "offline", "degraded"])
  }),
  output: z.object({
    ok: z.literal(true),
    runtimeId: z.string(),
    status: z.enum(["online", "offline", "degraded"])
  }),
  permission: "runtime.daemons.heartbeat",
  idempotent: true,
  audit: true,
  handler: ({ input }) => heartbeatRuntime(input)
});

export const watchRuntimeWorkspaceAction = defineAction({
  id: "runtime.workspaces.watch",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    watchId: z.string().min(2),
    runtimeId: z.string().min(2),
    repoRef: z.string().min(3),
    workspaceId: z.string().min(2).optional(),
    workDir: z.string().min(2).optional(),
    status: z.enum(["active", "paused", "lost"]).optional(),
    syncMode: z.enum(["watch", "manual"]),
    branchStrategy: z.enum(["reuse", "branch"])
  }),
  output: z.object({
    ok: z.literal(true),
    watchId: z.string(),
    status: z.enum(["active", "paused", "lost"]),
    policyStatus: z.enum(["approved", "warning", "blocked"])
  }),
  permission: "runtime.workspaces.watch",
  idempotent: true,
  audit: true,
  handler: ({ input }) => watchRuntimeWorkspace(input)
});

export const detectRuntimeProvidersAction = defineAction({
  id: "runtime.providers.detect",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    runtimeId: z.string().min(2),
    detections: z.array(
      z.object({
        detectionId: z.string().min(2),
        providerId: z.string().min(2),
        label: z.string().min(2),
        status: z.enum(["detected", "configured", "missing"]),
        detectedVersion: z.string().min(1).optional()
      })
    ).min(1)
  }),
  output: z.object({
    ok: z.literal(true),
    runtimeId: z.string(),
    detectionCount: z.number().int().nonnegative()
  }),
  permission: "runtime.providers.detect",
  idempotent: true,
  audit: true,
  handler: ({ input }) => detectRuntimeProviders(input)
});

export const discoverLocalSkillAction = defineAction({
  id: "runtime.skills.discover",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    runtimeId: z.string().min(2),
    sourceId: z.string().min(2),
    skillKey: z.string().min(2),
    label: z.string().min(2),
    version: z.string().min(1),
    schemaRef: z.string().min(2),
    status: z.enum(["discovered", "imported", "stale"]).optional(),
    importedSkillId: z.string().min(2).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    sourceId: z.string(),
    status: z.enum(["discovered", "imported", "stale"])
  }),
  permission: "runtime.skills.discover",
  idempotent: true,
  audit: true,
  handler: ({ input }) => discoverLocalSkill(input)
});

export const prepareRuntimeSessionAction = defineAction({
  id: "runtime.sessions.prepare",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    sessionRecordId: z.string().min(2),
    runtimeId: z.string().min(2),
    workspaceId: z.string().min(2).optional(),
    issueId: z.string().min(2).optional(),
    agentProfileId: z.string().min(2).optional(),
    sessionId: z.string().min(2),
    workDir: z.string().min(2).optional(),
    checkpointId: z.string().min(2).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    sessionRecordId: z.string(),
    status: z.enum(["prepared", "running", "waiting-resume", "resumed", "closed"])
  }),
  permission: "runtime.sessions.prepare",
  idempotent: true,
  audit: true,
  handler: ({ input }) => prepareRuntimeSession(input)
});

export const resumeRuntimeSessionAction = defineAction({
  id: "runtime.sessions.resume",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    sessionRecordId: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    sessionRecordId: z.string(),
    status: z.enum(["prepared", "running", "waiting-resume", "resumed", "closed"])
  }),
  permission: "runtime.sessions.resume",
  idempotent: true,
  audit: true,
  handler: ({ input }) => resumeRuntimeSession(input)
});

export const runtimeBridgeActions = [
  registerRuntimeAction,
  heartbeatRuntimeAction,
  watchRuntimeWorkspaceAction,
  detectRuntimeProvidersAction,
  discoverLocalSkillAction,
  prepareRuntimeSessionAction,
  resumeRuntimeSessionAction
] as const;
