import { Router } from 'express';
import { concatPaths } from '../helper'

export default (prefix: string, router: Router): void => {
    router.get(concatPaths(prefix, 'sign-up'), async (req, res) => { res.send({ msg: 'Hello world!' }) })
    router.get(concatPaths(prefix, 'sign-in'), async (req, res) => { res.send({ msg: 'Hello world!' }) })
}