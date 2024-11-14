import { Router } from 'express'

import { concatPaths } from '../../../helper'
import dashboardRoute from './dashboard'
import projectRoute from './projects'
import userRoute from './users'

const router = Router({ mergeParams: true })

export default () => {
    router.use(concatPaths('dashboard'), dashboardRoute())
    router.use(concatPaths('projects'), projectRoute())
    router.use(concatPaths('users'), userRoute())
    return router;
};