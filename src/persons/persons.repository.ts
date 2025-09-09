import { injectable, inject } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IPersonsRepository } from './persons.repository.interface.js';
import { TYPES } from '../types.js';
import { IDatabaseService } from '../common/databaseService/database.service.interface.js';

@injectable()
export class PersonsRepository implements IPersonsRepository {
    constructor(@inject(TYPES.DatabaseService) private databaseService: IDatabaseService) {}

    public async findAllPersons(): Promise<(PersonModel & { personInfo: PersonInfoModel })[]> {
        return await this.databaseService.personModel.findMany({
            include: { personInfo: true },
        });
    }

    public async findPersonById(id: number): Promise<(PersonModel & { personInfo: PersonInfoModel }) | null> {
        return await this.databaseService.personModel.findUnique({
            where: { id },
            include: { personInfo: true },
        });
    }
}
