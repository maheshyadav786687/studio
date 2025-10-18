// BLL (Business Logic Layer) for Projects
'use server';

import { findManyProjects, findProjectById } from '@/lib/database';
import type { Project } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
  const projects = await findManyProjects();
  return projects;
}

export async function getProjectById(id: string): Promise<Project | null> {
    const project = await findProjectById(id);
    if (!project) {
        return null;
    }
    return project;
}