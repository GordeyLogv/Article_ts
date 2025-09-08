import { Request, Response, NextFunction } from 'express';

import { PersonRole } from '../authorization/common/enums/roles.enum.js';
import { HttpError } from '../common/errors/httpError.js';
import { IMiddleware } from './middleware.interface.js';

export class AuthRoleMiddleware implements IMiddleware {
    constructor(private roles: PersonRole[]) {}

    public execute(req: Request, res: Response, next: NextFunction): void {
        if (!req.user || !req.token) {
            return next(new HttpError(401, 'Авторизация не пройдена', 'AuthRoleMiddleware'));
        }

        if (!this.roles.includes(req.user.role)) {
            return next(new HttpError(403, 'Нет доступа', 'AuthRoleMiddleware'));
        }

        next();
    }
}
