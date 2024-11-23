import { Request, Response } from 'express';
import { checkEmailExistence } from 'advanced-email-existence';
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
        const project = await ProjectDB.getProjectById([id, createdProject[0].id])

        _res.status(201).json({
            message: 'Project created successfully',
            data: project
        });
        return;
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

        const result = await ProjectDB.getProjectById([id, projectId]);
        _res.status(200).json({
            message: 'Project retrieved successfully',
            data: result[0]
        });
    };

    static async addUserToProject(_req: Request, _res: Response): Promise<void> {
        _res.status(200).json({
            message: 'Successful'
        });
    }

    static async getFileCountByStatus(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        const result = await ProjectDB.getFilesCountByProject([id, projectId]);
        _res.status(200).json({
            message: 'Files count by project retrieved successfully',
            data: result[0]
        });
        return;
    }

    static async getUsersNotInProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        const result = await ProjectDB.getUsersNotInProject([id, projectId]);
        _res.status(200).json({
            message: 'Successfully retrieved list of users not in the project',
            data: result
        });
        return;
    }

    static async checkEmail(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { email } = _req.body;

        const isExistsEmail = await ProjectDB.getUserByProject([id, projectId, email]);
        if (isExistsEmail.length !== 0) {
            _res.status(409).json({ message: 'A user with the same email address already exists!' });
            return;
        }

        const checkEmail = await checkEmailExistence(email);
        if (!checkEmail.valid) {
            _res.status(400).json({ message: 'Email does not exist or is invalid!' });
            return;
        }

        _res.status(200).json({
            message: 'The email address is valid and available for use in the project'
        });
        return;
    }

    static async addUsers(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { email, role_id, users } = _req.body;

        await ProjectDB.addUsersToProject([users, projectId, role_id]);
        _res.status(201).json({
            message: 'Users were successfully added to the project'
        });
        return;
    }
}
