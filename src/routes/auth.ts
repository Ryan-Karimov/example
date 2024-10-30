import { Router } from 'express';
import { concatPaths } from '../helper';
import { AuthController } from '../controllers/authController';
import { upload } from "../config/multer";

export default (prefix: string, router: Router): void => {
    router.post(concatPaths(prefix, 'sign-up'), upload.single('image'), AuthController.signUp);
    router.post(concatPaths(prefix, 'sign-in'), AuthController.signIn);
}