import { Request, Response, NextFunction } from 'express';

interface ITariffsController {
    (req: Request, res: Response, next: NextFunction): Promise<void>
}

export function TariffsController(schema: any, endpointCallback: ITariffsController): ITariffsController {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (schema) {
            const { error, value } = schema.validate(req.body);
            if (error) {
                res.status(400).send({
                    message: error.details[0].message
                })
                return;
            }
            req.body = value;
        }

        try {
            await endpointCallback(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}