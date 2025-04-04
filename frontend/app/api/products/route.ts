import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao buscar produtos' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET PRODUCTS ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao buscar produtos' }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId: string | null = null;
  try {
    const decoded = jwt.decode(token) as { sub: string };
    userId = decoded?.sub;
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...body,
        user_id: userId
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao criar produto' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[POST PRODUCT ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao criar produto' }, { status: 500 });
  }
}
