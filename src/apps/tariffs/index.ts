import { Router } from "express";
import { concatPaths, Controller } from "../../helper";
import { TariffsService } from "./service";

export function tariffsRoute(prefix: string, router: Router): void {
    router.get(
        concatPaths(prefix, ''),
        Controller(TariffsService.getTariffs, undefined)
    )
};