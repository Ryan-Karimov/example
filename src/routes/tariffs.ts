import { Router } from 'express';
import { concatPaths } from '../helper'
import { TariffsContoller } from '../controllers/tariffsController'

export default (prefix: string, router: Router): void => {
    router.get(concatPaths(prefix, '/'), TariffsContoller.getAll);
}