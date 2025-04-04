"use client";

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSupabase } from '@/contexts/supabase-context';

const STORE_STATUS_ID = 1;

type StoreStatusRow = {
  id: number;
  interrupt: boolean;
};

export default function StoreClosedModal() {
  const supabase = useSupabase();
  const [interrupt, setInterrupt] = useState(false);

  useEffect(() => {
    fetchInitialStatus();

    const channel = supabase
      .channel('store-closed-modal')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_status',
          filter: `id=eq.${STORE_STATUS_ID}`,
        },
        (payload) => {
          const newVal = payload.new as StoreStatusRow;
          setInterrupt(newVal.interrupt);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function fetchInitialStatus() {
    const { data, error } = await supabase
      .from('store_status')
      .select('interrupt')
      .eq('id', STORE_STATUS_ID)
      .single();

    if (!error && data) {
      setInterrupt(data.interrupt);
    }
  }

  if (!interrupt) return null;

  return (
    <Transition show={interrupt} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-60"
          leave="ease-in duration-200"
          leaveFrom="opacity-60"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="mx-auto max-w-sm w-full rounded-lg bg-white p-6 text-center shadow-lg">
              <Dialog.Title className="text-xl font-bold text-red-600">
                Loja Temporariamente Desativada
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mt-2 text-sm">
                Estamos recebendo muitos pedidos no momento e pausamos novos pedidos
                temporariamente. Agradecemos sua compreensão e retomaremos o serviço
                em breve.
              </Dialog.Description>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Por favor, tente novamente mais tarde.
                </p>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
