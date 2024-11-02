import { Router } from 'express';

import { UPLOAD } from '../../config'
import { AuthService } from './service'
import { signUpSchema, signInSchema } from './schema'
import { concatPaths, Controller, UploadFileHandler } from '../../helper'

export function authRouteRegister(prefix: string, router: Router): void {
    /**
     * @Registration_Endpoints
    */
    router.post(
        concatPaths(prefix, 'sign-up'),
        UploadFileHandler(UPLOAD.IMAGE_FOLDER_NAME_TO_SAVE, UPLOAD.IMAGE_ALLOWED_TYPES).single(UPLOAD.IMAGE_INCOMING_KEY),
        Controller(AuthService.userSignUp, signUpSchema)
    );

    router.post(
        concatPaths(prefix, 'sign-in'),
        Controller(AuthService.userSignIn, signInSchema));
}
