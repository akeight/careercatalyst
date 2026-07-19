import { describe, expect, it } from "vitest";
import { rankAndSelectSources } from "./rankSources";

describe("rankAndSelectSources", () => {
  it("excludes anecdotal sources in SNAPSHOT mode", () => {
    const selected = rankAndSelectSources({
      mode: "SNAPSHOT",
      companyDomain: "acme.com",
      maxSources: 5,
      results: [
        {
          url: "https://acme.com/about",
          title: "About",
          content: "Official about page",
          score: 0.5,
        },
        {
          url: "https://reddit.com/r/cscareerquestions/foo",
          title: "Reddit thread",
          content: "Anecdote",
          score: 0.9,
        },
      ],
    });
    expect(selected.every((s) => s.evidenceTier !== "ANECDOTAL")).toBe(true);
    expect(selected.some((s) => s.normalizedUrl.includes("acme.com"))).toBe(
      true,
    );
  });

  it("dedupes normalized urls", () => {
    const selected = rankAndSelectSources({
      mode: "INTERVIEW_BRIEF",
      maxSources: 5,
      results: [
        {
          url: "https://example.com/a?utm_source=x",
          title: "A",
          content: "one",
        },
        {
          url: "https://example.com/a",
          title: "A2",
          content: "two",
        },
      ],
    });
    expect(selected).toHaveLength(1);
  });

  it("boosts and reserves newsroom/blog slots in Brief mode", () => {
    const selected = rankAndSelectSources({
      mode: "INTERVIEW_BRIEF",
      companyDomain: "acme.com",
      maxSources: 5,
      results: [
        {
          url: "https://acme.com/about",
          title: "About",
          content: "About Acme",
          score: 0.99,
        },
        {
          url: "https://acme.com/careers",
          title: "Careers",
          content: "Jobs",
          score: 0.98,
        },
        {
          url: "https://acme.com/company",
          title: "Company",
          content: "Company page",
          score: 0.97,
        },
        {
          url: "https://acme.com/newsroom/launch",
          title: "Launch",
          content: "We launched a product",
          score: 0.4,
        },
        {
          url: "https://acme.com/engineering/scale",
          title: "Scaling",
          content: "How we scaled APIs",
          score: 0.4,
        },
        {
          url: "https://blog.acme.com/post",
          title: "Blog",
          content: "Engineering notes",
          score: 0.4,
        },
      ],
    });

    const newsBlog = selected.filter(
      (s) => s.sourceType === "NEWSROOM" || s.sourceType === "ENGINEERING_BLOG",
    );
    expect(newsBlog.length).toBeGreaterThanOrEqual(3);
    expect(selected.some((s) => s.url.includes("/newsroom/"))).toBe(true);
  });
});
