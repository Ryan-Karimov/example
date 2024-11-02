import Joi from "joi";

export const createWorkspaceSchema = Joi.object({
    body: Joi.object({
        owner_id: Joi.number().integer().required(),
        title: Joi.string().max(64).required(),
        avatar: Joi.string().required()
    }).required()
})

export const getWorkspacesSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    }).required()
})

export const updateWorkspaceSchema = Joi.object({
    id: Joi.number().integer().required()
})
