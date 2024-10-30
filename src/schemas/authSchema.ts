import Joi from 'joi'

export const authSignUpSchema = Joi.object({
    login: Joi.string().min(7).required(),
    password: Joi.string().min(3).required()
})

export const authSignInSchema = Joi.object({
    login: Joi.string().min(7).required(),
    password: Joi.string().min(3).required()
})
