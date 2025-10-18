import { notFound } from 'next/navigation';

import { ProjectHeader } from '@/components/projects/project-header';
import { TaskList } from '@/components/projects/task-list';
import { ProgressUpdates } from '@/components/projects/progress-updates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Project } from '@/lib/types';
import { getProjectById } from '@/lib/services/project-api-service';

async function getProject(id: string): Promise<Project | null> {
    try {
        // UIL calls the Frontend API Service
        return await getProjectById(id);
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
}


export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

    if (!project) {
        notFound();
    }
    
    const tasksCompleted = project.tasks.filter(t => t.status === 'Done').length;
    const totalTasks = project.tasks.length;
    const progress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

    return (
        <div className="space-y-8">
            <ProjectHeader project={project} />

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                   <ProgressUpdates project={project} />
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">Project Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                <span>{tasksCompleted} / {totalTasks} tasks completed</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} aria-label={`${Math.round(progress)}% complete`} />
                        </CardContent>
                    </Card>
                    <TaskList project={project} />
                </div>
            </div>
        </div>
    );
}
