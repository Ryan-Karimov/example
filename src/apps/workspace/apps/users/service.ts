import { Request, Response } from "express";
import { checkEmailExistence } from 'advanced-email-existence';
import { UsersByWorkspaceDB } from "./db";
import { AuthDB } from "../../../auth/db";

export class UserService {
    static async getUsersByWorkspace(_req: Request, _res: Response) {
        const { id } = _req.params;

        const result = await UsersByWorkspaceDB.getUsersByWorkspace([id]);
        _res.status(200).json({
            message: 'User list by workspace received successfully',
            data: result
        });
    };
}
