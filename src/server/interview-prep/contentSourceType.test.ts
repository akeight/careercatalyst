import { describe, expect, it } from "vitest";
import { classifyContentSourceType, isNewsOrBlogSourceType } from "./urlSafety";

describe("classifyContentSourceType", () => {
  it("detects newsroom paths", () => {
    expect(classifyContentSourceType("https://acme.com/newsroom/launch")).toBe(
      "NEWSROOM",
    );
    expect(classifyContentSourceType("https://news.acme.com/post")).toBe(
      "NEWSROOM",
    );
    expect(classifyContentSourceType("https://acme.com/press/release")).toBe(
      "NEWSROOM",
    );
  });

  it("detects engineering blogs", () => {
    expect(
      classifyContentSourceType("https://engineering.acme.com/posts/scale"),
    ).toBe("ENGINEERING_BLOG");
    expect(
      classifyContentSourceType("https://acme.com/blog/how-we-built-x"),
    ).toBe("ENGINEERING_BLOG");
    expect(
      classifyContentSourceType("https://acme.com/engineering/reliability"),
    ).toBe("ENGINEERING_BLOG");
  });

  it("detects official about/careers", () => {
    expect(classifyContentSourceType("https://acme.com/about")).toBe(
      "OFFICIAL",
    );
    expect(classifyContentSourceType("https://acme.com/careers")).toBe(
      "OFFICIAL",
    );
  });
});

describe("isNewsOrBlogSourceType", () => {
  it("matches newsroom and eng blog", () => {
    expect(isNewsOrBlogSourceType("NEWSROOM")).toBe(true);
    expect(isNewsOrBlogSourceType("ENGINEERING_BLOG")).toBe(true);
    expect(isNewsOrBlogSourceType("OFFICIAL")).toBe(false);
  });
});
