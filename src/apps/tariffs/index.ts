import { Router } from "express";
import { concatPaths } from "../../helper";
import { TariffsController } from "./controller";
import { TariffsService } from "./service";

export function tariffsRoute(prefix: string, router: Router): void {
    router.get(
        concatPaths(prefix, ''),
        TariffsController(undefined, TariffsService.getTariffs)
    )
};