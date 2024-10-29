import { Tariffs } from "../models/Tariffs";
import { Request, Response } from 'express';

export class TariffsContoller {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const tariffs = await Tariffs.getAll();

            res.status(200).json({
                message: 'Tariffs retrieved successfully',
                data: tariffs
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Error get tariffs',
                    error: error.message
                });
            }
        }
    }
}