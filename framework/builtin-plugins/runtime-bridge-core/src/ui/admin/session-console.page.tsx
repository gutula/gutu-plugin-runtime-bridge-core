import React from "react";

import { listRuntimeSessions } from "../../services/main.service";

export function SessionConsolePage() {
  const sessions = listRuntimeSessions().slice(0, 6);
  return React.createElement(
    "section",
    { className: "gutu-admin-page" },
    React.createElement("h1", null, "Runtime Sessions"),
    React.createElement(
      "ul",
      null,
      ...sessions.map((session) =>
        React.createElement(
          "li",
          { key: session.id },
          `${session.sessionId} - ${session.status} - ${session.runtimeId}${session.issueId ? ` - ${session.issueId}` : ""}`
        )
      )
    )
  );
}
