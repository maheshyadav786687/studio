
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Client, ClientFormData, ClientFormSchema } from '@/lib/types';
import { createClient, updateClient } from '@/lib/bll/client-bll';

type ClientDialogProps = {
  client?: Client;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

export function ClientDialog({ client, children, onOpenChange, open: parentOpen }: ClientDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      Name: client?.Name || '',
      Email: client?.Email || '',
      Phone: client?.Phone || '',
      Address: client?.Address || '',
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    setOpen(isOpen);
    if (onOpenChange) onOpenChange(isOpen);
  };
  
  const currentOpen = parentOpen !== undefined ? parentOpen : open;

  async function onSubmit(data: ClientFormData) {
    try {
      if (client) {
        await updateClient(client.Id, data);
      } else {
        await createClient(data);
      }
      
      toast({
        title: 'Success',
        description: `Client ${client ? 'updated' : 'saved'} successfully.`,
      });

      router.refresh();
      handleOpenChange(false);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save client.',
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
            <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {client ? 'Update the details for this client.' : 'Enter the details for the new client.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Name" className="text-right">Name</Label>
              <Input id="Name" {...register('Name')} className="col-span-3" />
              {errors.Name && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.Name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Email" className="text-right">Email</Label>
              <Input id="Email" type="email" {...register('Email')} className="col-span-3" />
              {errors.Email && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.Email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Phone" className="text-right">Phone</Label>
              <Input id="Phone" {...register('Phone')} className="col-span-3" />
              {errors.Phone && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.Phone.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Address" className="text-right">Address</Label>
              <Input id="Address" {...register('Address')} className="col-span-3" />
              {errors.Address && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.Address.message}</p>}
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
