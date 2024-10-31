import { NextFunction, Request, Response } from "express";

interface IWorkspaceController {
    (req: Request, res: Response, next: NextFunction): Promise<void>
}

export function WorkspaceController(schema: any, endpointCallback: IWorkspaceController): IWorkspaceController {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            res.status(400).send({
                message: error.details[0].message
            })
            return;
        }
        req.body = value;

        try {
            await endpointCallback(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}