import { Router } from "express";
import { concatPaths, Controller } from "../../helper";
import { TariffsService } from "./service";

export function tariffsRoute(prefix: string, router: Router, ...middlewares: Array<CallableFunction>): void {
    /**
     * @Registration_Endpoint_Without_Middleware
    */
    router.get(
        concatPaths(prefix, ''),
        Controller(TariffsService.getTariffs));

    /**
     * @Registration_Middlewares
     */
    if (middlewares.length !== 0) router.use(concatPaths(prefix), middlewares.map((middleware) => middleware()))

    /**
     * @Registration_Endpoints
    */
};