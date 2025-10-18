import { NextResponse } from 'next/server';
import { contractors } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const contractor = contractors.find(c => c.id === params.id);
  if (contractor) {
    return NextResponse.json(contractor);
  }
  return new NextResponse('Contractor not found', { status: 404 });
}
