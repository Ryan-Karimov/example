import { NextFunction, Request, Response, RequestHandler } from "express";
import Joi, { ObjectSchema } from 'joi'

const emptyBodySchema = Joi.object({ body: {} })
const emptyQuerySchema = Joi.object({ query: {} })
const emptyParamsSchema = Joi.object({ params: {} })

export function Controller(callback: CallableFunction, schema?: ObjectSchema<any>): any {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!schema) {
            try {
                await callback(req, res);
                return;
            } catch (err) {
                next(err as Error)
            }
        } else {
            const { error, value } = schema
                .concat(emptyBodySchema)
                .concat(emptyQuerySchema)
                .concat(emptyParamsSchema)
                .validate({
                    body: req.body,
                    query: req.query,
                    params: req.params
                });
            if (error) {
                res.status(400).json({ message: error.details[0].message });
                return;
            }

            req.body = value.body;
            req.query = value.query;
            req.params = value.params;
            try {
                await callback(req, res);
                return;
            } catch (err) {
                next(err as Error)
            }
        }
    };
}
