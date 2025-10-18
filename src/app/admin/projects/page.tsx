'use client';
import { PlusCircle } from "lucide-react"
import { useProjects } from "@/hooks/use-projects";

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/projects/project-card"
import { Skeleton } from "@/components/ui/skeleton";


export default function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Browse and manage all ongoing and past projects.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Project
            </span>
          </Button>
        </div>
      </div>
       {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-destructive">Failed to load projects.</p>}
      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
