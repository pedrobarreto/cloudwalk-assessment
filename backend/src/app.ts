import express from 'express';
import { routes } from './routes';

const app = express();
app.use(express.json());

routes.forEach(({ method, path, middleware, controller }) => {
  app[method](path, ...middleware, controller);
});

export default app;
