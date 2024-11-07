import { Request, Response } from 'express';
import { ProjectDB } from './db'

export class ProjectService {
    static async getWorkspaceProjects(_req: Request, _res: Response): Promise<void> {
        const { id } = _req.params;

        const result = await ProjectDB.getProjects([id]);
        _res.status(200).json({
            message: 'Project list retrieved successfully',
            data: result
        });
    };

    static async createProject(_req: Request, _res: Response): Promise<void> {
        const { id } = _req.params;
        const { title, current_price, type_id } = _req.body;

        const result = await ProjectDB.createProject([id, title, current_price, type_id]);
        _res.status(201).json({
            message: 'Project created successfully',
            data: result
        });
    };

    static async updateProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { title, current_price } = _req.body;

        await ProjectDB.updateProject([id, projectId, title, current_price]);
        _res.status(200).json({
            message: 'Project updated successfully'
        });
    };

    static async deleteProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        await ProjectDB.deleteProject([id, projectId]);
        _res.status(200).json({
            message: 'Project deleted successfully'
        });
    };
}
