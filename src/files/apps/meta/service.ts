import { Request, Response } from "express";
import { MetaDB } from "./db";

export class MetaService {
    static async getMetadataByFileId(_req: Request, _res: Response) {
        const { projectId, fileId } = _req.params;

        const metadata = await MetaDB.getMetadataByFileId(fileId, projectId);
        _res.status(200).json({
            message: 'File metadata retrieved successfully',
            data: metadata
        });
    }
}