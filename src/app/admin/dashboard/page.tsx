import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProjectsOverviewChart } from '@/components/dashboard/projects-overview-chart';
import { RecentUpdates } from '@/components/dashboard/recent-updates';
import { getProjects } from '@/lib/bll/project-bll';
import type { Project, Status } from '@/lib/types';

async function getProjectStatusData() {
  try {
    const projects: Project[] = await getProjects();
    const statuses: Status[] = [
      { Id: '1', Name: 'In Progress' },
      { Id: '2', Name: 'Completed' },
      { Id: '3', Name: 'Not Started' },
      { Id: '4', Name: 'Delayed' },
    ];
    const counts = {
      'In Progress': 0,
      'Completed': 0,
      'Not Started': 0,
      'Delayed': 0,
    };

    projects.forEach(project => {
      const status = statuses.find(s => s.Id === project.StatusId);
      if (status && status.Name in counts) {
        counts[status.Name as keyof typeof counts]++;
      }
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, total: value }));
  } catch (error) {
    console.error("Failed to fetch project status data for chart:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const chartData = await getProjectStatusData();

  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ProjectsOverviewChart data={chartData} />
        <RecentUpdates />
      </div>
    </div>
  );
}
