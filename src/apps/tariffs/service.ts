import { Request, Response } from "express";
import { TariffDB } from "./db";

export class TariffsService {
    static async getTariffs(_req: Request, _res: Response): Promise<void> {
        const result = await TariffDB.getTariffs();

        _res.status(200).json({
            message: 'Tariffs received successfully',
            data: result
        })
        return;
    }
}