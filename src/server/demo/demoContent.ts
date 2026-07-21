import type {
  ApplicationType,
  ContactType,
  RoleFamily,
  Status,
} from "@prisma/client";

export type DemoCompanySeed = {
  key: string;
  name: string;
  website: string;
  location: string;
};

export type DemoContactSeed = {
  key: string;
  name: string;
  email: string;
  role: string;
  type: ContactType;
  title: string;
  companyKey: string;
};

export type DemoApplicationSeed = {
  companyKey: string;
  contactKey?: string;
  type: ApplicationType;
  title: string;
  location: string;
  status: Status;
  source: string;
  jobUrl: string;
  notes?: string;
  favorite?: boolean;
  roleFamily?: RoleFamily;
  /** Pre-seeded interview prep level for this application. */
  researchLevel?: "SNAPSHOT" | "INTERVIEW_BRIEF";
  /** Days from now for deadline (negative = past). */
  deadlineOffsetDays?: number;
  /** Days ago for appliedAt. */
  appliedOffsetDays?: number;
};

export type DemoGoalSeed = {
  title: string;
  description?: string;
  completed?: boolean;
  targetOffsetDays?: number;
};

export const DEMO_COMPANIES: DemoCompanySeed[] = [
  {
    key: "pinterest",
    name: "Pinterest",
    website: "https://www.pinterest.com",
    location: "Seattle, WA",
  },
  {
    key: "figma",
    name: "Figma",
    website: "https://www.figma.com",
    location: "New York, NY",
  },
  {
    key: "vercel",
    name: "Vercel",
    website: "https://vercel.com",
    location: "San Francisco, CA",
  },
  {
    key: "google",
    name: "Google",
    website: "https://www.google.com",
    location: "Mountain View, CA",
  },
  {
    key: "meta",
    name: "Meta",
    website: "https://www.meta.com",
    location: "Menlo Park, CA",
  },
  {
    key: "stripe",
    name: "Stripe",
    website: "https://stripe.com",
    location: "San Francisco, CA",
  },
  {
    key: "notion",
    name: "Notion",
    website: "https://www.notion.so",
    location: "San Francisco, CA",
  },
  {
    key: "spotify",
    name: "Spotify",
    website: "https://www.spotify.com",
    location: "New York, NY",
  },
  {
    key: "airbnb",
    name: "Airbnb",
    website: "https://www.airbnb.com",
    location: "San Francisco, CA",
  },
  {
    key: "openai",
    name: "OpenAI",
    website: "https://openai.com",
    location: "San Francisco, CA",
  },
  {
    key: "microsoft",
    name: "Microsoft",
    website: "https://www.microsoft.com",
    location: "Redmond, WA",
  },
  {
    key: "amazon",
    name: "Amazon",
    website: "https://www.amazon.com",
    location: "Seattle, WA",
  },
];

export const DEMO_CONTACTS: DemoContactSeed[] = [
  {
    key: "alex-chen",
    name: "Alex Chen",
    email: "alex.chen@pinterest.com",
    role: "Recruiter",
    type: "RECRUITER",
    title: "University Recruiter",
    companyKey: "pinterest",
  },
  {
    key: "jordan-lee",
    name: "Jordan Lee",
    email: "jordan.lee@figma.com",
    role: "Hiring Manager",
    type: "HIRING_MANAGER",
    title: "Engineering Manager",
    companyKey: "figma",
  },
  {
    key: "sam-patel",
    name: "Sam Patel",
    email: "sam.patel@google.com",
    role: "Referral",
    type: "REFERRAL",
    title: "Software Engineer",
    companyKey: "google",
  },
  {
    key: "taylor-kim",
    name: "Taylor Kim",
    email: "taylor.kim@stripe.com",
    role: "Recruiter",
    type: "RECRUITER",
    title: "Early Career Recruiter",
    companyKey: "stripe",
  },
];

