import { Router } from 'express';
import { authRouteRegister } from './apps';

const router: Router = Router();

export default (): Router => {
    authRouteRegister('auth', router)
    return router;
}
