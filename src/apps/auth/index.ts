import { Router } from 'express';

import { STATIC } from '../../config'
import { AuthService } from './service'
import { AuthController } from './controller'
import { signUpSchema, signInSchema } from './schema'
import { concatPaths, UploadFileHandler } from '../../helper'

export function authRouteRegister(prefix: string, router: Router): void {
    router.post(
        concatPaths(prefix, 'sign-up'),
        UploadFileHandler(STATIC.IMAGES, STATIC.IMAGE_ALLOWED_TYPES).single('image'),
        AuthController(signUpSchema, AuthService.userSignUp)
    );

    router.post(
        concatPaths(prefix, 'sign-in'),
        AuthController(signInSchema, AuthService.userSignIn));
}
