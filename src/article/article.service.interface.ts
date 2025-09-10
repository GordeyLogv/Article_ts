import { ArticleInfoModel, ArticleModel } from '@prisma/client';

import { ArticleUpdateDto } from './dto/article.update.dto.js';
import { ArticleCreateDto } from './dto/article.create.dto.js';

export interface IArticleService {
    findAll: () => Promise<(ArticleModel & { articleInfo: ArticleInfoModel })[]>;
    findById: (id: number) => Promise<(ArticleModel & { articleInfo: ArticleInfoModel }) | null>;
    create: (dto: ArticleCreateDto) => Promise<ArticleModel & { articleInfo: ArticleInfoModel }>;
    update: (id: number, dto: ArticleUpdateDto) => Promise<ArticleModel & { articleInfo: ArticleInfoModel }>;
    delete: (id: number) => Promise<boolean>;
}
