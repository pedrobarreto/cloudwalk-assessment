import { AppRoute } from '../types/route';
import {
  createProduct,
  getProductById,
  getProductsByUser,
  updateProduct,
  deleteProduct,
  getProductsByBrand,
} from '../controllers/productsController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const productsRoutes: AppRoute[] = [
  {
    method: 'post',
    path: '/products',
    middleware: [authMiddleware],
    controller: createProduct,
  },
  {
    method: 'get',
    path: '/products',
    middleware: [authMiddleware],
    controller: getProductsByUser,
  },
  {
    method: 'get',
    path: '/products/:id',
    middleware: [authMiddleware],
    controller: getProductById,
  },
  {
    method: 'put',
    path: '/products/:id',
    middleware: [authMiddleware],
    controller: updateProduct,
  },
  {
    method: 'delete',
    path: '/products/:id',
    middleware: [authMiddleware],
    controller: deleteProduct,
  },
  {
    method: 'get',
    path: '/:brand',
    middleware: [],
    controller: getProductsByBrand
  }
];
