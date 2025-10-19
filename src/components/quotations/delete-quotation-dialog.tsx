
'use client';

import { useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteQuotation as removeQuotation } from '@/lib/bll/quotation-bll';
import { useDialog } from '@/hooks/use-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DeleteDialogContext = createContext<ReturnType<typeof useDialog<{ quotationId?: string, onConfirm?: () => void }>> | null>(null);

export function useDeleteQuotationDialog() {
    const context = useContext(DeleteDialogContext);
    if (!context) {
        throw new Error('useDeleteQuotationDialog must be used within a DeleteQuotationDialogProvider');
    }
    return context;
}

export function DeleteQuotationDialogProvider({ children }: { children: React.ReactNode }) {
    const dialog = useDialog<{ quotationId?: string, onConfirm?: () => void }>();
    return (
        <DeleteDialogContext.Provider value={dialog}>
            {children}
            <DeleteConfirmationDialog />
        </DeleteDialogContext.Provider>
    );
}


export function DeleteConfirmationDialog() {
    const { visible, hide, quotationId, onConfirm } = useDeleteQuotationDialog();
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!quotationId) return;
        setIsDeleting(true);
        try {
            await removeQuotation(quotationId);
            toast({ title: 'Success', description: 'Quotation deleted successfully.' });
            onConfirm?.();
            router.refresh();
            hide();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={visible} onOpenChange={hide}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the quotation.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
