import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { IJwtService } from './jwt.service.interface.js';
import { TYPES } from '../../types.js';
import { IJwtRepository } from './jwt.repository.interface.js';
import { JwtPayloadDto } from './dto/jwt.payload.dto.js';

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
}
