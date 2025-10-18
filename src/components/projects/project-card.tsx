import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import type { Project } from "@/lib/types";

type ProjectCardProps = {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const tasksCompleted = project.tasks.filter(t => t.status === 'Done').length;
    const totalTasks = project.tasks.length;
    const progress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
                <Link href={`/admin/projects/${project.id}`}>
                    <div className="relative h-48 w-full">
                        <Image
                            src={project.imageUrl}
                            alt={project.name}
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
                    project.status === 'Completed' ? 'default' : 
                    project.status === 'Delayed' ? 'destructive' : 'secondary'
                }
                className={project.status === 'Completed' ? 'bg-green-600' : ''}
                >
                    {project.status}
                </Badge>
                <Link href={`/admin/projects/${project.id}`}>
                    <CardTitle className="mt-2 font-headline hover:text-primary transition-colors">{project.name}</CardTitle>
                </Link>
                <CardDescription className="mt-1 h-10 overflow-hidden">{project.description}</CardDescription>

                <div className="mt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} aria-label={`${Math.round(progress)}% complete`} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center p-4 pt-0">
                <div className="text-sm text-muted-foreground">
                    Deadline: {format(parseISO(project.deadline), "MMM d, yyyy")}
                </div>
            </CardFooter>
        </Card>
    )
}
