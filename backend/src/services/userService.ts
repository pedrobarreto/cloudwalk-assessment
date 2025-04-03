import { supabase } from '../config/supabaseClient';
import { CreateUserParams } from '../types/User';

export async function createUser(userData: CreateUserParams) {
  if (userData.role === 'user') {
    const { name, email, password, cnpj, brand, approved_payment_methods } = userData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user',
          cnpj,
          brand,
          approved_payment_methods
        }
      }
    });
    if (error) throw new Error(error.message);
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name,
          email,
          role: 'user',
          cnpj,
          approved_payment_methods,
          brand
        })
        .single();
      if (insertError) throw new Error(insertError.message);
    }
    return {
      message: 'User created',
      user: data.user,
      session: data.session
    };
  } else {
    const { phone, name } = userData;
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true,
        data: { role: 'customer', name }
      }
    });
    if (error) throw new Error(error.message);
    return {
      message: 'Verification code sent via SMS'
    };
  }
}


export async function loginOwner(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw new Error(error.message);
  return {
    message: 'User login successful',
    user: data.user,
    session: data.session
  };
}

export async function verifyCodeAndLogin(phone: string, code: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: 'sms'
  });
  if (error) throw new Error(error.message);
  if (data.user) {
    const { id } = data.user;
    const { error: insertError } = await supabase
      .from('customers')
      .upsert({
        id,
        phone,
        role: 'customer'
      })
      .single();
    if (insertError) throw new Error(insertError.message);
  }
  return {
    message: 'Customer login successful',
    user: data.user,
    session: data.session
  };
}
