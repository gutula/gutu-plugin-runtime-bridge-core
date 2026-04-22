import { definePolicy } from "@platform/permissions";

export const runtimeBridgePolicy = definePolicy({
  id: "runtime-bridge-core.default",
  rules: [
    {
      permission: "runtime.read",
      allowIf: ["role:admin", "role:operator", "role:support"]
    },
    {
      permission: "runtime.runtimes.register",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "runtime.daemons.heartbeat",
      allowIf: ["role:admin", "role:operator"],
      audit: true
    },
    {
      permission: "runtime.workspaces.watch",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "runtime.providers.detect",
      allowIf: ["role:admin", "role:operator"],
      audit: true
    },
    {
      permission: "runtime.skills.discover",
      allowIf: ["role:admin", "role:operator"],
      audit: true
    },
    {
      permission: "runtime.sessions.prepare",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "runtime.sessions.resume",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "runtime.builders.use",
      allowIf: ["role:admin", "role:operator"]
    }
  ]
});
