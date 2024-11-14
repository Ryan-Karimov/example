import { Router } from "express";
import { concatPaths } from "../../../helper";
import projectTypesRoute from "./project_types";

const router = Router({ mergeParams: true })

export default () => {
    router.use(concatPaths('project-types'), projectTypesRoute())
    return router;
};