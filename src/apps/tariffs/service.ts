import { Request, Response } from "express";
import { TariffDB } from "./db";

export class TariffsService {
    static async getTariffs(req: Request, res: Response) {
        const result = await TariffDB.getTariffs();

        res.status(200).json({
            message: 'Tariffs received successfully',
            data: result
        })
    }
}