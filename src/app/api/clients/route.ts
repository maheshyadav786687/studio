
import { NextResponse } from 'next/server';
import { getClients, createClient } from '@/lib/bll/client-bll';
import { ClientFormSchema } from '@/lib/types';

export async function GET() {
  try {
    // API layer calls the BLL
    const clients = await getClients();
    // API layer returns DTOs
    return NextResponse.json(clients);
  } catch (error) {
    console.error('[API_CLIENTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const json = await req.json();
    // API layer validates the DTO
    const validatedFields = ClientFormSchema.safeParse(json);
    
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error.flatten() }, { status: 400 });
    }

    // API layer calls the BLL
    const newClient = await createClient(validatedFields.data);

    // API layer returns a DTO
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('[API_CLIENTS_POST]', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(errorMessage, { status: 500 });
  }
}
