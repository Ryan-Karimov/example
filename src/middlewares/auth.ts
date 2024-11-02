import { Request, Response, NextFunction } from 'express';
import { VerifyJWToken } from '../helper'


export const authMiddleware = (): CallableFunction =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!req.headers.authorization) {
            res.status(401).send({
                msg: 'You are unauthorized!'
            });
            return;
        }

        const token = req.headers['authorization'].split('Bearer ')[1]
        const { isNotVerified, value } = VerifyJWToken(token)
        if (isNotVerified) {
            res.status(401).send({
                msg: 'You are unauthorized!'
            });
            return;
        }

        req.headers['user-id'] = value?.id.toString()
        req.headers['user-login'] = value?.login.toString()
        next()
    };
