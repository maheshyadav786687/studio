
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Quotation, QuotationFormData, QuotationFormSchema, Site, Unit } from '@/lib/types';
import { createQuotation, updateQuotation, getQuotationById } from '@/lib/bll/quotation-bll';
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

          let currentQuotation = quotation;
          if (quotation?.Id) {
            const fullQuotation = await getQuotationById(quotation.Id);
            if (fullQuotation) {
              currentQuotation = fullQuotation;
            } else {
              toast({ title: 'Error', description: 'Failed to load quotation details.', variant: 'destructive' });
              return;
            }
          }

          const defaultItems = currentQuotation?.QuotationItems?.length
            ? currentQuotation.QuotationItems
            : [{ Description: '', Quantity: 1, Rate: 0, AreaPerQuantity: 1, IsWithMaterial: false, UnitId: '' }];

          reset({
            Title: currentQuotation?.Title || '',
            Description: currentQuotation?.Description || '',
            SiteId: currentQuotation?.SiteId || '',
            QuotationDate: currentQuotation?.QuotationDate ? new Date(currentQuotation.QuotationDate) : new Date(),
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
        className="sm:max-w-6xl h-[90vh] flex flex-col bg-white"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-radix-select-content]') || target.closest('[data-radix-popover-content]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{quotation ? 'Edit Quotation' : 'Add New Quotation'}</DialogTitle>
          <DialogDescription>
            {quotation ? 'Update the details for this quotation.' : 'Enter the details for the new quotation.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
            {/* Form Header Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="QuotationDate">Quotation Date</Label>
                <Controller
                  control={control}
                  name="QuotationDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn('w-full h-10 justify-start text-left font-normal bg-gray-200 border', !field.value && 'text-muted-foreground')}
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
                {errors.QuotationDate && <p className="text-xs text-red-500 mt-1">{errors.QuotationDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="Title">Title</Label>
                <Input id="Title" {...register('Title')} className="h-10 bg-gray-200 border" />
                {errors.Title && <p className="text-xs text-red-500 mt-1">{errors.Title.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="SiteId">Site</Label>
                  <Controller
                    control={control}
                    name="SiteId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger className="h-10 bg-gray-200 border">
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
                  {errors.SiteId && <p className="text-xs text-red-500 mt-1">{errors.SiteId.message}</p>}
                </div>
            </div>
            <div>
              <Label htmlFor="Description">Description</Label>
              <Textarea id="Description" {...register('Description')} rows={3} className="bg-gray-200 border" />
              {errors.Description && <p className="text-xs text-red-500 mt-1">{errors.Description.message}</p>}
            </div>

            {/* Quotation Items Section */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Quotation Items</h4>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ Description: '', Quantity: 1, Rate: 0, AreaPerQuantity: 1, IsWithMaterial: false, UnitId: '' })}
                >
                    Add Item
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="p-2 w-[35%]">Description</TableHead>
                      <TableHead className="p-2 w-[80px] text-center">Material</TableHead>
                      <TableHead className="p-2 w-[100px]">Quantity</TableHead>
                      <TableHead className="p-2 w-[100px]">Area</TableHead>
                      <TableHead className="p-2 w-[130px]">Unit</TableHead>
                      <TableHead className="p-2 w-[120px]">Rate</TableHead>
                      <TableHead className="p-2 w-[120px] text-right">Amount</TableHead>
                      <TableHead className="p-2 w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => {
                      const watchedItem = watchedItems?.[index];
                      const quantity = watchedItem?.Quantity || 0;
                      const rate = watchedItem?.Rate || 0;
                      const area = watchedItem?.AreaPerQuantity || 1;
                      const itemTotal = quantity * rate * area;
                      return (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="p-1 align-top">
                            <Textarea {...register(`quotationItems.${index}.Description`)} placeholder="Item description" className="h-10 text-xs min-h-[40px] bg-gray-200 border"/>
                          </TableCell>
                          <TableCell className="p-1 align-middle text-center">
                            <Controller
                              control={control}
                              name={`quotationItems.${index}.IsWithMaterial`}
                              render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
                            />
                          </TableCell>
                          <TableCell className="p-1 align-top">
                            <Input {...register(`quotationItems.${index}.Quantity`, { valueAsNumber: true })} type="number" placeholder="Qty" className="h-10 text-xs bg-gray-200 border" />
                          </TableCell>
                          <TableCell className="p-1 align-top">
                            <Input {...register(`quotationItems.${index}.AreaPerQuantity`, { valueAsNumber: true })} type="number" step="0.01" placeholder="Area" className="h-10 text-xs bg-gray-200 border" />
                          </TableCell>
                          <TableCell className="p-1 align-top">
                            <Controller
                              control={control}
                              name={`quotationItems.${index}.UnitId`}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                  <SelectTrigger className="h-10 text-xs bg-gray-200 border">
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
                          <TableCell className="p-1 align-top">
                            <Input {...register(`quotationItems.${index}.Rate`, { valueAsNumber: true })} type="number" step="0.01" placeholder="Rate" className="h-10 text-xs bg-gray-200 border" />
                          </TableCell>
                          <TableCell className="p-1 align-top text-right font-medium text-xs pt-3">{itemTotal.toFixed(2)}</TableCell>
                          <TableCell className="p-1 align-top">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end pt-4">
                  <div className="w-full md:w-1/4">
                      <div className="flex justify-between items-center border-t-2 pt-2">
                      <p className="text-base font-semibold">Grand Total</p>
                      <p className="text-base font-bold">{totalAmount.toFixed(2)}</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-white">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
