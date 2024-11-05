import { Request, Response } from 'express';
import { ProjectDB } from './db'

export class ProjectService {
    static async getWorkspaceProjects(_req: Request, _res: Response): Promise<void> {
        const { id } = _req.params;

    }

}