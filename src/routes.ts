import { Router } from 'express';
import { authMiddleware } from './middlewares'

import {
    authRouteRegister,
    usersRouteRegister,
    workspaceRouteRegister,
    tariffsRoute,
    adminRoutes
} from './apps';

const mainRouter: Router = Router({ mergeParams: true });

const apiV1Path = '/api/v1';
const apiV2Path = '/api/v2';

const apiV1Router: Router = Router({ mergeParams: true });
const apiV2Router: Router = Router({ mergeParams: true });


export default (): Router => {
    authRouteRegister(`${apiV1Path}/auth`, mainRouter)

    /*/ ________________________________________________________/*/
    /*/                     ADD ROUTES TO API V1                /*/
    usersRouteRegister('users', apiV1Router, authMiddleware)
    workspaceRouteRegister('workspaces', apiV1Router, authMiddleware)
    tariffsRoute('tariffs', apiV1Router, authMiddleware)
    /*/ ________________________________________________________/*/
    adminRoutes('admin', apiV1Router, authMiddleware)


    /**
     * @Add_API_Routers_To_Main_Router
    */
    mainRouter.use(apiV1Path, apiV1Router);
    mainRouter.use(apiV2Path, apiV2Router);
    return mainRouter;
}
