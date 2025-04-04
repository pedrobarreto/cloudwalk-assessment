'use client';

import { useEffect, useState } from 'react';
import ProductList from '@/components/ProductList';
import Cart from '@/components/Cart';
import { useOrder } from '@/contexts/order-context';
import StoreClosedModal from '@/components/StoreClosedModal';

export default function CardapioPage({ brand }: { brand: string }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const { setOrder } = useOrder();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`/api/cardapio/${brand}`);
      const data = await res.json();
      setProducts(data.products);

      setOrder({
        user_id: data.user_id,
        total: 0,
        items: []
      });
    };

    fetchProducts();
  }, [brand, setOrder]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id]--;
      else delete updated[id];
      return updated;
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <StoreClosedModal/>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Cardápio - {brand}</h1>
          <ProductList
            products={products}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        </div>
        <Cart
          products={products}
          cart={cart}
          removeFromCart={removeFromCart}
        />
      </div>
    </main>
  );
}
