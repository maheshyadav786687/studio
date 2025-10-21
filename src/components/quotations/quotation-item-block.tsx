
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import type { Unit, QuotationItem } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';

interface QuotationItemBlockProps {
  index: number;
  control: any;
  register: any;
  remove: (index: number) => void;
  units: Unit[];
  watchedItem: QuotationItem;
}

export function QuotationItemBlock({ index, control, register, remove, units, watchedItem }: QuotationItemBlockProps) {
    const amount = ((watchedItem.Area || 0) > 0 ? (watchedItem.Area || 0) : (watchedItem.Quantity || 0)) * (watchedItem.Rate || 0);

  return (
    <div className="grid grid-cols-12 gap-2 items-start p-2 border rounded-md">
        <div className="col-span-3">
            <Textarea {...register(`items.${index}.Description`)} placeholder="Description" className="min-h-[15px]" />
        </div>
        <div className="col-span-1 flex items-center justify-center pt-2">
            <Controller
            control={control}
            name={`items.${index}.IsWithMaterial`}
            render={({ field }) => (
                <Checkbox onCheckedChange={field.onChange} checked={field.value} />
            )}
            />
        </div>
        <div className="col-span-1">
            <Input type="number" {...register(`items.${index}.Quantity`, { valueAsNumber: true })} placeholder="Qty" className="h-8" />
        </div>
        <div className="col-span-1">
            <Input type="number" {...register(`items.${index}.Area`, { valueAsNumber: true })} placeholder="Area" className="h-8" />
        </div>
        <div className="col-span-2">
            <Controller
            control={control}
            name={`items.${index}.UnitId`}
            render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-8">
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
            <Input type="number" {...register(`items.${index}.Rate`, { valueAsNumber: true })} placeholder="Rate" className="h-8" />
        </div>
        <div className="col-span-2 text-right">
            <span className="font-mono pr-2">${amount.toFixed(2)}</span>
        </div>
        <div className="col-span-1 flex items-center justify-center pt-2">
            <Button variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
