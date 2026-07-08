import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Calendar,
  Compass,
  FileText,
  Heart,
  Home,
  Laptop,
  Plus,
  User,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Compass, label: "Applications Board" },
  { icon: Laptop, label: "Search for Opportunities" },
  { icon: Bookmark, label: "Saved for Later" },
  { icon: Heart, label: "Favorites" },
  { icon: Calendar, label: "View Calendar" },
  { icon: User, label: "Contacts" },
];

const TOOL_ITEMS = [
  { icon: Zap, label: "NSpire AI Career Coach" },
  { icon: Briefcase, label: "Prampt Interview Practice" },
  { icon: FileText, label: "Resume Template" },
];

const STATS = [
  { label: "Saved", value: "8", color: "var(--status-saved)" },
  { label: "Applied", value: "94", color: "var(--status-applied)" },
  { label: "Interviews", value: "5", color: "var(--status-interview)" },
  { label: "Offers", value: "2", color: "var(--status-offer)" },
];

const INSIGHTS = [
  { value: "63%", label: "Response rate" },
  { value: "5%", label: "Interview rate" },
  { value: "2%", label: "Offer rate" },
];

const SAVED_APPS = [
  { role: "Software Engineer Intern", meta: "Pinterest · Seattle" },
  { role: "Software Engineer Intern", meta: "Figma · New York" },
  { role: "Software Engineer Intern", meta: "Vercel · San Francisco" },
];

function SidebarLink({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] ${
        active
          ? "font-medium text-[var(--nav-active-foreground)]"
          : "text-sidebar-foreground/80"
      }`}
      style={
        active
          ? {
              backgroundColor:
                "color-mix(in srgb, var(--nav-active) 40%, transparent)",
            }
          : undefined
      }
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="relative">
      {/* Floating accents */}
      <div className="floating-accent absolute -left-4 top-16 z-10 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:flex">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: "var(--status-applied)" }}
          />
          <span className="text-xs font-medium text-foreground">
            Applied to Figma
          </span>
        </div>
      </div>
      <div className="floating-accent absolute -right-3 top-40 z-10 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:flex">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <span className="text-xs font-medium text-foreground">
            Follow up with Google
          </span>
        </div>
      </div>

      {/* Window frame */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden w-[188px] shrink-0 flex-col justify-between border-r border-border bg-sidebar p-3 md:flex">
            <div className="space-y-4">
              <div>
                <p className="px-2.5 font-serif text-lg font-semibold text-sidebar-foreground">
                  Catalyst
                </p>
                <p className="px-2.5 text-[11px] text-muted-foreground">
                  Turn opportunities into offers.
                </p>
              </div>

              <div className="space-y-1">
                <p className="px-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Navigation
                </p>
                {NAV_ITEMS.map((item) => (
                  <SidebarLink key={item.label} {...item} />
                ))}
              </div>

              <div className="space-y-1">
                <p className="px-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Tools
                </p>
                {TOOL_ITEMS.map((item) => (
                  <SidebarLink key={item.label} {...item} />
                ))}
              </div>

              <div className="px-1.5">
                <div className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground">
                  <Plus className="size-3.5" />
                  Add Application
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                A
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-sidebar-foreground">
                  Ally
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  user@gmail.com
                </p>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
            {/* Header */}
            <div>
              <p className="text-[11px] text-muted-foreground">
                Sunday, July 5
              </p>
              <p className="font-serif text-xl text-foreground sm:text-2xl">
                Good evening, Ally.
              </p>
              <p className="text-[11px] text-muted-foreground">
                Here&apos;s where your job search stands today.
              </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="dashboard-card rounded-xl border border-border bg-card p-3 shadow-xs"
                  style={{ borderLeftWidth: 3, borderLeftColor: stat.color }}
                >
                  <p className="text-[11px] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart + insights */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {/* Applications submitted chart */}
              <div className="dashboard-card rounded-xl border border-border bg-card p-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">
                      Applications Submitted
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      9 submitted in July 2026.
                    </p>
                  </div>
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                    Weekly
                  </span>
                </div>
                <svg
                  viewBox="0 0 320 110"
                  className="mt-3 w-full"
                  fill="none"
                  aria-hidden
                >
                  {[0, 1, 2, 3].map((i) => (
                    <line
                      key={i}
                      x1="24"
                      x2="316"
                      y1={12 + i * 24}
                      y2={12 + i * 24}
                      stroke="var(--border)"
                      strokeWidth="1"
                    />
                  ))}
                  <polyline
                    points="40,60 110,60 180,84 250,84 308,84"
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[
                    [40, 60],
                    [110, 60],
                    [180, 84],
                    [250, 84],
                    [308, 84],
                  ].map(([x, y]) => (
                    <circle
                      key={`${x}-${y}`}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="var(--primary)"
                    />
                  ))}
                </svg>
                <div className="mt-1 flex justify-between px-4 text-[9px] text-muted-foreground">
                  {["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5"].map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="dashboard-card rounded-xl border border-border bg-card p-4">
                <p className="text-[13px] font-semibold text-foreground">
                  Insights
                </p>
                <p className="text-[11px] text-muted-foreground">
                  How your applications are converting.
                </p>
                <div className="mt-3 space-y-2">
                  {INSIGHTS.map((insight) => (
                    <div
                      key={insight.label}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-1.5"
                    >
                      <span className="text-[11px] text-muted-foreground">
                        {insight.label}
                      </span>
                      <span className="text-[13px] font-semibold text-foreground">
                        {insight.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Saved applications + weekly goal */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="dashboard-card rounded-xl border border-border bg-card p-4 lg:col-span-2">
                <p className="text-[13px] font-semibold text-foreground">
                  Saved Applications
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Pick up where you left off and continue your applications.
                </p>
                <div className="mt-3 space-y-2">
                  {SAVED_APPS.map((app) => (
                    <div
                      key={app.role}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-foreground">
                          {app.role}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {app.meta}
                        </p>
                      </div>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly goal */}
              <div className="dashboard-card flex flex-col rounded-xl border border-border bg-card p-4">
                <p className="text-[13px] font-semibold text-foreground">
                  Weekly Goal
                </p>
                <p className="text-[11px] text-muted-foreground">
                  4 more to hit your weekly target.
                </p>
                <div className="mt-2 flex flex-1 items-center justify-center">
                  <div className="relative">
                    <svg viewBox="0 0 80 80" className="size-24" fill="none">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="var(--muted)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="var(--secondary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 32}
                        strokeDashoffset={2 * Math.PI * 32 * (1 - 2 / 6)}
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold text-foreground">
                        2
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        of 6
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
