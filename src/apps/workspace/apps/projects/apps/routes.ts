import { Router } from "express";
import { concatPaths } from "../../../../../helper";
import classRoute from './classes'
import fileRoute from './files'

const router = Router({ mergeParams: true });

export default () => {
    router.use(concatPaths(''), classRoute())
    router.use(concatPaths(''), fileRoute())
    return router;
}