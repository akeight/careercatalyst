import type { LlmProvider } from "./types";
import type { CompanySnapshot } from "@/lib/validations/companySnapshotSchema";
import type { RoleDepthPass } from "@/lib/validations/interviewBriefSchema";
import { interviewBriefCompanyPassSchema } from "@/lib/validations/interviewBriefSchema";

const mockClaim = (text: string, sourceIds: string[] = ["src_jd"]) => ({
  text,
  evidenceStatus: "verified" as const,
  sourceIds,
});

export function createMockLlmProvider(): LlmProvider {
  return {
    name: "mock-llm",
    async generateObject({ schema, kind }) {
      const snapshot: CompanySnapshot = {
        quickCompanySummary: mockClaim("Example Corp builds developer tools."),
        productsAndServices: [mockClaim("Internship tracking software")],
        usersOrCustomers: [
          mockClaim("Students and early-career professionals"),
        ],
        missionAndValues: [mockClaim("Help candidates land offers")],
        industryContext: mockClaim("Education technology / HR tech"),
        basicRoleSummary: mockClaim(
          "Role focuses on shipping product features.",
        ),
        roleFamily: "SOFTWARE_ENGINEERING",
        keyThingsToKnow: [mockClaim("Official site emphasizes collaboration.")],
        researchGaps: {
          informationNotFound: ["Exact team size"],
          conflictingInformation: [],
          unverifiableClaims: [],
          missingUserContext: [],
          suggestedManualInputs: [],
        },
      };

      const roleDepth: RoleDepthPass = {
        roleAnalysis: {
          explicitResponsibilities: [
            mockClaim("Build and ship product features with the eng team"),
            mockClaim("Collaborate with design on UI implementation"),
          ],
          mustHaveSkills: [mockClaim("TypeScript"), mockClaim("React")],
          niceToHaveSkills: [mockClaim("Next.js")],
          requiredSkills: ["TypeScript", "React"],
          preferredSkills: ["Next.js"],
          techStackSignals: [
            mockClaim("Web stack centered on React and TypeScript"),
          ],
          collaborationSignals: [
            mockClaim("Works closely with product and design"),
          ],
          impactSignals: [
            mockClaim("Emphasis on shipping user-facing improvements"),
          ],
          senioritySignals: [
            mockClaim("Internship / early-career level expectations"),
          ],
          dayOneExpectations: [
            mockClaim("Onboard to codebase and land a first small PR"),
          ],
          growthExpectations: [
            mockClaim(
              "Take increasing ownership of features over the internship",
            ),
          ],
          jdLanguageToProbe: [
            {
              phrase: "collaborate cross-functionally",
              whyAsk: "Clarify which teams and rituals are involved",
              sourceIds: ["src_jd"],
            },
          ],
          repeatedThemes: [mockClaim("Shipping"), mockClaim("Collaboration")],
          likelyPriorities: [
            mockClaim("Product quality and reliable delivery"),
          ],
          possibleSuccessIndicators: [
            mockClaim("Merged PRs and positive mentor feedback"),
          ],
          ambiguities: ["Exact team structure"],
          missingInformation: ["Interview format"],
        },
        roleSpecificIntelligence: {
          roleFamily: "SOFTWARE_ENGINEERING",
          points: [mockClaim("Expect discussion of APIs and reliability.")],
          preparationFocusAreas: [
            "A project that shipped to users",
            "Debugging a production or staging issue",
          ],
          companyContextForRole: [
            mockClaim(
              "Engineering culture emphasizes learning and collaboration",
            ),
          ],
          toolsAndStackToStudy: [mockClaim("TypeScript"), mockClaim("React")],
        },
      };

      const companyPass = interviewBriefCompanyPassSchema.parse({
        quickBrief: {
          companySummary: mockClaim("Example Corp builds developer tools."),
          roleSummary: mockClaim(
            "Engineering internship shipping product features.",
          ),
          keyPoints: [mockClaim("Collaboration and reliability matter.")],
          recentDevelopment: null,
          strongestPreparationAngles: ["Team projects", "Shipping features"],
          topQuestions: ["How does the team measure internship success?"],
        },
        companyOverview: {
          productsAndServices: [mockClaim("Internship tracking software")],
          customersOrUsers: [mockClaim("Students")],
          industry: mockClaim("EdTech"),
          businessModel: null,
          mission: null,
          companyStatedValues: [mockClaim("Learning")],
          competitors: [],
          relevantLocations: [],
          publicOrPrivateStatus: null,
        },
        recentDevelopments: [],
        candidateAlignment: null,
        experienceAreasToPrepare: [
          "A project where you collaborated across functions",
          "An example of debugging production issues",
        ],
        likelyInterviewThemes: {
          behavioralThemes: ["Teamwork"],
          projectDiscussionThemes: ["Past projects"],
          roleKnowledgeThemes: ["Web stack"],
          companyInterestThemes: ["Why this company"],
          collaborationThemes: ["Working with design"],
        },
        questionsToAsk: {
          role: [
            {
              text: "What does success look like in 90 days?",
              sourceIds: [],
            },
          ],
          team: [{ text: "How is the team structured?", sourceIds: [] }],
          mentorship: [
            { text: "What mentorship do interns receive?", sourceIds: [] },
          ],
          product: [],
          technicalOrDesign: [],
          culture: [],
          successExpectations: [],
          recentDevelopments: [],
        },
        researchGaps: {
          informationNotFound: ["Interview format"],
          conflictingInformation: [],
          unverifiableClaims: [],
          missingUserContext: ["Resume details"],
          suggestedManualInputs: ["Add candidate context"],
        },
      });

      const payload =
        kind === "role-depth"
          ? roleDepth
          : kind === "brief"
            ? companyPass
            : snapshot;

      const object = schema.parse(payload);
      return { object, usage: { inputTokens: 100, outputTokens: 200 } };
    },
  };
}
