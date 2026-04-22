import { describe, expect, it } from "bun:test";

import { uiSurface } from "../../src/ui/surfaces";

describe("runtime bridge ui surface", () => {
  it("mounts the runtime bridge control room", () => {
    expect(uiSurface.embeddedPages[0]?.route).toBe("/admin/runtime/bridge");
  });
});
