'use client';

import { useOrder, OrderData } from '@/contexts/order-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PagamentoPage() {
  const { order } = useOrder() as { order: OrderData | null; setOrder: (order: OrderData) => void };
  const router = useRouter();
  const [method, setMethod] = useState<'pix' | 'credit_card' | 'cash'>('pix');

  useEffect(() => {
    if (!order || !order.customer_id || !order.items?.length) {
      router.push('/');
    }
  }, [order, router]);

  const total = order?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const generatedOrderId = crypto.randomUUID();
      let paymentLink = '';

      if (method === 'credit_card') {
        paymentLink = `infinitepaydash://infinitetap-app?amount=${Math.round(
          total * 100
        )}&payment_method=credit&installments=1&order_id=${generatedOrderId}&result_url=mypocapp://example/tap_result&app_client_referrer=POCApp&af_force_deeplink=true`;
      }

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: order?.user_id,
          customer_id: order?.customer_id,
          customer_name: order?.customer_name,
          order_items: order?.items,
          total,
          payment_method: method,
          payment_link: paymentLink || null,
          order_id: generatedOrderId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Erro ao salvar o pedido');
      }

      router.push('/dashboard/customer');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro inesperado ao confirmar o pedido.');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Finalizar Pedido</h1>

        <div className="space-y-2">
          <label className="block text-sm text-gray-700">Método de Pagamento</label>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 flex items-center gap-2">
              <input
                type="radio"
                value="pix"
                checked={method === 'pix'}
                onChange={() => setMethod('pix')}
              />
              Pix
            </label>
            <label className="text-gray-700 flex items-center gap-2">
              <input
                type="radio"
                value="credit_card"
                checked={method === 'credit_card'}
                onChange={() => setMethod('credit_card')}
              />
              Cartão de Crédito
            </label>
            <label className="text-gray-700 flex items-center gap-2">
              <input
                type="radio"
                value="cash"
                checked={method === 'cash'}
                onChange={() => setMethod('cash')}
              />
              Dinheiro
            </label>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Resumo do Pedido</h2>
          <ul className="space-y-1 text-sm text-gray-700">
            {order?.items.map((item) => (
              <li key={item.product_id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-bold text-indigo-700">
            Total: R$ {total.toFixed(2)}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
        >
          Confirmar Pedido
        </button>
      </form>
    </main>
  );
}
