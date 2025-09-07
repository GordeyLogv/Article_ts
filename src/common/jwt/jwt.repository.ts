import { inject, injectable } from 'inversify';

import { IJwtRepository } from './jwt.repository.interface.js';
import { TYPES } from '../../types.js';
import { IDatabaseService } from '../databaseService/database.service.interface.js';

@injectable()
export class JwtRepository implements IJwtRepository {
    constructor(@inject(TYPES.DatabaseService) private databaseService: IDatabaseService) {}

    public async isTokenBlackListed(token: string): Promise<boolean> {
        const existedToken = await this.databaseService.blackListTokensModel.findUnique({
            where: { token },
        });

        return existedToken ? true : false;
    }

    public async addTokenToBlackList(token: string): Promise<boolean> {
        await this.databaseService.blackListTokensModel.create({
            data: { token },
        });

        return true;
    }
}
