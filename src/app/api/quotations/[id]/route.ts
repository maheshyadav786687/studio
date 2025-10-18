
import { NextResponse } from 'next/server';
import { updateQuotation, deleteQuotation } from '@/lib/bll/quotation-bll';
import { QuotationFormSchema } from '@/lib/types';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Quotation ID is required', { status: 400 });
    }
    const json = await req.json();
    
    const validatedFields = QuotationFormSchema.partial().safeParse(json);
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error.flatten() }, { status: 400 });
    }

    const updatedQuotation = await updateQuotation(params.id, validatedFields.data);

    if (!updatedQuotation) {
      return new NextResponse('Quotation not found', { status: 404 });
    }
    
    return NextResponse.json(updatedQuotation);
  } catch (error) {
    console.error('[API_QUOTATION_ID_PATCH]', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(errorMessage, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Quotation ID is required', { status: 400 });
    }

    await deleteQuotation(params.id);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[API_QUOTATION_ID_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
