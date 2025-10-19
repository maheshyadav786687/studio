
import { NextRequest, NextResponse } from 'next/server';
import { updateSite, deleteSite } from '@/lib/bll/site-bll';
import { SiteFormSchema } from '@/lib/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Site ID is required', { status: 400 });
    }
    const json = await req.json();
    
    const validatedFields = SiteFormSchema.partial().safeParse(json);
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error.flatten() }, { status: 400 });
    }

    const updatedSite = await updateSite(params.id, validatedFields.data);

    if (!updatedSite) {
      return new NextResponse('Site not found', { status: 404 });
    }
    
    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error('[API_SITE_ID_PATCH]', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(errorMessage, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Site ID is required', { status: 400 });
    }

    await deleteSite(params.id);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[API_SITE_ID_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
