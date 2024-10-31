import Joi from "joi";

export const createWorkspaceSchema = Joi.object({
    owner_id: Joi.number().required().integer(),
    title: Joi.string().required().max(64),
    avatar: Joi.string().required()
})

export const getWorkspacesSchema = Joi.object({
    owner_id: Joi.number().required().integer()
})