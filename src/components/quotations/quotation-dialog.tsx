
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2 } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { Quotation, QuotationFormData, QuotationFormSchema, Unit, Site } from '@/lib/types';
import { createQuotation, updateQuotation } from '@/lib/bll/quotation-bll';
import { getUnits } from '@/lib/bll/unit-bll';
import { getSites } from '@/lib/bll/site-bll';
import { Textarea } from '../ui/textarea';

type QuotationDialogProps = {
  quotation?: Quotation;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

export function QuotationDialog({ quotation, children, onOpenChange, open: parentOpen }: QuotationDialogProps) {
  const [open, setOpen] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuotationFormData>({
    resolver: zodResolver(QuotationFormSchema),
    defaultValues: {
      Description: quotation?.Description || '',
      SiteId: quotation?.SiteId || '',
      items: quotation?.QuotationItems?.map(item => ({
        Description: item.Description,
        Quantity: item.Quantity,
        UnitId: item.UnitId,
        Rate: item.Rate,
        Area: item.Area,
        IsWithMaterial: item.IsWithMaterial,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [unitsData, sitesData] = await Promise.all([
        getUnits(),
        getSites({ all: true }), // Fetch all sites
      ]);
      setUnits(unitsData.sites);
      setSites(sitesData.sites);
    };
    fetchData();
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
        reset({
            Description: quotation?.Description || '',
            SiteId: quotation?.SiteId || '',
            items: quotation?.QuotationItems?.map(item => ({
              Description: item.Description,
              Quantity: item.Quantity,
              UnitId: item.UnitId,
              Rate: item.Rate,
              Area: item.Area,
              IsWithMaterial: item.IsWithMaterial,
            })) || [],
        });
    } 
    setOpen(isOpen);
    if (onOpenChange) onOpenChange(isOpen);
  };

  const currentOpen = parentOpen !== undefined ? parentOpen : open;

  async function onSubmit(data: QuotationFormData) {
    try {
      if (quotation) {
        await updateQuotation(quotation.Id, data);
      } else {
        await createQuotation(data);
      }

      toast({
        title: 'Success',
        description: `Quotation ${quotation ? 'updated' : 'saved'} successfully.`,
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
      <DialogContent className="sm:max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{quotation ? 'Edit Quotation' : 'Add New Quotation'}</DialogTitle>
            <DialogDescription>
              {quotation ? 'Update the details for this quotation.' : 'Enter the details for the new quotation.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="SiteId">Site</Label>
                    <select id="SiteId" {...register('SiteId')} className="w-full p-2 border rounded-md">
                        <option value="">Select a site</option>
                        {sites.map(site => (
                            <option key={site.Id} value={site.Id}>{site.Name}</option>
                        ))}
                    </select>
                    {errors.SiteId && <p className="text-xs text-red-500 mt-1">{errors.SiteId.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="Description">Description (Optional)</Label>
                    <Textarea id="Description" {...register('Description')} />
                    {errors.Description && <p className="text-xs text-red-500 mt-1">{errors.Description.message}</p>}
                </div>
            </div>

            <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Quotation Items</h3>
                    <Button 
                        type="button" 
                        size="sm"
                        onClick={() => append({ Description: '', Quantity: 1, UnitId: '', Rate: 0, IsWithMaterial: false, Area: 0 })} >
                        <PlusCircle className="h-4 w-4 mr-2"/> Add Item
                    </Button>
                </div>
                <div className="grid gap-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-12 gap-2 items-start p-2 border rounded-md">
                            <div className="col-span-4">
                                <Label htmlFor={`items.${index}.Description`}>Description</Label>
                                <Input {...register(`items.${index}.Description`)} />
                            </div>
                            <div>
                                <Label htmlFor={`items.${index}.Quantity`}>Qty</Label>
                                <Input type="number" {...register(`items.${index}.Quantity`, { valueAsNumber: true })} />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor={`items.${index}.UnitId`}>Unit</Label>
                                <select {...register(`items.${index}.UnitId`)} className="w-full p-2 border rounded-md">
                                    <option value="">Select Unit</option>
                                    {units.map(unit => (
                                        <option key={unit.Id} value={unit.Id}>{unit.Name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor={`items.${index}.Rate`}>Rate</Label>
                                <Input type="number" {...register(`items.${index}.Rate`, { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Label htmlFor={`items.${index}.Area`}>Area</Label>
                                <Input type="number" {...register(`items.${index}.Area`, { valueAsNumber: true })} />
                            </div>
                            <div className="flex items-end h-full">
                                <div className="flex items-center">
                                    <input type="checkbox" {...register(`items.${index}.IsWithMaterial`)} className="mr-2"/>
                                    <Label htmlFor={`items.${index}.IsWithMaterial`}>With Material</Label>
                                </div>
                            </div>
                            <div className="flex items-end h-full">
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                     {errors.items && <p className="text-xs text-red-500 mt-1">{errors.items.message}</p>}
                </div>
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
