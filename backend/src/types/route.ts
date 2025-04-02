import { Request, Response, NextFunction } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface AppRoute {
  method: HttpMethod;
  path: string;
  middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
  controller: (req: Request, res: Response) => any | Promise<any>;
}
