
import { NextResponse } from 'next/server';
import { getUnits } from '@/lib/bll/unit-bll';

export async function GET() {
  try {
    const units = await getUnits();
    return NextResponse.json(units);
  } catch (error) {
    console.error('Error in GET /api/units:', error);
    return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
  }
}
