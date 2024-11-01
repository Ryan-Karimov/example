import { Router } from 'express';
import { authMiddleware } from './middlewares'
import { authRouteRegister, usersRouteRegister, workspaceRouteRegister } from './apps';
import { tariffsRoute } from './apps/tariffs';

const router: Router = Router();

export default (): Router => {
    authRouteRegister('auth', router)
    usersRouteRegister('users', router, authMiddleware)
    workspaceRouteRegister('workspaces', router, authMiddleware)
    tariffsRoute('tariffs', router)
    return router;
}
