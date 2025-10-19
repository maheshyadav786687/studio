import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { CalendarDays } from 'lucide-react';

type ProjectHeaderProps = {
    project: Project;
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
    const projectStatuses = [
        { Id: '1', Name: 'In Progress' },
        { Id: '2', Name: 'Completed' },
        { Id: '3', Name: 'Not Started' },
        { Id: '4', Name: 'Delayed' },
    ];

    return (
        <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <Badge variant={
                        project.StatusId === '2' ? 'default' : 
                        project.StatusId === '4' ? 'destructive' : 'secondary'
                    }
                    className={project.StatusId === '2' ? 'bg-green-600' : ''}
                    >
                        {projectStatuses.find(s => s.Id === project.StatusId)?.Name || 'N/A'}
                    </Badge>
                    <h1 className="font-headline text-4xl font-bold tracking-tight mt-2">{project.Name}</h1>
                    <p className="text-muted-foreground mt-1 max-w-3xl">{project.Description || ''}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {project.StartDate && (
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>Start: {format(parseISO(project.StartDate), 'MMM d, yyyy')}</span>
                        </div>
                    )}
                    {project.EndDate && (
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-destructive" />
                            <span className="font-medium text-foreground">Deadline: {format(parseISO(project.EndDate), 'MMM d, yyyy')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
