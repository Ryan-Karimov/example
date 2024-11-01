import { Router, NextFunction } from 'express';
import { concatPaths, UploadFileHandler } from '../../helper'

import { UPLOAD } from '../../config'
import { UserService } from './service'
import { UserController } from './controller'
// import { signUpSchema, signInSchema } from './schema'

export function usersRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    /**
     * @Registration_Middlewares
    */
    router.all(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    /**
     * @Registration_Endpoints
    */
    router.get(concatPaths(prefix, ''), async (req, res) => {
        res.send({
            msg: "Response is succescfully!"
        })
    }
    );
}
