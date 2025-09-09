import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { BaseController } from '../common/base.controller.js';
import { IPersonsController } from './persons.controller.interface.js';
import { TYPES } from '../types.js';
import { ILoggerService } from '../common/loggerService/logger.service.interface.js';
import { IExceptionFilter } from '../common/errors/exception.filter.interface.js';
import { IPersonsService } from './persons.service.interface.js';
import { PersonsDto } from './dto/all.persons.dto.js';
import { PersonDto } from './dto/one.person.dto.js';
import { AuthMiddleware } from '../middleware/middleware.auth.js';

@injectable()
export class PersonsController extends BaseController implements IPersonsController {
    constructor(
        @inject(TYPES.LoggerService) logger: ILoggerService,
        @inject(TYPES.ExceptionFilter) exceptionFilter: IExceptionFilter,
        @inject(TYPES.PersonsService) private personsService: IPersonsService,
        @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware,
    ) {
        super(logger, exceptionFilter);

        this.bindRouters([
            {
                path: '/persons',
                method: 'get',
                func: this.getAllPersons.bind(this),
                middleware: [],
            },
            {
                path: '/person/:id',
                method: 'get',
                func: this.getPerson.bind(this),
                middleware: [this.authMiddleware],
            },
        ]);
    }

    public async getAllPersons(req: Request, res: Response, _next: NextFunction): Promise<void> {
        const allPersons = await this.personsService.findAll();

        const answer = allPersons.map((person) => new PersonsDto(person));

        this.ok(res, answer);
    }

    public async getPerson({ params }: Request<{ id: string }>, res: Response, _next: NextFunction): Promise<void> {
        const person = await this.personsService.findOne(Number(params.id));

        if (!person) {
            return this.fail(res, `Пользователь с ${params.id} не найден`);
        }

        const answer = new PersonDto(person);

        this.ok(res, answer);
    }
}
