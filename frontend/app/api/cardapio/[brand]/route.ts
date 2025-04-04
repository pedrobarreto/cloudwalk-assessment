import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const brand = request.nextUrl.pathname.split('/').pop();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${brand}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao buscar cardápio' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[CARDAPIO PUBLIC ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao buscar cardápio' }, { status: 500 });
  }
}
