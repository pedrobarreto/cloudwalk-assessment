import { AppRoute } from '../types/route';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  verifyCodeAndLoginController
} from '../controllers/usersController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const usersRoutes: AppRoute[] = [
  {
    method: 'post',
    path: '/users',
    middleware: [],
    controller: createUser
  },
  {
    method: 'post',
    path: '/login',
    middleware: [],
    controller: login
  },
  {
    method: 'post',
    path: '/verify-sms',
    middleware: [],
    controller: verifyCodeAndLoginController
  },
  {
    method: 'get',
    path: '/users/:id',
    middleware: [authMiddleware],
    controller: getUserById
  },
  {
    method: 'put',
    path: '/users/:id',
    middleware: [authMiddleware],
    controller: updateUser
  },
  {
    method: 'delete',
    path: '/users/:id',
    middleware: [authMiddleware],
    controller: deleteUser
  }
];
