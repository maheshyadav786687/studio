import { NextResponse } from 'next/server';
import { contractors } from '@/lib/data';

export async function GET() {
  return NextResponse.json(contractors);
}
