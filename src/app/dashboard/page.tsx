import StatCard from "@/components/dashboard/StatCard";
import { AppCalendar } from "@/components/dashboard/AppCalendar";
import RecentActivity from "@/components/dashboard/RecentActivity/RecentActivity";
import { FollowUpReminders } from "@/components/dashboard/FollowUpReminders";
import MotivationCard from "@/components/dashboard/MotivationCard";
//import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
//import { faMemoPad } from "@awesome.me/kit-3cb9aa7d8b/icons/duotone/solid"

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <div className="justify-center grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 col-span-2 xl:col-span-2">
        {/* Stat Cards */}
        <StatCard title="Applications" value={12} />
        <StatCard title="Interviews" value={3} />
        <StatCard title="Offers" value={1} />
        <StatCard title="Rejections" value={2} />

        {/* Full width sections */}

        <div className="col-span-2 xl:col-span-2 mx-auto">
          <FollowUpReminders />
        </div>
        <div className="col-span-2 xl:col-span-2 mx-auto">
          <RecentActivity />
        </div>
        <div className="col-span-2 xl:col-span-2 mx-auto">
          <AppCalendar />
        </div>
        <div className="col-span-2 xl:col-span-2 mx-auto">
          <MotivationCard />
        </div>
      </div>
    </div>
  );
}
