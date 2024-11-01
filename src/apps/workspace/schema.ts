import Joi from "joi";

export const createWorkspaceSchema = Joi.object({
    owner_id: Joi.number().integer().required(),
    title: Joi.string().max(64).required(),
    avatar: Joi.string().required()
})

export const newCreateWorkspaceSchema = Joi.object({
    owner_id: Joi.number().integer().required(),
    title: Joi.string().max(64).required(),
    avatar: Joi.string().required()
})

export const getWorkspacesSchema = Joi.object({
    owner_id: Joi.number().integer().required()
})

export const updateWorkspaceSchema = Joi.object({
    id: Joi.number().integer().required()
})
