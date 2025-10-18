import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    const project = await db.projects.findById(params.id);

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('[API_PROJECT_ID_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
