import { Router } from "express";
import { concatPaths, Controller } from "../../../../../../helper";
import { getProjectSchema } from "../../schema";
import { ClassService } from "./service";
import { createClassSchema, deleteClassSchema, updateClassSchema } from "./schema";

const router = Router({ mergeParams: true });

export default () => {
    router.get(concatPaths('classes'),
        Controller(
            ClassService.getClassesByProject,
            getProjectSchema
        ));

    router.post(concatPaths('classes'),
        Controller(
            ClassService.createClass,
            createClassSchema
        ));

    router.patch(concatPaths('classes', ':classId'),
        Controller(
            ClassService.updateClass,
            updateClassSchema
        ));

    router.delete(concatPaths('classes', ':classId'),
        Controller(
            ClassService.deleteClass,
            deleteClassSchema
        ));

    router.get(concatPaths('classes', ':classId'),
        Controller(
            ClassService.getClassById,
            deleteClassSchema
        ));

    return router;
}