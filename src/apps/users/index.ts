import { Router } from 'express';
import { concatPaths, Controller } from '../../helper'
import { UserService } from './service';

export function usersRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    /**
     * @Registration_Middlewares
    */
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    /**
     * @Registration_Endpoints
    */
    router.get(concatPaths(prefix, '/getMe'),
        Controller(
            UserService.getMe,
            undefined)
    );
}
