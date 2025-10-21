
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { Quotation, Site, Project, Unit } from '@/lib/types';
import { QuotationFormSchema, QuotationFormData } from '@/lib/types';
import { QuotationItemBlock } from './quotation-item-block';

interface QuotationFormProps {
  quotation?: Quotation;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function QuotationForm({ quotation, children, open, onOpenChange }: QuotationFormProps) {
  const [sites, setSites] = React.useState<Site[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);

  const router = useRouter();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<QuotationFormData>({
    resolver: zodResolver(QuotationFormSchema),
    defaultValues: {
      Description: quotation?.Description || '',
      SiteId: quotation?.SiteId || '',
      items: quotation?.QuotationItems || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  React.useEffect(() => {
    if (quotation) {
      reset({
        Description: quotation.Description || '',
        SiteId: quotation.SiteId,
        items: quotation.QuotationItems || [],
      });
    } else {
      reset({
        Description: '',
        SiteId: '',
        items: [],
      });
    }
  }, [quotation, reset]);

  React.useEffect(() => {
    async function fetchData() {
      const [sitesRes, projectsRes, unitsRes] = await Promise.all([
        fetch('/api/sites?all=true'),
        fetch('/api/projects'),
        fetch('/api/units'),
      ]);
      const [sitesData, projectsData, unitsData] = await Promise.all([
        sitesRes.json(),
        projectsRes.json(),
        unitsRes.json(),
      ]);
      setSites(sitesData.sites);
      setProjects(projectsData);
      setUnits(unitsData);
    }
    fetchData();
  }, []);

  const onSubmit = async (data: QuotationFormData) => {
    const processedData = {
      ...data,
      items: data.items.map(item => ({
        ...item,
        Amount: ((item.Area || 0) > 0 ? (item.Area || 0) : (item.Quantity || 0)) * (item.Rate || 0),
      })),
    };

    try {
      const url = quotation ? `/api/quotations/${quotation.Id}` : '/api/quotations';
      const method = quotation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
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

  const totalAmount = watchedItems.reduce((acc, item) => {
    const itemAmount = ((item.Area || 0) > 0 ? (item.Area || 0) : (item.Quantity || 0)) * (item.Rate || 0);
    return acc + itemAmount;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl bg-white">
        <DialogHeader>
          <DialogTitle>{quotation ? 'Edit Quotation' : 'Add Quotation'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-12 gap-4 px-2">
            <div className="col-span-8">
                <Label htmlFor="Description">Description</Label>
                <Textarea id="Description" {...register('Description')} className="mt-2 min-h-[15px]" />
                {errors.Description && <p className="text-red-500 text-xs">{errors.Description.message}</p>}
            </div>
            <div className="col-span-4">
                <Label htmlFor="SiteId">Site</Label>
                <Controller
                    control={control}
                    name="SiteId"
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-2">
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
                    )}
                />
                {errors.SiteId && <p className="text-red-500 text-xs">{errors.SiteId.message}</p>}
            </div>
        </div>

          <div className="p-2 border rounded-md">
            <h3 className="text-lg font-medium mb-2">Quotation Items</h3>
            <div className="grid grid-cols-12 gap-2 p-2 font-bold border-b">
                <div className="col-span-3"><Label>Description</Label></div>
                <div className="col-span-1"><Label>With Material</Label></div>
                <div className="col-span-1"><Label>Qty</Label></div>
                <div className="col-span-1"><Label>Area</Label></div>
                <div className="col-span-2"><Label>Unit</Label></div>
                <div className="col-span-1"><Label>Rate</Label></div>
                <div className="col-span-2 text-right"><Label>Amount</Label></div>
                <div className="col-span-1"><Label>Actions</Label></div>
            </div>
            <div className="grid gap-2 max-h-96 overflow-y-auto pr-2 pt-2">
            {fields.map((field, index) => (
                <QuotationItemBlock
                key={field.id}
                index={index}
                control={control}
                register={register}
                remove={remove}
                units={units}
                watchedItem={watchedItems[index]}
                />
            ))}
            </div>
            <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => append({ Description: '', UnitId: '', Quantity: 0, Rate: 0, Area: 0, IsWithMaterial: false, Amount: 0 })}
            >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
            </Button>
          </div>
          <div className="text-lg font-bold text-right pr-4">
            Total: ${totalAmount.toFixed(2)}
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
