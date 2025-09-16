import { Container } from 'inversify';
import { ArticleInfoModel, ArticleModel } from '@prisma/client';

import { IArticleRepository } from './article.repositoty.interface.js';
import { IArticleService } from './article.service.interface.js';
import { TYPES } from '../types.js';
import { ArticleService } from './article.service.js';
import { ArticleCreateDto } from './dto/article.create.dto.js';
import { ArticleUpdateDto } from './dto/article.update.dto.js';

let articleService: IArticleService;
let articleRepository: IArticleRepository;

beforeAll(() => {
    const container = new Container();

    const articleRepositoryMock: IArticleRepository = {
        findAllArticles: jest.fn(),
        findById: jest.fn(),
        createArticle: jest.fn(),
        updateArticle: jest.fn(),
        deleteArticle: jest.fn(),
    };

    container.bind<IArticleService>(TYPES.ArticleService).to(ArticleService);
    container.bind<IArticleRepository>(TYPES.ArticleRepository).toConstantValue(articleRepositoryMock);

    articleService = container.get<IArticleService>(TYPES.ArticleService);
    articleRepository = container.get<IArticleRepository>(TYPES.ArticleRepository);
});

describe('ArticleService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        const databaseMock: (ArticleModel & { articleInfo: ArticleInfoModel })[] = [
            {
                id: 1,
                title: 'title1',
                articleInfoId: 1,
                articleInfo: {
                    id: 1,
                    content: 'content1',
                    imageUrl: 'imageUrl1',
                    createdAt: new Date(),
                },
            },
            {
                id: 2,
                title: 'title2',
                articleInfoId: 2,
                articleInfo: {
                    id: 2,
                    content: 'content2',
                    imageUrl: 'imageUrl2',
                    createdAt: new Date(),
                },
            },
        ];

        it('return articlesModels when not empty', async () => {
            (articleRepository.findAllArticles as jest.Mock).mockResolvedValueOnce(databaseMock);

            const result = await articleService.findAll();

            expect(articleRepository.findAllArticles).toHaveBeenCalled();

            expect(result).toEqual(databaseMock);
        });

        it('return empty array articlesModels', async () => {
            (articleRepository.findAllArticles as jest.Mock).mockResolvedValueOnce([]);

            const result = await articleService.findAll();

            expect(articleRepository.findAllArticles).toHaveBeenCalled();

            expect(result).toEqual([]);
        });
    });

    describe('findById', () => {
        const articleMock: ArticleModel & { articleInfo: ArticleInfoModel } = {
            id: 1,
            title: 'title',
            articleInfoId: 1,
            articleInfo: {
                id: 1,
                content: 'content',
                imageUrl: 'image1',
                createdAt: new Date(),
            },
        };

        const notExistedIdMock = 10;

        it('return article articleModel when id is existed', async () => {
            (articleRepository.findById as jest.Mock).mockResolvedValueOnce(articleMock);

            const result = await articleService.findById(articleMock.id);

            expect(articleRepository.findById).toHaveBeenCalled();
            expect(articleRepository.findById).toHaveBeenCalledWith(articleMock.id);

            expect(result).toEqual(articleMock);
        });

        it('return null when id is not existed', async () => {
            (articleRepository.findById as jest.Mock).mockResolvedValueOnce(null);

            const result = await articleService.findById(notExistedIdMock);

            expect(articleRepository.findById).toHaveBeenCalled();
            expect(articleRepository.findById).toHaveBeenCalledWith(notExistedIdMock);

            expect(result).toBe(null);
        });
    });

    describe('create', () => {
        const dtoMock: ArticleCreateDto = {
            title: 'title',
            content: 'content',
            imageUrl: 'imageUrl',
        };

        const articleModelMock: ArticleModel & { articleInfo: ArticleInfoModel } = {
            id: 1,
            title: dtoMock.title,
            articleInfoId: 1,
            articleInfo: {
                id: 1,
                content: dtoMock.content,
                imageUrl: dtoMock.imageUrl,
                createdAt: new Date(),
            },
        };

        it('return new articleModel', async () => {
            (articleRepository.createArticle as jest.Mock).mockResolvedValueOnce(articleModelMock);

            const result = await articleService.create(dtoMock);

            expect(articleRepository.createArticle).toHaveBeenCalled();

            expect(result).toEqual(articleModelMock);
        });
    });

    describe('update', () => {
        it('return updated articleModel on full update', async () => {
            const updateDtoMock: ArticleUpdateDto = {
                title: 'newTitle',
                content: 'newContent',
                imageUrl: 'newImageUrl',
            };

            const articleMock: ArticleModel & { articleInfo: ArticleInfoModel } = {
                id: 1,
                title: updateDtoMock.title!,
                articleInfoId: 1,
                articleInfo: {
                    id: 1,
                    content: updateDtoMock.content!,
                    imageUrl: updateDtoMock.imageUrl!,
                    createdAt: new Date(),
                },
            };

            (articleRepository.updateArticle as jest.Mock).mockResolvedValueOnce(articleMock);

            const result = await articleService.update(articleMock.id, updateDtoMock);

            expect(articleRepository.updateArticle).toHaveBeenCalled();

            expect(result).toEqual(articleMock);
        });

        it('return updated articleModel on not full update', async () => {
            const updateDtoMock: ArticleUpdateDto = {
                title: 'newTitle',
            };

            const articleMock: ArticleModel & { articleInfo: ArticleInfoModel } = {
                id: 1,
                title: updateDtoMock.title!,
                articleInfoId: 1,
                articleInfo: {
                    id: 1,
                    content: 'content',
                    imageUrl: 'imageUrl',
                    createdAt: new Date(),
                },
            };

            (articleRepository.updateArticle as jest.Mock).mockResolvedValueOnce(articleMock);

            const result = await articleService.update(articleMock.id, updateDtoMock);

            expect(articleRepository.updateArticle).toHaveBeenCalled();

            expect(result).toEqual(articleMock);
        });
    });

    describe('delete', () => {
        const ArticleId = 10;

        it('return true when delete is - success', async () => {
            (articleRepository.deleteArticle as jest.Mock).mockResolvedValueOnce(true);

            const result = await articleService.delete(ArticleId);

            expect(articleRepository.deleteArticle).toHaveBeenCalled();
            expect(articleRepository.deleteArticle).toHaveBeenCalledWith(ArticleId);

            expect(result).toBe(true);
        });

        it('return false when delete is - fail', async () => {
            (articleRepository.deleteArticle as jest.Mock).mockResolvedValueOnce(false);

            const result = await articleService.delete(ArticleId);

            expect(articleRepository.deleteArticle).toHaveBeenCalled();
            expect(articleRepository.deleteArticle).toHaveBeenCalledWith(ArticleId);

            expect(result).toBe(false);
        });
    });
});
