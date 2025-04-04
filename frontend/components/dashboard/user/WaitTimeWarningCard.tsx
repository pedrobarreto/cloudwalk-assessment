"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/supabase-context';
import { BiErrorCircle } from 'react-icons/bi';

type Order = {
  id: string;
  user_id: string;
  status: 'aguardando_pagamento' | 'aguardando_preparo' | 'em_preparacao' | 'pronto' | 'entregue';
  preparation_time?: number | null;
};

type StoreStatusRow = {
  id: number;
  interrupt: boolean;
};

const STORE_STATUS_ID = 1;

export default function WaitTimeWarningCard() {
  const supabase = useSupabase();
  const [showWarning, setShowWarning] = useState(false);
  const [storeInterrupted, setStoreInterrupted] = useState(false);

  useEffect(() => {
    fetchInitialData();

    const storeChannel = supabase
      .channel('store_status_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_status', filter: `id=eq.${STORE_STATUS_ID}` },
        (payload) => {
          const newVal = payload.new as StoreStatusRow;
          setStoreInterrupted(newVal.interrupt);
        }
      )
      .subscribe();

    const ordersChannel = supabase
      .channel('orders_waittime_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        checkPrepTimes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(storeChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [supabase]);

  async function fetchInitialData() {
    await fetchStoreStatus();
    await checkPrepTimes();
  }

  async function fetchStoreStatus() {
    const { data, error } = await supabase
      .from('store_status')
      .select('id, interrupt')
      .eq('id', STORE_STATUS_ID)
      .single();

    if (!error && data) {
      setStoreInterrupted(data.interrupt);
    }
  }

  async function checkPrepTimes() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, preparation_time')
        .eq('status', 'em_preparacao');

      if (error || !data) return;

      const hasLongPrepTime = data.some(
        (order: Order) =>
          typeof order.preparation_time === 'number' && order.preparation_time > 1200
      );

      setShowWarning(hasLongPrepTime);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInterruptStore(interrupt: boolean) {
    const { error } = await supabase
      .from('store_status')
      .update({ interrupt })
      .eq('id', STORE_STATUS_ID);
  
    if (error) {

      console.error('Erro ao atualizar store_status:', error);
    } else {
      setStoreInterrupted(interrupt);
    }
  }
  

  if (!showWarning) return null;

  return (
    <div className="bg-white p-6 border-l-4 border-red-600 rounded-lg shadow-lg flex flex-col space-y-3">
      <div className="flex items-center gap-2">
        <BiErrorCircle className="text-red-600 text-2xl" />
        <h2 className="text-red-700 font-bold text-lg">
          Tempo de Preparo Excedeu 20 Minutos
        </h2>
      </div>
      <p className="text-sm text-gray-700">
        Um ou mais pedidos estão em preparação por mais de 20 minutos. Você pode interromper
        temporariamente o recebimento de novos pedidos até que o tempo fique normalizado.
      </p>
      {!storeInterrupted ? (
        <button
          onClick={() => handleInterruptStore(true)}
          className="bg-red-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-red-700 w-fit"
        >
          Interromper Novos Pedidos
        </button>
      ) : (
        <>
          <p className="text-sm text-red-700">
            Novos pedidos estão temporariamente interrompidos.
          </p>
          <button
            onClick={() => handleInterruptStore(false)}
            className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 w-fit"
          >
            Retomar Novos Pedidos
          </button>
        </>
      )}
 
    </div>
  );
}

