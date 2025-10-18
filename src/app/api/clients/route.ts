import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const clients = await db.clients.findMany();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('[API_CLIENTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
