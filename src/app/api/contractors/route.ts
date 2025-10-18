import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const contractors = await db.contractors.findMany();
    return NextResponse.json(contractors);
  } catch (error) {
    console.error('[API_CONTRACTORS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
