import Joi from "joi";

export const getUsersByWorkspace = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }).required()
})

export const addUserToWorkspace = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }).required(),
    body: Joi.object({
        email: Joi.string().required(),
        role_id: Joi.number().integer().min(1).required(),
        project_ids: Joi.array().required(),
    }).required()
})
