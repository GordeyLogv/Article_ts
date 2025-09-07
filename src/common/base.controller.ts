import { inject } from 'inversify';
import { Router, Request, Response, NextFunction } from 'express';

import { TYPES } from '../types.js';
import { ILoggerService } from './loggerService/logger.service.interface.js';
import { IControllerRoute } from './route.interface.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';

export abstract class BaseController {
    private readonly _router: Router;

    constructor(
        @inject(TYPES.LoggerService) protected loggerService: ILoggerService,
        @inject(TYPES.ExceptionFilter) protected exceptionFilter: IExceptionFilter,
    ) {
        this._router = Router();
    }

    public get router() {
        return this._router;
    }

    protected bindRouters(routes: IControllerRoute[]) {
        for (const route of routes) {
            this.loggerService.info(`${route.method.toUpperCase()} - ${route.path}`);

            const middleware = route.middleware?.map((m) => m.execute.bind(m));

            const handler = async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await route.func.call(this, req, res, next);
                } catch (error) {
                    this.exceptionFilter.catch(error, req, res, next);
                }
            };

            const pipeline = middleware ? [...middleware, handler] : handler;

            this.router[route.method](route.path, pipeline);
        }
    }

    protected ok<T>(res: Response, data: T): void {
        res.status(200);
        res.json(data);
    }

    protected created<T>(res: Response, data: T): void {
        res.status(201);
        res.json(data);
    }

    protected fail(res: Response, message: string): void {
        res.status(400);
        res.json({ status: 'error', message });
    }
}
