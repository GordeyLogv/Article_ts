import { inject, injectable } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { TYPES } from '../types.js';
import { IAuthRepository } from './authorization.repository.interface.js';
import { IAuthService } from './authorization.service.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { Person } from './person.entity.js';
import { IJwtPayload } from '../common/jwt/common/jwtPayload.interface.js';
import { JwtPayloadDto } from '../common/jwt/dto/jwt.payload.dto.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';
import { PersonRole } from './common/enums/roles.enum.js';

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

    private createPayload(data: PersonModel & { personInfo: PersonInfoModel }): IJwtPayload {
        const payload: IJwtPayload = {
            id: data.id,
            email: data.email,
            role: data.personInfo.role as PersonRole,
            nickname: data.personInfo.nickname,
            age: data.personInfo.age,
            createdAt: data.personInfo.createdAt,
        };
        return payload;
    }

    public createToken(
        data: PersonModel & { personInfo: PersonInfoModel },
        secret: string,
        expiresInSecond: number,
    ): string {
        const payload = this.createPayload(data);

        const payloadDto = new JwtPayloadDto(payload, expiresInSecond);

        const token = this.jwtService.signToken(payloadDto, secret, expiresInSecond);

        return token;
    }
}
