import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class ArticleUpdateDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Введите заголовок' })
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Введите текст' })
    content?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Ссылка на картинку не должна быть пустой' })
    imageUrl?: string;
}
