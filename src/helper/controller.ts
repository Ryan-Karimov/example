import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from 'joi'

interface IController {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function Controller(callback: IController, schema?: ObjectSchema<any>): IController {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!schema) {
            await callback(req, res, next)
            return;
        }

        const { error, value } = schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        req.body = value.body;
        req.query = value.query;
        req.params = value.params;
        await callback(req, res, next)
        return;
    }
}