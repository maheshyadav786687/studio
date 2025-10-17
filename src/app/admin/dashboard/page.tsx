'use client';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProjectsOverviewChart } from '@/components/dashboard/projects-overview-chart';
import { RecentUpdates } from '@/components/dashboard/recent-updates';

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your projects and contractors.</p>
        </div>
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <ProjectsOverviewChart />
            <RecentUpdates />
        </div>
    </div>
  );
}
