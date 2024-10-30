import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs'


export class ProfileController {
    static async uploadImage(req: Request, res: Response, next: NextFunction) {
        try {
            const image = req.file as Express.Multer.File;
            const { phone } = req.body;
            console.log(phone);
            if (!image) {
                res.status(400).json({ message: 'No image file uploaded' });
                return;
            }

            const uploadPath = path.join('static', 'profileImages');
            if (!await fs.promises.access(uploadPath).catch(() => true)) {
                await fs.promises.mkdir(uploadPath, { recursive: true });
            }

            const filePath = path.join('profileImages', image.filename).replace(/\\/g, '/');



            res.status(200).json({
                message: 'Image uploaded successfully',
                filePath: filePath
            });
        } catch (error) {
            next(error)
        }
    }
}