import { AppRoute } from '../types/route';
import {
  createOrder,
  getOrderById,
  getOrdersByUserOrCustomer,
  updateOrder,
  deleteOrder
} from '../controllers/ordersController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const ordersRoutes: AppRoute[] = [
  {
    method: 'post',
    path: '/orders',
    middleware: [],
    controller: createOrder
  },
  {
    method: 'get',
    path: '/orders',
    middleware: [authMiddleware],
    controller: getOrdersByUserOrCustomer
  },
  {
    method: 'get',
    path: '/orders/:id',
    middleware: [authMiddleware],
    controller: getOrderById
  },
  {
    method: 'put',
    path: '/orders/:id',
    middleware: [authMiddleware],
    controller: updateOrder
  },
  {
    method: 'delete',
    path: '/orders/:id',
    middleware: [authMiddleware],
    controller: deleteOrder
  }
];
