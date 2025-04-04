"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/supabase-context';

interface Order {
  id: string;
  user_id: string;
  customer_id?: string | null;
  customer_name?: string | null;
  total?: number | null;
  created_at: string;
  status:
    | 'aguardando_pagamento'
    | 'aguardando_preparo'
    | 'em_preparacao'
    | 'pronto'
    | 'entregue';
  payment_method?: 'pix' | 'dinheiro' | 'credit_card' | null;
  payment_link?: string | null;
  preparation_time?: number | null;
}

interface OrderBoardProps {
  userId: string;
}

const statusLabels: Record<Order['status'], string> = {
  aguardando_pagamento: 'Efetuar Pagamento',
  aguardando_preparo: 'Aguardando Preparo',
  em_preparacao: 'Em Preparação',
  pronto: 'Pedido Pronto',
  entregue: 'Entregue',
};

export default function OrderBoard({ userId }: OrderBoardProps) {
  const supabase = useSupabase();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new as Order;
        if (!newOrder) return;

        if (newOrder.customer_id === userId) {
          setOrders((prev) => {
            const existing = prev.find((o) => o.id === newOrder.id);
            if (existing) {
              return prev.map((o) => (o.id === newOrder.id ? newOrder : o));
            } else {
              return [newOrder, ...prev];
            }
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Meus Pedidos</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900 mb-1">
            Pedido #{order.id.slice(0, 6)}
          </p>
          <p className="text-sm text-gray-500">Cliente: {order.customer_name}</p>
          <p className="text-sm text-gray-500">
            Total: R$ {order.total ? order.total.toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-md">
          <span className="text-xs font-medium text-indigo-700">
            {statusLabels[order.status] || 'Indefinido'}
          </span>
        </div>
      </div>
    </div>
  );
}
