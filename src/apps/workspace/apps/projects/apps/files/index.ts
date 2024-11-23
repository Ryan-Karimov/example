import { Router } from "express";
import { concatPaths, Controller } from "../../../../../../helper";
import { getFilesSchema } from "./schema";
import { FileService } from "./service";

const router = Router({ mergeParams: true });

export default () => {
    router.get(concatPaths('files'),
        Controller(
            FileService.getFilesByProject,
            getFilesSchema
        ));

    return router;
}