import { JwtPayload } from 'jsonwebtoken';
import express from 'express';

declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
            files?: Express.Multer.File[];
            user?: JwtPayload | null; // Set to null if user can be undefined
        }
    }
}
