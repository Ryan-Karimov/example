import { Router } from "express";
import { concatPaths, Controller, UploadFileHandler } from "../helper";
import { UPLOAD } from "../config";
import { UploadFileService } from "./service";
import { deleteProjectFileSchema, getProjectFileSchema, getProjectFilesSchema, uploadFileSchema } from "./schema";

export function UploadFileRoutes(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.post(
        concatPaths(prefix, 'upload', ':projectId'),
        UploadFileHandler('projects', UPLOAD.IMAGE_ALLOWED_TYPES).array(UPLOAD.IMAGE_INCOMING_KEY, 20),
        Controller(UploadFileService.uploadFileToProject, uploadFileSchema));

    router.get(
        concatPaths(prefix, ':projectId', ':fileId'),
        Controller(UploadFileService.getProjectFile, getProjectFileSchema)
    );

    router.get(
        concatPaths(prefix, ':projectId'),
        Controller(UploadFileService.getProjectFiles, getProjectFilesSchema)
    );

    router.delete(
        concatPaths(prefix, ':projectId', ':fileId'),
        Controller(UploadFileService.deleteProjectFile, deleteProjectFileSchema)
    );
}