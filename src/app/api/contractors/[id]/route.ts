import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Contractor ID is required', { status: 400 });
    }

    const contractor = await db.contractors.findById(params.id);

    if (!contractor) {
      return new NextResponse('Contractor not found', { status: 404 });
    }

    return NextResponse.json(contractor);
  } catch (error) {
    console.error('[API_CONTRACTOR_ID_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
