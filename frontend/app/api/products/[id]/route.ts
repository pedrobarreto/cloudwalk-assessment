import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function extractIdFromRequest(req: NextRequest) {
  return req.nextUrl.pathname.split('/').pop();
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const id = extractIdFromRequest(req);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao buscar produto' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET PRODUCT ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao buscar produto' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const id = extractIdFromRequest(req);
  const body = await req.json();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error || 'Erro ao atualizar' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[PUT PRODUCT ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao atualizar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const id = extractIdFromRequest(req);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data?.error || 'Erro ao deletar' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    console.error('[DELETE PRODUCT ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao deletar' }, { status: 500 });
  }
}
