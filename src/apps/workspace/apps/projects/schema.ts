import Joi from "joi";


export const getWorkspaceProjectsSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    }).required(),
    query: Joi.object({
        limit: Joi.number().integer().min(1).default(10).optional(),
        offset: Joi.number().integer().min(0).default(0).optional(),
        type: Joi.number().integer().min(1).optional()
    }).optional()
})

export const createProjectSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required()
    }).required(),
    body: Joi.object({
        title: Joi.string().max(32).min(3).required(),
        current_price: Joi.number().integer().min(0).required(),
        type_id: Joi.number().integer().min(1).required()
    }).required()
})

export const updateProjectSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required()
    }).required(),
    body: Joi.object({
        title: Joi.string().max(32).min(3).optional(),
        current_price: Joi.number().integer().min(0).optional()
    }).required()
})

export const deleteProjectSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required()
    }).required()
})

export const getProjectSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required()
    }).required()
})

export const checkEmailSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required()
    }).required(),
    body: Joi.object({
        email: Joi.string().max(64).required(),
    }).required()
})

export const addUserSChema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
        projectId: Joi.number().integer().min(1).required()
    }).required(),
    body: Joi.object({
        email: Joi.array().items(Joi.string().email()).min(1).optional(),
        role_id: Joi.number().integer().min(1).required(),
        users: Joi.array().items(Joi.number().integer().min(1)).min(1).optional()
    }).required()
})

export const mergingProjectsSchema = Joi.object({
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }).required(),
    body: Joi.object({
        title: Joi.string().max(32).optional(),
        type_id: Joi.number().integer().min(1).required(),
        current_price: Joi.number().integer().min(0).required(),
        project_ids: Joi.array().items(Joi.number().integer().min(1)).min(1).required()
    }).required()
})