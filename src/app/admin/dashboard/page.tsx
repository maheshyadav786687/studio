import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProjectsOverviewChart } from '@/components/dashboard/projects-overview-chart';
import { RecentUpdates } from '@/components/dashboard/recent-updates';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ProjectsOverviewChart />
        <RecentUpdates />
      </div>
    </div>
  );
}
