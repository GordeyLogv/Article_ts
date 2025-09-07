import { PrismaClient } from '@prisma/client';

export interface IDatabaseService {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;

    personModel: PrismaClient['personModel'];
    personInfoModel: PrismaClient['personInfoModel'];
    articleModel: PrismaClient['articleModel'];
    articleInfoModel: PrismaClient['articleInfoModel'];
    blackListTokensModel: PrismaClient['blackListTokensModel'];
}
