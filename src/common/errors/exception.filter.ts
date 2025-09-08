import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { IExceptionFilter } from './exception.filter.interface.js';
import { TYPES } from '../../types.js';
import { ILoggerService } from '../loggerService/logger.service.interface.js';
import { HttpError } from './httpError.js';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
    constructor(@inject(TYPES.LoggerService) private loggerService: ILoggerService) {
        this.loggerService.info('[ExceptionFilter] - загружен');
    }

    public catch(err: unknown, req: Request, res: Response, _next: NextFunction) {
        if (err instanceof HttpError) {
            this.loggerService.error(`Ошибка ${err.statusCode} - ${err.message} - ${err.contex}`);
            res.status(err.statusCode);
            res.json({
                status: 'error',
                message: err.message,
                context: err.contex,
                errors: err.details,
            });
        } else if (err instanceof Error) {
            this.loggerService.error(`[ExceptionFilter] - ${err.message}`);
            res.status(500);
            res.json({
                status: 'error',
                message: err.message,
            });
        } else {
            this.loggerService.error(`[ExceptionFilter] - неизвестная ошибка`);
            res.status(500);
            res.json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    }
}
