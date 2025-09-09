import { inject, injectable } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { TYPES } from '../types.js';
import { IAuthRepository } from './authorization.repository.interface.js';
import { IAuthService } from './authorization.service.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { Person } from './person.entity.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.AuthorizationRepository) private authRepository: IAuthRepository,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.JwtService) private jwtService: IJwtService,
    ) {}

    public async findPersonByEmail(email: string): Promise<(PersonModel & { personInfo: PersonInfoModel }) | null> {
        return await this.authRepository.findByEmail(email);
    }

    public async registerPerson(dto: AuthRegisterDto): Promise<PersonModel & { personInfo: PersonInfoModel }> {
        const newPerson = new Person(dto.email, dto.nickname, dto.age);
        await newPerson.setPassword(dto.password, this.configService.salt);

        return await this.authRepository.create(newPerson);
    }

    public async loginPerson(dto: AuthLoginDto): Promise<(PersonModel & { personInfo: PersonInfoModel }) | boolean> {
        const existedPerson = await this.findPersonByEmail(dto.email);

        if (!existedPerson) {
            return false;
        }

        const tempPerson = new Person(
            existedPerson.email,
            existedPerson.personInfo.nickname,
            existedPerson.personInfo.age,
            existedPerson.password,
        );

        const isValid = await tempPerson.comparePassword(dto.password);

        return isValid ? existedPerson : false;
    }

    public createToken(
        data: PersonModel & { personInfo: PersonInfoModel },
        secret: string,
        expiresInSecond: number,
    ): string {
        const payload = this.jwtService.createJwtDto(data, this.configService.expiresInSecond);

        return this.jwtService.signToken(payload, secret, expiresInSecond);
    }
}
