import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const endpointType = body.type === 'product' ? 'product' : 'order';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insights/${endpointType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || 'Erro ao consultar IA');
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[IA ERROR]', err);
    return NextResponse.json({ error: 'Erro ao processar insight com IA' }, { status: 500 });
  }
}
