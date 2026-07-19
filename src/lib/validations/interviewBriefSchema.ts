import { z } from "zod";
import { ROLE_FAMILY_VALUES } from "@/lib/roleFamily";

export const BRIEF_SCHEMA_VERSION = "1.1.0";
export const BRIEF_PROMPT_VERSION = "1.1.0";

export const briefEvidenceStatusSchema = z.enum([
  "verified",
  "inferred",
  "anecdotal",
  "conflicting",
  "unknown",
]);

/** No `.default()` / `.optional()` — OpenAI structured outputs require every key in `required`. */
export const briefClaimSchema = z.object({
  text: z.string(),
  evidenceStatus: briefEvidenceStatusSchema,
  sourceIds: z.array(z.string()),
});

export const recentDevelopmentSchema = z.object({
  headline: z.string(),
  date: z.string().nullable(),
  summary: z.string(),
  whyItMatters: z.string().nullable(),
  roleRelevance: z.string().nullable(),
  possibleTalkingPoint: z.string().nullable(),
  sourceIds: z.array(z.string()),
});

const questionSchema = z.object({
  text: z.string(),
  sourceIds: z.array(z.string()),
});

const jdProbeSchema = z.object({
  phrase: z.string(),
  whyAsk: z.string(),
  sourceIds: z.array(z.string()),
});

/** Deep, JD-grounded role analysis (second synthesis pass). */
export const roleAnalysisSchema = z.object({
  explicitResponsibilities: z.array(briefClaimSchema),
  mustHaveSkills: z.array(briefClaimSchema),
  niceToHaveSkills: z.array(briefClaimSchema),
  // Plain string mirrors for quick UI lists / older brief compatibility
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  techStackSignals: z.array(briefClaimSchema),
  collaborationSignals: z.array(briefClaimSchema),
  impactSignals: z.array(briefClaimSchema),
  senioritySignals: z.array(briefClaimSchema),
  dayOneExpectations: z.array(briefClaimSchema),
  growthExpectations: z.array(briefClaimSchema),
  jdLanguageToProbe: z.array(jdProbeSchema),
  repeatedThemes: z.array(briefClaimSchema),
  likelyPriorities: z.array(briefClaimSchema),
  possibleSuccessIndicators: z.array(briefClaimSchema),
  ambiguities: z.array(z.string()),
  missingInformation: z.array(z.string()),
});

export const roleSpecificIntelligenceSchema = z.object({
  roleFamily: z.enum(ROLE_FAMILY_VALUES),
  points: z.array(briefClaimSchema),
  preparationFocusAreas: z.array(z.string()),
  companyContextForRole: z.array(briefClaimSchema),
  toolsAndStackToStudy: z.array(briefClaimSchema),
});

/** Pass 2: role depth only */
export const roleDepthPassSchema = z.object({
  roleAnalysis: roleAnalysisSchema,
  roleSpecificIntelligence: roleSpecificIntelligenceSchema,
});

/** Pass 1: company / news / themes / questions (role filled in pass 2) */
export const interviewBriefCompanyPassSchema = z.object({
  quickBrief: z.object({
    companySummary: briefClaimSchema,
    roleSummary: briefClaimSchema,
    keyPoints: z.array(briefClaimSchema),
    recentDevelopment: briefClaimSchema.nullable(),
    strongestPreparationAngles: z.array(z.string()),
    topQuestions: z.array(z.string()),
  }),
  companyOverview: z.object({
    productsAndServices: z.array(briefClaimSchema),
    customersOrUsers: z.array(briefClaimSchema),
    industry: briefClaimSchema.nullable(),
    businessModel: briefClaimSchema.nullable(),
    mission: briefClaimSchema.nullable(),
    companyStatedValues: z.array(briefClaimSchema),
    competitors: z.array(briefClaimSchema),
    relevantLocations: z.array(briefClaimSchema),
    publicOrPrivateStatus: briefClaimSchema.nullable(),
  }),
  recentDevelopments: z.array(recentDevelopmentSchema),
  candidateAlignment: z
    .array(
      z.object({
        roleNeed: z.string(),
        candidateEvidence: z.string(),
        storyToPrepare: z.string().nullable(),
        preparationGap: z.string().nullable(),
        sourceOfCandidateEvidence: z.string(),
      }),
    )
    .nullable(),
  experienceAreasToPrepare: z.array(z.string()).nullable(),
  likelyInterviewThemes: z.object({
    behavioralThemes: z.array(z.string()),
    projectDiscussionThemes: z.array(z.string()),
    roleKnowledgeThemes: z.array(z.string()),
    companyInterestThemes: z.array(z.string()),
    collaborationThemes: z.array(z.string()),
  }),
  questionsToAsk: z.object({
    role: z.array(questionSchema),
    team: z.array(questionSchema),
    mentorship: z.array(questionSchema),
    product: z.array(questionSchema),
    technicalOrDesign: z.array(questionSchema),
    culture: z.array(questionSchema),
    successExpectations: z.array(questionSchema),
    recentDevelopments: z.array(questionSchema),
  }),
  researchGaps: z.object({
    informationNotFound: z.array(z.string()),
    conflictingInformation: z.array(z.string()),
    unverifiableClaims: z.array(z.string()),
    missingUserContext: z.array(z.string()),
    suggestedManualInputs: z.array(z.string()),
  }),
});

export const interviewBriefSchema = interviewBriefCompanyPassSchema.extend({
  roleAnalysis: roleAnalysisSchema,
  roleSpecificIntelligence: roleSpecificIntelligenceSchema,
});

export type RoleAnalysis = z.infer<typeof roleAnalysisSchema>;
export type RoleDepthPass = z.infer<typeof roleDepthPassSchema>;
export type InterviewBrief = z.infer<typeof interviewBriefSchema>;
