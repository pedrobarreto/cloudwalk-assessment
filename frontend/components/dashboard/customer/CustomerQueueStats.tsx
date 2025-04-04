'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/supabase-context';

interface Order {
  id: string;
  user_id: string;
  customer_id?: string;
  created_at: string;
  status: 'aguardando_pagamento' | 'aguardando_preparo' | 'em_preparacao' | 'pronto' | 'entregue';
}

interface CustomerQueueStatsProps {
  customerId: string;
}

export default function CustomerQueueStats({ customerId }: CustomerQueueStatsProps) {
  const supabase = useSupabase();
  const [ordersQueuePosition, setOrdersQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomerQueueInfo();
    const channel = supabase
      .channel('orders-customer-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchCustomerQueueInfo();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  async function fetchCustomerQueueInfo() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_id, created_at, status')
        .order('created_at', { ascending: true });

      if (error || !data) return;

      const allOrders = data as Order[];
      const notDelivered = allOrders.filter((o) => o.status !== 'entregue');
      const customerActiveOrders = notDelivered.filter((o) => o.customer_id === customerId);
      if (customerActiveOrders.length === 0) {
        setOrdersQueuePosition(null);
        return;
      }


      const sortedNotDelivered = notDelivered.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

     
      const customerOrder = customerActiveOrders[0];

     
      const position = sortedNotDelivered.findIndex((o) => o.id === customerOrder.id);

      setOrdersQueuePosition(position);
    } catch (err) {
      console.error(err);
    }
  }

  if (ordersQueuePosition === null) {
    return null;
  }

  return (
    <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center mt-6">
      <h2 className="text-lg font-semibold">Sua Posição na Fila</h2>
      <p className="text-3xl font-bold mt-2">
        {ordersQueuePosition === 0 ? 'Você é o próximo!' : ordersQueuePosition}
      </p>
     { ordersQueuePosition > 0 && <p className="text-sm mt-2">Pedidos à sua frente</p> } 
    </div>
  );
}
