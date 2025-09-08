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

    AuthMiddleware: Symbol.for('AuthMiddleware'),
    AuthRoleMiddlewareFactory: Symbol.for('AuthRoleMiddlewareFactory'),
    ValidationMiddlewareFactory: Symbol.for('ValidationMiddlewareFactory'),
};
