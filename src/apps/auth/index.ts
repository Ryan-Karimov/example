import { Router } from 'express';
import { concatPaths } from '../../helper'

import { AuthService } from './service'
import { AuthController } from './controller'
import { signUpSchema, signInSchema } from './schema'
import { upload } from '../../config/multer';

export function authRouteRegister(prefix: string, router: Router): void {
    router.post(concatPaths(prefix, 'sign-up'), upload.single('image'), AuthController(signUpSchema, AuthService.userSignUp));
    router.post(concatPaths(prefix, 'sign-in'), AuthController(signInSchema, AuthService.userSignIn));
}
