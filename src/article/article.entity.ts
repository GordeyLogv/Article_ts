import { IArticlePersistence } from '../common/databaseService/entities/article.persistence.js';
import { IArticle } from './article.entity.interface.js';

export class Article implements IArticle {
    private _title: string;
    private _content: string;
    private _imageUrl: string;
    private _createdAt: Date;

    constructor(title: string, content: string, imageUrl: string) {
        this._title = title;
        this._content = content;
        this._imageUrl = imageUrl;

        this._createdAt = new Date();
    }

    public toPersistence(): IArticlePersistence {
        return {
            title: this._title,
            content: this._content,
            imageUrl: this._imageUrl,
            createdAt: this._createdAt,
        };
    }
}
