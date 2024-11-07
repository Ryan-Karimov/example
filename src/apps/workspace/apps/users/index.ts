import { Router } from 'express'
import { concatPaths, Controller } from '../../../../helper';
import { UserService } from './service';
import { addUserToWorkspace, getUsersByWorkspace } from './schema';

const router = Router({ mergeParams: true })

export default () => {
    router.get(concatPaths('/'),
        Controller(
            UserService.getUsersByWorkspace,
            getUsersByWorkspace
        ));

    router.post(concatPaths('/'),
        Controller(
            UserService.addUserToWorkspace,
            addUserToWorkspace
        ));

    return router;
};