import { Request, Response, NextFunction } from 'express'

interface IGlobalErrorHandlerMiddleware {
    (error: Error, req: Request, res: Response, next: NextFunction): Promise<void>
}

export function GlobalErrorHandlerMiddleWare(): IGlobalErrorHandlerMiddleware {
    return async (_error: Error, _req: Request, _res: Response, _next: NextFunction): Promise<void> => {
        _res.status(500).send({
            error: _error.message
        })
    }
}