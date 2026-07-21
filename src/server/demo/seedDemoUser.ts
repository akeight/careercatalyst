import { prisma } from "@/lib/prisma";
import {
  DEMO_APPLICATIONS,
  DEMO_COMPANIES,
  DEMO_CONTACTS,
  DEMO_GOALS,
  DEMO_PROFILE,
} from "./demoContent";
import {
  DEMO_JD,
  DEMO_RESEARCH_META,
  buildDemoBrief,
  buildDemoSnapshot,
} from "./demoResearch";

function daysFromNow(days: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

export async function seedDemoUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: DEMO_PROFILE.name,
      school: DEMO_PROFILE.school,
      major: DEMO_PROFILE.major,
      gradYear: DEMO_PROFILE.gradYear,
      targetRole: DEMO_PROFILE.targetRole,
      weeklyGoal: DEMO_PROFILE.weeklyGoal,
    },
  });

  const companyIds = new Map<string, string>();
  const companyNames = new Map<string, string>();

  for (const company of DEMO_COMPANIES) {
    const created = await prisma.company.create({
      data: {
        name: company.name,
        website: company.website,
        location: company.location,
        userId,
      },
    });
    companyIds.set(company.key, created.id);
    companyNames.set(company.key, company.name);
  }

  const contactIds = new Map<string, string>();

  for (const contact of DEMO_CONTACTS) {
    const companyId = companyIds.get(contact.companyKey);
    if (!companyId) continue;

    const created = await prisma.contact.create({
      data: {
        name: contact.name,
        email: contact.email,
        role: contact.role,
        type: contact.type,
        title: contact.title,
        userId,
        companyId,
      },
    });
    contactIds.set(contact.key, created.id);
  }

  for (const app of DEMO_APPLICATIONS) {
    const companyId = companyIds.get(app.companyKey);
    if (!companyId) continue;

    const companyName = companyNames.get(app.companyKey) ?? "Company";
    const roleFamily = app.roleFamily ?? "SOFTWARE_ENGINEERING";

    const createdApp = await prisma.application.create({
      data: {
        userId,
        companyId,
        contactId: app.contactKey ? contactIds.get(app.contactKey) : undefined,
        type: app.type,
        title: app.title,
        location: app.location,
        status: app.status,
        source: app.source,
        jobUrl: app.jobUrl,
        notes: app.notes,
        favorite: app.favorite ?? false,
        roleFamily,
        mobileSpecialization:
          roleFamily === "MOBILE_DEVELOPMENT" ? "IOS" : undefined,
        jobDescription: DEMO_JD,
        appliedAt:
          app.appliedOffsetDays != null
            ? daysFromNow(-app.appliedOffsetDays)
            : daysFromNow(0),
        deadline:
          app.deadlineOffsetDays != null
            ? daysFromNow(app.deadlineOffsetDays)
            : undefined,
      },
    });

    if (!app.researchLevel) continue;

    const snapshot = buildDemoSnapshot({
      companyName,
      roleTitle: app.title,
      roleFamily,
    });
    const withBrief = app.researchLevel === "INTERVIEW_BRIEF";
    const brief = withBrief
      ? buildDemoBrief({
          companyName,
          roleTitle: app.title,
          roleFamily,
        })
      : null;

    const research = await prisma.applicationResearch.create({
      data: {
        applicationId: createdApp.id,
        userId,
        highestLevel: withBrief ? "INTERVIEW_BRIEF" : "SNAPSHOT",
        snapshotContent: snapshot,
        snapshotGeneratedAt: daysFromNow(-3),
        snapshotSchemaVersion: DEMO_RESEARCH_META.snapshotSchemaVersion,
        snapshotExcerpt: snapshot.quickCompanySummary.text,
        snapshotSourceCount: 2,
        briefContent: brief ?? undefined,
        briefGeneratedAt: withBrief ? daysFromNow(-2) : undefined,
        briefSchemaVersion: withBrief
          ? DEMO_RESEARCH_META.briefSchemaVersion
          : undefined,
        promptVersion: withBrief ? DEMO_RESEARCH_META.promptVersion : undefined,
        briefExcerpt: brief?.quickBrief.roleSummary.text,
        briefSourceCount: withBrief ? 2 : 0,
        companyResolvedName: companyName,
        resolutionConfidence: 0.9,
      },
    });

    await prisma.applicationResearchSource.createMany({
      data: [
        {
          researchId: research.id,
          externalId: "src_demo_1",
          url: app.jobUrl,
          normalizedUrl: app.jobUrl.toLowerCase(),
          title: `${companyName} careers`,
          publisher: companyName,
          sourceType: "company_careers",
          evidenceTier: "PRIMARY",
          excerpt: "Official careers posting for this role.",
          relevanceScore: 0.95,
          freshnessScore: 0.9,
          collectedAtLevel: withBrief ? "INTERVIEW_BRIEF" : "SNAPSHOT",
        },
        {
          researchId: research.id,
          externalId: "src_demo_2",
          url: `https://example.com/news/${app.companyKey}`,
          normalizedUrl: `https://example.com/news/${app.companyKey}`,
          title: `${companyName} engineering update`,
          publisher: "Demo News",
          sourceType: "news",
          evidenceTier: "CREDIBLE_SECONDARY",
          excerpt: "Recent public engineering and product updates.",
          relevanceScore: 0.7,
          freshnessScore: 0.8,
          collectedAtLevel: withBrief ? "INTERVIEW_BRIEF" : "SNAPSHOT",
        },
      ],
    });
  }

  for (const goal of DEMO_GOALS) {
    await prisma.goal.create({
      data: {
        userId,
        title: goal.title,
        description: goal.description,
        completed: goal.completed ?? false,
        targetDate:
          goal.targetOffsetDays != null
            ? daysFromNow(goal.targetOffsetDays)
            : undefined,
      },
    });
  }
}

/** Remove expired demo sandbox users. */
export async function cleanupExpiredDemoUsers() {
  const now = new Date();
  const result = await prisma.user.deleteMany({
    where: {
      isDemo: true,
      demoExpiresAt: { lte: now },
    },
  });
  return result.count;
}

export async function deleteDemoUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
}
