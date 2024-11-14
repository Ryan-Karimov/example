import { Request, Response, NextFunction } from 'express';
import { VerifyJWToken } from '../helper';
import express from '../../types/express'
import { WorkspaceDB } from '../apps/workspace/db';


export const authMiddleware = (): CallableFunction =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        console.log("In Auth middleware...");

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
        const userId = req.user.id;

        const workspaceId = req.params.id;
        console.log(workspaceId);

        if (workspaceId) {
            const result = await WorkspaceDB.checkWorkspacePermission([workspaceId]);
            console.log(result);
            if (result[0].owner_id !== userId) {
                res.status(403).send({
                    msg: 'Access denied: Workspace not found or you don\'t have access'
                });
                return;
            }
        }
        console.log('workspace', workspaceId);

        next()
    };
