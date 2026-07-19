import { describe, expect, it } from "vitest";
import { validateBriefCitations } from "./validateCitations";
import type { InterviewBrief } from "@/lib/validations/interviewBriefSchema";

const claim = (
  text: string,
  sourceIds: string[],
  evidenceStatus: "verified" | "unknown" = "verified",
) => ({ text, evidenceStatus, sourceIds });

const emptyRoleAnalysis = (): InterviewBrief["roleAnalysis"] => ({
  explicitResponsibilities: [],
  mustHaveSkills: [],
  niceToHaveSkills: [],
  requiredSkills: [],
  preferredSkills: [],
  techStackSignals: [],
  collaborationSignals: [],
  impactSignals: [],
  senioritySignals: [],
  dayOneExpectations: [],
  growthExpectations: [],
  jdLanguageToProbe: [],
  repeatedThemes: [],
  likelyPriorities: [],
  possibleSuccessIndicators: [],
  ambiguities: [],
  missingInformation: [],
});

const baseBrief = (): InterviewBrief => ({
  quickBrief: {
    companySummary: claim("Acme builds tools", ["src_jd"]),
    roleSummary: claim("Engineer role", ["missing"]),
    keyPoints: [],
    recentDevelopment: null,
    strongestPreparationAngles: [],
    topQuestions: [],
  },
  companyOverview: {
    productsAndServices: [],
    customersOrUsers: [],
    industry: null,
    businessModel: null,
    mission: null,
    companyStatedValues: [],
    competitors: [],
    relevantLocations: [],
    publicOrPrivateStatus: null,
  },
  roleAnalysis: {
    ...emptyRoleAnalysis(),
    mustHaveSkills: [claim("TypeScript", ["bogus_id"])],
    jdLanguageToProbe: [
      {
        phrase: "cross-functional",
        whyAsk: "Clarify partners",
        sourceIds: ["missing", "src_jd"],
      },
    ],
  },
  roleSpecificIntelligence: {
    roleFamily: "SOFTWARE_ENGINEERING",
    points: [],
    preparationFocusAreas: [],
    companyContextForRole: [],
    toolsAndStackToStudy: [],
  },
  recentDevelopments: [],
  candidateAlignment: null,
  experienceAreasToPrepare: null,
  likelyInterviewThemes: {
    behavioralThemes: [],
    projectDiscussionThemes: [],
    roleKnowledgeThemes: [],
    companyInterestThemes: [],
    collaborationThemes: [],
  },
  questionsToAsk: {
    role: [],
    team: [],
    mentorship: [],
    product: [],
    technicalOrDesign: [],
    culture: [],
    successExpectations: [],
    recentDevelopments: [],
  },
  researchGaps: {
    informationNotFound: [],
    conflictingInformation: [],
    unverifiableClaims: [],
    missingUserContext: [],
    suggestedManualInputs: [],
  },
});

describe("validateBriefCitations", () => {
  it("marks unsupported verified claims as unknown", () => {
    const { brief, gaps } = validateBriefCitations(baseBrief(), ["src_jd"]);
    expect(brief.quickBrief.roleSummary.evidenceStatus).toBe("unknown");
    expect(brief.roleAnalysis.mustHaveSkills[0]?.evidenceStatus).toBe(
      "unknown",
    );
    expect(brief.roleAnalysis.jdLanguageToProbe[0]?.sourceIds).toEqual([
      "src_jd",
    ]);
    expect(gaps.length).toBeGreaterThan(0);
  });
});
