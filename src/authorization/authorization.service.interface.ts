import { PersonInfoModel, PersonModel } from '@prisma/client';

import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';

export interface IAuthService {
    findPersonByEmail: (email: string) => Promise<(PersonModel & { personInfo: PersonInfoModel }) | null>;
    registerPerson: (dto: AuthRegisterDto) => Promise<PersonModel & { personInfo: PersonInfoModel }>;
    loginPerson: (dto: AuthLoginDto) => Promise<(PersonModel & { personInfo: PersonInfoModel }) | boolean>;
    createToken: (data: PersonModel & { personInfo: PersonInfoModel }, secret: string, expiresInSecond: number) => string;
}
