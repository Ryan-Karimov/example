import { Router } from 'express';
import { authRouteRegister, usersRouteRegister } from './apps';

const router: Router = Router();

export default (): Router => {
    authRouteRegister('auth', router)
    usersRouteRegister('users', router)
    return router;
}
