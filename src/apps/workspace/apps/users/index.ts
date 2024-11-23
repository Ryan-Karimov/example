import { Router } from 'express'
import { concatPaths, Controller } from '../../../../helper';
import { UserService } from './service';
import { getUsersByWorkspace } from './schema';

const router = Router({ mergeParams: true })

export default () => {
    router.get(concatPaths('/'),
        Controller(
            UserService.getUsersByWorkspace,
            getUsersByWorkspace
        ));                                                     // TO GET USERS IN A SPECIFIC WORKSPACE

    return router;
};