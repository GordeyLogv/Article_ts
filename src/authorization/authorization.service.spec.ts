import { Container } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IAuthService } from './authorization.service.interface.js';
import { IAuthRepository } from './authorization.repository.interface.js';
import { IConfigService } from '../common/configService/config.service.interfsce.js';
import { IJwtService } from '../common/jwt/jwt.service.interface.js';
import { TYPES } from '../types.js';
import { AuthService } from './authorization.service.js';
import { PersonRole } from './common/enums/roles.enum.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { Person } from './person.entity.js';

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
            password: 'password',
            personInfoId: 1,
            personInfo: {
                id: 1,
                nickname: 'nickname',
                age: 20,
                role: PersonRole.USER,
                createdAt: new Date(),
            },
        };

        it('return personModel if existed email', async () => {
            const existedEmail = personMock.email;

            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(personMock);

            const existedPerson = await authorizationService.findPersonByEmail(existedEmail);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(existedEmail);
            expect(existedPerson).toEqual(personMock);
        });

        it('return null if not existed email', async () => {
            const notExistedEmail = 'notexistedemail@gmail.com';

            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);

            const notExistedPerson = await authorizationService.findPersonByEmail(notExistedEmail);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(notExistedEmail);
            expect(notExistedPerson).toBeNull();
        });
    });

    describe('registerPerson', () => {
        const registerDtoMock: AuthRegisterDto = {
            email: 'email',
            password: 'password',
            nickname: 'nickname',
            age: 20,
        };

        it('return personModel', async () => {
            (authorizationRepository.create as jest.Mock).mockImplementationOnce(
                (person: Person): PersonModel & { personInfo: PersonInfoModel } => {
                    const infoPerson = person.toPersistence();
                    return {
                        id: 1,
                        email: infoPerson.email,
                        password: infoPerson.password,
                        personInfoId: 1,
                        personInfo: {
                            id: 1,
                            nickname: infoPerson.nickname,
                            age: infoPerson.age,
                            role: infoPerson.role,
                            createdAt: infoPerson.createdAt,
                        },
                    };
                },
            );

            const createdPerson = await authorizationService.registerPerson(registerDtoMock);

            expect(authorizationRepository.create).toHaveBeenCalled();
            expect(authorizationRepository.create).toHaveBeenCalledWith(expect.any(Person));
            expect(createdPerson.id).toEqual(1);
            expect(createdPerson.password).not.toEqual(registerDtoMock.password);
        });
    });

    describe('loginPerson', () => {
        const loginDtoMock = {
            email: 'email@gmail.com',
            password: 'hash-password',
        };

        it('return personModel if email and password is correct', async () => {
            (authorizationRepository.findByEmail as jest.Mock).mockImplementationOnce(
                async (email: string): Promise<PersonModel & { personInfo: PersonInfoModel }> => {
                    const newPerson = new Person(email, 'newPerson', 20);
                    await newPerson.setPassword(loginDtoMock.password, configService.salt);

                    const infoPerson = newPerson.toPersistence();

                    return {
                        id: 1,
                        email: infoPerson.email,
                        password: infoPerson.password,
                        personInfoId: 1,
                        personInfo: {
                            id: 1,
                            nickname: infoPerson.nickname,
                            age: infoPerson.age,
                            role: infoPerson.role,
                            createdAt: infoPerson.createdAt,
                        },
                    };
                },
            );

            jest.spyOn(Person.prototype, 'comparePassword').mockResolvedValueOnce(true);

            const isPerson = await authorizationService.loginPerson(loginDtoMock);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(loginDtoMock.email);
            expect(isPerson).toEqual(expect.objectContaining({ email: loginDtoMock.email }));
        });

        it('return false when password is incorrect', async () => {
            jest.spyOn(Person.prototype, 'comparePassword').mockResolvedValueOnce(false);

            const isPerson = await authorizationService.loginPerson(loginDtoMock);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(loginDtoMock.email);
            expect(isPerson).toBeFalsy();
        });

        it('return false when email is undefined', async () => {
            (authorizationRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);

            const isPerson = await authorizationService.loginPerson(loginDtoMock);

            expect(authorizationRepository.findByEmail).toHaveBeenCalled();
            expect(authorizationRepository.findByEmail).toHaveBeenCalledWith(loginDtoMock.email);
            expect(isPerson).toBeFalsy();
        });
    });

    describe('createToken', () => {
        const mockPerson: PersonModel & { personInfo: PersonInfoModel } = {
            id: 1,
            email: 'email@gmail.com',
            password: 'hashedPassword',
            personInfoId: 1,
            personInfo: {
                id: 1,
                nickname: 'nickname',
                age: 20,
                role: PersonRole.USER,
                createdAt: new Date(),
            },
        };

        it('return access token', () => {
            (jwtService.createJwtDto as jest.Mock).mockReturnValue({ email: mockPerson.email });
            (jwtService.signToken as jest.Mock).mockReturnValue('token');

            const token = authorizationService.createToken(
                mockPerson,
                configService.access_token_secret,
                configService.expiresInSecond,
            );

            expect(jwtService.createJwtDto).toHaveBeenCalledTimes(1);
            expect(jwtService.createJwtDto).toHaveBeenCalledWith(mockPerson, configService.expiresInSecond);

            expect(jwtService.signToken).toHaveBeenCalledTimes(1);
            expect(jwtService.signToken).toHaveBeenCalledWith(
                { email: mockPerson.email },
                configService.access_token_secret,
                configService.expiresInSecond,
            );
            expect(token).toEqual('token');
        });
    });
});
