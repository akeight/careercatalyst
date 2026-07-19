import { describe, expect, it } from "vitest";
import { buildQueryPlan } from "./queryPlan";

describe("buildQueryPlan", () => {
  it("keeps Snapshot queries short and about-focused", () => {
    const queries = buildQueryPlan({
      mode: "SNAPSHOT",
      companyName: "Acme",
      companyWebsite: "https://acme.com",
      title: "SWE Intern",
      roleFamily: "SOFTWARE_ENGINEERING",
    });
    expect(queries.length).toBeLessThanOrEqual(4);
    expect(queries.some((q) => q.includes("site:acme.com"))).toBe(true);
  });

  it("includes newsroom and engineering blog site queries for Brief", () => {
    const queries = buildQueryPlan({
      mode: "INTERVIEW_BRIEF",
      companyName: "Acme",
      companyWebsite: "https://www.acme.com",
      title: "Frontend Intern",
      roleFamily: "FRONTEND_ENGINEERING",
    });
    expect(
      queries.some(
        (q) => q.includes("site:acme.com") && q.includes("newsroom"),
      ),
    ).toBe(true);
    expect(
      queries.some(
        (q) => q.includes("site:acme.com") && q.includes("engineering"),
      ),
    ).toBe(true);
    expect(queries.some((q) => q.includes("techcrunch.com"))).toBe(true);
    expect(queries.length).toBeLessThanOrEqual(10);
  });

  it("puts news/blog before about when upgrading from Snapshot", () => {
    const queries = buildQueryPlan({
      mode: "INTERVIEW_BRIEF",
      companyName: "Acme",
      companyWebsite: "https://acme.com",
      title: "SWE Intern",
      roleFamily: "SOFTWARE_ENGINEERING",
      upgradingFromSnapshot: true,
    });
    const newsIdx = queries.findIndex((q) => q.includes("newsroom"));
    const aboutIdx = queries.findIndex((q) =>
      q.includes("official website about"),
    );
    expect(newsIdx).toBeGreaterThanOrEqual(0);
    expect(aboutIdx).toBeGreaterThanOrEqual(0);
    expect(newsIdx).toBeLessThan(aboutIdx);
  });
});
