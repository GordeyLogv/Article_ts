import { injectable } from 'inversify';
import { ClassConstructor } from 'class-transformer';

import { IValidationMiddlewareFactory } from './middleware.validation.factory.interface.js';
import { IMiddleware } from './middleware.interface.js';
import { ValidationMiddleare } from './middleware.validation.js';

@injectable()
export class ValidationMiddlewareFactore implements IValidationMiddlewareFactory {
    public create(dto: ClassConstructor<object>): IMiddleware {
        return new ValidationMiddleare(dto);
    }
}
