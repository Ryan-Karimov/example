import { Request, Response } from "express";
import { WorkspaceDB } from "./db";

export class WorkspaceService {
    static async createWorkspace(req: Request, res: Response) {
        const { owner_id, title, avatar } = req.body;

        await WorkspaceDB.createWorkspace([owner_id, title, avatar]);
        res.status(200).json({
            message: 'Workspace created successful'
        });
        return;
    }

    static async getWorkspacesByOwnerId(req: Request, res: Response) {
        const { owner_id } = req.body;

        const result = await WorkspaceDB.getWorkspacesByOwnerId([owner_id]);
        res.status(200).json({
            message: 'Workspaces received successful',
            data: result
        });
        return;
    }

    static async updateWorkspaceById(req: Request, res: Response) {
        const { id, owner_id } = req.body;

        const result = await WorkspaceDB.updateWorkspaceById([id, owner_id]);
        res.status(200).json({
            message: 'Workspace updated successful',
            data: result
        });
        return;
    }


}