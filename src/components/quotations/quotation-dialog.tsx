
'use client';

import { useState, useEffect, createContext, useContext, cloneElement } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Quotation, QuotationFormSchema, Site, SiteGroup, Unit, QuotationFormData } from '@/lib/types';
import { createQuotation, getQuotationById, getSitesGroupedByClient, updateQuotation } from '@/lib/bll/quotation-bll';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { useDialog, DialogState } from '@/hooks/use-dialog'; // Import the new hook

// Create a context for the quotation dialog
const QuotationDialogContext = createContext<ReturnType<typeof useDialog<{ quotationId?: string }>> | null>(null);

export function useQuotationDialog() {
  const context = useContext(QuotationDialogContext);
  if (!context) {
    throw new Error('useQuotationDialog must be used within a QuotationDialog');
  }
  return context;
}

export function QuotationDialog({ children }: { children: React.ReactNode }) {
    const dialog = useDialog<{ quotationId?: string }>();
    return (
        <QuotationDialogContext.Provider value={dialog}>
            {children}
            <QuotationDialogContent />
        </QuotationDialogContext.Provider>
    )
}

export function AddQuotationButton() {
    const { show } = useQuotationDialog();
    return (
        <Button size="sm" className="h-8 gap-1" onClick={() => show({})}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Quotation
            </span>
        </Button>
    );
}

