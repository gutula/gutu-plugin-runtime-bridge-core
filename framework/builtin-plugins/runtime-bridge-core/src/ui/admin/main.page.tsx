import React from "react";

import { getRuntimeBridgeOverview, listLocalSkillSources, listRuntimeRegistrations, listWatchedWorkspaces } from "../../services/main.service";

export function RuntimeBridgeAdminPage() {
  const overview = getRuntimeBridgeOverview();
  const runtimes = listRuntimeRegistrations().slice(0, 3);
  const watches = listWatchedWorkspaces().slice(0, 3);
  const localSkills = listLocalSkillSources().slice(0, 3);

  return React.createElement(
    "section",
    { className: "gutu-admin-page" },
    React.createElement("h1", null, "Runtime Bridge Control Room"),
    React.createElement(
      "p",
      null,
      `${overview.totals.runtimes} runtimes, ${overview.totals.watchedWorkspaces} watched workspaces, ${overview.totals.resumableSessions} resumable sessions.`
    ),
    React.createElement(
      "ul",
      null,
      ...runtimes.map((runtime) => React.createElement("li", { key: runtime.id }, `${runtime.label} - ${runtime.status} - ${runtime.transport}`))
    ),
    React.createElement(
      "div",
      null,
      React.createElement("h2", null, "Watched Workspaces"),
      React.createElement(
        "ul",
        null,
        ...watches.map((watch) => React.createElement("li", { key: watch.id }, `${watch.repoRef} - ${watch.status} - ${watch.syncMode}`))
      )
    ),
    React.createElement(
      "div",
      null,
      React.createElement("h2", null, "Local Skills"),
      React.createElement(
        "ul",
        null,
        ...localSkills.map((skill) => React.createElement("li", { key: skill.id }, `${skill.label} - ${skill.status} - ${skill.version}`))
      )
    )
  );
}
