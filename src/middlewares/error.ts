import { Request, Response, NextFunction } from 'express'

interface GlobalNotFoundMiddleWare {
    (req: Request, res: Response, next: NextFunction): Promise<void>
}

export function GlobalNotFoundHandlerMiddleWare(): GlobalNotFoundMiddleWare {
    return async (_req: Request, _res: Response, _next: NextFunction): Promise<void> => {
        _res.status(404).json({
            message: "Not Found!"
        })
    }

}

interface GlobalErrorHandlerMiddleWare {
    (error: Error, req: Request, res: Response, next: NextFunction): Promise<void>
}

export function GlobalErrorHandlerMiddleWare(): GlobalErrorHandlerMiddleWare {
    return async (_error: Error, _req: Request, _res: Response, _next: NextFunction): Promise<void> => {
        _res.status(500).send({
            error: _error.message
        })
    }
}