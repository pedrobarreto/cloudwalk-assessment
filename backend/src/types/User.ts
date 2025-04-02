export type OwnerUser = {
  role: 'user';
  name: string;
  email: string;
  password: string;
};

export type CustomerUser = {
  role: 'customer';
  phone: string;
};

export type CreateUserParams = OwnerUser | CustomerUser;