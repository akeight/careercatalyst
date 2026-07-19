import { describe, expect, it } from "vitest";
import { buildIdempotencyKey, hashJobDescription } from "./hash";

describe("hashJobDescription", () => {
  it("is stable for same trimmed text", () => {
    expect(hashJobDescription("  hello  ")).toBe(hashJobDescription("hello"));
  });
});

describe("buildIdempotencyKey", () => {
  it("includes mode so snapshot and brief do not collide", () => {
    const base = {
      userId: "u1",
      applicationId: "a1",
      jobDescriptionHash: "abc",
      roleFamily: "SOFTWARE_ENGINEERING",
      schemaVersion: "1.0.0",
    };
    expect(buildIdempotencyKey({ ...base, mode: "SNAPSHOT" })).not.toBe(
      buildIdempotencyKey({ ...base, mode: "INTERVIEW_BRIEF" }),
    );
  });
});
