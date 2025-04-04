import { AppRoute } from '../types/route';
import { generateProductInsights } from '../controllers/insightsController';

export const insightsRoutes: AppRoute[] = [
  {
    method: 'post',
    path: '/insights',
    middleware: [],
    controller: generateProductInsights
  }
];
