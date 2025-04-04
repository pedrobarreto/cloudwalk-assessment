import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao criar usuário' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[CREATE USER ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao criar usuário' }, { status: 500 });
  }
}
