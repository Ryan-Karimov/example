import multer from 'multer';

import { MinioStorage } from '../minio/server';

export function UploadFileHandler(bucketName: string, allowedTypes: Array<string>): multer.Multer {
    return multer({
        storage: new MinioStorage(bucketName),
        fileFilter: (_req, file, cb: multer.FileFilterCallback) => {
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                _req.body.image = null
                cb(null, false);
            }
        }
    });
}
