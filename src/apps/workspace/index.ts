import { Router } from 'express';

import { WorkspaceController } from "./controller";
import { WorkspaceService } from "./service";
import { concatPaths } from '../../helper';
import {
    createWorkspaceSchema,
    getWorkspacesSchema,
    updateWorkspaceSchema
} from "./schema";

export function workspaceRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.post(concatPaths(prefix, ''), WorkspaceController(createWorkspaceSchema, WorkspaceService.createWorkspace))
    router.get(concatPaths(prefix, ''), WorkspaceController(getWorkspacesSchema, WorkspaceService.getWorkspacesByOwnerId))
    router.patch(concatPaths(prefix, ''), WorkspaceController(updateWorkspaceSchema, WorkspaceService.updateWorkspaceById))
}
