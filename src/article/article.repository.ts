import { inject, injectable } from 'inversify';
import { ArticleInfoModel, ArticleModel } from '@prisma/client';

import { IArticleRepository } from './article.repositoty.interface.js';
import { TYPES } from '../types.js';
import { IDatabaseService } from '../common/databaseService/database.service.interface.js';
import { Article } from './article.entity.js';
import { ArticleUpdateDto } from './dto/article.update.dto.js';

@injectable()
export class ArticleRepository implements IArticleRepository {
    constructor(@inject(TYPES.DatabaseService) private databaseService: IDatabaseService) {}

    public async findAllArticles(): Promise<(ArticleModel & { articleInfo: ArticleInfoModel })[]> {
        return await this.databaseService.articleModel.findMany({
            include: { articleInfo: true },
        });
    }

    public async findById(id: number): Promise<(ArticleModel & { articleInfo: ArticleInfoModel }) | null> {
        return await this.databaseService.articleModel.findUnique({
            where: { id },
            include: { articleInfo: true },
        });
    }

    public async createArticle(article: Article): Promise<ArticleModel & { articleInfo: ArticleInfoModel }> {
        const persistenceData = article.toPersistence();

        return await this.databaseService.articleModel.create({
            data: {
                title: persistenceData.title,
                articleInfo: {
                    create: {
                        content: persistenceData.content,
                        imageUrl: persistenceData.imageUrl,
                        createdAt: persistenceData.createdAt,
                    },
                },
            },
            include: { articleInfo: true },
        });
    }

    public async updateArticle(
        id: number,
        dto: Partial<ArticleUpdateDto>,
    ): Promise<ArticleModel & { articleInfo: ArticleInfoModel }> {
        return await this.databaseService.articleModel.update({
            where: { id },
            data: {
                title: dto.title,
                articleInfo: {
                    update: {
                        content: dto.content,
                        imageUrl: dto.imageUrl,
                    },
                },
            },
            include: { articleInfo: true },
        });
    }

    public async deleteArticle(id: number): Promise<boolean> {
        const isDeleted = await this.databaseService.articleModel.delete({
            where: { id },
        });

        return isDeleted ? true : false;
    }
}
