export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatarUrl: string;
  projectsCount: number;
  status: 'Active' | 'Inactive';
};
