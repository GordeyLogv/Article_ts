import { inject, injectable } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IAuthRepository } from './authorization.repository.interface.js';
import { TYPES } from '../types.js';
import { IDatabaseService } from '../common/databaseService/database.service.interface.js';
import { Person } from './person.entity.js';

@injectable()
export class AuthRepository implements IAuthRepository {
    constructor(@inject(TYPES.DatabaseService) private databaseService: IDatabaseService) {}

    public async findByEmail(email: string): Promise<(PersonModel & { personInfo: PersonInfoModel }) | null> {
        return await this.databaseService.personModel.findUnique({
            where: { email },
            include: { personInfo: true },
        });
    }

    public async create(person: Person): Promise<PersonModel & { personInfo: PersonInfoModel }> {
        const persistenceData = person.toPersistence();

        return this.databaseService.personModel.create({
            data: {
                email: persistenceData.email,
                password: persistenceData.password,
                personInfo: {
                    create: {
                        nickname: persistenceData.nickname,
                        age: persistenceData.age,
                        role: persistenceData.role,
                        createdAt: persistenceData.createdAt,
                    },
                },
            },
            include: { personInfo: true },
        });
    }
}
