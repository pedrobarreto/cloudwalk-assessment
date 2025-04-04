'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  user_id: string;
  customer_id?: string;
  customer_name?: string;
  total: number;
  items: OrderItem[];
}

interface OrderContextProps {
  order: OrderData | null;
  setOrder: (order: OrderData) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderData | null>(null);

  const clearOrder = () => setOrder(null);

  return (
    <OrderContext.Provider value={{ order, setOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
