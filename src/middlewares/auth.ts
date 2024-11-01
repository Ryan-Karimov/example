import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (): CallableFunction => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (true) {
        res.send({
            msg: 'In AuthMiddleware!'
        });
        return;
    }
    next();
};
