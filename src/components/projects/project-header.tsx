import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { CalendarDays } from 'lucide-react';

type ProjectHeaderProps = {
    project: Project;
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
    return (
        <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <Badge variant={
                        project.status === 'Completed' ? 'default' : 
                        project.status === 'Delayed' ? 'destructive' : 'secondary'
                    }
                    className={project.status === 'Completed' ? 'bg-green-600' : ''}
                    >
                        {project.status}
                    </Badge>
                    <h1 className="font-headline text-4xl font-bold tracking-tight mt-2">{project.name}</h1>
                    <p className="text-muted-foreground mt-1 max-w-3xl">{project.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>Start: {format(parseISO(project.startDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-destructive" />
                        <span className="font-medium text-foreground">Deadline: {format(parseISO(project.deadline), 'MMM d, yyyy')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
