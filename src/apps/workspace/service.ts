import { NextFunction, Request, Response } from "express";
import { WorkspaceDB } from "./db";

export class WorkspaceService {
    static async createWorkspace(_req: Request, _res: Response) {
        const { owner_id, title, avatar } = _req.body;

        await WorkspaceDB.createWorkspace([owner_id, title, avatar]);
        _res.status(201).json({
            message: 'Workspace created successfully!'
        });
        return;
    }

    static async getWorkspacesByOwnerId(req: Request, res: Response) {
        const { owner_id } = req.body;

        const result = await WorkspaceDB.getWorkspacesByOwnerId([owner_id]);
        res.status(200).json({
            message: 'Workspaces received successfully!',
            data: result
        });
        return;
    }

    static async updateWorkspaceById(req: Request, res: Response) {
        const { id, owner_id } = req.body;

        const result = await WorkspaceDB.updateWorkspaceById([id, owner_id]);
        res.status(200).json({
            message: 'Workspace updated successfully!',
            data: result
        });
        return;
    }


}