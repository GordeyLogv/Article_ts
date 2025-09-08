import { inject, injectable } from 'inversify';
import { PersonInfoModel, PersonModel } from '@prisma/client';

import { IProfileRepository } from './profile.repository.interface.js';
import { TYPES } from '../types.js';
import { IDatabaseService } from '../common/databaseService/database.service.interface.js';
import { ProfileUpdateDto } from './dto/profile.update.dto.js';

@injectable()
export class ProfileRepository implements IProfileRepository {
    constructor(@inject(TYPES.DatabaseService) private databaseService: IDatabaseService) {}

    public async update(
        id: number,
        data: Partial<ProfileUpdateDto>,
    ): Promise<PersonModel & { personInfo: PersonInfoModel }> {
        return await this.databaseService.personModel.update({
            where: { id },
            data: {
                email: data.email,
                password: data.password,
                personInfo: { update: { nickname: data.nickname } },
            },
            include: { personInfo: true },
        });
    }

    public async delete(id: number): Promise<boolean> {
        const isDeleted = await this.databaseService.personModel.delete({
            where: { id },
        });

        return isDeleted ? true : false;
    }
}
