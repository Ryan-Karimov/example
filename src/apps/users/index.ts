import { Router } from 'express';
import { concatPaths, UploadFileHandler } from '../../helper'

import { UPLOAD } from '../../config'
import { UserService } from './service'
import { UserController } from './controller'
// import { signUpSchema, signInSchema } from './schema'

export function usersRouteRegister(prefix: string, router: Router): void {
    router.post(concatPaths(prefix, 'avatar'),
        UploadFileHandler(UPLOAD.IMAGE_FOLDER_NAME_TO_SAVE, ['aa']).single('photo'),
        async (req, res) => {
            res.send({
                msg: "Hello world!"
            })
            return;
        });
    // router.post(concatPaths(prefix, 'uploads'), upload.single('photo'), UserController(signUpSchema, UserService.userSignUp));
    // router.post(concatPaths(prefix, 'sign-in'), UserController(signInSchema, UserService.userSignIn));
}
