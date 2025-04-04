import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone } = body;

  if (!phone) {
    return NextResponse.json({ error: 'Telefone é obrigatório' }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'customer', phone })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao solicitar código' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Código de verificação enviado com sucesso' });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno ao solicitar código' }, { status: 500 });
  }
}
