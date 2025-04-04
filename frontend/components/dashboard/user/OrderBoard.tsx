"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/supabase-context';
import { BiTime } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

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
  insight?: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name?: string;
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
  const [infinitePayOpened, setInfinitePayOpened] = useState<Record<string, boolean>>({});
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
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
        if (newOrder.user_id === userId) {
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

 
  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    try {

      const orderIds = orders.map((o) => o.id);
      const { data: orderItemsData, error } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (error) {
        console.error('Erro ao buscar itens dos pedidos:', error.message);
        return;
      }

      const orderItems = orderItemsData as OrderItem[];

  
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders, orderItems }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error('Erro ao gerar insights:', errData.error);
        return;
      }


      const updatedOrders = await res.json();


      if (Array.isArray(updatedOrders)) {
        setOrders(updatedOrders);
      } else if (updatedOrders.orders && Array.isArray(updatedOrders.orders)) {
        setOrders(updatedOrders.orders);
      } else {
        console.error("Resposta inesperada da API:", updatedOrders);
      }
    } catch (err: any) {
      console.error('Erro ao gerar insights com IA:', err.message);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleSetStatus = async (
    orderId: string,
    newStatus: Order['status'],
    finalPrepTime?: number
  ) => {
    const fieldsToUpdate: Partial<Pick<Order, 'status' | 'preparation_time'>> = {
      status: newStatus,
    };
    if (typeof finalPrepTime !== 'undefined') {
      fieldsToUpdate.preparation_time = finalPrepTime;
    }
    await supabase.from('orders').update(fieldsToUpdate).eq('id', orderId);
  };

  const handlePaymentAction = (order: Order) => {
    if (!order.payment_method) return;

    if (order.payment_method === 'pix' || order.payment_method === 'dinheiro') {
      handleSetStatus(order.id, 'aguardando_preparo');
    } else if (order.payment_method === 'credit_card') {
      if (!infinitePayOpened[order.id]) {
        window.open(order.payment_link || '', '_blank');
        setInfinitePayOpened((prev) => ({ ...prev, [order.id]: true }));
      } else {
        handleSetStatus(order.id, 'aguardando_preparo');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Meus Pedidos</h1>
        <button
          onClick={handleGenerateInsights}
          disabled={loadingInsights}
          className={`bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors ${
            loadingInsights ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          }`}
        >
          {loadingInsights ? (
            <div className="flex items-center">
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              Carregando Insights...
            </div>
          ) : (
            'Gerar Insights com IA'
          )}
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.isArray(orders) &&
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              infinitePayOpened={infinitePayOpened[order.id] || false}
              onPaymentAction={handlePaymentAction}
              onSetStatus={handleSetStatus}
            />
          ))}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  infinitePayOpened,
  onPaymentAction,
  onSetStatus,
}: {
  order: Order;
  infinitePayOpened: boolean;
  onPaymentAction: (order: Order) => void;
  onSetStatus: (
    orderId: string,
    newStatus: Order['status'],
    finalPrepTime?: number
  ) => void;
}) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [finalTime, setFinalTime] = useState<number | null>(null);

  const showPaymentButton = order.status === 'aguardando_pagamento';
  const showIniciarPedido = order.status === 'aguardando_preparo';
  const showFinalizarPedido = order.status === 'em_preparacao';
  const showMarcarEntregue = order.status === 'pronto';

  useEffect(() => {
    if (order.status === 'em_preparacao' && finalTime === null) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [order.status, finalTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleIniciarPedido = async () => {
    setTimeElapsed(0);
    setFinalTime(null);
    onSetStatus(order.id, 'em_preparacao');
  };

  const handleFinalizarPedido = async () => {
    setTimerActive(false);
    setFinalTime(timeElapsed);
    await onSetStatus(order.id, 'pronto', timeElapsed);
  };

  const handleMarcarEntregue = async () => {
    await onSetStatus(order.id, 'entregue');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getPaymentButtonLabel = () => {
    if (order.payment_method === 'pix') return 'Confirmar Pix';
    if (order.payment_method === 'dinheiro') return 'Confirmar Dinheiro';
    if (order.payment_method === 'credit_card') {
      return infinitePayOpened ? 'Confirmar Pagamento' : 'Pagar com InfiniteTap';
    }
    return 'Confirmar Pagamento';
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900 mb-1">Pedido #{order.id.slice(0, 6)}</p>
          <p className="text-sm text-gray-500">Cliente: {order.customer_name}</p>
          <p className="text-sm text-gray-500">
            Total: R$ {order.total ? order.total.toFixed(2) : '0.00'}
          </p>
          {order.preparation_time != null && (
            <p className="text-sm text-gray-500">
              Tempo de preparo do prato: {(order.preparation_time / 60).toFixed(0)} min
            </p>
          )}
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-md">
          <span className="text-xs font-medium text-indigo-700">
            {statusLabels[order.status] || 'Indefinido'}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {order.status === 'em_preparacao' && (
          <div className="inline-flex items-center gap-1">
            <BiTime className="text-red-600 text-lg" />
            <span className="font-semibold text-red-600">
              Tempo de preparo: {formatTime(timeElapsed)}
            </span>
          </div>
        )}
        {finalTime !== null && order.status === 'pronto' && (
          <div className="inline-flex items-center gap-1">
            <BiTime className="text-green-600 text-lg" />
            <span className="font-semibold text-green-600">
              Tempo final de preparo: {formatTime(finalTime)}
            </span>
          </div>
        )}
      </div>

      {order.insight && (
        <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md mt-4">
          <p className="text-sm text-gray-800 font-semibold mb-1">Insights Técnicos:</p>
          <p className="text-sm text-gray-700">{order.insight}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-end mt-2">
        {showPaymentButton && (
          <button
            onClick={() => onPaymentAction(order)}
            className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {getPaymentButtonLabel()}
          </button>
        )}
        {showIniciarPedido && (
          <button
            onClick={handleIniciarPedido}
            className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Iniciar Pedido
          </button>
        )}
        {showFinalizarPedido && (
          <button
            onClick={handleFinalizarPedido}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Finalizar Pedido
          </button>
        )}
        {showMarcarEntregue && (
          <button
            onClick={handleMarcarEntregue}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Marcar Entregue
          </button>
        )}
      </div>
    </div>
  );
}
