import Joi from "joi";


export const getWorkspaceProjectsSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }).required()
})
