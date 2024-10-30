import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { APP } from '../config/index';
import { authSignInSchema, authSignUpSchema } from '../schemas'
import { checkEmailExistence } from 'advanced-email-existence';

export class AuthController {
    static async signUp(req: Request, res: Response) {
        const { error, value } = authSignUpSchema.validate(req.body);
        if (error) {

        }
        const user = await User.findUserByPhoneNumber([])

        try {
            const result = await checkEmailExistence(req.body.email);
            if (!result.valid) {
                res.status(400).json({
                    message: 'Email does not exist or is invalid'
                });
                return;
            }

            const existingByEmail = await User.findByEmail(req.body.email);
            if (existingByEmail) {
                res.status(409).json({ message: 'User with this phone number already exists' });
                return;
            }

            const existtingByLogin = await User.findByLogin(req.body.phone);
            if (existtingByLogin) {
                res.status(409).json({ message: 'User with this email already exists' });
                return;
            }

            await User.createUser(req.body, req.body.phone, req.body.password, req.body.tariff_id);

            res.status(201).json({
                message: 'User created successfully'
            });
        } catch (error) {
            const err = error as Error;
            if (err.message === 'User with this phone number already exists') {
                res.status(409).json({
                    message: err.message
                });
            } else {
                res.status(500).json({
                    message: 'Error creating user',
                    error: err.message
                });
            }
        }
    }

    static async signIn(req: Request, res: Response) {
        const { login, password } = req.body;

        const user = await User.findByLogin(login);
        if (!user) {
            res.status(400).json({ message: 'Invalid login or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid login or password' });
            return;
        }
        const { error, value } = authSignInSchema.validate(req.body)
        if (error) {
            res.status(400).json({
                message: "Bad request!"
            })
            return;
        }

        const user = await User.findUserByLogin(value.login);
        if (user.length === 0) {
            res.status(400).json({
                message: "Invalid login or password"
            })
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
        const isPasswordValid = await bcrypt.compare(value.password, user[0].password);
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
