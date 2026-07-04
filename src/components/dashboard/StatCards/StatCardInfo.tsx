"use client";

import { trpc } from "@/lib/trpc/client";
import { StatCard } from "./StatCard";

export function StatCardInfo() {
  const { data } = trpc.application.getStats.useQuery();
  const counts = data?.counts;

  return (
    <>
      <StatCard
        title="Applications"
        value={data?.total ?? 0}
        status="APPLIED"
      />
      <StatCard
        title="Interviews"
        value={counts?.INTERVIEW ?? 0}
        status="INTERVIEW"
      />
      <StatCard title="Offers" value={counts?.OFFER ?? 0} status="OFFER" />
      <StatCard
        title="Rejections"
        value={counts?.REJECTED ?? 0}
        status="REJECTED"
      />
    </>
  );
}