export const DEMO_APPLICATIONS: DemoApplicationSeed[] = [
  {
    companyKey: "pinterest",
    contactKey: "alex-chen",
    type: "INTERNSHIP",
    title: "Software Engineer Intern",
    location: "Seattle, WA",
    status: "SAVED",
    source: "Company site",
    jobUrl: "https://www.pinterestcareers.com",
    notes: "Strong design-systems culture. Apply before priority deadline.",
    favorite: true,
    roleFamily: "SOFTWARE_ENGINEERING",
    deadlineOffsetDays: 12,
  },
  {
    companyKey: "figma",
    contactKey: "jordan-lee",
    type: "INTERNSHIP",
    title: "Product Manager Intern",
    location: "New York, NY",
    status: "SAVED",
    source: "LinkedIn",
    jobUrl: "https://www.figma.com/careers",
    roleFamily: "PRODUCT_MANAGEMENT",
    deadlineOffsetDays: 18,
  },
  {
    companyKey: "vercel",
    type: "INTERNSHIP",
    title: "Frontend Developer Intern",
    location: "San Francisco, CA",
    status: "SAVED",
    source: "Referral",
    jobUrl: "https://vercel.com/careers",
    favorite: true,
    roleFamily: "FRONTEND_ENGINEERING",
    deadlineOffsetDays: 8,
  },
  {
    companyKey: "notion",
    type: "INTERNSHIP",
    title: "Software Engineer Intern",
    location: "San Francisco, CA",
    status: "APPLIED",
    source: "Handshake",
    jobUrl: "https://www.notion.so/careers",
    notes: "Submitted resume + cover letter. Waiting on OA.",
    roleFamily: "SOFTWARE_ENGINEERING",
    researchLevel: "SNAPSHOT",
    appliedOffsetDays: 6,
    deadlineOffsetDays: -2,
  },
  {
    companyKey: "spotify",
    type: "INTERNSHIP",
    title: "iOS Engineer Intern",
    location: "New York, NY",
    status: "APPLIED",
    source: "Company site",
    jobUrl: "https://www.lifeatspotify.com",
    roleFamily: "MOBILE_DEVELOPMENT",
    researchLevel: "SNAPSHOT",
    appliedOffsetDays: 10,
  },
  {
    companyKey: "airbnb",
    type: "INTERNSHIP",
    title: "Full Stack Intern",
    location: "San Francisco, CA",
    status: "APPLIED",
    source: "LinkedIn",
    jobUrl: "https://careers.airbnb.com",
    favorite: true,
    roleFamily: "SOFTWARE_ENGINEERING",
    researchLevel: "SNAPSHOT",
    appliedOffsetDays: 14,
  },
  {
    companyKey: "google",
    contactKey: "sam-patel",
    type: "INTERNSHIP",
    title: "Software Engineering Intern",
    location: "Mountain View, CA",
    status: "INTERVIEW",
    source: "Referral",
    jobUrl: "https://careers.google.com",
    notes: "Phone screen scheduled. Review system design basics.",
    roleFamily: "SOFTWARE_ENGINEERING",
    researchLevel: "INTERVIEW_BRIEF",
    appliedOffsetDays: 21,
    deadlineOffsetDays: 3,
  },
  {
    companyKey: "stripe",
    contactKey: "taylor-kim",
    type: "INTERNSHIP",
    title: "Software Engineer Intern",
    location: "San Francisco, CA",
    status: "INTERVIEW",
    source: "Company site",
    jobUrl: "https://stripe.com/jobs",
    notes: "Onsite loop next week — prepare API design stories.",
    favorite: true,
    roleFamily: "SOFTWARE_ENGINEERING",
    researchLevel: "INTERVIEW_BRIEF",
    appliedOffsetDays: 28,
    deadlineOffsetDays: 5,
  },
  {
    companyKey: "meta",
    type: "INTERNSHIP",
    title: "Software Engineer Intern",
    location: "Menlo Park, CA",
    status: "OFFER",
    source: "Company site",
    jobUrl: "https://www.metacareers.com",
    notes: "Offer received — comparing with Stripe timeline.",
    favorite: true,
    roleFamily: "SOFTWARE_ENGINEERING",
    appliedOffsetDays: 45,
  },
  {
    companyKey: "microsoft",
    type: "INTERNSHIP",
    title: "Explore Intern",
    location: "Redmond, WA",
    status: "OFFER",
    source: "Campus fair",
    jobUrl: "https://careers.microsoft.com",
    roleFamily: "SOFTWARE_ENGINEERING",
    appliedOffsetDays: 50,
  },
  {
    companyKey: "amazon",
    type: "INTERNSHIP",
    title: "SDE Intern",
    location: "Seattle, WA",
    status: "REJECTED",
    source: "Company site",
    jobUrl: "https://www.amazon.jobs",
    notes: "Rejected after OA. Reapply next cycle.",
    roleFamily: "SOFTWARE_ENGINEERING",
    appliedOffsetDays: 40,
  },
  {
    companyKey: "openai",
    type: "INTERNSHIP",
    title: "Software Engineer Intern",
    location: "San Francisco, CA",
    status: "REJECTED",
    source: "LinkedIn",
    jobUrl: "https://openai.com/careers",
    roleFamily: "SOFTWARE_ENGINEERING",
    appliedOffsetDays: 35,
  },
];

export const DEMO_GOALS: DemoGoalSeed[] = [
  {
    title: "Submit 5 applications this week",
    description: "Focus on companies with deadlines in the next 14 days.",
    completed: false,
    targetOffsetDays: 7,
  },
  {
    title: "Prep Google phone screen",
    description: "Review data structures and two behavioral stories.",
    completed: false,
    targetOffsetDays: 3,
  },
  {
    title: "Update resume bullet for hackathon project",
    completed: true,
    targetOffsetDays: -2,
  },
];

export const DEMO_PROFILE = {
  name: "Demo Explorer",
  school: "University of Washington",
  major: "Computer Science",
  gradYear: new Date().getFullYear() + 1,
  targetRole: "Software Engineer Intern",
  weeklyGoal: 5,
};
