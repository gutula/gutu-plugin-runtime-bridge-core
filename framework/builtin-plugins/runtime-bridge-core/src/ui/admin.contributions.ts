import {
  defineAdminNav,
  defineBuilder,
  defineCommand,
  definePage,
  defineWorkspace,
  type AdminContributionRegistry
} from "@platform/admin-contracts";

import { RuntimeBridgeBuilderPage } from "./admin/runtime-bridge-builder.page";
import { RuntimeBridgeAdminPage } from "./admin/main.page";
import { SessionConsolePage } from "./admin/session-console.page";

export const adminContributions: Pick<AdminContributionRegistry, "workspaces" | "nav" | "pages" | "builders" | "commands"> = {
  workspaces: [
    defineWorkspace({
      id: "runtime",
      label: "Runtime",
      icon: "plug-zap",
      description: "Control room for daemon bridges, watched workspaces, local skills, and resumable sessions.",
      permission: "runtime.read",
      homePath: "/admin/runtime/bridge",
      quickActions: ["runtime.open.bridge", "runtime.open.sessions", "runtime.open.builder"]
    })
  ],
  nav: [
    defineAdminNav({
      workspace: "runtime",
      group: "control",
      items: [
        {
          id: "runtime.bridge",
          label: "Bridge Control Room",
          icon: "cable",
          to: "/admin/runtime/bridge",
          permission: "runtime.read"
        },
        {
          id: "runtime.sessions",
          label: "Sessions",
          icon: "history",
          to: "/admin/runtime/sessions",
          permission: "runtime.read"
        }
      ]
    }),
    defineAdminNav({
      workspace: "tools",
      group: "builders",
      items: [
        {
          id: "tools.runtime-bridge-builder",
          label: "Runtime Bridge Builder",
          icon: "wrench",
          to: "/admin/tools/runtime-bridge-builder",
          permission: "runtime.builders.use"
        }
      ]
    })
  ],
  pages: [
    definePage({
      id: "runtime.bridge.page",
      kind: "dashboard",
      route: "/admin/runtime/bridge",
      label: "Runtime Bridge Control Room",
      workspace: "runtime",
      group: "control",
      permission: "runtime.read",
      component: RuntimeBridgeAdminPage
    }),
    definePage({
      id: "runtime.sessions.page",
      kind: "dashboard",
      route: "/admin/runtime/sessions",
      label: "Runtime Sessions",
      workspace: "runtime",
      group: "control",
      permission: "runtime.read",
      component: SessionConsolePage
    }),
    definePage({
      id: "runtime.builder.page",
      kind: "builder",
      route: "/admin/tools/runtime-bridge-builder",
      label: "Runtime Bridge Builder",
      workspace: "tools",
      group: "builders",
      permission: "runtime.builders.use",
      component: RuntimeBridgeBuilderPage,
      builderId: "runtime-bridge-builder"
    })
  ],
  builders: [
    defineBuilder({
      id: "runtime-bridge-builder",
      label: "Runtime Bridge Builder",
      host: "admin",
      route: "/admin/tools/runtime-bridge-builder",
      permission: "runtime.builders.use",
      mode: "embedded"
    })
  ],
  commands: [
    defineCommand({
      id: "runtime.open.bridge",
      label: "Open Runtime Bridge Control Room",
      permission: "runtime.read",
      href: "/admin/runtime/bridge",
      keywords: ["runtime", "daemon", "watch"]
    }),
    defineCommand({
      id: "runtime.open.sessions",
      label: "Open Runtime Sessions",
      permission: "runtime.read",
      href: "/admin/runtime/sessions",
      keywords: ["runtime", "sessions", "resume"]
    }),
    defineCommand({
      id: "runtime.open.builder",
      label: "Open Runtime Bridge Builder",
      permission: "runtime.builders.use",
      href: "/admin/tools/runtime-bridge-builder",
      keywords: ["runtime", "builder", "watch"]
    })
  ]
};
