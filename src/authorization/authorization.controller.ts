import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { BaseController } from '../common/base.controller.js';
import { IAuthController } from './authorization.controller.interface.js';
import { TYPES } from '../types.js';
import { ILoggerService } from '../common/loggerService/logger.service.interface.js';
import { IExceptionFilter } from '../common/errors/exception.filter.interface.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { IAuthService } from './authorization.service.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { IValidationMiddlewareFactory } from '../middleware/middleware.validation.factory.interface.js';

@injectable()
export class AuthController extends BaseController implements IAuthController {
    constructor(
        @inject(TYPES.LoggerService) loggerService: ILoggerService,
        @inject(TYPES.ExceptionFilter) exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.AuhtorizationService) private authService: IAuthService,
        @inject(TYPES.ValidationMiddlewareFactory) private validateMiddleware: IValidationMiddlewareFactory,
    ) {
        super(loggerService, exceptionFilter);

        this.bindRouters([
            {
                path: '/register',
                method: 'post',
                func: this.register.bind(this),
                middleware: [this.validateMiddleware.create(AuthRegisterDto)],
            },
            {
                path: '/login',
                method: 'post',
                func: this.login.bind(this),
                middleware: [this.validateMiddleware.create(AuthLoginDto)],
            },
        ]);
    }

    public async register(
        { body }: Request<object, object, AuthRegisterDto>,
        res: Response,
        _next: NextFunction,
    ): Promise<void> {
        const findPerson = await this.authService.findPersonByEmail(body.email);

        if (findPerson) {
            this.fail(res, `Пользователь с email - ${body.email} уже зарегистрирован`);
        }

        await this.authService.registerPerson(body);

        this.created(res, { message: 'Регистрация прошла успешно' });
    }

    public async login({ body }: Request<object, object, AuthLoginDto>, res: Response, _next: NextFunction): Promise<void> {
        const isValid = await this.authService.loginPerson(body);

        if (!isValid || typeof isValid === 'boolean') {
            return this.fail(res, 'Не верный email или пароль');
        }

        const token = this.authService.createToken(
            isValid,
            this.configService.access_token_secret,
            this.configService.expiresInSecond,
        );

        this.ok(res, { token });
    }
}
