import { PersonRole } from '../authorization/common/enums/roles.enum.js';

declare global {
    namespace Express {
        export interface Request {
            token?: string;
            user?: {
                id: number;
                email: string;
                role: PersonRole;
                nickname: string;
                age: number;
                createdAt: Date;
            };
        }
    }
}
