import { describe, expect, it } from "vitest";
import { assertSafeUrl, classifyEvidenceTier, normalizeUrl } from "./urlSafety";

describe("normalizeUrl", () => {
  it("strips utm params and hash", () => {
    expect(normalizeUrl("https://Example.com/about?utm_source=x#section")).toBe(
      "https://example.com/about",
    );
  });

  it("rejects non-http", () => {
    expect(normalizeUrl("ftp://example.com/a")).toBeNull();
  });
});

describe("assertSafeUrl", () => {
  it("blocks localhost", () => {
    expect(assertSafeUrl("http://localhost:3000").ok).toBe(false);
  });

  it("blocks private IPs", () => {
    expect(assertSafeUrl("http://192.168.1.1").ok).toBe(false);
  });

  it("allows public https", () => {
    expect(assertSafeUrl("https://example.com/about").ok).toBe(true);
  });
});

describe("classifyEvidenceTier", () => {
  it("marks company domain primary", () => {
    expect(classifyEvidenceTier("https://acme.com/careers", "acme.com")).toBe(
      "PRIMARY",
    );
  });

  it("marks reddit anecdotal", () => {
    expect(classifyEvidenceTier("https://reddit.com/r/cscareerquestions")).toBe(
      "ANECDOTAL",
    );
  });
});
