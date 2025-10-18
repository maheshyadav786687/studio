import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const projects = await db.projects.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API_PROJECTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
