import { Router } from 'express';
import { authMiddleware } from './middlewares'
import { authRouteRegister, usersRouteRegister, workspaceRouteRegister, projectRouteRegister } from './apps';
import { tariffsRoute } from './apps/tariffs';

const mainRouter: Router = Router();

const apiV1Path = '/api/v1'
const apiV2Path = '/api/v2'

const apiV1Router: Router = Router();
const apiV2Router: Router = Router();


export default (): Router => {
    authRouteRegister('auth', mainRouter)

    /*/ ________________________________________________________/*/
    /*/                     ADD ROUTES TO API V1                /*/
    usersRouteRegister('users', apiV1Router, authMiddleware)
    workspaceRouteRegister('workspaces', apiV1Router, authMiddleware)
    projectRouteRegister('projects', apiV1Router)
    tariffsRoute('tariffs', apiV1Router)
    /*/ ________________________________________________________/*/


    /**
     * @Add_API_Routers_To_Main_Router
    */
    mainRouter.use(apiV1Path, apiV1Router);
    mainRouter.use(apiV2Path, apiV2Router);
    return mainRouter;
}
