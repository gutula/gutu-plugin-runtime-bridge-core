import { defineUiSurface } from "@platform/ui-shell";

import { RuntimeBridgeAdminPage } from "./admin/main.page";

export const uiSurface = defineUiSurface({
  embeddedPages: [
    {
      shell: "admin",
      route: "/admin/runtime/bridge",
      component: RuntimeBridgeAdminPage,
      permission: "runtime.read"
    }
  ],
  widgets: []
});
