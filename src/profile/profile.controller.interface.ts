import { Request, Response, NextFunction } from 'express';

export interface IProfileController {
    profile: ({ user }: Request, res: Response, next: NextFunction) => void;
    update: ({ user, token, body }: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: ({ user, token }: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: ({ token }: Request, res: Response, next: NextFunction) => Promise<void>;
}
