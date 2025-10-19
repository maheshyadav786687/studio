import { NextRequest, NextResponse } from 'next/server';
import { updateClient, deleteClient } from '@/lib/bll/client-bll';
import { ClientSchema } from '@/lib/types';
import { z } from 'zod';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Client ID is required', { status: 400 });
    }
    const json = await req.json();
    
    const validatedFields = ClientSchema.partial().safeParse(json);
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error.flatten() }, { status: 400 });
    }

    const updatedClient = await updateClient(params.id, validatedFields.data);

    if (!updatedClient) {
      return new NextResponse('Client not found', { status: 404 });
    }
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('[API_CLIENT_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Client ID is required', { status: 400 });
    }

    await deleteClient(params.id);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[API_CLIENT_ID_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
