import { Router } from "express";
import { concatPaths, Controller } from "../../../helper";
import { MetaService } from "./service";
import { getMetadataSchema } from "./schema";

const router = Router({ mergeParams: true });

export default () => {
    router.get(concatPaths('meta'),
        Controller(
            MetaService.getMetadataByFileId,
            getMetadataSchema
        ));

    return router;
};