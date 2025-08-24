import type { Application } from "@/store/useTrackerStore";

import { StatCard } from "./StatCard";

type StatCardProps = {
  title: string;
  value: number;
  app?: Pick<Application, "status"> | null;
};

export function StatCardInfo({ title, value, app }: StatCardProps) {
  // const utils = trpc.useUtils();

  return <StatCard title={title} value={value} app={app} />;
}
