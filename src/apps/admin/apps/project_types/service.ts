import { Request, Response } from "express";
import { ProjectTypesDB } from "./db";

export class ProjectTypeService {
    static async getProjectTypes(_req: Request, _res: Response) {
        const result = await ProjectTypesDB.getProjectTypes();
        _res.status(200).json({
            message: 'Project types received successfully',
            data: result
        });
    };
}