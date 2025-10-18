import { NextResponse } from 'next/server';
import { getProjectById } from '@/lib/bll/project-bll';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    const project = await getProjectById(params.id);

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('[API_PROJECT_ID_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
