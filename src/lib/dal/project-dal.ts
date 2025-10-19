
// DAL (Data Access Layer) for Projects

import { prisma } from '@/lib/prisma';
import type { Project } from '@/lib/types';

// DAL function to get all projects
export async function findManyProjects(): Promise<Project[]> {
  return await prisma.project.findMany();
}

// DAL function to get a single project by its ID
export async function findProjectById(id: string): Promise<Project | null> {
    return await prisma.project.findUnique({
        where: { Id: id },
    });
}
