import { checkEmailExistence } from 'advanced-email-existence';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { AuthDB } from './db'
import { APP } from '../../config'

export class AuthService {
    static async userSignUp(req: Request, res: Response) {

    }

    static async userSignIn(req: Request, res: Response) {
        const user = await AuthDB.findUserByLogin([req.body.login]);
        if (user.length === 0) {
            res.status(400).json({
                message: "Invalid login or password"
            })
            return;
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user[0].password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: 'Invalid login or password'
            });
            return;
        }
        const token = jwt.sign(
            { id: user[0].id, login: user[0].login },
            APP.JWT_SECRET_KEY,
            { expiresIn: '10h' }
        );
        res.status(200).json({
            message: 'Sign-in successful',
            token
        });
        return;
    }
}