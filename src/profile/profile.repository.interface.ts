import { PersonInfoModel, PersonModel } from '@prisma/client';

import { ProfileUpdateDto } from './dto/profile.update.dto.js';

export interface IProfileRepository {
    update: (id: number, data: Partial<ProfileUpdateDto>) => Promise<PersonModel & { personInfo: PersonInfoModel }>;
    delete: (id: number) => Promise<boolean>;
}
