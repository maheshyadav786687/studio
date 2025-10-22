
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, TrashIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Quotation, QuotationFormData, QuotationFormSchema, Site, Unit } from '@/lib/types';
import { createQuotation, updateQuotation } from '@/lib/bll/quotation-bll';
import { getSites } from '@/lib/bll/site-bll';
import { getUnits } from '@/lib/bll/unit-bll';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type QuotationDialogProps = {
  quotation?: Quotation;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

interface SiteGroup {
  clientName: string;
  sites: Site[];
}

export function QuotationDialog({ quotation, children, onOpenChange, open: parentOpen }: QuotationDialogProps) {
  const [open, setOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<QuotationFormData>({
    resolver: zodResolver(QuotationFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quotationItems',
  });

  const currentOpen = parentOpen !== undefined ? parentOpen : open;

  const watchedItems = useWatch({ control, name: 'quotationItems' });

  const totalAmount = watchedItems
    ? watchedItems.reduce((acc, item) => {
        const quantity = item.Quantity || 0;
        const rate = item.Rate || 0;
        const area = item.AreaPerQuantity || 1;
        return acc + quantity * rate * area;
      }, 0)
    : 0;

  const groupedSites = sites.reduce((acc, site) => {
    const clientName = site.Client.Name;
    const group = acc.find(g => g.clientName === clientName);
    if (group) {
      group.sites.push(site);
    } else {
      acc.push({ clientName, sites: [site] });
    }
    return acc;
  }, [] as SiteGroup[]);

  useEffect(() => {
    if (currentOpen) {
      const fetchAndInitialize = async () => {
        try {
          const [fetchedSites, fetchedUnits] = await Promise.all([getSites({ all: true, includeClient: true }), getUnits()]);

          const sitesData = Array.isArray(fetchedSites) ? fetchedSites : [];
          const unitsData = Array.isArray(fetchedUnits) ? fetchedUnits : [];
          
          setSites(sitesData);
          setUnits(unitsData);

          const defaultItems = quotation?.quotationItems?.length
            ? quotation.quotationItems
            : [{ Description: '', Quantity: 1, Rate: 0, AreaPerQuantity: 1, IsWithMaterial: true, UnitId: '' }];

          reset({
            Title: quotation?.Title || '',
            Description: quotation?.Description || '',
            SiteId: quotation?.SiteId || '',
            QuotationDate: quotation?.QuotationDate ? new Date(quotation.QuotationDate) : new Date(),
            quotationItems: defaultItems,
          });

        } catch (error) {
          console.error('Failed to fetch data', error);
          setSites([]);
          setUnits([]);
          toast({ title: 'Error', description: 'Failed to load initial data.', variant: 'destructive' });
        }
      };
      fetchAndInitialize();
    } 
  }, [currentOpen, quotation, reset, toast]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (onOpenChange) onOpenChange(isOpen);
    if (!isOpen) {
        reset();
    }
  };

  async function onSubmit(data: QuotationFormData) {
    try {
      const action = quotation ? updateQuotation(quotation.Id, data) : createQuotation(data);
      await action;

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

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-5xl"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-radix-select-content]') || target.closest('[data-radix-popover-content]')) {
            e.preventDefault();
          }
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{quotation ? 'Edit Quotation' : 'Add New Quotation'}</DialogTitle>
            <DialogDescription>
              {quotation ? 'Update the details for this quotation.' : 'Enter the details for the new quotation.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Form Header Fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="QuotationDate" className="text-right">Quotation Date</Label>
              <Controller
                control={control}
                name="QuotationDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn('col-span-3 h-8 justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.QuotationDate && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.QuotationDate.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Title" className="text-right">Title</Label>
              <Input id="Title" {...register('Title')} className="col-span-3 h-8" />
              {errors.Title && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.Title.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="Description" className="text-right pt-2">Description</Label>
              <Textarea id="Description" {...register('Description')} className="col-span-3" rows={3} />
              {errors.Description && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.Description.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="SiteId" className="text-right">Site</Label>
              <Controller
                control={control}
                name="SiteId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger className="col-span-3 h-8">
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupedSites.map(group => (
                        <SelectGroup key={group.clientName}>
                          <SelectLabel>{group.clientName}</SelectLabel>
                          {group.sites.map(site => (
                            <SelectItem key={site.Id} value={site.Id}>{site.Name}</SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.SiteId && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.SiteId.message}</p>}
            </div>

            {/* Quotation Items Section */}
            <div className="space-y-2 pt-4">
              <h4 className="font-semibold">Quotation Items</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px] p-2">Description</TableHead>
                      <TableHead className="w-[90px] p-2 text-center">Material</TableHead>
                      <TableHead className="w-[100px] p-2">Quantity</TableHead>
                      <TableHead className="w-[100px] p-2">Area</TableHead>
                      <TableHead className="w-[130px] p-2">Unit</TableHead>
                      <TableHead className="w-[110px] p-2">Rate</TableHead>
                      <TableHead className="w-[120px] p-2 text-right">Amount</TableHead>
                      <TableHead className="w-[50px] p-2"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => {
                      const quantity = watchedItems?.[index]?.Quantity || 0;
                      const rate = watchedItems?.[index]?.Rate || 0;
                      const area = watchedItems?.[index]?.AreaPerQuantity || 1;
                      const itemTotal = quantity * rate * area;
                      return (
                        <TableRow key={item.id} className="border-b">
                          <TableCell className="p-1">
                            <Input {...register(`quotationItems.${index}.Description`)} placeholder="Item description" className="h-8" />
                          </TableCell>
                          <TableCell className="p-1 text-center">
                            <Controller
                              control={control}
                              name={`quotationItems.${index}.IsWithMaterial`}
                              render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
                            />
                          </TableCell>
                          <TableCell className="p-1">
                            <Input {...register(`quotationItems.${index}.Quantity`, { valueAsNumber: true })} type="number" placeholder="Qty" className="h-8" />
                          </TableCell>
                          <TableCell className="p-1">
                            <Input {...register(`quotationItems.${index}.AreaPerQuantity`, { valueAsNumber: true })} type="number" step="0.01" placeholder="Area" className="h-8" />
                          </TableCell>
                          <TableCell className="p-1">
                            <Controller
                              control={control}
                              name={`quotationItems.${index}.UnitId`}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {units.map((u) => (
                                      <SelectItem key={u.Id} value={u.Id}>{u.Name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </TableCell>
                          <TableCell className="p-1">
                            <Input {...register(`quotationItems.${index}.Rate`, { valueAsNumber: true })} type="number" step="0.01" placeholder="Rate" className="h-8" />
                          </TableCell>
                          <TableCell className="p-1 text-right font-medium">{itemTotal.toFixed(2)}</TableCell>
                          <TableCell className="p-1">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={7} className="p-2 text-right font-semibold">Grand Total</TableCell>
                      <TableCell className="p-2 text-right font-semibold">{totalAmount.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-8 mt-2"
                onClick={() => {
                  const newRow = { Description: '', Quantity: 1, Rate: 0, AreaPerQuantity: 1, IsWithMaterial: true, UnitId: '' };
                  append(newRow);
                }}
              >
                Add Item
              </Button>
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
