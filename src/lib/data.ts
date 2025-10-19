import type { Project } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

// This file now only contains initial data for seeding, it is not used by the running application.
export const projects: Project[] = [
  {
    Id: 'p1',
    Name: 'Corporate Website Redesign',
    Description: 'A complete overhaul of the corporate website to improve user experience and modernize the design.',
    StartDate: '2024-05-01',
    EndDate: '2024-08-31',
    StatusId: '2',
    ClientId: 'cl1',
    tasks: [
      { Id: 't1-1', Description: 'Initial Design Mockups', StatusId: '3' , ProjectId: 'p1', CompanyId: '1'},
      { Id: 't1-2', Description: 'Frontend Development', StatusId: '2', ProjectId: 'p1', CompanyId: '1' },
      { Id: 't1-3', Description: 'Backend API Integration', StatusId: '1', ProjectId: 'p1', CompanyId: '1' },
    ],
    updates: [
      {
        Id: 'u1-1',
        CreatedOn: '2024-07-20T10:00:00Z',
        CreatedBy: 'Rohan Verma',
        UpdateContent: 'This week, I focused on building out the main components for the homepage. The hero section, features list, and testimonials are all complete and responsive. I encountered a small issue with the state management for the dynamic content section, but after consulting with Sameer, we decided to use a simplified context provider which resolved the problem. Next week, I plan to tackle the product pages and begin integrating the content from the CMS. Blockers: None at the moment. The project is on track.',
        Summary: 'Completed homepage components (Hero, Features, Testimonials). Resolved a state management issue. Next up: Product pages and CMS integration. No blockers, project on schedule.',
        ProjectId: 'p1',
        CompanyId: '1',
      }
    ],
    CompanyId: '1',
    SiteId: 's1',
  },
  {
    Id: 'p2',
    Name: 'Mobile App Development',
    Description: 'A new cross-platform mobile application for task management.',
    StartDate: '2024-06-15',
    EndDate: '2024-12-15',
    StatusId: '2',
    ClientId: 'cl2',
    tasks: [
      { Id: 't2-1', Description: 'Setup CI/CD Pipeline', StatusId: '3', ProjectId: 'p2', CompanyId: '1' },
      { Id: 't2-2', Description: 'Implement User Authentication', StatusId: '2', ProjectId: 'p2', CompanyId: '1' },
      { Id: 't2-3', Description: 'Develop Dashboard UI', StatusId: '1', ProjectId: 'p2', CompanyId: '1' },
    ],
    updates: [],
    CompanyId: '1',
    SiteId: 's2',
  },
  {
    Id: 'p3',
    Name: 'E-commerce Platform',
    Description: 'Building a scalable e-commerce platform with advanced features.',
    StartDate: '2024-07-01',
    EndDate: '2025-01-31',
    StatusId: '1',
    ClientId: 'cl1',
    tasks: [
      { Id: 't3-1', Description: 'Requirement Gathering', StatusId: '1', ProjectId: 'p3', CompanyId: '1' },
    ],
    updates: [],
    CompanyId: '1',
    SiteId: 's3',
  },
  {
    Id: 'p4',
    Name: 'Internal CRM Tool',
    Description: 'An internal tool for customer relationship management.',
    StartDate: '2024-03-01',
    EndDate: '2024-07-30',
    StatusId: '3',
    ClientId: 'cl3',
    tasks: [],
    updates: [],
    CompanyId: '1',
    SiteId: 's4',
  },
];
