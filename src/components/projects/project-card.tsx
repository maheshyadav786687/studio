import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import type { Project, Task } from "@/lib/types";

type ProjectCardProps = {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const tasksCompleted = project.tasks ? project.tasks.filter((t: Task) => t.StatusId === '2').length : 0;
    const totalTasks = project.tasks ? project.tasks.length : 0;
    const progress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
    const projectStatuses = [
        { Id: '1', Name: 'In Progress' },
        { Id: '2', Name: 'Completed' },
        { Id: '3', Name: 'Not Started' },
        { Id: '4', Name: 'Delayed' },
      ];

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
                <Link href={`/admin/projects/${project.Id}`}>
                    <div className="relative h-48 w-full">
                        <Image
                            src={`https://picsum.photos/seed/${project.Id}/400/300`}
                            alt={project.Name}
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint="office building"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="p-4">
                <Badge variant={
                    project.StatusId === '2' ? 'default' : 
                    project.StatusId === '4' ? 'destructive' : 'secondary'
                }
                className={project.StatusId === '2' ? 'bg-green-600' : ''}
                >
                    {projectStatuses.find(s => s.Id === project.StatusId)?.Name || 'N/A'}
                </Badge>
                <Link href={`/admin/projects/${project.Id}`}>
                    <CardTitle className="mt-2 font-headline hover:text-primary transition-colors">{project.Name}</CardTitle>
                </Link>
                <CardDescription className="mt-1 h-10 overflow-hidden">{project.Description || ''}</CardDescription>

                <div className="mt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} aria-label={`${Math.round(progress)}% complete`} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center p-4 pt-0">
                {project.EndDate && (
                    <div className="text-sm text-muted-foreground">
                        Deadline: {format(parseISO(project.EndDate), "MMM d, yyyy")}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
