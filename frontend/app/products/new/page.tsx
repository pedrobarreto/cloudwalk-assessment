'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const initialForm = {
  name: '',
  description: '',
  price: '',
  image_url: ''
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [priceFeedback, setPriceFeedback] = useState('');
  const [loadingIA, startLoadingIA] = useTransition();
  const [submitting, startSubmitting] = useTransition();

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const animateText = (field: 'name' | 'description', text: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setForm((prev) => ({ ...prev, [field]: text.slice(0, i + 1) }));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);
  };

  const optimizeWithAI = () => {
    startLoadingIA(async () => {
      setPriceFeedback('');
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          type: "product"
        })
      });
      const data = await response.json();

      animateText('name', data.optimizedName);
      setTimeout(() => animateText('description', data.optimizedDescription), 300);
      setPriceFeedback(data.priceFeedback);
    });
  };

  const submitProduct = () => {
    startSubmitting(async () => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        })
      });
      if (response.ok) router.push('/products/list');
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white max-w-xl w-full shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Novo Produto</h1>

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

        <div className="flex items-center gap-4">
          <input
            type="number"
            name="price"
            placeholder="Preço (R$)"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {priceFeedback && (
            <div
              className={`text-sm p-2 rounded-lg border whitespace-nowrap ${
                priceFeedback === 'Barato'
                  ? 'bg-yellow-100 text-yellow-800'
                  : priceFeedback === 'Caro'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {priceFeedback === 'Barato'
                ? 'O preço está abaixo do ideal'
                : priceFeedback === 'Caro'
                ? 'O preço está acima do ideal'
                : 'O preço está justo'}
            </div>
          )}
        </div>

        <input
          type="text"
          name="image_url"
          placeholder="URL da imagem (opcional)"
          value={form.image_url}
          onChange={(e) => updateField('image_url', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="button"
          onClick={optimizeWithAI}
          disabled={loadingIA}
          className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          {loadingIA ? 'Otimizando com IA...' : '🧠 Otimizar com IA'}
        </button>

        <button
          type="button"
          onClick={submitProduct}
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {submitting ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </div>
    </main>
  );
}
