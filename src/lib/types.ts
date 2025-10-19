
import { z } from 'zod';

//============================================================================
// GENERIC TYPES
//============================================================================

export const StatusSchema = z.object({
  Id: z.string(),
  Name: z.string(),
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
    client: ClientSchema.optional(),
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
    client: true, 
    projectsCount: true, 
    quotationsCount: true 
});
export type SiteFormData = z.infer<typeof SiteFormSchema>;


//============================================================================
// QUOTATION
//============================================================================

export const QuotationItemSchema = z.object({
    Id: z.string(),
    QuotationId: z.string(),
    Description: z.string().min(1, 'Description is required.'),
    Quantity: z.number().min(0, 'Quantity must be positive.').nullable(),
    UnitId: z.string().nullable(),
    Rate: z.number().min(0, 'Rate must be positive.').nullable(),
    Amount: z.number().optional().nullable(),
    TotalAmount: z.number().optional().nullable(),
    Area: z.number().min(0, 'Area must be positive.').optional().nullable(),
    IsWithMaterial: z.boolean().nullable(),
    CompanyId: z.string(),
    StatusId: z.string().nullable(),
  });
  export type QuotationItem = z.infer<typeof QuotationItemSchema>;
  
  export const QuotationSchema = z.object({
    Id: z.string(),
    Amount: z.number(),
    Description: z.string().min(3, 'Description must be at least 3 characters.').nullable(),
    SiteId: z.string({ required_error: 'Site is required.' }).nullable(),
    ClientId: z.string(),
    CompanyId: z.string(),
    StatusId: z.string().nullable(),
    CreatedOn: z.date(),
    CreatedBy: z.string().nullable(),
    ModifiedOn: z.date().optional().nullable(),
    ModifiedBy: z.string().optional().nullable(),
    siteName: z.string().optional(), // Populated from DB join
    clientName: z.string().optional(), // Populated from DB join
    items: z.array(QuotationItemSchema).optional(),
    Site: SiteSchema.optional(),
    Client: ClientSchema.optional(),
    QuotationItems: z.array(QuotationItemSchema).optional(),
  });
  export type Quotation = z.infer<typeof QuotationSchema>;
  
  const FormQuotationItemSchema = QuotationItemSchema.omit({ 
      Id: true, 
      QuotationId: true,
      Amount: true,
      CompanyId: true,
      StatusId: true
    });
  
  export const QuotationFormSchema = QuotationSchema.omit({ 
      Id: true, 
      Amount: true, 
      ClientId: true,
      CompanyId: true, 
      StatusId: true,
      CreatedOn: true,
      CreatedBy: true,
      ModifiedOn: true,
      ModifiedBy: true,
      siteName: true,
      clientName: true,
      Site: true,
      Client: true,
      QuotationItems: true,
      items: true,
  }).extend({
      items: z.array(FormQuotationItemSchema).optional(),
      Description: z.string().min(3, 'Description must be at least 3 characters.'),
      SiteId: z.string({ required_error: 'Site is required.' }),
  });
  export type QuotationFormData = z.infer<typeof QuotationFormSchema>;


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
  });
  export type Project = z.infer<typeof ProjectSchema>;

