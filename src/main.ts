import { Container } from 'inversify';

import { TYPES } from './types.js';
import { App } from './app.js';
import { ILoggerService } from './common/loggerService/logger.service.interface.js';
import { LoggerService } from './common/loggerService/logger.service.js';
import { IConfigService } from './common/configService/config.service.interfsce.js';
import { ConfigService } from './common/configService/config.service.js';
import { IDatabaseService } from './common/databaseService/database.service.interface.js';
import { DatabaseService } from './common/databaseService/database.service.js';
import { IExceptionFilter } from './common/errors/exception.filter.interface.js';
import { ExceptionFilter } from './common/errors/exception.filter.js';
import { IAuthRepository } from './authorization/authorization.repository.interface.js';
import { AuthRepository } from './authorization/authorization.repository.js';
import { IAuthService } from './authorization/authorization.service.interface.js';
import { AuthService } from './authorization/authorization.service.js';
import { IJwtRepository } from './common/jwt/jwt.repository.interface.js';
import { JwtRepository } from './common/jwt/jwt.repository.js';
import { IJwtService } from './common/jwt/jwt.service.interface.js';
import { JwtService } from './common/jwt/jwt.service.js';
import { IAuthController } from './authorization/authorization.controller.interface.js';
import { AuthController } from './authorization/authorization.controller.js';
import { AuthMiddleware } from './middleware/middleware.auth.js';
import { IAuthRoleMiddlewareFactory } from './middleware/middleware.auth.role.factory.interface.js';
import { AuthRoleMiddlewareFactory } from './middleware/middleware.auth.role.factory.js';
import { IValidationMiddlewareFactory } from './middleware/middleware.validation.factory.interface.js';
import { ValidationMiddlewareFactore } from './middleware/middleware.validation.factory.js';
import { IProfileRepository } from './profile/profile.repository.interface.js';
import { ProfileRepository } from './profile/profile.repository.js';
import { IProfileService } from './profile/profile.service.interface.js';
import { ProfileService } from './profile/profile.service.js';

const bootstrap = () => {
    const appContainer = new Container();

    appContainer.bind<App>(TYPES.Application).to(App);
    appContainer.bind<ILoggerService>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
    appContainer.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    appContainer.bind<IDatabaseService>(TYPES.DatabaseService).to(DatabaseService);
    appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();

    appContainer.bind<IJwtRepository>(TYPES.JwtRepository).to(JwtRepository);
    appContainer.bind<IJwtService>(TYPES.JwtService).to(JwtService);

    appContainer.bind<IAuthRepository>(TYPES.AuthorizationRepository).to(AuthRepository);
    appContainer.bind<IAuthService>(TYPES.AuhtorizationService).to(AuthService);
    appContainer.bind<IAuthController>(TYPES.AuthorizationController).to(AuthController);

    appContainer.bind<IProfileRepository>(TYPES.ProfileRepository).to(ProfileRepository);
    appContainer.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);

    appContainer.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware).inSingletonScope();
    appContainer
        .bind<IAuthRoleMiddlewareFactory>(TYPES.AuthRoleMiddlewareFactory)
        .to(AuthRoleMiddlewareFactory)
        .inSingletonScope();
    appContainer
        .bind<IValidationMiddlewareFactory>(TYPES.ValidationMiddlewareFactory)
        .to(ValidationMiddlewareFactore)
        .inSingletonScope();

    const app = appContainer.get<App>(TYPES.Application);

    app.init();

    return { appContainer, app };
};

export const { app, appContainer } = bootstrap();
