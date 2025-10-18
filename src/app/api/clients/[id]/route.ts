import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Client ID is required', { status: 400 });
    }
    const body = await req.json();
    const updatedClient = await db.clients.update(params.id, body);
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
  req: Request,
  { params }: { params: { id: string } }
) {
    try {
        if (!params.id) {
            return new NextResponse('Client ID is required', { status: 400 });
        }
        await db.clients.delete(params.id);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[API_CLIENT_ID_DELETE]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
