import { Container } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IPersonsRepository } from './persons.repository.interface.js';
import { IPersonsService } from './persons.service.interface.js';
import { TYPES } from '../types.js';
import { PersonsService } from './persons.service.js';
import { PersonRole } from '../authorization/common/enums/roles.enum.js';

let personsService: IPersonsService;
let personsRepository: IPersonsRepository;

beforeAll(() => {
    const container = new Container();

    const personsRepositoryMock: IPersonsRepository = {
        findAllPersons: jest.fn(),
        findPersonById: jest.fn(),
    };

    container.bind<IPersonsService>(TYPES.PersonsService).to(PersonsService);
    container.bind<IPersonsRepository>(TYPES.PersonsRepository).toConstantValue(personsRepositoryMock);

    personsService = container.get<IPersonsService>(TYPES.PersonsService);
    personsRepository = container.get<IPersonsRepository>(TYPES.PersonsRepository);
});

describe('PersonsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const databaseMock: (PersonModel & { personInfo: PersonInfoModel })[] = [
        {
            id: 1,
            email: 'email1@gmail.com',
            password: 'password1',
            personInfoId: 1,
            personInfo: {
                id: 1,
                nickname: 'nickname1',
                role: PersonRole.USER,
                age: 20,
                createdAt: new Date(),
            },
        },
        {
            id: 2,
            email: 'email2@gmail.com',
            password: 'password2',
            personInfoId: 2,
            personInfo: {
                id: 2,
                nickname: 'nickname2',
                role: PersonRole.USER,
                age: 22,
                createdAt: new Date(),
            },
        },
    ];

    describe('findAll', () => {
        it('return all personsModels', async () => {
            (personsRepository.findAllPersons as jest.Mock).mockResolvedValueOnce(databaseMock);

            const result = await personsService.findAll();

            expect(personsRepository.findAllPersons).toHaveBeenCalled();
            expect(result).toEqual(databaseMock);
        });

        it('return empty array personsModels', async () => {
            (personsRepository.findAllPersons as jest.Mock).mockResolvedValueOnce([]);

            const result = await personsService.findAll();

            expect(personsRepository.findAllPersons).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('return personModel when id is existed', async () => {
            (personsRepository.findPersonById as jest.Mock).mockResolvedValueOnce(databaseMock[0]);

            const result = await personsService.findOne(databaseMock[0].id);

            expect(personsRepository.findPersonById).toHaveBeenCalled();
            expect(personsRepository.findPersonById).toHaveBeenCalledWith(databaseMock[0].id);
            expect(result).toEqual(databaseMock[0]);
        });

        it('return null when id is not existed', async () => {
            const notExistedId = 101;

            (personsRepository.findPersonById as jest.Mock).mockResolvedValueOnce(null);

            const result = await personsService.findOne(notExistedId);

            expect(personsRepository.findPersonById).toHaveBeenCalled();
            expect(personsRepository.findPersonById).toHaveBeenCalledWith(notExistedId);
            expect(result).toBeNull();
        });
    });
});
