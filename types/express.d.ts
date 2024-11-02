import { JwtPayload } from 'jsonwebtoken';
import { Request } from "express";


declare module "express" {
    interface Request {
        user: JwtPayload;
    }
}
