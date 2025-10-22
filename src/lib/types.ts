
import { z } from 'zod';

//============================================================================
// GENERIC TYPES
//============================================================================

export const StatusSchema = z.object({
  Id: z.string(),
  Name: z.string(),
  Color: z.string().nullable(),
});
export type Status = z.infer<typeof StatusSchema>;

export const UnitSchema = z.object({
    Id: z.string(),
    Name: z.string(),
    Description: z.string().optional(),
});
export type Unit = z.infer<typeof UnitSchema>;


//============================================================================
// COMPANY
//============================================================================

export const CompanySchema = z.object({
    Id: z.string(),
    Name: z.string(),
    ContactPerson: z.string().optional(),
    Email: z.string().email(),
    Phone: z.string().optional(),
    LogoUrl: z.string().url().optional(),
  });
  export type Company = z.infer<typeof CompanySchema>;
  

//============================================================================
// CLIENT
//============================================================================

export const ClientSchema = z.object({
  Id: z.string(),
  Name: z.string().min(2, 'Name must be at least 2 characters.'),
  Email: z.string().email('Invalid email address.').nullable(),
  Phone: z.string().min(10, 'Phone number must be at least 10 digits.').nullable(),
  Address: z.string().min(5, 'Address must be at least 5 characters.').nullable(),
  CompanyId: z.string(),
  StatusId: z.string().nullable(),
  projectsCount: z.number().int().optional(),
  sitesCount: z.number().int().optional(),
});
export type Client = z.infer<typeof ClientSchema>;

export const ClientFormSchema = ClientSchema.omit({ 
    Id: true, 
    CompanyId: true, 
    StatusId: true, 
    projectsCount: true, 
    sitesCount: true 
});
export type ClientFormData = z.infer<typeof ClientFormSchema>;


//============================================================================
// SITE
//============================================================================

export const SiteSchema = z.object({
    Id: z.string(),
    Name: z.string().min(2, 'Site name must be at least 2 characters.'),
    Location: z.string().min(5, 'Location must be at least 5 characters.').nullable(),
    ClientId: z.string({ required_error: 'Client is required.' }),
    CompanyId: z.string(),
    StatusId: z.string().nullable(),
    Client: ClientSchema.optional(),
    projectsCount: z.number().int().optional(),
    quotationsCount: z.number().int().optional(),
  });
export type Site = z.infer<typeof SiteSchema>;

export type SiteGroup = {
    clientName: string;
    sites: { id: string; name: string }[];
};

export const SiteFormSchema = SiteSchema.omit({ 
    Id: true, 
    CompanyId: true, 
    StatusId: true, 
    Client: true, 
    projectsCount: true, 
    quotationsCount: true 
});
export type SiteFormData = z.infer<typeof SiteFormSchema>;

//============================================================================
// PROJECT
//============================================================================

export const SubtaskSchema = z.object({
  Id: z.string(),
  TaskId: z.string(),
  Description: z.string(),
  IsCompleted: z.boolean(),
  CompanyId: z.string(),
  StatusId: z.string(),
});
export type Subtask = z.infer<typeof SubtaskSchema>;

export const TaskSchema = z.object({
  Id: z.string(),
  ProjectId: z.string(),
  Description: z.string(),
  StartDate: z.string().optional(),
  EndDate: z.string().optional(),
  AssigneeId: z.string().optional(),
  CompanyId: z.string(),
  StatusId: z.string(),
  subtasks: z.array(SubtaskSchema).optional(),
});
export type Task = z.infer<typeof TaskSchema>;

export const ProjectUpdateSchema = z.object({
  Id: z.string(),
  ProjectId: z.string(),
  UpdateContent: z.string(),
  Summary: z.string().optional(),
  CreatedOn: z.string(),
  CreatedBy: z.string(),
  CompanyId: z.string(),
});
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

export const ProjectSchema = z.object({
  Id: z.string(),
  Name: z.string(),
  Description: z.string().nullable(),
  SiteId: z.string().nullable(), 
  ClientId: z.string().nullable(), 
  CompanyId: z.string(),
  StatusId: z.string().nullable(),
  StartDate: z.string().nullable(),
  EndDate: z.string().nullable(),
  tasks: z.array(TaskSchema).optional(),
  updates: z.array(ProjectUpdateSchema).optional(),
  quotationsCount: z.number().int().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

//============================================================================
// QUOTATION ITEM
//============================================================================

export const QuotationItemSchema = z.object({
    Id: z.string(),
    Description: z.string().min(2, 'Description must be at least 2 characters.'),
    Quantity: z.number().default(1),
    AreaPerQuantity: z.number().default(0),
    Rate: z.number().default(0),
    TotalAmount: z.number(),
    IsWithMaterial: z.boolean().default(false),
    UnitId: z.string().nullable(),
    QuotationId: z.string(),
    CompanyId: z.string(),
    StatusId: z.string().nullable(),
});
export type QuotationItem = z.infer<typeof QuotationItemSchema>;

export const QuotationItemFormSchema = QuotationItemSchema.pick({
    Description: true,
    Quantity: true,
    Rate: true,
    AreaPerQuantity: true,
    IsWithMaterial: true,
    UnitId: true,
}).extend({
    Description: z.string().min(2, 'Description must be at least 2 characters.'),
    Quantity: z.coerce.number().default(1),
    Rate: z.coerce.number().default(0),
    AreaPerQuantity: z.coerce.number().default(0),
});
export type QuotationItemFormData = z.infer<typeof QuotationItemFormSchema>;


//============================================================================
// QUOTATION
//============================================================================

export const QuotationSchema = z.object({
  Id: z.string(),
  Title: z.string().min(2, 'Title must be at least 2 characters.'),
  QuotationDate: z.date(),
  Description: z.string().min(5, 'Description must be at least 5 characters.').nullable(),
  TotalAmount: z.number().default(0),
  SiteId: z.string({ required_error: 'Site is required.' }),
  CompanyId: z.string(),
  StatusId: z.string().nullable(),
  Site: SiteSchema.optional(),
  Status: StatusSchema.optional(),
  projectName: z.string().optional(),
  siteName: z.string().optional(),
  statusName: z.string().optional(),
  statusColor: z.string().optional(),
  QuotationItems: z.array(QuotationItemSchema).optional(),
});
export type Quotation = z.infer<typeof QuotationSchema>;

export const QuotationFormSchema = QuotationSchema.pick({
    Title: true,
    Description: true,
    SiteId: true,
    QuotationDate: true,
}).extend({
    quotationItems: z.array(QuotationItemFormSchema).optional()
});
export type QuotationFormData = z.infer<typeof QuotationFormSchema>;
