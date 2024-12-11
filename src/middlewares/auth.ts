import { Request, Response, NextFunction } from 'express';
import { VerifyJWToken } from '../helper';
import express from '../../types/express'
import { WorkspaceDB } from '../apps/workspace/db';


export const authMiddleware = (): CallableFunction =>
    async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
        if (!_req.headers.authorization) {
            _res.status(401).json({
                message: 'You are unauthorized!'
            });
            return;
        }

        const token = _req.headers['authorization'].split('Bearer ')[1];
        const { isNotVerified, value } = VerifyJWToken(token);

        if (isNotVerified) {
            _res.status(401).json({
                message: 'You are unauthorized!'
            });
            return;
        }

        _req.user = value;
        const userId = _req.user.id;

        const workspaceId = _req.params.id;

        console.log('Current path:', _req.path);
        console.log('Route params:', _req.params);
        console.log('Workspace ID:', workspaceId);
        console.log('User ID:', userId);

        // if (workspaceId) {
        // const [workspace] = await WorkspaceDB.checkWorkspacePermission([workspaceId]);
        // console.log('Workspace check result:', workspace);

        // if (!workspace || workspace.owner_id !== userId) {
        //     _res.status(403).json({
        //         message: 'Access denied: Workspace not found or you don\'t have access'
        //     });
        //     return;
        // }
        // }

        next();
    };
