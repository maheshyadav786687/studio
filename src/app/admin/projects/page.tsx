import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/projects/project-card"
import { db } from "@/lib/database"
import type { Project } from "@/lib/types";

export default async function ProjectsPage() {
  // BLL/Application layer fetching data via the DAL
  const projects: Project[] = await db.projects.findMany();

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {projects.length === 0 && (
            <p className="text-muted-foreground col-span-full">No projects found.</p>
        )}
      </div>
    </div>
  )
}