import { Router } from "express";
import { concatPaths } from "../../helper";

import adminRoute from './apps/routes'

export function adminRoutes(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {

    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    router.use(concatPaths(prefix), adminRoute())
}