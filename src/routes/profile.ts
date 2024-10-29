import { Router } from "express";
import { concatPaths } from "../helper";
import { ProfileController } from "../controllers/profileController";
import { upload } from "../config/multer";

export default (prefix: string, router: Router): void => {
    router.post(concatPaths(prefix, 'uploadImage'), upload.single('image'), ProfileController.uploadImage);
}