function QuotationDialogContent() {
  const { visible, hide, quotationId } = useQuotationDialog();
  const [quotation, setQuotation] = useState<Quotation | undefined>();
  const [siteGroups, setSiteGroups] = useState<SiteGroup[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchQuotation() {
      if (quotationId) {
        const fetchedQuotation = await getQuotationById(quotationId);
        setQuotation(fetchedQuotation);
      }
    }

    if (visible) {
        fetchQuotation();
    }
  }, [visible, quotationId]);

  const defaultValues = quotation
    ? {
        ...quotation,
        Description: quotation.Description || '',
        SiteId: quotation.SiteId || '',
        items: (quotation.items || []).map(item => ({
            ...item,
            Description: item.Description || '',
            UnitId: item.UnitId || null,
            Quantity: item.Quantity || null,
            Rate: item.Rate || null,
            Area: item.Area || null,
            IsWithMaterial: item.IsWithMaterial || false,
        })),
      }
    : {
        Description: '',
        SiteId: '',
        items: [],
      };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<QuotationFormData>({
    resolver: zodResolver(QuotationFormSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    async function fetchSites() {
      try {
        const fetchedSiteGroups = await getSitesGroupedByClient();
        setSiteGroups(fetchedSiteGroups);
      } catch (error) {
        console.error('Failed to fetch sites', error);
      }
    }
    async function fetchUnits() {
        try {
          const response = await fetch('/api/units');
          if (!response.ok) {
            throw new Error('Failed to fetch units');
          }
          const fetchedUnits = await response.json();
          setUnits(fetchedUnits);
        } catch (error) {
          console.error('Failed to fetch units', error);
        }
      }
    if (visible) {
      fetchSites();
      fetchUnits();
      if(quotationId && quotation) {
          reset(defaultValues)
      } else {
          reset()
      }
    }
  }, [visible, quotationId, quotation, reset, defaultValues]);
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      hide();
    }
  };
  
  async function onSubmit(data: QuotationFormData) {
    try {
      if (quotation) {
        await updateQuotation(quotation.Id, data);
      } else {
        await createQuotation(data);
      }
      
      toast({
        title: 'Success',
        description: `Quotation ${quotation ? 'updated' : 'created'} successfully.`,
      });

      router.refresh();
      handleOpenChange(false);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save quotation.',
        variant: 'destructive',
      });
    }
  }

  const watchedItems = watch('items');
  const totalAmount = watchedItems ? watchedItems.reduce((acc: number, item: any) => {
      const quantity = item.Quantity || 0;
      const rate = item.Rate || 0;
      const area = item.Area || 0;
      const itemAmount = area > 0 ? quantity * rate * area : quantity * rate;
      return acc + itemAmount;
  }, 0) : 0;


  return (
    <Dialog open={visible} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{quotation ? `Edit Quotation - ${quotation.Description}` : 'Add New Quotation'}</DialogTitle>
            <DialogDescription>
              {quotation ? 'Update the details for this quotation.' : 'Enter the details for the new quotation.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="Description">Title</Label>
                    <Input id="Description" {...register('Description')} />
                    {errors.Description && <p className="text-xs text-red-500">{errors.Description.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="SiteId">Site</Label>
                    <Controller
                        control={control}
                        name="SiteId"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a site" />
                                </SelectTrigger>
                                <SelectContent>
                                    {siteGroups.map((group) => (
                                        <SelectGroup key={group.clientName}>
                                            <SelectLabel>{group.clientName}</SelectLabel>
                                            {group.sites.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.SiteId && <p className="text-xs text-red-500">{errors.SiteId.message}</p>}
                </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Items</Label>
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const item = watchedItems?.[index];
                  const quantity = item?.Quantity || 0;
                  const rate = item?.Rate || 0;
                  const area = item?.Area || 0;
                  const amount = area > 0 ? quantity * rate * area : quantity * rate;

                  return (
                  <div key={field.id} className="grid grid-cols-[2fr_0.8fr_1fr_1.2fr_1fr_0.5fr_1fr_auto] gap-4 items-center p-2 border rounded-md">
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.Description`} className="text-xs">Description</Label>
                        <Textarea
                            id={`items.${index}.Description`}
                            placeholder="Item description"
                            {...register(`items.${index}.Description`)}
                            className="min-h-[40px]"
                        />
                         {errors.items?.[index]?.Description && <p className="text-xs text-red-500">{errors.items?.[index]?.Description?.message}</p>}
                    </div>
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.Quantity`} className="text-xs">Quantity</Label>
                        <Input
                            id={`items.${index}.Quantity`}
                            type="number"
                            placeholder="0"
                            {...register(`items.${index}.Quantity`, { valueAsNumber: true })}
                        />
                         {errors.items?.[index]?.Quantity && <p className="text-xs text-red-500">{errors.items?.[index]?.Quantity?.message}</p>}
                    </div>
                     <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.Area`} className="text-xs">Area per Qty</Label>
                        <Input
                            id={`items.${index}.Area`}
                            type="number"
                            placeholder="0.00"
                            {...register(`items.${index}.Area`, { valueAsNumber: true })}
                        />
                         {errors.items?.[index]?.Area && <p className="text-xs text-red-500">{errors.items?.[index]?.Area?.message}</p>}
                    </div>
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.UnitId`} className="text-xs">Unit</Label>
                        <Controller
                            control={control}
                            name={`items.${index}.UnitId`}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.Id} value={unit.Id}>{unit.Name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.Rate`} className="text-xs">Rate</Label>
                        <Input
                            id={`items.${index}.Rate`}
                            type="number"
                            placeholder="0.00"
                            {...register(`items.${index}.Rate`, { valueAsNumber: true })}
                        />
                         {errors.items?.[index]?.Rate && <p className="text-xs text-red-500">{errors.items?.[index]?.Rate?.message}</p>}
                    </div>
                    <div className="space-y-1 flex flex-col items-center justify-start h-full pt-1.5">
                        <Label htmlFor={`items.${index}.IsWithMaterial`} className="text-xs mb-2">Material</Label>
                        <Controller
                            control={control}
                            name={`items.${index}.IsWithMaterial`}
                            render={({ field }) => (
                                <Checkbox
                                    id={`items.${index}.IsWithMaterial`}
                                    checked={field.value ?? false}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-1 self-start">
                         <Label className="text-xs text-right block">Amount</Label>
                         <p className="h-10 flex items-center justify-end px-3 font-medium">
                            {amount.toFixed(2)}
                         </p>
                    </div>
                    <div className="flex items-center h-full">
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive"
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                )})}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ Description: '', UnitId: units[0]?.Id || '', Quantity: 1, Rate: 0, Area: 0, IsWithMaterial: true })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <div className="flex justify-end items-center gap-4 mt-4 p-4 bg-muted rounded-md">
                <span className="font-semibold text-lg">Total Amount:</span>
                <span className="font-bold text-xl text-primary">₹{totalAmount.toFixed(2)}</span>
            </div>

          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
