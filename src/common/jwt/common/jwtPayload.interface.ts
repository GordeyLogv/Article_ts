import { PersonRole } from '../../../authorization/common/enums/roles.enum.js';

export interface IJwtPayload {
    id: number;
    email: string;
    role: PersonRole;
    nickname: string;
    age: number;
    createdAt: Date;
}
