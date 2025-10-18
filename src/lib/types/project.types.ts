import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['To-do', 'In Progress', 'Done']),
  assigneeId: z.string().optional(),
});
export type Task = z.infer<typeof TaskSchema>;

export const ProjectUpdateSchema = z.object({
  id: z.string(),
  date: z.string(),
  content: z.string(),
  summary: z.string().optional(),
  author: z.string(),
  authorAvatar: z.string(),
});
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string(),
  deadline: z.string(),
  cost: z.number(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'Delayed']),
  clientId: z.string(),
  tasks: z.array(TaskSchema),
  updates: z.array(ProjectUpdateSchema),
  imageUrl: z.string(),
  contractorIds: z.array(z.string()),
});
export type Project = z.infer<typeof ProjectSchema>;
