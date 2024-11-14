import { Router } from "express";
import { concatPaths, Controller } from "../../../../helper";
import { ProjectTypeService } from "./service";

const router = Router({ mergeParams: true })

export default () => {
    router.get(concatPaths(''),
        Controller(
            ProjectTypeService.getProjectTypes
        ));

    return router;
};