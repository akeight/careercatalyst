import { format } from "date-fns";

function greeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader({ name }: { name?: string | null }) {
  const now = new Date();
  const firstName = name?.split(" ")[0];

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">
        {format(now, "EEEE, MMMM d")}
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl">
        {greeting(now)}
        {firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="text-sm text-muted-foreground">
        Here&apos;s where your job search stands today.
      </p>
    </div>
  );
}
