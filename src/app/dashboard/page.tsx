import StatCard from "@/components/dashboard/StatCard";
import Calendar from "@/components/dashboard/Calendar";
import RecentActivity from "@/components/dashboard/RecentActivity";
import FollowUpReminders from "@/components/dashboard/FollowUpReminders";
import MotivationCard from "@/components/dashboard/MotivationCard";

export default function Page() {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {/* Stat Cards */}
            <StatCard title="Applications" value={12} />
            <StatCard title="Interviews" value={3} />
            <StatCard title="Offers" value={1} />
            <StatCard title="Rejections" value={2} />

            {/* Full width sections */}
            <div className="col-span-2 xl:col-span-2">
                <RecentActivity />
            </div>
            <div className="col-span-2 xl:col-span-2">
                <Calendar />
            </div>
            <div className="col-span-2 xl:col-span-2">
                <FollowUpReminders />
            </div>
            <div className="col-span-2 xl:col-span-2">
                <MotivationCard />
            </div>
        </div>
    );
}
