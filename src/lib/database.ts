'use server';

import { contractors, projects } from './data';
import type { Contractor, Project } from './types';
import { PlaceHolderImages } from './placeholder-images';

/**
 * This file simulates a database by providing functions to access and modify mock data.
 * NOTE: Since this is an in-memory "database", changes will be lost on server restart.
 */

// Simulate a database delay
const dbDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

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
    create: async (data: Omit<Contractor, 'id' | 'avatarUrl' | 'performance' | 'phone'>): Promise<Contractor> => {
        await dbDelay(100);
        const newContractor: Contractor = {
            id: `c${contractors.length + 1}`,
            ...data,
            phone: '', // Not collected in form
            performance: Math.floor(Math.random() * 21) + 80, // Random performance
            avatarUrl: `https://picsum.photos/seed/newavatar${contractors.length}/100/100`,
        };
        contractors.unshift(newContractor); // Add to the beginning of the list
        return newContractor;
    }
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
