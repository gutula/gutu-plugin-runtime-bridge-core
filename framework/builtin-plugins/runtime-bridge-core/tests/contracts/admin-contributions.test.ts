import { describe, expect, it } from "bun:test";

import { adminContributions } from "../../src/ui/admin.contributions";

describe("runtime bridge admin contributions", () => {
  it("registers runtime control room, session console, and builder routes", () => {
    expect(adminContributions.workspaces[0]?.id).toBe("runtime");
    expect(adminContributions.pages[0]?.route).toBe("/admin/runtime/bridge");
    expect(adminContributions.pages[1]?.route).toBe("/admin/runtime/sessions");
    expect(adminContributions.builders[0]?.route).toBe("/admin/tools/runtime-bridge-builder");
  });
});
