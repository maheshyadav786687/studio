export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'To-do' | 'In Progress' | 'Done';
  assigneeId?: string;
};

export type ProjectUpdate = {
  id: string;
  date: string;
  content: string;
  summary?: string;
  author: string;
  authorAvatar: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  cost: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  clientId: string;
  tasks: Task[];
  updates: ProjectUpdate[];
  imageUrl: string;
};
