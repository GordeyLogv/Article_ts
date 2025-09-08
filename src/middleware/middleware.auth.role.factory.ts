import { injectable } from 'inversify';

import { IAuthRoleMiddlewareFactory } from './middleware.auth.role.factory.interface.js';
import { PersonRole } from '../authorization/common/enums/roles.enum.js';
import { IMiddleware } from './middleware.interface.js';
import { AuthRoleMiddleware } from './middleware.auth.tole.js';

@injectable()
export class AuthRoleMiddlewareFactory implements IAuthRoleMiddlewareFactory {
    public create(roles: PersonRole[]): IMiddleware {
        return new AuthRoleMiddleware(roles);
    }
}
