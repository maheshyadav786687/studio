import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/bll/project-bll';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API_PROJECTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
