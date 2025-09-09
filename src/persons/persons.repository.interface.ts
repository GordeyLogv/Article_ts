import { PersonInfoModel, PersonModel } from '@prisma/client';

export interface IPersonsRepository {
    findAllPersons: () => Promise<(PersonModel & { personInfo: PersonInfoModel })[]>;
    findPersonById: (id: number) => Promise<(PersonModel & { personInfo: PersonInfoModel }) | null>;
}
