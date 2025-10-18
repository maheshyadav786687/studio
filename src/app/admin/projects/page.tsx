
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/projects/project-card"
import type { Project } from "@/lib/types";

async function getProjects(): Promise<Project[]> {
  // In a real app, you'd fetch from your absolute URL
  // For this demo, we can call the DB directly as a shortcut in server components,
  // but we'll fetch from the API to demonstrate clear layer separation.
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return empty array on error
  }
}


export default async function ProjectsPage() {
  const projects: Project[] = await getProjects();

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
