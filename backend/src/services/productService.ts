import { supabase } from '../config/supabaseClient';
import { Product } from '../types/Product';

export const createProductService = async (productData: Partial<Product>): Promise<any> => {
  const { user_id, name, description, price, image_url } = productData;
  const { data, error } = await supabase
    .from('products')
    .insert([{ user_id, name, description, price, image_url }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getProductByIdService = async (id: string): Promise<any> => {
  const { data, error } = await supabase
    .from('products')
    .select()
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getProductsByUserService = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('products')
    .select()
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
};

export const updateProductService = async (id: string, productData: Partial<Product>): Promise<any> => {
  const { name, description, price, image_url } = productData;
  const { data, error } = await supabase
    .from('products')
    .update({ name, description, price, image_url })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteProductService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
};

export const getProductsByBrandService = async (brand: string): Promise<{ user_id: string; products: any[] }> => {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('brand', brand)
    .single();

  if (userError || !user) {
    throw new Error('Marca não encontrada');
  }

  const { data: products, error } = await supabase
    .from('products')
    .select()
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  return { user_id: user.id, products };
};
