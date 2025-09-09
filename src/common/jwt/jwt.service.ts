import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IJwtService } from './jwt.service.interface.js';
import { TYPES } from '../../types.js';
import { IJwtRepository } from './jwt.repository.interface.js';
import { JwtPayloadDto } from './dto/jwt.payload.dto.js';
import { IJwtPayload } from './common/jwtPayload.interface.js';
import { PersonRole } from '../../authorization/common/enums/roles.enum.js';

@injectable()
export class JwtService implements IJwtService {
    constructor(@inject(TYPES.JwtRepository) private jwtRepository: IJwtRepository) {}

    public signToken(dto: JwtPayloadDto, secret: string, expiresInSecond: number) {
        const payload = dto.getPayload();
        return jwt.sign(payload, secret, { expiresIn: expiresInSecond });
    }

    public async decodedToken(token: string, secret: string): Promise<JwtPayloadDto | null> {
        try {
            const isBlackListed = await this.jwtRepository.isTokenBlackListed(token);

            if (isBlackListed) {
                return null;
            }

            const payload = jwt.verify(token, secret);

            return payload as JwtPayloadDto;
        } catch (error) {
            return null;
        }
    }

    public async addTokenToBlackList(token: string): Promise<boolean> {
        return await this.jwtRepository.addTokenToBlackList(token);
    }

    public createJwtDto(data: PersonModel & { personInfo: PersonInfoModel }, expiresInSecond: number): JwtPayloadDto {
        const jwtPayload: IJwtPayload = {
            id: data.id,
            email: data.email,
            role: data.personInfo.role as PersonRole,
            nickname: data.personInfo.nickname,
            age: data.personInfo.age,
            createdAt: data.personInfo.createdAt,
        };

        return new JwtPayloadDto(jwtPayload, expiresInSecond);
    }
}
