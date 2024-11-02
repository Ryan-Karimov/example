import { Router } from 'express';

import { WorkspaceService } from "./service";
import { concatPaths, Controller } from '../../helper';
import {
    createWorkspaceSchema,
    getWorkspacesSchema,
    updateWorkspaceSchema
} from "./schema";

export function workspaceRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.post(concatPaths(prefix),
        Controller(
            WorkspaceService.createWorkspace,
            createWorkspaceSchema));

    router.get(concatPaths(prefix),
        Controller(
            WorkspaceService.getWorkspacesByOwnerId,
            getWorkspacesSchema));

    router.patch(concatPaths(prefix),
        Controller(
            WorkspaceService.updateWorkspaceById,
            updateWorkspaceSchema));
}
