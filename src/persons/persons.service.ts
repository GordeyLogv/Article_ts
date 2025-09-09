import { inject, injectable } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IPersonsService } from './persons.service.interface.js';
import { TYPES } from '../types.js';
import { IPersonsRepository } from './persons.repository.interface.js';

@injectable()
export class PersonsService implements IPersonsService {
    constructor(@inject(TYPES.PersonsRepository) private personsRepository: IPersonsRepository) {}

    public async findAll(): Promise<(PersonModel & { personInfo: PersonInfoModel })[]> {
        return await this.personsRepository.findAllPersons();
    }

    public async findOne(id: number): Promise<(PersonModel & { personInfo: PersonInfoModel }) | null> {
        return await this.personsRepository.findPersonById(id);
    }
}
