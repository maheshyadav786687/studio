
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Site, SiteFormSchema, Client } from '@/lib/types';
import { createSite, updateSite } from '@/lib/services/site-api-service';
import { getClients } from '@/lib/services/client-api-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SiteDialogProps = {
  site?: Site;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

type SiteFormData = z.infer<typeof SiteFormSchema>;

export function SiteDialog({ site, children, onOpenChange, open: parentOpen }: SiteDialogProps) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<SiteFormData>({
    resolver: zodResolver(SiteFormSchema),
    defaultValues: {
      name: site?.name || '',
      address: site?.address || '',
      clientId: site?.clientId || '',
    },
  });
  
  const currentOpen = parentOpen !== undefined ? parentOpen : open;

  useEffect(() => {
    async function fetchClients() {
      try {
        const fetchedClients = await getClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error('Failed to fetch clients', error);
      }
    }
    if(currentOpen) {
      fetchClients();
    }
  }, [currentOpen]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    setOpen(isOpen);
    if (onOpenChange) onOpenChange(isOpen);
  };
  

  async function onSubmit(data: SiteFormData) {
    try {
      if (site) {
        await updateSite(site.id, data);
      } else {
        await createSite(data);
      }
      
      toast({
        title: 'Success',
        description: `Site ${site ? 'updated' : 'created'} successfully.`,
      });

      router.refresh();
      handleOpenChange(false);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save site.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{site ? 'Edit Site' : 'Add New Site'}</DialogTitle>
            <DialogDescription>
              {site ? 'Update the details for this site.' : 'Enter the details for the new site.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" {...register('name')} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input id="address" {...register('address')} className="col-span-3" />
              {errors.address && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.address.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">
                Client
              </Label>
              <Controller
                control={control}
                name="clientId"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                        {clients.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                            {c.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                )}
              />
              {errors.clientId && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.clientId.message}</p>}
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
