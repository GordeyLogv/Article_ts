import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class ProfileUpdateDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Email не должен быть пустым' })
    email?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Имя не должно быть пустым' })
    nickname?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    password?: string;
}
