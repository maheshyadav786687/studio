
import { NextResponse } from 'next/server';
import { getSites, createSite } from '@/lib/bll/site-bll';
import { SiteFormSchema } from '@/lib/types';

export async function GET() {
  try {
    const sites = await getSites();
    return NextResponse.json(sites);
  } catch (error) {
    console.error('[API_SITES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validatedFields = SiteFormSchema.safeParse(json);
    
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error.flatten() }, { status: 400 });
    }

    const newSite = await createSite(validatedFields.data);
    return NextResponse.json(newSite, { status: 201 });
  } catch (error) {
     console.error('[API_SITES_POST]', error);
     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
     return new NextResponse(errorMessage, { status: 500 });
  }
}
