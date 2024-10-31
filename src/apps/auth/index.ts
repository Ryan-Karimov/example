import { Router } from 'express';

import { UPLOAD } from '../../config'
import { AuthService } from './service'
import { AuthController } from './controller'
import { signUpSchema, signInSchema } from './schema'
import { concatPaths, UploadFileHandler } from '../../helper'

export function authRouteRegister(prefix: string, router: Router): void {
    router.post(
        concatPaths(prefix, 'sign-up'),
        UploadFileHandler(UPLOAD.IMAGE_FOLDER_NAME_TO_SAVE, UPLOAD.IMAGE_ALLOWED_TYPES).single(UPLOAD.IMAGE_INCOMING_KEY),
        AuthController(signUpSchema, AuthService.userSignUp)
    );

    router.post(
        concatPaths(prefix, 'sign-in'),
        AuthController(signInSchema, AuthService.userSignIn));
}
