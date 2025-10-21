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
import { Trash2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { Quotation, Site, Project, Unit } from '@/lib/types';
import { QuotationFormSchema, QuotationFormData } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuotationWizardProps {
  quotation?: Quotation;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const steps = [
    { id: 1, name: 'Quotation Details' },
    { id: 2, name: 'Quotation Items' },
    { id: 3, name: 'Review' },
];
  

export function QuotationWizard({ quotation, children, open, onOpenChange }: QuotationWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [sites, setSites] = React.useState<Site[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);

  const router = useRouter();

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<QuotationFormData>({
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
  const watchedSiteId = watch('SiteId');

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
    // Calculate amount for each item before submitting
    const processedData = {
      ...data,
      items: data.items.map(item => ({
        ...item,
        Amount: (item.Quantity || 0) * (item.Rate || 0),
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

  const totalAmount = watchedItems.reduce((acc, item) => acc + (item.Quantity || 0) * (item.Rate || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{quotation ? 'Edit Quotation' : 'Add Quotation'}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center p-2 border-b">
            <div className="flex items-center gap-4">
                {steps.map(step => (
                    <div key={step.id} className={`flex items-center gap-2 ${currentStep === step.id ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep === step.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {step.id}
                        </div>
                        <span>{step.name}</span>
                    </div>
                ))}
            </div>
            <div className="text-lg font-bold">
              Total: ${totalAmount.toFixed(2)}
            </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="Description" className="text-right">
                    Description
                    </Label>
                    <Textarea id="Description" {...register('Description')} className="col-span-3" />
                    {errors.Description && <p className="col-span-4 text-red-500 text-xs">{errors.Description.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="SiteId" className="text-right">
                    Site
                    </Label>
                    <Controller
                    control={control}
                    name="SiteId"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
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
                    )}
                    />
                    {errors.SiteId && <p className="col-span-4 text-red-500 text-xs">{errors.SiteId.message}</p>}
                </div>
            </div>
          )}

          {currentStep === 2 && (
            <Card>
                <CardHeader>
                <CardTitle>Quotation Items</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground">
                        <div className="col-span-3">Description</div>
                        <div className="col-span-2">Unit</div>
                        <div className="col-span-1">Quantity</div>
                        <div className="col-span-1">Rate</div>
                        <div className="col-span-1">Area</div>
                        <div className="col-span-2">With Material</div>
                        <div className="col-span-1">Amount</div>
                        <div className="col-span-1"></div>
                    </div>
                    {fields.map((field, index) => {
                    const quantity = watch(`items.${index}.Quantity`) || 0;
                    const rate = watch(`items.${index}.Rate`) || 0;
                    const amount = quantity * rate;

                    return (
                        <div key={field.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                            <Input {...register(`items.${index}.Description`)} placeholder="Description" />
                        </div>
                        <div className="col-span-2">
                            <Controller
                            control={control}
                            name={`items.${index}.UnitId`}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
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
                            )}
                            />
                        </div>
                        <div className="col-span-1">
                            <Input type="number" {...register(`items.${index}.Quantity`, { valueAsNumber: true })} placeholder="Qty" />
                        </div>
                        <div className="col-span-1">
                            <Input type="number" {...register(`items.${index}.Rate`, { valueAsNumber: true })} placeholder="Rate" />
                        </div>
                        <div className="col-span-1">
                            <Input type="number" {...register(`items.${index}.Area`, { valueAsNumber: true })} placeholder="Area" />
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Controller
                            control={control}
                            name={`items.${index}.IsWithMaterial`}
                            render={({ field }) => (
                                <Checkbox onCheckedChange={field.onChange} checked={field.value} />
                            )}
                            />
                            <Label htmlFor={`items.${index}.IsWithMaterial`} className="ml-2">Material</Label>
                        </div>
                        <div className="col-span-1 font-medium">
                            ${amount.toFixed(2)}
                        </div>
                        <div className="col-span-1 text-right">
                            <Button variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                    );
                    })}
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
                </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Review Quotation</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex justify-between">
                            <span className="font-medium">Description:</span>
                            <span>{watch('Description')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Site:</span>
                            <span>{sites.find(s => s.Id === watchedSiteId)?.Name}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground">
                            <div className="col-span-4">Description</div>
                            <div className="col-span-2">Unit</div>
                            <div className="col-span-1">Qty</div>
                            <div className="col-span-1">Rate</div>
                            <div className="col-span-1">Area</div>
                            <div className="col-span-2">Material</div>
                            <div className="col-span-1">Amount</div>
                        </div>
                        {watchedItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-4">{item.Description}</div>
                                <div className="col-span-2">{units.find(u => u.Id === item.UnitId)?.Name}</div>
                                <div className="col-span-1">{item.Quantity}</div>
                                <div className="col-span-1">${item.Rate?.toFixed(2)}</div>
                                <div className="col-span-1">{item.Area}</div>
                                <div className="col-span-2">{item.IsWithMaterial ? 'Yes' : 'No'}</div>
                                <div className="col-span-1">${((item.Quantity || 0) * (item.Rate || 0)).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
            </div>
          )}

          <DialogFooter>
            <div className="flex-1" />
            {currentStep > 1 && (
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                </Button>
            )}
            {currentStep < steps.length && (
                <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                    Next
                </Button>
            )}
            {currentStep === steps.length && (
                <Button type="submit">Save</Button>
            )}
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
