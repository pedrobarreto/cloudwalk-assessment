'use client';

import React, { useState } from 'react';
import { useOrder } from '@/contexts/order-context';
import { useRouter } from 'next/navigation';
import CustomerLoginModal from '@/app/[brand]/CustomerLoginModal';

type Product = {
  id: string;
  name: string;
  price: number;
  user_id: string;
};

type Cart = {
  [productId: string]: number;
};

type CartProps = {
  products: Product[];
  cart: Cart;
  removeFromCart: (productId: string) => void;
};

type CartItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function Cart({ products, cart, removeFromCart }: CartProps) {
  const { order, setOrder } = useOrder();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const items: CartItem[] = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find((p) => p.id === id);
    return {
      product_id: product?.id || '',
      name: product?.name || '',
      price: product?.price || 0,
      quantity,
    };
  });

  const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleFinalize = () => {
    const user_id = products[0]?.user_id;
    if (!user_id) return;

    setOrder({
      user_id,
      items,
      total,
      customer_id: order?.customer_id,
      customer_name: order?.customer_name,
    });

    if (order?.customer_id) {
      router.push('/pagamento');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <aside className="bg-white p-4 rounded-xl shadow-md sticky top-6">
        <h2 className="text-xl text-gray-600 font-bold mb-4">Carrinho</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {items.map((item) => (
              <li
                key={item.product_id}
                className="flex justify-between items-center p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-sm text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="font-semibold text-right text-indigo-700">
          Total: {formatPrice(total)}
        </div>

        {items.length > 0 && (
          <button
            onClick={handleFinalize}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Finalizar Pedido
          </button>
        )}
      </aside>

      <CustomerLoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onVerified={() => {
          setShowLoginModal(false);
          router.push('/pagamento');
        }}
      />
    </>
  );
}
