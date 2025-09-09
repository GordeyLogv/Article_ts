import { PersonInfoModel, PersonModel } from '@prisma/client';

import { JwtPayloadDto } from './dto/jwt.payload.dto.js';

export interface IJwtService {
    signToken: (dto: JwtPayloadDto, secret: string, expiresInSecond: number) => string;
    decodedToken: (token: string, secret: string) => Promise<JwtPayloadDto | null>;
    addTokenToBlackList: (token: string) => Promise<boolean>;
    createJwtDto: (data: PersonModel & { personInfo: PersonInfoModel }, expiresInSecond: number) => JwtPayloadDto;
}
