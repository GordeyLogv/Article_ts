import { Container } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';
import { IProfileRepository } from './profile.repository.interface.js';
import { IProfileService } from './profile.service.interface.js';
import { TYPES } from '../types.js';
import { ProfileService } from './profile.service.js';
import { PersonRole } from '../authorization/common/enums/roles.enum.js';
import { JwtPayloadDto } from '../common/jwt/dto/jwt.payload.dto.js';
import { ProfileUpdateDto } from './dto/profile.update.dto.js';
import { Person } from '../authorization/person.entity.js';

let profileService: IProfileService;
let profileRepository: IProfileRepository;
let jwtService: IJwtService;
let configService: IConfigService;

beforeAll(() => {
    const container = new Container();

    const profileRepositoryMock: IProfileRepository = {
        update: jest.fn(),
        delete: jest.fn(),
    };

    const jwtServiceMock: Partial<IJwtService> = {
        signToken: jest.fn(),
        addTokenToBlackList: jest.fn(),
        createJwtDto: jest.fn(),
    };

    const configServiceMock: Partial<IConfigService> = {
        salt: 5,
        expiresInSecond: 3600,
        access_token_secret: 'secret',
    };

    container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);
    container.bind<IProfileRepository>(TYPES.ProfileRepository).toConstantValue(profileRepositoryMock);
    container.bind<IJwtService>(TYPES.JwtService).toConstantValue(jwtServiceMock as IJwtService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock as IConfigService);

    profileService = container.get<IProfileService>(TYPES.ProfileService);
    profileRepository = container.get<IProfileRepository>(TYPES.ProfileRepository);
    jwtService = container.get<IJwtService>(TYPES.JwtService);
    configService = container.get<IConfigService>(TYPES.ConfigService);
});

