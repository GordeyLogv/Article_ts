import { Request, Response, NextFunction } from 'express';

import { ArticleCreateDto } from './dto/article.create.dto.js';
import { ArticleUpdateDto } from './dto/article.update.dto.js';

export interface IArticleController {
    getAllArticles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getArticle: ({ params }: Request<{ id: string }>, res: Response, next: NextFunction) => Promise<void>;
    createArticle: ({ body }: Request<object, object, ArticleCreateDto>, res: Response, next: NextFunction) => Promise<void>;
    updateArticle: (
        { body, params }: Request<{ id: string }, object, ArticleUpdateDto>,
        res: Response,
        next: NextFunction,
    ) => Promise<void>;
    deleteArticle: ({ params }: Request<{ id: string }>, res: Response, next: NextFunction) => Promise<void>;
}
