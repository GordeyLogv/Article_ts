import { Container } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

import { IAuthService } from './authorization.service.interface.js';
import { IAuthRepository } from './authorization.repository.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';
import { TYPES } from '../types.js';
import { AuthService } from './authorization.service.js';
import { PersonRole } from './common/enums/roles.enum.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { Person } from './person.entity.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { JwtPayloadDto } from '../common/jwt/dto/jwt.payload.dto.js';

let authorizationService: IAuthService;
let authorizationRepository: IAuthRepository;
let configService: IConfigService;
let jwtService: IJwtService;

beforeAll(() => {
    const container = new Container();

    const authorizationRepositoryMock: IAuthRepository = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };

    const configServiceMock: Partial<IConfigService> = {
        salt: 5,
        expiresInSecond: 3600,
        access_token_secret: 'sdfsdf',
    };

    const jwtServiceMock: Partial<IJwtService> = {
        createJwtDto: jest.fn(),
        signToken: jest.fn(),
    };

    container.bind<IAuthService>(TYPES.AuhtorizationService).to(AuthService);
    container.bind<IAuthRepository>(TYPES.AuthorizationRepository).toConstantValue(authorizationRepositoryMock);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock as IConfigService);
    container.bind<IJwtService>(TYPES.JwtService).toConstantValue(jwtServiceMock as IJwtService);

    authorizationService = container.get<IAuthService>(TYPES.AuhtorizationService);
    authorizationRepository = container.get<IAuthRepository>(TYPES.AuthorizationRepository);
    configService = container.get<IConfigService>(TYPES.ConfigService);
    jwtService = container.get<IJwtService>(TYPES.JwtService);
});

describe('AuthorizationService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findPersonByEmail', () => {
        const personMock: PersonModel & { personInfo: PersonInfoModel } = {
            id: 1,
            email: 'email@gmail.com',
            password: 'hashPassword',
            personInfoId: 1,
            personInfo: {
                id: 1,
                nickname: 'Person',
                role: PersonRole.USER,
                age: 20,
                createdAt: new Date(),
            },
        };

        it('return personModel when email is exsited', async () => {
            const existedEmail = personMock.email;

            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(personMock);

            const result = await authorizationService.findPersonByEmail(existedEmail);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(existedEmail);
            expect(result).toEqual(personMock);
        });

        it('return null when email is not existed', async () => {
            const notExistedEmail = 'notexistedemail@gmail.com';

            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);

            const result = await authorizationService.findPersonByEmail(notExistedEmail);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(notExistedEmail);
            expect(result).toBeNull();
        });
    });

    describe('registerPerson', () => {
        const dtoMock: AuthRegisterDto = {
            email: 'email@gmail.com',
            password: 'password',
            nickname: 'nickname',
            age: 20,
        };

        it('return new personModel', async () => {
            const personMock = new Person(dtoMock.email, dtoMock.nickname, dtoMock.age);
            await personMock.setPassword(dtoMock.password, configService.salt);

            (authorizationRepository.create as jest.Mock).mockImplementationOnce(() => {
                const personInfo = personMock.toPersistence();

                return {
                    id: 1,
                    email: personInfo.email,
                    password: personInfo.password,
                    personInfoId: 1,
                    personInfo: {
                        id: 1,
                        nickname: personInfo.nickname,
                        role: personInfo.role,
                        age: personInfo.age,
                        createdAt: personInfo.createdAt,
                    },
                };
            });

            const result = await authorizationService.registerPerson(dtoMock);

            expect(authorizationRepository.create).toHaveBeenCalled();
            expect(authorizationRepository.create).toHaveBeenCalledWith(expect.any(Person));
            expect(result.password).not.toEqual(dtoMock.password);
        });
    });

    describe('loginPerson', () => {
        const dtoMock: AuthLoginDto = {
            email: 'email@gmail.com',
            password: 'password',
        };

        const personMock: PersonModel & { personInfo: PersonInfoModel } = {
            id: 1,
            email: dtoMock.email,
            password: 'hashPassword',
            personInfoId: 1,
            personInfo: {
                id: 1,
                nickname: 'nickname',
                role: PersonRole.USER,
                age: 20,
                createdAt: new Date(),
            },
        };

        it('return personModel when email and password is correct', async () => {
            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(personMock);
            const spy = jest.spyOn(Person.prototype, 'comparePassword').mockResolvedValue(true);

            const result = await authorizationService.loginPerson(dtoMock);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(dtoMock.email);
            expect(spy).toHaveBeenCalled();
            expect(result).toEqual(personMock);
        });

        it('return false when email incorrect', async () => {
            const notExistedEmailToPerson: AuthLoginDto = {
                email: 'notExisted@gmail.com',
                password: 'existed',
            };

            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);

            const result = await authorizationService.loginPerson(notExistedEmailToPerson);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(notExistedEmailToPerson.email);
            expect(result).toBe(false);
        });

        it('return false when password incorrect', async () => {
            const notExistedPasswordToPerson: AuthLoginDto = {
                email: personMock.email,
                password: 'notExisted',
            };

            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(personMock);
            const spy = jest.spyOn(Person.prototype, 'comparePassword').mockResolvedValueOnce(false);

            const result = await authorizationService.loginPerson(notExistedPasswordToPerson);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(notExistedPasswordToPerson.email);
            expect(spy).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('createToken', () => {
        const jwtDtoMock = {
            id: 1,
            email: 'email@gmail.com',
            role: PersonRole.USER,
            nickname: 'nickname',
            age: 20,
            createdAt: new Date(),
            iat: 2000,
            exp: 20000,
        } as JwtPayloadDto;

        const tokenMock = 'accessToken';

        const personMock: PersonModel & { personInfo: PersonInfoModel } = {
            id: 1,
            email: 'email@gmail.com',
            password: '12345',
            personInfoId: 1,
            personInfo: {
                id: 1,
                nickname: 'nickname',
                role: PersonRole.USER,
                age: 20,
                createdAt: new Date(),
            },
        };

        it('return token', () => {
            (jwtService.createJwtDto as jest.Mock).mockReturnValueOnce(jwtDtoMock);
            (jwtService.signToken as jest.Mock).mockReturnValueOnce(tokenMock);

            const result = authorizationService.createToken(
                personMock,
                configService.access_token_secret,
                configService.expiresInSecond,
            );

            expect(jwtService.createJwtDto).toHaveBeenCalled();
            expect(jwtService.createJwtDto).toHaveBeenCalledWith(personMock, configService.expiresInSecond);
            expect(jwtService.signToken).toHaveBeenCalled();
            expect(jwtService.signToken).toHaveBeenCalledWith(
                jwtDtoMock,
                configService.access_token_secret,
                configService.expiresInSecond,
            );
            expect(result).toEqual(tokenMock);
        });
    });
});
