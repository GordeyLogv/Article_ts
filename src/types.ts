export const TYPES = {
    Application: Symbol.for('Application'),
    LoggerService: Symbol.for('LoggerService'),
    ConfigService: Symbol.for('ConfigService'),
    ExceptionFilter: Symbol.for('ExceptionFilter'),
    DatabaseService: Symbol.for('DatabaseService'),

    JwtRepository: Symbol.for('JwtRepository'),
    JwtService: Symbol.for('JwtService'),

    AuthorizationRepository: Symbol.for('AuthorizationRepository'),
    AuhtorizationService: Symbol.for('AuthorizationService'),
    AuthorizationController: Symbol.for('AuthorizationController'),

    ProfileRepository: Symbol.for('ProfileRepository'),
    ProfileService: Symbol.for('ProfileService'),
    ProfileController: Symbol.for('ProfileController'),

    PersonsRepository: Symbol.for('PersonsRepository'),
    PersonsService: Symbol.for('PersonsService'),
    PersonsController: Symbol.for('PersonsController'),

    AuthMiddleware: Symbol.for('AuthMiddleware'),
    AuthRoleMiddlewareFactory: Symbol.for('AuthRoleMiddlewareFactory'),
    ValidationMiddlewareFactory: Symbol.for('ValidationMiddlewareFactory'),
};
