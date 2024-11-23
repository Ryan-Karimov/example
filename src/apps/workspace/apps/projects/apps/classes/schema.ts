import Joi from "joi";

export const createClassSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required()
    }).required(),
    body: Joi.object({
        class_order: Joi.number().integer().min(1).required(),
        title: Joi.string().max(16).required(),
        color: Joi.string().max(16).required()
    }).required()
})

export const updateClassSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required(),
        classId: Joi.number().integer().min(1).required()
    }).required(),
    body: Joi.object({
        class_order: Joi.number().integer().min(1).optional(),
        title: Joi.string().max(16).optional(),
        color: Joi.string().max(16).optional()
    }).required()
})

export const deleteClassSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required(),
        classId: Joi.number().integer().min(1).required()
    }).required()
})