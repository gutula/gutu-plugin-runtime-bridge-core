import { definePackage } from "@platform/kernel";

export default definePackage({
  id: "runtime-bridge-core",
  kind: "plugin",
  version: "0.1.0",
  displayName: "Runtime Bridge Core",
  description: "Governed daemon, watched workspace, local skill, and resumable session contracts for local runtime bridging.",
  extends: [],
  dependsOn: [
    "auth-core",
    "org-tenant-core",
    "role-policy-core",
    "audit-core",
    "execution-workspaces-core",
    "integration-core"
  ],
  optionalWith: [],
  conflictsWith: [],
  providesCapabilities: ["runtime.runtimes", "runtime.local-skills", "runtime.sessions"],
  requestedCapabilities: [
    "ui.register.admin",
    "api.rest.mount",
    "data.write.runtime"
  ],
  ownsData: ["runtime.runtimes", "runtime.watched-workspaces", "runtime.provider-detections", "runtime.local-skills", "runtime.sessions"],
  extendsData: [],
  slotClaims: [],
  trustTier: "first-party",
  reviewTier: "R1",
  isolationProfile: "same-process-trusted",
  compatibility: {
    framework: "^0.1.0",
    runtime: "bun>=1.3.12",
    db: ["postgres", "sqlite"]
  }
});
