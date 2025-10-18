'use server';

// DAL (Data Access Layer)
// This layer is responsible for all communication with the database.
// It should only be called by the BLL.

import { projects as mockProjects } from './data';
import type { Project, Client } from './types';
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

const clients: Client[] = [
    {
        id: 'cl1',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '9876543210',
        company: 'Innovate Solutions',
        avatarUrl: getImageUrl('avatar3'),
        projectsCount: 2,
        status: 'Active',
    },
    {
        id: 'cl2',
        name: 'Amit Singh',
        email: 'amit.singh@example.com',
        phone: '9876543211',
        company: 'TechCorp',
        avatarUrl: getImageUrl('avatar4'),
        projectsCount: 1,
        status: 'Active',
    },
    {
        id: 'cl3',
        name: 'Sunita Devi',
        email: 'sunita.devi@example.com',
        phone: '9876543212',
        company: 'BuildRight',
        avatarUrl: getImageUrl('avatar1'),
        projectsCount: 0,
        status: 'Inactive',
    },
];

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
  clients: {
    findMany: async (): Promise<Client[]> => {
        await dbDelay(50);
        return clients;
    },
    findByEmail: async(email: string): Promise<Client | undefined> => {
        await dbDelay(50);
        return clients.find(c => c.email.toLowerCase() === email.toLowerCase());
    },
    create: async (clientData: Omit<Client, 'id' | 'avatarUrl' | 'projectsCount'>): Promise<Client> => {
        await dbDelay(100);
        const newClient: Client = {
            ...clientData,
            id: `cl${Date.now()}`,
            avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
            projectsCount: 0,
        };
        clients.unshift(newClient); // Add to the beginning of the array
        return newClient;
    },
    update: async (id: string, clientData: Partial<Omit<Client, 'id' | 'avatarUrl' | 'projectsCount'>>): Promise<Client | undefined> => {
        await dbDelay(100);
        const clientIndex = clients.findIndex(c => c.id === id);
        if (clientIndex === -1) {
            return undefined;
        }
        clients[clientIndex] = { ...clients[clientIndex], ...clientData };
        return clients[clientIndex];
    },
    delete: async (id: string): Promise<void> => {
        await dbDelay(100);
        const clientIndex = clients.findIndex(c => c.id === id);
        if (clientIndex !== -1) {
            clients.splice(clientIndex, 1);
        }
    }
  }
};