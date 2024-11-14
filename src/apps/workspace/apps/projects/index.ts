import { Router } from 'express';

import { concatPaths, Controller } from '../../../../helper';
import { addUserSChema, checkEmailSchema, createProjectSchema, deleteProjectSchema, getProjectSchema, getWorkspaceProjectsSchema, updateProjectSchema } from './schema'
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

    router.post(concatPaths(':projectId'),
        Controller(
            ProjectService.createProject
        ));

    router.get(concatPaths(':projectId', 'meta'),
        Controller(
            ProjectService.getFileCountByStatus,
            getProjectSchema
        ));

    router.get(concatPaths(':projectId', 'new-users'),
        Controller(
            ProjectService.getUsersNotInProject,
            getProjectSchema
        ));

    router.post(concatPaths(':projectId', 'check-email'),
        Controller(
            ProjectService.checkEmail,
            checkEmailSchema
        ));

    router.post(concatPaths(':projectId', 'add-users'),
        Controller(
            ProjectService.addUsers,
            addUserSChema
        ));

    router.get(concatPaths(':projectId', 'classes'),
        Controller(
            ProjectService.getClassesByProject,
            getProjectSchema
        ));

    return router;
};