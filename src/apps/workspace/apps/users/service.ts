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

    static async addUserToWorkspace(_req: Request, _res: Response) {
        const { email, role_id, project_ids } = _req.body;

        const checkEmail = await checkEmailExistence(email);
        if (!checkEmail.valid) {
            _res.status(400).json({ message: 'Email does not exist or is invalid!' });
            return;
        }

        const isExistsEmail = await AuthDB.findUserByEmail([email]);
        if (isExistsEmail.length === 0) {
            _res.status(409).json({ message: 'A user with this email address does not exist!' });
            return;
        }

        for (const project_id of project_ids) {
            await UsersByWorkspaceDB.addUserToWorkspace([isExistsEmail[0].id, project_id, role_id])
        }

        _res.status(201).json({
            message: 'User added to projects successfully'
        });
    };
}
