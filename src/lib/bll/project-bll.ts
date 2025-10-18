// BLL (Business Logic Layer) for Projects
'use server';

import { db } from '@/lib/database';
import type { Project } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
  const projects = await db.projects.findMany();
  return projects;
}

export async function getProjectById(id: string): Promise<Project | null> {
    const project = await db.projects.findById(id);
    if (!project) {
        return null;
    }
    return project;
}
