import Joi from 'joi'

export const signUpSchema = Joi.object({
    last_name: Joi.string().max(32).required(),
    first_name: Joi.string().max(32).required(),
    birthday: Joi.date().required(),
    email: Joi.string().max(64).required(),
    image_url: Joi.string().optional(),
    card_number: Joi.string().optional(),
    gender: Joi.number().required().default(0),
    is_active: Joi.boolean().optional().default(true),
    phone: Joi.string().max(16).required(),
    password: Joi.string().min(6).required()
})

export const signInSchema = Joi.object({
    login: Joi.string().min(7).required(),
    password: Joi.string().min(3).required()
})
