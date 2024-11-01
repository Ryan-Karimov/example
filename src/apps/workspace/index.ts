import { Router } from "express";
import { concatPaths } from "../../helper";
import { WorkspaceController } from "./controller";
import { createWorkspaceSchema, getWorkspacesSchema, updateWorkspaceSchema } from "./schema";
import { WorkspaceService } from "./service";

export function workspaceRoutes(prefix: string, router: Router): void {
    router.post(concatPaths(prefix, 'create'), WorkspaceController(createWorkspaceSchema, WorkspaceService.createWorkspace))
    router.get(concatPaths(prefix, 'workspaces'), WorkspaceController(getWorkspacesSchema, WorkspaceService.getWorkspacesByOwnerId))
    router.patch(concatPaths(prefix, 'workspaces'), WorkspaceController(updateWorkspaceSchema, WorkspaceService.updateWorkspaceById))
}