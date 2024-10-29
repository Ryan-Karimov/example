import { Request, Response, NextFunction } from 'express';



export class ProfileController {
    static async uploadImage(req: Request, res: Response, next: NextFunction) {
        try {
            const image = req.file;

            console.log(req);
            if (!image) {
                res.status(400).json({ message: 'No image file uploaded' });
                return;
            }

            res.status(200).json({
                message: 'Image uploaded successfully'
            });
        } catch (error) {
            next(error)
        }
    }
}