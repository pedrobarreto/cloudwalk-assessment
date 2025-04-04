'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/supabase-context';

interface OrdersStatsProps {
  userId: string;
}

export default function OrdersStats({ userId }: OrdersStatsProps) {
  const supabase = useSupabase();
  const [totalOrdersDelivered, setTotalOrdersDelivered] = useState(0);
  const [totalRevenueDelivered, setTotalRevenueDelivered] = useState(0);
  const [avgPrepTime, setAvgPrepTime] = useState<number | null>(null);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const insights = [
    {
      title: 'Insight de Vendas',
      text: 'Tente focar em promoções às sextas-feiras para aumentar o volume de pedidos.',
    },
    {
      title: 'Insight de Clientes',
      text: 'Clientes fiéis geralmente retornam em até 2 semanas. Um programa de fidelidade pode mantê-los interessados.',
    },
    {
      title: 'Insight de Tempo',
      text: 'Pedidos feitos à noite têm um tempo de preparo maior. Considere reforçar a equipe no período noturno.',
    },
  ];

  useEffect(() => {
    fetchOrdersData();
    const channel = supabase
      .channel('orders-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrdersData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  async function fetchOrdersData() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total, status, preparation_time')
        .eq('user_id', userId);

      if (error || !data) return;

      const deliveredOrders = data.filter((order) => order.status === 'entregue');
      setTotalOrdersDelivered(deliveredOrders.length);

      const totalRevenue = deliveredOrders.reduce((acc, order) => acc + (order.total || 0), 0);
      setTotalRevenueDelivered(totalRevenue);

      const prepTimesInSeconds = deliveredOrders
        .filter((o) => typeof o.preparation_time === 'number')
        .map((o) => o.preparation_time as number);

      if (prepTimesInSeconds.length > 0) {
        const avgSeconds =
          prepTimesInSeconds.reduce((acc, val) => acc + val, 0) / prepTimesInSeconds.length;
        const avgMinutes = avgSeconds / 60;
        setAvgPrepTime(avgMinutes);
      } else {
        setAvgPrepTime(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleDotClick(index: number) {
    setCurrentInsightIndex(index);
  }

  return (
    <div className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold">Pedidos Entregues</h2>
        <p className="text-3xl font-bold mt-2">{totalOrdersDelivered}</p>
      </div>

      <div className="bg-green-600 text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold">Receita Total</h2>
        <p className="text-3xl font-bold mt-2">
          {totalRevenueDelivered.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
      </div>

      <div className="bg-yellow-600 text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold">Tempo Médio (min)</h2>
        <p className="text-3xl font-bold mt-2">
          {avgPrepTime !== null ? avgPrepTime.toFixed(2) : '--'}
        </p>
      </div>

      {/* <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-2">Insights (IA)</h2>
        <div className="text-sm text-center px-2 flex-1 flex flex-col justify-center">
          <p className="font-bold">{insights[currentInsightIndex].title}</p>
          <p className="mt-1">{insights[currentInsightIndex].text}</p>
        </div>
        <div className="flex gap-1 mt-3">
          {insights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentInsightIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
}
