import { IsString, IsNotEmpty } from 'class-validator';

export class ArticleCreateDto {
    @IsString()
    @IsNotEmpty({ message: 'Введите заголовок' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Введите текст' })
    content: string;

    @IsString()
    @IsNotEmpty({ message: 'Ссылка на картинку не должна быть пустой' })
    imageUrl: string;
}
