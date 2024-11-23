import { Request, Response } from "express";
import { FIleDB } from "./db";

export class FileService {

    static async getFilesByProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        const result = await FIleDB.getFilesByProject([projectId])
        _res.status(200).json({
            message: 'List of files retrieved successfully',
            data: result
        });
        return;
    }
}