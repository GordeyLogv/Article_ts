import { Request, Response, NextFunction } from 'express';

export interface IPersonsController {
    getAllPersons: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPerson: ({ params }: Request<{ id: string }>, res: Response, next: NextFunction) => Promise<void>;
}
