import { JwtPayload } from 'jsonwebtoken';
import { Request } from "express";


declare module "express" {
    interface Request {
        user: JwtPayload;
    }
}

interface MulterFileWithPreview extends Express.Multer.File {
    preview_url?: string;
}
