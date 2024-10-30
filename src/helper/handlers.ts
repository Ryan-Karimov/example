import { Request, Response, NextFunction, RequestHandler } from 'express';

interface IAsyncCallbackFunction {
    (req: Request, res: Response, next: NextFunction): Promise<void>
}

export function catchError(func: IAsyncCallbackFunction): IAsyncCallbackFunction {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await func(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}
