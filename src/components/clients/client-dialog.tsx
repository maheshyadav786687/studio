'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Client, ClientSchema } from '@/lib/types';

type ClientDialogProps = {
  client?: Client;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

// DTO for the form
const FormSchema = ClientSchema.omit({ id: true, avatarUrl: true, projectsCount: true });
type ClientFormData = z.infer<typeof FormSchema>;

export function ClientDialog({ client, children, onOpenChange, open: parentOpen }: ClientDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<ClientFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      company: client?.company || '',
      status: client?.status || 'Active',
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset(); // Reset form when dialog closes
    }
    setOpen(isOpen);
    if (onOpenChange) onOpenChange(isOpen);
  };
  
  const currentOpen = parentOpen !== undefined ? parentOpen : open;

  async function onSubmit(data: ClientFormData) {
    // UIL calls the API Layer
    const url = client ? `/api/clients/${client.id}` : '/api/clients';
    const method = client ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong.');
      }
      
      toast({
        title: 'Success',
        description: `Client ${client ? 'updated' : 'saved'} successfully.`,
      });

      router.refresh(); // Re-fetch data on the server and re-render
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
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" {...register('name')} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" {...register('email')} className="col-span-3" />
              {errors.email && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" {...register('phone')} className="col-span-3" />
              {errors.phone && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input id="company" {...register('company')} className="col-span-3" />
              {errors.company && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.company.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <RadioGroup
                defaultValue={client?.status || 'Active'}
                className="col-span-3 flex gap-4"
                onValueChange={(value) => control._fields.status?.onChange(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Active" id="status-active" {...register('status')} />
                  <Label htmlFor="status-active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inactive" id="status-inactive" {...register('status')} />
                  <Label htmlFor="status-inactive">Inactive</Label>
                </div>
              </RadioGroup>
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