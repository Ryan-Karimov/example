import { Router } from 'express';
import { concatPaths } from '../../helper'

import { AuthService } from './service'
import { AuthController } from './controller'
import { signUpSchema, signInSchema } from './schema'

export function authRouteRegister(prefix: string, router: Router): void {
    router.post(concatPaths(prefix, 'sign-up'), AuthController(signUpSchema, AuthService.userSignUp));
    router.post(concatPaths(prefix, 'sign-in'), AuthController(signInSchema, AuthService.userSignIn));
}
