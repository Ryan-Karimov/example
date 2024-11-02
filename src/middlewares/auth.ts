import { Request, Response, NextFunction } from 'express';
import { VerifyJWToken } from '../helper'
import express from '../../types/express'


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
        req.user = value;
        next()
    };
