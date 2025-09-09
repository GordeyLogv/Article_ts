import { inject, injectable } from 'inversify';

import { IProfileService } from './profile.service.interface.js';
import { TYPES } from '../types.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { JwtPayloadDto } from '../common/jwt/dto/jwt.payload.dto.js';
import { ProfileUpdateDto } from './dto/profile.update.dto.js';
import { Person } from '../authorization/person.entity.js';
import { IProfileRepository } from './profile.repository.interface.js';

@injectable()
export class ProfileService implements IProfileService {
    constructor(
        @inject(TYPES.JwtService) private jwtService: IJwtService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.ProfileRepository) private profileRepository: IProfileRepository,
    ) {}

    public async updateProfile(user: JwtPayloadDto, token: string, dto: ProfileUpdateDto): Promise<string> {
        const newDataProfile: Partial<ProfileUpdateDto> = {
            email: dto.email ?? user.email,
            nickname: dto.nickname ?? user.nickname,
        };

        if (dto.password) {
            const tempPerson = new Person(user.email, user.nickname, user.age);
            await tempPerson.setPassword(dto.password, this.configService.salt);

            const tempData = tempPerson.toPersistence();

            newDataProfile.password = tempData.password;
        }

        const updatePerson = await this.profileRepository.update(user.id, newDataProfile);

        const payload = this.jwtService.createJwtDto(updatePerson, this.configService.expiresInSecond);

        const newToken = this.jwtService.signToken(
            payload,
            this.configService.access_token_secret,
            this.configService.expiresInSecond,
        );

        await this.jwtService.addTokenToBlackList(token);

        return newToken;
    }

    public async deleteProfile(id: number, token: string): Promise<boolean> {
        const isDeleted = await this.profileRepository.delete(id);
        const isBlockedToken = await this.jwtService.addTokenToBlackList(token);

        return isDeleted && isBlockedToken ? true : false;
    }

    public async logout(token: string): Promise<boolean> {
        return await this.jwtService.addTokenToBlackList(token);
    }
}
