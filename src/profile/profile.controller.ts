import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { BaseController } from '../common/base.controller.js';
import { IProfileController } from './profile.controller.interface.js';
import { TYPES } from '../types.js';
import { ILoggerService } from '../common/loggerService/logger.service.interface.js';
import { IExceptionFilter } from '../common/errors/exception.filter.interface.js';
import { IProfileService } from './profile.service.interface.js';
import { ProfileUpdateDto } from './dto/profile.update.dto.js';
import { IValidationMiddlewareFactory } from '../middleware/middleware.validation.factory.interface.js';
import { AuthMiddleware } from '../middleware/middleware.auth.js';
@injectable()
export class ProfileController extends BaseController implements IProfileController {
    constructor(
        @inject(TYPES.LoggerService) logger: ILoggerService,
        @inject(TYPES.ExceptionFilter) exceptionFilter: IExceptionFilter,
        @inject(TYPES.ProfileService) private profileService: IProfileService,
        @inject(TYPES.ValidationMiddlewareFactory) private validateMiddleware: IValidationMiddlewareFactory,
        @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware,
    ) {
        super(logger, exceptionFilter);

        this.bindRouters([
            {
                path: '/profile',
                method: 'get',
                func: this.profile.bind(this),
                middleware: [this.authMiddleware],
            },
            {
                path: '/profile',
                method: 'put',
                func: this.update.bind(this),
                middleware: [this.authMiddleware, this.validateMiddleware.create(ProfileUpdateDto)],
            },
            {
                path: '/profile',
                method: 'delete',
                func: this.delete.bind(this),
                middleware: [this.authMiddleware],
            },
            {
                path: '/profile',
                method: 'post',
                func: this.logout.bind(this),
                middleware: [this.authMiddleware],
            },
        ]);
    }

    public profile({ user }: Request, res: Response, _next: NextFunction): void {
        this.ok(res, user);
    }

    public async update(
        { user, token, body }: Request<object, object, ProfileUpdateDto>,
        res: Response,
        _next: NextFunction,
    ): Promise<void> {
        const newToken = await this.profileService.updateProfile(user, token, body);

        this.ok(res, { message: newToken });
    }

    public async delete({ user, token }: Request, res: Response, _next: NextFunction): Promise<void> {
        const isDeleted = await this.profileService.deleteProfile(user.id, token);

        this.ok(res, { message: isDeleted });
    }

    public async logout({ token }: Request, res: Response, _next: NextFunction): Promise<void> {
        const isLogout = await this.profileService.logout(token);

        this.ok(res, { message: isLogout });
    }
}
