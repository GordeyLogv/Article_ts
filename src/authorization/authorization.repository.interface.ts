import { PersonInfoModel, PersonModel } from '@prisma/client';

import { Person } from './person.entity.js';

export interface IAuthRepository {
    findByEmail: (email: string) => Promise<(PersonModel & { personInfo: PersonInfoModel }) | null>;
    create: (person: Person) => Promise<PersonModel & { personInfo: PersonInfoModel }>;
}
