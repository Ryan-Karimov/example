import { Router } from 'express';

import { WorkspaceService } from "./service";
import { concatPaths, Controller } from '../../helper';
import {
    createWorkspaceSchema,
    updateWorkspaceSchema,
    deleteWorkspaceSchema,
    getWorkspaceSchema
} from "./schema";

import workspaceRoute from './apps/routes'

export function workspaceRouteRegister(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    const middleware = middlewares.map(m => m());

    // Базовые маршруты
    router
        .post(concatPaths(prefix), middleware, Controller(WorkspaceService.createWorkspace, createWorkspaceSchema))
        .get(concatPaths(prefix, 'roles'), middleware, Controller(WorkspaceService.getRoles))
        .get(concatPaths(prefix), middleware, Controller(WorkspaceService.getWorkspacesByOwnerId));

    // Маршруты с :id
    const idRoutes = Router({ mergeParams: true });

    idRoutes
        .patch('/', Controller(WorkspaceService.updateWorkspaceById, updateWorkspaceSchema))
        .delete('/', Controller(WorkspaceService.deleteWorkspaceById, deleteWorkspaceSchema))
        .get('/', Controller(WorkspaceService.getWorkspaceById, getWorkspaceSchema));

    // Подключаем подмаршруты с сохранением базового пути
    idRoutes.use('/', workspaceRoute());

    // Применяем middleware к маршрутам с :id
    router.use(concatPaths(prefix, ':id'), middleware, idRoutes);
}
