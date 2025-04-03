import { Request, Response } from 'express';
import * as orderService from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await orderService.createOrderService(req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    if (
      error.message === 'Pedido deve conter pelo menos um item' ||
      error.message === 'order_id é obrigatório'
    ) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Não autenticado') {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderByIdService(req.params.id);
    return res.json(order);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.updateOrderService(req.params.id, req.body);
    return res.json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await orderService.deleteOrderService(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getOrdersByUserOrCustomer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const orders = await orderService.getOrdersByUserOrCustomerService(userId);
    return res.json(orders);
  } catch (error: any) {
    if (error.message === 'User is neither owner nor customer') {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
