import { inject, injectable } from 'inversify';
import { Server } from 'http';
import express, { Express } from 'express';

import { TYPES } from './types.js';
import { ILoggerService } from './common/loggerService/logger.service.interface.js';
import { IConfigService } from './common/configService/config.service.interfsce.js';
import { IExceptionFilter } from './common/errors/exception.filter.interface.js';
import { AuthController } from './authorization/authorization.controller.js';

@injectable()
export class App {
    public app: Express;
    public server: Server;
    public PORT: number;
    public HOST: string;

    constructor(
        @inject(TYPES.LoggerService) private loggerService: ILoggerService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
        @inject(TYPES.AuthorizationController) private authController: AuthController,
    ) {
        this.app = express();
        this.PORT = this.configService.port;
        this.HOST = this.configService.host;

        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilter();
    }

    public useMiddleware() {
        this.app.use(express.json());
    }

    public useRoutes() {
        this.app.use('/api', this.authController.router);
    }

    public useExceptionFilter() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public init() {
        this.server = this.app.listen(this.PORT);
        this.loggerService.info(`Server was started on http://${this.HOST}:${this.PORT}`);
    }
}
