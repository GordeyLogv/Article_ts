import { inject, injectable } from 'inversify';
import { ArticleInfoModel, ArticleModel } from '@prisma/client';

import { IArticleService } from './article.service.interface.js';
import { TYPES } from '../types.js';
import { IArticleRepository } from './article.repositoty.interface.js';
import { Article } from './article.entity.js';
import { ArticleCreateDto } from './dto/article.create.dto.js';
import { ArticleUpdateDto } from './dto/article.update.dto.js';

@injectable()
export class ArticleService implements IArticleService {
    constructor(@inject(TYPES.ArticleRepository) private articleRepository: IArticleRepository) {}

    public async findAll(): Promise<(ArticleModel & { articleInfo: ArticleInfoModel })[]> {
        return await this.articleRepository.findAllArticles();
    }

    public async findById(id: number): Promise<(ArticleModel & { articleInfo: ArticleInfoModel }) | null> {
        return await this.articleRepository.findById(id);
    }

    public async create(dto: ArticleCreateDto): Promise<ArticleModel & { articleInfo: ArticleInfoModel }> {
        const newArticle = new Article(dto.title, dto.content, dto.imageUrl);

        return await this.articleRepository.createArticle(newArticle);
    }

    public async update(
        id: number,
        dto: Partial<ArticleUpdateDto>,
    ): Promise<ArticleModel & { articleInfo: ArticleInfoModel }> {
        const oldDataArticle = await this.articleRepository.findById(id);

        const newDataArticle: Partial<ArticleUpdateDto> = {
            title: dto.title ?? oldDataArticle?.title,
            content: dto.content ?? oldDataArticle?.articleInfo.content,
            imageUrl: dto.imageUrl ?? oldDataArticle?.articleInfo.imageUrl,
        };

        return await this.articleRepository.updateArticle(id, newDataArticle);
    }

    public async delete(id: number): Promise<boolean> {
        return await this.articleRepository.deleteArticle(id);
    }
}