describe('ProfileService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateProfile', () => {
        it('return new token when update data do not contain password', async () => {
            const dtoMock: ProfileUpdateDto = {
                nickname: 'NewNickname',
                email: 'NewEmail',
            };

            const personMock = {
                id: 1,
                email: dtoMock.email!,
                password: 'password',
                personInfoId: 1,
                personInfo: {
                    id: 1,
                    nickname: dtoMock.nickname!,
                    role: PersonRole.USER,
                    age: 20,
                    createdAt: new Date(),
                },
            } as PersonModel & { personInfo: PersonInfoModel };

            const newPayloadDtoMock = {
                id: 1,
                email: 'email@gmail.com',
                role: PersonRole.USER,
                nickname: 'Nickname',
                age: 20,
                createdAt: new Date(),
                iat: 4324,
                exp: 3123,
            } as JwtPayloadDto;

            const newTokenMock = 'newAccessToken';

            const oldToken = 'oldToken';
            const oldPayloadDtoMock = {
                id: 1,
                email: 'oldEmail@gmail.com',
                role: PersonRole.USER,
                nickname: 'oldNickname',
                age: 20,
                createdAt: new Date(),
                iat: 2000,
                exp: 2001,
            } as JwtPayloadDto;

            (profileRepository.update as jest.Mock).mockResolvedValueOnce(personMock);

            (jwtService.createJwtDto as jest.Mock).mockReturnValueOnce(newPayloadDtoMock);
            (jwtService.signToken as jest.Mock).mockReturnValueOnce(newTokenMock);
            (jwtService.addTokenToBlackList as jest.Mock).mockResolvedValueOnce(true);

            const result = await profileService.updateProfile(oldPayloadDtoMock, oldToken, dtoMock);

            expect(profileRepository.update).toHaveBeenCalled();
            expect(profileRepository.update).toHaveBeenCalledWith(oldPayloadDtoMock.id, dtoMock);

            expect(jwtService.createJwtDto).toHaveBeenCalled();
            expect(jwtService.createJwtDto).toHaveBeenCalledWith(personMock, configService.expiresInSecond);

            expect(jwtService.signToken).toHaveBeenCalled();
            expect(jwtService.signToken).toHaveBeenCalledWith(
                newPayloadDtoMock,
                configService.access_token_secret,
                configService.expiresInSecond,
            );

            expect(jwtService.addTokenToBlackList).toHaveBeenCalled();
            expect(jwtService.addTokenToBlackList).toHaveBeenCalledWith(oldToken);

            expect(result).toEqual(newTokenMock);
        });

        it('return new token when update data contain password', async () => {
            const dtoMock: ProfileUpdateDto = {
                nickname: 'NewNickname',
                email: 'NewEmail',
                password: 'NewPassword',
            };

            const personMock = {
                id: 1,
                email: dtoMock.email!,
                password: 'password',
                personInfoId: 1,
                personInfo: {
                    id: 1,
                    nickname: dtoMock.nickname!,
                    role: PersonRole.USER,
                    age: 20,
                    createdAt: new Date(),
                },
            } as PersonModel & { personInfo: PersonInfoModel };

            const newPayloadDtoMock = {
                id: 1,
                email: dtoMock.email!,
                role: PersonRole.USER,
                nickname: dtoMock.nickname!,
                age: 20,
                createdAt: new Date(),
                iat: 111,
                exp: 222,
            } as JwtPayloadDto;

            const newTokenMock = 'newAccessToken';

            const oldTokenMock = 'oldAccessToken';
            const oldPayloadDtoMock = {
                id: 1,
                email: 'old@email.com',
                role: PersonRole.USER,
                nickname: 'oldNick',
                age: 20,
                createdAt: new Date(),
                iat: 100,
                exp: 200,
            } as JwtPayloadDto;

            const setPasswordMock = jest.fn();
            const toPersistenceMock = jest.fn().mockReturnValue({ password: 'newHashPasword' });

            jest.spyOn(Person.prototype, 'setPassword').mockImplementation(setPasswordMock);
            jest.spyOn(Person.prototype, 'toPersistence').mockImplementation(toPersistenceMock);

            (profileRepository.update as jest.Mock).mockResolvedValueOnce(personMock);
            (jwtService.createJwtDto as jest.Mock).mockReturnValueOnce(newPayloadDtoMock);
            (jwtService.signToken as jest.Mock).mockReturnValueOnce(newTokenMock);
            (jwtService.addTokenToBlackList as jest.Mock).mockResolvedValueOnce(true);

            const result = await profileService.updateProfile(oldPayloadDtoMock, oldTokenMock, dtoMock);

            expect(setPasswordMock).toHaveBeenCalled();
            expect(setPasswordMock).toHaveBeenCalledWith(dtoMock.password, configService.salt);

            expect(toPersistenceMock).toHaveBeenCalled();

            expect(profileRepository.update).toHaveBeenCalled();
            expect(profileRepository.update).toHaveBeenCalledWith(
                oldPayloadDtoMock.id,
                expect.objectContaining({
                    email: dtoMock.email,
                    nickname: dtoMock.nickname,
                    password: 'newHashPasword',
                }),
            );

            expect(jwtService.createJwtDto).toHaveBeenCalled();
            expect(jwtService.createJwtDto).toHaveBeenCalledWith(personMock, configService.expiresInSecond);

            expect(jwtService.signToken).toHaveBeenCalled();
            expect(jwtService.signToken).toHaveBeenCalledWith(
                newPayloadDtoMock,
                configService.access_token_secret,
                configService.expiresInSecond,
            );

            expect(jwtService.addTokenToBlackList).toHaveBeenCalled();
            expect(jwtService.addTokenToBlackList).toHaveBeenCalledWith(oldTokenMock);

            expect(result).toEqual(newTokenMock);
        });
    });

    describe('deleteProfile', () => {
        const idMock = 50;
        const tokenMock = 'accessToken';

        it('return true when delete account - success', async () => {
            (profileRepository.delete as jest.Mock).mockResolvedValueOnce(true);
            (jwtService.addTokenToBlackList as jest.Mock).mockResolvedValueOnce(true);

            const result = await profileService.deleteProfile(idMock, tokenMock);

            expect(profileRepository.delete).toHaveBeenCalled();
            expect(profileRepository.delete).toHaveBeenCalledWith(idMock);

            expect(jwtService.addTokenToBlackList).toHaveBeenCalled();
            expect(jwtService.addTokenToBlackList).toHaveBeenCalledWith(tokenMock);

            expect(result).toEqual(true);
        });

        it('return false when delete account - fail', async () => {
            (profileRepository.delete as jest.Mock).mockResolvedValueOnce(false);
            (jwtService.addTokenToBlackList as jest.Mock).mockResolvedValueOnce(false);

            const result = await profileService.deleteProfile(idMock, tokenMock);

            expect(profileRepository.delete).toHaveBeenCalled();
            expect(profileRepository.delete).toHaveBeenCalledWith(idMock);

            expect(jwtService.addTokenToBlackList).toHaveBeenCalled();
            expect(jwtService.addTokenToBlackList).toHaveBeenCalledWith(tokenMock);

            expect(result).toEqual(false);
        });
    });

    describe('logout', () => {
        const tokenMock = 'accessToken';

        it('return true when logout - success', async () => {
            (jwtService.addTokenToBlackList as jest.Mock).mockResolvedValueOnce(true);

            const result = await profileService.logout(tokenMock);

            expect(jwtService.addTokenToBlackList).toHaveBeenCalled();
            expect(jwtService.addTokenToBlackList).toHaveBeenCalledWith(tokenMock);

            expect(result).toEqual(true);
        });

        it('return false when logout - fail', async () => {
            (jwtService.addTokenToBlackList as jest.Mock).mockResolvedValueOnce(false);

            const result = await profileService.logout(tokenMock);

            expect(jwtService.addTokenToBlackList).toHaveBeenCalled();
            expect(jwtService.addTokenToBlackList).toHaveBeenCalledWith(tokenMock);

            expect(result).toEqual(false);
        });
    });
});
