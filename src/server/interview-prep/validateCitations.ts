import type { CompanySnapshot } from "@/lib/validations/companySnapshotSchema";
import type { InterviewBrief } from "@/lib/validations/interviewBriefSchema";

type SnapshotStatus = CompanySnapshot["quickCompanySummary"]["evidenceStatus"];
type BriefStatus =
  InterviewBrief["quickBrief"]["companySummary"]["evidenceStatus"];

type SnapshotClaim = {
  text: string;
  evidenceStatus: SnapshotStatus;
  sourceIds: string[];
};

type BriefClaim = {
  text: string;
  evidenceStatus: BriefStatus;
  sourceIds: string[];
};

function mapSnapshotClaim(
  c: SnapshotClaim,
  validIds: Set<string>,
): SnapshotClaim {
  const ids = c.sourceIds.filter((id) => validIds.has(id));
  if (c.evidenceStatus === "verified" && ids.length === 0) {
    return { ...c, evidenceStatus: "unknown", sourceIds: [] };
  }
  return { ...c, sourceIds: ids };
}

function mapBriefClaim(c: BriefClaim, validIds: Set<string>): BriefClaim {
  const ids = c.sourceIds.filter((id) => validIds.has(id));
  if (
    c.evidenceStatus === "verified" &&
    c.sourceIds.length &&
    ids.length === 0
  ) {
    return { ...c, evidenceStatus: "unknown", sourceIds: [] };
  }
  return { ...c, sourceIds: ids };
}

export function validateSnapshotCitations(
  snapshot: CompanySnapshot,
  validSourceIds: string[],
): { snapshot: CompanySnapshot; gaps: string[] } {
  const validIds = new Set(validSourceIds);
  const gaps: string[] = [];

  const check = (c: SnapshotClaim): SnapshotClaim => {
    if (c.evidenceStatus === "verified" && c.sourceIds.length === 0) {
      gaps.push(`Uncited claim marked unknown: ${c.text.slice(0, 80)}`);
    }
    if (
      c.evidenceStatus === "verified" &&
      c.sourceIds.length > 0 &&
      !c.sourceIds.some((id) => validIds.has(id))
    ) {
      gaps.push(`Unsupported verified claim: ${c.text.slice(0, 80)}`);
    }
    return mapSnapshotClaim(c, validIds);
  };

  return {
    snapshot: {
      ...snapshot,
      quickCompanySummary: check(snapshot.quickCompanySummary),
      basicRoleSummary: check(snapshot.basicRoleSummary),
      industryContext: snapshot.industryContext
        ? check(snapshot.industryContext)
        : null,
      productsAndServices: snapshot.productsAndServices.map(check),
      usersOrCustomers: snapshot.usersOrCustomers.map(check),
      missionAndValues: snapshot.missionAndValues.map(check),
      keyThingsToKnow: snapshot.keyThingsToKnow.map(check),
      researchGaps: {
        ...snapshot.researchGaps,
        unverifiableClaims: [
          ...snapshot.researchGaps.unverifiableClaims,
          ...gaps,
        ],
      },
    },
    gaps,
  };
}

export function validateBriefCitations(
  brief: InterviewBrief,
  validSourceIds: string[],
): { brief: InterviewBrief; gaps: string[] } {
  const validIds = new Set(validSourceIds);
  const gaps: string[] = [];

  const check = (c: BriefClaim): BriefClaim => {
    if (
      c.evidenceStatus === "verified" &&
      c.sourceIds.length > 0 &&
      !c.sourceIds.some((id) => validIds.has(id))
    ) {
      gaps.push(`Unsupported verified claim: ${c.text.slice(0, 80)}`);
    }
    return mapBriefClaim(c, validIds);
  };

  const mapClaims = (claims: BriefClaim[]) => claims.map(check);
  const ra = brief.roleAnalysis;

  return {
    brief: {
      ...brief,
      quickBrief: {
        ...brief.quickBrief,
        companySummary: check(brief.quickBrief.companySummary),
        roleSummary: check(brief.quickBrief.roleSummary),
        recentDevelopment: brief.quickBrief.recentDevelopment
          ? check(brief.quickBrief.recentDevelopment)
          : null,
        keyPoints: brief.quickBrief.keyPoints.map(check),
      },
      companyOverview: {
        ...brief.companyOverview,
        productsAndServices:
          brief.companyOverview.productsAndServices.map(check),
        customersOrUsers: brief.companyOverview.customersOrUsers.map(check),
        industry: brief.companyOverview.industry
          ? check(brief.companyOverview.industry)
          : null,
        mission: brief.companyOverview.mission
          ? check(brief.companyOverview.mission)
          : null,
        companyStatedValues:
          brief.companyOverview.companyStatedValues.map(check),
        competitors: brief.companyOverview.competitors.map(check),
      },
      roleAnalysis: {
        ...ra,
        explicitResponsibilities: mapClaims(ra.explicitResponsibilities),
        mustHaveSkills: mapClaims(ra.mustHaveSkills),
        niceToHaveSkills: mapClaims(ra.niceToHaveSkills),
        techStackSignals: mapClaims(ra.techStackSignals),
        collaborationSignals: mapClaims(ra.collaborationSignals),
        impactSignals: mapClaims(ra.impactSignals),
        senioritySignals: mapClaims(ra.senioritySignals),
        dayOneExpectations: mapClaims(ra.dayOneExpectations),
        growthExpectations: mapClaims(ra.growthExpectations),
        repeatedThemes: mapClaims(ra.repeatedThemes),
        likelyPriorities: mapClaims(ra.likelyPriorities),
        possibleSuccessIndicators: mapClaims(ra.possibleSuccessIndicators),
        jdLanguageToProbe: ra.jdLanguageToProbe.map((p) => ({
          ...p,
          sourceIds: p.sourceIds.filter((id) => validIds.has(id)),
        })),
      },
      roleSpecificIntelligence: {
        ...brief.roleSpecificIntelligence,
        points: brief.roleSpecificIntelligence.points.map(check),
        companyContextForRole:
          brief.roleSpecificIntelligence.companyContextForRole.map(check),
        toolsAndStackToStudy:
          brief.roleSpecificIntelligence.toolsAndStackToStudy.map(check),
      },
      recentDevelopments: brief.recentDevelopments.map((d) => ({
        ...d,
        sourceIds: d.sourceIds.filter((id) => validIds.has(id)),
      })),
      researchGaps: {
        ...brief.researchGaps,
        unverifiableClaims: [...brief.researchGaps.unverifiableClaims, ...gaps],
      },
    },
    gaps,
  };
}
