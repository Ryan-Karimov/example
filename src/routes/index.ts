import { Router } from 'express';
import auth from './auth';
import tariffs from './tariffs';
import profile from './profile';

const router: Router = Router();

export default (): Router => {
    auth('auth', router)
    tariffs('/tariffs', router)
    profile('/profile', router)

    return router;
}
