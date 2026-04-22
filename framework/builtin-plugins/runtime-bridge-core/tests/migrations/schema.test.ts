import { describe, expect, it } from "bun:test";
import { getTableColumns } from "drizzle-orm";

import {
  localSkillSources,
  providerDetections,
  runtimeRegistrations,
  runtimeSessions,
  watchedWorkspaces
} from "../../db/schema";

describe("runtime bridge schema coverage", () => {
  it("captures runtimes, watched workspaces, provider detections, local skills, and sessions", () => {
    expect(Object.keys(getTableColumns(runtimeRegistrations))).toEqual([
      "id",
      "tenantId",
      "label",
      "status",
      "transport",
      "endpoint",
      "ownerActorId",
      "profile",
      "capabilityCount",
      "providerCount",
      "lastHeartbeatAt"
    ]);
    expect(Object.keys(getTableColumns(watchedWorkspaces))).toEqual([
      "id",
      "tenantId",
      "runtimeId",
      "repoRef",
      "host",
      "workspaceId",
      "workDir",
      "status",
      "syncMode",
      "branchStrategy",
      "policyStatus",
      "policyNoteCount",
      "lastSyncedAt"
    ]);
    expect(Object.keys(getTableColumns(providerDetections))).toEqual([
      "id",
      "tenantId",
      "runtimeId",
      "providerId",
      "label",
      "status",
      "detectedVersion",
      "detectedAt"
    ]);
    expect(Object.keys(getTableColumns(localSkillSources))).toEqual([
      "id",
      "tenantId",
      "runtimeId",
      "skillKey",
      "label",
      "version",
      "status",
      "schemaRef",
      "importedSkillId",
      "lastSeenAt"
    ]);
    expect(Object.keys(getTableColumns(runtimeSessions))).toEqual([
      "id",
      "tenantId",
      "runtimeId",
      "workspaceId",
      "issueId",
      "agentProfileId",
      "sessionId",
      "workDir",
      "status",
      "checkpointId",
      "lastHeartbeatAt",
      "lastResumedAt",
      "updatedAt"
    ]);
  });
});
