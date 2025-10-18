
import { NextResponse } from 'next/server';
import { getQuotations, createQuotation } from '@/lib/bll/quotation-bll';
import { QuotationFormSchema } from '@/lib/types';

export async function GET() {
  try {
    const quotations = await getQuotations();
    return NextResponse.json(quotations);
  } catch (error) {
    console.error('[API_QUOTATIONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validatedFields = QuotationFormSchema.safeParse(json);
    
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error.flatten() }, { status: 400 });
    }

    const newQuotation = await createQuotation(validatedFields.data);
    return NextResponse.json(newQuotation, { status: 201 });
  } catch (error) {
     console.error('[API_QUOTATIONS_POST]', error);
     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
     return new NextResponse(errorMessage, { status: 500 });
  }
}
