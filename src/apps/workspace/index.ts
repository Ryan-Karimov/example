import { Router } from 'express';

import { WorkspaceService } from "./service";
import { concatPaths, Controller } from '../../helper';
import {
    createWorkspaceSchema,
    updateWorkspaceSchema,
    deleteWorkspaceSchema
} from "./schema";

import workspaceRoute from './apps/routes'

export function workspaceRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.post(concatPaths(prefix),
        Controller(
            WorkspaceService.createWorkspace,
            createWorkspaceSchema));                            // TO CREATE A NEW WORKSPACE

    router.get(concatPaths(prefix),
        Controller(
            WorkspaceService.getWorkspacesByOwnerId));          // TO GET ALL WORKSPACES LIST

    router.patch(concatPaths(prefix, ':id'),
        Controller(
            WorkspaceService.updateWorkspaceById,
            updateWorkspaceSchema));                            // TO UPDATE THE WORKSPACE INFO

    router.delete(concatPaths(prefix, ':id'),
        Controller(
            WorkspaceService.deleteWorkspaceById,
            deleteWorkspaceSchema));                            // TO DELETE THE WORKSPACE

    console.log(concatPaths(prefix, ':id'));

    router.use(concatPaths(prefix, ':id'), workspaceRoute())    // REGISTRATION WORKSPACE APPS
}
