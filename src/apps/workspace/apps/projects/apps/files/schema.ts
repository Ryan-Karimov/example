import Joi from "joi";

export const getFilesSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required()
    }).required()
})