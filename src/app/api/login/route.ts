
import { NextResponse } from 'next/server';
import { loginUser } from '../../../lib/bll/auth-bll';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const result = await loginUser(email, password);

    if (!result.success) {
      return new NextResponse(result.message, { status: 401 });
    }

    return NextResponse.json(result.user, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
