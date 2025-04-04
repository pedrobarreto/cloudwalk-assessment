'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

const initialForm = {
  name: '',
  description: '',
  price: '',
  image_url: ''
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams(); 
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, startSubmitting] = useTransition();
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Erro ao carregar o produto');
        }
        const data: Product = await res.json();
        setForm({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          image_url: data.image_url || ''
        });
      } catch (err: any) {
        setError(err.message || 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitProduct = () => {
    startSubmitting(async () => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price)
        })
      });
      if (response.ok) router.push('/products');
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-800">Carregando produto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white max-w-xl w-full shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Produto</h1>

        <input
          type="text"
          name="name"
          placeholder="Nome do produto"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Preço (R$)"
          value={form.price}
          onChange={(e) => updateField('price', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="text"
          name="image_url"
          placeholder="URL da imagem (opcional)"
          value={form.image_url}
          onChange={(e) => updateField('image_url', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={submitProduct}
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {submitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <Link href="/products/list">
            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
