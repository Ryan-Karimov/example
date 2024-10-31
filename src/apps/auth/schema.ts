import Joi from 'joi'
import { JoiDate } from '../../helper'

export const signUpSchema = Joi.object({
    tariff_id: Joi.number().required().integer().min(1),
    last_name: Joi.string().max(32).required(),
    first_name: Joi.string().max(32).required(),
    birthday: JoiDate('DD.MM.YYYY').required(),
    email: Joi.string().max(64).required(),
    image: Joi.string().optional(),
    card_number: Joi.string().optional(),
    gender: Joi.number().min(0).max(1).required(),
    phone: Joi.string().max(16).required(),
    password: Joi.string().min(6).required()
})

export const signInSchema = Joi.object({
    login: Joi.string().min(7).required(),
    password: Joi.string().min(3).required()
})
