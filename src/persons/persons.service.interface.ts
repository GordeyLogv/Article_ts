import { PersonInfoModel, PersonModel } from '@prisma/client';

export interface IPersonsService {
    findAll: () => Promise<(PersonModel & { personInfo: PersonInfoModel })[]>;
    findOne: (id: number) => Promise<(PersonModel & { personInfo: PersonInfoModel }) | null>;
}
