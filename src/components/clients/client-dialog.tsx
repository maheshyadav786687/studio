'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { saveClientAction } from '@/app/admin/clients/actions';

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
import type { Client } from '@/lib/types';
import React from 'react';

type ClientDialogProps = {
  client?: Client;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export function ClientDialog({ client, children, onOpenChange }: ClientDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const initialState = { message: null, errors: {} };
  const [state, formAction] = useFormState(saveClientAction, initialState);

  React.useEffect(() => {
    if (state.message) {
      if (state.message === 'Client saved successfully.') {
        toast({
          title: 'Success',
          description: state.message,
        });
        setOpen(false);
        if (onOpenChange) onOpenChange(false);
      } else if (state.message !== 'Validation failed.') {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, onOpenChange]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (onOpenChange) onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
            {client?.id && <input type="hidden" name="id" value={client.id} />}
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
              <Input id="name" name="name" defaultValue={client?.name} className="col-span-3" />
              {state.errors?.name && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{state.errors.name[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" name="email" type="email" defaultValue={client?.email} className="col-span-3" />
               {state.errors?.email && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{state.errors.email[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" name="phone" defaultValue={client?.phone} className="col-span-3" />
               {state.errors?.phone && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{state.errors.phone[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input id="company" name="company" defaultValue={client?.company} className="col-span-3" />
               {state.errors?.company && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{state.errors.company[0]}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <RadioGroup name="status" defaultValue={client?.status || 'Active'} className="col-span-3 flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Active" id="status-active" />
                        <Label htmlFor="status-active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Inactive" id="status-inactive" />
                        <Label htmlFor="status-inactive">Inactive</Label>
                    </div>
                </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
