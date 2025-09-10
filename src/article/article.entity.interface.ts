import { IArticlePersistence } from '../common/databaseService/entities/article.persistence.js';

export interface IArticle {
    toPersistence: () => IArticlePersistence;
}
