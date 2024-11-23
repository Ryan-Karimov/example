import { Request, Response } from "express";
import { ClassDB } from "./db";

export class ClassService {

    static async getClassesByProject(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;

        const result = await ClassDB.getClassesByProject([projectId])
        _res.status(200).json({
            message: 'List of classes retrieved successfully',
            data: result
        });
        return;
    }

    static async createClass(_req: Request, _res: Response): Promise<void> {
        const { id, projectId } = _req.params;
        const { class_order, title, color } = _req.body;

        const result = await ClassDB.createClass([projectId, class_order, title, color])
        _res.status(201).json({
            message: 'Class created successfully',
            data: result
        });
        return;
    }

    static async updateClass(_req: Request, _res: Response): Promise<void> {
        const { id, projectId, classId } = _req.params;
        const { class_order, title, color } = _req.body;

        await ClassDB.updateClass([projectId, classId, class_order, title, color]);
        _res.status(200).json({
            message: 'Class updated successfully'
        });
    }

    static async deleteClass(_req: Request, _res: Response): Promise<void> {
        const { id, projectId, classId } = _req.params;

        await ClassDB.deleteClass([projectId, classId]);
        _res.status(200).json({
            message: 'Class deleted successfully'
        });
    }

    static async getClassById(_req: Request, _res: Response): Promise<void> {
        const { id, projectId, classId } = _req.params;

        const result = await ClassDB.getClassById([projectId, classId])
        _res.status(200).json({
            message: 'Class retrieved successfully',
            data: result[0]
        });
        return;
    }
}