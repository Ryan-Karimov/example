import { Router } from 'express';
import { concatPaths } from '../helper'
import { AuthController } from '../controllers/authController'

export default (prefix: string, router: Router): void => {
    router.post(concatPaths(prefix, 'sign-up'), AuthController.signUp);
    router.post(concatPaths(prefix, 'sign-in'), AuthController.signIn);
}