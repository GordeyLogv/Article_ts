import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { BaseController } from '../common/base.controller.js';
import { IArticleController } from './article.controller.interface.js';
import { TYPES } from '../types.js';
import { ILoggerService } from '../common/loggerService/logger.service.interface.js';
import { IExceptionFilter } from '../common/errors/exception.filter.interface.js';
import { IArticleService } from './article.service.interface.js';
import { IValidationMiddlewareFactory } from '../middleware/middleware.validation.factory.interface.js';
import { AuthMiddleware } from '../middleware/middleware.auth.js';
import { IAuthRoleMiddlewareFactory } from '../middleware/middleware.auth.role.factory.interface.js';
import { PersonRole } from '../authorization/common/enums/roles.enum.js';
import { ArticleUpdateDto } from './dto/article.update.dto.js';
import { ArticleCreateDto } from './dto/article.create.dto.js';

@injectable()
export class ArticleController extends BaseController implements IArticleController {
    constructor(
        @inject(TYPES.LoggerService) logger: ILoggerService,
        @inject(TYPES.ExceptionFilter) exceptionFilter: IExceptionFilter,
        @inject(TYPES.ArticleService) private articleService: IArticleService,
        @inject(TYPES.ValidationMiddlewareFactory) private validateMiddleware: IValidationMiddlewareFactory,
        @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware,
        @inject(TYPES.AuthRoleMiddlewareFactory) private authRoleMiddleware: IAuthRoleMiddlewareFactory,
    ) {
        super(logger, exceptionFilter);

        this.bindRouters([
            {
                path: '/articles',
                method: 'get',
                func: this.getAllArticles.bind(this),
                middleware: [],
            },
            {
                path: '/article/:id',
                method: 'get',
                func: this.getArticle.bind(this),
                middleware: [this.authMiddleware],
            },
            {
                path: '/article-new',
                method: 'post',
                func: this.createArticle.bind(this),
                middleware: [
                    this.authMiddleware,
                    this.authRoleMiddleware.create([PersonRole.MODERATOR, PersonRole.ADMIN]),
                    this.validateMiddleware.create(ArticleCreateDto),
                ],
            },
            {
                path: '/article/:id',
                method: 'put',
                func: this.updateArticle.bind(this),
                middleware: [
                    this.authMiddleware,
                    this.authRoleMiddleware.create([PersonRole.MODERATOR, PersonRole.ADMIN]),
                    this.validateMiddleware.create(ArticleUpdateDto),
                ],
            },
            {
                path: '/article/:id',
                method: 'delete',
                func: this.deleteArticle.bind(this),
                middleware: [this.authMiddleware, this.authRoleMiddleware.create([PersonRole.MODERATOR, PersonRole.ADMIN])],
            },
        ]);
    }

    public async getAllArticles(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const allArticles = await this.articleService.findAll();

        if (!allArticles) {
            return this.fail(res, 'Ошибка при загрузке статей, попробуйте позже');
        }

        this.ok(res, allArticles);
    }

    public async getArticle({ params }: Request<{ id: string }>, res: Response, _next: NextFunction): Promise<void> {
        const existedArticle = await this.articleService.findById(Number(params.id));

        if (!existedArticle) {
            return this.fail(res, `Статья с id ${params.id} - не найдена`);
        }

        this.ok(res, existedArticle);
    }

    public async createArticle(
        { body }: Request<object, object, ArticleCreateDto>,
        res: Response,
        _next: NextFunction,
    ): Promise<void> {
        const newArticle = await this.articleService.create(body);

        this.ok(res, newArticle);
    }

    public async updateArticle(
        { body, params }: Request<{ id: string }, object, ArticleUpdateDto>,
        res: Response,
        _next: NextFunction,
    ): Promise<void> {
        const update = await this.articleService.update(Number(params.id), body);

        this.ok(res, update);
    }

    public async deleteArticle({ params }: Request<{ id: string }>, res: Response, _next: NextFunction): Promise<void> {
        const isDeleted = await this.articleService.delete(Number(params.id));

        this.ok(res, { message: isDeleted });
    }
}
