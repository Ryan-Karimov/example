import { checkEmailExistence } from 'advanced-email-existence';
import { Request, Response } from 'express';
import { PoolClient } from 'pg'

import jwt from 'jsonwebtoken';

import { db } from '../../db';
import { AuthDB } from './db';
import { APP } from '../../config';
import { removeFile, hash, compare } from '../../helper'

export class AuthService {
    static async userSignUp(req: Request, res: Response) {
        const { tariff_id, last_name, first_name, birthday, email, image, card_number, gender, phone, password } = req.body;
        if (image === null) {
            res.status(400).send({
                message: "Invalid file type. Only JPEG, PNG, and PDF files are allowed!"
            });
            return;
        }

        const uploadedFile = req.file as Express.Multer.File
        const isExistsPhoneNumber = await AuthDB.findUserByLogin([req.body.phone]);
        if (isExistsPhoneNumber.length !== 0) {
            if (uploadedFile) removeFile(uploadedFile.path);
            res.status(409).json({ message: 'A user with the same phone number already exists!' });
            return;
        }

        const isExistsEmail = await AuthDB.findUserByEmail([req.body.email]);
        if (isExistsEmail.length !== 0) {
            if (uploadedFile) removeFile(uploadedFile.path);
            res.status(409).json({ message: 'A user with the same email address already exists!' });
            return;
        }

        const checkEmail = await checkEmailExistence(req.body.email);
        if (!checkEmail.valid) {
            if (uploadedFile) removeFile(uploadedFile.path);
            res.status(400).json({
                message: 'Email does not exist or is invalid!'
            });
            return;
        }

        const hashPassword = await hash(password);
        await db.transaction(async (client: PoolClient) => {
            const result = await AuthDB.createUser([last_name, first_name, birthday, email, image.originalname, card_number, gender], client);
            const newUserId = result.rows[0].id;

            await AuthDB.createUserMeta([newUserId, phone, hashPassword], client);
            await AuthDB.createTariffsController([newUserId, tariff_id, true], client);
        });

        res.status(200).json({
            message: 'Sign-up successfully!'
        });
        return;
    }

    static async userSignIn(req: Request, res: Response) {
        const user = await AuthDB.findUserByLogin([req.body.login]);
        if (user.length === 0) {
            res.status(400).json({
                message: "Invalid login or password!"
            });
            return;
        }

        const isPasswordValid = await compare(req.body.password, user[0].password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: 'Invalid login or password!'
            });
            return;
        }

        const token = jwt.sign(
            {
                id: user[0].id,
                login: user[0].login
            },
            APP.JWT_SECRET_KEY,
            { expiresIn: '10h' }
        );
        res.status(200).json({
            message: 'Sign-in successful',
            token: token
        });
        return;
    }
}