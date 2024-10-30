import Joi from 'joi'

export const signUpSchema = Joi.object({
})

export const signInSchema = Joi.object({
    login: Joi.string().min(7).required(),
    password: Joi.string().min(3).required()
})
