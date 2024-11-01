import { Router, Response, Request, NextFunction } from 'express';
import { concatPaths, Controller } from '../../helper';

export function projectRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.get(concatPaths(prefix, '/'), Controller(async (_req: Request, _res: Response, _next: NextFunction) => {
        _res.send({ msg: "Hello world!" })
        return
    }))
}
