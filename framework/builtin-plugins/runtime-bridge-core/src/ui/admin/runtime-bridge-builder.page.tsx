import React from "react";

import { BuilderCanvas, BuilderHost, BuilderInspector, BuilderPalette, createBuilderPanelLayout } from "@platform/admin-builders";

import { listWatchedWorkspaces } from "../../services/main.service";

export function RuntimeBridgeBuilderPage() {
  const workspaces = listWatchedWorkspaces();
  return React.createElement(BuilderHost, {
    layout: createBuilderPanelLayout({ left: "palette", center: "canvas", right: "inspector" }),
    palette: React.createElement(BuilderPalette, {
      items: workspaces.map((watch) => ({ id: watch.id, label: watch.repoRef }))
    }),
    canvas: React.createElement(
      BuilderCanvas,
      { title: "Runtime Bridge Builder" },
      React.createElement("p", null, "Model watched workspaces, branch strategies, and runtime ownership before turning local execution into a governed surface.")
    ),
    inspector: React.createElement(
      BuilderInspector,
      { title: "Watch Policy" },
      React.createElement("p", null, "Review sync mode, branch strategy, and status recovery posture for each watched workspace.")
    )
  });
}
