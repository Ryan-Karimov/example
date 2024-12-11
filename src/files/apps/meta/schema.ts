import Joi from "joi";

export const getMetadataSchema = Joi.object({
    params: Joi.object({
        projectId: Joi.number().integer().min(1).required(),
        fileId: Joi.number().integer().min(1).required()
    })
});
