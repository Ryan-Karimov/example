import Joi from 'joi'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import { APP } from '../config'

export interface IUserData {
    id: number;
    login: string;
}

interface IVerify {
    isNotVerified?: boolean;
    value: IUserData;
}

export function GenerateJWToken(payload: IUserData): string {
    return jwt.sign(
        payload,
        APP.JWT_SECRET_KEY,
        { expiresIn: '10h' }
    );
}

export function VerifyJWToken(token: string): IVerify {
    try {
        const decode = jwt.verify(token, APP.JWT_SECRET_KEY);
        return { value: decode as IUserData }
    }
    catch (err) {
        return { isNotVerified: true, value: { id: 0, login: '' } }
    }

}

export function JoiDate(format: string, msg?: string) {
    const _msg = msg ? msg : `Invalid date format! Valid date format: ${format}`;

    return Joi.string().custom((value, helpers) => {
        if (moment(value, format, true).isValid()) {
            return value;
        } else {
            return helpers.error('any.invalid');
        }
    }, 'Custom Date Validation')
        .message(_msg)
}