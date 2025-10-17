import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProjectsOverviewChart } from '@/components/dashboard/projects-overview-chart';
import { RecentUpdates } from '@/components/dashboard/recent-updates';

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <ProjectsOverviewChart />
            <RecentUpdates />
        </div>
    </div>
  );
}
