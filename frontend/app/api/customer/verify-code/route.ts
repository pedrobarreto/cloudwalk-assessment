import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone, code } = body;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao verificar código' }, { status: res.status });
    }

    const token = data?.session?.access_token;
    const user = data?.user;

    if (!token || !user?.id) {
      return NextResponse.json({ error: 'Token ou usuário inválido' }, { status: 400 });
    }

    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      access_token: token,
      user, 
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 dia
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno ao verificar código' }, { status: 500 });
  }
}
