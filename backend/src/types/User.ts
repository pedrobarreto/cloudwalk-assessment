export type OwnerUser = {
  role: 'user';
  name: string;
  email: string;
  password: string;
  cnpj: string;
  brand: string;
  approved_payment_methods: ('pix' | 'dinheiro' | 'credit_card')[];
};


export type CustomerUser = {
  name: string;
  role: 'customer';
  phone: string;
};

export type CreateUserParams = OwnerUser | CustomerUser;