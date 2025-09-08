import { inject, injectable } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IProfileService } from './profile.service.interface.js';
import { TYPES } from '../types.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { JwtPayloadDto } from '../common/jwt/dto/jwt.payload.dto.js';
import { ProfileUpdateDto } from './dto/profile.update.dto.js';
import { Person } from '../authorization/person.entity.js';
import { IProfileRepository } from './profile.repository.interface.js';
import { IJwtPayload } from '../common/jwt/common/jwtPayload.interface.js';
import { PersonRole } from '../authorization/common/enums/roles.enum.js';

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

        const createNewPayload = this.createPayload(updatePerson);
        const createNewPayloadDto = new JwtPayloadDto(createNewPayload, this.configService.expiresInSecond);

        const newToken = this.jwtService.signToken(
            createNewPayloadDto,
            this.configService.access_token_secret,
            this.configService.expiresInSecond,
        );

        return newToken;
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
}
