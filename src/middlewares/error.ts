import { Request, Response, NextFunction, RequestHandler } from 'express'

// interface GlobalNotFoundMiddleWare {
//     (req: Request, res: Response, next: NextFunction): Promise<void>
// }

export function GlobalNotFoundHandlerMiddleWare(): any {
    return async (_req: Request, _res: Response, _next: NextFunction): Promise<void> => {
        console.log(_req.path, _req.baseUrl);

        _res.status(404).json({
            message: "Not Found!"
        })
    }
}

// interface GlobalErrorHandlerMiddleWare {
//     (error: Error, req: Request, res: Response, next: NextFunction): Promise<void>
// }

export function GlobalErrorHandlerMiddleWare(): any {
    return async (_error: Error, _req: Request, _res: Response, _next: NextFunction): Promise<void> => {
        console.log(_error);

        _res.status(500).send({
            error: _error.message
        })
    }
}