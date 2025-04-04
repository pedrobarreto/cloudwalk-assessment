import { AppRoute } from '../types/route';
import { generateProductInsights, generateOrderInsights } from '../controllers/insightsController';;

export const insightsRoutes: AppRoute[] = [
  {
    method: 'post',
    path: '/insights/product',
    middleware: [],
    controller: generateProductInsights
  },
  {
    method: 'post',
    path: '/insights/order',
    middleware: [],
    controller: generateOrderInsights
  }
];
