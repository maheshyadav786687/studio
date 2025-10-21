
// API route for /api/quotations/[id]

import { NextResponse } from 'next/server';
import {
    getQuotationById,
    updateQuotation,
    deleteQuotation,
} from '@/lib/bll/quotation-bll';
import type { QuotationUpdateDto } from '@/lib/bll/quotation-bll';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const quotation = await getQuotationById(params.id);
    if (!quotation) {
        return NextResponse.json({ message: 'Quotation not found' }, { status: 404 });
    }
    return NextResponse.json(quotation);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const data: QuotationUpdateDto = await request.json();
    const updatedQuotation = await updateQuotation(params.id, data);
    return NextResponse.json(updatedQuotation);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await deleteQuotation(params.id);
    return NextResponse.json({ message: 'Quotation deleted successfully' });
}
