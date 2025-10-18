import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import type { Contractor } from '@/lib/types';

export async function GET() {
  try {
    const contractors = await db.contractors.findMany();
    return NextResponse.json(contractors);
  } catch (error) {
    console.error('[API_CONTRACTORS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, skills, availability } = body;

        if (!name || !email || !skills || !availability) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const newContractor = await db.contractors.create({
            name,
            email,
            skills: skills.split(',').map((s: string) => s.trim()),
            availability,
        });

        return NextResponse.json(newContractor, { status: 201 });

    } catch (error) {
        console.error('[API_CONTRACTORS_POST]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
