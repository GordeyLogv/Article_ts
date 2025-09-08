import { PersonRole } from '../authorization/common/enums/roles.enum.js';
import { IMiddleware } from './middleware.interface.js';

export interface IAuthRoleMiddlewareFactory {
    create: (roles: PersonRole[]) => IMiddleware;
}
