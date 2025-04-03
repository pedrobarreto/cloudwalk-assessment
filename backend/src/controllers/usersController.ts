import { Request, Response } from 'express';
import {
  createUser as createUserService,
  loginOwner,
  verifyCodeAndLogin
} from '../services/userService';

export async function createUser(req: Request, res: Response) {
  try {
    const { role, name, email, password, phone, cnpj, approved_payment_methods, brand } = req.body;
    const result = await createUserService(
      role === 'user'
        ? { role: 'user', name, email, password, cnpj, approved_payment_methods, brand }
        : { role: 'customer', phone, name }
    );
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginOwner(email, password);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
}

export async function verifyCodeAndLoginController(req: Request, res: Response) {
  try {
    const { phone, code } = req.body;
    const result = await verifyCodeAndLogin(phone, code);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    return res.status(200).json({ message: 'getUserById not implemented' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    return res.status(200).json({ message: 'updateUser not implemented' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    return res.status(204).json({ message: 'deleteUser not implemented' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
