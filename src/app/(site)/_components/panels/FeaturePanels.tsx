import {
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  FileText,
  Link2,
  Mail,
} from "lucide-react";

function PanelFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--status-saved)" }}
          />
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--status-offer)" }}
          />
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--status-applied)" }}
          />
        </span>
        <span className="ml-2 text-[12px] font-medium text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="min-h-0 flex-1 p-4">{children}</div>
    </div>
  );
}

const PIPELINE = [
  {
    stage: "Saved",
    color: "var(--status-saved)",
    cards: [
      { role: "iOS Developer Intern", org: "Apple" },
      { role: "AI Engineer Intern", org: "OpenAI" },
    ],
  },
  {
    stage: "Applied",
    color: "var(--status-applied)",
    cards: [
      { role: "Frontend Developer Intern", org: "Google" },
      { role: "Software Engineer Intern", org: "Airbnb" },
      { role: "Full Stack Developer Intern", org: "GitHub" },
      { role: "Frontend Engineer Intern", org: "Shopify" },
    ],
  },
  {
    stage: "Interview",
    color: "var(--status-interview)",
    cards: [{ role: "Frontend Developer Intern", org: "Figma" }],
  },
];

export function PipelinePanel() {
  return (
    <PanelFrame title="Applications Board">
      <div className="grid h-full grid-cols-3 gap-3">
        {PIPELINE.map((col) => (
          <div key={col.stage} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              <span className="text-[11px] font-semibold text-foreground">
                {col.stage}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {col.cards.length}
              </span>
            </div>
            {col.cards.map((card) => (
              <div
                key={card.role}
                className="rounded-lg border border-border bg-background p-2.5"
                style={{ borderLeftWidth: 3, borderLeftColor: col.color }}
              >
                <p className="text-[12px] font-medium leading-tight text-foreground">
                  {card.role}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {card.org}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PanelFrame>
  );
}

const REMINDERS = [
  {
    org: "Robinhood",
    note: "Thank-you note after phone screen",
    when: "Today",
    due: true,
  },
  { org: "Figma", note: "Check in on take-home status", when: "Tomorrow" },
  { org: "Stripe", note: "Follow up on referral", when: "Fri" },
];

export function RemindersPanel() {
  return (
    <PanelFrame title="Follow-ups">
      <div className="flex flex-col gap-2.5">
        {REMINDERS.map((r) => (
          <div
            key={r.org}
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              r.due
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-background"
            }`}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                r.due
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Bell className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-foreground">{r.org}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {r.note}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                r.due
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {r.when}
            </span>
          </div>
        ))}
      </div>
    </PanelFrame>
  );
}

export function ResearchPanel() {
  return (
    <PanelFrame title="Company research">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-background">
          <Building2 className="size-5 text-foreground" />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-foreground">Figma</p>
          <p className="text-[11px] text-muted-foreground">
            Design Tools · San Francisco
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Design systems", "Series E", "Remote-friendly"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-border bg-background p-3">
        <p className="text-[11px] leading-5 text-muted-foreground">
          Ask about the design systems team roadmap. Referral: Dylan (met at the
          fall career fair).
        </p>
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Link2 className="size-3.5" /> figma.com/careers
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Mail className="size-3.5" /> 2 contacts
        </span>
      </div>
    </PanelFrame>
  );
}

const QUESTIONS = [
  { q: "Walk me through a project you're proud of", done: true },
  { q: "How do you handle ambiguous requirements?", done: true },
  { q: "Tell me about a time you disagreed with a teammate", done: false },
];

export function InterviewPanel() {
  return (
    <PanelFrame title="Interview prep">
      <div className="flex gap-2 text-[11px]">
        <span className="rounded-md bg-foreground px-2.5 py-1 font-medium text-background">
          Questions
        </span>
        <span className="rounded-md border border-border px-2.5 py-1 text-muted-foreground">
          Round notes
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {QUESTIONS.map((item) => (
          <div
            key={item.q}
            className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5"
          >
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                item.done
                  ? "text-[color:var(--status-applied-foreground)]"
                  : "border border-border text-transparent"
              }`}
              style={
                item.done
                  ? { backgroundColor: "var(--status-applied)" }
                  : undefined
              }
            >
              <Check className="size-3" />
            </span>
            <p className="text-[12px] text-foreground">{item.q}</p>
          </div>
        ))}
      </div>
    </PanelFrame>
  );
}

const DOCS = [
  { name: "Resume — SWE.pdf", meta: "Sent to Stripe, Airbnb", tag: "v3" },
  { name: "Resume — Frontend.pdf", meta: "Sent to Figma", tag: "v2" },
  { name: "Resume — Mobile.pdf", meta: "Sent to Apple", tag: "v1" },
  { name: "Cover letter.pdf", meta: "Draft", tag: "v1" },
];

export function DocumentsPanel() {
  return (
    <PanelFrame title="Documents">
      <div className="flex flex-col gap-2">
        {DOCS.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border">
              <FileText className="size-4 text-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-foreground">
                {doc.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {doc.meta}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {doc.tag}
            </span>
          </div>
        ))}
      </div>
    </PanelFrame>
  );
}

const RATES = [
  { label: "Response", value: "48%" },
  { label: "Interview", value: "6%" },
  { label: "Offer", value: "2%" },
];

export function InsightsPanel() {
  return (
    <PanelFrame title="Insights">
      <div className="grid grid-cols-3 gap-2">
        {RATES.map((r) => (
          <div
            key={r.label}
            className="rounded-lg border border-border bg-background p-2.5 text-center"
          >
            <p className="text-lg font-semibold text-foreground">{r.value}</p>
            <p className="text-[10px] text-muted-foreground">{r.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-border bg-background p-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-foreground">
            Applications this month
          </p>
          <span
            className="inline-flex items-center gap-1 text-[10px]"
            style={{ color: "var(--status-applied)" }}
          >
            <ArrowUpRight className="size-3" /> +3
          </span>
        </div>
        <svg
          viewBox="0 0 260 70"
          className="mt-2 w-full"
          fill="none"
          aria-hidden
        >
          <polyline
            points="6,52 50,44 94,48 138,30 182,34 226,16 254,20"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </PanelFrame>
  );
}
