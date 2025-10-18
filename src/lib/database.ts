'use server';

import { projects as mockProjects } from './data';
import type { Project } from './types';
import { PlaceHolderImages } from './placeholder-images';

/**
 * This file simulates a database by providing functions to access and modify mock data.
 * NOTE: Since this is an in-memory "database", changes will be lost on server restart.
 */

// Simulate a database delay
const dbDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

// Re-map projects to ensure they have the correct shape after type changes
const projects: Project[] = mockProjects.map(p => ({...p}));


export const db = {
  projects: {
    findMany: async (): Promise<Project[]> => {
      await dbDelay(100);
      return projects;
    },
    findById: async (id: string): Promise<Project | undefined> => {
      await dbDelay(100);
      return projects.find(p => p.id === id);
    },
  },
};
