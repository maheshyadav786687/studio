
// API route for /api/quotations

import { NextResponse } from 'next/server';
import {
    getQuotations,
    createQuotation,
    updateQuotation,
    deleteQuotation,
} from '@/lib/bll/quotation-bll';
import type { QuotationCreateDto, QuotationUpdateDto } from '@/lib/bll/quotation-bll';

export async function GET() {
    const quotations = await getQuotations();
    return NextResponse.json(quotations);
}

export async function POST(request: Request) {
    const data: QuotationCreateDto = await request.json();
    const newQuotation = await createQuotation(data);
    return NextResponse.json(newQuotation, { status: 201 });
}
