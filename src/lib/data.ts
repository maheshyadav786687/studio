import type { Project } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Corporate Website Redesign',
    description: 'A complete overhaul of the corporate website to improve user experience and modernize the design.',
    startDate: '2024-05-01',
    deadline: '2024-08-31',
    cost: 500000,
    status: 'In Progress',
    contractorIds: ['c2', 'c4'],
    imageUrl: getImageUrl('project1'),
    tasks: [
      { id: 't1-1', title: 'Initial Design Mockups', description: 'Create wireframes and high-fidelity mockups.', status: 'Done', assigneeId: 'c4' },
      { id: 't1-2', title: 'Frontend Development', description: 'Implement the new design using React.', status: 'In Progress', assigneeId: 'c2' },
      { id: 't1-3', title: 'Backend API Integration', description: 'Connect the frontend to the CMS.', status: 'To-do', assigneeId: 'c2' },
    ],
    updates: [
      {
        id: 'u1-1',
        date: '2024-07-20T10:00:00Z',
        author: 'Rohan Verma',
        authorAvatar: getImageUrl('avatar2'),
        content: 'This week, I focused on building out the main components for the homepage. The hero section, features list, and testimonials are all complete and responsive. I encountered a small issue with the state management for the dynamic content section, but after consulting with Sameer, we decided to use a simplified context provider which resolved the problem. Next week, I plan to tackle the product pages and begin integrating the content from the CMS. Blockers: None at the moment. The project is on track.',
        summary: 'Completed homepage components (Hero, Features, Testimonials). Resolved a state management issue. Next up: Product pages and CMS integration. No blockers, project on schedule.'
      }
    ],
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'A new cross-platform mobile application for task management.',
    startDate: '2024-06-15',
    deadline: '2024-12-15',
    cost: 1200000,
    status: 'In Progress',
    contractorIds: ['c1'],
    imageUrl: getImageUrl('project2'),
    tasks: [
      { id: 't2-1', title: 'Setup CI/CD Pipeline', description: 'Configure automated build and deployment.', status: 'Done', assigneeId: 'c1' },
      { id: 't2-2', title: 'Implement User Authentication', description: 'Build login and registration screens.', status: 'In Progress', assigneeId: 'c1' },
      { id: 't2-3', title: 'Develop Dashboard UI', description: 'Create the main dashboard interface.', status: 'To-do', assigneeId: 'c1' },
    ],
    updates: [],
  },
  {
    id: 'p3',
    name: 'E-commerce Platform',
    description: 'Building a scalable e-commerce platform with advanced features.',
    startDate: '2024-07-01',
    deadline: '2025-01-31',
    cost: 2500000,
    status: 'Not Started',
    contractorIds: ['c3'],
    imageUrl: getImageUrl('project3'),
    tasks: [
      { id: 't3-1', title: 'Requirement Gathering', description: 'Finalize features with stakeholders.', status: 'To-do' },
    ],
    updates: [],
  },
  {
    id: 'p4',
    name: 'Internal CRM Tool',
    description: 'An internal tool for customer relationship management.',
    startDate: '2024-03-01',
    deadline: '2024-07-30',
    cost: 800000,
    status: 'Completed',
    contractorIds: [],
    imageUrl: 'https://picsum.photos/seed/project4/600/400',
    tasks: [],
    updates: [],
  },
];
