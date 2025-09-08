import { ClassConstructor } from 'class-transformer';

import { IMiddleware } from './middleware.interface.js';

export interface IValidationMiddlewareFactory {
    create: (dto: ClassConstructor<object>) => IMiddleware;
}
