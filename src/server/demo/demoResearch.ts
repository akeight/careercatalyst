import type { RoleFamily } from "@prisma/client";
import type { CompanySnapshot } from "@/lib/validations/companySnapshotSchema";
import {
  BRIEF_PROMPT_VERSION,
  BRIEF_SCHEMA_VERSION,
  type InterviewBrief,
} from "@/lib/validations/interviewBriefSchema";
import { SNAPSHOT_SCHEMA_VERSION } from "@/lib/validations/companySnapshotSchema";

const claim = (text: string, sourceIds: string[] = ["src_demo_1"]) => ({
  text,
  evidenceStatus: "verified" as const,
  sourceIds,
});

export function buildDemoSnapshot(args: {
  companyName: string;
  roleTitle: string;
  roleFamily: RoleFamily;
}): CompanySnapshot {
  const { companyName, roleTitle, roleFamily } = args;
  return {
    quickCompanySummary: claim(
      `${companyName} is a well-known tech company hiring for ${roleTitle}.`,
    ),
    productsAndServices: [
      claim(`${companyName} ships widely used consumer and platform products.`),
    ],
    usersOrCustomers: [
      claim("Millions of end users and business customers worldwide."),
    ],
    missionAndValues: [
      claim("Public materials emphasize product craft, impact, and learning."),
    ],
    industryContext: claim("Technology / software products and platforms."),
    basicRoleSummary: claim(
      `The ${roleTitle} role focuses on shipping product features with mentorship.`,
    ),
    roleFamily,
    keyThingsToKnow: [
      claim(
        "Interview loops typically mix coding or portfolio review with behavioral questions.",
      ),
      claim("Official careers pages highlight collaboration and ownership."),
    ],
    researchGaps: {
      informationNotFound: ["Exact intern team size for this posting"],
      conflictingInformation: [],
      unverifiableClaims: [],
      missingUserContext: [],
      suggestedManualInputs: ["Add notes from your recruiter screen"],
    },
  };
}

export function buildDemoBrief(args: {
  companyName: string;
  roleTitle: string;
  roleFamily: RoleFamily;
}): InterviewBrief {
  const { companyName, roleTitle, roleFamily } = args;
  const snapshotBits = buildDemoSnapshot(args);

  return {
    quickBrief: {
      companySummary: snapshotBits.quickCompanySummary,
      roleSummary: claim(
        `${roleTitle} at ${companyName}: ship features, learn the stack, collaborate with mentors.`,
      ),
      keyPoints: [
        claim("Expect discussion of past projects that shipped."),
        claim("Be ready to explain tradeoffs in your technical decisions."),
      ],
      recentDevelopment: claim(
        `${companyName} continues investing in product and platform engineering.`,
      ),
      strongestPreparationAngles: [
        "A project you owned end-to-end",
        "Debugging or performance work",
        "Collaboration with design or product",
      ],
      topQuestions: [
        "How is success measured for interns on this team?",
        "What does the first two weeks of onboarding look like?",
      ],
    },
    companyOverview: {
      productsAndServices: snapshotBits.productsAndServices,
      customersOrUsers: snapshotBits.usersOrCustomers,
      industry: snapshotBits.industryContext,
      businessModel: claim("Product-led software business."),
      mission: snapshotBits.missionAndValues[0] ?? null,
      companyStatedValues: snapshotBits.missionAndValues,
      competitors: [],
      relevantLocations: [claim(args.companyName)],
      publicOrPrivateStatus: null,
    },
    recentDevelopments: [
      {
        headline: `${companyName} product and engineering updates`,
        date: null,
        summary:
          "Public engineering blogs and release notes show ongoing platform investment.",
        whyItMatters: "Useful for “why this company” answers.",
        roleRelevance: "Shows the kinds of systems interns may touch.",
        possibleTalkingPoint: "Reference a recent product launch you admire.",
        sourceIds: ["src_demo_2"],
      },
    ],
    candidateAlignment: null,
    experienceAreasToPrepare: [
      "A project where you collaborated across functions",
      "An example of debugging a tricky issue",
      "A time you learned a new stack quickly",
    ],
    likelyInterviewThemes: {
      behavioralThemes: ["Ownership", "Teamwork", "Learning quickly"],
      projectDiscussionThemes: ["Past projects", "Tradeoffs"],
      roleKnowledgeThemes: ["Core stack for the role family"],
      companyInterestThemes: ["Why this company", "Product curiosity"],
      collaborationThemes: ["Working with mentors and design"],
    },
    questionsToAsk: {
      role: [
        {
          text: "What does success look like in the first 90 days?",
          sourceIds: [],
        },
      ],
      team: [{ text: "How is the team structured?", sourceIds: [] }],
      mentorship: [
        { text: "What mentorship do interns receive?", sourceIds: [] },
      ],
      product: [
        {
          text: "Which product areas would I likely contribute to?",
          sourceIds: [],
        },
      ],
      technicalOrDesign: [],
      culture: [],
      successExpectations: [],
      recentDevelopments: [],
    },
    researchGaps: snapshotBits.researchGaps,
    roleAnalysis: {
      explicitResponsibilities: [
        claim("Build and ship product features with the engineering team"),
        claim("Collaborate with design and product on implementation"),
      ],
      mustHaveSkills: [claim("Strong fundamentals for the role family")],
      niceToHaveSkills: [claim("Prior internship or shipped side projects")],
      requiredSkills: ["Problem solving", "Communication"],
      preferredSkills: ["Prior internship experience"],
      techStackSignals: [claim("Modern product engineering stack")],
      collaborationSignals: [claim("Works closely with mentors and peers")],
      impactSignals: [claim("Emphasis on shipping user-facing improvements")],
      senioritySignals: [claim("Internship / early-career expectations")],
      dayOneExpectations: [
        claim("Onboard to the codebase and land an early PR"),
      ],
      growthExpectations: [
        claim("Take increasing ownership over the internship"),
      ],
      jdLanguageToProbe: [
        {
          phrase: "collaborate cross-functionally",
          whyAsk: "Clarify which teams and rituals are involved",
          sourceIds: ["src_demo_1"],
        },
      ],
      repeatedThemes: [claim("Shipping"), claim("Collaboration")],
      likelyPriorities: [claim("Product quality and reliable delivery")],
      possibleSuccessIndicators: [
        claim("Merged PRs and positive mentor feedback"),
      ],
      ambiguities: ["Exact team structure for this posting"],
      missingInformation: ["Interview format details"],
    },
    roleSpecificIntelligence: {
      roleFamily,
      points: [
        claim(
          `For ${roleFamily.replaceAll("_", " ").toLowerCase()} roles, expect depth on recent projects.`,
        ),
      ],
      preparationFocusAreas: [
        "A project that shipped to users",
        "How you debug and learn new tools",
      ],
      companyContextForRole: [
        claim(
          `${companyName} engineering culture emphasizes learning and collaboration.`,
        ),
      ],
      toolsAndStackToStudy: [claim("Core tools listed in the job description")],
    },
  };
}

export const DEMO_RESEARCH_META = {
  snapshotSchemaVersion: SNAPSHOT_SCHEMA_VERSION,
  briefSchemaVersion: BRIEF_SCHEMA_VERSION,
  promptVersion: BRIEF_PROMPT_VERSION,
};

export const DEMO_JD = `We are looking for an intern to join our product engineering team. You will work with mentors to design, implement, and ship features used by real customers. Strong collaboration skills, curiosity, and a bias toward shipping quality work matter more than knowing every tool on day one. You will participate in code review, standups, and design discussions throughout the internship.`;
