import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  detectRuntimeProviders,
  discoverLocalSkill,
  heartbeatRuntime,
  listLocalSkillSources,
  listProviderDetections,
  listRuntimeRegistrations,
  listRuntimeSessions,
  listWatchedWorkspaces,
  prepareRuntimeSession,
  registerRuntime,
  resumeRuntimeSession,
  watchRuntimeWorkspace
} from "../../src/services/main.service";

describe("runtime-bridge-core services", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-runtime-bridge-state-"));
    process.env.GUTU_STATE_DIR = stateDir;
  });

  afterEach(() => {
    rmSync(stateDir, { recursive: true, force: true });
    if (previousStateDir === undefined) {
      delete process.env.GUTU_STATE_DIR;
      return;
    }
    process.env.GUTU_STATE_DIR = previousStateDir;
  });

  it("registers runtimes, watches workspaces, and discovers local skills", () => {
    registerRuntime({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:support-dev",
      label: "Support Dev Runtime",
      transport: "daemon",
      endpoint: "unix:///tmp/support.sock",
      ownerActorId: "actor-admin",
      profile: "support",
      capabilities: ["watch", "resume", "local-skills"]
    });
    const watch = watchRuntimeWorkspace({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      watchId: "watch:support",
      runtimeId: "runtime:support-dev",
      repoRef: "git://workspaces/support",
      workspaceId: "workspace:support",
      workDir: "/workspaces/support",
      syncMode: "watch",
      branchStrategy: "branch"
    });
    detectRuntimeProviders({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:support-dev",
      detections: [
        {
          detectionId: "provider:codex-cli",
          providerId: "codex-cli",
          label: "Codex CLI",
          status: "detected",
          detectedVersion: "1.0"
        }
      ]
    });
    discoverLocalSkill({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:support-dev",
      sourceId: "local-skill:support-triage",
      skillKey: "support-triage",
      label: "Support Triage",
      version: "v2",
      schemaRef: "schema://local-skills/support-triage"
    });

    expect(listRuntimeRegistrations().some((entry) => entry.id === "runtime:support-dev")).toBe(true);
    expect(listWatchedWorkspaces().some((entry) => entry.id === "watch:support")).toBe(true);
    expect(watch.policyStatus).toBe("approved");
    expect(listProviderDetections().some((entry) => entry.providerId === "codex-cli")).toBe(true);
    expect(listLocalSkillSources().some((entry) => entry.skillKey === "support-triage")).toBe(true);
  });

  it("prepares, heartbeats, and resumes runtime sessions", () => {
    prepareRuntimeSession({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      sessionRecordId: "runtime-session:support",
      runtimeId: "runtime:local-dev",
      workspaceId: "workspace:support",
      issueId: "issue:support-1",
      agentProfileId: "agent-profile:support-triage",
      sessionId: "session:support",
      workDir: "/workspaces/support",
      checkpointId: "checkpoint:support"
    });
    heartbeatRuntime({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:local-dev",
      status: "online"
    });
    const resumed = resumeRuntimeSession({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      sessionRecordId: "runtime-session:support"
    });

    expect(resumed.status).toBe("resumed");
    expect(listRuntimeSessions().find((entry) => entry.id === "runtime-session:support")?.lastResumedAt).not.toBeNull();
    expect(listRuntimeRegistrations().find((entry) => entry.id === "runtime:local-dev")?.status).toBe("online");
  });

  it("pauses blocked watched workspaces outside the profile allowlist", () => {
    registerRuntime({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:finance-safe",
      label: "Finance Safe Runtime",
      transport: "daemon",
      ownerActorId: "actor-admin",
      profile: "finance",
      capabilities: ["watch", "resume"]
    });

    const blocked = watchRuntimeWorkspace({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      watchId: "watch:finance-blocked",
      runtimeId: "runtime:finance-safe",
      repoRef: "https://bitbucket.org/private/finance",
      workDir: "/tmp/finance",
      syncMode: "watch",
      branchStrategy: "reuse"
    });

    expect(blocked.status).toBe("paused");
    expect(blocked.policyStatus).toBe("blocked");
    expect(listWatchedWorkspaces().find((entry) => entry.id === "watch:finance-blocked")?.policyStatus).toBe("blocked");
  });
});
