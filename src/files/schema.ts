import Joi from "joi";

export enum FileState {
    QUEUE = 'QUEUE',
    PROGRESS = 'PROGRESS',
    DONE = 'DONE'
}

export const uploadFileSchema = Joi.object({
    params: Joi.object({
        projectId: Joi.number().integer().min(1).required()
    }).required(),
    body: Joi.object({
        image: Joi.array().items(Joi.string().max(40)).max(20).min(1).required()
    }).required()
})

export const getProjectFileSchema = Joi.object({
    params: Joi.object({
        projectId: Joi.number().integer().min(1).required(),
        fileId: Joi.string().required()
    }).required()
})

export const getProjectFilesSchema = Joi.object({
    params: Joi.object({
        projectId: Joi.number().integer().min(1).required()
    }).required(),
    query: Joi.object({
        state: Joi.string().valid(...Object.values(FileState)).required(),
        page: Joi.number().integer().min(0).default(1),
        limit: Joi.number().integer().min(1).default(10)
    })
})

export const deleteProjectFileSchema = Joi.object({
    params: Joi.object({
        projectId: Joi.number().integer().min(1).required(),
        fileId: Joi.string().required()
    }).required()
})
