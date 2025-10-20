
'use client';

import { Quotation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuotationDialog } from './quotation-dialog';
import { deleteQuotation } from '@/lib/bll/quotation-bll';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface QuotationCardProps {
    quotation: Quotation;
}

export function QuotationCard({ quotation }: QuotationCardProps) {
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this quotation?')) {
            try {
                await deleteQuotation(quotation.Id);
                toast({ title: 'Success', description: 'Quotation deleted successfully.' });
                router.refresh();
            } catch (error: any) {
                toast({ title: 'Error', description: error.message, variant: 'destructive' });
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quotation #{quotation.Id.substring(0, 8)}</CardTitle>
                <CardDescription>For: {quotation.Site?.Name}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 mb-2">{quotation.Description}</p>
                <p className="font-semibold text-lg">Amount: ${quotation.Amount.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Created on: {new Date(quotation.CreatedOn).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <QuotationDialog quotation={quotation}>
                    <Button variant="outline">Edit</Button>
                </QuotationDialog>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </CardFooter>
        </Card>
    );
}
