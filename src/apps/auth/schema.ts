import Joi from 'joi'
import { JoiDate } from '../../helper'

export const signUpSchema = Joi.object({
    body: {
        tariff_id: Joi.number().required().integer().min(1),
        last_name: Joi.string().max(32).required(),
        first_name: Joi.string().max(32).required(),
        birthday: JoiDate('DD.MM.YYYY').required(),
        email: Joi.string().max(64).required(),
        image: Joi.string().allow('', null).default('').optional(),
        card_number: Joi.string().allow('', null).optional(),
        gender: Joi.number().integer().valid(0, 1).required(),
        phone: Joi.string().max(16).required(),
        password: Joi.string().min(6).required(),
    }
})

export const signInSchema = Joi.object({
    body: {
        login: Joi.string().min(7).required(),
        password: Joi.string().min(3).required()
    }
})
