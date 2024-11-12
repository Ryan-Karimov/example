import { Request, Response } from 'express';
import { ProjectDB } from './db'

export class ProjectService {
    static async getWorkspaceProjects(_req: Request, _res: Response): Promise<void> {
        const { id } = _req.params;
        const { limit, offset, type } = _req.query;

        const result = await ProjectDB.getProjects([id, limit, offset, type]);
        _res.status(200).json({
            message: 'Project list retrieved successfully',
            data: result
        });
    };

    static async createProject(_req: Request, _res: Response): Promise<void> {
        const { id } = _req.params;
        const { title, current_price, type_id } = _req.body;

        const titleExists = await ProjectDB.checkTitleExists([id, title]);
        if (titleExists) {
            _res.status(400).json({
                message: 'A project with this name already exists'
            });
            return;
        }

        const createdProject = await ProjectDB.createProject([id, title, current_price, type_id]);
        const project = await ProjectDB.getProjectById([createdProject[0].id])
        _res.status(201).json({
            message: 'Project created successfully',
            data: project
        });
    };

    static async updateProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { title, current_price } = _req.body;

        const titleExists = await ProjectDB.checkTitleExistsForUpdate([id, title, projectId]);
        if (titleExists) {
            _res.status(400).json({
                message: 'A project with this name already exists'
            });
            return;
        }

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

    static async getProjectById(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { meta } = _req.query;
        if (meta) {
            const result = await ProjectDB.getFilesCountByProject([id, projectId]);
            _res.status(200).json({
                message: 'Files count by project retrieved successfully',
                data: result[0]
            });
            return;
        }

        const result = await ProjectDB.getProjectById([projectId]);
        _res.status(200).json({
            message: 'Project retrieved successfully',
            data: result[0]
        });
    };
}
