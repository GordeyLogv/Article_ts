import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { IMiddleware } from './middleware.interface.js';
import { TYPES } from '../types.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { HttpError } from '../common/errors/httpError.js';

@injectable()
export class AuthMiddleware implements IMiddleware {
    constructor(
        @inject(TYPES.JwtService) private jwtService: IJwtService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {}

    public execute(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new HttpError(401, 'Авторизация не пройдена', 'AuthMiddleware'));
        }

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return next(new HttpError(401, 'Невалидный заголовок/токен', 'AuthMiddleware'));
        }

        this.jwtService
            .decodedToken(token, this.configService.access_token_secret)
            .then((user) => {
                if (!user) {
                    return next(new HttpError(401, 'Неверный или просроченный токен', 'AuthMiddleware'));
                }

                req.token = token;
                req.user = user;
                next();
            })
            .catch((err) =>
                next(
                    new HttpError(
                        401,
                        'Авторизация не пройдена',
                        'AuthMiddleware',
                        err instanceof Error ? err.message : err,
                    ),
                ),
            );
    }
}
