import { AppRoute } from '../types/route';
import { usersRoutes } from './usersRoutes';
import { ordersRoutes } from './ordersRoutes';
import { productsRoutes } from './productRoutes';
import { insightsRoutes } from './insightsRoutes';

export const routes: AppRoute[] = [
  ...usersRoutes,
  ...ordersRoutes,
  ...productsRoutes,
  ...insightsRoutes
];
