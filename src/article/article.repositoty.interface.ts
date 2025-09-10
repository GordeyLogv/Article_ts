import { ArticleInfoModel, ArticleModel } from '@prisma/client';

import { ArticleUpdateDto } from './dto/article.update.dto.js';
import { Article } from './article.entity.js';

export interface IArticleRepository {
    findAllArticles: () => Promise<(ArticleModel & { articleInfo: ArticleInfoModel })[]>;
    findById: (id: number) => Promise<(ArticleModel & { articleInfo: ArticleInfoModel }) | null>;
    createArticle: (article: Article) => Promise<ArticleModel & { articleInfo: ArticleInfoModel }>;
    updateArticle: (id: number, dto: Partial<ArticleUpdateDto>) => Promise<ArticleModel & { articleInfo: ArticleInfoModel }>;
    deleteArticle: (id: number) => Promise<boolean>;
}
