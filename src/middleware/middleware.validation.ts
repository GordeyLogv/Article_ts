import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';

import { IMiddleware } from './middleware.interface.js';
import { HttpError } from '../common/errors/httpError.js';

export class ValidationMiddleare implements IMiddleware {
    constructor(private classToValidator: ClassConstructor<object>) {}

    public execute({ body }: Request, res: Response, next: NextFunction): void {
        const instance = plainToInstance(this.classToValidator, body);

        validate(instance)
            .then((errors) => {
                if (errors.length > 0) {
                    const messages = errors.map((err) => ({
                        property: err.property,
                        constraints: err.constraints,
                    }));
                    return next(new HttpError(422, 'Ошибка валидации данных', 'ValidateMiddleware', messages));
                }
                next();
            })
            .catch((err) =>
                next(
                    new HttpError(
                        422,
                        'Ошибка валидации данных',
                        'ValidationMiddleware',
                        err instanceof Error ? err.message : err,
                    ),
                ),
            );
    }
}
