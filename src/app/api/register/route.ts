
import { NextResponse } from 'next/server';
import { registerUser } from '../../../lib/bll/auth-bll';

export async function POST(req: Request) {
  try {
    const { name, email, password, companyName } = await req.json();

    const result = await registerUser(name, email, password, companyName);

    if (!result.success) {
      return new NextResponse(result.message, { status: 400 });
    }

    return new NextResponse(result.message, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
