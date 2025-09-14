import { Container } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IPersonsService } from './persons.service.interface.js';
import { IPersonsRepository } from './persons.repository.interface.js';
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
            email: 'person1@gmail.com',
            password: 'hashed1',
            personInfoId: 1,
            personInfo: {
                id: 1,
                nickname: 'Person1',
                age: 20,
                role: PersonRole.USER,
                createdAt: new Date(),
            },
        },
        {
            id: 2,
            email: 'person2@gmail.com',
            password: 'hashed2',
            personInfoId: 2,
            personInfo: {
                id: 2,
                nickname: 'Person2',
                age: 25,
                role: PersonRole.USER,
                createdAt: new Date(),
            },
        },
    ] as (PersonModel & { personInfo: PersonInfoModel })[];

    describe('findAll', () => {
        it('return many personModels', async () => {
            (personsRepository.findAllPersons as jest.Mock).mockResolvedValueOnce(databaseMock);

            const allPersonsModels = await personsService.findAll();

            expect(personsRepository.findAllPersons).toHaveBeenCalled();
            expect(allPersonsModels).toEqual(databaseMock);
        });

        it('return empty array if no personsModels', async () => {
            (personsRepository.findAllPersons as jest.Mock).mockResolvedValueOnce([]);

            const allPersonsModels = await personsService.findAll();

            expect(personsRepository.findAllPersons).toHaveBeenCalled();
            expect(allPersonsModels).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('return one personModel when id is existed', async () => {
            (personsRepository.findPersonById as jest.Mock).mockResolvedValueOnce(databaseMock[0]);

            const personModel = await personsService.findOne(databaseMock[0].id);

            expect(personsRepository.findPersonById).toHaveBeenCalled();
            expect(personsRepository.findPersonById).toHaveBeenCalledWith(databaseMock[0].id);
            expect(personModel).toEqual(databaseMock[0]);
        });

        it('return null if id not existed', async () => {
            const notExistedId = 50;

            (personsRepository.findPersonById as jest.Mock).mockResolvedValueOnce(null);

            const notExistedPersonModel = await personsService.findOne(notExistedId);

            expect(personsRepository.findPersonById).toHaveBeenCalled();
            expect(personsRepository.findPersonById).toHaveBeenCalledWith(notExistedId);
            expect(notExistedPersonModel).toBeNull();
        });
    });
});
