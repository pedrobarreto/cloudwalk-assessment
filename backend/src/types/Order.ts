export interface Order {
  id: string;
  user_id: string;
  customer_id?: string | null;
  customer_name: string;
  total: number;
  created_at: string;
}
