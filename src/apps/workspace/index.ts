import { Router, NextFunction } from 'express';
import { concatPaths, UploadFileHandler } from '../../helper'

import { UPLOAD } from '../../config'
import { WorkspaceController } from "./controller";
import { createWorkspaceSchema, getWorkspacesSchema, updateWorkspaceSchema } from "./schema";
import { WorkspaceService } from "./service";
// import { UserService } from './service'
// import { UserController } from './controller'
// import { signUpSchema, signInSchema } from './schema'

export function workspaceRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    router.all(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.post(concatPaths(prefix, 'create'), WorkspaceController(createWorkspaceSchema, WorkspaceService.createWorkspace))
    router.get(concatPaths(prefix, 'workspaces'), WorkspaceController(getWorkspacesSchema, WorkspaceService.getWorkspacesByOwnerId))
    router.patch(concatPaths(prefix, 'workspaces'), WorkspaceController(updateWorkspaceSchema, WorkspaceService.updateWorkspaceById))
    router.get(concatPaths(prefix, ''), async (req, res) => {
        res.send({
            msg: "Response is succescfully!"
        })
    }
    );
}
