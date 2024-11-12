import { Router } from 'express';

import { concatPaths, Controller } from '../../../../helper';
import { createProjectSchema, deleteProjectSchema, getProjectSchema, getWorkspaceProjectsSchema, updateProjectSchema } from './schema'
import { ProjectService } from './service'

const router = Router({ mergeParams: true })

export default () => {
    router.get(concatPaths(''),
        Controller(
            ProjectService.getWorkspaceProjects,
            getWorkspaceProjectsSchema
        ));                                              // TO GET THE LIST OF ALL PROJECTS IN A WORKSPACE

    router.post(concatPaths(''),
        Controller(
            ProjectService.createProject,
            createProjectSchema
        ));                                             // TO CREATE A NEW PROJECT IN THE WORKSPACE

    router.patch(concatPaths(':projectId'),
        Controller(
            ProjectService.updateProject,
            updateProjectSchema
        ));                                             // TO UPDATE PROJECT INFORMATION BY PROJECT ID

    router.delete(concatPaths(':projectId'),
        Controller(
            ProjectService.deleteProject,
            deleteProjectSchema
        ));                                             // TO DELETE A PROJECT BY PROJECT ID

    router.get(concatPaths(':projectId'),
        Controller(
            ProjectService.getProjectById,
            getProjectSchema
        ));                                             // TO GET A PROJECT DETAILS BY PROJECT ID

    return router;
};