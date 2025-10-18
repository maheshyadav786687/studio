
'use client';

import { useState, useEffect } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Quotation, QuotationFormSchema, Site, units } from '@/lib/types';
import { createQuotation, updateQuotation } from '@/lib/services/quotation-api-service';
import { getSitesGroupedByClient } from '@/lib/services/site-api-service';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';

type SiteGroup = {
    clientName: string;
    sites: { id: string; name: string }[];
};

type QuotationDialogProps = {
  quotation?: Quotation;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

type QuotationFormData = z.infer<typeof QuotationFormSchema>;

export function QuotationDialog({ quotation, children, onOpenChange, open: parentOpen }: QuotationDialogProps) {
  const [open, setOpen] = useState(false);
  const [siteGroups, setSiteGroups] = useState<SiteGroup[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<QuotationFormData>({
    resolver: zodResolver(QuotationFormSchema),
    defaultValues: quotation ? 
    { ...quotation, items: quotation.items || [], quotationDate: new Date(quotation.quotationDate) } :
    {
      title: '',
      siteId: '',
      status: 'Draft',
      items: [],
      quotationDate: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const currentOpen = parentOpen !== undefined ? parentOpen : open;

  useEffect(() => {
    async function fetchSites() {
      try {
        const fetchedSiteGroups = await getSitesGroupedByClient();
        setSiteGroups(fetchedSiteGroups);
      } catch (error) {
        console.error('Failed to fetch sites', error);
      }
    }
    if (currentOpen) {
      fetchSites();
    }
  }, [currentOpen]);
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    setOpen(isOpen);
    if (onOpenChange) onOpenChange(isOpen);
  };
  
  async function onSubmit(data: QuotationFormData) {
    try {
      if (quotation) {
        await updateQuotation(quotation.id, data);
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
  const totalAmount = watchedItems.reduce((acc, item) => {
      const quantity = item.quantity || 0;
      const rate = item.rate || 0;
      const area = item.area || 0;
      const itemAmount = area > 0 ? quantity * rate * area : quantity * rate;
      return acc + itemAmount;
  }, 0);


  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{quotation ? `Edit Quotation - ${quotation.quotationNumber}` : 'Add New Quotation'}</DialogTitle>
            <DialogDescription>
              {quotation ? 'Update the details for this quotation.' : 'Enter the details for the new quotation.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="siteId">Site</Label>
                    <Controller
                        control={control}
                        name="siteId"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    {errors.siteId && <p className="text-xs text-red-500">{errors.siteId.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="quotationDate">Quotation Date</Label>
                     <Controller
                        name="quotationDate"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.quotationDate && <p className="text-xs text-red-500">{errors.quotationDate.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Draft" id="s-draft" /><Label htmlFor="s-draft">Draft</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Sent" id="s-sent" /><Label htmlFor="s-sent">Sent</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Approved" id="s-approved" /><Label htmlFor="s-approved">Approved</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Rejected" id="s-rejected" /><Label htmlFor="s-rejected">Rejected</Label></div>
                    </RadioGroup>
                    )}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Items</Label>
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const item = watchedItems[index];
                  const quantity = item?.quantity || 0;
                  const rate = item?.rate || 0;
                  const area = item?.area || 0;
                  const amount = area > 0 ? quantity * rate * area : quantity * rate;

                  return (
                  <div key={field.id} className="grid grid-cols-[2fr_0.8fr_1fr_1.2fr_1fr_0.5fr_1fr_auto] gap-4 items-center p-2 border rounded-md">
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.description`} className="text-xs">Description</Label>
                        <Textarea
                            id={`items.${index}.description`}
                            placeholder="Item description"
                            {...register(`items.${index}.description`)}
                            className="min-h-[40px]"
                        />
                         {errors.items?.[index]?.description && <p className="text-xs text-red-500">{errors.items?.[index]?.description?.message}</p>}
                    </div>
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.quantity`} className="text-xs">Quantity</Label>
                        <Input
                            id={`items.${index}.quantity`}
                            type="number"
                            placeholder="0"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                         {errors.items?.[index]?.quantity && <p className="text-xs text-red-500">{errors.items?.[index]?.quantity?.message}</p>}
                    </div>
                     <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.area`} className="text-xs">Area per Qty</Label>
                        <Input
                            id={`items.${index}.area`}
                            type="number"
                            placeholder="0.00"
                            {...register(`items.${index}.area`, { valueAsNumber: true })}
                        />
                         {errors.items?.[index]?.area && <p className="text-xs text-red-500">{errors.items?.[index]?.area?.message}</p>}
                    </div>
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.unit`} className="text-xs">Unit</Label>
                        <Controller
                            control={control}
                            name={`items.${index}.unit`}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-1 self-start">
                        <Label htmlFor={`items.${index}.rate`} className="text-xs">Rate</Label>
                        <Input
                            id={`items.${index}.rate`}
                            type="number"
                            placeholder="0.00"
                            {...register(`items.${index}.rate`, { valueAsNumber: true })}
                        />
                         {errors.items?.[index]?.rate && <p className="text-xs text-red-500">{errors.items?.[index]?.rate?.message}</p>}
                    </div>
                    <div className="space-y-1 flex flex-col items-center justify-start h-full pt-1.5">
                        <Label htmlFor={`items.${index}.material`} className="text-xs mb-2">Material</Label>
                        <Controller
                            control={control}
                            name={`items.${index}.material`}
                            render={({ field }) => (
                                <Checkbox
                                    id={`items.${index}.material`}
                                    checked={field.value}
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
                onClick={() => append({ description: '', unit: 'Square Feet', quantity: 1, rate: 0, area: 0, material: true, id: `new-${fields.length}` })}
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
