import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthRegisterDto {
    @IsString()
    @IsNotEmpty({ message: `Email не должен быть пустым` })
    email: string;

    @IsString()
    @IsNotEmpty({ message: `Введите пароль` })
    password: string;

    @IsString()
    @IsNotEmpty({ message: `Введите имя` })
    nickname: string;

    @IsNumber()
    @IsNotEmpty({ message: `Введите ваш возрост` })
    age: number;
}
