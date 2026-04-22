import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  detectRuntimeProviders,
  discoverLocalSkill,
  getRuntimeBridgeOverview,
  prepareRuntimeSession,
  registerRuntime,
  resumeRuntimeSession,
  watchRuntimeWorkspace
} from "../../src/services/main.service";

describe("runtime bridge orchestration", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-runtime-bridge-integration-"));
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

  it("runs register -> detect -> watch -> discover -> prepare -> resume through the bridge plane", () => {
    registerRuntime({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:finance-daemon",
      label: "Finance Daemon",
      transport: "daemon",
      endpoint: "unix:///tmp/finance.sock",
      ownerActorId: "actor-admin",
      profile: "finance",
      capabilities: ["watch", "resume", "local-skills"]
    });
    detectRuntimeProviders({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:finance-daemon",
      detections: [
        {
          detectionId: "provider:claude-code",
          providerId: "claude-code",
          label: "Claude Code",
          status: "detected",
          detectedVersion: "1.0"
        }
      ]
    });
    watchRuntimeWorkspace({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      watchId: "watch:finance",
      runtimeId: "runtime:finance-daemon",
      repoRef: "git://workspaces/finance",
      workspaceId: "workspace:finance",
      workDir: "/workspaces/finance",
      syncMode: "watch",
      branchStrategy: "reuse"
    });
    watchRuntimeWorkspace({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      watchId: "watch:finance-warning",
      runtimeId: "runtime:finance-daemon",
      repoRef: "https://github.com/example/finance-daemon",
      workDir: "/company/finance-daemon",
      syncMode: "watch",
      branchStrategy: "reuse"
    });
    discoverLocalSkill({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runtimeId: "runtime:finance-daemon",
      sourceId: "local-skill:finance-review",
      skillKey: "finance-review",
      label: "Finance Review",
      version: "v1",
      schemaRef: "schema://local-skills/finance-review"
    });
    prepareRuntimeSession({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      sessionRecordId: "runtime-session:finance-1",
      runtimeId: "runtime:finance-daemon",
      workspaceId: "workspace:finance",
      issueId: "issue:finance-1",
      sessionId: "session:finance-1",
      workDir: "/workspaces/finance",
      checkpointId: "checkpoint:finance-1"
    });
    const resumed = resumeRuntimeSession({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      sessionRecordId: "runtime-session:finance-1"
    });

    expect(resumed.status).toBe("resumed");
    expect(getRuntimeBridgeOverview().totals.localSkills).toBeGreaterThanOrEqual(1);
    expect(getRuntimeBridgeOverview().totals.resumableSessions).toBeGreaterThanOrEqual(1);
    expect(getRuntimeBridgeOverview().totals.policyWarnings).toBeGreaterThanOrEqual(1);
  });
});
