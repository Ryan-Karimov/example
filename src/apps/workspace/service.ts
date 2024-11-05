import { Request, Response } from "express";
import { WorkspaceDB } from "./db";

export class WorkspaceService {
    static async createWorkspace(_req: Request, _res: Response) {
        const { title, avatar } = _req.body;
        const userId = _req.user.id;

        await WorkspaceDB.createWorkspace([userId, title, avatar]);
        _res.status(201).json({
            message: 'Workspace created successfully!'
        });
        return;
    } // DONE

    static async getWorkspacesByOwnerId(_req: Request, _res: Response) {
        const userId = _req.user.id;

        const result = await WorkspaceDB.getWorkspacesByOwnerId([userId]);
        _res.status(200).json({
            message: 'Workspaces successfully get!',
            data: result
        });
        return;
    } // DONE

    static async updateWorkspaceById(_req: Request, _res: Response) {
        const { title, avatar } = _req.body;
        const { id } = _req.params;

        const result = await WorkspaceDB.updateWorkspaceById([id, title, avatar]);
        _res.status(200).json({
            message: 'Workspace successfully updated!',
            data: result
        });
        return;
    } // DONE

    static async deleteWorkspaceById(_req: Request, _res: Response) {
        const { id } = _req.params;

        const result = await WorkspaceDB.deleteWorkspaceById([id]);
        _res.status(200).json({
            message: 'Workspace successfully deleted!'
        });
        return;
    } // DONE
}