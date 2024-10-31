import { Router, NextFunction } from 'express';
import { concatPaths, UploadFileHandler } from '../../helper'

import { UPLOAD } from '../../config'
// import { UserService } from './service'
// import { UserController } from './controller'
// import { signUpSchema, signInSchema } from './schema'

export function workspaceRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    router.all(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.get(concatPaths(prefix, ''), async (req, res) => {
        res.send({
            msg: "Response is succescfully!"
        })
    }
    );
}
