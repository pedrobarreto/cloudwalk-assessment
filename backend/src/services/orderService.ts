import { supabase } from '../config/supabaseClient';
import { Order } from '../types/Order';

export const createOrderService = async (orderData: any): Promise<{ order: any; items: any[] }> => {
  const {
    user_id,
    customer_id,
    customer_name,
    total,
    order_items,
    payment_method,
    payment_link,
    order_id
  } = orderData;

  if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
    throw new Error('Pedido deve conter pelo menos um item');
  }
  if (!user_id) {
    throw new Error('Não autenticado');
  }
  if (!order_id) {
    throw new Error('order_id é obrigatório');
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        id: order_id,
        user_id,
        customer_id,
        customer_name,
        total,
        payment_method,
        payment_link
      }
    ])
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || 'Erro ao criar pedido');
  }

  const itemsToInsert = order_items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return { order, items: itemsToInsert };
};

export const getOrderByIdService = async (id: string): Promise<any> => {
  const { data, error } = await supabase.from('orders').select().eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateOrderService = async (id: string, updateData: Partial<Order>): Promise<any> => {
  const { customer_id, customer_name, total } = updateData;
  const { data, error } = await supabase
    .from('orders')
    .update({ customer_id, customer_name, total })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteOrderService = async (id: string): Promise<void> => {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const getOrdersByUserOrCustomerService = async (userId: string): Promise<any[]> => {
  const { data: ownerData } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (ownerData) {
    const { data, error } = await supabase
      .from('orders')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  const { data: customerData } = await supabase
    .from('customers')
    .select('id')
    .eq('id', userId)
    .single();

  if (customerData) {
    const { data, error } = await supabase
      .from('orders')
      .select()
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  throw new Error('User is neither owner nor customer');
};
