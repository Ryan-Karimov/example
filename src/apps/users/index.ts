import { Router } from 'express';
import { concatPaths } from '../../helper'

export function usersRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    /**
     * @Registration_Middlewares
    */
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    /**
     * @Registration_Endpoints
    */
    router.get(concatPaths(prefix, ''), async (req, res) => {
        res.send({
            msg: "Response is succescfully!"
        })
    });
}
