import { Router } from 'express';

import { concatPaths, Controller } from '../../../../helper';
import { getWorkspaceProjectsSchema } from './schema'
import { ProjectService } from './service'

const router = Router()

export default () => {
    router.get(concatPaths('/'),
        Controller(
            ProjectService.getWorkspaceProjects,
            getWorkspaceProjectsSchema));                            // TO GET ALL WORKSPACE PROJECT LIST

    return router
};