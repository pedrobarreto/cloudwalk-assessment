import express from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

routes.forEach(({ method, path, middleware, controller }) => {
  app[method](path, ...middleware, controller);
});

export default app;
