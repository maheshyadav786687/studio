import { NextResponse } from 'next/server';
import { projects } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const project = projects.find(p => p.id === params.id);
  if (project) {
    return NextResponse.json(project);
  }
  return new NextResponse('Project not found', { status: 404 });
}
