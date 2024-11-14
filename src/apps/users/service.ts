import { Request, Response } from "express";
import { UsersDB } from "./db";

export class UserService {
    static async getMe(_req: Request, _res: Response) {
        const userId = _req.user.id;

        const result = await UsersDB.getMe([userId])
        _res.status(200).json({
            message: 'User successfully received!',
            data: result
        });
        return;
    }
}