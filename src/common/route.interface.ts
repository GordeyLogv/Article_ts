import { Request, Response, NextFunction, Router } from 'express';

import { IMiddleware } from '../middleware/middleware.interface.js';

export interface IControllerRoute<Params = any, Body = any, Query = any> {
    path: string;
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete'>;
    func: (req: Request<Params, any, Body, Query>, res: Response, next: NextFunction) => void | Promise<void>;
    middleware?: IMiddleware[];
}
