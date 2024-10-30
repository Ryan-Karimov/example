import { checkEmailExistence } from 'advanced-email-existence';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';

import { AuthDB } from './db';
import { db } from '../../db';
import { APP } from '../../config';

export class AuthService {
    static async userSignUp(req: Request, res: Response) {
        const { last_name, first_name, birthday, email, card_number, gender, phone, password, tariff_id } = req.body;
        let image_url: null | string = null;
        const image = req.file as Express.Multer.File;
        if (image) {
            const uploadPath = path.join('static', 'profileImages');
            if (!await fs.promises.access(uploadPath).catch(() => true)) {
                await fs.promises.mkdir(uploadPath, { recursive: true });
            }

            image_url = path.join('profileImages', image.filename).replace(/\\/g, '/');
        }

        const checkEmail = await checkEmailExistence(req.body.email);
        if (!checkEmail.valid) {
            res.status(400).json({
                message: 'Email does not exist or is invalid'
            });
            return;
        }

        const existtingByPhoneNumber = await AuthDB.findUserByLogin([req.body.phone]);
        if (existtingByPhoneNumber.length !== 0) {
            res.status(409).json({ message: 'User with this phone number already exists' });
            return;
        }

        const existingByEmail = await AuthDB.findUserByEmail([req.body.email]);
        if (existingByEmail.length !== 0) {
            res.status(409).json({ message: 'User with this email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.transaction(async (client) => {
            const result = await AuthDB.createUser(client, [last_name, first_name, birthday, email, image_url, card_number, gender]);
            const newUserId = result.rows[0].id;

            await AuthDB.createUserMeta(client, [newUserId, phone, hashedPassword]);
            await AuthDB.createTariffsController(client, [newUserId, tariff_id, true]);
        });

        res.status(200).json({
            message: 'Sign-up successful'
        });
        return;
    }

    static async userSignIn(req: Request, res: Response) {
        const user = await AuthDB.findUserByLogin([req.body.login]);
        if (user.length === 0) {
            res.status(400).json({
                message: "Invalid login or password"
            });
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