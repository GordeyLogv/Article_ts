import { Request, Response, NextFunction } from 'express';

export interface IExceptionFilter {
    catch: (err: unknown, req: Request, res: Response, next: NextFunction) => void;
}
