'use server';

import { contractors, projects } from './data';
import type { Contractor, Project } from './types';

/**
 * This file simulates a database by providing functions to access the mock data.
 */

// Simulate a database delay
const dbDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  contractors: {
    findMany: async (): Promise<Contractor[]> => {
      await dbDelay(100);
      return contractors;
    },
    findById: async (id: string): Promise<Contractor | undefined> => {
      await dbDelay(100);
      return contractors.find(c => c.id === id);
    },
  },
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
