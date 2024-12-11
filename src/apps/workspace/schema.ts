import Joi from "joi";

export const createWorkspaceSchema = Joi.object({
    body: Joi.object({
        title: Joi.string().max(32).required(),
        avatar: Joi.string().required()
    }).required()
})

export const updateWorkspaceSchema = Joi.object({
    body: Joi.object({
        title: Joi.string().max(32).optional(),
        avatar: Joi.string().optional()
    }).required(),
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }).required()
})


export const deleteWorkspaceSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }).required()
})

export const getWorkspaceSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }).required()
})