
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { Quotation, Site, Project, Unit } from '@/lib/types';

const formSchema = z.object({
  Description: z.string().min(1, 'Description is required'),
  Amount: z.number().min(0, 'Amount must be a positive number'),
  SiteId: z.string().min(1, 'Site is required'),
  ProjectId: z.string().optional(),
  items: z.array(
    z.object({
      Description: z.string().min(1, 'Item description is required'),
      UnitId: z.string().min(1, 'Unit is required'),
      Quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
      Price: z.number().min(0.01, 'Price must be greater than 0'),
    })
  ),
});

interface QuotationDialogProps {
  quotation?: Quotation;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function QuotationDialog({ quotation, children, open, onOpenChange }: QuotationDialogProps) {
  const [sites, setSites] = React.useState<Site[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);

  const router = useRouter();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Description: quotation?.Description || '',
      Amount: quotation?.Amount || 0,
      SiteId: quotation?.SiteId || '',
      ProjectId: quotation?.ProjectId || '',
      items: quotation?.items || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  React.useEffect(() => {
    if (quotation) {
      reset({
        Description: quotation.Description,
        Amount: quotation.Amount,
        SiteId: quotation.SiteId,
        ProjectId: quotation.ProjectId,
        items: quotation.items || [],
      });
    } else {
      reset({
        Description: '',
        Amount: 0,
        SiteId: '',
        ProjectId: '',
        items: [],
      });
    }
  }, [quotation, reset]);

  React.useEffect(() => {
    async function fetchData() {
      const [sitesRes, projectsRes, unitsRes] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/projects'),
        fetch('/api/units'),
      ]);
      const [sitesData, projectsData, unitsData] = await Promise.all([
        sitesRes.json(),
        projectsRes.json(),
        unitsRes.json(),
      ]);
      setSites(sitesData);
      setProjects(projectsData);
      setUnits(unitsData);
    }
    fetchData();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = quotation ? `/api/quotations/${quotation.Id}` : '/api/quotations';
      const method = quotation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save quotation');
      }

      onOpenChange?.(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{quotation ? 'Edit Quotation' : 'Add Quotation'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Description" className="text-right">
              Description
            </Label>
            <Textarea id="Description" {...register('Description')} className="col-span-3" />
            {errors.Description && <p className="col-span-4 text-red-500 text-xs">{errors.Description.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Amount" className="text-right">
              Amount
            </Label>
            <Input id="Amount" type="number" {...register('Amount', { valueAsNumber: true })} className="col-span-3" />
            {errors.Amount && <p className="col-span-4 text-red-500 text-xs">{errors.Amount.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="SiteId" className="text-right">
              Site
            </Label>
            <Select {...register('SiteId')} >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.Id} value={site.Id}>
                    {site.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.SiteId && <p className="col-span-4 text-red-500 text-xs">{errors.SiteId.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ProjectId" className="text-right">
              Project
            </Label>
            <Select {...register('ProjectId')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.Id} value={project.Id}>
                    {project.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-4">
            <h3 className="text-lg font-medium">Items</h3>
            <div className="grid gap-4 mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Input {...register(`items.${index}.Description`)} placeholder="Description" />
                  </div>
                  <div className="col-span-2">
                    <Select {...register(`items.${index}.UnitId`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.Id} value={unit.Id}>
                            {unit.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input type="number" {...register(`items.${index}.Quantity`, { valueAsNumber: true })} placeholder="Quantity" />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" {...register(`items.${index}.Price`, { valueAsNumber: true })} placeholder="Price" />
                  </div>
                  <div className="col-span-2 text-right">
                    <Button variant="destructive" size="sm" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ Description: '', UnitId: '', Quantity: 0, Price: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
