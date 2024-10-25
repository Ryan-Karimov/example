import { Router } from 'express';
import auth from './auth';

const router: Router = Router();

export default (): Router => {
    auth('auth', router)

    return router;
}
