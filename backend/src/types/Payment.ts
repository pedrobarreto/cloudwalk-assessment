export type PaymentMethod = 'pix' | 'credit_card' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  installments: number;
  status: PaymentStatus;
  transaction_id?: string;
  paid_at?: string;
  created_at: string;
}
