
import { z } from 'zod';

export const SubtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['To-do', 'In Progress', 'Done']),
});
export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['To-do', 'In Progress', 'Done']),
  assigneeId: z.string().optional(),
  quotationItemId: z.string(), // Belongs to a quotation item
  subtasks: z.array(SubtaskSchema).optional(),
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

export const QuotationItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  rate: z.number(),
  amount: z.number(),
});
export type QuotationItem = z.infer<typeof QuotationItemSchema>;

export const QuotationSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['Draft', 'Sent', 'Approved', 'Rejected']),
  siteId: z.string(),
  items: z.array(QuotationItemSchema),
});
export type Quotation = z.infer<typeof QuotationSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string(),
  deadline: z.string(),
  cost: z.number(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'Delayed']),
  siteId: z.string(), // Projects belong to a site now, not a client directly
  tasks: z.array(TaskSchema),
  updates: z.array(ProjectUpdateSchema),
  imageUrl: z.string(),
  contractorIds: z.array(z.string()),
  approvedQuotationIds: z.array(z.string()), // References to approved quotations
});
export type Project = z.infer<typeof ProjectSchema>;
