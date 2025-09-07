import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty({ message: `Email не должен быть пустым` })
    email: string;

    @IsString()
    @IsNotEmpty({ message: `Введите пароль` })
    password: string;
}
